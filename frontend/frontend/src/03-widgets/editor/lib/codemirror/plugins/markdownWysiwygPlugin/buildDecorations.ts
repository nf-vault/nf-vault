import { syntaxTree } from "@codemirror/language";
import { Decoration } from "@uiw/react-codemirror";
import type {
  DecorationSet,
  EditorView,
  Range,
} from "@uiw/react-codemirror";
import { decorationProviders } from "./config/decorationProviders";


export const buildDecorations = (view: EditorView): DecorationSet => {
  const decorations: Array<Range<Decoration>> = [];

  syntaxTree(view.state).iterate({
    enter(node) {
      for (const provider of decorationProviders) {
        const result = provider(view, node);
        decorations.push(...result.decorations);

        if (result.skipChildren) {
          return false;
        }
      }
    }
  });

  return Decoration.set(decorations, true);
};
