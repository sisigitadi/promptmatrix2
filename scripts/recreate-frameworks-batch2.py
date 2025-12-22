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
            "description": "Apa tujuan spesifik yang ingin dicapai?",
            "placeholder": "Contoh: Mengembangkan produk jasa baru, Riset pasar mendalam, Efisiensi operasional",
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
    "KOL-AUTO-006": {
        "nama": "Asisten Riset & Konten AI",
        "desc": "Otomatisasi riset dan draft konten. ROI: 300-500%.",
        "persona": "Anda adalah Lead Researcher & AI Content Architect.",
        "konteks": "Pengguna butuh deep research & content drafting untuk {BUSINESS_GOAL}.",
        "tugas": "Rancang Research Automation System: 1. Source Gathering (Scraping/API), 2. Synthesis (LLM), 3. Drafting.",
        "components": [
            {
                "name": "RESEARCH_TOPIC",
                "label": "Topik Riset",
                "type": "textarea",
                "placeholder": "Contoh: Tren AI di Healthcare 2025, Analisis Kompetitor SaaS CRM"
            },
            {
                "name": "DEPTH_LEVEL",
                "label": "Kedalaman Riset",
                "type": "select",
                "options": ["Overview/General", "Mendalam (Deep Dive)", "Akademis/Teknis", "Marklet Analysis"]
            },
            {
                "name": "OUTPUT_FORMAT",
                "label": "Format Output yang Diinginkan",
                "type": "multiselect",
                "options": ["Artikel Blog", "Whitepaper", "Twitter Thread", "Executive Summary", "Presentasi Slide"]
            }
        ]
    },
    "KOL-AUTO-007": {
        "nama": "Pembangun Bisnis Automation-as-a-Service",
        "desc": "Bangun dan jual jasa otomasi. ROI: 400-600%.",
        "persona": "Anda adalah AaaS (Automation as a Service) Business Consultant.",
        "konteks": "Pengguna ingin membangun bisnis jasa otomasi dengan target {BUSINESS_GOAL}.",
        "tugas": "Buat Business Plan AaaS: 1. Niche Selection, 2. Service Packaging (Productized), 3. Pricing Strategy, 4. Client Acquisition.",
        "components": [
            {
                "name": "TARGET_MARKET",
                "label": "Target Pasar Klien",
                "type": "text",
                "placeholder": "Contoh: Real Estate Agents, Dental Clinics, E-commerce Brands"
            },
            {
                "name": "CORE_SKILL",
                "label": "Keahlian Utama Saat Ini",
                "type": "multiselect",
                "options": ["Zapier/Make", "Coding (Python/JS)", "Marketing flows", "Chatbots", "Data Scraping"]
            },
            {
                "name": "PRICING_MODEL",
                "label": "Model Harga yang Diinginkan",
                "type": "select",
                "options": ["Monthly Retainer", "Per Project", "Productized Service (Fixed Price)", "Performance Based"]
            }
        ]
    },
    "KOL-AUTO-008": {
        "nama": "Pembangun Workflow Kustom (Lanjutan)",
        "desc": "Rancang workflow unik untuk kebutuhan kompleks.",
        "persona": "Anda adalah Senior Solution Architect.",
        "konteks": "Pengguna punya kebutuhan unik: {BUSINESS_GOAL} yang tidak tercover template standar.",
        "tugas": "Rancang Custom Automation Solution Architecture: 1. Requirement Analysis, 2. Tool Selection, 3. Architecture Diagram, 4. Implementation Plan.",
        "components": [
            {
                "name": "PROBLEM_DESCRIPTION",
                "label": "Deskripsi Masalah/Proses Saat Ini",
                "type": "textarea",
                "placeholder": "Jelaskan proses manual yang ingin diotomatisasi secara detail..."
            },
            {
                "name": "CURRENT_TOOLS",
                "label": "Tools yang Sudah Digunakan",
                "type": "textarea",
                "placeholder": "Contoh: Google Sheets, Trello, WhatsApp Business, Software Akuntansi Lokal"
            },
            {
                "name": "COMPLEXITY",
                "label": "Tingkat Kompleksitas Perkiraan",
                "type": "select",
                "options": ["Sederhana (Linear)", "Menengah (Cabang logika)", "Komplex (API, Database, Webhook)", "Sangat Komplex (Custom Code)"]
            }
        ]
    }
}

# Process Batch 2
print("Generating Batch 2 (006-008)...\n")

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
        "contoh_kalimat": f"Bantu saya rancang solusi {data['nama']}.",
        "konteks_tambahan_instruksi_khusus": "Berikan arsitektur teknis yang detail.",
        "components": get_common_components() + data['components'],
        "komponen_prompt": {
            "PERAN": data['persona'],
            "KONTEKS": data['konteks'],
            "TUGAS": data['tugas'],
            "FORMAT_OUTPUT": "Technical Solution Design Document (Markdown)."
        }
    }
    
    filepath = frameworks_dir / f"{fw_id}.json"
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Created {fw_id}: {data['nama']}")

# Update 001 category only
print("\nUpdating KOL-AUTO-001 Category...")
file_001 = frameworks_dir / "KOL-AUTO-001.json"
if file_001.exists():
    with open(file_001, 'r', encoding='utf-8') as f:
        data_001 = json.load(f)
    
    # Update category AND make sure components use Indonesian labels (since we recreated it in previous step)
    data_001['kategori'] = ["Koleksi & Inovasi", "Otomasi Bisnis & Revenue"]
    
    with open(file_001, 'w', encoding='utf-8') as f:
        json.dump(data_001, f, indent=2, ensure_ascii=False)
    print("✓ Updated KOL-AUTO-001 Category")

print("\nBatch 2 Done.")
