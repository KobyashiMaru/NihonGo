// Turns library documents into HTML for the reader. Everything passes through DOMPurify,
// because uploaded Markdown can contain raw HTML (scripts, event handlers) from anywhere.

import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => DOMPurify.sanitize(html);

export const renderMarkdown = (markdown: string): string =>
  sanitizeHtml(marked.parse(markdown, { async: false, gfm: true }));
