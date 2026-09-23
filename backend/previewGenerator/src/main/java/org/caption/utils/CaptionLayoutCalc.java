package org.caption.utils;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;


public final class CaptionLayoutCalc {
    public record CaptionLayout (
            List<String> lines,
            int textWidth,
            int textHeight
    ){}

    public static CaptionLayout calculate(
            String text,
            FontMetrics metrics,
            int maxTextWidth,
            int lineSpacing
    ) {
        final List<String> lines = new ArrayList<>();

        final String[] words = text.split("\\s+");
        final StringBuilder currentLine = new StringBuilder();

        for (String word : words) {
            final String candidate;

            if (currentLine.isEmpty()) {
                candidate = word;
            } else {
                candidate = currentLine + " " + word;
            }

            if (metrics.stringWidth(candidate) <= maxTextWidth) {
                currentLine.setLength(0);
                currentLine.append(candidate);
                continue;
            }

            if (!currentLine.isEmpty()) {
                lines.add(currentLine.toString());
                currentLine.setLength(0);
                currentLine.append(word);
            } else {
                lines.add(word);
            }
        }

        if (!currentLine.isEmpty()) {
            lines.add(currentLine.toString());
        }

        int textWidth = 0;
        for (String line : lines) {
            textWidth = Math.max(
                    textWidth,
                    metrics.stringWidth(line)
            );
        }

        final int textHeight = lines.size() * metrics.getHeight()
                + Math.max(0, lines.size() - 1) * lineSpacing;

        return new CaptionLayout(
                lines,
                textWidth,
                textHeight
        );
    }
}
