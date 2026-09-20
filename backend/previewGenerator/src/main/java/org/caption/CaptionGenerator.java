package org.caption;

import org.PreviewGenerationContext;
import org.caption.utils.CaptionLayoutCalc;
import org.caption.utils.PositionCalc;

import java.awt.*;

public class CaptionGenerator {
    private final CaptionGenerationConfig config;

    public CaptionGenerator(CaptionGenerationConfig config) {
        this.config = config;
    }

    public void generate(PreviewGenerationContext context) {
        final Graphics2D imageGraphicsContext = context.imageGraphicsContext();

        // Must be here for correct metrics and the following calculations
        imageGraphicsContext.setFont(config.font());

        final FontMetrics metrics = imageGraphicsContext.getFontMetrics();
        final CaptionLayoutCalc.CaptionLayout layout = CaptionLayoutCalc.calculate(
                config.text(),
                metrics,
                config.maxTextWidth(),
                config.lineSpacing()
        );

        final int lineHeight = metrics.getAscent() + metrics.getDescent();
        final int lineSpacing = config.lineSpacing();

        // Overall height of text block
        final int boxHeight = layout.lines().size() * lineHeight
                + Math.max(0, layout.lines().size() - 1) * lineSpacing
                + config.boxPadding().top()
                + config.boxPadding().bottom();

        final int maxLineWidth = layout.lines().stream()
                .mapToInt(metrics::stringWidth)
                .max()
                .orElse(0);
        final int boxWidth = maxLineWidth  + config.boxPadding().left() + config.boxPadding().right();

        final Point boxPosition = PositionCalc.calculatePosition(
                config.position(),
                context.canvasConfig().width(),
                context.canvasConfig().height(),
                boxWidth,
                boxHeight,
                config.canvasPadding()
        );

        int textY = boxPosition.y + config.boxPadding().top() + metrics.getAscent();
        for (String line : layout.lines()) {
            final int lineWidth = metrics.stringWidth(line);
            final int lineBoxWidth = lineWidth + config.boxPadding().left() + config.boxPadding().right();
            final int lineBoxHeight = lineHeight + config.boxPadding().top() + config.boxPadding().bottom();
            final int textX = boxPosition.x + config.boxPadding().left();
            final int lineBoxX = boxPosition.x;
            final int lineBoxY = textY - metrics.getAscent() - config.boxPadding().top();

            // Background
            imageGraphicsContext.setColor(config.backgroundColor());
            imageGraphicsContext.fillRoundRect(
                    lineBoxX,
                    lineBoxY,
                    lineBoxWidth,
                    lineBoxHeight,
                    config.borderRadius(),
                    config.borderRadius()
            );

            // Text
            imageGraphicsContext.setColor(config.color());
            imageGraphicsContext.drawString(line, textX, textY);

            textY += lineHeight + lineSpacing;
        }
    }
}