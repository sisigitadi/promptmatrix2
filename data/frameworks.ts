export type FrameworkComponent = {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "select"
    | "textarea"
    | "color"
    | "date"
    | "slider"
    | "boolean"
    | "code"
    | "multiselect"
    | "image"
    | "file";
  placeholder?: string;
  options?: string[];
  info?: string;
  min?: number;
  max?: number;
  step?: number;
  optional?: boolean;
  unit?: string;
  validation?: {
    min_length?: number;
    max_length?: number;
    regex?: string;
    min_value?: number;
    max_value?: number;
    min_date?: string;
    max_date?: string;
  };
};

export type DynamicSubcomponents = {
  trigger: string;
  options: {
    [key: string]: FrameworkComponent[];
  };
};

export type KomponenPromptType = {
  PERAN?: string;
  KONTEKS?: string;
  TUGAS?: string;
  "VARIABEL INPUT"?: { [key: string]: FrameworkComponent };
  "FORMAT OUTPUT"?: string;
};

export type Framework = {
  description: string;
  toolType:
    | "text"
    | "code"
    | "music-composition"
    | "music-generation"
    | "audio-generation"
    | "image-generation"
    | "image-editing"
    | "planning"
    | "video";
  components?: FrameworkComponent[]; // Make optional
  dynamicSubcomponents?: DynamicSubcomponents;
  ai_logic_description?: string;

  // New fields from SOP
  id_kerangka?: string;
  nama_kerangka?: string; // Changed from nama_kerangka_json
  version?: string; // New
  kategori?: string[]; // New
  perspektif_user?: string; // Changed from perspektif_user_json
  logika_ai?: string; // Changed from logika_ai_json
  komponen_prompt?: KomponenPromptType; // Changed from komponen_prompt_json
  konteks_tambahan_instruksi_khusus?: string; // Changed from konteks_tambahan_instruksi_khusus_json
  contoh_kalimat?: string; // Changed from contoh_kalimat_json
  output?: "natural_language_prompt" | "json_prompt"; // Changed from output_json
  examples?: { input: string; output: string }[]; // New field for few-shot examples
  temperature?: number;
  top_p?: number;
  top_k?: number;
};

export type PromptFrameworksType = {
  [category: string]: {
    [subcategory: string]: {
      [framework: string]: Framework;
    };
  };
};

export const CATEGORY_ORDER: string[] = [
  "Teks & Konten",
  "Gambar & Desain",
  "Audio & Musik",
  "Video & Animasi",
  "Kode & Pengembang",
  "Prompt Ringkas",
  "Prompt Proyek",
  "Koleksi & Inovasi",
];

export const PROMPT_FRAMEWORKS: PromptFrameworksType = {
  "Kode & Pengembang": {
    "AI, RAG & Desktop Multiplatform": {
      "LangChain & LlamaIndex RAG Pipeline Architect": {
        description: "Pipeline Retrieval-Augmented Generation (RAG) cerdas dengan vector embeddings (Pinecone/Chroma), semantic chunking, re-ranking, dan hybrid search.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Principal AI Systems Architect & LLM Engineer. Rancang pipeline RAG yang meminimalkan halusinasi, menggunakan hybrid search (Dense + Sparse/BM25), dan query expansion.",
        components: [
          {
            name: "ragKnowledgeBase",
            label: "Tujuan Sistem RAG & Tipe Dokumen",
            type: "text",
            placeholder: "contoh: Sistem Tanya-Jawab Dokumen SOP & Regulasi FinTech Internal (PDF, Markdown, SQL)",
            info: "Apa fungsi sistem RAG dan apa format data pengetahuannya?",
          },
          {
            name: "vectorDbFramework",
            label: "Framework LLM & Vector Database",
            type: "select",
            options: ["LlamaIndex (Python) + Pinecone Vector DB + OpenAI Embeddings", "LangChain (TypeScript/Next.js) + Supabase pgvector", "Haystack 2.0 + Qdrant / Weaviate Hybrid Search", "ChromaDB Local Embedded + Cohere Rerank v3", "Lainnya..."],
            info: "Pilih kombinasi framework LLM dan penyimpanan vektor",
          },
        ],
      },
      "Agentic AI Multi-Agent Workflow (CrewAI / AutoGen)": {
        description: "Desain sistem multi-agen AI otonom dengan pembagian peran terstruktur (Researcher, Writer, Reviewer), tool calling kustom, dan guardrails kualitas.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Agentic AI Engineer & Multi-Agent Orchestrator Specialist. Rancang arsitektur kolaborasi antar agen AI dengan batas wewenang yang jelas dan mitigasi infinite loop.",
        components: [
          {
            name: "agentWorkflowGoal",
            label: "Tujuan Sistem Multi-Agen",
            type: "text",
            placeholder: "contoh: Tim AI Otomatis untuk Riset Kompetitor, Penulisan Laporan Analisis, dan Validasi Fakta",
            info: "Tugas kompleks apa yang diselesaikan oleh tim agen AI?",
          },
          {
            name: "agentFramework",
            label: "Framework Multi-Agent",
            type: "select",
            options: ["CrewAI (Python) dengan Role-Based Agents & Tasks", "Microsoft AutoGen (Conversational Multi-Agent Pattern)", "LangGraph (Stateful Multi-Actor with Cyclic Graphs)", "Lainnya..."],
            info: "Pilih framework orchestrator agen AI",
          },
        ],
      },
      "Electron & Tauri Desktop App Architect": {
        description: "Arsitektur aplikasi desktop cross-platform modern dengan Rust backend (Tauri 2.0) atau Node/TypeScript (Electron) dengan keamanan IPC dan auto-updater.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Senior Desktop App Architect (Tauri / Electron).",
        components: [
          {
            name: "desktopAppName",
            label: "Nama & Fungsi Aplikasi Desktop",
            type: "text",
            placeholder: "contoh: Media Converter & Video Transcoder Offline Berkinerja Tinggi",
            info: "Apa aplikasi desktop yang dibangun?",
          },
        ],
      },
      "WebRTC Video Calling & Peer-to-Peer Streaming Engine": {
        description: "Sistem video calling P2P real-time, konfigurasi STUN/TURN server, signaling WebSocket, dan mesh network data channels audio-video rendah latensi.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Real-Time Communications (RTC) & Streaming Specialist.",
        components: [
          {
            name: "rtcAppPurpose",
            label: "Kebutuhan Fitur Video Call / Streaming",
            type: "text",
            placeholder: "contoh: Konsultasi Medis Online 1-on-1 dengan Enkripsi End-to-End dan Screen Sharing",
            info: "Fitur panggilan video apa yang ingin dibangun?",
          },
        ],
      },
      "Stripe Billing & Subscription Lifecycle Integration": {
        description: "Alur checkout Stripe lengkap, penanganan webhook (invoice.paid, customer.subscription.updated), upgrade plan, dan portal tagihan pelanggan.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Payment Gateway & Stripe Integration Specialist.",
        components: [
          {
            name: "billingModel",
            label: "Model Bisnis & Skema Paket Langganan",
            type: "text",
            placeholder: "contoh: SaaS Freemium dengan Paket Bulanan / Tahunan ($19/$190) dan Free Trial 14 Hari",
            info: "Bagaimana struktur harga dan paket tagihan produk Anda?",
          },
        ],
      },
      "Redis Caching & Rate Limiter Middleware": {
        description: "Middleware caching terdistribusi dengan Redis, sliding window rate limiter, dan strategi cache invalidation (TTL, Tag-based) anti-cache stampede.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah High-Throughput Backend Performance Engineer.",
        components: [
          {
            name: "cachePurpose",
            label: "Kebutuhan Caching / Rate Limiting",
            type: "text",
            placeholder: "contoh: Batasi request 100 req/menit per user IP dan cache respons katalog produk selama 1 jam",
            info: "Apa aturan rate limit dan data apa yang ingin di-cache?",
          },
        ],
      },
      "Apache Kafka Event Streaming & Consumer Group Architect": {
        description: "Desain topik Kafka, partisi terdistribusi, serialisasi Avro/Protobuf, consumer group idempotency, dan penanganan Dead Letter Queue (DLQ).",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Distributed Event Streaming Architect (Apache Kafka).",
        components: [
          {
            name: "eventPipelineDomain",
            label: "Domain Event Streaming",
            type: "text",
            placeholder: "contoh: Pipeline Transaksi Pembayaran Real-Time dengan Audit Log dan Notifikasi Pengguna",
            info: "Aliran data event apa yang diproses?",
          },
        ],
      },
      "Elasticsearch & OpenSearch Full-Text Search Engine": {
        description: "Indeks Elasticsearch/OpenSearch dengan custom tokenizers (Edge N-gram), fuzzy matching toleran typo, boosting relevansi, dan aggregations.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Enterprise Search Engine Specialist.",
        components: [
          {
            name: "searchDataset",
            label: "Katalog Data yang Dicari",
            type: "text",
            placeholder: "contoh: Pencarian Produk E-Commerce 2 Juta Item dengan Filter Kategori, Brand, dan Range Harga",
            info: "Apa data yang diindeks dan bagaimana perilaku pencariannya?",
          },
        ],
      },
      "Godot 4 & Unity C# Gameplay Mechanics Architect": {
        description: "Arsitektur game 2D/3D di Godot (GDScript) atau Unity (C#) dengan Finite State Machine karakter, sistem inventory, dan audio manager.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Lead Game Programmer & Mechanics Designer.",
        components: [
          {
            name: "gameMechanic",
            label: "Mekanika Game yang Dibangun",
            type: "text",
            placeholder: "contoh: Sistem Pergerakan Platformer 2D (Lari, Double Jump, Wall Slide, Dash) dengan coyote time",
            info: "Mekanika gameplay apa yang ingin dirancang kodenya?",
          },
        ],
      },
      "AWS Lambda Serverless & Step Functions Orchestrator": {
        description: "Arsitektur serverless AWS (Lambda, Step Functions, DynamoDB, API Gateway, S3) lengkap dengan monitoring CloudWatch dan Terraform IaC.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah AWS Certified Solutions Architect (Professional).",
        components: [
          {
            name: "serverlessWorkflow",
            label: "Alur Kerja Serverless yang Diotomasi",
            type: "text",
            placeholder: "contoh: Pemrosesan Gambar Async: Upload S3 -> Trigger Lambda Resize -> Simpan Metadata DynamoDB -> Kirim Notifikasi SNS",
            info: "Langkah-langkah proses serverless yang ingin dibangun",
          },
        ],
      },
      "Terraform & OpenTofu Multi-Cloud IaC Specialist": {
        description: "Modul Terraform enterprise untuk provisioning VPC terisolasi, subnet publik/privat, load balancer (ALB), dan cluster Kubernetes (EKS/GKE).",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Cloud Infrastructure as Code (IaC) Master.",
        components: [
          {
            name: "cloudInfrastructure",
            label: "Kebutuhan Infrastruktur Cloud",
            type: "text",
            placeholder: "contoh: AWS VPC Multi-AZ dengan 3 Private Subnet, NAT Gateway, dan RDS PostgreSQL Cluster",
            info: "Sumber daya cloud apa yang ingin dibuatkan kodenya?",
          },
        ],
      },
      "PostgreSQL TimescaleDB Time-Series Metrics Pipeline": {
        description: "Manajemen data time-series skala besar (IoT, transaksi trading, metrik server) dengan TimescaleDB hypertables dan automated compression.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Time-Series Database Performance Engineer.",
        components: [
          {
            name: "metricType",
            label: "Jenis Metrik Time-Series",
            type: "text",
            placeholder: "contoh: Data Sensor IoT Suhu & Tekanan 10.000 Perangkat dengan Interval 5 Detik",
            info: "Frekuensi dan jenis data metrik yang disimpan",
          },
        ],
      },
      "FastAPI Machine Learning Model Inference Service": {
        description: "Layanan API inferensi model ML/DL (PyTorch/ONNX/TensorFlow) dengan asynchronous worker, batch prediction, dan Swagger UI.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah MLOps & Production Inference Engineer.",
        components: [
          {
            name: "modelType",
            label: "Tipe Model Machine Learning & Input",
            type: "text",
            placeholder: "contoh: Model Klasifikasi Sentimen Teks BERT ONNX Runtime dengan Input Batch JSON",
            info: "Model apa yang di-deploy ke API?",
          },
        ],
      },
      "Chrome Extension Manifest V3 Developer Suite": {
        description: "Ekstensi browser Chrome Manifest V3 dengan background service worker, content scripts pengubah DOM, popup interaktif, dan storage sync.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Senior Browser Extension Developer.",
        components: [
          {
            name: "extensionGoal",
            label: "Fungsi Ekstensi Chrome yang Dibuat",
            type: "text",
            placeholder: "contoh: Ekstensi Pencatat Ringkasan Artikel Web Otomatis dengan Tombol Pintas Mengambang",
            info: "Apa aksi utama yang dilakukan ekstensi ini di halaman web?",
          },
        ],
      },
      "Zod & TypeScript End-to-End Type Safety Engine": {
        description: "Skema validasi runtime Zod yang otomatis diekstrak menjadi tipe TypeScript murni untuk tRPC atau Next.js Server Actions tanpa duplikasi.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah TypeScript Type System & Schema Validation Expert.",
        components: [
          {
            name: "validationDomain",
            label: "Formulir / Payload yang Divalidasi",
            type: "text",
            placeholder: "contoh: Formulir Pendaftaran Organisasi: Nama, Email, Password Kuat, Jumlah Karyawan, dan Dokumen Legal",
            info: "Field apa saja yang memerlukan validasi ketat?",
          },
        ],
      },
      "Tailwind CSS Custom Design System & Component Library": {
        description: "Perancangan design system Tailwind CSS dengan token kustom (colors, typography, spacing, shadows), dark mode, dan headless components.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Design System Lead & Tailwind UI Specialist.",
        components: [
          {
            name: "brandTheme",
            label: "Identitas Tema Brand & Karakter",
            type: "text",
            placeholder: "contoh: Brand FinTech Modern bernuansa Emerald Glow, Dark Slate background, dan sudut melengkung 16px (rounded-2xl)",
            info: "Bagaimana nuansa visual design system yang diinginkan?",
          },
        ],
      },
    },
    "Arsitektur Sistem, Cloud & Multiplatform": {
      "Rust Memory-Safe Systems & CLI Tool Builder": {
        description: "Arsitektur CLI dan tools sistem berkinerja tinggi dengan Rust (Tokio async, Clap CLI, Anyhow error handling, zero-cost abstractions).",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Principal Rust Systems Engineer & Compiler Specialist. Tulis kode Rust yang idiomatik, memory-safe, menangani ownership/borrowing dengan benar, dan menggunakan async Tokio.",
        components: [
          {
            name: "cliPurpose",
            label: "Tujuan Tool / CLI yang Dibangun",
            type: "text",
            placeholder: "contoh: Fast File Search & Log Analyzer CLI dengan multithreading",
            info: "Apa fungsi utama program sistem Rust ini?",
          },
          {
            name: "rustCrates",
            label: "Crates / Library yang Digunakan",
            type: "select",
            options: ["Tokio (Async Runtime) + Reqwest + Serde JSON", "Clap (CLI Argument Parser) + Colored + Indicatif (Progress Bar)", "Axum (High-Performance Web Framework) + SQLx (PostgreSQL)", "Rayon (Data Parallelism & Multithreading)", "Lainnya..."],
            info: "Pilih kombinasi crates Rust utama",
          },
        ],
      },
      "Supabase & Firebase Backend-as-a-Service (BaaS) Architect": {
        description: "Rancang skema database PostgreSQL, Row Level Security (RLS) policies, Edge Functions (Deno/TypeScript), dan realtime subscriptions di Supabase / Firebase.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Cloud BaaS Architect & Supabase Core Contributor. Rancang kebijakan RLS yang ketat (zero-trust), triggers database otomatis, dan arsitektur otentikasi aman.",
        components: [
          {
            name: "appDomain",
            label: "Domain Aplikasi & Model Data",
            type: "text",
            placeholder: "contoh: Multi-Tenant SaaS Workspace dengan Organisasi, Member, Dokumen, dan Billing",
            info: "Entitas dan aturan kepemilikan data antar pengguna",
          },
          {
            name: "baasPlatform",
            label: "Platform BaaS",
            type: "select",
            options: ["Supabase (PostgreSQL + RLS Policies + Edge Functions)", "Firebase (Firestore Security Rules + Cloud Functions + Auth)", "Appwrite (Serverless Backend + Database + Storage)", "Lainnya..."],
            info: "Pilih platform Backend-as-a-Service",
          },
        ],
      },
      "Prompt Engineering Automated Evaluator & LLM Judge": {
        description: "Skrip evaluasi kualitas output AI menggunakan model LLM Judge (G-Eval / Ragas) dengan metrik relevansi, halusinasi, dan format compliance.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah AI Evaluation Lead & MLOps Engineer. Rancang prompt evaluasi otomatis dengan rubric skor 1-5 dan alasan reasoning yang objektif.",
        components: [
          {
            name: "evalTask",
            label: "Tugas Output AI yang Dievaluasi",
            type: "text",
            placeholder: "contoh: Evaluasi ringkasan dokumen medis apakah mengandung halusinasi fakta klinis",
            info: "Apa jenis teks yang dihasilkan model AI yang perlu dinilai?",
          },
        ],
      },
      "Web Scraping & Headless Automation with Playwright": {
        description: "Skrip crawling dan ekstraksi data web tangguh dengan Playwright / Puppeteer (TypeScript/Python), penanganan anti-bot, pagination dinamis, dan export JSON.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Web Scraping & Data Extraction Specialist. Tulis skrip browser automation yang tangguh terhadap DOM dinamis dan rate limiting.",
        components: [
          {
            name: "targetWebsite",
            label: "Jenis Situs & Data yang Ingin Diekstrak",
            type: "text",
            placeholder: "contoh: Katalog Produk E-Commerce (Nama, Harga, Rating, Gambar, Deskripsi) dengan infinite scroll",
            info: "Sebutkan tipe website dan data spesifik yang dicari",
          },
        ],
      },
      "CI/CD GitHub Actions Pipeline & Release Specialist": {
        description: "Workflow otomatisasi GitHub Actions lengkap (Linting, Unit Testing, Docker Build, Semantic Versioning, dan Deploy otomatis ke Vercel/AWS).",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah CI/CD Automation Engineer. Buat pipeline YAML GitHub Actions yang cepat dengan caching dependensi dan secrets management aman.",
        components: [
          {
            name: "projectStack",
            label: "Stack Project & Target Deploy",
            type: "text",
            placeholder: "contoh: Next.js 15 Monorepo deploy ke Vercel Production saat push ke branch main",
            info: "Framework aplikasi dan server tujuan deployment",
          },
        ],
      },
      "iOS Swift 6 & SwiftUI Modern App Architect": {
        description: "Arsitektur aplikasi iOS native modern dengan Swift 6 Concurrency (async/await, Actor), declarative UI SwiftUI, dan arsitektur MVVM modular.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Senior iOS Staff Engineer. Rancang kode SwiftUI yang bersih, mendukung dark mode, dynamic type, dan offline caching SwiftData.",
        components: [
          {
            name: "iosFeature",
            label: "Fitur Aplikasi iOS yang Dibangun",
            type: "text",
            placeholder: "contoh: Dashboard Pelacak Kebugaran dengan grafik mingguan dan integrasi Apple HealthKit",
            info: "Fitur apa yang ingin dibuat dalam SwiftUI?",
          },
        ],
      },
      "Android Jetpack Compose & Kotlin Multiplatform Designer": {
        description: "Aplikasi Android native modern dengan Jetpack Compose, Kotlin Coroutines/Flow, Hilt Dependency Injection, dan arsitektur Clean Architecture.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Google Developer Expert (GDE) Android. Tulis kode Jetpack Compose yang reaktif, efisien, dan mengikuti Material 3 Design Guidelines.",
        components: [
          {
            name: "androidModule",
            label: "Modul / Layar Android yang Dibangun",
            type: "text",
            placeholder: "contoh: Halaman Detail Produk dengan animasi transisi hero dan rekomendasi produk terkait",
            info: "Tampilan atau fungsionalitas Android yang dibutuhkan",
          },
        ],
      },
      "Solidity Smart Contract & DeFi Security Auditor": {
        description: "Penulisan dan audit keamanan smart contract Solidity (ERC-20, ERC-721, Staking Vault, Reentrancy Guard) berbasis OpenZeppelin standar industri.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Lead Smart Contract Security Auditor. Tulis smart contract Solidity 0.8+ yang gas-optimized, aman dari serangan reentrancy dan front-running.",
        components: [
          {
            name: "contractPurpose",
            label: "Tujuan Smart Contract / Protokol",
            type: "text",
            placeholder: "contoh: Kontrak Token ERC-20 dengan fitur Staking Rewards harian dan lockup period",
            info: "Apa logika bisnis dan aturan tokenomik kontrak?",
          },
        ],
      },
      "OpenAPI 3.1 & Postman Spec Automated Generator": {
        description: "Generator dokumentasi API standar OpenAPI 3.1 (Swagger) dan Postman Collection lengkap dengan skema request, response 200/400/500, dan contoh payload.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Technical API Writer & OpenAPI Specialist. Hasilkan dokumen YAML OpenAPI 3.1 yang presisi dan siap diimpor ke Postman / Swagger UI.",
        components: [
          {
            name: "apiEndpoints",
            label: "Daftar Endpoint yang Didokumentasikan",
            type: "textarea",
            placeholder: "contoh: GET /api/v1/users, POST /api/v1/orders, GET /api/v1/orders/{id}, DELETE /api/v1/orders/{id}",
            info: "Rincian endpoint dan parameter yang perlu dibuatkan dokumen",
          },
        ],
      },
      "GraphQL Federation & Apollo Subgraph Architect": {
        description: "Desain skema GraphQL federated terdistribusi (Apollo Federation 2) dengan entity resolver, `@key`, `@shareable`, dan optimasi query.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah GraphQL Architect. Rancang schema SDL federated yang modular dan menghubungkan berbagai subgraph microservice secara harmonis.",
        components: [
          {
            name: "subgraphDomain",
            label: "Domain Subgraph & Entitas Bersama",
            type: "text",
            placeholder: "contoh: Users Subgraph dan Orders Subgraph yang terhubung melalui tipe User",
            info: "Entitas dan relasi yang dibagikan antarsubgraph",
          },
        ],
      },
    },
    "Data Science, Mobile & Arsitektur Lanjutan": {
      "Python Data Science & Pandas Analysis Pipeline": {
        description: "Pipeline analisis data terstruktur dengan Python (Pandas/Polars/NumPy), data cleaning otomatis, visualisasi Seaborn, dan ekstraksi insight statistik.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Lead Data Scientist & Machine Learning Engineer. Tulis skrip Python analisis data yang bersih, modular, menangani missing values, dan menghasilkan visualisasi informatif.",
        components: [
          {
            name: "datasetObjective",
            label: "Tujuan Analisis & Karakter Dataset",
            type: "text",
            placeholder: "contoh: Analisis Tren Penjualan & Churn Rate Pelanggan dari Data CSV E-Commerce 500.000 Transaksi",
            info: "Apa dataset yang dianalisis dan apa pertanyaan bisnis yang ingin dijawab?",
          },
          {
            name: "analysisLibraries",
            label: "Library & Visualisasi yang Digunakan",
            type: "select",
            options: ["Pandas + NumPy + Seaborn / Matplotlib (Klasik Terpercaya)", "Polars + Plotly (Ultra-Cepat & Grafik Interaktif)", "Scikit-Learn Pipeline (Pra-pemrosesan Data & Model Prediktif)", "Lainnya..."],
            info: "Pilih library Python yang diinginkan",
          },
          {
            name: "specificMetrics",
            label: "Metrik & Format Output yang Diharapkan",
            type: "textarea",
            placeholder: "contoh: Identifikasi top 10% pelanggan loyal (RFM Analysis), deteksi outliers transaksi, dan hitung korelasi antar variabel",
            info: "Metrik statistik dan grafik yang dibutuhkan",
          },
        ],
      },
      "Microservices Architecture & Event-Driven Designer": {
        description: "Rancang arsitektur sistem microservices berbasis event (Kafka/RabbitMQ), domain-driven design (DDD), database-per-service, dan resilient circuit breakers.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Enterprise Software Architect & Distributed Systems Specialist. Rancang diagram arsitektur, pola komunikasi asinkron, dan strategi konsistensi data (Saga Pattern).",
        components: [
          {
            name: "systemDomain",
            label: "Domain Sistem & Kebutuhan Skala",
            type: "text",
            placeholder: "contoh: Sistem Dompet Digital FinTech dengan 1 Juta Transaksi Harian (Order, Payment, Wallet, Notification Services)",
            info: "Jelaskan skala sistem dan layanan utama",
          },
          {
            name: "messagingBroker",
            label: "Message Broker & Event Bus",
            type: "select",
            options: ["Apache Kafka (Event Streaming & High-Throughput)", "RabbitMQ (AMQP Message Queuing)", "Redis Pub/Sub & Upstash (Lightweight Real-time)", "AWS SQS / SNS / EventBridge (Serverless Cloud)", "Lainnya..."],
            info: "Teknologi antrean pesan antarlayanan",
          },
        ],
      },
      "Flutter & Dart Cross-Platform Mobile Architect": {
        description: "Arsitektur aplikasi mobile Flutter 3+ dengan Clean Architecture, manajemen state BLoC / Riverpod, koneksi REST API, dan UI responsif iOS & Android.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Senior Mobile Flutter Architect. Buat struktur folder Clean Architecture (Data, Domain, Presentation), type-safe DTOs, dan widget UI modular.",
        components: [
          {
            name: "mobileAppName",
            label: "Nama Fitur / Modul Aplikasi Mobile",
            type: "text",
            placeholder: "contoh: Modul Katalog Produk & Keranjang Belanja dengan Pembayaran Midtrans",
            info: "Fitur mobile apa yang dibangun?",
          },
          {
            name: "statePattern",
            label: "Pola State Management",
            type: "select",
            options: ["Flutter BLoC / Cubit (Enterprise Standard)", "Riverpod 2.0 (Modern Reactive)", "Provider (Simple & Clean)", "GetX (Rapid Prototyping)", "Lainnya..."],
            info: "Pilih state management yang digunakan di project",
          },
        ],
      },
      "Git Commit Message & Semantic PR Generator": {
        description: "Generator pesan commit Git konvensional standar industri (feat, fix, refactor, chore) dan deskripsi Pull Request komprehensif.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Open Source Maintainer & Git Master. Konversi diff kode atau ringkasan perubahan menjadi catatan commit dan deskripsi PR yang informatif dan rapi.",
        components: [
          {
            name: "changesSummary",
            label: "Ringkasan Perubahan Kode yang Dilakukan",
            type: "textarea",
            placeholder: "contoh: Menambahkan endpoint POST /api/v1/auth/login dengan JWT token, memperbaiki bug crash saat password kosong, dan menambahkan unit test",
            info: "Jelaskan apa saja modifikasi file atau fitur yang Anda buat",
          },
          {
            name: "commitFormat",
            label: "Format & Standar Output",
            type: "select",
            options: ["Conventional Commits (feat(auth): add JWT token login endpoint)", "Full Pull Request Template (Summary, Changes, Breaking Changes, Checklist)", "Changelog Release Notes Format (Keep a Changelog)", "Lainnya..."],
            info: "Pilih format dokumen git yang diinginkan",
          },
        ],
      },
    },
    "DevOps, Cloud & Keamanan": {
      "Docker & Kubernetes Cloud-Native Architect": {
        description: "Generator konfigurasi Dockerfile multi-stage efisien, docker-compose, dan manifest Kubernetes (Deployment, Service, Ingress, HPA) siap produksi.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Principal DevOps & Cloud Infrastructure Architect. Buat konfigurasi container ringan, aman (non-root user), multi-stage build, dan scalable.",
        components: [
          {
            name: "appStack",
            label: "Aplikasi & Runtime Stack",
            type: "text",
            placeholder: "contoh: Node.js 20 Next.js App dengan PostgreSQL dan Redis Cache",
            info: "Bahasa, framework, dan dependensi database yang digunakan",
          },
          {
            name: "targetEnv",
            label: "Target Deployment & Orchestration",
            type: "select",
            options: ["Docker Compose Local Dev + Production Multi-Stage Dockerfile", "Kubernetes (K8s) Cluster Manifest (Deployment + Service + Ingress + ConfigMap)", "AWS ECS Fargate Task Definition + Terraform HCL", "Google Cloud Run Service YAML with Min/Max Instances", "Lainnya..."],
            info: "Platform container deployment yang dituju",
          },
          {
            name: "securityOptimization",
            label: "Persyaratan Keamanan & Resource",
            type: "textarea",
            placeholder: "contoh: Gunakan Alpine Linux image, non-root user 'appuser', healthcheck endpoint /api/health, CPU request 250m, memory limit 512Mi",
            info: "Aturan keamanan container dan batasan resource",
          },
        ],
      },
      "Cybersecurity Vulnerability & Code Audit (OWASP Top 10)": {
        description: "Audit keamanan kode mendalam untuk mendeteksi celah kerentanan OWASP Top 10 (SQLi, XSS, CSRF, IDOR, sensitive data leakage) dan solusi perbaikan instan.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Certified Ethical Hacker (CEH) & Application Security Lead. Identifikasi celah keamanan pada kode, jelaskan vektor serangan (PoC), dan berikan kode patch yang aman.",
        components: [
          {
            name: "codeToAudit",
            label: "Cuplikan Kode / Endpoint yang Diaudit",
            type: "textarea",
            placeholder: "contoh: Tempelkan kode autentikasi, controller SQL, atau penanganan file upload di sini...",
            info: "Kode sumber yang ingin diperiksa keamanannya",
          },
          {
            name: "threatFocus",
            label: "Fokus Audit Keamanan",
            type: "select",
            options: ["Pemeriksaan Menyeluruh OWASP Top 10 (Injeksi, Auth, IDOR, SSRF, XSS)", "Keamanan Autentikasi & Pengelolaan Token JWT / Sesi", "Validasi Input & Sanitasi Data (SQL Injection & NoSQLi)", "Pencegahan Kebocoran Data Sensitif & Secret API Keys", "Lainnya..."],
            info: "Area ancaman utama yang menjadi prioritas audit",
          },
        ],
      },
      "SQL Query Optimizer & Indexing Tuner": {
        description: "Analisis dan optimasi query SQL yang lambat, perancangan indeks komposit, eliminasi N+1 problem, dan perataan execution plan.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah High-Performance Database Administrator. Tinjau query SQL, rekomendasikan indeks terbaik (B-tree, GIN, Partial Index), dan tulis ulang query agar mengeksekusi dalam hitungan milidetik.",
        components: [
          {
            name: "slowQuery",
            label: "Query SQL Lambat / Rumit",
            type: "textarea",
            placeholder: "contoh: SELECT * FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'completed' ORDER BY o.created_at DESC LIMIT 50;",
            info: "Tempelkan query SQL yang ingin dioptimasi",
          },
          {
            name: "databaseEngine",
            label: "Mesin Database",
            type: "select",
            options: ["PostgreSQL 16+", "MySQL 8.0+ / MariaDB", "SQLite 3", "Oracle Database / SQL Server", "Lainnya..."],
            info: "Pilih jenis database yang digunakan",
          },
          {
            name: "tableVolume",
            label: "Perkiraan Volume Data Tabel",
            type: "select",
            options: ["Skala Kecil (< 100.000 baris)", "Skala Menengah (100.000 - 5 Juta baris)", "Skala Besar (10 Juta - 100 Juta+ baris)", "Lainnya..."],
            info: "Jumlah data untuk menentukan strategi indexing",
          },
        ],
      },
    },
    "Pengembangan Frontend & Web App": {
      "React 19 & Next.js 15 Component Architect": {
        description: "Generator komponen modern React 19 / Next.js 15 App Router lengkap dengan TypeScript, Tailwind CSS, accessibility (ARIA), dan clean code architecture.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Principal Frontend Engineer & Design System Specialist. Buat kode React modular, type-safe dengan TypeScript strict, responsif dengan Tailwind CSS, dan siap produksi.",
        components: [
          {
            name: "componentName",
            label: "Nama Komponen & Tujuan",
            type: "text",
            placeholder: "contoh: PricingTableWithMonthlyToggle atau AnalyticsDashboardCard",
            info: "Apa nama komponen dan apa fungsi utamanya?",
          },
          {
            name: "techStack",
            label: "Framework & Stack UI",
            type: "select",
            options: ["Next.js 15 App Router + Tailwind CSS + Lucide Icons", "React 19 + Vite + Tailwind CSS + Framer Motion", "React Native + Expo + NativeWind", "Vue 3 + Nuxt 3 + Tailwind CSS", "Svelte 5 / SvelteKit + Tailwind CSS", "Lainnya..."],
            info: "Pilih kombinasi framework frontend dan UI library",
          },
          {
            name: "keyFeatures",
            label: "Fitur Kunci & Interaktivitas",
            type: "textarea",
            placeholder: "contoh: Toggle bulanan/tahunan, badge diskon 20%, state loading skeleton, animasi hover halus, tombol CTA dengan variant primary & outline",
            info: "Sebutkan interaksi user, animasi, atau varian tampilan yang dibutuhkan",
          },
          {
            name: "stateManagement",
            label: "Manajemen State & Data Fetching",
            type: "select",
            options: ["Local State (useState / useReducer)", "React Server Components (RSC) + Server Actions", "TanStack Query (React Query) + Axios", "Zustand Global Store", "Mock Static Data (Props Only)", "Lainnya..."],
            info: "Bagaimana komponen ini mengelola state dan data?",
          },
        ],
      },
      "Full-Stack REST & GraphQL API Engine": {
        description: "Rancang endpoint API backend lengkap dengan validasi skema input (Zod/Pydantic), otentikasi JWT, penanganan error tersentralisasi, dan dokumentasi OpenAPI.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Senior Backend Architect & API Designer. Rancang arsitektur API yang aman, idempotent, teruji, dan mengikuti standar HTTP RESTful / GraphQL terkini.",
        components: [
          {
            name: "endpointPurpose",
            label: "Tujuan Endpoint / API",
            type: "text",
            placeholder: "contoh: Sistem Checkout E-Commerce & Pembuatan Invoice Midtrans",
            info: "Apa entitas bisnis dan aksi yang diproses endpoint ini?",
          },
          {
            name: "backendFramework",
            label: "Bahasa & Framework Backend",
            type: "select",
            options: ["Node.js (TypeScript) + Express / Fastify", "Next.js 15 API Route / Server Action", "Python + FastAPI + Pydantic v2", "Go (Golang) + Gin / Fiber", "PHP 8.3 + Laravel 11", "Java + Spring Boot 3", "Lainnya..."],
            info: "Pilih teknologi backend yang digunakan",
          },
          {
            name: "validationAuth",
            label: "Validasi Skema & Keamanan",
            type: "select",
            options: ["Zod Validation + JWT Bearer Token + Role-Based Access Control (RBAC)", "Pydantic Validation + OAuth2 with Password Bearer", "Public Endpoint dengan Rate Limiting (Upstash / Redis)", "API Key Header + Webhook HMAC Signature", "Lainnya..."],
            info: "Lapisan validasi dan otentikasi endpoint",
          },
          {
            name: "errorHandling",
            label: "Kebutuhan Respons & Error Handling",
            type: "textarea",
            placeholder: "contoh: Format respons JSON standar { success, data, error, timestamp }, status code 200/201/400/401/422/500, logging error ke console",
            info: "Struktur payload JSON dan mitigasi kegagalan",
          },
        ],
      },
    },
    "Arsitektur Basis Data & Backend": {
      "Prisma & PostgreSQL Database Schema Architect": {
        description: "Rancang skema basis data relasional optimal dengan indexing performa tinggi, relasi one-to-many & many-to-many, enums, dan script migrasi SQL.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Database Administrator & Principal Architect. Rancang skema database ternormalisasi (3NF), efisien, dan dilengkapi indeks pencarian.",
        components: [
          {
            name: "businessDomain",
            label: "Domain Bisnis & Model Entitas",
            type: "text",
            placeholder: "contoh: Platform Kursus Online (User, Course, Module, Lesson, Enrollment, Review, Payment)",
            info: "Sebutkan entitas utama aplikasi Anda",
          },
          {
            name: "ormEngine",
            label: "Database & ORM",
            type: "select",
            options: ["PostgreSQL + Prisma ORM (TypeScript)", "PostgreSQL + Drizzle ORM (TypeScript)", "MySQL / MariaDB + TypeORM", "PostgreSQL + SQLAlchemy 2.0 (Python)", "Raw SQL DDL (PostgreSQL Schema)", "MongoDB + Mongoose (NoSQL)", "Lainnya..."],
            info: "Pilih mesin database dan ORM",
          },
          {
            name: "specialRequirements",
            label: "Persyaratan Khusus & Indeks",
            type: "textarea",
            placeholder: "contoh: Soft delete (deletedAt), audit timestamps (createdAt, updatedAt), UUID primary key, indexing pada email dan slug, cascading delete pada modul",
            info: "Aturan integritas data, constraints, dan optimasi query",
          },
        ],
      },
      "Code Refactoring & Clean Code Reviewer": {
        description: "Audit kualitas kode, eliminasi code smell, optimasi SOLID & DRY, serta peningkatan efisiensi algoritma Big-O dari kode yang sudah ada.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah Staff Software Engineer & Clean Code Evangelist. Berikan tinjauan mendalam, identifikasi anti-pattern, dan tulis ulang kode agar elegan, modular, dan mudah di-maintain.",
        components: [
          {
            name: "codeSnippet",
            label: "Cuplikan Kode Asli yang Ingin Direfaktor",
            type: "textarea",
            placeholder: "contoh: Tempelkan fungsi JavaScript/Python/TypeScript yang terasa berantakan atau lambat di sini...",
            info: "Kode sumber yang perlu ditinjau dan diperbaiki",
          },
          {
            name: "refactorGoal",
            label: "Fokus Utama Refactoring",
            type: "select",
            options: ["Keterbacaan & Clean Code (Prinsip SOLID, DRY, KISS)", "Optimasi Performa & Kecepatan Eksekusi (Big-O)", "Migrasi ke TypeScript / Modern Syntax (ES2024)", "Pemisahan Tanggung Jawab (Modularisasi & Decoupling)", "Penanganan Error & Validasi Edge Cases", "Lainnya..."],
            info: "Apa prioritas utama perbaikan kode ini?",
          },
          {
            name: "constraints",
            label: "Batasan & Kompatibilitas",
            type: "text",
            placeholder: "contoh: Jangan ubah signature input/output fungsi, hindari dependensi eksternal baru",
            info: "Aturan yang harus dipertahankan saat refactor",
          },
        ],
      },
      "Unit & Integration Test Suite Builder": {
        description: "Buat rangkaian tes unit & integrasi komprehensif (Vitest/Jest/PyTest) mencakup skenario sukses (happy path), skenario kegagalan, dan edge cases ekstrem.",
        toolType: "code",
        ai_logic_description: "Persona AI: Anda adalah QA Automation Lead & Test-Driven Development (TDD) Expert. Tulis rangkaian tes otomatis yang mencakup 100% cabang logika (branch coverage).",
        components: [
          {
            name: "targetFunction",
            label: "Fungsi / Modul yang Akan Dites",
            type: "textarea",
            placeholder: "contoh: Fungsi calculateDiscount(cartItems, couponCode, userTier) yang menghitung total belanja dan memvalidasi voucher",
            info: "Deskripsikan atau tempelkan fungsi yang akan dibuatkan tes",
          },
          {
            name: "testFramework",
            label: "Test Framework & Runner",
            type: "select",
            options: ["Vitest / Jest + React Testing Library (TypeScript)", "PyTest + Unittest (Python)", "Go testing package + Testify", "PHPUnit / Pest (PHP Laravel)", "Playwright E2E Test", "Lainnya..."],
            info: "Pilih alat pengujian yang Anda gunakan",
          },
          {
            name: "coverageScope",
            label: "Cakupan Pengujian (Test Cases)",
            type: "textarea",
            placeholder: "contoh: 1. Happy path kupon valid, 2. Kupon kadaluarsa, 3. Kupon kuota habis, 4. Keranjang kosong, 5. Input null/undefined/negatif",
            info: "Sebutkan skenario spesifik yang wajib diuji",
          },
        ],
      },
    },
  },
  "Koleksi & Inovasi": {
    "Prinsip Kepemimpinan & Evaluasi Produk": {
      "Pareto Principle 80/20 High-Leverage Strategic Audit": {
        description: "Identifikasi 20% input, aktivitas, atau pelanggan yang menghasilkan 80% hasil dan keuntungan terbesar bagi bisnis Anda.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Pareto Principle Strategic Advisor.",
        components: [
          {
            name: "businessAreaAudit",
            label: "Area Bisnis yang Ingin Diaudit",
            type: "text",
            placeholder: "contoh: Alokasi Waktu Kerja Mingguan Tim Marketing dan Sumber Pendapatan Penjualan Produk",
            info: "Aktivitas atau lini bisnis apa yang ingin dianalisis secara 80/20?",
          },
        ],
      },
      "Regret Minimization Framework (Jeff Bezos Method)": {
        description: "Mengambil keputusan berani dalam hidup dan bisnis dengan memproyeksikan diri di usia 80 tahun untuk meminimalkan penyesalan masa tua.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Jeff Bezos Long-Term Decision Framework Coach.",
        components: [
          {
            name: "lifeDecisionDilemma",
            label: "Keputusan / Pilihan Hidup yang Dihadapi",
            type: "text",
            placeholder: "contoh: Apakah harus mengundurkan diri dari pekerjaan korporat yang stabil untuk membangun startup teknologi sendiri?",
            info: "Keputusan besar apa yang sedang Anda pertimbangkan?",
          },
        ],
      },
      "Eisenhower Matrix Priority & Time Mastery Engine": {
        description: "Pengelompokan tugas harian ke dalam 4 kuadran (Mendesak & Penting, Penting Tidak Mendesak, Delegasikan, Hapus) untuk menghentikan kebiasaan menunda.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Eisenhower Productivity & Executive Time Coach.",
        components: [
          {
            name: "taskListToFilter",
            label: "Daftar Tugas yang Menumpuk",
            type: "textarea",
            placeholder: "contoh: Balas 50 email, revisi proposal klien, olahraga, belajar coding, meeting evaluasi mingguan, belanja mingguan",
            info: "Tuliskan seluruh tugas yang membuat Anda kewalahan",
          },
        ],
      },
      "5 Whys Root Cause Investigation Matrix": {
        description: "Menelusuri akar masalah operasional paling mendasar dengan mengajukan pertanyaan 'Mengapa?' secara beruntun sebanyak 5 kali (Metode Toyota).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Toyota Production System (TPS) & Lean Root Cause Master.",
        components: [
          {
            name: "surfaceProblem",
            label: "Masalah di Permukaan yang Terjadi",
            type: "text",
            placeholder: "contoh: Pengiriman paket pesanan pelanggan terlambat 3 hari dari jadwal estimasi",
            info: "Gejala masalah apa yang pertama kali terlihat?",
          },
        ],
      },
      "Blue Ocean Strategy Strategy Canvas Competitor Mapping": {
        description: "Pemetaan visual kurva nilai kompetitor industri vs penawaran inovatif Anda pada 10 faktor persaingan utama.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Blue Ocean Strategy Canvas Facilitator.",
        components: [
          {
            name: "competingIndustry",
            label: "Industri & Nama Kompetitor Terbesar",
            type: "text",
            placeholder: "contoh: Industri Maskapai Penerbangan Berbiaya Rendah (LCC)",
            info: "Sektor bisnis apa yang sedang dipetakan kurva nilainya?",
          },
        ],
      },
      "SWOT & TOWS Matrix Strategic Action Plan": {
        description: "Analisis Kekuatan, Kelemahan, Peluang, dan Ancaman yang ditransformasikan menjadi strategi aksi nyata (Strategi SO, ST, WO, WT).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Corporate Strategic Planning Director.",
        components: [
          {
            name: "companyBusinessCase",
            label: "Kondisi Bisnis & Tantangan Saat Ini",
            type: "textarea",
            placeholder: "contoh: Toko retail fashion lokal yang kuat pada desain unik dan basis komunitas loyal, tetapi lemah pada inventaris digital dan modal iklan",
            info: "Jelaskan situasi internal dan eksternal perusahaan Anda",
          },
        ],
      },
      "Pre-Mortem Analysis & Project Failure Prevention": {
        description: "Simulasi proyek yang diasumsikan telah gagal total di masa depan untuk mendeteksi semua potensi risiko tersembunyi sebelum terlambat.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Gary Klein Pre-Mortem Risk Strategist.",
        components: [
          {
            name: "projectLaunchPlan",
            label: "Proyek Besar yang Akan Dijalankan",
            type: "text",
            placeholder: "contoh: Migrasi seluruh sistem database perbankan ke cloud infrastructure dalam waktu 6 bulan",
            info: "Proyek apa yang sedang disiapkan?",
          },
        ],
      },
      "Growth Flywheel Engine (Jim Collins Virtuous Cycle)": {
        description: "Merancang roda gila pertumbuhan bisnis yang saling mempercepat momentum secara mandiri (Gaya Amazon / Uber / Netflix Flywheel).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Jim Collins 'Good to Great' Flywheel Strategist.",
        components: [
          {
            name: "coreValuePillar",
            label: "Pilar Nilai Utama Pelanggan",
            type: "text",
            placeholder: "contoh: Harga murah -> Pengalaman belanja menyenangkan -> Lebih banyak pembeli -> Lebih banyak penjual -> Skala ekonomi lebih efisien",
            info: "Apa keunggulan yang memicu siklus pertumbuhan bisnis Anda?",
          },
        ],
      },
      "OKRs (Objectives and Key Results) Alignment Blueprint": {
        description: "Perumusan sasaran ambisius (Objectives) dan 3-5 hasil kunci terukur (Key Results) untuk tim dan perusahaan (Gaya Google OKRs).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah John Doerr 'Measure What Matters' OKR Specialist.",
        components: [
          {
            name: "strategicAmbition",
            label: "Sasaran Ambisius Kuartal Ini (Objective)",
            type: "text",
            placeholder: "contoh: Menjadi aplikasi pengatur keuangan nomor 1 paling tepercaya bagi generasi muda di Indonesia",
            info: "Tujuan kualitatif besar apa yang ingin dicapai tim?",
          },
        ],
      },
      "Value Proposition Canvas (VPC) Customer Fit Matrix": {
        description: "Menyelaraskan profil pelanggan (Pains, Gains, Jobs) dengan penawaran produk Anda (Pain Relievers, Gain Creators) untuk mencapai Product-Market Fit.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Strategyzer Alexander Osterwalder VPC Facilitator.",
        components: [
          {
            name: "customerSegment",
            label: "Segmen Pelanggan & Produk",
            type: "text",
            placeholder: "contoh: Software akuntansi otomatis untuk pemilik restoran dan cafe skala kecil",
            info: "Siapa pembelinya dan produk apa yang Anda jual?",
          },
        ],
      },
      "MoSCoW Feature Prioritization for Agile Development": {
        description: "Pengelompokan fitur proyek perangkat lunak (Must-Have, Should-Have, Could-Have, Won't-Have) untuk mengamankan tenggat waktu rilis MVP.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Agile Product Owner & Scrum Master.",
        components: [
          {
            name: "mvpReleaseGoal",
            label: "Target Rilis MVP & Kumpulan Fitur",
            type: "textarea",
            placeholder: "contoh: Peluncuran aplikasi booking dokter online: Registrasi user, jadwal dokter, pembayaran instan, chat konsultasi, notifikasi SMS, resep obat digital",
            info: "Fitur apa saja yang ingin diklasifikasikan prioritasnya?",
          },
        ],
      },
      "Hook Model (Nir Eyal) Habit-Forming Product Design": {
        description: "Merancang produk yang menciptakan kebiasaan pengguna setia lewat 4 fase: Pemicu (Trigger) -> Tindakan (Action) -> Hadiah Variabel (Reward) -> Investasi.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Nir Eyal 'Hooked' Product Designer.",
        components: [
          {
            name: "habitProduct",
            label: "Aplikasi / Produk yang Dibangun",
            type: "text",
            placeholder: "contoh: Aplikasi Pelacak Kebiasaan Olahraga & Minum Air Putih Harian",
            info: "Kebiasaan positif apa yang ingin Anda tanamkan pada pengguna?",
          },
        ],
      },
    },
    "Model Mental & Keputusan Strategis": {
      "Inversion Thinking (Charlie Munger Anti-Goal Strategy)": {
        description: "Membalikkan cara berpikir: 'Bagaimana cara pasti untuk gagal total dalam proyek ini?' lalu susun strategi pencegahannya secara sistematis.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Charlie Munger Mental Model Advisor. Bimbing pengguna membedah skenario terburuk agar jalan menuju sukses menjadi jelas dan aman.",
        components: [
          {
            name: "strategicGoal",
            label: "Tujuan Besar yang Ingin Dicapai",
            type: "text",
            placeholder: "contoh: Meluncurkan produk aplikasi baru dan mencapai 10.000 pengguna aktif tanpa kehabisan dana operasional",
            info: "Apa target sukses yang ingin diraih?",
          },
        ],
      },
      "Kano Model Customer Delight & Feature Prioritization": {
        description: "Pemetaan fitur produk ke dalam 5 kategori Kano (Must-be, One-dimensional, Attractive, Indifferent, Reverse) untuk memenangkan hati pelanggan.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Chief Product Officer & Kano Methodology Expert.",
        components: [
          {
            name: "productFeaturesList",
            label: "Daftar Fitur yang Ingin Diprioritaskan",
            type: "textarea",
            placeholder: "contoh: 1. Login sidik jari, 2. Dark mode, 3. Ekspor laporan PDF, 4. Integrasi WhatsApp otomatis, 5. Notifikasi promo harian",
            info: "Fitur-fitur yang sedang dipertimbangkan untuk dikembangkan",
          },
        ],
      },
      "Cynefin Framework Complexity & Decision Making Matrix": {
        description: "Analisis domain situasi masalah (Simple, Complicated, Complex, Chaotic, Disorder) untuk memilih strategi tindakan kepemimpinan terbaik.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Dave Snowden Cynefin Framework Consultant.",
        components: [
          {
            name: "problemScenario",
            label: "Skenario Masalah yang Dihadapi",
            type: "textarea",
            placeholder: "contoh: Perusahaan mengalami lonjakan komplain pelanggan secara mendadak setelah integrasi sistem pembayaran pihak ketiga",
            info: "Jelaskan situasi atau tantangan manajemen yang terjadi",
          },
        ],
      },
      "Jobs-to-be-Done (JTBD) Customer Motivation Canvas": {
        description: "Identifikasi tugas fungsional, emosional, dan sosial yang sebenarnya ingin diselesaikan pembeli saat 'menyewa' produk Anda.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Clayton Christensen JTBD Pioneer.",
        components: [
          {
            name: "customerJob",
            label: "Produk & Siapa Penggunanya",
            type: "text",
            placeholder: "contoh: Botol air minum stainless steel berinsulasi untuk pekerja kantoran",
            info: "Apa produk yang dibeli dan siapa pembelinya?",
          },
        ],
      },
      "Second-Order Thinking & Unintended Consequences Analyzer": {
        description: "Menganalisis dampak jangka panjang dari sebuah keputusan: 'Dan setelah itu, lalu apa akibat tak terduga yang akan timbul?'.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Howard Marks Second-Order Strategic Thinker.",
        components: [
          {
            name: "proposedDecision",
            label: "Keputusan yang Sedang Direncanakan",
            type: "text",
            placeholder: "contoh: Memberikan diskon 50% permanen untuk semua pengguna baru selama 6 bulan ke depan",
            info: "Kebijakan atau keputusan apa yang ingin diambil?",
          },
        ],
      },
      "Blue Ocean Strategy Non-Customer 3-Tier Exploration": {
        description: "Analisis 3 tingkatan non-pelanggan (Soon-to-be, Refusing, Unexplored) untuk melipatgandakan ukuran pasar di luar batas industri saat ini.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah W. Chan Kim Blue Ocean Strategist.",
        components: [
          {
            name: "businessIndustry",
            label: "Industri Bisnis Saat Ini",
            type: "text",
            placeholder: "contoh: Aplikasi Pembelajaran Bahasa Asing Online",
            info: "Apa bidang usaha Anda?",
          },
        ],
      },
    },
    "Framework Kreativitas & Agile Sprint": {
      "SCAMPER Product Evolution Matrix": {
        description: "Eksplorasi 7 sudut modifikasi produk (Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse) untuk melahirkan produk baru.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah SCAMPER Innovation Facilitator. Bimbing pengguna mengeksplorasi 7 lensa SCAMPER secara terstruktur guna menemukan diferensiasi produk.",
        components: [
          {
            name: "targetProduct",
            label: "Produk / Layanan yang Ingin Dimodifikasi",
            type: "text",
            placeholder: "contoh: Kursi kantor ergonomis tradisional",
            info: "Objek produk apa yang ingin dikembangkan inovasinya?",
          },
        ],
      },
      "Design Thinking 5-Stage Innovation Sprint": {
        description: "Panduan langkah-demi-langkah 5 tahap Design Thinking (Empathize, Define, Ideate, Prototype, Test) untuk memecahkan masalah pengguna secara human-centric.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Lead Design Thinking Facilitator (Stanford d.school certified). Pandu pengguna memahami kebutuhan user sejati dan merancang prototipe solusi tervalidasi.",
        components: [
          {
            name: "userChallenge",
            label: "Tantangan Pengguna yang Dihadapi",
            type: "textarea",
            placeholder: "contoh: Lansia sering kesulitan mengingat jadwal minum obat yang rumit dan merasa cemas jika sendirian di rumah",
            info: "Siapa penggunanya dan apa masalah emosional/praktis yang mereka alami?",
          },
        ],
      },
    },
    "Metodologi Inovasi Sistematis": {
      "TRIZ 40 Inventive Principles Problem Solver": {
        description: "Pemecahan kontradiksi teknis dan inovasi produk menggunakan 40 prinsip inventif sistematis Genrich Altshuller.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah TRIZ Master & Systematic Innovation Consultant. Identifikasi kontradiksi utama dalam masalah dan terapkan prinsip TRIZ yang paling relevan untuk menemukan solusi non-kompromi.",
        components: [
          {
            name: "systemContradiction",
            label: "Kontradiksi Utama Masalah",
            type: "textarea",
            placeholder: "contoh: Jika baterai smartphone diperbesar maka daya tahannya lama, tetapi bobot dan ketebalan ponsel menjadi terlalu berat dan tebal",
            info: "Apa parameter yang jika ditingkatkan justru merusak parameter lainnya?",
          },
          {
            name: "desiredOutcome",
            label: "Hasil Ideal Akhir (Ideal Final Result)",
            type: "text",
            placeholder: "contoh: Ponsel tetap super tipis dan ringan, namun mampu bertahan 3 hari tanpa dicas",
            info: "Kondisi ideal sempurna yang diinginkan",
          },
        ],
      },
      "Blue Ocean Strategy 4-Action Framework (ERRC)": {
        description: "Kurva nilai inovasi bisnis (Eliminate, Reduce, Raise, Create) untuk keluar dari perang harga 'samudra merah' menuju pasar baru tanpa pesaing.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Blue Ocean Strategy Advisor. Bantu pengguna merekonstruksi batasan industri menggunakan Kanvas Strategi 4 Aksi (Hapuskan, Kurangi, Tingkatkan, Ciptakan).",
        components: [
          {
            name: "industryCompetitors",
            label: "Industri & Pola Persaingan Saat Ini",
            type: "text",
            placeholder: "contoh: Industri Kedai Kopi Kekinian yang bersaing ketat pada diskon harga dan varian sirup manis",
            info: "Apa bisnis Anda dan apa yang biasa dilakukan semua kompetitor?",
          },
          {
            name: "nonCustomers",
            label: "Kelompok Bukan-Pelanggan (Non-Customers)",
            type: "text",
            placeholder: "contoh: Orang tua dan pekerja kantoran yang mencari ruang tenang tanpa bising untuk meeting profesional",
            info: "Siapa kelompok orang yang saat ini menolak membeli dari industri Anda?",
          },
        ],
      },
    },
    "Metodologi Berpikir Kritis & Inovasi": {
      "First Principles Thinking (Elon Musk Reasoning)": {
        description: "Dekonstruksi masalah kompleks hingga ke kebenaran paling mendasar (first principles) dan bangun solusi terobosan baru tanpa terjebak bias tradisi.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah First Principles Thinker & Systems Architect. Hancurkan semua asumsi umum dan analogi masa lalu, analisis komponen dasar, dan bangun solusi baru dari nol.",
        components: [
          {
            name: "complexProblem",
            label: "Masalah Kompleks yang Ingin Dipecahkan",
            type: "textarea",
            placeholder: "contoh: Biaya produksi baterai kendaraan listrik terlalu mahal sehingga harga mobil listrik sulit dijangkau masyarakat luas",
            info: "Apa tantangan atau masalah yang selama ini dianggap sulit atau mahal?",
          },
          {
            name: "currentAssumptions",
            label: "Asumsi / Kebiasaan Konvensional yang Ada",
            type: "textarea",
            placeholder: "contoh: Orang percaya baterai mahal karena harus beli dari pabrik perakit besar dengan harga pasar $600/kWh",
            info: "Apa yang dikatakan 'orang kebanyakan' atau standar industri saat ini?",
          },
          {
            name: "fundamentalTruths",
            label: "Bahan Dasar / Fakta Paling Mendasar",
            type: "text",
            placeholder: "contoh: Bahan kimia penyusun baterai di pasar komoditas hanya nikel, kobalt, tembaga, dan lithium senilai $80/kWh",
            info: "Fakta mentah fisika/materiil apa yang tidak bisa dibantah?",
          },
        ],
      },
      "Six Thinking Hats (Edward de Bono) Decision Matrix": {
        description: "Analisis keputusan strategis dari 6 sudut pandang paralel (Putih: Fakta, Merah: Emosi, Hitam: Risiko, Kuning: Peluang, Hijau: Kreativitas, Biru: Kontrol).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Edward de Bono Thinking Facilitator. Pandu pengguna mengevaluasi ide melalui 6 topi berpikir terpisah agar keputusan bulat dan matang.",
        components: [
          {
            name: "decisionToMake",
            label: "Keputusan / Proyek yang Dievaluasi",
            type: "text",
            placeholder: "contoh: Apakah perusahaan kami harus beralih 100% ke model kerja remote (WFA) permanen?",
            info: "Apa keputusan besar yang sedang dipertimbangkan?",
          },
          {
            name: "relevantContext",
            label: "Konteks & Latar Belakang Situasi",
            type: "textarea",
            placeholder: "contoh: Saat ini sewa kantor menghabiskan 20% biaya operasional, namun beberapa manajer khawatir produktivitas tim menurun",
            info: "Informasi pendukung seputar opsi yang tersedia",
          },
        ],
      },
    },
    "Metodologi Inovasi & Brainstorming": {
      "Brainstorming Ide Bisnis Modal Kecil (Side Hustle)": {
        description: "Temukan 5 ide bisnis sampingan realistis berdasarkan keahlian pribadi, modal yang dimiliki, dan tren pasar tanpa meninggalkan pekerjaan utama.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Startup Mentor & Business Incubator. AI memetakan potensi keahlian pengguna dan menghasilkan 5 ide usaha sampingan tervalidasi dengan rincian cara mulai dan modal minim.",
        components: [
          {
            name: "personalSkills",
            label: "Keahlian / Hobi / Minat Pribadi",
            type: "text",
            placeholder: "e.g., 'Bisa edit video Canva, hobi bikin kue, suka nulis artikel'",
            info: "Apa saja hal yang Anda kuasai atau sukai?",
          },
          {
            name: "availableCapital",
            label: "Modal Awal yang Tersedia",
            type: "select",
            options: ["Modal Rp 0 (Hanya Mengandalkan HP & Kuota)", "Modal Kecil Rp 500 Ribu - Rp 2 Juta", "Modal Menengah Rp 2 Juta - Rp 5 Juta"],
            info: "Pilih batas anggaran dana awal Anda.",
          },
          {
            name: "dailySpareTime",
            label: "Waktu Luang Harian untuk Bisnis",
            type: "select",
            options: ["1 - 2 Jam per Hari (Malam Hari)", "3 - 4 Jam per Hari", "Hanya di Akhir Pekan (Sabtu & Minggu)"],
            info: "Ketersediaan waktu Anda di luar pekerjaan utama.",
          },
        ],
        id_kerangka: "FW-BRAINST",
        nama_kerangka: "Brainstorming Ide Bisnis Modal Kecil (Side Hustle)",
        version: "2.0",
        kategori: ["Koleksi & Inovasi", "Metodologi Inovasi & Brainstorming"],
        perspektif_user: "Pengguna ingin meracik prompt Brainstorming Ide Bisnis Modal Kecil (Side Hustle) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Startup Mentor & Business Incubator. AI memetakan potensi keahlian pengguna dan menghasilkan 5 ide usaha sampingan tervalidasi dengan rincian cara mulai dan modal minim.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Startup Mentor & Business Incubator. AI memetakan potensi keahlian pengguna dan menghasilkan 5 ide usaha sampingan tervalidasi dengan rincian cara mulai dan modal minim.",
          KONTEKS: "Temukan 5 ide bisnis sampingan realistis berdasarkan keahlian pribadi, modal yang dimiliki, dan tren pasar tanpa meninggalkan pekerjaan utama.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "personalSkills": {
                        "name": "personalSkills",
                        "label": "Keahlian / Hobi / Minat Pribadi",
                        "type": "text",
                        "placeholder": "e.g., 'Bisa edit video Canva, hobi bikin kue, suka nulis artikel'",
                        "options": [],
                        "info": "Apa saja hal yang Anda kuasai atau sukai?"
            },
            "availableCapital": {
                        "name": "availableCapital",
                        "label": "Modal Awal yang Tersedia",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Modal Rp 0 (Hanya Mengandalkan HP & Kuota)",
                                    "Modal Kecil Rp 500 Ribu - Rp 2 Juta",
                                    "Modal Menengah Rp 2 Juta - Rp 5 Juta"
                        ],
                        "info": "Pilih batas anggaran dana awal Anda."
            },
            "dailySpareTime": {
                        "name": "dailySpareTime",
                        "label": "Waktu Luang Harian untuk Bisnis",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "1 - 2 Jam per Hari (Malam Hari)",
                                    "3 - 4 Jam per Hari",
                                    "Hanya di Akhir Pekan (Sabtu & Minggu)"
                        ],
                        "info": "Ketersediaan waktu Anda di luar pekerjaan utama."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Brainstorming Ide Bisnis Modal Kecil (Side Hustle).",
        output: "natural_language_prompt"
      },
      "SCAMPER Method (Inovasi Produk & Ide Kreatif)": {
        description:
          "Metodologi inovasi terstruktur untuk membedah dan mengembangkan produk, layanan, atau ide melalui 7 lensa kreatif.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah Konsultan Inovasi & Kreativitas Produk. AI memandu pengguna mengaplikasikan lensa SCAMPER secara sistematis untuk melahirkan inovasi terobosan.",
        components: [
          {
            name: "subjectOrProduct",
            label: "Produk / Layanan / Topik yang Diinovasi",
            type: "text",
            placeholder: "e.g., 'Aplikasi pencatat keuangan pribadi untuk Gen Z'",
            info: "Tentukan subjek atau produk yang ingin dieksplorasi inovasinya.",
          },
          {
            name: "focusLens",
            label: "Fokus Lensa SCAMPER Utama",
            type: "select",
            options: [
              "Semua 7 Lensa (Lengkap)",
              "Substitute (Mengganti Komponen/Bahan)",
              "Combine (Menggabungkan dengan Produk Lain)",
              "Adapt (Mengadaptasi dari Industri Lain)",
              "Modify / Magnify / Minify (Mengubah Skala/Bentuk)",
              "Put to Another Use (Pemanfaatan Baru)",
              "Eliminate (Menghilangkan Hambatan/Fitur)",
              "Reverse / Rearrange (Membalik Urutan/Struktur)",
              "Lainnya...",
            ],
            info: "Pilih lensa SCAMPER spesifik atau eksplorasi ketujuhnya sekaligus.",
          },
          {
            name: "currentPainPoints",
            label: "Masalah / Kelemahan Saat Ini",
            type: "textarea",
            placeholder:
              "e.g., 'Pengguna sering malas mencatat transaksi harian manual dan antarmuka terlalu rumit.'",
            info: "Jelaskan batasan atau komplain yang dihadapi pengguna saat ini.",
          },
          {
            name: "targetOutcome",
            label: "Target Dampak Inovasi",
            type: "text",
            placeholder:
              "e.g., 'Meningkatkan retensi harian dan viralitas organik'",
            info: "Tujuan akhir dari terobosan inovasi yang diharapkan.",
          },
        ],
      },
      "Blue Ocean Strategy (Skema 4 Tindakan ERRC)": {
        description:
          "Rancang strategi bisnis Blue Ocean untuk membuka ruang pasar baru bebas persaingan dengan matriks Eliminate-Reduce-Raise-Create.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah Ahli Strategi Bisnis Blue Ocean. AI akan menganalisis industri target dan memetakan kurva nilai baru yang mendobrak trade-off biaya dan nilai.",
        components: [
          {
            name: "industryAndProduct",
            label: "Industri & Produk Target",
            type: "text",
            placeholder: "e.g., 'Industri kursus online bahasa asing'",
            info: "Sebutkan industri dan segmen pasar yang ingin didobrak.",
          },
          {
            name: "currentIndustryStandard",
            label: "Standar Industri Konvensional (Red Ocean)",
            type: "textarea",
            placeholder:
              "e.g., 'Harga mahal, jadwal kaku, materi berbasis teks hafalan, fokus sertifikasi formal.'",
            info: "Apa yang biasa ditawarkan oleh kompetitor tradisional saat ini?",
          },
          {
            name: "eliminateFactors",
            label: "Faktor yang Dihilangkan (Eliminate)",
            type: "text",
            placeholder:
              "e.g., 'Ujian formal tertulis, tugas rumah tangga manual'",
            info: "Faktor apa yang selama ini dianggap baku namun sebenarnya membebani konsumen?",
          },
          {
            name: "createFactors",
            label: "Faktor Baru yang Diciptakan (Create)",
            type: "text",
            placeholder:
              "e.g., 'Simulasi roleplay AI interaktif dengan umpan balik suara real-time'",
            info: "Nilai baru apa yang belum pernah ada di industri ini?",
          },
        ],
      },
      "Design Thinking (5 Tahap Solusi Human-Centered)": {
        description:
          "Kerangka kerja pemecahan masalah berpusat pada empati pengguna: Empathize, Define, Ideate, Prototype, dan Test.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah Design Thinking Facilitator. AI memandu perancangan solusi dari sudut pandang pengalaman dan emosi manusia terdalam.",
        components: [
          {
            name: "userPersona",
            label: "Profil & Persona Pengguna",
            type: "text",
            placeholder:
              "e.g., 'Ibu bekerja dengan 2 anak balita yang belanja kebutuhan mingguan secara online'",
            info: "Siapa pengguna spesifik yang ingin dibantu?",
          },
          {
            name: "coreFrustration",
            label: "Frustrasi & Kebutuhan Emosional Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Kerap kehabisan stok barang segar dan proses pengiriman sering terlambat dari jadwal masak.'",
            info: "Apa rasa sakit (pain points) terdalam pengguna?",
          },
          {
            name: "howMightWe",
            label: "Pernyataan Tantangan (How Might We...)",
            type: "text",
            placeholder:
              "e.g., 'Bagaimana kita bisa memastikan bahan segar sampai tepat 1 jam sebelum waktu memasak?'",
            info: "Rumusan pertanyaan pemicu ide kreatif.",
          },
        ],
      },
    },
    "Arsitektur Prompt Multi-Agent & Sistem Mandiri": {
      "Multi-Agent Orchestration (Manager, Researcher, Coder, Critic)": {
        description:
          "Rancang tim agen AI kolaboratif otonom dengan pembagian peran, protokol komunikasi, dan mekanisme verifikasi mandiri (Self-Refinement).",
        toolType: "code",
        ai_logic_description:
          "Persona AI: Anda adalah AI Systems Architect. AI menyusun arsitektur sistem multi-agen yang tangguh untuk tugas-tugas skala enterprise.",
        components: [
          {
            name: "projectObjective",
            label: "Tujuan Utama Proyek Multi-Agen",
            type: "textarea",
            placeholder:
              "e.g., 'Menganalisis tren pasar finansial harian, mengunduh data sentimen, menulis ringkasan laporan, dan memvalidasi kebenaran data faktual.'",
            info: "Apa tugas komprehensif yang harus diselesaikan oleh tim agen?",
          },
          {
            name: "agentsRoster",
            label: "Daftar Agen & Tanggung Jawab",
            type: "textarea",
            placeholder:
              "e.g., '1. Agent Orchestrator (Manager), 2. Agent Research (Pencari Data), 3. Agent Synthesis (Penulis Draf), 4. Agent Fact-Checker (Kritikus & Verifikator)'",
            info: "Tentukan peran spesifik setiap agen AI dalam alur kerja.",
          },
          {
            name: "decisionProtocol",
            label: "Protokol Keputusan & Batas Iterasi",
            type: "text",
            placeholder:
              "e.g., 'Maksimal 3 iterasi revisi. Laporan hanya disetujui jika Fact-Checker memberi skor 90%+'",
            info: "Aturan kapan tugas dianggap selesai dan mekanisme validasi.",
          },
        ],
      },
      "ReAct Framework (Reasoning + Acting Workflow)": {
        description:
          "Pola prompt ReAct yang menggabungkan siklus penalaran (Thought), tindakan pemanggilan alat (Action), dan observasi hasil (Observation).",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah ReAct Agent Specialist. AI menstrukturkan instruksi agar model AI berpikir transparan sebelum mengeksekusi aksi nyata.",
        components: [
          {
            name: "taskDirective",
            label: "Instruksi Tugas Kompleks",
            type: "textarea",
            placeholder:
              "e.g., 'Cari data cuaca terkini di Tokyo, hitung perbedaan suhu dengan Jakarta, dan rekomendasikan pakaian yang cocok.'",
            info: "Tugas multi-langkah yang memerlukan interaksi alat eksternal.",
          },
          {
            name: "availableTools",
            label: "Daftar Alat / API yang Tersedia",
            type: "textarea",
            placeholder:
              "e.g., '1. SearchEngine(query), 2. WeatherAPI(city), 3. Calculator(expression)'",
            info: "Fungsi atau alat yang diizinkan untuk dipanggil oleh AI.",
          },
          {
            name: "stoppingCondition",
            label: "Kondisi Berhenti / Jawaban Akhir",
            type: "text",
            placeholder:
              "e.g., 'Kembalikan format Final Answer: [Rekomendasi Lengkap]'",
            info: "Format penutup saat seluruh siklus Thought-Action-Observation selesai.",
          },
        ],
      },
    },
    "Ekstraksi & Kloning Formula Master": {
      "Reverse Prompt Engineering (Ekstraktor DNA Prompt)": {
        description:
          "Bongkar hasil karya teks, kode, atau visual AI yang luar biasa untuk mengekstrak struktur prompt, parameter, dan formula aslinya.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah Reverse Prompt Engineer Forensik. AI akan membedah artefak keluaran untuk merekonstruksi formula input presisi tinggi.",
        components: [
          {
            name: "artifactType",
            label: "Jenis Artefak Target",
            type: "select",
            options: [
              "Teks / Copywriting Berkelas",
              "Gambar Fotorealistik / Seni AI",
              "Video Sinematik AI",
              "Arsitektur Kode / Algoritma",
              "Lainnya...",
            ],
            info: "Modalitas keluaran yang ingin dibedah formula asalnya.",
          },
          {
            name: "sampleOutput",
            label: "Contoh Output yang Ingin Dibongkar",
            type: "textarea",
            placeholder:
              "e.g., Masukkan teks artikel atau deskripsikan detail visual gambar yang ingin diekstrak prompt-nya...",
            info: "Tempelkan teks atau berikan detail artefak yang ingin ditiru formulanya.",
          },
          {
            name: "desiredExtractionDepth",
            label: "Tingkat Kedalaman Analisis",
            type: "select",
            options: [
              "Formula Prompt Siap Pakai",
              "Analisis Parameter & Gaya (Style Breakdown)",
              "Template Variabel Dinamis (Reusable Template)",
              "Lainnya...",
            ],
            info: "Pilih format hasil rekonstruksi yang Anda butuhkan.",
          },
        ],
      },
    },
  },
  "Teks & Konten": {
    "Pemasaran Amazon, Siaran Pers & Konten Berita": {
      "High-Converting Amazon A+ Content Blueprint": {
        description: "Naskah konten A+ visual dan bullet points produk marketplace yang meningkatkan konversi penjualan 2x lipat.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Amazon Top-Seller Copywriter & Listing Optimizer.",
        components: [
          {
            name: "amazonProductDetails",
            label: "Nama Produk Marketplace & 3 Keunggulan",
            type: "text",
            placeholder: "contoh: Pisau Dapur Chef Stainless Steel Damaskus - Sangat Tajam, Gagang Kayu Ergonomis, Anti Karat",
            info: "Produk apa yang dibuatkan halaman A+ Content?",
          },
        ],
      },
      "Case Study Storytelling (Problem - Solution - Results)": {
        description: "Artikel studi kasus keberhasilan klien yang dipublikasikan di blog perusahaan untuk mendatangkan prospek B2B berkualitas tinggi.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah B2B Case Study Copywriter.",
        components: [
          {
            name: "caseStudyClient",
            label: "Nama Klien & Nilai Masalah yang Diselesaikan",
            type: "text",
            placeholder: "contoh: Startup Logistik yang Menghemat Rp 500 Juta per Tahun Berkat Otomasi Rute Kami",
            info: "Siapa klien yang dijadikan cerita sukses?",
          },
        ],
      },
      "Thought-Provoking Newsletter Opening & Monologue": {
        description: "Paragraf pembuka newsletter mingguan yang personal, bercerita, dan menggiring pembaca ke inti topik utama tanpa merasa digurui.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah High-Open-Rate Newsletter Writer (Gaya Morning Brew / Tim Ferriss).",
        components: [
          {
            name: "newsletterTheme",
            label: "Topik Utama Newsletter Minggu Ini",
            type: "text",
            placeholder: "contoh: Mengapa Kita Sering Merasa Sibuk Tetapi Tidak Menghasilkan Apa-apa?",
            info: "Topik apa yang dibahas dalam edisi newsletter ini?",
          },
        ],
      },
      "Viral Carousel Slide-by-Slide Blueprint": {
        description: "Panduan penulisan naskah komidi putar (Carousel) 8-10 slide di Instagram & LinkedIn dengan visual cue dan hook kuat.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Viral Carousel Strategist.",
        components: [
          {
            name: "carouselTopic",
            label: "Topik Edukasi Carousel",
            type: "text",
            placeholder: "contoh: 7 Trik Psikologi Harga yang Bikin Pembeli Langsung Transfer Tanpa Nawar",
            info: "Materi apa yang ingin dibuatkan slide-by-slide?",
          },
        ],
      },
      "Persuasive Donation Letter & Charity Appeal Campaign": {
        description: "Naskah surat permohonan donasi kemanusiaan yang menyentuh emosi pembaca dengan transparansi penyaluran dana.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Non-Profit Fundraising Copywriter.",
        components: [
          {
            name: "charityProgram",
            label: "Program Bantuan Donasi",
            type: "text",
            placeholder: "contoh: Bantuan Beasiswa Pendidikan dan Paket Buku untuk 100 Anak Yatim Piatu",
            info: "Program sosial apa yang mengajak masyarakat berdonasi?",
          },
        ],
      },
      "Press Release & Media Distribution Announcement": {
        description: "Naskah siaran pers resmi standar AP Style untuk peluncuran produk baru, pendanaan, atau kerjasama strategis korporat.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Public Relations & Media Relations Director.",
        components: [
          {
            name: "pressReleaseEvent",
            label: "Peristiwa / Pengumuman Resmi",
            type: "text",
            placeholder: "contoh: Perusahaan Solusi AI Meraih Pendanaan Tahap A Sebesar $5 Juta untuk Ekspansi ke Asia Tenggara",
            info: "Berita penting apa yang disampaikan kepada wartawan?",
          },
        ],
      },
      "Professional Bio & Speaker Profile (Short, Medium, Long)": {
        description: "Tiga versi biografi profil profesional (Versi ringkas 50 kata, versi profil LinkedIn 150 kata, versi pembicara konferensi 300 kata).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Executive Brand Publicist.",
        components: [
          {
            name: "personCareerProfile",
            label: "Nama, Gelar & Jejak Karir Utama",
            type: "text",
            placeholder: "contoh: Dr. Rian Pratama - Pakar AI & Penulis Buku Bestseller dengan pengalaman 15 tahun di Silicon Valley",
            info: "Siapa Anda dan apa reputasi karir terbaik Anda?",
          },
        ],
      },
      "Product Comparison & Buyer's Guide In-Depth Review": {
        description: "Artikel panduan belanja mendalam yang membandingkan 3 produk kompetitor teratas secara objektif dengan tabel perbandingan dan verdict.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Independent Product Tester & Review Editor.",
        components: [
          {
            name: "comparedProducts",
            label: "3 Produk yang Dibandingkan",
            type: "text",
            placeholder: "contoh: Perbandingan 3 Tablet Terbaik untuk Desain Grafis: iPad Pro vs Samsung Galaxy Tab S9 vs Microsoft Surface Pro",
            info: "Produk apa saja yang ingin dikomparasi secara berimbang?",
          },
        ],
      },
      "Podcast Show Notes & Timestamped Chapter Summary": {
        description: "Catatan acara podcast lengkap dengan tautan sumber daya, kutipan emas narasumber, dan bab timestamp audio.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Podcast Show Notes Editor.",
        components: [
          {
            name: "podcastEpisodeDiscussion",
            label: "Topik Episode & Poin Utama yang Dibahas Tamu",
            type: "textarea",
            placeholder: "contoh: Diskusi bersama CEO Startup tentang bagaimana bertahan di masa sulit, cara pivot produk, dan menjaga moral tim",
            info: "Rincian pembahasan dalam episode podcast tersebut",
          },
        ],
      },
      "Job Vacancy Ad & Magnetic Culture Job Description": {
        description: "Iklan lowongan kerja menarik yang menonjolkan budaya perusahaan positif, fasilitas kerja, dan kriteria kandidat idaman.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Employer Branding & Talent Acquisition Lead.",
        components: [
          {
            name: "jobOpeningRole",
            label: "Posisi yang Dibuka & Fasilitas Menarik",
            type: "text",
            placeholder: "contoh: Senior Full-Stack Developer (Remote, Gaji Kompetitif, Tunjangan Kesehatan Penuh, Budget Belajar Rp 10 Juta/Tahun)",
            info: "Posisi lowongan apa yang sedang dicari perusahaannya?",
          },
        ],
      },
      "Interactive FAQ & Objection-Crushing Knowledge Base": {
        description: "Basis pengetahuan tanya-jawab interaktif yang secara tuntas menghancurkan seluruh keraguan calon pelanggan sebelum membeli.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Customer Objection Handling Specialist.",
        components: [
          {
            name: "productFaqScope",
            label: "Produk & 5 Keraguan Terbesar Calon Pembeli",
            type: "textarea",
            placeholder: "contoh: Kursus Online Coding: 1. Apakah pemula bisa ikut? 2. Bagaimana jika saya sibuk kerja? 3. Apakah ada jaminan dapat kerja? 4. Berapa lama akses materi? 5. Bagaimana metode pembayarannya?",
            info: "Apa saja pertanyaan atau keraguan yang paling sering ditanyakan calon pembeli?",
          },
        ],
      },
    },
    "Pemasaran Email, Kampanye & Humas": {
      "SaaS Onboarding Email Drip Sequence (5-Email Journey)": {
        description: "Rangkaian 5 email onboarding pengguna baru SaaS untuk meningkatkan aktivasi fitur produk dan mencegah churn di 14 hari pertama.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah SaaS Retention & Lifecycle Marketing Manager.",
        components: [
          {
            name: "saasProductName",
            label: "Nama Software SaaS & Fitur Inti",
            type: "text",
            placeholder: "contoh: TaskMaster AI - Aplikasi Manajemen Proyek Otomatis untuk Tim Remote",
            info: "Apa nama software dan fitur utama yang harus dicoba pengguna pertama kali?",
          },
        ],
      },
    },
    "Komunikasi Krisis & Webinar Penjualan": {
      "Crisis Management & PR Damage Control Statement": {
        description: "Pernyataan resmi humas / PR saat terjadi insiden krisis, kebocoran data, atau masalah kualitas dengan nada bertanggung jawab, transparan, dan solutif.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Senior Crisis Communication & PR Director. Buat pernyataan resmi yang meredakan kepanikan publik, menjaga reputasi brand, dan memberikan kompensasi konkret.",
        components: [
          {
            name: "crisisEvent",
            label: "Insiden / Masalah yang Terjadi",
            type: "textarea",
            placeholder: "contoh: Layanan aplikasi mengalami gangguan server selama 6 jam yang mengakibatkan transaksi pengguna tertunda",
            info: "Jelaskan insiden apa yang terjadi secara faktual",
          },
          {
            name: "companyAction",
            label: "Langkah Perbaikan yang Telah & Sedang Dilakukan",
            type: "textarea",
            placeholder: "contoh: Sistem telah dipulihkan sepenuhnya, data aman terenkripsi, dan kami memberikan kompensasi gratis langganan 1 bulan untuk semua pengguna terdampak",
            info: "Apa tindakan nyata perusahaan untuk menuntaskan masalah?",
          },
        ],
      },
      "High-Converting Webinar Pitch & Slide Deck Outline": {
        description: "Struktur naskah webinar edukasi 60 menit yang mengalir mulus menuju penawaran program berbayar di 15 menit terakhir tanpa penolakan.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Webinar Sales Master ($10M+ in webinar sales). Susun urutan slide: Hook -> Kredibilitas -> 3 Rahasia Utama -> Transisi Penawaran -> Mengatasi Keberatan -> Fast Action Bonus.",
        components: [
          {
            name: "webinarTitle",
            label: "Judul Webinar & Janji Pembelajaran",
            type: "text",
            placeholder: "contoh: Bagaimana Membangun Bisnis Ekspor Tanpa Modal Pabrik Sendiri dalam 90 Hari",
            info: "Apa topik webinar edukasi Anda?",
          },
          {
            name: "paidOffer",
            label: "Penawaran Program Berbayar di Akhir",
            type: "text",
            placeholder: "contoh: Program Mentoring Ekspor 6 Bulan dengan Garansi Pendampingan Sampai Closing Buyer Pertama",
            info: "Apa produk utama yang ditawarkan di akhir sesi?",
          },
        ],
      },
    },
    "Pemasaran Digital & Konten SEO": {
      "SEO Pillar Article 3.000 Words Master Architect": {
        description: "Panduan penulisan artikel pilar komprehensif 3.000 kata dengan perataan semantik LSI keywords, search intent Google, dan struktur schema FAQ.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Head of Enterprise SEO & Semantic Content Strategist. Buat struktur outline artikel pilar berperingkat 1 Google dengan kedalaman topik tak tertandingi.",
        components: [
          {
            name: "mainKeyword",
            label: "Kata Kunci Utama & Search Intent",
            type: "text",
            placeholder: "contoh: Cara Memulai Bisnis Online dari Nol (Search Intent: Informational & Actionable Guide)",
            info: "Kata kunci fokus yang ditargetkan di Google",
          },
          {
            name: "lsiKeywords",
            label: "Kata Kunci Semantik / Turunan (LSI)",
            type: "text",
            placeholder: "contoh: ide bisnis modal kecil, strategi jualan di marketplace, tips promosi medsos, kesalahan pemula",
            info: "Topik terkait yang wajib dicakup dalam artikel",
          },
          {
            name: "articleTone",
            label: "Gaya Bahasa & Target Pembaca",
            type: "select",
            options: ["Panduan Lengkap Langkah-demi-Langkah untuk Pemula (Bahasa Ramah & Mudah)", "Analisis Strategis Mendalam untuk Profesional & Pengusaha", "Artikel Berbasis Data Riset & Studi Kasus Industri", "Lainnya..."],
            info: "Gaya penulisan artikel",
          },
        ],
      },
      "Customer Review Response Generator (5-Star & 1-Star)": {
        description: "Generator balasan ulasan pelanggan toko online / Google Maps (Apresiasi hangat untuk bintang 5, solusi empati bertanggung jawab untuk bintang 1-2).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Customer Experience & Reputation Manager. Buat balasan ulasan yang meningkatkan citra positif brand dan mengubah kekecewaan menjadi loyalitas.",
        components: [
          {
            name: "customerReview",
            label: "Teks Ulasan dari Pelanggan",
            type: "textarea",
            placeholder: "contoh: Paket sampai dalam keadaan penyok dan pengirimannya telat 2 hari dari estimasi. Tolong diperbaiki!",
            info: "Tempelkan ulasan pelanggan yang ingin dibalas",
          },
          {
            name: "reviewRating",
            label: "Rating Bintang Pelanggan",
            type: "select",
            options: ["⭐ Bintang 1 - 2 (Komplain Kritis & Butuh Solusi Cepat)", "⭐⭐⭐ Bintang 3 (Netral / Ada Masukan Saran)", "⭐⭐⭐⭐⭐ Bintang 4 - 5 (Puas & Pujian)", "Lainnya..."],
            info: "Tingkat kepuasan ulasan pelanggan",
          },
          {
            name: "brandResolution",
            label: "Solusi / Kompensasi yang Ditawarkan",
            type: "text",
            placeholder: "contoh: Garansi ganti barang baru gratis + voucher diskon 20% untuk pesanan berikutnya via CS WhatsApp",
            info: "Aksi nyata yang Anda berikan untuk menyelesaikan masalah",
          },
        ],
      },
    },
    "Pemasaran & Komunikasi Modern": {
      "High-Ticket B2B Cold Email Outreach": {
        description: "Naskah email penawaran B2B personal bernilai tinggi yang fokus pada ROI, bebas dari kata spam, dan dirancang untuk memicu balasan meeting.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah B2B Sales Development Representative (SDR) berpenjualan tinggi. Susun email dingin ringkas (<120 kata) dengan riset spesifik dan low-friction CTA.",
        components: [
          {
            name: "prospectRole",
            label: "Posisi Target & Jenis Perusahaan",
            type: "text",
            placeholder: "contoh: VP of Marketing di Perusahaan E-Commerce Skala Menengah",
            info: "Siapa yang Anda hubungi?",
          },
          {
            name: "specificValueProp",
            label: "Solusi / Nilai Tambah Konkret (ROI)",
            type: "text",
            placeholder: "contoh: Membantu memangkas biaya akuisisi pelanggan (CAC) sebesar 28% lewat otomasi retensi WhatsApp",
            info: "Manfaat angka nyata apa yang Anda tawarkan?",
          },
          {
            name: "ctaType",
            label: "Panggilan Aksi (Call to Action)",
            type: "select",
            options: ["Tanya minat santai ('Tertarik lihat cuplikan 2 menit studi kasusnya?')", "Tawarkan audit gratis tanpa komitmen", "Ajakan ngobrol singkat 10 menit minggu ini", "Lainnya..."],
            info: "Jenis ajakan tindakan di akhir email",
          },
        ],
      },
      "Viral LinkedIn Thought Leadership Post": {
        description: "Format postingan otoritas industri di LinkedIn dengan hook headline menghentikan scroll, cerita studi kasus nyata, dan poin-poin pelajaran berharga.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah LinkedIn Top Voice & Personal Branding Strategist. Susun format postingan dengan white space nyaman, kalimat pembuka menggugah rasa ingin tahu, dan take-away aplikatif.",
        components: [
          {
            name: "coreInsight",
            label: "Pelajaran Utama / Opini Industri",
            type: "text",
            placeholder: "contoh: Kenapa 80% proyek AI di perusahaan gagal bukan karena teknologi, tapi karena manajemen perubahan",
            info: "Wawasan mendalam apa yang ingin Anda bagikan?",
          },
          {
            name: "storyEvidence",
            label: "Cerita Nyata / Bukti Pengalaman",
            type: "textarea",
            placeholder: "contoh: Minggu lalu saya mengaudit tim marketing 50 orang yang membeli 10 tool AI mahal tapi tidak ada yang menggunakannya...",
            info: "Contoh kasus konkret dari lapangan",
          },
          {
            name: "postFormat",
            label: "Struktur & Gaya Postingan",
            type: "select",
            options: ["Hook Tajam -> Cerita Pengalaman -> 3 Kesalahan Umum -> 3 Solusi -> Diskusi", "Daftar 'Before vs After' Praktis dengan format bullet points", "Refleksi Personal & Pelajaran Kegagalan Terbesar dalam Karir", "Ringkasan Infografis / Format Carousel Slide-by-Slide", "Lainnya..."],
            info: "Alur penyampaian konten LinkedIn",
          },
        ],
      },
    },
    "Branding & Identitas": {
      "Generator Nama Usaha & Slogan Catchy": {
        description: "Dapatkan 10 ide nama merek bisnis yang unik, modern, mudah diingat, belum pasaran, lengkap dengan slogan pendukung.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Brand Naming Strategist. AI meracik 10 kombinasi nama brand (Modern Compound, Singkatan Elegan, Makna Filosofis) beserta slogan dan ketersediaan ide domain.",
        components: [
          {
            name: "businessType",
            label: "Jenis Produk / Layanan Usaha",
            type: "text",
            placeholder: "e.g., 'Kedai Kopi Kekinian / Jasa Laundry Sepatu Express / Brand Hijab Muslimah'",
            info: "Jelaskan produk atau jasa yang Anda jual.",
          },
          {
            name: "brandImpression",
            label: "Kesan & Karakter yang Ingin Ditonjolkan",
            type: "select",
            options: ["Modern, Minimalis & Catchy (Gaya Startup)", "Mewah, Elegan & Premium (High-End)", "Ramah, Hangat & Merakyat (Lokal & Bersahabat)", "Unik, Lucu & Gampang Diingat (Viral Friendly)"],
            info: "Pilih citra merek di benak calon konsumen.",
          },
          {
            name: "languagePreference",
            label: "Preferensi Bahasa Nama",
            type: "select",
            options: ["Bahasa Indonesia (Puitis / Bermakna)", "Bahasa Inggris (Global / Modern)", "Kombinasi Bilingual / Kata Ciptaan Unik (Invented Words)"],
            info: "Pilih preferensi asal kata untuk nama merek.",
          },
        ],
        id_kerangka: "FW-GENERAT",
        nama_kerangka: "Generator Nama Usaha & Slogan Catchy",
        version: "2.0",
        kategori: ["Teks & Konten", "Branding & Identitas"],
        perspektif_user: "Pengguna ingin meracik prompt Generator Nama Usaha & Slogan Catchy berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Brand Naming Strategist. AI meracik 10 kombinasi nama brand (Modern Compound, Singkatan Elegan, Makna Filosofis) beserta slogan dan ketersediaan ide domain.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Brand Naming Strategist. AI meracik 10 kombinasi nama brand (Modern Compound, Singkatan Elegan, Makna Filosofis) beserta slogan dan ketersediaan ide domain.",
          KONTEKS: "Dapatkan 10 ide nama merek bisnis yang unik, modern, mudah diingat, belum pasaran, lengkap dengan slogan pendukung.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "businessType": {
                        "name": "businessType",
                        "label": "Jenis Produk / Layanan Usaha",
                        "type": "text",
                        "placeholder": "e.g., 'Kedai Kopi Kekinian / Jasa Laundry Sepatu Express / Brand Hijab Muslimah'",
                        "options": [],
                        "info": "Jelaskan produk atau jasa yang Anda jual."
            },
            "brandImpression": {
                        "name": "brandImpression",
                        "label": "Kesan & Karakter yang Ingin Ditonjolkan",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Modern, Minimalis & Catchy (Gaya Startup)",
                                    "Mewah, Elegan & Premium (High-End)",
                                    "Ramah, Hangat & Merakyat (Lokal & Bersahabat)",
                                    "Unik, Lucu & Gampang Diingat (Viral Friendly)"
                        ],
                        "info": "Pilih citra merek di benak calon konsumen."
            },
            "languagePreference": {
                        "name": "languagePreference",
                        "label": "Preferensi Bahasa Nama",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Bahasa Indonesia (Puitis / Bermakna)",
                                    "Bahasa Inggris (Global / Modern)",
                                    "Kombinasi Bilingual / Kata Ciptaan Unik (Invented Words)"
                        ],
                        "info": "Pilih preferensi asal kata untuk nama merek."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Generator Nama Usaha & Slogan Catchy.",
        output: "natural_language_prompt"
      },
    },
    "Kreasi Digital Personal & Acara": {
      "Itinerary Liburan & Traveling Lengkap (Jam per Jam)": {
        description: "Susun jadwal rencana liburan harian jam demi jam yang efisien, rute logis, rekomendasi kuliner lokal, dan perkiraan biaya.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Travel Guide & Itinerary Planner Profesional. AI merancang jadwal perjalanan yang nyaman, tidak terburu-buru, mengelompokkan destinasi berdasarkan jarak terdekat, dan menyisipkan tips lokal.",
        components: [
          {
            name: "destinationCity",
            label: "Kota / Negara Destinasi Liburan",
            type: "text",
            placeholder: "e.g., 'Yogyakarta / Bali / Tokyo, Jepang'",
            info: "Tujuan wisata yang ingin dikunjungi.",
          },
          {
            name: "tripDuration",
            label: "Durasi Liburan (Hari & Malam)",
            type: "text",
            placeholder: "e.g., '3 Hari 2 Malam'",
            info: "Berapa lama waktu liburan Anda?",
          },
          {
            name: "travelStyle",
            label: "Gaya Traveling & Anggaran",
            type: "select",
            options: ["Hemat & Seru (Backpacker / Budget Traveler)", "Keluarga Ramah Anak & Orang Tua (Santai & Nyaman)", "Eksplorasi Kuliner Lokal & Tempat Hits / Hidden Gems", "Liburan Mewah & Relaksasi (Luxury & Healing)"],
            info: "Pilih ritme dan gaya liburan yang Anda sukai.",
          },
          {
            name: "specificWishes",
            label: "Tempat Wajib Dikunjungi (Opsional)",
            type: "text",
            placeholder: "e.g., 'Wajib coba gudeg malam dan sunset di pantai pasir putih'",
            info: "Sebutkan tempat atau makanan yang tidak boleh terlewatkan.",
          },
        ],
        id_kerangka: "FW-ITINERA",
        nama_kerangka: "Itinerary Liburan & Traveling Lengkap (Jam per Jam)",
        version: "2.0",
        kategori: ["Teks & Konten", "Kreasi Digital Personal & Acara"],
        perspektif_user: "Pengguna ingin meracik prompt Itinerary Liburan & Traveling Lengkap (Jam per Jam) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Travel Guide & Itinerary Planner Profesional. AI merancang jadwal perjalanan yang nyaman, tidak terburu-buru, mengelompokkan destinasi berdasarkan jarak terdekat, dan menyisipkan tips lokal.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Travel Guide & Itinerary Planner Profesional. AI merancang jadwal perjalanan yang nyaman, tidak terburu-buru, mengelompokkan destinasi berdasarkan jarak terdekat, dan menyisipkan tips lokal.",
          KONTEKS: "Susun jadwal rencana liburan harian jam demi jam yang efisien, rute logis, rekomendasi kuliner lokal, dan perkiraan biaya.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "destinationCity": {
                        "name": "destinationCity",
                        "label": "Kota / Negara Destinasi Liburan",
                        "type": "text",
                        "placeholder": "e.g., 'Yogyakarta / Bali / Tokyo, Jepang'",
                        "options": [],
                        "info": "Tujuan wisata yang ingin dikunjungi."
            },
            "tripDuration": {
                        "name": "tripDuration",
                        "label": "Durasi Liburan (Hari & Malam)",
                        "type": "text",
                        "placeholder": "e.g., '3 Hari 2 Malam'",
                        "options": [],
                        "info": "Berapa lama waktu liburan Anda?"
            },
            "travelStyle": {
                        "name": "travelStyle",
                        "label": "Gaya Traveling & Anggaran",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Hemat & Seru (Backpacker / Budget Traveler)",
                                    "Keluarga Ramah Anak & Orang Tua (Santai & Nyaman)",
                                    "Eksplorasi Kuliner Lokal & Tempat Hits / Hidden Gems",
                                    "Liburan Mewah & Relaksasi (Luxury & Healing)"
                        ],
                        "info": "Pilih ritme dan gaya liburan yang Anda sukai."
            },
            "specificWishes": {
                        "name": "specificWishes",
                        "label": "Tempat Wajib Dikunjungi (Opsional)",
                        "type": "text",
                        "placeholder": "e.g., 'Wajib coba gudeg malam dan sunset di pantai pasir putih'",
                        "options": [],
                        "info": "Sebutkan tempat atau makanan yang tidak boleh terlewatkan."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Itinerary Liburan & Traveling Lengkap (Jam per Jam).",
        output: "natural_language_prompt"
      },
    },
    "Kehidupan & Produktivitas": {
      "Perencana Menu & Resep dari Bahan Kulkas": {
        description: "Racik ide resep masakan lezat dan bergizi hanya dari sisa bahan makanan yang sedang tersedia di dapur Anda.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Chef Kreatif & Ahli Gizi. AI menciptakan resep masakan praktis langkah-demi-langkah dengan memaksimalkan bahan yang tersedia dan meminimalkan sampah makanan.",
        components: [
          {
            name: "availableIngredients",
            label: "Bahan Makanan yang Ada di Kulkas / Dapur",
            type: "textarea",
            placeholder: "e.g., 'Telur 3 butir, wortel 1 buah, sisa dada ayam suwir, bawang putih, kecap manis, nasi putih dingin'",
            info: "Tuliskan apa saja bahan mentah atau lauk sisa yang ada.",
          },
          {
            name: "maxCookingTime",
            label: "Waktu Masak Maksimal",
            type: "select",
            options: ["15 Menit (Cepat Kilat & Praktis)", "30 Menit (Menu Rumahan Standar)", "45 Menit (Masakan Lebih Lengkap & Berkuah)"],
            info: "Berapa lama waktu yang Anda miliki di dapur?",
          },
          {
            name: "dietaryRestrictions",
            label: "Batasan Diet / Selera Rasa",
            type: "select",
            options: ["Bebas (Segala Rasa Enak)", "Pedas Gurih Nusantara", "Rendah Minyak / Sehat & Diet", "Kids-Friendly (Tidak Pedas & Manis Gurih)"],
            info: "Pilih profil rasa yang diinginkan keluarga.",
          },
        ],
        id_kerangka: "FW-PERENCA",
        nama_kerangka: "Perencana Menu & Resep dari Bahan Kulkas",
        version: "2.0",
        kategori: ["Teks & Konten", "Kehidupan & Produktivitas"],
        perspektif_user: "Pengguna ingin meracik prompt Perencana Menu & Resep dari Bahan Kulkas berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Chef Kreatif & Ahli Gizi. AI menciptakan resep masakan praktis langkah-demi-langkah dengan memaksimalkan bahan yang tersedia dan meminimalkan sampah makanan.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Chef Kreatif & Ahli Gizi. AI menciptakan resep masakan praktis langkah-demi-langkah dengan memaksimalkan bahan yang tersedia dan meminimalkan sampah makanan.",
          KONTEKS: "Racik ide resep masakan lezat dan bergizi hanya dari sisa bahan makanan yang sedang tersedia di dapur Anda.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "availableIngredients": {
                        "name": "availableIngredients",
                        "label": "Bahan Makanan yang Ada di Kulkas / Dapur",
                        "type": "textarea",
                        "placeholder": "e.g., 'Telur 3 butir, wortel 1 buah, sisa dada ayam suwir, bawang putih, kecap manis, nasi putih dingin'",
                        "options": [],
                        "info": "Tuliskan apa saja bahan mentah atau lauk sisa yang ada."
            },
            "maxCookingTime": {
                        "name": "maxCookingTime",
                        "label": "Waktu Masak Maksimal",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "15 Menit (Cepat Kilat & Praktis)",
                                    "30 Menit (Menu Rumahan Standar)",
                                    "45 Menit (Masakan Lebih Lengkap & Berkuah)"
                        ],
                        "info": "Berapa lama waktu yang Anda miliki di dapur?"
            },
            "dietaryRestrictions": {
                        "name": "dietaryRestrictions",
                        "label": "Batasan Diet / Selera Rasa",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Bebas (Segala Rasa Enak)",
                                    "Pedas Gurih Nusantara",
                                    "Rendah Minyak / Sehat & Diet",
                                    "Kids-Friendly (Tidak Pedas & Manis Gurih)"
                        ],
                        "info": "Pilih profil rasa yang diinginkan keluarga."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Perencana Menu & Resep dari Bahan Kulkas.",
        output: "natural_language_prompt"
      },
      "Simulasi Anggaran Keuangan Bulanan (50-30-20)": {
        description: "Bagi penghasilan bulanan ke pos Kebutuhan Pokok, Keinginan, Tabungan/Investasi, dan susun rencana pelunasan cicilan terstruktur.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Certified Financial Planner. AI menganalisis pemasukan dan pengeluaran pengguna, menyusun pembagian pos keuangan 50/30/20 yang realistis, dan memberikan rekomendasi penghematan.",
        components: [
          {
            name: "monthlyIncome",
            label: "Total Penghasilan Bersih Bulanan (Take-Home Pay)",
            type: "text",
            placeholder: "e.g., 'Rp 7.000.000'",
            info: "Jumlah uang masuk bersih per bulan.",
          },
          {
            name: "fixedExpenses",
            label: "Pengeluaran Pokok Wajib Saat Ini",
            type: "textarea",
            placeholder: "e.g., 'Kost/Sewa: 1.5jt, Makan: 1.8jt, Transport/Bensin: 500rb, Listrik & Pulsa: 300rb'",
            info: "Rincian biaya hidup pokok yang tidak bisa ditunda.",
          },
          {
            name: "debtOrGoals",
            label: "Cicilan / Target Keuangan Utama",
            type: "text",
            placeholder: "e.g., 'Cicilan motor 800rb/bln (sisa 6 bulan) + target kumpul dana darurat 10jt'",
            info: "Tujuan keuangan yang ingin dicapai dalam 6-12 bulan ke depan.",
          },
        ],
        id_kerangka: "FW-SIMULAS",
        nama_kerangka: "Simulasi Anggaran Keuangan Bulanan (50-30-20)",
        version: "2.0",
        kategori: ["Teks & Konten", "Kehidupan & Produktivitas"],
        perspektif_user: "Pengguna ingin meracik prompt Simulasi Anggaran Keuangan Bulanan (50-30-20) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Certified Financial Planner. AI menganalisis pemasukan dan pengeluaran pengguna, menyusun pembagian pos keuangan 50/30/20 yang realistis, dan memberikan rekomendasi penghematan.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Certified Financial Planner. AI menganalisis pemasukan dan pengeluaran pengguna, menyusun pembagian pos keuangan 50/30/20 yang realistis, dan memberikan rekomendasi penghematan.",
          KONTEKS: "Bagi penghasilan bulanan ke pos Kebutuhan Pokok, Keinginan, Tabungan/Investasi, dan susun rencana pelunasan cicilan terstruktur.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "monthlyIncome": {
                        "name": "monthlyIncome",
                        "label": "Total Penghasilan Bersih Bulanan (Take-Home Pay)",
                        "type": "text",
                        "placeholder": "e.g., 'Rp 7.000.000'",
                        "options": [],
                        "info": "Jumlah uang masuk bersih per bulan."
            },
            "fixedExpenses": {
                        "name": "fixedExpenses",
                        "label": "Pengeluaran Pokok Wajib Saat Ini",
                        "type": "textarea",
                        "placeholder": "e.g., 'Kost/Sewa: 1.5jt, Makan: 1.8jt, Transport/Bensin: 500rb, Listrik & Pulsa: 300rb'",
                        "options": [],
                        "info": "Rincian biaya hidup pokok yang tidak bisa ditunda."
            },
            "debtOrGoals": {
                        "name": "debtOrGoals",
                        "label": "Cicilan / Target Keuangan Utama",
                        "type": "text",
                        "placeholder": "e.g., 'Cicilan motor 800rb/bln (sisa 6 bulan) + target kumpul dana darurat 10jt'",
                        "options": [],
                        "info": "Tujuan keuangan yang ingin dicapai dalam 6-12 bulan ke depan."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Simulasi Anggaran Keuangan Bulanan (50-30-20).",
        output: "natural_language_prompt"
      },
      "Perencana Perjalanan (Itinerary Planner)": {
        description:
          "Buat jadwal perjalanan harian yang detail dan logis berdasarkan preferensi Anda.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perencana Perjalanan. AI akan membuat jadwal perjalanan harian yang detail dan logis, dengan mempertimbangkan tujuan, durasi, minat, dan gaya perjalanan untuk mengoptimalkan pengalaman pengguna.",
        components: [
          {
            name: "destination",
            label: "Tujuan (Kota/Negara)",
            type: "text",
            placeholder: "e.g., 'Kyoto, Jepang'",
            info: "Lokasi utama dari perjalanan Anda.",
            validation: { min_length: 3 },
          },
          {
            name: "duration",
            label: "Jumlah Hari Perjalanan",
            type: "number",
            placeholder: "e.g., 5",
            info: "Berapa lama Anda akan berada di sana?",
            validation: { min_value: 1, max_value: 30 },
          },
          {
            name: "interests",
            label: "Minat Utama (pisahkan koma)",
            type: "text",
            placeholder:
              "e.g., 'Kuliner, Kuil & Sejarah, Alam, Belanja, Seni Kontemporer'",
            info: "Jenis aktivitas apa yang paling Anda nikmati.",
            validation: { min_length: 5 },
          },
          {
            name: "travelStyle",
            label: "Gaya Perjalanan",
            type: "select",
            options: [
              "Santai & Fleksibel",
              "Padat & Efisien",
              "Ramah Anggaran (Budget)",
              "Mewah & Nyaman",
              "Petualangan",
              "Lainnya...",
            ],
            info: "Pilih pendekatan umum untuk perjalanan Anda.",
          },
          {
            name: "mustVisit",
            label: "Tempat yang Wajib Dikunjungi (Opsional)",
            type: "text",
            placeholder: "e.g., 'Kuil Fushimi Inari, Hutan Bambu Arashiyama'",
            info: "Sebutkan tempat spesifik yang tidak boleh terlewatkan.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Saya tidak suka keramaian, cari waktu kunjungan yang sepi. Saya bepergian dengan anak-anak. Sertakan setidaknya satu kafe unik setiap hari. Alokasikan waktu untuk istirahat siang.",
            info: "Preferensi personal atau batasan yang perlu diperhatikan oleh AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Resep Masakan": {
        description:
          "Buat resep masakan baru dan kreatif berdasarkan bahan-bahan yang Anda miliki.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Koki AI. AI akan membuat resep masakan baru dan kreatif berdasarkan bahan-bahan yang Anda miliki, dengan mempertimbangkan jenis masakan, preferensi diet, dan tingkat kesulitan yang diinginkan.",
        components: [
          {
            name: "mainIngredients",
            label: "Bahan Utama yang Tersedia",
            type: "text",
            placeholder: "e.g., 'dada ayam, brokoli, bawang putih'",
            info: "Bahan protein dan sayuran utama yang Anda punya.",
            validation: { min_length: 5 },
          },
          {
            name: "pantryStaples",
            label: "Bahan Dapur Lainnya (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'nasi, telur, saus tiram, minyak wijen'",
            info: "Bahan umum yang biasanya ada di dapur Anda.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "cuisineType",
            label: "Jenis Masakan yang Diinginkan",
            type: "select",
            options: [
              "Apa Saja",
              "Asia (Umum)",
              "Italia",
              "Meksiko",
              "Indonesia",
              "Sehat & Cepat",
              "Lainnya...",
            ],
            info: "Pilih profil rasa yang Anda inginkan.",
          },
          {
            name: "dietaryRestrictions",
            label: "Pantangan/Preferensi Diet (Opsional)",
            type: "text",
            placeholder: "e.g., 'Rendah karbohidrat, tanpa susu, vegetarian'",
            info: "Sebutkan batasan diet yang perlu diikuti.",
            optional: true,
          },
          {
            name: "difficultyLevel",
            label: "Tingkat Kesulitan",
            type: "select",
            options: [
              "Sangat Mudah (di bawah 20 menit)",
              "Mudah (sekitar 30 menit)",
              "Menengah",
              "Lainnya...",
            ],
            info: "Berapa banyak waktu dan usaha yang ingin Anda curahkan?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat resep untuk satu porsi saja. Saya tidak punya oven. Resep harus ramah untuk anak-anak.",
            info: "Batasan alat masak atau preferensi lain yang penting.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Perencana Tujuan Pribadi": {
        description:
          "Pecah tujuan besar Anda menjadi langkah-langkah kecil yang dapat ditindaklanjuti dan terukur.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pelatih Tujuan Pribadi. AI akan membantu memecah tujuan besar menjadi langkah-langkah kecil yang dapat ditindaklanjuti dan terukur, dengan mempertimbangkan jangka waktu, situasi saat ini, dan kerangka perencanaan yang dipilih.",
        components: [
          {
            name: "mainGoal",
            label: "Tujuan Utama",
            type: "text",
            placeholder:
              "e.g., 'Belajar bermain gitar', 'Menurunkan berat badan 5 kg'",
            info: "Tuliskan satu tujuan besar yang ingin Anda capai.",
            validation: { min_length: 10 },
          },
          {
            name: "timeframe",
            label: "Jangka Waktu",
            type: "text",
            placeholder: "e.g., '3 bulan', 'Tahun ini'",
            info: "Kapan Anda ingin tujuan ini tercapai?",
            validation: { min_length: 5 },
          },
          {
            name: "currentSituation",
            label: "Situasi Saat Ini",
            type: "textarea",
            placeholder:
              "e.g., 'Belum pernah memegang gitar sama sekali', 'Berolahraga tidak teratur'",
            info: "Jelaskan titik awal Anda secara jujur. Ini membantu AI membuat langkah yang realistis.",
            validation: { min_length: 20 },
          },
          {
            name: "planningFramework",
            label: "Kerangka Perencanaan",
            type: "select",
            options: [
              "SMART (Specific, Measurable, Achievable, Relevant, Time-bound)",
              "WOOP (Wish, Outcome, Obstacle, Plan)",
              "Langkah-langkah Mingguan",
              "Lainnya...",
            ],
            info: "Pilih metode perencanaan yang ingin digunakan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Saya hanya punya waktu 30 menit setiap hari. Saya butuh rencana yang sangat detail. Sertakan cara untuk melacak kemajuan.",
            info: "Berikan batasan atau preferensi personal Anda.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Template Balasan Cepat": {
        description:
          "Buat template balasan email atau pesan untuk situasi yang sering terjadi untuk menghemat waktu.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Asisten Komunikasi Cepat. AI akan membuat template balasan cepat yang efisien dan sesuai untuk skenario komunikasi yang sering terjadi, dengan mempertimbangkan peran pengirim, pesan kunci, dan gaya bahasa yang diinginkan.",
        components: [
          {
            name: "scenario",
            label: "Skenario Komunikasi",
            type: "text",
            placeholder:
              "e.g., 'Menjawab pertanyaan umum tentang harga', 'Mengatakan tidak pada sebuah permintaan'",
            info: "Jelaskan situasi spesifik di mana Anda memerlukan template balasan.",
            validation: { min_length: 10 },
          },
          {
            name: "myRole",
            label: "Peran Saya",
            type: "text",
            placeholder:
              "e.g., 'Freelancer', 'Customer Service', 'Manajer Tim'",
            info: "Dari sudut pandang siapa balasan ini akan dikirim?",
            validation: { min_length: 5 },
          },
          {
            name: "keyMessage",
            label: "Pesan Kunci yang Harus Disampaikan",
            type: "textarea",
            placeholder:
              "e.g., 'Terima kasih atas pertanyaannya. Harga kami adalah X. Berikut link ke detailnya.'",
            info: "Informasi inti yang harus ada dalam balasan.",
            validation: { min_length: 20 },
          },
          {
            name: "tone",
            label: "Gaya Bahasa Template",
            type: "select",
            options: [
              "Efisien & Langsung",
              "Ramah & Hangat",
              "Formal & Profesional",
              "Empatik & Membantu",
              "Lainnya...",
            ],
            info: "Pilih nada yang sesuai dengan peran dan audiens Anda.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat placeholder seperti [Nama Klien] agar mudah diganti. Sertakan kalimat pembuka dan penutup yang sopan. Buat agar template bisa digunakan di WhatsApp.",
            info: "Instruksi untuk membuat template lebih fleksibel dan mudah digunakan.",
            optional: true,
            validation: { min_length: 20 },
          },
        ],
      },
    },
    "Pengembangan Diri & Psikologi": {
      "Simulasi Wawancara Kerja Interaktif (Mock Interviewer)": {
        description: "Latihan simulasi wawancara kerja interaktif dengan AI sebagai HRD atau User Manager yang menguji dan mengevaluasi jawaban Anda.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Senior Hiring Manager berpengalaman. AI akan mewawancarai pengguna satu per satu pertanyaan, menunggu jawaban pengguna, lalu memberikan feedback nilai dan pertanyaan lanjutan.",
        components: [
          {
            name: "targetPosition",
            label: "Posisi / Pekerjaan yang Dilamar",
            type: "text",
            placeholder: "e.g., 'Digital Marketing Specialist / Frontend Developer / Admin Operasional'",
            info: "Nama lowongan pekerjaan yang ingin Anda latih.",
          },
          {
            name: "companyType",
            label: "Profil Perusahaan Target",
            type: "text",
            placeholder: "e.g., 'Startup Teknologi Fast-Paced / BUMN Perbankan / Agensi Kreatif'",
            info: "Jenis budaya perusahaan tempat Anda melamar.",
          },
          {
            name: "interviewerStrictness",
            label: "Karakter Pewawancara AI",
            type: "select",
            options: ["Ramah & Membimbing (Untuk Pemula)", "Objektif & Standar Korporat (Interview Formal)", "Ketat & Kritis (Tantangan Behavioral & Situational)", "Spesialis Pertanyaan Menjebak & Negosiasi Gaji"],
            info: "Pilih tingkat kesulitan simulasi wawancara.",
          },
        ],
        id_kerangka: "FW-SIMULAS",
        nama_kerangka: "Simulasi Wawancara Kerja Interaktif (Mock Interviewer)",
        version: "2.0",
        kategori: ["Teks & Konten", "Pengembangan Diri & Psikologi"],
        perspektif_user: "Pengguna ingin meracik prompt Simulasi Wawancara Kerja Interaktif (Mock Interviewer) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Senior Hiring Manager berpengalaman. AI akan mewawancarai pengguna satu per satu pertanyaan, menunggu jawaban pengguna, lalu memberikan feedback nilai dan pertanyaan lanjutan.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Senior Hiring Manager berpengalaman. AI akan mewawancarai pengguna satu per satu pertanyaan, menunggu jawaban pengguna, lalu memberikan feedback nilai dan pertanyaan lanjutan.",
          KONTEKS: "Latihan simulasi wawancara kerja interaktif dengan AI sebagai HRD atau User Manager yang menguji dan mengevaluasi jawaban Anda.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "targetPosition": {
                        "name": "targetPosition",
                        "label": "Posisi / Pekerjaan yang Dilamar",
                        "type": "text",
                        "placeholder": "e.g., 'Digital Marketing Specialist / Frontend Developer / Admin Operasional'",
                        "options": [],
                        "info": "Nama lowongan pekerjaan yang ingin Anda latih."
            },
            "companyType": {
                        "name": "companyType",
                        "label": "Profil Perusahaan Target",
                        "type": "text",
                        "placeholder": "e.g., 'Startup Teknologi Fast-Paced / BUMN Perbankan / Agensi Kreatif'",
                        "options": [],
                        "info": "Jenis budaya perusahaan tempat Anda melamar."
            },
            "interviewerStrictness": {
                        "name": "interviewerStrictness",
                        "label": "Karakter Pewawancara AI",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Ramah & Membimbing (Untuk Pemula)",
                                    "Objektif & Standar Korporat (Interview Formal)",
                                    "Ketat & Kritis (Tantangan Behavioral & Situational)",
                                    "Spesialis Pertanyaan Menjebak & Negosiasi Gaji"
                        ],
                        "info": "Pilih tingkat kesulitan simulasi wawancara."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Simulasi Wawancara Kerja Interaktif (Mock Interviewer).",
        output: "natural_language_prompt"
      },
      "Alat Bantu Jurnal Terpandu": {
        description:
          "Dapatkan serangkaian pertanyaan atau prompt yang merangsang pemikiran untuk jurnal harian Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Fasilitator Jurnal. AI akan menghasilkan serangkaian pertanyaan atau prompt yang merangsang pemikiran untuk jurnal, disesuaikan dengan tema, mood, dan preferensi pengguna untuk memfasilitasi refleksi diri.",
        components: [
          {
            name: "journalTheme",
            label: "Tema Jurnal Hari Ini",
            type: "select",
            options: [
              "Rasa Syukur (Gratitude)",
              "Refleksi Harian",
              "Penetapan Tujuan",
              "Mengatasi Stres/Kecemasan",
              "Meningkatkan Kreativitas",
              "Lainnya...",
            ],
            info: "Pilih fokus untuk sesi jurnal Anda.",
          },
          {
            name: "currentMood",
            label: "Perasaan Anda Saat Ini (Opsional)",
            type: "text",
            placeholder: "e.g., 'Merasa lelah', 'Bersemangat', 'Sedikit cemas'",
            info: "Membantu AI menyesuaikan pertanyaan agar lebih relevan dengan kondisi Anda.",
          },
          {
            name: "numberOfPrompts",
            label: "Jumlah Prompt/Pertanyaan",
            type: "number",
            placeholder: "e.g., 5",
            info: "Berapa banyak pertanyaan panduan yang Anda inginkan?",
          },
          {
            name: "promptStyle",
            label: "Gaya Prompt",
            type: "select",
            options: [
              "Pertanyaan Reflektif Mendalam",
              "Latihan Singkat & Praktis",
              "Prompt Kreatif & Imajinatif",
              "Lainnya...",
            ],
            info: "Pilih jenis pertanyaan yang paling Anda butuhkan saat ini.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Fokus pada pencapaian kecil. Hindari pertanyaan tentang pekerjaan. Buat pertanyaan yang bisa dijawab dalam 1-2 kalimat.",
            info: "Preferensi personal untuk memandu AI.",
          },
        ],
      },
      "Simulator Latihan Percakapan Sulit": {
        description:
          "Berlatih untuk percakapan sulit dengan AI yang berperan sebagai lawan bicara.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pelatih Komunikasi. AI akan mensimulasikan percakapan sulit, berperan sebagai lawan bicara dengan persona yang ditentukan, dan merespons berdasarkan skenario dan tujuan pengguna untuk membantu latihan komunikasi.",
        components: [
          {
            name: "scenario",
            label: "Skenario Percakapan",
            type: "text",
            placeholder:
              "e.g., 'Meminta kenaikan gaji', 'Memberikan umpan balik negatif kepada rekan kerja'",
            info: "Jelaskan situasi spesifik dari percakapan yang akan Anda latih.",
          },
          {
            name: "myRole",
            label: "Peran Saya",
            type: "text",
            placeholder: "e.g., 'Karyawan', 'Manajer Proyek'",
            info: "Anda akan berperan sebagai siapa dalam simulasi ini?",
          },
          {
            name: "aiRole",
            label: "Peran AI (Lawan Bicara)",
            type: "textarea",
            placeholder:
              "e.g., 'Seorang atasan yang sibuk dan fokus pada data.', 'Seorang rekan kerja yang defensif dan mudah tersinggung.'",
            info: "Berikan AI persona yang spesifik. Jelaskan kepribadian dan kemungkinan reaksinya.",
          },
          {
            name: "myOpeningStatement",
            label: "Kalimat Pembuka Saya",
            type: "textarea",
            placeholder:
              "e.g., 'Pak/Bu, terima kasih atas waktunya. Saya ingin mendiskusikan tentang kompensasi saya.'",
            info: "Bagaimana Anda akan memulai percakapan ini? AI akan merespons dari sini.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tujuan saya adalah mendapatkan kenaikan 15%. AI harus mencoba untuk menolak permintaan saya setidaknya dua kali. Buat agar AI memberikan argumen balasan yang logis.",
            info: "Aturan main dan tujuan dari simulasi ini.",
          },
        ],
      },
    },
    "Akademis & Edukasi": {
      "Feynman Technique Explainer (Analogi Sederhana)": {
        description: "Terjemahkan materi teknis, sains, finansial, atau hukum yang rumit menjadi penjelasan mudah dipahami menggunakan analogi sehari-hari.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Guru Besar dengan metode Richard Feynman. AI menjelaskan konsep rumit tanpa jargon teknis yang membingungkan, menggunakan perumpamaan hidup sehari-hari.",
        components: [
          {
            name: "complexTopic",
            label: "Konsep / Istilah yang Ingin Dijelaskan",
            type: "text",
            placeholder: "e.g., 'Teknologi Blockchain / Inflasi Mata Uang / Mesin Turbocharger'",
            info: "Topik atau teori rumit yang ingin Anda pahami atau ajarkan.",
          },
          {
            name: "targetAudienceAge",
            label: "Tingkat Pemahaman Target Pembaca",
            type: "select",
            options: ["Anak Usia 10 Tahun (Sangat Sederhana & Ramah)", "Pemula Awam Non-Teknis (Bahasa Santai Keseharian)", "Siswa / Mahasiswa Pemula", "Profesional Lintas Bidang"],
            info: "Pilih seberapa sederhana analogi yang harus dibuat.",
          },
          {
            name: "preferredAnalogy",
            label: "Preferensi Tema Analogi (Opsional)",
            type: "text",
            placeholder: "e.g., 'Analogi buku catatan arisan / dapur restoran / sepak bola'",
            info: "Tuliskan contoh dunia nyata yang ingin dijadikan perumpamaan.",
          },
        ],
        id_kerangka: "FW-FEYNMAN",
        nama_kerangka: "Feynman Technique Explainer (Analogi Sederhana)",
        version: "2.0",
        kategori: ["Teks & Konten", "Akademis & Edukasi"],
        perspektif_user: "Pengguna ingin meracik prompt Feynman Technique Explainer (Analogi Sederhana) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Guru Besar dengan metode Richard Feynman. AI menjelaskan konsep rumit tanpa jargon teknis yang membingungkan, menggunakan perumpamaan hidup sehari-hari.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Guru Besar dengan metode Richard Feynman. AI menjelaskan konsep rumit tanpa jargon teknis yang membingungkan, menggunakan perumpamaan hidup sehari-hari.",
          KONTEKS: "Terjemahkan materi teknis, sains, finansial, atau hukum yang rumit menjadi penjelasan mudah dipahami menggunakan analogi sehari-hari.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "complexTopic": {
                        "name": "complexTopic",
                        "label": "Konsep / Istilah yang Ingin Dijelaskan",
                        "type": "text",
                        "placeholder": "e.g., 'Teknologi Blockchain / Inflasi Mata Uang / Mesin Turbocharger'",
                        "options": [],
                        "info": "Topik atau teori rumit yang ingin Anda pahami atau ajarkan."
            },
            "targetAudienceAge": {
                        "name": "targetAudienceAge",
                        "label": "Tingkat Pemahaman Target Pembaca",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Anak Usia 10 Tahun (Sangat Sederhana & Ramah)",
                                    "Pemula Awam Non-Teknis (Bahasa Santai Keseharian)",
                                    "Siswa / Mahasiswa Pemula",
                                    "Profesional Lintas Bidang"
                        ],
                        "info": "Pilih seberapa sederhana analogi yang harus dibuat."
            },
            "preferredAnalogy": {
                        "name": "preferredAnalogy",
                        "label": "Preferensi Tema Analogi (Opsional)",
                        "type": "text",
                        "placeholder": "e.g., 'Analogi buku catatan arisan / dapur restoran / sepak bola'",
                        "options": [],
                        "info": "Tuliskan contoh dunia nyata yang ingin dijadikan perumpamaan."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Feynman Technique Explainer (Analogi Sederhana).",
        output: "natural_language_prompt"
      },
      "Ringkasan Dokumen Panjang & PDF (TL;DR + Action Items)": {
        description: "Ekstraksi ringkasan dokumen, laporan, atau artikel panjang menjadi intisari satu halaman, poin penting, dan daftar aksi nyata.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Executive Research Analyst. AI membaca teks panjang dan menyusun ringkasan terstruktur: Ringkasan Eksekutif 3 Kalimat (TL;DR), 5 Temuan Kunci, dan Rekomendasi Aksi.",
        components: [
          {
            name: "documentText",
            label: "Teks / Dokumen yang Ingin Diringkas",
            type: "textarea",
            placeholder: "Paste cuplikan teks laporan, artikel, atau hasil rapat Anda di sini...",
            info: "Tempelkan teks dokumen yang ingin dipadatkan intisarinya.",
          },
          {
            name: "summaryFocus",
            label: "Fokus Ringkasan yang Diutamakan",
            type: "select",
            options: ["Semua Poin Lengkap (Ringkasan Eksekutif Komprehensif)", "Hanya Angka, Data Finansial & Statistik", "Hanya Masalah Utama & Solusi Rekomendasi", "Hanya Tindakan Lanjutan (Action Items & To-Do List)"],
            info: "Pilih aspek apa yang paling krusial untuk Anda.",
          },
        ],
        id_kerangka: "FW-RINGKAS",
        nama_kerangka: "Ringkasan Dokumen Panjang & PDF (TL;DR + Action Items)",
        version: "2.0",
        kategori: ["Teks & Konten", "Akademis & Edukasi"],
        perspektif_user: "Pengguna ingin meracik prompt Ringkasan Dokumen Panjang & PDF (TL;DR + Action Items) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Executive Research Analyst. AI membaca teks panjang dan menyusun ringkasan terstruktur: Ringkasan Eksekutif 3 Kalimat (TL;DR), 5 Temuan Kunci, dan Rekomendasi Aksi.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Executive Research Analyst. AI membaca teks panjang dan menyusun ringkasan terstruktur: Ringkasan Eksekutif 3 Kalimat (TL;DR), 5 Temuan Kunci, dan Rekomendasi Aksi.",
          KONTEKS: "Ekstraksi ringkasan dokumen, laporan, atau artikel panjang menjadi intisari satu halaman, poin penting, dan daftar aksi nyata.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "documentText": {
                        "name": "documentText",
                        "label": "Teks / Dokumen yang Ingin Diringkas",
                        "type": "textarea",
                        "placeholder": "Paste cuplikan teks laporan, artikel, atau hasil rapat Anda di sini...",
                        "options": [],
                        "info": "Tempelkan teks dokumen yang ingin dipadatkan intisarinya."
            },
            "summaryFocus": {
                        "name": "summaryFocus",
                        "label": "Fokus Ringkasan yang Diutamakan",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Semua Poin Lengkap (Ringkasan Eksekutif Komprehensif)",
                                    "Hanya Angka, Data Finansial & Statistik",
                                    "Hanya Masalah Utama & Solusi Rekomendasi",
                                    "Hanya Tindakan Lanjutan (Action Items & To-Do List)"
                        ],
                        "info": "Pilih aspek apa yang paling krusial untuk Anda."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Ringkasan Dokumen Panjang & PDF (TL;DR + Action Items).",
        output: "natural_language_prompt"
      },
      "Pembuat Kuis & Soal Ujian Interaktif": {
        description: "Hasilkan set soal kuis atau ujian pilihan ganda lengkap dengan kunci jawaban, penjelasan pembahasannya, dan tingkat kesulitan.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Evaluator Akademis & Pembuat Soal Ujian Berstandar. AI menyusun soal ujian berkualitas tinggi dengan opsi distraktor yang masuk akal dan pembahasan edukatif.",
        components: [
          {
            name: "examTopic",
            label: "Materi / Topik Ujian",
            type: "text",
            placeholder: "e.g., 'Tata Surya & Karakteristik Planet / Manajemen Pemasaran Digital'",
            info: "Materi pelajaran atau modul yang ingin diujikan.",
          },
          {
            name: "targetEducationLevel",
            label: "Jenjang Tingkat Peserta",
            type: "select",
            options: ["Sekolah Dasar (SD) / Sederhana", "Sekolah Menengah Pertama (SMP)", "Sekolah Menengah Atas (SMA / SMK)", "Tingkat Universitas / Mahasiswa", "Sertifikasi Profesional / Dewasa"],
            info: "Tingkat pemahaman peserta ujian.",
          },
          {
            name: "questionCount",
            label: "Jumlah Soal yang Dibuat",
            type: "select",
            options: ["5 Soal Kuis Cepat (Lengkap Pembahasan)", "10 Soal Ujian Standar (Pilihan A-B-C-D + Kunci)", "15 Soal Komprehensif (Variasi Mudah - Sulit)"],
            info: "Berapa banyak butir pertanyaan yang dibutuhkan?",
          },
        ],
        id_kerangka: "FW-PEMBUAT",
        nama_kerangka: "Pembuat Kuis & Soal Ujian Interaktif",
        version: "2.0",
        kategori: ["Teks & Konten", "Akademis & Edukasi"],
        perspektif_user: "Pengguna ingin meracik prompt Pembuat Kuis & Soal Ujian Interaktif berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Evaluator Akademis & Pembuat Soal Ujian Berstandar. AI menyusun soal ujian berkualitas tinggi dengan opsi distraktor yang masuk akal dan pembahasan edukatif.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Evaluator Akademis & Pembuat Soal Ujian Berstandar. AI menyusun soal ujian berkualitas tinggi dengan opsi distraktor yang masuk akal dan pembahasan edukatif.",
          KONTEKS: "Hasilkan set soal kuis atau ujian pilihan ganda lengkap dengan kunci jawaban, penjelasan pembahasannya, dan tingkat kesulitan.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "examTopic": {
                        "name": "examTopic",
                        "label": "Materi / Topik Ujian",
                        "type": "text",
                        "placeholder": "e.g., 'Tata Surya & Karakteristik Planet / Manajemen Pemasaran Digital'",
                        "options": [],
                        "info": "Materi pelajaran atau modul yang ingin diujikan."
            },
            "targetEducationLevel": {
                        "name": "targetEducationLevel",
                        "label": "Jenjang Tingkat Peserta",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Sekolah Dasar (SD) / Sederhana",
                                    "Sekolah Menengah Pertama (SMP)",
                                    "Sekolah Menengah Atas (SMA / SMK)",
                                    "Tingkat Universitas / Mahasiswa",
                                    "Sertifikasi Profesional / Dewasa"
                        ],
                        "info": "Tingkat pemahaman peserta ujian."
            },
            "questionCount": {
                        "name": "questionCount",
                        "label": "Jumlah Soal yang Dibuat",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "5 Soal Kuis Cepat (Lengkap Pembahasan)",
                                    "10 Soal Ujian Standar (Pilihan A-B-C-D + Kunci)",
                                    "15 Soal Komprehensif (Variasi Mudah - Sulit)"
                        ],
                        "info": "Berapa banyak butir pertanyaan yang dibutuhkan?"
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Pembuat Kuis & Soal Ujian Interaktif.",
        output: "natural_language_prompt"
      },
      "Generator Rencana Pembelajaran (Lesson Plan)": {
        description:
          "Bantu guru dan instruktur membuat rencana pembelajaran (RPP) yang terstruktur dan efektif.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perencana Pembelajaran. AI akan membantu menyusun rencana pembelajaran yang terstruktur dan efektif, dengan mempertimbangkan mata pelajaran, tingkat kelas, topik, dan tujuan pembelajaran untuk merancang aktivitas dan penilaian yang sesuai.",
        components: [
          {
            name: "subject",
            label: "Mata Pelajaran",
            type: "text",
            placeholder: "e.g., 'Sejarah, Matematika, Biologi'",
            info: "Bidang studi yang akan diajarkan.",
            validation: { min_length: 2 },
          },
          {
            name: "gradeLevel",
            label: "Tingkat Kelas",
            type: "text",
            placeholder: "e.g., 'Kelas 10 SMA, Kelas 5 SD'",
            info: "Tingkat pendidikan dari siswa.",
            validation: { min_length: 3 },
          },
          {
            name: "topic",
            label: "Topik Spesifik Pelajaran",
            type: "text",
            placeholder: "e.g., 'Perang Dunia II, Fotosintesis, Aljabar Dasar'",
            info: "Materi utama yang akan dibahas dalam sesi ini.",
            validation: { min_length: 5 },
          },
          {
            name: "duration",
            label: "Durasi Pelajaran (menit)",
            type: "number",
            placeholder: "e.g., 90",
            info: "Total waktu yang tersedia untuk pelajaran.",
            validation: { min_value: 15, max_value: 240 },
          },
          {
            name: "learningObjectives",
            label: "Tujuan Pembelajaran",
            type: "textarea",
            placeholder:
              "e.g., 'Siswa mampu menjelaskan 3 penyebab utama PD II. Siswa dapat mengidentifikasi klorofil dalam diagram sel tumbuhan.'",
            info: "Apa yang harus bisa dilakukan siswa setelah pelajaran selesai? Gunakan kata kerja yang terukur.",
            validation: { min_length: 20 },
          },
          {
            name: "activities",
            label: "Ide Aktivitas Pembelajaran",
            type: "textarea",
            placeholder:
              "e.g., 'Diskusi kelompok, eksperimen sederhana, menonton video pendek, kuis.'",
            info: "Bagaimana cara Anda akan menyampaikan materi?",
            validation: { min_length: 20 },
          },
          {
            name: "assessment",
            label: "Metode Penilaian/Evaluasi",
            type: "text",
            placeholder:
              "e.g., 'Lembar kerja, presentasi kelompok, esai singkat'",
            info: "Bagaimana Anda akan mengukur pemahaman siswa?",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Fokus pada pembelajaran berbasis proyek. Sertakan satu aktivitas yang melibatkan gerakan fisik. Pelajaran ini dilakukan secara online.",
            info: "Kebutuhan khusus atau batasan yang perlu diperhatikan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Asisten Penulis Esai Akademis": {
        description:
          "Bantu membuat kerangka, argumen, dan kalimat tesis yang kuat untuk esai akademis.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Esai Akademis. AI akan membantu menyusun kerangka, argumen, dan kalimat tesis yang kuat untuk esai akademis, dengan fokus pada pertanyaan esai, posisi argumen, dan poin-poin pendukung.",
        components: [
          {
            name: "essayQuestion",
            label: "Pertanyaan atau Topik Esai",
            type: "text",
            placeholder:
              "e.g., 'Diskusikan dampak Revolusi Industri terhadap masyarakat urban.'",
            info: "Tuliskan pertanyaan esai persis seperti yang diberikan.",
            validation: { min_length: 10 },
          },
          {
            name: "myStance",
            label: "Posisi/Argumen Utama Saya",
            type: "text",
            placeholder:
              "e.g., 'Revolusi Industri memiliki dampak ganda: kemajuan ekonomi dan kemunduran sosial.'",
            info: "Apa jawaban atau argumen utama Anda terhadap pertanyaan tersebut?",
            validation: { min_length: 10 },
          },
          {
            name: "supportingPoints",
            label: "Poin-Poin Pendukung (Opsional)",
            type: "textarea",
            placeholder:
              "Poin 1: Munculnya kelas pekerja baru.\nPoin 2: Kondisi hidup yang buruk di kota.\nPoin 3: Teknologi baru meningkatkan produksi.",
            info: "Sebutkan 2-3 argumen utama yang akan mendukung posisi Anda.",
            optional: true,
            validation: { min_length: 20 },
          },
          {
            name: "essayType",
            label: "Jenis Esai",
            type: "select",
            options: [
              "Argumentatif",
              "Komparatif (Bandingkan & Kontraskan)",
              "Analitis",
              "Ekspositori",
              "Lainnya...",
            ],
            info: "Jenis esai akan menentukan struktur dan pendekatan.",
          },
          {
            name: "outputToGenerate",
            label: "Output yang Diinginkan",
            type: "select",
            options: [
              "Hanya Kalimat Tesis",
              "Kerangka Esai Lengkap (Outline)",
              "Paragraf Pembuka",
              "Lainnya...",
            ],
            info: "Pilih bagian mana dari esai yang Anda perlukan bantuannya.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan bahasa akademis yang formal. Sertakan satu argumen tandingan (counter-argument) dalam kerangka. Tesis harus jelas dan dapat diperdebatkan.",
            info: "Instruksi spesifik tentang gaya penulisan atau struktur esai.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Soal Kuis & Ujian": {
        description:
          "Buat berbagai jenis soal (pilihan ganda, esai singkat) berdasarkan materi pelajaran yang diberikan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pembuat Soal Ujian. AI akan membuat berbagai jenis soal kuis dan ujian berdasarkan materi pelajaran yang diberikan, dengan mempertimbangkan jenis soal, jumlah, dan tingkat kesulitan yang diinginkan.",
        components: [
          {
            name: "subjectMatter",
            label: "Materi Pelajaran",
            type: "textarea",
            placeholder:
              "Tempelkan teks atau poin-poin materi pelajaran di sini. Semakin detail, semakin baik.",
            info: "AI akan menggunakan teks ini sebagai dasar untuk membuat soal.",
            validation: { min_length: 3 },
          },
          {
            name: "questionType",
            label: "Jenis Soal",
            type: "select",
            options: [
              "Pilihan Ganda",
              "Esai Singkat",
              "Benar/Salah",
              "Isian Singkat",
              "Campuran",
              "Lainnya...",
            ],
            info: "Pilih format soal yang Anda butuhkan.",
          },
          {
            name: "numberOfQuestions",
            label: "Jumlah Soal",
            type: "number",
            placeholder: "e.g., 10",
            info: "Berapa banyak soal yang ingin Anda buat?",
            validation: { min_value: 1, max_value: 20 },
          },
          {
            name: "difficultyLevel",
            label: "Tingkat Kesulitan",
            type: "select",
            options: [
              "Mudah (Pemahaman Dasar)",
              "Menengah (Aplikasi Konsep)",
              "Sulit (Analisis & Evaluasi)",
              "Lainnya...",
            ],
            info: "Tingkat kesulitan akan mempengaruhi kompleksitas soal.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Untuk pilihan ganda, buat pengecoh yang masuk akal. Sertakan kunci jawaban. Soal harus berbasis studi kasus.",
            info: "Instruksi spesifik untuk pembuatan soal dan kunci jawaban.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Pembuat Abstrak Penelitian": {
        description:
          "Bantu peneliti merangkum makalah atau penelitian yang kompleks menjadi abstrak yang padat dan informatif.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Abstrak Penelitian. AI akan merangkum makalah atau penelitian yang kompleks menjadi abstrak yang padat dan informatif, dengan fokus pada latar belakang, metodologi, temuan utama, dan implikasi.",
        components: [
          {
            name: "researchTitle",
            label: "Judul Penelitian",
            type: "text",
            placeholder:
              "e.g., 'Pengaruh Tidur Cukup Terhadap Produktivitas Kerja'",
            info: "Judul lengkap dari makalah atau penelitian Anda.",
            validation: { min_length: 10 },
          },
          {
            name: "background",
            label: "Latar Belakang/Konteks",
            type: "textarea",
            placeholder:
              "Jelaskan secara singkat masalah atau celah pengetahuan yang mendorong penelitian ini.",
            info: "Satu atau dua kalimat untuk memberikan konteks.",
            validation: { min_length: 20 },
          },
          {
            name: "methods",
            label: "Metodologi",
            type: "textarea",
            placeholder:
              "e.g., 'Survei kuantitatif terhadap 200 karyawan di industri teknologi.'",
            info: "Jelaskan secara singkat bagaimana Anda melakukan penelitian.",
            validation: { min_length: 20 },
          },
          {
            name: "keyFindings",
            label: "Temuan Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Ditemukan korelasi positif yang signifikan. Karyawan yang tidur 7-8 jam 30% lebih produktif.'",
            info: "Sebutkan hasil terpenting dari penelitian Anda.",
            validation: { min_length: 20 },
          },
          {
            name: "conclusion",
            label: "Kesimpulan & Implikasi",
            type: "textarea",
            placeholder:
              "e.g., 'Kebijakan kerja yang mendukung keseimbangan hidup-kerja dapat meningkatkan kinerja perusahaan.'",
            info: "Apa arti dari temuan Anda? Apa implikasinya?",
            validation: { min_length: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat abstrak tidak lebih dari 250 kata. Gunakan bahasa yang sesuai untuk jurnal akademis. Sertakan 3-5 kata kunci di akhir.",
            info: "Batasan atau persyaratan format yang spesifik.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Komunikasi Profesional": {
      "Email Penawaran Kerjasama & Endorsement": {
        description: "Naskah email penawaran kolaborasi resmi antara kreator/influencer dan brand bisnis dengan proporsi nilai yang jelas.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Talent Manager & Partnership Lead. AI menyusun proposal penawaran email yang profesional, ringkas, memaparkan demografi audiens, dan mengajukan opsi bentuk kolaborasi.",
        components: [
          {
            name: "brandName",
            label: "Nama Brand / Klien Sasaran",
            type: "text",
            placeholder: "e.g., 'Kopi Kenangan / Erigo Apparel'",
            info: "Nama perusahaan atau brand yang diajak bekerjasama.",
          },
          {
            name: "creatorProfile",
            label: "Profil Singkat & Niche Akun Anda",
            type: "text",
            placeholder: "e.g., 'Food vlogger di Jakarta dengan 50K followers dan 8% engagement rate'",
            info: "Jelaskan siapa Anda dan fokus konten yang Anda buat.",
          },
          {
            name: "proposedCollaboration",
            label: "Bentuk Kerjasama yang Ditawarkan",
            type: "select",
            options: ["Review Produk & Video TikTok / Reels", "Dedicated YouTube Video Integration", "Event Attendance & Live Story Coverage", "Paket Bundling Multi-Platform (IG + TikTok + YouTube)"],
            info: "Pilih output konten yang ingin Anda kerjakan.",
          },
          {
            name: "mutualBenefit",
            label: "Keuntungan Spesifik bagi Brand",
            type: "textarea",
            placeholder: "e.g., 'Menjangkau audiens pecinta kuliner usia 18-30 tahun di Jabodetabek dengan visual review estetik.'",
            info: "Kenapa brand untung besar jika bekerjasama dengan Anda?",
          },
        ],
        id_kerangka: "FW-EMAILPE",
        nama_kerangka: "Email Penawaran Kerjasama & Endorsement",
        version: "2.0",
        kategori: ["Teks & Konten", "Komunikasi Profesional"],
        perspektif_user: "Pengguna ingin meracik prompt Email Penawaran Kerjasama & Endorsement berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Talent Manager & Partnership Lead. AI menyusun proposal penawaran email yang profesional, ringkas, memaparkan demografi audiens, dan mengajukan opsi bentuk kolaborasi.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Talent Manager & Partnership Lead. AI menyusun proposal penawaran email yang profesional, ringkas, memaparkan demografi audiens, dan mengajukan opsi bentuk kolaborasi.",
          KONTEKS: "Naskah email penawaran kolaborasi resmi antara kreator/influencer dan brand bisnis dengan proporsi nilai yang jelas.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "brandName": {
                        "name": "brandName",
                        "label": "Nama Brand / Klien Sasaran",
                        "type": "text",
                        "placeholder": "e.g., 'Kopi Kenangan / Erigo Apparel'",
                        "options": [],
                        "info": "Nama perusahaan atau brand yang diajak bekerjasama."
            },
            "creatorProfile": {
                        "name": "creatorProfile",
                        "label": "Profil Singkat & Niche Akun Anda",
                        "type": "text",
                        "placeholder": "e.g., 'Food vlogger di Jakarta dengan 50K followers dan 8% engagement rate'",
                        "options": [],
                        "info": "Jelaskan siapa Anda dan fokus konten yang Anda buat."
            },
            "proposedCollaboration": {
                        "name": "proposedCollaboration",
                        "label": "Bentuk Kerjasama yang Ditawarkan",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Review Produk & Video TikTok / Reels",
                                    "Dedicated YouTube Video Integration",
                                    "Event Attendance & Live Story Coverage",
                                    "Paket Bundling Multi-Platform (IG + TikTok + YouTube)"
                        ],
                        "info": "Pilih output konten yang ingin Anda kerjakan."
            },
            "mutualBenefit": {
                        "name": "mutualBenefit",
                        "label": "Keuntungan Spesifik bagi Brand",
                        "type": "textarea",
                        "placeholder": "e.g., 'Menjangkau audiens pecinta kuliner usia 18-30 tahun di Jabodetabek dengan visual review estetik.'",
                        "options": [],
                        "info": "Kenapa brand untung besar jika bekerjasama dengan Anda?"
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Email Penawaran Kerjasama & Endorsement.",
        output: "natural_language_prompt"
      },
      "Pembuat Proposal Jasa Freelance (1 Halaman)": {
        description: "Template proposal jasa freelance satu halaman yang ringkas, fokus pada pemecahan masalah klien, deliverable, dan estimasi investasi.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Freelance Business Consultant. AI menyusun proposal 1-halaman yang to-the-point: Pemahaman Masalah Klien, Solusi & Deliverable, Timeline Kerja, dan Opsi Investasi.",
        components: [
          {
            name: "clientNameAndProject",
            label: "Nama Klien & Jenis Proyek",
            type: "text",
            placeholder: "e.g., 'Klinik Gigi Sehat - Redesain Website & SEO'",
            info: "Siapa kliennya dan apa lingkup pekerjaannya?",
          },
          {
            name: "clientProblem",
            label: "Masalah Klien yang Ingin Diatasi",
            type: "textarea",
            placeholder: "e.g., 'Website lama tidak mobile-friendly, loading lambat, dan belum ada booking appointment online.'",
            info: "Tunjukkan bahwa Anda memahami keluhan utama mereka.",
          },
          {
            name: "scopeOfWork",
            label: "Deliverable / Hasil Kerja yang Diberikan",
            type: "textarea",
            placeholder: "e.g., 'Desain 5 halaman responsif, integrasi sistem booking WhatsApp otomatis, dan optimasi kecepatan web.'",
            info: "Apa saja output nyata yang akan diterima klien?",
          },
          {
            name: "timelineAndPricing",
            label: "Estimasi Waktu Pengerjaan & Biaya",
            type: "text",
            placeholder: "e.g., '14 Hari Kerja | Investasi: Rp 4.500.000 (Bisa Termin 2x)'",
            info: "Durasi pengerjaan dan nominal harga jasa Anda.",
          },
        ],
        id_kerangka: "FW-PEMBUAT",
        nama_kerangka: "Pembuat Proposal Jasa Freelance (1 Halaman)",
        version: "2.0",
        kategori: ["Teks & Konten", "Komunikasi Profesional"],
        perspektif_user: "Pengguna ingin meracik prompt Pembuat Proposal Jasa Freelance (1 Halaman) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Freelance Business Consultant. AI menyusun proposal 1-halaman yang to-the-point: Pemahaman Masalah Klien, Solusi & Deliverable, Timeline Kerja, dan Opsi Investasi.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Freelance Business Consultant. AI menyusun proposal 1-halaman yang to-the-point: Pemahaman Masalah Klien, Solusi & Deliverable, Timeline Kerja, dan Opsi Investasi.",
          KONTEKS: "Template proposal jasa freelance satu halaman yang ringkas, fokus pada pemecahan masalah klien, deliverable, dan estimasi investasi.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "clientNameAndProject": {
                        "name": "clientNameAndProject",
                        "label": "Nama Klien & Jenis Proyek",
                        "type": "text",
                        "placeholder": "e.g., 'Klinik Gigi Sehat - Redesain Website & SEO'",
                        "options": [],
                        "info": "Siapa kliennya dan apa lingkup pekerjaannya?"
            },
            "clientProblem": {
                        "name": "clientProblem",
                        "label": "Masalah Klien yang Ingin Diatasi",
                        "type": "textarea",
                        "placeholder": "e.g., 'Website lama tidak mobile-friendly, loading lambat, dan belum ada booking appointment online.'",
                        "options": [],
                        "info": "Tunjukkan bahwa Anda memahami keluhan utama mereka."
            },
            "scopeOfWork": {
                        "name": "scopeOfWork",
                        "label": "Deliverable / Hasil Kerja yang Diberikan",
                        "type": "textarea",
                        "placeholder": "e.g., 'Desain 5 halaman responsif, integrasi sistem booking WhatsApp otomatis, dan optimasi kecepatan web.'",
                        "options": [],
                        "info": "Apa saja output nyata yang akan diterima klien?"
            },
            "timelineAndPricing": {
                        "name": "timelineAndPricing",
                        "label": "Estimasi Waktu Pengerjaan & Biaya",
                        "type": "text",
                        "placeholder": "e.g., '14 Hari Kerja | Investasi: Rp 4.500.000 (Bisa Termin 2x)'",
                        "options": [],
                        "info": "Durasi pengerjaan dan nominal harga jasa Anda."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Pembuat Proposal Jasa Freelance (1 Halaman).",
        output: "natural_language_prompt"
      },
      "Optimalisasi CV & Resume Lolos ATS": {
        description: "Ubah deskripsi pengalaman kerja pada CV menjadi poin-poin pencapaian berbasis data dan kata kunci kuat agar lolos filter ATS.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Certified Resume Writer & ATS Specialist. AI mengonversi riwayat kerja menjadi formula XYZ Google (Accomplished [X] as measured by [Y], by doing [Z]).",
        components: [
          {
            name: "targetRole",
            label: "Posisi Karir yang Dituju",
            type: "text",
            placeholder: "e.g., 'Social Media Manager / Data Analyst'",
            info: "Posisi yang sedang Anda incar.",
          },
          {
            name: "currentExperienceBullets",
            label: "Uraian Pengalaman Kerja Saat Ini",
            type: "textarea",
            placeholder: "e.g., 'Membuat konten Instagram dan membalas komentar followers.'",
            info: "Tuliskan pengalaman kerja Anda apa adanya untuk ditingkatkan mutunya.",
          },
          {
            name: "jobDescriptionKeywords",
            label: "Kata Kunci dari Syarat Lowongan (Opsional)",
            type: "textarea",
            placeholder: "e.g., 'SEO, Copywriting, Canva, TikTok Ads, Growth Strategy'",
            info: "Keahlian atau kata kunci yang diminta dalam info lowongan.",
          },
        ],
        id_kerangka: "FW-OPTIMAL",
        nama_kerangka: "Optimalisasi CV & Resume Lolos ATS",
        version: "2.0",
        kategori: ["Teks & Konten", "Komunikasi Profesional"],
        perspektif_user: "Pengguna ingin meracik prompt Optimalisasi CV & Resume Lolos ATS berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Certified Resume Writer & ATS Specialist. AI mengonversi riwayat kerja menjadi formula XYZ Google (Accomplished [X] as measured by [Y], by doing [Z]).",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Certified Resume Writer & ATS Specialist. AI mengonversi riwayat kerja menjadi formula XYZ Google (Accomplished [X] as measured by [Y], by doing [Z]).",
          KONTEKS: "Ubah deskripsi pengalaman kerja pada CV menjadi poin-poin pencapaian berbasis data dan kata kunci kuat agar lolos filter ATS.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "targetRole": {
                        "name": "targetRole",
                        "label": "Posisi Karir yang Dituju",
                        "type": "text",
                        "placeholder": "e.g., 'Social Media Manager / Data Analyst'",
                        "options": [],
                        "info": "Posisi yang sedang Anda incar."
            },
            "currentExperienceBullets": {
                        "name": "currentExperienceBullets",
                        "label": "Uraian Pengalaman Kerja Saat Ini",
                        "type": "textarea",
                        "placeholder": "e.g., 'Membuat konten Instagram dan membalas komentar followers.'",
                        "options": [],
                        "info": "Tuliskan pengalaman kerja Anda apa adanya untuk ditingkatkan mutunya."
            },
            "jobDescriptionKeywords": {
                        "name": "jobDescriptionKeywords",
                        "label": "Kata Kunci dari Syarat Lowongan (Opsional)",
                        "type": "textarea",
                        "placeholder": "e.g., 'SEO, Copywriting, Canva, TikTok Ads, Growth Strategy'",
                        "options": [],
                        "info": "Keahlian atau kata kunci yang diminta dalam info lowongan."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Optimalisasi CV & Resume Lolos ATS.",
        output: "natural_language_prompt"
      },
      "Penulis Email Kantor Diplomatik (Situasi Sensitif)": {
        description: "Susun email kantor yang elegan, tegas, dan sopan untuk situasi canggung (meminta kenaikan gaji, menolak beban kerja berlebih, negosiasi deadline).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Corporate Communication Advisor. AI menuliskan draf email yang menjaga hubungan kerja tetap harmonis sekaligus mempertahankan hak profesional pengguna secara tegas.",
        components: [
          {
            name: "emailScenario",
            label: "Situasi Kantor yang Dihadapi",
            type: "select",
            options: ["Pengajuan Kenaikan Gaji / Promosi Jabatan", "Menolak Tugas Tambahan dengan Sopan & Rasional", "Meminta Perpanjangan Deadline Karena Kendala Nyata", "Klarifikasi Miskomunikasi dengan Atasan / Rekan Kerja", "Surat Pengunduran Diri (Resign) Santun & Berkesan Baik"],
            info: "Pilih situasi komunikasi kantor yang ingin Anda selesaikan.",
          },
          {
            name: "contextAndFacts",
            label: "Fakta & Alasan Pendukung",
            type: "textarea",
            placeholder: "e.g., 'Sudah bekerja 2 tahun dengan capaian target 120%, ingin mengajukan penyesuaian gaji sesuai pasar.'",
            info: "Tuliskan data atau alasan objektif yang memperkuat posisi Anda.",
          },
          {
            name: "tone",
            label: "Nada Bahasa yang Diinginkan",
            type: "select",
            options: ["Formal, Tegas & Profesional", "Hangat, Apresiatif & Kooperatif", "To-The-Point & Solutif"],
            info: "Pilih karakter pembawaan email.",
          },
        ],
        id_kerangka: "FW-PENULIS",
        nama_kerangka: "Penulis Email Kantor Diplomatik (Situasi Sensitif)",
        version: "2.0",
        kategori: ["Teks & Konten", "Komunikasi Profesional"],
        perspektif_user: "Pengguna ingin meracik prompt Penulis Email Kantor Diplomatik (Situasi Sensitif) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Corporate Communication Advisor. AI menuliskan draf email yang menjaga hubungan kerja tetap harmonis sekaligus mempertahankan hak profesional pengguna secara tegas.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Corporate Communication Advisor. AI menuliskan draf email yang menjaga hubungan kerja tetap harmonis sekaligus mempertahankan hak profesional pengguna secara tegas.",
          KONTEKS: "Susun email kantor yang elegan, tegas, dan sopan untuk situasi canggung (meminta kenaikan gaji, menolak beban kerja berlebih, negosiasi deadline).",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "emailScenario": {
                        "name": "emailScenario",
                        "label": "Situasi Kantor yang Dihadapi",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Pengajuan Kenaikan Gaji / Promosi Jabatan",
                                    "Menolak Tugas Tambahan dengan Sopan & Rasional",
                                    "Meminta Perpanjangan Deadline Karena Kendala Nyata",
                                    "Klarifikasi Miskomunikasi dengan Atasan / Rekan Kerja",
                                    "Surat Pengunduran Diri (Resign) Santun & Berkesan Baik"
                        ],
                        "info": "Pilih situasi komunikasi kantor yang ingin Anda selesaikan."
            },
            "contextAndFacts": {
                        "name": "contextAndFacts",
                        "label": "Fakta & Alasan Pendukung",
                        "type": "textarea",
                        "placeholder": "e.g., 'Sudah bekerja 2 tahun dengan capaian target 120%, ingin mengajukan penyesuaian gaji sesuai pasar.'",
                        "options": [],
                        "info": "Tuliskan data atau alasan objektif yang memperkuat posisi Anda."
            },
            "tone": {
                        "name": "tone",
                        "label": "Nada Bahasa yang Diinginkan",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Formal, Tegas & Profesional",
                                    "Hangat, Apresiatif & Kooperatif",
                                    "To-The-Point & Solutif"
                        ],
                        "info": "Pilih karakter pembawaan email."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Penulis Email Kantor Diplomatik (Situasi Sensitif).",
        output: "natural_language_prompt"
      },
      "Email Marketing": {
        description: "Hasilkan naskah email untuk kampanye pemasaran.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Pemasaran Email. AI akan menghasilkan naskah email pemasaran yang persuasif, dengan mempertimbangkan tujuan, produk, segmen penerima, persona pengirim, dan ajakan bertindak untuk memaksimalkan konversi.",
        components: [
          {
            name: "objective",
            label: "Tujuan Email",
            type: "text",
            placeholder: "e.g., 'promo produk baru, newsletter bulanan'",
            info: "Apa hasil yang diharapkan dari email ini?",
            validation: { min_length: 5 },
          },
          {
            name: "productName",
            label: "Nama Produk/Layanan",
            type: "text",
            placeholder: "e.g., 'Langganan Premium Aplikasi X'",
            info: "Fokus utama yang ditawarkan dalam email.",
            validation: { min_length: 5 },
          },
          {
            name: "recipientSegment",
            label: "Segmen Penerima",
            type: "text",
            placeholder: "e.g., 'pelanggan setia, pengguna baru'",
            info: "Jelaskan segmen penerima untuk personalisasi. (Contoh: pengguna yang belum membeli, pelanggan VIP).",
            validation: { min_length: 5 },
          },
          {
            name: "senderPersona",
            label: "Persona Pengirim",
            type: "text",
            placeholder: "e.g., 'CEO, Tim Marketing, Sahabat Brand'",
            info: "Dari sudut pandang siapa email ini ditulis.",
            validation: { min_length: 5 },
          },
          {
            name: "callToAction",
            label: "Call To Action (CTA)",
            type: "text",
            placeholder: "e.g., 'Beli Sekarang, Pelajari Lebih Lanjut'",
            info: "Tindakan spesifik yang Anda ingin penerima lakukan.",
            validation: { min_length: 5 },
          },
          {
            name: "tone",
            label: "Gaya Bahasa Email",
            type: "select",
            options: [
              "Profesional",
              "Ramah",
              "Mendesak",
              "Antusias",
              "Inspiratif",
              "Lainnya...",
            ],
            info: "Nuansa pesan yang ingin disampaikan dalam email.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Ciptakan rasa urgensi tapi jangan terkesan memaksa. Sebutkan bahwa penawaran ini eksklusif untuk segmen penerima ini. Jangan gunakan emoji.",
            info: "Instruksi khusus untuk AI. Misalnya, target emosi tertentu, atau hal yang harus dihindari.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Email Profesional": {
        description:
          "Buat draf email yang jelas dan efektif untuk berbagai skenario bisnis sehari-hari.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Asisten Komunikasi Profesional. AI akan menyusun draf email profesional yang jelas dan efektif, dengan mempertimbangkan skenario, penerima, informasi kunci, dan tingkat formalitas untuk mencapai tindakan yang diharapkan.",
        components: [
          {
            name: "scenario",
            label: "Skenario Email",
            type: "select",
            options: [
              "Permintaan Informasi",
              "Follow-up Setelah Rapat",
              "Perkenalan Diri/Jaringan",
              "Mengajukan Pertemuan",
              "Ucapan Terima Kasih",
              "Lainnya...",
            ],
            info: "Pilih tujuan utama dari email Anda.",
          },
          {
            name: "recipient",
            label: "Penerima Email",
            type: "text",
            placeholder:
              "e.g., 'Manajer Pemasaran, Calon Klien, Kolega dari departemen lain'",
            info: "Jelaskan siapa penerima dan apa hubungan Anda dengan mereka.",
            validation: { min_length: 5 },
          },
          {
            name: "keyInfo",
            label: "Informasi Kunci yang Harus Disampaikan",
            type: "textarea",
            placeholder:
              "e.g., 'Meminta data penjualan Q3. Mengusulkan jadwal rapat hari Selasa atau Rabu sore. Melampirkan presentasi yang dibahas.'",
            info: "Sebutkan semua poin penting yang harus ada dalam isi email.",
            validation: { min_length: 20 },
          },
          {
            name: "tone",
            label: "Tingkat Formalitas",
            type: "select",
            options: [
              "Sangat Formal",
              "Profesional Standar",
              "Semi-Formal",
              "Santai & Ramah",
              "Lainnya...",
            ],
            info: "Sesuaikan nada email dengan budaya perusahaan dan hubungan Anda dengan penerima.",
          },
          {
            name: "desiredAction",
            label: "Tindakan yang Diharapkan dari Penerima",
            type: "text",
            placeholder: "e.g., 'Memberikan feedback pada dokumen terlampir'",
            info: "Apa yang Anda ingin penerima lakukan setelah membaca email ini?",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat email se-ringkas mungkin. Tawarkan untuk menjelaskan lebih lanjut melalui telepon. Sebutkan bahwa tenggat waktu untuk ini adalah hari Jumat.",
            info: "Instruksi lain yang relevan, seperti urgensi atau informasi latar belakang.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Respon Ulasan Pelanggan": {
        description:
          "Buat balasan yang profesional dan empatik untuk ulasan pelanggan (positif maupun negatif).",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Manajer Hubungan Pelanggan. AI akan menganalisis sentimen ulasan pelanggan dan menghasilkan balasan yang profesional, empatik, dan relevan, dengan mempertimbangkan nama bisnis dan solusi yang ditawarkan.",
        components: [
          {
            name: "originalReview",
            label: "Teks Ulasan Pelanggan",
            type: "textarea",
            placeholder: "Tempelkan ulasan lengkap dari pelanggan di sini.",
            info: "AI akan menganalisis teks ini untuk membuat balasan yang relevan.",
            validation: { min_length: 20 },
          },
          {
            name: "sentiment",
            label: "Sentimen Ulasan",
            type: "select",
            options: [
              "Sangat Positif",
              "Positif",
              "Netral",
              "Negatif",
              "Sangat Negatif",
              "Lainnya...",
            ],
            info: "Bagaimana perasaan pelanggan dalam ulasan tersebut?",
          },
          {
            name: "businessName",
            label: "Nama Bisnis/Produk Anda",
            type: "text",
            placeholder: "e.g., 'Restoran Lezat'",
            info: "Nama yang akan digunakan dalam balasan (misal, 'Terima kasih telah berkunjung ke...').",
            validation: { min_length: 5 },
          },
          {
            name: "solutionOffered",
            label: "Solusi yang Ditawarkan (jika ulasan negatif)",
            type: "text",
            placeholder:
              "e.g., 'Menawarkan voucher, mengundang kembali, menghubungi via email'",
            info: "Langkah konkret apa yang Anda ambil untuk menyelesaikan masalah pelanggan?",
            optional: true,
          },
          {
            name: "tone",
            label: "Gaya Bahasa Balasan",
            type: "select",
            options: [
              "Profesional & Korporat",
              "Hangat & Personal",
              "Cepat & Efisien",
              "Penuh Empati & Pengertian",
              "Lainnya...",
            ],
            info: "Pilih nada yang paling sesuai dengan citra brand Anda.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Sebutkan nama pelanggan jika ada. Ajak pelanggan untuk menghubungi layanan pelanggan secara pribadi. Jangan terdengar defensif. Untuk ulasan positif, tanyakan apa hidangan favorit mereka.",
            info: "Instruksi spesifik tentang apa yang harus atau tidak boleh dikatakan dalam balasan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Naskah Pidato/Presentasi": {
        description:
          "Susun kerangka atau naskah lengkap untuk pidato yang terstruktur dan meyakinkan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Konsultan Pidato. AI akan menyusun naskah pidato atau presentasi yang terstruktur dan meyakinkan, dengan mempertimbangkan profil audiens, pesan inti, dan gaya penyampaian untuk mencapai tujuan komunikasi.",
        components: [
          {
            name: "audienceProfile",
            label: "Profil Audiens",
            type: "text",
            placeholder:
              "e.g., 'Investor teknologi, mahasiswa baru, kolega internal'",
            info: "Memahami audiens adalah kunci. Apa latar belakang dan tingkat pengetahuan mereka?",
            validation: { min_length: 5 },
          },
          {
            name: "coreMessage",
            label: "Pesan Inti (Satu Kalimat)",
            type: "text",
            placeholder:
              "e.g., 'Inovasi berkelanjutan adalah kunci untuk relevansi pasar.'",
            info: "Jika audiens hanya boleh mengingat satu hal, apa itu?",
            validation: { min_length: 10 },
          },
          {
            name: "deliveryStyle",
            label: "Gaya Penyampaian",
            type: "select",
            options: [
              "Inspiratif & Penuh Semangat",
              "Informatif & Berbasis Data",
              "Persuasif & Meyakinkan",
              "Santai & Bercerita",
              "Lainnya...",
            ],
            info: "Pilih nuansa yang paling sesuai dengan pesan dan audiens Anda.",
          },
          {
            name: "duration",
            label: "Target Durasi (menit)",
            type: "number",
            placeholder: "e.g., 15",
            info: "Perkiraan waktu akan menentukan tingkat kedalaman dan jumlah poin.",
            validation: { min_value: 1, max_value: 60 },
          },
          {
            name: "keyPoints",
            label: "Poin-Poin Utama (Opsional)",
            type: "textarea",
            placeholder:
              "e.g., 'Poin 1: Masalah saat ini.\nPoin 2: Solusi yang kami tawarkan.\nPoin 3: Visi masa depan.'",
            info: "Sebutkan poin-poin kunci yang harus ada dalam struktur pidato.",
            optional: true,
            validation: { min_length: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Mulai dengan sebuah cerita pribadi. Sertakan satu kutipan dari tokoh terkenal. Akhiri dengan ajakan bertindak yang jelas. Hindari jargon teknis.",
            info: "Instruksi spesifik tentang elemen pembuka, penutup, atau gaya bahasa.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Surat Lamaran (Cover Letter Writer)": {
        description:
          "Buat surat lamaran kerja yang personal dan meyakinkan untuk posisi spesifik.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Lamaran Kerja. AI akan membuat surat lamaran kerja yang personal dan meyakinkan, menyoroti kualifikasi dan pengalaman relevan pelamar untuk posisi dan perusahaan yang spesifik.",
        components: [
          {
            name: "jobTitle",
            label: "Posisi yang Dilamar",
            type: "text",
            placeholder: "e.g., 'Digital Marketing Specialist'",
            info: "Nama jabatan persis seperti yang tertulis di lowongan.",
            validation: { min_length: 5 },
          },
          {
            name: "companyName",
            label: "Nama Perusahaan",
            type: "text",
            placeholder: "e.g., 'PT Inovasi Digital'",
            info: "Perusahaan yang Anda tuju.",
            validation: { min_length: 5 },
          },
          {
            name: "keyRequirements",
            label: "Kualifikasi Utama dari Lowongan",
            type: "textarea",
            placeholder:
              "Salin-tempel poin-poin kualifikasi utama dari iklan lowongan kerja di sini. Contoh: 'Pengalaman 3 tahun di SEO', 'Menguasai Google Analytics'.",
            info: "Ini adalah bagian terpenting. AI akan menggunakan ini untuk menyesuaikan surat Anda.",
            validation: { min_length: 20 },
          },
          {
            name: "mySkillsAndExperience",
            label: "Pengalaman & Keterampilan Relevan Saya",
            type: "textarea",
            placeholder:
              "e.g., 'Saya telah mengelola kampanye SEO untuk klien e-commerce selama 4 tahun dan berhasil meningkatkan trafik organik sebesar 150%.'",
            info: "Hubungkan pengalaman Anda secara langsung dengan apa yang dicari perusahaan.",
            validation: { min_length: 20 },
          },
          {
            name: "companyKnowledge",
            label: "Pengetahuan Tentang Perusahaan (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Saya terkesan dengan peluncuran produk X baru-baru ini.'",
            info: "Tunjukkan bahwa Anda melakukan riset. Sebutkan proyek, nilai, atau berita terbaru tentang perusahaan.",
            optional: true,
          },
          {
            name: "tone",
            label: "Gaya Bahasa Surat",
            type: "select",
            options: [
              "Profesional & Langsung",
              "Antusias & Penuh Semangat",
              "Kreatif & Menonjol",
              "Formal & Hormat",
              "Lainnya...",
            ],
            info: "Sesuaikan dengan budaya perusahaan yang Anda persepsikan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tonjolkan pengalaman saya dalam memimpin tim. Sebutkan bahwa saya adalah seorang pembelajar yang cepat. Buat agar surat tidak lebih dari 4 paragraf.",
            info: "Instruksi lain yang relevan, seperti panjang surat atau aspek tertentu yang ingin ditonjolkan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Ringkasan Rapat (Meeting Summarizer)": {
        description:
          "Ubah transkrip atau catatan rapat yang panjang menjadi ringkasan yang padat dan berisi daftar tindakan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Notulis Rapat Cerdas. AI akan menganalisis transkrip atau catatan rapat untuk menghasilkan ringkasan yang padat dan daftar tindakan yang jelas, dengan fokus pada poin-poin kunci dan penanggung jawab.",
        components: [
          {
            name: "meetingTranscript",
            label: "Transkrip atau Catatan Rapat",
            type: "textarea",
            placeholder:
              "Tempelkan seluruh transkrip atau catatan detail rapat di sini...",
            info: "Semakin detail inputnya, semakin akurat ringkasannya.",
            validation: { min_length: 50 },
          },
          {
            name: "attendees",
            label: "Daftar Peserta (Opsional)",
            type: "text",
            placeholder: "e.g., 'Andi, Budi (Marketing), Citra (Teknik)'",
            info: "Membantu AI mengidentifikasi siapa mengatakan apa dan siapa yang bertanggung jawab.",
            optional: true,
          },
          {
            name: "summaryStyle",
            label: "Gaya Ringkasan",
            type: "select",
            options: [
              "Poin-Poin Utama",
              "Paragraf Naratif",
              "Tabel Keputusan & Tindakan",
              "Lainnya...",
            ],
            info: "Pilih format output yang paling sesuai dengan kebutuhan Anda.",
          },
          {
            name: "keyTopics",
            label: "Topik Utama yang Dibahas (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Anggaran Q4, Peluncuran Produk Baru, Umpan Balik Klien'",
            info: "Bantu AI untuk fokus pada bagian terpenting dari diskusi.",
            optional: true,
          },
          {
            name: "actionItemsToExtract",
            label: "Fokus Ekstraksi 'Action Items'",
            type: "select",
            options: ["Ya, ekstrak dengan detail", "Tidak perlu", "Lainnya..."],
            info: "Minta AI untuk secara khusus mencari, mengumpulkan, dan mendaftar semua tugas, penanggung jawab, dan tenggat waktu.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Abaikan bagian obrolan santai di awal rapat. Fokus hanya pada keputusan yang dibuat setelah menit ke-10. Tulis ringkasan dalam sudut pandang orang ketiga.",
            info: "Instruksi spesifik tentang bagian mana yang harus difokuskan atau diabaikan oleh AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Memo & Pengumuman Internal": {
        description:
          "Buat pengumuman internal perusahaan yang jelas, ringkas, dan profesional untuk berbagai keperluan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Komunikasi Internal. AI akan membuat memo atau pengumuman internal yang jelas, ringkas, dan profesional, dengan memastikan semua informasi kunci tersampaikan kepada audiens yang dituju.",
        components: [
          {
            name: "subject",
            label: "Subjek Memo/Pengumuman",
            type: "text",
            placeholder: "e.g., 'Perubahan Kebijakan Kerja Jarak Jauh'",
            info: "Judul yang jelas dan langsung ke intinya.",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Ditujukan Kepada",
            type: "text",
            placeholder: "e.g., 'Semua Karyawan', 'Tim Pemasaran'",
            info: "Siapa penerima pesan ini?",
            validation: { min_length: 5 },
          },
          {
            name: "keyInformation",
            label: "Informasi Kunci yang Disampaikan",
            type: "textarea",
            placeholder:
              "e.g., 'Mulai 1 Agustus, kebijakan WFH menjadi 3 hari di kantor, 2 hari di rumah. Alasan: meningkatkan kolaborasi.'",
            info: "Sebutkan poin-poin utama pengumuman secara jelas.",
            validation: { min_length: 20 },
          },
          {
            name: "effectiveDate",
            label: "Tanggal Efektif",
            type: "text",
            placeholder: "e.g., 'Senin, 1 Agustus 2024'",
            info: "Kapan perubahan atau pengumuman ini mulai berlaku?",
            validation: { min_length: 5 },
          },
          {
            name: "sender",
            label: "Pengirim/Departemen",
            type: "text",
            placeholder: "e.g., 'Departemen HR', 'Manajemen'",
            info: "Siapa yang bertanggung jawab atas pengumuman ini?",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan nada yang formal namun suportif. Sertakan link ke dokumen kebijakan lengkap. Sediakan kontak person untuk pertanyaan lebih lanjut.",
            info: "Detail tambahan untuk memastikan pesan tersampaikan dengan baik.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator 'Icebreaker' untuk Rapat": {
        description:
          "Ciptakan pertanyaan atau topik pembuka yang menarik untuk mencairkan suasana di awal rapat.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Fasilitator Rapat. AI akan menciptakan pertanyaan atau topik icebreaker yang menarik dan relevan dengan konteks rapat dan profil tim, bertujuan untuk mencairkan suasana dan mendorong interaksi awal.",
        components: [
          {
            name: "meetingContext",
            label: "Konteks Rapat",
            type: "text",
            placeholder:
              "e.g., 'Rapat mingguan tim', 'Sesi brainstorming proyek baru'",
            info: "Jenis rapat akan menentukan jenis icebreaker yang cocok.",
            validation: { min_length: 5 },
          },
          {
            name: "teamProfile",
            label: "Profil Tim",
            type: "text",
            placeholder:
              "e.g., 'Tim teknis yang introvert, tim kreatif yang ekstrovert'",
            info: "Karakter umum dari peserta rapat.",
            validation: { min_length: 5 },
          },
          {
            name: "icebreakerType",
            label: "Jenis Icebreaker",
            type: "select",
            options: [
              "Pertanyaan Ringan & Lucu",
              "Pertanyaan untuk Mengenal Lebih Dalam",
              "Terkait Pekerjaan tapi Santai",
              "Permainan Cepat (e.g., Dua Kebenaran Satu Kebohongan)",
              "Lainnya...",
            ],
            info: "Pilih jenis interaksi yang Anda inginkan.",
          },
          {
            name: "timeLimit",
            label: "Batasan Waktu (menit)",
            type: "number",
            placeholder: "e.g., 5",
            info: "Berapa lama sesi icebreaker ini akan berlangsung?",
            validation: { min_value: 1, max_value: 30 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Hindari pertanyaan yang terlalu personal. Pastikan icebreaker relevan dengan tema rapat. Buat agar bisa dilakukan secara online.",
            info: "Batasan atau panduan lain untuk memastikan icebreaker berjalan lancar.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Pemasaran & Penjualan": {
      "Deskripsi Produk Marketplace (Shopee & Tokopedia)": {
        description: "Copywriting deskripsi produk toko online yang menonjolkan manfaat emosional, detail spesifikasi, garansi toko, dan pemicu checkout instan.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Senior E-Commerce Copywriter. AI menyusun deskripsi produk dengan formula (Hook Manfaat, Spesifikasi Jelas, Alasan Beli di Sini, FAQ Singkat, dan Call to Action).",
        components: [
          {
            name: "productName",
            label: "Nama Produk Lengkap",
            type: "text",
            placeholder: "e.g., 'Tumbler Termos Stainless Steel 500ml Tahan Panas 24 Jam'",
            info: "Nama dagang produk yang jelas dan mengandung kata kunci pencarian.",
          },
          {
            name: "keyFeatures",
            label: "Fitur & Keunggulan Utama",
            type: "textarea",
            placeholder: "e.g., 'Material SUS 304 food-grade, tutup anti-bocor dengan pengunci ganda, bebas BPA, garansi 1 tahun.'",
            info: "Tuliskan apa saja kelebihan fisik dan fungsi produk.",
          },
          {
            name: "targetCustomer",
            label: "Target Konsumen",
            type: "text",
            placeholder: "e.g., 'Pekerja kantoran, mahasiswa, dan pecinta olahraga gym'",
            info: "Siapa yang paling membutuhkan produk ini?",
          },
          {
            name: "specialOffers",
            label: "Bonus / Garansi / Keamanan Toko",
            type: "text",
            placeholder: "e.g., 'Gratis sikat pembersih, packing bubble wrap tebal, garansi retur jika rusak'",
            info: "Faktor penenang rasa cemas pembeli saat bertransaksi online.",
          },
        ],
        id_kerangka: "FW-DESKRIP",
        nama_kerangka: "Deskripsi Produk Marketplace (Shopee & Tokopedia)",
        version: "2.0",
        kategori: ["Teks & Konten", "Pemasaran & Penjualan"],
        perspektif_user: "Pengguna ingin meracik prompt Deskripsi Produk Marketplace (Shopee & Tokopedia) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Senior E-Commerce Copywriter. AI menyusun deskripsi produk dengan formula (Hook Manfaat, Spesifikasi Jelas, Alasan Beli di Sini, FAQ Singkat, dan Call to Action).",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Senior E-Commerce Copywriter. AI menyusun deskripsi produk dengan formula (Hook Manfaat, Spesifikasi Jelas, Alasan Beli di Sini, FAQ Singkat, dan Call to Action).",
          KONTEKS: "Copywriting deskripsi produk toko online yang menonjolkan manfaat emosional, detail spesifikasi, garansi toko, dan pemicu checkout instan.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "productName": {
                        "name": "productName",
                        "label": "Nama Produk Lengkap",
                        "type": "text",
                        "placeholder": "e.g., 'Tumbler Termos Stainless Steel 500ml Tahan Panas 24 Jam'",
                        "options": [],
                        "info": "Nama dagang produk yang jelas dan mengandung kata kunci pencarian."
            },
            "keyFeatures": {
                        "name": "keyFeatures",
                        "label": "Fitur & Keunggulan Utama",
                        "type": "textarea",
                        "placeholder": "e.g., 'Material SUS 304 food-grade, tutup anti-bocor dengan pengunci ganda, bebas BPA, garansi 1 tahun.'",
                        "options": [],
                        "info": "Tuliskan apa saja kelebihan fisik dan fungsi produk."
            },
            "targetCustomer": {
                        "name": "targetCustomer",
                        "label": "Target Konsumen",
                        "type": "text",
                        "placeholder": "e.g., 'Pekerja kantoran, mahasiswa, dan pecinta olahraga gym'",
                        "options": [],
                        "info": "Siapa yang paling membutuhkan produk ini?"
            },
            "specialOffers": {
                        "name": "specialOffers",
                        "label": "Bonus / Garansi / Keamanan Toko",
                        "type": "text",
                        "placeholder": "e.g., 'Gratis sikat pembersih, packing bubble wrap tebal, garansi retur jika rusak'",
                        "options": [],
                        "info": "Faktor penenang rasa cemas pembeli saat bertransaksi online."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Deskripsi Produk Marketplace (Shopee & Tokopedia).",
        output: "natural_language_prompt"
      },
      "Customer Service & Closing Sales Chat WhatsApp": {
        description: "Script balasan chat WhatsApp ramah, persuasif, dan solutif saat calon pembeli menanyakan harga, menawar, atau ragu-ragu.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah CS & Closing Sales Specialist. AI meracik balasan chat WhatsApp yang ramah, sopan, menjawab keraguan secara elegan, dan diakhiri dengan pertanyaan penutup closing yang halus.",
        components: [
          {
            name: "chatScenario",
            label: "Skenario Pertanyaan Calon Pembeli",
            type: "select",
            options: ["Tanya Harga Pertama Kali (Biar Nggak Cuma 'Read' Doang)", "Menolak karena Merasa Kemahalan", "Ragu Kualitas Produk / Takut Tertipu", "Minta Diskon Tambahan / Ongkir Gratis", "Follow-Up Halus Prospek yang Menghilang (Ghosting)"],
            info: "Pilih situasi obrolan chat yang sedang Anda hadapi.",
          },
          {
            name: "productDetails",
            label: "Nama Produk & Harga / Paket",
            type: "text",
            placeholder: "e.g., 'Paket Skincare Glow Booster Rp 189.000'",
            info: "Sebutkan produk dan nominal penawaran.",
          },
          {
            name: "addedValue",
            label: "Nilai Tambah / Promo Terbatas",
            type: "text",
            placeholder: "e.g., 'Sisa 3 slot free ongkir hari ini + bonus pouch kosmetik eksklusif'",
            info: "Faktor urgensi atau bonus manis untuk memicu transfer segera.",
          },
        ],
        id_kerangka: "FW-CUSTOME",
        nama_kerangka: "Customer Service & Closing Sales Chat WhatsApp",
        version: "2.0",
        kategori: ["Teks & Konten", "Pemasaran & Penjualan"],
        perspektif_user: "Pengguna ingin meracik prompt Customer Service & Closing Sales Chat WhatsApp berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah CS & Closing Sales Specialist. AI meracik balasan chat WhatsApp yang ramah, sopan, menjawab keraguan secara elegan, dan diakhiri dengan pertanyaan penutup closing yang halus.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah CS & Closing Sales Specialist. AI meracik balasan chat WhatsApp yang ramah, sopan, menjawab keraguan secara elegan, dan diakhiri dengan pertanyaan penutup closing yang halus.",
          KONTEKS: "Script balasan chat WhatsApp ramah, persuasif, dan solutif saat calon pembeli menanyakan harga, menawar, atau ragu-ragu.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "chatScenario": {
                        "name": "chatScenario",
                        "label": "Skenario Pertanyaan Calon Pembeli",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Tanya Harga Pertama Kali (Biar Nggak Cuma 'Read' Doang)",
                                    "Menolak karena Merasa Kemahalan",
                                    "Ragu Kualitas Produk / Takut Tertipu",
                                    "Minta Diskon Tambahan / Ongkir Gratis",
                                    "Follow-Up Halus Prospek yang Menghilang (Ghosting)"
                        ],
                        "info": "Pilih situasi obrolan chat yang sedang Anda hadapi."
            },
            "productDetails": {
                        "name": "productDetails",
                        "label": "Nama Produk & Harga / Paket",
                        "type": "text",
                        "placeholder": "e.g., 'Paket Skincare Glow Booster Rp 189.000'",
                        "options": [],
                        "info": "Sebutkan produk dan nominal penawaran."
            },
            "addedValue": {
                        "name": "addedValue",
                        "label": "Nilai Tambah / Promo Terbatas",
                        "type": "text",
                        "placeholder": "e.g., 'Sisa 3 slot free ongkir hari ini + bonus pouch kosmetik eksklusif'",
                        "options": [],
                        "info": "Faktor urgensi atau bonus manis untuk memicu transfer segera."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Customer Service & Closing Sales Chat WhatsApp.",
        output: "natural_language_prompt"
      },
      "Generator Skrip Video Sales Letter (VSL)": {
        description:
          "Buat skrip video penjualan yang mengikuti formula copywriting terbukti untuk memaksimalkan konversi.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Skrip Penjualan. AI akan membuat skrip Video Sales Letter (VSL) yang persuasif, mengikuti formula copywriting terbukti untuk menarik perhatian, membangun minat, menciptakan keinginan, dan mendorong tindakan, dengan fokus pada konversi.",
        components: [
          {
            name: "productName",
            label: "Nama Produk/Layanan",
            type: "text",
            placeholder: "e.g., 'Kursus Online 'Master of Code''",
            info: "Produk yang Anda jual.",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Target Penonton VSL",
            type: "text",
            placeholder:
              "e.g., 'Orang yang ingin beralih karir menjadi programmer'",
            info: "Siapa audiens ideal yang akan menonton video ini?",
            validation: { min_length: 5 },
          },
          {
            name: "hook",
            label: "Hook (Pembuka yang Menarik)",
            type: "textarea",
            placeholder:
              "e.g., 'Sebuah statistik mengejutkan, pertanyaan retoris yang provokatif, atau sebuah janji besar.'",
            info: "Bagaimana cara Anda merebut perhatian penonton dalam 5 detik pertama?",
            validation: { min_length: 20 },
          },
          {
            name: "problem",
            label: "Masalah & Penderitaan Audiens",
            type: "textarea",
            placeholder:
              "e.g., 'Merasa terjebak di pekerjaan yang tidak memuaskan? Khawatir dengan masa depan karir?'",
            info: "Jelaskan masalah yang dihadapi audiens yang bisa diselesaikan oleh produk Anda.",
            validation: { min_length: 20 },
          },
          {
            name: "solution",
            label: "Produk Anda sebagai Solusi",
            type: "textarea",
            placeholder:
              "e.g., 'Kursus kami adalah jembatan menuju karir impian Anda, memberikan peta jalan yang jelas...'",
            info: "Perkenalkan produk Anda sebagai solusi dari masalah mereka.",
            validation: { min_length: 20 },
          },
          {
            name: "offer",
            label: "Penawaran Spesifik",
            type: "textarea",
            placeholder:
              "e.g., 'Akses seumur hidup ke semua modul, bonus e-book, komunitas eksklusif. Harga diskon 50% hanya untuk 24 jam.'",
            info: "Jelaskan secara detail apa yang akan mereka dapatkan dan urgensinya.",
            validation: { min_length: 20 },
          },
          {
            name: "callToAction",
            label: "Call to Action (CTA)",
            type: "text",
            placeholder: "e.g., 'Klik tombol di bawah ini sekarang juga!'",
            info: "Perintah akhir yang spesifik dan mendesak.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan nada yang sangat empatik di bagian 'masalah'. Buat penawaran terasa sangat bernilai. Ulangi CTA sebanyak 3 kali di akhir.",
            info: "Instruksi tentang gaya penyampaian, emosi yang ditargetkan, atau struktur VSL.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Pembuat Proposisi Nilai (Value Proposition)": {
        description:
          "Rumuskan pernyataan yang jelas dan ringkas tentang mengapa pelanggan harus memilih produk Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Strategis Nilai Produk. AI akan merumuskan proposisi nilai yang jelas dan ringkas, menyoroti masalah yang diselesaikan, manfaat utama, dan pembeda dari kompetitor untuk meyakinkan pelanggan.",
        components: [
          {
            name: "productName",
            label: "Nama Produk/Layanan",
            type: "text",
            placeholder: "e.g., 'Aplikasi FinTrack'",
            info: "Fokus dari proposisi nilai ini.",
            validation: { min_length: 5 },
          },
          {
            name: "targetCustomer",
            label: "Segmen Pelanggan Target",
            type: "text",
            placeholder: "e.g., 'Freelancer, pemilik usaha kecil'",
            info: "Untuk siapa produk ini diciptakan?",
            validation: { min_length: 5 },
          },
          {
            name: "customerProblem",
            label: "Masalah yang Diselesaikan",
            type: "textarea",
            placeholder:
              "e.g., 'Kesulitan melacak pengeluaran bisnis dan pribadi secara terpisah, membuang waktu saat musim pajak.'",
            info: "Jelaskan 'penderitaan' yang dialami pelanggan.",
            validation: { min_length: 20 },
          },
          {
            name: "mainBenefit",
            label: "Manfaat Utama yang Ditawarkan",
            type: "textarea",
            placeholder:
              "e.g., 'Memberikan kejelasan finansial dan menghemat waktu berjam-jam dengan pelaporan otomatis.'",
            info: "Bagaimana produk Anda membuat hidup mereka lebih baik?",
            validation: { min_length: 20 },
          },
          {
            name: "differentiator",
            label: "Pembeda dari Kompetitor",
            type: "text",
            placeholder:
              "e.g., 'Satu-satunya aplikasi dengan integrasi AI untuk prediksi arus kas.'",
            info: "Apa yang membuat Anda unik dan lebih baik dari yang lain?",
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat dalam format: 'Untuk [pelanggan], yang [masalah], produk kami [solusi] tidak seperti [kompetitor].' Fokus pada kesederhanaan.",
            info: "Instruksi tentang format atau kata-kata kunci yang ingin digunakan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Konten Pilar & Klaster Topik": {
        description:
          "Rencanakan strategi konten SEO dengan mengidentifikasi satu topik pilar utama dan beberapa klaster topik pendukungnya.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Arsitek Konten SEO. AI akan membantu merencanakan strategi konten SEO dengan mengidentifikasi topik pilar utama dan klaster topik pendukung, memastikan cakupan konten yang komprehensif dan terstruktur.",
        components: [
          {
            name: "mainTheme",
            label: "Tema Utama Bisnis/Website",
            type: "text",
            placeholder: "e.g., 'Hidup Sehat Organik'",
            info: "Topik luas yang menjadi payung dari semua konten Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Target Audiens",
            type: "text",
            placeholder: "e.g., 'Ibu muda yang peduli kesehatan keluarga'",
            info: "Siapa yang ingin Anda jangkau dengan konten ini?",
            validation: { min_length: 5 },
          },
          {
            name: "pillarTopic",
            label: "Ide Topik Pilar",
            type: "text",
            placeholder: "e.g., 'Panduan Lengkap Memulai Diet Organik'",
            info: "Satu konten yang sangat komprehensif yang bisa dipecah menjadi banyak artikel kecil.",
            validation: { min_length: 10 },
          },
          {
            name: "clusterCount",
            label: "Jumlah Klaster Topik yang Diinginkan",
            type: "number",
            placeholder: "e.g., 10",
            info: "Berapa banyak ide artikel pendukung yang ingin Anda hasilkan?",
            validation: { min_value: 1, max_value: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Fokus pada topik untuk pemula. Hindari topik yang membutuhkan biaya mahal. Setiap klaster topik harus bisa menjadi judul artikel blog.",
            info: "Panduan untuk AI agar ide yang dihasilkan lebih sesuai dengan strategi Anda.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Postingan Media Sosial": {
        description:
          "Buat postingan yang menarik dan ringkas untuk berbagai platform.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Konten Media Sosial. AI akan membuat postingan media sosial yang menarik dan ringkas, disesuaikan dengan platform yang dipilih dan tujuan komunikasi.",
        components: [
          {
            name: "platform",
            label: "Pilih Platform",
            type: "select",
            options: [
              "LinkedIn",
              "Instagram",
              "Twitter (X)",
              "Facebook",
              "TikTok",
            ],
            info: "Setiap platform memiliki format dan ekspektasi audiens yang berbeda.",
            validation: { regex: "^(?!Pilih Platform...).*$" },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
        dynamicSubcomponents: {
          trigger: "platform",
          options: {
            LinkedIn: [
              {
                name: "postType",
                label: "Jenis Postingan LinkedIn",
                type: "select",
                options: [
                  "Teks Saja",
                  "Artikel",
                  "Polling",
                  "Berbagi Link",
                  "Gambar/Video",
                  "Lainnya...",
                ],
                info: "Pilih format konten yang akan dibuat.",
                validation: { regex: "^(?!Lainnya).*$" },
              },
              {
                name: "topic",
                label: "Topik Pembahasan",
                type: "text",
                placeholder: "e.g., 'Tren terbaru dalam AI generatif'",
                info: "Inti dari pesan yang ingin Anda sampaikan.",
                validation: { min_length: 10 },
              },
              {
                name: "objective",
                label: "Tujuan Postingan",
                type: "select",
                options: [
                  "Thought Leadership",
                  "Networking",
                  "Promosi Layanan",
                  "Merekrut Talenta",
                  "Berbagi Berita",
                  "Lainnya...",
                ],
                info: "Apa yang ingin Anda capai dengan postingan ini?",
                validation: { regex: "^(?!Lainnya).*$" },
              },
              {
                name: "hashtags",
                label: "Hashtag Relevan (pisahkan koma)",
                type: "text",
                placeholder: "e.g., '#AI, #FutureOfWork, #Innovation'",
                info: "Membantu postingan Anda ditemukan oleh audiens yang lebih luas.",
                validation: { min_length: 3 },
              },
            ],
            Instagram: [
              {
                name: "visualDescription",
                label: "Deskripsi Visual Foto/Reel",
                type: "textarea",
                placeholder:
                  "e.g., 'Sebuah foto flat-lay meja kerja yang rapi dengan laptop, secangkir kopi, dan tanaman hias.'",
                info: "Jelaskan elemen visual agar AI bisa membuat caption yang relevan.",
                validation: { min_length: 20 },
              },
              {
                name: "captionStyle",
                label: "Gaya Caption Instagram",
                type: "select",
                options: [
                  "Informatif",
                  "Inspiratif",
                  "Storytelling",
                  "Singkat & Tajam",
                  "Humoris",
                  "Lainnya...",
                ],
                info: "Pilih nuansa teks yang cocok dengan visual Anda.",
              },
              {
                name: "callToAction",
                label: "Call To Action",
                type: "text",
                placeholder:
                  "e.g., 'Simpan postingan ini!', 'Komentari pendapatmu!'",
                info: "Ajak audiens untuk berinteraksi.",
                validation: { min_length: 5 },
              },
              {
                name: "hashtags",
                label: "Hashtag (pisahkan koma)",
                type: "text",
                placeholder: "e.g., '#workfromhome, #productivity, #desksetup'",
                info: "Gunakan campuran hashtag populer dan niche.",
                validation: { min_length: 3 },
              },
            ],
            "Twitter (X)": [
              {
                name: "tweetFormat",
                label: "Format Tweet",
                type: "select",
                options: [
                  "Single Tweet",
                  "Thread (Rangkaian Tweet)",
                  "Lainnya...",
                ],
                info: "Apakah ini tweet tunggal atau rangkaian bersambung?",
              },
              {
                name: "topic",
                label: "Topik Utama",
                type: "text",
                placeholder: "e.g., 'Kesan pertama menggunakan produk Y'",
                info: "Poin utama dari tweet atau thread Anda.",
                validation: { min_length: 10 },
              },
              {
                name: "hook",
                label: "Kalimat Pembuka (Hook)",
                type: "text",
                placeholder:
                  "e.g., 'Saya baru saja mencoba Y dan ini hasilnya...'",
                info: "Kalimat pertama yang membuat orang berhenti scrolling.",
                validation: { min_length: 10 },
              },
              {
                name: "tone",
                label: "Gaya Bahasa Twitter",
                type: "select",
                options: [
                  "Santai",
                  "Profesional",
                  "Humoris",
                  "Provokatif",
                  "Informatif",
                  "Lainnya...",
                ],
                info: "Sesuaikan gaya bahasa dengan audiens Twitter.",
              },
            ],
            Facebook: [
              {
                name: "postType",
                label: "Jenis Postingan Facebook",
                type: "select",
                options: [
                  "Berbagi Cerita",
                  "Update Produk",
                  "Bertanya",
                  "Berbagi Link/Artikel",
                  "Event",
                  "Lainnya...",
                ],
                info: "Pilih format yang paling sesuai dengan pesan Anda.",
              },
              {
                name: "targetAudience",
                label: "Target Audiens Facebook",
                type: "text",
                placeholder:
                  "e.g., 'Anggota grup Komunitas Z', 'Pengikut Halaman'",
                info: "Siapa audiens spesifik yang Anda sapa?",
                validation: { min_length: 5 },
              },
              {
                name: "visualIdea",
                label: "Ide Visual Pendamping",
                type: "text",
                placeholder:
                  "e.g., 'Album foto acara kemarin, infografis sederhana'",
                info: "Deskripsikan gambar atau video yang akan menyertai teks.",
                validation: { min_length: 10 },
              },
              {
                name: "interactionGoal",
                label: "Tujuan Interaksi",
                type: "text",
                placeholder: "e.g., 'Memicu diskusi di kolom komentar'",
                info: "Jenis respons apa yang Anda harapkan?",
                validation: { min_length: 5 },
              },
            ],
            TikTok: [
              {
                name: "videoConcept",
                label: "Konsep Video Singkat",
                type: "textarea",
                placeholder:
                  "e.g., 'Transisi sebelum dan sesudah menggunakan produk X dengan lagu yang sedang tren.'",
                info: "Jelaskan alur cerita atau konsep visual video Anda.",
                validation: { min_length: 20 },
              },
              {
                name: "trendingSound",
                label: "Saran Suara/Lagu Tren",
                type: "text",
                placeholder: "e.g., 'Gunakan lagu 'xyz' yang sedang viral'",
                info: "Sebutkan nama lagu atau jenis suara untuk meningkatkan jangkauan.",
                optional: true,
              },
              {
                name: "caption",
                label: "Teks Caption TikTok",
                type: "text",
                placeholder: "e.g., 'Jangan kaget sama hasilnya! ✨'",
                info: "Buat caption yang singkat, menarik, dan relevan dengan video.",
                validation: { min_length: 5 },
              },
              {
                name: "hashtags",
                label: "Hashtag FYP (pisahkan koma)",
                type: "text",
                placeholder: "e.g., '#fyp, #productreview, #lifehack'",
                info: "Gunakan hashtag yang sedang tren untuk masuk For You Page.",
                validation: { min_length: 3 },
              },
            ],
          },
        },
      },
      "Penulis Teks Iklan (Ad Copy)": {
        description:
          "Buat teks iklan pendek dan persuasif untuk platform seperti Google Ads atau Facebook Ads.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Iklan Digital. AI akan membuat teks iklan yang pendek, persuasif, dan dioptimalkan untuk platform tertentu, dengan fokus pada manfaat unik dan ajakan bertindak yang jelas.",
        components: [
          {
            name: "platform",
            label: "Platform Iklan",
            type: "select",
            options: [
              "Google Ads",
              "Facebook/Instagram Ads",
              "LinkedIn Ads",
              "Twitter Ads",
              "Lainnya...",
            ],
            info: "Setiap platform memiliki batasan karakter dan format yang berbeda.",
          },
          {
            name: "product",
            label: "Produk/Jasa yang Diiklankan",
            type: "text",
            placeholder: "e.g., 'Software CRM untuk UKM'",
            info: "Apa yang Anda promosikan?",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Target Audiens Iklan",
            type: "text",
            placeholder: "e.g., 'Pemilik usaha kecil, manajer penjualan'",
            info: "Siapa yang ingin Anda jangkau dengan iklan ini?",
            validation: { min_length: 5 },
          },
          {
            name: "uniqueBenefit",
            label: "Manfaat Unik & Utama",
            type: "text",
            placeholder: "e.g., 'Hemat waktu 10 jam per minggu'",
            info: "Apa satu manfaat paling kuat yang akan menarik perhatian?",
            validation: { min_length: 10 },
          },
          {
            name: "callToAction",
            label: "Call to Action (CTA)",
            type: "text",
            placeholder: "e.g., 'Coba Gratis Sekarang', 'Unduh Laporannya'",
            info: "Perintah yang jelas dan spesifik untuk pengguna.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat 3 variasi headline. Gunakan nada yang mendesak. Tonjolkan penawaran diskon 20%.",
            info: "Instruksi spesifik tentang jumlah variasi, nada, atau penawaran.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Pembuat Urutan Email Otomatis": {
        description:
          "Rancang serangkaian email (misal: welcome series, nurture sequence) untuk memandu pelanggan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Otomatisasi Email. AI akan merancang serangkaian email otomatis yang terstruktur untuk memandu pelanggan melalui siklus hidup tertentu, dengan mempertimbangkan jenis urutan, produk, dan tujuan akhir.",
        components: [
          {
            name: "sequenceType",
            label: "Jenis Urutan Email",
            type: "select",
            options: [
              "Welcome Series (untuk pelanggan baru)",
              "Nurture Sequence (untuk prospek)",
              "Re-engagement (untuk pengguna tidak aktif)",
              "Lainnya...",
            ],
            info: "Pilih tujuan utama dari rangkaian email ini.",
          },
          {
            name: "product",
            label: "Produk/Layanan Terkait",
            type: "text",
            placeholder: "e.g., 'Aplikasi produktivitas 'Fokus''",
            info: "Fokus dari konten email.",
            validation: { min_length: 5 },
          },
          {
            name: "numberOfEmails",
            label: "Jumlah Email dalam Urutan",
            type: "number",
            placeholder: "e.g., 5",
            info: "Berapa banyak email yang akan ada dalam rangkaian ini?",
            validation: { min_value: 1, max_value: 10 },
          },
          {
            name: "sequenceGoal",
            label: "Tujuan Akhir Urutan Email",
            type: "text",
            placeholder:
              "e.g., 'Mendorong pengguna untuk upgrade ke versi Pro'",
            info: "Apa hasil yang Anda harapkan setelah email terakhir terkirim?",
            validation: { min_length: 10 },
          },
          {
            name: "emailTopics",
            label: "Topik untuk Setiap Email (Opsional)",
            type: "textarea",
            placeholder: `Email 1: Cerita di balik produk
Email 2: Tips menggunakan fitur X
Email 3: Studi kasus pengguna`,
            info: "Jika Anda punya ide, jabarkan alur konten dari email ke email.",
            optional: true,
            validation: { min_length: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Jarak antar email adalah 2 hari. Nada harus semakin persuasif seiring berjalannya urutan. Setiap email harus memiliki satu CTA yang jelas.",
            info: "Instruksi tentang waktu, nada, atau struktur setiap email.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Konten & Pemasaran": {
      "Hook-Story-Offer (HSO) Video Pendek": {
        description: "Formula video pendek (TikTok/Reels/Shorts) dengan pembuka 3 detik yang menghentikan scroll, cerita relatable, dan tawaran aksi yang memikat.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Content Strategist & Viral Scriptwriter. AI merancang naskah video pendek terstruktur (Hook 0-3s, Story 4-45s, Offer 46-60s) dengan visual cues dan intonasi dinamis.",
        components: [
          {
            name: "topic",
            label: "Topik / Inti Konten Video",
            type: "text",
            placeholder: "e.g., '3 Cara Menghemat Uang Gaji Tanpa Tersiksa'",
            info: "Tentukan topik utama yang ingin dibahas dalam video.",
          },
          {
            name: "targetAudience",
            label: "Target Audiens yang Disasar",
            type: "text",
            placeholder: "e.g., 'Anak muda pekerja kantoran (Gen Z & Milenial)'",
            info: "Siapa yang paling relate dengan masalah ini?",
          },
          {
            name: "hookStyle",
            label: "Gaya Hook Pembuka",
            type: "select",
            options: ["Kontrarian (Membantah Mitos Populer)", "Peringatan / Kesalahan Fatal", "Rasa Ingin Tahu / Rahasia Jarang Diketahui", "Transformasi Before-After Mengejutkan", "Pertanyaan Menusuk Emosi Audiens"],
            info: "Pilih pendekatan psikologis untuk 3 detik pertama.",
          },
          {
            name: "coreStory",
            label: "Poin Cerita / Solusi Praktis",
            type: "textarea",
            placeholder: "e.g., 'Jelaskan teknik budgeting 50/30/20 otomatis dan pisahkan rekening jajan.'",
            info: "Tuliskan 2-3 langkah atau cerita inti yang mudah dicerna.",
          },
          {
            name: "callToAction",
            label: "Tawaran / Ajakan Tindakan (CTA)",
            type: "text",
            placeholder: "e.g., 'Ketik SIMPAN di komen untuk template budgeting gratisnya!'",
            info: "Aksi apa yang harus dilakukan penonton di akhir video?",
          },
        ],
        id_kerangka: "FW-HOOKSTO",
        nama_kerangka: "Hook-Story-Offer (HSO) Video Pendek",
        version: "2.0",
        kategori: ["Teks & Konten", "Konten & Pemasaran"],
        perspektif_user: "Pengguna ingin meracik prompt Hook-Story-Offer (HSO) Video Pendek berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Content Strategist & Viral Scriptwriter. AI merancang naskah video pendek terstruktur (Hook 0-3s, Story 4-45s, Offer 46-60s) dengan visual cues dan intonasi dinamis.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Content Strategist & Viral Scriptwriter. AI merancang naskah video pendek terstruktur (Hook 0-3s, Story 4-45s, Offer 46-60s) dengan visual cues dan intonasi dinamis.",
          KONTEKS: "Formula video pendek (TikTok/Reels/Shorts) dengan pembuka 3 detik yang menghentikan scroll, cerita relatable, dan tawaran aksi yang memikat.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "topic": {
                        "name": "topic",
                        "label": "Topik / Inti Konten Video",
                        "type": "text",
                        "placeholder": "e.g., '3 Cara Menghemat Uang Gaji Tanpa Tersiksa'",
                        "options": [],
                        "info": "Tentukan topik utama yang ingin dibahas dalam video."
            },
            "targetAudience": {
                        "name": "targetAudience",
                        "label": "Target Audiens yang Disasar",
                        "type": "text",
                        "placeholder": "e.g., 'Anak muda pekerja kantoran (Gen Z & Milenial)'",
                        "options": [],
                        "info": "Siapa yang paling relate dengan masalah ini?"
            },
            "hookStyle": {
                        "name": "hookStyle",
                        "label": "Gaya Hook Pembuka",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Kontrarian (Membantah Mitos Populer)",
                                    "Peringatan / Kesalahan Fatal",
                                    "Rasa Ingin Tahu / Rahasia Jarang Diketahui",
                                    "Transformasi Before-After Mengejutkan",
                                    "Pertanyaan Menusuk Emosi Audiens"
                        ],
                        "info": "Pilih pendekatan psikologis untuk 3 detik pertama."
            },
            "coreStory": {
                        "name": "coreStory",
                        "label": "Poin Cerita / Solusi Praktis",
                        "type": "textarea",
                        "placeholder": "e.g., 'Jelaskan teknik budgeting 50/30/20 otomatis dan pisahkan rekening jajan.'",
                        "options": [],
                        "info": "Tuliskan 2-3 langkah atau cerita inti yang mudah dicerna."
            },
            "callToAction": {
                        "name": "callToAction",
                        "label": "Tawaran / Ajakan Tindakan (CTA)",
                        "type": "text",
                        "placeholder": "e.g., 'Ketik SIMPAN di komen untuk template budgeting gratisnya!'",
                        "options": [],
                        "info": "Aksi apa yang harus dilakukan penonton di akhir video?"
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Hook-Story-Offer (HSO) Video Pendek.",
        output: "natural_language_prompt"
      },
      "Generator 10 Hook Viral Pembuka Video": {
        description: "Hasilkan 10 variasi kalimat pembuka video 3 detik berbasis psikologi atensi untuk TikTok, Instagram Reels, dan YouTube Shorts.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Creative Director TikTok & Reels. AI menganalisis topik dan meracik 10 hook bervariasi dengan visual action prompt untuk menarik perhatian dalam 3 detik.",
        components: [
          {
            name: "topic",
            label: "Topik Konten Video",
            type: "text",
            placeholder: "e.g., 'Kesalahan fatal saat beli rumah pertama kali'",
            info: "Tema besar yang ingin dibuatkan hook pembuka.",
          },
          {
            name: "targetAudience",
            label: "Target Audiens",
            type: "text",
            placeholder: "e.g., 'Pasangan muda yang baru menikah'",
            info: "Audiens spesifik yang menjadi sasaran konten.",
          },
          {
            name: "toneMood",
            label: "Nada Emosi Utama",
            type: "select",
            options: ["Dramatis & Penuh Urgensi", "Santai & Akrab (BFF Talk)", "Tegas & Blak-blakan (No BS)", "Lucu & Menggelitik (Relatable Humor)", "Inspiratif & Membuka Wawasan"],
            info: "Pilih pembawaan emosional yang diinginkan.",
          },
        ],
        id_kerangka: "FW-GENERAT",
        nama_kerangka: "Generator 10 Hook Viral Pembuka Video",
        version: "2.0",
        kategori: ["Teks & Konten", "Konten & Pemasaran"],
        perspektif_user: "Pengguna ingin meracik prompt Generator 10 Hook Viral Pembuka Video berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Creative Director TikTok & Reels. AI menganalisis topik dan meracik 10 hook bervariasi dengan visual action prompt untuk menarik perhatian dalam 3 detik.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Creative Director TikTok & Reels. AI menganalisis topik dan meracik 10 hook bervariasi dengan visual action prompt untuk menarik perhatian dalam 3 detik.",
          KONTEKS: "Hasilkan 10 variasi kalimat pembuka video 3 detik berbasis psikologi atensi untuk TikTok, Instagram Reels, dan YouTube Shorts.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "topic": {
                        "name": "topic",
                        "label": "Topik Konten Video",
                        "type": "text",
                        "placeholder": "e.g., 'Kesalahan fatal saat beli rumah pertama kali'",
                        "options": [],
                        "info": "Tema besar yang ingin dibuatkan hook pembuka."
            },
            "targetAudience": {
                        "name": "targetAudience",
                        "label": "Target Audiens",
                        "type": "text",
                        "placeholder": "e.g., 'Pasangan muda yang baru menikah'",
                        "options": [],
                        "info": "Audiens spesifik yang menjadi sasaran konten."
            },
            "toneMood": {
                        "name": "toneMood",
                        "label": "Nada Emosi Utama",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Dramatis & Penuh Urgensi",
                                    "Santai & Akrab (BFF Talk)",
                                    "Tegas & Blak-blakan (No BS)",
                                    "Lucu & Menggelitik (Relatable Humor)",
                                    "Inspiratif & Membuka Wawasan"
                        ],
                        "info": "Pilih pembawaan emosional yang diinginkan."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Generator 10 Hook Viral Pembuka Video.",
        output: "natural_language_prompt"
      },
      "Penulis Thread & Utas Edukasi (Twitter & Threads)": {
        description: "Rancang utas berseri bernilai tinggi yang rapi, padat wawasan, mudah dibaca, dan memicu retweet/share tinggi.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Master Social Media Ghostwriter. AI menyusun utas terstruktur (Tweet 1 Hook, Tweet 2-6 Daging Materi, Tweet 7 Ringkasan & CTA).",
        components: [
          {
            name: "threadTopic",
            label: "Topik Utas / Panduan",
            type: "text",
            placeholder: "e.g., '7 Kebiasaan Produktif yang Mengubah Karir Saya dalam 6 Bulan'",
            info: "Judul atau tema utama utas yang akan dibahas.",
          },
          {
            name: "keyTakeaways",
            label: "Poin-Poin Kunci yang Ingin Disampaikan",
            type: "textarea",
            placeholder: "e.g., '1. Deep work 90 menit pagi, 2. No phone saat bangun tidur, 3. Review mingguan hari Minggu.'",
            info: "Tuliskan garis besar tips atau wawasan yang ingin dijabarkan.",
          },
          {
            name: "writingTone",
            label: "Gaya Bahasa Utas",
            type: "select",
            options: ["Storytelling Personal & Hangat", "Panduan Praktis Langkah-demi-Langkah", "Analisis Kritis & Penuh Data", "Santai & Berwawasan Populer"],
            info: "Pilih persona penulisan utas.",
          },
        ],
        id_kerangka: "FW-PENULIS",
        nama_kerangka: "Penulis Thread & Utas Edukasi (Twitter & Threads)",
        version: "2.0",
        kategori: ["Teks & Konten", "Konten & Pemasaran"],
        perspektif_user: "Pengguna ingin meracik prompt Penulis Thread & Utas Edukasi (Twitter & Threads) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Master Social Media Ghostwriter. AI menyusun utas terstruktur (Tweet 1 Hook, Tweet 2-6 Daging Materi, Tweet 7 Ringkasan & CTA).",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Master Social Media Ghostwriter. AI menyusun utas terstruktur (Tweet 1 Hook, Tweet 2-6 Daging Materi, Tweet 7 Ringkasan & CTA).",
          KONTEKS: "Rancang utas berseri bernilai tinggi yang rapi, padat wawasan, mudah dibaca, dan memicu retweet/share tinggi.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "threadTopic": {
                        "name": "threadTopic",
                        "label": "Topik Utas / Panduan",
                        "type": "text",
                        "placeholder": "e.g., '7 Kebiasaan Produktif yang Mengubah Karir Saya dalam 6 Bulan'",
                        "options": [],
                        "info": "Judul atau tema utama utas yang akan dibahas."
            },
            "keyTakeaways": {
                        "name": "keyTakeaways",
                        "label": "Poin-Poin Kunci yang Ingin Disampaikan",
                        "type": "textarea",
                        "placeholder": "e.g., '1. Deep work 90 menit pagi, 2. No phone saat bangun tidur, 3. Review mingguan hari Minggu.'",
                        "options": [],
                        "info": "Tuliskan garis besar tips atau wawasan yang ingin dijabarkan."
            },
            "writingTone": {
                        "name": "writingTone",
                        "label": "Gaya Bahasa Utas",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Storytelling Personal & Hangat",
                                    "Panduan Praktis Langkah-demi-Langkah",
                                    "Analisis Kritis & Penuh Data",
                                    "Santai & Berwawasan Populer"
                        ],
                        "info": "Pilih persona penulisan utas."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Penulis Thread & Utas Edukasi (Twitter & Threads).",
        output: "natural_language_prompt"
      },
      "Skrip Voiceover Storytelling Video (POV / Mini-Vlog)": {
        description: "Naskah monolog/voiceover natural untuk video sinematik, mini-vlog keseharian, atau drama pendek dengan hook emosional.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Video Storyteller & Screenwriter. AI menuliskan narasi voiceover yang berirama indah, selaras dengan transisi visual video.",
        components: [
          {
            name: "storyTheme",
            label: "Tema Cerita / Momen Vlog",
            type: "text",
            placeholder: "e.g., 'Satu hari belajar memaafkan diri sendiri setelah gagal interview'",
            info: "Jelaskan situasi atau perjalanan emosional yang diangkat.",
          },
          {
            name: "videoVibe",
            label: "Suasana Video (Mood & Vibe)",
            type: "select",
            options: ["Tenang, Hangat & Kontemplatif (Cozy)", "Penuh Semangat & Motivasi Tinggi", "Nostalgia & Melankolis Estetik", "Cepat, Realistis & Jenaka (Day in my life)"],
            info: "Tentukan getaran emosi penonton saat mendengar voiceover.",
          },
          {
            name: "targetDuration",
            label: "Target Durasi Video",
            type: "select",
            options: ["30 Detik (Padat & Cepat)", "60 Detik (Standar Reels/TikTok)", "90 Detik (Storytelling Mendalam)"],
            info: "Pilih estimasi panjang naskah suara.",
          },
        ],
        id_kerangka: "FW-SKRIPVO",
        nama_kerangka: "Skrip Voiceover Storytelling Video (POV / Mini-Vlog)",
        version: "2.0",
        kategori: ["Teks & Konten", "Konten & Pemasaran"],
        perspektif_user: "Pengguna ingin meracik prompt Skrip Voiceover Storytelling Video (POV / Mini-Vlog) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Video Storyteller & Screenwriter. AI menuliskan narasi voiceover yang berirama indah, selaras dengan transisi visual video.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Video Storyteller & Screenwriter. AI menuliskan narasi voiceover yang berirama indah, selaras dengan transisi visual video.",
          KONTEKS: "Naskah monolog/voiceover natural untuk video sinematik, mini-vlog keseharian, atau drama pendek dengan hook emosional.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "storyTheme": {
                        "name": "storyTheme",
                        "label": "Tema Cerita / Momen Vlog",
                        "type": "text",
                        "placeholder": "e.g., 'Satu hari belajar memaafkan diri sendiri setelah gagal interview'",
                        "options": [],
                        "info": "Jelaskan situasi atau perjalanan emosional yang diangkat."
            },
            "videoVibe": {
                        "name": "videoVibe",
                        "label": "Suasana Video (Mood & Vibe)",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Tenang, Hangat & Kontemplatif (Cozy)",
                                    "Penuh Semangat & Motivasi Tinggi",
                                    "Nostalgia & Melankolis Estetik",
                                    "Cepat, Realistis & Jenaka (Day in my life)"
                        ],
                        "info": "Tentukan getaran emosi penonton saat mendengar voiceover."
            },
            "targetDuration": {
                        "name": "targetDuration",
                        "label": "Target Durasi Video",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "30 Detik (Padat & Cepat)",
                                    "60 Detik (Standar Reels/TikTok)",
                                    "90 Detik (Storytelling Mendalam)"
                        ],
                        "info": "Pilih estimasi panjang naskah suara."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Skrip Voiceover Storytelling Video (POV / Mini-Vlog).",
        output: "natural_language_prompt"
      },
    },
    "Penulisan & Konten": {
      "Penulisan Artikel SEO": {
        description:
          "Buat konten artikel yang dioptimalkan untuk mesin pencari.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pakar SEO Konten. AI akan menganalisis input untuk menghasilkan artikel SEO yang relevan dan terstruktur, dengan fokus pada optimasi kata kunci dan keterbacaan.",
        components: [
          {
            name: "targetKeyword",
            label: "Kata Kunci Utama",
            type: "text",
            placeholder: "e.g., 'manfaat teh hijau'",
            info: "Kata kunci utama yang akan menjadi fokus artikel Anda. Ini penting untuk SEO.",
            validation: { min_length: 5 },
          },
          {
            name: "secondaryKeywords",
            label: "Kata Kunci Sekunder (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'antioksidan, kesehatan kulit'",
            info: "Kata kunci tambahan yang relevan untuk memperkaya isi artikel dan meningkatkan visibilitas SEO.",
            validation: { min_length: 3 },
          },
          {
            name: "targetAudience",
            label: "Target Audiens Artikel",
            type: "text",
            placeholder: "e.g., 'penggemar kesehatan, usia 25-40'",
            info: "Siapa yang akan membaca artikel ini?",
            validation: { min_length: 5 },
          },
          {
            name: "tone",
            label: "Gaya Bahasa Artikel",
            type: "select",
            options: [
              "Formal",
              "Kasual",
              "Informatif",
              "Persuasif",
              "Lucu",
              "Lainnya...",
            ],
            info: "Pilih nuansa tulisan yang diinginkan.",
          },
          {
            name: "wordCount",
            label: "Target Jumlah Kata",
            type: "number",
            placeholder: "e.g., 800",
            info: "Perkiraan panjang artikel yang Anda butuhkan.",
            validation: { min_value: 100, max_value: 5000 },
          },
          {
            name: "outline",
            label: "Kerangka Artikel (Opsional)",
            type: "textarea",
            placeholder: `H1: Judul Utama
 H2: Poin Pertama
 H3: Sub-poin...`,
            info: "Berikan struktur atau poin-poin utama yang harus ada.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Jangan sebutkan brand kompetitor. Gunakan analogi dari dunia olahraga. Pastikan artikel diakhiri dengan pertanyaan untuk memancing komentar.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Blog Post": {
        description:
          "Buat draf blog post lengkap dengan fokus pada narasi dan storytelling, lebih dari sekadar SEO.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Storyteller Konten. AI akan menyusun blog post dengan narasi yang kuat dan storytelling, berfokus pada sudut pandang unik dan pesan kunci yang ingin disampaikan.",
        components: [
          {
            name: "topic",
            label: "Topik Utama Blog",
            type: "text",
            placeholder:
              "e.g., 'Perjalanan saya mengatasi burnout sebagai developer'",
            info: "Judul atau ide utama yang ingin Anda eksplorasi.",
            validation: { min_length: 10 },
          },
          {
            name: "uniqueAngle",
            label: "Sudut Pandang Unik",
            type: "text",
            placeholder:
              "e.g., 'Bukan tips biasa, tapi cerita kegagalan & pembelajaran'",
            info: "Apa yang membuat blog post Anda berbeda dari yang lain?",
            validation: { min_length: 10 },
          },
          {
            name: "writerPersona",
            label: "Persona Penulis",
            type: "text",
            placeholder:
              "e.g., 'Seorang mentor yang berpengalaman, teman yang berbagi cerita'",
            info: "Dari sudut pandang siapa cerita ini ditulis?",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Target Pembaca",
            type: "text",
            placeholder: "e.g., 'Developer junior, pekerja kreatif'",
            info: "Siapa yang ingin Anda ajak bicara melalui tulisan ini?",
            validation: { min_length: 5 },
          },
          {
            name: "keyTakeaway",
            label: "Pesan Kunci untuk Pembaca",
            type: "text",
            placeholder:
              "e.g., 'Beristirahat bukanlah kemunduran, melainkan bagian dari proses'",
            info: "Satu hal yang harus diingat pembaca setelah selesai membaca.",
            validation: { min_length: 10 },
          },
          {
            name: "interactionPrompt",
            label: "Ajakan Interaksi di Akhir",
            type: "text",
            placeholder: "e.g., 'Bagikan pengalaman burnout Anda di komentar!'",
            info: "Pertanyaan atau ajakan untuk memancing diskusi.",
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Pembuat Studi Kasus (Case Study)": {
        description:
          "Ubah data dan hasil proyek menjadi narasi studi kasus yang persuasif dan profesional.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Analis Studi Kasus. AI akan menyusun studi kasus dengan fokus pada masalah, solusi, dan hasil kuantitatif, memastikan narasi yang persuasif dan profesional.",
        components: [
          {
            name: "clientName",
            label: "Nama Klien/Proyek",
            type: "text",
            placeholder: "e.g., 'Proyek Redesain untuk Kopi ABC'",
            info: "Subjek dari studi kasus ini.",
            validation: { min_length: 5 },
          },
          {
            name: "problem",
            label: "Masalah atau Tantangan Awal",
            type: "textarea",
            placeholder:
              "e.g., 'Klien mengalami penurunan penjualan online sebesar 30% karena website yang ketinggalan zaman dan sulit dinavigasi.'",
            info: "Jelaskan situasi awal yang dihadapi klien sebelum proyek dimulai.",
            validation: { min_length: 20 },
          },
          {
            name: "solution",
            label: "Solusi yang Diterapkan",
            type: "textarea",
            placeholder:
              "e.g., 'Kami melakukan riset pengguna, mendesain ulang UI/UX dengan fokus pada mobile-first, dan mengimplementasikan platform e-commerce baru.'",
            info: "Jelaskan langkah-langkah konkret yang Anda atau tim Anda lakukan untuk mengatasi masalah.",
            validation: { min_length: 20 },
          },
          {
            name: "results",
            label: "Hasil & Metrik Kuantitatif",
            type: "textarea",
            placeholder:
              "e.g., 'Peningkatan konversi 50%, penurunan bounce rate 40%, peningkatan waktu sesi 2 menit.'",
            info: "Sajikan hasil yang terukur dan berbasis data. Angka sangat penting di sini.",
            validation: { min_length: 20 },
          },
          {
            name: "clientQuote",
            label: "Kutipan dari Klien (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Kerja sama dengan tim ini mengubah bisnis kami!' - CEO Kopi ABC",
            info: "Testimoni singkat untuk menambah kredibilitas.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tulis dengan gaya formal dan berwibawa. Fokus pada bagaimana proses kolaboratif kami menjadi kunci keberhasilan. Buat judul yang menyoroti angka pencapaian terbesar.",
            info: "Instruksi tentang nada penulisan atau aspek tertentu yang ingin ditonjolkan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis White Paper/Laporan": {
        description:
          "Hasilkan dokumen laporan atau white paper yang informatif dan berwibawa berdasarkan data atau riset.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Laporan Korporat. AI akan menyusun laporan atau white paper yang informatif dan berwibawa, dengan fokus pada data dan riset yang mendukung tesis utama.",
        components: [
          {
            name: "reportTitle",
            label: "Judul Laporan/White Paper",
            type: "text",
            placeholder: "e.g., 'Masa Depan AI dalam Industri Keuangan'",
            info: "Judul yang jelas dan profesional.",
            validation: { min_length: 10 },
          },
          {
            name: "mainThesis",
            label: "Tesis atau Argumen Utama",
            type: "text",
            placeholder:
              "e.g., 'AI akan secara fundamental mengubah manajemen risiko dan layanan pelanggan di sektor perbankan.'",
            info: "Satu kalimat yang merangkum poin utama dari laporan Anda.",
            validation: { min_length: 10 },
          },
          {
            name: "targetAudience",
            label: "Target Pembaca",
            type: "select",
            options: [
              "Eksekutif C-Level",
              "Manajer Teknis",
              "Akademisi/Peneliti",
              "Publik Umum",
              "Lainnya...",
            ],
            info: "Siapa audiens utama dokumen ini? Ini akan menentukan tingkat kedalaman teknis.",
          },
          {
            name: "supportingData",
            label: "Poin Data & Bukti Pendukung",
            type: "textarea",
            placeholder:
              "Tempelkan poin-poin data, hasil survei, statistik, atau kutipan riset di sini. Pisahkan dengan baris baru.",
            info: "Inti dari laporan Anda. Semakin banyak data konkret, semakin baik.",
            validation: { min_length: 20 },
          },
          {
            name: "structure",
            label: "Struktur Laporan (Opsional)",
            type: "textarea",
            placeholder:
              "e.g., '1. Ringkasan Eksekutif\n2. Pendahuluan\n3. Analisis Pasar\n4. Kesimpulan & Rekomendasi'",
            info: "Berikan kerangka yang diinginkan jika Anda punya.",
            optional: true,
            validation: { min_length: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan bahasa yang formal dan objektif. Sertakan bagian 'Rekomendasi' di akhir. Hindari spekulasi yang tidak didukung data.",
            info: "Instruksi tentang gaya, nada, atau bagian spesifik yang harus disertakan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Deskripsi Produk": {
        description:
          "Buat deskripsi produk yang menarik dan persuasif untuk e-commerce.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Copywriting Produk. AI akan membuat deskripsi produk yang menarik dan persuasif, menyoroti fitur, manfaat, dan USP produk untuk target audiens yang spesifik.",
        components: [
          {
            name: "productName",
            label: "Nama Produk",
            type: "text",
            placeholder: "e.g., 'Sepatu Lari Ultra-Light X1'",
            info: "Nama lengkap dan spesifik produk Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Target Pengguna Produk",
            type: "text",
            placeholder: "e.g., 'Pelari maraton, penggemar kebugaran'",
            info: "Siapa pembeli ideal untuk produk ini?",
            validation: { min_length: 5 },
          },
          {
            name: "usp",
            label: "Unique Selling Proposition (USP)",
            type: "text",
            placeholder: "e.g., 'Satu-satunya sepatu lari dengan sol grafena'",
            info: "Apa yang membuat produk ini unik dan lebih baik dari kompetitor?",
            validation: { min_length: 10 },
          },
          {
            name: "keyFeatures",
            label: "Fitur & Manfaat Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Bahan jaring berpori untuk sirkulasi udara maksimal, sol busa responsif yang mengembalikan energi, desain aerodinamis untuk kecepatan.'",
            info: "Jelaskan fitur dan terjemahkan menjadi manfaat bagi pengguna. Pisahkan dengan koma atau baris baru.",
            validation: { min_length: 20 },
          },
          {
            name: "brandVoice",
            label: "Gaya Bahasa Brand",
            type: "select",
            options: [
              "Mewah & Eksklusif",
              "Teknis & Detail",
              "Santai & Ramah",
              "Minimalis & Modern",
              "Lainnya...",
            ],
            info: "Pilih suara brand yang konsisten dengan produk Anda.",
          },
          {
            name: "length",
            label: "Panjang Deskripsi",
            type: "select",
            options: [
              "Singkat (1 paragraf)",
              "Sedang (2-3 paragraf)",
              "Detail (lebih dari 3 paragraf)",
              "Lainnya...",
            ],
            info: "Pilih panjang deskripsi sesuai kebutuhan platform e-commerce.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tonjolkan aspek 'ramah lingkungan' dari material yang digunakan. Sebutkan ada garansi 2 tahun. Hindari penggunaan superlatif seperti 'terbaik'.",
            info: "Informasi penting lainnya. Misalnya, detail garansi, material, atau hal yang perlu ditonjolkan secara implisit.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Naskah Podcast": {
        description:
          "Ubah ide atau poin-poin menjadi naskah podcast yang terstruktur, lengkap dengan intro, segmen, dan outro.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Naskah Podcast. AI akan menyusun naskah podcast yang terstruktur, mengubah ide menjadi alur naratif yang kohesif dengan intro, segmen, dan outro yang jelas.",
        components: [
          {
            name: "podcastTitle",
            label: "Judul Episode Podcast",
            type: "text",
            placeholder: "e.g., 'Episode 5: Seni Berkata Tidak'",
            info: "Judul yang menarik dan informatif untuk episode Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "hostPersona",
            label: "Persona Host",
            type: "text",
            placeholder:
              "e.g., 'Seorang ahli yang ramah, dua sahabat yang bercanda'",
            info: "Siapa yang berbicara dalam podcast ini?",
            validation: { min_length: 5 },
          },
          {
            name: "podcastFormat",
            label: "Format Podcast",
            type: "select",
            options: [
              "Monolog (Solo)",
              "Wawancara",
              "Diskusi Panel",
              "Storytelling Naratif",
              "Lainnya...",
            ],
            info: "Struktur umum dari episode podcast Anda.",
          },
          {
            name: "keySegments",
            label: "Segmen-segmen Kunci",
            type: "textarea",
            placeholder:
              "e.g., 'Intro & Hook\nSegmen 1: Mengapa sulit berkata tidak\nSegmen 2: Teknik praktis\nOutro & CTA'",
            info: "Pecah episode menjadi beberapa bagian atau topik bahasan.",
            validation: { min_length: 20 },
          },
          {
            name: "targetDuration",
            label: "Target Durasi (menit)",
            type: "number",
            placeholder: "e.g., 20",
            info: "Perkiraan panjang naskah yang dibutuhkan.",
            validation: { min_value: 1, max_value: 120 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Sertakan jeda musik di antara segmen. Naskah harus terasa seperti percakapan, bukan membaca. Akhiri dengan pertanyaan untuk pendengar.",
            info: "Instruksi tentang gaya bahasa, musik, atau elemen audio lainnya.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Halaman 'Tentang Kami'": {
        description:
          "Buat narasi yang menarik dan otentik untuk halaman 'Tentang Kami' di sebuah website.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Narator Brand. AI akan menciptakan narasi 'Tentang Kami' yang menarik dan otentik, menyoroti misi, nilai, dan cerita asal perusahaan untuk membangun koneksi dengan audiens.",
        components: [
          {
            name: "companyName",
            label: "Nama Perusahaan/Brand",
            type: "text",
            placeholder: "e.g., 'Warung Koding'",
            info: "Nama entitas yang akan diceritakan.",
            validation: { min_length: 5 },
          },
          {
            name: "missionStatement",
            label: "Misi Perusahaan",
            type: "textarea",
            placeholder:
              "e.g., 'Memberdayakan semua orang untuk bisa membuat website tanpa perlu coding.'",
            info: "Apa tujuan besar dan alasan keberadaan perusahaan Anda?",
            validation: { min_length: 20 },
          },
          {
            name: "originStory",
            label: "Cerita Awal Berdiri (Opsional)",
            type: "textarea",
            placeholder:
              "e.g., 'Dimulai dari garasi pada tahun 2020, kami frustrasi dengan betapa sulitnya...' ",
            info: "Cerita singkat tentang bagaimana semuanya dimulai. Ini menambah sentuhan personal.",
            optional: true,
            validation: { min_length: 20 },
          },
          {
            name: "coreValues",
            label: "Nilai-nilai Inti (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'Inovasi, Komunitas, Kesederhanaan'",
            info: "Prinsip-prinsip yang menjadi panduan perusahaan Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "tone",
            label: "Gaya Bahasa Halaman",
            type: "select",
            options: [
              "Profesional & Korporat",
              "Inspiratif & Visioner",
              "Rendah Hati & Personal",
              "Menyenangkan & Unik",
              "Lainnya...",
            ],
            info: "Pilih nada yang paling merepresentasikan budaya perusahaan Anda.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tulis dalam sudut pandang 'kami'. Sertakan satu paragraf tentang tim. Akhiri dengan ajakan untuk bergabung dengan komunitas kami.",
            info: "Elemen spesifik lain yang ingin Anda masukkan dalam cerita.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Alat Bantu Menulis": {
      "Asisten Pembuat Resume/CV": {
        description:
          "Buat poin-poin pencapaian yang kuat untuk resume atau CV Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Konsultan Karir. AI akan menghasilkan poin-poin pencapaian yang kuat dan terukur untuk resume atau CV, dengan fokus pada relevansi posisi yang dilamar dan dampak kuantitatif.",
        components: [
          {
            name: "jobTitle",
            label: "Posisi yang Dilamar",
            type: "text",
            placeholder: "e.g., 'Senior Software Engineer'",
            info: "Posisi spesifik yang Anda tuju akan menentukan fokus dari poin yang dibuat.",
            validation: { min_length: 5 },
          },
          {
            name: "experienceLevel",
            label: "Tingkat Pengalaman",
            type: "select",
            options: [
              "Fresh Graduate",
              "Junior",
              "Mid-level",
              "Senior",
              "Manager",
              "Lainnya...",
            ],
            info: "Tingkat pengalaman Anda saat ini.",
          },
          {
            name: "sectionToGenerate",
            label: "Bagian yang Akan Dibuat",
            type: "select",
            options: [
              "Ringkasan Profesional",
              "Poin Pengalaman Kerja",
              "Deskripsi Proyek",
              "Lainnya...",
            ],
            info: "Pilih bagian CV yang ingin Anda tulis atau perbaiki.",
          },
          {
            name: "keySkills",
            label: "Keterampilan Utama (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'React, Node.js, Agile'",
            info: "Skill teknis atau non-teknis yang paling relevan dengan posisi yang dilamar.",
            validation: { min_length: 5 },
          },
          {
            name: "achievements",
            label: "Deskripsi Tugas & Pencapaian",
            type: "textarea",
            placeholder:
              "e.g., 'Mengembangkan fitur X yang meningkatkan efisiensi sebesar 20%. Memimpin tim proyek Y.'",
            info: "Gunakan metrik dan angka untuk mengukur dampak. Gunakan metode STAR (Situation, Task, Action, Result) jika memungkinkan.",
            validation: { min_length: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan kata kerja aksi yang kuat (e.g., spearheaded, orchestrated, executed). Kuantifikasi semua pencapaian jika memungkinkan. Tulis dalam sudut pandang orang pertama.",
            info: "Instruksi spesifik tentang bagaimana AI harus menyusun kalimat atau kata-kata yang digunakan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Ulang & Parafraser": {
        description:
          "Ubah tulisan yang ada menjadi versi baru untuk menyederhanakan, mengubah gaya, atau menghindari plagiarisme.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Parafrase. AI akan menulis ulang teks yang diberikan, menyesuaikan gaya, panjang, dan kompleksitas sesuai tujuan yang diinginkan, sambil mempertahankan makna asli.",
        components: [
          {
            name: "originalText",
            label: "Teks Asli",
            type: "textarea",
            placeholder:
              "Tempelkan teks yang ingin Anda tulis ulang di sini...",
            info: "Semakin lengkap teks asli, semakin baik hasil parafrasenya.",
            validation: { min_length: 20 },
          },
          {
            name: "rewriteGoal",
            label: "Tujuan Penulisan Ulang",
            type: "select",
            options: [
              "Menyederhanakan Bahasa",
              "Membuat Lebih Formal",
              "Membuat Lebih Kasual",
              "Memperpanjang Teks",
              "Meringkas Teks",
              "Lainnya...",
            ],
            info: "Pilih hasil akhir yang Anda inginkan dari teks baru.",
          },
          {
            name: "targetAudience",
            label: "Target Audiens Baru",
            type: "text",
            placeholder: "e.g., 'Anak-anak usia 10-12 tahun, eksekutif bisnis'",
            info: "Siapa yang akan membaca teks baru ini? This will affect word choice.",
            validation: { min_length: 5 },
          },
          {
            name: "keywordsToKeep",
            label: "Kata Kunci yang Harus Dipertahankan",
            type: "text",
            placeholder: "e.g., 'fotosintesis, klorofil'",
            info: "Istilah penting atau nama brand yang tidak boleh diubah atau dihilangkan.",
            optional: true,
          },
          {
            name: "styleToEmulate",
            label: "Tiru Gaya Penulisan (Opsional)",
            type: "text",
            placeholder: "e.g., 'Seperti artikel di Harvard Business Review'",
            info: "Sebutkan contoh penulis atau publikasi yang gayanya ingin ditiru.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Hindari kalimat pasif. Pertahankan struktur paragraf asli. Ganti jargon teknis dengan analogi yang mudah dipahami.",
            info: "Instruksi tentang perubahan spesifik yang diinginkan pada struktur, gaya, atau konten.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Pemeriksa & Penyempurna Gaya Bahasa": {
        description:
          "Perbaiki tulisan yang ada agar lebih jelas, ringkas, kuat, dan berdampak.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Editor Gaya Bahasa. AI akan menganalisis teks yang diberikan untuk mengidentifikasi area perbaikan dalam kejelasan, keringkasan, kekuatan, dan dampak, serta menawarkan saran yang relevan.",
        components: [
          {
            name: "originalText",
            label: "Teks Asli",
            type: "textarea",
            placeholder:
              "Tempelkan paragraf atau tulisan yang ingin disempurnakan di sini.",
            info: "AI akan menganalisis dan memberikan saran perbaikan, bukan menulis ulang total.",
            validation: { min_length: 20 },
          },
          {
            name: "improvementGoal",
            label: "Fokus Penyempurnaan",
            type: "select",
            options: [
              "Meningkatkan Kejelasan & Keringkasan",
              "Membuat Lebih Persuasif",
              "Menguatkan Gaya Bahasa",
              "Memeriksa Alur & Logika",
              "Lainnya...",
            ],
            info: "Pilih aspek utama yang ingin Anda perbaiki dari tulisan ini.",
          },
          {
            name: "targetAudience",
            label: "Target Pembaca",
            type: "text",
            placeholder: "e.g., 'Tim internal, klien potensial, pembaca umum'",
            info: "Mengetahui audiens membantu AI memberikan saran yang lebih relevan.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Pertahankan nada yang ramah. Ganti semua kalimat pasif menjadi aktif. Tawarkan alternatif untuk kata-kata yang terlalu sering digunakan.",
            info: "Instruksi spesifik tentang jenis perbaikan yang Anda cari.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Judul & Headline": {
        description:
          "Dapatkan beberapa opsi judul yang menarik (click-worthy) untuk artikel, blog, email, atau video.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Kreator Headline. AI akan menghasilkan berbagai opsi judul dan headline yang menarik dan click-worthy, dengan mempertimbangkan topik utama, kata kunci, dan gaya yang diinginkan.",
        components: [
          {
            name: "mainTopic",
            label: "Topik Utama Konten",
            type: "text",
            placeholder: "e.g., 'Tips produktivitas kerja dari rumah'",
            info: "Jelaskan secara singkat isi dari konten Anda.",
            validation: { min_length: 5, max_length: 50 },
          },
          {
            name: "keywords",
            label: "Kata Kunci yang Harus Ada",
            type: "text",
            placeholder: "e.g., 'WFH, produktivitas'",
            info: "Kata atau frasa yang wajib ada di dalam judul.",
            validation: { min_length: 3 },
          },
          {
            name: "headlineStyle",
            label: "Gaya Headline",
            type: "select",
            options: [
              "Berbasis Angka (e.g., 7 Cara...)",
              "Berbasis Manfaat (e.g., Dapatkan...)",
              "Berbasis Pertanyaan (e.g., Apakah Anda...)",
              "Membangkitkan Rasa Penasaran",
              "Langsung & Jelas",
              "Provokatif",
              "Lainnya...",
            ],
            info: "Pilih pendekatan psikologis yang ingin Anda gunakan.",
          },
          {
            name: "numberOfOptions",
            label: "Jumlah Opsi Judul",
            type: "number",
            placeholder: "e.g., 5",
            info: "Berapa banyak alternatif judul yang ingin Anda hasilkan?",
            validation: { min_value: 1, max_value: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Judul tidak boleh lebih dari 70 karakter. Target audiens adalah pemula. Hindari clickbait yang berlebihan.",
            info: "Batasan atau panduan spesifik lainnya untuk pembuatan judul.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator FAQ (Frequently Asked Questions)": {
        description:
          "Buat daftar pertanyaan yang sering diajukan (FAQ) secara otomatis dari sebuah blok teks atau deskripsi.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis FAQ. AI akan menganalisis teks sumber untuk mengidentifikasi pertanyaan umum dan menghasilkan jawaban yang relevan, dengan mempertimbangkan target audiens dan gaya yang diinginkan.",
        components: [
          {
            name: "sourceText",
            label: "Teks Sumber atau Deskripsi Produk",
            type: "textarea",
            placeholder:
              "Tempelkan teks lengkap, deskripsi produk, atau artikel di sini...",
            info: "AI akan menganalisis teks ini untuk membuat pertanyaan dan jawaban yang relevan.",
            validation: { min_length: 20 },
          },
          {
            name: "targetAudience",
            label: "Target Audiens FAQ",
            type: "text",
            placeholder:
              "e.g., 'Pelanggan baru, developer, pengguna non-teknis'",
            info: "Siapa yang akan membaca FAQ ini? Ini mempengaruhi kompleksitas jawaban.",
            validation: { min_length: 5 },
          },
          {
            name: "questionStyle",
            label: "Gaya Pertanyaan",
            type: "select",
            options: [
              "Langsung & Jelas",
              "Berbasis Masalah Pengguna",
              "Membangkitkan Rasa Ingin Tahu",
              "Lainnya...",
            ],
            info: "Pilih bagaimana pertanyaan harus dirumuskan.",
          },
          {
            name: "answerStyle",
            label: "Gaya Jawaban",
            type: "select",
            options: [
              "Singkat & Langsung ke Poin",
              "Detail & Langkah-demi-Langkah",
              "Ramah & Percakapan",
              "Lainnya...",
            ],
            info: "Pilih bagaimana jawaban harus disampaikan.",
          },
          {
            name: "faqCount",
            label: "Jumlah Pertanyaan (Opsional)",
            type: "number",
            placeholder: "e.g., 5",
            info: "Jumlah pasangan tanya-jawab yang ingin Anda hasilkan.",
            optional: true,
            validation: { min_value: 1, max_value: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Fokus pada pertanyaan tentang kebijakan pengembalian dan garansi. Hindari jawaban yang terlalu teknis. Pastikan satu pertanyaan tentang kompatibilitas.",
            info: "Berikan instruksi spesifik untuk memandu pembuatan FAQ.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Peringkas Teks & Artikel": {
        description:
          "Ambil teks panjang (artikel, laporan, email) dan rangkum menjadi poin-poin kunci atau paragraf singkat.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Ringkasan. AI akan menganalisis teks panjang untuk mengekstrak ide-ide utama dan menyajikannya dalam format ringkasan yang diminta, dengan mempertimbangkan fokus dan batasan yang diberikan.",
        components: [
          {
            name: "originalText",
            label: "Teks Asli yang Akan Diringkas",
            type: "textarea",
            placeholder:
              "Tempelkan seluruh teks di sini. Semakin panjang dan terstruktur, semakin baik hasilnya.",
            info: "AI akan membaca dan mengekstrak ide-ide utama dari teks ini.",
            validation: { min_length: 50 },
          },
          {
            name: "summaryLength",
            label: "Panjang Ringkasan yang Diinginkan",
            type: "select",
            options: [
              "Sangat Singkat (1-2 kalimat)",
              "Ringkasan Poin-poin",
              "Paragraf Singkat",
              "Lainnya...",
            ],
            info: "Pilih format dan panjang output yang paling sesuai kebutuhan Anda.",
          },
          {
            name: "focus",
            label: "Fokus Ringkasan (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Fokus pada dampak finansial', 'Hanya rangkum bagian kesimpulan'",
            info: "Beri tahu AI jika ada bagian atau aspek tertentu dari teks yang lebih penting.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tulis ringkasan untuk audiens non-teknis. Pertahankan semua angka dan statistik. Jangan menyertakan opini dari teks asli, hanya fakta.",
            info: "Instruksi spesifik tentang gaya atau konten dari ringkasan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
        crossValidationRules: [
          {
            triggerField: "aspectRatio",
            triggerValue: "Lainnya...",
            dependentField: "customAspectRatio",
            validationType: "required",
            errorMessage:
              "'Rasio Aspek Kustom' wajib diisi jika 'Rasio Aspek' adalah 'Lainnya...'.",
          },
        ],
      },
      "Generator Meta Deskripsi SEO": {
        description:
          "Buat meta deskripsi yang menarik dan kaya kata kunci (<160 karakter) untuk halaman web.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis SEO On-Page. AI akan membuat meta deskripsi yang menarik dan kaya kata kunci, dengan mempertimbangkan judul halaman, ringkasan konten, dan ajakan bertindak untuk optimasi SEO.",
        components: [
          {
            name: "pageTitle",
            label: "Judul Halaman",
            type: "text",
            placeholder: "e.g., 'Panduan Lengkap Teh Hijau untuk Kesehatan'",
            info: "Judul halaman web Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "mainKeyword",
            label: "Kata Kunci Utama Halaman",
            type: "text",
            placeholder: "e.g., 'manfaat teh hijau'",
            info: "Kata kunci yang paling ingin Anda rangking di Google.",
            validation: { min_length: 3 },
          },
          {
            name: "pageSummary",
            label: "Ringkasan Singkat Isi Halaman",
            type: "textarea",
            placeholder:
              "Jelaskan secara singkat apa isi halaman ini. Apa yang akan didapatkan pengunjung?",
            info: "Berikan AI konteks tentang isi halaman agar deskripsi relevan.",
            validation: { min_length: 20 },
          },
          {
            name: "callToAction",
            label: "Ajakan Bertindak (Call-to-Action)",
            type: "text",
            placeholder:
              "e.g., 'Pelajari lebih lanjut!', 'Temukan faktanya di sini!'",
            info: "Dorong pengguna untuk mengklik hasil pencarian Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan nada yang membangkitkan rasa penasaran. Pastikan kata kunci utama ada di awal kalimat. Jangan lebih dari 155 karakter.",
            info: "Batasan teknis atau gaya penulisan yang spesifik.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Kreatif & Ideasi": {
      "Generator Ide Cerita & Plot": {
        description:
          "Kembangkan ide cerita atau kerangka plot yang kreatif untuk novel, skenario, atau cerita pendek.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Cerita Kreatif. AI akan mengembangkan ide cerita dan kerangka plot yang kreatif, dengan mempertimbangkan genre, karakter utama, setting, konflik, dan elemen unik untuk menghasilkan narasi yang menarik.",
        components: [
          {
            name: "genre",
            label: "Genre Cerita",
            type: "select",
            options: [
              "Fiksi Ilmiah",
              "Fantasi",
              "Misteri",
              "Thriller",
              "Horor",
              "Romantis",
              "Petualangan",
              "Drama",
              "Lainnya...",
            ],
            info: "Genre akan menentukan konvensi dan ekspektasi pembaca.",
          },
          {
            name: "mainCharacter",
            label: "Deskripsi Tokoh Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Seorang detektif tua yang sinis di ambang pensiun, dihantui oleh kasus yang belum terpecahkan.'",
            info: "Jelaskan latar belakang, motivasi, dan kelemahan karakter untuk membuatnya 'hidup'.",
            validation: { min_length: 20 },
          },
          {
            name: "setting",
            label: "Setting (Waktu & Tempat)",
            type: "textarea",
            placeholder:
              "e.g., 'Kota neo-noir yang selalu hujan di tahun 2077, di mana teknologi dan kesenjangan sosial mencapai puncaknya.'",
            info: "Setting bisa menjadi karakter tersendiri dalam cerita.",
            validation: { min_length: 20 },
          },
          {
            name: "mainConflict",
            label: "Konflik Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Harus menemukan seorang peretas misterius yang membocorkan rahasia korporasi terbesar sebelum kota jatuh ke dalam kekacauan.'",
            info: "Apa masalah utama yang harus dihadapi dan diatasi oleh tokoh utama?",
            validation: { min_length: 20 },
          },
          {
            name: "twist",
            label: "Elemen Unik/Twist (Opsional)",
            type: "text",
            placeholder: "e.g., 'Ternyata tokoh pahlawan adalah dalangnya.'",
            info: "Elemen kejutan yang ingin Anda sertakan dalam cerita untuk mengubah perspektif pembaca.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Cerita harus memiliki akhir yang ambigu. Fokus pada dialog antar karakter. Sertakan elemen magis yang halus, bukan yang mencolok.",
            info: "Instruksi tentang tema, mood, atau elemen naratif spesifik yang harus dimasukkan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Nama Brand/Produk": {
        description:
          "Temukan nama yang unik, berkesan, dan relevan untuk bisnis atau produk Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Penamaan. AI akan menghasilkan nama brand atau produk yang unik, berkesan, dan relevan, dengan mempertimbangkan konsep inti, nilai-nilai brand, dan gaya nama yang diinginkan.",
        components: [
          {
            name: "coreConcept",
            label: "Deskripsi Konsep/Produk",
            type: "textarea",
            placeholder:
              "e.g., 'Aplikasi pengelola keuangan pribadi yang menggunakan AI untuk memberikan saran hemat.'",
            info: "Jelaskan apa yang Anda buat dalam 1-2 kalimat.",
            validation: { min_length: 20 },
          },
          {
            name: "coreValues",
            label: "Nilai Inti Brand (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'Kepercayaan, kesederhanaan, pemberdayaan'",
            info: "Kata-kata yang merepresentasikan jiwa dari brand atau produk Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "nameStyle",
            label: "Gaya Nama yang Diinginkan",
            type: "select",
            options: [
              "Modern & Singkat (e.g., Google, X)",
              "Klasik & Dapat Dipercaya (e.g., General Electric)",
              "Evokatif & Imajinatif (e.g., Patagonia)",
              "Deskriptif (e.g., The Weather Channel)",
              "Lainnya...",
            ],
            info: "Pilih jenis nuansa nama yang Anda cari.",
          },
          {
            name: "keywordsToInclude",
            label: "Kata atau Akar Kata untuk Disertakan (Opsional)",
            type: "text",
            placeholder: "e.g., 'Zen, Nova, Eco, Tech'",
            info: "Kata spesifik yang mungkin ingin Anda masukkan ke dalam nama.",
            optional: true,
          },
          {
            name: "keywordsToAvoid",
            label: "Kata atau Konsep untuk Dihindari",
            type: "text",
            placeholder: "e.g., 'Cloud, Sync, Global'",
            info: "Kata-words yang terlalu umum atau tidak sesuai dengan brand Anda.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Nama harus mudah diucapkan. Harus tersedia sebagai domain .com. Tidak boleh lebih dari 3 suku kata. Hindari nama yang terdengar seperti brand yang sudah ada.",
            info: "Batasan teknis atau kreatif lainnya yang sangat penting.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Slogan/Tagline": {
        description:
          "Ciptakan slogan atau tagline yang singkat, menarik, dan berkesan untuk brand atau kampanye Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pakar Slogan. AI akan menciptakan slogan atau tagline yang singkat, menarik, dan berkesan, dengan mempertimbangkan nama brand, manfaat inti, target audiens, dan gaya slogan yang diinginkan.",
        components: [
          {
            name: "brandName",
            label: "Nama Brand/Produk",
            type: "text",
            placeholder: "e.g., 'Kopi Kenangan'",
            info: "Nama yang akan diasosiasikan dengan slogan ini.",
            validation: { min_length: 5 },
          },
          {
            name: "coreBenefit",
            label: "Manfaat atau Perasaan Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Menyediakan kopi berkualitas tinggi dengan cepat untuk menemani setiap momen.'",
            info: "Apa satu hal terpenting yang harus dirasakan audiens dari slogan ini?",
            validation: { min_length: 20 },
          },
          {
            name: "targetAudience",
            label: "Target Audiens",
            type: "text",
            placeholder: "e.g., 'Pekerja muda, mahasiswa'",
            info: "Siapa yang ingin Anda sapa dengan slogan ini?",
            validation: { min_length: 5 },
          },
          {
            name: "sloganStyle",
            label: "Gaya Slogan",
            type: "select",
            options: [
              "Cerdas & Canggih",
              "Singkat & Berkesan",
              "Deskriptif & Jelas",
              "Mewah & Premium",
              "Humoris & Unik",
              "Lainnya...",
            ],
            info: "Pilih nuansa atau jenis slogan yang Anda inginkan.",
          },
          {
            name: "keywordsToInclude",
            label: "Kata Kunci Wajib (Opsional)",
            type: "text",
            placeholder: "e.g., 'Cepat, Momen, Rasa'",
            info: "Kata spesifik yang ingin Anda coba masukkan ke dalam slogan.",
            optional: true,
            validation: { min_length: 3 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Slogan harus terdiri dari 3-5 kata. Harus berima. Hindari kata 'terbaik'. Harus terdengar modern dan energik.",
            info: "Berikan batasan panjang, gaya, atau kata-kata yang harus dihindari.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Premis Film/Serial TV": {
        description:
          "Kembangkan ide premis satu kalimat (logline) yang menarik untuk film atau serial TV.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Premis Sinematik. AI akan mengembangkan ide premis satu kalimat (logline) yang menarik untuk film atau serial TV, dengan mempertimbangkan genre, tokoh utama, tujuan, rintangan, dan elemen unik untuk menghasilkan narasi yang ringkas dan memikat.",
        components: [
          {
            name: "genre",
            label: "Genre Utama",
            type: "text",
            placeholder: "e.g., 'Fiksi Ilmiah, Komedi Romantis'",
            info: "Genre utama akan menentukan nada dan ekspektasi.",
          },
          {
            name: "mainCharacter",
            label: "Tokoh Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Seorang pustakawan pemalu yang menemukan buku ajaib'",
            info: "Siapa protagonis cerita Anda dan apa ciri khasnya?",
          },
          {
            name: "goal",
            label: "Tujuan Tokoh Utama",
            type: "textarea",
            placeholder:
              "e.g., '...harus menggunakan buku itu untuk menyelamatkan dunianya dari kehampaan.'",
            info: "Apa yang ingin dicapai oleh tokoh utama?",
          },
          {
            name: "obstacle",
            label: "Rintangan Utama",
            type: "textarea",
            placeholder:
              "e.g., '...sambil diburu oleh perkumpulan rahasia yang ingin merebut buku itu.'",
            info: "Apa atau siapa yang menghalangi tujuan tokoh utama?",
          },
          {
            name: "twist",
            label: "Elemen Unik/Twist (Opsional)",
            type: "text",
            placeholder: "e.g., 'Ternyata buku itu menulis dirinya sendiri.'",
            info: "Apa yang membuat cerita Anda berbeda dan tidak klise?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat beberapa variasi logline. Gabungkan dua genre yang tidak biasa. Premis harus cocok untuk serial animasi.",
            info: "Instruksi kreatif lainnya.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Asisten Brainstorming": {
        description:
          "Ambil satu ide sentral dan hasilkan cabang-cabang ide terkait untuk mind mapping atau eksplorasi kreatif.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Fasilitator Ide. AI akan menghasilkan cabang-cabang ide terkait dari ide sentral yang diberikan, dengan mempertimbangkan fokus brainstorming dan batasan yang ada untuk mendukung eksplorasi kreatif.",
        components: [
          {
            name: "centralIdea",
            label: "Ide Sentral",
            type: "text",
            placeholder: "e.g., 'Membuka kedai kopi ramah lingkungan'",
            info: "Topik utama yang ingin Anda eksplorasi lebih dalam.",
            validation: { min_length: 10 },
          },
          {
            name: "brainstormingFocus",
            label: "Fokus Brainstorming",
            type: "select",
            options: [
              "Ide Pemasaran",
              "Fitur Produk/Layanan",
              "Potensi Masalah & Solusi",
              "Nama & Tagline",
              "Semua Aspek",
              "Lainnya...",
            ],
            info: "Pilih area spesifik yang ingin Anda gali idenya.",
          },
          {
            name: "numberOfIdeas",
            label: "Jumlah Ide yang Diinginkan",
            type: "number",
            placeholder: "e.g., 10",
            info: "Berapa banyak ide cabang yang ingin Anda hasilkan?",
            validation: { min_value: 1, max_value: 20 },
          },
          {
            name: "constraints",
            label: "Batasan (Opsional)",
            type: "text",
            placeholder: "e.g., 'Anggaran rendah, hanya untuk pasar lokal'",
            info: "Batasan akan membuat ide yang dihasilkan lebih realistis dan relevan.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Pikirkan ide yang paling tidak biasa dan 'out-of-the-box'. Kategorikan ide-ide yang dihasilkan. Setiap ide harus dijelaskan dalam satu kalimat.",
            info: "Instruksi tentang bagaimana AI harus melakukan brainstorming.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Utilitas & Development": {
      "Generator Data Dummy": {
        description:
          "Buat data palsu (dummy data) yang terstruktur untuk keperluan testing, prototyping, atau mengisi desain mockup.",
        toolType: "code",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Generator Data. AI akan menghasilkan data palsu (dummy data) yang terstruktur sesuai skema yang ditentukan, dengan mempertimbangkan jumlah record dan format output untuk keperluan testing atau prototyping.",
        components: [
          {
            name: "schemaName",
            label: "Nama Skema Data",
            type: "text",
            placeholder: "e.g., 'Daftar Pengguna'",
            info: "Nama objek data yang akan dibuat.",
          },
          {
            name: "schemaFields",
            label: "Spesifikasi Field (nama:tipe)",
            type: "textarea",
            placeholder:
              "e.g., 'nama:nama_lengkap\nemail:email\nusia:angka(18-65)\nstatus:pilihan(aktif|tidak aktif)'",
            info: "Definisikan setiap field dan tipenya (nama_lengkap, email, angka, teks, pilihan, dll.). Gunakan format 'nama:tipe(opsi)'.",
          },
          {
            name: "recordCount",
            label: "Jumlah Record",
            type: "number",
            placeholder: "e.g., 10",
            info: "Berapa banyak baris data yang ingin Anda hasilkan?",
          },
          {
            name: "outputFormat",
            label: "Format Output",
            type: "select",
            options: ["JSON Array", "CSV", "Lainnya..."],
            info: "Pilih format output yang diinginkan (misalnya, JSON Array, CSV).",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Pastikan email unik untuk setiap record. Buat data terlihat realistis. Usia harus berdistribusi normal.",
            info: "Instruksi spesifik tentang batasan data, relasi antar field, atau tingkat kerandoman.",
          },
        ],
      },
      "Penulis Dokumentasi Kode": {
        description:
          "Buat penjelasan (docstring) yang jelas untuk fungsi atau kelas dalam kode pemrograman.",
        toolType: "code",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Dokumentasi Kode. AI akan menganalisis potongan kode yang diberikan dan menghasilkan dokumentasi (docstring) yang jelas dan relevan, dengan mempertimbangkan bahasa pemrograman dan gaya dokumentasi yang diinginkan.",
        components: [
          {
            name: "codeSnippet",
            label: "Potongan Kode (Code Snippet)",
            type: "textarea",
            placeholder: "Tempelkan fungsi, kelas, atau metode Anda di sini.",
            info: "AI akan menganalisis kode untuk menghasilkan dokumentasi yang relevan.",
          },
          {
            name: "language",
            label: "Bahasa Pemrograman",
            type: "select",
            options: [
              "Python",
              "JavaScript",
              "TypeScript",
              "Java",
              "PHP",
              "Lainnya...",
            ],
            info: "Bahasa pemrograman akan menentukan format docstring (e.g., reST, JSDoc).",
          },
          {
            name: "documentationStyle",
            label: "Gaya Dokumentasi",
            type: "select",
            options: [
              "Google Style",
              "NumPy/SciPy Style",
              "JSDoc",
              "Standar",
              "Lainnya...",
            ],
            info: "Pilih format komentar dokumentasi yang umum digunakan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Jelaskan parameter 'user_id' secara lebih detail. Sertakan satu contoh penggunaan. Jelaskan apa yang di-return oleh fungsi ini.",
            info: "Informasi tambahan yang tidak bisa disimpulkan hanya dari kode.",
          },
        ],
      },
      "Generator Pesan Error Ramah Pengguna": {
        description:
          "Ubah pesan error teknis menjadi penjelasan yang mudah dipahami oleh pengguna non-teknis.",
        toolType: "code",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penerjemah Error. AI akan mengubah pesan error teknis menjadi penjelasan yang mudah dipahami oleh pengguna non-teknis, dengan fokus pada konteks pengguna dan saran tindakan yang jelas.",
        components: [
          {
            name: "technicalError",
            label: "Pesan Error Teknis",
            type: "text",
            placeholder:
              "e.g., 'Error 500: Internal Server Error', 'TypeError: Cannot read property 'name' of undefined'",
            info: "Pesan error asli dari sistem atau log.",
          },
          {
            name: "userContext",
            label: "Konteks Tindakan Pengguna",
            type: "textarea",
            placeholder:
              "e.g., 'Pengguna sedang mencoba mengunggah foto profil.'",
            info: "Apa yang sedang dilakukan pengguna saat error ini terjadi?",
          },
          {
            name: "targetAudience",
            label: "Target Audiens Pesan",
            type: "text",
            placeholder: "e.g., 'Pengguna umum aplikasi kami'",
            info: "Siapa yang akan melihat pesan error yang baru?",
          },
          {
            name: "suggestedAction",
            label: "Saran Tindakan untuk Pengguna",
            type: "text",
            placeholder:
              "e.g., 'Coba lagi beberapa saat, periksa koneksi internet Anda'",
            info: "Langkah apa yang bisa dicoba pengguna untuk menyelesaikan masalah?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan nada yang menenangkan dan jangan menyalahkan pengguna. Sertakan nomor ID error untuk referensi dukungan pelanggan. Buat pesan se-singkat mungkin.",
            info: "Instruksi tentang gaya bahasa, nada, atau informasi tambahan.",
          },
        ],
      },
      "Analis & Perangkum Dokumen Legal": {
        description:
          "Rangkum dokumen hukum yang panjang (misal: Ketentuan Layanan) ke dalam bahasa yang mudah dipahami.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Analis Hukum. AI akan menganalisis dokumen hukum yang panjang untuk mengekstrak poin-poin penting dan menyajikannya dalam bahasa yang mudah dipahami, dengan mempertimbangkan peran pengguna dan fokus analisis.",
        components: [
          {
            name: "legalDocument",
            label: "Teks Dokumen Legal",
            type: "textarea",
            placeholder:
              "Tempelkan seluruh teks dari dokumen legal seperti Ketentuan Layanan atau Kebijakan Privasi di sini.",
            info: "AI akan menganalisis teks ini untuk menemukan poin-poin terpentipenting.",
            validation: { min_length: 50 },
          },
          {
            name: "myRole",
            label: "Peran Saya",
            type: "select",
            options: [
              "Sebagai Konsumen/Pengguna",
              "Sebagai Pemilik Bisnis",
              "Lainnya...",
            ],
            info: "Dari sudut pandang mana AI harus menganalisis dokumen ini?",
          },
          {
            name: "focus",
            label: "Fokus Analisis",
            type: "text",
            placeholder:
              "e.g., 'Kewajiban saya', 'Hak saya atas data', 'Klausul pembatalan'",
            info: "Aspek apa dari dokumen yang paling ingin Anda pahami?",
          },
          {
            name: "outputFormat",
            label: "Format Output",
            type: "select",
            options: [
              "Poin-poin Ringkasan",
              "Tanya Jawab (FAQ)",
              "Tabel Hak & Kewajiban",
              "Lainnya...",
            ],
            info: "Pilih cara penyajian ringkasan yang paling mudah Anda pahami.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Cari 'red flags' atau klausa yang tidak biasa. Terjemahkan jargon hukum ke bahasa sehari-hari. Abaikan bagian definisi.",
            info: "Instruksi spesifik tentang apa yang harus dicari atau diabaikan oleh AI.",
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Analisis & Ekstraksi Data": {
      "Ekstraktor Entitas dari Teks": {
        description:
          "Tarik keluar informasi spesifik dari blok teks tidak terstruktur (nama orang, organisasi, lokasi, dll.).",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ekstraktor Data. AI akan menganalisis teks tidak terstruktur untuk mengidentifikasi dan mengekstrak entitas spesifik (seperti nama orang, organisasi, lokasi, dll.) dan menyajikannya dalam format yang diminta.",
        components: [
          {
            name: "sourceText",
            label: "Teks Sumber",
            type: "textarea",
            placeholder:
              "Tempelkan artikel, laporan, atau email di sini. AI akan memindai teks ini.",
            info: "Teks yang akan dianalisis untuk diekstrak informasinya.",
            validation: { min_length: 50 },
          },
          {
            name: "entitiesToExtract",
            label: "Entitas yang Akan Diekstrak (pisahkan koma)",
            type: "text",
            placeholder:
              "e.g., 'Nama Orang, Nama Organisasi, Lokasi, Tanggal, Produk, Uang'",
            info: "Jenis informasi apa yang Anda cari di dalam teks?",
          },
          {
            name: "outputFormat",
            label: "Format Output",
            type: "select",
            options: [
              "Daftar Sederhana per Kategori",
              "JSON dengan Kategori",
              "Tabel",
              "Lainnya...",
            ],
            info: "Pilih cara penyajian data yang diekstrak.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Abaikan nama orang yang hanya disebutkan sekali. Kelompokkan semua lokasi berdasarkan negara. Pastikan format tanggal konsisten (YYYY-MM-DD).",
            info: "Aturan spesifik untuk proses ekstraksi dan pemformatan.",
          },
        ],
      },
      "Analis Sentimen & Tema Umpan Balik": {
        description:
          "Proses puluhan ulasan pelanggan untuk mengidentifikasi sentimen umum dan tema yang sering dibicarakan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Analis Sentimen. AI akan menganalisis data umpan balik untuk mengidentifikasi sentimen (positif, negatif, netral) dan tema-tema utama yang muncul, serta menyajikan hasilnya dalam format yang diminta.",
        components: [
          {
            name: "feedbackData",
            label: "Data Umpan Balik/Ulasan",
            type: "textarea",
            placeholder:
              "Tempelkan semua ulasan di sini, pisahkan setiap ulasan dengan baris baru atau sebuah simbol (e.g., '---').",
            info: "Semakin banyak data yang Anda berikan, semakin akurat analisisnya.",
            validation: { min_length: 50 },
          },
          {
            name: "analysisType",
            label: "Jenis Analisis",
            type: "select",
            options: [
              "Analisis Sentimen (Positif/Negatif/Netral)",
              "Identifikasi Tema Utama",
              "Keduanya",
              "Lainnya...",
            ],
            info: "Pilih apa yang ingin Anda ketahui dari data ini.",
          },
          {
            name: "outputFormat",
            label: "Format Laporan",
            type: "select",
            options: [
              "Ringkasan Paragraf",
              "Poin-poin per Tema",
              "Tabel dengan Persentase Sentimen",
              "Lainnya...",
            ],
            info: "Pilih cara penyajian hasil analisis.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Kelompokkan tema ke dalam kategori 'Layanan', 'Produk', 'Harga'. Hitung berapa kali setiap tema disebutkan. Abaikan ulasan yang kurang dari 5 kata.",
            info: "Instruksi spesifik untuk proses analisis dan pelaporan.",
          },
        ],
      },
    },
    "Hiburan & Permainan": {
      "Generator Deskripsi Karakter RPG": {
        description:
          "Buat latar belakang, kepribadian, dan penampilan untuk karakter dalam permainan role-playing (e.g., D&D).",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pencipta Karakter RPG. AI akan menghasilkan latar belakang, kepribadian, dan penampilan untuk karakter RPG, dengan mempertimbangkan kelas, ras, watak, dan sifat kunci untuk menciptakan karakter yang unik dan menarik.",
        components: [
          {
            name: "gameSystem",
            label: "Sistem Permainan (Opsional)",
            type: "text",
            placeholder: "e.g., 'Dungeons & Dragons 5e', 'Pathfinder'",
            info: "Sistem permainan dapat mempengaruhi terminologi.",
          },
          {
            name: "characterClass",
            label: "Kelas Karakter",
            type: "text",
            placeholder: "e.g., 'Rogue', 'Wizard', 'Paladin'",
            info: "Profesi atau peran karakter dalam petualangan.",
          },
          {
            name: "characterRace",
            label: "Ras Karakter",
            type: "text",
            placeholder: "e.g., 'Elf', 'Dwarf', 'Human'",
            info: "Asal-usul atau spesies dari karakter.",
          },
          {
            name: "alignment",
            label: "Alignment (Watak)",
            type: "select",
            options: [
              "Lawful Good",
              "Neutral Good",
              "Chaotic Good",
              "Lawful Neutral",
              "True Neutral",
              "Chaotic Neutral",
              "Lawful Evil",
              "Neutral Evil",
              "Chaotic Evil",
              "Lainnya...",
            ],
            info: "Kompas moral dari karakter Anda.",
          },
          {
            name: "keyTraits",
            label: "Sifat Kunci/Keunikan",
            type: "textarea",
            placeholder:
              "e.g., 'Sangat takut pada laba-labar, memiliki bekas luka di mata kiri, selalu berbicara dengan sarkasme.'",
            info: "Berikan 2-3 detail unik untuk membuat karakter menonjol.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat latar belakang yang tragis. Hubungkan cerita karakter dengan sebuah artefak kuno. Karakternya harus berasal dari kota di padang pasir.",
            info: "Instruksi kreatif untuk memperkaya narasi karakter.",
          },
        ],
      },
      "Generator Teka-teki & Riddle": {
        description:
          "Buat teka-teki, riddle, atau puzzle logika yang orisinal berdasarkan sebuah tema atau jawaban.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perancang Teka-Teki. AI akan membuat teka-teki, riddle, atau puzzle logika yang orisinal, dengan mempertimbangkan jenis teka-teki, jawaban, tingkat kesulitan, dan tema untuk menghasilkan tantangan yang menarik.",
        components: [
          {
            name: "puzzleType",
            label: "Jenis Teka-teki",
            type: "select",
            options: [
              "Riddle (Teka-teki kiasan)",
              "Puzzle Logika",
              "Teka-teki Kata",
              "Lainnya...",
            ],
            info: "Pilih jenis tantangan yang ingin Anda buat.",
          },
          {
            name: "answer",
            label: "Jawaban Teka-teki",
            type: "text",
            placeholder: "e.g., 'Sebuah gema', 'Waktu', 'Papan catur'",
            info: "Apa jawaban dari teka-teki yang akan dibuat?",
          },
          {
            name: "difficultyLevel",
            label: "Tingkat Kesulitan",
            type: "select",
            options: [
              "Mudah (untuk anak-anak)",
              "Menengah",
              "Sulit",
              "Sangat Sulit (Kriptik)",
              "Lainnya...",
            ],
            info: "Seberapa menantang teka-teki yang Anda inginkan?",
          },
          {
            name: "theme",
            label: "Tema (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Alam', 'Teknologi', 'Fantasi Abad Pertengahan'",
            info: "Tema akan mempengaruhi pilihan kata dan kiasan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Teka-teki harus berima. Buat dalam bentuk dialog. Jawaban tidak boleh disebutkan secara langsung di dalam teka-teki. Sertakan satu petunjuk palsu.",
            info: "Aturan atau batasan spesifik untuk pembuatan teka-teki.",
          },
        ],
      },
    },
  },
  "Prompt Proyek": {
    "Pitch Investor, Proposal & Pedoman Operasional": {
      "SaaS Investor Pitch Deck (12-Slide VC Blueprint)": {
        description: "Slide presentasi pendanaan startup (Problem, Solution, Market Size, Product, Traction, Business Model, Team, The Ask).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Silicon Valley Venture Capital Partner ($500M Fund).",
        components: [
          {
            name: "startupPitchConcept",
            label: "Ide Startup & Traksi Saat Ini",
            type: "text",
            placeholder: "contoh: AI Customer Service Automation untuk E-Commerce dengan 50 Klien Berbayar dan $20k MRR",
            info: "Apa nama startup Anda dan bagaimana angka traksinya?",
          },
        ],
      },
      "Comprehensive B2B Proposal & Statement of Work (SOW)": {
        description: "Proposal penawaran jasa B2B formal lengkap dengan ruang lingkup pekerjaan, jadwal deliverables, klausul hukum, dan skema pembayaran.",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Enterprise Commercial Director & Legal Contract Specialist.",
        components: [
          {
            name: "projectScopeDeliverables",
            label: "Layanan & Lingkup Pekerjaan",
            type: "text",
            placeholder: "contoh: Jasa Pembuatan Ulang Website Perusahaan + Redesain UI/UX + Migrasi Data Server selama 8 Minggu",
            info: "Apa proyek jasa yang Anda tawarkan ke klien?",
          },
        ],
      },
      "Employee Onboarding Manual & First-90-Days Plan": {
        description: "Panduan orientasi karyawan baru 90 hari (Minggu 1 Pengenalan, Hari 30 Belajar, Hari 60 Kontribusi, Hari 90 Evaluasi).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Chief People Officer (CPO) & HR Lead.",
        components: [
          {
            name: "jobRoleOnboarded",
            label: "Posisi Karyawan Baru & Departemen",
            type: "text",
            placeholder: "contoh: Senior Frontend Engineer di Departemen Rekayasa Perangkat Lunak",
            info: "Posisi apa yang baru saja bergabung di tim Anda?",
          },
        ],
      },
      "Podcast Production & Sponsorship Kit One-Pager": {
        description: "Media kit podcast profesional untuk menarik sponsor brand (Statistik pendengar, demografi, paket slot iklan, rate card harga).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Podcast Sponsorship Director.",
        components: [
          {
            name: "podcastMetrics",
            label: "Nama Podcast & Statistik Pendengar",
            type: "text",
            placeholder: "contoh: 'Bisnis Bareng Ahli' - 50.000 Pendengar Bulanan, 80% Profesional Muda Usia 25-35 Tahun",
            info: "Data pendengar dan profil acara podcast Anda",
          },
        ],
      },
      "Brand Style Guide & Design Identity Manual": {
        description: "Buku panduan identitas visual brand (Penggunaan logo, warna primer/sekunder HEX, tipografi, dan visual tone).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Global Brand Identity Director.",
        components: [
          {
            name: "brandStyleAttributes",
            label: "Nama Brand & Karakter Visual",
            type: "text",
            placeholder: "contoh: Lumina Health - Brand Medis Premium Modern dengan Warna Deep Navy dan Cyan Berenergi",
            info: "Apa brand Anda dan karakter visual yang ingin distandarkan?",
          },
        ],
      },
      "Restaurant & Cafe Menu Engineering Blueprint": {
        description: "Perancangan daftar menu kafe/restoran berbasis psikologi penjualan (Golden triangle layout, visual anchor, pricing decoy, deskripsi hidangan).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Restaurant Consultant & Menu Engineering Specialist.",
        components: [
          {
            name: "restaurantConcept",
            label: "Konsep Restoran & Hidangan Bintang (Star Dish)",
            type: "text",
            placeholder: "contoh: Kafe Kopi Artisanal & Brunch dengan Menu Unggulan Truffle Mushroom Toast",
            info: "Apa konsep restoran dan menu andalan Anda?",
          },
        ],
      },
      "Customer Journey Mapping & Experience Optimization": {
        description: "Peta perjalanan pelanggan menyeluruh (Awareness, Consideration, Purchase, Onboarding, Loyalty, Advocacy) dengan titik sentuh (touchpoints).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Chief Experience Officer (CXO).",
        components: [
          {
            name: "customerJourneyScope",
            label: "Produk & Siklus Pembelian Pengguna",
            type: "text",
            placeholder: "contoh: Pembelian Kursus Online dari Melihat Iklan Medsos hingga Menjadi Afiliator Sukses",
            info: "Alur pengalaman pengguna apa yang ingin dipetakan?",
          },
        ],
      },
      "Product Packaging & Regulatory Label Copy Blueprint": {
        description: "Naskah label kemasan produk retail (Komposisi, klaim manfaat nutrisi, nomor izin edar, petunjuk penggunaan, peringatan alergen).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Consumer Packaging Specialist & Regulatory Compliance Officer.",
        components: [
          {
            name: "packagedProductType",
            label: "Jenis Produk Makanan / Minuman / Skincare",
            type: "text",
            placeholder: "contoh: Keripik Singkong Panggang Organik Bebas Gluten Rasa Sambal Matah",
            info: "Produk apa yang dibuatkan teks kemasannya?",
          },
        ],
      },
      "User Research & Customer Interview Protocol": {
        description: "Panduan wawancara riset pengguna (Pertanyaan terbuka, observasi perilaku, identifikasi frustrasi, dokumentasi temuan kebutuhan user).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Lead UX Researcher (Gaya Nielsen Norman Group).",
        components: [
          {
            name: "researchHypothesis",
            label: "Tujuan Riset Pengguna & Target Responden",
            type: "text",
            placeholder: "contoh: Mengapa pengguna aplikasi keuangan sering berhenti mencatat pengeluaran setelah 2 minggu?",
            info: "Pertanyaan riset apa yang ingin digali dari responden?",
          },
        ],
      },
      "Influencer Marketing Campaign Brief & SOP": {
        description: "Dokumen brief resmi untuk kreator konten / influencer (Ketentuan konten, do's & don'ts, pesan kunci, hashtag, batas waktu posting).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Influencer Marketing & Talent Agency Director.",
        components: [
          {
            name: "influencerCampaign",
            label: "Kampanye Produk & Jenis Influencer",
            type: "text",
            placeholder: "contoh: Peluncuran Minuman Isotonik Alami Menggandeng 20 Micro-Influencer Olahraga Lari",
            info: "Apa kampanye promosi yang dijalankan?",
          },
        ],
      },
      "Digital Product Launch Event Run-of-Show Rundown": {
        description: "Rundown teknis acara peluncuran produk online/live streaming per menit (Cues host, tayangan video, demo produk, sesi Q&A interaktif).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Virtual Event Broadcast Producer.",
        components: [
          {
            name: "virtualEventTitle",
            label: "Nama Acara Peluncuran Produk & Durasi",
            type: "text",
            placeholder: "contoh: Grand Launching Aplikasi FinTech Baru 2026 - Durasi 90 Menit Live YouTube & Zoom",
            info: "Nama acara dan estimasi durasi siaran",
          },
        ],
      },
      "Business Continuity & Disaster Recovery Plan (BCP)": {
        description: "Rencana mitigasi kelangsungan bisnis saat bencana (Tim darurat, backup data, protokol komunikasi krisis, lokasi kerja alternatif).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Enterprise Risk Management & BCP Lead.",
        components: [
          {
            name: "disasterThreats",
            label: "Jenis Potensi Ancaman Bencana / Insiden",
            type: "text",
            placeholder: "contoh: Gangguan Listrik & Internet Massal di Kantor Pusat atau Serangan Ransomware Siber",
            info: "Skenario krisis apa yang dibuatkan prosedur penanganannya?",
          },
        ],
      },
    },
    "Manajemen Operasional & Dokumen Korporat": {
      "Comprehensive Company Profile & Corporate Brochure Blueprint": {
        description: "Rancang buku profil perusahaan profesional 12 halaman (Visi, Misi, Sejarah, Layanan, Tim, Portofolio, Sertifikasi, dan Kontak).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Corporate Communications Director.",
        components: [
          {
            name: "companyDetails",
            label: "Nama Perusahaan & Bidang Industri",
            type: "text",
            placeholder: "contoh: PT Solusi Teknologi Nusantara - Penyedia Layanan Cloud & Keamanan Siber Enterprise",
            info: "Apa nama perusahaan dan spesialisasi bisnisnya?",
          },
        ],
      },
      "End-to-End Event & Conference Planning Playbook": {
        description: "Rencana operasional acara konferensi/seminar (Rundown detail per menit, anggaran biaya, daftar vendor, logistik, dan SOP mitigasi krisis).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah International Event Producer & Conference Director.",
        components: [
          {
            name: "eventConcept",
            label: "Nama Acara & Jumlah Peserta",
            type: "text",
            placeholder: "contoh: Konferensi Bisnis Digital Summit 2026 - 500 Peserta di Hotel Bintang 5 Jakarta",
            info: "Apa nama acara dan perkiraan skala tamunya?",
          },
        ],
      },
      "Franchise & Business SOP Operational Manual Architect": {
        description: "Buku panduan Standar Operasional Prosedur (SOP) franchise bisnis (Buka toko, operasional dapur/kasir, standar kebersihan, dan tutup toko).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Franchise Operations Director.",
        components: [
          {
            name: "franchiseType",
            label: "Jenis Bisnis Waralaba / Franchise",
            type: "text",
            placeholder: "contoh: Kedai Minuman Boba & Kopi Kekinian",
            info: "Apa model bisnis franchise yang dibuatkan SOP?",
          },
        ],
      },
      "Full Annual Marketing Strategy & Budget Allocation Plan": {
        description: "Rencana strategi pemasaran tahunan 360 derajat (Omnichannel, alokasi budget bulanan, target KPI, dan timeline kampanye).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Chief Marketing Officer (CMO).",
        components: [
          {
            name: "annualRevenueTarget",
            label: "Target Omset Tahunan & Alokasi Budget",
            type: "text",
            placeholder: "contoh: Target Omset Rp 10 Miliar dengan Total Anggaran Marketing Rp 1,5 Miliar",
            info: "Berapa target omset dan dana pemasaran yang disiapkan?",
          },
        ],
      },
      "White Paper & Industry Research Report Blueprint": {
        description: "Naskah laporan riset industri formal 15-20 halaman (Eksekutif summary, metodologi riset, temuan data, tren masa depan, dan rekomendasi kebijakan).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah McKinsey / Gartner Principal Research Lead.",
        components: [
          {
            name: "researchTopic",
            label: "Topik Riset Industri",
            type: "text",
            placeholder: "contoh: Dampak Adopsi Generative AI Terhadap Efisiensi Operasional Sektor Perbankan di Asia Tenggara",
            info: "Tema besar laporan riset yang ditulis",
          },
        ],
      },
      "E-Commerce Store Launch & Merchandising Strategy": {
        description: "Rencana peluncuran toko online lengkap (Kurasi produk hero, penetapan harga bundling, arsitektur kategori, dan strategi logistik).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah E-Commerce Director.",
        components: [
          {
            name: "ecommerceNiche",
            label: "Kategori Produk Toko Online",
            type: "text",
            placeholder: "contoh: Brand Fashion Pria Lokal Modern (Kemeja Linen, Celana Chino, Aksesoris)",
            info: "Apa produk yang dijual di toko online?",
          },
        ],
      },
    },
    "Penerbitan & Kampanye Publik": {
      "Crowdfunding Kickstarter / Indiegogo Campaign Page": {
        description: "Rancang struktur halaman kampanye urun dana berkonversi tinggi (Kisah pendiri, demo prototipe, reward tier matrix, FAQ, dan target funding).",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Crowdfunding Campaign Director dengan rekor jutaan dollar di Kickstarter. Rancang alur penawaran yang meyakinkan para early backer.",
        components: [
          {
            name: "campaignProduct",
            label: "Produk / Inovasi yang Didanai",
            type: "text",
            placeholder: "contoh: Smart Backpack Anti-Maling dengan Panel Surya dan Timbangan Digital Bawaan",
            info: "Apa proyek atau inovasi yang Anda luncurkan di Kickstarter?",
          },
          {
            name: "fundingGoal",
            label: "Target Pendanaan & Early Bird Offer",
            type: "text",
            placeholder: "contoh: Target $20.000 dengan diskon Early Bird 40% untuk 100 backer pertama",
            info: "Angka target dan penawaran khusus backer pertama",
          },
        ],
      },
      "Non-Fiction Book / Ebook 10-Chapter Blueprint": {
        description: "Rencana penulisan buku non-fiksi 10 bab lengkap dengan outline sub-bab, studi kasus nyata pendukung, dan lembar kerja praktik di setiap akhir bab.",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Bestselling Book Editor & Ghostwriter. Rancang arsitektur buku yang memikat pembaca dari bab pembuka hingga bab transformasi akhir.",
        components: [
          {
            name: "bookTitleIdea",
            label: "Ide Judul Buku & Transformasi Pembaca",
            type: "text",
            placeholder: "contoh: 'Fokus Tajam: Panduan Praktis Menaklukkan Distraksi Digital dan Melipatgandakan Karya'",
            info: "Apa judul atau tema besar buku Anda?",
          },
        ],
      },
    },
    "Bisnis & Peluncuran Produk": {
      "30-Day Go-To-Market (GTM) Launch Campaign": {
        description: "Perancangan roadmap komprehensif peluncuran produk 30 hari mencakup fase pre-launch teaser, launch day blitz, dan post-launch retention.",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Head of Growth & Product Marketing Director. Rancang rencana GTM 30 hari terperinci lengkap dengan metrik KPI, channel distribusi, dan taktik aktivasi.",
        components: [
          {
            name: "productOffer",
            label: "Produk & Nilai Unik (USP)",
            type: "text",
            placeholder: "contoh: Software CRM Berbasis AI untuk Tim Penjualan UMKM",
            info: "Apa produk yang diluncurkan dan apa keunggulan utamanya?",
          },
          {
            name: "targetMarket",
            label: "Target Pasar Utama",
            type: "text",
            placeholder: "contoh: Pemilik bisnis retail dan agensi digital dengan 5-20 staf",
            info: "Siapa segmen pasar sasaran kampanye ini?",
          },
          {
            name: "launchGoal",
            label: "Target Utama Peluncuran",
            type: "select",
            options: ["1.000 Pendaftar Akun Gratis (Freemium Acquisition)", "100 Pelanggan Berbayar Pertama (Early-Bird Revenue)", "Viralitas & Brand Awareness di Media Sosial (Top of Funnel)", "Kemitraan Strategis & Liputan Media / Press Release", "Lainnya..."],
            info: "Pilih sasaran utama kampanye peluncuran",
          },
        ],
      },
      "Masterclass & Online Course Curriculum Architect": {
        description: "Rancang kurikulum kursus online lengkap mencakup 6 modul progresif, silabus video, latihan praktik, studi kasus, dan kuis penilaian.",
        toolType: "planning",
        ai_logic_description: "Persona AI: Anda adalah Instructional Designer & Masterclass Producer. Rancang kurikulum edukasi terstruktur dengan scaffolding pedagogis yang menjamin student completion rate tinggi.",
        components: [
          {
            name: "courseTopic",
            label: "Topik Kursus & Keterampilan Akhir",
            type: "text",
            placeholder: "contoh: Menguasai Prompt Engineering & Otomasi AI dari Pemula hingga Ahli",
            info: "Keahlian apa yang akan dikuasai peserta setelah lulus?",
          },
          {
            name: "targetStudent",
            label: "Level Awal Peserta",
            type: "select",
            options: ["Pemula Total (Tanpa latar belakang teknis)", "Menengah (Sudah pakai AI tapi ingin hasil advance)", "Profesional & Eksekutif (Fokus pada efisiensi kerja dan strategi)", "Lainnya..."],
            info: "Tingkat pemahaman awal calon peserta",
          },
          {
            name: "courseFormat",
            label: "Format & Durasi Pembelajaran",
            type: "select",
            options: ["4 Minggu Bootcamp Intensif (Video On-Demand + Live Mentoring)", "6 Modul Self-Paced Video Course (~3-5 jam total konten)", "Workshop 2 Hari Penuh (Hands-on Project Based)", "Lainnya..."],
            info: "Struktur waktu dan metode pengiriman materi",
          },
        ],
      },
    },
    "Kreasi Digital Personal & Acara": {
      "Generator Undangan & Kartu Acara Dinamis": {
        description:
          "Buat undangan atau kartu ucapan untuk berbagai keperluan, dari pernikahan hingga bisnis.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perancang Undangan. AI akan menganalisis jenis acara untuk mengadopsi persona yang sesuai (Perencana Pernikahan, Asisten Eksekutif, dll.) dan menyusun teks dengan nada dan format yang tepat, menghasilkan undangan atau kartu ucapan yang dinamis dan personal.",
        components: [
          {
            name: "eventType",
            label: "Jenis Acara",
            type: "select",
            options: [
              "Pernikahan",
              "Bisnis/Resmi",
              "Ulang Tahun/Personal",
              "Workshop/Komunitas",
              "Terima Kasih",
            ],
            info: "Pilih jenis acara untuk menentukan format dan nada.",
            validation: { regex: "^(?!Pilih Jenis Acara...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "eventType",
          options: {
            Pernikahan: [
              {
                name: "coupleNames",
                label: "Nama Pasangan",
                type: "text",
                placeholder: "e.g., 'Sarah & David'",
                info: "Nama kedua mempelai.",
                validation: { min_length: 3 },
              },
              {
                name: "hosting_info",
                label: "Penyelenggara Acara",
                type: "text",
                placeholder: "e.g., 'Bersama kedua orang tua'",
                info: "Siapa yang mengundang? (misal: 'Mr. & Mrs. Budiman mengundang...')",
                validation: { min_length: 3 },
              },
              {
                name: "weddingStyle",
                label: "Gaya Pernikahan",
                type: "select",
                options: [
                  "Formal & Tradisional",
                  "Modern & Minimalis",
                  "Rustic & Santai",
                  "Bohemian & Unik",
                ],
                info: "Gaya keseluruhan akan mempengaruhi pilihan kata.",
              },
              {
                name: "ceremonyDateTime",
                label: "Tanggal & Waktu Akad/Pemberkatan",
                type: "text",
                placeholder: "e.g., 'Sabtu, 28 Desember 2025, Pukul 09:00'",
                info: "Waktu untuk acara inti.",
                validation: { min_length: 3 },
              },
              {
                name: "ceremonyLocation",
                label: "Lokasi Akad/Pemberkatan",
                type: "text",
                placeholder: "e.g., 'Masjid Istiqlal, Jakarta'",
                info: "Tempat acara inti.",
                validation: { min_length: 3 },
              },
              {
                name: "receptionDateTime",
                label: "Tanggal & Waktu Resepsi",
                type: "text",
                placeholder: "e.g., 'Sabtu, 28 Desember 2025, Pukul 19:00'",
                info: "Waktu untuk perayaan.",
                validation: { min_length: 3 },
              },
              {
                name: "receptionLocation",
                label: "Lokasi Resepsi",
                type: "text",
                placeholder:
                  "e.g., 'Gedung Serbaguna ABC, Jl. Merdeka No. 123'",
                info: "Tempat perayaan.",
                validation: { min_length: 3 },
              },
              {
                name: "dressCode",
                label: "Aturan Berpakaian (Dress Code)",
                type: "text",
                placeholder: "e.g., 'Batik, Jas Formal'",
                info: "Pakaian yang disarankan untuk tamu.",
                validation: { min_length: 3 },
              },
              {
                name: "rsvpInfo",
                label: "Informasi RSVP",
                type: "text",
                placeholder:
                  "e.g., 'Mohon konfirmasi ke 0812-3456-7890 (WhatsApp) sebelum 1 Desember'",
                info: "Cara dan batas waktu konfirmasi kehadiran.",
                validation: { min_length: 3 },
              },
              {
                name: "googleMapsLink",
                label: "Tautan Google Maps",
                type: "text",
                placeholder: "e.g., 'https://maps.app.goo.gl/xyz'",
                info: "Tautan Google Maps untuk lokasi acara.",
              },
            ],
            "Bisnis/Resmi": [
              {
                name: "eventName",
                label: "Nama Acara",
                type: "text",
                placeholder: "e.g., 'Konferensi Pers Tahunan'",
                info: "Judul resmi acara.",
                validation: { min_length: 5 },
              },
              {
                name: "organizer",
                label: "Penyelenggara",
                type: "text",
                placeholder: "e.g., 'PT Jaya Abadi'",
                info: "Organisasi atau departemen yang bertanggung jawab.",
                validation: { min_length: 5 },
              },
              {
                name: "objective",
                label: "Tujuan Acara",
                type: "text",
                placeholder: "e.g., 'Meluncurkan produk baru'",
                info: "Apa tujuan utama dari acara ini?",
                validation: { min_length: 5 },
              },
              {
                name: "keySpeaker",
                label: "Pembicara Utama",
                type: "text",
                placeholder: "e.g., 'Dr. Budi Santoso, CEO'",
                info: "Tokoh penting yang akan berbicara.",
                validation: { min_length: 5 },
              },
              {
                name: "dateTime",
                label: "Tanggal & Waktu",
                type: "text",
                placeholder:
                  "e.g., 'Senin, 20 Oktober 2025, 10:00 - 12:00 WIB'",
                info: "Waktu pelaksanaan acara.",
                validation: { min_length: 5 },
              },
              {
                name: "location",
                label: "Lokasi/Platform",
                type: "text",
                placeholder: "e.g., 'Ballroom Hotel Indonesia / Zoom Webinar'",
                info: "Tempat fisik atau platform virtual.",
                validation: { min_length: 5 },
              },
              {
                name: "agenda",
                label: "Agenda Singkat",
                type: "textarea",
                placeholder:
                  "e.g., '10:00 - Pembukaan\n10:15 - Sambutan CEO\n10:30 - Demo Produk'",
                info: "Rundown singkat acara.",
                validation: { min_length: 20 },
              },
              {
                name: "registrationLink",
                label: "Tautan Pendaftaran/RSVP",
                type: "text",
                placeholder: "e.g., 'bit.ly/DaftarAcaraXYZ'",
                info: "Link untuk konfirmasi atau pendaftaran.",
                validation: { min_length: 10 },
              },
              {
                name: "googleMapsLink",
                label: "Tautan Google Maps",
                type: "text",
                placeholder: "e.g., 'https://maps.app.goo.gl/xyz'",
                info: "Tautan Google Maps untuk lokasi acara.",
              },
            ],
            "Ulang Tahun/Personal": [
              {
                name: "personBeingCelebrated",
                label: "Nama yang Berulang Tahun",
                type: "text",
                placeholder: "e.g., 'Andi'",
                info: "Siapa yang merayakan?",
                validation: { min_length: 3 },
              },
              {
                name: "age",
                label: "Ulang Tahun ke- (Opsional)",
                type: "number",
                placeholder: "e.g., 30",
                info: "Perayaan ulang tahun yang ke berapa.",
                validation: { min_value: 1, max_value: 120 },
              },
              {
                name: "theme",
                label: "Tema Pesta",
                type: "text",
                placeholder: "e.g., 'Pesta Topeng, 90-an, Superhero'",
                info: "Tema spesifik untuk kostum atau dekorasi.",
                validation: { min_length: 3 },
              },
              {
                name: "dateTime",
                label: "Tanggal & Waktu",
                type: "text",
                placeholder: "e.g., 'Sabtu, 15 November 2025, Pukul 19:00'",
                info: "Kapan pesta akan diadakan?",
                validation: { min_length: 5 },
              },
              {
                name: "location",
                label: "Lokasi Pesta",
                type: "text",
                placeholder: "e.g., 'Rumah Andi, Jl. Bahagia No. 5'",
                info: "Di mana pesta akan diadakan?",
                validation: { min_length: 5 },
              },
              {
                name: "dressCode",
                label: "Aturan Berpakaian (Dress Code)",
                type: "text",
                placeholder: "e.g., 'Santai, Sesuai tema'",
                info: "Pakaian yang disarankan.",
                validation: { min_length: 3 },
              },
              {
                name: "rsvpContact",
                label: "Kontak RSVP",
                type: "text",
                placeholder: "e.g., 'Hubungi Budi di 0811-2233-4455'",
                info: "Siapa yang harus dihubungi untuk konfirmasi.",
                validation: { min_length: 5 },
              },
              {
                name: "giftInfo",
                label: "Informasi Kado (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Tidak perlu membawa kado, kehadiranmu adalah hadiah terbaik!'",
                info: "Petunjuk mengenai hadiah.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "googleMapsLink",
                label: "Tautan Google Maps",
                type: "text",
                placeholder: "e.g., 'https://maps.app.goo.gl/xyz'",
                info: "Tautan Google Maps untuk lokasi acara.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
            "Workshop/Komunitas": [
              {
                name: "eventName",
                label: "Nama Workshop/Acara",
                type: "text",
                placeholder: "e.g., 'Workshop Desain UI/UX Dasar'",
                info: "Judul lengkap workshop atau acara komunitas.",
                validation: { min_length: 5 },
              },
              {
                name: "organizer",
                label: "Penyelenggara",
                type: "text",
                placeholder: "e.g., 'Komunitas Developer Jakarta'",
                info: "Nama organisasi atau individu yang menyelenggarakan acara.",
                validation: { min_length: 5 },
              },
              {
                name: "shortDescription",
                label: "Deskripsi Singkat Acara",
                type: "textarea",
                placeholder:
                  "e.g., 'Pelajari dasar-dasar desain antarmuka pengguna dan pengalaman pengguna dalam workshop interaktif ini.'",
                info: "Ringkasan singkat tentang apa yang akan dipelajari atau dilakukan peserta.",
                validation: { min_length: 20 },
              },
              {
                name: "dateTime",
                label: "Tanggal & Waktu",
                type: "text",
                placeholder:
                  "e.g., 'Sabtu, 10 Agustus 2025, Pukul 09:00 - 16:00 WIB'",
                info: "Waktu pelaksanaan acara.",
                validation: { min_length: 5 },
              },
              {
                name: "location",
                label: "Lokasi/Platform",
                type: "text",
                placeholder:
                  "e.g., 'Co-working Space X, Jl. Sudirman No. 10 / Zoom Webinar'",
                info: "Tempat fisik atau platform virtual.",
                validation: { min_length: 5 },
              },
              {
                name: "speakers",
                label: "Pembicara/Fasilitator (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Andi Wijaya (Desainer Senior), Budi Santoso (Praktisi UX)'",
                info: "Nama dan peran pembicara atau fasilitator.",
                optional: true,
                validation: { min_length: 10 },
              },
              {
                name: "agenda",
                label: "Agenda/Materi Kunci (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Sesi 1: Pengantar UI/UX. Sesi 2: Prinsip Desain. Sesi 3: Studi Kasus & Praktik.'",
                info: "Poin-poin utama atau jadwal singkat acara.",
                optional: true,
                validation: { min_length: 20 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder:
                  "e.g., 'Mahasiswa desain, pemula di bidang IT, anggota komunitas umum'",
                info: "Siapa yang dituju oleh workshop/acara ini?",
                validation: { min_length: 5 },
              },
              {
                name: "registrationFee",
                label: "Biaya Pendaftaran (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Gratis', 'Rp 50.000 (termasuk sertifikat)'",
                info: "Informasi biaya dan apa yang didapatkan peserta.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "registrationLink",
                label: "Tautan Pendaftaran/RSVP",
                type: "text",
                placeholder: "e.g., 'bit.ly/DaftarWorkshopUIUX'",
                info: "Link untuk pendaftaran atau konfirmasi kehadiran.",
                optional: true,
                validation: { min_length: 10 },
              },
              {
                name: "contactInfo",
                label: "Kontak Informasi",
                type: "text",
                placeholder: "e.g., 'admin@komunitas.com / 0812-3456-7890'",
                info: "Informasi kontak untuk pertanyaan lebih lanjut.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "googleMapsLink",
                label: "Tautan Google Maps (Opsional)",
                type: "text",
                placeholder: "e.g., 'https://maps.app.goo.gl/xyz'",
                info: "Tautan Google Maps untuk lokasi acara fisik.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
            "Terima Kasih": [
              {
                name: "senderName",
                label: "Nama Pengirim",
                type: "text",
                placeholder: "e.g., 'Sarah & David', 'Tim XYZ'",
                info: "Siapa yang mengucapkan terima kasih.",
                validation: { min_length: 3 },
              },
              {
                name: "recipientName",
                label: "Nama Penerima (Opsional)",
                type: "text",
                placeholder: "e.g., 'Bapak/Ibu Budi', 'Para Tamu Undangan'",
                info: "Jika ingin personalisasi, sebutkan nama penerima.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "reason",
                label: "Alasan Ucapan Terima Kasih",
                type: "textarea",
                placeholder:
                  "e.g., 'atas kehadiran Anda di pernikahan kami', 'atas dukungan Anda pada proyek ini', 'atas hadiah yang indah'",
                info: "Jelaskan secara spesifik mengapa Anda berterima kasih.",
                validation: { min_length: 10 },
              },
              {
                name: "eventReference",
                label: "Referensi Acara (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Pernikahan kami pada 28 Desember', 'Acara peluncuran produk'",
                info: "Jika ucapan terima kasih terkait acara tertentu.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "messageTone",
                label: "Gaya & Nada Pesan",
                type: "select",
                options: [
                  "Tulus & Hangat",
                  "Formal & Profesional",
                  "Singkat & Efisien",
                  "Penuh Sukacita",
                ],
                info: "Pilih nuansa pesan yang ingin disampaikan.",
              },
              {
                name: "additionalDetails",
                label: "Detail Tambahan (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Sertakan foto kami berdua.', 'Sebutkan harapan untuk kolaborasi di masa depan.'",
                info: "Informasi atau instruksi spesifik lainnya.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus sangat peka terhadap `Jenis Acara`. Jika pengguna tidak memberikan `Gaya & Nada`, AI harus memilih yang paling sesuai secara default (misal: 'Elegan' untuk Pernikahan, 'Profesional' untuk Bisnis). Tujuan utamanya adalah menghasilkan output yang terasa otentik dan dibuat khusus untuk acara tersebut, bukan hasil dari template generik.",
      },
    },
    "Konten & Pemasaran": {
      "Generator Konten Multi-Platform": {
        description:
          "Buat konten untuk berbagai platform—artikel blog yang SEO-friendly, postingan media sosial yang menarik, deskripsi produk yang menjual, skrip video pendek, bahkan lirik lagu.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Kepala Strategi Konten. AI akan bertindak sebagai Kepala Strategi Konten yang adaptif, memahami jenis konten yang diminta dan bertransformasi menjadi persona spesialis yang relevan untuk menghasilkan konten yang dioptimalkan untuk berbagai platform.",
        components: [
          {
            name: "contentType",
            label: "Jenis Konten",
            type: "select",
            options: [
              "Artikel Blog",
              "Post Media Sosial",
              "Deskripsi Produk",
              "Skrip Video Pendek",
              "Resensi",
              "Lirik Lagu",
              "Naskah Iklan",
            ],
            info: "Pilih jenis konten yang ingin Anda hasilkan.",
          },
        ],
        dynamicSubcomponents: {
          trigger: "contentType",
          options: {
            "Artikel Blog": [
              {
                name: "topic",
                label: "Topik/Judul Utama",
                type: "text",
                placeholder: "e.g., 'Manfaat Kopi Organik'",
                info: "Inti dari konten yang akan dibuat.",
                validation: { min_length: 5 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder: "e.g., 'Profesional muda, Ibu rumah tangga'",
                info: "Siapa yang akan mengonsumsi konten ini?",
                validation: { min_length: 5 },
              },
              {
                name: "keywords",
                label: "Kata Kunci SEO",
                type: "text",
                placeholder: "e.g., 'kopi organik, kesehatan, produktivitas'",
                info: "Kata kunci untuk optimasi mesin pencari.",
                validation: { min_length: 3 },
              },
              {
                name: "tone",
                label: "Gaya & Nada",
                type: "select",
                options: ["Informatif", "Profesional", "Kasual", "Persuasif"],
                info: "Pilih nuansa yang diinginkan untuk artikel Anda.",
              },
              {
                name: "cta",
                label: "Tujuan/Call to Action (CTA)",
                type: "text",
                placeholder:
                  "e.g., 'Kunjungi website kami untuk info lebih lanjut'",
                info: "Tindakan apa yang Anda ingin pembaca lakukan?",
                validation: { min_length: 5 },
              },
            ],
            "Post Media Sosial": [
              {
                name: "platform",
                label: "Platform Spesifik",
                type: "select",
                options: [
                  "Instagram",
                  "Facebook",
                  "Twitter/X",
                  "LinkedIn",
                  "TikTok",
                ],
                info: "Pilih platform media sosial yang dituju.",
              },
              {
                name: "topic",
                label: "Pesan Utama Postingan",
                type: "text",
                placeholder: "e.g., 'Diskon 50% untuk produk baru kami!'",
                info: "Inti dari pesan yang ingin disampaikan.",
                validation: { min_length: 5 },
              },
              {
                name: "visualIdea",
                label: "Ide Visual",
                type: "text",
                placeholder: "e.g., 'Foto produk dengan latar belakang cerah'",
                info: "Deskripsikan gambar atau video yang akan menyertai teks.",
                validation: { min_length: 10 },
              },
              {
                name: "tone",
                label: "Gaya & Nada",
                type: "select",
                options: [
                  "Menarik & Singkat",
                  "Humoris",
                  "Inspiratif",
                  "Informatif",
                ],
                info: "Pilih nuansa yang sesuai dengan platform.",
              },
              {
                name: "hashtagSuggestions",
                label: "Saran Hashtag",
                type: "text",
                placeholder: "e.g., '#promo #diskon #produkkecantikan'",
                info: "Saran hashtag untuk meningkatkan jangkauan.",
                validation: { min_length: 3 },
              },
            ],
            "Deskripsi Produk": [
              {
                name: "productName",
                label: "Nama Produk",
                type: "text",
                placeholder: "e.g., 'Sepatu Lari Cepat X2000'",
                info: "Nama lengkap produk.",
                validation: { min_length: 5 },
              },
              {
                name: "features",
                label: "Fitur-Fitur Utama",
                type: "textarea",
                placeholder:
                  "e.g., 'Sol responsif, bahan ringan, desain aerodinamis'",
                info: "Sebutkan fitur-fitur utama produk.",
                validation: { min_length: 10 },
              },
              {
                name: "benefits",
                label: "Manfaat untuk Pelanggan",
                type: "textarea",
                placeholder:
                  "e.g., 'Lari lebih cepat, mengurangi risiko cedera, nyaman dipakai seharian'",
                info: "Jelaskan bagaimana fitur tersebut menguntungkan pelanggan.",
                validation: { min_length: 10 },
              },
              {
                name: "targetAudience",
                label: "Target Pelanggan",
                type: "text",
                placeholder: "e.g., 'Pelari profesional, penggemar olahraga'",
                info: "Siapa target pasar utama produk ini?",
                validation: { min_length: 5 },
              },
              {
                name: "tone",
                label: "Gaya & Nada",
                type: "select",
                options: [
                  "Persuasif & Menjual",
                  "Teknis & Detail",
                  "Mewah & Eksklusif",
                ],
                info: "Pilih nuansa yang sesuai dengan citra merek Anda.",
              },
            ],
            "Skrip Video Pendek": [
              {
                name: "videoTopic",
                label: "Topik Video",
                type: "text",
                placeholder: "e.g., 'Tutorial makeup 5 menit'",
                info: "Judul atau ide utama video.",
                validation: { min_length: 5 },
              },
              {
                name: "hook",
                label: "Hook (3 Detik Pertama)",
                type: "text",
                placeholder: "e.g., 'Tampil cantik dalam 5 menit? Bisa!'",
                info: "Kalimat pembuka yang menarik perhatian.",
                validation: { min_length: 5 },
              },
              {
                name: "keyScenes",
                label: "Adegan-Adegan Kunci",
                type: "textarea",
                placeholder:
                  "e.g., 'Scene 1: Tampilkan semua produk. Scene 2: Langkah pertama. Scene 3: Hasil akhir.'",
                info: "Urutan adegan utama dalam video.",
                validation: { min_length: 10 },
              },
              {
                name: "duration",
                label: "Target Durasi (detik)",
                type: "number",
                placeholder: "e.g., 60",
                info: "Perkiraan panjang video.",
                validation: { min_value: 5, max_value: 300 },
              },
              {
                name: "cta",
                label: "Call to Action di Akhir",
                type: "text",
                placeholder: "e.g., 'Jangan lupa like dan follow!'",
                info: "Ajak penonton untuk berinteraksi.",
                validation: { min_length: 5 },
              },
            ],
            Resensi: [
              {
                name: "itemToReview",
                label: "Item yang Diresensi",
                type: "text",
                placeholder:
                  "e.g., 'Buku 'Filosofi Teras', Film 'Parasite', Smartphone XYZ'",
                info: "Produk, buku, film, atau layanan yang akan diresensi.",
                validation: { min_length: 5 },
              },
              {
                name: "reviewType",
                label: "Jenis Resensi",
                type: "select",
                options: ["Positif", "Negatif", "Seimbang", "Perbandingan"],
                info: "Fokus resensi (misal: menyoroti kelebihan, kekurangan, atau perbandingan).",
              },
              {
                name: "keyPoints",
                label: "Poin-Poin Kunci yang Ingin Disampaikan",
                type: "textarea",
                placeholder:
                  "e.g., 'Kelebihan: plot twist tak terduga, akting memukau. Kekurangan: pacing lambat di awal.'",
                info: "Sebutkan aspek-aspek utama yang ingin Anda bahas.",
                validation: { min_length: 20 },
              },
              {
                name: "rating",
                label: "Rating (Opsional)",
                type: "text",
                placeholder: "e.g., '4/5 bintang', 'Sangat Direkomendasikan'",
                info: "Penilaian keseluruhan jika ada.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "targetAudience",
                label: "Target Pembaca Resensi",
                type: "text",
                placeholder:
                  "e.g., 'Penggemar film horor, calon pembeli gadget'",
                info: "Siapa yang akan membaca resensi ini?",
                validation: { min_length: 5 },
              },
            ],
            "Lirik Lagu": [
              {
                name: "songTitle",
                label: "Judul Lagu (Opsional)",
                type: "text",
                placeholder: "e.g., 'Senja di Batas Kota'",
                info: "Judul lagu jika sudah ada.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "genre",
                label: "Genre Musik",
                type: "select",
                options: [
                  "Pop",
                  "Rock",
                  "R&B",
                  "Folk",
                  "Hip-Hop",
                  "Electronic",
                  "Lainnya...",
                ],
                info: "Genre akan mempengaruhi gaya bahasa dan struktur lirik.",
              },
              {
                name: "theme",
                label: "Tema Lagu",
                type: "text",
                placeholder:
                  "e.g., 'cinta pertama, patah hati, perjalanan hidup'",
                info: "Gagasan atau cerita utama di balik lagu.",
                validation: { min_length: 5 },
              },
              {
                name: "mood",
                label: "Suasana Hati Lagu",
                type: "select",
                options: [
                  "Senang & Ceria",
                  "Sedih & Melankolis",
                  "Energik & Memotivasi",
                  "Romantis & Intim",
                ],
                info: "Emosi utama yang ingin disampaikan melalui lirik.",
              },
              {
                name: "keyElements",
                label: "Elemen/Kata Kunci Wajib",
                type: "textarea",
                placeholder:
                  "e.g., 'sebutkan kata 'bintang', 'malam', 'harapan'",
                info: "Gambar, kata, atau frasa spesifik yang harus ada dalam lirik.",
                validation: { min_length: 5 },
              },
            ],
            "Naskah Iklan": [
              {
                name: "adPlatform",
                label: "Platform Iklan",
                type: "select",
                options: [
                  "Google Ads",
                  "Facebook/Instagram Ads",
                  "TikTok Ads",
                  "YouTube Ads",
                  "Lainnya...",
                ],
                info: "Platform akan mempengaruhi batasan karakter dan format.",
              },
              {
                name: "productService",
                label: "Produk/Layanan yang Diiklankan",
                type: "text",
                placeholder: "e.g., 'Kursus Online Bahasa Inggris'",
                info: "Apa yang Anda promosikan?",
              },
              {
                name: "targetAudience",
                label: "Target Audiens Iklan",
                type: "text",
                placeholder: "e.g., 'Pelajar SMA, Profesional Muda'",
                info: "Siapa yang ingin Anda jangkau dengan iklan ini?",
              },
              {
                name: "uniqueSellingPoint",
                label: "Unique Selling Point (USP)",
                type: "textarea",
                placeholder:
                  "e.g., 'Metode belajar interaktif, garansi mahir dalam 3 bulan.'",
                info: "Apa yang membuat produk/layanan Anda unik dan lebih baik?",
              },
              {
                name: "callToAction",
                label: "Call to Action (CTA)",
                type: "text",
                placeholder:
                  "e.g., 'Daftar Sekarang!', 'Unduh Aplikasi Gratis!'",
                info: "Tindakan spesifik yang Anda ingin audiens lakukan.",
              },
              {
                name: "adLength",
                label: "Panjang Iklan",
                type: "select",
                options: [
                  "Sangat Singkat (Headline & Deskripsi)",
                  "Singkat (Beberapa Kalimat)",
                  "Sedang (Paragraf Singkat)",
                ],
                info: "Pilih panjang teks iklan yang diinginkan.",
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus proaktif. Jika pengguna meminta 'Post Media Sosial' tanpa menyebut platform, buat versi untuk Instagram sebagai default. Jika tidak ada 'Gaya & Nada', pilih yang paling umum untuk 'Jenis Konten' (misal: 'Informatif' untuk Blog, 'Persuasif' untuk Deskripsi Produk). Selalu prioritaskan kejelasan, keringkasan, dan dampak sesuai dengan tujuan akhir konten (menjual, mengedukasi, atau menghibur). Untuk konten kreatif seperti lirik, jangan takut untuk menjadi lebih puitis dan abstrak.",
      },
    },
    "Branding & Identitas": {
      "Studio Branding & Identitas": {
        description:
          "Dapatkan bantuan untuk nama, slogan, dan konsep logo untuk bisnis atau proyek baru Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Direktur Kreatif Branding. AI akan bertindak sebagai Direktur Kreatif di agensi branding, menerjemahkan esensi ide menjadi aset kreatif (nama, slogan, konsep logo) yang relevan dan memberikan opsi yang bervariasi.",
        components: [
          {
            name: "assetType",
            label: "Jenis Aset Branding",
            type: "select",
            options: ["Nama Brand", "Slogan/Tagline", "Konsep Logo"],
            info: "Pilih aset branding yang Anda butuhkan.",
            validation: { regex: "^(?!Pilih Jenis Aset Branding...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "assetType",
          options: {
            "Nama Brand": [
              {
                name: "projectDescription",
                label: "Deskripsi Singkat Proyek",
                type: "textarea",
                placeholder:
                  "e.g., 'Sebuah kedai kopi yang fokus pada biji lokal dan suasana yang nyaman untuk bekerja.'",
                info: "Jelaskan apa yang Anda lakukan atau tawarkan.",
                validation: { min_length: 20 },
              },
              {
                name: "brandPersonality",
                label: "Kepribadian & Nilai Brand",
                type: "text",
                placeholder: "e.g., 'Modern, minimalis, ramah, tepercaya'",
                info: "Sebutkan 3-5 kata yang mendeskripsikan brand Anda.",
                validation: { min_length: 5 },
              },
              {
                name: "keywords",
                label: "Kata Kunci untuk Disertakan",
                type: "text",
                placeholder: "e.g., 'Jawa, pagi, tenang'",
                info: "Kata atau ide yang ingin Anda sertakan dalam nama.",
                validation: { min_length: 3 },
              },
              {
                name: "nameStyle",
                label: "Gaya Nama",
                type: "select",
                options: [
                  "Modern & Singkat",
                  "Klasik & Elegan",
                  "Deskriptif",
                  "Imajinatif & Unik",
                ],
                info: "Pilih gaya nama yang Anda inginkan.",
              },
            ],
            "Slogan/Tagline": [
              {
                name: "projectName",
                label: "Nama Proyek/Bisnis",
                type: "text",
                placeholder: "e.g., 'Kopi Pagi'",
                info: "Nama yang akan diasosiasikan dengan slogan ini.",
                validation: { min_length: 3 },
              },
              {
                name: "coreBenefit",
                label: "Manfaat Utama",
                type: "text",
                placeholder:
                  "e.g., 'Secangkir semangat untuk memulai hari Anda'",
                info: "Apa manfaat atau perasaan utama yang ingin disampaikan?",
                validation: { min_length: 10 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder: "e.g., 'Pekerja remote, mahasiswa'",
                info: "Siapa yang ingin Anda sapa dengan slogan ini?",
                validation: { min_length: 5 },
              },
              {
                name: "sloganStyle",
                label: "Gaya Slogan",
                type: "select",
                options: [
                  "Singkat & Berkesan",
                  "Deskriptif & Jelas",
                  "Cerdas & Berima",
                ],
                info: "Pilih gaya slogan yang Anda inginkan.",
              },
            ],
            "Konsep Logo": [
              {
                name: "projectName",
                label: "Nama Proyek/Bisnis",
                type: "text",
                placeholder: "e.g., 'Kopi Pagi'",
                info: "Teks utama yang mungkin ada di logo.",
                validation: { min_length: 3 },
              },
              {
                name: "logoType",
                label: "Jenis Logo",
                type: "select",
                options: [
                  "Wordmark (teks saja)",
                  "Pictorial Mark (simbol/ikon)",
                  "Combination Mark (teks & simbol)",
                  "Emblem",
                ],
                info: "Pilih jenis struktur logo yang Anda inginkan.",
              },
              {
                name: "visualElements",
                label: "Elemen Visual yang Diinginkan",
                type: "text",
                placeholder: "e.g., 'Biji kopi, matahari terbit, cangkir'",
                info: "Sebutkan objek atau simbol yang ingin Anda lihat di logo.",
                validation: { min_length: 5 },
              },
              {
                name: "colorPalette",
                label: "Palet Warna",
                type: "text",
                placeholder: "e.g., 'Coklat hangat, oranye, krem'",
                info: "Warna-warna yang Anda inginkan untuk logo.",
                validation: { min_length: 5 },
              },
              {
                name: "styleAesthetic",
                label: "Gaya & Estetika",
                type: "select",
                options: [
                  "Minimalis & Modern",
                  "Vintage & Klasik",
                  "Hand-drawn & Organik",
                ],
                info: "Pilih gaya visual keseluruhan untuk logo.",
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu memberikan beberapa opsi yang bervariasi dalam gaya dan pendekatan. Untuk nama, AI harus menyarankan nama yang terdengar baik saat diucapkan dan mudah dieja. Untuk slogan, prioritaskan keringkasan. Untuk konsep logo, fokus pada deskripsi yang bisa dipahami oleh desainer maupun non-desainer. Penting: Selalu sertakan disclaimer bahwa AI tidak dapat memeriksa ketersediaan merek dagang (trademark) atau domain, dan pengguna harus melakukan verifikasi sendiri.",
      },
    },
    "Perencanaan & Produktivitas Personal": {
      "Asisten Perencana Gaya Hidup Personal": {
        description:
          "Dapatkan rencana terstruktur untuk diet, olahraga, kebersihan, dan pengembangan diri.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Lifestyle Architect. AI akan bertindak sebagai 'Lifestyle Architect' yang holistik. Anda akan bertransformasi menjadi Ahli Gizi, Pelatih Kebugaran, atau Pelatih Produktivitas tergantung pada jenis rencana yang diminta pengguna untuk membuat rencana yang paling efektif dan memotivasi.",
        components: [
          {
            name: "planType",
            label: "Jenis Rencana",
            type: "select",
            options: [
              "Rencana Menu Makan",
              "Jadwal Olahraga",
              "Daftar Tugas",
              "Jadwal Kebersihan",
              "Rencana Pengembangan Diri",
              "Pelacak Kebiasaan",
            ],
            info: "Pilih aspek kehidupan yang ingin Anda rencanakan.",
            validation: { regex: "^(?!Pilih Jenis Rencana...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "planType",
          options: {
            "Rencana Menu Makan": [
              {
                name: "dietaryPreferences",
                label: "Preferensi Diet",
                type: "select",
                options: ["Omnivore", "Vegetarian", "Vegan", "Keto", "Paleo"],
                info: "Pilih jenis diet yang Anda ikuti.",
              },
              {
                name: "allergies",
                label: "Alergi atau Pantangan",
                type: "text",
                placeholder: "e.g., 'Kacang, gluten, susu'",
                info: "Sebutkan makanan yang harus dihindari.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "healthGoal",
                label: "Tujuan Kesehatan",
                type: "text",
                placeholder:
                  "e.g., 'Menurunkan berat badan, menambah massa otot'",
                info: "Apa tujuan utama dari rencana makan ini?",
                validation: { min_length: 5 },
              },
              {
                name: "numberOfMeals",
                label: "Jumlah Makanan per Hari",
                type: "number",
                placeholder: "e.g., 3",
                info: "Berapa kali Anda makan dalam sehari?",
                validation: { min_value: 1, max_value: 6 },
              },
              {
                name: "cookTime",
                label: "Waktu Memasak Maksimal (menit)",
                type: "number",
                placeholder: "e.g., 30",
                info: "Berapa lama waktu yang Anda miliki untuk memasak?",
                validation: { min_value: 5, max_value: 180 },
              },
            ],
            "Jadwal Olahraga": [
              {
                name: "fitnessLevel",
                label: "Tingkat Kebugaran",
                type: "select",
                options: ["Pemula", "Menengah", "Mahir"],
                info: "Pilih tingkat kebugaran Anda saat ini.",
              },
              {
                name: "workoutFrequency",
                label: "Frekuensi Olahraga (hari/minggu)",
                type: "number",
                placeholder: "e.g., 3",
                info: "Berapa hari dalam seminggu Anda bisa berolahraga?",
                validation: { min_value: 1, max_value: 7 },
              },
              {
                name: "workoutDuration",
                label: "Durasi Olahraga (menit)",
                type: "number",
                placeholder: "e.g., 45",
                info: "Berapa lama waktu yang Anda miliki untuk setiap sesi?",
                validation: { min_value: 15, max_value: 180 },
              },
              {
                name: "workoutType",
                label: "Jenis Olahraga yang Disukai",
                type: "text",
                placeholder: "e.g., 'Angkat beban, lari, yoga'",
                info: "Sebutkan jenis olahraga yang Anda nikmati.",
                validation: { min_length: 3 },
              },
              {
                name: "equipment",
                label: "Peralatan yang Tersedia",
                type: "text",
                placeholder: "e.g., 'Dumbbell, matras yoga, tidak ada alat'",
                info: "Sebutkan peralatan yang Anda miliki.",
                optional: true,
                validation: { min_length: 3 },
              },
            ],
            "Daftar Tugas": [
              {
                name: "mainProject",
                label: "Proyek atau Tujuan Utama",
                type: "text",
                placeholder: "e.g., 'Menyelesaikan laporan kuartalan'",
                info: "Apa tujuan besar yang ingin Anda capai?",
                validation: { min_length: 5 },
              },
              {
                name: "deadline",
                label: "Tenggat Waktu",
                type: "text",
                placeholder: "e.g., 'Jumat ini'",
                info: "Kapan proyek ini harus selesai?",
                validation: { min_length: 5 },
              },
              {
                name: "priorityLevel",
                label: "Tingkat Prioritas",
                type: "select",
                options: ["Tinggi", "Sedang", "Rendah"],
                info: "Seberapa penting proyek ini?",
              },
              {
                name: "subtasks",
                label: "Tugas-tugas Kecil (jika sudah ada)",
                type: "textarea",
                placeholder: "e.g., 'Kumpulkan data, buat draf, revisi'",
                info: "Sebutkan langkah-langkah yang sudah Anda ketahui.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
            "Jadwal Kebersihan": [
              {
                name: "cleaningFrequency",
                label: "Frekuensi Kebersihan",
                type: "select",
                options: ["Harian", "Mingguan", "Bulanan", "Musiman"],
                info: "Seberapa sering Anda ingin membersihkan?",
              },
              {
                name: "areasToClean",
                label: "Area yang Akan Dibersihkan",
                type: "textarea",
                placeholder:
                  "e.g., 'Dapur, Kamar Mandi, Ruang Tamu, Kamar Tidur'",
                info: "Sebutkan area spesifik di rumah atau kantor yang perlu dibersihkan.",
                validation: { min_length: 5 },
              },
              {
                name: "specificTasks",
                label: "Tugas Spesifik per Area (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Dapur: cuci piring, lap meja, buang sampah. Kamar Mandi: sikat toilet, bersihkan wastafel.'",
                info: "Detail tugas kebersihan untuk setiap area.",
                optional: true,
                validation: { min_length: 10 },
              },
              {
                name: "timePerTask",
                label: "Estimasi Waktu per Tugas (menit)",
                type: "number",
                placeholder: "e.g., 15",
                info: "Perkiraan waktu yang dibutuhkan untuk setiap tugas kebersihan.",
                optional: true,
                validation: { min_value: 1, max_value: 240 },
              },
            ],
            "Rencana Pengembangan Diri": [
              {
                name: "developmentArea",
                label: "Area Pengembangan",
                type: "text",
                placeholder:
                  "e.g., 'Keterampilan Komunikasi, Manajemen Waktu, Belajar Bahasa Baru'",
                info: "Aspek diri yang ingin Anda tingkatkan.",
                validation: { min_length: 5 },
              },
              {
                name: "currentLevel",
                label: "Tingkat Saat Ini",
                type: "text",
                placeholder:
                  "e.g., 'Pemula, Cukup Baik, Perlu Peningkatan Signifikan'",
                info: "Evaluasi diri Anda saat ini di area tersebut.",
                validation: { min_length: 5 },
              },
              {
                name: "desiredOutcome",
                label: "Hasil yang Diinginkan",
                type: "textarea",
                placeholder:
                  "e.g., 'Mampu presentasi dengan percaya diri di depan 50 orang. Menguasai percakapan dasar bahasa Mandarin.'",
                info: "Apa yang ingin Anda capai secara spesifik dan terukur?",
                validation: { min_length: 10 },
              },
              {
                name: "actionSteps",
                label: "Langkah-Langkah Tindakan",
                type: "textarea",
                placeholder:
                  "e.g., 'Minggu 1: Ikuti kursus online. Minggu 2: Latihan berbicara dengan native speaker.'",
                info: "Langkah-langkah konkret yang akan Anda ambil untuk mencapai tujuan.",
                validation: { min_length: 10 },
              },
              {
                name: "resources",
                label: "Sumber Daya yang Dibutuhkan (Opsional)",
                type: "text",
                placeholder: "e.g., 'Buku, kursus online, mentor'",
                info: "Daftar sumber daya yang mungkin diperlukan.",
                optional: true,
                validation: { min_length: 3 },
              },
            ],
            "Pelacak Kebiasaan": [
              {
                name: "habitName",
                label: "Nama Kebiasaan",
                type: "text",
                placeholder: "e.g., 'Minum 8 gelas air', 'Membaca 30 menit'",
                info: "Kebiasaan yang ingin Anda bangun atau lacak.",
                validation: { min_length: 5 },
              },
              {
                name: "frequency",
                label: "Frekuensi",
                type: "select",
                options: ["Harian", "Mingguan", "Beberapa Kali Seminggu"],
                info: "Seberapa sering kebiasaan ini akan dilakukan?",
              },
              {
                name: "trigger",
                label: "Pemicu (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Setelah bangun tidur', 'Sebelum makan malam'",
                info: "Apa yang akan memicu Anda untuk melakukan kebiasaan ini?",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "reward",
                label: "Hadiah (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Menonton episode serial favorit', 'Makan camilan sehat'",
                info: "Hadiah kecil untuk memotivasi diri setelah berhasil.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "trackingMethod",
                label: "Metode Pelacakan",
                type: "select",
                options: ["Checklist Harian", "Aplikasi Mobile", "Jurnal"],
                info: "Bagaimana Anda akan melacak kemajuan kebiasaan ini?",
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu memberikan nasihat yang positif dan memotivasi. Untuk rencana terkait kesehatan (diet & olahraga), AI wajib menyertakan disclaimer: 'Saya adalah asisten AI dan bukan profesional medis. Selalu konsultasikan dengan dokter atau ahli gizi/pelatih bersertifikat sebelum memulai program kesehatan baru.' Jika pengguna memberikan batasan yang tidak realistis, AI harus memberikan saran yang lebih masuk akal dengan cara yang suportif.",
      },
    },
    "Generator Nama & Ide Kreatif": {
      "Generator Nama Universal": {
        description:
          "Dapatkan nama kreatif untuk bayi, bisnis, tim, karakter fiksi, dan lainnya.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Nomenclaturist & Onomastika Kreatif. AI akan bertindak sebagai Nomenclaturist dan Onomastika Kreatif, memahami kategori penamaan yang diberikan pengguna dan mengadopsi gaya berpikir yang sesuai untuk memberikan opsi nama yang relevan dan kreatif.",
        components: [
          {
            name: "category",
            label: "Kategori Penamaan",
            type: "select",
            options: [
              "Nama Bayi",
              "Nama Hewan Peliharaan",
              "Nama Bisnis/Produk",
              "Nama Tim/Komunitas",
              "Nama Karakter Fiksi",
              "Judul Acara/Karya",
              "Nama Domain/Hashtag",
            ],
            info: "Pilih untuk apa nama ini akan digunakan.",
          },
        ],
        dynamicSubcomponents: {
          trigger: "category",
          options: {
            "Nama Bayi": [
              {
                name: "gender",
                label: "Jenis Kelamin",
                type: "select",
                options: ["Laki-laki", "Perempuan", "Unisex"],
                info: "Pilih jenis kelamin.",
              },
              {
                name: "origin",
                label: "Asal Bahasa/Budaya (Opsional)",
                type: "text",
                placeholder: "e.g., 'Sansekerta, Latin, Jepang'",
                info: "Sebutkan asal nama yang Anda inginkan.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "meaning",
                label: "Makna yang Diinginkan",
                type: "text",
                placeholder: "e.g., 'Cahaya, bijaksana, kuat'",
                info: "Sebutkan makna atau harapan yang terkandung dalam nama.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "nameStyle",
                label: "Gaya Nama",
                type: "select",
                options: [
                  "Klasik & Populer",
                  "Modern & Unik",
                  "Singkat & Manis",
                ],
                info: "Pilih gaya nama yang Anda inginkan.",
              },
            ],
            "Nama Bisnis/Produk": [
              {
                name: "industry",
                label: "Industri/Bidang Usaha",
                type: "text",
                placeholder: "e.g., 'Teknologi, kuliner, fashion'",
                info: "Sebutkan industri tempat bisnis Anda beroperasi.",
                validation: { min_length: 3 },
              },
              {
                name: "coreConcept",
                label: "Konsep Inti",
                type: "text",
                placeholder: "e.g., 'Aplikasi untuk belajar investasi saham'",
                info: "Jelaskan secara singkat apa yang dilakukan bisnis/produk Anda.",
                validation: { min_length: 10 },
              },
              {
                name: "brandPersonality",
                label: "Kepribadian Brand",
                type: "text",
                placeholder: "e.g., 'Modern, tepercaya, mudah diakses'",
                info: "Sebutkan 3-5 kata yang mendeskripsikan brand Anda.",
                validation: { min_length: 5 },
              },
              {
                name: "keywords",
                label: "Kata Kunci untuk Disertakan",
                type: "text",
                placeholder: "e.g., 'Invest, dana, cerdas'",
                info: "Kata atau ide yang ingin Anda sertakan dalam nama.",
                optional: true,
                validation: { min_length: 3 },
              },
            ],
            "Nama Karakter Fiksi": [
              {
                name: "genre",
                label: "Genre Cerita",
                type: "text",
                placeholder: "e.g., 'Fantasi, fiksi ilmiah, misteri'",
                info: "Sebutkan genre cerita karakter Anda.",
                validation: { min_length: 3 },
              },
              {
                name: "role",
                label: "Peran Karakter",
                type: "select",
                options: ["Protagonis", "Antagonis", "Pendukung"],
                info: "Pilih peran karakter dalam cerita.",
              },
              {
                name: "traits",
                label: "Sifat & Ciri Khas",
                type: "text",
                placeholder:
                  "e.g., 'Pemberani, misterius, memiliki kekuatan sihir'",
                info: "Sebutkan sifat-sifat utama karakter.",
                validation: { min_length: 5 },
              },
              {
                name: "origin",
                label: "Asal-usul/Ras Karakter",
                type: "text",
                placeholder:
                  "e.g., 'Elf dari hutan kuno, manusia dari kota metropolitan'",
                info: "Sebutkan latar belakang karakter.",
                validation: { min_length: 5 },
              },
            ],
            "Nama Hewan Peliharaan": [
              {
                name: "animalType",
                label: "Jenis Hewan",
                type: "text",
                placeholder: "e.g., 'Kucing, Anjing, Burung'",
                info: "Jenis hewan peliharaan Anda.",
                validation: { min_length: 3 },
              },
              {
                name: "gender",
                label: "Jenis Kelamin (Opsional)",
                type: "select",
                options: ["Jantan", "Betina", "Tidak Tahu"],
                info: "Jenis kelamin hewan peliharaan.",
              },
              {
                name: "personalityTraits",
                label: "Sifat/Ciri Khas",
                type: "textarea",
                placeholder: "e.g., 'Lucu, Pemberani, Tenang, Aktif'",
                info: "Sifat atau ciri khas yang menonjol dari hewan peliharaan Anda.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "nameStyle",
                label: "Gaya Nama",
                type: "select",
                options: [
                  "Klasik",
                  "Modern",
                  "Unik",
                  "Lucu",
                  "Berdasarkan Makanan",
                ],
                info: "Pilih gaya nama yang Anda inginkan.",
              },
            ],
            "Nama Tim/Komunitas": [
              {
                name: "teamPurpose",
                label: "Tujuan Tim/Komunitas",
                type: "text",
                placeholder: "e.g., 'Tim Olahraga, Proyek IT, Komunitas Hobi'",
                info: "Tujuan utama dari tim atau komunitas ini.",
                validation: { min_length: 5 },
              },
              {
                name: "teamVibe",
                label: "Suasana/Vibe Tim",
                type: "select",
                options: [
                  "Profesional",
                  "Santai & Kreatif",
                  "Kompetitif",
                  "Inklusif",
                ],
                info: "Nuansa atau atmosfer yang ingin dibangun dalam tim/komunitas.",
              },
              {
                name: "keywords",
                label: "Kata Kunci untuk Disertakan (Opsional)",
                type: "text",
                placeholder: "e.g., 'Inovasi, Juara, Bersama, Solidaritas'",
                info: "Kata atau ide yang ingin Anda sertakan dalam nama tim/komunitas.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "memberCount",
                label: "Jumlah Anggota (Opsional)",
                type: "number",
                placeholder: "e.g., 5, 20, 100+",
                info: "Perkiraan jumlah anggota tim atau komunitas.",
                optional: true,
                validation: { min_value: 1 },
              },
            ],
            "Judul Acara/Karya": [
              {
                name: "eventType",
                label: "Jenis Acara/Karya",
                type: "select",
                options: [
                  "Seminar",
                  "Workshop",
                  "Konser Musik",
                  "Pameran Seni",
                  "Buku",
                  "Film",
                  "Podcast",
                ],
                info: "Pilih jenis acara atau karya yang akan diberi judul.",
              },
              {
                name: "mainTopic",
                label: "Topik Utama",
                type: "text",
                placeholder:
                  "e.g., 'Masa Depan AI', 'Seni Melukis Abstrak', 'Perjalanan Kuliner Indonesia'",
                info: "Inti dari acara atau karya tersebut.",
                validation: { min_length: 5 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder: "e.g., 'Developer, Seniman, Pecinta Kuliner'",
                info: "Siapa target audiens utama untuk judul ini?",
                validation: { min_length: 5 },
              },
              {
                name: "mood",
                label: "Suasana/Mood",
                type: "select",
                options: [
                  "Inspiratif",
                  "Edukatif",
                  "Menghibur",
                  "Misterius",
                  "Serius",
                ],
                info: "Suasana atau emosi yang ingin disampaikan oleh judul.",
              },
            ],
            "Nama Domain/Hashtag": [
              {
                name: "purpose",
                label: "Tujuan",
                type: "text",
                placeholder:
                  "e.g., 'Website Pribadi, Kampanye Pemasaran, Toko Online'",
                info: "Untuk apa nama domain atau hashtag ini akan digunakan?",
                validation: { min_length: 5 },
              },
              {
                name: "keywords",
                label: "Kata Kunci Utama",
                type: "text",
                placeholder: "e.g., 'fotografi, jakarta, kuliner'",
                info: "Kata kunci yang relevan dengan tujuan Anda.",
                validation: { min_length: 3 },
              },
              {
                name: "lengthPreference",
                label: "Preferensi Panjang",
                type: "select",
                options: ["Singkat", "Sedang", "Panjang"],
                info: "Apakah Anda menginginkan nama yang singkat, sedang, atau panjang?",
              },
              {
                name: "callToAction",
                label: "Saran untuk Cek Ketersediaan",
                type: "text",
                placeholder:
                  "e.g., 'Pastikan untuk memeriksa ketersediaan domain (.com, .id) dan handle media sosial (Instagram, Twitter) sebelum memutuskan.'",
                info: "Penting untuk selalu memeriksa ketersediaan nama yang dihasilkan.",
                validation: { min_length: 10 },
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu memberikan variasi nama yang luas, dari yang aman hingga yang lebih berani. Untuk nama bisnis/produk, sertakan saran untuk memeriksa ketersediaan domain dan media sosial. Untuk nama personal, pertimbangkan kemudahan pengucapan. Disclaimer wajib: 'Nama yang dihasilkan adalah saran kreatif. Pastikan untuk memeriksa ketersediaan merek dagang, domain, dan handle media sosial secara mandiri sebelum mengadopsi sebuah nama.'",
      },
    },
    "Perencanaan Acara & Manajemen": {
      "Manajer Perencanaan Acara Lengkap": {
        description:
          "Dapatkan bantuan terstruktur untuk merencanakan semua detail acara Anda.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Event Organizer Pro. AI akan bertindak sebagai Event Organizer Pro yang terorganisir dan kreatif, memahami jenis dokumen acara yang dibutuhkan pengguna dan menyusunnya secara efisien untuk perencanaan acara yang komprehensif.",
        components: [
          {
            name: "documentType",
            label: "Jenis Dokumen Acara",
            type: "select",
            options: [
              "Agenda/Itinerary",
              "Ide Tema Pesta",
              "Rencana Anggaran",
              "Daftar Tamu & RSVP",
              "Teks Pidato/Sambutan",
              "Checklist Vendor",
              "Ide Souvenir/Lomba",
            ],
            info: "Pilih dokumen perencanaan yang Anda butuhkan.",
            validation: { regex: "^(?!Pilih Jenis Dokumen Acara...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "documentType",
          options: {
            "Agenda/Itinerary": [
              {
                name: "eventType",
                label: "Jenis Acara",
                type: "text",
                placeholder: "e.g., 'Konferensi Bisnis'",
                info: "Sebutkan jenis acara untuk konteks.",
                validation: { min_length: 5 },
              },
              {
                name: "startTime",
                label: "Waktu Mulai Acara",
                type: "text",
                placeholder: "e.g., '09:00'",
                info: "Jam dimulainya acara.",
                validation: { min_length: 4 },
              },
              {
                name: "endTime",
                label: "Waktu Selesai Acara",
                type: "text",
                placeholder: "e.g., '17:00'",
                info: "Jam berakhirnya acara.",
                validation: { min_length: 4 },
              },
              {
                name: "keyActivities",
                label: "Aktivitas Utama & Durasi (menit)",
                type: "textarea",
                placeholder:
                  "e.g., 'Registrasi:30, Pembukaan:15, Sesi 1:60, Makan Siang:60'",
                info: "Sebutkan aktivitas utama dan perkiraan durasinya.",
                validation: { min_length: 20 },
              },
            ],
            "Rencana Anggaran": [
              {
                name: "totalBudget",
                label: "Total Anggaran",
                type: "number",
                placeholder: "e.g., 50000000",
                info: "Jumlah total dana yang tersedia.",
                validation: { min_value: 100000 },
              },
              {
                name: "expenseCategories",
                label: "Kategori Pengeluaran Utama",
                type: "text",
                placeholder: "e.g., 'Venue, Katering, Pemasaran, Hiburan'",
                info: "Sebutkan pos-pos pengeluaran utama.",
                validation: { min_length: 5 },
              },
              {
                name: "priority",
                label: "Prioritas Anggaran",
                type: "select",
                options: [
                  "Pengalaman Tamu",
                  "Pemasaran & Jangkauan",
                  "Hemat Biaya",
                ],
                info: "Pilih area yang menjadi prioritas utama dalam pengalokasian dana.",
              },
            ],
            "Teks Pidato/Sambutan": [
              {
                name: "speakerRole",
                label: "Peran Pembicara",
                type: "text",
                placeholder: "e.g., 'Ayah mempelai wanita, CEO, Ketua Panitia'",
                info: "Siapa yang akan memberikan pidato?",
                validation: { min_length: 5 },
              },
              {
                name: "speechGoal",
                label: "Tujuan Pidato",
                type: "text",
                placeholder: "e.g., 'Mengharukan, memotivasi, menyambut tamu'",
                info: "Apa pesan utama yang ingin disampaikan?",
                validation: { min_length: 10 },
              },
              {
                name: "speechTone",
                label: "Gaya & Nada Pidato",
                type: "select",
                options: ["Formal", "Santai & Humoris", "Inspiratif"],
                info: "Pilih nuansa yang diinginkan untuk pidato.",
              },
              {
                name: "duration",
                label: "Target Durasi (menit)",
                type: "number",
                placeholder: "e.g., 5",
                info: "Perkiraan panjang pidato.",
                validation: { min_value: 1, max_value: 60 },
              },
            ],
            "Ide Tema Pesta": [
              {
                name: "partyType",
                label: "Jenis Pesta",
                type: "text",
                placeholder:
                  "e.g., 'Ulang Tahun Anak, Pesta Kantor, Baby Shower'",
                info: "Jenis acara yang akan dirayakan.",
                validation: { min_length: 5 },
              },
              {
                name: "ageGroup",
                label: "Kelompok Usia Tamu",
                type: "text",
                placeholder: "e.g., 'Anak-anak (5-10 tahun), Remaja, Dewasa'",
                info: "Membantu menyesuaikan tema dan aktivitas.",
                validation: { min_length: 5 },
              },
              {
                name: "budgetLevel",
                label: "Tingkat Anggaran",
                type: "select",
                options: ["Hemat", "Menengah", "Mewah"],
                info: "Estimasi anggaran untuk pesta.",
              },
              {
                name: "interests",
                label: "Minat/Hobi (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Superheroes, Luar Angkasa, Vintage, Musik 80-an'",
                info: "Minat khusus yang bisa menjadi inspirasi tema.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "locationType",
                label: "Jenis Lokasi (Opsional)",
                type: "select",
                options: ["Indoor", "Outdoor", "Keduanya"],
                info: "Apakah pesta akan diadakan di dalam atau luar ruangan?",
              },
            ],
            "Daftar Tamu & RSVP": [
              {
                name: "eventType",
                label: "Jenis Acara",
                type: "text",
                placeholder: "e.g., 'Pernikahan, Pesta Ulang Tahun'",
                info: "Acara yang daftar tamunya akan dibuat.",
                validation: { min_length: 5 },
              },
              {
                name: "totalGuests",
                label: "Perkiraan Jumlah Tamu",
                type: "number",
                placeholder: "e.g., 100",
                info: "Estimasi jumlah tamu yang diundang.",
                validation: { min_value: 1 },
              },
              {
                name: "rsvpDeadline",
                label: "Batas Waktu RSVP",
                type: "text",
                placeholder: "e.g., '1 November 2025'",
                info: "Tanggal terakhir untuk konfirmasi kehadiran.",
                validation: { min_length: 5 },
              },
              {
                name: "contactMethod",
                label: "Metode Kontak RSVP",
                type: "select",
                options: ["Email", "Telepon/WhatsApp", "Formulir Online"],
                info: "Bagaimana tamu harus mengkonfirmasi kehadiran?",
              },
              {
                name: "additionalInfo",
                label: "Informasi Tambahan (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Sertakan kolom untuk alergi makanan. Minta konfirmasi jumlah anak-anak.'",
                info: "Detail lain yang perlu dikumpulkan dari tamu.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
            "Checklist Vendor": [
              {
                name: "eventType",
                label: "Jenis Acara",
                type: "text",
                placeholder: "e.g., 'Pernikahan, Konferensi'",
                info: "Acara yang vendornya akan dikelola.",
              },
              {
                name: "vendorCategory",
                label: "Kategori Vendor",
                type: "select",
                options: [
                  "Katering",
                  "Venue",
                  "Fotografi/Videografi",
                  "Hiburan",
                  "Dekorasi",
                  "Logistik",
                  "Lainnya...",
                ],
                info: "Pilih kategori vendor yang ingin Anda buat checklist-nya.",
              },
              {
                name: "keyTasks",
                label: "Tugas Kunci per Vendor",
                type: "textarea",
                placeholder:
                  "e.g., 'Katering: Penawaran menu, food tasting, jadwal pengiriman. Venue: Ketersediaan, kapasitas, fasilitas.'",
                info: "Daftar tugas atau poin penting yang harus dibahas dengan vendor.",
              },
              {
                name: "contactPerson",
                label: "Kontak Person Vendor (Opsional)",
                type: "text",
                placeholder: "e.g., 'Nama, Telepon, Email'",
                info: "Informasi kontak utama vendor.",
              },
              {
                name: "notes",
                label: "Catatan Tambahan (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Perlu diskon khusus. Pastikan ada opsi vegetarian.'",
                info: "Catatan atau persyaratan khusus untuk vendor.",
              },
            ],
            "Ide Souvenir/Lomba": [
              {
                name: "eventType",
                label: "Jenis Acara",
                type: "text",
                placeholder:
                  "e.g., 'Ulang Tahun Anak, Pernikahan, Gathering Kantor'",
                info: "Acara yang membutuhkan ide souvenir atau lomba.",
                validation: { min_length: 5 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder: "e.g., 'Anak-anak, Dewasa, Campuran'",
                info: "Siapa yang akan menerima souvenir atau mengikuti lomba?",
                validation: { min_length: 5 },
              },
              {
                name: "budgetPerItem",
                label: "Anggaran per Item (Opsional)",
                type: "text",
                placeholder: "e.g., 'Rp 10.000 - Rp 25.000'",
                info: "Estimasi biaya per souvenir atau hadiah lomba.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "theme",
                label: "Tema Acara (Opsional)",
                type: "text",
                placeholder: "e.g., 'Tropical, Vintage, Futuristik'",
                info: "Tema acara jika ada, untuk menyesuaikan ide.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "ideaType",
                label: "Jenis Ide",
                type: "select",
                options: ["Souvenir", "Lomba", "Keduanya"],
                info: "Apakah Anda mencari ide souvenir, lomba, atau keduanya?",
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu memberikan saran yang praktis dan realistis. Untuk anggaran, jika tidak ada input, berikan persentase alokasi yang umum sebagai contoh. Untuk checklist, berikan pertanyaan-pertanyaan kunci yang sering terlupakan. Untuk ide tema, berikan 3-5 opsi yang bervariasi dari segi biaya dan kompleksitas. Selalu akhiri dengan kalimat yang memotivasi dan mengurangi stres pengguna, seperti 'Perencanaan adalah kunci, nikmati setiap langkahnya!'",
      },
    },
    "Pendidikan & Pembelajaran": {
      "Asisten Akademik & Pembelajaran": {
        description:
          "Dapatkan bantuan untuk membuat rencana belajar, kuis, RPP, dan materi edukasi lainnya.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pelatih Akademik & Desainer Instruksional. AI akan bertindak sebagai Pelatih Akademik dan Desainer Instruksional, bertransformasi menjadi Tutor Pribadi atau Asisten Kurikulum tergantung pada jenis bantuan akademik yang diminta untuk membuat materi edukasi yang efektif.",
        components: [
          {
            name: "assistanceType",
            label: "Jenis Bantuan Akademik",
            type: "select",
            options: [
              "Rencana Belajar",
              "Materi Belajar (Kuis/Flashcard)",
              "Rencana Mengajar (RPP)",
              "Ide Topik Diskusi",
            ],
            info: "Pilih jenis bantuan yang Anda butuhkan.",
            validation: { regex: "^(?!Pilih Jenis Bantuan Akademik...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "assistanceType",
          options: {
            "Rencana Belajar": [
              {
                name: "subject",
                label: "Mata Pelajaran/Ujian",
                type: "text",
                placeholder: "e.g., 'Ujian Akhir Semester Matematika'",
                info: "Sebutkan subjek atau ujian yang akan dihadapi.",
                validation: { min_length: 5 },
              },
              {
                name: "timeframe",
                label: "Jangka Waktu Belajar",
                type: "text",
                placeholder: "e.g., '2 minggu'",
                info: "Berapa lama waktu yang Anda miliki untuk belajar?",
                validation: { min_length: 3 },
              },
              {
                name: "studyHoursPerDay",
                label: "Jam Belajar per Hari",
                type: "number",
                placeholder: "e.g., 2",
                info: "Berapa jam sehari Anda bisa fokus belajar?",
                validation: { min_value: 1, max_value: 24 },
              },
              {
                name: "topicsToCover",
                label: "Topik-topik yang Harus Dipelajari",
                type: "textarea",
                placeholder: "e.g., 'Aljabar, Geometri, Kalkulus Dasar'",
                info: "Sebutkan semua materi yang perlu dipelajari.",
                validation: { min_length: 10 },
              },
            ],
            "Materi Belajar (Kuis/Flashcard)": [
              {
                name: "sourceMaterial",
                label: "Materi Sumber",
                type: "textarea",
                placeholder: "Tempelkan teks atau poin-poin materi di sini",
                info: "AI akan menggunakan ini untuk membuat materi belajar.",
                validation: { min_length: 20 },
              },
              {
                name: "materialType",
                label: "Jenis Materi",
                type: "select",
                options: [
                  "Soal Pilihan Ganda",
                  "Flashcard (Tanya-Jawab)",
                  "Soal Esai Singkat",
                ],
                info: "Pilih jenis materi belajar yang ingin dibuat.",
              },
              {
                name: "numberOfItems",
                label: "Jumlah Soal/Kartu",
                type: "number",
                placeholder: "e.g., 10",
                info: "Berapa banyak soal atau kartu yang ingin dibuat?",
                validation: { min_value: 1, max_value: 50 },
              },
            ],
            "Rencana Mengajar (RPP)": [
              {
                name: "subject",
                label: "Mata Pelajaran",
                type: "text",
                placeholder: "e.g., 'Biologi'",
                info: "Sebutkan mata pelajaran yang akan diajarkan.",
                validation: { min_length: 2 },
              },
              {
                name: "gradeLevel",
                label: "Tingkat Kelas",
                type: "text",
                placeholder: "e.g., 'Kelas 10 SMA'",
                info: "Untuk kelas berapa RPP ini dibuat?",
                validation: { min_length: 3 },
              },
              {
                name: "topic",
                label: "Topik Spesifik",
                type: "text",
                placeholder: "e.g., 'Fotosintesis'",
                info: "Sebutkan topik spesifik yang akan dibahas.",
                validation: { min_length: 5 },
              },
              {
                name: "duration",
                label: "Alokasi Waktu (menit)",
                type: "number",
                placeholder: "e.g., 90",
                info: "Berapa lama sesi pengajaran akan berlangsung?",
                validation: { min_value: 15, max_value: 240 },
              },
            ],
            "Ide Topik Diskusi": [
              {
                name: "discussionSubject",
                label: "Subjek Diskusi",
                type: "text",
                placeholder:
                  "e.g., 'Etika AI, Perubahan Iklim, Dampak Media Sosial'",
                info: "Topik utama yang ingin didiskusikan.",
                validation: { min_length: 5 },
              },
              {
                name: "discussionGoal",
                label: "Tujuan Diskusi",
                type: "select",
                options: [
                  "Membangun Pemahaman",
                  "Mencari Solusi",
                  "Debat/Perdebatan",
                  "Brainstorming Ide",
                ],
                info: "Apa yang ingin dicapai dari diskusi ini?",
              },
              {
                name: "targetAudience",
                label: "Target Audiens Diskusi",
                type: "text",
                placeholder: "e.g., 'Mahasiswa, Profesional, Komunitas Umum'",
                info: "Siapa peserta diskusi ini?",
                validation: { min_length: 5 },
              },
              {
                name: "discussionFormat",
                label: "Format Diskusi",
                type: "select",
                options: ["Terbuka", "Terstruktur", "Panel", "Debat"],
                info: "Bagaimana diskusi akan dijalankan?",
              },
              {
                name: "keyQuestions",
                label: "Pertanyaan Kunci (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Bagaimana AI mempengaruhi pekerjaan di masa depan? Apa peran individu dalam mengatasi perubahan iklim?'",
                info: "Pertanyaan-pertanyaan pemicu untuk memulai atau memandu diskusi.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu menekankan pentingnya pemahaman konsep di atas hafalan. Untuk pembuatan soal, pastikan tingkat kesulitan sesuai dengan tingkat audiens yang diberikan. Untuk RPP, sarankan variasi aktivitas untuk menjaga keterlibatan siswa. Wajib sertakan disclaimer: 'Materi yang dihasilkan adalah alat bantu. Guru/pelajar disarankan untuk memverifikasi informasi dan menyesuaikannya dengan kurikulum atau kebutuhan belajar yang spesifik.'",
      },
    },
    "Bisnis & Profesional": {
      "Asisten Dokumen Profesional": {
        description:
          "Buat draf cepat untuk surat lamaran, laporan, notulen rapat, dan email profesional.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Asisten Eksekutif Virtual. AI akan bertindak sebagai Asisten Eksekutif Virtual yang kompeten, beradaptasi menjadi Career Coach, Analis Bisnis, atau Pakar Komunikasi tergantung pada jenis dokumen yang diminta untuk menghasilkan draf yang paling sesuai.",
        components: [
          {
            name: "documentType",
            label: "Jenis Dokumen",
            type: "select",
            options: [
              "Surat Lamaran Kerja",
              "Laporan Progres Proyek",
              "Kontrak Sederhana",
              "Notulen Rapat",
              "Faktur/Invoice",
              "Email Profesional",
            ],
            info: "Pilih jenis dokumen bisnis yang Anda butuhkan.",
            validation: { regex: "^(?!Pilih Jenis Dokumen...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "documentType",
          options: {
            "Surat Lamaran Kerja": [
              {
                name: "jobTitle",
                label: "Posisi yang Dilamar",
                type: "text",
                placeholder: "e.g., 'Digital Marketing Specialist'",
                info: "Nama jabatan persis seperti yang tertulis di lowongan.",
                validation: { min_length: 5 },
              },
              {
                name: "companyName",
                label: "Nama Perusahaan",
                type: "text",
                placeholder: "e.g., 'PT Inovasi Digital'",
                info: "Perusahaan yang Anda tuju.",
                validation: { min_length: 5 },
              },
              {
                name: "keyRequirements",
                label: "Kualifikasi Utama dari Lowongan",
                type: "textarea",
                placeholder:
                  "Salin-tempel poin-poin kualifikasi utama dari iklan lowongan kerja di sini.",
                info: "AI akan menggunakan ini untuk menyesuaikan surat Anda.",
                validation: { min_length: 20 },
              },
              {
                name: "mySkills",
                label: "Pengalaman & Keterampilan Relevan Saya",
                type: "textarea",
                placeholder:
                  "e.g., 'Saya telah mengelola kampanye SEO untuk klien e-commerce selama 4 tahun.'",
                info: "Hubungkan pengalaman Anda secara langsung dengan apa yang dicari perusahaan.",
                validation: { min_length: 20 },
              },
            ],
            "Laporan Progres Proyek": [
              {
                name: "projectName",
                label: "Nama Proyek",
                type: "text",
                placeholder: "e.g., 'Pengembangan Aplikasi Mobile'",
                info: "Proyek yang akan dilaporkan.",
                validation: { min_length: 5 },
              },
              {
                name: "timePeriod",
                label: "Periode Laporan",
                type: "text",
                placeholder: "e.g., '1 - 7 Juli 2025'",
                info: "Cakupan waktu laporan.",
                validation: { min_length: 5 },
              },
              {
                name: "completedTasks",
                label: "Tugas yang Selesai",
                type: "textarea",
                placeholder: "e.g., 'Desain UI, Pengembangan API Login'",
                info: "Sebutkan tugas-tugas yang telah selesai pada periode ini.",
                validation: { min_length: 10 },
              },
              {
                name: "ongoingTasks",
                label: "Tugas yang Sedang Berjalan",
                type: "textarea",
                placeholder: "e.g., 'Pengujian fitur X, Integrasi pembayaran'",
                info: "Sebutkan tugas-tugas yang masih dalam proses.",
                validation: { min_length: 10 },
              },
              {
                name: "blockers",
                label: "Hambatan (Blockers)",
                type: "textarea",
                placeholder: "e.g., 'Menunggu akses ke server database'",
                info: "Sebutkan kendala yang menghambat kemajuan.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
            "Email Profesional": [
              {
                name: "recipient",
                label: "Penerima Email",
                type: "text",
                placeholder: "e.g., 'Manajer Pemasaran, Calon Klien'",
                info: "Jelaskan siapa penerima dan hubungan Anda.",
                validation: { min_length: 5 },
              },
              {
                name: "subject",
                label: "Subjek Email",
                type: "text",
                placeholder: "e.g., 'Follow-up Rapat Mengenai Proyek X'",
                info: "Judul email yang jelas dan ringkas.",
                validation: { min_length: 5 },
              },
              {
                name: "keyMessage",
                label: "Pesan Kunci",
                type: "textarea",
                placeholder:
                  "e.g., 'Meminta data penjualan Q3. Mengusulkan jadwal rapat.'",
                info: "Sebutkan semua poin penting yang harus ada dalam isi email.",
                validation: { min_length: 10 },
              },
              {
                name: "tone",
                label: "Gaya & Nada",
                type: "select",
                options: [
                  "Sangat Formal",
                  "Profesional Standar",
                  "Ramah tapi Jelas",
                ],
                info: "Pilih nada yang sesuai untuk email Anda.",
              },
            ],
            "Kontrak Sederhana": [
              {
                name: "contractType",
                label: "Jenis Kontrak",
                type: "text",
                placeholder:
                  "e.g., 'Perjanjian Kerahasiaan (NDA), Kontrak Freelance, Perjanjian Sewa'",
                info: "Sebutkan jenis kontrak yang ingin Anda buat.",
                validation: { min_length: 5 },
              },
              {
                name: "parties",
                label: "Pihak-pihak yang Terlibat",
                type: "textarea",
                placeholder:
                  "e.g., 'Pihak 1: [Nama Perusahaan/Individu], Pihak 2: [Nama Perusahaan/Individu]'",
                info: "Sebutkan nama lengkap pihak-pihak yang akan menandatangani kontrak.",
                validation: { min_length: 10 },
              },
              {
                name: "keyTerms",
                label: "Syarat & Ketentuan Kunci",
                type: "textarea",
                placeholder:
                  "e.g., 'Durasi: 1 tahun. Pembayaran: Rp 5.000.000 per bulan. Lingkup Pekerjaan: Pengembangan aplikasi mobile.'",
                info: "Poin-poin utama yang harus diatur dalam kontrak.",
                validation: { min_length: 20 },
              },
              {
                name: "governingLaw",
                label: "Hukum yang Mengatur (Opsional)",
                type: "text",
                placeholder: "e.g., 'Hukum Republik Indonesia'",
                info: "Yurisdiksi hukum yang berlaku untuk kontrak.",
                optional: true,
                validation: { min_length: 5 },
              },
            ],
            "Notulen Rapat": [
              {
                name: "meetingTitle",
                label: "Judul Rapat",
                type: "text",
                placeholder: "e.g., 'Rapat Koordinasi Proyek Q3'",
                info: "Judul resmi rapat.",
                validation: { min_length: 5 },
              },
              {
                name: "dateTime",
                label: "Tanggal & Waktu Rapat",
                type: "text",
                placeholder: "e.g., '10 Juli 2025, 10:00 - 11:00 WIB'",
                info: "Kapan rapat dilaksanakan.",
                validation: { min_length: 5 },
              },
              {
                name: "attendees",
                label: "Daftar Peserta",
                type: "textarea",
                placeholder:
                  "e.g., 'Andi (Ketua), Budi (Sekretaris), Citra, Doni'",
                info: "Sebutkan semua yang hadir dalam rapat.",
                validation: { min_length: 10 },
              },
              {
                name: "discussionPoints",
                label: "Poin Diskusi Utama",
                type: "textarea",
                placeholder:
                  "e.g., 'Pembahasan anggaran, Progres pengembangan fitur X, Tantangan tim.'",
                info: "Topik-topik utama yang dibahas.",
                validation: { min_length: 10 },
              },
              {
                name: "decisionsMade",
                label: "Keputusan yang Diambil",
                type: "textarea",
                placeholder:
                  "e.g., 'Anggaran disetujui. Fitur X ditunda 1 minggu.'",
                info: "Keputusan penting yang dihasilkan dari rapat.",
                validation: { min_length: 10 },
              },
              {
                name: "actionItems",
                label: "Daftar Tindakan (Action Items)",
                type: "textarea",
                placeholder:
                  "e.g., 'Andi: Siapkan laporan keuangan (Deadline: 15 Juli). Citra: Koordinasi dengan tim desain (Deadline: 12 Juli).'",
                info: "Tugas yang harus dilakukan, penanggung jawab, dan tenggat waktu.",
                validation: { min_length: 10 },
              },
            ],
            "Faktur/Invoice": [
              {
                name: "invoiceNumber",
                label: "Nomor Faktur",
                type: "text",
                placeholder: "e.g., 'INV-2025-001'",
                info: "Nomor unik untuk faktur ini.",
                validation: { min_length: 5 },
              },
              {
                name: "issueDate",
                label: "Tanggal Terbit",
                type: "text",
                placeholder: "e.g., '11 Juli 2025'",
                info: "Tanggal faktur dibuat.",
                validation: { min_length: 5 },
              },
              {
                name: "dueDate",
                label: "Tanggal Jatuh Tempo",
                type: "text",
                placeholder: "e.g., '25 Juli 2025'",
                info: "Batas waktu pembayaran.",
                validation: { min_length: 5 },
              },
              {
                name: "billTo",
                label: "Ditagihkan Kepada (Nama & Alamat)",
                type: "textarea",
                placeholder: "e.g., 'PT Maju Jaya\nJl. Contoh No. 10, Jakarta'",
                info: "Informasi pelanggan yang akan ditagih.",
                validation: { min_length: 10 },
              },
              {
                name: "items",
                label: "Daftar Item/Layanan (Nama, Jumlah, Harga Satuan)",
                type: "textarea",
                placeholder:
                  "e.g., 'Jasa Desain Logo, 1, Rp 5.000.000\nRevisi Desain, 2, Rp 500.000'",
                info: "Detail barang atau jasa yang ditagihkan.",
                validation: { min_length: 10 },
              },
              {
                name: "totalAmount",
                label: "Jumlah Total",
                type: "number",
                placeholder: "e.g., 6000000",
                info: "Total biaya keseluruhan.",
                validation: { min_value: 0 },
              },
              {
                name: "paymentInstructions",
                label: "Instruksi Pembayaran (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Transfer ke Rekening BCA 1234567890 a.n. PT XYZ. Mohon konfirmasi setelah pembayaran.'",
                info: "Cara pembayaran yang diinginkan.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus sangat peka terhadap `Gaya & Nada` yang diminta. Untuk dokumen legal seperti kontrak, AI wajib menyertakan disclaimer tebal: '**PENTING: Ini adalah template sederhana dan bukan merupakan nasihat hukum. Selalu konsultasikan dengan profesional hukum untuk kebutuhan spesifik Anda.**' Untuk laporan, prioritaskan kejelasan data. Untuk email, prioritaskan keringkasan dan kejelasan tujuan.",
      },
    },
    "Desain & Pengembangan Proyek": {
      "Perancang Proyek Digital & UX": {
        description:
          "Dapatkan cetak biru (blueprint) terstruktur untuk website, aplikasi, atau proyek digital lainnya.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Arsitek Produk Digital. AI akan bertindak sebagai Arsitek Produk Digital senior, bertransformasi menjadi Arsitek Informasi, Desainer UX/UI, atau Manajer Produk Teknis tergantung pada jenis dokumen proyek yang diminta untuk mengubah ide menjadi rencana yang dapat ditindaklanjuti.",
        components: [
          {
            name: "documentType",
            label: "Jenis Dokumen Proyek",
            type: "select",
            options: [
              "Struktur Website/Aplikasi",
              "Desain Halaman/Slide",
              "Konsep MVP/Database",
              "Strategi Peluncuran",
            ],
            info: "Pilih jenis dokumen perencanaan yang Anda butuhkan.",
          },
        ],
        dynamicSubcomponents: {
          trigger: "documentType",
          options: {
            "Struktur Website/Aplikasi": [
              {
                name: "projectType",
                label: "Jenis Proyek",
                type: "select",
                options: ["Website", "Aplikasi Mobile", "Aplikasi Web"],
                info: "Pilih jenis proyek yang akan dirancang.",
              },
              {
                name: "mainGoal",
                label: "Tujuan Utama Proyek",
                type: "text",
                placeholder: "e.g., 'Meningkatkan penjualan online'",
                info: "Apa tujuan utama dari proyek ini?",
                validation: { min_length: 10 },
              },
              {
                name: "mainPages",
                label: "Halaman/Fitur Utama",
                type: "textarea",
                placeholder: "e.g., 'Beranda, Produk, Tentang Kami, Kontak'",
                info: "Sebutkan halaman atau fitur utama yang harus ada.",
                validation: { min_length: 10 },
              },
            ],
            "Desain Halaman/Slide": [
              {
                name: "pageName",
                label: "Nama Halaman/Slide",
                type: "text",
                placeholder: "e.g., 'Halaman Beranda'",
                info: "Halaman atau slide spesifik yang akan dirancang.",
                validation: { min_length: 5 },
              },
              {
                name: "sections",
                label: "Bagian-bagian Halaman/Slide",
                type: "textarea",
                placeholder: "e.g., 'Header, Hero, Testimoni, Footer'",
                info: "Sebutkan bagian-bagian utama dari atas ke bawah.",
                validation: { min_length: 10 },
              },
              {
                name: "keyInfo",
                label: "Informasi Kunci per Bagian",
                type: "textarea",
                placeholder:
                  "e.g., 'Hero: Judul yang menarik, gambar produk. Testimoni: 3 kutipan dari klien.'",
                info: "Jelaskan konten utama untuk setiap bagian.",
                validation: { min_length: 10 },
              },
            ],
            "Konsep MVP/Database": [
              {
                name: "appName",
                label: "Nama Aplikasi",
                type: "text",
                placeholder: "e.g., 'Aplikasi Resep MasakYuk'",
                info: "Nama aplikasi yang akan dibuat.",
                validation: { min_length: 5 },
              },
              {
                name: "coreFeatures",
                label: "Fitur Inti MVP",
                type: "textarea",
                placeholder:
                  "e.g., 'Pencarian resep, simpan resep, daftar belanja'",
                info: "Sebutkan 3-5 fitur paling penting untuk versi pertama.",
                validation: { min_length: 10 },
              },
              {
                name: "dataModels",
                label: "Model Data Utama",
                type: "text",
                placeholder: "e.g., 'User, Recipe, Ingredient'",
                info: "Sebutkan entitas data utama dalam sistem.",
                validation: { min_length: 5 },
              },
            ],
            "Strategi Peluncuran": [
              {
                name: "productName",
                label: "Nama Produk/Aplikasi",
                type: "text",
                placeholder: "e.g., 'Aplikasi Meditasi Tenang'",
                info: "Nama produk atau aplikasi yang akan diluncurkan.",
                validation: { min_length: 5 },
              },
              {
                name: "launchDate",
                label: "Target Tanggal Peluncuran",
                type: "text",
                placeholder: "e.g., '1 September 2025'",
                info: "Tanggal yang direncanakan untuk peluncuran.",
                validation: { min_length: 5 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder: "e.g., 'Profesional muda yang stres, mahasiswa'",
                info: "Siapa target utama peluncuran ini?",
                validation: { min_length: 5 },
              },
              {
                name: "marketingChannels",
                label: "Kanal Pemasaran",
                type: "textarea",
                placeholder:
                  "e.g., 'Media Sosial (Instagram, TikTok), Influencer Marketing, Iklan Google, PR'",
                info: "Saluran yang akan digunakan untuk mempromosikan peluncuran.",
                validation: { min_length: 10 },
              },
              {
                name: "keyMessages",
                label: "Pesan Kunci Peluncuran",
                type: "textarea",
                placeholder:
                  "e.g., 'Temukan ketenangan dalam genggaman Anda. Kurangi stres dengan meditasi 5 menit sehari.'",
                info: "Pesan utama yang ingin disampaikan kepada audiens.",
                validation: { min_length: 10 },
              },
              {
                name: "successMetrics",
                label: "Metrik Keberhasilan (Opsional)",
                type: "text",
                placeholder:
                  "e.g., '10.000 unduhan dalam bulan pertama, 500 ulasan positif'",
                info: "Bagaimana Anda akan mengukur keberhasilan peluncuran?",
                optional: true,
                validation: { min_length: 5 },
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu menekankan bahwa output ini adalah untuk tujuan perencanaan dan konseptual, bukan kode atau desain final. Untuk database, gunakan format yang mudah dibaca. Untuk user flow, gunakan penomoran dan panah (->) untuk menunjukkan alur. Selalu gunakan bahasa yang jelas dan hindari jargon teknis yang berlebihan.",
      },
    },
  },
  "Gambar & Desain": {
    "Seni Tradisional, Poster Retro & Fotografi Eksklusif": {
      "Architectural Brutalism & Concrete Megastructure Visual": {
        description: "Konsep visual arsitektur brutalist dengan beton mentah monolitik, geometri tajam, dan pencahayaan matahari dramatis.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Brutalist Architecture Photographer.",
        components: [
          {
            name: "brutalistBuilding",
            label: "Bentuk Bangunan & Lokasi",
            type: "text",
            placeholder: "contoh: Perpustakaan monolitik raksasa dari beton bertulang mentah di tepi tebing laut dengan tangga spiral megah",
            info: "Deskripsikan bangunan arsitektur brutalist yang dirancang",
          },
        ],
      },
      "Vaporwave & Glitch Art 90s Aesthetic": {
        description: "Desain glitch art retro 90s dengan patung Yunani marmer, grid neon ungu-magenta, disket Windows 95, dan distorsi CRT monitor.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Vaporwave Aesthetic Art Director.",
        components: [
          {
            name: "vaporwaveObjects",
            label: "Kombinasi Objek Surealis 90s",
            type: "text",
            placeholder: "contoh: Kepala patung dewa Yunani marmer mengapung di atas grid neon ungu dengan latar piramida dan logo Windows klasik",
            info: "Elemen retro 90s apa yang dipadukan?",
          },
        ],
      },
      "Minimalist Botanical Line Art & Boho Aesthetic": {
        description: "Seni garis minimalis tumbuhan tropis dengan palet warna terakota hangat dan aksen bumi netral untuk hiasan dinding rumah modern.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Minimalist Boho Art Print Designer.",
        components: [
          {
            name: "botanicalFlora",
            label: "Jenis Tanaman / Daun & Bentuk Geometris",
            type: "text",
            placeholder: "contoh: Daun palem monstera elegan dipadukan dengan bentuk lingkaran bulan sabit berwarna terakota dan krem",
            info: "Tanaman apa yang menjadi fokus garis artistik?",
          },
        ],
      },
      "Ukiyo-e Woodblock Print & Japanese Traditional Art": {
        description: "Ilustrasi cetak blok kayu Ukiyo-e tradisional Jepang (Gaya Hokusai/Hiroshige) dengan ombak laut, gunung Fuji, dan tekstur kertas washi.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Traditional Ukiyo-e Woodblock Print Master.",
        components: [
          {
            name: "ukiyoeLandscape",
            label: "Pemandangan Alam Tradisional Jepang",
            type: "text",
            placeholder: "contoh: Ombak laut biru berbusa putih dengan latar belakang Gunung Fuji bersalju dan perahu nelayan kayu kecil",
            info: "Pemandangan apa yang diabadikan dalam gaya Ukiyo-e?",
          },
        ],
      },
      "Paper Cutout Layered 3D Shadow Box Diorama": {
        description: "Diorama kotak bayangan kertas berlapis 3D dengan kedalaman pencahayaan LED internal yang lembut dan tekstur kertas lipat.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah 3D Papercraft & Shadowbox Artist.",
        components: [
          {
            name: "papercutScene",
            label: "Tema Lapisan Kertas 3D",
            type: "text",
            placeholder: "contoh: Hutan dongeng berlapis 5 tingkat dengan rusa bercahaya di tengah pohon pinus dan bulan purnama di latar belakang",
            info: "Tema cerita apa yang ditampilkan dalam potongan kertas?",
          },
        ],
      },
      "Stained Glass Gothic Cathedral Window Art": {
        description: "Desain kaca patri katedral gothic dengan panel kaca warna-warni bercahaya tembus sinar matahari keemasan dan bingkai timah hitam.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Gothic Cathedral Stained Glass Craftsman.",
        components: [
          {
            name: "stainedGlassFigure",
            label: "Figur / Simbol Kaca Patri",
            type: "text",
            placeholder: "contoh: Malaikat bersayap bulu pelangi memegang pedang keadilan dikelilingi bunga matahari geometris",
            info: "Figur apa yang terpatri pada kaca katedral?",
          },
        ],
      },
      "Pop Art Comic Book & Lichtenstein Halftone Style": {
        description: "Ilustrasi komik pop art klasik dengan bintik halftone Ben-Day, garis tinta tebal, warna primer cerah, dan balon dialog dramatis.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Pop Art Master (Gaya Roy Lichtenstein).",
        components: [
          {
            name: "popArtCharacter",
            label: "Karakter & Teks Balon Dialog",
            type: "text",
            placeholder: "contoh: Wanita menangis dramatis sambil memegang telepon kabel dengan balon teks: 'I CAN'T BELIEVE IT!'",
            info: "Ekspresi dan kata-kata apa yang tertulis dalam komik pop art?",
          },
        ],
      },
      "Cybernetic Steampunk Inventor Workshop": {
        description: "Bengkel penemu era Victoria bergaya steampunk dengan roda gigi kuningan berkilau, pipa uap tembaga, dan lensa kaca arloji.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Steampunk Environment Concept Artist.",
        components: [
          {
            name: "steampunkMachine",
            label: "Mesin & Peralatan yang Dirakit",
            type: "text",
            placeholder: "contoh: Sayap mekanik terbang dari kuningan dan kulit dengan manometer tekanan uap dan lampu tabung vakum menyala",
            info: "Penemuan unik apa yang sedang dirakit di meja kerja?",
          },
        ],
      },
      "Surrealist Dali-Inspired Melting Clock Dreamscape": {
        description: "Lukisan surealisme bernuansa Salvador Dali dengan jam dinding meleleh di gurun pasir tak berujung dan bayangan memanjang.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Surrealist Painter (Gaya Salvador Dali / Rene Magritte).",
        components: [
          {
            name: "surrealObjects",
            label: "Objek-Objek Mimpi Surealis",
            type: "text",
            placeholder: "contoh: Jam saku emas meleleh di atas cabang pohon kering di tengah padang pasir luas dengan langit bermutasi warna",
            info: "Imajinasi surealis apa yang ingin dituangkan?",
          },
        ],
      },
      "Bioluminescent Deep Sea Alien Creature": {
        description: "Makhluk laut dalam futuristik bercahaya neon biru-toska di kedalaman palung samudra gelap gulita dengan tentakel transparan.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Marine Creature Concept Designer (Gaya Avatar Pandora Oceans).",
        components: [
          {
            name: "seaCreatureDetails",
            label: "Bentuk Tubuh & Pola Cahaya Makhluk",
            type: "text",
            placeholder: "contoh: Ubur-ubur raksasa transparan dengan tentakel bercahaya neon ungu-cyan dan pola fraktal di kubahnya",
            info: "Bagaimana wujud makhluk bercahaya tersebut?",
          },
        ],
      },
      "Luxury Perfume Glass Bottle with Liquid Splash": {
        description: "Foto produk parfum kaca kristal dengan percikan cairan beraroma emas, kelopak bunga melayang, dan pencahayaan studio mewah.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Luxury Cosmetics & Perfume Advertising Photographer.",
        components: [
          {
            name: "perfumeBottleDesign",
            label: "Bentuk Botol Parfum & Aroma",
            type: "text",
            placeholder: "contoh: Botol parfum kaca bersegi kristal dengan tutup emas murni dan percikan tetesan cairan aroma mawar vanila",
            info: "Detail desain botol dan elemen percikan di sekitarnya",
          },
        ],
      },
      "Vintage 70s Psychedelic Rock Album Cover Art": {
        description: "Sampul album musik rock psikedelik era 70-an dengan tipografi meliuk-liuk, pola spiral warna-warni, dan elemen kosmik magis.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah 1970s Psychedelic Album Cover Artist (Gaya Pink Floyd / Jimi Hendrix posters).",
        components: [
          {
            name: "albumArtConcept",
            label: "Judul Band & Konsep Visual Psikedelik",
            type: "text",
            placeholder: "contoh: Mata raksasa bercahaya pelangi di tengah pusaran galaksi kosmik dengan bunga matahari melayang",
            info: "Visual psikedelik apa yang menjadi sampul album?",
          },
        ],
      },
      "Modern Architectural Glass Villa in Alpine Forest": {
        description: "Villa kaca modern mewah di tengah hutan cemara pegunungan salju dengan pantulan cahaya perapian hangat dan pemandangan danau.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Luxury Alpine Architectural Photographer.",
        components: [
          {
            name: "villaFeatures",
            label: "Karakter Desain Villa & Lingkungan",
            type: "text",
            placeholder: "contoh: Villa kaca minimalis dengan dek kayu ek dan perapian gantung yang menyala di tengah salju putih tebal",
            info: "Bagaimana arsitektur villa dan pemandangan sekitarnya?",
          },
        ],
      },
      "Cute Kawaii Chibi Food Sticker Sheet Vector": {
        description: "Lembaran stiker makanan Jepang imut bergaya kawaii (Ramen tersenyum, sushi berkedip, onigiri lucu) dengan garis luar putih tebal.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Kawaii Character & Sticker Designer (Gaya Sanrio).",
        components: [
          {
            name: "kawaiiFoodList",
            label: "Daftar Makanan Imut dalam Stiker",
            type: "text",
            placeholder: "contoh: Mangkok ramen tersenyum dengan telur rebus mata bintang, sushi salmon imut, dan minuman boba dengan pipi merona",
            info: "Makanan lucu apa saja yang digambar?",
          },
        ],
      },
    },
    "Gaya Seni Klasik, Poster & Fotografi Makanan": {
      "Retro 80s Anime Aesthetic (Studio Pierrot / City Pop Style)": {
        description: "Ilustrasi anime retro 80-an dengan VHS scanlines, neon pastel, mobil sport pop-up lights, dan atmosfer City Pop Jepang.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah 1980s Retro Anime Art Director (Gaya Macross / City Hunter / Megazone 23).",
        components: [
          {
            name: "retroAnimeScene",
            label: "Adegan & Karakter Anime 80s",
            type: "text",
            placeholder: "contoh: Gadis berambut bob memakai jaket bomber mengendarai motor sport melintasi jalan raya Tokyo dengan latar gedung neon malam hari",
            info: "Deskripsikan visual karakter dan kendaraan retro",
          },
        ],
      },
      "3D Cute Claymation & Chibi Character Toy Design": {
        description: "Desain karakter 3D tanah liat imut bergaya claymation dengan tekstur lembut, ekspresi ceria, dan render studio Octane 8K.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah 3D Toy Designer & Claymation Artist (Gaya Aardman Animation).",
        components: [
          {
            name: "chibiCharacter",
            label: "Karakter / Hewan / Makhluk Lucu",
            type: "text",
            placeholder: "contoh: Anak dinosaurus hijau kecil lucu yang memakai topi koki dan memegang donat raksasa",
            info: "Siapa karakter imut yang ingin dibuat?",
          },
        ],
      },
      "Vintage Travel Poster & Art Deco Cityscape": {
        description: "Desain poster wisata vintage bergaya Art Deco dengan tipografi retro, garis geometris megah, dan warna cetak sablon klasik.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Art Deco Poster Designer (Gaya 1930s European Travel Tourism).",
        components: [
          {
            name: "travelDestination",
            label: "Kota / Destinasi Wisata",
            type: "text",
            placeholder: "contoh: Danau Toba dengan perahu tradisional dan pegunungan megah saat matahari terbit",
            info: "Lokasi wisata apa yang diangkat dalam poster?",
          },
        ],
      },
      "Double Exposure Surrealist Photo Composition": {
        description: "Komposisi fotografi surealis eksposur ganda (Siluet manusia berpadu dengan hutan pinus berkabut, pegunungan es, atau galaksi).",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Fine Art Photographer & Surrealist Master.",
        components: [
          {
            name: "doubleExposureElements",
            label: "Kombinasi 2 Objek Eksposur Ganda",
            type: "text",
            placeholder: "contoh: Profil siluet wanita digabungkan dengan lanskap hutan pinus bersalju dan serigala melolong di bawah sinar bulan",
            info: "Dua elemen visual apa yang dipadukan?",
          },
        ],
      },
      "Futuristic HUD & Holographic Sci-Fi Interface": {
        description: "Desain antarmuka holografis fiksi ilmiah (Sci-Fi FUI/HUD) dengan diagram data kompleks, lingkaran konsentris, dan aksen neon cyan-gold.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Sci-Fi Film UI/HUD Designer (Gaya Iron Man / Minority Report / Westworld).",
        components: [
          {
            name: "hudPurpose",
            label: "Fungsi Sistem HUD Hologram",
            type: "text",
            placeholder: "contoh: Antarmuka navigasi pesawat luar angkasa dengan peta bintang 3D dan status bahan bakar",
            info: "Sistem apa yang ditampilkan pada layar hologram?",
          },
        ],
      },
      "Watercolor Botanical Wedding Invitation Suite": {
        description: "Set undangan pernikahan cat air elegan dengan hiasan dedaunan eucalyptus emas, bunga mawar pastel, dan kaligrafi modern.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Luxury Wedding Stationery & Botanical Watercolor Designer.",
        components: [
          {
            name: "weddingFloralTheme",
            label: "Tema Bunga & Palet Warna",
            type: "text",
            placeholder: "contoh: Dedaunan sage green, mawar blush pink, dan aksen foil emas berkilau pada kertas bertekstur linen",
            info: "Kombinasi bunga dan nuansa warna undangan",
          },
        ],
      },
      "Food & Beverage Gourmet Photography on Rustic Wood Table": {
        description: "Foto makanan gourmet profesional dengan uap panas mengepul, garnish detail, pencahayaan alami, dan komposisi macro fotorealistik.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Michelin-Star Food Photographer & Food Stylist.",
        components: [
          {
            name: "dishName",
            label: "Hidangan Makanan / Minuman",
            type: "text",
            placeholder: "contoh: Steak Wagyu A5 panggang dengan saus truffle, kentang tumbuk creamy, dan asparagus panggang di atas piring keramik hitam",
            info: "Apa makanan yang dipotret dan bagaimana penyajiannya?",
          },
        ],
      },
      "T-Shirt & Apparel Graphic Design Vector Art": {
        description: "Desain sablon kaos distro streetwear modern dengan ilustrasi vektor tajam, tipografi grunge, dan palet warna terpisah.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Senior Streetwear Graphic Designer.",
        components: [
          {
            name: "tshirtArtConcept",
            label: "Konsep Desain Kaos",
            type: "text",
            placeholder: "contoh: Tengkorak bertopeng samurai Cyberpunk dengan pedang katana menyala dan tulisan huruf kanji Jepang",
            info: "Apa gambar dan tema desain kaos yang ingin dicetak?",
          },
        ],
      },
    },
    "Arsitektur & Konsep Fantasi": {
      "Dark Fantasy Gothic & Eldritch Horror Art": {
        description: "Konsep visual gothic dark fantasy bergaya Dark Souls / Bloodborne dengan pencahayaan lilin remang, kastil megah berkabut, dan tekstur kuno fotorealistik.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Dark Fantasy Concept Artist. Formulasikan prompt visual dengan atmosfer mistis, arsitektur gothic megah, dan pencahayaan chiaroscuro dramatis.",
        components: [
          {
            name: "fantasySubject",
            label: "Subjek Utama / Makhluk / Ksatria",
            type: "text",
            placeholder: "contoh: Ksatria berbaju zirah besi berukir kuno memegang pedang bercahaya api redup di depan gerbang katedral raksasa",
            info: "Siapa atau apa yang menjadi fokus dalam gambar?",
          },
          {
            name: "visualAtmosphere",
            label: "Atmosfer & Pencahayaan",
            type: "select",
            options: ["Dim candle-lit gothic cathedral with swirling volumetric fog and crimson moonlight", "Desolate ruined castle on a jagged mountain peak during an eclipse", "Eldritch cosmic mist with glowing ethereal runes in deep darkness", "Lainnya..."],
            info: "Kondisi pencahayaan dan nuansa visual",
          },
        ],
      },
      "Architectural Modern Scandinavian Interior Design": {
        description: "Render arsitektur interior Skandinavia modern dengan material kayu ek hangat, tanaman hijau, jendela lantai-ke-langit-langit, dan pencahayaan matahari alami.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Architectural Digest Interior Designer. Buat deskripsi interior fotorealistik dengan penataan proporsional, palet netral hangat, dan tekstur material premium.",
        components: [
          {
            name: "roomType",
            label: "Jenis Ruangan & Fokus Tata Letak",
            type: "text",
            placeholder: "contoh: Ruang tamu open-plan minimalis dengan sofa kain linen krem, meja kopi kayu ek, dan perpustakaan dinding",
            info: "Ruangan apa yang dirancang?",
          },
        ],
      },
    },
    "Estetika Artistik & Konsep Visual 3D": {
      "Studio Ghibli & Makoto Shinkai Watercolor Anime Landscape": {
        description: "Lanskap alam cat air anime Jepang bernuansa nostalgia dengan awan kumulonimbus megah, kilauan sinar matahari, dan warna emosional.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Studio Ghibli & CoMix Wave Films Art Director. Formulasi prompt visual bernuansa lukisan tangan cat air dengan kedalaman atmosfer yang memesona.",
        components: [
          {
            name: "animeScene",
            label: "Pemandangan & Objek Utama",
            type: "text",
            placeholder: "contoh: Stasiun kereta tua di tepi pedesaan bunga sakura bermekaran dengan rel kereta melintasi danau tenang",
            info: "Deskripsikan lokasi dan objek utama pemandangan",
          },
          {
            name: "weatherTime",
            label: "Waktu & Suasana Langit",
            type: "select",
            options: ["Siang cerah terik dengan awan kumulonimbus tebal megah bergaya Makoto Shinkai", "Sore menjelang senja (Golden Twilight / Magic Hour) dengan langit gradasi oranye-ungu", "Pagi berkabut lembut setelah hujan reda dengan pantulan genangan air kristal", "Malam penuh bintang bima sakti berkilauan dengan lentera kertas tradisional", "Lainnya..."],
            info: "Kondisi cahaya dan cuaca langit anime",
          },
          {
            name: "artisticFinish",
            label: "Gaya Sentuhan Artistik",
            type: "select",
            options: ["Studio Ghibli hand-painted gouache style, Hayao Miyazaki aesthetic, nostalgic vibrant colors", "Makoto Shinkai hyper-detailed anime lighting, dazzling lens flare, breathtaking 8K resolution", "Kyoto Animation soft romantic watercolor, delicate character silhouette, warm breeze feeling", "Lainnya..."],
            info: "Studio anime referensi visual",
          },
        ],
      },
      "Isometric 3D Tiny Room & Gaming Den Diorama": {
        description: "Diorama ruangan isometrik 3D imut (cozy gaming setup, coffee bar, greenhouse) dengan render Blender/Octane 8K dan pencahayaan hangat.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah 3D Isometric Environment Artist. Susun prompt diorama kotak mini dengan detail prop yang padat dan pencahayaan ambient oklusi lembut.",
        components: [
          {
            name: "roomTheme",
            label: "Tema Ruangan Diorama",
            type: "text",
            placeholder: "contoh: Cozy cyberpunk gaming room dengan triple monitor, rak buku manga, tanaman monstera, dan kucing tidur",
            info: "Jenis ruangan dan barang-barang utama di dalamnya",
          },
          {
            name: "lightingAmbience",
            label: "Pencahayaan & Nuansa Warna",
            type: "select",
            options: ["Cozy warm lamp lighting with neon purple & teal LED strip accents", "Bright natural morning sunlight pouring through large glass roof", "Rainy night mood with warm indoor fireplace glow", "Pastel kawaii candy lighting with soft diffused shadows", "Lainnya..."],
            info: "Warna lampu dan suasana ruangan",
          },
        ],
      },
      "Luxury Product Mockup on Marble & Water Reflection": {
        description: "Foto produk komersial mewah di atas podium marmer dengan percikan air kristal, kelopak bunga, dan pencahayaan studio lembut.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Luxury Commercial Advertising Photographer. Susun prompt produk botol parfum, skincare, atau aksesoris dengan bahan material premium dan pantulan air sempurna.",
        components: [
          {
            name: "productItem",
            label: "Deskripsi Produk Mewah",
            type: "text",
            placeholder: "contoh: Botol parfum kaca bening elegan dengan tutup emas dan cairan amber berkilau",
            info: "Apa produk yang dipotret?",
          },
          {
            name: "pedestalEnvironment",
            label: "Podium Marmer & Elemen Dekorasi",
            type: "select",
            options: ["Podium marmer Carrara putih di atas permukaan air tenang dengan pantulan kristal", "Podium batu obsidian hitam matte dengan percikan tetesan air dinamis", "Podium batu pasir alami dikelilingi kelopak mawar putih dan dedaunan eucalyptus", "Lainnya..."],
            info: "Bahan dudukan podium dan properti foto",
          },
        ],
      },
    },
    "Prompt AI Gambar Master (Midjourney, DALL-E 3, Flux)": {
      "Flux.1 & Midjourney v6.1 Photorealistic Portrait": {
        description: "Formula prompt potret manusia fotorealistik 8K dengan tekstur pori-pori kulit mikro, pencahayaan Rembrandt, lensa kamera profesional, dan ekspresi natural.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Master Fashion & Portrait Photographer. Susun deskripsi visual dengan parameter optik kamera nyata (focal length, aperture, ISO, sensor format).",
        components: [
          {
            name: "subjectDescription",
            label: "Subjek Manusia & Pakaian",
            type: "text",
            placeholder: "contoh: Wanita muda Asia Tenggara usia 25 tahun tersenyum elegan mengenakan blazer linen krem modern",
            info: "Deskripsikan usia, ekspresi, etnisitas, dan pakaian subjek",
          },
          {
            name: "environmentSetting",
            label: "Latar Belakang & Lokasi",
            type: "text",
            placeholder: "contoh: Kafe bernuansa kayu minimalis di Tokyo saat pagi hari dengan tanaman hijau dan jendela besar",
            info: "Di mana subjek berada dan bagaimana latarnya?",
          },
          {
            name: "cameraOptics",
            label: "Lensa Kamera & Kedalaman Bidang (DOF)",
            type: "select",
            options: ["Hasselblad H6D-100c, 85mm f/1.4 lens, creamy shallow depth of field bokeh", "Sony A7R V, 35mm f/1.8 lens, sharp environmental street portrait", "Canon EOS R5, 50mm f/1.2 lens, classic studio portrait framing", "Fujifilm GFX 100 II, 110mm f/2 lens, ultra high definition medium format detail", "Lainnya..."],
            info: "Pengaturan optik dan karakter lensa kamera",
          },
          {
            name: "lightingSetup",
            label: "Pencahayaan Studio & Waktu",
            type: "select",
            options: ["Natural golden hour morning sunlight through window with soft shadows", "Rembrandt studio lighting setup with softbox key light and subtle hair light", "Cinematic overcast daylight with ultra-soft even skin tone illumination", "Moody neon rim lighting with deep atmospheric shadows", "Lainnya..."],
            info: "Karakter cahaya yang membentuk subjek",
          },
          {
            name: "aspectRatio",
            label: "Aspek Rasio Gambar",
            type: "select",
            options: ["--ar 16:9 (Layar Lebar / Banner)", "--ar 9:16 (Story / TikTok / Reels Vertikal)", "--ar 4:5 (Instagram Feed Potret)", "--ar 1:1 (Persegi Standar)", "--ar 2:3 (Potret Klasik)", "--ar 21:9 (Sinematik Ultrawide)", "Lainnya..."],
            info: "Proporsi dimensi gambar yang dihasilkan",
          },
        ],
      },
      "Flat Vector UI/UX App Illustration": {
        description: "Gaya ilustrasi vektor modern minimalis untuk landing page, onboarding app, dan empty-state dengan palet warna harmonis dan karakter proporsional.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Lead Product Illustrator di perusahaan tech ternama. Rancang visual vektor flat yang bersih, elegan, dan siap digunakan di UI/UX.",
        components: [
          {
            name: "conceptScene",
            label: "Konsep Ilustrasi / Aksi",
            type: "text",
            placeholder: "contoh: Tim berkolaborasi merancang roket digital yang meluncur dari laptop, melambangkan pertumbuhan bisnis",
            info: "Metafora visual apa yang ingin digambarkan?",
          },
          {
            name: "colorPalette",
            label: "Palet Warna Utama",
            type: "select",
            options: ["Modern Emerald Tech (Emerald green, teal, navy dark slate, crisp white)", "Warm Coral Sunset (Coral, amber gold, soft violet, cream background)", "Cyber Indigo (Deep indigo, vibrant purple, cyan accents)", "Minimalist Pastel (Soft sage, terracotta, muted sand, warm gray)", "Lainnya..."],
            info: "Kombinasi warna dominan ilustrasi",
          },
          {
            name: "illustrationStyle",
            label: "Gaya & Detail Visual",
            type: "select",
            options: ["Clean flat vector illustration, Dribbble trending, isometric perspective, white background", "Minimalist line art with bold color blocks, elegant modern SaaS website asset", "Chubby cute 3D claymation style, soft ambient occlusion, playful aesthetic", "Editorial hand-drawn vector texture with subtle grain, professional magazine vibe", "Lainnya..."],
            info: "Detail sentuhan gaya artistik",
          },
        ],
      },
      "Minimalist Geometric Logo & Brand Icon": {
        description: "Perancang logo brand modern monoline, golden ratio grid, siluet bersih, mudah diingat, dan fleksibel diaplikasikan di semua media.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Brand Identity Director kelas dunia. Buat prompt logo minimalis dengan kekuatan simbolik tinggi dan kesederhanaan geometris.",
        components: [
          {
            name: "brandNameConcept",
            label: "Nama Brand & Filosofi Nilai",
            type: "text",
            placeholder: "contoh: EcoPulse - Brand energi terbarukan dan teknologi hijau berkelanjutan",
            info: "Apa nama brand dan nilai utama yang diwakili?",
          },
          {
            name: "visualSymbol",
            label: "Bentuk / Simbol Utama",
            type: "text",
            placeholder: "contoh: Penggabungan daun tanaman dengan gelombang sinyal pulsa energi listrik",
            info: "Kombinasi objek apa yang membentuk ikon logo?",
          },
          {
            name: "logoStyle",
            label: "Gaya Desain Logo",
            type: "select",
            options: ["Minimalist geometric vector logo mark, golden ratio grid, single solid color on white background", "Monoline continuous line art logo icon, modern sleek typography, vector SVG style", "Abstract gradient dynamic symbol, smooth color blend, modern tech icon", "Negative space clever logo design, smart visual pun, iconic minimalism", "Lainnya..."],
            info: "Metodologi desain visual logo",
          },
        ],
      },
    },
    "Framework Prompt Gambar Master": {
      "3D Disney Pixar Character & Avatar Style": {
        description: "Formula prompt gambar karakter 3D animasi menggemaskan bergaya Pixar dengan mata ekspresif, rambut halus, dan pencahayaan studio hangat.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah 3D Character Artist & Lighting Director. AI menyusun prompt gambar lengkap dengan instruksi rendering Octane/Blender 3D, subsurface scattering, dan studio lighting.",
        components: [
          {
            name: "characterSubject",
            label: "Karakter / Subjek Utama",
            type: "text",
            placeholder: "e.g., 'Seorang anak perempuan Indonesia memakai kacamata bulat dan hoodie hijau'",
            info: "Jelaskan siapa atau apa karakter yang ingin dibuat.",
          },
          {
            name: "facialExpression",
            label: "Ekspresi Wajah & Pose",
            type: "text",
            placeholder: "e.g., 'Tersenyum ceria sambil memegang cangkir cokelat panas'",
            info: "Tentukan emosi wajah dan gaya tubuh karakter.",
          },
          {
            name: "backgroundSetting",
            label: "Latar Belakang Ruangan / Lokasi",
            type: "text",
            placeholder: "e.g., 'Kamar tidur aesthetic dengan tanaman hias dan lampu fairy lights'",
            info: "Setting suasana di belakang karakter.",
          },
          {
            name: "aspectRatio",
            label: "Aspek Rasio Gambar",
            type: "select",
            options: ["1:1 (Instagram Feed / Avatar Bulat)", "9:16 (Story / TikTok / Reels)", "16:9 (YouTube Thumbnail / Wallpaper)"],
            info: "Pilih ukuran kanvas gambar yang diinginkan.",
          },
        ],
        id_kerangka: "FW-3DDISNE",
        nama_kerangka: "3D Disney Pixar Character & Avatar Style",
        version: "2.0",
        kategori: ["Gambar & Desain", "Framework Prompt Gambar Master"],
        perspektif_user: "Pengguna ingin meracik prompt 3D Disney Pixar Character & Avatar Style berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah 3D Character Artist & Lighting Director. AI menyusun prompt gambar lengkap dengan instruksi rendering Octane/Blender 3D, subsurface scattering, dan studio lighting.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah 3D Character Artist & Lighting Director. AI menyusun prompt gambar lengkap dengan instruksi rendering Octane/Blender 3D, subsurface scattering, dan studio lighting.",
          KONTEKS: "Formula prompt gambar karakter 3D animasi menggemaskan bergaya Pixar dengan mata ekspresif, rambut halus, dan pencahayaan studio hangat.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "characterSubject": {
                        "name": "characterSubject",
                        "label": "Karakter / Subjek Utama",
                        "type": "text",
                        "placeholder": "e.g., 'Seorang anak perempuan Indonesia memakai kacamata bulat dan hoodie hijau'",
                        "options": [],
                        "info": "Jelaskan siapa atau apa karakter yang ingin dibuat."
            },
            "facialExpression": {
                        "name": "facialExpression",
                        "label": "Ekspresi Wajah & Pose",
                        "type": "text",
                        "placeholder": "e.g., 'Tersenyum ceria sambil memegang cangkir cokelat panas'",
                        "options": [],
                        "info": "Tentukan emosi wajah dan gaya tubuh karakter."
            },
            "backgroundSetting": {
                        "name": "backgroundSetting",
                        "label": "Latar Belakang Ruangan / Lokasi",
                        "type": "text",
                        "placeholder": "e.g., 'Kamar tidur aesthetic dengan tanaman hias dan lampu fairy lights'",
                        "options": [],
                        "info": "Setting suasana di belakang karakter."
            },
            "aspectRatio": {
                        "name": "aspectRatio",
                        "label": "Aspek Rasio Gambar",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "1:1 (Instagram Feed / Avatar Bulat)",
                                    "9:16 (Story / TikTok / Reels)",
                                    "16:9 (YouTube Thumbnail / Wallpaper)"
                        ],
                        "info": "Pilih ukuran kanvas gambar yang diinginkan."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk 3D Disney Pixar Character & Avatar Style.",
        output: "natural_language_prompt"
      },
      "Foto Produk Mewah Fotorealistik (Studio Photography)": {
        description: "Formula prompt fotografi produk komersial mewah di atas podium marmer, percikan air, atau pantulan kaca dengan pencahayaan studio iklan.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Commercial Product Photographer. AI meracik prompt fotorealistik dengan detail material, lensa makro 85mm, rim light, dan refleksi permukaan beresolusi tinggi.",
        components: [
          {
            name: "productItem",
            label: "Jenis Produk yang Difoto",
            type: "text",
            placeholder: "e.g., 'Botol serum skincare kaca bening dengan cairan emas berkilau'",
            info: "Detail bentuk, bahan, dan warna produk Anda.",
          },
          {
            name: "podiumSurface",
            label: "Alas / Podium Tempat Produk Berdiri",
            type: "select",
            options: ["Podium Marmer Putih Mewah dengan Serat Emas", "Permukaan Air Jernih dengan Riak Ombak Halus", "Balok Batu Alam Hitam Basah (Dark Minimalist)", "Kayu Jati Alami dengan Daun Monstera Segar", "Kaca Cermin Berpantul Bersih dengan Latar Gradien Pastel"],
            info: "Pilih nuansa display produk komersial.",
          },
          {
            name: "lightingSetup",
            label: "Pengaturan Pencahayaan Studio",
            type: "select",
            options: ["Softbox Diffused Lighting (Lembut & Elegan)", "Dramatic Rim Light & Shadow Play (Mewah Sinematik)", "Golden Hour Sunlight Beam through Window (Natural Estetik)", "Cyber Neon Glow (Modern & Futuristik)"],
            info: "Tata cahaya yang menentukan kelas visual produk.",
          },
        ],
        id_kerangka: "FW-FOTOPRO",
        nama_kerangka: "Foto Produk Mewah Fotorealistik (Studio Photography)",
        version: "2.0",
        kategori: ["Gambar & Desain", "Framework Prompt Gambar Master"],
        perspektif_user: "Pengguna ingin meracik prompt Foto Produk Mewah Fotorealistik (Studio Photography) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Commercial Product Photographer. AI meracik prompt fotorealistik dengan detail material, lensa makro 85mm, rim light, dan refleksi permukaan beresolusi tinggi.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Commercial Product Photographer. AI meracik prompt fotorealistik dengan detail material, lensa makro 85mm, rim light, dan refleksi permukaan beresolusi tinggi.",
          KONTEKS: "Formula prompt fotografi produk komersial mewah di atas podium marmer, percikan air, atau pantulan kaca dengan pencahayaan studio iklan.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "productItem": {
                        "name": "productItem",
                        "label": "Jenis Produk yang Difoto",
                        "type": "text",
                        "placeholder": "e.g., 'Botol serum skincare kaca bening dengan cairan emas berkilau'",
                        "options": [],
                        "info": "Detail bentuk, bahan, dan warna produk Anda."
            },
            "podiumSurface": {
                        "name": "podiumSurface",
                        "label": "Alas / Podium Tempat Produk Berdiri",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Podium Marmer Putih Mewah dengan Serat Emas",
                                    "Permukaan Air Jernih dengan Riak Ombak Halus",
                                    "Balok Batu Alam Hitam Basah (Dark Minimalist)",
                                    "Kayu Jati Alami dengan Daun Monstera Segar",
                                    "Kaca Cermin Berpantul Bersih dengan Latar Gradien Pastel"
                        ],
                        "info": "Pilih nuansa display produk komersial."
            },
            "lightingSetup": {
                        "name": "lightingSetup",
                        "label": "Pengaturan Pencahayaan Studio",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Softbox Diffused Lighting (Lembut & Elegan)",
                                    "Dramatic Rim Light & Shadow Play (Mewah Sinematik)",
                                    "Golden Hour Sunlight Beam through Window (Natural Estetik)",
                                    "Cyber Neon Glow (Modern & Futuristik)"
                        ],
                        "info": "Tata cahaya yang menentukan kelas visual produk."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Foto Produk Mewah Fotorealistik (Studio Photography).",
        output: "natural_language_prompt"
      },
      "Miniatur Ruangan 3D Isometrik (Isometric Diorama Room)": {
        description: "Formula kreasi miniatur ruangan 3D isometrik bertema unik (kamar tidur gamer, cafe jepang, toko buku cozy) dengan pencahayaan hangat.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah 3D Architectural Illustrator. AI meracik prompt orthographic isometric projection dengan miniatur cutaway view dan perabotan detail.",
        components: [
          {
            name: "roomType",
            label: "Jenis Ruangan / Bangunan Miniatur",
            type: "text",
            placeholder: "e.g., 'Kamar tidur gamer cozy / Kafe kopi tradisional Jepang'",
            info: "Tentukan konsep ruangan yang ingin dibuat dalam bentuk miniatur 3D.",
          },
          {
            name: "artStyle",
            label: "Gaya Visual & Palet Warna",
            type: "select",
            options: ["Pastel Cozy & Warm Studio Lighting", "Cyberpunk Neon Glow & Dark Metallic", "Japanese Wooden Minimalist (Muji Style)", "Ghibli Watercolor Anime Aesthetic", "Low-Poly Vibrant Colors"],
            info: "Pilih nuansa warna dan atmosfer visual.",
          },
          {
            name: "keyFurnitures",
            label: "Benda / Perabotan Khas di Dalam Ruangan",
            type: "text",
            placeholder: "e.g., 'Meja komputer dengan lampu RGB, rak buku mini, kasur lantai, tanaman gantung'",
            info: "Sebutkan pernak-pernik yang membuat ruangan terasa hidup.",
          },
        ],
        id_kerangka: "FW-MINIATU",
        nama_kerangka: "Miniatur Ruangan 3D Isometrik (Isometric Diorama Room)",
        version: "2.0",
        kategori: ["Gambar & Desain", "Framework Prompt Gambar Master"],
        perspektif_user: "Pengguna ingin meracik prompt Miniatur Ruangan 3D Isometrik (Isometric Diorama Room) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah 3D Architectural Illustrator. AI meracik prompt orthographic isometric projection dengan miniatur cutaway view dan perabotan detail.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah 3D Architectural Illustrator. AI meracik prompt orthographic isometric projection dengan miniatur cutaway view dan perabotan detail.",
          KONTEKS: "Formula kreasi miniatur ruangan 3D isometrik bertema unik (kamar tidur gamer, cafe jepang, toko buku cozy) dengan pencahayaan hangat.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "roomType": {
                        "name": "roomType",
                        "label": "Jenis Ruangan / Bangunan Miniatur",
                        "type": "text",
                        "placeholder": "e.g., 'Kamar tidur gamer cozy / Kafe kopi tradisional Jepang'",
                        "options": [],
                        "info": "Tentukan konsep ruangan yang ingin dibuat dalam bentuk miniatur 3D."
            },
            "artStyle": {
                        "name": "artStyle",
                        "label": "Gaya Visual & Palet Warna",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Pastel Cozy & Warm Studio Lighting",
                                    "Cyberpunk Neon Glow & Dark Metallic",
                                    "Japanese Wooden Minimalist (Muji Style)",
                                    "Ghibli Watercolor Anime Aesthetic",
                                    "Low-Poly Vibrant Colors"
                        ],
                        "info": "Pilih nuansa warna dan atmosfer visual."
            },
            "keyFurnitures": {
                        "name": "keyFurnitures",
                        "label": "Benda / Perabotan Khas di Dalam Ruangan",
                        "type": "text",
                        "placeholder": "e.g., 'Meja komputer dengan lampu RGB, rak buku mini, kasur lantai, tanaman gantung'",
                        "options": [],
                        "info": "Sebutkan pernak-pernik yang membuat ruangan terasa hidup."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Miniatur Ruangan 3D Isometrik (Isometric Diorama Room).",
        output: "natural_language_prompt"
      },
      "Estetika Foto Analog 90s Vintage Film (Polaroid / 35mm)": {
        description: "Foto bernuansa nostalgia kamera jadul tahun 90-an dengan efek grain film 35mm, kebocoran cahaya (light leak), dan tone warna hangat.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Analog Film Photographer. AI meracik prompt dengan emulsi film klasik (Kodak Portra, Fujifilm Superia), grain tekstur, dan flash kamera candid.",
        components: [
          {
            name: "photoSubject",
            label: "Subjek & Aktivitas Foto",
            type: "text",
            placeholder: "e.g., 'Sekelompok sahabat tertawa di rooftop saat matahari terbenam'",
            info: "Siapa dan apa yang sedang terjadi dalam momen foto candid.",
          },
          {
            name: "filmStock",
            label: "Karakter Film Analog",
            type: "select",
            options: ["Kodak Gold 200 (Warna Hangat & Golden Glow)", "Fujifilm Superia 400 (Warna Hijau Alami & Cool Tone)", "Polaroid 600 Flash Candid (Frame Putih & Flash Tajam)", "Ilford HP5 Plus (Hitam Putih Klasik Bertekstur Grain Tebal)"],
            info: "Pilih karakter warna emulsi film jadul.",
          },
          {
            name: "locationSetting",
            label: "Latar Lokasi Retro",
            type: "text",
            placeholder: "e.g., 'Diner restoran bergaya 90-an / Pinggir pantai sore hari'",
            info: "Tempat berlangsungnya momen foto.",
          },
        ],
        id_kerangka: "FW-ESTETIK",
        nama_kerangka: "Estetika Foto Analog 90s Vintage Film (Polaroid / 35mm)",
        version: "2.0",
        kategori: ["Gambar & Desain", "Framework Prompt Gambar Master"],
        perspektif_user: "Pengguna ingin meracik prompt Estetika Foto Analog 90s Vintage Film (Polaroid / 35mm) berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Analog Film Photographer. AI meracik prompt dengan emulsi film klasik (Kodak Portra, Fujifilm Superia), grain tekstur, dan flash kamera candid.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Analog Film Photographer. AI meracik prompt dengan emulsi film klasik (Kodak Portra, Fujifilm Superia), grain tekstur, dan flash kamera candid.",
          KONTEKS: "Foto bernuansa nostalgia kamera jadul tahun 90-an dengan efek grain film 35mm, kebocoran cahaya (light leak), dan tone warna hangat.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "photoSubject": {
                        "name": "photoSubject",
                        "label": "Subjek & Aktivitas Foto",
                        "type": "text",
                        "placeholder": "e.g., 'Sekelompok sahabat tertawa di rooftop saat matahari terbenam'",
                        "options": [],
                        "info": "Siapa dan apa yang sedang terjadi dalam momen foto candid."
            },
            "filmStock": {
                        "name": "filmStock",
                        "label": "Karakter Film Analog",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Kodak Gold 200 (Warna Hangat & Golden Glow)",
                                    "Fujifilm Superia 400 (Warna Hijau Alami & Cool Tone)",
                                    "Polaroid 600 Flash Candid (Frame Putih & Flash Tajam)",
                                    "Ilford HP5 Plus (Hitam Putih Klasik Bertekstur Grain Tebal)"
                        ],
                        "info": "Pilih karakter warna emulsi film jadul."
            },
            "locationSetting": {
                        "name": "locationSetting",
                        "label": "Latar Lokasi Retro",
                        "type": "text",
                        "placeholder": "e.g., 'Diner restoran bergaya 90-an / Pinggir pantai sore hari'",
                        "options": [],
                        "info": "Tempat berlangsungnya momen foto."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Estetika Foto Analog 90s Vintage Film (Polaroid / 35mm).",
        output: "natural_language_prompt"
      },
      "Desain Logo Vektor Minimalis & Modern": {
        description: "Formula prompt desain logo bisnis minimalis geometris bersih tanpa gradien rumit, siap untuk aplikasi identitas merek.",
        toolType: "image-generation",
        ai_logic_description: "Persona AI: Anda adalah Brand Identity Designer. AI menyusun prompt vektor logo minimalis (Swiss Style, flat vector, negative space, no photorealistic shading, clean white background).",
        components: [
          {
            name: "brandNameAndNiche",
            label: "Nama Brand & Bidang Usaha",
            type: "text",
            placeholder: "e.g., 'Zenith - Aplikasi Produktivitas & Manajemen Waktu'",
            info: "Nama merek dan industri yang digeluti.",
          },
          {
            name: "logoStyle",
            label: "Gaya Desain Logo",
            type: "select",
            options: ["Monogram Huruf Inisial Geometris", "Ikon Simbol Minimalis (Flat Vector Icon)", "Kombinasi Negative Space Cerdas", "Garis Linear Bersih (Line Art Emblem)", "Bentuk Organik Modern & Elegan"],
            info: "Pilih format visual logo yang diinginkan.",
          },
          {
            name: "symbolElements",
            label: "Simbol / Objek Kunci yang Digabungkan",
            type: "text",
            placeholder: "e.g., 'Gabungan simbol jam pasir dan daun pertumbuhan'",
            info: "Elemen simbolis yang mewakili nilai brand.",
          },
          {
            name: "colorPalette",
            label: "Kombinasi 2 Warna Utama",
            type: "text",
            placeholder: "e.g., 'Deep Emerald Green & Charcoal Slate'",
            info: "Dua warna utama untuk logo.",
          },
        ],
        id_kerangka: "FW-DESAINL",
        nama_kerangka: "Desain Logo Vektor Minimalis & Modern",
        version: "2.0",
        kategori: ["Gambar & Desain", "Framework Prompt Gambar Master"],
        perspektif_user: "Pengguna ingin meracik prompt Desain Logo Vektor Minimalis & Modern berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Brand Identity Designer. AI menyusun prompt vektor logo minimalis (Swiss Style, flat vector, negative space, no photorealistic shading, clean white background).",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Brand Identity Designer. AI menyusun prompt vektor logo minimalis (Swiss Style, flat vector, negative space, no photorealistic shading, clean white background).",
          KONTEKS: "Formula prompt desain logo bisnis minimalis geometris bersih tanpa gradien rumit, siap untuk aplikasi identitas merek.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "brandNameAndNiche": {
                        "name": "brandNameAndNiche",
                        "label": "Nama Brand & Bidang Usaha",
                        "type": "text",
                        "placeholder": "e.g., 'Zenith - Aplikasi Produktivitas & Manajemen Waktu'",
                        "options": [],
                        "info": "Nama merek dan industri yang digeluti."
            },
            "logoStyle": {
                        "name": "logoStyle",
                        "label": "Gaya Desain Logo",
                        "type": "select",
                        "placeholder": "",
                        "options": [
                                    "Monogram Huruf Inisial Geometris",
                                    "Ikon Simbol Minimalis (Flat Vector Icon)",
                                    "Kombinasi Negative Space Cerdas",
                                    "Garis Linear Bersih (Line Art Emblem)",
                                    "Bentuk Organik Modern & Elegan"
                        ],
                        "info": "Pilih format visual logo yang diinginkan."
            },
            "symbolElements": {
                        "name": "symbolElements",
                        "label": "Simbol / Objek Kunci yang Digabungkan",
                        "type": "text",
                        "placeholder": "e.g., 'Gabungan simbol jam pasir dan daun pertumbuhan'",
                        "options": [],
                        "info": "Elemen simbolis yang mewakili nilai brand."
            },
            "colorPalette": {
                        "name": "colorPalette",
                        "label": "Kombinasi 2 Warna Utama",
                        "type": "text",
                        "placeholder": "e.g., 'Deep Emerald Green & Charcoal Slate'",
                        "options": [],
                        "info": "Dua warna utama untuk logo."
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Desain Logo Vektor Minimalis & Modern.",
        output: "natural_language_prompt"
      },
      "S-E-L-S-C (Master Prompt Gambar AI)": {
        description: "Formula standar emas untuk menghasilkan gambar fotorealistik dan artistik di Midjourney, Stable Diffusion, Ideogram, & DALL-E.",
        toolType: "image-generation",
        ai_logic_description: "Anda adalah seorang Visual Artist & Prompt Engineer Gambar yang akan menyusun deskripsi visual fotorealistik berdasarkan Subject, Environment, Lighting, Style, dan Camera.",
        components: [
          {
            name: "subject",
            label: "Subjek Utama (Subject)",
            type: "textarea",
            placeholder: "e.g., 'Prajurit samurai cyberpunk dengan armor neon menyala dan katana transparan'",
            info: "Subjek utama, pakaian, pose, ekspresi, dan detail fisik."
          },
          {
            name: "environment",
            label: "Lingkungan / Latar (Environment)",
            type: "textarea",
            placeholder: "e.g., 'Gang sempit Neo-Tokyo basah oleh hujan, papan hologram raksasa, pantulan kabut'",
            info: "Lokasi latar belakang, cuaca, dan suasana tempat."
          },
          {
            name: "lighting",
            label: "Pencahayaan & Atmosfer (Lighting)",
            type: "select",
            options: ["Cinematic Volumetric Light", "Golden Hour Sunset", "Neon Glow Rim Light", "Studio Softbox", "Moody Dark Shadows", "Lainnya..."],
            info: "Jenis dan nuansa pencahayaan."
          },
          {
            name: "style",
            label: "Gaya Artistik / Medium (Style)",
            type: "select",
            options: ["Hyperrealistic 8k Unreal Engine 5", "35mm Vintage Film Photography", "Digital Concept Art Artstation", "Anime Makoto Shinkai Style", "Oil Painting Masterpiece", "Lainnya..."],
            info: "Medium seni atau gaya visual."
          },
          {
            name: "camera",
            label: "Kamera & Parameter (Camera/Flags)",
            type: "text",
            placeholder: "e.g., 'Sony A7R V 85mm f/1.4 lens, shallow depth of field, bokeh, --ar 16:9 --v 6.1'",
            info: "Sudut lensa, rasio aspek, dan flag parameter model."
          }
        ]
      },
      "Filter Prompt Negatif (Negative Prompt)": {
        description: "Filter prompt wajib untuk Stable Diffusion, Leonardo AI, dan parameter --no Midjourney guna membuang distorsi & kecacatan visual.",
        toolType: "image-generation",
        ai_logic_description: "Anda adalah seorang Quality Assurance Gambar AI yang memfilter artefak, cacat anatomi, dan elemen yang tidak diinginkan.",
        components: [
          {
            name: "qualityArtifacts",
            label: "Artefak Kualitas yang Dibuang",
            type: "textarea",
            placeholder: "blurry, low quality, pixelated, jpeg artifacts, overexposed, watermark, signature, text, logo",
            info: "Penurunan kualitas visual yang ingin dihindari."
          },
          {
            name: "anatomyErrors",
            label: "Cacat Anatomi & Struktur Tubuh",
            type: "textarea",
            placeholder: "bad anatomy, extra limbs, mutated hands, missing fingers, distorted face, cross-eyed, cloned faces",
            info: "Kecacatan struktural pada manusia atau makhluk hidup."
          },
          {
            name: "compositionErrors",
            label: "Komposisi yang Tidak Diinginkan",
            type: "textarea",
            placeholder: "cropped, out of frame, cut off, duplicate objects, cluttered background, bad proportions",
            info: "Komposisi buruk, terpotong, atau objek latar yang mengganggu."
          }
        ]
      }
    },
    "Perencanaan Video & Visual": {
      "Ide Konten Video": {
        description:
          "Hasilkan ide-ide video yang menarik untuk platform media sosial.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Strategis Konten Video. AI akan menghasilkan ide-ide video yang menarik dan relevan dengan platform, niche, format, dan tujuan yang diinginkan, dengan fokus pada peningkatan engagement dan pencapaian target pengguna.",
        components: [
          {
            name: "platform",
            label: "Platform Video",
            type: "select",
            options: [
              "YouTube",
              "TikTok",
              "Instagram Reels",
              "LinkedIn Video",
              "Lainnya...",
            ],
            info: "Platform menentukan format, durasi, dan gaya konten.",
          },
          {
            name: "niche",
            label: "Niche / Tema Channel",
            type: "text",
            placeholder:
              "e.g., 'memasak untuk pemula, review gadget, keuangan pribadi'",
            info: "Fokus utama dari channel atau akun Anda.",
          },
          {
            name: "videoFormat",
            label: "Format Video",
            type: "select",
            options: [
              "Tutorial / How-to",
              "Vlog Harian/Mingguan",
              "Review Produk/Jasa",
              "Listicle (e.g., Top 5...)",
              "Edukasi Singkat / Explainer",
              "Wawancara",
              "Lainnya...",
            ],
            info: "Pilih jenis struktur video yang diinginkan.",
          },
          {
            name: "desiredOutcome",
            label: "Tujuan Video",
            type: "textarea",
            placeholder:
              "e.g., 'meningkatkan subscriber, mendapatkan engagement tinggi, mengarahkan trafik ke website'",
            info: "Apa hasil yang ingin Anda capai dengan video ini?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Saya ingin ide yang bisa dikolaborasikan dengan kreator lain. Fokus pada budget produksi rendah. Hindari topik politik.",
            info: "Detail tambahan yang bisa mengarahkan ide AI menjadi lebih unik dan sesuai dengan channel Anda.",
          },
        ],
      },
      "Script Iklan": {
        description: "Buat naskah singkat untuk iklan video atau audio.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Naskah Iklan. AI akan membuat naskah iklan yang singkat dan persuasif, dengan mempertimbangkan produk, target audiens, durasi, pesan kunci, dan platform penayangan untuk memaksimalkan dampak iklan.",
        components: [
          {
            name: "product",
            label: "Produk/Jasa yang Diiklankan",
            type: "text",
            placeholder: "e.g., 'Aplikasi Belajar Bahasa Asing'",
            info: "Produk yang menjadi fokus utama iklan.",
          },
          {
            name: "targetAudience",
            label: "Target Audiens Iklan",
            type: "text",
            placeholder: "e.g., 'mahasiswa, profesional muda, orang tua'",
            info: "Siapa yang ingin Anda jangkau dengan iklan ini?",
          },
          {
            name: "duration",
            label: "Durasi Iklan (detik)",
            type: "number",
            placeholder: "e.g., 30",
            info: "Durasi akan sangat mempengaruhi kepadatan naskah.",
          },
          {
            name: "keyMessage",
            label: "Pesan Kunci Iklan",
            type: "textarea",
            placeholder:
              "e.g., 'Belajar bahasa jadi mudah dan menyenangkan di mana saja.'",
            info: "Satu hal terpenting yang harus diingat audiens setelah melihat iklan.",
          },
          {
            name: "platform",
            label: "Platform Penayangan",
            type: "select",
            options: [
              "TV",
              "Radio",
              "YouTube (Pre-roll)",
              "TikTok/Reels/Shorts",
              "Lainnya...",
            ],
            info: "Platform akan mempengaruhi gaya dan kecepatan naskah.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tempo harus cepat dan energik. Sertakan anjuran untuk sound effect 'swoosh' saat produk muncul. Aktor harus terdengar antusias dan percaya diri.",
            info: "Instruksi tentang nuansa, tempo, atau elemen audio/visual yang harus dibayangkan oleh AI.",
          },
        ],
      },
    },
    "Prompt AI Gambar (Text-to-Image)": {
      "DALL-E 3": {
        description:
          "Tulis prompt naratif dan deskriptif yang kaya untuk DALL-E 3, yang unggul dalam memahami bahasa alami.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pelukis Digital AI. AI akan memproses deskripsi naratif untuk menghasilkan gambar yang kreatif dan akurat, memanfaatkan pemahaman DALL-E 3 tentang bahasa alami dan detail kontekstual.",
        components: [
          {
            name: "subject",
            label: "Subjek & Aksi",
            type: "textarea",
            placeholder:
              "e.g., 'Seekor rubah oranye terang dengan pakaian astronot sedang duduk di bulan, memandangi bumi.'",
            info: "Jelaskan subjek utama dan apa yang sedang dilakukannya secara detail.",
            validation: { min_length: 20 },
          },
          {
            name: "style",
            label: "Gaya Visual",
            type: "text",
            placeholder:
              "e.g., 'gaya lukisan cat minyak digital', 'seni piksel (pixel art)', 'foto sinematik'",
            info: "Medium atau gaya artistik dari gambar.",
            validation: { min_length: 5 },
          },
          {
            name: "composition",
            label: "Komposisi & Sudut Pandang",
            type: "text",
            placeholder:
              "e.g., 'close-up shot', 'wide-angle view', 'dari bawah'",
            info: "Bagaimana adegan dibingkai?",
            validation: { min_length: 5 },
          },
          {
            name: "lightingAndMood",
            label: "Pencahayaan & Suasana",
            type: "text",
            placeholder:
              "e.g., 'pencahayaan dramatis saat senja', 'suasana misterius dan berkabut'",
            info: "Bagaimana pencahayaan dan emosi yang ingin Anda tangkap?",
            validation: { min_length: 5 },
          },
          {
            name: "colorPalette",
            label: "Palet Warna",
            type: "text",
            placeholder:
              "e.g., 'warna-warna pastel yang lembut', 'monokromatik dengan aksen merah'",
            info: "Warna dominan yang Anda inginkan.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Stable Diffusion": {
        description:
          "Buat prompt positif dan negatif yang terstruktur untuk kontrol mendetail pada model Stable Diffusion.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pengendali Gambar. AI akan memproses prompt positif dan negatif untuk menghasilkan gambar yang sesuai, dengan fokus pada detail dan penghindaran elemen yang tidak diinginkan, memanfaatkan kemampuan kontrol Stable Diffusion.",
        components: [
          {
            name: "positivePrompt",
            label: "Positive Prompt",
            type: "textarea",
            placeholder:
              "e.g., '(best quality:1.2), ultra-detailed, masterpiece, a majestic lion on a rock, cinematic lighting, (photorealistic:1.3)'",
            info: "Deskripsi detail dari apa yang Anda inginkan. Gunakan bobot (word:1.2) untuk penekanan.",
            validation: { min_length: 20 },
          },
          {
            name: "negativePrompt",
            label: "Negative Prompt",
            type: "textarea",
            placeholder:
              "e.g., '(worst quality, low quality:1.4), blurry, ugly, deformed, text, watermark, extra limbs'",
            info: "Deskripsi detail dari apa yang TIDAK Anda inginkan. Sangat penting untuk hasil yang bersih.",
            validation: { min_length: 10 },
          },
          {
            name: "technicalParameters",
            label: "Parameter Teknis (untuk referensi)",
            type: "text",
            placeholder:
              "e.g., 'Sampler: DPM++ 2M Karras, CFG Scale: 7, Steps: 25, Seed: 12345'",
            info: "Catat parameter teknis yang Anda gunakan di luar prompt untuk replikasi.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Leonardo AI": {
        description:
          "Prompt untuk Leonardo AI, dengan penekanan pada model dan elemen khasnya.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Kreator Visual Leonardo. AI akan menghasilkan gambar berdasarkan prompt positif dan negatif, dengan mempertimbangkan model dan elemen khas Leonardo AI untuk menciptakan visual yang unik dan berkualitas tinggi.",
        components: [
          {
            name: "positivePrompt",
            label: "Positive Prompt",
            type: "textarea",
            placeholder:
              "e.g., 'A beautiful fantasy world, enchanted forest, by Artgerm and Greg Rutkowski, soft lighting, high detail'",
            info: "Deskripsi utama dari gambar yang diinginkan.",
            validation: { min_length: 20 },
          },
          {
            name: "negativePrompt",
            label: "Negative Prompt",
            type: "textarea",
            placeholder:
              "e.g., 'blurry, noise, ugly, tiling, poorly drawn hands'",
            info: "Hal-hal yang ingin Anda hindari dalam gambar.",
            validation: { min_length: 10 },
          },
          {
            name: "leonardoModel",
            label: "Model Leonardo",
            type: "text",
            placeholder: "e.g., 'Leonardo Diffusion XL', 'DreamShaper v7'",
            info: "Model spesifik yang Anda gunakan di platform Leonardo AI.",
            validation: { min_length: 5 },
          },
          {
            name: "leonardoElements",
            label: "Elemen Leonardo (Opsional)",
            type: "text",
            placeholder: "e.g., 'Fantasy, Vintage, Toon'",
            info: "Elemen atau gaya khusus yang disediakan oleh Leonardo AI.",
            optional: true,
            validation: { min_length: 3 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Firefly (Adobe)": {
        description:
          "Prompt untuk Adobe Firefly, dengan penekanan pada gaya dan efek yang tersedia.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Seniman Efek Digital. AI akan menerapkan gaya dan efek yang diminta pada subjek, menghasilkan gambar yang artistik dan sesuai dengan preferensi visual yang ditentukan.",
        components: [
          {
            name: "subject",
            label: "Deskripsi Subjek",
            type: "textarea",
            placeholder:
              "e.g., 'A fluffy baby owl reading a book in a cozy library'",
            info: "Deskripsi utama dari apa yang ingin Anda buat.",
            validation: { min_length: 20 },
          },
          {
            name: "styleAndEffects",
            label: "Gaya & Efek",
            type: "text",
            placeholder:
              "e.g., 'Steampunk, synthwave, layered paper, bokeh effect'",
            info: "Gaya visual, teknik, atau efek yang ingin diterapkan.",
            validation: { min_length: 5 },
          },
          {
            name: "colorAndTone",
            label: "Warna & Nada",
            type: "text",
            placeholder: "e.g., 'Vibrant colors, muted tones, golden hour'",
            info: "Palet warna dan suasana pencahayaan.",
            validation: { min_length: 5 },
          },
          {
            name: "negativePrompt",
            label: "Kata Kunci Negatif",
            type: "text",
            placeholder: "e.g., 'dark, scary, blurry'",
            info: "Hal-hal yang ingin dikecualikan dari gambar.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Playground AI": {
        description:
          "Buat prompt untuk Playground AI, platform yang fleksibel untuk berbagai gaya.",
        toolType: "image-editing",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Eksplorator Visual. AI akan menghasilkan gambar berdasarkan prompt utama dan elemen yang dikecualikan, memanfaatkan fleksibilitas Playground AI untuk berbagai gaya visual.",
        components: [
          {
            name: "prompt",
            label: "Prompt Utama",
            type: "textarea",
            placeholder:
              "e.g., 'A majestic castle in the clouds, fantasy, hyperrealistic, epic scale'",
            info: "Deskripsi utama dari gambar yang diinginkan.",
            validation: { min_length: 20 },
          },
          {
            name: "excludeFromImage",
            label: "Kecualikan dari Gambar (Negative Prompt)",
            type: "textarea",
            placeholder: "e.g., 'trees, people, fog'",
            info: "Hal-hal yang tidak ingin Anda lihat di hasil akhir.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Custom Image Generator": {
        description:
          "Demonstrasi input interaktif: color picker, date picker, dan slider.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Demonstrator Input. AI akan menampilkan bagaimana berbagai jenis input interaktif dapat digunakan untuk mengontrol parameter generasi gambar.",
        components: [
          {
            name: "mainSubject",
            label: "Subjek Utama",
            type: "text",
            placeholder: "e.g., 'Pemandangan gunung'",
            info: "Deskripsi subjek gambar.",
            validation: { min_length: 5 },
          },
          {
            name: "primaryColor",
            label: "Warna Utama",
            type: "color",
            info: "Pilih warna dominan untuk gambar.",
          },
          {
            name: "creationDate",
            label: "Tanggal Kreasi",
            type: "date",
            info: "Tanggal gambar dibuat.",
          },
          {
            name: "detailLevel",
            label: "Tingkat Detail",
            type: "slider",
            min: 0,
            max: 100,
            step: 1,
            info: "Sesuaikan tingkat detail gambar (0-100).",
          },
          {
            name: "contrast",
            label: "Kontras",
            type: "slider",
            min: -50,
            max: 50,
            step: 5,
            info: "Sesuaikan kontras gambar (-50 hingga 50).",
          },
          {
            name: "additionalNotes",
            label: "Catatan Tambahan",
            type: "textarea",
            placeholder: "e.g., 'Gaya realistis, pencahayaan dramatis.'",
            info: "Catatan atau instruksi tambahan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Prompt AI Video (Text-to-Video)": {
      "Sora (OpenAI)": {
        description:
          "Buat prompt yang sangat deskriptif dan sinematik untuk menghasilkan video berkualitas tinggi dengan Sora.",
        toolType: "video",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Sutradara AI. AI akan menginterpretasikan deskripsi adegan yang kaya dan instruksi kamera untuk menghasilkan video sinematik yang detail dan berkualitas tinggi, memanfaatkan kemampuan Sora dalam memahami narasi visual.",
        components: [
          {
            name: "sceneDescription",
            label: "Deskripsi Adegan Detail",
            type: "textarea",
            placeholder:
              "e.g., 'A stylish woman walks through a Tokyo street filled with warm glowing neon and animated city signage. She wears a black leather jacket, a long red dress, and black boots. The street is damp and reflective, creating a mirror effect of the colorful lights.'",
            info: "Jelaskan adegan, subjek, latar belakang, dan atmosfer secara naratif dan mendetail.",
            validation: { min_length: 50 },
          },
          {
            name: "cameraWork",
            label: "Gerakan & Sudut Kamera",
            type: "text",
            placeholder:
              "e.g., 'Extreme close-up, tracking shot, drone footage flying over a landscape'",
            info: "Deskripsikan bagaimana kamera harus bergerak atau membingkai adegan.",
            validation: { min_length: 10 },
          },
          {
            name: "visualStyle",
            label: "Gaya Visual",
            type: "text",
            placeholder:
              "e.g., 'cinematic, 35mm film, photorealistic, anime, black and white'",
            info: "Gaya keseluruhan dari video.",
            validation: { min_length: 5 },
          },
          {
            name: "durationHint",
            label: "Petunjuk Durasi (Opsional)",
            type: "text",
            placeholder: "e.g., 'a short clip', 'a looping video'",
            info: "Berikan petunjuk tentang panjang atau sifat video.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Google VEO": {
        description:
          "Buat prompt yang sangat deskriptif dan sinematik untuk menghasilkan video berkualitas tinggi dengan Google VEO.",
        toolType: "video",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Sinematografer AI. AI akan menghasilkan video berkualitas tinggi berdasarkan prompt deskriptif dan parameter sinematik, memanfaatkan pemahaman Google VEO tentang komposisi visual dan gerakan kamera.",
        components: [
          {
            name: "prompt",
            label: "Prompt Deskriptif",
            type: "textarea",
            placeholder:
              "e.g., 'Several majestic elephants stride toward a watering hole at sunset, their wrinkled skin catching the golden light. The African savanna stretches out behind them.'",
            info: "Tulis prompt yang kaya detail, seolah-olah mendeskripsikan adegan film.",
            validation: { min_length: 50 },
          },
          {
            name: "aspectRatio",
            label: "Aspect Ratio",
            type: "select",
            options: ["16:9", "9:16", "1:1"],
            info: 'Nilai yang didukung adalah "16:9" (layar lebar, bagus untuk lanskap), "9:16" (potret/vertikal, bagus untuk objek tinggi), dan "1:1" (persegi). Default adalah "16:9".',
          },
          {
            name: "personGeneration",
            label: "Generasi Orang",
            type: "select",
            options: ["allow", "dont_allow", "allow_adult"],
            info: 'Kontrol penyertaan orang dengan "dont_allow" atau "allow_adult".',
          },
          {
            name: "negativePrompt",
            label: "Negative Prompt",
            type: "textarea",
            placeholder: "e.g., 'wall, frame'",
            info: 'Tentukan elemen yang akan dikecualikan dari video. Jelaskan apa yang tidak Anda inginkan (misalnya, "dinding, bingkai") daripada menggunakan bahasa instruktif seperti "tidak" atau "jangan".',
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "generateAudio",
            label: "Generate Audio",
            type: "select",
            options: ["true", "false"],
            info: "Kontrol apakah audio dihasilkan untuk video.",
          },
          {
            name: "image",
            label: "Image (First Frame)",
            type: "text",
            placeholder: "e.g., 'URL_gambar'",
            info: "Gunakan gambar sebagai bingkai pertama untuk generasi gambar-ke-video.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "durationSeconds",
            label: "Durasi (detik)",
            type: "number",
            placeholder: "e.g., 8",
            info: "Klip video yang dihasilkan biasanya berdurasi 8 detik, tetapi dapat diperpanjang hingga 60 detik.",
            validation: { min_value: 1, max_value: 60 },
          },
          {
            name: "resolution",
            label: "Resolusi",
            type: "text",
            placeholder: "e.g., '1280x720px'",
            info: "Veo 2 menghasilkan 1280x720px (720p), dengan potensi resolusi 4K.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "model",
            label: "Model",
            type: "text",
            placeholder: "e.g., 'veo-2.0-generate-001'",
            info: 'Tentukan versi model, misalnya, "veo-2.0-generate-001" atau "veo-3.0-generate-preview".',
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "cinematicTerms",
            label: "Istilah Sinematik",
            type: "text",
            placeholder:
              "e.g., 'time-lapse of a blooming flower', 'aerial shot of a coastline'",
            info: "Gunakan istilah teknis perfilman untuk mengarahkan hasil.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "styleModifier",
            label: "Pengubah Gaya",
            type: "text",
            placeholder:
              "e.g., 'in a surreal, dreamlike style', 'as a black and white film noir'",
            info: "Tambahkan frasa untuk menentukan gaya visual secara keseluruhan.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "dialog",
            label: "Dialog",
            type: "textarea",
            placeholder:
              "e.g., 'Narator: Selamat datang di masa depan. Karakter A: Ini luar biasa!'",
            info: "Sertakan dialog yang akan diucapkan dalam video.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              'Contoh: Veo 3 adalah versi terbaru, menawarkan realisme yang ditingkatkan, simulasi fisika, dan kemampuan audio asli. Klip biasanya berdurasi 8 detik, tetapi dapat diperpanjang hingga 60 detik. Filter keamanan diterapkan pada konten yang dihasilkan. Veo memiliki pemahaman yang kuat tentang bahasa sinematik, memungkinkan kontrol yang tepat atas output video. Titik Akses: Veo dapat diakses melalui Gemini API, Vertex AI, dan aplikasi Flow. Paket Google One AI Premium mungkin termasuk akses. Harga: Veo adalah fitur berbayar; periksa halaman harga resmi Google untuk detailnya. Hindari Pencampuran Gaya: Jangan mencampur gaya yang bertentangan (misalnya, kartun dan fotorealistik) dalam satu prompt. Subtitle: Untuk menghindari subtitle yang tidak diinginkan, tambahkan "(tanpa subtitle)" ke prompt atau gunakan metode prompt dialog tertentu. Watermark: Video yang dihasilkan mungkin menyertakan watermark.',
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Platform Desain Berbasis AI": {
      "Canva (Magic Design)": {
        description:
          "Gunakan deskripsi teks untuk menghasilkan template desain yang dapat disesuaikan secara instan di Canva.",
        toolType: "image-editing",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Desainer Grafis AI. AI akan menghasilkan template desain yang dapat disesuaikan secara instan di Canva berdasarkan deskripsi teks, dengan mempertimbangkan jenis desain, ide, gaya, dan konten yang diinginkan.",
        components: [
          {
            name: "designType",
            label: "Jenis Desain",
            type: "select",
            options: [
              "Presentasi",
              "Postingan Instagram",
              "Poster",
              "Logo",
              "Selebaran (Flyer)",
              "Lainnya...",
            ],
            info: "Pilih jenis dokumen atau format desain yang Anda butuhkan.",
          },
          {
            name: "description",
            label: "Deskripsi Desain Anda",
            type: "textarea",
            placeholder:
              "e.g., 'Sebuah postingan Instagram untuk mempromosikan workshop tentang berkebun di perkotaan. Gunakan gaya yang modern dan organik dengan warna hijau dan krem.'",
            info: "Jelaskan secara singkat (5+ kata) tentang ide, gaya, dan konten desain Anda.",
            validation: { min_length: 20 },
          },
          {
            name: "contentToInclude",
            label: "Teks & Konten Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Judul: Urban Gardening 101. Tanggal: 25 Juli. Pembicara: Jane Doe.'",
            info: "Sebutkan teks, judul, atau informasi penting yang harus ada di dalam desain.",
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Utilitas & Penyuntingan AI": {
    },
  },
  "Video & Animasi": {
    "Format Video Spesifik & Niche Konten": {
      "AnimateDiff & Stable Video Diffusion Morphing Director": {
        description: "Prompt animasi transisi halus dan morphing visual tanpa jeda menggunakan Stable Video Diffusion / AnimateDiff.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah AI Animation & Video Diffusion Specialist.",
        components: [
          {
            name: "morphingConcept",
            label: "Konsep Transisi / Morphing Objek",
            type: "text",
            placeholder: "contoh: Bunga teratai mekar perlahan berubah wujud menjadi kupu-kupu kristal bercahaya neon",
            info: "Objek apa yang bertransformasi?",
          },
        ],
      },
      "Higgsfield AI Dynamic Camera Orbit & Kinetic Physics": {
        description: "Prompt kamera kinetik Higgsfield AI dengan rotasi 720 derajat, slow-motion bullet time, dan kedalaman 3D ultra-halus.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Kinetic Video Camera Director.",
        components: [
          {
            name: "kineticAction",
            label: "Aksi Gerak Cepat Subjek",
            type: "text",
            placeholder: "contoh: Penari breakdance berputar di udara dengan percikan air bercahaya di sekitarnya",
            info: "Aksi fisik apa yang disorot kamera?",
          },
        ],
      },
      "Interactive Choose-Your-Own-Adventure Video Script": {
        description: "Skrip video bercabang interaktif (YouTube End Screens / TikTok Stories) dengan 3 pilihan jalan cerita dan multi-ending.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Interactive Narrative & Branching Story Director.",
        components: [
          {
            name: "storyDilemma",
            label: "Dilema Pilihan Karakter Utama",
            type: "text",
            placeholder: "contoh: Seorang detektif terjebak di rumah berhantu: Apakah membuka pintu ruang bawah tanah, lari ke hutan, atau bersembunyi di loteng?",
            info: "Pilihan apa yang harus ditentukan penonton di akhir video?",
          },
        ],
      },
      "Product Unboxing & First Impression Video Review Script": {
        description: "Naskah video unboxing teknologi 5 menit dengan aesthetic ASMR opening, macro B-roll detail, dan penilaian jujur.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Top Tech Reviewer & Video Creator (Gaya MKBHD / Dave2D).",
        components: [
          {
            name: "unboxingGadget",
            label: "Gadget / Produk yang Di-unboxing",
            type: "text",
            placeholder: "contoh: Laptop Gaming Tipis Terbaru dengan Layar OLED 240Hz dan Bodi Aluminium",
            info: "Apa produk yang Anda ulas?",
          },
        ],
      },
      "Real Estate Luxury Property Video Tour Script": {
        description: "Naskah video tur rumah mewah / penthouse arsitektural dengan narasi berkelas dan instruksi pergerakan drone sinematik.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Luxury Real Estate Video Producer (Gaya Architectural Digest).",
        components: [
          {
            name: "propertyHighlights",
            label: "Fitur Kemewahan Properti",
            type: "text",
            placeholder: "contoh: Penthouse 3 Lantai dengan Infinity Pool di Atap, Pemandangan Sunset Laut, dan Dapur Marmer Italia",
            info: "Apa daya tarik utama properti yang dijual?",
          },
        ],
      },
      "High-Retention TikTok Food Recipe & ASMR Cooking Script": {
        description: "Naskah video resep makanan 60 detik dengan suara mendesis menggoda, langkah super kilat, dan plating lezat.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Viral Food Creator & ASMR Culinary Director.",
        components: [
          {
            name: "recipeName",
            label: "Nama Resep Masakan & Bahan Utama",
            type: "text",
            placeholder: "contoh: Ayam Goreng Crispy Saus Bawang Putih Madu Gurih Pedas",
            info: "Makanan apa yang dimasak dalam video?",
          },
        ],
      },
      "Fitness Workout Challenge & Motivation Video Script": {
        description: "Naskah video latihan olahraga 30 hari berenergi tinggi dengan countdown timer audio dan kata-kata pembangkit semangat.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Elite Fitness Coach & Motivational Creator.",
        components: [
          {
            name: "workoutFocus",
            label: "Fokus Latihan & Target Tubuh",
            type: "text",
            placeholder: "contoh: Latihan 10 Menit Membakar Lemak Perut di Rumah Tanpa Alat",
            info: "Apa target latihan video kebugaran ini?",
          },
        ],
      },
      "Travel Vlog Cinematic Montage & City Guide Script": {
        description: "Naskah vlog jalan-jalan sinematik dengan visual montage estetik, rekomendasi hidden gems, dan tips kuliner lokal.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Travel Filmmaker & Cultural Explorer.",
        components: [
          {
            name: "destinationCity",
            label: "Kota / Destinasi Wisata",
            type: "text",
            placeholder: "contoh: 48 Jam Menjelajahi Sudut Tersembunyi Kota Yogyakarta dan Kuliner Legendaris",
            info: "Di mana lokasi petualangan jalan-jalan Anda?",
          },
        ],
      },
      "Corporate Case Study & Client Success Video Script": {
        description: "Naskah video testimonial klien 3 menit (Tantangan Awal -> Implementasi Solusi -> Hasil Angka Nyata -> Rekomendasi).",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah B2B Customer Success Story Producer.",
        components: [
          {
            name: "clientResults",
            label: "Profil Klien & Hasil Keberhasilan",
            type: "text",
            placeholder: "contoh: Perusahaan Logistik yang Berhasil Memangkas Biaya Bahan Bakar 25% Berkat Software Manajemen Armada Kami",
            info: "Siapa klien dan angka keberhasilan apa yang dicapai?",
          },
        ],
      },
      "YouTube Shorts Trivia & Psychology Facts Fast Script": {
        description: "Naskah video Shorts trivia psikologi 30 detik dengan fakta mengejutkan dan teknik looping mulus yang membuat penonton memutar ulang.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Viral Shorts Scriptwriter & Behavioral Psychology Specialist.",
        components: [
          {
            name: "psychologyFact",
            label: "Fakta Psikologi / Trivia Menarik",
            type: "text",
            placeholder: "contoh: Trik Psikologi Sederhana untuk Mengetahui Apakah Seseorang Sedang Berbohong Melalui Gerakan Matanya",
            info: "Fakta unik apa yang ingin Anda bagikan?",
          },
        ],
      },
      "3D Product Exploded Assembly Video Director": {
        description: "Storyboard video 3D animasi perakitan produk industri / jam tangan mewah dengan rotasi makro 360 derajat.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah 3D Product Animation Director.",
        components: [
          {
            name: "engineeredProduct",
            label: "Produk Rekayasa & Komponen Kunci",
            type: "text",
            placeholder: "contoh: Mesin Jam Tangan Mekanik Otomatis dengan 120 Komponen Roda Gigi Emas",
            info: "Produk apa yang dibongkar-pasang dalam animasi 3D?",
          },
        ],
      },
      "Music Video Visual Concept & Lip-Sync Storyboard": {
        description: "Konsep visual video klip musik artis dengan adegan performance, visual metaphor, dan colour grading palette.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Music Video Director Pemenang MTV Award.",
        components: [
          {
            name: "musicVideoTheme",
            label: "Judul Lagu & Konsep Emosi",
            type: "text",
            placeholder: "contoh: Lagu Pop Ballad Melankolis tentang Melepaskan Kenangan Masa Lalu",
            info: "Apa lagu dan konsep visual yang ingin diceritakan?",
          },
        ],
      },
      "Historical Documentary Battle Map & Breakdown Script": {
        description: "Naskah video sejarah perang / peristiwa besar dengan petunjuk peta animasi strategi pergerakan pasukan.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Military History Analyst & Documentary Producer (Gaya Kings and Generals).",
        components: [
          {
            name: "historicalBattle",
            label: "Peristiwa Sejarah / Pertempuran",
            type: "text",
            placeholder: "contoh: Strategi Taktis Pertempuran Cannae: Bagaimana Hannibal Mengelilingi Pasukan Romawi",
            info: "Peristiwa sejarah apa yang dianalisis?",
          },
        ],
      },
      "Non-Profit & Humanitarian Campaign Video Script": {
        description: "Naskah video kampanye kemanusiaan emosional yang menyentuh hati nurani donatur dan mendorong donasi darurat.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Humanitarian Fundraising Storyteller.",
        components: [
          {
            name: "humanitarianCause",
            label: "Tujuan Bantuan Sosial / Donasi",
            type: "text",
            placeholder: "contoh: Penyediaan Air Bersih dan Fasilitas Medis untuk Anak-anak di Wilayah Kekeringan",
            info: "Aksi kemanusiaan apa yang membutuhkan dukungan donatur?",
          },
        ],
      },
    },
    "Format Video Penjualan & Promosi Kreatif": {
      "Kling AI v1.5 Hyper-Realistic Human Action & Physics": {
        description: "Prompt video adegan aksi bela diri dinamis, interaksi pakaian realistis, dan ekspresi emosional manusia di Kling AI v1.5.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Kling AI Action Director. Susun prompt gerakan dinamis dengan deskripsi anatomi presisi tanpa artefak morphing.",
        components: [
          {
            name: "actionScene",
            label: "Aksi Gerakan & Subjek",
            type: "text",
            placeholder: "contoh: Pendekar wanita melompat anggun menghindari serangan pedang dengan jubah sutra berkibar dramatis",
            info: "Gerakan dinamis apa yang dilakukan subjek?",
          },
        ],
      },
      "Luma Dream Machine 3D VFX Particle & Energy Flow": {
        description: "Efek visual partikel energi magis, portal dimensi, ledakan kosmik, dan simulasi fluida dinamis di Luma Dream Machine.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah 3D VFX Master. Rancang prompt efek visual partikel volumetrik dengan pencahayaan glowing yang megah.",
        components: [
          {
            name: "vfxConcept",
            label: "Konsep Efek Visual (VFX)",
            type: "text",
            placeholder: "contoh: Portal dimensi bercahaya keemasan terbuka di tengah badai salju dan memancarkan gelombang energi",
            info: "Efek visual apa yang ingin disimulasikan?",
          },
        ],
      },
      "Video Sales Letter (VSL) 15-Minute High-Converting Script": {
        description: "Naskah Video Sales Letter (VSL) 15 menit gaya Dan Kennedy untuk penjualan produk bernilai tinggi dengan struktur psikologis mendalam.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah $50M VSL Copywriter. Rancang naskah VSL bertahap: The Big Hook -> Origin Story -> The Villain -> The Epiphany -> The Offer -> Urgency Closing.",
        components: [
          {
            name: "vslProduct",
            label: "Produk & Nilai Solusi",
            type: "text",
            placeholder: "contoh: Program Mentoring Bisnis Ekspor 6 Bulan untuk UMKM",
            info: "Apa penawaran utama dalam VSL?",
          },
        ],
      },
      "TikTok Shop / Live Streaming Selling Script": {
        description: "Naskah host live shopping TikTok / Shopee 2 jam dengan ritme flash deal, interaksi penonton, dan urgency selling yang memicu checkout instan.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Top Live Shopping Producer di Asia. Rancang alur host live per 15 menit dengan kata-kata pemicu FOMO dan instruksi co-host.",
        components: [
          {
            name: "featuredProducts",
            label: "Produk Unggulan Live & Promo Diskon",
            type: "text",
            placeholder: "contoh: Paket Skincare Glowing 5-in-1 Diskon 50% khusus 50 pembeli pertama via keranjang kuning",
            info: "Apa produk utama dan penawaran flash sale live?",
          },
        ],
      },
      "Motion Graphics 2D Explainer Video Script": {
        description: "Skrip animasi 2D 90 detik dengan visual cue transisi ikon, tipografi kinetik, dan narasi voiceover terpadu untuk produk SaaS.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Motion Graphics Creative Director. Rancang naskah 2 kolom (Visual Scene & Audio Narasi) yang sinkron sempurna.",
        components: [
          {
            name: "saasSolution",
            label: "Solusi Software / Layanan yang Dijelaskan",
            type: "text",
            placeholder: "contoh: Aplikasi Invoice Otomatis yang Menghemat 10 Jam Kerja Seminggu",
            info: "Apa software yang dijelaskan dalam video explainer?",
          },
        ],
      },
      "Movie Trailer Cinematic Voiceover & Sound Breakdown": {
        description: "Format naskah trailer film 2 menit (Teaser -> Rising Tension -> Climax Montage -> Inception Horn Drop -> Title Reveal).",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Hollywood Trailer Editor & Sound Designer. Susun naskah trailer dengan instruksi audio beat drops dan cut to black yang dramatis.",
        components: [
          {
            name: "moviePremise",
            label: "Premis Cerita Film",
            type: "text",
            placeholder: "contoh: Ekspedisi luar angkasa menemukan sinyal misterius dari bawah es samudra bulan Jupiter",
            info: "Cerita apa yang diangkat dalam film?",
          },
        ],
      },
      "Educational Animated Whiteboard Explainer Script": {
        description: "Naskah video animasi tangan menggambar (Doodly/VideoScribe) untuk materi edukasi sains, sejarah, atau keuangan dengan analogi visual sederhana.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Educational Whiteboard Scriptwriter. Buat alur cerita yang mudah dipahami dengan analogi visual ilustrasi tangan.",
        components: [
          {
            name: "educationalConcept",
            label: "Konsep Materi Edukasi",
            type: "text",
            placeholder: "contoh: Bagaimana Inflasi Bekerja dan Cara Melindungi Nilai Tabungan Anda",
            info: "Materi pelajaran apa yang ingin dijelaskan?",
          },
        ],
      },
      "AI Avatar Presenter Script (HeyGen / D-ID Style)": {
        description: "Naskah presenter AI realistis dengan micro-gestures, nada bicara santai ramah, dan callouts visual layar untuk video training perusahaan.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah AI Video Presenter Specialist. Tulis naskah yang terdengar alami saat diucapkan oleh avatar AI tanpa terkesan kaku seperti robot.",
        components: [
          {
            name: "trainingTopic",
            label: "Topik Training / Onboarding",
            type: "text",
            placeholder: "contoh: Panduan Onboarding Karyawan Baru: Kebijakan Keamanan Data Perusahaan",
            info: "Materi apa yang disampaikan oleh presenter AI?",
          },
        ],
      },
    },
    "Teknik Video & Automasi Konten": {
      "Faceless YouTube Automation Cash Cow Video Script": {
        description: "Naskah video YouTube tanpa wajah (Faceless / Cash Cow) berorientasi retensi tinggi untuk niche teknologi, misteri, sains, atau keuangan dengan monetisasi maksimal.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah YouTube Automation Strategist pengelola channel bernilai miliaran rupiah. Rancang naskah yang mengikat penonton dari detik 1 hingga akhir menggunakan cliffhanger alami.",
        components: [
          {
            name: "nicheTopic",
            label: "Topik Video & Niche",
            type: "text",
            placeholder: "contoh: 10 Fakta Mengejutkan Tentang Bawah Laut Palung Mariana yang Jarang Diketahui",
            info: "Topik video faceless yang dibahas",
          },
          {
            name: "targetAudience",
            label: "Target Audiens & Demografi",
            type: "select",
            options: ["Audiens Umum Penikmat Fakta Unik & Misteri", "Penggemar Teknologi & Gadget Masa Depan", "Pencari Edukasi Finansial & Bisnis", "Lainnya..."],
            info: "Target penonton channel Anda",
          },
        ],
      },
      "Midjourney to Runway Gen-3 Continuous Storyboard": {
        description: "Rancang storyboard 6 adegan visual konsisten yang memandu transisi dari gambar Midjourney ke gerakan dinamis di Runway Gen-3 / Kling AI.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah AI Filmmaker & Visual Continuity Supervisor. Buat urutan prompt gambar dan prompt video pendamping yang mempertahankan konsistensi karakter dan lingkungan.",
        components: [
          {
            name: "storyConcept",
            label: "Konsep Cerita & Karakter Utama",
            type: "text",
            placeholder: "contoh: Perjalanan detektif cybernetic mencari jejak memori yang hilang di kota mega Neo-Tokyo",
            info: "Kisah singkat 6 adegan yang ingin dibuatkan storyboard",
          },
        ],
      },
    },
    "Produksi Video Sinematik & Edukasi": {
      "YouTube Documentary & Video Essay Master Script": {
        description: "Naskah video esai / dokumenter mendalam 10-15 menit gaya Vox / Johnny Harris dengan visual cues, arsip rekaman B-roll, dan narasi bertingkat.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Head of Documentary Storytelling & Video Essayist. Rancang naskah berdurasi panjang dengan bab babak (Acts), data pendukung, dan visual transition cues yang memukau.",
        components: [
          {
            name: "documentaryTopic",
            label: "Topik Dokumenter / Pertanyaan Inti",
            type: "text",
            placeholder: "contoh: Mengapa Industri Semikonduktor Global Bergantung pada Satu Pabrik di Taiwan?",
            info: "Apa misteri, fenomena, atau topik besar yang dibahas?",
          },
          {
            name: "narrativeTone",
            label: "Gaya Narasi & Visual",
            type: "select",
            options: ["Gaya Vox / Polymatter (Analisis data tajam, visual motion graphic dinamis)", "Gaya Johnny Harris (Jurnalisme investigatif personal, peta interaktif, pacing cepat)", "Gaya Veritasium / Kurzgesagt (Sains filosofis, metafora visual, alur eksperimen)", "Gaya Dokumenter Sinematik Netflix (Mendalam, dramatis, wawancara reflektif)", "Lainnya..."],
            info: "Pilih tone narator dan karakter visual video",
          },
          {
            name: "targetDuration",
            label: "Target Durasi Video",
            type: "select",
            options: ["8 - 10 Menit (Efisien, padat data)", "12 - 15 Menit (Standar Video Essay Mendalam)", "20+ Menit (Mini Dokumenter Lengkap)", "Lainnya..."],
            info: "Perkiraan panjang durasi tayang",
          },
        ],
      },
      "Product 3D CGI Commercial Promo Video Script": {
        description: "Skrip video iklan komersial 3D CGI produk teknologi/fashion dengan shot per shot sinematik, sudut makro, dan transisi beat musik.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Commercial Film Director & 3D Motion Supervisor. Tulis naskah storyboard 30-60 detik dengan petunjuk kamera macro zoom, lighting explosion, dan dynamic audio cues.",
        components: [
          {
            name: "productItem",
            label: "Nama Produk & Keunggulan Fisik",
            type: "text",
            placeholder: "contoh: Smartwatch Titanium Tahan Air 100m dengan Layar Safir Melengkung",
            info: "Produk apa yang dipromosikan dan bagian mana yang paling menonjol?",
          },
          {
            name: "visualTheme",
            label: "Tema Visual 3D CGI",
            type: "select",
            options: ["Dark Apple Keynote Style (Bodi titanium melayang di kegelapan dengan cahaya laser tajam)", "Nature Meets Tech (Produk muncul dari percikan air terjun dan batu alam kristal)", "Exploded View Assembly (Komponen internal terurai melayang dan merakit kembali)", "Cyberpunk High-Speed Chase (Produk meluncur melintasi kota neon futuristik)", "Lainnya..."],
            info: "Nuansa estetika visual 3D iklan",
          },
        ],
      },
    },
    "Short-form & Social Video Scripting": {
      "TikTok / Reels 3-Second Viral Hook & Visual Direction": {
        description: "Rancang skrip video pendek 30-60 detik vertikal (9:16) dengan hook visual 3 detik pertama pemikat scroll, teks overlay layar, ritme cepat, dan audio CTA.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Short-Form Video Growth Strategist dengan ratusan juta views di TikTok & Reels. Rancang skrip beritme cepat dengan visual cue yang menahan retensi penonton di atas 85%.",
        components: [
          {
            name: "nicheTopic",
            label: "Topik Video & Masalah yang Diangkat",
            type: "text",
            placeholder: "contoh: Cara dapat kerja remote luar negeri gaji dollar tanpa pengalaman teknis",
            info: "Topik spesifik apa yang ingin disampaikan?",
          },
          {
            name: "hookStyle",
            label: "Tipe Hook 3 Detik Pertama",
            type: "select",
            options: ["Pernyataan Kontroversial / Menentang Arus ('Berhenti lakukan X kalau mau Y')", "Demonstrasi Visual Ekstrem / Sebelum vs Sesudah", "Pertanyaan Menusuk Rasa Sakit ('Pernah gak ngerasa gaji numpang lewat?')", "Rahasia / Informasi Tersembunyi ('Website rahasia yang gak mau bos kamu tahu')", "Studi Kasus Angka Nyata ('Gimana saya ubah 0 jadi 50 juta dalam 30 hari')", "Lainnya..."],
            info: "Gaya kalimat dan visual pembuka untuk menghentikan scrolling",
          },
          {
            name: "pacingStructure",
            label: "Struktur Pacing Konten",
            type: "select",
            options: ["3 Detik Hook -> 15 Detik Masalah -> 20 Detik 3 Langkah Solusi -> 5 Detik CTA", "Storytelling Cepat 45 Detik (Plot twist emosional di detik 30)", "Komparasi 30 Detik (Cara Biasa vs Cara Cerdas)", "Tutorial 'Tonton Sampai Akhir' dengan template gratis", "Lainnya..."],
            info: "Alur pembagian durasi video",
          },
          {
            name: "callToAction",
            label: "Panggilan Aksi (CTA) Akhir",
            type: "text",
            placeholder: "contoh: Komen 'MAU' nanti saya kirim link panduan lengkapnya ke DM!",
            info: "Aksi apa yang Anda minta dari penonton di akhir video?",
          },
        ],
      },
    },
    "Generator Video AI Sinematik (Sora, Kling, Runway, Luma)": {
      "Sora & Kling Cinematic Scene Director": {
        description: "Rancang formula prompt adegan video sinematik dengan kendali gerakan kamera (pan, tilt, zoom, FPV drone), pencahayaan volumetrik, dan simulasi fisika realistis.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Sinematografer & Video AI Prompt Director pemenang penghargaan. Formulasikan deskripsi visual dinamis, pergerakan kamera sinematik, dan kontinuitas adegan 8K.",
        components: [
          {
            name: "sceneSubject",
            label: "Subjek Utama & Aksi Adegan",
            type: "text",
            placeholder: "contoh: Seorang astronot wanita berjalan menembus badai pasir bercahaya neon di planet asing",
            info: "Siapa atau apa yang menjadi fokus visual dan apa aksinya?",
          },
          {
            name: "cameraMovement",
            label: "Pergerakan & Sudut Kamera",
            type: "select",
            options: ["FPV Drone fast dive to eye-level smooth tracking shot", "Slow cinematic 360-degree orbit with shallow depth of field", "Dolly zoom (Vertigo effect) with dramatic background compression", "Low-angle heroic tracking shot following the subject's footsteps", "Extreme close-up macro shot transitioning to wide cinematic landscape", "Static tripod shot with dynamic high-speed motion blur in background", "Lainnya..."],
            info: "Pilih pergerakan lensa dan sudut pandang kamera",
          },
          {
            name: "cinematicLighting",
            label: "Pencahayaan & Atmosfer Visual",
            type: "select",
            options: ["Golden hour sunburst with volumetric god rays and dust motes", "Cyberpunk dark ambient with reflective wet asphalt and neon rim lighting", "Moody overcast misty morning with soft diffused natural light", "High-contrast dramatic chiaroscuro studio lighting with blue and amber gel", "Ethereal bioluminescent glow in deep oceanic darkness", "Lainnya..."],
            info: "Nuansa cahaya, suhu warna, dan efek partikel udara",
          },
          {
            name: "renderQuality",
            label: "Format & Standar Render",
            type: "select",
            options: ["8K UHD, photorealistic film grain, 35mm Arri Alexa camera, 24fps cinema standard", "IMAX 70mm anamorphic lens, hyper-detailed textures, zero motion artifacts", "3D Pixar CGI animation style, fluid character physics, vibrant colors", "Vintage 16mm retro film, warm chromatic aberration, nostalgic tone", "Lainnya..."],
            info: "Kualitas visual, lensa, dan frame rate",
          },
        ],
      },
      "Runway Gen-3 Alpha Camera Motion Director": {
        description: "Optimalkan prompt gerakan dinamis khusus Runway Gen-3 Alpha dengan kontrol keyword arah kamera, kecepatan, transisi, dan temporal coherence.",
        toolType: "video",
        ai_logic_description: "Persona AI: Anda adalah Runway Gen-3 Prompt Specialist. Rancang prompt presisi dengan sintaks temporal dan deskripsi gerak mulus tanpa distorsi.",
        components: [
          {
            name: "baseVisual",
            label: "Visual Dasar & Latar",
            type: "text",
            placeholder: "contoh: Mobil sport klasik merah melaju di jalan pesisir tebing pantai Amalfi saat matahari terbenam",
            info: "Deskripsikan subjek dan lingkungan adegan",
          },
          {
            name: "cameraSpeed",
            label: "Gaya & Kecepatan Kamera",
            type: "select",
            options: ["Fast hyperlapse tracking parallel to the subject", "Ultra slow-motion (120fps) capturing fluid splashes and reflections", "Dynamic continuous pull-back revealing vast panoramic horizon", "First-person perspective (POV) moving through the environment", "Lainnya..."],
            info: "Kecepatan dan jenis pergerakan frame",
          },
          {
            name: "negativeVideo",
            label: "Hal yang Dihindari (Negative Prompt)",
            type: "text",
            placeholder: "contoh: blurry, morphing limbs, camera jitter, low resolution, warped text, stuttering",
            info: "Cegah artefak video dan distorsi bentuk",
          },
        ],
      },
    },
    "Generator Video AI (Runway/Sora/Pika)": {
      "V-P-M-A (Master Prompt Video AI)": {
        description: "Formula prompt optimal untuk generator video AI seperti Runway Gen-3, Pika Labs, Kling AI, Luma Dream Machine, dan Sora.",
        toolType: "video",
        ai_logic_description: "Anda adalah seorang Sutradara Sinematografi AI yang menyusun instruksi pergerakan kamera, aksi subjek, atmosfer, dan tempo video secara dinamis.",
        components: [
          {
            name: "subjectAction",
            label: "Subjek & Aksi Gerakan (Subject Action)",
            type: "textarea",
            placeholder: "e.g., 'Kereta uap antik melaju kencang menembus pegunungan salju, kepulan asap putih tebal keluar dari cerobong'",
            info: "Deskripsikan gerakan fisik dan dinamika aksi subjek."
          },
          {
            name: "cameraMotion",
            label: "Pergerakan Kamera (Camera Motion)",
            type: "select",
            options: ["Low-angle tracking shot moving alongside", "Drone FPV dive and fly-through", "Slow cinematic dolly zoom", "360 Orbital camera pan", "Static tripod with subtle zoom in", "Lainnya..."],
            info: "Jenis dan arah pergerakan kamera."
          },
          {
            name: "atmosphere",
            label: "Pencahayaan & Atmosfer Visual",
            type: "textarea",
            placeholder: "e.g., 'Golden hour sunset casting long shadows across pristine snow, swirling blizzard particles in the air'",
            info: "Pencahayaan dinamis, perubahan cuaca, dan partikel visual."
          },
          {
            name: "pacing",
            label: "Tempo & Kualitas Visual (Pacing/Quality)",
            type: "select",
            options: ["Cinematic slow motion (60fps), 4k resolution, seamless flow", "High-speed action motion blur, photorealistic", "Real-time cinematic 24fps film grain", "Lainnya..."],
            info: "Kecepatan gerakan, frame rate, dan kualitas render."
          }
        ]
      }
    },
  },
  "Audio & Musik": {
    "Nuansa Audio Internasional, Ibadah & Komposisi Solo": {
      "Suno AI City Pop & Funk Groovy Bassline Producer": {
        description: "Lagu City Pop Jepang 80s / Funk modern di Suno v4 dengan slap bass groovy, saxophone solo, dan melodi manis nostalgia.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Japanese City Pop & Funk Producer (Gaya Tatsuro Yamashita / Mariya Takeuchi).",
        components: [
          {
            name: "cityPopTheme",
            label: "Tema Lagu & Suasana Malam Kota",
            type: "text",
            placeholder: "contoh: Berkendara di jalan tol layang Tokyo saat tengah malam di bawah kilauan lampu kota neon",
            info: "Cerita apa yang diangkat dalam lagu City Pop ini?",
          },
        ],
      },
      "Udio v1.5 Dark Cyberpunk Industrial Synthwave": {
        description: "Musik elektronik industrial gelap di Udio (Aggressive distorted bassline, metallic percussion, cybernetic pulse).",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Dark Synthwave / Cyberpunk Composer (Gaya Carpenter Brut / Cyberpunk 2077 OST).",
        components: [
          {
            name: "cyberpunkMood",
            label: "Suasana Kota Masa Depan",
            type: "text",
            placeholder: "contoh: Pengejaran motor berkecepatan tinggi di gang-gang sempit kota dystopia bawah tanah",
            info: "Nuansa adegan apa yang diiringi musik ini?",
          },
        ],
      },
      "Meditation Sleep & Binaural Delta Wave Soundscape": {
        description: "Musik relaksasi tidur gelombang delta binaural (0.5-4Hz) dengan suara hujan malam dan mangkuk bernyanyi Tibet.",
        toolType: "audio-generation",
        ai_logic_description: "Persona AI: Anda adalah Psychoacoustic Sleep Sound Engineer.",
        components: [
          {
            name: "sleepAtmosphere",
            label: "Karakter Suara Alam & Frekuensi",
            type: "text",
            placeholder: "contoh: Suara rintik hujan lembut di atap tenda dengan drone frekuensi 432Hz yang menidurkan pikiran aktif",
            info: "Suara alam apa yang menjadi dasar relaksasi?",
          },
        ],
      },
      "Epic Viking Folk & Nordic Shamanic War Chants": {
        description: "Lagu folk Viking kuno bernuansa mistis (Tagelharpa, war drums, low throat singing, bone flutes, Nordic choir).",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Nordic Folk & Shamanic Composer (Gaya Wardruna / Heilung).",
        components: [
          {
            name: "vikingChantTheme",
            label: "Ritual / Peperangan Bangsa Nordik",
            type: "text",
            placeholder: "contoh: Nyanyian penyemangat para ksatria sebelum mengarungi samudra berkabut menuju tanah baru",
            info: "Kisah ritual apa yang dinyanyikan?",
          },
        ],
      },
      "Anime Orchestral Battle Theme (Sawano Style)": {
        description: "Musik pertempuran anime epik dengan vokal wanita megah, piano dramatis, dan drop brass eksplosif gaya Hiroyuki Sawano.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Anime Soundtrack Master Composer (Attack on Titan / Gundam UC Style).",
        components: [
          {
            name: "animeClimaxScene",
            label: "Adegan Klimaks Pertempuran Anime",
            type: "text",
            placeholder: "contoh: Sang pahlawan bangkit kembali dengan kekuatan baru untuk melindungi teman-temannya saat harapan hampir sirna",
            info: "Adegan emosional apa yang diiringi musik ini?",
          },
        ],
      },
      "Latin Reggaeton & Afrobeat Global Summer Anthem": {
        description: "Irama tropis berenergi tinggi dengan dembow beat 95 BPM, gitar nilon Spanyol, dan melodi dancehall musim panas.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Global Latin & Afrobeat Hitmaker (Gaya Bad Bunny / Burna Boy).",
        components: [
          {
            name: "summerPartyTheme",
            label: "Tema Pesta Pantai & Tarian Tropis",
            type: "text",
            placeholder: "contoh: Pesta dansa pantai saat matahari terbenam dengan minuman kelapa dingin dan suasana riang",
            info: "Nuansa pesta apa yang ingin dihadirkan?",
          },
        ],
      },
      "Deep House & Melodic Techno Club Track Generator": {
        description: "Track club melodic techno (124 BPM, rolling baseline, ethereal vocal chop, hypnotic synth arp) untuk set DJ profesional.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Melodic Techno & Deep House Producer (Gaya Afterlife / Anjunadeep).",
        components: [
          {
            name: "clubMood",
            label: "Karakter Beat & Atmosfer Klub",
            type: "text",
            placeholder: "contoh: Perjalanan musik melodi hipnotis di festival musik luar ruangan saat pergantian malam ke fajar",
            info: "Suasana club apa yang ingin diciptakan?",
          },
        ],
      },
      "Acoustic Fingerstyle Guitar Solo Composition": {
        description: "Komposisi solo gitar fingerstyle akustik santai (Open tuning DADGAD, percussive slap, warm woody tone) yang menenangkan.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Fingerstyle Acoustic Guitar Virtuoso (Gaya Sungha Jung / Tommy Emmanuel).",
        components: [
          {
            name: "guitarSongMood",
            label: "Nuansa Melodi Gitar",
            type: "text",
            placeholder: "contoh: Melodi hangat dan damai yang menggambarkan indahnya kenangan masa kecil di desa",
            info: "Emosi apa yang diceritakan petikan dawai gitar?",
          },
        ],
      },
      "Podcast Outro & Next Episode Hook Audio Script": {
        description: "Naskah penutup episode podcast dengan audio cue call-to-action (Subscribe, review bintang 5, teaser misterius episode depan).",
        toolType: "audio-generation",
        ai_logic_description: "Persona AI: Anda adalah Professional Podcast Producer.",
        components: [
          {
            name: "nextEpisodeTeaser",
            label: "Teaser Topik Episode Berikutnya",
            type: "text",
            placeholder: "contoh: Minggu depan kita akan membongkar rahasia bagaimana AI menggantikan 50% pekerjaan marketing tradisional bersama bintang tamu misterius",
            info: "Informasi apa yang memancing pendengar untuk kembali di episode berikutnya?",
          },
        ],
      },
      "Interactive Voice Response (IVR) & Phone Menu Script": {
        description: "Naskah sistem IVR layanan telepon pelanggan bank / telekomunikasi yang ramah, ringkas, dan langsung membantu tanpa membuat frustrasi.",
        toolType: "audio-generation",
        ai_logic_description: "Persona AI: Anda adalah Call Center Experience & Telephony Script Architect.",
        components: [
          {
            name: "companyServiceMenu",
            label: "Nama Perusahaan & 4 Menu Layanan Utama",
            type: "text",
            placeholder: "contoh: Bank Digital Mandiri Cerdas: Tekan 1 Info Rekening, Tekan 2 Pemblokiran Kartu, Tekan 3 Promo & Cashback, Tekan 0 Bicara dengan Customer Service",
            info: "Apa saja pilihan menu yang disediakan?",
          },
        ],
      },
      "Epic Movie Trailer Sound Design Kit (Braams & Risers)": {
        description: "Generator prompt FX trailer bioskop (Inception braams, metallic whoosh-hits, tension risers, cinematic sub-drop impact).",
        toolType: "audio-generation",
        ai_logic_description: "Persona AI: Anda adalah Hollywood Trailer Sound Designer.",
        components: [
          {
            name: "soundEffectLayer",
            label: "Jenis Efek Suara Trailer",
            type: "text",
            placeholder: "contoh: Ledakan suara bass berat 'Braam' bergema di dalam gua raksasa yang menandakan kedatangan monster",
            info: "Efek suara sinematik apa yang dibutuhkan?",
          },
        ],
      },
      "Chill Hop Coffee Shop Background Jazz Trio": {
        description: "Musik jazz trio santai (Double bass, jazz brushes on snare, upright piano) yang menghidupkan suasana kafe santai.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Jazz Coffeehouse Producer.",
        components: [
          {
            name: "jazzCafeVibe",
            label: "Suasana Kafe & Irama Jazz",
            type: "text",
            placeholder: "contoh: Sore hari yang hangat di kafe vintage dengan aroma kopi segar dan obrolan santai para pengunjung",
            info: "Nuansa kafe apa yang diiringi musik ini?",
          },
        ],
      },
      "Fantasy RPG Town & Tavern Acoustic Music": {
        description: "Musik kota dan kedai minuman game fantasi (Lute, accordion, festive tambourine, cheerful fireplace atmosphere).",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Fantasy RPG Composer (Gaya The Witcher / Skyrim).",
        components: [
          {
            name: "tavernSetting",
            label: "Nama Kedai & Suasana Petualang",
            type: "text",
            placeholder: "contoh: Kedai minum 'The Dancing Dragon' yang ramai oleh para petualang merayakan kemenangan misi dengan gelas kayu",
            info: "Suasana kedai fantasi seperti apa yang diinginkan?",
          },
        ],
      },
      "Motivation & High-Energy Workout EDM Anthem": {
        description: "Musik EDM festival bersemangat tinggi (130 BPM, massive euphoric build-up, punchy kick) untuk memompa adrenalin saat berolahraga.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah High-Energy Fitness EDM Producer.",
        components: [
          {
            name: "workoutAnthemMood",
            label: "Fokus Olahraga & Tingkat Energi",
            type: "text",
            placeholder: "contoh: Sesi angkat beban berat dan lari sprint interval yang membutuhkan dorongan semangat tanpa henti",
            info: "Untuk jenis olahraga apa musik berenergi ini?",
          },
        ],
      },
    },
    "Produksi Genre Musik Spesifik & Podcast Wawancara": {
      "Suno AI Hip Hop / Trap Beat & 16-Bar Verse Flow Producer": {
        description: "Prompt Suno v4 untuk genre Hip Hop/Trap modern lengkap dengan bass 808 menggelegar, hi-hat rolls cepat, rima 16-bar verse, dan ad-libs.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Grammy-winning Trap Music Producer & Beatmaker. Rancang prompt lengkap dengan struktur beat 808 dan lirik punchline berbobot.",
        components: [
          {
            name: "hiphopTheme",
            label: "Tema Lagu & Pesan Rima",
            type: "text",
            placeholder: "contoh: Perjuangan merintis karir dari bawah (Hustle & Ambition) di tengah gemerlap kota metropolitan",
            info: "Apa pesan utama lirik rap Anda?",
          },
        ],
      },
      "Udio v1.5 Epic Orchestral Trailer & Hybrid Film Score": {
        description: "Musik orkestra megah hybrid di Udio (Taiko drums, brass swell, string staccato, choir) untuk trailer film aksi dan game petualangan.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Hollywood Epic Film Composer (Gaya Two Steps from Hell / Hans Zimmer).",
        components: [
          {
            name: "epicMood",
            label: "Nuansa Pertempuran / Petualangan",
            type: "text",
            placeholder: "contoh: Pertempuran epik mempertahankan benteng terakhir dari serbuan naga api raksasa",
            info: "Visual adegan film apa yang diiringi musik ini?",
          },
        ],
      },
      "Children's Nursery Rhyme & Educational Song Composer": {
        description: "Komposisi lagu anak-anak ceria dan edukatif dengan lirik berima sederhana, melodi riang, dan instrumentasi ukulele/piano yang mudah dinyanyikan.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Children's Music Composer & Educator (Gaya Cocomelon / Pinkfong).",
        components: [
          {
            name: "childrenTopic",
            label: "Topik Lagu Edukasi Anak",
            type: "text",
            placeholder: "contoh: Belajar Mengenal Nama Buah-buahan dan Manfaat Sehatnya",
            info: "Pelajaran apa yang ingin diajarkan lewat lagu ini?",
          },
        ],
      },
      "K-Pop / J-Pop High-Energy Dance Track Producer": {
        description: "Lagu K-Pop/J-Pop modern berenergi tinggi dengan hook vokal adiktif, rap bridge, explosive dance drop, dan lirik dwibahasa.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Top K-Pop Producer di Seoul (SM/HYBE Style). Susun struktur lagu K-Pop modern dengan adlibs dinamis.",
        components: [
          {
            name: "kpopConcept",
            label: "Konsep Girlgroup / Boygroup & Nuansa Lagu",
            type: "text",
            placeholder: "contoh: Girl Crush Futuristic Anthem dengan beat electro-pop dan bass punchy",
            info: "Apa persona dan konsep grup musiknya?",
          },
        ],
      },
      "Podcast Interview Host Guide & 10 Deep Question Matrix": {
        description: "Panduan host podcast wawancara tokoh inspiratif (Icebreaker, pertanyaan mendalam, follow-up cerdas, dan closing berkesan).",
        toolType: "audio-generation",
        ai_logic_description: "Persona AI: Anda adalah Master Podcast Host (Gaya Tim Ferriss / Lex Fridman). Susun matriks 10 pertanyaan yang memancing jawaban jujur dan wawasan mendalam.",
        components: [
          {
            name: "guestProfile",
            label: "Profil Tamu & Topik Keahlian",
            type: "text",
            placeholder: "contoh: Founder Startup Teknologi yang Berhasil Membangun Perusahaan Bernilai $50M Tanpa Investor",
            info: "Siapa tamu podcast Anda dan apa latar belakangnya?",
          },
        ],
      },
      "Audiobook Narration Master Script with Character Voices": {
        description: "Naskah buku audio dengan panduan pembeda vokal tiap karakter, intonasi deskriptif, dan ritme jeda napas yang memanjakan telinga pendengar.",
        toolType: "audio-generation",
        ai_logic_description: "Persona AI: Anda adalah Audiobook Producer & Voice Director peraih Audie Award.",
        components: [
          {
            name: "bookChapterText",
            label: "Teks Bab Buku yang Dinarasikan",
            type: "textarea",
            placeholder: "contoh: Tempelkan kutipan bab novel atau buku non-fiksi di sini...",
            info: "Teks yang akan dibacakan narator",
          },
        ],
      },
      "Cinematic Video Game Boss Battle Audio Track Generator": {
        description: "Musik pertempuran boss video game (Dynamic phasing, tempo cepat 145 BPM, dark gothic choir, dan distorsi gitar metal).",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Video Game Music Composer (Gaya Mick Gordon DOOM / Dark Souls).",
        components: [
          {
            name: "bossCharacter",
            label: "Karakter Boss & Fase Pertarungan",
            type: "text",
            placeholder: "contoh: Raja Iblis Kuno yang bangkit dari lahar berapi dengan sayap kegelapan",
            info: "Siapa musuh boss dalam game tersebut?",
          },
        ],
      },
      "Ambient Cafe & Rain Soundscape for Deep Focus": {
        description: "Prompt audio ambient suasana kafe hujan (Rain on glass, gentle acoustic guitar, distant espresso machine) untuk konsentrasi kerja mendalam.",
        toolType: "audio-generation",
        ai_logic_description: "Persona AI: Anda adalah Acoustic Soundscape Engineer.",
        components: [
          {
            name: "ambientSetting",
            label: "Deskripsi Suasana Kafe",
            type: "text",
            placeholder: "contoh: Kafe kayu hangat di Kyoto saat sore hujan lebat dengan alunan musik akustik pelan",
            info: "Nuansa detail kafe yang ingin dirasakan",
          },
        ],
      },
    },
    "Produksi Musik Komersial & Podcast": {
      "Jingle Iklan Radio & Podcast 15-30 Detik Berima": {
        description: "Pencipta lirik dan panduan aransemen jingle komersial catchy 15-30 detik dengan rima menempel di kepala dan audio logo brand.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Award-Winning Advertising Jingle Composer. Buat lirik pendek berima ritmis yang langsung melekat dalam ingatan pendengar.",
        components: [
          {
            name: "productBrand",
            label: "Nama Brand & Slogan Utama",
            type: "text",
            placeholder: "contoh: Kopi Mantap Jiwa - 'Segarnya Bikin Hari Kamu Menyala!'",
            info: "Nama produk dan tagline promosi",
          },
          {
            name: "musicalVibe",
            label: "Nuansa Musik Jingle",
            type: "select",
            options: ["Upbeat Ceria Akustik Pop (Ukulele, tepukan tangan, siulan)", "Modern Catchy Electronic Beat (Punchy synth, dance vibe)", "Hangat, Elegan & Mewah (Piano jazz akustik)", "Lainnya..."],
            info: "Irama dan rasa musik jingle",
          },
        ],
      },
      "Lo-Fi Hip Hop Beat & Study Music Producer": {
        description: "Komposisi musik Lo-Fi santai dengan vinyl crackle, Rhodes piano chords, bass hangat, dan ritme boom-bap santai untuk fokus kerja & belajar.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Lo-Fi Hip Hop Beatmaker (Gaya Lofi Girl / Chillhop). Rancang prompt Suno/Udio dengan tekstur analog tape yang menenangkan.",
        components: [
          {
            name: "trackMood",
            label: "Suasana & Tema Lagu Lo-Fi",
            type: "text",
            placeholder: "contoh: Belajar saat malam hujan tenang di dalam kamar dengan secangkir teh hangat",
            info: "Emosi dan visual yang diwakili musik",
          },
        ],
      },
    },
    "Komposisi Musik & Soundscape Suasana": {
      "Udio v1.5 Spatial & Cinematic Ambient Soundscape": {
        description: "Prompt musik ambient sinematik di Udio dengan instrumen organik, resonansi spasial, dan frekuensi relaksasi 432Hz.",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Ambient Film Composer (Gaya Hans Zimmer / Brian Eno). Rancang prompt soundscape dengan layering tekstur suara yang luas dan emosional.",
        components: [
          {
            name: "soundAtmosphere",
            label: "Atmosfer & Suasana yang Dituju",
            type: "text",
            placeholder: "contoh: Suasana hutan berkabut saat fajar dengan gemericik sungai tenang dan nyanyian burung kejauhan",
            info: "Visual dan emosi apa yang diwakili musik ini?",
          },
          {
            name: "instrumentLayers",
            label: "Kombinasi Instrumen Musik",
            type: "select",
            options: ["Warm analog synthesizer pad + Cello solo yang mendalam + Spatial drone", "Acoustic felt piano + Ambient tape delay + Soft orchestral strings", "Binaural beats 432Hz + Tibetan singing bowls + Ocean wave field recording", "Modular synth arpeggio + Sub-bass rumble + Ethereal choral wash", "Lainnya..."],
            info: "Instrumen utama yang membentuk komposisi",
          },
        ],
      },
      "Meditasi Terpandu & ASMR Hypnotherapy Script": {
        description: "Naskah meditasi terpandu 10 menit dengan panduan pernapasan rileks, tempo kata terukur, dan sugesti positif pikiran tenang.",
        toolType: "audio-generation",
        ai_logic_description: "Persona AI: Anda adalah Mindfulness Instructor & Certified Hypnotherapist. Susun naskah audio dengan kata-kata menenangkan, jeda hening berkala, dan visualisasi relaksasi.",
        components: [
          {
            name: "meditationGoal",
            label: "Tujuan Meditasi",
            type: "select",
            options: ["Tidur Nyenyak Cepat & Mengatasi Insomnia (Deep Sleep)", "Meredakan Stres Kerja & Kecemasan Berlebih (Anxiety Relief)", "Fokus Kerja & Memulai Pagi Penuh Energi (Morning Intention)", "Self-Love, Penerimaan Diri & Relaksasi Otot Tubuh (Body Scan)", "Lainnya..."],
            info: "Apa hasil yang ingin dirasakan pendengar?",
          },
          {
            name: "guidanceTone",
            label: "Gaya Penyampaian Narator",
            type: "select",
            options: ["Bisikan lembut menenangkan (ASMR Gentle Whisper)", "Suara hangat bersahabat penuh kasih (Loving-Kindness)", "Instruksi pernapasan terstruktur 4-7-8 (Clinical Calm)", "Lainnya..."],
            info: "Karakter vokal narasi meditasi",
          },
        ],
      },
    },
    "Voiceover & Sound Design": {
      "Game & Cinematic Sound Effects (SFX) Designer": {
        description: "Generator prompt efek suara (SFX) foley dan sinematik untuk desainer game, animator, dan editor film.",
        toolType: "audio-generation",
        ai_logic_description: "Persona AI: Anda adalah Hollywood Sound Designer & Foley Artist. Deskripsikan tekstur audio, frekuensi akustik, spasial reverb, dan dinamika suara realistis.",
        components: [
          {
            name: "sfxType",
            label: "Jenis Efek Suara (SFX)",
            type: "text",
            placeholder: "contoh: Ledakan energi Sci-Fi plasma laser dengan gema sub-bass mendalam di ruang angkasa",
            info: "Suara apa yang ingin Anda ciptakan?",
          },
          {
            name: "audioEnvironment",
            label: "Lingkungan Akustik & Ruang Spasial",
            type: "select",
            options: ["Dry studio close-mic (Tanpa gema, sangat detail)", "Large cathedral / cavernous hall (Reverb panjang dan megah)", "Outdoor open field (Natural ambient decay)", "Underwater muffled resonance with bubble textures", "Lainnya..."],
            info: "Karakter pantulan ruang suara",
          },
          {
            name: "durationFeel",
            label: "Durasi & Karakter Impact",
            type: "select",
            options: ["One-shot instant impact (< 2 detik)", "Cinematic riser & transition whoosh (3-5 detik)", "Continuous looping background soundscape (10-30 detik)", "Lainnya..."],
            info: "Pola durasi dan kegunaan SFX",
          },
        ],
      },
    },
    "Prompt AI Musik (Suno & Udio)": {
      "Suno AI v4 Master Song Producer": {
        description: "Komposisi lagu utuh di Suno AI v4 lengkap dengan genre tags, BPM, instrumentasi, gaya vokal, lirik terstruktur [Verse], [Chorus], [Bridge], dan [Drop].",
        toolType: "music-generation",
        ai_logic_description: "Persona AI: Anda adalah Platinum Music Producer & Sound Engineer. Buat prompt musik lengkap dengan style tags presisi, struktur lirik berima kuat, dan instruksi transisi audio.",
        components: [
          {
            name: "songTheme",
            label: "Tema Lagu & Pesan Utama",
            type: "text",
            placeholder: "contoh: Perjuangan mengejar mimpi di kota metropolitan tanpa pernah menyerah",
            info: "Cerita atau emosi apa yang ingin dituangkan dalam lagu?",
          },
          {
            name: "musicGenre",
            label: "Genre & Gaya Musik",
            type: "select",
            options: ["Indie Pop Acoustic (Warm guitar, soft emotional male/female vocals, nostalgic)", "Synthwave / Cyberpunk 80s (120 BPM, analog retro synth, punchy drum machine)", "Modern Cinematic EDM / Melodic Bass (128 BPM, euphoric build-up, heavy sub drop)", "Lo-Fi Hip Hop Chillhop (85 BPM, jazzy piano chords, vinyl crackle, mellow bass)", "Modern J-Rock / Anime Opening (165 BPM, driving electric guitar, explosive chorus)", "Contemporary R&B / Neo Soul (Smooth groove, lush Rhodes chords, soulful harmonies)", "Lainnya..."],
            info: "Pilih genre musik dan nuansa instrumen",
          },
          {
            name: "vocalStyle",
            label: "Karakter Vokal",
            type: "select",
            options: ["Emotional female vocalist with breathy high notes and strong belt", "Deep raspy male vocalist with acoustic warmth and soulful timbre", "Energetic pop-punk duo harmonies with youthful punch", "Whispering ambient ethereal choir with heavy reverb", "Instrumental only (No Vocals)", "Lainnya..."],
            info: "Jenis suara penyanyi yang diinginkan",
          },
          {
            name: "songStructure",
            label: "Kebutuhan Lirik",
            type: "select",
            options: ["Lengkap: [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Bridge], [Chorus], [Outro]", "Ringkas: [Verse 1], [Chorus], [Verse 2], [Chorus], [Outro]", "Koleksi Hook / Jingle Iklan 30 Detik Berima Menempel di Kepala", "Lirik Bahasa Indonesia Puitis", "Lirik Bahasa Inggris Internasional", "Lainnya..."],
            info: "Struktur penulisan bait dan rima lagu",
          },
        ],
      },
      "ElevenLabs / OpenAI TTS Voiceover Director": {
        description: "Rancang naskah voiceover profesional dengan tag intonasi, jeda napas [pause], penekanan kata kunci, dan tempo narasi untuk video iklan / dokumenter.",
        toolType: "audio-generation",
        ai_logic_description: "Persona AI: Anda adalah Voiceover Director & Audio Scriptwriter. Format teks dengan markup penekanan fonetik, durasi jeda, dan emosi agar dihasilkan suara AI yang sangat manusiawi.",
        components: [
          {
            name: "scriptPurpose",
            label: "Tujuan Naskah Voiceover",
            type: "text",
            placeholder: "contoh: Video Iklan Komersial Launching Aplikasi FinTech 60 Detik",
            info: "Untuk jenis video apa voiceover ini digunakan?",
          },
          {
            name: "voicePersona",
            label: "Persona Suara & Aksen",
            type: "select",
            options: ["Hangat, Ramah & Tepercaya (Suara Narator Brand Terkenal)", "Sinematik, Berat & Berwibawa (Suara Dokumenter Bioskop)", "Cepat, Energik & Antusias (Iklan Promo & Flash Sale)", "Santai, Percakapan & Kasual (Podcast & Storytelling Edukasi)", "Menenangkan, Lembut & Meditatif (Aplikasi Mindfulness)", "Lainnya..."],
            info: "Karakter suara dan nada bicara",
          },
          {
            name: "targetDuration",
            label: "Target Durasi Waktu",
            type: "select",
            options: ["15 Detik (Ultra Singkat ~ 35 Kata)", "30 Detik (Iklan Standar ~ 70 Kata)", "60 Detik (Video Promosi Penuh ~ 140 Kata)", "2-3 Menit (Dokumenter / Explainer Video)", "Lainnya..."],
            info: "Perkiraan durasi pembacaan narasi",
          },
        ],
      },
    },
    "Alat Bantu Komposisi": {
      "Penulisan Lirik Lagu": {
        description:
          "Buat lirik untuk lagu dengan struktur dan nuansa tertentu.",
        toolType: "music-composition",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Lirik Profesional. AI akan menginterpretasikan lirik dan gaya musik yang diberikan untuk menghasilkan komposisi lagu yang kohesif, termasuk melodi dan vokal yang sesuai.",
        components: [
          {
            name: "genre",
            label: "Genre Musik",
            type: "select",
            options: [
              "Pop",
              "Rock",
              "R&B",
              "Folk",
              "Hip-Hop",
              "Electronic",
              "Lainnya...",
            ],
            info: "Genre akan mempengaruhi gaya bahasa dan struktur lirik.",
          },
          {
            name: "theme",
            label: "Tema Lagu",
            type: "text",
            placeholder:
              "e.g., 'cinta pertama, patah hati, perjalanan hidup, protes sosial'",
            info: "Gagasan atau cerita utama di balik lagu.",
          },
          {
            name: "mood",
            label: "Suasana Hati Lagu",
            type: "select",
            options: [
              "Senang & Ceria",
              "Sedih & Melankolis",
              "Energik & Memotivasi",
              "Marah & Frustrasi",
              "Romantis & Intim",
              "Lainnya...",
            ],
            info: "Emosi utama yang ingin disampaikan melalui lirik.",
          },
          {
            name: "structure",
            label: "Struktur Lagu (Opsional)",
            type: "text",
            placeholder: "e.g., 'Verse-Chorus-Verse-Chorus-Bridge-Chorus'",
            info: "Tentukan urutan bagian-bagian lagu jika Anda punya preferensi.",
          },
          {
            name: "keyElements",
            label: "Elemen/Kata Kunci Wajib",
            type: "textarea",
            placeholder: "e.g., 'sebutkan kata 'bintang', 'malam', 'harapan''",
            info: "Gambar, kata, atau frasa spesifik yang harus ada dalam lirik.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan banyak metafora alam (laut, gunung, hutan). Hindari rima yang terlalu klise. Cerita harus berkembang dari sedih menjadi penuh harapan di bagian akhir.",
            info: "Detail artistik atau batasan kreatif untuk AI. Misalnya, penggunaan metafora atau majas tertentu.",
          },
        ],
      },
      "Ide Progresi Kord": {
        description: "Hasilkan ide progresi kord berdasarkan genre dan mood.",
        toolType: "music-composition",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Komposer Musik Ahli. AI akan menghasilkan ide progresi kord berdasarkan genre, mood, kunci nada, dan tingkat kompleksitas yang diinginkan, dengan fokus pada menciptakan harmoni yang sesuai dan menarik.",
        components: [
          {
            name: "genre",
            label: "Genre Musik",
            type: "select",
            options: [
              "Blues",
              "Jazz",
              "Pop Ballad",
              "Rock Alternatif",
              "Sinematik",
              "Lainnya...",
            ],
            info: "Genre seringkali memiliki progresi kord yang khas.",
          },
          {
            name: "mood",
            label: "Mood yang Diinginkan",
            type: "select",
            options: [
              "Ceria & Terang",
              "Sedih & Minor",
              "Misterius & Tegang",
              "Tenang & Damai",
              "Epik & Megah",
              "Lainnya...",
            ],
            info: "Pilihan kord (mayor/minor/dll) akan sangat dipengaruhi oleh mood.",
          },
          {
            name: "key",
            label: "Kunci Nada (Opsional)",
            type: "text",
            placeholder: "e.g., 'C Major, A minor'",
            info: "Menentukan 'rumah' atau pusat tonal dari progresi.",
          },
          {
            name: "complexity",
            label: "Tingkat Kompleksitas Kord",
            type: "select",
            options: [
              "Sederhana (3-4 kord dasar)",
              "Menengah (dengan kord ke-7)",
              "Kompleks (dengan kord ekstensi/substitusi)",
              "Lainnya...",
            ],
            info: "'Sederhana' untuk lagu pop, 'Kompleks' mungkin menyertakan kord 7, 9, atau substitusi.",
          },
          {
            name: "partOfSong",
            label: "Untuk Bagian Lagu Mana?",
            type: "select",
            options: [
              "Verse",
              "Chorus",
              "Bridge",
              "Semua Bagian",
              "Lainnya...",
            ],
            info: "Progresi untuk chorus biasanya lebih kuat dan 'catchy' daripada verse.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Sertakan setidaknya satu kord pinjaman dari minor paralel. Progresi harus cocok untuk dimainkan dengan gitar akustik. Buat bagian bridge yang terasa 'mengawang'.",
            info: "Instruksi teknis atau artistik tambahan untuk progresi kord yang dihasilkan.",
          },
        ],
      },
    },
    "Prompt AI Musik & Audio": {
      "Suno AI": {
        description:
          "Buat lagu lengkap dengan vokal dari deskripsi teks menggunakan Suno AI.",
        toolType: "music-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Produser Musik AI. AI akan menginterpretasikan lirik dan gaya musik yang diberikan untuk menghasilkan komposisi lagu yang kohesif, termasuk melodi dan vokal yang sesuai, dengan fokus pada kualitas produksi dan kreativitas.",
        components: [
          {
            name: "lyrics",
            label: "Lirik Lagu",
            type: "textarea",
            placeholder:
              "e.g., '[Verse 1]\nWalking through the city lights\n[Chorus]\nOh, I feel so alive tonight'",
            info: "Masukkan lirik lengkap dengan penanda bagian seperti [Verse] dan [Chorus]. Atau biarkan kosong dan jelaskan di deskripsi gaya.",
          },
          {
            name: "model",
            label: "Model",
            type: "select",
            options: ["v3.5", "v3.5-turbo", "v4-alpha", "chirp-v3"],
            info: "Pilih versi model Suno AI yang akan digunakan.",
          },
          {
            name: "instrumental",
            label: "Instrumental?",
            type: "select",
            options: ["Tidak", "Ya"],
            info: "Pilih 'Ya' jika Anda hanya ingin musik tanpa vokal.",
          },
          {
            name: "styleOfMusic",
            label: "Gaya Musik",
            type: "text",
            placeholder:
              "e.g., 'acoustic pop', '80s synthwave with female vocal', 'epic cinematic orchestral'",
            info: "Deskripsikan genre, mood, instrumen, dan tipe vokal yang Anda inginkan.",
          },
          {
            name: "makeInstrumental",
            label: "Buat Versi Instrumental?",
            type: "select",
            options: ["Tidak", "Ya"],
            info: "Pilih 'Ya' jika Anda hanya ingin musik tanpa vokal.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan. Untuk hasil terbaik, gunakan model v3.5 atau v3.5-turbo.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
          },
        ],
      },
      "Stable Audio": {
        description:
          "Hasilkan audio, efek suara, atau musik instrumental berkualitas tinggi dari deskripsi teks.",
        toolType: "audio-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Insinyur Audio AI. AI akan menghasilkan audio, efek suara, atau musik instrumental berkualitas tinggi dari deskripsi teks, dengan fokus pada genre, mood, instrumen, dan BPM yang ditentukan, serta mengoptimalkan kualitas suara.",
        components: [
          {
            name: "prompt",
            label: "Deskripsi Audio",
            type: "textarea",
            placeholder:
              "e.g., 'A cinematic soundtrack with a powerful orchestra, epic drums, and a choir. 120 BPM. Dramatic, adventurous.'",
            info: "Jelaskan suara yang Anda inginkan. Sertakan genre, mood, instrumen, dan BPM.",
          },
          {
            name: "negativePrompt",
            label: "Prompt Negatif (Opsional)",
            type: "text",
            placeholder: "e.g., 'low quality, noisy, distorted'",
            info: "Suara atau kualitas yang ingin Anda hindari.",
          },
          {
            name: "duration",
            label: "Durasi (detik)",
            type: "number",
            placeholder: "e.g., 45",
            info: "Panjang klip audio yang diinginkan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "MusicFX (Google)": {
        description:
          "Eksplorasi ide musik dengan cepat menggunakan model MusicLM from Google.",
        toolType: "music-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Eksplorator Musik Cepat. AI akan menghasilkan ide musik berdasarkan prompt deskriptif, dengan fokus pada mood, genre, dan instrumen, memanfaatkan model MusicLM untuk eksplorasi cepat dan kreatif.",
        components: [
          {
            name: "prompt",
            label: "Prompt Deskriptif",
            type: "textarea",
            placeholder:
              "e.g., 'lo-fi chill beat for studying', 'reggae song with a catchy bassline', 'epic rock anthem with electric guitar solos'",
            info: "Deskripsikan musik yang ingin Anda buat dengan fokus pada mood, genre, dan instrumen.",
          },
          {
            name: "duration",
            label: "Durasi (detik)",
            type: "select",
            options: ["30", "50", "70"],
            info: "Pilih panjang loop musik yang akan dihasilkan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
    },
  },
  "Prompt Ringkas": {
    "Kerangka Kerja Persuasi, Resume & Kepemimpinan": {
      "T-C-O-P (Task - Context - Output - Persona) Prompt Matrix": {
        description: "Framework universal prompt engineering untuk hasil cepat, presisi, dan terstruktur dalam 4 baris inti.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Prompt Engineering Optimization Master.",
        components: [
          {
            name: "taskContextDetails",
            label: "Tugas & Konteks Singkat",
            type: "text",
            placeholder: "contoh: Tugas: Buat 5 ide postingan Instagram. Konteks: Toko kue kering menjelang Idul Fitri. Output: Tabel ide + caption + hashtag. Persona: Social Media Strategist.",
            info: "Tuliskan kebutuhan Anda secara padat",
          },
        ],
      },
      "C-A-R (Context - Action - Result) Achievement Bullets": {
        description: "Merumuskan poin prestasi kerja resume CV yang kuat dan berorientasi hasil angka konkret (Konteks -> Aksi -> Hasil Terukur).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Executive Resume Writer & Headhunter.",
        components: [
          {
            name: "careerAchievement",
            label: "Pencapaian Kerja Kasar Anda",
            type: "text",
            placeholder: "contoh: Saya memperbaiki sistem antrean gudang dan berhasil mempercepat pengiriman barang dari 4 hari jadi 1 hari",
            info: "Prestasi apa yang ingin dibuatkan kalimat profesionalnya?",
          },
        ],
      },
      "S-T-A-R-R (Situation - Task - Action - Result - Reflection)": {
        description: "Format wawancara kerja STAR lanjutan dengan penambahan evaluasi refleksi pembelajaran pribadi yang membuat pewawancara terkesan.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Executive Interview Coach.",
        components: [
          {
            name: "interviewQuestionStory",
            label: "Pertanyaan Wawancara / Kisah Pengalaman",
            type: "text",
            placeholder: "contoh: Ceritakan saat Anda menghadapi kegagalan proyek dan bagaimana Anda bangkit mengatasinya",
            info: "Pertanyaan wawancara apa yang ingin Anda jawab?",
          },
        ],
      },
      "P-A-I-D (Problem - Agitate - Invalidate - Deliver) Sales Copy": {
        description: "Copywriting tajam yang membatalkan solusi alternatif lain sebelum menghadirkan produk Anda sebagai satu-satunya pilihan terbaik.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Conversion Copywriting Specialist.",
        components: [
          {
            name: "invalidAlternatives",
            label: "Masalah & Solusi Lama yang Tidak Efektif",
            type: "text",
            placeholder: "contoh: Masalah: Bahasa Inggris pasif. Solusi lama tidak efektif: Menghafal rumus grammar di buku membosankan",
            info: "Solusi apa yang selama ini gagal membantu pelanggan?",
          },
        ],
      },
      "F-A-B-E (Feature - Advantage - Benefit - Evidence) Selling": {
        description: "Menjual nilai produk dengan dukungan bukti data konkret (Studi lab, riset, atau sertifikasi uji klinis).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Scientific Sales Conversion Copywriter.",
        components: [
          {
            name: "productEvidence",
            label: "Produk & Bukti Hasil Uji Nyata",
            type: "text",
            placeholder: "contoh: Skincare Serum Niacinamide 10% - Teruji klinis mencerahkan kulit dalam 14 hari pada 98% responden",
            info: "Apa produk Anda dan bukti data pendukungnya?",
          },
        ],
      },
      "C-L-O-S-E (Connect - Listen - Offer - Solve - Execute) Script": {
        description: "Alur percakapan negosiasi penjualan tatap muka / video call yang berorientasi solusi win-win dan tanpa paksaan.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah High-Ticket B2B Sales Closer.",
        components: [
          {
            name: "salesConversationScenario",
            label: "Kondisi Klien dalam Negosiasi",
            type: "text",
            placeholder: "contoh: Calon klien tertarik dengan software kami tapi ragu soal biaya implementasi awal",
            info: "Situasi apa yang sedang dihadapi dalam percakapan penjualan?",
          },
        ],
      },
      "S-I-P (Simplify - Illustrate - Prove) Presentation Framework": {
        description: "Menyederhanakan konsep rumit dalam presentasi menjadi ide mudah dipahami dalam 3 langkah (Sederhanakan -> Ilustrasikan -> Buktikan).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah TED Talk Keynote Speaker Coach.",
        components: [
          {
            name: "complexConcept",
            label: "Konsep Rumit yang Ingin Dijelaskan",
            type: "text",
            placeholder: "contoh: Cara Kerja Teknologi Blockchain dan Smart Contract kepada Direktur Non-Teknis",
            info: "Materi sulit apa yang ingin Anda bawakan dalam presentasi?",
          },
        ],
      },
      "D-I-C-E (Disrupt - Intrigue - Convince - Engage) Social Hook": {
        description: "Formula hook pembuka media sosial yang mengejutkan, memicu rasa penasaran, meyakinkan, dan mengundang interaksi komentar.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Social Media Virality Specialist.",
        components: [
          {
            name: "contrarianIdea",
            label: "Pendapat Menentang Arus / Topik Konten",
            type: "text",
            placeholder: "contoh: Bangun jam 5 pagi tidak membuat Anda sukses jika Anda menghabiskan 3 jam pertama scrolling medsos",
            info: "Wawasan apa yang ingin Anda suarakan?",
          },
        ],
      },
      "A-P-P-L-E (Approach - Probe - Present - Listen - End) Service": {
        description: "Standar pelayanan pelanggan prima gaya Apple Store untuk staf customer service dan front-liner toko.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Apple Retail Customer Experience Trainer.",
        components: [
          {
            name: "serviceSituation",
            label: "Situasi Pelanggan Masuk ke Toko / CS",
            type: "text",
            placeholder: "contoh: Pelanggan bingung memilih antara dua jenis laptop untuk kebutuhan kuliah desain grafis",
            info: "Kebutuhan pelanggan apa yang perlu dilayani?",
          },
        ],
      },
      "F-O-C-U-S (Find - Organize - Clarify - Understand - Summarize)": {
        description: "Kerangka kerja membaca dan merangkum dokumen panjang atau buku tebal secara kilat menjadi intisari 1 halaman.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Speed Reading & Information Synthesis Specialist.",
        components: [
          {
            name: "documentToSummarize",
            label: "Dokumen / Laporan yang Dirangkum",
            type: "textarea",
            placeholder: "contoh: Tempelkan dokumen panjang atau laporan riset yang ingin diringkas intisarinya di sini...",
            info: "Teks panjang apa yang ingin dirangkum?",
          },
        ],
      },
      "W-I-I-F-M (What's In It For Me) Benefit Translator": {
        description: "Menerjemahkan setiap fitur produk menjadi keuntungan egoistik nyata yang langsung dirasakan oleh pembeli.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Psychological Copywriter.",
        components: [
          {
            name: "rawFeatureList",
            label: "Daftar Fitur Produk yang Masih Kering/Teknis",
            type: "textarea",
            placeholder: "contoh: 1. Menggunakan enkripsi AES-256 bit, 2. Kapasitas baterai 5000 mAh, 3. Cloud auto-sync 1 detik",
            info: "Fitur teknis apa yang ingin diubah menjadi manfaat emosional pembeli?",
          },
        ],
      },
      "B-L-U-F (Bottom Line Up Front) Executive Briefing": {
        description: "Format ringkasan eksekutif militer yang menempatkan kesimpulan atau rekomendasi penting langsung di baris pertama tanpa bertele-tele.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Military Intelligence & Executive Briefing Officer.",
        components: [
          {
            name: "executiveDecisionSummary",
            label: "Rekomendasi Utama & Konteks Masalah",
            type: "text",
            placeholder: "contoh: Rekomendasi: Tunda peluncuran fitur X selama 10 hari untuk menuntaskan audit keamanan payment gateway",
            info: "Apa kesimpulan atau keputusan inti yang harus diketahui pimpinan segera?",
          },
        ],
      },
    },
    "Formula Copywriting & Negosiasi Cepat": {
      "PAS-E (Problem - Agitation - Solution - Evidence)": {
        description: "Evolusi formula klasik PAS dengan penambahan bukti nyata (Evidence) dan garansi kepuasan yang meruntuhkan keraguan pembeli.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Direct Response Copywriter.",
        components: [
          {
            name: "painPoint",
            label: "Masalah Utama Pembaca",
            type: "text",
            placeholder: "contoh: Tagihan listrik rumah membengkak setiap bulan karena pemakaian AC",
            info: "Masalah yang dialami pelanggan",
          },
        ],
      },
      "ACCA (Awareness - Comprehension - Conviction - Action)": {
        description: "Formula periklanan edukatif yang membimbing pembaca dari belum sadar masalah hingga yakin dan mengambil tindakan nyata.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Advertising Copywriting Strategist.",
        components: [
          {
            name: "educationalProduct",
            label: "Produk / Solusi yang Ditawarkan",
            type: "text",
            placeholder: "contoh: Asuransi Kesehatan Keluarga dengan Proteksi Penyakit Kritis Tanpa Masa Tunggu",
            info: "Apa produk yang perlu dijelaskan secara edukatif?",
          },
        ],
      },
      "RADAR (Recognize - Analyze - Decide - Act - Review)": {
        description: "Kerangka kerja kepemimpinan dan manajemen insiden kilat untuk merespons masalah operasional di tempat kerja secara tenang dan terukur.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Crisis Management & Leadership Coach.",
        components: [
          {
            name: "incidentDescription",
            label: "Insiden / Masalah Kerja yang Terjadi",
            type: "text",
            placeholder: "contoh: Server database utama down saat jam sibuk transaksi gajian",
            info: "Masalah mendadak apa yang sedang dihadapi?",
          },
        ],
      },
      "HEART (Hook - Empathy - Authority - Result - Transition)": {
        description: "Formula bio profil dan elevator pitch profesional yang memikat klien dalam 30 detik pertama.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Executive Personal Branding Coach.",
        components: [
          {
            name: "professionalIdentity",
            label: "Profesi & Keahlian Utama",
            type: "text",
            placeholder: "contoh: Konsultan Keuangan Independen & CFP berpengalaman 8 tahun",
            info: "Apa profesi dan keahlian unggulan Anda?",
          },
        ],
      },
      "SSS (Star - Story - Solution) Emotional Copywriting": {
        description: "Copywriting berbasis storytelling emosional: Tokoh utama (Star), Perjalanan derita & rintangan (Story), dan Penemuan jalan keluar (Solution).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Storytelling & Emotional Copywriter.",
        components: [
          {
            name: "heroName",
            label: "Nama Tokoh & Masalah yang Dihadapi",
            type: "text",
            placeholder: "contoh: Budi, seorang ayah yang berjuang mencari penghasilan tambahan setelah terkena PHK",
            info: "Siapa tokoh pahlawan dalam cerita ini?",
          },
        ],
      },
      "SLAP (Stop - Look - Act - Purchase) Flash Sale Copy": {
        description: "Formula penulisan promosi kilat bertempo cepat untuk flash sale dan penawaran waktu terbatas yang memaksa pembeli segera checkout.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Flash Sale Conversion Copywriter.",
        components: [
          {
            name: "flashSaleOffer",
            label: "Penawaran Diskon & Batas Waktu",
            type: "text",
            placeholder: "contoh: Diskon Kilat 70% Hanya Berlaku 3 Jam Hari Ini Saja!",
            info: "Berapa besar diskon dan berapa lama batas berlakunya?",
          },
        ],
      },
    },
    "Formula Penjualan & Konversi Kilat": {
      "4P (Picture - Promise - Prove - Push) Copywriting": {
        description: "Formula penulisan persuasi 4 langkah: Visualisasikan impian (Picture), Janjikan solusi (Promise), Buktikan dengan data (Prove), dan Dorong aksi beli (Push).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Direct Response Copywriter Legendaris. Tulis naskah penjualan 4P yang kuat dan menggugah emosi.",
        components: [
          {
            name: "productItem",
            label: "Produk & Solusi Utama",
            type: "text",
            placeholder: "contoh: Kursus Intensif Menjadi Web Developer Siap Kerja dalam 12 Minggu",
            info: "Apa yang Anda tawarkan kepada audiens?",
          },
        ],
      },
      "PASO (Problem - Agitation - Solution - Outcome)": {
        description: "Evolusi formula klasik PAS dengan penambahan penekanan hasil transformasi akhir (Outcome) yang membahagiakan pelanggan.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Conversion Copywriter. Tekankan rasa sakit secara proporsional lalu tutup dengan hasil akhir yang gemilang.",
        components: [
          {
            name: "painPoint",
            label: "Masalah Utama & Rasa Sakit Pelanggan",
            type: "text",
            placeholder: "contoh: Bisnis sepi pembeli karena tidak paham cara pasang iklan digital yang benar",
            info: "Masalah apa yang sedang dialami audiens?",
          },
        ],
      },
    },
    "Formula Komunikasi & Persuasi Cepat": {
      "PREP (Point - Reason - Example - Point) 60-Sec Pitch": {
        description: "Format komunikasi ringkas persuasif untuk rapat, presentasi, atau elevator pitch kilat dalam waktu kurang dari 60 detik.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Executive Communication Coach. Susun pesan dengan ketajaman Point -> Reason -> Example -> Point agar audiens langsung teryakinkan.",
        components: [
          {
            name: "mainPoint",
            label: "Poin Utama (Point)",
            type: "text",
            placeholder: "contoh: Perusahaan kita harus segera mengadopsi AI automation untuk customer service",
            info: "Ide atau usulan inti Anda",
          },
          {
            name: "coreReason",
            label: "Alasan Kuat (Reason)",
            type: "text",
            placeholder: "contoh: Karena waktu tunggu respon pelanggan saat ini mencapai 4 jam dan menurunkan kepuasan 30%",
            info: "Mengapa usulan ini sangat penting?",
          },
          {
            name: "concreteExample",
            label: "Contoh / Data Nyata (Example)",
            type: "text",
            placeholder: "contoh: Kompetitor kita berhasil memangkas respon jadi 30 detik dan menghemat biaya operasional 40%",
            info: "Bukti atau studi kasus yang mendukung",
          },
        ],
      },
      "QUEST (Qualify - Understand - Educate - Stimulate - Transition)": {
        description: "Formula penulisan penawaran bertahap yang membimbing calon pembeli secara ramah dari identifikasi masalah hingga keputusan transaksi.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Master of Soft-Selling Copywriting. Susun 5 langkah QUEST yang mengalir mulus tanpa terkesan memaksa (hard selling).",
        components: [
          {
            name: "targetProfile",
            label: "Profil yang Memenuhi Syarat (Qualify)",
            type: "text",
            placeholder: "contoh: Khusus untuk pemilik toko online yang kewalahan balas chat pembeli sendirian",
            info: "Siapa yang paling cocok membaca pesan ini?",
          },
          {
            name: "problemEmpathy",
            label: "Masalah & Empati (Understand)",
            type: "text",
            placeholder: "contoh: Anda sering kehilangan calon pembeli karena terlambat membalas chat saat sedang tidur atau sibuk packing",
            info: "Situasi menyebalkan yang Anda pahami betul",
          },
          {
            name: "solutionValue",
            label: "Solusi & Manfaat (Educate & Stimulate)",
            type: "text",
            placeholder: "contoh: Asisten AI pintar yang otomatis balas chat dan closing pesanan 24 jam nonstop",
            info: "Apa solusi cerdas yang Anda tawarkan?",
          },
        ],
      },
    },
    "Formula Persuasi & Kerangka Kerja Terstruktur": {
      "BAB (Before - After - Bridge) Copywriting": {
        description: "Formula copywriting klasik yang menyoroti rasa sakit saat ini (Before), membayangkan masa depan ideal (After), dan produk Anda sebagai jembatannya (Bridge).",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Direct Response Copywriter Senior. Susun 3 tahap psikologis BAB yang menggerakkan emosi pembaca menuju pembelian.",
        components: [
          {
            name: "beforeState",
            label: "Before (Masalah & Frustrasi Saat Ini)",
            type: "text",
            placeholder: "contoh: Setiap hari capek lembur 3 jam hanya untuk merekap laporan penjualan manual di Excel",
            info: "Kondisi tidak nyaman yang dialami pembaca saat ini",
          },
          {
            name: "afterState",
            label: "After (Kondisi Impian yang Diinginkan)",
            type: "text",
            placeholder: "contoh: Laporan penjualan otomatis selesai dalam 1 klik dan Anda bisa pulang tepat waktu pukul 5 sore",
            info: "Gambaran kehidupan ideal tanpa masalah tersebut",
          },
          {
            name: "bridgeProduct",
            label: "Bridge (Produk / Solusi Anda)",
            type: "text",
            placeholder: "contoh: Software Dashboard Otomasi Penjualan 'AutoReport AI'",
            info: "Produk atau layanan yang menjadi jembatan solusi",
          },
        ],
      },
      "FAB (Feature - Advantage - Benefit) Selling": {
        description: "Ubah fitur teknis yang membosankan menjadi keunggulan kompetitif dan manfaat emosional nyata yang dicari pelanggan.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Value Proposition & Sales Conversion Specialist. Terjemahkan spesifikasi produk menjadi 'What's In It For Me' (WIIFM) bagi pelanggan.",
        components: [
          {
            name: "productName",
            label: "Nama Produk / Layanan",
            type: "text",
            placeholder: "contoh: Laptop Ultra-Slim Baterai 20 Jam",
            info: "Apa produk yang Anda jual?",
          },
          {
            name: "technicalFeatures",
            label: "Fitur Teknis Produk (Features)",
            type: "textarea",
            placeholder: "contoh: Kapasitas baterai 99Wh, bobot 980 gram, bodi magnesium alloy, chip prosesor 3nm efisiensi tinggi",
            info: "Spesifikasi fisik dan teknis produk",
          },
          {
            name: "targetUser",
            label: "Target Pengguna",
            type: "text",
            placeholder: "contoh: Konsultan bisnis dan digital nomad yang sering bepergian tanpa colokan listrik",
            info: "Siapa yang paling merasakan manfaatnya?",
          },
        ],
      },
    },
    "Pemikiran Terstruktur & Analisis": {
      "Analisis SWOT Personal & Strategi Karir": {
        description: "Petakan Kekuatan (Strengths), Kelemahan (Weaknesses), Peluang (Opportunities), dan Ancaman (Threats) karir Anda secara objektif.",
        toolType: "text",
        ai_logic_description: "Persona AI: Anda adalah Executive Career Coach. AI membedah profil karir pengguna ke dalam matriks SWOT 4-kuadran dan merumuskan strategi SO, WO, ST, WT yang konkret.",
        components: [
          {
            name: "currentCareerState",
            label: "Profesi / Posisi Karir Saat Ini",
            type: "text",
            placeholder: "e.g., 'Staff Keuangan di Perusahaan Distribusi (Pengalaman 3 Tahun)'",
            info: "Posisi dan lama pengalaman Anda saat ini.",
          },
          {
            name: "careerAspiration",
            label: "Target Karir 1-3 Tahun ke Depan",
            type: "text",
            placeholder: "e.g., 'Menjadi Finance Manager atau pindah ke industri Fintech'",
            info: "Apa cita-cita pencapaian karir Anda selanjutnya?",
          },
          {
            name: "perceivedWeakness",
            label: "Kekhawatiran / Kelemahan yang Dirasakan",
            type: "textarea",
            placeholder: "e.g., 'Kurang percaya diri saat presentasi bahasa Inggris dan belum menguasai tools visualisasi data PowerBI.'",
            info: "Hambatan apa yang paling Anda rasakan menghambat kemajuan?",
          },
        ],
        id_kerangka: "FW-ANALISI",
        nama_kerangka: "Analisis SWOT Personal & Strategi Karir",
        version: "2.0",
        kategori: ["Prompt Ringkas", "Pemikiran Terstruktur & Analisis"],
        perspektif_user: "Pengguna ingin meracik prompt Analisis SWOT Personal & Strategi Karir berkualitas tinggi.",
        logika_ai: "Persona AI: Anda adalah Executive Career Coach. AI membedah profil karir pengguna ke dalam matriks SWOT 4-kuadran dan merumuskan strategi SO, WO, ST, WT yang konkret.",
        komponen_prompt: {
          PERAN: "Persona AI: Anda adalah Executive Career Coach. AI membedah profil karir pengguna ke dalam matriks SWOT 4-kuadran dan merumuskan strategi SO, WO, ST, WT yang konkret.",
          KONTEKS: "Petakan Kekuatan (Strengths), Kelemahan (Weaknesses), Peluang (Opportunities), dan Ancaman (Threats) karir Anda secara objektif.",
          TUGAS: "Menghasilkan output prompt optimal sesuai parameter input yang diisi.",
          "VARIABEL INPUT": {
            "currentCareerState": {
                        "name": "currentCareerState",
                        "label": "Profesi / Posisi Karir Saat Ini",
                        "type": "text",
                        "placeholder": "e.g., 'Staff Keuangan di Perusahaan Distribusi (Pengalaman 3 Tahun)'",
                        "options": [],
                        "info": "Posisi dan lama pengalaman Anda saat ini."
            },
            "careerAspiration": {
                        "name": "careerAspiration",
                        "label": "Target Karir 1-3 Tahun ke Depan",
                        "type": "text",
                        "placeholder": "e.g., 'Menjadi Finance Manager atau pindah ke industri Fintech'",
                        "options": [],
                        "info": "Apa cita-cita pencapaian karir Anda selanjutnya?"
            },
            "perceivedWeakness": {
                        "name": "perceivedWeakness",
                        "label": "Kekhawatiran / Kelemahan yang Dirasakan",
                        "type": "textarea",
                        "placeholder": "e.g., 'Kurang percaya diri saat presentasi bahasa Inggris dan belum menguasai tools visualisasi data PowerBI.'",
                        "options": [],
                        "info": "Hambatan apa yang paling Anda rasakan menghambat kemajuan?"
            }
},
          "FORMAT OUTPUT": "Teks terstruktur, jelas, dan siap pakai."
        },
        konteks_tambahan_instruksi_khusus: "Pastikan hasil prompt natural, relevan, dan memikat.",
        contoh_kalimat: "Contoh hasil prompt untuk Analisis SWOT Personal & Strategi Karir.",
        output: "natural_language_prompt"
      },
      "CoT (Chain of Thought)": {
        description:
          "Pandu AI untuk memecah masalah kompleks menjadi langkah-langkah kecil dan menunjukkannya, menghasilkan jawaban yang lebih logis.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pemikir Logis. AI akan memecah masalah kompleks menjadi langkah-langkah penalaran yang lebih kecil dan transparan, menghasilkan jawaban yang lebih logis dan mudah diverifikasi, dengan meniru proses berpikir manusia.",
        components: [
          {
            name: "complexQuestion",
            label: "Pertanyaan atau Masalah Kompleks",
            type: "textarea",
            placeholder:
              "e.g., 'Jika sebuah mobil melaju 60 km/jam, berapa jarak yang ditempuh dalam 3 jam dan 45 menit?'",
            info: "Pertanyaan yang membutuhkan beberapa langkah penalaran untuk dijawab.",
          },
          {
            name: "exampleReasoning",
            label: "Contoh Penalaran (Opsional, untuk Few-Shot)",
            type: "textarea",
            placeholder:
              "e.g., 'Q: Berapa banyak bola tenis dalam 3 kaleng jika setiap kaleng berisi 4 bola? A: Kaleng 1 punya 4 bola. Kaleng 2 punya 4 bola. Kaleng 3 punya 4 bola. Jadi 3 * 4 = 12 bola.'",
            info: "Berikan contoh cara Anda ingin AI berpikir. Untuk Zero-Shot, biarkan kosong dan tambahkan 'Mari kita berpikir langkah demi langkah' pada instruksi tambahan.",
          },
          {
            name: "additionalContext",
            label: "Instruksi Tambahan",
            type: "textarea",
            placeholder: "e.g., 'Mari kita berpikir langkah demi langkah.'",
            info: "Instruksi akhir untuk memicu proses penalaran.",
          },
        ],
      },
      "Zero-shot CoT": {
        description:
          "Versi sederhana dari Chain of Thought, cukup dengan menambahkan frasa ajaib untuk memicu penalaran langkah-demi-langkah.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penalaran Cepat. AI akan menerapkan penalaran langkah-demi-langkah secara otomatis hanya dengan menambahkan frasa pemicu, memungkinkan pemecahan masalah yang lebih kompleks tanpa contoh eksplisit.",
        components: [
          {
            name: "question",
            label: "Pertanyaan",
            type: "textarea",
            placeholder: "e.g., 'Jelaskan mengapa langit berwarna biru.'",
            info: "Pertanyaan yang ingin Anda ajukan ke AI.",
          },
          {
            name: "magicPhrase",
            label: "Frasa Pemicu",
            type: "text",
            placeholder: "e.g., 'Mari kita berpikir langkah demi langkah.'",
            info: "Frasa sederhana yang ditambahkan di akhir prompt untuk mendorong penalaran terstruktur.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "ToT (Tree of Thoughts)": {
        description:
          "Minta AI untuk mengeksplorasi beberapa jalur pemikiran yang berbeda secara bersamaan dan mengevaluasinya untuk menemukan solusi terbaik.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pemikir Strategis. AI akan mengeksplorasi beberapa jalur pemikiran secara paralel, mengevaluasi setiap jalur berdasarkan kriteria yang diberikan, dan mengidentifikasi solusi terbaik, meniru proses pengambilan keputusan yang kompleks.",
        components: [
          {
            name: "problem",
            label: "Masalah Kompleks",
            type: "textarea",
            placeholder:
              "e.g., 'Bagaimana cara merancang sistem transportasi yang efisien untuk kota metropolitan baru?'",
            info: "Masalah yang memiliki banyak kemungkinan solusi dan variabel.",
          },
          {
            name: "thoughtPaths",
            label: "Jumlah Jalur Pemikiran untuk Dieksplorasi",
            type: "number",
            placeholder: "e.g., 3",
            info: "Berapa banyak ide atau pendekatan awal yang harus dipertimbangkan AI?",
          },
          {
            name: "evaluationCriteria",
            label: "Kriteria Evaluasi",
            type: "textarea",
            placeholder:
              "e.g., 'Biaya, dampak lingkungan, kecepatan implementasi, skalabilitas.'",
            info: "Bagaimana setiap jalur pemikiran akan dinilai dan dibandingkan?",
          },
          {
            name: "additionalContext",
            label: "Instruksi Tambahan",
            type: "textarea",
            placeholder:
              "e.g., 'Untuk setiap jalur pemikiran, pertimbangkan pro dan kontranya. Di akhir, berikan rekomendasi jalur terbaik berdasarkan kriteria.'",
            info: "Panduan untuk proses eksplorasi dan evaluasi.",
          },
        ],
      },
      "First Principles Thinking": {
        description:
          "Pecah masalah kompleks menjadi kebenaran-kebenaran fundamentalnya untuk membangun solusi dari dasar.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pemikir Fundamental. AI akan memecah masalah kompleks menjadi kebenaran-kebenaran fundamentalnya, mengidentifikasi asumsi yang ada, dan membangun solusi baru dari dasar, mendorong pemikiran inovatif.",
        components: [
          {
            name: "problem",
            label: "Masalah atau Konsep",
            type: "text",
            placeholder:
              "e.g., 'Meningkatkan efisiensi baterai', 'Apa itu bisnis?'",
            info: "Masalah yang ingin Anda dekonstruksi.",
          },
          {
            name: "assumptions",
            label: "Asumsi yang Ada Saat Ini",
            type: "textarea",
            placeholder:
              "e.g., 'Baterai harus terbuat dari lithium-ion. Bisnis harus punya kantor fisik.'",
            info: "Apa saja keyakinan umum atau 'cara lama' dalam memandang masalah ini?",
          },
          {
            name: "firstPrinciples",
            label: "Identifikasi Prinsip Pertama",
            type: "textarea",
            placeholder:
              "e.g., 'Apa fungsi dasar baterai? Menyimpan and melepaskan energi. Apa hukum fisika yang mengaturnya? Apa esensi dari bisnis? Pertukaran nilai.'",
            info: "Ajukan pertanyaan 'mengapa' berulang kali untuk menemukan kebenaran yang tidak dapat dipecah lagi.",
          },
          {
            name: "rebuildSolution",
            label: "Bangun Solusi Baru dari Dasar",
            type: "textarea",
            placeholder:
              "e.g., 'Dari prinsip pertama, bisakah kita menyimpan energi dengan cara lain? Bisakah pertukaran nilai terjadi tanpa kantor?'",
            info: "Gunakan kebenaran fundamental untuk merakit pendekatan atau solusi baru yang inovatif.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
    },
    "Kerangka Kerja Terstruktur Populer": {
      "RTF (Role-Task-Format)": {
        description: "Definisikan peran AI, tugas yang harus dilakukan, dan format output yang diinginkan secara cepat dan jelas.",
        toolType: "text",
        ai_logic_description: "Anda adalah seorang [Peran] yang akan [Tugas] dengan format [Format].",
        components: [
          {
            name: "role",
            label: "Peran (Role)",
            type: "text",
            placeholder: "e.g., 'Copywriter marketing senior dengan pengalaman 10 tahun'",
            info: "Tentukan peran atau identitas keahlian yang harus diambil oleh AI."
          },
          {
            name: "task",
            label: "Tugas Pokok (Task)",
            type: "textarea",
            placeholder: "e.g., 'Tulis deskripsi produk yang menarik untuk smartphone flagship baru'",
            info: "Jelaskan secara spesifik apa yang harus dikerjakan AI."
          },
          {
            name: "format",
            label: "Format Output (Format)",
            type: "text",
            placeholder: "e.g., '3 paragraf terstruktur dengan bullet points untuk fitur unggulan'",
            info: "Tentukan bagaimana hasil akhir harus disajikan."
          }
        ]
      },
      "CARE (Context-Action-Result-Example)": {
        description: "Framework komprehensif yang menyediakan konteks, mendefinisikan aksi, menentukan hasil yang diharapkan, dan menyertakan contoh referensi.",
        toolType: "text",
        ai_logic_description: "Anda adalah seorang Konsultan Ahli yang akan menganalisis Konteks, menjalankan Aksi, memastikan Hasil tercapai, dan mengikuti Contoh yang diberikan.",
        components: [
          {
            name: "context",
            label: "Konteks Latar Belakang (Context)",
            type: "textarea",
            placeholder: "e.g., 'Perusahaan kami sedang meluncurkan lini produk ramah lingkungan baru untuk pasar milenial'",
            info: "Berikan informasi latar belakang dan situasi bisnis yang relevan."
          },
          {
            name: "action",
            label: "Aksi yang Harus Dilakukan (Action)",
            type: "textarea",
            placeholder: "e.g., 'Buat strategi kampanye media sosial 30 hari'",
            info: "Instruksi langkah atau tindakan nyata yang diminta."
          },
          {
            name: "result",
            label: "Hasil yang Diharapkan (Result)",
            type: "textarea",
            placeholder: "e.g., 'Kalender konten lengkap dengan pilar topik, hook, dan metrik KPI'",
            info: "Definisikan tolok ukur keberhasilan output."
          },
          {
            name: "example",
            label: "Contoh Referensi (Example)",
            type: "text",
            placeholder: "e.g., 'Mirip dengan gaya kampanye Patagonia atau Tesla'",
            info: "Berikan contoh acuan gaya atau format yang diinginkan."
          }
        ]
      },
      "CO-STAR (Context-Objective-Style-Tone-Audience-Response)": {
        description: "Framework komunikasi lengkap yang mencakup konteks, objektif, gaya bahasa, nada emosional, target audiens, dan format respons.",
        toolType: "text",
        ai_logic_description: "Anda adalah seorang Komunikator Strategis yang akan mencapai Objektif komunikasi sesuai Konteks, Gaya, Nada, dan Target Audiens yang ditentukan.",
        components: [
          {
            name: "context",
            label: "Konteks (Context)",
            type: "textarea",
            placeholder: "e.g., 'Perusahaan meluncurkan aplikasi mobile kesehatan baru'",
            info: "Latar belakang situasi dan kondisi saat ini."
          },
          {
            name: "objective",
            label: "Tujuan Pokok (Objective)",
            type: "text",
            placeholder: "e.g., 'Mendorong 10.000 pra-registrasi sebelum peluncuran'",
            info: "Target utama yang ingin dicapai."
          },
          {
            name: "style",
            label: "Gaya Bahasa (Style)",
            type: "select",
            options: ["Profesional & Elegan", "Inspiratif & Energik", "Edukatif & Ramah", "Kasual & Trendi", "Lainnya..."],
            info: "Gaya komunikasi yang diinginkan."
          },
          {
            name: "tone",
            label: "Nada Emosi (Tone)",
            type: "select",
            options: ["Motivasional", "Formal & Otoritatif", "Empatik & Hangat", "Meyakinkan & Mendesak", "Lainnya..."],
            info: "Nuansa emosional yang dirasakan pembaca."
          },
          {
            name: "audience",
            label: "Target Audiens (Audience)",
            type: "text",
            placeholder: "e.g., 'Profesional muda perkotaan usia 25-40 tahun'",
            info: "Profil spesifik penerima pesan."
          },
          {
            name: "response",
            label: "Format Respons (Response)",
            type: "text",
            placeholder: "e.g., '5 draft postingan Instagram lengkap dengan hashtag'",
            info: "Bentuk keluaran akhir yang diminta."
          }
        ]
      },
      "RTF-C (Role-Task-Format-Context)": {
        description: "Peningkatan dari formula RTF dengan penambahan konteks mendalam untuk hasil yang lebih bernuansa dan presisi.",
        toolType: "text",
        ai_logic_description: "Anda adalah seorang [Peran] yang akan mengerjakan [Tugas] dalam format [Format] dengan mempertimbangkan [Konteks].",
        components: [
          {
            name: "role",
            label: "Peran Ahli (Role)",
            type: "text",
            placeholder: "e.g., 'Desainer UX Senior spesialis aplikasi mobile'",
            info: "Peran dan tingkat pengalaman yang diemban AI."
          },
          {
            name: "task",
            label: "Tugas (Task)",
            type: "textarea",
            placeholder: "e.g., 'Rancang alur onboarding 3 langkah untuk aplikasi meditasi baru'",
            info: "Tugas spesifik yang harus diselesaikan."
          },
          {
            name: "format",
            label: "Format Output (Format)",
            type: "text",
            placeholder: "e.g., 'Deskripsi wireframe per langkah + mikro-copy tombol'",
            info: "Format penyajian output."
          },
          {
            name: "context",
            label: "Konteks & Batasan (Context)",
            type: "textarea",
            placeholder: "e.g., 'Target pengguna adalah profesional sibuk yang sering merasa stres dan belum pernah bermeditasi'",
            info: "Konteks pendukung, kendala, atau preferensi audiens."
          }
        ]
      },
      "SMART (Spesifik, Terukur, Tercapai, Relevan, Waktu)": {
        description: "Framework penetapan tujuan dan perencanaan proyek terukur dengan kriteria spesifik dan tenggat waktu.",
        toolType: "planning",
        ai_logic_description: "Anda adalah seorang Perencana Strategis & Manajer Proyek yang akan menyusun rencana aksi terukur menggunakan metodologi SMART.",
        components: [
          {
            name: "specific",
            label: "Spesifik (Specific)",
            type: "textarea",
            placeholder: "e.g., 'Tingkatkan traffic organik website melalui optimasi SEO 5 kata kunci utama'",
            info: "Tujuan spesifik dan terarah yang ingin dicapai."
          },
          {
            name: "measurable",
            label: "Terukur (Measurable)",
            type: "textarea",
            placeholder: "e.g., 'Peningkatan 40% dari 10.000 menjadi 14.000 pengunjung per bulan'",
            info: "Metrik kuantitatif untuk mengukur kemajuan atau keberhasilan."
          },
          {
            name: "achievable",
            label: "Dapat Dicapai (Achievable)",
            type: "textarea",
            placeholder: "e.g., 'Menerbitkan 2 artikel berkualitas per minggu dengan tim konten 3 orang'",
            info: "Kesesuaian target dengan kapasitas dan sumber daya yang ada."
          },
          {
            name: "relevant",
            label: "Relevan (Relevant)",
            type: "textarea",
            placeholder: "e.g., 'Menurunkan biaya akuisisi pelanggan (CAC) dan meningkatkan otoritas domain'",
            info: "Alasan mengapa tujuan ini penting bagi strategi jangka panjang."
          },
          {
            name: "timeBound",
            label: "Terikat Waktu (Time-bound)",
            type: "text",
            placeholder: "e.g., 'Tenggat waktu 6 bulan dengan review bulanan'",
            info: "Tenggat waktu atau milestone pencapaian."
          }
        ]
      },
      "TAG (Task-Action-Goal)": {
        description: "Framework 3 langkah cepat dan to-the-point untuk instruksi coding, troubleshooting, atau analisis instan.",
        toolType: "text",
        ai_logic_description: "Anda adalah seorang Spesialis Teknis yang akan menjalankan Aksi untuk menyelesaikan Tugas dan mencapai Gol target.",
        components: [
          {
            name: "task",
            label: "Tugas (Task)",
            type: "text",
            placeholder: "e.g., 'Audit performa komponen React ini'",
            info: "Tugas pokok yang harus dikerjakan."
          },
          {
            name: "action",
            label: "Langkah Aksi (Action)",
            type: "textarea",
            placeholder: "e.g., 'Analisis re-render berlebih, tambahkan useMemo/useCallback, dan optimalkan state'",
            info: "Aksi teknis yang harus diambil AI."
          },
          {
            name: "goal",
            label: "Gol / Target (Goal)",
            type: "text",
            placeholder: "e.g., 'Render time di bawah 16ms tanpa penurunan fungsionalitas'",
            info: "Hasil akhir yang diinginkan."
          }
        ]
      },
      "BAB (Before-After-Bridge)": {
        description: "Framework copywriting persuasif yang mengontraskan masalah saat ini dengan kondisi ideal masa depan.",
        toolType: "text",
        ai_logic_description: "Anda adalah seorang Copywriter Persuasif yang akan menyusun narasi transformasi Before-After-Bridge yang memikat audiens.",
        components: [
          {
            name: "before",
            label: "Kondisi Saat Ini (Before)",
            type: "textarea",
            placeholder: "e.g., 'Tim menghabiskan 3 jam setiap hari merekap data Excel manual yang rawan salah'",
            info: "Gambarkan masalah atau rasa sakit yang dialami saat ini."
          },
          {
            name: "after",
            label: "Kondisi Ideal Masa Depan (After)",
            type: "textarea",
            placeholder: "e.g., 'Dashboard otomatis 1-klik yang menyajikan laporan real-time siap kirim'",
            info: "Gambarkan kondisi masa depan yang jauh lebih baik."
          },
          {
            name: "bridge",
            label: "Jembatan Solusi (Bridge)",
            type: "textarea",
            placeholder: "e.g., 'Tunjukkan bagaimana software otomasi kami menjadi jembatan solusi instan'",
            info: "Bagaimana produk/solusi Anda mewujudkan transformasi tersebut."
          }
        ]
      },
      "RISEN (Role-Input-Steps-Expectation-Narrowing)": {
        description: "Framework presisi tinggi untuk instruksi analitis multi-langkah dan perancangan arsitektur kompleks.",
        toolType: "text",
        ai_logic_description: "Anda adalah seorang Arsitek & Analis Sistem yang akan memproses Input berdasarkan Langkah-langkah dengan Ekspektasi dan Batasan ketat.",
        components: [
          {
            name: "role",
            label: "Peran Ahli (Role)",
            type: "text",
            placeholder: "e.g., 'Senior Cloud Security Architect AWS/GCP'",
            info: "Tingkat keahlian spesifik yang diminta."
          },
          {
            name: "input",
            label: "Data Input / Konteks",
            type: "textarea",
            placeholder: "e.g., 'Detail arsitektur: API Gateway publik, EKS cluster, RDS PostgreSQL Multi-AZ'",
            info: "Data mentah atau konteks sistem yang dianalisis."
          },
          {
            name: "steps",
            label: "Langkah Eksekusi (Steps)",
            type: "textarea",
            placeholder: "e.g., '1. Threat modeling 2. Identifikasi celah IAM 3. Rekomendasi mitigasi CIS benchmark'",
            info: "Urutan langkah logis yang harus dijalankan AI."
          },
          {
            name: "expectation",
            label: "Ekspektasi Output (Expectation)",
            type: "text",
            placeholder: "e.g., 'Laporan audit markdown dengan tingkat keparahan Critical/High/Medium'",
            info: "Format dan standar kualitas keluaran."
          },
          {
            name: "narrowing",
            label: "Batasan / Pantangan (Narrowing)",
            type: "text",
            placeholder: "e.g., 'Fokus hanya pada layanan native cloud, jangan sarankan tool berbayar pihak ketiga'",
            info: "Batasan ruang lingkup atau hal yang tidak boleh dilakukan."
          }
        ]
      },
      "Chain of Thought (CoT - Penalaran Bertahap)": {
        description: "Memaksa AI untuk berpikir langkah demi langkah guna meminimalkan halusinasi pada logika, matematika, dan arsitektur.",
        toolType: "text",
        ai_logic_description: "Anda adalah seorang Pemecah Masalah & Ahli Logika yang akan bernalar langkah demi langkah sebelum memberikan solusi final.",
        components: [
          {
            name: "problem",
            label: "Masalah Pokok (Problem)",
            type: "textarea",
            placeholder: "e.g., 'Rancang sistem pemrosesan event 100.000 event/detik dengan jaminan zero data loss'",
            info: "Masalah kompleks yang perlu dipecahkan."
          },
          {
            name: "reasoningInstructions",
            label: "Instruksi Penalaran (Reasoning)",
            type: "textarea",
            placeholder: "e.g., 'Pikirkan langkah demi langkah. Analisis bottleneck ingestion, buffer message queue, persistensi database, dan failover recovery secara terpisah'",
            info: "Panduan cara berpikir analitis yang harus diikuti AI."
          },
          {
            name: "finalOutputFormat",
            label: "Format Solusi Akhir",
            type: "text",
            placeholder: "e.g., 'Cetak biru arsitektur lengkap beserta tabel perbandingan trade-off'",
            info: "Format penyajian solusi final."
          }
        ]
      }
    },
    "Formula Persuasi & Pemasaran": {
    },
    "Persona, Gaya & Skenario": {
      "Expert Persona": {
        description:
          "Minta AI untuk mengadopsi persona seorang ahli di bidang tertentu untuk mendapatkan jawaban yang lebih mendalam dan berwibawa.",
        toolType: "text",
        ai_logic_description:
          "AI akan mengadopsi persona seorang ahli di bidang yang ditentukan, memberikan jawaban yang mendalam, berwibawa, dan sesuai dengan gaya komunikasi ahli tersebut.",
        components: [
          {
            name: "expertRole",
            label: "Peran Ahli",
            type: "text",
            placeholder:
              "e.g., 'Seorang ahli biologi kelautan dengan pengalaman 20 tahun', 'Seorang sejarawan yang berspesialisasi dalam Kekaisaran Romawi'",
            info: "Jelaskan persona ahli secara spesifik. Sebutkan bidang, pengalaman, dan bahkan gaya komunikasinya.",
          },
          {
            name: "task",
            label: "Tugas untuk Ahli",
            type: "textarea",
            placeholder:
              "e.g., 'Jelaskan dampak perubahan iklim terhadap terumbu karang.'",
            info: "Pertanyaan atau tugas yang ingin Anda berikan kepada persona ahli ini.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan",
            type: "textarea",
            placeholder:
              "e.g., 'Jelaskan seolah-olah Anda sedang berbicara kepada mahasiswa tingkat pertama. Gunakan analogi yang mudah dipahami.'",
            info: "Instruksi untuk menjaga keaslian persona.",
          },
        ],
      },
      "Fictional Dialogue": {
        description:
          "Eksplorasi ide atau jelaskan konsep kompleks melalui dialog antara dua atau lebih karakter fiksi.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Dialog. AI akan menghasilkan dialog fiksi antara karakter yang ditentukan, mengeksplorasi topik kompleks melalui percakapan yang dinamis dan relevan dengan persona karakter.",
        components: [
          {
            name: "topic",
            label: "Topik Dialog",
            type: "text",
            placeholder:
              "e.g., 'Konsep black hole', 'Perdebatan antara etika dan keuntungan'",
            info: "Topik utama yang akan didiskusikan dalam dialog.",
          },
          {
            name: "character1",
            label: "Karakter 1",
            type: "textarea",
            placeholder:
              "e.g., 'Skeptis: Seorang jurnalis yang selalu bertanya dan mencari bukti.'",
            info: "Deskripsikan nama, peran, dan sudut pandang karakter pertama.",
          },
          {
            name: "character2",
            label: "Karakter 2",
            type: "textarea",
            placeholder:
              "e.g., 'Optimis: Seorang ilmuwan yang antusias dan visioner.'",
            info: "Deskripsikan nama, peran, dan sudut pandang karakter kedua.",
          },
          {
            name: "setting",
            label: "Latar (Setting)",
            type: "text",
            placeholder: "e.g., 'Di sebuah observatorium pada malam hari.'",
            info: "Di mana dan kapan dialog ini terjadi?",
          },
          {
            name: "keyPoints",
            label: "Poin Kunci yang Harus Muncul",
            type: "textarea",
            placeholder:
              "e.g., 'Singularitas, gravitasi, cakrawala peristiwa (event horizon)..'",
            info: "Konsep atau argumen penting yang harus dibahas dalam dialog.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Historical Figure": {
        description:
          "Minta AI untuk berperan sebagai tokoh sejarah dan menjawab pertanyaan dari sudut pandang mereka.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Sejarawan Berbicara. AI akan mengadopsi persona tokoh sejarah yang dipilih, menjawab pertanyaan dari sudut pandang mereka, dengan mempertahankan gaya bahasa dan pengetahuan yang relevan dengan era dan kepribadian tokoh tersebut.",
        components: [
          {
            name: "figure",
            label: "Tokoh Sejarah",
            type: "text",
            placeholder: "e.g., 'Leonardo da Vinci', 'Cleopatra'",
            info: "Pilih tokoh sejarah yang persona dan pengetahuannya diketahui.",
          },
          {
            name: "question",
            label: "Pertanyaan untuk Tokoh Tersebut",
            type: "textarea",
            placeholder:
              "e.g., 'Apa penemuan Anda yang paling membanggakan dan mengapa?'",
            info: "Ajukan pertanyaan yang relevan dengan kehidupan dan zaman tokoh tersebut.",
          },
          {
            name: "context",
            label: "Konteks Tambahan",
            type: "textarea",
            placeholder:
              "e.g., 'Jawab dengan gaya bahasa yang sesuai dengan abad ke-15. Pertahankan persona Anda sepanjang jawaban.'",
            info: "Instruksi untuk menjaga keaslian persona.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Hero's Journey": {
        description:
          "Rancang narasi atau cerita brand menggunakan struktur klasik Perjalanan Pahlawan (Monomyth).",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pencerita Brand. AI akan merancang narasi atau cerita brand menggunakan struktur klasik Perjalanan Pahlawan (Monomyth), memetakan elemen-elemen cerita ke dalam konteks brand atau produk untuk menciptakan narasi yang menarik dan relevan.",
        components: [
          {
            name: "hero",
            label: "Sang Pahlawan (Pelanggan Anda)",
            type: "text",
            placeholder: "e.g., 'Seorang pemilik usaha kecil yang berjuang.'",
            info: "Siapa protagonis dari cerita ini?",
          },
          {
            name: "ordinaryWorld",
            label: "Dunia Biasa (The Ordinary World)",
            type: "textarea",
            placeholder:
              "e.g., 'Dia terjebak dalam pekerjaan administratif yang memakan waktu.'",
            info: "Kehidupan normal sang pahlawan sebelum petualangan dimulai.",
          },
          {
            name: "callToAdventure",
            label: "Panggilan untuk Bertualang (Call to Adventure)",
            type: "textarea",
            placeholder:
              "e.g., 'Dia menyadari bahwa dia kehilangan peluang besar karena tidak efisien.'",
            info: "Masalah atau peluang yang mengganggu status quo.",
          },
          {
            name: "mentorAndTalisman",
            label: "Mentor & Benda Ajaib (Produk Anda)",
            type: "textarea",
            placeholder:
              "e.g., 'Dia menemukan software otomatisasi kami (mentor/benda ajaib) yang menjanjikan solusi.'",
            info: "Bagaimana produk Anda muncul untuk membantu sang pahlawan?",
          },
          {
            name: "trialsAndTriumphs",
            label: "Ujian & Kemenangan (Trials & Triumphs)",
            type: "textarea",
            placeholder:
              "e.g., 'Dia belajar menggunakan software, mengatasi keraguan, dan mulai melihat hasil positif.'",
            info: "Tantangan yang dihadapi dan diatasi dengan bantuan produk Anda.",
          },
          {
            name: "returnWithElixir",
            label: "Kembali dengan Ramuan (Return with the Elixir)",
            type: "textarea",
            placeholder:
              "e.g., 'Bisnisnya sekarang berkembang pesat, dan dia memiliki kebebasan untuk menjadi strategis.'",
            info: "Transformasi akhir dan kesuksesan yang dicapai oleh pahlawan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Socratic Method": {
        description:
          "Gunakan metode bertanya ala Socrates untuk mengeksplorasi sebuah topik secara mendalam dan kritis.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Filsuf. AI akan menggunakan metode bertanya ala Socrates untuk mengeksplorasi topik secara mendalam dan kritis, mengajukan pertanyaan yang menantang asumsi dan mendorong pemikiran reflektif.",
        components: [
          {
            name: "topic",
            label: "Topik atau Pernyataan Awal",
            type: "text",
            placeholder:
              "e.g., 'Apa itu keadilan?', 'Media sosial membuat kita lebih terhubung.'",
            info: "Konsep atau keyakinan yang akan dieksplorasi.",
          },
          {
            name: "aiRole",
            label: "Peran AI",
            type: "text",
            placeholder: "e.g., 'Bertindak sebagai Socrates.'",
            info: "Minta AI untuk mengambil peran sebagai penanya yang kritis.",
          },
          {
            name: "myRole",
            label: "Peran Saya",
            type: "text",
            placeholder: "e.g., 'Saya akan menjadi murid Anda.'",
            info: "Posisikan diri Anda sebagai orang yang akan menjawab pertanyaan AI.",
          },
          {
            name: "instruction",
            label: "Instruksi",
            type: "textarea",
            placeholder:
              "e.g., 'Tanggapi pernyataan awal saya, lalu ajukan pertanyaan yang menantang asumsi saya. Lanjutkan dialog ini selama beberapa putaran.'",
            info: "Pandu proses dialog Socrates.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Style Transfer": {
        description:
          "Tulis ulang sebuah teks dengan meniru gaya penulisan dari sumber lain (penulis, publikasi, dll.).",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Peniru Gaya. AI akan menulis ulang teks yang diberikan dengan meniru gaya penulisan dari sumber yang ditentukan (penulis, publikasi, dll.), sambil mempertahankan elemen kunci dari teks asli.",
        components: [
          {
            name: "originalText",
            label: "Teks Asli",
            type: "textarea",
            placeholder: "Tempelkan teks yang ingin Anda ubah gayanya di sini.",
            info: "Konten yang akan diadaptasi.",
          },
          {
            name: "styleSource",
            label: "Sumber Gaya Penulisan",
            type: "text",
            placeholder:
              "e.g., 'Ernest Hemingway', 'Majalah The Economist', 'Seorang anak usia 5 tahun'",
            info: "Gaya siapa atau apa yang ingin Anda tiru?",
          },
          {
            name: "keyElementsToKeep",
            label: "Elemen Kunci yang Harus Dipertahankan",
            type: "textarea",
            placeholder:
              "e.g., 'Pertahankan semua data dan angka. Jangan ubah nama produk.'",
            info: "Informasi penting dari teks asli yang tidak boleh hilang.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
    },
    "Refleksi & Peningkatan Prompt": {
      "Prompt Critique": {
        description:
          "Minta AI untuk menganalisis dan memberikan umpan balik tentang prompt Anda sendiri untuk memperbaikinya.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Kritikus Prompt. AI akan menganalisis prompt yang diberikan, mengidentifikasi kelemahan berdasarkan kriteria yang ditentukan, dan memberikan umpan balik konstruktif untuk perbaikan, dengan fokus pada peningkatan kualitas prompt.",
        components: [
          {
            name: "originalPrompt",
            label: "Prompt yang Akan Dikritik",
            type: "textarea",
            placeholder: "e.g., 'Tulis tentang anjing.'",
            info: "Tempelkan prompt awal Anda di sini.",
          },
          {
            name: "goal",
            label: "Tujuan Awal Prompt",
            type: "textarea",
            placeholder:
              "e.g., 'Saya ingin mendapatkan artikel blog yang menarik tentang sejarah anjing domestik.'",
            info: "Apa hasil yang sebenarnya Anda harapkan dari prompt tersebut?",
          },
          {
            name: "critiqueCriteria",
            label: "Kriteria Kritik",
            type: "textarea",
            placeholder:
              "e.g., 'Analisis kejelasan, kekhususan, dan informasi konteks yang hilang. Berikan saran untuk perbaikan.'",
            info: "Aspek apa dari prompt yang harus dievaluasi oleh AI?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Self-Correction": {
        description:
          "Minta AI untuk menghasilkan respons awal, lalu mengkritik dan memperbaikinya sendiri dalam satu prompt.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pelatih AI. AI akan melakukan proses self-correction dengan menghasilkan respons awal, kemudian menganalisis dan mengidentifikasi kelemahan, serta merevisi respons tersebut untuk meningkatkan kualitas dan akurasi.",
        components: [
          {
            name: "task",
            label: "Tugas Awal",
            type: "textarea",
            placeholder:
              "e.g., 'Buat paragraf pembuka untuk cerita fantasi tentang naga.'",
            info: "Tugas utama yang harus diselesaikan.",
          },
          {
            name: "correctionInstruction",
            label: "Instruksi untuk Koreksi Diri",
            type: "textarea",
            placeholder:
              "e.g., 'Setelah Anda menulis draf pertama, identifikasi 3 kelemahan (misalnya, klise, kurang deskriptif) dan tulis ulang paragraf tersebut untuk memperbaikinya.'",
            info: "Pandu AI tentang bagaimana cara mengevaluasi dan memperbaiki pekerjaannya sendiri.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "APE (Author, Publisher, Editor)": {
        description:
          "Metode multi-langkah di mana AI berperan sebagai Penulis, Penerbit, dan Editor untuk menyempurnakan teks.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Editor Multi-Tahap. AI akan menerapkan metode APE (Author, Publisher, Editor) untuk menyempurnakan teks secara multi-langkah, menghasilkan draf awal, meninjau dari sudut pandang audiens, dan melakukan penyuntingan teknis untuk kualitas akhir.",
        components: [
          {
            name: "topic",
            label: "Topik Teks",
            type: "text",
            placeholder: "e.g., 'Manfaat meditasi untuk produktivitas.'",
            info: "Topik utama yang akan ditulis.",
          },
          {
            name: "authorPrompt",
            label: "Prompt untuk Penulis (Author)",
            type: "textarea",
            placeholder:
              "e.g., 'Tulis draf artikel 500 kata tentang topik ini. Fokus pada aliran ide dan konten yang kaya.'",
            info: "Langkah 1: Minta AI untuk menghasilkan draf awal.",
          },
          {
            name: "publisherPrompt",
            label: "Prompt untuk Penerbit (Publisher)",
            type: "textarea",
            placeholder:
              "e.g., 'Tinjau draf. Apakah ini menarik untuk audiens target (profesional muda)? Buat judul yang menarik dan periksa keterbacaan.'",
            info: "Langkah 2: Minta AI untuk meninjau dari sudut pandang audiens dan daya tarik.",
          },
          {
            name: "editorPrompt",
            label: "Prompt untuk Editor",
            type: "textarea",
            placeholder:
              "e.g., 'Periksa draf untuk kesalahan tata bahasa, ejaan, dan gaya. Pertajam kalimat dan pastikan alurnya logis.'",
            info: "Langkah 3: Minta AI untuk melakukan penyuntingan teknis.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Summarization Constraints": {
        description:
          "Kontrol output ringkasan dengan memberikan batasan yang jelas pada panjang, format, dan fokus.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Ringkasan. AI akan meringkas teks dengan menerapkan batasan yang ketat pada panjang, format, dan fokus, memastikan output ringkasan yang presisi dan sesuai kebutuhan pengguna.",
        components: [
          {
            name: "textToSummarize",
            label: "Teks yang Akan Diringkas",
            type: "textarea",
            placeholder: "Tempelkan artikel atau dokumen panjang di sini.",
            info: "Sumber konten yang akan diringkas.",
          },
          {
            name: "lengthConstraint",
            label: "Batasan Panjang",
            type: "text",
            placeholder:
              "e.g., 'Tidak lebih dari 100 kata', 'Dalam 3 poin utama', 'Tepat 1 kalimat'",
            info: "Seberapa panjang atau pendek ringkasan yang Anda inginkan?",
          },
          {
            name: "formatConstraint",
            label: "Batasan Format",
            type: "text",
            placeholder:
              "e.g., 'Format sebagai daftar bernomor', 'Harus berupa paragraf'",
            info: "Bagaimana struktur output yang diinginkan?",
          },
          {
            name: "focusConstraint",
            label: "Batasan Fokus",
            type: "textarea",
            placeholder:
              "e.g., 'Hanya fokus pada dampak ekonomi. Abaikan aspek sejarah.'",
            info: "Bagian atau tema apa dari teks asli yang harus diprioritaskan atau diabaikan?",
          },
        ],
      },
    },
    "Utilitas & Format Khusus": {
      "JSON Formatter": {
        description:
          "Ubah data tidak terstruktur atau teks biasa menjadi format JSON yang bersih dan valid.",
        toolType: "code",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pemformat Data. AI akan mengonversi data tidak terstruktur menjadi format JSON yang bersih dan valid, dengan mempertimbangkan petunjuk skema yang diberikan untuk memastikan struktur output yang akurat.",
        components: [
          {
            name: "unstructuredData",
            label: "Data Tidak Terstruktur",
            type: "textarea",
            placeholder:
              "e.g., 'Nama: John Doe, Usia: 30, Pekerjaan: Developer. Kontak - Email: john@example.com, Telepon: 12345.'",
            info: "Tempelkan teks, daftar, atau data mentah yang ingin Anda konversi.",
          },
          {
            name: "schemaHint",
            label: "Petunjuk Skema (Opsional)",
            type: "textarea",
            placeholder:
              "e.g., 'Buat objek utama dengan kunci: nama, usia, pekerjaan. Kontak harus menjadi objek bersarang.'",
            info: "Berikan petunjuk tentang bagaimana struktur JSON yang Anda inginkan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Text to Table": {
        description:
          "Ekstrak informasi dari teks dan sajikan dalam format tabel yang rapi.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Konverter Data. AI akan mengekstrak informasi dari teks sumber dan menyajikannya dalam format tabel yang rapi, dengan mengidentifikasi kolom yang diminta dan memformat data sesuai kebutuhan.",
        components: [
          {
            name: "sourceText",
            label: "Teks Sumber",
            type: "textarea",
            placeholder:
              "Tempelkan paragraf atau teks yang berisi data di sini.",
            info: "Teks yang akan dianalisis.",
          },
          {
            name: "columns",
            label: "Nama Kolom Tabel (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'Nama Produk, Harga, Ketersediaan'",
            info: "Definikan kolom-kolom yang Anda inginkan untuk tabel.",
          },
          {
            name: "extractionInstruction",
            label: "Instruksi Ekstraksi",
            type: "textarea",
            placeholder:
              "e.g., 'Ekstrak semua produk yang disebutkan beserta harga dan status ketersediaan.'",
            info: "Panduan untuk AI tentang cara menemukan dan memformat data.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Fill in the Blanks": {
        description:
          "Buat template teks dengan bagian kosong, lalu minta AI untuk mengisinya berdasarkan konteks.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pengisi Template. AI akan mengisi bagian kosong dalam template teks berdasarkan konteks yang diberikan, menghasilkan teks yang kohesif dan relevan dengan informasi yang disisipkan.",
        components: [
          {
            name: "templateText",
            label: "Teks Template dengan Bagian Kosong",
            type: "textarea",
            placeholder:
              "e.g., 'Hari ini saya merasa [PERASAAN] karena saya baru saja menyelesaikan [TUGAS]. Rencana saya selanjutnya adalah [RENCANA].'",
            info: "Gunakan tanda kurung siku atau simbol lain untuk menandai bagian yang kosong.",
          },
          {
            name: "context",
            label: "Konteks untuk Mengisi Bagian Kosong",
            type: "textarea",
            placeholder:
              "e.g., 'Konteks: Saya seorang programmer yang baru saja berhasil men-debug kode yang sulit selama 3 hari. Saya ingin merayakaninya dengan bersantai.'",
            info: "Berikan informasi latar belakang agar AI dapat mengisi bagian kosong secara relevan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
    },
  },
};
