#!/usr/bin/env python3
"""
CRITICAL FIX: Replace {{double_braces}} with {single_braces}
Root Cause: Generated KONTEKS uses {{var}} instead of {var}
Blueprint Pattern: Uses {var} for replaceable placeholders
Author: Prompt Matrix Development Team
Date: 2025-12-23
"""

import json
import re
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent
FRAMEWORKS_DIR = BASE_DIR / "src" / "data" / "frameworks"

def fix_double_braces(text):
    """Convert {{variable}} to {variable}"""
    if not text:
        return text
    # Replace {{var}} with {var}
    return re.sub(r'\{\{(\w+)\}\}', r'{\1}', text)

def needs_fixing(framework_data):
    """Check if framework has double braces issue"""
    if "komponen_prompt" not in framework_data:
        return False
    
    kp = framework_data["komponen_prompt"]
    
    # Check all fields for {{}}
    for field in ["PERAN", "KONTEKS", "TUGAS", "FORMAT_OUTPUT"]:
        value = kp.get(field, "")
        if "{{" in str(value):
            return True
    
    return False

def fix_framework(framework_data):
    """Fix double braces in komponen_prompt"""
    if "komponen_prompt" not in framework_data:
        return False
    
    kp = framework_data["komponen_prompt"]
    fixed = False
    
    # Fix each field
    for field in ["PERAN", "KONTEKS", "TUGAS", "FORMAT_OUTPUT"]:
        if kp.get(field):
            original = kp[field]
            fixed_text = fix_double_braces(original)
            
            if fixed_text != original:
                kp[field] = fixed_text
                fixed = True
                print(f"         Fixed {field}")
    
    if fixed:
        framework_data["komponen_prompt"] = kp
        framework_data["updated_at"] = datetime.now().isoformat()
    
    return fixed

def process_framework(filepath):
    """Process single framework file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not needs_fixing(data):
            return False
        
        print(f"   📄 {filepath.name}")
        
        if fix_framework(data):
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"      ✅ Double braces fixed -> single braces")
            return True
        
        return False
        
    except Exception as e:
        print(f"      ❌ Error: {e}")
        return False

def main():
    """Main fix function"""
    print("=" * 80)
    print("🔧 CRITICAL FIX: {{double_braces}} → {single_braces}")
    print("=" * 80)
    print("Root Cause: Generated KONTEKS uses {{var}} instead of {var}")
    print("Blueprint uses: {var} for replaceable placeholders")
    print()
    
    total_fixed = 0
    total_checked = 0
    
    # Skip Blueprint Workflow Otomasi (already correct)
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
            
            if process_framework(filepath):
                category_fixed += 1
                total_fixed += 1
        
        if category_fixed > 0:
            print(f"   Fixed {category_fixed} frameworks in this category")
        else:
            print(f"   All OK in this category")
    
    print("\n" + "=" * 80)
    print(f"✅ DOUBLE BRACES FIX COMPLETE")
    print("=" * 80)
    print(f"   Checked: {total_checked} frameworks")
    print(f"   Fixed: {total_fixed} frameworks")
    print(f"   Already OK: {total_checked - total_fixed} frameworks")
    print()
    
    if total_fixed > 0:
        print("Pattern Fixed:")
        print("  {{variable}} → {variable}")
        print()
        print("Now preview will properly replace variables!")
        print()
        print("Next steps:")
        print("1. npm run build:frameworks")
        print("2. npm run validate")
        print("3. Test preview in browser")
        print("4. Commit & deploy")
    else:
        print("✨ All frameworks already use correct {single_braces}!")
    print()

if __name__ == "__main__":
    main()
