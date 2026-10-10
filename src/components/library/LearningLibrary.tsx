import React, { useState, useEffect, useRef } from 'react';
import { Library, Upload, Search, FileText, FileType, FileImage, File, LoaderCircle, TriangleAlert, X } from 'lucide-react';
import {
  BUILT_IN_DOCS,
  DOC_CATEGORIES,
  DocCategory,
  DocKind,
  LearningDoc,
  UploadedDoc,
  categoryLabel,
} from '../../data/learningDocs';
import {
  ACCEPTED_FILE_TYPES,
  deleteUploadedDoc,
  formatFileSize,
  importDocumentFile,
  listUploadedDocs,
  saveUploadedDoc,
} from '../../services/docLibraryService';
import { DocumentReader } from './DocumentReader';

interface LearningLibraryProps {
  initialDocId?: string | null;
}

const KIND_STYLES: Record<DocKind, { label: string; icon: React.ElementType; color: string }> = {
  markdown: { label: '筆記', icon: FileText, color: 'text-cyan-300' },
  text: { label: '文字檔', icon: FileText, color: 'text-slate-300' },
  word: { label: 'Word', icon: FileType, color: 'text-sky-300' },
  pdf: { label: 'PDF', icon: File, color: 'text-rose-300' },
  image: { label: '圖片', icon: FileImage, color: 'text-amber-300' },
};

