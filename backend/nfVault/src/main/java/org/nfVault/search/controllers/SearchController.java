package org.nfVault.search.controllers;

import jakarta.validation.Valid;
import org.nfVault.search.controllers.DTO.SearchDocumentRequest;
import org.nfVault.search.controllers.DTO.SearchDocumentResponse;
import org.nfVault.search.services.DocumentSearchService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
@PreAuthorize("permitAll()")
public class SearchController {
    private final DocumentSearchService documentSearchService;

    public SearchController(DocumentSearchService documentSearchService) {
        this.documentSearchService = documentSearchService;
    }

    @GetMapping
    public List<SearchDocumentResponse> searchDocuments(
            @Valid @ModelAttribute SearchDocumentRequest request
    ) {
        return documentSearchService.search(request.getQuery().strip(), request.getLimit())
                .stream()
                .map(document -> new SearchDocumentResponse(
                        document.id(),
                        document.title(),
                        document.snippet(),
                        document.score()
                ))
                .toList();
    }
}
