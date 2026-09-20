package org.nfVault.media.util.images;

import org.springframework.http.MediaType;

import java.util.Arrays;
import java.util.Optional;

public enum ImageFileExtension {
    PNG("png", MediaType.IMAGE_PNG),
    JPG("jpg", MediaType.IMAGE_JPEG),
    GIF("gif", MediaType.IMAGE_GIF);

    private final String value;
    private final MediaType mediaType;

    ImageFileExtension(String value, MediaType mediaType) {
        this.value = value;
        this.mediaType = mediaType;
    }

    public String value() {
        return value;
    }

    public MediaType mediaType() {
        return mediaType;
    }

    public static Optional<ImageFileExtension> fromFileName(String fileName) {
        int separator = fileName.lastIndexOf('.');
        if (separator < 0) return Optional.empty();

        String extension = fileName
                .substring(separator + 1)
                .toLowerCase();

        return Arrays.stream(values())
                .filter(value -> value.value.equals(extension))
                .findFirst();
    }
}
