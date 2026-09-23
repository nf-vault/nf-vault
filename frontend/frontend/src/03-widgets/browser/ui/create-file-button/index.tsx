import { CreateFileDropdown } from "@/04-features/create-file-dropdown";
import { useState, useRef } from "react";
import styles from "./index.module.css";

type props = {
  parentId?: number | null
  onProcessFinished?: () => void
}

export const CreateFileButton = (
  {
    parentId = null,
    onProcessFinished = () => {},
  }: props
) => {
  const [isShown, setShown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        className={styles.button}
        type="button"
        onClick={() => setShown(true)}
      >
        [+]
      </button>
      <CreateFileDropdown
        isShown={isShown}
        setShown={setShown}
        buttonRef={buttonRef}
        parentId={parentId}
        onProcessFinished={onProcessFinished}
      />
    </div>
  );
};