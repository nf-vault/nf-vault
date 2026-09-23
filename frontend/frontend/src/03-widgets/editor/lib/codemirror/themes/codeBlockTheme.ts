import {
  HighlightStyle,
  languageDataProp,
  syntaxHighlighting
} from "@codemirror/language";
import { markdownLanguage } from "@codemirror/lang-markdown";
import { EditorView } from "@uiw/react-codemirror";
import { sublimeDarkStyle } from "@uiw/codemirror-theme-sublime";
import type { Highlighter } from "@lezer/highlight";

const sublimeHighlightStyle = HighlightStyle.define(sublimeDarkStyle);
const sublimeCodeHighlighter: Highlighter = {
  style: sublimeHighlightStyle.style,
  scope: (nodeType) => {
    return nodeType.prop(languageDataProp) !== markdownLanguage.data;
  }
};

const codeSyntaxTheme = [
  sublimeHighlightStyle.module
    ? EditorView.styleModule.of(sublimeHighlightStyle.module)
    : [],
  syntaxHighlighting(sublimeCodeHighlighter)
];

const codeBlockViewTheme = EditorView.theme({
  ".cm-markdown-code-block-line": {
    boxSizing: "border-box",
    padding: "0 0.75rem 0 0.5rem",
    borderLeft: "1px solid var(--editor-border)",
    borderRight: "1px solid var(--editor-border)",
    background: "color-mix(in srgb, var(--text-primary) 7%, transparent)",
    fontFamily: "monospace",
    textAlign: "left",
    textAlignLast: "left",
    hyphens: "none"
  },
  ".cm-markdown-code-block-line[data-code-line-number]": {
    position: "relative",
    paddingLeft: "2rem"
  },
  ".cm-markdown-code-block-line[data-code-line-number]::before": {
    content: "attr(data-code-line-number)",
    position: "absolute",
    left: "0.25rem",
    width: "1.75rem",
    paddingRight: "0.25rem",
    color: "var(--text-secondary)",
    fontSize: "0.8em",
    textAlign: "right",
    userSelect: "none",
    pointerEvents: "none"
  },
  ".cm-markdown-code-block-line-start": {
    position: "relative",
    paddingTop: "0.5rem",
    borderTop: "1px solid var(--editor-border)",
    borderRadius: "4px 4px 0 0"
  },
  ".cm-markdown-code-block-line-end": {
    paddingBottom: "0.5rem",
    borderBottom: "1px solid var(--editor-border)",
    borderRadius: "0 0 4px 4px"
  },
  ".cm-markdown-code-block-line-collapsed": {
    minHeight: "0",
    fontSize: "0",
    lineHeight: "0"
  },
  ".cm-markdown-code-block-line-start.cm-markdown-code-block-line-end": {
    borderRadius: "4px"
  },
  ".cm-markdown-code-block-line-start[data-code-language]::after": {
    content: "attr(data-code-language)",
    position: "absolute",
    top: "0.25rem",
    right: "0.5rem",
    color: "var(--text-secondary)",
    fontSize: "0.75rem",
    lineHeight: "1",
    pointerEvents: "none"
  }
});

export const codeBlockTheme = [codeBlockViewTheme, codeSyntaxTheme];