// Kana Flashcard Data: chart rows, character origins, katakana example words and look-alike tips

import { KANA_LIST } from './kanaData';
import { KanaCharacter } from '../types';

export type KanaScript = 'hiragana' | 'katakana';

export interface KanaRow {
  id: string;
  label: string;          // Hiragana label (e.g. 'か行'); converted for katakana mode
  cells: string[];        // 5 slots in あいうえお column order, '' = empty slot
  kind: 'seion' | 'dakuon';
}

export const KANA_ROWS: KanaRow[] = [
  { id: 'a', label: 'あ行', cells: ['あ', 'い', 'う', 'え', 'お'], kind: 'seion' },
  { id: 'ka', label: 'か行', cells: ['か', 'き', 'く', 'け', 'こ'], kind: 'seion' },
  { id: 'sa', label: 'さ行', cells: ['さ', 'し', 'す', 'せ', 'そ'], kind: 'seion' },
  { id: 'ta', label: 'た行', cells: ['た', 'ち', 'つ', 'て', 'と'], kind: 'seion' },
  { id: 'na', label: 'な行', cells: ['な', 'に', 'ぬ', 'ね', 'の'], kind: 'seion' },
  { id: 'ha', label: 'は行', cells: ['は', 'ひ', 'ふ', 'へ', 'ほ'], kind: 'seion' },
  { id: 'ma', label: 'ま行', cells: ['ま', 'み', 'む', 'め', 'も'], kind: 'seion' },
  { id: 'ya', label: 'や行', cells: ['や', '', 'ゆ', '', 'よ'], kind: 'seion' },
  { id: 'ra', label: 'ら行', cells: ['ら', 'り', 'る', 'れ', 'ろ'], kind: 'seion' },
  { id: 'wa', label: 'わ行', cells: ['わ', '', '', '', 'を'], kind: 'seion' },
  { id: 'n', label: 'ん', cells: ['ん', '', '', '', ''], kind: 'seion' },
  { id: 'ga', label: 'が行', cells: ['が', 'ぎ', 'ぐ', 'げ', 'ご'], kind: 'dakuon' },
  { id: 'za', label: 'ざ行', cells: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'], kind: 'dakuon' },
  { id: 'da', label: 'だ行', cells: ['だ', 'ぢ', 'づ', 'で', 'ど'], kind: 'dakuon' },
  { id: 'ba', label: 'ば行', cells: ['ば', 'び', 'ぶ', 'べ', 'ぼ'], kind: 'dakuon' },
  { id: 'pa', label: 'ぱ行', cells: ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'], kind: 'dakuon' },
];

export const rowKana = (row: KanaRow): string[] => row.cells.filter(Boolean);

export const ALL_KANA_KEYS: string[] = KANA_ROWS.flatMap(rowKana);

// Hiragana and katakana sit exactly 0x60 apart in Unicode
export const toKatakana = (text: string): string =>
  text.replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));

export const toHiragana = (text: string): string =>
  text.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));

export const inScript = (hiragana: string, script: KanaScript): string =>
  script === 'hiragana' ? hiragana : toKatakana(hiragana);

export interface KanaOrigin {
  kanji: string;  // Source kanji (traditional form)
  hint: string;   // Which part of the kanji became the kana
}

