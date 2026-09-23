package org.nfVault.documents.controllers;

import org.nfVault.documents.services.DocumentOgPageService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/document-og")
public class DocumentOgPageController {
    private final DocumentOgPageService documentOgPageService;

    public DocumentOgPageController(DocumentOgPageService documentOgPageService) {
        this.documentOgPageService = documentOgPageService;
    }

    @GetMapping("/{documentId}")
    public String getDocumentOgPage(
            @PathVariable("documentId") final Integer documentId,
            Model model
    ) {
        documentOgPageService.preparePage(documentId, model);

        return "document-og";
    }

}
