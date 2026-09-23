import { WidgetType } from "@uiw/react-codemirror";

export class MarkdownMarkerWidget extends WidgetType {
  constructor(
    private readonly text: string,
    private readonly className: string,
  ) {
    super();
  }

  eq(widget: WidgetType) {
    return widget instanceof MarkdownMarkerWidget
      && widget.text === this.text
      && widget.className === this.className;
  }

  toDOM(): HTMLSpanElement {
    const element = document.createElement("span");
    element.className = this.className;
    element.textContent = this.text;
    return element;
  }
}