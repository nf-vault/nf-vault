import { useState } from "react";

import { deleteDocument, type DocumentListItem } from "@/06-shared/api";
import { useNotifyError } from "@/06-shared/lib/useNotifyError";
import { PopupButton, PopupWindow } from "@/06-shared/ui/popups";

import styles from "./index.module.css";

type props = {
  document: DocumentListItem
  onProcessFinished?: () => void
}

export const DeleteTreeNodePopup = (
  {
    document,
    onProcessFinished = () => {},
  }: props
) => {
  const [isShown, setShown] = useState(false);
  const showError = useNotifyError();

  const removeDocument = async () => {
    try {
      await deleteDocument({ docId: document.id });
      setShown(false);
      onProcessFinished();
    } catch (error) {
      showError(error);
    }
  };

  return (
    <>
      <button
        className={styles.actionButton}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setShown(true);
        }}
      >
        [del]
      </button>
      {isShown ? (
        <PopupWindow name="Удалить" onClose={() => setShown(false)}>
          <p className={styles.confirmText}>
            Удалить {document.type === "directory" ? "директорию" : "файл"} "{document.title}"?
          </p>
          <p className={styles.confirmHint}>
            {document.type === "directory" ? "Содержимое директории тоже будет удалено" : "Это действие нельзя отменить"}
          </p>
          <PopupButton name="[Cancel]" onClick={() => setShown(false)}/>
          <PopupButton name="[Delete]" onClick={removeDocument}/>
        </PopupWindow>
      ) : null}
    </>
  );
};