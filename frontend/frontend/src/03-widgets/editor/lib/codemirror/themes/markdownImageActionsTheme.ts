import { EditorView } from "@uiw/react-codemirror";

export const markdownImageActionsTheme = EditorView.theme({
  ".cm-markdown-image-widget": {
    position: "relative",
    display: "inline-block",
    width: "100%",
    maxWidth: "100%",
    verticalAlign: "top"
  },
  ".cm-markdown-image-frame": {
    position: "relative",
    display: "inline-block",
    maxWidth: "100%",
    lineHeight: "0"
  },
  ".cm-markdown-image-frame-selected": {
    outline: "1px solid var(--text-secondary)"
  },
  ".cm-markdown-image-resize-handle": {
    position: "absolute",
    right: "-5px",
    bottom: "-5px",
    width: "10px",
    height: "10px",
    padding: "0",
    border: "1px solid var(--bg-primary)",
    background: "var(--text-primary)",
    cursor: "nwse-resize",
    touchAction: "none"
  },
  ".cm-markdown-image-resize-handle[hidden]": {
    display: "none"
  },
  ".cm-markdown-image-controls": {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    zIndex: "1",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "1px 5px",
    borderRadius: "2px",
    background: "rgb(0 0 0 / 72%)",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
    fontSize: "0.8rem"
  },
  ".cm-markdown-image-controls[hidden]": {
    display: "none"
  },
  ".cm-markdown-image-source-button": {
    appearance: "none",
    padding: "0",
    border: "0",
    background: "transparent",
    color: "var(--text-secondary)",
    font: "inherit",
    cursor: "pointer"
  },
  ".cm-markdown-image-source-button:hover": {
    color: "var(--text-primary)"
  }
});
