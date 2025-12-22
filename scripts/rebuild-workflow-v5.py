import json
from pathlib import Path

# Base directory
frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Blueprint Workflow Otomasi")

# Pastikan direktori ada (nama kategori mungkin berubah dari script sebelumnya)
# Script sebelumnya menamai kategori "Blueprint Workflow Otomasi" di dalam file JSON, 
# tapi foldernya mungkin masih "KoleksiInovasi/Automation" atau perlu dipastikan pathnya.
# Cek path user: d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation
# User minta kategori baru, tapi biasanya folder fisik tidak berubah kecuali direname.
# Kita pakai folder fisik yang ada:
frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation")


# Helper komponen umum untuk semua workflow automation (EXPANDED)
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
                "Custom Python Script - Full Control",
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
                "Content Creation & Media",
                "Legal & Compliance",
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

# Helper function untuk inject "Lainnya..." ke options yang belum punya
def inject_lainnya(options):
    if "Lainnya..." not in options:
        options.append("Lainnya...")
    return options

# Definisi Framework Khusus Workflow Automation (N8n/Make/Zapier)
frameworks = {
    "KOL-AUTO-001": {
        "nama": "Workflow Lead Gen CRM (Ads ke WA)",
        "desc": "Otomatisasi pemindahan data leads dari FB/Google Ads -> Google Sheets -> kirim WA Follow-up otomatis.",
        "persona": "Anda adalah Automation Engineer spesialis Lead Management Flow yang ahli optimasi speed-to-lead.",
        "konteks": "Saya ingin memindahkan data leads dari {SOURCE_LEAD} ke {DESTINATION_CRM} dan melakukan notifikasi via {NOTIFICATION_CHANNEL}.",
        "tugas": "Buat dokumentasi teknis workflow: 1. Konfigurasi Webhook/Trigger, 2. Field Mapping (Parsing JSON), 3. Format Nomor HP, 4. Action API Request.",
        "components": [
            {
                "name": "SOURCE_LEAD",
                "label": "Sumber Leads (Trigger)",
                "type": "select",
                "options": ["Facebook Lead Ads (Instant Form)", "Google Lead Form", "Website Webhook (Elementor/WP)", "Typeform/Tally", "LinkedIn Lead Gen Form", "TikTok Instant Form", "Lainnya..."]
            },
            {
                "name": "DESTINATION_CRM",
                "label": "Tujuan Data (Database)",
                "type": "select",
                "options": ["Google Sheets / Airtable", "HubSpot CRM", "Notion Database", "Salesforce", "Pipedrive", "MySQL/PostgreSQL", "Lainnya..."]
            },
            {
                "name": "NOTIFICATION_CHANNEL",
                "label": "Channel Notifikasi/Follow-up",
                "type": "multiselect",
                "options": ["WhatsApp (Wozzap/Wati)", "Email (Gmail/SMTP)", "Slack/Telegram Alert", "SMS (Twilio)", "Discord Webhook", "Lainnya..."]
            }
        ]
    },
    "KOL-AUTO-002": {
        "nama": "Workflow Content Repurposing (AI)",
        "desc": "Satu konten utama -> dipecah AI jadi 10+ konten sosmed -> auto-post ke semua platform.",
        "persona": "Anda adalah AI Content Workflow Architect yang ahli menggunakan LLM Nodes di N8n/Make.",
        "konteks": "Saya ingin workflow yang mengambil konten dari {INPUT_CONTENT}, memprosesnya dengan {AI_MODEL} untuk di-posting ke {TARGET_PLATFORMS}.",
        "tugas": "Rancang Flow Otomasi AI: 1. Watch Folder/RSS, 2. Transkripsi (Whisper) / OCR, 3. Prompt Chain (Summarize -> Tone Change), 4. HTTP Request Posting.",
        "components": [
            {
                "name": "INPUT_CONTENT",
                "label": "Input Konten Utama",
                "type": "select",
                "options": ["Google Drive (Video/Audio File)", "YouTube RSS Feed", "Blog WordPress (Artikel Baru)", "Instagram Post", "Podcast Feed", "Notion Page", "Lainnya..."]
            },
            {
                "name": "AI_MODEL",
                "label": "Model AI Pemroses",
                "type": "select",
                "options": ["OpenAI GPT-4o", "Claude 3.5 Sonnet", "Gemini Pro", "Groq (Llama 3 - High Speed)", "Mistral Large", "Local LLM (Ollama)", "Lainnya..."]
            },
            {
                "name": "TARGET_PLATFORMS",
                "label": "Platform Tujuan Posting",
                "type": "multiselect",
                "options": ["LinkedIn Personal", "Twitter/X Thread", "Instagram Caption", "WordPress Draft", "Facebook Page", "Telegram Channel", "Medium Article", "Lainnya..."]
            }
        ]
    },
    "KOL-AUTO-003": {
        "nama": "Workflow E-commerce Order Handling",
        "desc": "New Order masuk -> auto-confirm WA -> print label -> update stok -> rekap keuangan.",
        "persona": "Anda adalah E-commerce Operations Automator yang ahli efisiensi fulfillment.",
        "konteks": "Saya butuh workflow handling order dari {STORE_PLATFORM}. Ketika ada order baru, workflow harus {ACTIONS}.",
        "tugas": "Buat Skema Workflow Order: 1. Webhook Listener Order Created, 2. Filter Lunas/Belum, 3. Iterasi Produk (Line Items), 4. Update Inventory & Kirim Notif.",
        "components": [
            {
                "name": "STORE_PLATFORM",
                "label": "Platform Toko Online",
                "type": "select",
                "options": ["WooCommerce (Webhook)", "Shopify", "Tokopedia (via Scraper/API)", "Shopee (via Scraper/API)", "OrderOnline", "Tiktok Shop", "Lainnya..."]
            },
            {
                "name": "ACTIONS",
                "label": "Aksi yang Diinginkan",
                "type": "multiselect",
                "options": ["Kirim Konfirmasi WA", "Input ke Google Sheet Keuangan", "Print Label Pengiriman (Biteship/RajaOngkir)", "Kurangi Stok di Database", "Kirim Invoice PDF", "Generate Discount Code Next Order", "Lainnya..."]
            },
            {
                "name": "PAYMENT_CHECK",
                "label": "Cek Pembayaran?",
                "type": "select",
                "options": ["Ya, Cek Status Payment Gateway (Xendit/Midtrans)", "Tidak, Anggap Semua Lunas (COD/Transfer)", "Ya, Cek Mutasi Bank (Moota/Cekmutasi)", "Ya, Manual Approval Dashboard"]
            }
        ]
    },
    "KOL-AUTO-004": {
        "nama": "Workflow AI Research Agent",
        "desc": "Input keyword -> Agent browsing Google -> Scrape 5 web teratas -> Rangkum jadi laporan.",
        "persona": "Anda adalah AI Agent Developer (LangChain Specialist) di N8n.",
        "konteks": "Bangun Research Agent yang menerima input {INPUT_TRIGGER}, melakukan riset menggunakan {RESEARCH_TOOLS}, dan menyimpan hasil di {OUTPUT_DEST}.",
        "tugas": "Rancang Agent Flow: 1. Input Trigger, 2. Google Search API, 3. HTTP Request (Get HTML), 4. HTML to Text, 5. LLM Summarization (Map-Reduce), 6. Save Report.",
        "components": [
            {
                "name": "INPUT_TRIGGER",
                "label": "Pemicu Riset",
                "type": "select",
                "options": ["Form Request (Tally/Typeform)", "Pesan Telegram Bot", "Slack Command", "Jadwal Mingguan (Cron)", "Email Masuk", "Notion Label Change", "Lainnya..."]
            },
            {
                "name": "RESEARCH_TOOLS",
                "label": "Tools Riset/Search",
                "type": "multiselect",
                "options": ["Serper.dev / SerpApi (Google Search)", "ScrapingBee / ZenRows (Scraper)", "Perplexity API", "Wikipedia API", "Exa.ai (Neural Search)", "Youtube Transcript", "Lainnya..."]
            },
            {
                "name": "OUTPUT_DEST",
                "label": "Tujuan Laporan",
                "type": "select",
                "options": ["Notion Page", "Google Docs", "Email Digest", "Slack Channel", "PDF Report", "Airtable Record", "Lainnya..."]
            }
        ]
    },
    "KOL-AUTO-005": {
        "nama": "Workflow Client Onboarding",
        "desc": "Pembayaran diterima -> Kirim Kontrak -> Buat Folder Drive -> Invite Slack -> Kirim Welcome Email.",
        "persona": "Anda adalah Business Operations Automator.",
        "konteks": "Otomatiskan onboarding klien baru. Trigger pembayaran dari {PAYMENT_SOURCE}. Workflow harus menyiapkan {ONBOARDING_ASSETS}.",
        "tugas": "Buat Blueprint Onboarding: 1. Payment Watcher, 2. Generate PDF Contract, 3. Create Folder/Workspace, 4. Send Email Credentials.",
        "components": [
            {
                "name": "PAYMENT_SOURCE",
                "label": "Sumber Pembayaran",
                "type": "select",
                "options": ["Stripe Webhook", "PayPal IPN", "Transfer Manual (Form Upload Bukti)", "Xendit Invoice", "Mayar.id", "Wise Transfer", "Lainnya..."]
            },
            {
                "name": "ONBOARDING_ASSETS",
                "label": "Aset yang Disiapkan",
                "type": "multiselect",
                "options": ["Folder Google Drive/Dropbox", "Board Trello/ClickUp/Asana", "Channel Slack/Discord", "Akun Login Portal", "Welcome Kit PDF", "Jadwal Kickoff Meeting", "Lainnya..."]
            },
            {
                "name": "CONTRACT_SIGN",
                "label": "Tanda Tangan Kontrak",
                "type": "select",
                "options": ["Tidak Perlu", "DocuSign / PandaDoc (Auto-send)", "E-sign PDF sederhana", "Zoho Sign", "Lainnya..."]
            }
        ]
    },
    "KOL-AUTO-006": {
        "nama": "Workflow Monitoring Kompetitor",
        "desc": "Scrape website kompetitor tiap hari -> Cek perubahan harga/promo -> Alert jika lebih murah.",
        "persona": "Anda adalah Web Scraper & Automation Analyst.",
        "konteks": "Saya ingin memonitor {TARGET_DIPANTAU} menggunakan {SCRAPING_METHOD}. Jika ada perubahan {CHANGE_TYPE}, kirim alert segera.",
        "tugas": "Rancang Monitoring Flow: 1. Schedule Trigger, 2. Fetch Page HTML, 3. Selector Extraction (Cheerio), 4. Get Data from DB (Previous), 5. Compare Logic, 6. If Changed -> Alert + Update DB.",
        "components": [
            {
                "name": "TARGET_DIPANTAU",
                "label": "Apa yang Dipantau?",
                "type": "select",
                "options": ["Harga Produk E-commerce", "Artikel Blog Baru", "Ketersediaan Stok", "Jumlah Follower Sosmed", "Perubahan Copywriting Landing Page", "Ad Library Updates", "Lainnya..."]
            },
            {
                "name": "SCRAPING_METHOD",
                "label": "Metode Scraping",
                "type": "select",
                "options": ["HTTP Request Sederhana (N8n/Make)", "Apify Actor", "Browserless.io (Puppeteer)", "ScrapingBee", "BrightData", "Lainnya..."]
            },
            {
                "name": "CHANGE_TYPE",
                "label": "Kondisi Trigger Alert",
                "type": "select",
                "options": ["Harga Turun", "Harga Berubah (Naik/Turun)", "Ada Keyword Tertentu", "Stok Habis", "Konten Baru Terdeteksi", "Lainnya..."]
            }
        ]
    },
    "KOL-AUTO-007": {
        "nama": "Workflow Webinar/Event Funnel",
        "desc": "Daftar Event -> Save Contact -> Tunggu H-1 -> Kirim Reminder WA -> Follow-up Absensi.",
        "persona": "Anda adalah Event Marketing Automator.",
        "konteks": "Bangun flow webinar otomatis. Pendaftar dari {REGISTRATION_PAGE}. Kirim reminder via {REMINDER_CHANNELS}. Setelah event, pisahkan yang hadir dan tidak.",
        "tugas": "Buat Event Workflow: 1. Webhook Pendaftaran, 2. Add to CRM (Tag: Registered), 3. Calculate Delay (H-1, H-1Jam), 4. Kirim Reminder, 5. Post-Event Tagging.",
        "components": [
            {
                "name": "REGISTRATION_PAGE",
                "label": "Halaman Pendaftaran",
                "type": "select",
                "options": ["Zoom Webinar Registration", "Eventbrite", "Google Form / Tally", "Landing Page Custom (Elementor)", "Lu.ma", "Lainnya..."]
            },
            {
                "name": "REMINDER_CHANNELS",
                "label": "Channel Reminder",
                "type": "multiselect",
                "options": ["WhatsApp (Paling Efektif)", "Email Blast", "SMS", "Calendar Invite (.ics)", "Telegram Bot", "Lainnya..."]
            },
            {
                "name": "CRITICAL_TIMING",
                "label": "Waktu Reminder Penting",
                "type": "multiselect",
                "options": ["H-24 Jam", "H-1 Jam", "H-15 Menit (Live Now)", "H-7 Hari (Pemanasan)", "Pasca-Event (Replay)", "Lainnya..."]
            }
        ]
    },
    "KOL-AUTO-008": {
        "nama": "Workflow Architect (Custom Universal)",
        "desc": "Bangun workflow custom apapun. Trigger -> Logic -> Action. Dengan diagram Mermaid.",
        "persona": "Anda adalah Senior Solution Architect untuk N8n, Make.com, dan Zapier.",
        "konteks": "Saya butuh rancangan workflow custom untuk {CUSTOM_GOAL}. Melibatkan aplikasi: {APP_LIST}.",
        "tugas": "Sebagai Arsitek Workflow, buat blueprint lengkap: 1. High Level Logic, 2. Diagram Mermaid (Flowchart), 3. pseudocode konfigurasi setiap node, 4. Penanganan Error (Error Handling).",
        "components": [
            {
                "name": "CUSTOM_GOAL",
                "label": "Tujuan Workflow",
                "type": "textarea",
                "placeholder": "Jelaskan dengan detail apa yang ingin diotomatisasi. Contoh: 'Ambil email masuk, cek lampiran PDF, ekstrak teksnya, simpan ke database, lalu balas email terima kasih'",
                "validation": {"min_length": 10}
            },
            {
                "name": "APP_LIST",
                "label": "Aplikasi yang Terlibat",
                "type": "text",
                "placeholder": "Contoh: Gmail, PDF.co, MySQL, ChatGPT"
            },
            {
                "name": "ERROR_HANDLING",
                "label": "Penanganan Error",
                "type": "select",
                "options": ["Basic (Stop & Log)", "Retry (Coba 3x)", "Advanced (Ignore & Alert via Slack)", "Rollback Data", "Human Intervention Trigger", "Lainnya..."]
            }
        ]
    }
}

