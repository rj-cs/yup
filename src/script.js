/**
 * @typedef {'Active' | 'Beta' | 'v1.0' | 'Experiment' | 'Archived'} ProjectStatus
 * @typedef {'CLI / Systems' | 'Web Apps' | 'Local-First' | 'Experiments'} ProjectCategory
 *
 * @typedef {Object} ProjectEntry
 * @property {string} id - Unique slug identifier
 * @property {string} title - Monospace project name
 * @property {ProjectStatus} status - Version or lifecycle badge
 * @property {ProjectCategory} category - Primary filter category
 * @property {string} hook - Concise 2-line problem/solution statement
 * @property {string[]} stack - Tech stack pills (Go, TypeScript, Vanilla JS, SQLite, .NET, Shell)
 * @property {string} demoUrl - Live playground or interactive release URL
 * @property {string} repoUrl - GitHub source link
 * @property {string} [updated] - Last updated timestamp
 * @property {string} [version] - Release version when no update timestamp is available
 * @property {string} [benchmarkMetric] - Key performance highlight
 * @property {string} [metrics] - Performance highlight for project briefs
 * @property {string} [whyBuilt] - Deep dive into the problem that sparked the tool
 * @property {string[]} [tradeoffs] - Published architecture notes; absent or empty while compiling
 * @property {string} [architecture] - Short architecture summary for project briefs
 * @property {string} [terminalTrace] - Simulated CLI/benchmark output shown in the drawer
 * @property {string} [snippet] - Example output for project briefs
 */

