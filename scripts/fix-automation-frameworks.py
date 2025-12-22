import json
import re
from pathlib import Path

# Directory containing the framework JSON files
frameworks_dir = Path(r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks\KoleksiInovasi\Automation")

def sanitize_key(key):
    """Sanitize option keys to match schema pattern: ^[a-zA-Z0-9_\\s&/()\\-.]+$"""
    # Replace + with 'and'
    key = key.replace(' + ', ' and ')
    key = key.replace('+', ' and ')
    
    # Remove any other invalid characters (keep only allowed ones)
    # Allowed: a-zA-Z0-9_\s&/()-.
    key = re.sub(r'[^a-zA-Z0-9_\s&/()\-.]+', '', key)
    
    # Clean up multiple spaces
    key = re.sub(r'\s+', ' ', key).strip()
    
    return key

def fix_dynamic_subcomponents(subcomponents):
    """Fix dynamic subcomponents structure and sanitize keys"""
    if isinstance(subcomponents, list):
        for item in subcomponents:
            if 'options' in item and isinstance(item['options'], dict):
                # Create new options dict with sanitized keys
                new_options = {}
                for key, value in item['options'].items():
                    sanitized_key = sanitize_key(key)
                    new_options[sanitized_key] = value
                item['options'] = new_options
    return subcomponents

def fix_framework_file(filepath):
    """Fix a single framework JSON file"""
    print(f"Fixing {filepath.name}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Fix dynamic subcomponents
    if 'dynamicSubcomponents' in data:
        fix_dynamic_subcomponents(data['dynamicSubcomponents'])
    
    # Write back with proper formatting
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Fixed {filepath.name}")

def main():
    """Fix all framework files in the Automation directory"""
    json_files = list(frameworks_dir.glob("KOL-AUTO-*.json"))
    
    print(f"Found {len(json_files)} framework files to fix\n")
    
    for filepath in sorted(json_files):
        try:
            fix_framework_file(filepath)
        except Exception as e:
            print(f"✗ Error fixing {filepath.name}: {e}")
    
    print(f"\n✓ All files processed!")

if __name__ == "__main__":
    main()
