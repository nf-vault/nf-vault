import { Decoration } from "@uiw/react-codemirror";
import type { Range } from "@uiw/react-codemirror";
import type { DecorationProvider } from "../../types";
import { isSelectionInside } from "../../util/isSelectionInside";

const CODE_BLOCK_LINE_CLASS = "cm-markdown-code-block-line";

const isFenceOnlyLine = (
  lineFrom: number,
  lineTo: number,
  source: string,
  ranges: Array<{ from: number; to: number }>
) => {
  let remainder = source;

  for (const range of ranges.sort((left, right) => right.from - left.from)) {
    if (range.from < lineFrom || range.to > lineTo) continue;

    remainder = remainder.slice(0, range.from - lineFrom)
      + remainder.slice(range.to - lineFrom);
  }

  return remainder.trim() === "";
};

export const getCodeBlockDecorations: DecorationProvider = (view, node) => {
  if (node.name !== "FencedCode") return { decorations: [] };

  const doc = view.state.doc;
  const firstLine = doc.lineAt(node.from);
  const lastLine = doc.lineAt(Math.max(node.from, node.to - 1));
  const isActive = isSelectionInside(view, node);
  const infoNode = node.node.getChild("CodeInfo");
  const codeMarks = node.node.getChildren("CodeMark");
  const language = infoNode
    ? doc.sliceString(infoNode.from, infoNode.to).trim()
    : "";
  const decorations: Array<Range<Decoration>> = [];
  let codeLineNumber = 0;

  for (let lineNumber = firstLine.number; lineNumber <= lastLine.number; lineNumber++) {
    const line = doc.line(lineNumber);
    const classes = [CODE_BLOCK_LINE_CLASS];
    const lineCodeMarks = codeMarks.filter((mark) => {
      return mark.from >= line.from && mark.to <= line.to;
    });

    if (lineNumber === firstLine.number) {
      classes.push(`${CODE_BLOCK_LINE_CLASS}-start`);
    }
    if (lineNumber === lastLine.number) {
      classes.push(`${CODE_BLOCK_LINE_CLASS}-end`);
    }
    if (!isActive) {
      const hiddenRanges = infoNode ? [...lineCodeMarks, infoNode] : lineCodeMarks;

      if (
        lineCodeMarks.length > 0
        && isFenceOnlyLine(line.from, line.to, line.text, hiddenRanges)
      ) {
        classes.push(`${CODE_BLOCK_LINE_CLASS}-collapsed`);
      }
    }

    const attributes: Record<string, string> = {
      class: classes.join(" ")
    };

    if (lineCodeMarks.length === 0) {
      codeLineNumber++;
      attributes["data-code-line-number"] = String(codeLineNumber);
    }

    if (lineNumber === firstLine.number && language && !isActive) {
      attributes["data-code-language"] = language;
    }

    decorations.push(Decoration.line({ attributes }).range(line.from));
  }

  return { decorations };
};