/** @type {ProjectEntry[]} */
const PROJECTS_DATA = [
  {
    id: 'hstr-wal',
    title: 'hstr-wal',
    status: 'v1.0',
    category: 'CLI / Systems',
    hook: 'High-speed Go + SQLite WAL shell history CLI with sub-millisecond fuzzy search across 500,000+ commands and exit-code context.',
    stack: ['Go', 'SQLite', 'Shell'],
    demoUrl: 'https://yupcode.com/#hstr-wal',
    repoUrl: 'https://github.com/ranjanjharavi/hstr-wal',
    updated: '2026-10-18',
    benchmarkMetric: '0.42ms p99 query @ 500k rows',
    whyBuilt:
      'Default ~/.zsh_history files corrupt easily across concurrent tmux panes and strip vital metadata like working directory, duration, and exit status. I wanted an invisible background daemon that logs every shell invocation into a local SQLite Write-Ahead-Log database with zero prompt latency.',
    tradeoffs: [
      'Chose SQLite in WAL + synchronous=NORMAL mode over BoltDB to leverage FTS5 trigram indexes for instant substring matching.',
      'Compiled with modernc.org/sqlite (pure Go) instead of CGO so cross-compiling static binaries for Linux/macOS ARM64 takes 1.8 seconds.',
      'Hooked into zsh preexec/precmd via a non-blocking UNIX domain socket to guarantee prompt render stays under 1ms.'
    ],
    terminalTrace: `$ hstr-wal bench --rows=500000 --query="docker compose"
[init] database: ~/.local/share/hstr-wal/history.db (WAL mode, 64MB mmap)
[fts5] scanning 500,000 indexed commands...
  ├─ #1  docker compose -f prod.yml up -d --build   (cwd: ~/srv/api, exit: 0, 142ms)
  ├─ #2  docker compose logs -f --tail=100 worker   (cwd: ~/srv/api, exit: 0, 12ms)
  └─ #3  docker compose down --volumes              (cwd: ~/labs/db, exit: 0, 89ms)
[done] matched 1,412 rows in 420µs (0.42ms) | allocs: 18 KB`
  },
  {
    id: 'jotlocal',
    title: 'jotlocal',
    status: 'Active',
    category: 'Local-First',
    hook: 'Local-first IndexedDB & CRDT Markdown scratchpad with zero cloud dependency, instant Vim keybindings, and File System synchronization.',
    stack: ['TypeScript', 'Vanilla JS', 'SQLite'],
    demoUrl: 'https://yupcode.com/#jotlocal',
    repoUrl: 'https://github.com/ranjanjharavi/jotlocal',
    updated: '2026-10-25',
    benchmarkMetric: '0ms network • 14KB gzipped bundle',
    whyBuilt:
      'Every time I needed to paste a JSON payload, draft an RFC, or sketch a quick architecture table during a call, cloud note apps greeted me with spinner screens or login modals. jotlocal boots in 8 milliseconds from a Service Worker and persists straight to IndexedDB and a local folder.',
    tradeoffs: [
      'Built the editor core on Vanilla JS + a lightweight state machine instead of ProseMirror/React to keep the cold bundle under 15KB.',
      'Used Yjs CRDT snapshots over BroadcastChannel API so multiple browser tabs merge keystrokes deterministically without a WebSocket server.',
      'Added optional File System Access API bi-directional sync so notes live as plain .md files on disk for ripgrep compatibility.'
    ],
    terminalTrace: `[sw:boot] ServiceWorker active (cache: jotlocal-v1.4.2)
[storage] IndexedDB store 'notes_crdt' mounted (142 documents, 1.8 MB)
[fs-sync] Watching ~/Documents/yupcode-notes/ via FileSystemObserver
[perf]    First Contentful Paint: 6.4ms | Keystroke-to-IDB commit: 0.19ms`
  },
  {
    id: 'grammard-web',
    title: 'grammard-web',
    status: 'Beta',
    category: 'Web Apps',
    hook: 'Browser-based on-device AI grammar & technical prose linter running quantized WebGPU models locally with 100% privacy.',
    stack: ['TypeScript', 'Vanilla JS'],
    demoUrl: 'https://yupcode.com/#grammard-web',
    repoUrl: 'https://github.com/ranjanjharavi/grammard-web',
    updated: '2026-10-11',
    benchmarkMetric: '68 tokens/sec on Apple M-series WebGPU',
    whyBuilt:
      'Pasting proprietary architecture docs, postmortems, or unreleased code comments into third-party cloud grammar checkers leaks sensitive context. grammard-web runs a 4-bit quantized language model directly inside your browser GPU via WebGPU shaders.',
    tradeoffs: [
      'Split model weights into 32MB chunked shards cached in the browser Origin Private File System (OPFS) for instant subsequent loads.',
      'Designed a custom Markdown AST tokenizer that skips fenced code blocks (` ``` `) so the model never mangles code snippets or CLI flags.',
      'Implemented automatic WebAssembly SIMD fallback when WebGPU adapter limits are unavailable on older Linux kernels.'
    ],
    terminalTrace: `[webgpu] Adapter: Apple M3 Max (fp16 supported, maxBufferSize: 4GB)
[opfs]   Loaded cached weights: qwen-grammar-0.5b-q4f16.bin (312 MB in 45ms)
[lint]   Scanning 1,240 words (14 code blocks bypassed)...
  └─ Line 42: Passive voice detected -> "The mutex is acquired by the worker"
  └─ Suggestion: "The worker acquires the mutex" (confidence: 0.96)
[stats]  Throughput: 68.4 tok/s | Cloud bytes transmitted: 0 B`
  },
  {
    id: 'dotnet-flame',
    title: 'dotnet-flame',
    status: 'v1.0',
    category: 'CLI / Systems',
    hook: 'Lightweight .NET allocation & stack trace diffing CLI that flags p99 garbage collection regressions inside CI pipelines.',
    stack: ['.NET', 'Shell'],
    demoUrl: 'https://yupcode.com/#dotnet-flame',
    repoUrl: 'https://github.com/ranjanjharavi/dotnet-flame',
    updated: '2026-09-29',
    benchmarkMetric: 'Zero overhead EventPipe attach',
    whyBuilt:
      'Visual profiling tools are great on a desktop, but memory allocation regressions usually sneak in through PRs. dotnet-flame attaches to any running .NET 8/9 process via EventPipe, captures a 5-second allocation snapshot, and outputs a terminal diff table or interactive SVG flamegraph.',
    tradeoffs: [
      'Compiled using .NET NativeAOT so the CLI starts in 11ms without requiring a matching SDK runtime on CI runner containers.',
      'Used EventPipe DiagnosticsClient directly instead of wrapping dotnet-trace to stream and aggregate call stacks in a single pass.',
      'Emits deterministic exit code 2 when Gen2 GC collections or LOH allocations exceed a configurable threshold budget.'
    ],
    terminalTrace: `$ dotnet-flame diff baseline.nettrace pr-418.nettrace --budget-kb=512
┌───────────────────────────────────────────┬────────────┬────────────┬───────────┐
│ Method Signature                          │ Baseline   │ PR #418    │ Delta     │
├───────────────────────────────────────────┼────────────┼────────────┼───────────┤
│ JsonSerializer.Deserialize<EventPayload>  │ 142.0 KB   │ 890.4 KB   │ +648.4 KB │
│ SpanParser.TryReadHeader(ReadOnlySpan)    │ 12.0 KB    │ 0.0 KB     │ -12.0 KB  │
└───────────────────────────────────────────┴────────────┴────────────┴───────────┘
[FAIL] Allocation budget exceeded by +136.4 KB in hot path. Exit status 2.`
  },
  {
    id: 'sql-lens',
    title: 'sql-lens',
    status: 'Active',
    category: 'Local-First',
    hook: 'Vanilla JS + WASM SQLite database inspector and ER diagram visualizer that runs 100% in a browser tab via File System Access API.',
    stack: ['Vanilla JS', 'SQLite', 'TypeScript'],
    demoUrl: 'https://yupcode.com/#sql-lens',
    repoUrl: 'https://github.com/ranjanjharavi/sql-lens',
    updated: '2026-10-04',
    benchmarkMetric: 'Opens 1.2GB .sqlite file in 180ms',
    whyBuilt:
      "Inspecting a quick SQLite database dump shouldn't require installing a 300MB desktop GUI client. With sql-lens, you drag-and-drop any .db or .sqlite file into the browser and get instant EXPLAIN QUERY PLAN visualizations, foreign-key graph traversal, and virtualized grid editing.",
    tradeoffs: [
      'Implemented a custom HTTP Range / File slice VFS block reader in WebAssembly so 1GB+ SQLite files page in 4KB blocks on-demand without exhausting browser RAM.',
      'Rendered the 100,000-row data grid using a single DOM virtual scroller with fixed 28px row heights for locked 120fps scrolling.',
      'Zero external UI frameworks—pure CSS Grid, custom SVG schema connectors, and keyboard shortcuts modeled after Linear.'
    ],
    terminalTrace: `[wasm] sqlite3-vfs.wasm initialized (328 KB, page_size=4096)
[vfs]  Mounted local handle: production_snapshot.db (1.18 GB, 19 tables)
[sql]  EXPLAIN QUERY PLAN SELECT * FROM events WHERE org_id = 42 ORDER BY id DESC LIMIT 50;
  └─ SEARCH events USING INDEX idx_events_org_id_id (org_id=?) (~48 rows)
[render] Virtual grid painted 50 rows in 1.1ms`
  },
  {
    id: 'cron-tty',
    title: 'cron-tty',
    status: 'Experiment',
    category: 'Experiments',
    hook: 'Minimalist Shell & Go TUI daemon for visualizing local cron jobs, systemd timers, and macOS launchd agents in real time.',
    stack: ['Go', 'Shell'],
    demoUrl: 'https://yupcode.com/#cron-tty',
    repoUrl: 'https://github.com/ranjanjharavi/cron-tty',
    updated: '2026-10-28',
    benchmarkMetric: '2.1MB static binary • 0% idle CPU',
    whyBuilt:
      'On developer laptops, background tasks are scattered across crontab, ~/Library/LaunchAgents, and systemd user timers with zero unified visibility into when they last failed or what stdout they produced. cron-tty aggregates them into a single keyboard-driven terminal dashboard.',
    tradeoffs: [
      'Built a custom ANSI escape renderer in Go without heavy ncurses dependencies for crisp flicker-free resizing over SSH.',
      'Parsed cron expressions and calendar intervals into a unified min-heap timeline to project the next 24 hours of execution collisions.',
      'Wraps job execution with a lightweight pty tee so you can replay the last 5 stdout/stderr runs of any background script.'
    ],
    terminalTrace: `┌─ cron-tty v0.4.0 ─────────────────────────────── host: ravi-macbook-pro ─┐
│ [ACTIVE]  */15 * * * *   sync-dotfiles.sh       last: 2m ago (0)  140ms  │
│ [ACTIVE]  0 3 * * *      restic-backup-local    last: 14h ago (0) 4.2s   │
│ [WARN]    launchd.plist  com.yupcode.indexer    last: 9m ago (1)  19ms   │
└─ [r] Run Now   [l] Inspect Logs   [e] Edit Schedule   [q] Quit ──────────┘`
  },
  {
    id: 'zstd-pipe',
    title: 'zstd-pipe',
    version: 'v1.1.0',
    status: 'v1.0',
    category: 'CLI / Systems',
    featured: true,
    hook: 'Zero-downtime MySQL 8.0 stream migrator using adaptive zstd compression, caffeinate power assertions, and live GTID verification.',
    stack: ['Go', 'SQLite', 'Shell'],
    cli: 'brew install raviranjan/tap/zstd-pipe',
    demoUrl: '#drawer:zstd-pipe',
    repoUrl: 'https://github.com/ranjanjharavi/zstd-pipe',
    metrics: '380 MB/s stream • 4.2x compression ratio',
    whyBuilt:
      'Migrating a 10GB+ MySQL 8.0 database from shared infrastructure to a managed instance without downtime requires rock-solid streaming, checksum certainty, and ensuring the host machine never sleeps mid-cutover.',
    architecture:
      'Wraps mysqldump --single-transaction and zstd -T0 into a supervised Go pipeline with ring-buffer backpressure, macOS caffeinate process assertions, and an embedded SQLite state ledger that tracks table-by-table row counts and GTID positions.',
    snippet: `$ zstd-pipe migrate --src mysql://legacy:3306/prod --dst mysql://managed:3306/prod --threads 8
[00:00.12] Assert IOPMAssertionPreventUserIdleSystemSleep (PID 41892)
[00:04.85] Streaming 10.4 GB raw -> 2.41 GB zstd (ratio 4.31x @ 395 MB/s)
[00:26.40] Verifying GTID_SUBSET & CRC32 table checksums...
[00:26.91] Cutover ready: 0 replication lag detected.`
  },
  {
    id: 'jwt-cannon',
    title: 'jwt-cannon',
    version: 'v0.9.4',
    status: 'Active',
    category: 'Experiments',
    featured: true,
    hook: 'High-concurrency benchmark harness comparing HS256 JWT signing throughput and connection pool contention across Go, .NET 10, and TypeScript.',
    stack: ['Go', '.NET', 'TypeScript', 'SQLite'],
    cli: 'go install yupcode.com/jwt-cannon@latest',
    demoUrl: '#drawer:jwt-cannon',
    repoUrl: 'https://github.com/ranjanjharavi/jwt-cannon',
    metrics: '68k req/s peak • sub-1.2ms p99',
    whyBuilt:
      'Micro-benchmarks often test crypto signing in isolation while ignoring DB connection pool exhaustion under bursty login spikes. I wanted an apples-to-apples harness across runtimes.',
    architecture:
      'Orchestrates standardized endpoints in Go (net/http), .NET 10 Minimal APIs, and Node/Fastify backed by identical connection pool limits, recording HDR histograms and GC pause telemetry into a local SQLite database.',
    snippet: `$ jwt-cannon run --targets go,dotnet10,node --concurrency 512 --duration 30s
Runtime     RPS       p50       p99       Pool Wait (avg)
---------------------------------------------------------
Go 1.25     68,420    0.41ms    1.18ms    0.08ms
.NET 10     64,190    0.44ms    1.35ms    0.11ms
Node/TS     24,810    1.82ms    7.90ms    1.45ms`
  },
  {
    id: 'doc-ark',
    title: 'doc-ark',
    version: 'v1.3.0',
    status: 'Active',
    category: 'CLI / Systems',
    featured: true,
    hook: 'Incremental static-site failover compiler that snapshots 25,000+ dynamic documentation pages daily with embedded offline search.',
    stack: ['Go', 'TypeScript', 'SQLite'],
    cli: 'doc-ark sync --manifest ./techdocs.toml --workers 32',
    demoUrl: '#drawer:doc-ark',
    repoUrl: 'https://github.com/ranjanjharavi/doc-ark',
    metrics: '25,000+ pages • < 4 min incremental build',
    whyBuilt:
      'When an upstream documentation provider experiences an outage, developer docs cannot go dark. doc-ark maintains a warm, zero-dependency static mirror ready for instant Nginx upstream failover.',
    architecture:
      'Uses a bounded worker pool in Go with ETag/SHA-256 content diffing stored in SQLite to skip unchanged routes, rewrites internal links for static hosting, and compiles a compressed client-side trigram search index.',
    snippet: `$ doc-ark sync --concurrency 32 --out ./dist-failover
[info] Loaded 25,412 known routes from state.db (WAL)
[sync] 24,890 unchanged (304) | 522 re-rendered | 0 failed
[index] Built client trigram index (41.2 KB brotli) in 840ms`
  },
  {
    id: 'stow-guard',
    title: 'stow-guard',
    version: 'v1.0.2',
    status: 'v1.0',
    category: 'CLI / Systems',
    featured: false,
    hook: 'Audits ~/dotfiles GNU Stow symlink trees, detects Brewfile package drift, and creates encrypted tar.zst backups in one command.',
    stack: ['Shell', 'Go'],
    cli: 'brew install raviranjan/tap/stow-guard',
    demoUrl: '#drawer:stow-guard',
    repoUrl: 'https://github.com/ranjanjharavi/stow-guard',
    metrics: '18ms audit • arm64 native',
    whyBuilt:
      'Managing ~/dotfiles across macOS updates is great until dangling symlinks or unrecorded brew installs silently cause configuration drift.',
    architecture:
      'Combines a fast Go symlink walker with Zsh helper hooks that diff `brew bundle dump` against your committed Brewfile and stream sensitive SSH/GPG keys through tar + zstd + age encryption.',
    snippet: `$ stow-guard status --path ~/dotfiles
✓ GNU Stow symlinks: 142 valid, 0 broken
! Brewfile drift: 2 unrecorded formulae (jq, hyperfine)
✓ Last archive: dotfiles-2026-11-01.tar.zst.age (verified)`
  },
  {
    id: 'quadlet-gen',
    title: 'quadlet-gen',
    version: 'v1.2.0',
    status: 'v1.0',
    category: 'Web Apps',
    featured: false,
    hook: 'Client-side compiler converting Docker Compose files into hardened RHEL Podman systemd Quadlet units with SELinux volume labels.',
    stack: ['Vanilla JS', 'TypeScript', 'Shell'],
    cli: 'npx quadlet-gen ./docker-compose.yml --selinux',
    demoUrl: '#drawer:quadlet-gen',
    repoUrl: 'https://github.com/ranjanjharavi/quadlet-gen',
    metrics: '0-server AST parser • Podman 5+ ready',
    whyBuilt:
      'Running rootless Podman containers managed by systemd on RHEL servers is far cleaner than Docker daemons, but writing .container Quadlet files and SELinux :Z flags manually is error-prone.',
    architecture:
      'Parses YAML AST entirely in the browser (and via CLI), mapping networks, healthchecks, and bind mounts into compliant `.container` and `.network` systemd unit templates with Nginx socket activation snippets.',
    snippet: `# Generated by quadlet-gen (RHEL 9 / Podman rootless)
[Unit]
Description=App Worker Container
After=network-online.target

[Container]
Image=ghcr.io/yupcode/worker:1.2.0
Volume=/srv/app/data:/data:Z
PublishPort=127.0.0.1:8080:8080`
  },
  {
    id: 'sqlite-lens',
    title: 'sqlite-lens',
    version: 'v0.7.0',
    status: 'Beta',
    category: 'Local-First',
    featured: false,
    hook: 'Browser-based SQLite B-tree page inspector and EXPLAIN QUERY PLAN visualizer powered by WebAssembly and OPFS.',
    stack: ['Vanilla JS', 'SQLite', 'TypeScript'],
    cli: 'npx sqlite-lens ./local.db',
    demoUrl: '#drawer:sqlite-lens',
    repoUrl: 'https://github.com/ranjanjharavi/sqlite-lens',
    metrics: '100% client-side WASM • Zero uploads',
    whyBuilt:
      'When optimizing local-first schemas or WAL checkpoint sizes, I wanted an instant drag-and-drop inspector in the browser without uploading sensitive data or opening a heavy desktop IDE.',
    architecture:
      'Loads sqlite3.wasm over an Origin Private File System (OPFS) VFS layer, runs `dbstat` virtual table aggregations to map page density, and renders interactive query plan trees.',
    snippet: `> EXPLAIN QUERY PLAN SELECT * FROM events WHERE host = 'mac-arm64' ORDER BY ts DESC LIMIT 50;
SEARCH events USING INDEX idx_events_host_ts (host=?)
Pages touched: 4 (B-tree depth: 3) • Est. cost: 0.14ms`
  },
  {
    id: 'sql-diff-lite',
    title: 'sql-diff-lite',
    version: 'v0.6.1',
    status: 'Beta',
    category: 'CLI / Systems',
    featured: false,
    hook: 'Static AST linter for raw PostgreSQL & MySQL migrations that catches table-locking ALTER statements before deployment.',
    stack: ['TypeScript', 'Go', 'SQLite'],
    cli: 'npx sql-diff-lite check ./migrations/*.sql',
    demoUrl: '#drawer:sql-diff-lite',
    repoUrl: 'https://github.com/ranjanjharavi/sql-diff-lite',
    metrics: '14ms lint pass • Drizzle & Knex compatible',
    whyBuilt:
      "I prefer raw SQL, Drizzle, and Knex over heavy ORMs, but raw SQL requires strict discipline so a careless migration doesn't acquire an ACCESS EXCLUSIVE lock on a high-traffic table.",
    architecture:
      'Tokenizes SQL DDL statements into a lightweight AST and evaluates 28 safety heuristics for MySQL 8.0 (INSTANT vs COPY algorithms) and PostgreSQL concurrent index creation.',
    snippet: `$ sql-diff-lite check ./migrations/20261101_add_idx.sql
[WARN] line 14: CREATE INDEX without CONCURRENTLY blocks writes in Postgres.
[OK]   line 22: ALTER TABLE users ADD COLUMN meta JSON (MySQL 8.0 ALGORITHM=INSTANT safe)`
  },
  {
    id: 'ef-trace',
    title: 'ef-trace',
    version: 'v0.3.0',
    status: 'Experiment',
    category: 'CLI / Systems',
    featured: false,
    hook: 'Real-time terminal TUI that intercepts .NET 10 Entity Framework Core command streams to flag N+1 queries and slow transactions.',
    stack: ['.NET', 'SQLite', 'Shell'],
    cli: 'dotnet tool install -g YupCode.EfTrace',
    demoUrl: '#drawer:ef-trace',
    repoUrl: 'https://github.com/ranjanjharavi/ef-trace',
    metrics: '< 0.2ms diagnostic overhead • EventPipe stream',
    whyBuilt:
      'While exploring .NET 10 with SQLite and EF Core on macOS, reading raw SQL generated by LINQ inside standard console logs felt noisy compared to having a dedicated live query profiler.',
    architecture:
      'Subscribes to the .NET DiagnosticSource / EventPipe over a local Unix domain socket, normalizes SQL parameters to detect repetitive N+1 query fingerprints within a single HTTP request scope, and renders a live terminal view.',
    snippet: `$ ef-trace attach --pid 68210
[12:04:11.09] GET /api/orders (24.8ms total)
  ⚠ N+1 Detected: Executed 18x [SELECT * FROM "OrderItems" WHERE "OrderId" = @p0]
  💡 Suggestion: Add .Include(o => o.Items) or split query.`
  },
  {
    id: 'usbc-edid',
    title: 'usbc-edid',
    version: 'v1.0.0',
    status: 'v1.0',
    category: 'CLI / Systems',
    featured: false,
    hook: 'Inspects USB-C DisplayPort EDID payloads on Apple Silicon to generate crisp QHD HiDPI scaling overrides for external monitors.',
    stack: ['Shell', 'Go'],
    cli: 'curl -sL yupcode.com/usbc-edid | sh',
    demoUrl: '#drawer:usbc-edid',
    repoUrl: 'https://github.com/ranjanjharavi/usbc-edid',
    metrics: 'Native arm64 • Crisp 2560x1440 HiDPI',
    whyBuilt:
      'External 23.8-inch QHD IPS monitors over USB-C often default to non-HiDPI framebuffer modes on macOS, causing subtle text fringing in terminal emulators and code editors.',
    architecture:
      'Queries `ioreg` display vendor/product IDs on Apple Silicon, calculates the 2x Retina backing store resolution matrices (e.g., 3840x2160 downsample to 1920x1080/2304x1296 HiDPI), and writes the CoreDisplay plist override.',
    snippet: `$ usbc-edid inspect
Detected: Lenovo Q24h-10 (23.8" QHD 2560x1440 @ USB-C DP Alt Mode, 80W PD)
Status: Native HiDPI scaling unlocked (Framebuffer 4608x2592 -> 2304x1296 @ 60Hz)`
  },
  {
    id: 'tab-stash-idb',
    title: 'tab-stash-idb',
    version: 'v0.8.2',
    status: 'Active',
    category: 'Local-First',
    featured: false,
    hook: 'Keyboard-first engineering reader that snapshots RFCs and technical blog posts into IndexedDB as clean, searchable Markdown.',
    stack: ['Vanilla JS', 'SQLite'],
    cli: 'git clone https://github.com/ranjanjharavi/tab-stash-idb',
    demoUrl: '#drawer:tab-stash-idb',
    repoUrl: 'https://github.com/ranjanjharavi/tab-stash-idb',
    metrics: '0kb frameworks • Offline inverted index',
    whyBuilt:
      'Browser bookmarks rot and cloud read-it-later apps lock your notes behind subscriptions. I wanted a fast, offline-first vault for system design docs and RFCs.',
    architecture:
      'Built with plain HTML, CSS, and Vanilla JS. Uses a custom DOM readability stripper to convert articles into clean Markdown, persists blobs in IndexedDB, and builds an in-memory prefix tree for sub-5ms `/` search.',
    snippet: `[IndexedDB: tab_stash_v1] 318 archived engineering docs (14.2 MB)
Keys: [j/k] navigate • [/] grep full-text • [e] export .md bundle`
  }
];

