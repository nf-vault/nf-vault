package org.nfVault.media.api;

import org.nfVault.media.services.ImageStorageService;
import org.nfVault.shared.config.ApiVersionConfig;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;


@Component
public class ImageAPI {
    public ImageStorageService imageStorageService;

    public ImageAPI(ImageStorageService imageStorageService) {
        this.imageStorageService = imageStorageService;
    }

    public String saveImage(
            BufferedImage file
    ) {
        String fileName = imageStorageService.store(file);

        return ApiVersionConfig.versionedPath("/image/" + fileName);
    }
}
