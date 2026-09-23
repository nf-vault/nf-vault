## 0.1.0-b0 (2026-09-23)

### Feat

- **nfVault**: rewrite events using outbox module and amqp
- **nfVault**: enable oubox module and specify its settings
- **outbox**: add implementation of outbox pattern and RabbitMQ batch publishing
- **init.sql**: add simple table for outbox pattern
- **DocumentCreatedEvent**: add event and its handling in DocumentPreviewService
- **nginx.conf**: send all crawlers to document-og instead of document
- add Open Graph documents generation via tymeleaf
- implement buisness-logic of preview generation on title update
- add previewGenerator module to global pom
- **previewGenerator/caption**: add support of text wrapping
- **previewGenerator**: enable geometry anti-aliasing
- **previewGenerator/caption**: use fillRoundedRect instead of fillRect
- **previewGenerator/caption**: enable anti-aliasing
- **previewGenerator/caption**: add boxPadding and canvasPadding
- **previewGenerator/caption**: add caption layer prototype
- **previewGenerator**: implement preview background generation

### Fix

- **nginx.conf**: make CSP header single-line for nginx compatibility
- **DocumetPreviewService**: replace @Component with @Service to ensure proper @TransactionalEventListener work
- **preview.font-path**: remove double quotes that had been corrupting font path
- **init.sql**: make Documents.preview_path nullable
- **previewGenerator**: pass ImageProvider to ImageBackgroundStrategy via config

### Refactor

- **AuthController**: set `secure` flag in jwt cookie
- **nginx**: remove ssl from pojects scope of responsibility
- **nginx**: pass serts via volumes and add domain name + .env vars support
- **gen-selfsigned-certs**: now selfsigned sertificates stored in `frontend/certs` instead of `frontend/nginx-conf/certs`
- **gen-selfsigned-certs**: move script to ./scripts
- **nfVault**: separate event listeners from services
- **CaptionGenerator**: place setFont and setColor for text properly
- **previewGenerator**: enable anti-aliasing globally
- **backend**: reorganize project into modular monolyth

## 0.1.0-a1 (2026-08-10)

### Feat

- **widgets/search-bar**: add search bar
- **searchDocuments**: add AbortSignal
- **api/search**: add api callfor search request
- **DocumentSearchRepository**: add highlighted content snippets
- implement search using lucene
- add latex formulas plugin
- add line numbering in code blocks
- add code blocks
- add lineWrapping plugin to prevent overflow-x in editor
- **markdownImageTheme**: remove top & bottom image margin
- add theme for image actions
- update MarkdownImageWidget & related to make image resizable
- **edit-image**: add image resizing feature
- **editor**: add showTitle setting
- add README view if it presents in directroy
- **ImageController**: add Cache-Control header
- **editor**: add image widget & small refactor
- **paste-image**: add paste-image cm plugin
- **uploadImage**: add uploadImage frontend endpoint
- **images**: add image storage api
- add basic markdown WYSIWYG plugin

### Fix

- **SearchDocumentRequest**: restore query binding for search suggestions
- hide code block source markers lines
- **markdownImageTheme**: remove 48rem horizontal clamp for images
- **MarkdownImageWidget**: rewrite with updateDOM to prevent image flickering while typing
- **markdownImageActionsTheme**: remove redundant new lines before and after image widget
- **popup-window**: specify z-index to prevent overlap
- **markdownWysiwygPlugin**: set highest priority for plugin

### Refactor

- unify doc and dir paths processing
- **editor-toolbar**: update to use with cm
- move cm config to lib/codemirror/config
- remove deprecated pm code
- replace pm with cm WYSIWYM editor

## 0.1.0-a0 (2026-07-09)

### Feat

- add rename and delete actions in tree
- add tree structure by adding parent_id column to db
- implement plain documents relations structure
- **request.ts**: add fallback for empty-body responces
- add document creation & document save-on-update
- **request.ts**: specify RequestError class for errors inside request func
- **request.ts**: explicitly specify the same-origin parameter
- **api**: add api versioning via `ApiVersionConfig` bean
- **api**: add api versioning constant
- **DocumentController**: add getByDocumentId stub
- **editor**: get title and content on current document load
- **buildDevServer**: add redirection of api requests in dev mode
- added backend and many improvements in frontend. i know that its bad)
- added basic files tree
- basic editor implementation

### Fix

- **devToolsPlugin**: destroy plugin on editor destroy
- autosave now skips document restore
- **useAutoSaveDocument**: send content update request only on markdown change
- **DocumentController**: user must be authed to use most of documents endpoints
- **auth**: JwtAuthFilter clears SecurityContext on fail & simplification of SecurityConfig
- **SecurityConfig**: specify filter order
- **Makefile**: add --build option to backend-dev build
- **SecurityConfig**: add dedicated filter chain for auth requests with versioning
- **editor**: setEditorContent now using transactions
- **build**: fix `make backend-dev` by adding separate image
- add db health check in dev build mode
- **DocumentService**: handle createDocument properly
- **UserService**: use UnauthorizedException instead of NotFoundException if user not found
- **topbar**: fix logout mechanism
- **auth**: return proper authentication/authorization status codes
- add EnableMethodSecurity annotation to enable SpEL
- **nginx**: add google fonts to CSP header
- **deploy**: use configs instead of volumes for init.sql

### Refactor

- make tree design better
- **logout.ts**: omit double-logout errors
- **request**: updated requests and error handling pipelines
- **edit-document**: make document sent as markdown
- **error**: improve errors behavior