/**
 * The Tinkering Log Data (`LAB_NOTES_DATA`)
 * Chronological micro-updates, benchmarks, and half-baked ideas on the workbench
 */
const LAB_NOTES_DATA = [
  {
    date: '2026-10-29',
    tag: 'BENCHMARK',
    projectRef: 'hstr-wal',
    title: 'Testing SQLite mmap_size=268435456 on Apple M3 NVMe',
    summary:
      'Switched hstr-wal read connections to memory-mapped I/O. Cold fuzzy-search p99 across 500k shell commands dropped from 1.18ms to 0.42ms with zero heap allocations on the hot loop.',
    snippet: 'PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA mmap_size = 268435456;'
  },
  {
    date: '2026-10-21',
    tag: 'PROTOTYPE',
    projectRef: 'grammard-web',
    title: 'Experimenting with WebGPU Subgroup Matrix Multiply in Chrome 130+',
    summary:
      'Wrote a tiny WGSL compute shader prototype to test token prefill speeds for local browser linting. Seeing a ~28% prefill speedup on small 500M parameter GGUF shards stored in OPFS.',
    snippet: 'enable subgroups; // +28% prefill throughput on local prose buffers'
  },
  {
    date: '2026-10-12',
    tag: 'IDEA / WIP',
    projectRef: 'diff-clipboard',
    title: 'Weekend sketch: TTY clipboard ring buffer in 200 lines of Go',
    summary:
      'Half-baked utility that watches pbcopy / wl-paste and lets you pipe the last N clipboard items directly into standard unix diff (`clipdiff -1 -2 | delta`). Shipping to yupcode next weekend.',
    snippet: '$ clipdiff 0 1 --syntax=json | less -R'
  },
  {
    date: '2026-09-30',
    tag: 'RELEASE',
    projectRef: 'dotnet-flame',
    title: 'Shipped NativeAOT single-binary builds for Linux musl & macOS arm64',
    summary:
      'Stripped reflection metadata from the EventPipe stack parser. Binary size dropped from 29MB to 4.6MB and startup time is now indistinguishable from a C binary.',
    snippet: 'dotnet publish -c Release -r osx-arm64 /p:PublishAot=true /p:StripSymbols=true'
  }
];

