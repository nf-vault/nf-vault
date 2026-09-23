package org.nfVault.documents.controllers;

import jakarta.validation.Valid;
import org.nfVault.documents.controllers.DTO.*;
import org.nfVault.documents.models.Document;
import org.nfVault.documents.services.DocumentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/document")
@PreAuthorize("isAuthenticated()")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public List<ListDocumentItemResponse> getDocuments(
            @RequestParam(value = "parentId", required = false) final Integer parentId
    ) {
        return documentService.getDocumentsByParentId(parentId)
                .stream()
                .map(document -> new ListDocumentItemResponse(
                        document.getId(),
                        document.getType(),
                        document.getName(),
                        document.getParent() != null ? document.getParent().getId() : null
                ))
                .toList();
    }

    @GetMapping("/{docId}/path")
    @PreAuthorize("permitAll()")
    public List<DocumentPathItemResponse> getDocumentPath(
            @PathVariable("docId") final Integer id
    ) {
        return documentService.getDocumentPath(id)
                .stream()
                .map(document -> new DocumentPathItemResponse(
                        document.getId(),
                        document.getType(),
                        document.getName()
                ))
                .toList();
    }

    @GetMapping("/{docId}")
    @PreAuthorize("permitAll()")
    public GetDocumentResponse getDocumentById(
            @PathVariable("docId") final Integer id
    ) {
        final Document document = documentService.getDocumentById(id);
        return new GetDocumentResponse(
                document.getId(),
                document.getType(),
                document.getName(),
                document.getContent()
        );
    }

    @PutMapping("/{docId}/content")
    public void putDocumentContent(
            @PathVariable("docId") final String id,
            @Valid @RequestBody final PutDocumentContentRequest contentObject
    ) {
        documentService.updateDocumentById(
                Integer.parseInt(id),
                null,
                contentObject.getContent()
        );
    }

    @PutMapping("/{docId}/title")
    public void putDocumentTitle(
            @PathVariable("docId") final String id,
            @Valid @RequestBody final PutDocumentTitleRequest titleObject
    ) {
        documentService.updateDocumentById(
                Integer.parseInt(id),
                titleObject.getTitle(),
                null
        );
    }

    @DeleteMapping("/{docId}")
    public void deleteDocumentById(
            @PathVariable("docId") final String id
    ) {
        documentService.deleteDocumentById(Integer.parseInt(id));
    }

    @PatchMapping("/{docId}")
    public void updateDocumentById(
            @PathVariable("docId") final Integer id,
            @Valid @RequestBody final UpdateDocumentRequest request
    ) {
        documentService.updateDocumentById(
                id,
                request.getName(),
                request.getContent()
        );
    }

    @PostMapping("/create")
    public CreateDocumentResponse createDocument(
            @RequestBody @Valid final CreateDocumentRequest request
    ) {
        Integer documentId = documentService.createDocument(
                request.getName(),
                request.getType(),
                request.getParentId()
        );
        return new CreateDocumentResponse(
                documentId
        );
    }
}
