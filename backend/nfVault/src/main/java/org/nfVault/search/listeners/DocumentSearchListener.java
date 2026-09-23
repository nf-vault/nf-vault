package org.nfVault.search.listeners;

import org.nfVault.documents.events.DocumentChangedEvent;
import org.nfVault.documents.events.DocumentCreatedEvent;
import org.nfVault.documents.events.DocumentDeletedEvent;
import org.nfVault.search.services.DocumentSearchService;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
class DocumentSearchListener {
    private final DocumentSearchService documentSearchService;

    public DocumentSearchListener(
            DocumentSearchService documentSearchService
    ) {
        this.documentSearchService = documentSearchService;
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "document-search-service", durable = "true"),
            exchange = @Exchange(value = "${outbox.amqp-exchange-name:outbox.events}", type = "topic"),
            key = "document.deleted"
    ), containerFactory = "outboxRabbitListenerContainerFactory")
    public void deleteFromIndexOnDocumentDelete(DocumentDeletedEvent event) {
        documentSearchService.deleteFromIndex(event.id());
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "document-search-service", durable = "true"),
            exchange = @Exchange(value = "${outbox.amqp-exchange-name:outbox.events}", type = "topic"),
            key = "document.changed"
    ), containerFactory = "outboxRabbitListenerContainerFactory")
    public void updateIndexOnDocumentChange(DocumentChangedEvent event) {
        this.documentSearchService.updateIndex(
                event.id(),
                event.type(),
                event.title(),
                event.content()
        );
    }
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "document-search-service", durable = "true"),
            exchange = @Exchange(value = "${outbox.amqp-exchange-name:outbox.events}", type = "topic"),
            key = "document.created"
    ), containerFactory = "outboxRabbitListenerContainerFactory")
    public void updateIndexOnDocumentCreate(DocumentCreatedEvent event) {
        this.documentSearchService.updateIndex(
                event.id(),
                event.type(),
                event.title(),
                ""
        );
    }
}
