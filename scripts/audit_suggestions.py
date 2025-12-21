import os
import json
import re

def get_existing_suggestion_keys():
    ts_file = r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\suggestions.ts"
    keys = set()
    try:
        with open(ts_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Regex to find Main keys: KEY: [
            main_keys = re.findall(r'^\s*([A-Z_]+):\s*\[', content, re.MULTILINE)
            keys.update(main_keys)
            
            # Regex to find Aliases: INPUT_SUGGESTIONS["ALIAS"] = ...
            aliases = re.findall(r'INPUT_SUGGESTIONS\["([^"]+)"\]\s*=', content)
            keys.update(aliases)
    except Exception as e:
        print(f"Error reading suggestions.ts: {e}")
    return keys

def get_text_vars():
    base_path = r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks"
    ts_file = r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks.ts"
    
    unique_names = set()
    
    # Process JSON files
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith(".json"):
                try:
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        def process_comps(comps):
                            if not comps: return
                            for c in comps:
                                if c.get("type") in ["text", "textarea", "code"]: # code also uses suggestions
                                    unique_names.add(c.get("name"))
                        
                        process_comps(data.get("components"))
                        dynamic = data.get("dynamicSubcomponents")
                        if dynamic:
                            if not isinstance(dynamic, list): dynamic = [dynamic]
                            for ds in dynamic:
                                if "options" in ds:
                                    for opt_val in ds["options"].values():
                                        if isinstance(opt_val, list):
                                            process_comps(opt_val)
                                        elif isinstance(opt_val, dict) and "components" in opt_val:
                                            process_comps(opt_val["components"])
                except:
                    pass

    # Process TS file
    try:
        with open(ts_file, 'r', encoding='utf-8') as f:
            content = f.read()
            pattern = re.compile(r'name:\s*["\']([^"\']+)["\'],\s*.*type:\s*["\'](text|textarea|code)["\']', re.IGNORECASE | re.DOTALL)
            matches = pattern.findall(content)
            for m in matches:
                unique_names.add(m[0])
            pattern_rev = re.compile(r'type:\s*["\'](text|textarea|code)["\']\s*,.*name:\s*["\']([^"\']+)["\']', re.IGNORECASE | re.DOTALL)
            matches_rev = pattern_rev.findall(content)
            for m in matches_rev:
                unique_names.add(m[1])
    except:
        pass
        
    return unique_names

def check_coverage():
    suggestion_keys = get_existing_suggestion_keys()
    text_vars = get_text_vars()
    
    missing = []
    
    print("--- Audit Result ---")
    for var in text_vars:
        # Normalize var name logic from getRandomSuggestion: uppercase and replace space with underscore
        normalized = var.upper().replace(" ", "_")
        
        found = False
        # 1. Exact match
        if normalized in suggestion_keys:
            found = True
        else:
            # 2. Key contained in Var (reverse of logic in code but useful check)
            # Actually the code logic is:
            # - Exact match
            # - Dictionary key contained in Input Key (e.g. INPUT_TOPIK contains TOPIK)
            # - Input Key contained in Dictionary Key
            
            for k in suggestion_keys:
                if k in normalized or normalized in k:
                    found = True
                    break
        
        if not found:
            missing.append(var)
            
    print(f"Total Text/Code Variables: {len(text_vars)}")
    print(f"Total Covered: {len(text_vars) - len(missing)}")
    print(f"Total Missing Suggestions: {len(missing)}")
    print("\nMissing Variables:")
    for m in sorted(missing):
        print(f"- {m}")

if __name__ == "__main__":
    check_coverage()
