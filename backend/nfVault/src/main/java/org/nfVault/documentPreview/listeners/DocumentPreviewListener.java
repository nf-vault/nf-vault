package org.nfVault.documentPreview.listeners;

import org.nfVault.documentPreview.services.DocumentPreviewService;
import org.nfVault.documents.events.DocumentCreatedEvent;
import org.nfVault.documents.events.DocumentNameChangedEvent;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
class DocumentPreviewListener {
    private final DocumentPreviewService documentPreviewService;

    public DocumentPreviewListener(
            DocumentPreviewService documentPreviewService
    ) {
        this.documentPreviewService = documentPreviewService;
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "document-preview-service", durable = "true"),
            exchange = @Exchange(value = "${outbox.amqp-exchange-name:outbox.events}", type = "topic"),
            key = "document.created"
    ), containerFactory = "outboxRabbitListenerContainerFactory")
    public void updateThumbnailOnDocumentCreate(DocumentCreatedEvent event) {
        this.documentPreviewService.updateThumbnail(event.title(), event.id());
    }


    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "document-preview-service", durable = "true"),
            exchange = @Exchange(value = "${outbox.amqp-exchange-name:outbox.events}", type = "topic"),
            key = "document.name-changed"
    ), containerFactory = "outboxRabbitListenerContainerFactory")
    public void updateThumbnailOnDocumentNameChanged(DocumentNameChangedEvent event) {
        this.documentPreviewService.updateThumbnail(event.title(), event.id());
    }
}