// Source kanji and memory hints from 「日文五十音漢字字源與記憶對照表」 (src/data/docs/kana-origins.md).
// Hiragana come from the cursive form of a whole kanji…
const HIRAGANA_ORIGINS: Record<string, KanaOrigin> = {
  あ: { kanji: '安', hint: '安的草書，寶蓋頭加女字' },
  い: { kanji: '以', hint: '以的草書簡化' },
  う: { kanji: '宇', hint: '宇的草書，一點加彎曲筆劃' },
  え: { kanji: '衣', hint: '衣的草書連筆' },
  お: { kanji: '於', hint: '於的草書繞圈' },
  か: { kanji: '加', hint: '加的草書，力加一點' },
  き: { kanji: '幾', hint: '幾的草書' },
  く: { kanji: '久', hint: '久順手連寫為「＜」' },
  け: { kanji: '計', hint: '左邊言字旁加右邊十' },
  こ: { kanji: '己', hint: '己的草書頭尾兩橫' },
  さ: { kanji: '左', hint: '左的草書' },
  し: { kanji: '之', hint: '之字的拉長一捺，像釣魚鉤' },
  す: { kanji: '寸', hint: '寸字的草書打圈' },
  せ: { kanji: '世', hint: '世的圓滑草書' },
  そ: { kanji: '曾', hint: '曾的草書' },
  た: { kanji: '太', hint: '太的草書，十加右下筆劃' },
  ち: { kanji: '知', hint: '知的草書' },
  つ: { kanji: '川', hint: '川的三豎連筆' },
  て: { kanji: '天', hint: '天的草書' },
  と: { kanji: '止', hint: '止的草書' },
  な: { kanji: '奈', hint: '奈的草書' },
  に: { kanji: '仁', hint: '單人旁「亻」加「二」' },
  ぬ: { kanji: '奴', hint: '奴字的「女加又」繞圈' },
  ね: { kanji: '禰', hint: '禰的草書' },
  の: { kanji: '乃', hint: '乃字順手寫一圈' },
  は: { kanji: '波', hint: '三點水加皮的簡化' },
  ひ: { kanji: '比', hint: '比的草書' },
  ふ: { kanji: '不', hint: '不的草書' },
  へ: { kanji: '部', hint: '部的右半邊阝草書' },
  ほ: { kanji: '保', hint: '保的草書' },
  ま: { kanji: '末', hint: '末的草書，兩橫打圈' },
  み: { kanji: '美', hint: '美的草書' },
  む: { kanji: '武', hint: '武的草書' },
  め: { kanji: '女', hint: '女的草書' },
  も: { kanji: '毛', hint: '先寫豎彎鈎再貫穿兩橫' },
  や: { kanji: '也', hint: '也字的草書' },
  ゆ: { kanji: '由', hint: '由的草書' },
  よ: { kanji: '與', hint: '與字的草書' },
  ら: { kanji: '良', hint: '良字的草書' },
  り: { kanji: '利', hint: '立刀旁「刂」的草書' },
  る: { kanji: '留', hint: '留的草書' },
  れ: { kanji: '禮', hint: '禮的草書' },
  ろ: { kanji: '呂', hint: '兩個口連寫的草書' },
  わ: { kanji: '和', hint: '和字的草書' },
  を: { kanji: '遠', hint: '遠字的草書' },
  // The table lists 爾 here; most references (e.g. 日本語 Wikipedia) give 无
  ん: { kanji: '无', hint: '无（無）的草書演變；部分對照表寫作「爾」' },
};

// …katakana from a radical or a few strokes of a kanji
const KATAKANA_ORIGINS: Record<string, KanaOrigin> = {
  ア: { kanji: '阿', hint: '阿的左側偏旁「阝」' },
  イ: { kanji: '伊', hint: '伊的單人旁「亻」' },
  ウ: { kanji: '宇', hint: '宇的寶蓋頭「宀」' },
  エ: { kanji: '江', hint: '江的右半邊「工」' },
  オ: { kanji: '於', hint: '於的左半邊簡化' },
  カ: { kanji: '加', hint: '加的左半邊「力」' },
  キ: { kanji: '幾', hint: '幾的上半部切分' },
  ク: { kanji: '久', hint: '久的前兩筆／左上角' },
  ケ: { kanji: '介', hint: '介的左半邊' },
  コ: { kanji: '己', hint: '己的上半部' },
  サ: { kanji: '散', hint: '散的左上角「艹」' },
  シ: { kanji: '之', hint: '三點水「氵」筆意，由下往上提' },
  ス: { kanji: '須', hint: '須的右半邊簡化' },
  セ: { kanji: '世', hint: '世的前兩筆' },
  ソ: { kanji: '曾', hint: '曾的最上面兩點「丷」，由上往下撇' },
  タ: { kanji: '多', hint: '多的上半部「夕」' },
  チ: { kanji: '千', hint: '中文字「千」' },
  ツ: { kanji: '川', hint: '川的草書筆意，由上往下落筆' },
  テ: { kanji: '天', hint: '天的前三筆' },
  ト: { kanji: '止', hint: '止的右上角，像「卜」' },
  ナ: { kanji: '奈', hint: '奈的前兩筆「大／十」' },
  ニ: { kanji: '二', hint: '漢字「二」' },
  ヌ: { kanji: '奴', hint: '奴的右半邊「又」' },
  ネ: { kanji: '禰', hint: '禰的示字旁「礻」' },
  ノ: { kanji: '乃', hint: '乃的第一筆撇「丿」' },
  ハ: { kanji: '八', hint: '漢字「八」' },
  ヒ: { kanji: '比', hint: '比的右半邊「匕」' },
  フ: { kanji: '不', hint: '不的左上兩筆' },
  ヘ: { kanji: '部', hint: '部的右半邊阝，同平假名' },
  ホ: { kanji: '保', hint: '保的右下部「木」簡化' },
  マ: { kanji: '末', hint: '末（或麻）的簡化角筆' },
  ミ: { kanji: '三', hint: '漢字「三」的三條斜線' },
  ム: { kanji: '牟', hint: '牟的頭部偏旁「厶」' },
  メ: { kanji: '女', hint: '女字交錯的兩筆' },
  モ: { kanji: '毛', hint: '毛的前三筆' },
  ヤ: { kanji: '也', hint: '也的左半邊' },
  ユ: { kanji: '由', hint: '由的右邊與下半部' },
  ヨ: { kanji: '與', hint: '與的右邊框' },
  ラ: { kanji: '良', hint: '良的右上角' },
  リ: { kanji: '利', hint: '立刀旁「刂」' },
  ル: { kanji: '流', hint: '流的右下角筆畫' },
  レ: { kanji: '禮', hint: '禮的右下筆畫「乚」' },
  ロ: { kanji: '呂', hint: '漢字「口」（呂的一半）' },
  ワ: { kanji: '和', hint: '和右邊「口」的簡化' },
  ヲ: { kanji: '乎', hint: '乎字的偏旁' },
  ン: { kanji: '爾', hint: '爾的草書兩點，由左下往右上撇' },
};

