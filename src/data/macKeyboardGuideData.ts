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

export const MAC_JIS_SPECIAL_KEYS: MacKeyGuideItem[] = [
  {
    id: 'eisu',
    name: '英数 (Eisu)',
    jpName: 'えいすう',
    location: '空白鍵（Space）的左邊',
    iconName: 'Type',
    tag: '神級按鍵 #1',
    description: '專門切換為「半形英數字輸入」。不管你剛才在打日文還是中文，只要大拇指輕敲一下「英数」，立刻就能輸入純英文！',
    howToUse: [
      '隨時按下「英数」，狀態列會立即跳為英數模式。',
      '不用再透過 Control + Space 或 CapsLock 猜測當前是在中文還是日文。',
      '在打網址、密碼或中英夾雜時極為順暢。'
    ],
    example: '打完「こんにちは」後，大拇指按【英数】，立刻就能接著打「Google.com」！'
  },
  {
    id: 'kana',
    name: 'かな (Kana)',
    jpName: 'かな',
    location: '空白鍵（Space）的右邊',
    iconName: 'Languages',
    tag: '神級按鍵 #2',
    description: '專門切換為「日文平假名輸入」。打字時右手大拇指一按，立即進入日語輸入狀態，與左側「英数」鍵形成天衣無縫的雙手盲打體系！',
    howToUse: [
      '按一下「かな」，輸入法直接鎖定為日文羅馬字輸入（Hiragana）。',
      '輸入羅馬字拼音（如 arigatou）會即時轉化為平假名「ありがとう」。',
      '在日文模式下連按兩次「かな」鍵，還可以快速在全形與半形假名間調度。'
    ],
    example: '按一下【かな】，鍵盤輸入「sushi」，螢幕立即顯示「すし」！'
  },
  {
    id: 'space_kanji',
    name: 'Space (空白鍵選漢字)',
    jpName: '変換・空白',
    location: '「英数」與「かな」的中間',
    iconName: 'MoveHorizontal',
    tag: '核心轉換鍵',
    description: '日語鍵盤的空白鍵較美式短，因為它承擔了「漢字變換（Convert）」的最核心重任！',
    howToUse: [
      '輸入假名後，按下一次空白鍵，macOS 會自動將假名轉為最符合語境的「漢字」。',
      '如果不是你要的漢字，再按一次空白鍵，會彈出候選漢字清單。',
      '可以用空白鍵或上下鍵滾動選擇，選定後按 Return 確認！'
    ],
    example: '打「nihon」出現「にほん」，按一下【Space】，立即化為「日本」！'
  },
  {
    id: 'return_enter',
    name: '倒 L 形巨大 Return 鍵',
    jpName: 'リターン・確定キー',
    location: '鍵盤右側，橫跨兩排',
    iconName: 'CornerDownLeft',
    tag: '防誤觸神器',
    description: '日式鍵盤最醒目的標誌！由於日語輸入法具有「未定輸入（虛線下劃線）」的特性，巨大倒 L Return 讓右手小指隨手一敲就能迅速「確定字詞」，防止選字跑掉。',
    howToUse: [
      '打完假名或漢字後，按【Return】確認字詞（去掉下劃虛線）。',
      '在已經確認字詞的狀態下，按【Return】才是文章換行。',
      '手感極度俐落紮實，是日本程式設計師與文字工作者的最愛。'
    ],
    example: '打「tokyo」按 Space 變「東京」，小指按下【Return】，字詞瞬間確定！'
  },
  {
    id: 'at_key',
    name: '@ (艾特 / 小老鼠鍵)',
    jpName: 'アットマーク',
    location: 'P 鍵的右邊（免按 Shift！）',
    iconName: 'AtSign',
    tag: '極致便利用戶',
    description: '在美式鍵盤上要打「@」必須按 Shift + 2；而在日式鍵盤上，@ 是一個獨立按鍵！只要單手敲一下 P 右邊的鍵就能打出 @。',
    howToUse: [
      '直接單按此鍵即可輸出「@」。',
      '配合 Shift 按下，輸出濁點記號或引號。',
      '輸入 Email、社群帳號（如 @username）或編程時極為神速。'
    ],
    example: '敲一下【@】，立刻輸入「@」，完全不需組合鍵！'
  },
  {
    id: 'colon_key',
    name: ': (冒號鍵)',
    jpName: 'コロン',
    location: 'L 鍵右邊的 ; 鍵再右側',
    iconName: 'Split',
    tag: '免 Shift 特殊鍵',
    description: '在美式鍵盤上，冒號「:」必須按 Shift + ;。但在日式鍵盤上，分號「;」與冒號「:」是兩個分開的獨立按鍵！',
    howToUse: [
      '直接按下此鍵即可輸出冒號「:」。',
      '配合 Shift 按下可輸出星號「*」。',
      '打時間（如 12:30）或寫代碼時不用頻繁切換 Shift。'
    ],
    example: '直接按【:】，立刻輸入「:」。'
  },
  {
    id: 'yen_key',
    name: '¥ (日圓符號鍵)',
    jpName: '円記号・バックスラッシュ',
    location: 'Backspace (Delete) 鍵的左邊',
    iconName: 'JapaneseYen',
    tag: '日幣專屬鍵',
    description: '專門輸入日圓幣值符號「¥」。配合 Option 或在程式碼環境中亦可對應反斜線（\\）。',
    howToUse: [
      '在日文輸入法下按下此鍵，直接打出「¥」。',
      '在購買商品、紀錄價格或算帳時無比順手。'
    ],
    example: '按下【¥】再按「1000」，輕鬆打出「¥1000」！'
  },
  {
    id: 'control_key',
    name: 'control (A 鍵左側)',
    jpName: 'コントロールキー',
    location: '原本 CapsLock 的黃金位置',
    iconName: 'Command',
    tag: '極限人體工學',
    description: '許多 MacBook JIS 鍵盤將 control 鍵放在 A 的左邊（或大寫鎖定下方）。這源自 Unix 與早期 Apple 終端機傳統，小指不用位移即可輕鬆觸發各種組合鍵！',
    howToUse: [
      'Control + Shift + J：迅速轉為平假名。',
      'Control + Shift + K：迅速轉為全形片假名。',
      'Control + Shift + ;：迅速轉為半形片假名。'
    ],
    example: '打「konbini」按下【Control + Shift + K】，直接轉為「コンビニ」！'
  }
];

