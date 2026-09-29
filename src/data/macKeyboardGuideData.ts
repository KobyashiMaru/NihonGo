// Mac Japanese Magic Keyboard (JIS Layout) Data & Beginner Guide

export interface MacKeyGuideItem {
  id: string;
  name: string;
  jpName: string;
  location: string;
  iconName: string;
  tag: string;
  description: string;
  howToUse: string[];
  example: string;
}

export interface SetupStep {
  step: number;
  title: string;
  desc: string;
  tip?: string;
}

export interface ImeShortcut {
  keys: string;
  badge: string;
  title: string;
  desc: string;
}

export const MAC_JIS_SPECIAL_KEYS: MacKeyGuideItem[] = [
  {
    id: 'eisu',
    name: '英数 (Eisu)',
    jpName: 'えいすう',
    location: '空白鍵（Space）的左邊',
    iconName: 'Type',
    tag: '切換英文',
    description: '按一下就切換成「英文（半形英數字）輸入」。不管現在是日文還是中文輸入法，左手大拇指按一下「英数」就能直接打英文，不用再猜目前是哪一種輸入法。',
    howToUse: [
      '按一下「英数」：切換成英文輸入（macOS 的「ABC」或「英字」模式），選單列的輸入法圖示會變成「A」。',
      '「英数」只會切到英文、不會來回切換，所以按幾次都一定是英文，打網址、密碼時很安心。',
      '忘了切換、把英文打成假名（例如 youtube 變成「ようつべ」）時：在按 Return 確定之前連按兩下「英数」，就會轉回「youtube」。若沒有反應，改按 Control＋:（冒號鍵）也能轉成半形英數。'
    ],
    example: '打完「こんにちは」按 Return 確定 → 按【英数】→ 直接打「google.com」。'
  },
  {
    id: 'kana',
    name: 'かな (Kana)',
    jpName: 'かな',
    location: '空白鍵（Space）的右邊',
    iconName: 'Languages',
    tag: '切換日文',
    description: '按一下就切換成「日文輸入（平假名）」。和左邊的「英数」一鍵對應一種語言：右手大拇指按「かな」打日文、左手按「英数」打英文，不需要 Control＋Space 來回切換。',
    howToUse: [
      '先完成「macOS 日本語輸入法設定」分頁的步驟，把「日文 - 羅馬字」輸入法加入系統。',
      '按一下「かな」：切換成日文輸入，選單列圖示會變成「あ」。',
      '用羅馬字拼音輸入：打 arigatou 會出現帶底線的「ありがとう」，按 Return 確定。長音「ー」用數字 0 右邊的「-」鍵輸入（例：ra-men → らーめん）。',
      '助詞「は」「を」要照字面打 ha、wo（例：konnichiha → こんにちは），打 wa 會變成「わ」。'
    ],
    example: '按一下【かな】，輸入「sushi」→ 畫面出現「すし」→ 按 Return 確定。'
  },
  {
    id: 'space_kanji',
    name: 'Space (空白鍵選漢字)',
    jpName: '変換',
    location: '「英数」與「かな」的中間',
    iconName: 'MoveHorizontal',
    tag: '漢字變換',
    description: '日文模式下，空白鍵的主要工作是把帶底線的假名「變換」成漢字。JIS 鍵盤的空白鍵比美式鍵盤短，是為了在兩側騰出「英数」與「かな」兩個鍵的位置。',
    howToUse: [
      '打完假名（還有底線、尚未確定）時按一下 Space：轉成最可能的漢字。',
      '再按一次 Space（或按 ↓）：打開候選字清單，用 Space／↑↓ 移動，或直接按候選字前面的數字鍵。',
      '選好後按 Return 確定；想放棄變換、回到假名，按 esc。',
      '注意：macOS 預設開啟「即時轉換（ライブ変換）」，打字時會自動變成漢字，不按 Space 也會轉換。初學者可以先關閉（見設定教學第 4 步），比較容易看懂每一步。'
    ],
    example: '打「nihon」出現「にほん」→ 按【Space】變成「日本」→ 按【Return】確定。'
  },
  {
    id: 'return_enter',
    name: 'Return (倒 L 形)',
    jpName: 'リターン（確定）',
    location: '鍵盤右側，橫跨兩排',
    iconName: 'CornerDownLeft',
    tag: '確定輸入',
    description: 'JIS 鍵盤的 Return 是橫跨兩排的倒 L 形（美式鍵盤是一排的長條形）。日文輸入時，打出來的字會先帶著底線（尚未確定），要按 Return 才會「確定」。',
    howToUse: [
      '文字還有底線時按 Return：確定目前的假名或漢字（底線消失），這一下不會換行。',
      '文字已經確定（沒有底線）時再按 Return：才是換行或送出。',
      '所以在聊天軟體裡常要按兩次 Return：第一次確定文字，第二次才送出訊息。'
    ],
    example: '打「toukyou」→ 按 Space 變「東京」→ 按【Return】確定；再按一次 Return 才換行。'
  },
  {
    id: 'at_key',
    name: '@ (小老鼠鍵)',
    jpName: 'アットマーク',
    location: 'P 鍵的右邊',
    iconName: 'AtSign',
    tag: '免按 Shift',
    description: '美式鍵盤要按 Shift＋2 才能打出「@」；JIS 鍵盤的 @ 是獨立按鍵，位在 P 的右邊，直接按就好。',
    howToUse: [
      '英文模式（英数）下直接按：輸出半形「@」。',
      'Shift＋@：輸出反引號「`」。',
      '日文模式（かな）下按會變成全形「＠」，打 Email 或帳號前記得先按【英数】。'
    ],
    example: '按【英数】→ 打「taro」→ 按【@】→ 打「example.com」。'
  },
  {
    id: 'colon_key',
    name: ': (冒號鍵)',
    jpName: 'コロン',
    location: 'L 鍵右邊的 ; 鍵再右側',
    iconName: 'Split',
    tag: '免按 Shift',
    description: '美式鍵盤要按 Shift＋; 才能打出冒號；JIS 鍵盤的分號「;」與冒號「:」是兩個獨立按鍵。',
    howToUse: [
      '直接按此鍵：輸出冒號「:」。',
      'Shift＋:：輸出星號「*」；Shift＋;：輸出加號「+」。',
      '其他和美式鍵盤不同的符號：Shift＋2 是「"」、Shift＋7 是「\'」、Shift＋8／9 是「(」「)」、Shift＋- 是「=」。'
    ],
    example: '打時間「12:30」時直接按【:】，不用按 Shift。'
  },
  {
    id: 'yen_key',
    name: '¥ (日圓符號鍵)',
    jpName: '円記号',
    location: 'delete 鍵的左邊',
    iconName: 'JapaneseYen',
    tag: '日圓／反斜線',
    description: 'JIS 鍵盤多了一顆「¥」鍵，直接按就能打出日圓符號。要注意：JIS 鍵盤上沒有獨立的反斜線「\\」鍵。',
    howToUse: [
      '直接按：輸出「¥」（日文模式下是全形「￥」）。',
      'Option＋¥：輸出反斜線「\\」，寫程式或輸入路徑時會用到。',
      'Shift＋¥：輸出直線「|」。',
      '常寫程式的話，可在「日文 - 羅馬字」輸入法設定中把「¥ 鍵輸入的字元」改成「\\」。'
    ],
    example: '按【¥】再打「1000」，得到「¥1000」。'
  },
  {
    id: 'control_key',
    name: 'control (A 鍵左側)',
    jpName: 'コントロール',
    location: 'A 鍵的左邊（美式鍵盤 caps lock 的位置）',
    iconName: 'Command',
    tag: '轉換快捷鍵',
    description: 'Apple 的 JIS 鍵盤把 control 放在 A 的左邊，caps lock 則移到左下角。小指不用移動就按得到 control，搭配日文輸入法的「轉換」快捷鍵非常順手。',
    howToUse: [
      '以下快捷鍵都要在文字「還有底線、尚未確定」時使用。',
      'Control＋K：轉成全形片假名；Control＋J：轉回平假名。',
      'Control＋;：轉成半形片假名；Control＋:：轉成半形英數。',
      '注意：Control＋Shift＋K 是把「輸入模式」切成片假名（之後打的字都變片假名），不是轉換已經打好的字。'
    ],
    example: '在日文模式打「konbini」出現「こんびに」→ 按【Control＋K】變成「コンビニ」→ 按 Return 確定。'
  }
];