interface ExampleWord {
  word: string;
  romaji: string;
  meaning: string;
}

// Everyday loanwords so katakana cards show a word actually written in katakana
const KATAKANA_EXAMPLES: Record<string, ExampleWord> = {
  ア: { word: 'アイス', romaji: 'aisu', meaning: '冰淇淋' },
  イ: { word: 'イギリス', romaji: 'igirisu', meaning: '英國' },
  ウ: { word: 'ウイスキー', romaji: 'uisukii', meaning: '威士忌' },
  エ: { word: 'エアコン', romaji: 'eakon', meaning: '冷氣' },
  オ: { word: 'オレンジ', romaji: 'orenji', meaning: '柳橙' },
  カ: { word: 'カメラ', romaji: 'kamera', meaning: '相機' },
  キ: { word: 'キウイ', romaji: 'kiui', meaning: '奇異果' },
  ク: { word: 'クッキー', romaji: 'kukkii', meaning: '餅乾' },
  ケ: { word: 'ケーキ', romaji: 'keeki', meaning: '蛋糕' },
  コ: { word: 'コーヒー', romaji: 'koohii', meaning: '咖啡' },
  サ: { word: 'サッカー', romaji: 'sakkaa', meaning: '足球' },
  シ: { word: 'シール', romaji: 'shiiru', meaning: '貼紙' },
  ス: { word: 'スマホ', romaji: 'sumaho', meaning: '智慧型手機' },
  セ: { word: 'セーター', romaji: 'seetaa', meaning: '毛衣' },
  ソ: { word: 'ソース', romaji: 'soosu', meaning: '醬汁' },
  タ: { word: 'タクシー', romaji: 'takushii', meaning: '計程車' },
  チ: { word: 'チーズ', romaji: 'chiizu', meaning: '起司' },
  ツ: { word: 'ツアー', romaji: 'tsuaa', meaning: '旅行團' },
  テ: { word: 'テレビ', romaji: 'terebi', meaning: '電視' },
  ト: { word: 'トマト', romaji: 'tomato', meaning: '番茄' },
  ナ: { word: 'ナイフ', romaji: 'naifu', meaning: '刀子' },
  ニ: { word: 'テニス', romaji: 'tenisu', meaning: '網球' },
  ヌ: { word: 'ヌードル', romaji: 'nuudoru', meaning: '麵' },
  ネ: { word: 'ネクタイ', romaji: 'nekutai', meaning: '領帶' },
  ノ: { word: 'ノート', romaji: 'nooto', meaning: '筆記本' },
  ハ: { word: 'ハンバーガー', romaji: 'hanbaagaa', meaning: '漢堡' },
  ヒ: { word: 'ヒーター', romaji: 'hiitaa', meaning: '暖氣機' },
  フ: { word: 'フランス', romaji: 'furansu', meaning: '法國' },
  ヘ: { word: 'ヘルメット', romaji: 'herumetto', meaning: '安全帽' },
  ホ: { word: 'ホテル', romaji: 'hoteru', meaning: '飯店' },
  マ: { word: 'マスク', romaji: 'masuku', meaning: '口罩' },
  ミ: { word: 'ミルク', romaji: 'miruku', meaning: '牛奶' },
  ム: { word: 'ゲーム', romaji: 'geemu', meaning: '遊戲' },
  メ: { word: 'メール', romaji: 'meeru', meaning: '電子郵件' },
  モ: { word: 'モデル', romaji: 'moderu', meaning: '模特兒' },
  ヤ: { word: 'タイヤ', romaji: 'taiya', meaning: '輪胎' },
  ユ: { word: 'ユーロ', romaji: 'yuuro', meaning: '歐元' },
  ヨ: { word: 'ヨーグルト', romaji: 'yooguruto', meaning: '優格' },
  ラ: { word: 'ラーメン', romaji: 'raamen', meaning: '拉麵' },
  リ: { word: 'リモコン', romaji: 'rimokon', meaning: '遙控器' },
  ル: { word: 'ルール', romaji: 'ruuru', meaning: '規則' },
  レ: { word: 'レモン', romaji: 'remon', meaning: '檸檬' },
  ロ: { word: 'ロボット', romaji: 'robotto', meaning: '機器人' },
  ワ: { word: 'ワイン', romaji: 'wain', meaning: '葡萄酒' },
  ン: { word: 'パソコン', romaji: 'pasokon', meaning: '個人電腦' },
  ガ: { word: 'ガム', romaji: 'gamu', meaning: '口香糖' },
  ギ: { word: 'ギター', romaji: 'gitaa', meaning: '吉他' },
  グ: { word: 'グラス', romaji: 'gurasu', meaning: '玻璃杯' },
  ゲ: { word: 'ゲーム', romaji: 'geemu', meaning: '遊戲' },
  ゴ: { word: 'ゴルフ', romaji: 'gorufu', meaning: '高爾夫' },
  ザ: { word: 'ピザ', romaji: 'piza', meaning: '披薩' },
  ジ: { word: 'ラジオ', romaji: 'rajio', meaning: '收音機' },
  ズ: { word: 'サイズ', romaji: 'saizu', meaning: '尺寸' },
  ゼ: { word: 'ゼロ', romaji: 'zero', meaning: '零' },
  ゾ: { word: 'ゾーン', romaji: 'zoon', meaning: '區域' },
  ダ: { word: 'ダンス', romaji: 'dansu', meaning: '舞蹈' },
  ヂ: { word: 'チヂミ', romaji: 'chijimi', meaning: '韓式煎餅' },
  デ: { word: 'デパート', romaji: 'depaato', meaning: '百貨公司' },
  ド: { word: 'ドア', romaji: 'doa', meaning: '門' },
  バ: { word: 'バス', romaji: 'basu', meaning: '公車' },
  ビ: { word: 'ビール', romaji: 'biiru', meaning: '啤酒' },
  ブ: { word: 'ブラシ', romaji: 'burashi', meaning: '刷子' },
  ベ: { word: 'ベッド', romaji: 'beddo', meaning: '床' },
  ボ: { word: 'ボール', romaji: 'booru', meaning: '球' },
  パ: { word: 'パン', romaji: 'pan', meaning: '麵包' },
  ピ: { word: 'ピアノ', romaji: 'piano', meaning: '鋼琴' },
  プ: { word: 'プリン', romaji: 'purin', meaning: '布丁' },
  ペ: { word: 'ペン', romaji: 'pen', meaning: '原子筆' },
  ポ: { word: 'ポスト', romaji: 'posuto', meaning: '郵筒' },
};

