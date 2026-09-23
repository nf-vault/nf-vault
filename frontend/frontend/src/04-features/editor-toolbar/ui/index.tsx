import type { EditorState, EditorView } from "@uiw/react-codemirror";
import { TopbarButton } from "@/06-shared/ui/buttons/TopbarButton";
import {
  getMarkdownBlockName,
  isFormatActive,
  toggleMarkdownFormat,
} from "../lib/markdownFormatting";
import type { TopbarButtonConfig } from "../types/EditorTopbar.types";
import styles from "./index.module.css";

type Props = {
  state: EditorState | null;
  view: EditorView | null;
  topbarButtons: TopbarButtonConfig[];
  isReadOnly?: boolean;
  onToggleReadOnly?: () => void;
};

const EditorTopbar = ({
  state,
  view,
  topbarButtons,
  isReadOnly = false,
  onToggleReadOnly = () => {},
}: Props) => {
  return (
    <div className={styles.topbar}>
      <TopbarButton
        handleClick={onToggleReadOnly}
        title="Read Only"
        isActive={isReadOnly}
      >
        L
      </TopbarButton>

      <div className={styles.block}>{getMarkdownBlockName(state)}</div>

      <div className={styles.marks}>
        {topbarButtons.map(({ format, label, title }) => (
          <TopbarButton
            key={format}
            title={title}
            isActive={isFormatActive(state, format)}
            handleClick={(event) => {
              event.preventDefault();
              if (view) toggleMarkdownFormat(view, format);
            }}
            isDisabled={isReadOnly || !view}
          >
            {label}
          </TopbarButton>
        ))}
      </div>
    </div>
  );
};

export default EditorTopbar;
