package org.nfVault.media.repository;

import org.nfVault.media.util.images.ImageFileExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Optional;
import java.util.UUID;

@Repository
public class ImageRepository {
    private final Path storageDirectory;

    public ImageRepository(
            @Value("${image.storage-path:/data/images}") String storagePath
    ) {
        storageDirectory = Path.of(storagePath).toAbsolutePath().normalize();

        try {
            Files.createDirectories(storageDirectory);
        } catch (IOException ex) {
            throw new IllegalStateException("Cannot initialize image storage", ex);
        }
    }

    public String store(InputStream imageInputStream, ImageFileExtension extension) {
        final String fileName = UUID.randomUUID() + "." + extension.value();
        final Path target = resolvePath(fileName)
                .orElseThrow(() -> new IllegalStateException("Invalid image path"));

        try (
                OutputStream output = Files.newOutputStream(
                        target,
                        StandardOpenOption.CREATE_NEW,
                        StandardOpenOption.WRITE
                )
        ) {
            imageInputStream.transferTo(output);
            return fileName;
        } catch (IOException ex) {
            try {
                Files.deleteIfExists(target);
            } catch (IOException cleanupException) {
                ex.addSuppressed(cleanupException);
            }
            throw new IllegalStateException("Cannot store image", ex);
        }
    }

    public Optional<Resource> get(String fileName) {
        Optional<Path> imagePath = resolvePath(fileName);
        if (imagePath.isEmpty() || !Files.isRegularFile(imagePath.get())) {
            return Optional.empty();
        }

        return Optional.of(new FileSystemResource(imagePath.get()));
    }

    private Optional<Path> resolvePath(String fileName) {
        Path path = storageDirectory.resolve(fileName).normalize();

        if (!path.startsWith(storageDirectory) || !storageDirectory.equals(path.getParent())) {
            return Optional.empty();
        }

        return Optional.of(path);
    }
}
