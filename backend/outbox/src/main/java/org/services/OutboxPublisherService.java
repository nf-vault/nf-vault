package org.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
class OutboxPublisherService {
    private final OutboxDeliveryService deliveryService;
    private final AmqpTemplate amqpTemplate;
    private final String exchangeName;
    private final int batchSize;

    OutboxPublisherService(
            OutboxDeliveryService deliveryService,
            AmqpTemplate amqpTemplate,
            @Value("${outbox.amqp-exchange-name:outbox.events}") String exchangeName,
            @Value("${outbox.publisher.batch-size:16}") int batchSize
    ) {
        this.deliveryService = deliveryService;
        this.amqpTemplate = amqpTemplate;
        this.exchangeName = exchangeName;
        this.batchSize = batchSize;
    }

    @Scheduled(fixedDelayString = "${outbox.publisher.delay:PT1S}")
    void publish() {
        deliveryService.claimBatch(batchSize).forEach(outbox -> {
            try {
                amqpTemplate.convertAndSend(
                        exchangeName,
                        outbox.getEventType(),
                        outbox.getPayload()
                );
                deliveryService.markSent(outbox.getId());
            } catch (AmqpException e) {
                deliveryService.markPending(outbox.getId());
                log.error("Error while publishing message", e);
            }
        });
    }
}
