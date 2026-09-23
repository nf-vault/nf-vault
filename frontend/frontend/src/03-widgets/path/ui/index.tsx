import styles from "./index.module.css"

import { PathElem } from "./pathElem";

export type PathItem = {
  id: number
  type?: string
  title: string
}

type props = {
  path: PathItem[]
  onNavigate?: (id: number | null) => void
}

export const Path = (
  {
    path,
    onNavigate = () => {},
  }: props
) => {
  return (
    <div className={styles.pathWrapper}>
      <PathElem
        name="/"
        onClick={() => onNavigate(null)}
      />
      {path.map((item, idx) => {       
          return (
            <span key={item.id}>
              {idx > 0 ? <p>/</p> : null}
              <PathElem
                name={item.title}
                onClick={() => onNavigate(item.id)}
              />
            </span>
          );
        })}
    </div>
  )
}