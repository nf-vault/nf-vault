package org.background.strategy;

import org.PreviewGenerationContext;
import org.background.BackgroundGenerationStrategy;
import org.background.config.ImageBackgroundGeneratorConfig;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;

public class ImageBackgroundStrategy extends BackgroundGenerationStrategy<ImageBackgroundGeneratorConfig> {
    public ImageBackgroundStrategy(ImageBackgroundGeneratorConfig config) {
        super(config);
    }

    @Override
    public void generate(PreviewGenerationContext context) {
        final Graphics2D imageGraphicsContext = context.imageGraphicsContext();
        final BufferedImage image;

        try {
            image = this.getConfig().imageProvider().getImage(
                    getConfig().backgroundImagePath()
            );
        } catch (IOException e) {
            throw new RuntimeException("Unable to resolve image: ", e);
        }

        imageGraphicsContext.drawImage(
                image,
                0,
                0,
                context.canvasConfig().width(),
                context.canvasConfig().height(),
                null
        );
    }
}