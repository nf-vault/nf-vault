package org.nfVault.media.controllers;

import org.nfVault.shared.config.ApiVersionConfig;
import org.nfVault.media.controllers.DTO.UploadImageResponse;
import org.nfVault.media.services.ImageStorageService;
import org.nfVault.media.services.ImageStorageService.StoredImage;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.time.Duration;


@RestController
@RequestMapping("/image")
public class ImageController {
    private static final CacheControl IMAGE_CACHE_CONTROL = CacheControl
            .maxAge(Duration.ofDays(31))
            .cachePublic()
            .immutable();

    private final ImageStorageService imageStorageService;

    public ImageController(ImageStorageService imageStorageService) {
        this.imageStorageService = imageStorageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public UploadImageResponse uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        String fileName = imageStorageService.store(file);

        return new UploadImageResponse(
                ApiVersionConfig.versionedPath("/image/" + fileName)
        );
    }

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<?> getImage(
            @PathVariable("fileName") String fileName
    ) {
        StoredImage image = imageStorageService.get(fileName);

        return ResponseEntity.ok()
                .cacheControl(IMAGE_CACHE_CONTROL)
                .contentType(image.mediaType())
                .body(image.resource());
    }
}
