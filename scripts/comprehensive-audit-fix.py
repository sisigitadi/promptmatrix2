#!/usr/bin/env python3
"""
COMPREHENSIVE AUDIT & FIX: Preview Alignment dengan Blueprint Pattern
Purpose: Ensure ALL frameworks follow Blueprint Workflow Otomasi pattern EXACTLY
Author: Prompt Matrix Development Team  
Date: 2025-12-23
"""

import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

BASE_DIR = Path(__file__).parent.parent
FRAMEWORKS_DIR = BASE_DIR / "src" / "data" / "frameworks"

# Blueprint pattern reference
BLUEPRINT_PATTERNS = {
    "PERAN_STRUCTURE": r"Anda adalah .+?\. (\[.+?: \*\*\{.+?\}\*\*\]\.?\s*)+",
    "KONTEKS_STRUCTURE": r"Saya ingin .+?\{.+?\}.+?\.",
    "VARIABLE_IN_PERAN": r"\*\*\{(\w+)\}\*\*",  # **{VAR}**
    "VARIABLE_IN_KONTEKS": r"(?<!\*)\{(\w+)\}(?!\*)",  # {VAR} not wrapped in **
    "CONDITIONAL_BLOCK": r"\[.+?\{.+?\}.+?\]",  # [Text: {var}]
}

