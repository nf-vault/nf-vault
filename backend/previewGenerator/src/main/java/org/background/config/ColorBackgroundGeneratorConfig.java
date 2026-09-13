package org.background.config;

import org.background.BackgroundGeneratorConfig;
import org.background.BackgroundType;

public record ColorBackgroundGeneratorConfig(String backgroundColor) implements BackgroundGeneratorConfig {
    @Override
    public BackgroundType getType() {
        return BackgroundType.COLOR;
    }
}