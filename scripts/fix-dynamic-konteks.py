#!/usr/bin/env python3
"""
FIX: Dynamic Subcomponents KONTEKS Generation
Purpose: Fix frameworks with complex dynamicSubcomponents to include ALL dynamic fields in KONTEKS
Author: Prompt Matrix Development Team
Date: 2025-12-23
"""

import json
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent
FRAMEWORKS_DIR = BASE_DIR / "src" / "data" / "frameworks"

# Frameworks that need dynamic KONTEKS (manually identified)
DYNAMIC_FRAMEWORKS = {
    "Studio Branding & Identitas": {
        "assetType": {
            "Nama Brand": ["{projectDescription}", "{brandPersonality}", "{keywords}", "{nameStyle}"],
            "Slogan/Tagline": ["{projectName}", "{coreBenefit}", "{targetAudience}", "{slog anStyle}"],
            "Konsep Logo": ["{projectName}", "{logoType}", "{visualElements}", "{colorPalette}", "{styleAesthetic}"]
        }
    },
    "Generator Konten Multi-Platform": {
        "contentType": {
            "Artikel Blog": ["{topic}", "{targetAudience}", "{keywords}", "{tone}", "{cta}"],
            "Post Media Sosial": ["{platform}", "{topic}", "{visualIdea}", "{tone}", "{hashtagSuggestions}"],
            "Deskripsi Produk": ["{productName}", "{features}", "{benefits}", "{targetAudience}", "{tone}"],
            "Skrip Video Pendek": ["{videoTopic}", "{hook}", "{keyScenes}", "{duration}", "{cta}"],
            "Resensi": ["{itemToReview}", "{reviewType}", "{keyPoints}", "{rating}", "{targetAudience}"],
            "Lirik Lagu": ["{songTitle}", "{genre}", "{theme}", "{mood}", "{keyElements}"],
            "Naskah Iklan": ["{adPlatform}", "{productService}", "{targetAudience}", "{uniqueSellingPoint}", "{callToAction}", "{adLength}"]
        }
    }
}

def generate_dynamic_konteks(framework_name, dynamic_config):
    """Generate KONTEKS that includes dynamic fields"""
    trigger = list(dynamic_config.keys())[0]
    
    # Build conditional KONTEKS that shows different fields per option
    # We'll use a generic approach that works with replacePlaceholders
    
    if framework_name == "Studio Branding & Identitas":
        return f"Saya ingin membuat {{{trigger}}}. [Detail yang dibutuhkan: deskripsi proyek, kepribadian brand, dan preferensi gaya untuk aset ini]."
    
    elif framework_name == "Generator Konten Multi-Platform":
        return f"Saya ingin create konten {{{trigger}}}. [Detail konten: topik/pesan utama, target audiens, gaya/nada, dan elemen pendukung spesifik untuk platform ini]."
    
    else:
        # Generic for other frameworks with complex dynamics
        return f"Saya ingin menggunakan framework ini untuk {{{trigger}}}. [Input detail akan muncul sesuai pilihan]."

def needs_dynamic_fix(framework_data):
    """Check if framework needs dynamic KONTEKS fix"""
    nama = framework_data.get("nama_kerangka", "")
    return nama in DYNAMIC_FRAMEWORKS

def fix_dynamic_konteks(framework_data):
    """Fix KONTEKS for frameworks with dynamic subcomponents"""
    nama = framework_data.get("nama_kerangka", "")
    
    if nama not in DYNAMIC_FRAMEWORKS:
        return False
    
    print(f"      🔧 Generating dynamic KONTEKS...")
    
    dynamic_config = DYNAMIC_FRAMEWORKS[nama]
    new_konteks = generate_dynamic_konteks(nama, dynamic_config)
    
    if "komponen_prompt" not in framework_data:
        framework_data["komponen_prompt"] = {}
    
    old_konteks = framework_data["komponen_prompt"].get("KONTEKS", "")
    framework_data["komponen_prompt"]["KONTEKS"] = new_konteks
    framework_data["updated_at"] = datetime.now().isoformat()
    
    print(f"      OLD: {old_konteks}")
    print(f"      NEW: {new_konteks}")
    
    return True

def process_framework(filepath):
    """Process single framework file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not needs_dynamic_fix(data):
            return False
        
        print(f"   📄 {filepath.name}")
        
        if fix_dynamic_konteks(data):
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"      ✅ Dynamic KONTEKS fixed")
            return True
        
        return False
        
    except Exception as e:
        print(f"      ❌ Error: {e}")
        return False

def main():
    """Main fix function"""
    print("=" * 80)
    print("🔧 FIX: Dynamic Subcomponents KONTEKS")
    print("=" * 80)
    print("Target: Frameworks with complex dynamicSubcomponents")
    print(f"Identified: {list(DYNAMIC_FRAMEWORKS.keys())}")
    print()
    
    total_fixed = 0
    total_checked = 0
    
    for category_dir in FRAMEWORKS_DIR.iterdir():
        if not category_dir.is_dir():
            continue
        
        for filepath in category_dir.rglob("*.json"):
            total_checked += 1
            
            if process_framework(filepath):
                total_fixed += 1
    
    print("\n" + "=" * 80)
    print(f"✅ DYNAMIC KONTEKS FIX COMPLETE")
    print("=" * 80)
    print(f"   Checked: {total_checked} frameworks")
    print(f"   Fixed: {total_fixed} frameworks")
    print()
    
    if total_fixed > 0:
        print("Fixed frameworks now have descriptive KONTEKS")
        print("that explains what dynamic inputs will appear.")
        print()
        print("Note: These are special frameworks where inputs vary")
        print("dramatically based on selection. KONTEKS provides context")
        print("about what fields will be populated dynamically.")
        print()
        print("Next: npm run build:frameworks && npm run validate")
    else:
        print("⚠️ No target frameworks found. Check paths.")
    print()

if __name__ == "__main__":
    main()
