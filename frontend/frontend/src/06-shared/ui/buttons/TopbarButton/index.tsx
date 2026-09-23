import { ReactNode } from "react"
import styles from "./index.module.css"

type props = {
  title?: string,
  isActive?: boolean,
  handleClick: (e: React.MouseEvent) => void,
  isDisabled?: boolean,
  children: ReactNode | ReactNode[]
}

export const TopbarButton = (
  {
    title = "",
    isActive = false,
    handleClick,
    isDisabled = false,
    children
  }: props
) => {
  return (
    <button
      className={`
        ${styles['topbar-button']}
        ${isActive ? styles['active'] : ''}
      `}
      onClick={(e) => handleClick(e)}
      title={title}
      aria-label={title}
      disabled={isDisabled}
    >
        {children}
    </button>
  )
}