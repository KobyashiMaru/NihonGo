// Four Skills (Listening, Speaking, Reading, Writing) Training Data

export interface ListeningExercise {
  id: string;
  title: string;
  japaneseVoice: string;
  furigana: string;
  romaji: string;
  question: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
  category: '音調與長短音辨識' | '生活日常聽解' | '數字與金額';
}

export interface SpeakingExercise {
  id: string;
  title: string;
  targetJapanese: string;
  furigana: string;
  romaji: string;
  translation: string;
  context: string;
  difficulty: 'Beginner' | 'Intermediate';
  points: number;
}

export interface ReadingArticle {
  id: string;
  title: string;
  level: 'N5' | 'N4' | 'N3';
  topic: string;
  contentLines: {
    japanese: string;
    furigana: string;
    romaji: string;
    translation: string;
  }[];
  vocabulary: { word: string; reading: string; meaning: string }[];
  comprehensionQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface WritingExercise {
  id: string;
  title: string;
  prompt: string;
  targetJapanese: string;
  targetRomaji: string;
  scrambledWords: string[];
  hint: string;
  explanation: string;
}

export const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'l1',
    title: '長音與短音辨別（大叔 vs 爺爺）',
    japaneseVoice: 'おじいさん',
    furigana: 'おじいさん',
    romaji: 'ojiisan',
    question: '你聽到了哪一個單字？注意中間的「長音（ー / いい）」！',
    category: '音調與長短音辨識',
    options: [
      { text: 'おじさん (叔叔 / 伯伯 - 短音)', isCorrect: false, explanation: '「おじさん」的「じ」是短音，意思是叔叔或中年男子。' },
      { text: 'おじいさん (爺爺 / 老爺爺 - 長音)', isCorrect: true, explanation: '答對了！音調拉長的「おじいさん」代表爺爺或老人家。' }
    ]
  },
  {
    id: 'l2',
    title: '促音（小つ）的停頓停頓感',
    japaneseVoice: '切手を買いました',
    furigana: '<ruby>切手<rt>きって</rt></ruby>を<ruby>買<rt>か</rt></ruby>いました',
    romaji: 'Kitte o kaimashita',
    question: '請聽這句話，說話者買了什麼？',
    category: '生活日常聽解',
    options: [
      { text: '郵票 (切手 / きって)', isCorrect: true, explanation: '答對了！「きって」中間有促音停頓半拍，代表郵票。' },
      { text: '郵票 (来て / きて)', isCorrect: false, explanation: '「きて」沒有促音，意思是「請來」。' }
    ]
  },
  {
    id: 'l3',
    title: '便利商店結帳金額聽力',
    japaneseVoice: '全部で千五百円になります',
    furigana: '<ruby>全部<rt>ぜんぶ</rt></ruby>で<ruby>千五百円<rt>せんごひゃくえん</rt></ruby>になります',
    romaji: 'Zenbu de sengohyaku en ni narimasu',
    question: '店員說結帳總金額是多少日圓？',
    category: '數字與金額',
    options: [
      { text: '500 日圓', isCorrect: false, explanation: '五百是「ごひゃくえん」。' },
      { text: '1,500 日圓', isCorrect: true, explanation: '答對了！「せんごひゃくえん」是 1500 日圓。' },
      { text: '15,000 日圓', isCorrect: false, explanation: '一萬五是「いちまんごせんえん」。' }
    ]
  }
];

