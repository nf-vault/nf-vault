package org.nfVault.media.util.images.formatValidation;

import org.nfVault.media.util.images.ImageFileExtension;

import java.io.IOException;
import java.io.InputStream;

public interface ImageFormatValidator {
    ImageFileExtension extension();
    boolean matches(InputStream input) throws IOException;

    static boolean startsWith(byte[] value, byte[] prefix) {
        if (value.length < prefix.length) return false;

        for (int index = 0; index < prefix.length; index++) {
            if (value[index] != prefix[index]) return false;
        }

        return true;
    }
}
