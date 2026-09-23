package org.utils.image;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Path;

public class LRUCachedImagesProvider implements ImageProvider {
    private final LRUCache<Path, BufferedImage> cache;

    public LRUCachedImagesProvider() {
        this.cache = new LRUCache<>(10);
    }

    public LRUCachedImagesProvider(int capacity) {
        this.cache = new LRUCache<>(capacity);
    }

    public BufferedImage getImage(Path path) throws IOException {
        final BufferedImage cachedImage = this.cache.get(path);

        if (cachedImage != null) {
            return cachedImage;
        }

        final BufferedImage image = ImageIO.read(path.toFile());
        if (image == null) {
            throw new IOException("Unable to read image: " + path);
        }

        this.cache.put(path, image);
        return image;
    }
}