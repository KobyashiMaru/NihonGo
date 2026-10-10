import React from 'react';
import { Lightbulb, Volume2, Eye, Sparkles } from 'lucide-react';
import { KanaCard, KanaScript, getKanaCard, toHiragana } from '../../data/kanaFlashcardData';
import { speechService } from '../../services/speechService';

// Highlights every occurrence of the studied kana inside an example word
export const HighlightedWord: React.FC<{ text: string; targets: string[]; className?: string }> = ({ text, targets, className }) => (
  <span className={className}>
    {[...text].map((ch, i) =>
      targets.includes(ch) ? (
        <span key={i} className="text-amber-300 underline decoration-amber-400/60 underline-offset-4">{ch}</span>
      ) : (
        <span key={i}>{ch}</span>
      )
    )}
  </span>
);

interface KanaCardDetailsProps {
  card: KanaCard;
  script: KanaScript;
}

// Memory aids shown on the back of a card: origin, example word, notes and look-alikes
export const KanaCardDetails: React.FC<KanaCardDetailsProps> = ({ card, script }) => {
  const isHandakuten = card.key.normalize('NFD')[1] === '゚';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
      {/* Origin or dakuten explanation */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          {card.base ? '怎麼變出來的' : '字源記憶法'}
        </div>
        {card.base ? (
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-black text-white">{card.base}</span>
            <span className="text-slate-500">+</span>
            <span className="text-3xl font-black text-sky-300">{isHandakuten ? '゜' : '゛'}</span>
            <span className="text-slate-500">→</span>
            <span className="text-3xl font-black text-amber-300">{card.char}</span>
          </div>
        ) : card.origin ? (
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-black text-slate-200">{card.origin.kanji}</span>
            <span className="text-slate-500">→</span>
            <span className="text-3xl font-black text-amber-300">{card.char}</span>
          </div>
        ) : null}
        <p className="text-sm text-slate-200 mt-2 leading-relaxed">
          {card.base
            ? `在「${card.base}」右上角加上${isHandakuten ? '小圈圈（半濁音）' : '兩點（濁音）'}，讀音變成 ${card.romaji}。`
            : card.origin?.hint}
        </p>
        {!card.base && (
          <p className="text-[11px] text-slate-500 mt-1">
            {script === 'hiragana' ? '平假名取自漢字圓潤的草書全貌' : '片假名取自漢字方正的楷書偏旁或局部筆畫'}
          </p>
        )}
        {card.otherOrigin && (
          <div className="mt-3 pt-2.5 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
            <span className="text-slate-500">{script === 'hiragana' ? '片假名' : '平假名'}</span>
            <span className="text-base font-bold text-slate-200 mx-1.5">{card.otherChar}</span>
            ← {card.otherOrigin.kanji}：{card.otherOrigin.hint}
          </div>
        )}
      </div>

      {/* Example word */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">例字</span>
          <button
            onClick={() => speechService.speak(card.example.word)}
            className="p-1 rounded-md hover:bg-slate-800 text-sky-400"
            title="聽例字發音"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <HighlightedWord text={card.example.word} targets={[card.char, card.key]} className="text-2xl font-bold text-white tracking-wide" />
        <div className="text-xs font-mono text-slate-400 mt-1">{card.example.romaji}</div>
        <div className="text-sm text-slate-300 mt-1">
          {card.example.meaning}
          {card.example.written && card.example.written !== card.example.word && (
            <span className="text-slate-500 ml-2">（{card.example.written}）</span>
          )}
        </div>
      </div>

      {/* Pronunciation / typing note */}
      {card.note && (
        <div className="sm:col-span-2 flex items-start space-x-2 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-3">
          <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-200/90 leading-relaxed">{card.note}</p>
        </div>
      )}

      {/* Look-alike characters */}
      {card.confusables.map((set, i) => (
        <div key={i} className="sm:col-span-2 bg-rose-950/20 border border-rose-900/40 rounded-2xl p-3">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-rose-300 mb-2">
            <Eye className="w-3.5 h-3.5" />
            <span>小心長得很像的字</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {set.chars.map(ch => {
              const other = getKanaCard(toHiragana(ch), script);
              const isSelf = ch === card.char;
              return (
                <button
                  key={ch}
                  onClick={() => speechService.speak(other.key)}
                  className={`w-14 rounded-xl border py-1.5 text-center transition-colors ${
                    isSelf ? 'bg-amber-500/15 border-amber-500/60' : 'bg-slate-950/70 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className={`text-2xl font-black ${isSelf ? 'text-amber-300' : 'text-white'}`}>{ch}</div>
                  <div className="text-[10px] font-mono text-slate-400">{other.romaji}</div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-rose-100/80 leading-relaxed">{set.tip}</p>
        </div>
      ))}

      {/* Hiragana / katakana pair */}
      <div className="sm:col-span-2 flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-400">
        <span className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {script === 'hiragana' ? '對應片假名' : '對應平假名'}：
            <span className="text-lg font-bold text-slate-200 ml-1">{card.otherChar}</span>
          </span>
        </span>
        {card.lookalike && <span className="text-indigo-300">跟平假名「{card.lookalike}」長得很像，一起記更輕鬆！</span>}
      </div>
    </div>
  );
};
