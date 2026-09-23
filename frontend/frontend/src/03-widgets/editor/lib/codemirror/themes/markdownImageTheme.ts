import { EditorView } from "@uiw/react-codemirror";

export const markdownImageTheme = EditorView.theme({
  ".cm-markdown-image": {
    display: "inline-block",
    maxWidth: "100%",
    height: "auto",
    borderRadius: "4px",
    objectFit: "contain",
    verticalAlign: "middle"
  }
});