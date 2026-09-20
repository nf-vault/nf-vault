package org.nfVault.documents.events;

import org.api.OutboxEvent;
import org.api.annotations.EventType;

@EventType("document.changed")
public record DocumentChangedEvent(
        Integer id,
        String type,
        String title,
        String content
) implements OutboxEvent {}
