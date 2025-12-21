import os
import json
import re

def process_json_file(file_path):
    print(f"Processing JSON: {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        modified = False
        
        def check_comp(comp):
            nonlocal modified
            if isinstance(comp, dict) and comp.get("type") in ["select", "multiselect"] and "options" in comp:
                # Handle list of strings or list of objects {label, value}
                options = comp["options"]
                has_lainnya = False
                for opt in options:
                    if isinstance(opt, str) and opt == "Lainnya...":
                        has_lainnya = True
                        break
                    elif isinstance(opt, dict) and opt.get("value") == "Lainnya...":
                        has_lainnya = True
                        break
                
                if not has_lainnya:
                    # Append as string if options are strings, otherwise as object
                    if options and isinstance(options[0], dict):
                        options.append({"label": "Lainnya...", "value": "Lainnya..."})
                    else:
                        options.append("Lainnya...")
                    modified = True
                    print(f"  Added 'Lainnya...' to {comp.get('name')} in {file_path}")

        # 1. Check main components
        if "components" in data and isinstance(data["components"], list):
            for comp in data["components"]:
                check_comp(comp)

        # 2. Check dynamic subcomponents
        if "dynamicSubcomponents" in data:
            ds_list = data["dynamicSubcomponents"]
            if not isinstance(ds_list, list):
                ds_list = [ds_list]
            
            for ds in ds_list:
                if isinstance(ds, dict) and "options" in ds:
                    for trigger_val, opt_val in ds["options"].items():
                        comps = []
                        if isinstance(opt_val, list):
                            comps = opt_val
                        elif isinstance(opt_val, dict) and "components" in opt_val:
                            comps = opt_val["components"]
                        
                        for comp in comps:
                            check_comp(comp)

        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
    return False

def process_ts_file(file_path):
    print(f"Processing TS: {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Regex to find options array in select components
        # This is tricky because it's not pure JSON. 
        # Pattern: type: "select", ... options: [ ... ]
        
        # We look for blocks that have type: "select"
        # and then find the options: [...] within that same block before the next component or closing bracket
        
        # Pattern explanation:
        # Match "type": "select"
        # Followed by anything (non-greedy) until "options": [
        # Match the contents of the array [...]
        
        def add_lainnya(match):
            prefix = match.group(1) # everything before options content
            options_content = match.group(2) # content inside [ ]
            
            if '"Lainnya..."'.lower() not in options_content.lower() and "'Lainnya...'".lower() not in options_content.lower():
                # Check if it ends with a comma or not
                clean_content = options_content.strip()
                if clean_content and not clean_content.endswith(','):
                    return f'{prefix}{options_content}, "Lainnya..."]'
                else:
                    return f'{prefix}{options_content}"Lainnya..."]'
            return match.group(0)

        # Regex to find select/multiselect type and its options in TS/JS objects
        pattern = r'((?:type|\'type\'|"type")\s*:\s*[\'"](?:select|multiselect)[\'"].*? (?:options|\'options\'|"options")\s*:\s*\[)([^\]]*?)(\])'
        new_content, count = re.subn(pattern, add_lainnya, content, flags=re.DOTALL | re.IGNORECASE)

        if count > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  Modified {count} components in {file_path}")
            return True
        else:
            print(f"  No changes needed for {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
    return False

def main():
    base_path = r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks"
    ts_file = r"d:\Projects\Ai\PromptMatrix v2.0\PromptMatrixV20\src\data\frameworks.ts"
    
    total_json = 0
    modified_json = 0
    
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith(".json"):
                total_json += 1
                if process_json_file(os.path.join(root, file)):
                    modified_json += 1
    
    modified_ts = process_ts_file(ts_file)
    
    print(f"\nFinal Summary:")
    print(f"JSON Files: {total_json} checked, {modified_json} modified.")
    print(f"TS File: {'Modified' if modified_ts else 'No change'}")

if __name__ == "__main__":
    main()
