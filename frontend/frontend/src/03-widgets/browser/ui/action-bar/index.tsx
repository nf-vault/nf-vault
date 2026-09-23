import styles from "./index.module.css"
import { CreateFileButton } from "../create-file-button";

type props = {
  parentId?: number | null
  onProcessFinished?: () => void
}

export const ActionBar = (
  {
    parentId = null,
    onProcessFinished = () => {},
  }: props
) => {
  return (
    <div className={styles.container}>
      <CreateFileButton parentId={parentId} onProcessFinished={onProcessFinished}/>
    </div>
  );
};