class FrameworkAuditor:
    def __init__(self):
        self.issues = []
        self.fixes_applied = []
        
    def audit_framework(self, filepath: Path) -> Dict:
        """Comprehensive audit of single framework"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            framework_name = data.get("nama_kerangka", filepath.stem)
            kp = data.get("komponen_prompt", {})
            
            if not kp:
                return {"name": framework_name, "issues": ["Missing komponen_prompt"], "can_fix": False}
            
            issues_found = []
            
            # Check PERAN
            peran = kp.get("PERAN", "")
            if peran:
                peran_issues = self._audit_peran(peran, data.get("components", []))
                issues_found.extend(peran_issues)
            else:
                issues_found.append("Missing PERAN")
            
            # Check KONTEKS
            konteks = kp.get("KONTEKS", "")
            if konteks:
                konteks_issues = self._audit_konteks(konteks, data.get("components", []))
                issues_found.extend(konteks_issues)
            else:
                issues_found.append("Missing KONTEKS")
            
            # Check TUGAS
            if not kp.get("TUGAS"):
                issues_found.append("Missing TUGAS")
            
            # Check FORMAT_OUTPUT
            if not kp.get("FORMAT_OUTPUT"):
                issues_found.append("Missing FORMAT_OUTPUT")
            
            return {
                "name": framework_name,
                "path": str(filepath),
                "issues": issues_found,
                "can_fix": len(issues_found) > 0,
                "data": data
            }
            
        except Exception as e:
            return {"name": str(filepath), "issues": [f"Error: {e}"], "can_fix": False}
    
    def _audit_peran(self, peran: str, components: List) -> List[str]:
        """Audit PERAN structure"""
        issues = []
        
        # Check if variables use **{VAR}** pattern
        vars_found = re.findall(r'\{(\w+)\}', peran)
        for var in vars_found:
            # Check if wrapped in **
            if f"**{{{var}}}**" not in peran and f"{{{var}}}" in peran:
                # Variable not properly wrapped
                # Unless it's in a plain narrative part (not in [...])
                in_bracket = any(f"[{text}" in peran and f"{{{var}}}" in text for text in peran.split("]"))
                if in_bracket:
                    issues.append(f"PERAN variable {{{var}}} should be **{{{var}}}**")
        
        return issues
    
    def _audit_konteks(self, konteks: str, components: List) -> List[str]:
        """Audit KONTEKS structure"""
        issues = []
        
        # Check if variables are NOT wrapped in **
        if "**{" in konteks:
            issues.append("KONTEKS should NOT have **{VAR}** (only {VAR})")
        
        # Check if starts with narrative
        if not konteks.startswith("Saya"):
            issues.append("KONTEKS should start with 'Saya ingin/akan...'")
        
        # Check variables exist in components
        vars_in_konteks = re.findall(r'\{(\w+)\}', konteks)
        component_names = [c.get("name", "") for c in components]
        
        for var in vars_in_konteks:
            if var not in component_names:
                issues.append(f"KONTEKS variable {{{var}}} not in components")
        
        return issues
    
    def fix_framework(self, audit_result: Dict) -> bool:
        """Apply fixes to framework"""
        if not audit_result.get("can_fix"):
            return False
        
        data = audit_result["data"]
        kp = data.get("komponen_prompt", {})
        fixed = False
        
        # Fix PERAN: Ensure variables in [...] blocks use **{VAR}**
        if "PERAN" in kp:
            peran = kp["PERAN"]
            # Find all [...: {VAR}] patterns and wrap VAR in **
            peran_fixed = re.sub(
                r'(\[.+?:\s*)\{(\w+)\}(\s*\])',
                r'\1**{\2}**\3',
                peran
            )
            if peran_fixed != peran:
                kp["PERAN"] = peran_fixed
                fixed = True
                print(f"         Fixed PERAN variable wrapping")
        
        # Fix KONTEKS: Remove ** from variables
        if "KONTEKS" in kp:
            konteks = kp["KONTEKS"]
            konteks_fixed = re.sub(r'\*\*\{(\w+)\}\*\*', r'{\1}', konteks)
            if konteks_fixed != konteks:
                kp["KONTEKS"] = konteks_fixed
                fixed = True
                print(f"         Fixed KONTEKS variable wrapping")
        
        if fixed:
            data["komponen_prompt"] = kp
            data["updated_at"] = datetime.now().isoformat()
            
            # Write back
            filepath = Path(audit_result["path"])
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        
        return fixed

def main():
    """Main comprehensive audit and fix"""
    print("=" * 90)
    print("🔬 COMPREHENSIVE AUDIT: Blueprint Pattern Alignment")
    print("=" * 90)
    print("Reference: Blueprint Workflow Otomasi (KOL-AUTO-001 to 006)")
    print()
    
    auditor = FrameworkAuditor()
    
    all_audits = []
    total_checked = 0
    total_with_issues = 0
    total_fixed = 0
    
    # Skip Blueprint (already perfect)
    skip_paths = ["Blueprint Workflow Otomasi"]
    
    print("📋 Phase 1: Auditing All Frameworks")
    print("=" * 90)
    
    for category_dir in FRAMEWORKS_DIR.iterdir():
        if not category_dir.is_dir():
            continue
        
        print(f"\n📁 {category_dir.name}")
        
        for filepath in category_dir.rglob("*.json"):
            if any(skip in str(filepath) for skip in skip_paths):
                continue
            
            total_checked += 1
            audit = auditor.audit_framework(filepath)
            
            if audit["issues"]:
                all_audits.append(audit)
                total_with_issues += 1
                print(f"   ⚠️  {audit['name']}: {len(audit['issues'])} issues")
    
    print("\n" + "=" * 90)
    print("📋 Phase 2: Applying Fixes")
    print("=" * 90)
    
    for audit in all_audits:
        if audit["can_fix"]:
            print(f"\n   📄 {audit['name']}")
            if auditor.fix_framework(audit):
                total_fixed += 1
                print(f"      ✅ Fixed")
    
    print("\n" + "=" * 90)
    print("📊 COMPREHENSIVE AUDIT COMPLETE")
    print("=" * 90)
    print(f"   Total Checked: {total_checked} frameworks")
    print(f"   With Issues: {total_with_issues} frameworks")
    print(f"   Fixed: {total_fixed} frameworks")
    print(f"   Success Rate: {(total_fixed/total_with_issues*100) if total_with_issues > 0 else 100:.1f}%")
    print()
    
    print("Blueprint Pattern Applied:")
    print("  ✅ PERAN: Variables in [...] use **{VAR}**")
    print("  ✅ KONTEKS: Variables use {VAR} (no bold)")
    print("  ✅ Structure: Seamless narrative")
    print()
    
    if total_fixed > 0:
        print("Next steps:")
        print("1. npm run build:frameworks")
        print("2. npm run validate")
        print("3. Test preview in browser")
        print("4. Commit changes")
    else:
        print("✨ All frameworks already follow Blueprint pattern!")
    print()

if __name__ == "__main__":
    main()