export const SPEAKING_EXERCISES: SpeakingExercise[] = [
  {
    id: 's1',
    title: '日常寒暄：謝謝您的關照',
    targetJapanese: 'ありがとうございます',
    furigana: 'ありがとうございます',
    romaji: 'arigatou gozaimasu',
    translation: '非常感謝您',
    context: '收到朋友送的禮物或接受服務時的最標準致謝詞。',
    difficulty: 'Beginner',
    points: 20
  },
  {
    id: 's2',
    title: '餐廳點餐：請給我這個',
    targetJapanese: 'これをください',
    furigana: 'これをください',
    romaji: 'kore o kudasai',
    translation: '請給我這個',
    context: '手指菜單時只要說這一句，在日本走遍天下都不怕！',
    difficulty: 'Beginner',
    points: 20
  },
  {
    id: 's3',
    title: '迷路求助：請問車站在哪裡？',
    targetJapanese: '駅はどこですか',
    furigana: '<ruby>駅<rt>えき</rt></ruby>はどこですか',
    romaji: 'eki wa doko desu ka',
    translation: '請問車站在哪裡？',
    context: '向路人詢問地點時的必備金句。',
    difficulty: 'Beginner',
    points: 25
  },
  {
    id: 's4',
    title: '便利商店：麻煩請幫我加熱',
    targetJapanese: '温めてください',
    furigana: '<ruby>温<rt>あたた</rt></ruby>めてください',
    romaji: 'atatamete kudasai',
    translation: '請幫我加熱（微波）',
    context: '買便當、飯糰時店員問溫め時的爽快回答！',
    difficulty: 'Intermediate',
    points: 30
  }
];

export const READING_ARTICLES: ReadingArticle[] = [
  {
    id: 'r1',
    title: '私の朝ごはん（我的早餐）',
    level: 'N5',
    topic: '日常生活',
    contentLines: [
      {
        japanese: '毎朝、七時に起きます。',
        furigana: '<ruby>毎朝<rt>まいあさ</rt></ruby>、<ruby>七時<rt>しちじ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きます。',
        romaji: 'Maiasa, shichiji ni okimasu.',
        translation: '每天早晨，我七點起床。'
      },
      {
        japanese: '朝ごはんは、パンと卵を食べます。そして、牛乳を飲みます。',
        furigana: '<ruby>朝<rt>あさ</rt></ruby>ごはんは、パンと<ruby>卵<rt>たまご</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます。そして、<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みます。',
        romaji: 'Asagohan wa, pan to tamago o tabemasu. Soshite, gyuunyuu o nomimasu.',
        translation: '早餐吃麵包和雞蛋。然後，喝牛奶。'
      },
      {
        japanese: '日本の朝ごはんはとても美味しいです。元気に一日を始めます！',
        furigana: '<ruby>日本<rt>にほん</rt></ruby>の<ruby>朝<rt>あさ</rt></ruby>ごはんはとても<ruby>美味<rt>おい</rt></ruby>しいです。<ruby>元気<rt>げんき</rt></ruby>に<ruby>一日<rt>いちにち</rt></ruby>を<ruby>始<rt>はじ</rt></ruby>めます！',
        romaji: 'Nihon no asagohan wa totemo oishii desu. Genki ni ichinichi o hajimemasu!',
        translation: '日本的早餐非常好吃。精神飽滿地展開新的一天！'
      }
    ],
    vocabulary: [
      { word: '毎朝', reading: 'まいあさ', meaning: '每天早晨' },
      { word: '起きます', reading: 'おきます', meaning: '起床' },
      { word: '牛乳', reading: 'ぎゅうにゅう', meaning: '牛奶' },
      { word: '元気', reading: 'げんき', meaning: '精力充沛/健康' }
    ],
    comprehensionQuestions: [
      {
        question: '作者每天早上幾點起床？',
        options: ['六點', '七點', '八點'],
        correctIndex: 1
      },
      {
        question: '作者早餐喝什麼？',
        options: ['綠茶', '黑咖啡', '牛奶'],
        correctIndex: 2
      }
    ]
  },
  {
    id: 'r2',
    title: '東京の電車に乗る（搭乘東京電車）',
    level: 'N5',
    topic: '日本旅遊交通',
    contentLines: [
      {
        japanese: '東京の電車はとても便利ですが、少し複雑です。',
        furigana: '<ruby>東京<rt>とうきょう</rt></ruby>の<ruby>電車<rt>でんしゃ</rt></ruby>はとても<ruby>便利<rt>べんり</rt></ruby>ですが、<ruby>少<rt>すこ</rt></ruby>し<ruby>複雑<rt>ふくざつ</rt></ruby>です。',
        romaji: 'Toukyou no densha wa totemo benri desu ga, sukoshi fukuzatsu desu.',
        translation: '東京的電車非常方便，但稍微有點複雜。'
      },
      {
        japanese: 'SuicaやPASMOなどのICカードがあれば、改札をタッチするだけで通ることができます。',
        furigana: 'SuicaやPASMOなどのICカードがあれば、<ruby>改札<rt>かいさつ</rt></ruby>をタッチするだけで<ruby>通<rt>とお</rt></ruby>ることができます。',
        romaji: 'Suica ya PASMO nado no aishii kaado ga areba, kaisatsu o tacchi suru dake de tooru koto ga dekimasu.',
        translation: '只要有 Suica 或 PASMO 等交通 IC 卡，感應刷卡就能通過剪票口。'
      },
      {
        japanese: '山手線は東京の中心をぐるっと一周します。',
        furigana: '<ruby>山手線<rt>やまのてせん</rt></ruby>は<ruby>東京<rt>とうきょう</rt></ruby>の<ruby>中心<rt>ちゅうしん</rt></ruby>をぐるっと<ruby>一周<rt>いっしゅう</rt></ruby>します。',
        romaji: 'Yamanotesen wa Toukyou no chuushin o gurutto isshuu shimasu.',
        translation: '山手線環繞著東京市中心一整圈。'
      }
    ],
    vocabulary: [
      { word: '電車', reading: 'でんしゃ', meaning: '電車/火車' },
      { word: '改札', reading: 'かいさつ', meaning: '剪票口' },
      { word: '中心', reading: 'ちゅうしん', meaning: '中心/市中心' },
      { word: '一周', reading: 'いっしゅう', meaning: '繞一圈' }
    ],
    comprehensionQuestions: [
      {
        question: '搭東京電車時，使用什麼卡片感應最方便？',
        options: ['信用卡', 'Suica 或 PASMO 等交通卡', '身分證'],
        correctIndex: 1
      },
      {
        question: '山手線的行駛特色是什麼？',
        options: ['直達大阪', '往地底深處行駛', '環繞東京市中心一圈'],
        correctIndex: 2
      }
    ]
  }
];

