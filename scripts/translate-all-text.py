import json
import re
from pathlib import Path

frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation")

# Dictionary lengkap untuk terjemahan
translations = {
    # Common phrases
    "Job Title": "Jabatan",
    "Company Size": "Ukuran Perusahaan",
    "Location": "Lokasi",
    "Industry": "Industri",
    "Recent Activity": "Aktivitas Terbaru",
    "Posted in last 30 days": "Posting dalam 30 hari terakhir",
    "employees": "karyawan",
    
    # Outreach styles
    "Highly Personalized (Manual and AI)": "Sangat Personal (Manual + AI)",
    "Personalized (AI-Assisted)": "Personal (Dibantu AI)",
    "Semi-Automated (Templates and Variables)": "Semi-Otomatis (Template + Variabel)",
    "Fully Automated (High Volume)": "Sepenuhnya Otomatis (Volume Tinggi)",
    
    # Info texts
    "highest conversion, lowest volume": "konversi tertinggi, volume terendah",
    "lowest conversion, highest volume": "konversi terendah, volume tertinggi",
    "Typical stack": "Stack umum",
    
    # Success metrics
    "Connection Acceptance Rate (%)": "Tingkat Penerimaan Koneksi (%)",
    "Message Response Rate (%)": "Tingkat Respons Pesan (%)",
    "Meeting Booking Rate (%)": "Tingkat Booking Meeting (%)",
    "Lead-to-Customer Conversion Rate (%)": "Tingkat Konversi Lead-ke-Pelanggan (%)",
    "Cost Per Lead (CPL)": "Biaya Per Lead (CPL)",
    "ROI (Return on Investment)": "ROI (Return on Investment)",
    
    # Tools
    "LinkedIn Sales Navigator": "LinkedIn Sales Navigator",
    "PhantomBuster": "PhantomBuster",
    "Dux-Soup": "Dux-Soup",
    "Make.com": "Make.com",
    "Zapier": "Zapier",
    
    # General
    "with": "dengan",
    "in": "di",
    "for": "untuk",
    "and": "dan",
    "or": "atau",
    "Free": "Gratis",
}

def translate_text(text):
    """Translate text using dictionary"""
    if not isinstance(text, str):
        return text
    
    result = text
    
    # Sort by length (longest first) to avoid partial replacements
    for eng, ind in sorted(translations.items(), key=lambda x: len(x[0]), reverse=True):
        # Case-insensitive replacement but preserve original case for proper nouns
        if eng in ['LinkedIn Sales Navigator', 'PhantomBuster', 'Dux-Soup', 'Make.com', 'Zapier', 'ROI']:
            continue  # Keep these as-is
        result = result.replace(eng, ind)
    
    return result

def translate_component(comp):
    """Translate all text fields in a component"""
    # Translate label
    if 'label' in comp:
        comp['label'] = translate_text(comp['label'])
    
    # Translate description
    if 'description' in comp:
        comp['description'] = translate_text(comp['description'])
    
    # Translate placeholder
    if 'placeholder' in comp:
        comp['placeholder'] = translate_text(comp['placeholder'])
    
    # Translate info (tooltip)
    if 'info' in comp:
        comp['info'] = translate_text(comp['info'])
    
    # Translate options
    if 'options' in comp and isinstance(comp['options'], list):
        comp['options'] = [translate_text(opt) if isinstance(opt, str) else opt for opt in comp['options']]
    
    # Translate default value
    if 'default' in comp and isinstance(comp['default'], str):
        comp['default'] = translate_text(comp['default'])
    
    return comp

def translate_framework(data):
    """Translate all text in framework"""
    # Translate main components
    if 'components' in data:
        for comp in data['components']:
            translate_component(comp)
    
    # Translate dynamic subcomponents
    if 'dynamicSubcomponents' in data and isinstance(data['dynamicSubcomponents'], list):
        for subcomp_group in data['dynamicSubcomponents']:
            if 'options' in subcomp_group:
                for key, components in subcomp_group['options'].items():
                    if isinstance(components, list):
                        for comp in components:
                            translate_component(comp)
    
    return data

def process_file(filepath):
    """Process a single framework file"""
    print(f"Menerjemahkan {filepath.name}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    translate_framework(data)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Selesai: {filepath.name}")

def main():
    json_files = list(frameworks_dir.glob("KOL-AUTO-*.json"))
    
    print(f"Menerjemahkan placeholder dan tooltips untuk {len(json_files)} file...\n")
    
    for filepath in sorted(json_files):
        try:
            process_file(filepath)
        except Exception as e:
            print(f"✗ Error: {filepath.name}: {e}")
    
    print(f"\n✓ Semua teks berhasil diterjemahkan!")

if __name__ == "__main__":
    main()
