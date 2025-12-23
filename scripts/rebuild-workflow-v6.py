import json
from pathlib import Path

# Base directory
frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation")

# Helper komponen umum
def get_common_components():
    return [
        {
            "name": "PLATFORM_OTOMASI",
            "label": "Platform Otomasi Utama",
            "type": "select",
            "default": "Make.com (Integromat)",
            "options": [
                "Make.com (Integromat) - Visual & User Friendly",
                "N8n (Self-Hosted) - Unlimited, Secure & Murah",
                "Zapier - Premium, Mahal & Mudah",
                "Pipedream - Developer Oriented",
                "Relay.app - Human-in-the-Loop AI",
                "Activepieces - Open Source Zapier Alternative",
                "FlowiseAI - LLM Chain Builder",
                "LangFlow - AI Agent Builder",
                "Microsoft Power Automate - Enterprise",
                "Vapi.ai / Bland.ai (Khusus Voice)",
                "Lainnya..."
            ],
            "description": "Platform mana yang akan digunakan?"
        },
        {
            "name": "COMPLEXITY",
            "label": "Tingkat Kompleksitas Workflow",
            "type": "select",
            "options": [
                "Level 1: Linear (Trigger -> Single Action)",
                "Level 2: Logika Cabang (If/Else, Router, Switch)",
                "Level 3: Iterasi Data (Looping Array, Batching)",
                "Level 4: Integrasi API Kustom (HTTP Request Auth)",
                "Level 5: Database Sync (CRUD Operations)",
                "Level 6: AI Agent (Memory, RAG, Function Calling)",
                "Level 7: Human Approval (Proses berhenti tunggu approval)",
                "Lainnya..."
            ]
        },
        {
            "name": "INDUSTRY_SECTOR",
            "label": "Sektor Industri",
            "type": "select",
            "options": [
                "E-commerce & Retail",
                "SaaS & Technology",
                "Agency & Service Business",
                "Real Estate & Property",
                "Finance & Fintech",
                "Healthcare & Medical",
                "Education & EdTech",
                "F&B (Restoran/Cafe)",
                "Local Services (Bengkel/Salon)",
                "Lainnya..."
            ]
        },
        {
            "name": "DATA_VOLUME",
            "label": "Perkiraan Volume Data",
            "type": "select",
            "options": [
                "Rendah (< 100 eksekusi/bulan)",
                "Menengah (100 - 1,000 eksekusi/bulan)",
                "Tinggi (1,000 - 10,000 eksekusi/bulan)",
                "Massive (10,000+ eksekusi/bulan)",
                "Streaming/Real-time",
                "Lainnya..."
            ]
        }
    ]

