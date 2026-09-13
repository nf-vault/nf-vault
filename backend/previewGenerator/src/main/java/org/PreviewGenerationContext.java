package org;

import java.awt.*;

public record PreviewGenerationContext(
        Graphics2D imageGraphicsContext,
        PreviewCanvasConfig canvasConfig
) implements AutoCloseable {
    @Override
    public void close() {
        if (imageGraphicsContext != null) {
            imageGraphicsContext.dispose();
        }
    }
}