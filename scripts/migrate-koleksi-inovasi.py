#!/usr/bin/env python3
"""
Koleksi & Inovasi Framework Migration Script - Week 3
Purpose: Upgrade remaining subcategories to v2.7.0 SOP compliance
Category: Koleksi & Inovasi (excluding Blueprint Workflow Otomasi - already compliant)
Author: Prompt Matrix Development Team
Date: 2025-12-23
"""

import json
import os
from datetime import datetime
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent.parent
FRAMEWORKS_DIR = BASE_DIR / "src" / "data" / "frameworks" / "KoleksiInovasi"

# Default metadata values
DEFAULT_METADATA = {
    "examples": [],
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
    "version": "2.0.0",  # Bump from 1.0.0
}

# Frameworks to upgrade by subcategory
# NOTE: Blueprint Workflow Otomasi EXCLUDED - already v2.7.0 compliant (Gold Standard)
FRAMEWORKS = {
    "Advanced Prompting Techniques": [
        "Multi-Agent Code Review.json",
        "RAG-Enhanced Content Generator.json"
    ],
    "Bisnis": [
        "Akselerator Perencanaan Startup.json",
        "Asisten Akuntansi & Keuangan Bisnis.json",
        "Asisten Rekrutmen & SDM.json",
        "Keuangan & Investasi.json",
        "Konsultan Dokumen & Kepatuhan Hukum.json",
        "Manajer Produk Virtual.json",
        "Pusat Analisis Data Bisnis.json",
        "Pusat Bantuan Layanan Pelanggan.json",
        "Studio Desain UI-UX.json"
    ],
    "Cyber Security": [
        "KOL-SEC-001.json",
        "KOL-SEC-002.json",
        "KOL-SEC-003.json"
    ],
    "Dokumen Lanjutan": [
        "Pusat Dokumen Strategis & Kreatif.json"
    ],
    "Pemasaran": [
        "Pusat Strategi Pemasaran 360°.json"
    ],
    "Pengembangan Perangkat Lunak": [
        "Asisten Pengembang Cerdas.json"
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
    Special handling for business/technical frameworks
    """
    framework_name = framework_data.get("nama_kerangka", "")
    
    if "komponen_prompt" not in framework_data:
        # Old structure - create new one with contextual templates
        persona = framework_data.get("ai_logic_description", "")
        
        # Business frameworks
        if any(word in framework_name.lower() for word in ["bisnis", "startup", "keuangan", "investasi", "akuntansi"]):
            framework_data["komponen_prompt"] = {
                "PERAN": persona or "Anda adalah Business Strategy Expert dengan keahlian dalam operasional dan perencanaan bisnis.",
                "KONTEKS": "[Tujuan bisnis: {goal}] [Industri: {industry}] [Tahap: {stage}]",
                "TUGAS": "Berikan analisis dan rekomendasi strategis yang actionable dan terukur.",
                "FORMAT_OUTPUT": "Sajikan dalam format terstruktur dengan executive summary, analisis detail, dan action items yang jelas."
            }
        
        # Cyber Security
        elif "security" in framework_name.lower() or "cyber" in framework_name.lower():
            framework_data["komponen_prompt"] = {
                "PERAN": persona or "Anda adalah Cybersecurity Expert yang memahami threat landscape dan best practices security.",
                "KONTEKS": "[Aset yang dilindungi: {asset}] [Threat level: {threat}] [Compliance: {compliance}]",
                "TUGAS": "Identifikasi vulnerabilities, assess risks, dan berikan security recommendations yang comprehensive.",
                "FORMAT_OUTPUT": "Struktur laporan dengan risk matrix, remediation steps (prioritized), dan compliance checklist."
            }
        
        # Development/Technical
        elif any(word in framework_name.lower() for word in ["pengembang", "developer", "code", "software"]):
            framework_data["komponen_prompt"] = {
                "PERAN": persona or "Anda adalah Senior Software Engineer dengan expertise dalam best practices dan code quality.",
                "KONTEKS": "[Tech stack: {stack}] [Project type: {type}] [Requirements: {requirements}]",
                "TUGAS": "Provide technical guidance, code review, dan architectural recommendations.",
                "FORMAT_OUTPUT": "Format dengan code examples, best practices, potential issues, dan recommended solutions."
            }
        
        # Marketing
        elif "pemasaran" in framework_name.lower() or "marketing" in framework_name.lower():
            framework_data["komponen_prompt"] = {
                "PERAN": persona or "Anda adalah Marketing Strategist dengan pemahaman mendalam tentang digital marketing dan customer journey.",
                "KONTEKS": "[Target audience: {audience}] [Objective: {objective}] [Budget: {budget}]",
                "TUGAS": "Develop comprehensive marketing strategy dengan measurable KPIs dan tactical execution plan.",
                "FORMAT_OUTPUT": "Marketing plan dengan customer persona, channel strategy, content calendar, dan metrics framework."
            }
        
        # HR/Recruitment
        elif any(word in framework_name.lower() for word in ["rekrutmen", "sdm", "hr", "recruitment"]):
            framework_data["komponen_prompt"] = {
                "PERAN": persona or "Anda adalah HR Expert dengan spesialisasi dalam talent acquisition dan employee development.",
                "KONTEKS": "[Posisi: {position}] [Company culture: {culture}] [Requirements: {requirements}]",
                "TUGAS": "Design recruitment strategy, assessment criteria, dan onboarding process.",
                "FORMAT_OUTPUT": "HR document dengan job description, screening criteria, interview guide, dan evaluation rubric."
            }
        
        # Generic/Other
        else:
            framework_data["komponen_prompt"] = {
                "PERAN": persona or "Anda adalah ahli di bidang ini dengan pengalaman luas dan pemahaman mendalam.",
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
                                    "placeholder": "Contoh: Opsi kustom, kategori baru, dll...",
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
    """Apply hybrid localization review notes"""
    framework_data["_review_notes"] = framework_data.get("_review_notes", [])
    
    # Add specific review suggestions
    if "components" in framework_data:
        for comp in framework_data["components"]:
            if "options" in comp and isinstance(comp["options"], list):
                for opt in comp["options"]:
                    opt_str = opt if isinstance(opt, str) else opt.get("label", "")
                    if opt_str and opt_str != "Lainnya...":
                        # Check if needs hybrid format
                        if not "(" in opt_str:
                            framework_data["_review_notes"].append(
                                f"HYBRID: {comp['label']} → '{opt_str}' (add English technical term if applicable)"
                            )
    
    return framework_data

def add_seamless_storytelling_notes(framework_data):
    """Add notes for seamless storytelling implementation"""
    if "komponen_prompt" in framework_data:
        notes = framework_data.get("_review_notes", [])
        
        # Check for potential conditional blocks
        persona = framework_data["komponen_prompt"].get("PERAN", "")
        context = framework_data["komponen_prompt"].get("KONTEKS", "")
        
        if "{" in persona or "{" in context:
            notes.append("SEAMLESS: Add conditional blocks [...] for optional parameters")
        
        # Check for potential token optimization
        if "components" in framework_data and len(framework_data["components"]) > 5:
            notes.append("TOKEN: Review for smart deduplication opportunities")
        
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
        data = add_seamless_storytelling_notes(data)
        
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
    print("=" * 80)
    print("🏢 KOLEKSI & INOVASI FRAMEWORK MIGRATION - WEEK 3")
    print("=" * 80)
    
    total_frameworks = sum(len(files) for files in FRAMEWORKS.values())
    print(f"Target: {total_frameworks} frameworks")
    print(f"Version: 1.0.0 → 2.0.0")
    print(f"Subcategories: {len(FRAMEWORKS)}")
    print(f"Excluded: Blueprint Workflow Otomasi (6 frameworks - already v2.7.0 compliant)")
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
    
    print("\n" + "=" * 80)
    print(f"✅ Migration Complete: {success_count}/{total_count} successful")
    print("=" * 80)
    print()
    
    if success_count == total_count:
        print("🎉 ALL FRAMEWORKS UPGRADED SUCCESSFULLY!")
    else:
        print(f"⚠️ {total_count - success_count} frameworks had issues")
    
    print()
    print(f"📊 Cumulative Progress:")
    print(f"   Week 1: 7 frameworks (Audio & Musik)")
    print(f"   Week 2: 20 frameworks (Gambar & Desain)")
    print(f"   Week 3: {success_count} frameworks (Koleksi & Inovasi)")
    print(f"   Total: {7 + 20 + success_count}/62 frameworks ({((7+20+success_count)/62*100):.1f}%)")
    print()
    print("Next steps:")
    print("1. npm run build:frameworks")
    print("2. npm run validate")
    print("3. Manual review of _review_notes")
    print("4. Test business/technical frameworks")
    print("5. Commit, push, deploy")
    print("6. Proceed to Week 4 (final)")
    print()

if __name__ == "__main__":
    main()
