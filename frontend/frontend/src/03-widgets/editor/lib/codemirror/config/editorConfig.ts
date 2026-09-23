import { markdown } from "@codemirror/lang-markdown";
import { languages as codeLanguages } from "@codemirror/language-data";
import { EditorView } from "@uiw/react-codemirror";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { pasteImagePlugin } from "@/04-features/paste-image";
import { latexMathExtension, latexMathPlugin, markdownWysiwygPlugin } from "../plugins";
import { codeBlockTheme, latexMathTheme, markdownEditorTheme, markdownImageActionsTheme, markdownImageTheme } from "../themes";

export type EditorConfig = Pick<
  ReactCodeMirrorProps,
  "extensions" | "theme" | "placeholder" | "basicSetup"
>;

export const editorConfig: EditorConfig = {
  extensions: [
    markdown({ codeLanguages, extensions: latexMathExtension }),
    EditorView.lineWrapping,
    markdownWysiwygPlugin,
    latexMathPlugin,
    pasteImagePlugin,
    markdownImageTheme,
    markdownImageActionsTheme,
    codeBlockTheme,
    latexMathTheme
  ],
  theme: markdownEditorTheme,
  placeholder: "Your text",
  basicSetup: {
    lineNumbers: false,
    foldGutter: false,
    highlightActiveLineGutter: false
  }
};