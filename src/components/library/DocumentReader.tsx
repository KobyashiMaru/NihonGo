import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, Volume2, Download, Trash, Pencil, ExternalLink, Info } from 'lucide-react';
import { DOC_CATEGORIES, DocCategory, LearningDoc, UploadedDoc, categoryLabel } from '../../data/learningDocs';
import { renderMarkdown, sanitizeHtml } from '../../services/documentRenderer';
import { formatFileSize } from '../../services/docLibraryService';
import { speechService } from '../../services/speechService';

interface DocumentReaderProps {
  doc: LearningDoc;
  onBack: () => void;
  onUpdate: (doc: UploadedDoc) => void;
  onDelete: (doc: UploadedDoc) => void;
}

const MAX_SPOKEN_CHARS = 300;

export const DocumentReader: React.FC<DocumentReaderProps> = ({ doc, onBack, onUpdate, onDelete }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(doc.title);
  const [notice, setNotice] = useState<string | null>(null);
  const uploaded = doc.source === 'uploaded' ? doc : null;
  const file = uploaded?.file;

  // Shows the uploaded PDF / image through an object URL that lives exactly as long as the element
  const attachFile = useCallback(
    (el: HTMLIFrameElement | HTMLImageElement | null) => {
      if (!el || !file) return;
      const url = URL.createObjectURL(file);
      el.src = url;
      return () => URL.revokeObjectURL(url);
    },
    [file]
  );

  const openInNewTab = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, '_blank', 'noopener');
    // The new tab has loaded it by then
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  useEffect(() => () => speechService.stopSpeaking(), []);

  const html = useMemo(() => {
    if (doc.source === 'built-in') return renderMarkdown(doc.markdown);
    if (doc.kind === 'markdown') return renderMarkdown(doc.text ?? '');
    if (doc.kind === 'word') return sanitizeHtml(doc.html ?? '');
    return null;
  }, [doc]);

  const speakSelection = () => {
    const text = window.getSelection()?.toString().trim();
    if (!text) {
      setNotice('先用滑鼠在文件中選取一段日文，再按一次「朗讀選取文字」。');
      return;
    }
    setNotice(text.length > MAX_SPOKEN_CHARS ? `選取的文字太長，只朗讀前 ${MAX_SPOKEN_CHARS} 個字。` : null);
    speechService.speak(text.slice(0, MAX_SPOKEN_CHARS));
  };

  const download = () => {
    const blob = uploaded ? uploaded.file : new Blob([doc.source === 'built-in' ? doc.markdown : ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = uploaded ? uploaded.fileName : `${doc.title}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const saveTitle = () => {
    const title = draftTitle.trim();
    if (uploaded && title && title !== uploaded.title) onUpdate({ ...uploaded, title });
    else setDraftTitle(doc.title);
    setIsEditingTitle(false);
  };

  const handleDelete = () => {
    if (uploaded && window.confirm(`確定要刪除「${uploaded.title}」嗎？刪除後無法復原。`)) onDelete(uploaded);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>回到資料庫</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            {isEditingTitle ? (
              <input
                autoFocus
                value={draftTitle}
                onChange={e => setDraftTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) saveTitle();
                  if (e.key === 'Escape') {
                    setDraftTitle(doc.title);
                    setIsEditingTitle(false);
                  }
                }}
                className="w-full bg-slate-950 border border-cyan-500/60 rounded-xl px-3 py-1.5 text-xl font-black text-white outline-none"
              />
            ) : (
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span className="break-words">{doc.title}</span>
                {uploaded && (
                  <button onClick={() => setIsEditingTitle(true)} className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800" title="重新命名">
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </h2>
            )}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              {uploaded ? (
                <select
                  value={uploaded.category}
                  onChange={e => onUpdate({ ...uploaded, category: e.target.value as DocCategory })}
                  className="bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 rounded-lg px-2 py-0.5 outline-none"
                >
                  {DOC_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              ) : (
                <span className="bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 rounded-lg px-2 py-0.5">{categoryLabel(doc.category)}</span>
              )}
              {uploaded ? (
                <span>
                  我上傳的・{new Date(uploaded.addedAt).toLocaleDateString('zh-TW')}・{uploaded.fileName}・{formatFileSize(uploaded.size)}
                </span>
              ) : (
                <span>內建教材{doc.source === 'built-in' && doc.sourceFile ? `・轉自 ${doc.sourceFile}` : ''}</span>
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            {html !== null || doc.kind === 'text' ? (
              <button
                // Keep the text selection: a normal mousedown on the button would clear it
                onMouseDown={e => e.preventDefault()}
                onClick={speakSelection}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-200 text-xs font-bold"
              >
                <Volume2 className="w-4 h-4" />
                <span>朗讀選取文字</span>
              </button>
            ) : null}
            {uploaded && doc.kind === 'pdf' && (
              <button
                onClick={openInNewTab}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold"
              >
                <ExternalLink className="w-4 h-4" />
                <span>新分頁開啟</span>
              </button>
            )}
            <button
              onClick={download}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold"
            >
              <Download className="w-4 h-4" />
              <span>下載</span>
            </button>
            {uploaded && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold"
              >
                <Trash className="w-4 h-4" />
                <span>刪除</span>
              </button>
            )}
          </div>
        </div>

        {notice && (
          <div className="flex items-center space-x-2 text-xs text-sky-200/90 bg-sky-950/30 border border-sky-800/40 rounded-xl px-3 py-2">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-8">
        {html !== null && <article className="doc-prose" dangerouslySetInnerHTML={{ __html: html }} />}
        {uploaded && doc.kind === 'text' && (
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-200">{uploaded.text}</pre>
        )}
        {doc.kind === 'pdf' && (
          <div className="space-y-2">
            <iframe ref={attachFile} title={doc.title} className="w-full h-[75vh] rounded-2xl bg-white" />
            <p className="text-[11px] text-slate-500 text-center">如果上面的預覽是空白的，請按右上角「新分頁開啟」用瀏覽器內建的 PDF 檢視器閱讀。</p>
          </div>
        )}
        {doc.kind === 'image' && <img ref={attachFile} alt={doc.title} className="max-w-full mx-auto rounded-2xl" />}
        {doc.kind === 'word' && !html && (
          <p className="text-sm text-slate-400">這份 Word 檔沒有可顯示的文字內容，可以按「下載」用 Word 開啟原檔。</p>
        )}
      </div>
    </div>
  );
};
