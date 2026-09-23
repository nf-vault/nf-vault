import type { ReactNode } from "react";

import styles from "./index.module.css"


type props = {
  name: string
  type: string
  onClick?: () => void
  actions?: ReactNode
}

export const File = (
  {
    name,
    type,
    onClick,
    actions,
  }: props
) => {
  const fileType = type === "directory" ? "dir" : "doc";

  return (
    <div className={styles.container} onClick={onClick}>
      <span className={styles.fileType}>{fileType}</span>
      <span className={styles.fileName}>{name}</span>
      <span
        className={styles.actions}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {actions}
      </span>
    </div>
  )
}