// Supported Filter Categories & Stack Pills
const CATEGORIES = ['All', 'CLI / Systems', 'Web Apps', 'Local-First', 'Experiments'];
const TECH_STACKS = ['Go', 'TypeScript', 'Vanilla JS', 'SQLite', '.NET', 'Shell'];

/**
 * Application State
 */
const state = {
  selectedCategory: 'All',
  selectedStack: null, // null means all stacks
  searchQuery: '',
  activeDrawerProjectId: null,
  cmdPaletteOpen: false,
  cmdSelectedIndex: 0,
  filteredCommands: []
};

/**
 * Utility Functions (Clipboard, Toast, Status Badge Styling)
 */

// Copy text reliably inside iframes & standard browsers
function copyToClipboard(text, label = 'Copied to clipboard') {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast(label, text);
  } catch (err) {
    showToast('Failed to copy snippet', String(err));
  }
}

// Non-intrusive developer toast notification
function showToast(title, subtitle = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className =
    'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-zinc-100 border border-emerald-500/40 shadow-2xl text-xs font-mono transition-all duration-200 transform translate-y-0';
  toast.innerHTML = `
        <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">✓</span>
        <div class="max-w-xs overflow-hidden">
          <div class="font-semibold text-zinc-100">${escapeHtml(title)}</div>
          ${subtitle ? `<div class="text-[11px] text-zinc-400 truncate mt-0.5">${escapeHtml(subtitle)}</div>` : ''}
        </div>
      `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 220);
  }, 2600);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Semantic badge classes based on project status
