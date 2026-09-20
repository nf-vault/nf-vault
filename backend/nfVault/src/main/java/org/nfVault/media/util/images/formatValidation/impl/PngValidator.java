package org.nfVault.media.util.images.formatValidation.impl;

import org.nfVault.media.util.images.ImageFileExtension;
import org.nfVault.media.util.images.formatValidation.ImageFormatValidator;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
public class PngValidator implements ImageFormatValidator {
    private static final byte[] SIGNATURE = {
            (byte) 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
    };

    @Override
    public ImageFileExtension extension() {
        return ImageFileExtension.PNG;
    }

    @Override
    public boolean matches(InputStream input) throws IOException {
        byte[] header = input.readNBytes(SIGNATURE.length);
        return ImageFormatValidator.startsWith(header, SIGNATURE);
    }
}
