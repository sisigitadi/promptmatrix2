import json
from pathlib import Path

# Base directory
frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation")

# Helper untuk komponen umum
def get_common_components():
    return [
        {
            "name": "BUSINESS_GOAL",
            "label": "Target Omset/Profit",
            "type": "text",
            "description": "Berapa target angka spesifik yang ingin dicapai?",
            "placeholder": "Contoh: $5,000/bulan, 10 Klien Baru, 100.000 Views",
            "validation": {"min_length": 3}
        },
        {
            "name": "BUDGET_TOOLS",
            "label": "Modal Software/Tools",
            "type": "select",
            "default": "$100-$300 (Standard)",
            "options": [
                "Gratisan / Bootstrap ($0-$50)",
                "Standard ($100-$300)",
                "Pro / Scaling ($300-$1000)",
                "Unlimited ($1000+)"
            ]
        }
    ]

# Definisi Framework Lengkap
frameworks = {
    "KOL-AUTO-001": {
        "nama": "Sistem Cold Email B2B (High-Ticket)",
        "desc": "Dapatkan klien bernilai tinggi ($1k-10k) secara autopilot. ROI Potensial: 10x-50x.",
        "persona": "Anda adalah Cold Email Architect veteran yang ahli menembus inbox CEO dan menutup deal besar.",
        "konteks": "Saya ingin membangun sistem akuisisi klien otomatis untuk {OFFER_TYPE} menargetkan {TARGET_NICHE}.",
        "tugas": "Buat Blueprint Cold Email System lengkap: Teknis Infrastruktur, Lead Scraping, Copywriting, dan Jadwal Sending.",
        "components": [
            {
                "name": "OFFER_TYPE",
                "label": "Jasa/Produk High-Ticket",
                "type": "text",
                "placeholder": "Contoh: Jasa SEO Agency, Custom Software Dev, Konsultan HR"
            },
            {
                "name": "TARGET_NICHE",
                "label": "Niche Target Spesifik",
                "type": "text",
                "placeholder": "Contoh: Pemilik Gym di US, CEO SaaS Series A, Marketing Manager Hotel"
            },
            {
                "name": "SENDING_VOLUME",
                "label": "Volume Pengiriman Harian",
                "type": "select",
                "options": ["50-100 email (Aman)", "100-500 email (Agresif)", "500-1000+ email (Massive Scale)"]
            },
            {
                "name": "TECH_STACK",
                "label": "Infrastruktur Email",
                "type": "multiselect",
                "options": ["Google Workspace (GSuite)", "Outlook/Microsoft 365", "SMTP Dedicated (SendGrid/Mailgun)", "Instantly.ai / SmartLead"]
            }
        ]
    },
    "KOL-AUTO-002": {
        "nama": "Mesin Programmatic SEO (Traffic Otomatis)",
        "desc": "Bangun ribuan halaman website otomatis untuk mendominasi Google. ROI: Pasif Income via Ads/Affiliate.",
        "persona": "Anda adalah Programmatic SEO Engineer yang ahli memanipulasi data untuk ranking ribuan keyword long-tail.",
        "konteks": "Saya ingin membangun aset website Programmatic SEO di niche {NICHE_TOPIC} untuk monetisasi via {MONETIZATION}.",
        "tugas": "Rancang Arsitektur pSEO: Struktur Database, Keyword Clustering, Template Halaman, dan Strategi Indexing.",
        "components": [
            {
                "name": "NICHE_TOPIC",
                "label": "Topik Niche Website",
                "type": "text",
                "placeholder": "Contoh: Wisata Lokal per Kota, Review Laptop Spesifik, Kalkulator Kredit, Lirik Lagu"
            },
            {
                "name": "DATA_SOURCE",
                "label": "Sumber Data Programmatic",
                "type": "select",
                "options": ["Scraping (Python/Puppeteer)", "Public API (RapidAPI)", "Dataset Pemerintah (Open Data)", "CSV Manual"]
            },
            {
                "name": "MONETIZATION",
                "label": "Metode Monetisasi",
                "type": "select",
                "options": ["Google AdSense / Display Ads", "Affiliate Marketing (Amazon/Shopee)", "Lead Gen (Jual Data)", "Sewa Website (Rank & Rent)"]
            },
            {
                "name": "CMS_PLATFORM",
                "label": "Platform Website",
                "type": "select",
                "options": ["WordPress (WP All Import)", "Webflow (CMS Collection)", "Next.js / Custom Code", "Bubble.io"]
            }
        ]
    },
    "KOL-AUTO-003": {
        "nama": "Pabrik Video Pendek Faceless (Tiktok/Reels)",
        "desc": "Ternak akun sosmed 'Tanpa Wajah' untuk Creator Rewards & Affiliate. Produksi massal.",
        "persona": "Anda adalah Viral Content Engineer yang paham algoritma FYP dan cara produksi video massal.",
        "konteks": "Saya ingin membuat 'Pabrik Konten' video pendek di niche {VIDEO_NICHE} untuk platform {PLATFORM}.",
        "tugas": "Buat SOP Produksi Massal: Sourcing Script, AI Voiceover, Editing Template (CapCut/Premiere), dan Jadwal Upload.",
        "components": [
            {
                "name": "VIDEO_NICHE",
                "label": "Niche Video",
                "type": "select",
                "options": ["Motivasi & Quotes", "Fakta Unik / Trivia", "Quiz & Teka-teki", "Cerita Horor/Misteri", "Review Gadget/Barang Unik", "AI News"]
            },
            {
                "name": "PLATFORM",
                "label": "Platform Fokus",
                "type": "multiselect",
                "options": ["TikTok (Creator Reward)", "Youtube Shorts (AdSense)", "Instagram Reels (Affiliate/Endorse)", "Facebook Reels"]
            },
            {
                "name": "PRODUCTION_STYLE",
                "label": "Gaya Visual",
                "type": "select",
                "options": ["Stock Footage + Teks", "AI Image Generator (Midjourney)", "Gameplay Minecraft/GTA Background", "Whiteboard Animation"]
            }
        ]
    },
    "KOL-AUTO-004": {
        "nama": "Funnel Penjualan WhatsApp Otomatis",
        "desc": "Ubah leads jadi pembeli 24/7 via chat. Closing rate tertinggi di Indonesia.",
        "persona": "Anda adalah WhatsApp Conversion Strategist yang ahli merancang flow chat persuasif.",
        "konteks": "Saya menjual {PRODUCT_NAME} dan ingin mengotomatiskan proses closing di WhatsApp untuk trafik dari {TRAFFIC_SOURCE}.",
        "tugas": "Rancang Flow Chatbot WA: Greeting, Kualifikasi, Presentasi Produk, Handling Keberatan, dan Follow-up Otomatis.",
        "components": [
            {
                "name": "PRODUCT_NAME",
                "label": "Produk/Jasa yang Dijual",
                "type": "text",
                "placeholder": "Contoh: Obat Diet Herbal, Jasa Cuci Sepatu, Kursus Bahasa Inggris"
            },
            {
                "name": "TRAFFIC_SOURCE",
                "label": "Sumber Trafik Masuk",
                "type": "select",
                "options": ["Iklan Facebook/IG Ads", "TikTok Ads", "Google Ads", "Organik Sosmed", "Database Lama"]
            },
            {
                "name": "BOT_TOOL",
                "label": "Tools WhatsApp",
                "type": "select",
                "options": ["Wozzap / Starsender (Lokal)", "Wabus / WooWA", "Interakt / WATI (Official API)", "Business API Custom"]
            }
        ]
    },
    "KOL-AUTO-005": {
        "nama": "Sistem Arbitrase Drop-Servicing",
        "desc": "Terima order mahal (Dollar), kerjakan murah (Rupiah/Rupee). Margin profit instan.",
        "persona": "Anda adalah Drop-Servicing Mogul yang ahli mengelola supply chain jasa digital.",
        "konteks": "Saya ingin membangun bisnis Drop-Servicing untuk jasa {SERVICE_TYPE}, menjual ke pasar {TARGET_MARKET}.",
        "tugas": "Buat Sistem Arbitrase: Setup Website Penawaran, SOP Perekrutan Freelancer, dan Workflow Operan Order Otomatis.",
        "components": [
            {
                "name": "SERVICE_TYPE",
                "label": "Jasa yang Dijual",
                "type": "text",
                "placeholder": "Contoh: Desain Logo, Penulisan Artikel, Video Editing, Transkripsi Audio"
            },
            {
                "name": "TARGET_MARKET",
                "label": "Pasar Target (Klien)",
                "type": "select",
                "options": ["Bisnis Lokal USA/Eropa", "Youtuber/Creator", "Real Estate Agents", "E-commerce Owners"]
            },
            {
                "name": "FREELANCER_SOURCE",
                "label": "Sumber Pekerja (Vendor)",
                "type": "multiselect",
                "options": ["Fiverr", "Upwork", "Freelancer.com", "Grup Facebook Lokal", "Tim In-house Remote"]
            }
        ]
    },
    "KOL-AUTO-006": {
        "nama": "Sistem Launching & Flash Sale E-commerce",
        "desc": "Cetak omzet besar dalam 24-48 jam. Hype marketing system.",
        "persona": "Anda adalah Director of E-commerce Launches yang ahli menciptakan 'Buying Frenzy'.",
        "konteks": "Saya akan meluncurkan {PRODUCT_LAUNCH} dan ingin membuat sistem Flash Sale & Hype yang meledak.",
        "tugas": "Rancang Launch Sequence: Teaser Campaign, Waitlist Funnel, VIP Access, dan Hourly Scarcity Blast.",
        "components": [
            {
                "name": "PRODUCT_LAUNCH",
                "label": "Produk yang Diluncurkan",
                "type": "text",
                "placeholder": "Contoh: Koleksi Fashion Lebaran, Gadget Baru, Varian Skincare Limited"
            },
            {
                "name": "LAUNCH_DURATION",
                "label": "Durasi Flash Sale",
                "type": "select",
                "options": ["24 Jam (Sangat Mendesak)", "3 Hari (Weekend Sale)", "7 Hari (Standard Launch)", "Pre-order (14-30 Hari)"]
            },
            {
                "name": "CHANNEL_BLAST",
                "label": "Channel Promosi Utama",
                "type": "multiselect",
                "options": ["Email List", "WhatsApp Broadcast", "Instagram Story + Close Friends", "Telegram Channel"]
            }
        ]
    },
    "KOL-AUTO-007": {
        "nama": "Funnel Webinar High-Ticket Otomatis",
        "desc": "Jual kursus/coaching $500+ secara otomatis 24/7 (Evergreen Webinar).",
        "persona": "Anda adalah High-Ticket Funnel Expert yang ahli dalam psikologi webinar evergreen.",
        "konteks": "Saya punya offer High-Ticket {OFFER_HT} dan ingin menjualnya lewat Webinar Otomatis (Evergreen).",
        "tugas": "Rancang Funnel Webinar: Halaman Registrasi, Script Presentasi Persuasif, Sequence Show-up, dan Follow-up Penjualan.",
        "components": [
            {
                "name": "OFFER_HT",
                "label": "Penawaran High-Ticket",
                "type": "text",
                "placeholder": "Contoh: Mentoring Bisnis, Sertifikasi Profesi, Paket Agency Tahunan"
            },
            {
                "name": "EMAIL_TOOL",
                "label": "Autoresponder / CRM",
                "type": "select",
                "options": ["ActiveCampaign", "ConvertKit", "Kirim.Email", "Mailchimp"]
            },
            {
                "name": "WEBINAR_PLATFORM",
                "label": "Platform Webinar",
                "type": "select",
                "options": ["Zoom (Live lalu Rekam)", "EverWebinar", "StealthSeminar", "Youtube Unlisted (Bootstrap)"]
            }
        ]
    },
    "KOL-AUTO-008": {
        "nama": "Ekosistem Produk Digital Otomatis",
        "desc": "Jual ebook/template 24/7. Low ticket funnel menuju passive income.",
        "persona": "Anda adalah Digital Product Strategist yang ahli membangun 'Value Ladder' otomatis.",
        "konteks": "Saya ingin menjual produk digital {DIGITAL_PRODUCT} secara otomatis tanpa interaksi manual.",
        "tugas": "Rancang Funnel Produk Digital: Lead Magnet, Tripwire ($7-$27), Core Offer, dan Order Bump untuk memaksimalkan AOV.",
        "components": [
            {
                "name": "DIGITAL_PRODUCT",
                "label": "Produk Digital",
                "type": "text",
                "placeholder": "Contoh: Template Notion, Ebook Resep Diet, Preset Lightroom, UI Kits"
            },
            {
                "name": "FUNNEL_MODEL",
                "label": "Model Funnel",
                "type": "select",
                "options": ["Direct to Sales (Simple)", "Lead Magnet -> Tripwire (Self-liquidating)", "Free Challenge -> Upsell", "Hub & Spoke (Content to Product)"]
            },
            {
                "name": "PAYMENT_GATEWAY",
                "label": "Gateway Pembayaran",
                "type": "select",
                "options": ["Mayar.id / Tribelio (Lokal)", "Gumroad / LemonSqueezy", "Stripe / PayPal", "Transfer Manual (Semi-auto)"]
            }
        ]
    }
}

