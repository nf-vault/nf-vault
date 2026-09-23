import styles from "./index.module.css"

type props = {
  name: string
  onClick?: () => void
}

export const PathElem = (
  {
    name,
    onClick,
  }: props
) => {
  return (
    <p className={styles.pathElem} onClick={onClick}>
      {name}
    </p>
  )
}