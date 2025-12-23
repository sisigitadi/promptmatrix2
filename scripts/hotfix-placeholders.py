#!/usr/bin/env python3
"""
HOTFIX: Replace Placeholders & Implement Seamless Storytelling
Purpose: Fix all frameworks with placeholder content and improve preview
Author: Prompt Matrix Development Team
Date: 2025-12-23
"""

import json
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent
FRAMEWORKS_DIR = BASE_DIR / "src" / "data" / "frameworks"

def has_placeholders(framework_data):
    """Check if framework has placeholder content"""
    if "komponen_prompt" not in framework_data:
        return False
    
    kp = framework_data["komponen_prompt"]
    placeholders = ["PLACEHOLDER", "{{CONTEXT}}", "{{TASK}}", "{{OUTPUT}}"]
    
    for key, value in kp.items():
        if any(p in str(value) for p in placeholders):
            return True
    return False

def generate_contextual_content(framework_data):
    """Generate proper contextual content based on framework type"""
    nama = framework_data.get("nama_kerangka", "")
    kategori = framework_data.get("kategori", [])
    components = framework_data.get("components", [])
    
    # Extract component names for template
    comp_names = {comp["name"]: comp.get("label", comp["name"]) for comp in components}
    
    # Build conditional context based on components
    context_parts = []
    for comp_name, comp_label in list(comp_names.items())[:5]:  # Max 5 untuk tidak terlalu panjang
        # Use conditional blocks for optional fields
        optional = any(c["name"] == comp_name and c.get("optional", False) for c in components)
        if optional:
            context_parts.append(f"[{comp_label}: {{{{{comp_name}}}}}]")
        else:
            context_parts.append(f"{comp_label}: {{{{{comp_name}}}}}")
    
    context = " ".join(context_parts) if context_parts else "Berdasarkan input yang diberikan"
    
    # Determine task based on category/name
    if any("musik" in str(k).lower() or "audio" in str(k).lower() for k in kategori):
        task = "Generate prompt musik yang menghasilkan komposisi sesuai dengan mood, genre, dan durasi yang diminta."
        format_output = "Sajikan prompt dalam format yang kompatibel dengan AI music generation tools, dengan deskripsi yang jelas dan parameter yang tepat."
    
    elif any("gambar" in str(k).lower() or "image" in str(k).lower() or "video" in str(k).lower() for k in kategori):
        task = "Generate prompt visual yang menghasilkan image/video sesuai dengan deskripsi, style, dan parameter yang diminta."
        format_output = "Sajikan prompt dalam format yang optimal untuk AI image/video generation, dengan detail visual yang jelas dan technical parameters yang sesuai."
    
    elif any("bisnis" in str(k).lower() or "business" in str(k).lower() for k in kategori):
        task = "Berikan analisis dan rekomendasi bisnis yang actionable berdasarkan konteks yang diberikan."
        format_output = "Sajikan dalam format terstruktur dengan executive summary, analisis detail, dan action items yang jelas."
    
    elif any("code" in str(k).lower() or "pengembang" in str(k).lower() or "developer" in str(k).lower() for k in kategori):
        task = "Generate code atau technical guidance yang clean, efficient, dan mengikuti best practices."
        format_output = "Sajikan dengan code examples, explanations, dan best practice recommendations yang jelas."
    
    elif any("marketing" in str(k).lower() or "pemasaran" in str(k).lower() for k in kategori):
        task = "Develop marketing content atau strategy yang engaging dan sesuai dengan target audience."
        format_output = "Sajikan dalam format marketing-ready dengan clear call-to-action dan measurable objectives."
    
    elif any("teks" in str(k).lower() or "content" in str(k).lower() or "writing" in str(k).lower() for k in kategori):
        task = "Generate konten tertulis yang engaging, informatif, dan sesuai dengan tujuan yang diminta."
        format_output = "Sajikan dalam format yang sesuai dengan medium target (blog, email, social media, etc.) dengan struktur yang jelas."
    
    else:
        # Generic
        task = f"Generate output yang sesuai dengan tujuan '{nama}' berdasarkan input yang diberikan."
        format_output = "Sajikan output dalam format yang terstruktur, jelas, dan mudah dipahami."
    
    return context, task, format_output

def fix_komponen_prompt(framework_data):
    """Fix komponen_prompt content"""
    if "komponen_prompt" not in framework_data:
        return framework_data
    
    kp = framework_data["komponen_prompt"]
    
    # Check if needs fixing
    if not has_placeholders(framework_data):
        return framework_data
    
    print(f"      🔧 Fixing placeholders...")
    
    # Generate contextual content
    context, task, format_output = generate_contextual_content(framework_data)
    
    # Replace placeholders
    if "PLACEHOLDER" in kp.get("KONTEKS", "") or "{{CONTEXT}}" in kp.get("KONTEKS", ""):
        kp["KONTEKS"] = context
    
    if "PLACEHOLDER" in kp.get("TUGAS", "") or "{{TASK}}" in kp.get("TUGAS", ""):
        kp["TUGAS"] = task
    
    if "PLACEHOLDER" in kp.get("FORMAT_OUTPUT", "") or "{{OUTPUT}}" in kp.get("FORMAT_OUTPUT", "") or "{{FORMAT" in kp.get("FORMAT_OUTPUT", ""):
        kp["FORMAT_OUTPUT"] = format_output
    
    framework_data["komponen_prompt"] = kp
    framework_data["updated_at"] = datetime.now().isoformat()
    
    return framework_data

def process_framework(filepath):
    """Process a single framework file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not has_placeholders(data):
            return False  # No fix needed
        
        print(f"   📄 {filepath.name}")
        data = fix_komponen_prompt(data)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"      ✅ Fixed")
        return True
        
    except Exception as e:
        print(f"      ❌ Error: {e}")
        return False

def main():
    """Main hotfix function"""
    print("=" * 80)
    print("🔧 HOTFIX: Replacing Placeholders & Implementing Seamless Storytelling")
    print("=" * 80)
    print()
    
    total_fixed = 0
    total_checked = 0
    
    # Process all JSON files in all categories
    for category_dir in FRAMEWORKS_DIR.iterdir():
        if not category_dir.is_dir():
            continue
        
        print(f"\n📁 Category: {category_dir.name}")
        
        json_files = list(category_dir.rglob("*.json"))
        if not json_files:
            continue
        
        category_fixed = 0
        for filepath in json_files:
            total_checked += 1
            if process_framework(filepath):
                category_fixed += 1
                total_fixed += 1
        
        if category_fixed > 0:
            print(f"   Fixed {category_fixed} frameworks in this category")
    
    print("\n" + "=" * 80)
    print(f"✅ HOTFIX COMPLETE")
    print("=" * 80)
    print(f"   Checked: {total_checked} frameworks")
    print(f"   Fixed: {total_fixed} frameworks")
    print(f"   Already OK: {total_checked - total_fixed} frameworks")
    print()
    
    if total_fixed > 0:
        print("Next steps:")
        print("1. npm run build:frameworks")
        print("2. npm run validate")
        print("3. Test in browser")
        print("4. Commit & deploy")
    else:
        print("✨ All frameworks already have proper content!")
    print()

if __name__ == "__main__":
    main()
