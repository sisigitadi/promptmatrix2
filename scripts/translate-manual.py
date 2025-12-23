import json
from pathlib import Path

frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation")

# Manual translations untuk setiap framework - lebih akurat
framework_translations = {
    "KOL-AUTO-001": {
        "components": {
            "BUSINESS_GOAL": {
                "label": "Target Generasi Lead",
                "options": [
                    "20-50 lead/bulan (Konservatif)",
                    "50-100 lead/bulan (Moderat)",
                    "100-200 lead/bulan (Agresif)",
                    "200+ lead/bulan (Skala Enterprise)"
                ],
                "info": "Target realistis berdasarkan tolok ukur industri. Konservatif = pendekatan lebih aman, Agresif = memerlukan lebih banyak tools otomasi."
            },
            "TARGET_INDUSTRY": {
                "label": "Target Industri/Niche",
                "placeholder": "Contoh: Founder SaaS, Direktur HR, Agensi Marketing, Brand E-commerce",
                "info": "Semakin spesifik, semakin baik. Contoh bagus: 'Founder SaaS B2B dengan 10-50 karyawan di AS'"
            },
            "LEAD_CRITERIA": {
                "placeholder": "Contoh:\n- Jabatan: Founder, CEO, VP Marketing\n- Ukuran Perusahaan: 10-500 karyawan\n- Lokasi: AS, Inggris, Kanada\n- Industri: SaaS B2B, E-commerce\n- Aktivitas Terbaru: Posting dalam 30 hari terakhir",
                "info": "Gunakan filter LinkedIn Sales Navigator sebagai panduan: jabatan, ukuran perusahaan, lokasi, industri, tingkat senioritas."
            },
            "OUTREACH_STYLE": {
                "default": "Personal (Dibantu AI)",
                "options": [
                    "Sangat Personal (Manual + AI)",
                    "Personal (Dibantu AI)",
                    "Semi-Otomatis (Template + Variabel)",
                    "Sepenuhnya Otomatis (Volume Tinggi)"
                ],
                "info": "Sangat Personal = konversi tertinggi, volume terendah. Sepenuhnya Otomatis = konversi terendah, volume tertinggi."
            },
            "BUDGET_RANGE": {
                "info": "Stack umum: LinkedIn Sales Navigator ($79) + PhantomBuster/Dux-Soup ($30-50) + Make.com/Zapier ($9-30) + CRM (Gratis-$50)"
            },
            "SUCCESS_METRICS": {
                "options": [
                    "Tingkat Penerimaan Koneksi (%)",
                    "Tingkat Respons Pesan (%)",
                    "Tingkat Booking Meeting (%)",
                    "Tingkat Konversi Lead-ke-Pelanggan (%)",
                    "Biaya Per Lead (CPL)",
                    "ROI (Return on Investment)"
                ],
                "info": "Tolok ukur industri: Tingkat koneksi 30-40%, Tingkat respons 10-20%, Tingkat meeting 5-10%"
            }
        }
    }
}

def update_component_fields(comp, translations):
    """Update component fields with translations"""
    for field, value in translations.items():
        if field in comp:
            comp[field] = value
    return comp

def translate_framework_file(filepath, translations):
    """Translate a framework file using manual translations"""
    print(f"Menerjemahkan {filepath.name}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    framework_id = data.get('id_kerangka')
    
    if framework_id in translations and 'components' in translations[framework_id]:
        comp_translations = translations[framework_id]['components']
        
        # Update main components
        if 'components' in data:
            for comp in data['components']:
                comp_name = comp.get('name')
                if comp_name in comp_translations:
                    update_component_fields(comp, comp_translations[comp_name])
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Selesai: {filepath.name}")

def main():
    # Start with KOL-AUTO-001 only for now
    filepath = frameworks_dir / "KOL-AUTO-001.json"
    
    if filepath.exists():
        translate_framework_file(filepath, framework_translations)
        print("\n✓ Framework KOL-AUTO-001 berhasil diterjemahkan!")
        print("Silakan cek hasilnya. Jika sudah OK, saya akan lanjutkan untuk framework lainnya.")
    else:
        print(f"✗ File tidak ditemukan: {filepath}")

if __name__ == "__main__":
    main()