export const MACOS_SETUP_STEPS: SetupStep[] = [
  {
    step: 1,
    title: '打開 macOS「系統設定」',
    desc: '點螢幕左上角的 Apple 選單  ➔「系統設定⋯」➔ 在左側列表找到「鍵盤」。',
    tip: '也可以按 Command＋Space 叫出 Spotlight，搜尋「鍵盤」。'
  },
  {
    step: 2,
    title: '進入「輸入方式」',
    desc: '在右側的「文字輸入」區塊中，點「輸入方式」旁邊的【編輯⋯】按鈕。',
    tip: '這裡會列出 Mac 目前啟用的所有輸入法。'
  },
  {
    step: 3,
    title: '新增「日文 - 羅馬字」',
    desc: '點左下角的【+】➔ 在搜尋欄輸入「日文」或「Japanese」➔ 選【日文】➔ 在右側選【羅馬字】➔ 點【加入】。',
    tip: '初學者請選「羅馬字（Romaji）」：用熟悉的英文字母拼出日語發音即可，不需要背鍵帽上的假名位置（那是「假名輸入」用的）。'
  },
  {
    step: 4,
    title: '（建議）關閉「即時轉換」',
    desc: '在同一個輸入方式視窗左側選【日文 - 羅馬字】，於右側選項中關閉【即時轉換】（Live Conversion／ライブ変換）。',
    tip: '即時轉換會在你打字時自動變成漢字；關掉後，改成自己按 Space 選漢字，更容易理解「假名 → Space → Return」的流程。熟悉後可以再打開。'
  },
  {
    step: 5,
    title: '實際測試一次！',
    desc: '打開「備忘錄」：按一下鍵盤上的【かな】，輸入「arigatou」看到「ありがとう」後按 Return 確定；再按一下【英数】，輸入「hello」。',
    tip: '記住：右手【かな】＝日文、左手【英数】＝英文。按哪個就是哪個模式，不會越按越亂。'
  }
];

