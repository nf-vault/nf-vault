package org.utils.image;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Path;

public interface ImageProvider {
    BufferedImage getImage(Path path) throws IOException;
}
