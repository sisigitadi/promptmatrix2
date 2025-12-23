#!/usr/bin/env python3
"""
Gambar & Desain Framework Migration Script - Week 2
Purpose: Upgrade 18 frameworks to v2.7.0 SOP compliance
Category: Gambar & Desain
Author: Prompt Matrix Development Team
Date: 2025-12-23
"""

import json
import os
from datetime import datetime
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent.parent
FRAMEWORKS_DIR = BASE_DIR / "src" / "data" / "frameworks" / "GambarDesain"

# Default metadata values
DEFAULT_METADATA = {
    "examples": [],
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
    "version": "2.0.0",  # Bump from 1.0.0
}

# Frameworks to upgrade by subcategory
FRAMEWORKS = {
    "Analisis Multimodal": [
        "Analis Multimodal Cerdas.json"
    ],
    "Perencanaan Video & Visual": [
        "Ide Konten Video.json",
        "Script Iklan.json"
    ],
    "Platform Desain Berbasis AI": [
        "Canva (Magic Design).json"
    ],
    "Prompt AI Gambar (Text-to-Image)": [
        "Custom Image Generator.json",
        "DALL-E 3.json",
        "Firefly (Adobe).json",
        "Ideogram.json",
        "Image Description & Generation.json",
        "Leonardo AI.json",
        "Midjourney.json",
        "NightCafe.json",
        "Playground AI.json",
        "Stable Diffusion.json"
    ],
    "Prompt AI Video (Text-to-Video)": [
        "Google VEO.json",
        "Kaiber.json",
        "Pika.json",
        "Runway.json",
        "Sora (OpenAI).json"
    ],
    "Utilitas & Penyuntingan AI": [
        "Clipdrop.json"
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
    """
    Migrate to new komponen_prompt structure if needed
    Special handling for platform-specific frameworks (Midjourney, Stable Diffusion)
    """
    # Check if it's a special framework that uses custom structure
    framework_name = framework_data.get("nama_kerangka", "")
    
    # Midjourney and Stable Diffusion keep their custom structures
    if framework_name in ["Midjourney", "Stable Diffusion"]:
        # Just ensure metadata is present, don't change prompt structure
        return framework_data
    
    if "komponen_prompt" not in framework_data:
        # Old structure - create new one
        persona = framework_data.get("ai_logic_description", "")
        
        # Improved templates for Gambar & Desain
        if "Image" in framework_name or "Gambar" in framework_name:
            framework_data["komponen_prompt"] = {
                "PERAN": persona or "Anda adalah AI Image Generation Expert yang memahami prompt engineering untuk berbagai platform.",
                "KONTEKS": "[Deskripsi subjek: {subject}] [Gaya visual: {style}] [Parameter teknis: {parameters}]",
                "TUGAS": "Generate prompt yang optimal untuk menghasilkan gambar sesuai deskripsi dan gaya yang diminta.",
                "FORMAT_OUTPUT": "Sajikan prompt dalam format yang sesuai dengan platform target, dengan detail visualisasi yang jelas dan parameter teknis yang tepat."
            }
        elif "Video" in framework_name:
            framework_data["komponen_prompt"] = {
                "PERAN": persona or "Anda adalah AI Video Generation Expert yang memahami cinematography dan storytelling visual.",
                "KONTEKS": "[Konsep video: {concept}] [Gaya sinematik: {style}] [Durasi target: {duration}]",
                "TUGAS": "Generate prompt yang menghasilkan video dengan narrative flow dan visual continuity yang baik.",
                "FORMAT_OUTPUT": "Sajikan prompt dengan scene breakdown, camera movements, dan transition details yang jelas."
            }
        else:
            framework_data["komponen_prompt"] = {
                "PERAN": persona or "Anda adalah ahli dalam bidang desain visual dan content creation.",
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
                                    "placeholder": "Contoh: Gaya kustom, teknik baru, dll...",
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

def apply_hybrid_localization_hints(framework_data):
    """
    Apply hybrid localization hints
    Week 2 improvement: Add specific examples for review
    """
    framework_data["_review_notes"] = framework_data.get("_review_notes", [])
    
    # Analyze options and suggest improvements
    if "components" in framework_data:
        for comp in framework_data["components"]:
            if "options" in comp and isinstance(comp["options"], list):
                for i, opt in enumerate(comp["options"]):
                    opt_str = opt if isinstance(opt, str) else opt.get("label", "")
                    # Check if it needs hybrid format
                    if opt_str and opt_str != "Lainnya...":
                        # If it's all Indonesian or has no explanation
                        if not "(" in opt_str or not any(c.isupper() for c in opt_str[:10]):
                            framework_data["_review_notes"].append(
                                f"TODO: Apply hybrid format to '{comp['label']}' option '{opt_str}'"
                            )
    
    return framework_data

def add_conditional_blocks_suggestion(framework_data):
    """Add notes for conditional blocks implementation"""
    if "komponen_prompt" in framework_data:
        persona = framework_data["komponen_prompt"].get("PERAN", "")
        context = framework_data["komponen_prompt"].get("KONTEKS", "")
        
        # Check if conditional blocks could be added
        if "{" in persona or "{" in context:
            notes = framework_data.get("_review_notes", [])
            notes.append("TODO: Consider adding conditional blocks [...] for optional parameters")
            framework_data["_review_notes"] = notes
    
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
        data = apply_hybrid_localization_hints(data)
        data = add_conditional_blocks_suggestion(data)
        
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
    print("=" * 70)
    print("🎨 GAMBAR & DESAIN FRAMEWORK MIGRATION - WEEK 2")
    print("=" * 70)
    
    total_frameworks = sum(len(files) for files in FRAMEWORKS.values())
    print(f"Target: {total_frameworks} frameworks")
    print(f"Version: 1.0.0 → 2.0.0")
    print(f"Subcategories: {len(FRAMEWORKS)}")
    print()
    
    success_count = 0
    total_count = 0
    
    for subcategory, framework_files in FRAMEWORKS.items():
        print(f"\n📁 Subcategory: {subcategory} ({len(framework_files)} frameworks)")
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
    
    print("\n" + "=" * 70)
    print(f"✅ Migration Complete: {success_count}/{total_count} successful")
    print("=" * 70)
    print()
    
    if success_count == total_count:
        print("🎉 ALL FRAMEWORKS UPGRADED SUCCESSFULLY!")
    else:
        print(f"⚠️ {total_count - success_count} frameworks had issues")
    
    print()
    print("Next steps:")
    print("1. npm run build:frameworks")
    print("2. npm run validate")
    print("3. Manual review of _review_notes in JSON files")
    print("4. Test in browser (especially platform-specific frameworks)")
    print("5. Update Week 2 report")
    print()

if __name__ == "__main__":
    main()
