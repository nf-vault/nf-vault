import { DropdownMenu } from "@/06-shared/ui/dropdown-menu"
import { CreateDirectoryButton } from "./create-directory-button"
import { CreateDocumentButton } from "./create-document-button"
import { RefObject } from "react";
import styles from "./index.module.css"

type props = {
  isShown: boolean
  setShown: (shown: boolean) => void
  buttonRef?: RefObject<HTMLElement | null>
  parentId?: number | null
  onProcessFinished?: () => void
}

export const CreateFileDropdown = (
  {
    isShown,
    setShown,
    buttonRef,
    parentId = null,
    onProcessFinished = () => {},
  } : props
) => {
  return isShown ?  (
    <DropdownMenu onClose={() => setShown(false)} buttonRef={buttonRef}>
      <div className={styles.wrapper}>
        <div className={styles.header}>create</div>
        <CreateDirectoryButton parentId={parentId} onProcessFinished={() => {setShown(false); onProcessFinished()}}/>
        <CreateDocumentButton parentId={parentId} onProcessFinished={() => {setShown(false); onProcessFinished()}}/>
      </div>
    </DropdownMenu>
  ): null
}