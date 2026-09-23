package org.nfVault.documents.services;

import jakarta.validation.Valid;
import org.nfVault.documents.models.Document;
import org.nfVault.documents.repository.DocumentRepository;
import org.nfVault.shared.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

@Service
public class DocumentOgPageService {
    private final DocumentRepository documentRepository;
    private final String documentsServiceFullUrl;

    public DocumentOgPageService(
            DocumentRepository documentRepository,
            @Value("${document-og.documents-service-url}") String documentsServiceUrl,
            @Value("${document-og.domain}") String serverDomain
    ) {
        this.documentRepository = documentRepository;
        this.documentsServiceFullUrl = serverDomain + documentsServiceUrl;
    }

    public void preparePage(
            Integer documentId,
            Model model
    ) {
        Document document = documentRepository
                .getById(documentId)
                .orElseThrow(() ->
                        new NotFoundException("Document not found")
                );

        model.addAttribute("title", document.getName());
        model.addAttribute("previewPath", document.getPreviewPath());
        model.addAttribute(
                "url",
                String.format("%s/%s", this.documentsServiceFullUrl, document.getId())
        );
    }
}
