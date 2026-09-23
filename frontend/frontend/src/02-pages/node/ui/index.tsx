import { EditPage } from "@/02-pages/edit";
import { TreePage } from "@/02-pages/tree";
import { getDocumentPath, type DocumentPathItem } from "@/06-shared/api";
import { useNotifyError } from "@/06-shared/lib/useNotifyError";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";

type ResolvedNode = {
  id: number;
  path: DocumentPathItem[];
};

export const NodePage = () => {
  const { nodeId: nodeIdParam } = useParams();
  const navigate = useNavigate();
  const showError = useNotifyError();
  const nodeId = Number(nodeIdParam);
  const isNodeIdValid = Number.isInteger(nodeId) && nodeId > 0;
  const [resolvedNode, setResolvedNode] = useState<ResolvedNode | null>(null);

  useEffect(() => {
    if (!isNodeIdValid) return;

    let isActive = true;

    const resolveNode = async () => {
      try {
        const path = await getDocumentPath({ docId: nodeId });
        const node = path.at(-1);

        if (!node || !["document", "directory"].includes(node.type)) {
          throw new Error("Unknown node type");
        }
        if (!isActive) return;

        setResolvedNode({ id: nodeId, path });
      } catch (error) {
        if (!isActive) return;

        showError(error);
        navigate("/", { replace: true });
      }
    };

    resolveNode();

    return () => {
      isActive = false;
    };
  }, [nodeId, isNodeIdValid]);

  if (!isNodeIdValid) {
    return <Navigate to="/" replace/>;
  }

  if (resolvedNode?.id !== nodeId) {
    return null;
  }

  const node = resolvedNode.path.at(-1)!;

  return node.type === "document" ? (
    <EditPage documentId={nodeId} path={resolvedNode.path}/>
  ) : (
    <TreePage currentDirectoryId={nodeId} path={resolvedNode.path}/>
  );
};