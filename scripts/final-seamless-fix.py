#!/usr/bin/env python3
"""
FINAL FIX: Implement True Seamless Storytelling (Blueprint Workflow Otomasi Pattern)
Purpose: Replace all komponen_prompt with proper narrative format
Reference: Blueprint Workflow Otomasi (KOL-AUTO-001 to 006)
Author: Prompt Matrix Development Team
Date: 2025-12-23
"""

import json
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent
FRAMEWORKS_DIR = BASE_DIR / "src" / "data" / "frameworks"

def generate_seamless_konteks(framework_data):
    """
    Generate seamless storytelling KONTEKS based on Blueprint pattern
    Pattern: Natural narrative with variables inline, not as list
    """
    components = framework_data.get("components", [])
    nama = framework_data.get("nama_kerangka", "")
    kategori = framework_data.get("kategori", [])
    
    # Get first 3-5 most important components
    main_components = []
    for comp in components[:5]:
        name = comp["name"]
        label = comp.get("label", name)
        optional = comp.get("optional", False)
        
        # Wrap optional in conditional blocks [...]
        if optional:
            main_components.append(f"[{label}: {{{{{name}}}}}]")
        else:
            main_components.append(f"{{{{{name}}}}}")
    
    # Build narrative KONTEKS based on category/type
    if any("musik" in str(k).lower() for k in kategori):
        konteks = f"Saya ingin generate musik dengan karakteristik {main_components[0] if main_components else 'yang ditentukan'}"
        if len(main_components) > 1:
            konteks += f", dengan durasi {main_components[1]}"
        if len(main_components) > 2 and "[" in str(main_components[2]):
            konteks += f" {main_components[2]}"
        konteks += "."
    
    elif any("gambar" in str(k).lower() or "image" in str(k).lower() for k in kategori):
        konteks = f"Saya ingin generate gambar/visual dengan deskripsi: {main_components[0] if main_components else '{description}'}"
        if len(main_components) > 1 and "negative" in components[1].get("label", "").lower():
            konteks += f". [Hindari elemen: {main_components[1]}]"
        if len(main_components) > 2:
            konteks += f" {main_components[2]}"
        konteks += "."
    
    elif any("video" in str(k).lower() for k in kategori):
        konteks = f"Saya ingin generate video dengan konsep: {main_components[0] if main_components else '{concept}'}"
        if len(main_components) > 1:
            konteks += f", durasi {main_components[1]}"
        konteks += "."
    
    elif any("bisnis" in str(k).lower() or "business" in str(k).lower() for k in kategori):
        konteks = f"Saya ingin develop strategi bisnis untuk {main_components[0] if main_components else '{business_goal}'}"
        if len(main_components) > 1:
            konteks += f" di industri {main_components[1]}"
        konteks += "."
    
    elif any("marketing" in str(k).lower() or "pemasaran" in str(k).lower() for k in kategori):
        konteks = f"Saya ingin create konten marketing untuk {main_components[0] if main_components else '{target}'}"
        if len(main_components) > 1:
            konteks += f" dengan format {main_components[1]}"
        konteks += "."
    
    elif any("teks" in str(k).lower() or "content" in str(k).lower() or "writing" in str(k).lower() for k in kategori):
        konteks = f"Saya ingin create konten tertulis tentang {main_components[0] if main_components else '{topic}'}"
        if len(main_components) > 1:
            konteks += f" untuk {main_components[1]}"
        konteks += "."
    
    else:
        # Generic but still seamless
        konteks = f"Input yang saya berikan: {', '.join(main_components[:3]) if main_components else '{user_input}'}."
    
    # Add additional instructions if exists
    for comp in components:
        if "additional" in comp["name"].lower() or "context" in comp.get("label", "").lower():
            konteks += f" [{comp.get('label', 'Instruksi tambahan')}: {{{{{comp['name']}}}}}"
            konteks += "]."
            break
    
    return konteks

def generate_seamless_peran(framework_data):
    """
    Generate seamless PERAN with variables wrapped naturally
    Pattern: Role + context variables wrapped in **{VAR}** or inline
    """
    ai_logic = framework_data.get("ai_logic_description", "")
    components = framework_data.get("components", [])
    kategori = framework_data.get("kategori", [])
    
    # Keep existing peran if it's already good
    kp = framework_data.get("komponen_prompt", {})
    existing_peran = kp.get("PERAN", "")
    
    # If existing peran already has variables wrapped, keep it
    if "**{" in existing_peran or existing_peran.startswith("Anda adalah"):
        return existing_peran
    
    # Otherwise use ai_logic_description
    if ai_logic:
        peran = ai_logic
    else:
        peran = "Anda adalah specialist di bidang ini"
    
    # Add key parameters inline if available
    key_params = []
    for comp in components:
        if comp.get("type") == "select" and not comp.get("optional", False):
            # Important select fields become inline
            if len(key_params) < 2:  # Max 2 inline params
                key_params.append(f"[{comp.get('label')}: **{{{{{comp['name']}}}}}**]")
    
    if key_params:
        peran += ". " + " ".join(key_params)
    
    return peran

