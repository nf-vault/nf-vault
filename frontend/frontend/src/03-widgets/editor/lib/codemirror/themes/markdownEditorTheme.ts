import { createTheme } from "@uiw/codemirror-themes";
import { Tag, tags } from "@lezer/highlight";

export const markdownSourceMarkerTag = Tag.define(
  "markdownSourceMarker",
  tags.punctuation,
);

export const markdownEditorTheme = createTheme({
  theme: "dark",
  settings: {
    background: "transparent",
    foreground: "var(--text-primary)",
    caret: "var(--text-accent)",
    selection: "color-mix(in srgb, var(--text-accent) 28%, transparent)",
    selectionMatch: "color-mix(in srgb, var(--text-accent) 18%, transparent)",
    lineHighlight: "transparent",
    gutterBackground: "transparent",
    gutterForeground: "var(--text-primary)",
  },
  styles: [
    {
      tag: tags.strong,
      fontWeight: "700",
    },
    {
      tag: tags.emphasis,
      fontStyle: "italic",
    },
    {
      tag: tags.monospace,
      padding: "0 0.18em",
      borderRadius: "3px",
      backgroundColor:
        "color-mix(in srgb, var(--text-primary) 10%, transparent)",
      fontFamily: "monospace",
    },
    {
      tag: tags.heading,
      fontWeight: "700",
    },
    {
      tag: tags.heading1,
      fontSize: "1.75em",
    },
    {
      tag: tags.heading2,
      fontSize: "1.5em",
    },
    {
      tag: tags.heading3,
      fontSize: "1.3em",
    },
    {
      tag: tags.heading4,
      fontSize: "1.15em",
    },
    {
      tag: tags.heading5,
      fontSize: "1.05em",
    },
    {
      tag: tags.heading6,
      fontSize: "1em",
      opacity: "0.85",
    },
    {
      tag: tags.quote,
      color: "color-mix(in srgb, var(--text-primary) 78%, transparent)",
      fontStyle: "italic",
    },
    {
      tag: tags.link,
      color: "var(--text-accent)",
      textDecoration: "underline",
      textUnderlineOffset: "0.16em",
    },
    {
      tag: tags.list,
      color: "var(--text-accent)",
    },
    {
      tag: markdownSourceMarkerTag,
      color: "var(--text-secondary)",
      fontStyle: "normal",
      fontWeight: "400",
      textDecoration: "none",
    },
  ],
});
