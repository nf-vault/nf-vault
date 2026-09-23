package org.caption.utils;

import org.caption.CaptionPosition;
import org.caption.Padding;

import java.awt.*;

public final class PositionCalc {
    public static Point calculatePosition(
            CaptionPosition position,
            int canvasWidth,
            int canvasHeight,
            int boxWidth,
            int boxHeight,
            Padding canvasPadding
    ) {
        return switch (position) {
            case TOP_LEFT -> new Point(
                    canvasPadding.left(),
                    canvasPadding.top()
            );

            case TOP_CENTER -> new Point(
                    (canvasWidth - boxWidth) / 2,
                    canvasPadding.top()
            );

            case TOP_RIGHT -> new Point(
                    canvasWidth - boxWidth - canvasPadding.right(),
                    canvasPadding.top()
            );

            case CENTER_LEFT -> new Point(
                    canvasPadding.left(),
                    (canvasHeight - boxHeight) / 2
            );

            case CENTER_CENTER -> new Point(
                    (canvasWidth - boxWidth) / 2,
                    (canvasHeight - boxHeight) / 2
            );

            case CENTER_RIGHT -> new Point(
                    canvasWidth - boxWidth - canvasPadding.right(),
                    (canvasHeight - boxHeight) / 2
            );

            case BOTTOM_LEFT -> new Point(
                    canvasPadding.left(),
                    canvasHeight - boxHeight - canvasPadding.bottom()
            );

            case BOTTOM_CENTER -> new Point(
                    (canvasWidth - boxWidth) / 2,
                    canvasHeight - boxHeight - canvasPadding.bottom()
            );

            case BOTTOM_RIGHT -> new Point(
                    canvasWidth - boxWidth - canvasPadding.right(),
                    canvasHeight - boxHeight - canvasPadding.bottom()
            );
        };
    }
}