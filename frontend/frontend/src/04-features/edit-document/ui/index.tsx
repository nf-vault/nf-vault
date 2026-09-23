import CodeMirror from "@uiw/react-codemirror";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import styles from "./index.module.css";
import { useAutoSaveDocument } from "../lib/useAutoSaveDocument";

type EditorConfig = Pick<
  ReactCodeMirrorProps,
  "extensions" | "theme" | "placeholder" | "basicSetup"
>;

type Props = {
  documentId: number;
  content: string;
  onChange: (content: string) => void;
  config: EditorConfig;
  onCreateEditor?: ReactCodeMirrorProps["onCreateEditor"];
  onUpdate?: ReactCodeMirrorProps["onUpdate"];
  readOnly?: boolean;
  autoSaveEnabled?: boolean;
};

export const MarkdownEditor = ({
  documentId,
  content,
  onChange,
  config,
  onCreateEditor,
  onUpdate,
  readOnly = false,
  autoSaveEnabled = true,
}: Props) => {
  useAutoSaveDocument({ content, documentId, enabled: autoSaveEnabled });

  return (
    <CodeMirror
      {...config}
      className={styles.editorTextarea}
      value={content}
      onChange={onChange}
      onCreateEditor={onCreateEditor}
      onUpdate={onUpdate}
      readOnly={readOnly}
      editable={!readOnly}
    />
  );
};
