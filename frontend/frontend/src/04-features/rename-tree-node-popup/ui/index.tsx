import { useState } from "react";

import { type DocumentListItem, updateDocument } from "@/06-shared/api";
import { useNotifyError } from "@/06-shared/lib/useNotifyError";
import { PopupButton, PopupInput, PopupWindow } from "@/06-shared/ui/popups";

import styles from "./index.module.css";

type props = {
  document: DocumentListItem
  onProcessFinished?: () => void
}

export const RenameTreeNodePopup = (
  {
    document,
    onProcessFinished = () => {},
  }: props
) => {
  const [isShown, setShown] = useState(false);
  const [newName, setNewName] = useState(document.title);
  const showError = useNotifyError();

  const openPopup = () => {
    setNewName(document.title);
    setShown(true);
  };

  const renameDocument = async () => {
    try {
      await updateDocument({
        docId: document.id,
        name: newName,
      });
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
          openPopup();
        }}
      >
        [ren]
      </button>
      {isShown ? (
        <PopupWindow name="Переименовать" onClose={() => setShown(false)}>
          <PopupInput
            name="Новое имя"
            value={newName}
            setInput={setNewName}
            onEnter={renameDocument}
            autoFocus={true}
          />
          <PopupButton name="[Ok]" onClick={renameDocument}/>
        </PopupWindow>
      ) : null}
    </>
  );
};