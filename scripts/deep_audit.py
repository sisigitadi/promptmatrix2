import os
import json
import re

# 1. Load existing suggestions and aliases
TS_FILE = r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\suggestions.ts"
FRAMEWORKS_DIR = r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks"
TS_FRAMEWORKS = r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks.ts"

def load_suggestions_map():
    mapping = {}
    keys_defined = set()
    
    try:
        with open(TS_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Find main definitions: KEY: [ ... ]
            # This regex is a bit simplistic but works for the current file structure
            main_blocks = re.findall(r'^\s*([A-Z_0-9]+):\s*\[', content, re.MULTILINE)
            for k in main_blocks:
                keys_defined.add(k)
                mapping[k] = k # Maps to itself
            
            # Find aliases: INPUT_SUGGESTIONS["ALIAS"] = INPUT_SUGGESTIONS["TARGET"];
            aliases = re.findall(r'INPUT_SUGGESTIONS\["([^"]+)"\]\s*=\s*INPUT_SUGGESTIONS\["([^"]+)"\]', content)
            for alias, target in aliases:
                mapping[alias] = target
                
    except Exception as e:
        print(f"Error reading suggestions: {e}")
        
    return mapping

def get_all_vars():
    vars_found = set()
    
    # Scan JSONs
    for root, dirs, files in os.walk(FRAMEWORKS_DIR):
        for file in files:
            if file.endswith(".json"):
                try:
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        def extract(comps):
                            if not comps: return
                            for c in comps:
                                if c.get("type") in ["text", "textarea", "code"]:
                                    vars_found.add(c.get("name"))
                        
                        extract(data.get("components"))
                        
                        # Dynamic
                        dyn = data.get("dynamicSubcomponents")
                        if dyn:
                            if not isinstance(dyn, list): dyn = [dyn]
                            for d in dyn:
                                if "options" in d:
                                    for opt in d["options"].values():
                                        if isinstance(opt, list): extract(opt)
                                        elif isinstance(opt, dict): extract(opt["components"])
                except:
                   pass

    # Scan TS Frameworks
    try:
        with open(TS_FRAMEWORKS, 'r', encoding='utf-8') as f:
            content = f.read()
            # Heuristic regex
            pattern = re.compile(r'name:\s*["\']([^"\']+)["\'],\s*.*type:\s*["\'](text|textarea|code)["\']', re.IGNORECASE | re.DOTALL)
            for m in pattern.findall(content):
                vars_found.add(m[0])
            pattern_rev = re.compile(r'type:\s*["\'](text|textarea|code)["\']\s*,.*name:\s*["\']([^"\']+)["\']', re.IGNORECASE | re.DOTALL)
            for m in pattern_rev.findall(content):
                vars_found.add(m[1])
    except:
        pass
        
    return sorted(list(vars_found))

def audit():
    mapping = load_suggestions_map()
    all_vars = get_all_vars()
    
    missing = []
    covered = []
    
    print(f"Total Variables Found: {len(all_vars)}")
    
    for v in all_vars:
        norm = v.upper().replace(" ", "_")
        
        is_covered = False
        
        # 1. Exact match in mapping keys
        if norm in mapping:
            is_covered = True
        
        # 2. Heuristic match (logic inside getRandomSuggestion)
        if not is_covered:
            # Check if Dictionary Key is inside Input Key (e.g. INPUT_TOPIC contains TOPIC)
            for map_key in mapping.keys():
                if map_key in norm: 
                    is_covered = True
                    break
            
            # Check if Input Key is inside Dictionary Key
            if not is_covered:
                for map_key in mapping.keys():
                    if norm in map_key:
                        is_covered = True
                        break
        
        if is_covered:
            covered.append(v)
        else:
            missing.append(v)
            
    print(f"Covered: {len(covered)}")
    print(f"Missing: {len(missing)}")
    print("-" * 30)
    print("MISSING VARIABLES (Please add these):")
    for m in missing:
        print(f"- {m}")

if __name__ == "__main__":
    audit()
