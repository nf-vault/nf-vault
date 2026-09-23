import type { EditorView } from "@uiw/react-codemirror";

export const replaceUploadPlaceholder = (
  view: EditorView,
  placeholder: string,
  replacement: string
) => {
  if (!view.dom.isConnected) return;

  const source = view.state.doc.toString();
  const from = source.indexOf(placeholder);
  if (from < 0) return;

  view.dispatch({
    changes: {
      from,
      to: from + placeholder.length,
      insert: replacement
    }
  });
};