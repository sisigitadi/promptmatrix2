import json
from pathlib import Path
import datetime
import os

# Base directory
output_dir = r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Blueprint Workflow Otomasi"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Helper komponen umum
def get_common_components():
    return [
        {
            "name": "OPTIMIZATION_GOAL",
            "label": "Prioritas Optimasi (Trade-off)",
            "type": "select",
            "options": [
                "Cost Minimization (Efisiensi Biaya/Gratis)",
                "Reliability & Security (Kestabilan Enterprise)",
                "Speed to Market (Kecepatan Implementasi MVP)",
                "Scalability & High Throughput (Siap Volume Besar)",
                "User Experience (Kemudahan Pengguna)"
            ],
            "description": "Apa metrik kesuksesan utama workflow ini? Mengarahkan AI dalam memilih tools.",
            "info": "Menentukan strategi arsitektur yang akan dipilih AI (misal: tool murah vs tool stabil)."
        },
        {
            "name": "PLATFORM_OTOMASI",
            "label": "Platform Otomasi Utama",
            "type": "select",
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
            "description": "Platform mana yang akan digunakan?",
            "info": "Platform tempat workflow ini akan dibangun."
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
            ],
            "info": "Seberapa rumit logika workflow yang Anda bayangkan?"
        },
        {
            "name": "INDUSTRY_SECTOR",
            "label": "Sektor Industri",
            "type": "select",
            "options": [
                "E-commerce & Retail (Ritel)",
                "SaaS & Technology (Teknologi)",
                "Agency & Service Business (Jasa)",
                "Real Estate & Property (Properti)",
                "Finance & Fintech (Keuangan)",
                "Healthcare & Medical (Kesehatan)",
                "Education & EdTech (Pendidikan)",
                "F&B (Restoran/Cafe)",
                "Local Services (Bengkel/Salon/Jasa Lokal)",
                "Media & Content Creator",
                "HR & Recruitment (SDM)",
                "Lainnya..."
            ],
            "info": "Industri target untuk menyesuaikan terminologi bisnis."
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
            ],
            "info": "Estimasi beban kerja untuk perhitungan biaya server/API."
        }
    ]

def get_instruction_component():
    return [
        {
            "name": "ADDITIONAL_INSTRUCTIONS",
            "label": "Instruksi Tambahan",
            "type": "textarea",
            "placeholder": "Contoh: Jangan gunakan Google Sheets, ganti dengan Airtable. Atau: Pastikan notifikasi dikirim hanya pada jam kerja.",
            "description": "Detail spesifik atau batasan khusus yang ingin Anda tambahkan.",
            "optional": True,
            "info": "Tambahkan aturan khusus, preferensi tools, atau constraint yang tidak ada di pilihan di atas."
        }
    ]

