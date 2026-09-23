package org.nfVault.documents.events;

import org.api.OutboxEvent;
import org.api.annotations.EventType;

@EventType("document.deleted")
public record DocumentDeletedEvent(Integer id) implements OutboxEvent {}