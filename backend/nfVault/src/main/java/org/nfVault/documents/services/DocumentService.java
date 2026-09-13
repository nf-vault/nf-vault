package org.nfVault.documents.services;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.nfVault.documentPreview.events.PreviewCreatedEvent;
import org.nfVault.documents.events.DocumentCreatedEvent;
import org.nfVault.documents.events.DocumentNameChangedEvent;
import org.nfVault.shared.exceptions.ConflictException;
import org.nfVault.shared.exceptions.NotFoundException;
import org.nfVault.documents.models.Document;
import org.nfVault.documents.repository.DocumentRepository;
import org.nfVault.documents.events.DocumentChangedEvent;
import org.nfVault.documents.events.DocumentDeletedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final ApplicationEventPublisher eventPublisher;

    public DocumentService(
            DocumentRepository documentRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.documentRepository = documentRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public Integer createDocument(String title, String type, Integer parentId) {
        Document parent = null;
        if (parentId != null) {
            parent = getDocumentById(parentId);
            if (!"directory".equals(parent.getType())) {
                throw new NotFoundException("Parent directory not found");
            }
        }

        final boolean isUnique = documentRepository.getByParentId(parentId).stream()
                .map(Document::getName)
                .noneMatch(otherDocumentTitle -> otherDocumentTitle.equals(title));
        if (!isUnique) {
            throw new ConflictException("Document with same title already exists");
        }

        Document document = Document.builder()
                .name(title)
                .type(type)
                .content("")
                .parent(parent)
                .build();
        documentRepository.create(document);
        publishDocumentChanged(document);

        log.warn("Created document {}", document);

        eventPublisher.publishEvent(new DocumentCreatedEvent(
                document.getId(),
                document.getType(),
                document.getName()
        ));

        return document.getId();
    }

    public Document getDocumentById(Integer id) {
        return documentRepository.getById(id)
                .orElseThrow(() -> new NotFoundException("Document not found"));
    }

    public List<Document> getDocumentsByParentId(Integer parentId) {
        return documentRepository.getByParentId(parentId);
    }

    public List<Document> getDocumentPath(Integer documentId) {
        if (documentId == null) {
            return List.of();
        }

        List<Document> path = new ArrayList<>();
        Document current = getDocumentById(documentId);
        while (current != null) {
            path.add(current);
            current = current.getParent();
        }

        Collections.reverse(path);
        return path;
    }

    @Transactional
    public void updateDocumentById(Integer id, String name, String content) {
        Document document = documentRepository.getById(id)
                .orElseThrow(() -> new NotFoundException("Document not found"));
        final boolean nameChanged = name != null && !name.equals(document.getName());

        if (name != null) {
            document.setName(name);
        }
        if (content != null) {
            document.setContent(content);
        }

        if (nameChanged) {
            publishDocumentTitleChanged(document);
        }

        publishDocumentChanged(document);
    }

    @Transactional
    @EventListener(PreviewCreatedEvent.class)
    public void updateDocumentPreview(PreviewCreatedEvent event) {
        documentRepository.updatePreview(
                event.id(),
                event.imagePath()
        );
    }

    @Transactional
    public void deleteDocumentById(Integer id) {
        Document document = documentRepository.getById(id)
                .orElseThrow(() -> new NotFoundException("Document not found"));
        documentRepository.getByParentId(id)
                .forEach(child -> deleteDocumentById(child.getId()));
        documentRepository.delete(document);
        eventPublisher.publishEvent(new DocumentDeletedEvent(document.getId()));
    }

    private void publishDocumentTitleChanged(Document document) {
        eventPublisher.publishEvent(new DocumentNameChangedEvent(
                document.getId(),
                document.getType(),
                document.getName()
        ));
    }

    private void publishDocumentChanged(Document document) {
        eventPublisher.publishEvent(new DocumentChangedEvent(
                document.getId(),
                document.getType(),
                document.getName(),
                document.getContent()
        ));
    }
}
