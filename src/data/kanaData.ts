// 50 Sounds (Gojuon) & Kana Reference Data

import { KanaCharacter } from '../types';

export const KANA_LIST: KanaCharacter[] = [
  // Vowels (あ行)
  { hiragana: 'あ', katakana: 'ア', romaji: 'a', group: 'vowels', exampleWord: 'あさ (朝)', exampleFurigana: 'あさ', exampleRomaji: 'asa', exampleMeaning: '早晨' },
  { hiragana: 'い', katakana: 'イ', romaji: 'i', group: 'vowels', exampleWord: 'いぬ (犬)', exampleFurigana: 'いぬ', exampleRomaji: 'inu', exampleMeaning: '狗' },
  { hiragana: 'う', katakana: 'ウ', romaji: 'u', group: 'vowels', exampleWord: 'うみ (海)', exampleFurigana: 'うみ', exampleRomaji: 'umi', exampleMeaning: '大海' },
  { hiragana: 'え', katakana: 'エ', romaji: 'e', group: 'vowels', exampleWord: 'えき (駅)', exampleFurigana: 'えき', exampleRomaji: 'eki', exampleMeaning: '車站' },
  { hiragana: 'お', katakana: 'オ', romaji: 'o', group: 'vowels', exampleWord: 'お茶 (おちゃ)', exampleFurigana: 'おちゃ', exampleRomaji: 'ocha', exampleMeaning: '茶' },

  // K line (か行)
  { hiragana: 'か', katakana: 'カ', romaji: 'ka', group: 'k', exampleWord: '傘 (かさ)', exampleFurigana: 'かさ', exampleRomaji: 'kasa', exampleMeaning: '雨傘' },
  { hiragana: 'き', katakana: 'キ', romaji: 'ki', group: 'k', exampleWord: '木 (き)', exampleFurigana: 'き', exampleRomaji: 'ki', exampleMeaning: '樹木' },
  { hiragana: 'く', katakana: 'ク', romaji: 'ku', group: 'k', exampleWord: '車 (くるま)', exampleFurigana: 'くるま', exampleRomaji: 'kuruma', exampleMeaning: '車子' },
  { hiragana: 'け', katakana: 'ケ', romaji: 'ke', group: 'k', exampleWord: '警察 (けいさつ)', exampleFurigana: 'けいさつ', exampleRomaji: 'keisatsu', exampleMeaning: '警察' },
  { hiragana: 'こ', katakana: 'コ', romaji: 'ko', group: 'k', exampleWord: '聲 (こえ)', exampleFurigana: 'こえ', exampleRomaji: 'koe', exampleMeaning: '聲音' },

  // S line (さ行)
  { hiragana: 'さ', katakana: 'サ', romaji: 'sa', group: 's', exampleWord: '魚 (さかな)', exampleFurigana: 'さかな', exampleRomaji: 'sakana', exampleMeaning: '魚' },
  { hiragana: 'し', katakana: 'シ', romaji: 'shi', group: 's', exampleWord: '白 (しろ)', exampleFurigana: 'しろ', exampleRomaji: 'shiro', exampleMeaning: '白色' },
  { hiragana: 'す', katakana: 'ス', romaji: 'su', group: 's', exampleWord: '壽司 (すし)', exampleFurigana: 'すし', exampleRomaji: 'sushi', exampleMeaning: '壽司' },
  { hiragana: 'せ', katakana: 'セ', romaji: 'se', group: 's', exampleWord: '世界 (せかい)', exampleFurigana: 'せかい', exampleRomaji: 'sekai', exampleMeaning: '世界' },
  { hiragana: 'そ', katakana: 'ソ', romaji: 'so', group: 's', exampleWord: '空 (そら)', exampleFurigana: 'そら', exampleRomaji: 'sora', exampleMeaning: '天空' },

  // T line (た行)
  { hiragana: 'た', katakana: 'タ', romaji: 'ta', group: 't', exampleWord: '卵 (たまご)', exampleFurigana: 'たまご', exampleRomaji: 'tamago', exampleMeaning: '雞蛋' },
  { hiragana: 'ち', katakana: 'チ', romaji: 'chi', group: 't', exampleWord: '地下鉄 (ちかてつ)', exampleFurigana: 'ちかてつ', exampleRomaji: 'chikatetsu', exampleMeaning: '地下鐵' },
  { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu', group: 't', exampleWord: '月 (つき)', exampleFurigana: 'つき', exampleRomaji: 'tsuki', exampleMeaning: '月亮' },
  { hiragana: 'て', katakana: 'テ', romaji: 'te', group: 't', exampleWord: '手 (て)', exampleFurigana: 'て', exampleRomaji: 'te', exampleMeaning: '手' },
  { hiragana: 'と', katakana: 'ト', romaji: 'to', group: 't', exampleWord: '友達 (ともだち)', exampleFurigana: 'ともだち', exampleRomaji: 'tomodachi', exampleMeaning: '朋友' },

  // N line (な行)
  { hiragana: 'な', katakana: 'ナ', romaji: 'na', group: 'n', exampleWord: '夏 (なつ)', exampleFurigana: 'なつ', exampleRomaji: 'natsu', exampleMeaning: '夏天' },
  { hiragana: 'に', katakana: 'ニ', romaji: 'ni', group: 'n', exampleWord: '日本 (にほん)', exampleFurigana: 'にほん', exampleRomaji: 'nihon', exampleMeaning: '日本' },
  { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu', group: 'n', exampleWord: 'ぬいぐるみ', exampleFurigana: 'ぬいぐるみ', exampleRomaji: 'nuigurumi', exampleMeaning: '玩偶' },
  { hiragana: 'ね', katakana: 'ネ', romaji: 'ne', group: 'n', exampleWord: '貓 (ねこ)', exampleFurigana: 'ねこ', exampleRomaji: 'neko', exampleMeaning: '貓' },
  { hiragana: 'の', katakana: 'ノ', romaji: 'no', group: 'n', exampleWord: '飲み物 (のみもの)', exampleFurigana: 'のみもの', exampleRomaji: 'nomimono', exampleMeaning: '飲料' },

  // H line (は行)
  { hiragana: 'は', katakana: 'ハ', romaji: 'ha', group: 'h', exampleWord: '花 (はな)', exampleFurigana: 'はな', exampleRomaji: 'hana', exampleMeaning: '花朵' },
  { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi', group: 'h', exampleWord: '人 (ひと)', exampleFurigana: 'ひと', exampleRomaji: 'hito', exampleMeaning: '人' },
  { hiragana: 'ふ', katakana: 'フ', romaji: 'fu', group: 'h', exampleWord: '冬 (ふゆ)', exampleFurigana: 'ふゆ', exampleRomaji: 'fuyu', exampleMeaning: '冬天' },
  { hiragana: 'へ', katakana: 'ヘ', romaji: 'he', group: 'h', exampleWord: '部屋 (へや)', exampleFurigana: 'へや', exampleRomaji: 'heya', exampleMeaning: '房間' },
  { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho', group: 'h', exampleWord: '本 (ほん)', exampleFurigana: 'ほん', exampleRomaji: 'hon', exampleMeaning: '書本' },

  // M line (ま行)
  { hiragana: 'ま', katakana: 'マ', romaji: 'ma', group: 'm', exampleWord: '街 (まち)', exampleFurigana: 'まち', exampleRomaji: 'machi', exampleMeaning: '街道' },
  { hiragana: 'み', katakana: 'ミ', romaji: 'mi', group: 'm', exampleWord: '水 (みず)', exampleFurigana: 'みず', exampleRomaji: 'mizu', exampleMeaning: '水' },
  { hiragana: 'む', katakana: 'ム', romaji: 'mu', group: 'm', exampleWord: '蟲 (むし)', exampleFurigana: 'むし', exampleRomaji: 'mushi', exampleMeaning: '昆蟲' },
  { hiragana: 'め', katakana: 'メ', romaji: 'me', group: 'm', exampleWord: '目 (め)', exampleFurigana: 'め', exampleRomaji: 'me', exampleMeaning: '眼睛' },
  { hiragana: 'も', katakana: 'モ', romaji: 'mo', group: 'm', exampleWord: '森 (もり)', exampleFurigana: 'もり', exampleRomaji: 'mori', exampleMeaning: '森林' },

  // Y line (や行)
  { hiragana: 'や', katakana: 'ヤ', romaji: 'ya', group: 'y', exampleWord: '山 (やま)', exampleFurigana: 'やま', exampleRomaji: 'yama', exampleMeaning: '山' },
  { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu', group: 'y', exampleWord: '雪 (ゆき)', exampleFurigana: 'ゆき', exampleRomaji: 'yuki', exampleMeaning: '雪' },
  { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo', group: 'y', exampleWord: '夜 (よる)', exampleFurigana: 'よる', exampleRomaji: 'yoru', exampleMeaning: '夜晚' },

  // R line (ら行)
  { hiragana: 'ら', katakana: 'ラ', romaji: 'ra', group: 'r', exampleWord: '拉麵 (ラーメン)', exampleFurigana: 'らーめん', exampleRomaji: 'raamen', exampleMeaning: '拉麵' },
  { hiragana: 'り', katakana: 'リ', romaji: 'ri', group: 'r', exampleWord: '林檎 (りんご)', exampleFurigana: 'りんご', exampleRomaji: 'ringo', exampleMeaning: '蘋果' },
  { hiragana: 'る', katakana: 'ル', romaji: 'ru', group: 'r', exampleWord: '留守 (るす)', exampleFurigana: 'るす', exampleRomaji: 'rusu', exampleMeaning: '不在家' },
  { hiragana: 'れ', katakana: 'レ', romaji: 're', group: 'r', exampleWord: '歷史 (れきし)', exampleFurigana: 'れきし', exampleRomaji: 'rekishi', exampleMeaning: '歷史' },
  { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro', group: 'r', exampleWord: '六 (ろく)', exampleFurigana: 'ろく', exampleRomaji: 'roku', exampleMeaning: '數字六' },

  // W & N line (わ・を・ん)
  { hiragana: 'わ', katakana: 'ワ', romaji: 'wa', group: 'w', exampleWord: '私 (わたし)', exampleFurigana: 'わたし', exampleRomaji: 'watashi', exampleMeaning: '我' },
  { hiragana: 'を', katakana: 'ヲ', romaji: 'wo (o)', group: 'w', exampleWord: 'お茶を飲む', exampleFurigana: 'おちゃをのむ', exampleRomaji: 'ocha o nomu', exampleMeaning: '喝茶（受詞助詞）' },
  { hiragana: 'ん', katakana: 'ン', romaji: 'n', group: 'n_single', exampleWord: '日本 (にほん)', exampleFurigana: 'にほん', exampleRomaji: 'nihon', exampleMeaning: '日本' },

  // Dakuten (濁音 - が・ざ・だ・ば行)
  { hiragana: 'が', katakana: 'ガ', romaji: 'ga', group: 'dakuten', exampleWord: '學校 (がっこう)', exampleFurigana: 'がっこう', exampleRomaji: 'gakkou', exampleMeaning: '學校' },
  { hiragana: 'ぎ', katakana: 'ギ', romaji: 'gi', group: 'dakuten', exampleWord: '銀行 (ぎんこう)', exampleFurigana: 'ぎんこう', exampleRomaji: 'ginkou', exampleMeaning: '銀行' },
  { hiragana: 'ぐ', katakana: 'グ', romaji: 'gu', group: 'dakuten', exampleWord: '軍手 (ぐんて)', exampleFurigana: 'ぐんて', exampleRomaji: 'gunte', exampleMeaning: '棉紗手套' },
  { hiragana: 'げ', katakana: 'ゲ', romaji: 'ge', group: 'dakuten', exampleWord: '元気 (げんき)', exampleFurigana: 'げんき', exampleRomaji: 'genki', exampleMeaning: '元氣/有精神' },
  { hiragana: 'ご', katakana: 'ゴ', romaji: 'go', group: 'dakuten', exampleWord: 'ご飯 (ごはん)', exampleFurigana: 'ごはん', exampleRomaji: 'gohan', exampleMeaning: '米飯/一餐' },

  { hiragana: 'ざ', katakana: 'ザ', romaji: 'za', group: 'dakuten', exampleWord: '雑誌 (ざっし)', exampleFurigana: 'ざっし', exampleRomaji: 'zasshi', exampleMeaning: '雜誌' },
  { hiragana: 'じ', katakana: 'ジ', romaji: 'ji', group: 'dakuten', exampleWord: '時間 (じかん)', exampleFurigana: 'じかん', exampleRomaji: 'jikan', exampleMeaning: '時間' },
  { hiragana: 'ず', katakana: 'ズ', romaji: 'zu', group: 'dakuten', exampleWord: '地図 (ちず)', exampleFurigana: 'ちず', exampleRomaji: 'chizu', exampleMeaning: '地圖' },
  { hiragana: 'ぜ', katakana: 'ゼ', romaji: 'ze', group: 'dakuten', exampleWord: '全部 (ぜんぶ)', exampleFurigana: 'ぜんぶ', exampleRomaji: 'zenbu', exampleMeaning: '全部' },
  { hiragana: 'ぞ', katakana: 'ゾ', romaji: 'zo', group: 'dakuten', exampleWord: '象 (ぞう)', exampleFurigana: 'ぞう', exampleRomaji: 'zou', exampleMeaning: '大象' },

  { hiragana: 'だ', katakana: 'ダ', romaji: 'da', group: 'dakuten', exampleWord: '大學 (だいがく)', exampleFurigana: 'だいがく', exampleRomaji: 'daigaku', exampleMeaning: '大學' },
  { hiragana: 'ぢ', katakana: 'ヂ', romaji: 'ji (di)', group: 'dakuten', exampleWord: '鼻血 (はなぢ)', exampleFurigana: 'はなぢ', exampleRomaji: 'hanaji', exampleMeaning: '鼻血' },
  { hiragana: 'づ', katakana: 'ヅ', romaji: 'zu (du)', group: 'dakuten', exampleWord: '続く (つづく)', exampleFurigana: 'つづく', exampleRomaji: 'tsuzuku', exampleMeaning: '持續' },
  { hiragana: 'で', katakana: 'デ', romaji: 'de', group: 'dakuten', exampleWord: '電車 (でんしゃ)', exampleFurigana: 'でんしゃ', exampleRomaji: 'densha', exampleMeaning: '電車' },
  { hiragana: 'ど', katakana: 'ド', romaji: 'do', group: 'dakuten', exampleWord: 'どこ', exampleFurigana: 'どこ', exampleRomaji: 'doko', exampleMeaning: '哪裡' },

  { hiragana: 'ば', katakana: 'バ', romaji: 'ba', group: 'dakuten', exampleWord: 'バス', exampleFurigana: 'ばす', exampleRomaji: 'basu', exampleMeaning: '公車' },
  { hiragana: 'び', katakana: 'ビ', romaji: 'bi', group: 'dakuten', exampleWord: '病院 (びょういん)', exampleFurigana: 'びょういん', exampleRomaji: 'byouin', exampleMeaning: '醫院' },
  { hiragana: 'ぶ', katakana: 'ブ', romaji: 'bu', group: 'dakuten', exampleWord: '豚肉 (ぶたにく)', exampleFurigana: 'ぶたにく', exampleRomaji: 'butaniku', exampleMeaning: '豬肉' },
  { hiragana: 'べ', katakana: 'ベ', romaji: 'be', group: 'dakuten', exampleWord: '便利 (べんり)', exampleFurigana: 'べんり', exampleRomaji: 'benri', exampleMeaning: '便利' },
  { hiragana: 'ぼ', katakana: 'ボ', romaji: 'bo', group: 'dakuten', exampleWord: '帽子 (ぼうし)', exampleFurigana: 'ぼうし', exampleRomaji: 'boushi', exampleMeaning: '帽子' },

  // Handakuten (半濁音 - ぱ行)
  { hiragana: 'ぱ', katakana: 'パ', romaji: 'pa', group: 'handakuten', exampleWord: 'パン', exampleFurigana: 'ぱん', exampleRomaji: 'pan', exampleMeaning: '麵包' },
  { hiragana: 'ぴ', katakana: 'ピ', romaji: 'pi', group: 'handakuten', exampleWord: 'ピアノ', exampleFurigana: 'ぴあの', exampleRomaji: 'piano', exampleMeaning: '鋼琴' },
  { hiragana: 'ぷ', katakana: 'プ', romaji: 'pu', group: 'handakuten', exampleWord: 'プリン', exampleFurigana: 'ぷりん', exampleRomaji: 'purin', exampleMeaning: '布丁' },
  { hiragana: 'ぺ', katakana: 'ペ', romaji: 'pe', group: 'handakuten', exampleWord: 'ペン', exampleFurigana: 'ぺん', exampleRomaji: 'pen', exampleMeaning: '原子筆' },
  { hiragana: 'ぽ', katakana: 'ポ', romaji: 'po', group: 'handakuten', exampleWord: 'ポスト', exampleFurigana: 'ぽすと', exampleRomaji: 'posuto', exampleMeaning: '郵筒' }
];

export const TYPING_CHALLENGES = [
  {
    title: '入門五十音單字打字',
    desc: '練習最基礎的單字，用日式鍵盤打出平假名！',
    items: [
      { prompt: '早晨', kana: 'あさ', romaji: 'asa', kanji: '朝' },
      { prompt: '狗', kana: 'いぬ', romaji: 'inu', kanji: '犬' },
      { prompt: '貓', kana: 'ねこ', romaji: 'neko', kanji: '猫' },
      { prompt: '車子', kana: 'くるま', romaji: 'kuruma', kanji: '車' },
      { prompt: '水', kana: 'みず', romaji: 'mizu', kanji: '水' },
      { prompt: '車站', kana: 'えき', romaji: 'eki', kanji: '駅' },
      { prompt: '壽司', kana: 'すし', romaji: 'sushi', kanji: '寿司' },
      { prompt: '雨傘', kana: 'かさ', romaji: 'kasa', kanji: '傘' }
    ]
  },
  {
    title: '實用生活問候語打字',
    desc: '練習打出常用的問候語句，熟悉長句拼寫！',
    items: [
      { prompt: '你好', kana: 'こんにちは', romaji: 'konnichiwa', kanji: 'こんにちは' },
      { prompt: '早安 (禮貌)', kana: 'おはようございます', romaji: 'ohayougozaimasu', kanji: 'おはようございます' },
      { prompt: '謝謝', kana: 'ありがとうございます', romaji: 'arigatougozaimasu', kanji: 'ありがとうございます' },
      { prompt: '不好意思 / 請問', kana: 'すみません', romaji: 'sumimasen', kanji: 'すみません' },
      { prompt: '初次見面', kana: 'はじめまして', romaji: 'hajimemashite', kanji: '初めまして' },
      { prompt: '請多多指教', kana: 'よろしくおねがいします', romaji: 'yoroshikuonegaishimasu', kanji: 'よろしくお願いします' }
    ]
  },
  {
    title: 'JIS 鍵盤漢字變換特訓（按空白鍵選漢字）',
    desc: '打完假名後按【Space 空白鍵】轉換為漢字，再按【Return】確認！',
    items: [
      { prompt: '日本', kana: 'にほん', romaji: 'nihon', targetKanji: '日本', tip: '輸入 nihon ➔ 按 Space 轉為 日本 ➔ 按 Return' },
      { prompt: '東京', kana: 'とうきょう', romaji: 'toukyou', targetKanji: '東京', tip: '輸入 toukyou ➔ 按 Space 轉為 東京 ➔ 按 Return' },
      { prompt: '先生 (老師)', kana: 'せんせい', romaji: 'sensei', targetKanji: '先生', tip: '輸入 sensei ➔ 按 Space 轉為 先生 ➔ 按 Return' },
      { prompt: '日本語', kana: 'にほんご', romaji: 'nihongo', targetKanji: '日本語', tip: '輸入 nihongo ➔ 按 Space 轉為 日本語 ➔ 按 Return' },
      { prompt: '友達 (朋友)', kana: 'ともだち', romaji: 'tomodachi', targetKanji: '友達', tip: '輸入 tomodachi ➔ 按 Space 轉為 友達 ➔ 按 Return' }
    ]
  }
];
