package org.background.config;

import org.background.BackgroundGeneratorConfig;
import org.background.BackgroundType;
import org.utils.image.ImageProvider;

import java.nio.file.Path;

public record ImageBackgroundGeneratorConfig(
        Path backgroundImagePath,
        ImageProvider imageProvider
) implements BackgroundGeneratorConfig {
    @Override
    public BackgroundType getType() {
        return BackgroundType.IMAGE;
    }
}