type ImageControlsConfig = {
  onSource: () => void;
};

export const createImageControls = ({ onSource }: ImageControlsConfig) => {
  const controls = document.createElement("span");
  const sourceButton = document.createElement("button");
  
  controls.className = "cm-markdown-image-controls";
  controls.hidden = true;
  
  sourceButton.className = "cm-markdown-image-source-button";
  sourceButton.type = "button";
  sourceButton.textContent = "[source]";
  sourceButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSource();
  });
  controls.append(sourceButton);

  return { controls };
};