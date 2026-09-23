package org.nfVault.search.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.nfVault.search.repository.DocumentSearchRepository.DocumentIndexEntry;
import org.nfVault.search.repository.DocumentSearchRepository.DocumentSearchResult;

import java.nio.file.Path;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DocumentSearchRepositoryTest {
    @TempDir
    Path indexPath;

    private DocumentSearchRepository repository;

    @BeforeEach
    void setUp() {
        repository = new DocumentSearchRepository(indexPath.toString());
    }

    @AfterEach
    void tearDown() {
        repository.close();
    }

    @Test
    void searchesArticleTitlesAndContents() {
        repository.rebuild(List.of(
                document(1, "Lucene guide", "Full-text indexing in Java"),
                document(2, "Database notes", "PostgreSQL transactions")
        ));

        List<DocumentSearchResult> contentResults = repository.search("indexing", 10);
        List<DocumentSearchResult> titleResults = repository.search("Lucene", 10);

        assertThat(contentResults)
                .extracting(DocumentSearchResult::id)
                .containsExactly(1);
        assertThat(titleResults)
                .extracting(DocumentSearchResult::id)
                .containsExactly(1);
        assertThat(contentResults.get(0).snippet())
                .contains("Full-text <mark>indexing</mark>");
    }

    @Test
    void highlightsContentMatchesAndEscapesDocumentMarkup() {
        repository.rebuild(List.of(
                document(1, "Some notes", "<img src=x> searchable text")
        ));

        DocumentSearchResult result = repository.search("searchable", 10).get(0);

        assertThat(result.snippet())
                .contains("&lt;img src=x&gt;")
                .contains("<mark>searchable</mark>")
                .doesNotContain("<img");
    }

    @Test
    void updatesAndDeletesArticles() {
        repository.rebuild(List.of(
                document(1, "Old title", "Old content")
        ));
        repository.upsert(new DocumentIndexEntry(
                1,
                "New title",
                "Replacement content"
        ));

        assertThat(repository.search("old", 10)).isEmpty();
        assertThat(repository.search("replacement", 10))
                .extracting(DocumentSearchResult::id)
                .containsExactly(1);

        repository.delete(1);

        assertThat(repository.search("replacement", 10)).isEmpty();
    }

    private DocumentIndexEntry document(Integer id, String title, String content) {
        return new DocumentIndexEntry(id, title, content);
    }
}
