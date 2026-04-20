const FRONTMATTER_RE = /^---[\s\S]*?---\s*/;
const CODE_BLOCK_RE = /```[\s\S]*?```/g;
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;
const IMAGE_RE = /!\[([^\]]*)\]\([^)]+\)/g;
const LINK_RE = /\[([^\]]+)\]\([^)]+\)/g;
const INLINE_CODE_RE = /`([^`]+)`/g;
const HTML_TAG_RE = /<\/?[^>]+>/g;

const SKIP_LINE_PATTERNS = [
  /^#{1,6}\s+/,
  /^>/,
  /^[-*+]\s+/,
  /^\d+\.\s+/,
  /^`{3,}/,
  /^:{3,}/,
  /^\|/,
  /^-{3,}$/,
  /^_{3,}$/,
  /^<[^>]+>$/,
];

function shouldSkipLine(line: string): boolean {
  return SKIP_LINE_PATTERNS.some((pattern) => pattern.test(line));
}

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

function truncateByChars(input: string, maxLength: number): string {
  const chars = Array.from(input);
  if (chars.length <= maxLength) {
    return input;
  }

  return `${chars.slice(0, maxLength).join('')}…`;
}

function sanitizeText(input: string): string {
  return normalizeWhitespace(
    input
      .replace(FRONTMATTER_RE, '')
      .replace(CODE_BLOCK_RE, ' ')
      .replace(HTML_COMMENT_RE, ' ')
      .replace(IMAGE_RE, '$1')
      .replace(LINK_RE, '$1')
      .replace(INLINE_CODE_RE, '$1')
      .replace(HTML_TAG_RE, ' '),
  );
}

function pickReadableLine(input: string): string {
  const lines = input.replace(/\r\n/g, '\n').split('\n');
  let fallback = '';
  for (const line of lines) {
    const candidate = sanitizeText(line);
    const softened = candidate
      .replace(/^>+\s*/, '')
      .replace(/^[-*+]\s+/, '')
      .replace(/^\d+\.\s+/, '')
      .trim();
    if (!candidate) {
      continue;
    }
    if (!fallback && softened && !/^[-_]{3,}$/.test(softened) && !/^`{3,}/.test(softened)) {
      fallback = softened;
    }
    if (shouldSkipLine(candidate)) {
      continue;
    }

    return candidate;
  }

  return fallback;
}

interface ExcerptOptions {
  description?: string;
  body?: string;
  maxLength?: number;
}

export function fromDescriptionOrBody(options: ExcerptOptions): string {
  const { description = '', body = '', maxLength = 120 } = options;
  const descriptionText = pickReadableLine(description);
  const bodyText = pickReadableLine(body);
  const source = descriptionText || bodyText;
  if (!source) {
    return '';
  }

  return truncateByChars(source, maxLength);
}
