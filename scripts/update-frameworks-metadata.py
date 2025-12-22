import json
from pathlib import Path

# Base directory
frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation")

# Framework data - ringkas tapi lengkap
frameworks_data = {
    "KOL-AUTO-002": {
        "nama": "Mesin Pemasaran Konten Bertenaga AI",
        "desc": "Produksi 20-30 konten berkualitas tinggi per bulan dengan otomasi AI. ROI: 150-300% (waktu yang dihemat + peningkatan traffic organik dan lead generation).",
        "user_perspective": "Sebagai content marketer, creator, atau business owner, saya ingin mengotomatiskan content ideation, drafting, SEO optimization, dan multi-platform distribution agar saya bisa scale content production tanpa menambah tim atau budget.",
        "ai_persona": "Persona AI: Anda adalah seorang Spesialis Otomasi Pemasaran Konten & Ahli Produktivitas AI yang ahli dalam merancang content workflows, prompt engineering untuk AI content generation, dan strategi distribusi multi-channel."
    },
    "KOL-AUTO-003": {
        "nama": "Dashboard Business Intelligence Real-Time",
        "desc": "Agregasi data dari berbagai sumber ke dalam satu dashboard real-time dengan alert otomatis. ROI: 250-450% (pengambilan keputusan lebih cepat + pengurangan waktu pelaporan manual).",
        "user_perspective": "Sebagai business owner atau manager, saya ingin melihat semua metrics penting (sales, marketing, operations) dalam satu dashboard real-time tanpa harus manual export-import data setiap hari.",
        "ai_persona": "Persona AI: Anda adalah seorang Arsitek Business Intelligence & Spesialis Otomasi Data yang ahli dalam merancang data pipelines, dashboard automation, dan alert systems untuk business metrics."
    },
    "KOL-AUTO-004": {
        "nama": "Otomasi Customer Support Omnichannel",
        "desc": "Berikan dukungan pelanggan 24/7 di berbagai channel dengan chatbot AI dan routing pintar. ROI: 200-350% (pengurangan biaya support + peningkatan kepuasan pelanggan).",
        "user_perspective": "Sebagai business owner, saya ingin memberikan support cepat dan konsisten di semua channel (WhatsApp, Instagram, Email, Live Chat) tanpa menambah customer service team atau bekerja 24/7.",
        "ai_persona": "Persona AI: Anda adalah seorang Arsitek Customer Experience (CX) & Spesialis Otomasi Support yang ahli dalam merancang omnichannel chatbot systems, smart routing logic, dan customer satisfaction optimization."
    },
    "KOL-AUTO-005": {
        "nama": "Sistem Pemulihan Keranjang Belanja E-commerce",
        "desc": "Pulihkan 15-30% keranjang yang ditinggalkan dengan sequence email/SMS/WhatsApp otomatis. ROI: 200-400% (revenue yang dipulihkan dari keranjang yang ditinggalkan).",
        "user_perspective": "Sebagai pemilik e-commerce, saya ingin mengurangi cart abandonment rate dengan automated follow-up yang personal dan persuasif agar saya bisa recover lost sales tanpa manual outreach.",
        "ai_persona": "Persona AI: Anda adalah seorang Spesialis Optimasi Konversi E-commerce & Ahli Otomasi Marketing yang ahli dalam merancang cart recovery campaigns, behavioral triggers, dan persuasive messaging."
    },
    "KOL-AUTO-006": {
        "nama": "Asisten Riset & Konten AI",
        "desc": "Otomatisasi riset, pengumpulan data, dan pembuatan draft konten dengan agen AI. ROI: 300-500% (waktu yang dihemat untuk riset + peningkatan kualitas output konten).",
        "user_perspective": "Sebagai content creator, researcher, atau knowledge worker, saya ingin AI agent yang bisa riset topik, kumpulkan data dari berbagai sources, dan buat draft konten secara otonom agar saya bisa fokus pada strategic thinking dan final editing.",
        "ai_persona": "Persona AI: Anda adalah seorang Spesialis Riset AI & Arsitek Otomasi yang ahli dalam merancang AI agent systems, web scraping workflows, dan automated content generation pipelines."
    },
    "KOL-AUTO-007": {
        "nama": "Pembangun Bisnis Automation-as-a-Service",
        "desc": "Bangun dan jual solusi otomasi kustom sebagai layanan terproduktisasi. ROI: 400-600% (bisnis layanan dengan margin tinggi dan potensi recurring revenue).",
        "user_perspective": "Sebagai automation expert atau agency owner, saya ingin memonetisasi keahlian saya dengan menjual automation solutions sebagai layanan (productized service atau SaaS) agar saya bisa generate recurring revenue tanpa trading time for money.",
        "ai_persona": "Persona AI: Anda adalah seorang Ahli Strategi Bisnis Digital & Ahli Productized Service yang ahli dalam merancang scalable service offerings, pricing strategies, dan automated delivery systems untuk automation services."
    },
    "KOL-AUTO-008": {
        "nama": "Pembangun Workflow Kustom (Lanjutan)",
        "desc": "Rancang workflow otomasi kustom untuk proses bisnis unik yang tidak cocok dengan template standar. Untuk pengguna lanjutan dengan kebutuhan otomasi spesifik.",
        "user_perspective": "Saya punya use case automation yang unik dan tidak tercover oleh framework lain. Saya butuh guidance untuk merancang workflow custom dari scratch dengan pendekatan sistematis.",
        "ai_persona": "Persona AI: Anda adalah seorang Solution Architect & Ahli Systems Thinking yang ahli dalam dekonstruksi complex problems, process mapping, dan merancang custom automation workflows untuk unique business requirements."
    }
}

print("Membuat framework 002-008...\n")

for fw_id, data in frameworks_data.items():
    filepath = frameworks_dir / f"{fw_id}.json"
    
    # Baca framework lama untuk ambil struktur komponen
    with open(filepath, 'r', encoding='utf-8') as f:
        old_data = json.load(f)
    
    # Update dengan data baru
    old_data['nama_kerangka'] = data['nama']
    old_data['description'] = data['desc']
    old_data['perspektif_user'] = data['user_perspective']
    old_data['ai_logic_description'] = data['ai_persona']
    old_data['version'] = "2.0.0"
    
    # Simpan
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(old_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Updated {fw_id}: {data['nama']}")

print("\n✓ Semua framework berhasil diupdate!")
print("Jalankan: npm run build:frameworks")
