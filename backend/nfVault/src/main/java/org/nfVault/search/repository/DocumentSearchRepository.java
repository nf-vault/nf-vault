package org.nfVault.search.repository;

import jakarta.annotation.PreDestroy;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.MultiFieldQueryParser;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.SearcherManager;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.uhighlight.DefaultPassageFormatter;
import org.apache.lucene.search.uhighlight.LengthGoalBreakIterator;
import org.apache.lucene.search.uhighlight.UnifiedHighlighter;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Path;
import java.text.BreakIterator;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Repository
public class DocumentSearchRepository {
    private static final String ID_FIELD = "id";
    private static final String TITLE_FIELD = "title";
    private static final String CONTENT_FIELD = "content";
    private static final int MAX_HIGHLIGHT_LENGTH = 100_000;
    private static final int MAX_SNIPPET_LENGTH = 240;

    private final Analyzer analyzer;
    private final Directory directory;
    private final IndexWriter indexWriter;
    private final SearcherManager searcherManager;

    public DocumentSearchRepository(
            @Value("${search.index-path:/data/search}") String indexPath
    ) {
        try {
            analyzer = new StandardAnalyzer();
            directory = FSDirectory.open(Path.of(indexPath));
            indexWriter = new IndexWriter(
                    directory,
                    new IndexWriterConfig(analyzer)
            );
            searcherManager = new SearcherManager(indexWriter, null);
        } catch (IOException exception) {
            throw new UncheckedIOException("Could not open search index", exception);
        }
    }

    @PreDestroy
    public void close() {
        try {
            searcherManager.close();
            indexWriter.close();
            directory.close();
            analyzer.close();
        } catch (IOException exception) {
            throw new UncheckedIOException("Could not close search index", exception);
        }
    }

    public synchronized void rebuild(Collection<DocumentIndexEntry> documents) {
        try {
            indexWriter.deleteAll();
            for (DocumentIndexEntry document : documents) {
                indexWriter.addDocument(toLuceneDocument(document));
            }
            indexWriter.commit();
            searcherManager.maybeRefreshBlocking();
        } catch (IOException exception) {
            throw new UncheckedIOException("Could not rebuild search index", exception);
        }
    }

    public void upsert(DocumentIndexEntry document) {
        try {
            indexWriter.updateDocument(
                    new Term(ID_FIELD, document.id().toString()),
                    toLuceneDocument(document)
            );
            searcherManager.maybeRefresh();
        } catch (IOException exception) {
            throw new UncheckedIOException("Could not update search index", exception);
        }
    }

    public void delete(Integer documentId) {
        try {
            indexWriter.deleteDocuments(new Term(ID_FIELD, documentId.toString()));
            searcherManager.maybeRefresh();
        } catch (IOException exception) {
            throw new UncheckedIOException("Could not update search index", exception);
        }
    }

    public List<DocumentSearchResult> search(String searchText, int limit) {
        try (SearcherHandle searcherHandle = acquireSearcher()) {
            IndexSearcher searcher = searcherHandle.searcher();
            Query query = createQuery(searchText);
            TopDocs topDocuments = searcher.search(query, limit);
            String[] snippets = createSnippets(searcher, query, topDocuments);
            List<DocumentSearchResult> results = new ArrayList<>(topDocuments.scoreDocs.length);

            for (int index = 0; index < topDocuments.scoreDocs.length; index++) {
                ScoreDoc scoreDocument = topDocuments.scoreDocs[index];
                org.apache.lucene.document.Document document = searcher
                        .storedFields()
                        .document(scoreDocument.doc);
                results.add(new DocumentSearchResult(
                        Integer.valueOf(document.get(ID_FIELD)),
                        document.get(TITLE_FIELD),
                        normalizeSnippet(snippets[index]),
                        scoreDocument.score
                ));
            }

            return results;
        } catch (IOException exception) {
            throw new UncheckedIOException("Could not search documents", exception);
        } catch (ParseException exception) {
            throw new IllegalStateException("Could not parse escaped search query", exception);
        }
    }

    private Query createQuery(String searchText) throws ParseException {
        MultiFieldQueryParser parser = new MultiFieldQueryParser(
                new String[]{TITLE_FIELD, CONTENT_FIELD},
                analyzer,
                Map.of(TITLE_FIELD, 2.0f, CONTENT_FIELD, 1.0f)
        );
        parser.setDefaultOperator(QueryParser.Operator.AND);
        return parser.parse(QueryParser.escape(searchText));
    }

    private SearcherHandle acquireSearcher() throws IOException {
        return new SearcherHandle(searcherManager.acquire());
    }

    private String[] createSnippets(
            IndexSearcher searcher,
            Query query,
            TopDocs topDocuments
    ) throws IOException {
        UnifiedHighlighter highlighter = UnifiedHighlighter
                .builder(searcher, analyzer)
                .withBreakIterator(() -> LengthGoalBreakIterator.createClosestToLength(
                        BreakIterator.getSentenceInstance(Locale.ROOT),
                        MAX_SNIPPET_LENGTH,
                        0.5f
                ))
                .withFormatter(new DefaultPassageFormatter("<mark>", "</mark>", " … ", true))
                .withMaxLength(MAX_HIGHLIGHT_LENGTH)
                .build();
        return highlighter.highlight(CONTENT_FIELD, query, topDocuments, 1);
    }

    private String normalizeSnippet(String snippet) {
        if (snippet == null) {
            return "";
        }
        return snippet.strip();
    }

    private org.apache.lucene.document.Document toLuceneDocument(DocumentIndexEntry document) {
        org.apache.lucene.document.Document indexDocument = new org.apache.lucene.document.Document();
        indexDocument.add(new StringField(
                ID_FIELD,
                document.id().toString(),
                Field.Store.YES
        ));
        indexDocument.add(new TextField(
                TITLE_FIELD,
                document.title(),
                Field.Store.YES
        ));
        indexDocument.add(new TextField(
                CONTENT_FIELD,
                document.content(),
                Field.Store.YES
        ));
        return indexDocument;
    }

    public record DocumentIndexEntry(
            Integer id,
            String title,
            String content
    ) {}

    public record DocumentSearchResult(
            Integer id,
            String title,
            String snippet,
            float score
    ) {}

    private final class SearcherHandle implements AutoCloseable {
        private final IndexSearcher searcher;

        private SearcherHandle(IndexSearcher searcher) {
            this.searcher = searcher;
        }

        private IndexSearcher searcher() {
            return searcher;
        }

        @Override
        public void close() throws IOException {
            searcherManager.release(searcher);
        }
    }
}