function getStatusBadgeHtml(status) {
  const styles = {
    'v1.0': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Active: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    Beta: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Experiment: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Archived: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
  };
  const cls = styles[status] || styles['Active'];
  return `<span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium border ${cls}">${escapeHtml(status)}</span>`;
}

function hasArchitectureNote(project) {
  return Array.isArray(project.tradeoffs) && project.tradeoffs.length > 0;
}

/**
 * Theme Engine (Dark-mode first + localStorage persistence)
 */
function initTheme() {
  const savedTheme = localStorage.getItem('yupcode_theme');
  const htmlEl = document.documentElement;
  if (savedTheme === 'light') {
    htmlEl.classList.remove('dark');
  } else {
    htmlEl.classList.add('dark');
  }
}

function toggleTheme() {
  const htmlEl = document.documentElement;
  const isDark = htmlEl.classList.toggle('dark');
  localStorage.setItem('yupcode_theme', isDark ? 'dark' : 'light');
  showToast(
    `Switched to ${isDark ? 'Dark' : 'Light'} theme`,
    isDark ? '#0A0A0C lab palette' : '#FAFAFA crisp daylight'
  );
}

/**
 * Render Functions (Filter Bars, Projects Grid, Lab Notes)
 */

function renderFilterBars() {
  // Category Filter Bar
  const catBar = document.getElementById('categoryFilterBar');
  catBar.innerHTML = CATEGORIES.map((cat) => {
    const isActive = state.selectedCategory === cat;
    const count = cat === 'All' ? PROJECTS_DATA.length : PROJECTS_DATA.filter((p) => p.category === cat).length;

    return `
          <button
            type="button"
            data-category="${escapeHtml(cat)}"
            class="category-pill whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
              isActive
                ? 'bg-emerald-500 text-zinc-950 font-semibold border-emerald-500 shadow-sm'
                : 'bg-lab-bg text-lab-muted hover:text-lab-text border-lab-border hover:border-lab-borderHover'
            }"
          >
            <span>${escapeHtml(cat)}</span>
            <span class="text-[10px] ${isActive ? 'text-zinc-900/80' : 'text-lab-muted'}">(${count})</span>
          </button>
        `;
  }).join('');

  // Attach listeners
  catBar.querySelectorAll('.category-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.selectedCategory = btn.getAttribute('data-category');
      renderFilterBars();
      renderProjectsGrid();
    });
  });

  // Tech Stack Filter Bar
  const stackBar = document.getElementById('stackFilterBar');
  stackBar.innerHTML = TECH_STACKS.map((tech) => {
    const isActive = state.selectedStack === tech;
    return `
          <button
            type="button"
            data-stack="${escapeHtml(tech)}"
            class="stack-pill px-2.5 py-1 rounded-md text-xs font-mono transition-all border ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-medium'
                : 'bg-lab-bg text-lab-muted hover:text-lab-text border-lab-border hover:border-lab-borderHover'
            }"
          >
            ${isActive ? '● ' : ''}${escapeHtml(tech)}
          </button>
        `;
  }).join('');

  stackBar.querySelectorAll('.stack-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const clickedStack = btn.getAttribute('data-stack');
      state.selectedStack = state.selectedStack === clickedStack ? null : clickedStack;
      renderFilterBars();
      renderProjectsGrid();
    });
  });
}

