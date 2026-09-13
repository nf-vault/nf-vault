package org.nfVault.media.services;

import org.nfVault.shared.exceptions.NotFoundException;
import org.nfVault.media.util.images.ImageFileExtension;
import org.nfVault.media.repository.ImageRepository;
import org.nfVault.media.util.images.formatValidation.ImageFileValidator;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class ImageStorageService {
    private final ImageRepository imageRepository;
    private final ImageFileValidator imageFileValidator;

    public record StoredImage(Resource resource, MediaType mediaType) {}

    public ImageStorageService(ImageRepository imageRepository, ImageFileValidator imageFileValidator) {
        this.imageRepository = imageRepository;
        this.imageFileValidator = imageFileValidator;
    }

    public String store(MultipartFile image) {
        ImageFileExtension extension = imageFileValidator.validate(image);

        try {
            return imageRepository.store(image.getInputStream(), extension);
        } catch (IOException e) {
            throw new RuntimeException("Error while saving image: ", e);
        }
    }

    public String store(BufferedImage image) {
        final ByteArrayOutputStream imageOutputStream = new ByteArrayOutputStream();
        try {
            ImageIO.write(image, "png", imageOutputStream);
        } catch (IOException e) {
            throw new RuntimeException("Error while converting bufferedImage: ", e);
        }
        final InputStream imageInputStream = new ByteArrayInputStream(imageOutputStream.toByteArray());

        return imageRepository.store(imageInputStream, ImageFileExtension.PNG);
    }

    public StoredImage get(String fileName) {
        ImageFileExtension extension = ImageFileExtension.fromFileName(fileName)
                .orElseThrow(() -> new NotFoundException("Image not found"));

        Resource resource = imageRepository.get(fileName)
                .orElseThrow(() -> new NotFoundException("Image not found"));

        return new StoredImage(resource, extension.mediaType());
    }
}