// Pronunciation and typing gotchas worth seeing on the card
const CARD_NOTES: Record<string, string> = {
  は: '當助詞時（例如「こんにちは」）讀作 wa，但打字還是打 ha。',
  へ: '當助詞「往…」時讀作 e。平假名 へ 和片假名 ヘ 幾乎長得一模一樣。',
  を: '只當助詞使用（例如「お茶を飲む」），讀音和「お」相同；打字要打 wo。',
  ヲ: '片假名 ヲ 幾乎只出現在遊戲名稱、舊式電報等特殊場合，先認得即可。',
  ん: '唯一單獨的子音，不會出現在字首；用鍵盤打字時通常要打 nn。',
  ン: '唯一單獨的子音，不會出現在字首；用鍵盤打字時通常要打 nn。',
  ふ: 'fu 的子音介於 f 和 h 之間：上下唇不碰在一起，輕輕吹氣。',
  フ: 'fu 的子音介於 f 和 h 之間：上下唇不碰在一起，輕輕吹氣。',
  つ: '縮小的「っ」是促音，表示停頓一拍，例如 がっこう（學校）。',
  ツ: '縮小的「ッ」是促音，表示停頓一拍，例如 クッキー（餅乾）。',
  ら: 'ら行的 r 是舌尖輕輕彈一下，接近國語的「ㄌ」，不是英文的捲舌 r。',
  ラ: 'ラ行的 r 是舌尖輕輕彈一下，接近國語的「ㄌ」，不是英文的捲舌 r。',
  ぢ: '讀音和「じ」相同，只出現在少數詞（如 はなぢ 鼻血）；打字要打 di。',
  ヂ: '讀音和「ジ」相同，片假名很少用；打字要打 di。',
  づ: '讀音和「ず」相同，常見於 つづく（持續）；打字要打 du。',
  ヅ: '讀音和「ズ」相同，片假名幾乎不用，先認得即可；打字要打 du。',
};

