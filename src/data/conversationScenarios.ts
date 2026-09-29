// Duolingo-style Video Call Conversation Scenarios

import { CallScenario } from '../types';

export const CONVERSATION_SCENARIOS: CallScenario[] = [
  {
    id: 'first-meeting',
    title: '初次見面・自我介紹',
    titleJa: '初めまして・自己紹介',
    category: '日常交際',
    description: '與日本朋友 Sakura 第一次通視訊電話，練習最道地的問候、互通姓名與分享興趣！',
    level: 'N5',
    difficulty: 'Beginner',
    tutorName: 'さくら (Sakura)',
    tutorAvatar: 'sakura',
    tutorRole: '東京的大學生朋友',
    background: 'bg-gradient-to-b from-rose-900/40 to-slate-900',
    startNodeId: 'node_intro',
    keyVocabulary: [
      { word: '初めまして', reading: 'はじめまして', meaning: '初次見面（第一句寒暄）' },
      { word: '名前', reading: 'なまえ', meaning: '名字' },
      { word: '～と申します', reading: '～ともうします', meaning: '我叫作～（禮貌說法）' },
      { word: 'よろしくお願いします', reading: 'よろしくおねがいします', meaning: '請多多指教' }
    ],
    grammarPoints: [
      {
        title: '【名詞】＋ です',
        pattern: '私は [名字] です。',
        explanation: '日語中最基礎且實用的「我是……」肯定句型。'
      },
      {
        title: '【動詞】＋ て形 + 嬉しいです',
        pattern: 'お会いできて嬉しいです。',
        explanation: '表示「很高興能與您相遇/認識您」。'
      }
    ],
    nodes: {
      node_intro: {
        id: 'node_intro',
        tutorSpeech: 'こんにちは！初めまして！私の名前はさくらです。あなたのお名前は何ですか？',
        tutorFurigana: 'こんにちは！<ruby>初<rt>はじ</rt></ruby>めまして！<ruby>私<rt>わたし</rt></ruby>の<ruby>名前<rt>なまえ</rt></ruby>はさくらです。あなたのお<ruby>名前<rt>なまえ</rt></ruby>は<ruby>何<rt>なん</rt></ruby>ですか？',
        tutorRomaji: 'Konnichiwa! Hajimemashite! Watashi no namae wa Sakura desu. Anata no onamae wa nan desu ka?',
        tutorTranslation: '你好！初次見面！我的名字是 Sakura。請問你的名字是？',
        suggestedResponses: [
          {
            label: '初次見面！我是健（Ken）',
            japanese: '初めまして！健です。よろしくお願いします！',
            furigana: '<ruby>初<rt>はじ</rt></ruby>めまして！<ruby>健<rt>けん</rt></ruby>です。よろしくお<ruby>願<rt>ねが</rt></ruby>いします！',
            romaji: 'Hajimemashite! Ken desu. Yoroshiku onegaishimasu!',
            meaning: '初次見面！我是健。請多多指教！',
            nextNodeId: 'node_hometown',
            xp: 20
          },
          {
            label: '我叫 Leo，請多指教',
            japanese: 'レオと申します。さくらさん、よろしくお願いします！',
            furigana: 'レオと<ruby>申<rt>もう</rt></ruby>します。さくらさん、よろしくお<ruby>願<rt>ねが</rt></ruby>いします！',
            romaji: 'Reo to moushimasu. Sakura-san, yoroshiku onegaishimasu!',
            meaning: '我叫 Leo。Sakura小姐，請多多指教！',
            nextNodeId: 'node_hometown',
            xp: 25
          },
          {
            label: '初次見面，很高興認識你',
            japanese: '初めまして！お会いできて嬉しいです！',
            furigana: '<ruby>初<rt>はじ</rt></ruby>めまして！お<ruby>会<rt>あ</rt></ruby>いできて<ruby>嬉<rt>うれ</rt></ruby>しいです！',
            romaji: 'Hajimemashite! Oaidekite ureshii desu!',
            meaning: '初次見面！很高興能認識你！',
            nextNodeId: 'node_hometown',
            xp: 20
          }
        ]
      },
      node_hometown: {
        id: 'node_hometown',
        tutorSpeech: 'よろしくね！日本語がお上手ですね！どちらから来ましたか？台湾ですか？',
        tutorFurigana: 'よろしくね！<ruby>日本語<rt>にほんご</rt></ruby>がお<ruby>上手<rt>じょうず</rt></ruby>ですね！どちらから<ruby>来<rt>き</rt></ruby>ましたか？<ruby>台湾<rt>たいわん</rt></ruby>ですか？',
        tutorRomaji: 'Yoroshiku ne! Nihongo ga ojouzu desu ne! Dochira kara kimashita ka? Taiwan desu ka?',
        tutorTranslation: '請多指教呀！你的日語說得真好呢！請問你來自哪裡呢？是台灣嗎？',
        suggestedResponses: [
          {
            label: '是的，我來自台灣！',
            japanese: 'はい！台湾から来ました。台北に住んでいます。',
            furigana: 'はい！<ruby>台湾<rt>たいわん</rt></ruby>から<ruby>来<rt>き</rt></ruby>ました。<ruby>台北<rt>たいぺい</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいます。',
            romaji: 'Hai! Taiwan kara kimashita. Taipei ni sunde imasu.',
            meaning: '是的！我來自台灣，目前住在台北。',
            nextNodeId: 'node_hobby',
            xp: 25
          },
          {
            label: '沒錯，我剛開始學日文',
            japanese: 'はい、台湾人です。日語の勉強を始めたばかりです！',
            furigana: 'はい、<ruby>台湾人<rt>たいわんじん</rt></ruby>です。<ruby>日本語<rt>にほんご</rt></ruby>の<ruby>勉強<rt>べんきょう</rt></ruby>を<ruby>始<rt>はじ</rt></ruby>めたばかりです！',
            romaji: 'Hai, Taiwanjin desu. Nihongo no benkyou o hajimeta bakari desu!',
            meaning: '是的，我是台灣人。才剛剛開始學日語呢！',
            nextNodeId: 'node_hobby',
            xp: 30
          }
        ]
      },
      node_hobby: {
        id: 'node_hobby',
        tutorSpeech: '台湾！台湾の小籠包やタピオカミルクティーが大好きです！日本の文化やアニメにも興味がありますか？',
        tutorFurigana: '<ruby>台湾<rt>たいわん</rt></ruby>！<ruby>台湾<rt>たいわん</rt></ruby>の<ruby>小籠包<rt>しょうろんぽう</rt></ruby>やタピオカミルクティーが<ruby>大好<rt>だいす</rt></ruby>きです！<ruby>日本<rt>にほん</rt></ruby>の<ruby>文化<rt>ぶんか</rt></ruby>やアニメにも<ruby>興味<rt>きょうみ</rt></ruby>がありますか？',
        tutorRomaji: 'Taiwan! Taiwan no shouronpou ya tapioka mirukutii ga daisuki desu! Nihon no bunka ya anime ni mo kyoumi ga arimasu ka?',
        tutorTranslation: '台灣！我超級喜歡台灣的小籠包和珍珠奶茶！你對日本文化或動漫也有興趣嗎？',
        suggestedResponses: [
          {
            label: '我很喜歡動漫與音樂',
            japanese: 'はい！日本のアニメやJ-POPが大好きです！',
            furigana: 'はい！<ruby>日本<rt>にほん</rt></ruby>のアニメやJ-POPが<ruby>大好<rt>だいす</rt></ruby>きです！',
            romaji: 'Hai! Nihon no anime ya Jei-poppu ga daisuki desu!',
            meaning: '是的！我非常喜歡日本動漫和 J-POP 音樂！',
            nextNodeId: 'node_wrapup',
            xp: 25
          },
          {
            label: '我喜歡日本的美食與旅遊',
            japanese: '日本食が大好きです！ラーメンやお寿司をよく食べます。',
            furigana: '<ruby>日本食<rt>にほんしょく</rt></ruby>が<ruby>大好<rt>だいす</rt></ruby>きです！ラーメンやお<ruby>寿司<rt>すし</rt></ruby>をよく<ruby>食<rt>た</rt></ruby>べます。',
            romaji: 'Nihonshoku ga daisuki desu! Raamen ya osushi o yoku tabemasu.',
            meaning: '我非常喜歡日本料理！常常吃拉麵和壽司。',
            nextNodeId: 'node_wrapup',
            xp: 25
          }
        ]
      },
      node_wrapup: {
        id: 'node_wrapup',
        tutorSpeech: 'すごい！共通の話題がたくさんあって嬉しいです！これから一緒に楽しく日本語を練習しましょうね！',
        tutorFurigana: 'すごい！<ruby>共通<rt>きょうつう</rt></ruby>の<ruby>話題<rt>わだい</rt></ruby>がたくさんあって<ruby>嬉<rt>うれ</rt></ruby>しいです！これから<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>楽<rt>たの</rt></ruby>しく<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>練習<rt>れんしゅう</rt></ruby>しましょうね！',
        tutorRomaji: 'Sugoi! Kyoutsuu no wadai ga takusan atte ureshii desu! Kore kara issho ni tanoshiku nihongo o renshuu shimashou ne!',
        tutorTranslation: '太棒了！有好多共同話題真開心！今後我們一起快樂地練習日語吧！',
        suggestedResponses: [
          {
            label: '好啊！謝謝你，下次見！',
            japanese: 'はい！ありがとうございます。またお話ししましょう！',
            furigana: 'はい！ありがとうございます。またお<ruby>話<rt>はな</rt></ruby>ししましょう！',
            romaji: 'Hai! Arigatou gozaimasu. Mata ohanashi shimashou!',
            meaning: '好的！非常謝謝你。我們下次再聊喔！',
            nextNodeId: 'call_complete',
            xp: 30
          }
        ]
      }
    }
  },
  {
    id: 'tokyo-cafe',
    title: '東京咖啡廳點餐實戰',
    titleJa: 'カフェでの注文',
    category: '餐廳與購物',
    description: '在澀谷時髦的咖啡廳，練習點咖啡、選擇冰/熱、甜度尺寸以及內用或外帶！',
    level: 'N5',
    difficulty: 'Beginner',
    tutorName: '店員 健二 (Kenji)',
    tutorAvatar: 'kenji',
    tutorRole: '澀谷星巴克風格咖啡店員',
    background: 'bg-gradient-to-b from-amber-900/40 to-stone-900',
    startNodeId: 'cafe_welcome',
    keyVocabulary: [
      { word: 'ご注文', reading: 'ごちゅうもん', meaning: '您的點餐' },
      { word: 'アイスコーヒー', reading: 'あいすこーひー', meaning: '冰咖啡' },
      { word: 'ホット', reading: 'ほっと', meaning: '熱的' },
      { word: '店内', reading: 'てんない', meaning: '內用' },
      { word: 'お持ち帰り', reading: 'おもちかえり', meaning: '外帶' }
    ],
    grammarPoints: [
      {
        title: '【名詞】＋ をお願いします / をください',
        pattern: 'アイスコーヒーを一つお願いします。',
        explanation: '在餐廳向店員點餐的最核心萬用句型（請給我一個～）。'
      }
    ],
    nodes: {
      cafe_welcome: {
        id: 'cafe_welcome',
        tutorSpeech: 'いらっしゃいませ！こんにちは！ご注文はお決まりでしょうか？',
        tutorFurigana: 'いらっしゃいませ！こんにちは！ご<ruby>注文<rt>ちゅうもん</rt></ruby>はお<ruby>決<rt>き</rt></ruby>まりでしょうか？',
        tutorRomaji: 'Irasshaimase! Konnichiwa! Gochuumon wa okimari deshou ka?',
        tutorTranslation: '歡迎光臨！你好！請問您決定好要點什麼了嗎？',
        suggestedResponses: [
          {
            label: '請給我一杯冰拿鐵',
            japanese: 'アイスラテを一つお願いします。',
            furigana: 'アイスラテを<ruby>一<rt>ひと</rt></ruby>つお<ruby>願<rt>ねが</rt></ruby>いします。',
            romaji: 'Aisu rate o hitotsu onegaishimasu.',
            meaning: '請給我一杯冰拿鐵。',
            nextNodeId: 'cafe_size',
            xp: 25
          },
          {
            label: '請給我熱美式咖啡',
            japanese: 'ホットコーヒーのトールサイズをください。',
            furigana: 'ホットコーヒーのトールサイズをください。',
            romaji: 'Hotto koohii no tooru saizu o kudasai.',
            meaning: '請給我一杯熱美式咖啡，中杯（Tall）。',
            nextNodeId: 'cafe_eatin',
            xp: 30
          }
        ]
      },
      cafe_size: {
        id: 'cafe_size',
        tutorSpeech: 'かしこまりました。サイズはいかがなさいますか？ショート、トール、グランデがございます。',
        tutorFurigana: 'かしこまりました。サイズはいかがなさいますか？ショート、トール、グランデがございます。',
        tutorRomaji: 'Kashikomarimashita. Saizu wa ikaga nasaimasu ka? Shoot, tooru, gurande ga gozaimasu.',
        tutorTranslation: '好的明白了。請問尺寸要哪一種呢？我們有小杯（Short）、中杯（Tall）和大杯（Grande）。',
        suggestedResponses: [
          {
            label: '中杯（Tall）就好，謝謝',
            japanese: 'トールサイズでお願いします！',
            furigana: 'トールサイズでお<ruby>願<rt>ねが</rt></ruby>いします！',
            romaji: 'Tooru saizu de onegaishimasu!',
            meaning: '麻煩給我中杯（Tall），謝謝！',
            nextNodeId: 'cafe_eatin',
            xp: 25
          }
        ]
      },
      cafe_eatin: {
        id: 'cafe_eatin',
        tutorSpeech: '店内でお召し上がりですか？それともお持ち帰り（テイクアウト）ですか？',
        tutorFurigana: '<ruby>店内<rt>てんない</rt></ruby>でお<ruby>召<rt>め</rt></ruby>し<ruby>上<rt>あ</rt></ruby>がりですか？それともお<ruby>持<rt>も</rt></ruby>ち<ruby>帰<rt>かえ</rt></ruby>りですか？',
        tutorRomaji: 'Tennai de omeshiagari desu ka? Soretomo omochikaeri desu ka?',
        tutorTranslation: '請問您要在店內享用（內用）？還是要外帶呢？',
        suggestedResponses: [
          {
            label: '我要內用',
            japanese: '店内でお願いします。',
            furigana: '<ruby>店内<rt>てんない</rt></ruby>でお<ruby>願<rt>ねが</rt></ruby>いします。',
            romaji: 'Tennai de onegaishimasu.',
            meaning: '麻煩內用。',
            nextNodeId: 'cafe_pay',
            xp: 25
          },
          {
            label: '我要外帶',
            japanese: 'お持ち帰りでお願いします。',
            furigana: 'お<ruby>持<rt>も</rt></ruby>ち<ruby>帰<rt>かえ</rt></ruby>りでお<ruby>願<rt>ねが</rt></ruby>いします。',
            romaji: 'Omochikaeri de onegaishimasu.',
            meaning: '麻煩外帶。',
            nextNodeId: 'cafe_pay',
            xp: 25
          }
        ]
      },
      cafe_pay: {
        id: 'cafe_pay',
        tutorSpeech: 'ありがとうございます！合計で540円になります。お支払いは交通系ICカード（Suica）も使えますよ。',
        tutorFurigana: 'ありがとうございます！<ruby>合計<rt>ごうけい</rt></ruby>で540<ruby>円<rt>えん</rt></ruby>になります。お<ruby>支払<rt>しはら</rt></ruby>いは<ruby>交通系<rt>こうつうけい</rt></ruby>ICカードも<ruby>使<rt>つか</rt></ruby>えますよ。',
        tutorRomaji: 'Arigatou gozaimasu! Goukei de gohyaku yonjuu en ni narimasu. Oshiharai wa koutsuukei aishii kaado mo tsukaemasu yo.',
        tutorTranslation: '非常感謝！總共是 540 日圓。結帳也可以使用交通卡（例如 Suica 西瓜卡）喔。',
        suggestedResponses: [
          {
            label: '請用 Suica 付款',
            japanese: 'Suicaで支払います。これでお願いします！',
            furigana: 'Suicaで<ruby>支払<rt>しはら</rt></ruby>います。これでお<ruby>願<rt>ねが</rt></ruby>いします！',
            romaji: 'Suica de shiharaimasu. Kore de onegaishimasu!',
            meaning: '我用 Suica 刷卡，麻煩你了！',
            nextNodeId: 'call_complete',
            xp: 30
          }
        ]
      }
    }
  },
  {
    id: 'convenience-store',
    title: '日本便利商店生存實戰',
    titleJa: 'コンビニでの買い物',
    category: '日常生存',
    description: '走進 7-11 或全家，聽懂店員問「要不要加熱便當」、「要不要塑膠袋」等超高頻日語！',
    level: 'N5',
    difficulty: 'Beginner',
    tutorName: '店員 ユキ (Yuki)',
    tutorAvatar: 'yuki',
    tutorRole: '親切的便利商店店員',
    background: 'bg-gradient-to-b from-blue-900/40 to-slate-900',
    startNodeId: 'konbini_welcome',
    keyVocabulary: [
      { word: 'お弁当', reading: 'おべんとう', meaning: '便當' },
      { word: '温めますか', reading: 'あたためますか', meaning: '要加熱嗎？' },
      { word: 'レジ袋', reading: 'れじぶくろ', meaning: '塑膠購物袋' },
      { word: '大丈夫です', reading: 'だいじょうぶです', meaning: '沒關係/不需要/可以' }
    ],
    grammarPoints: [
      {
        title: '大丈夫です（不需要的婉轉拒絕）',
        pattern: 'いいえ、大丈夫です。',
        explanation: '日本人最常使用的婉拒口吻，比直接說「要りません（不要）」更加自然禮貌。'
      }
    ],
    nodes: {
      konbini_welcome: {
        id: 'konbini_welcome',
        tutorSpeech: 'いらっしゃいませ〜！お弁当はこちらで温めますか？',
        tutorFurigana: 'いらっしゃいませ〜！お<ruby>弁当<rt>べんとう</rt></ruby>はこちらで<ruby>温<rt>あたた</rt></ruby>めますか？',
        tutorRomaji: 'Irasshaimase~! Obentou wa kochira de atatamemasu ka?',
        tutorTranslation: '歡迎光臨～！便當需要在這裡幫您加熱微波嗎？',
        suggestedResponses: [
          {
            label: '好的，麻煩幫我加熱！',
            japanese: 'はい、お願いします！',
            furigana: 'はい、お<ruby>願<rt>ねが</rt></ruby>いします！',
            romaji: 'Hai, onegaishimasu!',
            meaning: '好的，請幫我加熱！',
            nextNodeId: 'konbini_bag',
            xp: 20
          },
          {
            label: '不用了，沒關係！',
            japanese: 'あ、大丈夫です。そのままでいいです。',
            furigana: 'あ、<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>です。そのままでいいです。',
            romaji: 'A, daijoubu desu. Sonomama de ii desu.',
            meaning: '啊，不用了沒關係，這樣就可以了。',
            nextNodeId: 'konbini_bag',
            xp: 25
          }
        ]
      },
      konbini_bag: {
        id: 'konbini_bag',
        tutorSpeech: 'かしこまりました。レジ袋はご利用になりますか？3円になりますが。',
        tutorFurigana: 'かしこまりました。レジ<ruby>袋<rt>ぶくろ</rt></ruby>はご<ruby>利用<rt>りよう</rt></ruby>になりますか？3<ruby>円<rt>えん</rt></ruby>になりますが。',
        tutorRomaji: 'Kashikomarimashita. Rejibukuro wa goriyou ni narimasu ka? San en ni narimasu ga.',
        tutorTranslation: '好的明白了。請問需要塑膠袋嗎？一個是 3 日圓。',
        suggestedResponses: [
          {
            label: '請給我一個塑膠袋',
            japanese: '袋を一枚お願いします。',
            furigana: '<ruby>袋<rt>ふくろ</rt></ruby>を<ruby>一枚<rt>いちまい</rt></ruby>お<ruby>願<rt>ねが</rt></ruby>いします。',
            romaji: 'Fukuro o ichimai onegaishimasu.',
            meaning: '請給我一個袋子，謝謝。',
            nextNodeId: 'konbini_chicken',
            xp: 25
          },
          {
            label: '不用袋子，我有環保袋',
            japanese: '袋はいりません。大丈夫です。',
            furigana: '<ruby>袋<rt>ふくろ</rt></ruby>はいりません。<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>です。',
            romaji: 'Fukuro wa irimasen. Daijoubu desu.',
            meaning: '不需要袋子，沒關係。',
            nextNodeId: 'konbini_chicken',
            xp: 25
          }
        ]
      },
      konbini_chicken: {
        id: 'konbini_chicken',
        tutorSpeech: 'レジ横のホットスナック、揚げたてのファミチキ（からあげ）もいかがですか？',
        tutorFurigana: 'レジ<ruby>横<rt>よこ</rt></ruby>のホットスナック、<ruby>揚<rt>あ</rt></ruby>げたてのからあげもいかがですか？',
        tutorRomaji: 'Reji yoko no hotto sunakku, agetate no karaage mo ikaga desu ka?',
        tutorTranslation: '結帳櫃台旁邊的炸物點心、現炸剛起鍋的日式炸雞也來一份嗎？',
        suggestedResponses: [
          {
            label: '哇太誘人了，請給我一份炸雞！',
            japanese: '美味しそうですね！からあげを一つください！',
            furigana: '<ruby>美味<rt>おい</rt></ruby>しそうですね！からあげを<ruby>一<rt>ひと</rt></ruby>つください！',
            romaji: 'Oishisou desu ne! Karaage o hitotsu kudasai!',
            meaning: '看起來好好吃喔！請給我一份炸雞！',
            nextNodeId: 'call_complete',
            xp: 30
          },
          {
            label: '今天先不用了，謝謝',
            japanese: '今日は大丈夫です。ありがとう！',
            furigana: '<ruby>今日<rt>きょう</rt></ruby>は<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>です。ありがとう！',
            romaji: 'Kyou wa daijoubu desu. Arigatou!',
            meaning: '今天先不用了，謝謝！',
            nextNodeId: 'call_complete',
            xp: 20
          }
        ]
      }
    }
  }
];
