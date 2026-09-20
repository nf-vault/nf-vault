package org.nfVault.documentPreview.events;

import org.api.OutboxEvent;
import org.api.annotations.EventType;

@EventType("preview.created")
public record PreviewCreatedEvent (
        Integer id,
        String imagePath
) implements OutboxEvent {}
