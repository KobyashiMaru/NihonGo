# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project priorities

NihonGo! (日語通) is a browser-only Japanese learning app for one learner: a Traditional Chinese (Taiwan) speaker starting from zero (still learning kana), on a MacBook with an Apple Magic Keyboard in JIS layout, aiming for JLPT N3/N2. They test in **Brave**. Make trade-offs in this order:

1. **Does it help the learner study Japanese?** Design for a beginner first (see "Learner-facing conventions").
2. **Does it keep the repo easy to extend and maintain?** New features should fit the existing data → service → component split without touching unrelated modules.

## Commands

```bash
npm install
npm run dev                      # Vite dev server, http://localhost:5173
npm run build                    # tsc -b (type check) + vite build — the main correctness gate
npm run lint                     # oxlint over the whole repo
npx oxlint src/components/kana   # lint only the paths you touched
npm run preview                  # serve the production build
```

The user often already runs `npm run dev` in their own terminal; check port 5173 before starting another server (`.claude/launch.json` has the `dev` preview config).

There is no test framework. To verify a change, run `npx tsc -b`, then oxlint on the touched files (the repo already has warnings; add no new ones), then try the feature in the browser. To check pure logic in `src/data` or `src/services`, import it from the browser console while the dev server is running, for example `await import('/src/data/kanaFlashcardData.ts')`.

The dev server on 5173 is the user's real origin: their XP, kana schedule and uploaded documents live in its localStorage / IndexedDB. Run tests that create data (study sessions, uploads) on a second server on another port, for example `npm run dev -- --port 5174 --strictPort`. The Claude desktop browser pane cannot display PDFs; navigating it to a PDF URL opens a save dialog on the user's screen.

## Architecture

**Single page, no router.** `App.tsx` holds `currentTab: NavTab` and renders one module at a time. To add a module:
1. Add the id to the `NavTab` union and an entry to `navItems` in `components/layout/Sidebar.tsx`.
2. Add the render branch in `App.tsx`.
3. Optionally link it from the roadmap: add a module to a stage in `data/jlptCurriculum.ts` (extend its `type` union) and map that type in `App`'s `onSelectModule`.
4. Update `README.md` (written in Traditional Chinese): the feature list and the directory tree.

Modules don't import each other's screens. A module that links to another receives a callback from `App`, for example `KanaFlashcards`' `onOpenDocument(docId)`, which switches to the library tab with that document open. Heavy, rarely used tabs are loaded with `React.lazy` in `App` (the library does this so `marked` and DOMPurify stay out of the main bundle).

**Layering.** Follow this split for new code. The kana flashcards module is the reference example: `data/kanaFlashcardData.ts` → `services/kanaSrsService.ts` → `components/kana/`.
- `src/data/*.ts`: typed static content (call scenarios, four-skills exercises, curriculum, kana). Add content by adding data objects, not by editing components.
- `src/services/*.ts`: logic that does not depend on React, plus module-level singletons (`speechService`, `localRecognizer`, `soundEffects`), persistence and scheduling. Keep pure functions here so they can be checked without the UI.
- `src/components/<module>/`: React screens. Split a module into a container (menu, state, persistence) and focused child components, as `components/kana/` does (`KanaFlashcards` → `KanaStudySession` → `KanaCardDetails`). The older screens keep every sub-feature in one file (`videocall/VideoCallScreen.tsx` ~900 lines, `skills/FourSkillsHub.tsx` ~600 lines). When you make substantial changes there, extract the sub-feature into its own file the same way.
- `src/types/index.ts`: shared types (`UserProgress`, `CallScenario`, `KanaCharacter`, …). Types used by only one module live next to that module's data or service.

**State and persistence.**
- `UserProgress` (XP, streak, level, settings) lives in `App`. `storageService` saves it to the localStorage key `nihongo_user_progress_v1`. Modules receive `onEarnXP(amount)`, a functional update that is safe to call several times in a row, plus `progress.settings` when they need it.
- Give a module's own data its own versioned localStorage key, managed by its service, instead of growing `UserProgress`. Example: `kanaSrsService` uses `nihongo_kana_srs_v1` and `nihongo_kana_prefs_v1`. Wrap storage reads and writes in try/catch like the existing services do.
- Files go in IndexedDB, not localStorage: `docLibraryService` stores uploaded documents (with the original `Blob`) in the database `nihongo_library_v1`.
- Several `UserProgress` fields are placeholders that nothing updates or reads:
  - `streak`, `lastActiveDate`, `completedLessons` and `masteredKana` only ever hold their default values.
  - `settings.autoSpeak` and `settings.micEnabled` are never read.
  - `settings.geminiApiKey` is saved by the settings modal but never used.
  - `showFurigana`, `showRomaji` and `showTranslation` only set the initial toggles in `VideoCallScreen`.

  Don't assume any of these work. If a feature needs one, wire it up deliberately.

**Speech pipeline** (`services/speechService.ts`, singleton `speechService`):
- **TTS.** `speak(text)` uses Web Speech synthesis in `ja-JP`, prefers the Kyoko or Otoya voice, and strips ruby markup first. The default rate comes from `settings.speechRate`, applied in an `App` effect. The navbar mute button only mutes `soundEffects`, not TTS.
- **STT.** `startListening(callbacks, { continuous })` uses the browser's Web Speech recognizer. It switches to an in-page Whisper model when `usesLocalRecognition()` returns true, which happens in three cases:
  - Brave (`navigator.brave`): the API exists, but every attempt fails with a `network` error.
  - Firefox: there is no recognition API.
  - Any browser after a `network` error.

  Because the user is on Brave, the Whisper path is the one that actually runs for them.
