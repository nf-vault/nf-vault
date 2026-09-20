package org.nfVault.media.util.images.formatValidation.impl;

import org.nfVault.media.util.images.ImageFileExtension;
import org.nfVault.media.util.images.formatValidation.ImageFormatValidator;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
public class JpegValidator implements ImageFormatValidator {
    private static final byte[] SIGNATURE = {
            (byte) 0xff, (byte) 0xd8, (byte) 0xff
    };

    @Override
    public ImageFileExtension extension() {
        return ImageFileExtension.JPG;
    }

    @Override
    public boolean matches(InputStream input) throws IOException {
        byte[] header = input.readNBytes(SIGNATURE.length);
        return ImageFormatValidator.startsWith(header, SIGNATURE);
    }
}
