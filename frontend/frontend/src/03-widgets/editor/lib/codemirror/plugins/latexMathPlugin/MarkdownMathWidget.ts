import katex from "katex";
import { WidgetType } from "@uiw/react-codemirror";
import type { EditorView } from "@uiw/react-codemirror";
import "katex/dist/katex.min.css";

type MarkdownMathWidgetConfig = {
  source: string;
  rawSource: string;
  displayMode: boolean;
  sourceFrom: number;
};

export class MarkdownMathWidget extends WidgetType {
  constructor(private readonly config: MarkdownMathWidgetConfig) {
    super();
  }

  eq(widget: MarkdownMathWidget) {
    return widget.config.source === this.config.source
      && widget.config.displayMode === this.config.displayMode
      && widget.config.sourceFrom === this.config.sourceFrom;
  }

  toDOM(view: EditorView): HTMLElement {
    const element = document.createElement("span");
    element.className = this.config.displayMode
      ? "cm-markdown-math-widget cm-markdown-math-widget-block"
      : "cm-markdown-math-widget cm-markdown-math-widget-inline";

    try {
      katex.render(this.config.source, element, {
        displayMode: this.config.displayMode,
        throwOnError: true,
        trust: false
      });
    } catch (error) {
      element.classList.add("cm-markdown-math-widget-error");
      element.textContent = this.config.rawSource;
      element.title = error instanceof Error ? error.message : "Invalid formula";
    }

    element.addEventListener("mousedown", (event) => {
      event.preventDefault();
      view.dispatch({
        selection: { anchor: this.config.sourceFrom },
        scrollIntoView: true
      });
      view.focus();
    });

    return element;
  }

  ignoreEvent(): boolean {
    return true;
  }
}