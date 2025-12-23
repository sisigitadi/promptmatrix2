#!/usr/bin/env python3
"""
Audio & Musik Framework Migration Script
Purpose: Upgrade 7 frameworks to v2.7.0 SOP compliance
Category: Audio & Musik
Author: Prompt Matrix Development Team
Date: 2025-12-23
"""

import json
import os
from datetime import datetime
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent.parent
FRAMEWORKS_DIR = BASE_DIR / "src" / "data" / "frameworks" / "AudioMusik"

# Default metadata values
DEFAULT_METADATA = {
    "examples": [],
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
    "version": "2.0.0",  # Bump from 1.0.0
}

# Frameworks to upgrade
FRAMEWORKS = {
    "Alat Bantu Komposisi": [
        "Ide Progresi Kord.json",
        "Penulisan Lirik Lagu.json"
    ],
    "Prompt AI Musik & Audio": [
        "Mubert.json",
        "MusicFX (Google).json",
        "Stable Audio.json",
        "Suno AI.json",
        "Udio.json"
    ]
}

def add_metadata(framework_data):
    """Add missing metadata to framework"""
    for key, value in DEFAULT_METADATA.items():
        if key not in framework_data or framework_data[key] is None:
            framework_data[key] = value
    
    # Add updated timestamp
    framework_data["updated_at"] = datetime.now().isoformat()
    
    return framework_data

def migrate_komponen_prompt(framework_data):
    """Migrate to new komponen_prompt structure if needed"""
    if "komponen_prompt" not in framework_data:
        # Old structure - create new one
        persona = framework_data.get("ai_logic_description", "")
        framework_data["komponen_prompt"] = {
            "PERAN": persona,
            "KONTEKS": "{{CONTEXT_PLACEHOLDER}}",
            "TUGAS": "{{TASK_PLACEHOLDER}}",
            "FORMAT_OUTPUT": "{{FORMAT_PLACEHOLDER}}"
        }
    
    return framework_data

def add_dynamic_subcomponents(framework_data):
    """Auto-generate dynamic subcomponents for 'Lainnya...' options"""
    if "components" not in framework_data:
        return framework_data
    
    dynamic_subs = framework_data.get("dynamicSubcomponents", [])
    
    for comp in framework_data["components"]:
        # Check if this component has "Lainnya..." option
        if comp.get("type") in ["select", "multiselect"]:
            options = comp.get("options", [])
            has_lainnya = any(
                opt == "Lainnya..." or 
                (isinstance(opt, dict) and opt.get("value") == "Lainnya...")
                for opt in options
            )
            
            if has_lainnya:
                # Check if dynamic sub already exists
                existing = any(
                    sub.get("trigger") == comp["name"]
                    for sub in (dynamic_subs if isinstance(dynamic_subs, list) else [dynamic_subs])
                )
                
                if not existing:
                    # Create new dynamic subcomponent
                    new_sub = {
                        "trigger": comp["name"],
                        "options": {
                            "Lainnya...": [
                                {
                                    "name": f"custom_{comp['name']}",
                                    "label": f"Sebutkan {comp['label']} Lainnya",
                                    "type": "text",
                                    "description": f"Ketik manual nilai kustom untuk {comp['label']}.",
                                    "placeholder": "Contoh: Platform kustom, tool baru, dll...",
                                    "optional": False,
                                    "validation": {"min_length": 2},
                                    "info": f"Input manual jika pilihan {comp['label']} standar tidak tersedia."
                                }
                            ]
                        }
                    }
                    
                    if isinstance(dynamic_subs, list):
                        dynamic_subs.append(new_sub)
                    else:
                        dynamic_subs = [new_sub]
    
    if dynamic_subs:
        framework_data["dynamicSubcomponents"] = dynamic_subs
    
    return framework_data

def apply_hybrid_localization(framework_data):
    """Apply hybrid localization to options (Technical EN + Explanatory ID)"""
    # This would require manual review for each framework
    # For now, just flag for review
    framework_data["_review_notes"] = framework_data.get("_review_notes", [])
    framework_data["_review_notes"].append(
        "TODO: Review options for hybrid localization (Technical EN + ID)"
    )
    return framework_data

def upgrade_framework(filepath):
    """Upgrade a single framework file"""
    print(f"\n📄 Processing: {filepath.name}")
    
    try:
        # Read current framework
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Apply upgrades
        data = add_metadata(data)
        data = migrate_komponen_prompt(data)
        data = add_dynamic_subcomponents(data)
        data = apply_hybrid_localization(data)
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"   ✅ Upgraded successfully")
        return True
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def main():
    """Main migration function"""
    print("=" * 60)
    print("🎵 AUDIO & MUSIK FRAMEWORK MIGRATION")
    print("=" * 60)
    print(f"Target: {len([f for files in FRAMEWORKS.values() for f in files])} frameworks")
    print(f"Version: 1.0.0 → 2.0.0")
    print()
    
    success_count = 0
    total_count = 0
    
    for subcategory, framework_files in FRAMEWORKS.items():
        print(f"\n📁 Subcategory: {subcategory}")
        subcategory_dir = FRAMEWORKS_DIR / subcategory
        
        if not subcategory_dir.exists():
            print(f"   ⚠️ Directory not found: {subcategory_dir}")
            continue
        
        for filename in framework_files:
            filepath = subcategory_dir / filename
            total_count += 1
            
            if not filepath.exists():
                print(f"\n📄 {filename}")
                print(f"   ⚠️ File not found")
                continue
            
            if upgrade_framework(filepath):
                success_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Migration Complete: {success_count}/{total_count} successful")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. npm run build:frameworks")
    print("2. npm run validate")
    print("3. Manual review of _review_notes in JSON files")
    print("4. Test in browser")
    print()

if __name__ == "__main__":
    main()
