package org.background;

import org.background.config.ColorBackgroundGeneratorConfig;
import org.background.config.ImageBackgroundGeneratorConfig;
import org.background.strategy.ColorBackgroundStrategy;
import org.background.strategy.ImageBackgroundStrategy;


public class BackgroundGeneratorFactory {
    public BackgroundGenerationStrategy<?> create(
            BackgroundGeneratorConfig config
    ) {
        return switch (config.getType()) {
            case COLOR ->
                    new ColorBackgroundStrategy(
                            (ColorBackgroundGeneratorConfig) config
                    );
            case IMAGE ->
                    new ImageBackgroundStrategy(
                            (ImageBackgroundGeneratorConfig) config
                    );
        };
    }
}
