// Learning Library: document categories, types, and the built-in documents in ./docs/*.md
//
// To ship a new built-in document, drop a Markdown file into src/data/docs/ with a front-matter
// block (title, description, category). It is picked up automatically — no code changes needed.

export const DOC_CATEGORIES = [
  { id: 'kana', label: '五十音・發音' },
  { id: 'vocab', label: '單字' },
  { id: 'grammar', label: '文法' },
  { id: 'conversation', label: '會話' },
  { id: 'reading', label: '閱讀・聽力' },
  { id: 'jlpt', label: 'JLPT 考試' },
  { id: 'other', label: '其他' },
] as const;

export type DocCategory = (typeof DOC_CATEGORIES)[number]['id'];

export type DocKind = 'markdown' | 'text' | 'word' | 'pdf' | 'image';

interface DocBase {
  id: string;
  title: string;
  description?: string;
  category: DocCategory;
  kind: DocKind;
}

// Shipped with the app from src/data/docs/
export interface BuiltInDoc extends DocBase {
  source: 'built-in';
  kind: 'markdown';
  markdown: string;
  sourceFile?: string;  // Name of the original file the Markdown was converted from
}

// Added by the learner through the upload area; stored in this browser's IndexedDB
export interface UploadedDoc extends DocBase {
  source: 'uploaded';
  fileName: string;
  mimeType: string;
  size: number;
  addedAt: number;
  file: Blob;           // Original file, kept for download and for PDF / image viewing
  html?: string;        // Word documents converted to HTML at upload time
  text?: string;        // Markdown and plain-text content
}

export type LearningDoc = BuiltInDoc | UploadedDoc;

export const KANA_ORIGINS_DOC_ID = 'kana-origins';

export const categoryLabel = (id: DocCategory): string =>
  DOC_CATEGORIES.find(c => c.id === id)?.label ?? '其他';

const isCategory = (value: string | undefined): value is DocCategory =>
  DOC_CATEGORIES.some(c => c.id === value);

// Minimal `key: value` front-matter parser; values are single-line strings
const parseFrontMatter = (raw: string): { meta: Record<string, string>; body: string } => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':');
    if (sep > 0) meta[line.slice(0, sep).trim()] = line.slice(sep + 1).trim();
  }
  return { meta, body: raw.slice(match[0].length) };
};

const docFiles = import.meta.glob('./docs/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const BUILT_IN_DOCS: BuiltInDoc[] = Object.entries(docFiles)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontMatter(raw);
    const id = path.replace(/^.*\//, '').replace(/\.md$/, '');
    return {
      id,
      title: meta.title || id,
      description: meta.description,
      category: isCategory(meta.category) ? meta.category : 'other',
      kind: 'markdown' as const,
      source: 'built-in' as const,
      markdown: body,
      sourceFile: meta.sourceFile,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'));