def fix_framework(framework_data):
    """Fix komponen_prompt to follow Blueprint pattern"""
    if "komponen_prompt" not in framework_data:
        return framework_data
    
    kp = framework_data["komponen_prompt"]
    
    # Check if already properly formatted (has seamless narrative, no raw variables)
    konteks = kp.get("KONTEKS", "")
    if "{test}" in konteks or ":" in konteks and "{" in konteks.split(":")[1][:10]:
        # Needs fixing
        print(f"      🔧 Applying seamless storytelling...")
        
        kp["PERAN"] = generate_seamless_peran(framework_data)
        kp["KONTEKS"] = generate_seamless_konteks(framework_data)
        
        # TUGAS and FORMAT_OUTPUT usually OK, just ensure they exist
        if not kp.get("TUGAS") or "PLACEHOLDER" in kp.get("TUGAS", ""):
            kategori = framework_data.get("kategori", [])
            if any("musik" in str(k).lower() for k in kategori):
                kp["TUGAS"] = "Generate prompt yang menghasilkan musik sesuai karakteristik, mood, dan technical parameters yang diminta."
            elif any("gambar" in str(k).lower() or "image" in str(k).lower() for k in kategori):
                kp["TUGAS"] = "Generate prompt visual yang menghasilkan image dengan detail, style, dan composition yang diminta."
            else:
                kp["TUGAS"] = "Generate output yang sesuai dengan tujuan framework ini."
        
        if not kp.get("FORMAT_OUTPUT") or "PLACEHOLDER" in kp.get("FORMAT_OUTPUT", ""):
            kp["FORMAT_OUTPUT"] = "Sajikan output final dalam format yang sesuai dengan platform target, jelas, dan siap digunakan."
        
        framework_data["komponen_prompt"] = kp
        framework_data["updated_at"] = datetime.now().isoformat()
        
        return True
    
    return False

def process_framework(filepath):
    """Process single framework"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not fix_framework(data):
            return False
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return True
        
    except Exception as e:
        print(f"      ❌ Error: {e}")
        return False

def main():
    """Main fix function"""
    print("=" * 80)
    print("🎨 FINAL FIX: True Seamless Storytelling (Blueprint Pattern)")
    print("=" * 80)
    print("Reference: Blueprint Workflow Otomasi (KOL-AUTO-001 to 006)")
    print()
    
    total_fixed = 0
    total_checked = 0
    
    # Skip Blueprint Workflow Otomasi (already perfect)
    skip_paths = ["Blueprint Workflow Otomasi"]
    
    for category_dir in FRAMEWORKS_DIR.iterdir():
        if not category_dir.is_dir():
            continue
        
        print(f"\n📁 Category: {category_dir.name}")
        
        json_files = list(category_dir.rglob("*.json"))
        if not json_files:
            continue
        
        category_fixed = 0
        for filepath in json_files:
            # Skip if in Blueprint Workflow Otomasi
            if any(skip in str(filepath) for skip in skip_paths):
                continue
            
            total_checked += 1
            print(f"   📄 {filepath.name}")
            
            if process_framework(filepath):
                category_fixed += 1
                total_fixed += 1
                print(f"      ✅ Fixed")
            else:
                print(f"      ⏭️  Already OK")
    
    print("\n" + "=" * 80)
    print(f"✅ SEAMLESS STORYTELLING APPLIED")
    print("=" * 80)
    print(f"   Checked: {total_checked} frameworks")
    print(f"   Fixed: {total_fixed} frameworks")
    print(f"   Already OK: {total_checked - total_fixed} frameworks")
    print()
    print("Pattern Applied:")
    print("✅ PERAN: Role + inline variables **{VAR}**")
    print("✅ KONTEKS: Seamless narrative (not list)")
    print("✅ Variables: Wrapped naturally in sentences")
    print("✅ Optional: Wrapped in conditional blocks [...]")
    print()
    print("Next: npm run build:frameworks && npm run validate")
    print()

if __name__ == "__main__":
    main()