export interface ConfusableSet {
  chars: string[];
  tip: string;
}

// Characters beginners mix up, with the detail that tells them apart
export const CONFUSABLE_SETS: ConfusableSet[] = [
  { chars: ['あ', 'お'], tip: 'お 右上角多一點；あ 沒有。' },
  { chars: ['い', 'り'], tip: 'い 左右兩筆差不多短；り 右邊那筆長長往下拉。' },
  { chars: ['い', 'こ'], tip: 'い 是左右兩豎；こ 是上下兩橫。' },
  { chars: ['き', 'さ'], tip: 'き 有兩條橫線；さ 只有一條。' },
  { chars: ['さ', 'ち'], tip: '兩個字像左右顛倒，注意下半部彎曲的方向。' },
  { chars: ['ぬ', 'め'], tip: 'ぬ 尾巴多打一個小圈；め 沒有。' },
  { chars: ['ね', 'れ', 'わ'], tip: '看右下收尾：ね 打一個小圈、れ 向外甩出、わ 向內彎回。' },
  { chars: ['る', 'ろ'], tip: 'る 尾巴有小圈；ろ 沒有。' },
  { chars: ['は', 'ほ'], tip: 'ほ 右邊頂端多一條橫線（封口）；は 沒有。' },
  { chars: ['け', 'は'], tip: 'は 右下打一個圈；け 右邊是直直的一筆。' },
  { chars: ['ほ', 'ま'], tip: 'ほ 左邊多一豎；ま 沒有。' },
  { chars: ['ま', 'も'], tip: 'ま 底部打一個圈；も 底部往右上勾、不打圈。' },
  { chars: ['く', 'へ'], tip: 'く 像「<」開口朝右；へ 像一座小山。' },
  {
    chars: ['シ', 'ン', 'ツ', 'ソ'],
    tip: '看最後一筆的方向：シ、ン 由左下往右上「提」（シ 源自三點水「氵」）；ツ、ソ 由上往下「撇」（ツ 源自「川」、ソ 源自「曾」頭上的「丷」）。點的位置也不同：シ 兩點在左、ツ 兩點在上。',
  },
  { chars: ['ク', 'タ', 'ケ'], tip: 'タ 是 ク 裡面多一點；ケ 是一撇加一橫、中間再垂下一筆。' },
  { chars: ['コ', 'ユ'], tip: 'ユ 底部那橫比較長、往右突出；コ 是方方正正的口。' },
  { chars: ['ウ', 'ワ', 'フ'], tip: 'ウ 頂端多一點；ワ 左邊有一短豎；フ 只有一筆。' },
  { chars: ['チ', 'テ'], tip: 'テ 上面是兩條平行橫線；チ 頂端是一斜撇。' },
  { chars: ['ナ', 'メ'], tip: 'ナ 是一橫加一撇；メ 是兩筆斜斜交叉（像打叉）。' },
  { chars: ['ア', 'マ'], tip: 'ア 下方是往左下的一撇；マ 下方是往右的一小點。' },
  { chars: ['ス', 'ヌ'], tip: 'ヌ 的第二筆穿過第一筆；ス 的第二筆在右下角、不交叉。' },
  { chars: ['ラ', 'ヲ', 'フ'], tip: 'ラ 頂端多一短橫；ヲ 中間多一橫；フ 只有一筆。' },
  { chars: ['ル', 'レ'], tip: 'レ 只有一筆；ル 左邊多一撇。' },
  { chars: ['セ', 'ヤ'], tip: 'ヤ 長的那筆直直往左下撇；セ 長的那筆往下再向右轉彎。' },
];

