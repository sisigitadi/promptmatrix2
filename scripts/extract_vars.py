import os
import json
import re

def extract_variable_names():
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
                                if c.get("type") in ["text", "textarea"]:
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

    # Process TS file (simple regex for name: "...")
    try:
        with open(ts_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Find name and type together to ensure it's text/textarea
            # This regex looks for name: "..." followed by type: "text" or "textarea"
            # It's a bit loose but should capture most
            pattern = re.compile(r'name:\s*["\']([^"\']+)["\'],\s*.*type:\s*["\'](text|textarea)["\']', re.IGNORECASE | re.DOTALL)
            matches = pattern.findall(content)
            for m in matches:
                unique_names.add(m[0])
                
            # Try the reverse order too
            pattern_rev = re.compile(r'type:\s*["\'](text|textarea)["\']\s*,.*name:\s*["\']([^"\']+)["\']', re.IGNORECASE | re.DOTALL)
            matches_rev = pattern_rev.findall(content)
            for m in matches_rev:
                unique_names.add(m[1])
    except:
        pass
        
    return sorted([n for n in unique_names if n])

def main():
    names = extract_variable_names()
    print(f"Found {len(names)} variables for Dice:")
    for name in names:
        print(name)

if __name__ == "__main__":
    main()
