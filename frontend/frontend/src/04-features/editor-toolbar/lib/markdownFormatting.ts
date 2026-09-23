import { syntaxTree } from "@codemirror/language";
import type { EditorState, EditorView } from "@uiw/react-codemirror";
import type { MarkdownFormat } from "../types/EditorTopbar.types";

const nodeNameByFormat: Record<MarkdownFormat, string> = {
  strong: "StrongEmphasis",
  emphasis: "Emphasis",
  code: "InlineCode",
};

const markerByFormat: Record<MarkdownFormat, string> = {
  strong: "**",
  emphasis: "*",
  code: "`",
};

type SyntaxNode = {
  readonly name: string;
  readonly from: number;
  readonly to: number;
  readonly parent: SyntaxNode | null;
  readonly firstChild: SyntaxNode | null;
  readonly nextSibling: SyntaxNode | null;
};

const findFormatNode = (
  state: EditorState,
  format: MarkdownFormat,
): SyntaxNode | null => {
  const position = state.selection.main.head;
  const expectedName = nodeNameByFormat[format];
  const sides: Array<-1 | 1> = position === 0 ? [1] : [-1, 1];

  for (const side of sides) {
    let node = syntaxTree(state).resolveInner(position, side) as SyntaxNode | null;

    while (node) {
      if (node.name === expectedName) return node;
      node = node.parent;
    }
  }

  return null;
};

const getMarkerRanges = (node: SyntaxNode) => {
  const ranges: Array<{ from: number; to: number }> = [];
  let child = node.firstChild;

  while (child) {
    if (child.name === "EmphasisMark" || child.name === "CodeMark") {
      ranges.push({ from: child.from, to: child.to });
    }
    child = child.nextSibling;
  }

  return ranges;
};

export const isFormatActive = (
  state: EditorState | null,
  format: MarkdownFormat,
) => {
  return state ? findFormatNode(state, format) !== null : false;
};

export const toggleMarkdownFormat = (
  view: EditorView,
  format: MarkdownFormat,
) => {
  const activeNode = findFormatNode(view.state, format);

  if (activeNode) {
    const markers = getMarkerRanges(activeNode);
    const openingMarker = markers[0];
    const closingMarker = markers[markers.length - 1];

    if (openingMarker && closingMarker && openingMarker !== closingMarker) {
      view.dispatch({
        changes: [
          { from: openingMarker.from, to: openingMarker.to },
          { from: closingMarker.from, to: closingMarker.to },
        ],
      });
      view.focus();
      return;
    }
  }

  const { from, to } = view.state.selection.main;
  const marker = markerByFormat[format];

  view.dispatch({
    changes: [
      { from, insert: marker },
      { from: to, insert: marker },
    ],
    selection: from === to
      ? { anchor: from + marker.length }
      : { anchor: from + marker.length, head: to + marker.length },
  });
  view.focus();
};

export const getMarkdownBlockName = (state: EditorState | null) => {
  if (!state) return "paragraph";

  let node = syntaxTree(state).resolveInner(
    state.selection.main.head,
    -1,
  ) as SyntaxNode | null;

  while (node) {
    const heading = /^ATXHeading([1-6])$/.exec(node.name);
    if (heading) return `heading (${heading[1]})`;
    if (node.name === "Blockquote") return "blockquote";
    if (node.name === "FencedCode") return "code_block";
    if (node.name === "BulletList") return "bullet_list";
    if (node.name === "OrderedList") return "ordered_list";
    node = node.parent;
  }

  return "paragraph";
};