import json
from pathlib import Path

# Directory containing the framework JSON files
frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation")

# Mapping dari nama Inggris ke Indonesia
translations = {
    "KOL-AUTO-001": {
        "nama_kerangka": "Mesin Generasi Lead LinkedIn",
        "description": "Hasilkan 50-100 lead B2B berkualitas per bulan secara otomatis menggunakan otomasi LinkedIn. ROI: 2.000-17.000% (investasi $118/bulan → potensi return $2.500-$20.000/bulan)."
    },
    "KOL-AUTO-002": {
        "nama_kerangka": "Mesin Pemasaran Konten Bertenaga AI",
        "description": "Produksi 20-30 konten berkualitas tinggi per bulan dengan otomasi AI. ROI: 150-300% (waktu yang dihemat + peningkatan traffic organik dan lead generation)."
    },
    "KOL-AUTO-003": {
        "nama_kerangka": "Dashboard Business Intelligence Real-Time",
        "description": "Agregasi data dari berbagai sumber ke dalam satu dashboard real-time dengan alert otomatis. ROI: 250-450% (pengambilan keputusan lebih cepat + pengurangan waktu pelaporan manual)."
    },
    "KOL-AUTO-004": {
        "nama_kerangka": "Otomasi Customer Support Omnichannel",
        "description": "Berikan dukungan pelanggan 24/7 di berbagai channel dengan chatbot AI dan routing pintar. ROI: 200-350% (pengurangan biaya support + peningkatan kepuasan pelanggan)."
    },
    "KOL-AUTO-005": {
        "nama_kerangka": "Sistem Pemulihan Keranjang Belanja E-commerce",
        "description": "Pulihkan 15-30% keranjang yang ditinggalkan dengan sequence email/SMS/WhatsApp otomatis. ROI: 200-400% (revenue yang dipulihkan dari keranjang yang ditinggalkan)."
    },
    "KOL-AUTO-006": {
        "nama_kerangka": "Asisten Riset & Konten AI",
        "description": "Otomatisasi riset, pengumpulan data, dan pembuatan draft konten dengan agen AI. ROI: 300-500% (waktu yang dihemat untuk riset + peningkatan kualitas output konten)."
    },
    "KOL-AUTO-007": {
        "nama_kerangka": "Pembangun Bisnis Automation-as-a-Service",
        "description": "Bangun dan jual solusi otomasi kustom sebagai layanan terproduktisasi. ROI: 400-600% (bisnis layanan dengan margin tinggi dan potensi recurring revenue)."
    },
    "KOL-AUTO-008": {
        "nama_kerangka": "Pembangun Workflow Kustom (Lanjutan)",
        "description": "Rancang workflow otomasi kustom untuk proses bisnis unik yang tidak cocok dengan template standar. Untuk pengguna lanjutan dengan kebutuhan otomasi spesifik."
    }
}

def update_framework_file(filepath):
    """Update framework file dengan nama dan deskripsi bahasa Indonesia"""
    print(f"Mengupdate {filepath.name}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    framework_id = data.get('id_kerangka')
    
    if framework_id in translations:
        data['nama_kerangka'] = translations[framework_id]['nama_kerangka']
        data['description'] = translations[framework_id]['description']
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Updated {filepath.name}: {translations[framework_id]['nama_kerangka']}")
    else:
        print(f"⚠ Skipped {filepath.name}: No translation found")

def main():
    """Update all framework files"""
    json_files = list(frameworks_dir.glob("KOL-AUTO-*.json"))
    
    print(f"Ditemukan {len(json_files)} file framework untuk diupdate\n")
    
    for filepath in sorted(json_files):
        try:
            update_framework_file(filepath)
        except Exception as e:
            print(f"✗ Error updating {filepath.name}: {e}")
    
    print(f"\n✓ Semua file berhasil diproses!")

if __name__ == "__main__":
    main()
