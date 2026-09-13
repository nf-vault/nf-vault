package org.nfVault.documents.events;

public record DocumentNameChangedEvent(
        Integer id,
        String type,
        String title
) {
}
