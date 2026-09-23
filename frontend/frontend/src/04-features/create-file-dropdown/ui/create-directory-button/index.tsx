import { CreateDirectory } from "@/04-features/create-directory-popup";
import { useState } from "react";
import styles from "./index.module.css"

type props = {
  parentId?: number | null
  onProcessFinished?: () => void
}

export const CreateDirectoryButton = (
  {
    parentId = null,
    onProcessFinished = () => {}
  } : props
) => {
  const [isShown, setShown] = useState(false);

  return (
    <>
      <button className={styles.optionName} type="button" onClick={() => setShown(true)}>
        <span>[dir]</span>
        <span>directory</span>
      </button>
      <CreateDirectory
        isOpen={isShown}
        parentId={parentId}
        onClose={() => {setShown(false); onProcessFinished()}}
        onSuccess={() => {setShown(false); onProcessFinished()}}
      />
    </>
  )
}