# Definisi 12 Framework Workflow
frameworks = {
    # --- EXISTING 8 (Updated V6) ---
    "KOL-AUTO-001": {
        "nama": "Workflow Lead Gen CRM (Ads ke WA)",
        "desc": "Otomatisasi pemindahan data leads dari FB/Google Ads -> Google Sheets -> kirim WA Follow-up otomatis.",
        "persona": "Anda adalah Automation Engineer spesialis Lead Management Flow yang ahli optimasi speed-to-lead.",
        "konteks": "Saya ingin memindahkan data leads dari {SOURCE_LEAD} ke {DESTINATION_CRM} dan melakukan notifikasi via {NOTIFICATION_CHANNEL}.",
        "tugas": "Buat dokumentasi teknis workflow: 1. Konfigurasi Webhook/Trigger, 2. Field Mapping (Parsing JSON), 3. Format Nomor HP, 4. Action API Request.",
        "components": [
            {"name": "SOURCE_LEAD", "label": "Sumber Leads (Trigger)", "type": "select", "options": ["Facebook Lead Ads", "Google Lead Form", "Website Webhook", "Typeform/Tally", "Lainnya..."]},
            {"name": "DESTINATION_CRM", "label": "Tujuan Data (Database)", "type": "select", "options": ["Google Sheets / Airtable", "HubSpot CRM", "Notion", "Salesforce", "Lainnya..."]},
            {"name": "NOTIFICATION_CHANNEL", "label": "Channel Notifikasi", "type": "multiselect", "options": ["WhatsApp (Wozzap/Wati)", "Email (Gmail)", "Slack Alert", "SMS (Twilio)", "Lainnya..."]}
        ]
    },
    "KOL-AUTO-002": {
        "nama": "Workflow Content Repurposing (AI)",
        "desc": "Satu konten utama -> dipecah AI jadi 10+ konten sosmed -> auto-post ke semua platform.",
        "persona": "Anda adalah AI Content Workflow Architect yang ahli menggunakan LLM Nodes di N8n/Make.",
        "konteks": "Saya ingin workflow yang mengambil konten dari {INPUT_CONTENT}, memprosesnya dengan {AI_MODEL} untuk di-posting ke {TARGET_PLATFORMS}.",
        "tugas": "Rancang Flow Otomasi AI: 1. Watch Folder/RSS, 2. Transkripsi (Whisper) / OCR, 3. Prompt Chain (Summarize -> Tone Change), 4. HTTP Request Posting.",
        "components": [
            {"name": "INPUT_CONTENT", "label": "Input Konten Utama", "type": "select", "options": ["Google Drive File", "YouTube RSS", "Blog WordPress", "Lainnya..."]},
            {"name": "AI_MODEL", "label": "Model AI Pemroses", "type": "select", "options": ["OpenAI GPT-4o", "Claude 3.5 Sonnet", "Gemini Pro", "Lainnya..."]},
            {"name": "TARGET_PLATFORMS", "label": "Platform Tujuan", "type": "multiselect", "options": ["LinkedIn", "Twitter/X", "Instagram Caption", "WordPress Draft", "Lainnya..."]}
        ]
    },
    "KOL-AUTO-003": {
        "nama": "Workflow E-commerce Order Handling",
        "desc": "New Order masuk -> auto-confirm WA -> print label -> update stok -> rekap keuangan.",
        "persona": "Anda adalah E-commerce Operations Automator.",
        "konteks": "Handling order dari {STORE_PLATFORM}. Ketika order baru, workflow harus {ACTIONS}.",
        "tugas": "Buat Skema Workflow Order: 1. Webhook Listener, 2. Filter Lunas, 3. Iterasi Produk, 4. Update Inventory & Kirim Notif.",
        "components": [
            {"name": "STORE_PLATFORM", "label": "Platform Toko", "type": "select", "options": ["WooCommerce", "Shopify", "Tokopedia (Scraper)", "Shopee (Scraper)", "Lainnya..."]},
            {"name": "ACTIONS", "label": "Aksi Otomatis", "type": "multiselect", "options": ["Kirim WA Konfirmasi", "Input Sheet Keuangan", "Print Label", "Kurangi Stok", "Lainnya..."]}
        ]
    },
    "KOL-AUTO-004": {
        "nama": "Workflow AI Research Agent",
        "desc": "Input keyword -> Agent browsing Google -> Scrape 5 web teratas -> Rangkum jadi laporan.",
        "persona": "Anda adalah AI Agent Developer (LangChain Specialist).",
        "konteks": "Riset Agent dengan input {INPUT_TRIGGER}, menggunakan tools {RESEARCH_TOOLS}, output ke {OUTPUT_DEST}.",
        "tugas": "Rancang Agent Flow: 1. Trigger, 2. Search API, 3. Get HTML, 4. Summarize (Map-Reduce), 5. Save Report.",
        "components": [
            {"name": "INPUT_TRIGGER", "label": "Pemicu Riset", "type": "select", "options": ["Form Request", "Telegram Bot", "Jadwal Berkala", "Lainnya..."]},
            {"name": "RESEARCH_TOOLS", "label": "Tools Riset", "type": "multiselect", "options": ["Serper.dev (Google)", "Perplexity API", "ScrapingBee", "Lainnya..."]},
            {"name": "OUTPUT_DEST", "label": "Tujuan Laporan", "type": "select", "options": ["Notion Page", "Google Docs", "Email Digest", "Lainnya..."]}
        ]
    },
    "KOL-AUTO-005": {
        "nama": "Workflow Client Onboarding",
        "desc": "Pembayaran diterima -> Kirim Kontrak -> Buat Folder Drive -> Invite Slack.",
        "persona": "Anda adalah Business Operations Automator.",
        "konteks": "Onboarding klien baru. Trigger pembayaran {PAYMENT_SOURCE}. Siapkan {ONBOARDING_ASSETS}.",
        "tugas": "Buat Blueprint Onboarding: Payment Watcher -> Contract Gen -> Workspace Create -> Email Credential.",
        "components": [
            {"name": "PAYMENT_SOURCE", "label": "Sumber Pembayaran", "type": "select", "options": ["Stripe", "Xendit", "Transfer Manual", "Lainnya..."]},
            {"name": "ONBOARDING_ASSETS", "label": "Aset Disiapkan", "type": "multiselect", "options": ["Folder Drive", "Trello Board", "Slack Channel", "Lainnya..."]}
        ]
    },
    "KOL-AUTO-006": {
        "nama": "Workflow Monitoring Kompetitor",
        "desc": "Scrape website kompetitor -> Cek perubahan harga -> Alert jika lebih murah.",
        "persona": "Anda adalah Web Scraper Specialist.",
        "konteks": "Monitor {TARGET_DIPANTAU} pakai {SCRAPING_METHOD}. Jika ada {CHANGE_TYPE}, kirim alert.",
        "tugas": "Rancang Monitoring Flow: Schedule -> Fetch HTML -> Extract -> Compare DB -> Alert.",
        "components": [
            {"name": "TARGET_DIPANTAU", "label": "Target Pantauan", "type": "select", "options": ["Harga Produk", "Artikel Baru", "Stok", "Lainnya..."]},
            {"name": "SCRAPING_METHOD", "label": "Metode Scraping", "type": "select", "options": ["N8n HTTP Request", "Apify Actor", "Puppeteer", "Lainnya..."]},
            {"name": "CHANGE_TYPE", "label": "Kondisi Alert", "type": "select", "options": ["Harga Turun", "Perubahan Apapun", "Keyword Muncul", "Lainnya..."]}
        ]
    },
    "KOL-AUTO-007": {
        "nama": "Workflow Webinar/Event Funnel",
        "desc": "Daftar Event -> Save Contact -> Reminder H-1 -> Follow-up Absensi.",
        "persona": "Anda adalah Event Marketing Automator.",
        "konteks": "Flow webinar. Pendaftar {REGISTRATION_PAGE}. Reminder via {REMINDER_CHANNELS}.",
        "tugas": "Buat Event Flow: Webhook -> Add CRM -> Delay Calc -> Send Reminder -> Post-Event.",
        "components": [
            {"name": "REGISTRATION_PAGE", "label": "Halaman Daftar", "type": "select", "options": ["Zoom", "Eventbrite", "Google Form", "Lainnya..."]},
            {"name": "REMINDER_CHANNELS", "label": "Channel Reminder", "type": "multiselect", "options": ["WhatsApp", "Email", "Calendar Invite", "Lainnya..."]}
        ]
    },
    "KOL-AUTO-008": {
        "nama": "Workflow Architect (Custom Universal)",
        "desc": "Bangun workflow custom apapun dengan Diagram Mermaid.",
        "persona": "Anda adalah Senior Solution Architect.",
        "konteks": "Workflow custom untuk {CUSTOM_GOAL} melibatkan {APP_LIST}.",
        "tugas": "Buat Blueprint Lengkap: Logic, Mermaid Diagram, Node Config, Error Handling.",
        "components": [
            {"name": "CUSTOM_GOAL", "label": "Tujuan Workflow", "type": "textarea", "placeholder": "Jelaskan detail..."},
            {"name": "APP_LIST", "label": "Aplikasi Terlibat", "type": "text", "placeholder": "Gmail, Slack, dll"}
        ]
    },

    # --- 4 NEW MONEY MAKING WORKFLOWS ---
    "KOL-AUTO-009": {
        "nama": "AI Voice Sales Agent (Outbound/Inbound)",
        "desc": "Setup AI yang bisa menelepon/ditelepon, berbicara seperti manusia (Vapi/Bland AI).",
        "persona": "Anda adalah Voice AI Engineer yang ahli mengkonfigurasi Vapi.ai, Bland.ai, dan Retell AI.",
        "konteks": "Saya ingin membuat AI Voice Agent untuk {VOICE_USECASE}. Agent harus diintegrasikan dengan {VOICE_PROVIDER} dan data dikirim ke {CRM_INTEGRATION}.",
        "tugas": "Buat Spesifikasi Voice Agent: 1. Konfigurasi Prompt Persona Suara, 2. Logic Tool/Function Calling (Cek Jadwal/Harga), 3. Webhook Summary call log ke CRM.",
        "components": [
            {
                "name": "VOICE_USECASE",
                "label": "Tujuan Panggilan AI",
                "type": "select",
                "options": ["Inbound Customer Support (Jawab Telpon 24/7)", "Outbound Lead Qualification (Telepon Lead Masuk)", "Appointment Setting (Booking Jadwal)", "Debt Collection (Penagihan Halus)", "Survey/Feedback Call", "Lainnya..."]
            },
            {
                "name": "VOICE_PROVIDER",
                "label": "Platform Voice AI",
                "type": "select",
                "options": ["Vapi.ai (Low Latency)", "Bland.ai (Enterprise)", "Retell AI", "Synthflow (No Code)", "Twilio Media Streams (Custom Python)", "Lainnya..."]
            },
            {
                "name": "CRM_INTEGRATION",
                "label": "Sync Hasil Call ke",
                "type": "select",
                "options": ["GoHighLevel (GHL)", "HubSpot", "Google Sheets", "Salesforce", "Slack Notification", "Lainnya..."]
            },
            {
                "name": "KNOWLEDGE_BASE",
                "label": "Sumber Pengetahuan Agent",
                "type": "select",
                "options": ["Dokumen Teks Manual (System Prompt)", "Upload PDF File (RAG)", "Website Knowledge Base", "Lainnya..."]
            }
        ]
    },
    "KOL-AUTO-010": {
        "nama": "Sistem Outreach Influencer & Affiliate",
        "desc": "Scrape influencer target -> Filter engagement -> Kirim DM/Email personal otomatis.",
        "persona": "Anda adalah Growth Hacking Engineer spesialis Influencer Marketing Automation.",
        "konteks": "Bangun mesin outreach ke {TARGET_INFLUENCER}. Ambil data dari {DATA_SOURCE} dan lakukan outreach via {OUTREACH_METHOD}.",
        "tugas": "Rancang Workflow Outreach: 1. Scraper Trigger (Hashtag/Niche), 2. Filter Kriteria (Follower/ER), 3. AI Personalization (Komentar foto terakhir), 4. Send Message (with rotation/delay).",
        "components": [
            {
                "name": "TARGET_INFLUENCER",
                "label": "Target Niche Influencer",
                "type": "select",
                "options": ["Instagram Micro-Influencer (Beauty/Fashion)", "TikTok Creators (Gadget/Tech)", "LinkedIn Key Opinion Leaders (B2B)", "Twitter/X Tech Community", "Lainnya..."]
            },
            {
                "name": "DATA_SOURCE",
                "label": "Sumber Data & Scraper",
                "type": "select",
                "options": ["Apify (Instagram/TikTok Scraper)", "HypeAuditor Export", "Phantombuster", "Scrape manual Google Sheets", "Lainnya..."]
            },
            {
                "name": "OUTREACH_METHOD",
                "label": "Metode Kontak",
                "type": "multiselect",
                "options": ["Direct Message (Instagram Automation)", "Cold Email (Instantly/SmartLead)", "LinkedIn Connection Request", "Comment di Post Terbaru", "Lainnya..."]
            }
        ]
    },
    "KOL-AUTO-011": {
        "nama": "Otomasi Reputasi & SEO Lokal (GBP)",
        "desc": "Auto-reply review Google Maps (Bintang 1-5 beda respon) & Auto-post update mingguan.",
        "persona": "Anda adalah Local SEO Automation Specialist.",
        "konteks": "Otomatisasi manajemen Google Business Profile. Tangani review masuk dengan {REVIEW_LOGIC} dan update konten berupa {CONTENT_UPDATE}.",
        "tugas": "Buat Blueprint Gmaps Automation: 1. Webhook New Review, 2. AI Sentiment Analysis, 3. Generate Reply (Professional/Apologetic), 4. Post Reply API, 5. Scheduled Post Generator.",
        "components": [
            {
                "name": "REVIEW_LOGIC",
                "label": "Strategi Balas Review",
                "type": "select",
                "options": ["Auto-Reply Semua Review (5 Bintang & 1 Bintang)", "Draft Only (Human Approval sebelum post)", "Auto-Reply 5 Bintang saja, 1 Bintang Alert Manager", "Eskalasi Review Buruk ke Slack", "Lainnya..."]
            },
            {
                "name": "CONTENT_UPDATE",
                "label": "Konten Gmaps Posts",
                "type": "multiselect",
                "options": ["Foto Produk Terbaru (Dari IG/Drive)", "Promo/Offer Mingguan", "Artikel Edukasi Singkat", "Testimoni Pelanggan (Repurposed)", "Lainnya..."]
            },
            {
                "name": "INTEGRATION_TOOL",
                "label": "Tools Integrator",
                "type": "select",
                "options": ["Make.com (Gmaps Module)", "Zapier", "N8n", "Publer/SocialPilot API", "Lainnya..."]
            }
        ]
    },
    "KOL-AUTO-012": {
        "nama": "Pipeline 'Gig Hunter' Otomatis",
        "desc": "Scrape RSS Upwork/Freelance -> Filter AI -> Draft Proposal -> Kirim Notif Slack Detik itu juga.",
        "persona": "Anda adalah Freelance Automation Expert yang mengerti cara memenangkan 'Speed-to-Lead' di platform gig.",
        "konteks": "Saya ingin memenangkan job di {JOB_PLATFORM}. Workflow harus menyaring job berdasarkan {FILTER_CRITERIA} dan melakukan {ACTION_ON_MATCH}.",
        "tugas": "Rancang Gig Hunter Bot: 1. RSS Feed Reader (Cek tiap 1 menit), 2. AI Filter (Apakah job ini relevan?), 3. AI Proposal Drafter (Cover Letter), 4. Slack/Telegram Alert dengan tombol 'Apply Now'.",
        "components": [
            {
                "name": "JOB_PLATFORM",
                "label": "Platform Pekerjaan",
                "type": "select",
                "options": ["Upwork (RSS Feed)", "Fiverr Buyer Requests", "LinkedIn Jobs", "WeWorkRemotely", "Freelancer.com", "Lainnya..."]
            },
            {
                "name": "FILTER_CRITERIA",
                "label": "Kriteria Filter AI",
                "type": "multiselect",
                "options": ["Budget > $1000", "Payment Verified Only", "Keyword Match (React/Python/SEO)", "Client Location (US/UK/EU)", "Rating Client Bintang 4.5+", "Lainnya..."]
            },
            {
                "name": "ACTION_ON_MATCH",
                "label": "Aksi Jika Job Cocok",
                "type": "select",
                "options": ["Kirim Notif Slack/Telegram + Draft Proposal", "Auto-Apply (Bahaya/Risiko Ban)", "Simpan ke Trello/Notion Pipeline", "Email ke Tim Sales", "Lainnya..."]
            }
        ]
    }
}

