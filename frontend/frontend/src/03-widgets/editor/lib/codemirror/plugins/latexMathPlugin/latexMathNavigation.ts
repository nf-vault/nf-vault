import { syntaxTree } from "@codemirror/language";
import { EditorSelection, EditorState } from "@uiw/react-codemirror";

const getMarkerLength = (nodeName: string) => {
  return nodeName === "BlockMath" ? 2 : 1;
};

const getCrossedMathPosition = (
  state: EditorState,
  from: number,
  to: number
) => {
  const isForward = to > from;
  let position: number | null = null;
  let nearestBoundary = isForward ? state.doc.length + 1 : -1;

  syntaxTree(state).iterate({
    enter(node) {
      if (node.name !== "InlineMath" && node.name !== "BlockMath") return;

      const wasCrossed = isForward
        ? node.from >= from && node.to < to
        : node.to <= from && node.from > to;
      const boundary = isForward ? node.from : node.to;

      if (
        wasCrossed
        && (isForward
          ? boundary < nearestBoundary
          : boundary > nearestBoundary)
      ) {
        const markerLength = getMarkerLength(node.name);
        position = isForward
          ? node.from + markerLength
          : node.to - markerLength;
        nearestBoundary = boundary;
      }

      return false;
    }
  });

  return position;
};

export const latexMathNavigation = EditorState.transactionFilter.of(
  (transaction) => {
    if (
      transaction.docChanged
      || !transaction.isUserEvent("select")
      || transaction.isUserEvent("select.pointer")
    ) {
      return transaction;
    }

    const previousSelection = transaction.startState.selection.main;
    const nextSelection = transaction.newSelection.main;
    if (!previousSelection.empty || !nextSelection.empty) return transaction;

    const position = getCrossedMathPosition(
      transaction.startState,
      previousSelection.head,
      nextSelection.head
    );
    if (position === null) return transaction;

    return [
      transaction,
      { selection: EditorSelection.cursor(position) }
    ];
  }
);