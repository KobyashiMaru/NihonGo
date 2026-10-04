import React, { useState, useEffect, useRef } from 'react';
import { CONVERSATION_SCENARIOS } from '../../data/conversationScenarios';
import { CallScenario, DialogueNode, ChatMessage, UserProgress } from '../../types';
import { soundEffects } from '../../services/soundEffects';
import { speechService, furiganaToKana, getRecognitionBlocker } from '../../services/speechService';
import { useLocalModelStatus, describeModelStatus } from '../../services/localSpeechRecognizer';
import confetti from 'canvas-confetti';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  Camera, 
  CameraOff, 
  Sparkles, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface VideoCallScreenProps {
  onEarnXP: (amount: number) => void;
  settings: UserProgress['settings'];
}

type CallState = 'scenario-select' | 'incoming' | 'in-call' | 'summary';
type SuggestedResponse = DialogueNode['suggestedResponses'][number];

// Minimum similarity (0-100) for a spoken reply to count as one of the suggested answers
const SPOKEN_MATCH_THRESHOLD = 60;
const CALL_COMPLETE_BONUS_XP = 40;

export const VideoCallScreen: React.FC<VideoCallScreenProps> = ({ onEarnXP, settings }) => {
  const [callState, setCallState] = useState<CallState>('scenario-select');
  const [selectedScenario, setSelectedScenario] = useState<CallScenario>(CONVERSATION_SCENARIOS[0]);
  const [currentNode, setCurrentNode] = useState<DialogueNode | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Call controls
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // Released the button; waiting for the recognizer's final result
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [micMessage, setMicMessage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(settings.speechRate);
  const [showFurigana, setShowFurigana] = useState(settings.showFurigana);
  const [showRomaji, setShowRomaji] = useState(settings.showRomaji);
  const [showTranslation, setShowTranslation] = useState(settings.showTranslation);
  const [showHints, setShowHints] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [spokenScores, setSpokenScores] = useState<number[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const pendingTimeoutsRef = useRef<number[]>([]);
  // Mirrors earnedXP so delayed callbacks never read a stale total
  const earnedXPRef = useRef(0);
  // True while a reply is being processed, so double clicks / late speech cannot skip a turn
  const isAdvancingRef = useRef(false);
  // Push-to-talk: idle → holding (mic open) → finishing (waiting for the final transcript)
  const pttStateRef = useRef<'idle' | 'holding' | 'finishing'>('idle');
  const transcriptRef = useRef('');

  // setTimeout that is cancelled automatically when the call ends
  const schedule = (fn: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      pendingTimeoutsRef.current = pendingTimeoutsRef.current.filter(t => t !== id);
      fn();
    }, delay);
    pendingTimeoutsRef.current.push(id);
  };

  const clearPendingTimeouts = () => {
    pendingTimeoutsRef.current.forEach(id => clearTimeout(id));
    pendingTimeoutsRef.current = [];
  };

  // Clean up audio, mic & camera on unmount
  useEffect(() => {
    const pendingTimeouts = pendingTimeoutsRef;
    const mediaStream = mediaStreamRef;
    return () => {
      soundEffects.stopIncomingRing();
      speechService.stopSpeaking();
      speechService.abortListening();
      pendingTimeouts.current.forEach(id => clearTimeout(id));
      mediaStream.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Timer for call duration
  useEffect(() => {
    if (callState !== 'in-call') return;
    const timer = window.setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callState]);

  // The <video> element only mounts once cameraActive is true, so attach the stream afterwards
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [cameraActive]);

  const resetCallProgress = () => {
    clearPendingTimeouts();
    earnedXPRef.current = 0;
    isAdvancingRef.current = false;
    pttStateRef.current = 'idle';
    setCallDuration(0);
    setEarnedXP(0);
    setSpokenScores([]);
    setRecognizedText('');
    setMicMessage(null);
  };

  // Handle incoming call ringtone
  const startCallFlow = (scenario: CallScenario) => {
    setSelectedScenario(scenario);
    setCallState('incoming');
    resetCallProgress();
    soundEffects.startIncomingRing();
  };

  const acceptCall = () => {
    soundEffects.playPickup();
    // Brave & co. use the in-page model: start loading it before the first answer
    speechService.prepareRecognition();
    setCallState('in-call');
    
    // Start initial node
    const startNode = selectedScenario.nodes[selectedScenario.startNodeId];
    setCurrentNode(startNode);
    setMessages([
      {
        id: 'msg-start',
        sender: 'tutor',
        japanese: startNode.tutorSpeech,
        furigana: startNode.tutorFurigana,
        romaji: startNode.tutorRomaji,
        translation: startNode.tutorTranslation,
        timestamp: Date.now()
      }
    ]);

    // Speak initial sentence
    speakTutorText(startNode.tutorSpeech);
  };

  const declineOrHangUp = () => {
    clearPendingTimeouts();
    soundEffects.playHangup();
    speechService.stopSpeaking();
    speechService.abortListening();
    pttStateRef.current = 'idle';
    setIsListening(false);
    setIsProcessing(false);
    setIsSpeaking(false);
    stopCamera();

    if (callState === 'in-call') {
      setCallState('summary');
      soundEffects.playVictory();
      onEarnXP(earnedXPRef.current + CALL_COMPLETE_BONUS_XP);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      setCallState('scenario-select');
    }
  };

  const speakTutorText = (text: string, rate: number = speechRate) => {
    setIsSpeaking(true);
    speechService.speak(text, {
      rate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  // User answers with one of the suggested responses (clicked or spoken)
  const handleUserSelectResponse = (resp: SuggestedResponse, spokenScore?: number) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    soundEffects.playCorrect();
    earnedXPRef.current += resp.xp;
    setEarnedXP(earnedXPRef.current);
    if (spokenScore !== undefined) {
      setSpokenScores(prev => [...prev, spokenScore]);
    }
    setMicMessage(null);

    // Add user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      japanese: resp.japanese,
      furigana: resp.furigana,
      romaji: resp.romaji,
      translation: resp.meaning,
      timestamp: Date.now(),
      score: spokenScore
    };

    setMessages(prev => [...prev, userMsg]);

    // Check if next node is call complete
    if (resp.nextNodeId === 'call_complete') {
      schedule(declineOrHangUp, 1500);
      return;
    }

    // Advance tutor to next node
    const nextNode = selectedScenario.nodes[resp.nextNodeId];
    if (!nextNode) {
      isAdvancingRef.current = false;
      return;
    }

    setCurrentNode(nextNode);
    schedule(() => {
      const tutorMsg: ChatMessage = {
        id: `tut-${Date.now()}`,
        sender: 'tutor',
        japanese: nextNode.tutorSpeech,
        furigana: nextNode.tutorFurigana,
        romaji: nextNode.tutorRomaji,
        translation: nextNode.tutorTranslation,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, tutorMsg]);
      setRecognizedText('');
      speakTutorText(nextNode.tutorSpeech);
      isAdvancingRef.current = false;
    }, 800);
  };

  // Toggle user camera
  const toggleCamera = async () => {
    if (cameraActive) {
      stopCamera();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaStreamRef.current = stream;
        setCameraActive(true);
      } catch {
        alert('無法啟用相機鏡頭（可能是權限被拒絕）。您仍可以繼續語音視訊通話！');
      }
    }
  };

  function stopCamera() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }

  // Pick the suggested response closest to what the user said
  const evaluateSpokenReply = (node: DialogueNode, text: string) => {
    if (!text.trim()) {
      setMicMessage('沒有聽到你的聲音：請「按住」按鈕不放，說完整句後再放開。');
      return;
    }

    let best: SuggestedResponse | null = null;
    let bestScore = 0;
    for (const resp of node.suggestedResponses) {
      const score = speechService.matchScore(text, [resp.japanese, furiganaToKana(resp.furigana)]);
      if (score > bestScore) {
        best = resp;
        bestScore = score;
      }
    }

    if (best && bestScore >= SPOKEN_MATCH_THRESHOLD) {
      handleUserSelectResponse(best, bestScore);
    } else {
      soundEffects.playWrong();
      setMicMessage('和提示中的回答差距有點大，再說一次看看，或參考下方的救急錦囊！');
    }
  };

  // Push-to-talk: the mic stays open while the button (or Space) is held down
  const startTalking = () => {
    if (pttStateRef.current !== 'idle' || isAdvancingRef.current || !currentNode) return;
    const node = currentNode;
    let failed = false;

    // Stop Sakura mid-sentence so her voice is not picked up by the microphone
    speechService.stopSpeaking();
    setIsSpeaking(false);
    transcriptRef.current = '';
    setRecognizedText('');
    setMicMessage(null);

    const ok = speechService.startListening(
      {
        onResult: (text) => {
          transcriptRef.current = text;
          setRecognizedText(text);
        },
        onError: (message) => {
          failed = true;
          setMicMessage(message);
        },
        onEnd: () => {
          pttStateRef.current = 'idle';
          setIsListening(false);
          setIsProcessing(false);
          if (!failed) evaluateSpokenReply(node, transcriptRef.current);
        }
      },
      { continuous: true }
    );

    pttStateRef.current = ok ? 'holding' : 'idle';
    setIsListening(ok);
  };

  const stopTalking = () => {
    if (pttStateRef.current !== 'holding') return;
    pttStateRef.current = 'finishing';
    setIsProcessing(true);
    // The final transcript arrives asynchronously, then onEnd evaluates it
    speechService.stopListening();
  };

  // Holding the Space bar works as push-to-talk too
  const pttHandlersRef = useRef({ start: startTalking, stop: stopTalking });
  useEffect(() => {
    pttHandlersRef.current = { start: startTalking, stop: stopTalking };
  });

  useEffect(() => {
    if (callState !== 'in-call') return;

    const isTypingTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || isTypingTarget(e.target)) return;
      e.preventDefault();
      if (!e.repeat) pttHandlersRef.current.start();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || isTypingTarget(e.target)) return;
      e.preventDefault();
      pttHandlersRef.current.stop();
    };
    // Releasing the key in another window never fires keyup here
    const handleBlur = () => pttHandlersRef.current.stop();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [callState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const recognitionBlocker = getRecognitionBlocker();
  const modelStatus = useLocalModelStatus();
  const usesLocalRecognition = speechService.usesLocalRecognition();
  const modelNotice = usesLocalRecognition ? describeModelStatus(modelStatus) : null;

  const averageSpokenScore = spokenScores.length
    ? Math.round(spokenScores.reduce((sum, s) => sum + s, 0) / spokenScores.length)
    : null;

  // SCENARIO SELECTOR VIEW
  if (callState === 'scenario-select') {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/60 border border-rose-800/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-semibold text-rose-300">
              <Phone className="w-3.5 h-3.5" />
              <span>Duolingo 式擬真視訊互動會話</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              AI 視訊通話：<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">真正開口說日語</span>
            </h2>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              像打 FaceTime 一樣與日本 AI 虛擬夥伴面對面！提供救急錦囊（提示回答）、振假名、羅馬字與中文即時輔助，零基礎也能放心開口！
            </p>
          </div>

          <div className="flex-shrink-0 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
            <div className="text-xs text-slate-400">目前通話搭檔</div>
            <div className="text-lg font-bold text-rose-300">さくら (Sakura)</div>
            <div className="text-xs text-slate-500">東京大學生・熱情親切</div>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONVERSATION_SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all group shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-2.5 py-1 rounded-full border border-rose-500/30">
                    {scenario.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold">
                    {scenario.level}・{scenario.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{scenario.titleJa}</p>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">{scenario.description}</p>

                {/* Vocabulary pills */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">核心詞彙搶先看</div>
                  <div className="flex flex-wrap gap-1.5">
                    {scenario.keyVocabulary.slice(0, 3).map((v, i) => (
                      <span key={i} className="text-xs bg-slate-950/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800">
                        {v.word} ({v.meaning})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => startCallFlow(scenario)}
                className="mt-6 w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center space-x-2 group-hover:scale-[1.02]"
              >
                <Phone className="w-4 h-4" />
                <span>撥打視訊電話給 {scenario.tutorName.split(' ')[0]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // INCOMING CALL SCREEN VIEW
  if (callState === 'incoming') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-8 shadow-2xl relative overflow-hidden">
          {/* Pulsing incoming call waves */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full bg-rose-500/10 animate-ping" />
            <div className="w-80 h-80 rounded-full bg-pink-500/5 animate-pulse" />
          </div>

          <div className="relative z-10 space-y-4">
            <span className="inline-block bg-rose-500/20 text-rose-300 text-xs px-3 py-1 rounded-full font-bold border border-rose-500/30 animate-bounce">
              📞 日語 FaceTime 來電中...
            </span>

            {/* Avatar */}
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-1.5 shadow-2xl shadow-rose-500/40">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <svg className="w-24 h-24 text-rose-300" viewBox="0 0 100 100" fill="currentColor">
                  {/* Stylized Anime Sakura avatar */}
                  <circle cx="50" cy="45" r="28" fill="#fbcfe8" />
                  {/* Hair */}
                  <path d="M22 42 C20 18, 80 18, 78 42 C72 26, 28 26, 22 42" fill="#be185d" />
                  <path d="M22 42 C20 60, 26 70, 30 75 C24 60, 24 45, 22 42" fill="#be185d" />
                  <path d="M78 42 C80 60, 74 70, 70 75 C76 60, 76 45, 78 42" fill="#be185d" />
                  {/* Eyes */}
                  <ellipse cx="40" cy="44" rx="3.5" ry="5" fill="#4c0519" />
                  <ellipse cx="60" cy="44" rx="3.5" ry="5" fill="#4c0519" />
                  {/* Blush */}
                  <ellipse cx="34" cy="52" rx="4" ry="2" fill="#fda4af" opacity="0.8" />
                  <ellipse cx="66" cy="52" rx="4" ry="2" fill="#fda4af" opacity="0.8" />
                  {/* Smile */}
                  <path d="M44 54 Q50 60 56 54" stroke="#4c0519" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">{selectedScenario.tutorName}</h3>
              <p className="text-sm text-rose-300 font-medium">{selectedScenario.tutorRole}</p>
              <p className="text-xs text-slate-400 mt-1">情境：{selectedScenario.title}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex items-center justify-center space-x-12 pt-4">
            {/* Decline */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={declineOrHangUp}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-transform active:scale-95"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <span className="text-xs text-slate-400">拒絕</span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={acceptCall}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-transform active:scale-95 animate-pulse"
              >
                <Phone className="w-7 h-7 fill-slate-950" />
              </button>
              <span className="text-xs text-emerald-400 font-bold">接聽視訊</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE IN-CALL SCREEN VIEW (FACETIME / DUOLINGO STYLE)
  if (callState === 'in-call') {
    return (
      <div className="max-w-5xl mx-auto space-y-4 pb-12">
        {/* Main Video Call Frame */}
        <div className="bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl relative flex flex-col h-[680px]">
          {/* Top Floating Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-slate-950/80 to-transparent p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-white">{selectedScenario.tutorName}</span>
              <span className="text-xs text-slate-400 font-mono">({formatTime(callDuration)})</span>
            </div>

            {/* Quick Assist Toggles */}
            <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-slate-800">
              <button
                onClick={() => setShowFurigana(prev => !prev)}
                className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
                  showFurigana ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="振假名（讀音）標註開關"
              >
                假名
              </button>
              <button
                onClick={() => setShowRomaji(prev => !prev)}
                className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
                  showRomaji ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="羅馬字拼音開關"
              >
                羅馬
              </button>
              <button
                onClick={() => setShowTranslation(prev => !prev)}
                className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
                  showTranslation ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="中文翻譯開關"
              >
                翻譯
              </button>
            </div>
          </div>

          {/* User Camera PiP (Picture in Picture) in top-right */}
          <div className="absolute top-16 right-4 z-20 w-32 sm:w-40 h-44 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-xl flex flex-col items-center justify-center">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="text-center p-2 space-y-1">
                <CameraOff className="w-6 h-6 text-slate-500 mx-auto" />
                <span className="text-[10px] text-slate-400 block font-sans">相機鏡頭關閉</span>
              </div>
            )}
            <button
              onClick={toggleCamera}
              className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-white hover:bg-slate-800 text-[10px] flex items-center space-x-1"
            >
              <Camera className="w-3 h-3" />
              <span>{cameraActive ? '關閉' : '開鏡頭'}</span>
            </button>
          </div>

          {/* Center Stage: Animated 2D Avatar (Sakura / Kenji) */}
          <div className="flex-1 flex flex-col items-center justify-center relative p-6">
            <div className="relative">
              {/* Voice Wave Rings when speaking */}
              {isSpeaking && (
                <div className="absolute -inset-4 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
              )}

              {/* Character Avatar Canvas/SVG */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-rose-900/60 to-pink-900/40 border-4 border-rose-500/40 p-2 shadow-2xl flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  {/* Face */}
                  <circle cx="60" cy="55" r="35" fill="#fbcfe8" />
                  {/* Hair */}
                  <path d="M25 50 C24 20, 96 20, 95 50 C88 30, 32 30, 25 50" fill="#be185d" />
                  <path d="M25 50 C23 75, 30 85, 35 90 C28 75, 27 55, 25 50" fill="#be185d" />
                  <path d="M95 50 C97 75, 90 85, 85 90 C92 75, 93 55, 95 50" fill="#be185d" />
                  {/* Eyes (Blinks occasionally) */}
                  <ellipse cx="48" cy="54" rx="4" ry="5.5" fill="#4c0519" />
                  <circle cx="46.5" cy="52" r="1.5" fill="white" />
                  <ellipse cx="72" cy="54" rx="4" ry="5.5" fill="#4c0519" />
                  <circle cx="70.5" cy="52" r="1.5" fill="white" />
                  {/* Cheeks */}
                  <ellipse cx="40" cy="62" rx="4.5" ry="2.5" fill="#fda4af" opacity="0.8" />
                  <ellipse cx="80" cy="62" rx="4.5" ry="2.5" fill="#fda4af" opacity="0.8" />
                  
                  {/* Mouth (Animates when tutor speaks!) */}
                  {isSpeaking ? (
                    <ellipse cx="60" cy="66" rx="5" ry="7" fill="#be123c" className="animate-pulse" />
                  ) : (
                    <path d="M53 66 Q60 72 67 66" stroke="#4c0519" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  )}
                </svg>
              </div>

              {/* Speaking Voice Wave Indicator */}
              {isSpeaking && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1 bg-slate-900/90 border border-rose-500/50 px-3 py-1 rounded-full shadow-lg">
                  <div className="w-1 h-3 bg-rose-400 rounded-full animate-wave-1" />
                  <div className="w-1 h-4 bg-rose-400 rounded-full animate-wave-2" />
                  <div className="w-1 h-5 bg-rose-400 rounded-full animate-wave-3" />
                  <div className="w-1 h-4 bg-rose-400 rounded-full animate-wave-4" />
                  <div className="w-1 h-3 bg-rose-400 rounded-full animate-wave-5" />
                  <span className="text-[10px] text-rose-300 font-bold ml-1.5">說話中...</span>
                </div>
              )}
            </div>

            {/* Live Subtitle Box for Tutor */}
            {currentNode && (
              <div className="mt-8 max-w-xl w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-center space-y-2 shadow-xl">
                {/* Japanese with Furigana */}
                <div 
                  className="text-lg sm:text-xl font-bold text-white leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: showFurigana ? currentNode.tutorFurigana : currentNode.tutorSpeech
                  }}
                />

                {/* Romaji */}
                {showRomaji && (
                  <div className="text-xs text-amber-300/90 font-mono">
                    {currentNode.tutorRomaji}
                  </div>
                )}

                {/* Translation */}
                {showTranslation && (
                  <div className="text-xs text-slate-400 font-sans">
                    💡 {currentNode.tutorTranslation}
                  </div>
                )}

                {/* Replay speech button */}
                <div className="pt-1 flex items-center justify-center space-x-3 text-xs text-slate-500">
                  <button
                    onClick={() => speakTutorText(currentNode.tutorSpeech)}
                    className="hover:text-rose-400 flex items-center space-x-1 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>再聽一次</span>
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      const next = speechRate < 1 ? 1.0 : 0.8;
                      setSpeechRate(next);
                      speakTutorText(currentNode.tutorSpeech, next);
                    }}
                    className="hover:text-rose-400 transition-colors"
                  >
                    語速: {speechRate < 1 ? `慢速 (${speechRate}x)` : `標準 (${speechRate}x)`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4">
            {/* Live transcript & mic feedback */}
            <div className="max-w-xl mx-auto mb-3 min-h-[2.5rem] text-center space-y-1" aria-live="polite">
              {isListening || recognizedText ? (
                <div className="text-sm text-white">
                  <span className="text-xs text-slate-400 mr-1">你說：</span>
                  {recognizedText || (
                    <span className="text-slate-500">{isProcessing ? '（辨識中…）' : '（正在聆聽…）'}</span>
                  )}
                </div>
              ) : (
                !micMessage && (
                  recognitionBlocker ? (
                    <div className="text-xs text-amber-300">{recognitionBlocker}</div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      按住「按住說話」按鈕（或空白鍵）開口說日語，說完再放開。
                      {usesLocalRecognition && '（離線辨識：放開後需要幾秒鐘辨識）'}
                    </div>
                  )
                )
              )}
              {modelNotice && <div className="text-xs text-sky-300">{modelNotice}</div>}
              {micMessage && <div className="text-xs text-amber-300">{micMessage}</div>}
            </div>

            <div className="max-w-xl mx-auto flex items-center justify-between">
              {/* Hint Cheat-Sheet Button */}
              <button
                onClick={() => setShowHints(prev => !prev)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2 ${
                  showHints
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>救急錦囊 (回話提示)</span>
              </button>

              {/* Mic Speaking Action (push-to-talk: hold to record, release to send) */}
              <button
                type="button"
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  e.preventDefault();
                  // Keep receiving pointerup even if the finger/cursor slides off the button
                  e.currentTarget.setPointerCapture(e.pointerId);
                  startTalking();
                }}
                onPointerUp={stopTalking}
                onPointerCancel={stopTalking}
                onLostPointerCapture={stopTalking}
                onContextMenu={(e) => e.preventDefault()}
                className={`select-none touch-none px-6 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center space-x-2 transition-all transform active:scale-95 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40 scale-95'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                }`}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
                <span>{isProcessing ? '辨識中…' : isListening ? '聆聽中…放開送出' : '按住說話'}</span>
              </button>

              {/* Hangup */}
              <button
                onClick={declineOrHangUp}
                className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
                title="結束通話"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cheat-Sheet / Suggested Responses (救急錦囊) */}
        {showHints && currentNode && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>初學者救急錦囊：你可以這樣回答 Sakura（點擊選項，或按住麥克風唸給她聽）：</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">點擊任一選項即可練習回答</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentNode.suggestedResponses.map((resp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (pttStateRef.current === 'idle') handleUserSelectResponse(resp);
                  }}
                  className="bg-slate-950/70 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/60 rounded-2xl p-4 text-left transition-all group space-y-1.5 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      選項 {idx + 1}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold">+{resp.xp} XP</span>
                  </div>

                  <div 
                    className="text-base font-bold text-white group-hover:text-rose-300 transition-colors"
                    dangerouslySetInnerHTML={{
                      __html: showFurigana ? resp.furigana : resp.japanese
                    }}
                  />

                  {showRomaji && (
                    <div className="text-[11px] text-amber-300/80 font-mono">{resp.romaji}</div>
                  )}

                  <div className="text-xs text-slate-400">{resp.meaning}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // CALL SUMMARY VIEW
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-amber-400 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-rose-500/30">
          <Phone className="w-10 h-10 text-slate-950" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
            通話圓滿完成！
          </span>
          <h2 className="text-3xl font-black text-white">日語視訊通話學習回顧</h2>
          <p className="text-slate-400 text-sm">
            你與 {selectedScenario.tutorName} 進行了一場流暢的對話，口語經驗值大幅提升！
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono">
          <div>
            <div className="text-xs text-slate-500">通話時長</div>
            <div className="text-lg font-bold text-white mt-1">{formatTime(callDuration)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">獲得經驗值</div>
            <div className="text-lg font-bold text-amber-400 mt-1">+{earnedXP + CALL_COMPLETE_BONUS_XP} XP</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">口說相似度</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              {averageSpokenScore !== null ? `${averageSpokenScore} 分` : '—'}
            </div>
            {averageSpokenScore === null && (
              <div className="text-[10px] text-slate-500 mt-0.5">本次未使用語音回答</div>
            )}
          </div>
        </div>

        {/* Key Vocabulary Learned */}
        <div className="space-y-2 text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="text-xs font-bold text-rose-300 flex items-center space-x-1.5 uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>本次通話學到的高頻實用詞彙</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {selectedScenario.keyVocabulary.map((v, i) => (
              <div key={i} className="text-xs bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="font-bold text-white">{v.word}</span>
                <span className="text-slate-400 ml-1">({v.reading})</span>
                <p className="text-slate-400 text-[11px] mt-0.5">{v.meaning}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCallState('scenario-select')}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-rose-500/25 transition-all"
        >
          返回情境列表
        </button>
      </div>
    </div>
  );
};