export const LearningLibrary: React.FC<LearningLibraryProps> = ({ initialDocId }) => {
  const [uploads, setUploads] = useState<UploadedDoc[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(initialDocId ?? null);
  const [filter, setFilter] = useState<DocCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listUploadedDocs()
      .then(setUploads)
      .catch(err => setLoadError(`讀取你上傳的資料失敗：${err?.message ?? err}`));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selectedId]);

  const allDocs: LearningDoc[] = [...BUILT_IN_DOCS, ...uploads];
  const selectedDoc = allDocs.find(d => d.id === selectedId);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadErrors([]);
    const category: DocCategory = filter === 'all' ? 'other' : filter;
    const added: UploadedDoc[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const doc = await importDocumentFile(file, category);
        await saveUploadedDoc(doc);
        added.push(doc);
      } catch (err: any) {
        errors.push(err?.message ?? `「${file.name}」上傳失敗`);
      }
    }

    if (added.length > 0) {
      // Ask the browser not to evict the library when disk space runs low
      navigator.storage?.persist?.().catch(() => {});
      setUploads(prev => [...added, ...prev]);
      if (added.length === 1) setSelectedId(added[0].id);
    }
    setUploadErrors(errors);
    setIsUploading(false);
  };

  const handleUpdate = async (doc: UploadedDoc) => {
    setUploads(prev => prev.map(d => (d.id === doc.id ? doc : d)));
    await saveUploadedDoc(doc).catch(err => setLoadError(`儲存變更失敗：${err?.message ?? err}`));
  };

  const handleDelete = async (doc: UploadedDoc) => {
    try {
      await deleteUploadedDoc(doc.id);
      setUploads(prev => prev.filter(d => d.id !== doc.id));
      setSelectedId(null);
    } catch (err: any) {
      setLoadError(`刪除失敗：${err?.message ?? err}`);
    }
  };

  if (selectedDoc) {
    return (
      <div className="max-w-5xl mx-auto pb-12">
        <DocumentReader
          key={selectedDoc.id}
          doc={selectedDoc}
          onBack={() => setSelectedId(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  const keyword = query.trim().toLowerCase();
  const matchesQuery = (doc: LearningDoc) =>
    !keyword ||
    [doc.title, doc.description, doc.source === 'uploaded' ? doc.fileName : doc.sourceFile]
      .some(text => text?.toLowerCase().includes(keyword));
  const visibleDocs = allDocs.filter(d => (filter === 'all' || d.category === filter) && matchesQuery(d));
  const countFor = (category: DocCategory) => allDocs.filter(d => d.category === category).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-950/50 via-slate-900 to-slate-900 border border-cyan-900/40 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Library className="w-4 h-4" />
          <span>講義・筆記・對照表</span>
        </div>
        <h2 className="text-2xl font-black text-white">學習資料庫</h2>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          把對學日文有幫助的文件收在這裡：內建教材，加上你自己找到的 Word、PDF、筆記或截圖。打開文件後選取日文，就能直接聽發音。
        </p>
      </div>

      {/* Upload area */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(Array.from(e.dataTransfer.files));
        }}
        className={`rounded-3xl border-2 border-dashed p-6 text-center transition-colors ${
          isDragging ? 'border-cyan-400 bg-cyan-950/30' : 'border-slate-700 bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES}
          className="hidden"
          onChange={e => {
            handleFiles(Array.from(e.target.files ?? []));
            e.target.value = ''; // Allow picking the same file again
          }}
        />
        <div className="flex flex-col items-center space-y-3">
          {isUploading ? (
            <LoaderCircle className="w-8 h-8 text-cyan-400 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-cyan-400" />
          )}
          <div className="text-sm text-slate-300">
            {isUploading ? '正在加入資料庫…' : '把檔案拖曳到這裡，或'}
            {!isUploading && (
              <button onClick={() => fileInputRef.current?.click()} className="ml-1 text-cyan-300 font-bold underline underline-offset-4 hover:text-cyan-200">
                選擇檔案
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-500 max-w-lg">
            支援 Word (.docx)、PDF、Markdown (.md)、文字檔 (.txt) 與圖片，單檔 50MB 以內。
            {filter !== 'all' && `新檔案會放進「${categoryLabel(filter)}」分類。`}
            檔案只存在這個瀏覽器裡，清除網站資料時會一併刪除，重要的原檔請另外保留。
          </p>
        </div>
      </div>

      {(uploadErrors.length > 0 || loadError) && (
        <div className="flex items-start justify-between gap-3 bg-rose-950/30 border border-rose-800/50 rounded-2xl px-4 py-3">
          <div className="flex items-start space-x-2 text-xs text-rose-200">
            <TriangleAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              {loadError && <p>{loadError}</p>}
              {uploadErrors.map((msg, i) => <p key={i}>{msg}</p>)}
            </div>
          </div>
          <button
            onClick={() => {
              setUploadErrors([]);
              setLoadError(null);
            }}
            className="text-rose-300 hover:text-white"
            title="關閉"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & category filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜尋標題或檔名…"
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/60 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all' as const, label: '全部' }, ...DOC_CATEGORIES].map(c => {
            const count = c.id === 'all' ? allDocs.length : countFor(c.id);
            const isActive = filter === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {c.label}
                <span className={`ml-1.5 font-mono ${isActive ? 'text-slate-900/70' : 'text-slate-500'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document list */}
      {visibleDocs.length === 0 ? (
        <div className="text-center text-sm text-slate-500 py-10 bg-slate-900/40 border border-slate-800 rounded-3xl">
          {allDocs.length === 0 ? '還沒有任何文件，從上面上傳第一份吧！' : '找不到符合的文件，換個關鍵字或分類試試。'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleDocs.map(doc => {
            const kind = KIND_STYLES[doc.kind];
            const Icon = kind.icon;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedId(doc.id)}
                className="flex items-start space-x-3 text-left bg-slate-900/70 hover:bg-slate-800/70 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex-shrink-0">
                  <Icon className={`w-5 h-5 ${kind.color}`} />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="text-sm font-bold text-white break-words">{doc.title}</div>
                  {doc.description && <div className="text-xs text-slate-400 line-clamp-2">{doc.description}</div>}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="bg-cyan-950/40 border border-cyan-900/60 text-cyan-300 rounded px-1.5 py-0.5">{categoryLabel(doc.category)}</span>
                    <span className="bg-slate-800 rounded px-1.5 py-0.5">{kind.label}</span>
                    {doc.source === 'built-in' ? (
                      <span>內建教材</span>
                    ) : (
                      <span>
                        {new Date(doc.addedAt).toLocaleDateString('zh-TW')}・{formatFileSize(doc.size)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
