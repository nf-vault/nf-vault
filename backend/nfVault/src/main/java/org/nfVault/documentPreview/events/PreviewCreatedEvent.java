package org.nfVault.documentPreview.events;

public record PreviewCreatedEvent(
        Integer id,
        String imagePath
) {}