print("Mulai Menulis 8 Framework 'Mesin Uang' Actionable...\n")

for fw_id, data in frameworks.items():
    json_data = {
        "id_kerangka": fw_id,
        "nama_kerangka": data['nama'],
        "version": "3.0.0",
        "kategori": ["Koleksi & Inovasi", "Otomasi Bisnis & Revenue"],
        "description": data['desc'],
        "perspektif_user": f"Saya ingin menerapkan {data['nama']} untuk menghasilkan profit nyata.",
        "ai_logic_description": data['persona'],
        "toolType": "planning",
        "output": "natural_language_prompt",
        "contoh_kalimat": f"Buatkan rencana teknis untuk {data['nama']} yang siap eksekusi.",
        "konteks_tambahan_instruksi_khusus": "PENTING: Jangan berikan saran umum/motivasi. Berikan instruksi TEKNIS step-by-step. Sebutkan nama tools spesifik. Buat estimasi biaya vs potensi profit. Sertakan diagram alur jika perlu.",
        "components": get_common_components() + data['components'],
        "komponen_prompt": {
            "PERAN": data['persona'],
            "KONTEKS": data['konteks'],
            "TUGAS": data['tugas'],
            "FORMAT_OUTPUT": "Dokumen 'Blueprint Eksekusi' (Markdown) yang berisi:\n1. Persiapan Infrastruktur & Tools\n2. Setup Teknis (Langkah demi langkah)\n3. Strategi Konten/Copywriting\n4. Rencana Traffic/Promosi\n5. Proyeksi Hitungan Profit (Excel-style table)"
        }
    }
    
    filepath = frameworks_dir / f"{fw_id}.json"
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Created {fw_id}: {data['nama']}")

print("\nSelesai! Semua framework telah dirombak total menjadi Actionable Money Machines.")
