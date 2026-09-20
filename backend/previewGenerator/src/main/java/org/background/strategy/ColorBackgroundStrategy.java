package org.background.strategy;

import org.PreviewGenerationContext;
import org.background.BackgroundGenerationStrategy;
import org.background.config.ColorBackgroundGeneratorConfig;

import java.awt.*;

public class ColorBackgroundStrategy extends BackgroundGenerationStrategy<ColorBackgroundGeneratorConfig> {
    public ColorBackgroundStrategy(ColorBackgroundGeneratorConfig config) {
        super(config);
    }

    @Override
    public void generate(PreviewGenerationContext context) {
        final Graphics2D imageGraphicsContext = context.imageGraphicsContext();

        imageGraphicsContext.setColor(
                Color.decode(getConfig().backgroundColor())
        );
        imageGraphicsContext.fillRect(
                0,
                0,
                context.canvasConfig().width(),
                context.canvasConfig().height()
        );
    }
}