// Katakana that look almost the same as their hiragana partner
const HIRAGANA_LOOKALIKES = new Set(['か', 'き', 'せ', 'へ', 'も', 'や', 'り']);

const ROMAJI_ALIASES: Record<string, string[]> = {
  shi: ['si'],
  chi: ['ti'],
  tsu: ['tu'],
  fu: ['hu'],
  ji: ['zi'],
  n: ['nn', "n'"],
};

const KANA_BY_HIRAGANA = new Map<string, KanaCharacter>(KANA_LIST.map(k => [k.hiragana, k]));

export interface KanaCard {
  key: string;            // Hiragana form, used as the stable id in both scripts
  char: string;           // Character shown in the chosen script
  otherChar: string;      // Same sound in the other script
  romaji: string;         // Display romaji, e.g. 'wo (o)'
  sound: string;          // What it actually sounds like ('を' → 'o')
  acceptedRomaji: string[];
  rowId: string;
  origin?: KanaOrigin;
  otherOrigin?: KanaOrigin; // Origin of the same sound in the other script, for comparison
  base?: string;          // Dakuten/handakuten: the plain character it is built on
  example: ExampleWord & { written?: string };
  note?: string;
  confusables: ConfusableSet[];
  lookalike?: string;     // Katakana card that looks like its hiragana partner
}

const parseRomaji = (raw: string) => {
  const match = raw.match(/^([a-z]+)(?:\s*\(([a-z]+)\))?$/);
  const primary = match ? match[1] : raw;
  const alternate = match?.[2];
  return { primary, alternate };
};

const cardCache = new Map<string, KanaCard>();

export const getKanaCard = (key: string, script: KanaScript): KanaCard => {
  const cacheKey = `${script}:${key}`;
  const cached = cardCache.get(cacheKey);
  if (cached) return cached;

  const data = KANA_BY_HIRAGANA.get(key);
  if (!data) throw new Error(`Unknown kana: ${key}`);

  const char = inScript(key, script);
  const { primary, alternate } = parseRomaji(data.romaji);
  // を / ぢ / づ sound like お / じ / ず; their alternate spelling is only for typing
  const sound = key === 'を' ? 'o' : primary;
  const accepted = new Set([primary, ...(alternate ? [alternate] : []), ...(ROMAJI_ALIASES[primary] ?? [])]);

  // NFD splits が into か + combining ゛, giving the plain base character
  const decomposed = key.normalize('NFD');
  const base = decomposed.length > 1 ? inScript(decomposed[0], script) : undefined;

  const katakanaExample = script === 'katakana' ? KATAKANA_EXAMPLES[char] : undefined;
  const example = katakanaExample ?? {
    word: data.exampleFurigana,
    written: data.exampleWord,
    romaji: data.exampleRomaji,
    meaning: data.exampleMeaning,
  };

  const card: KanaCard = {
    key,
    char,
    otherChar: script === 'hiragana' ? toKatakana(key) : key,
    romaji: data.romaji,
    sound,
    acceptedRomaji: [...accepted],
    rowId: KANA_ROWS.find(r => r.cells.includes(key))?.id ?? '',
    origin: base ? undefined : (script === 'hiragana' ? HIRAGANA_ORIGINS[char] : KATAKANA_ORIGINS[char]),
    otherOrigin: base ? undefined : (script === 'hiragana' ? KATAKANA_ORIGINS[toKatakana(key)] : HIRAGANA_ORIGINS[key]),
    base,
    example,
    note: CARD_NOTES[char],
    confusables: CONFUSABLE_SETS.filter(set => set.chars.includes(char)),
    lookalike: script === 'katakana' && HIRAGANA_LOOKALIKES.has(key) ? key : undefined,
  };
  cardCache.set(cacheKey, card);
  return card;
};

// Accepts romaji in any common spelling, or the kana itself when typed through the IME
export const isCorrectTypedAnswer = (card: KanaCard, input: string): boolean => {
  const value = input.trim().toLowerCase();
  if (!value) return false;
  if (card.acceptedRomaji.includes(value)) return true;
  // Typed with the Japanese IME on: any kana with the same sound counts (じ for ぢ, お for を)
  const typedKana = toHiragana(value);
  return KANA_BY_HIRAGANA.has(typedKana) && getKanaCard(typedKana, 'hiragana').sound === card.sound;
};