function getFilteredProjects() {
  return PROJECTS_DATA.filter((project) => {
    const matchesCategory = state.selectedCategory === 'All' || project.category === state.selectedCategory;

    const matchesStack =
      !state.selectedStack || project.stack.some((s) => s.toLowerCase() === state.selectedStack.toLowerCase());

    const q = state.searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      project.title.toLowerCase().includes(q) ||
      project.hook.toLowerCase().includes(q) ||
      project.category.toLowerCase().includes(q) ||
      project.stack.some((s) => s.toLowerCase().includes(q));

    return matchesCategory && matchesStack && matchesQuery;
  });
}

function renderProjectsGrid() {
  const gridEl = document.getElementById('projectsGrid');
  const emptyEl = document.getElementById('emptyProjectsState');
  const statsEl = document.getElementById('activeFilterStats');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const filtered = getFilteredProjects();
  statsEl.textContent = `Showing ${filtered.length} of ${PROJECTS_DATA.length} experiments`;

  const hasFilters =
    state.selectedCategory !== 'All' || state.selectedStack !== null || state.searchQuery.trim() !== '';

  if (hasFilters) {
    resetBtn.classList.remove('hidden');
  } else {
    resetBtn.classList.add('hidden');
  }

  if (filtered.length === 0) {
    gridEl.classList.add('hidden');
    emptyEl.classList.remove('hidden');
    return;
  }

  gridEl.classList.remove('hidden');
  emptyEl.classList.add('hidden');

  gridEl.innerHTML = filtered
    .map(
      (project) => `
        <article
          data-project-id="${escapeHtml(project.id)}"
          class="project-card group rounded-xl bg-lab-elevated border border-lab-border flex flex-col justify-between p-5 cursor-pointer relative overflow-hidden"
        >
          <!-- Top Accent Bar on Hover -->
          <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div>
            <!-- Header: Title + Status Badge -->
            <div class="flex items-start justify-between gap-3 mb-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs text-emerald-500">&gt;</span>
                  <h3 class="font-mono font-semibold text-base text-lab-text group-hover:text-emerald-400 transition-colors">
                    ${escapeHtml(project.title)}
                  </h3>
                </div>
                <span class="font-mono text-[11px] text-lab-muted block mt-0.5">${escapeHtml(project.category)} • ${escapeHtml(project.benchmarkMetric || project.metrics || 'Notes compiling')}</span>
              </div>
              ${getStatusBadgeHtml(project.status)}
            </div>

            <!-- 2-Line Problem/Solution Hook -->
            <p class="text-sm text-lab-muted leading-relaxed line-clamp-2 mb-4">
              ${escapeHtml(project.hook)}
            </p>

            <!-- Tech Stack Pills in Monospace -->
            <div class="flex flex-wrap items-center gap-1.5 mb-5">
              ${project.stack
                .map(
                  (tech) => `
                <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-lab-subtle text-lab-text/90 border border-lab-border">
                  ${escapeHtml(tech)}
                </span>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Card Footer: Action Links -->
          <div class="pt-3.5 border-t border-lab-border" onclick="event.stopPropagation()">
            <!-- Quick-Action Links Row -->
            <div class="flex items-center justify-between text-xs font-mono pt-0.5">
              <div class="flex items-center gap-3">
                ${project.demoUrl && !project.demoUrl.startsWith('#') ? `
                <a
                  href="${escapeHtml(project.demoUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-lab-muted hover:text-lab-text transition-colors inline-flex items-center gap-1"
                >
                  <span>Demo</span>
                  <span class="text-[10px]">↗</span>
                </a>
                ` : ''}
                <a
                  href="${escapeHtml(project.repoUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-lab-muted hover:text-lab-text transition-colors inline-flex items-center gap-1"
                >
                  <span>GitHub</span>
                  <span class="text-[10px]">↗</span>
                </a>
              </div>

              <button
                type="button"
                data-open-drawer="${escapeHtml(project.id)}"
                aria-label="${hasArchitectureNote(project) ? 'Read architecture note' : 'View project brief'} for ${escapeHtml(project.title)}"
                class="open-drawer-btn text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 group/arch"
              >
                <span>${hasArchitectureNote(project) ? 'Architecture Note' : 'Notes compiling'}</span>
                <span class="transform group-hover/arch:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  // Bind card click to open Architecture Drawer
  gridEl.querySelectorAll('article[data-project-id]').forEach((card) => {
    card.addEventListener('click', () => {
      openArchitectureDrawer(card.getAttribute('data-project-id'));
    });
  });

  // Bind explicit "Architecture Note" buttons
  gridEl.querySelectorAll('.open-drawer-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openArchitectureDrawer(btn.getAttribute('data-open-drawer'));
    });
  });
}

