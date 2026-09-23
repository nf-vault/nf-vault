package org.nfVault.media.util.images.formatValidation.impl;

import org.nfVault.media.util.images.ImageFileExtension;
import org.nfVault.media.util.images.formatValidation.ImageFormatValidator;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Component
public class GifValidator implements ImageFormatValidator {
    private static final byte[] GIF_87_SIGNATURE =
            "GIF87a".getBytes(StandardCharsets.US_ASCII);
    private static final byte[] GIF_89_SIGNATURE =
            "GIF89a".getBytes(StandardCharsets.US_ASCII);

    @Override
    public ImageFileExtension extension() {
        return ImageFileExtension.GIF;
    }

    @Override
    public boolean matches(InputStream input) throws IOException {
        byte[] header = input.readNBytes(GIF_87_SIGNATURE.length);
        return ImageFormatValidator.startsWith(header, GIF_87_SIGNATURE)
                || ImageFormatValidator.startsWith(header, GIF_89_SIGNATURE);
    }
}
