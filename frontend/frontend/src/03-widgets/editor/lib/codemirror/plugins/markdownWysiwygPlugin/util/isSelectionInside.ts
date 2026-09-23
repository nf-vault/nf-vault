import type { EditorView } from "@uiw/react-codemirror";
import type { SyntaxNodeRange } from "../types";

export const isSelectionInside = (
  view: EditorView,
  node: SyntaxNodeRange
) => {
  if (!view.hasFocus) return false;

  return view.state.selection.ranges.some((range) => {
    return range.from <= node.to && range.to >= node.from;
  });
};