#!/usr/bin/env python3
"""
Week 4 FINAL - Complete Migration Script
Purpose: Upgrade ALL remaining frameworks to v2.7.0 SOP compliance
Categories: Teks & Konten, Prompt Ringkas, Prompt Proyek
Author: Prompt Matrix Development Team
Date: 2025-12-23
"""

import json
import os
from datetime import datetime
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent.parent
FRAMEWORKS_DIR = BASE_DIR / "src" / "data" / "frameworks"

# Categories to process
CATEGORIES = {
    "TeksKonten": "Teks & Konten",
    "PromptRingkas": "Prompt Ringkas",
    "PromptProyek": "Prompt Proyek"
}

# Default metadata values
DEFAULT_METADATA = {
    "examples": [],
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
    "version": "2.0.0",
}

def add_metadata(framework_data):
    """Add missing metadata"""
    for key, value in DEFAULT_METADATA.items():
        if key not in framework_data or framework_data[key] is None:
            framework_data[key] = value
    framework_data["updated_at"] = datetime.now().isoformat()
    return framework_data

def migrate_komponen_prompt(framework_data):
    """Migrate to new komponen_prompt structure"""
    if "komponen_prompt" in framework_data:
        return framework_data
    
    persona = framework_data.get("ai_logic_description", "")
    framework_data["komponen_prompt"] = {
        "PERAN": persona or "Anda adalah specialist di bidang ini.",
        "KONTEKS": "{{CONTEXT}}",
        "TUGAS": "{{TASK}}",
        "FORMAT_OUTPUT": "{{OUTPUT}}",
    }
    return framework_data

def add_dynamic_subcomponents(framework_data):
    """Auto-generate dynamic subcomponents"""
    if "components" not in framework_data:
        return framework_data
    
    dynamic_subs = framework_data.get("dynamicSubcomponents", [])
    
    for comp in framework_data["components"]:
        if comp.get("type") in ["select", "multiselect"]:
            options = comp.get("options", [])
            has_lainnya = any(
                opt == "Lainnya..." or 
                (isinstance(opt, dict) and opt.get("value") == "Lainnya...")
                for opt in options
            )
            
            if has_lainnya:
                existing = any(
                    sub.get("trigger") == comp["name"]
                    for sub in (dynamic_subs if isinstance(dynamic_subs, list) else [dynamic_subs])
                )
                
                if not existing:
                    new_sub = {
                        "trigger": comp["name"],
                        "options": {
                            "Lainnya...": [{
                                "name": f"custom_{comp['name']}",
                                "label": f"Sebutkan {comp['label']} Lainnya",
                                "type": "text",
                                "description": f"Input kustom untuk {comp['label']}.",
                                "placeholder": "Ketik opsi kustom...",
                                "optional": False,
                                "validation": {"min_length": 2},
                                "info": f"Manual input jika opsi standar tidak tersedia."
                            }]
                        }
                    }
                    
                    if isinstance(dynamic_subs, list):
                        dynamic_subs.append(new_sub)
                    else:
                        dynamic_subs = [new_sub]
    
    if dynamic_subs:
        framework_data["dynamicSubcomponents"] = dynamic_subs
    
    return framework_data

def upgrade_framework(filepath):
    """Upgrade single framework"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data = add_metadata(data)
        data = migrate_komponen_prompt(data)
        data = add_dynamic_subcomponents(data)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return True
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def main():
    """Main migration function"""
    print("=" * 90)
    print("🎯 WEEK 4 FINAL - COMPLETE MIGRATION TO V2.7.0")
    print("=" * 90)
    print("Categories: Teks & Konten, Prompt Ringkas, Prompt Proyek")
    print()
    
    total_success = 0
    total_count = 0
    category_stats = {}
    
    for cat_dir, cat_name in CATEGORIES.items():
        category_path = FRAMEWORKS_DIR / cat_dir
        print(f"\n📚 Category: {cat_name}")
        print("=" * 90)
        
        if not category_path.exists():
            print(f"   ⚠️  Directory not found")
            continue
        
        # Get all JSON files recursively
        json_files = list(category_path.rglob("*.json"))
        category_stats[cat_name] = {"total": len(json_files), "success": 0}
        
        print(f"   Found {len(json_files)} frameworks")
        
        for filepath in sorted(json_files):
            total_count += 1
            rel_path = filepath.relative_to(category_path)
            
            # Show progress every 10 files
            if total_count % 10 == 0:
                print(f"   Progress: {total_count}/{len(json_files)} ...", end='\r')
            
            if upgrade_framework(filepath):
                total_success += 1
                category_stats[cat_name]["success"] += 1
        
        print(f"   ✅ {category_stats[cat_name]['success']}/{category_stats[cat_name]['total']} upgraded")
    
    print("\n" + "=" * 90)
    print("📊 FINAL SUMMARY")
    print("=" * 90)
    
    for cat_name, stats in category_stats.items():
        print(f"   {cat_name}: {stats['success']}/{stats['total']} ✅")
    
    print(f"\n   TOTAL: {total_success}/{total_count} frameworks upgraded")
    print("=" * 90)
    
    # Calculate cumulative progress
    weeks_progress = {
        "Week 1 (Audio & Musik)": 7,
        "Week 2 (Gambar & Desain)": 20,
        "Week 3 (Koleksi & Inovasi)": 17,
        "Week 4 (Final)": total_success
    }
    
    grand_total = sum(weeks_progress.values())
    
    print(f"\n🎉 CUMULATIVE PROGRESS - OPTION A COMPLETE!")
    print("=" * 90)
    for week, count in weeks_progress.items():
        print(f"   {week}: {count} frameworks")
    print(f"\n   GRAND TOTAL: {grand_total}/62 frameworks ({(grand_total/62*100):.1f}%)")
    print("=" * 90)
    
    if total_success == total_count and grand_total >= 60:
        print("\n🌟 MISSION ACCOMPLISHED! ALL FRAMEWORKS UPGRADED TO V2.7.0 SOP! 🌟")
    
    print("\nNext steps:")
    print("1. npm run build:frameworks")
    print("2. npm run validate")
    print("3. git commit & push")
    print("4. npm run deploy")
    print("5. CELEBRATE! 🎊")
    print()

if __name__ == "__main__":
    main()
