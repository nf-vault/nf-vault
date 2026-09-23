import { EditorView } from "@uiw/react-codemirror";

export const latexMathTheme = EditorView.theme({
  ".cm-markdown-math-widget": {
    color: "var(--text-primary)",
    cursor: "text"
  },
  ".cm-markdown-math-widget-inline": {
    display: "inline-block",
    maxWidth: "100%",
    verticalAlign: "middle"
  },
  ".cm-markdown-math-widget-block": {
    display: "inline-flex",
    width: "100%",
    padding: "0.5rem 0",
    justifyContent: "center",
    overflowX: "auto",
    verticalAlign: "middle"
  },
  ".cm-markdown-math-widget-error": {
    color: "var(--error-bg)",
    fontFamily: "monospace",
    textDecoration: "underline wavy"
  }
});