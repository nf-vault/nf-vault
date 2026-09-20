package org.nfVault.documents.listeners;

import org.nfVault.documentPreview.events.PreviewCreatedEvent;
import org.nfVault.documents.services.DocumentService;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;

class DocumentServiceListener {
    private final DocumentService documentService;

    public DocumentServiceListener(
            DocumentService documentService
    ) {
        this.documentService = documentService;
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "document-service", durable = "true"),
            exchange = @Exchange(value = "${outbox.amqp-exchange-name:outbox.events}", type = "topic"),
            key = "preview.created"
    ), containerFactory = "outboxRabbitListenerContainerFactory")
    private void updateDocumentPreviewOnPreviewCreate(PreviewCreatedEvent event) {
        documentService.updateDocumentPreview(
                event.id(),
                event.imagePath()
        );
    }
}
