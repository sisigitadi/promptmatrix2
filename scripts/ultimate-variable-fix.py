#!/usr/bin/env python3
"""
ULTIMATE FIX: Variable Wrapping Alignment dengan Blueprint Pattern
Purpose: Ensure PERAN uses **{VAR}** in [...] and KONTEKS uses {VAR} only
Reference: Blueprint Workflow Otomasi (KOL-AUTO-001)
Author: Prompt Matrix Development Team
Date: 2025-12-23
"""

import json
import re
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent
FRAMEWORKS_DIR = BASE_DIR / "src" / "data" / "frameworks"

def fix_peran_variables(peran: str) -> tuple[str, bool]:
    """
    Fix PERAN: Variables in [...] blocks should use **{VAR}**
    Blueprint pattern: [Param: **{VAR}**]
    """
    if not peran:
        return peran, False
    
    original = peran
    
    # Pattern: Find [...: {VAR}] and wrap VAR in **
    # Only wrap if not already wrapped
    fixed = re.sub(
        r'(\[.+?:\s*)\{(\w+)\}(?!\*)',  # [Text: {VAR} not followed by *
        r'\1**{\2}**',
        peran
    )
    
    return fixed, fixed != original

def fix_konteks_variables(konteks: str) -> tuple[str, bool]:
    """
    Fix KONTEKS: Variables should use {VAR} only (no **)
    Blueprint pattern: {VAR} not **{VAR}**
    """
    if not konteks:
        return konteks, False
    
    original = konteks
    
    # Remove ** from variables
    fixed = re.sub(r'\*\*\{(\w+)\}\*\*', r'{\1}', konteks)
    
    return fixed, fixed != original

def process_framework(filepath: Path) -> dict:
    """Process single framework file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if "komponen_prompt" not in data:
            return {"fixed": False, "reason": "No komponen_prompt"}
        
        kp = data["komponen_prompt"]
        peran_fixed = False
        konteks_fixed = False
        
        # Fix PERAN
        if "PERAN" in kp:
            new_peran, changed = fix_peran_variables(kp["PERAN"])
            if changed:
                kp["PERAN"] = new_peran
                peran_fixed = True
        
        # Fix KONTEKS
        if "KONTEKS" in kp:
            new_konteks, changed = fix_konteks_variables(kp["KONTEKS"])
            if changed:
                kp["KONTEKS"] = new_konteks
                konteks_fixed = True
        
        if peran_fixed or konteks_fixed:
            data["komponen_prompt"] = kp
            data["updated_at"] = datetime.now().isoformat()
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            return {
                "fixed": True,
                "peran": peran_fixed,
                "konteks": konteks_fixed
            }
        
        return {"fixed": False, "reason": "No changes needed"}
        
    except Exception as e:
        return {"fixed": False, "reason": f"Error: {e}"}

def main():
    """Main execution"""
    print("=" * 80)
    print("🔧 ULTIMATE FIX: Variable Wrapping (Blueprint Pattern)")
    print("=" * 80)
    print("PERAN: [...: {VAR}] → [...: **{VAR}**]")
    print("KONTEKS: **{VAR}** → {VAR}")
    print()
    
    total_checked = 0
    total_fixed = 0
    peran_fixes = 0
    konteks_fixes = 0
    
    skip_paths = ["Blueprint Workflow Otomasi"]
    
    for category_dir in FRAMEWORKS_DIR.iterdir():
        if not category_dir.is_dir():
            continue
        
        print(f"\n📁 {category_dir.name}")
        category_count = 0
        
        for filepath in category_dir.rglob("*.json"):
            if any(skip in str(filepath) for skip in skip_paths):
                continue
            
            total_checked += 1
            result = process_framework(filepath)
            
            if result.get("fixed"):
                category_count += 1
                total_fixed += 1
                
                if result.get("peran"):
                    peran_fixes += 1
                if result.get("konteks"):
                    konteks_fixes += 1
                
                fixes = []
                if result.get("peran"):
                    fixes.append("PERAN")
                if result.get("konteks"):
                    fixes.append("KONTEKS")
                
                print(f"   ✅ {filepath.name}: Fixed {', '.join(fixes)}")
        
        if category_count > 0:
            print(f"   → {category_count} frameworks fixed in this category")
    
    print("\n" + "=" * 80)
    print("✅ VARIABLE WRAPPING FIX COMPLETE")
    print("=" * 80)
    print(f"   Total Checked: {total_checked} frameworks")
    print(f"   Total Fixed: {total_fixed} frameworks")
    print(f"     - PERAN fixes: {peran_fixes}")
    print(f"     - KONTEKS fixes: {konteks_fixes}")
    print()
    
    if total_fixed > 0:
        print("Blueprint Pattern Applied:")
        print("  ✅ PERAN: Variables in [...] use **{VAR}**")
        print("  ✅ KONTEKS: Variables use {VAR} (no bold)")
        print()
        print("Next: Update promptGenerators.ts for dynamic komponen_prompt")
    else:
        print("✨ All frameworks already follow correct variable wrapping!")
    print()

if __name__ == "__main__":
    main()
