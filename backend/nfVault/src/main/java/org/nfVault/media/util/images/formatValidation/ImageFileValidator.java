package org.nfVault.media.util.images.formatValidation;

import org.nfVault.media.util.images.ImageFileExtension;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Component
public class ImageFileValidator {
    private final List<ImageFormatValidator> formatValidators;

    public ImageFileValidator(List<ImageFormatValidator> formatValidators) {
        this.formatValidators = List.copyOf(formatValidators);
    }

    public ImageFileExtension validate(MultipartFile image) {
        if (image.isEmpty()) {
            throw new ImageValidationException("Image is empty");
        }

        for (ImageFormatValidator validator : formatValidators) {
            try (InputStream input = image.getInputStream()) {
                if (validator.matches(input)) {
                    return validator.extension();
                }
            } catch (IOException ex) {
                throw new ImageValidationException("Cannot read image");
            }
        }

        throw new ImageValidationException("Unsupported image format");
    }
}
