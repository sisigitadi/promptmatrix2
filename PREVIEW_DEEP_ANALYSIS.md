# 🔬 DEEP ANALYSIS: Preview Issues & Blueprint Alignment

**Date:** 2025-12-23  
**Status:** COMPREHENSIVE RESEARCH COMPLETE

---

## 📋 FINDINGS: Multiple Framework Patterns

### **Pattern 1: Simple Frameworks** (~ 120 frameworks)
**Structure:**
```json
{
  "components": [...],
  "komponen_prompt": {
    "PERAN": "...",
    "KONTEKS": "...",
    "TUGAS": "...",
    "FORMAT_OUTPUT": "..."
  }
}
```

**Issues Found:**
1. ✅ FIXED: `{{double_braces}}` → `{single_braces}`
2. ✅ FIXED: Placeholder content
3. ⚠️ REMAINING: PERAN variables not wrapped in `**{VAR}**` in `[...]` blocks
4. ⚠️ REMAINING: KONTEKS variables incorrectly wrapped in `**{VAR}**`

---

### **Pattern 2: Dynamic Subcomponents** (~ 10 frameworks)
**Structure:**
```json
{
  "components": [{"name": "trigger"}],
  "komponen_prompt": {"PERAN"...}, // Generic/Placeholder
  "dynamicSubcomponents": {
    "trigger": "trigger",
    "options": {
      "option1": [... dynamic components...],
      "option2": [... different components...]
    }
  }
}
```

**Examples:**
- Studio Branding & Identitas
- Generator Konten Multi-Platform
- Asisten Perencana Gaya Hidup Personal

**Issues:**
- KONTEKS only references trigger, not dynamic fields
- ✅ FIXED: Added descriptive KONTEKS

---

### **Pattern 3: Dynamic komponen_prompt** (~ 5 frameworks)
**Structure:**
```json
{
  "components": [{"name": "mode"}],
  "komponen_prompt": {...}, // Root placeholder
  "dynamicSubcomponents": {
    "trigger": "mode",
    "options": {
      "mode1": {
        "komponen_prompt": {"TUGAS": "...", "FORMAT_OUTPUT": "..."},
        "components": [...]
      },
      "mode2": {
        "komponen_prompt": {"TUGAS": "...", "FORMAT_OUTPUT": "..."},
        "components": [...]
      }
    }
  }
}
```

**Examples:**
- Image Description & Generation

**Issues:**
- Root `komponen_prompt` is placeholder
- Real `komponen_prompt` changes per option
- Current preview logic doesn't handle this!

---

## 🎯 BLUEPRINT WORKFLOW OTOMASI PATTERN (GOLD STANDARD)

### **Exact Format:**

**PERAN:**
```
"Anda adalah [Role]. [Param 1: **{VAR1}**]. [Param 2: **{VAR2}**]."
```
- Variables in `[...]` blocks use `**{VAR}**`

**KONTEKS:**
```
"Saya ingin [action]. Main param adalah {VAR1}. Input dari {VAR2}, untuk {VAR3}. [Optional: {VAR4}]."
```
- Variables use `{VAR}` (no bold)
- Optional params in `[...]` blocks

**TUGAS:**
```
"[Specific instructions]"
```

**FORMAT_OUTPUT:**
```
"[Template with {{VAR}} for final output]"
```

---

## 🔧 REQUIRED FIXES

### **Fix 1: Variable Wrapping (Pattern 1)**

**PERAN:**
- ❌ Current: `[Param: {VAR}]`
- ✅ Should be: `[Param: **{VAR}**]`

**KONTEKS:**
- ❌ Current: may have `**{VAR}**`
- ✅ Should be: `{VAR}` only

### **Fix 2: Dynamic komponen_prompt Handling (Pattern 3)**

**Problem:** Preview doesn't show dynamic `komponen_prompt`

**Solution:** `promptGenerators.ts` needs to:
1. Check if framework has `dynamicSubcomponents` with `komponen_prompt` override
2. If trigger is selected, merge dynamic `komponen_prompt` with root
3. Use merged result for preview

**Code Location:** `src/utils/promptGenerators.ts` line ~310

---

## ✅ SOLUTION PLAN

### **Phase 1: JSON Fixes**
- [x] Fix double braces
- [x] Fix placeholder content
- [x] Fix dynamic subcomponents KONTEKS
- [ ] Fix variable wrapping in PERAN (`**{VAR}**`)
- [ ] Fix variable wrapping in KONTEKS (remove `**`)

### **Phase 2: Preview Logic**
- [ ] Handle dynamic `komponen_prompt` override
- [ ] Merge logic for multi-level komponen_prompt
- [ ] Test with all 3 patterns

### **Phase 3: Validation**
- [ ] Test ALL frameworks in browser
- [ ] Compare preview dengan Blueprint
- [ ] Document pattern guidelines

---

## 📊 ESTIMATED IMPACT

**Frameworks Needing Fixes:**
- Pattern 1 (Simple): ~60 frameworks (variable wrapping)
- Pattern 2 (Dynamic Subs): ~10 frameworks (already fixed)
- Pattern 3 (Dynamic Prompt): ~5 frameworks (needs code change)

**Total:** ~75 frameworks require fixes

---

## 🚀 NEXT ACTIONS

1. Create final variable wrapping fix script
2. Update `promptGenerators.ts` untuk dynamic komponen_prompt
3. Build & validate
4. Comprehensive browser testing
5. Deploy final version

**Est. Time:** 30-45 minutes
**Priority:** CRITICAL (affects preview quality)

---

**Analysis By:** Prompt Matrix Development Team  
**Approved For:** Immediate Implementation