function renderLabNotes() {
  const feedEl = document.getElementById('labNotesFeed');
  feedEl.innerHTML = LAB_NOTES_DATA.map(
    (note) => `
        <div class="relative group">
          <!-- Timeline Dot -->
          <span class="absolute -left-[31px] sm:-left-[39px] top-1.5 h-3 w-3 rounded-full bg-lab-elevated border-2 border-emerald-500 group-hover:scale-125 transition-transform"></span>

          <div class="rounded-xl bg-lab-elevated border border-lab-border p-4 sm:p-5 space-y-2.5 hover:border-lab-borderHover transition-colors">
            <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <div class="flex items-center gap-2">
                <span class="text-lab-muted">${escapeHtml(note.date)}</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${escapeHtml(note.tag)}</span>
              </div>
              <span class="text-lab-muted">ref: <code class="text-lab-text">${escapeHtml(note.projectRef)}</code></span>
            </div>

            <h3 class="text-base font-medium text-lab-text">${escapeHtml(note.title)}</h3>
            <p class="text-sm text-lab-muted leading-relaxed">${escapeHtml(note.summary)}</p>

            <div class="pt-1">
              <code class="block px-3 py-2 rounded-lg bg-lab-bg border border-lab-border font-mono text-xs text-emerald-400 overflow-x-auto">
                ${escapeHtml(note.snippet)}
              </code>
            </div>
          </div>
        </div>
      `
  ).join('');
}

/**
 * "HOW IT WORKS" Architecture Drawer Controller
 */
function openArchitectureDrawer(projectId) {
  const project = PROJECTS_DATA.find((p) => p.id === projectId);
  if (!project) return;

  state.activeDrawerProjectId = projectId;
  const hasNotes = hasArchitectureNote(project);
  const tradeoffs = hasNotes ? project.tradeoffs : project.architecture ? [project.architecture] : [];
  const metric = project.benchmarkMetric || project.metrics || '';
  const trace = project.terminalTrace || project.snippet || '';

  document.getElementById('drawerNoteType').textContent = hasNotes ? '// ARCHITECTURE NOTE' : '// PROJECT BRIEF';
  document.getElementById('drawerNotesPending').classList.toggle('hidden', hasNotes);
  document.getElementById('drawerNotesPendingCopy').textContent =
    `The ${project.title} architecture write-up is still on the workbench. Here’s the project brief in the meantime.`;
  document.getElementById('drawerStatusBadge').innerHTML = getStatusBadgeHtml(project.status);
  document.getElementById('drawerCategory').textContent = project.category;
  document.getElementById('drawerUpdated').textContent = project.updated
    ? `Updated ${project.updated}`
    : project.version || 'Project brief';
  document.getElementById('drawerTitle').textContent = project.title;
  document.getElementById('drawerHook').textContent = project.hook;

  document.getElementById('drawerStackPills').innerHTML = project.stack
    .map(
      (t) => `
        <span class="px-2.5 py-0.5 rounded text-xs font-mono bg-lab-subtle text-lab-text border border-lab-border">${escapeHtml(t)}</span>
      `
    )
    .join('');

  const demoLink = document.getElementById('drawerLiveDemoLink');
  demoLink.href = project.demoUrl || '#';
  demoLink.classList.toggle('hidden', !project.demoUrl || project.demoUrl.startsWith('#'));
  document.getElementById('drawerGithubLink').href = project.repoUrl;
  document.getElementById('drawerWhyBuilt').textContent = project.whyBuilt || '';
  document.getElementById('drawerWhyBuiltSection').classList.toggle('hidden', !project.whyBuilt);

  document.getElementById('drawerArchitectureHeading').textContent = hasNotes
    ? '02 // Architecture & Trade-offs'
    : '02 // Architecture at a Glance';
  document.getElementById('drawerArchitectureSection').classList.toggle('hidden', tradeoffs.length === 0);
  document.getElementById('drawerTradeoffs').innerHTML = tradeoffs
    .map(
      (item) => `
        <li class="flex items-start gap-2.5 bg-lab-bg/40 p-3 rounded-lg border border-lab-border">
          <span class="font-mono text-xs text-emerald-400 mt-0.5">→</span>
          <span class="text-lab-text/90 leading-relaxed">${escapeHtml(item)}</span>
        </li>
      `
    )
    .join('');

  document.getElementById('drawerMetricBadge').textContent = metric;
  document.getElementById('drawerMetricBadge').classList.toggle('hidden', !metric);
  document.getElementById('drawerTerminalSnippet').textContent = trace;
  document.getElementById('drawerTraceSection').classList.toggle('hidden', !trace);

  const drawer = document.getElementById('architectureDrawer');
  drawer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeArchitectureDrawer() {
  state.activeDrawerProjectId = null;
  const drawer = document.getElementById('architectureDrawer');
  drawer.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * Command Palette (Cmd/Ctrl + K) Controller
 */
function buildCommandItems() {
  const projectCommands = PROJECTS_DATA.map((p) => ({
    id: `proj-${p.id}`,
    group: 'Projects',
    title: `${p.title} — ${hasArchitectureNote(p) ? 'Open Architecture Note' : 'View Project Brief'}`,
    subtitle: `${p.category} • ${p.stack.join(', ')}`,
    badge: p.status,
    action: () => openArchitectureDrawer(p.id)
  }));

  const systemCommands = [
    {
      id: 'act-theme',
      group: 'Actions',
      title: 'Toggle Dark / Light Theme',
      subtitle: 'Switch between #0A0A0C dark lab and crisp light mode',
      badge: 'Theme',
      action: () => toggleTheme()
    },
    {
      id: 'act-reset',
      group: 'Actions',
      title: 'Reset All Project Filters',
      subtitle: 'Show all categories and tech stacks',
      badge: 'Filter',
      action: () => resetAllFilters()
    },
    {
      id: 'ext-ravi',
      group: 'External',
      title: 'Visit raviranjanjha.com',
      subtitle: "Open Ravi Ranjan Jha's primary website in a new tab",
      badge: '↗',
      action: () => window.open('https://raviranjanjha.com', '_blank', 'noopener')
    }
  ];

  return [...projectCommands, ...systemCommands];
}

function openCmdPalette() {
  state.cmdPaletteOpen = true;
  state.cmdSelectedIndex = 0;
  const modal = document.getElementById('cmdPaletteModal');
  const input = document.getElementById('cmdPaletteInput');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  input.value = '';
  renderCmdPaletteResults('');
  setTimeout(() => input.focus(), 20);
}

function closeCmdPalette() {
  state.cmdPaletteOpen = false;
  const modal = document.getElementById('cmdPaletteModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function renderCmdPaletteResults(query) {
  const allCommands = buildCommandItems();
  const q = query.trim().toLowerCase();

  state.filteredCommands = allCommands.filter(
    (cmd) =>
      !q ||
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.group.toLowerCase().includes(q)
  );

  if (state.cmdSelectedIndex >= state.filteredCommands.length) {
    state.cmdSelectedIndex = 0;
  }

  const container = document.getElementById('cmdPaletteResults');
  if (state.filteredCommands.length === 0) {
    container.innerHTML = `
          <div class="py-8 text-center font-mono text-xs text-lab-muted">
            No matching commands or projects for "${escapeHtml(query)}"
          </div>
        `;
    return;
  }

  container.innerHTML = state.filteredCommands
    .map((cmd, idx) => {
      const isSelected = idx === state.cmdSelectedIndex;
      return `
          <button
            type="button"
            data-cmd-idx="${idx}"
            class="cmd-result-item w-full px-3 py-2.5 rounded-lg text-left flex items-center justify-between gap-3 transition-colors ${
              isSelected
                ? 'bg-emerald-500/15 border border-emerald-500/40'
                : 'hover:bg-lab-subtle border border-transparent'
            }"
          >
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-mono text-[10px] uppercase tracking-wider text-emerald-400">${escapeHtml(cmd.group)}</span>
                <span class="text-xs font-medium text-lab-text truncate">${escapeHtml(cmd.title)}</span>
              </div>
              <div class="text-[11px] font-mono text-lab-muted truncate mt-0.5">${escapeHtml(cmd.subtitle)}</div>
            </div>
            <span class="flex-shrink-0 font-mono text-[10px] px-2 py-0.5 rounded bg-lab-bg text-lab-muted border border-lab-border">
              ${escapeHtml(cmd.badge)}
            </span>
          </button>
        `;
    })
    .join('');

  container.querySelectorAll('.cmd-result-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-cmd-idx'));
      const chosen = state.filteredCommands[idx];
      if (chosen) {
        closeCmdPalette();
        chosen.action();
      }
    });
  });
}

