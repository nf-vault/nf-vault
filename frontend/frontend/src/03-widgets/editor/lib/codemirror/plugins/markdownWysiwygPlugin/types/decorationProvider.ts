import type {
  Decoration,
  EditorView,
  Range
} from "@uiw/react-codemirror";
import type { MarkdownSyntaxNode } from "./syntaxNode";

export type DecorationProviderResult = {
  decorations: Array<Range<Decoration>>;
  skipChildren?: boolean;
};

export interface DecorationProvider {
  (
    view: EditorView,
    node: MarkdownSyntaxNode
  ): DecorationProviderResult;
}