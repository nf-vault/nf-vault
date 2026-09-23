import { SEARCH_SNIPPET_CONFIG } from "../config";

const OPEN_MARK = "<mark>";
const CLOSE_MARK = "</mark>";
const MARK_PATTERN = /(<mark>|<\/mark>)/g;

type SnippetPart = {
  text: string
  highlighted: boolean
};

const decodeHtmlEntities = (value: string): string => {
  const parsedDocument = new DOMParser().parseFromString(value, "text/html");
  return parsedDocument.body.textContent ?? "";
};

const parseSnippet = (html: string): SnippetPart[] => {
  let isHighlighted = false;
  const parts: SnippetPart[] = [];

  html.split(MARK_PATTERN).forEach((part) => {
    if (part === OPEN_MARK) {
      isHighlighted = true;
      return;
    }
    if (part === CLOSE_MARK) {
      isHighlighted = false;
      return;
    }
    if (!part) return;

    parts.push({
      text: decodeHtmlEntities(part),
      highlighted: isHighlighted
    });
  });

  return parts;
};

export const getVisibleSnippetParts = (html: string): SnippetPart[] => {
  const parts = parseSnippet(html);
  const firstMatchIndex = parts.findIndex(({ highlighted }) => highlighted);
  if (firstMatchIndex < 0) return parts;

  const textBeforeMatch = parts
    .slice(0, firstMatchIndex)
    .map(({ text }) => text)
    .join("");
  const { contextBeforeMatch, maxVisibleLength, ellipsis } = SEARCH_SNIPPET_CONFIG;
  const visiblePrefix = textBeforeMatch.slice(-contextBeforeMatch);
  const isPrefixTruncated = textBeforeMatch.length > visiblePrefix.length;
  const prefixText = `${isPrefixTruncated ? ellipsis : ""}${visiblePrefix}`;
  const visibleParts: SnippetPart[] = prefixText ? [{
    text: prefixText,
    highlighted: false
  }] : [];
  let visibleLength = prefixText.length;
  let isTailTruncated = false;

  for (let index = firstMatchIndex; index < parts.length; index++) {
    const availableLength = maxVisibleLength - visibleLength;
    if (availableLength <= 0) {
      isTailTruncated = true;
      break;
    }

    const part = parts[index];
    const text = part.text.slice(0, availableLength);
    visibleParts.push({ ...part, text });
    visibleLength += text.length;

    if (text.length < part.text.length) {
      isTailTruncated = true;
      break;
    }
  }

  if (isTailTruncated) {
    visibleParts.push({
      text: ellipsis,
      highlighted: false
    });
  }

  return visibleParts;
};