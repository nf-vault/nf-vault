import { highlightingFor, syntaxTree } from "@codemirror/language";
import { Decoration, EditorView, StateEffect, StateField } from "@uiw/react-codemirror";
import type { DecorationSet, EditorState, Extension, Range } from "@uiw/react-codemirror";
import { markdownSourceMarkerTag } from "../../themes";
import { latexMathNavigation } from "./latexMathNavigation";
import { MarkdownMathWidget } from "./MarkdownMathWidget";

type LatexMathState = {
  decorations: DecorationSet;
  focused: boolean;
};

const mathFocusEffect = StateEffect.define<boolean>();

const isSelectionInside = (
  state: EditorState,
  from: number,
  to: number
) => {
  return state.selection.ranges.some((range) => {
    return range.from <= to && range.to >= from;
  });
};

const buildMathDecorations = (
  state: EditorState,
  focused: boolean
): DecorationSet => {
  const decorations: Array<Range<Decoration>> = [];

  syntaxTree(state).iterate({
    enter(node) {
      if (node.name !== "InlineMath" && node.name !== "BlockMath") return;

      const isActive = focused && isSelectionInside(state, node.from, node.to);

      if (isActive) {
        const className = highlightingFor(state, [markdownSourceMarkerTag]);

        if (className) {
          for (const marker of node.node.getChildren("MathMark")) {
            decorations.push(
              Decoration.mark({ class: className }).range(
                marker.from,
                marker.to
              )
            );
          }
        }

        return false;
      }

      const displayMode = node.name === "BlockMath";
      const markerLength = displayMode ? 2 : 1;
      const sourceFrom = node.from + markerLength;
      const sourceTo = node.to - markerLength;
      const source = state.doc.sliceString(sourceFrom, sourceTo);
      const rawSource = state.doc.sliceString(node.from, node.to);

      decorations.push(
        Decoration.replace({
          block: displayMode,
          widget: new MarkdownMathWidget({
            source,
            rawSource,
            displayMode,
            sourceFrom
          })
        }).range(node.from, node.to)
      );

      return false;
    }
  });

  return Decoration.set(decorations, true);
};

const latexMathState = StateField.define<LatexMathState>({
  create(state) {
    return {
      decorations: buildMathDecorations(state, false),
      focused: false
    };
  },
  update(value, transaction) {
    let focused = value.focused;

    for (const effect of transaction.effects) {
      if (effect.is(mathFocusEffect)) focused = effect.value;
    }

    return {
      decorations: buildMathDecorations(transaction.state, focused),
      focused
    };
  },
  provide(field) {
    return EditorView.decorations.from(field, (value) => value.decorations);
  }
});

const latexMathFocus = EditorView.focusChangeEffect.of((_state, focused) => {
  return mathFocusEffect.of(focused);
});

export const latexMathPlugin: Extension = [
  latexMathState,
  latexMathFocus,
  latexMathNavigation
];