/**
 * Event listeners & Initialization
 */
function resetAllFilters() {
  state.selectedCategory = 'All';
  state.selectedStack = null;
  state.searchQuery = '';
  const searchInput = document.getElementById('projectSearchInput');
  if (searchInput) searchInput.value = '';
  renderFilterBars();
  renderProjectsGrid();
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderFilterBars();
  renderProjectsGrid();
  renderLabNotes();

  // Theme toggle button
  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

  // Search input live filtering
  const searchInput = document.getElementById('projectSearchInput');
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderProjectsGrid();
  });

  // Reset filter buttons
  document.getElementById('resetFiltersBtn').addEventListener('click', resetAllFilters);
  document.getElementById('emptyResetBtn').addEventListener('click', resetAllFilters);

  // Drawer controls
  document.getElementById('closeDrawerBtn').addEventListener('click', closeArchitectureDrawer);
  document.getElementById('drawerBottomCloseBtn').addEventListener('click', closeArchitectureDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', closeArchitectureDrawer);

  // Command Palette controls
  document.getElementById('cmdKTriggerBtn').addEventListener('click', openCmdPalette);
  document.getElementById('cmdPaletteBackdrop').addEventListener('click', closeCmdPalette);
  document.getElementById('cmdPaletteInput').addEventListener('input', (e) => {
    state.cmdSelectedIndex = 0;
    renderCmdPaletteResults(e.target.value);
  });

  // RSS feed button generates & copies an XML preview toast
  document.getElementById('rssFeedBtn').addEventListener('click', () => {
    copyToClipboard('https://yupcode.com/rss.xml', 'Copied RSS feed URL');
  });

  // Global Keyboard Shortcuts (Cmd/Ctrl + K, '/', ESC, Arrow keys in Cmd+K)
  document.addEventListener('keydown', (e) => {
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (state.cmdPaletteOpen) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
      return;
    }

    // Escape closes Command Palette or Architecture Drawer
    if (e.key === 'Escape') {
      if (state.cmdPaletteOpen) {
        closeCmdPalette();
        return;
      }
      if (state.activeDrawerProjectId) {
        closeArchitectureDrawer();
        return;
      }
    }

    // Navigate inside Command Palette
    if (state.cmdPaletteOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (state.filteredCommands.length > 0) {
          state.cmdSelectedIndex = (state.cmdSelectedIndex + 1) % state.filteredCommands.length;
          renderCmdPaletteResults(document.getElementById('cmdPaletteInput').value);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (state.filteredCommands.length > 0) {
          state.cmdSelectedIndex =
            (state.cmdSelectedIndex - 1 + state.filteredCommands.length) % state.filteredCommands.length;
          renderCmdPaletteResults(document.getElementById('cmdPaletteInput').value);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const chosen = state.filteredCommands[state.cmdSelectedIndex];
        if (chosen) {
          closeCmdPalette();
          chosen.action();
        }
      }
      return;
    }

    // Press '/' to focus terminal grep search when not typing in an input
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
      e.preventDefault();
      searchInput.focus();
    }
  });
});