// macOS Japanese IM shortcuts (see Apple's「日本語入力プログラムのキーボードショートカット」)
export const MAC_IME_SHORTCUTS: ImeShortcut[] = [
  {
    keys: 'Control + J（或 F6）',
    badge: '平假名',
    title: '轉換成平假名（ひらがな）',
    desc: '文字還有底線時按下，把整段變回平假名。'
  },
  {
    keys: 'Control + K（或 F7）',
    badge: '片假名',
    title: '轉換成全形片假名（カタカナ）',
    desc: '外來語必備：打「ko-hi-」出現「こーひー」後按下，變成「コーヒー」。'
  },
  {
    keys: 'Control + ;（或 F8）',
    badge: '半形片假',
    title: '轉換成半形片假名（ﾊﾝｶｸｶﾅ）',
    desc: '日本的銀行帳戶、表單姓名讀音常要求填寫「半角カナ」。'
  },
  {
    keys: 'Control + :（或 F10）',
    badge: '半形英數',
    title: '轉換成半形英數字',
    desc: '忘了按英数，把「youtube」打成「ようつべ」時，按下即可變回英文字母。'
  },
  {
    keys: 'Space / ↓',
    badge: '選漢字',
    title: '漢字變換／展開候選字清單',
    desc: '第一下轉成最可能的漢字，再按一次展開候選清單，可用數字鍵直接選字；按 Return 確定。'
  },
  {
    keys: 'esc',
    badge: '取消',
    title: '取消變換，回到假名',
    desc: '選錯漢字時按 esc 回到還沒變換的假名，重新再選。'
  },
  {
    keys: '英数 ×2 ／ かな ×2',
    badge: '反向轉換',
    title: '英文字母 ↔ 假名 互轉',
    desc: '確定前連按兩下「英数」把假名轉回英文字母；連按兩下「かな」把英文字母轉成假名。此功能依 macOS 版本與輸入法設定而定，沒有反應時請改用上面的 Control 快捷鍵。'
  }
];

