package org.nfVault.documentPreview.services;

import org.PreviewCanvasConfig;
import org.PreviewGenerator;
import org.background.config.ColorBackgroundGeneratorConfig;
import org.caption.CaptionGenerationConfig;
import org.caption.CaptionPosition;
import org.caption.Padding;
import org.nfVault.documentPreview.events.PreviewCreatedEvent;
import org.nfVault.documents.events.DocumentNameChangedEvent;
import org.nfVault.media.api.ImageAPI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.awt.*;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Component
public class DocumentPreviewService {
    private final Font previewFont;
    private final ThreadPoolExecutor previewGenerationExecutorService;
    private final ImageAPI imageAPI;
    private final ApplicationEventPublisher eventPublisher;

    public DocumentPreviewService(
            @Value("${preview.font-path:/fonts/font.ttf}") String fontResourcesPath,
            ImageAPI imageAPI,
            ApplicationEventPublisher eventPublisher
    ) {
        this.imageAPI = imageAPI;
        this.eventPublisher = eventPublisher;

        this.previewGenerationExecutorService = new ThreadPoolExecutor(
                0,
                4,
                2, TimeUnit.MINUTES,
                new java.util.concurrent.LinkedBlockingQueue<>(60)
        );

        try (final InputStream fontInputStream = getClass().getResourceAsStream(fontResourcesPath)) {
            if (fontInputStream == null) {
                throw new RuntimeException("Can't find font file");
            }
            this.previewFont = Font.createFont(Font.TRUETYPE_FONT, fontInputStream).deriveFont(20f);
        } catch (IOException e) {
            throw new RuntimeException("Can't open font file", e);
        } catch (FontFormatException e) {
            throw new RuntimeException("Can't load font", e);
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void updateThumbnail(DocumentNameChangedEvent event) {
        new PreviewGenerator(
                new PreviewCanvasConfig(
                        800,
                        400
                ),
                new ColorBackgroundGeneratorConfig(
                        "#0F172A"
                ),
                new CaptionGenerationConfig(
                        event.title(),
                        this.previewFont,
                        Color.decode("#FFFFFF"),
                        CaptionPosition.CENTER_LEFT,
                        Color.decode("#1E293B"),
                        new Padding(7),
                        new Padding(40),
                        0,
                        500,
                        5
                )
        ).generate(previewGenerationExecutorService).whenComplete((preview, throwable) -> {
            if (throwable != null) {
                throw new RuntimeException("Error while generating preview", throwable);
            }
            else {
                eventPublisher.publishEvent(
                        new PreviewCreatedEvent(
                                event.id(),
                                imageAPI.saveImage(preview)
                        )
                );
            }
        });
    }
}