print("Generating 12 Frameworks (Including 4 NEW Money Making Workflows - Version 6.0)...")

for fw_id, data in frameworks.items():
    json_data = {
        "id_kerangka": fw_id,
        "nama_kerangka": data['nama'],
        "version": "6.0.0",
        "kategori": ["Koleksi & Inovasi", "Blueprint Workflow Otomasi"],
        "description": data['desc'],
        "perspektif_user": f"Saya ingin blueprint teknis untuk membangun workflow otomatisasi ini di N8n, Make.com, atau Zapier.",
        "ai_logic_description": data['persona'],
        "toolType": "planning",
        "output": "natural_language_prompt",
        "contoh_kalimat": f"Buatkan skema node-by-node untuk workflow {data['nama']} di {data['desc']}",
        "konteks_tambahan_instruksi_khusus": "FOKUS KE TEKNIS WORKFLOW DAN PROFITABILITAS: Jelaskan urutan Node, Trigger yang dipakai, Konfigurasi JSON/Webhook, Filter/Router, dan Action API. Berikan juga estimasi 'Time Saved' atau 'Profit Potential'. Gunakan istilah teknis platform otomasi.",
        "components": get_common_components() + data['components'],
        "komponen_prompt": {
            "PERAN": data['persona'],
            "KONTEKS": data['konteks'],
            "TUGAS": data['tugas'],
            "FORMAT_OUTPUT": "Dokumen Spesifikasi Workflow (Markdown):\n1. Deskripsi High-Level & Potensi Profit\n2. Diagram Alur (Mermaid)\n3. Daftar Node/Modul (Urutan Langkah)\n4. Konfigurasi Data Mapping (Variable A -> Field B)\n5. Prompt AI System (Jika menggunakan node AI/LLM)\n6. Manajemen Error & Notifikasi"
        }
    }
    
    filepath = frameworks_dir / f"{fw_id}.json"
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Created {fw_id}: {data['nama']}")

print("\nSelesai! 12 Framework siap digunakan.")
