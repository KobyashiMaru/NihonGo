// Learning Library storage: uploaded documents live in this browser's IndexedDB
// (files are too large for localStorage). Word files are converted to HTML once, at upload time.

import { DocCategory, DocKind, UploadedDoc } from '../data/learningDocs';

const DB_NAME = 'nihongo_library_v1';
const STORE = 'documents';

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

const KIND_BY_EXTENSION: Record<string, DocKind> = {
  md: 'markdown',
  markdown: 'markdown',
  txt: 'text',
  docx: 'word',
  pdf: 'pdf',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
};

// Value for the file input's `accept` attribute
export const ACCEPTED_FILE_TYPES = Object.keys(KIND_BY_EXTENSION).map(ext => `.${ext}`).join(',');

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const withStore = async <T,>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const request = run(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
};

export const listUploadedDocs = async (): Promise<UploadedDoc[]> => {
  const docs = await withStore('readonly', store => store.getAll() as IDBRequest<UploadedDoc[]>);
  return docs.sort((a, b) => b.addedAt - a.addedAt);
};

export const saveUploadedDoc = (doc: UploadedDoc): Promise<IDBValidKey> =>
  withStore('readwrite', store => store.put(doc));

export const deleteUploadedDoc = (id: string): Promise<undefined> =>
  withStore('readwrite', store => store.delete(id));

const stripExtension = (name: string) => name.replace(/\.[^.]+$/, '');

// Converts a picked file into a library document (not yet saved). Throws a learner-facing message.
export const importDocumentFile = async (file: File, category: DocCategory): Promise<UploadedDoc> => {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  const kind = KIND_BY_EXTENSION[extension];
  if (!kind) {
    throw new Error(`「${file.name}」的格式不支援，請上傳 Word (.docx)、PDF、Markdown、文字檔或圖片。`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`「${file.name}」超過 50MB，請先壓縮或分成幾個檔案。`);
  }

  let title = stripExtension(file.name);
  let html: string | undefined;
  let text: string | undefined;

  if (kind === 'word') {
    // Loaded on demand so the converter is not part of the main bundle
    const mammoth = await import('mammoth');
    const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    html = result.value;
    const heading = html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, '').trim();
    if (heading) title = heading;
  } else if (kind === 'markdown' || kind === 'text') {
    text = await file.text();
    const heading = kind === 'markdown' ? text.match(/^#\s+(.+)$/m)?.[1].trim() : undefined;
    if (heading) title = heading;
  }

  return {
    id: crypto.randomUUID(),
    title,
    category,
    kind,
    source: 'uploaded',
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    addedAt: Date.now(),
    file,
    html,
    text,
  };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
