import json
from pathlib import Path

# Base directory
frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation")

# Common components
def get_common_components():
    return [
        {
            "name": "BUSINESS_GOAL",
            "label": "Target Bisnis Utama",
            "type": "text",
            "description": "Apa tujuan spesifik yang ingin dicapai dengan otomasi ini?",
            "placeholder": "Contoh: Meningkatkan response time, Mengurangi churn 5%, Hemat 20 jam/minggu",
            "validation": {"min_length": 5, "max_length": 200}
        },
        {
            "name": "BUDGET_RANGE",
            "label": "Anggaran Implementasi",
            "type": "select",
            "default": "$100-$500/bulan (Skala Kecil)",
            "options": [
                "<$100/bulan (Bootstrap)",
                "$100-$500/bulan (Skala Kecil)",
                "$500-$2000/bulan (Skala Menengah)",
                "$2000+/bulan (Enterprise)"
            ]
        }
    ]

# Framework Definitions
frameworks = {
    "KOL-AUTO-002": {
        "nama": "Mesin Pemasaran Konten Bertenaga AI",
        "desc": "Produksi 20-30 konten berkualitas tinggi per bulan dengan otomasi AI. ROI: 150-300%.",
        "persona": "Anda adalah Spesialis Otomasi Konten & SEO Strategist.",
        "konteks": "Pengguna butuh sistem produksi konten otomatis untuk mencapai {BUSINESS_GOAL}.",
        "tugas": "Rancang Content Automation Engine yang mencakup: 1. Ideation & Keyword Research (Auto), 2. Drafting (AI-Assisted), 3. Distribution (Multi-channel).",
        "components": [
            {
                "name": "CONTENT_TYPE",
                "label": "Jenis Konten Utama",
                "type": "multiselect",
                "options": ["Blog Post (SEO)", "LinkedIn Posts", "Twitter Threads", "Instagram Reels Script", "Newsletter"]
            },
            {
                "name": "CONTENT_VOLUME",
                "label": "Target Volume Konten",
                "type": "select",
                "options": ["5-10 post/bulan", "10-20 post/bulan", "20-50 post/bulan", "50+ post/bulan"]
            },
            {
                "name": "BRAND_VOICE",
                "label": "Suara Brand (Brand Voice)",
                "type": "textarea",
                "placeholder": "Professional, Witty, Authoritative, Friendly, dll."
            }
        ]
    },
    "KOL-AUTO-003": {
        "nama": "Dashboard Business Intelligence Real-Time",
        "desc": "Agregasi data real-time untuk pengambilan keputusan cepat. ROI: 250-450%.",
        "persona": "Anda adalah Data Architect & BI Specialist.",
        "konteks": "Pengguna ingin membangun BI Dashboard untuk memantau {BUSINESS_GOAL}. Data sources: {DATA_SOURCES}.",
        "tugas": "Rancang arsitektur BI Dashboard: 1. Data Ingestion (ETL), 2. Data Warehousing, 3. Visualization Layer.",
        "components": [
            {
                "name": "DATA_SOURCES",
                "label": "Sumber Data",
                "type": "multiselect",
                "options": ["CRM (HubSpot/Salesforce)", "Ads (FB/Google)", "Payment Gateway (Stripe/Xendit)", "Database SQL", "Google Sheets"]
            },
            {
                "name": "KEY_METRICS",
                "label": "Metrik Kunci (KPI)",
                "type": "textarea",
                "placeholder": "MRR, Churn Rate, CAC, LTV, Daily Active Users"
            },
            {
                "name": "UPDATE_FREQUENCY",
                "label": "Frekuensi Update Data",
                "type": "select",
                "options": ["Real-time", "Setiap Jam", "Harian (EOD)", "Mingguan"]
            }
        ]
    },
    "KOL-AUTO-004": {
        "nama": "Otomasi Customer Support Omnichannel",
        "desc": "Support 24/7 dengan AI Chatbot & Smart Routing. ROI: 200-350%.",
        "persona": "Anda adalah Head of Customer Experience & Automation Architect.",
        "konteks": "Pengguna ingin mengotomatiskan support untuk {BUSINESS_GOAL} di channel {SUPPORT_CHANNELS}.",
        "tugas": "Buat blueprint Support Automation: 1. AI Chatbot Flow, 2. Human Handoff Protocol, 3. Ticket Management.",
        "components": [
            {
                "name": "SUPPORT_CHANNELS",
                "label": "Channel Support",
                "type": "multiselect",
                "options": ["WhatsApp", "Instagram DM", "Email", "Live Chat Website", "Facebook Messenger"]
            },
            {
                "name": "AVG_TICKET_VOLUME",
                "label": "Volume Tiket Rata-rata",
                "type": "select",
                "options": ["<50 tiket/hari", "50-200 tiket/hari", "200-500 tiket/hari", "500+ tiket/hari"]
            },
            {
                "name": "COMMON_ISSUES",
                "label": "Masalah Umum Pelanggan",
                "type": "textarea",
                "placeholder": "Status pesanan, Refund, Info produk, Masalah login"
            }
        ]
    },
    "KOL-AUTO-005": {
        "nama": "Sistem Pemulihan Keranjang Belanja E-commerce",
        "desc": "Recover 15-30% lost sales otomatis. ROI: 200-400%.",
        "persona": "Anda adalah E-commerce Conversion Specialist.",
        "konteks": "Pengguna ingin recover lost sales ({BUSINESS_GOAL}) menggunakan {RECOVERY_CHANNELS}.",
        "tugas": "Rancang Cart Recovery System: 1. Trigger Logic, 2. Multi-channel Sequence, 3. Incentive Strategy (Diskon/Urgency).",
        "components": [
            {
                "name": "ECOMMERCE_PLATFORM",
                "label": "Platform E-commerce",
                "type": "select",
                "options": ["Shopify", "WooCommerce", "Tokopedia/Shopee (Manual/API)", "Custom Website", "Magento"]
            },
            {
                "name": "RECOVERY_CHANNELS",
                "label": "Channel Pemulihan",
                "type": "multiselect",
                "options": ["Email Sequence", "WhatsApp (Automated)", "SMS", "Retargeting Ads"]
            },
            {
                "name": "OFFER_STRATEGY",
                "label": "Strategi Penawaran",
                "type": "select",
                "options": ["No Discount (Service based)", "Free Shipping", "Discount (5-10%)", "Discount bertingkat"]
            }
        ]
    }
}