print("Mulai Menulis 8 Framework Workflow Otomasi V5 (Expanded)...\n")

for fw_id, data in frameworks.items():
    json_data = {
        "id_kerangka": fw_id,
        "nama_kerangka": data['nama'],
        "version": "5.0.0",
        "kategori": ["Koleksi & Inovasi", "Blueprint Workflow Otomasi"],
        "description": data['desc'],
        "perspektif_user": f"Saya ingin blueprint teknis untuk membangun workflow otomatisasi ini di N8n, Make.com, atau Zapier.",
        "ai_logic_description": data['persona'],
        "toolType": "planning",
        "output": "natural_language_prompt",
        "contoh_kalimat": f"Buatkan skema node-by-node untuk workflow {data['nama']} di {data['desc']}",
        "konteks_tambahan_instruksi_khusus": "FOKUS KE TEKNIS WORKFLOW: Jelaskan urutan Node, Trigger yang dipakai, Konfigurasi JSON/Webhook, Filter/Router, dan Action API. Jangan berikan strategi marketing, berikan STRATEGI OTOMASI (Logical Flow). Gunakan istilah N8n/Make (Trigger, Module, Node, Router).",
        "components": get_common_components() + data['components'],
        "komponen_prompt": {
            "PERAN": data['persona'],
            "KONTEKS": data['konteks'],
            "TUGAS": data['tugas'],
            "FORMAT_OUTPUT": "Dokumen Spesifikasi Workflow (Markdown):\n1. Diagram Alur (Mermaid)\n2. Daftar Node/Modul (Urutan Langkah)\n3. Konfigurasi Data Mapping (Variable A -> Field B)\n4. Filter Logic (Conditions)\n5. Contoh JSON Data Structure"
        }
    }
    
    filepath = frameworks_dir / f"{fw_id}.json"
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Created {fw_id}: {data['nama']}")

print("\nSelesai! Framework V5 Updated: Expanded Options + Lainnya Support.")
