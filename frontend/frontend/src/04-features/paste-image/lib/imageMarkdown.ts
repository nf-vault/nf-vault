const getImageAlt = (file: File) => {
  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return baseName.replace(/[\\[\]]/g, "\\$&");
};

export const createUploadPlaceholder = (file: File) => {
  const token = `nf-vault-upload-${crypto.randomUUID()}`;
  return `[Uploading ${getImageAlt(file)}...](${token})`;
};

export const createImageMarkdown = (file: File, url: string) => {
  return `![${getImageAlt(file)}](${url})`;
};

export const createUploadErrorMarkdown = (file: File) => {
  return `![Image upload failed: ${getImageAlt(file)}]()`;
};