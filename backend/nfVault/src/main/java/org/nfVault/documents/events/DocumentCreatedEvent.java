package org.nfVault.documents.events;

public record DocumentCreatedEvent(
        Integer id,
        String type,
        String title
) {
}