# Process Batch 1
print("Generating Batch 1 (002-005)...\n")

for fw_id, data in frameworks.items():
    json_data = {
        "id_kerangka": fw_id,
        "nama_kerangka": data['nama'],
        "version": "2.0.0",
        "kategori": ["Koleksi & Inovasi", "Otomasi Bisnis & Revenue"],
        "description": data['desc'],
        "perspektif_user": f"Saya ingin solusi {data['nama']} yang terotomatisasi.",
        "ai_logic_description": data['persona'],
        "toolType": "planning",
        "output": "natural_language_prompt",
        "contoh_kalimat": f"Bantu saya buat {data['nama']} yang efektif.",
        "konteks_tambahan_instruksi_khusus": "Berikan output yang sangat detail, step-by-step, dan actionable.",
        "components": get_common_components() + data['components'],
        "komponen_prompt": {
            "PERAN": data['persona'],
            "KONTEKS": data['konteks'],
            "TUGAS": data['tugas'],
            "FORMAT_OUTPUT": "Implementation Playbook (Markdown) dengan diagram Mermaid, estimasi biaya, dan roadmap mingguan."
        }
    }
    
    filepath = frameworks_dir / f"{fw_id}.json"
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Created {fw_id}: {data['nama']}")

print("\nBatch 1 Done.")
