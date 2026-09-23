import styles from "./index.module.css";

import { Editor } from "@/03-widgets/editor";
import { Path, type PathItem } from "@/03-widgets/path";
import { SearchBar } from "@/03-widgets/search-bar";
import { Topbar } from "@/03-widgets/topbar";
import { useNavigate } from "react-router";

type Props = {
  documentId: number;
  path: PathItem[];
};

const EditPage = ({ documentId, path }: Props) => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageWrapper}>
      <Topbar>
        <SearchBar/>
      </Topbar>
      <div className={styles.editorWrapper}>
        <Path
          path={path}
          onNavigate={(id) => navigate(id === null ? "/" : `/${id}`)}
        />
        <Editor documentId={documentId}/>
      </div>
    </div>
  )
}

export default EditPage;