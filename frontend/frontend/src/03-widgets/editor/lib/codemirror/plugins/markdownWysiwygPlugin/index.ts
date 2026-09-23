import { syntaxTree } from "@codemirror/language";
import { Prec, ViewPlugin } from "@uiw/react-codemirror";
import type { DecorationSet, EditorView, ViewUpdate } from "@uiw/react-codemirror";
import { buildDecorations } from "./buildDecorations";

class MarkdownWysiwygView {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = buildDecorations(view);
  }

  update(update: ViewUpdate) {
    const syntaxTreeChanged =
      syntaxTree(update.startState) !== syntaxTree(update.state);

    if (
      update.docChanged
      || update.selectionSet
      || update.viewportChanged
      || update.focusChanged
      || syntaxTreeChanged
    ) {
      this.decorations = buildDecorations(update.view);
    }
  }
}

const markdownWysiwygViewPlugin = ViewPlugin.fromClass(MarkdownWysiwygView, {
  decorations: (value) => value.decorations,
});

export const markdownWysiwygPlugin = Prec.highest(markdownWysiwygViewPlugin);