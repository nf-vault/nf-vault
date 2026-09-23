package org.config;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@ComponentScan(basePackages = {
        "org.api",
        "org.services",
        "org.repository"
})
@EnableScheduling
@Import({RabbitmqConfiguration.class, ObjectMapperConfig.class, OutboxEntityScanRegistrar.class})
@EnableRabbit
public class OutboxConfiguration {}