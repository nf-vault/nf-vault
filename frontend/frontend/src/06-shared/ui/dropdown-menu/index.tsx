import { useOutsideClick } from "@/06-shared/lib/useOutsideClick"
import { ReactNode, RefObject } from "react"
import styles from "./index.module.css"

type props = {
  children: ReactNode | ReactNode[]
  onClose: () => void
  buttonRef?: RefObject<HTMLElement | null>
}

export const DropdownMenu = (
  {
    children,
    onClose,
    buttonRef
  } : props
) => {
  const modalRef = useOutsideClick<HTMLDivElement>(() => onClose(), buttonRef);

  return (
    <div className={styles.window} ref={modalRef}>
      {
        children
      }
    </div>
  )
}