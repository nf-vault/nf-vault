import type { MarkdownConfig } from "@lezer/markdown";

const DOLLAR_SIGN = 36;
const BACKSLASH = 92;
const LINE_BREAK = 10;

const isWhitespace = (character: number) => {
  return character === 9
    || character === 10
    || character === 13
    || character === 32;
};

export const latexMathExtension: MarkdownConfig = {
  defineNodes: ["InlineMath", "BlockMath", "MathMark"],
  parseInline: [{
    name: "LatexMath",
    after: "Escape",
    parse(context, next, from) {
      if (next !== DOLLAR_SIGN) return -1;

      const isBlock = context.char(from + 1) === DOLLAR_SIGN;
      if (!isBlock && context.char(from - 1) === DOLLAR_SIGN) return -1;
      if (
        isBlock
        && from > context.offset
        && context.char(from - 1) !== LINE_BREAK
      ) {
        return -1;
      }

      const markerLength = isBlock ? 2 : 1;
      const contentFrom = from + markerLength;
      const startsWithWhitespace = isWhitespace(context.char(contentFrom));

      for (let position = contentFrom; position < context.end; position++) {
        const character = context.char(position);

        if (character === BACKSLASH) {
          position++;
          continue;
        }
        if (!isBlock && character === LINE_BREAK) return -1;
        if (character !== DOLLAR_SIGN) continue;

        const hasClosingMarker = isBlock
          ? context.char(position + 1) === DOLLAR_SIGN
          : context.char(position - 1) !== DOLLAR_SIGN
            && context.char(position + 1) !== DOLLAR_SIGN;
        if (!hasClosingMarker || position === contentFrom) continue;
        if (
          !isBlock
          && startsWithWhitespace !== isWhitespace(context.char(position - 1))
        ) {
          continue;
        }
        if (!context.slice(contentFrom, position).trim()) continue;

        const to = position + markerLength;
        if (
          isBlock
          && to < context.end
          && context.char(to) !== LINE_BREAK
        ) {
          continue;
        }

        const nodeName = isBlock ? "BlockMath" : "InlineMath";

        return context.addElement(context.elt(nodeName, from, to, [
          context.elt("MathMark", from, contentFrom),
          context.elt("MathMark", position, to)
        ]));
      }

      return -1;
    }
  }]
};