export const WRITING_EXERCISES: WritingExercise[] = [
  {
    id: 'w1',
    title: '日式鍵盤打字重組：我是學生',
    prompt: '請將以下單字按正確語序重組，並在下方用日式鍵盤輸入日文字：',
    targetJapanese: '私は学生です',
    targetRomaji: 'watashi wa gakusei desu',
    scrambledWords: ['学生です', '私は'],
    hint: '日語標準句型：【主詞】＋ は ＋ 【名詞】＋ です。',
    explanation: '「は」讀作「wa」，當作主題助詞；「です」是肯定句尾。'
  },
  {
    id: 'w2',
    title: '日式鍵盤打字重組：喝綠茶',
    prompt: '請重組並打出「喝茶」的完整句子：',
    targetJapanese: 'お茶を飲みます',
    targetRomaji: 'ocha o nomimasu',
    scrambledWords: ['飲みます', 'お茶を'],
    hint: '「を（wo）」是受詞助詞，放在名詞後方，最後接動詞「飲みます」。',
    explanation: '在日式鍵盤打「ocha」轉「お茶」，打「wo」出「を」，打「nomimasu」按 Space 轉「飲みます」。'
  },
  {
    id: 'w3',
    title: '日式鍵盤打字重組：搭乘電車去澀谷',
    prompt: '請重組並打出「搭乘電車前往澀谷」：',
    targetJapanese: '電車で渋谷へ行きます',
    targetRomaji: 'densha de shibuya e ikimasu',
    scrambledWords: ['行きます', '電車で', '渋谷へ'],
    hint: '交通工具用「で」，目的地用「へ（讀作 e）」。',
    explanation: '完整結構：[交通工具] で + [目的地] へ + 行きます。'
  }
];
