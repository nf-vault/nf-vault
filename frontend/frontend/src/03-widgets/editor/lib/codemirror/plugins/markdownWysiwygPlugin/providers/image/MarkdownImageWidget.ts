import { WidgetType } from "@uiw/react-codemirror";
import type { EditorView } from "@uiw/react-codemirror";
import { createImageControls, createImageResize } from "@/04-features/edit-image";

type MarkdownImageWidgetConfig = {
  source: string;
  alt: string;
  title: string | null;
  width: number | null;
  imageFrom: number;
  imageTo: number;
  decorationTo: number;
};

export class MarkdownImageWidget extends WidgetType {
  private destroyInteractions: (() => void) | null = null;

  constructor(private readonly config: MarkdownImageWidgetConfig) {
    super();
  }

  toDOM(view: EditorView): HTMLElement {
    const container = document.createElement("span");
    const frame = document.createElement("span");
    const image = this.createImage();

    container.className = "cm-markdown-image-widget";
    frame.className = "cm-markdown-image-frame";
    frame.append(image);
    container.append(frame);

    this.updateImage(frame, image);
    this.bindInteractions(view, container, frame, image);

    return container;
  }

  updateDOM(
    container: HTMLElement,
    view: EditorView,
    previousWidget: MarkdownImageWidget
  ): boolean {
    const frame = container.querySelector<HTMLElement>(
      ".cm-markdown-image-frame"
    );
    const image = frame?.querySelector<HTMLImageElement>(
      ".cm-markdown-image"
    );
    if (!frame || !image) return false;

    previousWidget.destroyInteractions?.();
    previousWidget.destroyInteractions = null;

    frame.querySelector(".cm-markdown-image-resize-handle")?.remove();
    frame.querySelector(".cm-markdown-image-controls")?.remove();
    this.updateImage(frame, image);
    this.bindInteractions(view, container, frame, image);

    return true;
  }

  ignoreEvent(): boolean {
    return true;
  }

  destroy(): void {
    this.destroyInteractions?.();
    this.destroyInteractions = null;
  }

  private bindInteractions(
    view: EditorView,
    container: HTMLElement,
    frame: HTMLElement,
    image: HTMLImageElement
  ) {
    const resizeHandle = this.createResizeHandle();
    const { controls } = createImageControls({
      onSource: () => this.showSource(view)
    });
    frame.append(resizeHandle, controls);

    const resize = createImageResize({
      view,
      container,
      frame,
      image,
      handle: resizeHandle,
      controls,
      imageTo: this.config.imageTo,
      decorationTo: this.config.decorationTo,
      initialWidth: this.config.width
    });

    const activateResize = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      resize.activate();
    };
    const showSource = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      this.showSource(view);
    };

    image.addEventListener("click", activateResize);
    image.addEventListener("dblclick", showSource);

    this.destroyInteractions = () => {
      image.removeEventListener("click", activateResize);
      image.removeEventListener("dblclick", showSource);
      resize.destroy();
    };
  }

  private createImage() {
    const image = document.createElement("img");

    image.className = "cm-markdown-image";
    image.src = this.config.source;
    image.alt = this.config.alt;
    image.loading = "lazy";

    if (this.config.title) image.title = this.config.title;

    return image;
  }

  private updateImage(frame: HTMLElement, image: HTMLImageElement) {
    if (image.getAttribute("src") !== this.config.source) {
      image.src = this.config.source;
    }
    image.alt = this.config.alt;

    if (this.config.title) {
      image.title = this.config.title;
    } else {
      image.removeAttribute("title");
    }

    if (this.config.width === null) {
      frame.style.removeProperty("width");
      image.style.removeProperty("width");
    } else {
      frame.style.width = `${this.config.width}%`;
      image.style.width = "100%";
    }
  }

  private createResizeHandle() {
    const handle = document.createElement("button");
    
    handle.className = "cm-markdown-image-resize-handle";
    handle.type = "button";
    handle.title = "Resize image";
    handle.setAttribute("aria-label", "Resize image");
    handle.hidden = true;

    return handle;
  }

  private showSource(view: EditorView) {
    view.dispatch({
      selection: {
        anchor: this.config.imageFrom,
        head: this.config.decorationTo
      },
      scrollIntoView: true
    });
    view.focus();
  }
}