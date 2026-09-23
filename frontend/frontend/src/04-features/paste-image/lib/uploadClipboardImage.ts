import type { EditorView } from "@uiw/react-codemirror";
import { uploadImage } from "@/06-shared/api";
import { createImageMarkdown, createUploadErrorMarkdown } from "./imageMarkdown";
import { replaceUploadPlaceholder } from "./replaceUploadPlaceholder";

export const uploadClipboardImage = async (
  view: EditorView,
  file: File,
  placeholder: string
) => {
  try {
    const { url } = await uploadImage(file);
    replaceUploadPlaceholder(
      view,
      placeholder,
      createImageMarkdown(file, url)
    );
  } catch (error) {
    replaceUploadPlaceholder(
      view,
      placeholder,
      createUploadErrorMarkdown(file)
    );
    console.error("Failed to upload pasted image", error);
  }
};