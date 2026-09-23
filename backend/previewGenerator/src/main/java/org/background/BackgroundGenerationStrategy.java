package org.background;

import org.PreviewGenerationContext;

import java.awt.*;

public abstract class BackgroundGenerationStrategy<T extends BackgroundGeneratorConfig> {
    private final T config;

    public BackgroundGenerationStrategy(T config) {
        this.config = config;
    }

    public abstract void generate(PreviewGenerationContext context);

    protected T getConfig() {
        return config;
    }
}
