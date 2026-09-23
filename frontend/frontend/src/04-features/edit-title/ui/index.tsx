import styles from "./index.module.css"
import { useAutoSaveTitle } from "../lib/useAutoSaveTitle"

type props = {
  documentId: number
  title: string
  onChange: (title: string) => void
  readOnly?: boolean
  autoSaveEnabled?: boolean
}

const EditorTitle = (
  {
    documentId,
    title,
    onChange,
    readOnly = false,
    autoSaveEnabled = true,
  }: props
) => {
  useAutoSaveTitle({title, documentId, enabled: autoSaveEnabled});

  return (
    <input
      placeholder="Title"
      className={styles.title}
      value={title}
      readOnly={readOnly}
      disabled={readOnly}
      onChange={(e) => onChange(e.target.value)}
    ></input>
  );
}

export default EditorTitle;
