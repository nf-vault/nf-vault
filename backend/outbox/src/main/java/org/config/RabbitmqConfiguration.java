package org.config;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.retry.RetryPolicy;

import java.time.Duration;

@Configuration
public class RabbitmqConfiguration {
    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public SimpleRabbitListenerContainerFactory outboxRabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            JacksonJsonMessageConverter messageConverter,
            @Value("${outbox.consumer.retry-delay-ms:1000}") long retryDelay,
            @Value("${outbox.consumer.max-attempts:3}") long maxAttempts
    ) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();

        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
        factory.setDefaultRequeueRejected(false);
        factory.setConcurrentConsumers(1);
        factory.setPrefetchCount(10);
        factory.setAdviceChain(RetryInterceptorBuilder.stateless()
            .retryPolicy(RetryPolicy.builder()
                .maxRetries(Math.max(0, maxAttempts - 1))
                .delay(Duration.ofMillis(retryDelay))
                .multiplier(2.0)
                .maxDelay(Duration.ofMillis(retryDelay * 10))
                .build())
            .recoverer(new RejectAndDontRequeueRecoverer())
            .build());

        return factory;
    }
}
