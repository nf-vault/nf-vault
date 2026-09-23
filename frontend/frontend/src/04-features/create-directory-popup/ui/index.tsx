import { createDocument } from "@/06-shared/api"
import { useNotifyError } from "@/06-shared/lib/useNotifyError"
import { PopupButton, PopupInput, PopupWindow } from "@/06-shared/ui/popups"
import { useState } from "react"

type props = {
  isOpen: boolean
  parentId?: number | null
  onSuccess: () => void
  onClose: () => void
}

export const CreateDirectory = (
  {
    isOpen,
    parentId = null,
    onSuccess,
    onClose
  } : props
) => {
  const [dirName, setDirName] = useState<string>("")
  const showError = useNotifyError()
  
  const onCreateDir = async () => {
    try {
      await createDocument({
        name: dirName,
        type: "directory",
        parentId
      });
      onSuccess();
    } catch (error) {
      showError(error)
    } finally {
      onClose()
    }
  };
  
  return (
    isOpen ? (
      <PopupWindow name="Создать директоию" onClose={() => {onClose()}}>
        <PopupInput 
          name="Имя директории" 
          setInput={(data) => setDirName(data)}
          onEnter={onCreateDir}
          autoFocus={true}
        />
        <PopupButton name="[Ok]" onClick={() => onCreateDir()}/>
      </PopupWindow>
    ) : null
  )
}