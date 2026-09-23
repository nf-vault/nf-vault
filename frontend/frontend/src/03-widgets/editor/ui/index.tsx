import styles from "./index.module.css";

import type { EditorState, EditorView } from "@uiw/react-codemirror";
import { useEffect, useState } from "react";

import { topbarButtons } from "../config/topbar/Topbar";
import { EditorTitle } from "@/04-features/edit-title";
import { MarkdownEditor } from "@/04-features/edit-document";
import { EditorTopbar } from "@/04-features/editor-toolbar";
import { getDocument } from "@/06-shared/api";
import { useNotifyError } from "@/06-shared/lib/useNotifyError";
import { editorConfig } from "../lib/codemirror/config";

type props = {
  readonly documentId: number
  readonly showTitle?: boolean
}

const Editor = (
  {
    documentId,
    showTitle = true
  }: props
) => {
  const [content, setContent] = useState("");
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [isReadOnly, setReadOnly] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const showError = useNotifyError();

  useEffect(() => {
    let isActive = true;

    const loadDocument = async () => {
      setIsLoaded(false);

      try {
        const document = await getDocument({ docId: documentId });
        if (!isActive) return;

        setContent(document.content);
        setTitle(document.title);
      } catch (error) {
        if (!isActive) return;

        showError(error);
      } finally {
        if (!isActive) return;

        setIsLoaded(true);
      }
    };

    loadDocument();

    return () => {
      isActive = false;
    };
  }, [documentId]);

  return (
    <div className={styles.editorWrapper}>
      { showTitle ?
        <EditorTitle
          documentId={documentId}
          title={title}
          onChange={setTitle}
          readOnly={isReadOnly}
          autoSaveEnabled={isLoaded}
        /> : null
      }
      <EditorTopbar
        state={editorState}
        view={editorView}
        topbarButtons={topbarButtons}
        isReadOnly={isReadOnly}
        onToggleReadOnly={() => setReadOnly((value) => !value)}
      />
      <MarkdownEditor
        documentId={documentId}
        content={content}
        onChange={setContent}
        config={editorConfig}
        onCreateEditor={(view, state) => {
          setEditorView(view);
          setEditorState(state);
        }}
        onUpdate={(update) => {
          if (update.docChanged || update.selectionSet) {
            setEditorState(update.state);
          }
        }}
        readOnly={isReadOnly}
        autoSaveEnabled={isLoaded}
      />
    </div>
  )
}

export default Editor;