# Definisi 4 Super-Framework Workflow Otomasi (Consolidated)
frameworks = {
    # 1. SALES, BUSINESS OPS & FINANCE ENGINE
    "KOL-AUTO-001": {
        "nama": "Mesin Operasional Bisnis, Penjualan & Keuangan",
        "desc": "Sistem terpadu untuk mengotomatisasi pendapatan dan operasional: Sales, Property/Real Estate, Support, hingga Keuangan.",
        "persona": "Anda adalah Chief Revenue Operations (RevOps) Architect yang ahli merancang funnels konversi dan efisiensi back-office.",
        "konteks": "Saya ingin membangun 'Business Ops Engine' otomatis. Fokus utama workflow ini adalah pada {REVENUE_FOCUS}. Input data berasal dari {ENTRY_POINT}, dan akan diproses untuk {ACTION_GOAL}.",
        "tugas": "Rancang Technical Blueprint untuk Flow ini: 1. Trigger Definition, 2. Qualification/Validation/OCR Logic, 3. Database Sync, 4. Notification & Action Sequence. Sertakan Error Handling.",
        "components": [
            {
                "name": "REVENUE_FOCUS", 
                "label": "Fokus Utama", 
                "type": "select", 
                "options": ["Lead Generation & Follow-up (CRM)", "Real Estate Lead & Tenant Screening (Properti)", "E-commerce Order Fulfillment (Pesanan)", "Customer Support Triage & Auto-Reply", "Finance & Expense Management (OCR/Keuangan)", "Client Onboarding & Contracts", "Cold Outreach (Email/DM/Voice)", "Lainnya..."], 
                "info": "Jenis alur bisnis apa yang ingin diotomatisasi?"
            },
            {
                "name": "ENTRY_POINT", 
                "label": "Sumber Pemicu (Trigger)", 
                "type": "select", 
                "options": ["Ads Lead Form / Webhook", "Property Portal Inquiry (Zillow/Realtor)", "New Support Ticket (Zendesk/WA)", "Uploaded Invoice/Receipt Image", "Checkout Success (Stripe/Bank Transfer)", "Booking Submission", "Manual Input", "Lainnya..."], 
                "info": "Dari mana proses ini dimulai?"
            },
            {
                "name": "ACTION_GOAL", 
                "label": "Tujuan/Aksi Utama", 
                "type": "multiselect", 
                "options": ["Update CRM & Voice Call Follow-up", "Schedule Property Tour & Qualify", "Dispatch Vendor/Technician (Kirim Teknisi)", "Auto-Escalate to Human Agent (Eskalasi)", "OCR Extract & Sync to Accounting App", "Generate Invoice & Drive Folder", "Voice Call AI (Vapi.ai)", "Send Digital Contract (eSign)", "Lainnya..."], 
                "info": "Apa hasil akhir yang diharapkan dari robot ini?"
            }
        ]
    },

    # 2. CONTENT, COMMUNITY & COURSE OPS
    "KOL-AUTO-002": {
        "nama": "Pabrik Konten, Komunitas & Kursus Online",
        "desc": "Mesin produksi konten otomatis, manajemen komunitas, dan operasional kursus/edukasi tanpa kerja manual berulang.",
        "persona": "Anda adalah AI Creative Director & Community Ops Manager.",
        "konteks": "Saya ingin membangun 'Content & Community Engine' untuk {CONTENT_GOAL}. Sumber materi berasal dari {SOURCE_MATERIAL}. Distribusi akhir ke {DISTRIBUTION_CHANNELS}.",
        "tugas": "Buat Arsitektur Automation: 1. Ingest Source, 2. AI Processing (Scripting/Moderation/Grading), 3. Quality Check, 4. Posting/Delivery/Certification.",
         "components": [
            {
                "name": "CONTENT_GOAL", 
                "label": "Tujuan Workflow", 
                "type": "select", 
                "options": ["Repurpose Video Panjang ke Shorts/Reels", "Community Moderation & Engagement", "Course Student Onboarding & Certs", "Faceless Video Production (Full AI)", "News Aggregation & Newsletter", "Reputation & Review Management (GBP)", "Lainnya..."], 
                "info": "Jenis mesin konten/komunitas apa yang ingin dibangun?"
            },
            {
                "name": "SOURCE_MATERIAL", 
                "label": "Bahan Baku / Pemicu", 
                "type": "select", 
                "options": ["Zoom/YouTube Recordings", "New Member Introduction Post", "Course Completion Trigger", "RSS Feed News/Blog", "User Reviews (Google Maps)", "Lainnya..."], 
                "info": "Apa input mentah yang akan diolah oleh AI?"
            },
            {
                "name": "DISTRIBUTION_CHANNELS", 
                "label": "Output / Aksi", 
                "type": "multiselect", 
                "options": ["TikTok/Reels/Shorts Posting", "Generate PDF Certificate (Sertifikat)", "Direct Message (Member Welcome)", "Email Newsletter", "Automated Review Reply (Balas Ulasan)", "Lainnya..."], 
                "info": "Di mana hasil akhirnya akan tayang atau dikirim?"
            }
        ]
    },

    # 3. RESEARCH & MARKET INTELLIGENCE ENGINE (Dipecah & Spesifik)
    "KOL-AUTO-003": {
        "nama": "Mesin Riset & Intelijen Pasar",
        "desc": "Spesialis riset pasar, analisis kompetitor, monitoring berita tren, dan sintesa data strategis.",
        "persona": "Anda adalah Strategic Market Researcher & Data Analyst dengan keahlian OSINT (Open Source Intelligence).",
        "konteks": "Saya membutuhkan sistem 'Market Intelligence' untuk melakukan {RESEARCH_MISSION}. Sistem harus mengumpulkan data dari {DATA_SOURCE} dan menerapkan metode analisis {ANALYSIS_FRAMEWORK}.",
        "tugas": "Rancang Technical Blueprint untuk mesin riset otomatis. Alur: 1. Data Collection/Scraping, 2. AI Processing/Summarization, 3. Insight Extraction, 4. Reporting.",
         "components": [
            {
                "name": "RESEARCH_MISSION", 
                "label": "Tujuan Riset (Misi)", 
                "type": "select", 
                "options": ["Competitor Price & Feature Monitoring (Pantau Pesaing)", "Deep Dive Industry Trends & Virality (Tren Industri)", "Customer Sentiment & Voice of Customer (Suara Pelanggan)", "News Aggregation & Summarization (Ringkasan Berita)", "Academic/Scientific Paper Research (Jurnal Ilmiah)", "Regulatory Change Monitoring (Regulasi)", "Lainnya..."], 
                "info": "Apa insight strategis yang ingin didapatkan?"
            },
            {
                "name": "DATA_SOURCE", 
                "label": "Sumber Data Target", 
                "type": "select", 
                "options": ["Google Search API & News", "Competitor Websites (Scraping)", "Social Media Feeds (X/Reddit/TikTok)", "Industry Reports (PDF/CSV)", "Review Aggregators (G2/Capterra)", "Government/Regulatory Database", "Lainnya..."], 
                "info": "Dari mana data mentah akan diambil?"
            },
            {
                "name": "ANALYSIS_FRAMEWORK", 
                "label": "Kerangka Analisis", 
                "type": "multiselect", 
                "options": ["SWOT Analysis (Strength/Weakness)", "PESTEL (Macro-environmental)", "Sentiment Analysis (Pos/Neg/Neu)", "Feature Comparison Matrix (Perbandingan)", "Price Fluctuation Alerting (Deteksi Harga)", "Key Topic Extraction & Clustering", "Lainnya..."], 
                "info": "Model mental apa yang harus digunakan AI?"
            }
        ]
    },

    # 4. IT, DEVOPS & PRODUCT ENGINEERING ENGINE (Baru)
    "KOL-AUTO-004": {
        "nama": "Mesin IT, DevOps & Rekayasa Produk",
        "desc": "Otomasi untuk tim teknis: Incident Response, Log Analysis, Github Automation, hingga Product Feedback Loop.",
        "persona": "Anda adalah Senior DevOps Engineer & Product Operations Specialist.",
        "konteks": "Saya ingin mengotomatisasi workflow teknis untuk {TECH_MISSION}. Sistem akan berinteraksi dengan {TECH_STACK} dan harus menangani logika {ENGINEERING_LOGIC}.",
        "tugas": "Rancang Architecture Diagram & Blueprint. Pastikan mencakup Error Handling, Retry Logic, dan Security Best Practices.",
         "components": [
            {
                "name": "TECH_MISSION", 
                "label": "Misi Teknikal (Ops)", 
                "type": "select", 
                "options": ["Automated Incident Response (Respon Insiden SRE)", "Server Log Anomaly Detection (Deteksi Anomali)", "Git PR Review & Compliance Check", "Automated QA & Bug Reporting (Laporan Bug)", "Feature Extraction from Support Tickets", "Database Health Monitoring", "Security Vulnerability Scan (DevSecOps)", "Lainnya..."], 
                "info": "Masalah operasional apa yang ingin diselesaikan?"
            },
            {
                "name": "TECH_STACK", 
                "label": "Tech Stack / Tools", 
                "type": "multiselect", 
                "options": ["AWS / CloudWatch / Lambda", "Kubernetes / Docker", "GitHub / GitLab", "Jira / Linear", "PagerDuty / OpsGenie", "Sentry / Datadog", "Slack / Discord Webhooks", "PostgreSQL / MongoDB", "Lainnya..."], 
                "info": "Tools apa saja yang terlibat?"
            },
            {
                "name": "ENGINEERING_LOGIC", 
                "label": "Logika Pemrosesan", 
                "type": "multiselect", 
                "options": ["Root Cause Analysis (RCA - Akar Masalah)", "Severity Classification (P1-P5)", "Code Syntax & Style Check", "SQL Query Optimization Suggestion", "User Story Generation from Feedback", "Auto-Restart Service Logic", "Lainnya..."], 
                "info": "Logika spesifik apa yang harus dijalankan?"
            }
        ]
    },

    # 5. LEGAL, HR & CORPORATE COMPLIANCE ENGINE (Baru)
    "KOL-AUTO-005": {
        "nama": "Mesin Legal, HR & Kepatuhan Perusahaan",
        "desc": "Sistem pendukung operasional back-office: Review kontrak, rekrutmen otomatis, dan kepatuhan regulasi.",
        "persona": "Anda adalah Legal Ops Manager & HR Automation Architect.",
        "konteks": "Saya membangun sistem otomasi administrasi untuk {ADMIN_GOAL}. Dokumen utama yang diproses adalah {DOCUMENT_TYPE}. Sistem harus memeriksa aspek {COMPLIANCE_CHECK}.",
        "tugas": "Buat Blueprint Workflow Administrasi yang aman dan akurat. Fokus pada Data Privacy dan Accuracy.",
         "components": [
            {
                "name": "ADMIN_GOAL", 
                "label": "Tujuan Administrasi", 
                "type": "select", 
                "options": ["Legal Contract Review & Redlining", "Candidate CV Screening (Rekrutmen)", "Supplier/Vendor Due Diligence", "Employee Onboarding Sequence", "Expense & Invoice Audit (Keuangan)", "NDA/Letter Generation (Surat Otomatis)", "Internal Policy Q&A Bot", "Lainnya..."], 
                "info": "Proses admin apa yang lambat dan perlu diotomatisasi?"
            },
            {
                "name": "DOCUMENT_TYPE", 
                "label": "Dokumen Terkait", 
                "type": "select", 
                "options": ["Kontrak Kerjasama (MSA/NDA)", "CV / Resume Kandidat (PDF)", "Invoice / Kwitansi", "Proposal Vendor", "Employee Handbook / SOP", "Government Regulations (UU/Permen)", "Lainnya..."], 
                "info": "Jenis dokumen apa yang menjadi input utama?"
            },
            {
                "name": "COMPLIANCE_CHECK", 
                "label": "Standar / Poin Cek", 
                "type": "multiselect", 
                "options": ["Risk Clause Detection (Pasal Berisiko)", "Skill & Experience Matching Score", "Budget & Pricing Validation", "GDPR / Data Privacy Check", "Missing Signature/Field Check", "Expiration Date Monitoring", "Lainnya..."], 
                "info": "Apa yang harus divalidasi oleh AI?"
            }
        ]
    },

    # 6. UNIVERSAL CUSTOM (Pindahan)
    "KOL-AUTO-006": {
        "nama": "Arsitek Workflow Kustom Universal",
        "desc": "Blueprint fleksibel untuk merancang logika workflow unik apapun yang tidak tercaakup dalam kategori spesifik.",
        "persona": "Anda adalah Senior Solution Architect dengan spesialisasi System Integration.",
        "konteks": "Workflow custom untuk {CUSTOM_GOAL} yang melibatkan aplikasi {APP_LIST}.",
        "tugas": "Buat Blueprint Lengkap: Logic Flow, Mermaid Diagram, Node Configuration, dan Error Handling Recommendations.",
         "components": [
            {"name": "CUSTOM_GOAL", "label": "Tujuan Workflow", "type": "textarea", "placeholder": "Jelaskan detail apa yang ingin diotomatisasi...", "info": "Jelaskan use-case unik Anda secara spesifik."},
            {"name": "APP_LIST", "label": "Aplikasi Terlibat", "type": "text", "placeholder": "Gmail, Slack, Custom API, dll", "info": "Daftar aplikasi yang perlu dihubungkan."}
        ]
    }
}

