import styles from "./index.module.css"

import { Browser } from "@/03-widgets/browser/ui"
import { Editor } from "@/03-widgets/editor"
import { Path, type PathItem } from "@/03-widgets/path"
import { SearchBar } from "@/03-widgets/search-bar"
import { Topbar } from "@/03-widgets/topbar"
import type { DocumentListItem } from "@/06-shared/api";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

type Props = {
  currentDirectoryId: number | null;
  path: PathItem[];
};

export const TreePage = ({ currentDirectoryId, path }: Props) => {
  const navigate = useNavigate();
  const [readmeDocumentId, setReadmeDocumentId] = useState<number | null>(null);
  const handleDocumentsLoaded = useCallback((documents: DocumentListItem[]) => {
    const readme = documents.find((document) => (
      document.type === "document" && document.title === "README"
    ));

    setReadmeDocumentId(readme?.id ?? null);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <Topbar>
        <SearchBar/>
      </Topbar>
      <div className={styles.treeWrapper}>
        <Path
          path={path}
          onNavigate={(id) => navigate(id === null ? "/" : `/${id}`)}
        />
        {readmeDocumentId !== null ? (
          <div className={styles.readmeWrapper}>
            <Editor
              showTitle={false}
              documentId={readmeDocumentId}
            />
          </div>
        ) : null}
        <Browser
          parentId={currentDirectoryId}
          onDocumentsLoaded={handleDocumentsLoaded}
        />
      </div>
    </div>
  )
}