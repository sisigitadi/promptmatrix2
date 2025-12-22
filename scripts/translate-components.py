import json
from pathlib import Path

frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation")

# Mapping translations untuk komponen yang sering muncul
common_translations = {
    # Labels
    "Target Lead Generation": "Target Generasi Lead",
    "Target Industry/Niche": "Target Industri/Niche",
    "Budget untuk Tools (per bulan)": "Anggaran untuk Tools (per bulan)",
    "Alat Otomasi Utama": "Alat Otomasi Utama",
    "Pilih Alur Otomasi": "Pilih Alur Otomasi",
    
    # Options
    "Conservative": "Konservatif",
    "Moderate": "Moderat", 
    "Aggressive": "Agresif",
    "Enterprise Scale": "Skala Enterprise",
    "Starter": "Pemula",
    "Growth": "Pertumbuhan",
    "Scale": "Skala",
    "Enterprise": "Enterprise",
    
    # Info texts - partial replacements
    "industry benchmarks": "tolok ukur industri",
    "safer approach": "pendekatan lebih aman",
    "requires more automation tools": "memerlukan lebih banyak tools otomasi",
    "recommended": "direkomendasikan",
    "best for": "terbaik untuk",
    "advanced users": "pengguna lanjutan",
}

def translate_text(text):
    """Translate common English phrases to Indonesian"""
    if not isinstance(text, str):
        return text
    
    result = text
    for eng, ind in common_translations.items():
        result = result.replace(eng, ind)
    
    return result

def translate_component(comp):
    """Translate a single component"""
    if 'label' in comp:
        comp['label'] = translate_text(comp['label'])
    
    if 'info' in comp:
        comp['info'] = translate_text(comp['info'])
    
    if 'options' in comp and isinstance(comp['options'], list):
        comp['options'] = [translate_text(opt) if isinstance(opt, str) else opt for opt in comp['options']]
    
    return comp

def translate_framework(data):
    """Translate all components in a framework"""
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
    
    print(f"Menerjemahkan {len(json_files)} file framework...\n")
    
    for filepath in sorted(json_files):
        try:
            process_file(filepath)
        except Exception as e:
            print(f"✗ Error: {filepath.name}: {e}")
    
    print(f"\n✓ Semua file berhasil diterjemahkan!")

if __name__ == "__main__":
    main()