- **Whisper path.**
  1. `MediaRecorder` records the clip.
  2. `decodeRecording` resamples it to 16 kHz mono.
  3. `containsSpeech` drops silent clips, because Whisper "hears" stock phrases in silence.
  4. `whisper.worker.ts` transcribes with `onnx-community/whisper-base` (q8 weights on the WASM backend). The model is about 80 MB from Hugging Face and is cached by the browser.

  `localSpeechRecognizer.ts` owns the worker and exposes the download status through `useLocalModelStatus()` and `describeModelStatus()`. Call `prepareRecognition()` when a mic feature appears on screen so the model starts downloading early. Show `getRecognitionBlocker()` when no recognizer can work in the current browser.
- **Session isolation.** Each listening session checks `isCurrent()`, so late events from an earlier session are dropped. Screens must call `abortListening()` and `stopSpeaking()` when they unmount.
- **Scoring.** `matchScore(spoken, targets)` and `scorePronunciation` normalize the text (NFKC, katakana → hiragana, punctuation and ruby removed), then compare with Levenshtein distance. Pass both the kanji text and its kana reading (`furiganaToKana`), because recognizers return either one.

**Learning library** (`components/library/`, data in `data/learningDocs.ts`):
- **Built-in documents** are Markdown files in `src/data/docs/`, found automatically through `import.meta.glob`. Each starts with a front-matter block: `title`, `description`, `category` (an id from `DOC_CATEGORIES`) and optionally `sourceFile`. To add a document the user gives you (for example a .docx), convert it to Markdown and drop it in; no code changes are needed. `kana-origins.md` was converted from the user's 「日文五十音漢字字源與記憶對照表」.
- **Uploads** (.docx, .pdf, .md, .txt, images) are converted once by `importDocumentFile`. Word files go through `mammoth`, which is imported dynamically so it is only downloaded when someone uploads a .docx.
- **Sanitize everything.** Any document HTML must go through `services/documentRenderer.ts` (`renderMarkdown` / `sanitizeHtml`, both DOMPurify) before `dangerouslySetInnerHTML`, because uploaded Markdown can carry scripts. Ruby strings in `src/data` are trusted repo content and don't need it.
- **PDF previews** are an `<iframe>` on an object URL. Under the app's cross-origin isolation the preview may stay blank, so the reader always offers 新分頁開啟 (open in a new tab).
- The kana origin hints in `kanaFlashcardData.ts` (`HIRAGANA_ORIGINS` / `KATAKANA_ORIGINS`) are adapted from that same document. The one deliberate difference is ん: the document says 爾, standard references say 无, and the hint text notes both.

**`vite.config.ts`** contains three settings that must stay:
- COOP/COEP headers (`credentialless`), so the WASM backend can use SharedArrayBuffer threads.
- `worker.format: 'es'`.
- Pre-bundling of `@huggingface/transformers`. Without it, Vite reloads the page the first time the mic is used.

## Learner-facing conventions

- All UI text is Traditional Chinese (zh-TW, Taiwan wording). Code comments are in English.
- Any Japanese shown to the learner needs its reading, romaji, a Chinese meaning and a TTS button (`speechService.speak`). Kanji readings in the data files are ruby markup strings (`<ruby>漢字<rt>かんじ</rt></ruby>`), rendered with `dangerouslySetInnerHTML`. `index.css` styles the `rt` element.
- On a wrong answer, show the correct answer and explain why, then bring the missed item back later. Kana sessions put a missed card back three cards later and record the miss in the spaced-repetition schedule. Hints are offered before answering (💡, key H), but a right answer given after opening the hint is treated like a miss for scheduling, so the card returns until it is recalled unaided. Use `soundEffects.playCorrect`, `playWrong` and `playVictory` for feedback, `onEarnXP` for rewards, and `canvas-confetti` when a session is completed.
- Text inputs that accept Japanese must handle IME composition on the Mac (`e.nativeEvent.isComposing` / `onCompositionEnd`), so underlined text the learner hasn't confirmed is never graded. Romaji answers should accept the common spellings (shi/si, tsu/tu, n/nn) and also kana typed through the IME. See `isCorrectTypedAnswer` in `kanaFlashcardData.ts`.
- Make screens usable from the keyboard. Add shortcuts with a `keydown` listener on `window` that ignores events coming from inputs. For Space or Enter shortcuts, call `preventDefault()` and blur any focused button; otherwise a button focused by an earlier mouse click fires as well (see `KanaStudySession`). `VideoCallScreen` uses holding Space as push-to-talk.

## Styling

- Tailwind CSS v4 comes in through `@tailwindcss/vite`. There is no Tailwind config file; custom CSS lives in `src/index.css`.
- Dark theme only: slate-950/900 surfaces and `rounded-2xl` or `rounded-3xl` cards.
- Each module has one accent color: kana pink, video call rose, typing trainer sky, four skills purple, roadmap amber, Mac keyboard emerald, library cyan.
- Rendered documents use the `.doc-prose` class in `index.css` (headings, tables that scroll sideways on phones, lists). There is no Tailwind typography plugin.
- There is no shared UI component library. Match the classes of the screen you are working in.
- Icons come from `lucide-react` 1.x. Before using an icon name, confirm it exists in `node_modules/lucide-react/dist/lucide-react.d.ts`.