print("Generating 6 Defined Frameworks (Version 7.9.7 Split & Refined)...")

def rebuild_frameworks():
    for fw_id, data in frameworks.items():
        
        # 1. Logic Hybrid & Seamless: Masukkan parameter mindset ke Persona saja (Token Efficiency)
        raw_persona = data['persona']
        dynamic_persona = f"{raw_persona} [Orientasi strategis: **{{OPTIMIZATION_GOAL}}**]. [Sektor target: **{{INDUSTRY_SECTOR}}**]. [Volume ekspektasi: **{{DATA_VOLUME}}**]. [Gunakan platform **{{PLATFORM_OTOMASI}}** dengan kompleksitas **{{COMPLEXITY}}**]."
        
        # 2. SOP: Otomatisasi dynamicSubcomponents untuk opsi 'Lainnya...'
        dynamic_subs = []
        all_root_components = data['components'] + get_common_components() + get_instruction_component()
        
        for comp in all_root_components:
            if comp.get('type') in ['select', 'multiselect'] and "Lainnya..." in comp.get('options', []):
                dynamic_subs.append({
                    "trigger": comp['name'],
                    "options": {
                        "Lainnya...": [
                            {
                                "name": f"custom_{comp['name']}",
                                "label": f"Sebutkan {comp['label']} Lainnya",
                                "type": "text",
                                "description": f"Ketik manual nilai kustom untuk {comp['label']}.",
                                "placeholder": "Contoh: API Kustom, App Baru, dll...",
                                "optional": False,
                                "validation": {"min_length": 2},
                                "info": f"Input manual jika pilihan {comp['label']} standar tidak tersedia."
                            }
                        ]
                    }
                })

        # Gabungkan subkomponen manual dari data (jika ada) ke yang otomatis
        if "dynamicSubcomponents" in data:
            if isinstance(data["dynamicSubcomponents"], list):
                dynamic_subs.extend(data["dynamicSubcomponents"])
            else:
                dynamic_subs.append(data["dynamicSubcomponents"])

        json_data = {
            "id_kerangka": fw_id,
            "nama_kerangka": data['nama'],
            "version": "7.9.8",
            "kategori": ["Koleksi & Inovasi", "Blueprint Workflow Otomasi"],
            "description": data['desc'],
            "perspektif_user": f"Bantu saya merancang sistem otomasi {data['nama']} [menggunakan {{{{PLATFORM_OTOMASI}}}}].",
            "ai_logic_description": dynamic_persona,
            "toolType": "planning",
            "output": "natural_language_prompt",
            "contoh_kalimat": f"Rancang workflow untuk {data['nama']} di sektor {{{{INDUSTRY_SECTOR}}}}.",
            "components": all_root_components,
            "komponen_prompt": {
                "PERAN": dynamic_persona, 
                "KONTEKS": f"{data['konteks']} [Input tambahan: {{ADDITIONAL_INSTRUCTIONS}}].", 
                "TUGAS": data['tugas'],
                "FORMAT_OUTPUT": """### 🛠️ AUTOMATION ARCHITECTURE: {{nama_kerangka}}

**1. Executive Strategy**
- **Core Strategy:** {{OPTIMIZATION_GOAL}}
- **Tool Selection:** {{PLATFORM_OTOMASI}}
- **Domain Context:** {{INDUSTRY_SECTOR}}

**2. Flow Architecture (Mermaid)**
```mermaid
graph TD;
    T([Trigger]) --> P1[Process 1];
    P1 --> C{Condition};
    C -- Yes --> A1[Action 1];
    C -- No --> A2[Action 2];
```

**3. Node Configuration Details**
- **Node Type:** [Trigger/Action/Logic]
- **Platform Specific:** {{PLATFORM_OTOMASI}}
- **JSON Mapping:** [Key-Value Pairs]

**4. Scalability & Error Handling**
- [ ] Implement Logging
- [ ] Setup Error Alerts
- [ ] Auto-retry Logic [via {{PLATFORM_OTOMASI}}]
"""
            },
            "dynamicSubcomponents": dynamic_subs,
            "konteks_tambahan_instruksi_khusus": "Pastikan output berfokus pada langkah teknis yang praktis dan segera dapat diimplementasikan.\n\n[Instruksi Khusus]: {ADDITIONAL_INSTRUCTIONS}",
            "examples": [],
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Save file
        filename = f"Koleksi & Inovasi-Blueprint Workflow Otomasi-{fw_id}.json"
        filepath = os.path.join(output_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Created/Updated {fw_id}: {data['nama']}")

    print(f"Selesai! {len(frameworks)} Framework Consolidated diupdate dengan SOP Hybrid & Seamless.")

if __name__ == "__main__":
    rebuild_frameworks()
