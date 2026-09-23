import { EditorView } from "@uiw/react-codemirror";
import { getClipboardImages } from "./getClipboardImages";
import { createUploadPlaceholder } from "./imageMarkdown";
import { uploadClipboardImage } from "./uploadClipboardImage";

const handlePaste = (event: ClipboardEvent, view: EditorView) => {
  const images = getClipboardImages(event);
  if (images.length === 0) return false;

  event.preventDefault();

  const uploads = images.map((image) => ({
    image,
    placeholder: createUploadPlaceholder(image)
  }));
  const insert = uploads.map(({ placeholder }) => placeholder).join("\n");
  const selection = view.state.selection.main;

  view.dispatch({
    changes: {
      from: selection.from,
      to: selection.to,
      insert
    },
    selection: {
      anchor: selection.from + insert.length,
    }
  });

  uploads.forEach(({ image, placeholder }) => {
    void uploadClipboardImage(view, image, placeholder);
  });

  return true;
};

export const pasteImagePlugin = EditorView.domEventHandlers({
  paste: handlePaste
});