export const MACOS_SETUP_STEPS: SetupStep[] = [
  {
    step: 1,
    title: '打開 macOS「系統設定」',
    desc: '點擊螢幕左上角 Apple 標誌  ➔ 選擇「系統設定（System Settings）」➔ 在左側滾動選單找到「鍵盤（Keyboard）」。',
    tip: '也可以直接按 Command + Space 呼叫 Spotlight 搜尋「鍵盤」。'
  },
  {
    step: 2,
    title: '進入文字輸入方式',
    desc: '在右側的「文字輸入（Text Input）」區塊中，點擊「輸入方式（Input Sources）」旁邊的【編輯...】（Edit...）按鈕。',
    tip: '這裡會列出你 Mac 目前所有已啟用的語言。'
  },
  {
    step: 3,
    title: '新增「日本語 - 羅馬字」',
    desc: '點擊左下角的【+】按鈕 ➔ 在左側語言搜尋欄輸入「日文」或「Japanese」➔ 選擇【日本語】➔ 在右側勾選【羅馬字（Romaji）】➔ 點擊【加入】。',
    tip: '初學者請務必選擇「羅馬字（Romaji）」，用我們熟悉的英文字母拼寫日語發音即可，不需要死記假名鍵盤！'
  },
  {
    step: 4,
    title: '日式鍵盤神級測試！',
    desc: '打開任何記事本或備忘錄：大拇指按一下鍵盤上的【かな】鍵，輸入「arigatou」看它變成「ありがとう」；按一下【英数】鍵，立刻輸入「hello」！',
    tip: '恭喜！從現在起你的右手【かな】＝日文、左手【英数】＝英文，完全不需切換鍵！'
  }
];

export const MAC_KEYBOARD_LAYOUT_ROWS = [
  // Row 1: Number Row
  [
    { code: 'Escape', label: 'esc', width: 'w-10 md:w-12', isSpecial: false },
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
    { code: 'Equal', label: '^', shiftLabel: '~', kanaLabel: 'へ', highlightId: 'hat_key' },
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
  // Row 5: Space & Eisu/Kana Row
  [
    { code: 'Fn', label: 'fn', width: 'w-9 md:w-10' },
    { code: 'AltLeft', label: 'option', width: 'w-9 md:w-10' },
    { code: 'MetaLeft', label: 'command', width: 'w-12 md:w-14' },
    { code: 'Lang2', label: '英数', width: 'w-12 md:w-14', isSpecial: true, highlightId: 'eisu' },
    { code: 'Space', label: 'space / 変換', width: 'w-28 md:w-36 flex-grow', highlightId: 'space_kanji' },
    { code: 'Lang1', label: 'かな', width: 'w-12 md:w-14', isSpecial: true, highlightId: 'kana' },
    { code: 'MetaRight', label: 'command', width: 'w-12 md:w-14' },
    { code: 'AltRight', label: 'option', width: 'w-9 md:w-10' },
    { code: 'ArrowLeft', label: '◀', width: 'w-8' },
    { code: 'ArrowUp', label: '▲', width: 'w-8' },
    { code: 'ArrowRight', label: '▶', width: 'w-8' }
  ]
];