export const MAC_KEYBOARD_LAYOUT_ROWS = [
  // Row 1: Number Row (JIS has no key left of 1; esc lives in the function row)
  [
    { code: 'Digit1', label: '1', shiftLabel: '!', kanaLabel: 'ぬ' },
    { code: 'Digit2', label: '2', shiftLabel: '"', kanaLabel: 'ふ' },
    { code: 'Digit3', label: '3', shiftLabel: '#', kanaLabel: 'あ' },
    { code: 'Digit4', label: '4', shiftLabel: '$', kanaLabel: 'う' },
    { code: 'Digit5', label: '5', shiftLabel: '%', kanaLabel: 'え' },
    { code: 'Digit6', label: '6', shiftLabel: '&', kanaLabel: 'お' },
    { code: 'Digit7', label: '7', shiftLabel: "'", kanaLabel: 'や' },
    { code: 'Digit8', label: '8', shiftLabel: '(', kanaLabel: 'ゆ' },
    { code: 'Digit9', label: '9', shiftLabel: ')', kanaLabel: 'よ' },
    { code: 'Digit0', label: '0', shiftLabel: '', kanaLabel: 'わ' },
    { code: 'Minus', label: '-', shiftLabel: '=', kanaLabel: 'ほ' },
    { code: 'Equal', label: '^', shiftLabel: '~', kanaLabel: 'へ' },
    { code: 'IntlYen', label: '¥', shiftLabel: '|', kanaLabel: 'ー', highlightId: 'yen_key' },
    { code: 'Backspace', label: 'delete', width: 'w-12 md:w-16', isSpecial: true }
  ],
  // Row 2: QWERTY Row
  [
    { code: 'Tab', label: 'tab', width: 'w-12 md:w-14', isSpecial: true },
    { code: 'KeyQ', label: 'Q', kanaLabel: 'た' },
    { code: 'KeyW', label: 'W', kanaLabel: 'て' },
    { code: 'KeyE', label: 'E', kanaLabel: 'い' },
    { code: 'KeyR', label: 'R', kanaLabel: 'す' },
    { code: 'KeyT', label: 'T', kanaLabel: 'か' },
    { code: 'KeyY', label: 'Y', kanaLabel: 'ん' },
    { code: 'KeyU', label: 'U', kanaLabel: 'な' },
    { code: 'KeyI', label: 'I', kanaLabel: 'に' },
    { code: 'KeyO', label: 'O', kanaLabel: 'ら' },
    { code: 'KeyP', label: 'P', kanaLabel: 'せ' },
    { code: 'BracketLeft', label: '@', shiftLabel: '`', kanaLabel: '゛', highlightId: 'at_key' },
    { code: 'BracketRight', label: '[', shiftLabel: '{', kanaLabel: '゜' },
    { code: 'EnterTop', label: 'return', width: 'w-10 md:w-12', isEnter: true, highlightId: 'return_enter' }
  ],
  // Row 3: Home Row
  [
    { code: 'ControlLeft', label: 'control', width: 'w-14 md:w-16', isSpecial: true, highlightId: 'control_key' },
    { code: 'KeyA', label: 'A', kanaLabel: 'ち' },
    { code: 'KeyS', label: 'S', kanaLabel: 'と' },
    { code: 'KeyD', label: 'D', kanaLabel: 'し' },
    { code: 'KeyF', label: 'F', kanaLabel: 'は' },
    { code: 'KeyG', label: 'G', kanaLabel: 'き' },
    { code: 'KeyH', label: 'H', kanaLabel: 'く' },
    { code: 'KeyJ', label: 'J', kanaLabel: 'ま' },
    { code: 'KeyK', label: 'K', kanaLabel: 'の' },
    { code: 'KeyL', label: 'L', kanaLabel: 'り' },
    { code: 'Semicolon', label: ';', shiftLabel: '+', kanaLabel: 'れ' },
    { code: 'Quote', label: ':', shiftLabel: '*', kanaLabel: 'け', highlightId: 'colon_key' },
    { code: 'Backslash', label: ']', shiftLabel: '}', kanaLabel: 'む' },
    { code: 'EnterBottom', label: 'return', width: 'w-12 md:w-14', isEnter: true, highlightId: 'return_enter' }
  ],
  // Row 4: Shift Row
  [
    { code: 'ShiftLeft', label: 'shift', width: 'w-16 md:w-20', isSpecial: true },
    { code: 'KeyZ', label: 'Z', kanaLabel: 'つ' },
    { code: 'KeyX', label: 'X', kanaLabel: 'さ' },
    { code: 'KeyC', label: 'C', kanaLabel: 'そ' },
    { code: 'KeyV', label: 'V', kanaLabel: 'ひ' },
    { code: 'KeyB', label: 'B', kanaLabel: 'こ' },
    { code: 'KeyN', label: 'N', kanaLabel: 'み' },
    { code: 'KeyM', label: 'M', kanaLabel: 'も' },
    { code: 'Comma', label: ',', shiftLabel: '<', kanaLabel: 'ね' },
    { code: 'Period', label: '.', shiftLabel: '>', kanaLabel: 'る' },
    { code: 'Slash', label: '/', shiftLabel: '?', kanaLabel: 'め' },
    { code: 'IntlRo', label: '_', shiftLabel: '_', kanaLabel: 'ろ' },
    { code: 'ShiftRight', label: 'shift', width: 'w-12 md:w-16', isSpecial: true }
  ],
  // Row 5: Space & Eisu/Kana Row (JIS: caps lock bottom-left, fn/globe next to the arrows)
  [
    { code: 'CapsLock', label: 'caps', width: 'w-10 md:w-12', isSpecial: true },
    { code: 'AltLeft', label: 'option', width: 'w-10 md:w-12', isSpecial: true },
    { code: 'MetaLeft', label: 'command', width: 'w-12 md:w-14', isSpecial: true },
    { code: 'Lang2', label: '英数', width: 'w-12 md:w-14', isSpecial: true, highlightId: 'eisu' },
    { code: 'Space', label: 'space / 変換', width: 'w-28 md:w-36 flex-grow', highlightId: 'space_kanji' },
    { code: 'Lang1', label: 'かな', width: 'w-12 md:w-14', isSpecial: true, highlightId: 'kana' },
    { code: 'MetaRight', label: 'command', width: 'w-12 md:w-14', isSpecial: true },
    { code: 'Fn', label: 'fn 🌐', width: 'w-10 md:w-12', isSpecial: true },
    { code: 'ArrowLeft', label: '◀', width: 'w-8' },
    { code: 'ArrowUpDown', label: '', width: 'w-8', isArrowStack: true },
    { code: 'ArrowRight', label: '▶', width: 'w-8' }
  ]
];
