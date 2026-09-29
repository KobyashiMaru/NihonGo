// JLPT Roadmap Curriculum (Zero -> N5 -> N4 -> N3 -> N2)

export interface JLPTStage {
  id: string;
  level: string;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  unlocked: boolean;
  requiredXp: number;
  totalLessons: number;
  completedLessons: number;
  grammarFocus: string[];
  vocabularyCount: number;
  recommendedFor: string;
  modules: {
    id: string;
    title: string;
    type: 'keyboard' | 'conversation' | 'grammar' | 'skills' | 'exam';
    desc: string;
    xpReward: number;
  }[];
}

export const JLPT_STAGES: JLPTStage[] = [
  {
    id: 'stage-0',
    level: '入門基礎',
    name: '五十音與 Mac 日式鍵盤特訓',
    subtitle: '零基礎啟航・熟悉你的 JIS 巧控鍵盤',
    icon: 'Keyboard',
    description: '掌握平假名、片假名、濁音與拗音，學會使用 Mac JIS 鍵盤的「英数」與「かな」鍵光速盲打。',
    unlocked: true,
    requiredXp: 0,
    totalLessons: 4,
    completedLessons: 0,
    vocabularyCount: 80,
    recommendedFor: '完全不會日文、剛拿到日式鍵盤的初學者',
    grammarFocus: ['羅馬字拼音對照', 'Mac 英数/かな切換', '清音・濁音・半濁音', '促音與長音輸入'],
    modules: [
      { id: 'm0-1', title: '圖解 Mac 日式巧控鍵盤新手課', type: 'keyboard', desc: '認識英数、かな、大倒L Return、@ 與 ¥ 鍵位', xpReward: 50 },
      { id: 'm0-2', title: '五十音平假名打字入門', type: 'keyboard', desc: 'あいうえお基礎打字練習與發音', xpReward: 50 },
      { id: 'm0-3', title: '片假名與外來語辨識', type: 'skills', desc: 'コーヒー、パソコン等片假名生活詞彙', xpReward: 50 },
      { id: 'm0-4', title: 'JIS 鍵盤漢字變換大考驗', type: 'keyboard', desc: '練習輸入假名後按空白鍵選漢字並按 Return 確認', xpReward: 80 }
    ]
  },
  {
    id: 'stage-n5',
    level: 'JLPT N5',
    name: '基礎日常生存生活日語',
    subtitle: '開口說日語・日本旅遊自由行必備',
    icon: 'Coffee',
    description: '學會基本生活寒暄、自我介紹、問路、餐廳點餐、購物結帳與時間表達，掌握核心助詞（は、が、を、に、で、へ）。',
    unlocked: true,
    requiredXp: 150,
    totalLessons: 5,
    completedLessons: 0,
    vocabularyCount: 800,
    recommendedFor: '準備去日本旅遊、想與日本人簡單交流',
    grammarFocus: ['～です / ～ます 禮貌形', '基礎助詞（は・が・を・に・で・へ）', '動詞「て形」與請求句型', '形容詞 い / な 變化'],
    modules: [
      { id: 'mn5-1', title: 'AI 視訊：初次見面自我介紹', type: 'conversation', desc: '與 Sakura 視訊電話練習自介', xpReward: 60 },
      { id: 'mn5-2', title: 'AI 視訊：東京咖啡廳點餐', type: 'conversation', desc: '點冰咖啡、選尺寸與內用外帶', xpReward: 60 },
      { id: 'mn5-3', title: 'AI 視訊：便利商店生存話術', type: 'conversation', desc: '微波便當、要不要購物袋與熱食點餐', xpReward: 60 },
      { id: 'mn5-4', title: '聽說讀寫綜合模擬測驗', type: 'skills', desc: 'N5 聽力與閱讀小測驗', xpReward: 100 }
    ]
  },
  {
    id: 'stage-n4',
    level: 'JLPT N4',
    name: '日常生活進階交流與溝通',
    subtitle: '理解日常短句・掌握口語簡體',
    icon: 'MessageSquareText',
    description: '能聽懂日常慢速會話，靈活運用動詞過去式、否定式、普通體（タメ口）、授受動詞（あげる・もらう）與願望表達。',
    unlocked: false,
    requiredXp: 500,
    totalLessons: 6,
    completedLessons: 0,
    vocabularyCount: 1500,
    recommendedFor: '目標前往日本短期留學、工作打工度假',
    grammarFocus: ['普通體（簡體口語）', '動詞可能形（會做某事）', '動詞意向形與願望', '授受動詞（あげる／くれる／もらう）'],
    modules: [
      { id: 'mn4-1', title: 'AI 視訊：日本居酒屋聚會聊天', type: 'conversation', desc: '與朋友用口語分享週末活動', xpReward: 80 },
      { id: 'mn4-2', title: '動詞變化特訓（可能形與假定形）', type: 'grammar', desc: '會說日語、如果下雨的話等條件表達', xpReward: 80 },
      { id: 'mn4-3', title: '日本車站與飯店入住實景對話', type: 'conversation', desc: '退房寄存行李與詢問末班車', xpReward: 90 },
      { id: 'mn4-4', title: 'N4 模擬檢定聽讀闖關', type: 'exam', desc: 'JLPT N4 題型全真模擬', xpReward: 150 }
    ]
  },
  {
    id: 'stage-n3',
    level: 'JLPT N3',
    name: '中級過渡・自然流暢日常會話',
    subtitle: '聽得懂廣播・能看懂簡單新聞',
    icon: 'Flame',
    description: '日語學習的重要分水嶺！能理解特定場景下自然語速的日語，看懂稍具難度的文章摘要，掌握複句連接詞與細膩情感表達。',
    unlocked: false,
    requiredXp: 1200,
    totalLessons: 8,
    completedLessons: 0,
    vocabularyCount: 3000,
    recommendedFor: '目標獲得日本工作簽證、留學申請標準門檻',
    grammarFocus: ['～わけだ / ～はずだ', '～ようにする / ～ことになる', '被動與使役被動態', '中級語感與副詞'],
    modules: [
      { id: 'mn3-1', title: 'AI 視訊：日本租屋與水電諮詢', type: 'conversation', desc: '模擬在東京找房仲看房簽約', xpReward: 120 },
      { id: 'mn3-2', title: '使役受身（被迫做某事）句型', type: 'grammar', desc: '日語最容易混淆的被動變化深入拆解', xpReward: 120 },
      { id: 'mn3-3', title: 'NHK 簡易日語新聞閱讀特訓', type: 'skills', desc: '長文閱讀與重要時事生詞解析', xpReward: 150 },
      { id: 'mn3-4', title: 'JLPT N3 考前衝刺實戰測驗', type: 'exam', desc: '文字語彙、文法讀解全真模擬', xpReward: 200 }
    ]
  },
  {
    id: 'stage-n2',
    level: 'JLPT N2',
    name: '商務職場與深度交流',
    subtitle: '商務敬語・日本職場就職標準',
    icon: 'Crown',
    description: '日企求職黃金標準！能流暢閱讀報刊評論、看懂日劇原聲無字幕、熟練運用尊敬語（尊敬語）與自謙語（謙譲語）。',
    unlocked: false,
    requiredXp: 2500,
    totalLessons: 10,
    completedLessons: 0,
    vocabularyCount: 6000,
    recommendedFor: '目標在日本就業、商務洽談、進入日本大企業',
    grammarFocus: ['商務敬語（尊敬・謙譲・丁寧）', '～にすぎない / ～に伴って', '抽象議論與新聞社論閱讀', '商務郵件與正式面試對答'],
    modules: [
      { id: 'mn2-1', title: 'AI 視訊：日企模擬求職面試', type: 'conversation', desc: '練習自我 PR、志望動機與敬語回答', xpReward: 200 },
      { id: 'mn2-2', title: '商務敬語極致辨析', type: 'grammar', desc: 'おっしゃる vs 申す、いらっしゃる vs 参る', xpReward: 180 },
      { id: 'mn2-3', title: '社論與深度長文快速精讀', type: 'skills', desc: '訓練日語速讀與論點歸納能力', xpReward: 220 },
      { id: 'mn2-4', title: 'JLPT N2 終極通關認證試煉', type: 'exam', desc: '挑戰 N2 合格分數線！', xpReward: 300 }
    ]
  }
];
