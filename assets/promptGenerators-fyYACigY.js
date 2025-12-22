const h={MIDJOURNEY:"Midjourney",STABLE_DIFFUSION:"Stable Diffusion",GENERIC_IMAGE_VIDEO:["DALL-E 3","Sora (OpenAI)","Pika","Runway","Google VEO"]},T=n=>{if(!n)return"";let t=n;return t.match(/^(Level|Opsi|Tahap) \d+\s*:/i)&&(t=t.replace(/^(Level|Opsi|Tahap) \d+\s*:\s*/i,"")),t=t.split(/\s+[-–—]\s+/)[0],t=t.split(/\s*\(/)[0],t.trim()},S=(n,t,s)=>n.replace(/\[([^\]]+)\]/g,(i,r)=>{const c=r.match(/\{([a-zA-Z0-9_]+)\}/g);if(!c)return r;let p=!1;for(const e of c){const o=e.replace(/\{|\}/g,"");let a=t[o];if(a==="Lainnya..."&&(a=s[o]),a&&(typeof a!="string"||a.trim()!=="")&&(!Array.isArray(a)||a.length>0)){p=!0;break}}return p?r:""}),g=(n,t,s)=>{let i=S(n,t,s);for(const e in t){const o=`{${e}}`;let a=t[e];if(a==="Lainnya..."&&(a=s[e]||""),typeof a=="string"||typeof a=="number"){const l=T(String(a));i=i.replace(new RegExp(o,"g"),l)}else if(Array.isArray(a)){const l=a.map(y=>y==="Lainnya..."?s[e]||"":T(String(y)));i=i.replace(new RegExp(o,"g"),l.filter(Boolean).join(", "))}}const r="dari|ke|via|menggunakan|dengan|untuk|tentang|pada|di|pakai|sebagai",c=new RegExp(`\\b(${r})\\b\\s+(?=\\s|[.,:;!?\\n]|$)`,"gi");let p="";for(;i!==p;)p=i,i=i.replace(c,"");return i=i.replace(/  +/g," ").trim(),i=i.replace(/\s+([.,:;!?])/g,"$1"),i=i.replace(/,\s*,/g,","),i=i.replace(/,\s*\./g,"."),i=i.replace(/^\s*,/,""),i},P=(n,t,s)=>{if(!n||!n.komponen_prompt)return O(n,n?.nama_kerangka||"",t,s);const{PERAN:i="",KONTEKS:r="",TUGAS:c=""}=n.komponen_prompt||{},p=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(m=>{if(m&&m.trigger){const d=t[m.trigger];if(d&&m.options[d]){const u=m.options[d];u&&("components"in u&&Array.isArray(u.components)?p.push(...u.components):Array.isArray(u)&&p.push(...u))}}});const o={...t};p.forEach(m=>{t[m.name]==="Lainnya..."&&(o[m.name]=s[m.name]||"")});const a=g(i||"",o,s),l=g(r||"",o,s);let y=c||"";if(n.dynamicSubcomponents&&!Array.isArray(n.dynamicSubcomponents)){const m=n.dynamicSubcomponents.trigger,d=o[m];if(d){const u=n.dynamicSubcomponents.options[d];u&&!Array.isArray(u)&&typeof u=="object"&&"komponen_prompt"in u&&u.komponen_prompt?.TUGAS&&(y=u.komponen_prompt.TUGAS)}}const A=g(y,o,s);let _="";a&&(_+=`**Peran:**
${a}

`),l&&(_+=`**Konteks:**
${l}

`),A&&(_+=`**Tugas:**
${A}

`),n.konteks_tambahan_instruksi_khusus&&(_+=`**Instruksi Tambahan:**
${g(n.konteks_tambahan_instruksi_khusus,o,s)}

`);const f=n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"];return f&&(_+=`**Format Output:**
${g(f,o,s)}
`),_.trim()},$=(n,t,s)=>{if(!n)return"";const i=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(e=>{if(e&&e.trigger){const o=t[e.trigger];if(o&&e.options[o]){const a=e.options[o];a&&("components"in a&&Array.isArray(a.components)?i.push(...a.components):Array.isArray(a)&&i.push(...a))}}});let c=!1;i.forEach(e=>{const o=t[e.name];o!==void 0&&o!==""&&o!==null&&(!Array.isArray(o)||o.length>0)&&(c=!0)});let p="";if(n.komponen_prompt){if(n.komponen_prompt.PERAN){let e=g(n.komponen_prompt.PERAN,t,s);e=e.replace(/\*\*/g,""),e=e.replace(/\[\s*\]/g,""),e=e.replace(/\[\s*:\s*\]/g,""),p+=`${e}

`}if(c&&n.komponen_prompt.KONTEKS){let e=g(n.komponen_prompt.KONTEKS,t,s);e=e.replace(/\*\*/g,""),e=e.replace(/\[\s*\]/g,""),e=e.replace(/\[\s*:\s*\]/g,""),e=e.replace(/\[\s*\.\s*\]/g,""),e=e.replace(/\s+\./g,"."),e=e.replace(/\.\s*\./g,"."),e=e.replace(/,\s*\./g,"."),e=e.replace(/\s{2,}/g," "),e=e.trim(),e&&e.length>0&&(p+=`${e}

`)}}else n.ai_logic_description&&(p+=`${n.ai_logic_description.replace(/\*\*/g,"")}

`);return c||(p+=`
(Belum ada input yang diisi)`),p.trim()},b=n=>{if(!n||n.length===0)return"Tambahkan blok untuk membangun prompt visual Anda.";let t=`Isi Prompt Visual:
--------------------`;return n.forEach((s,i)=>{s.type==="text"?t+=`[Blok Teks #${i+1}]:
${s.content||"(kosong)"}

`:s.type==="image"&&(t+=`[Blok Gambar #${i+1}]:
(Gambar telah ditambahkan)

`)}),t.trim()},V=n=>n?n.map(t=>{if(t.type==="text"&&t.content)return{text:t.content};if(t.type==="image"&&t.content){const s=t.content.match(/^data:(image\/\w+);base64,(.+)$/);if(s){const i=s[1],r=s[2];return{inlineData:{mimeType:i,data:r}}}}return null}).filter(t=>t!==null):[],R=n=>{if(!n||!n.komponen_prompt)return"";const{PERAN:t="",KONTEKS:s="",TUGAS:i=""}=n.komponen_prompt||{};let r="";t&&(r+=`**Peran:**
${t}

`),s&&(r+=`**Konteks:**
${s}

`),i&&(r+=`**Tugas:**
${i}

`),n.konteks_tambahan_instruksi_khusus&&(r+=`**Instruksi Tambahan:**
${n.konteks_tambahan_instruksi_khusus}

`);const c=n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"];return c&&(r+=`**Format Output:**
${c}
`),r.trim()},U=(n,t)=>{const s=n.replace(/[^a-zA-Z0-9_-]/g,"_").replace(/__+/g,"_"),i=new Date().toISOString().replace(/[:\-.]/g,"").slice(0,15);return`${s}_${i}.${t}`},E=(n,t,s)=>{let i="";n.ai_logic_description&&(i+=`${n.ai_logic_description}

`);const r=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(e=>{if(e&&e.trigger){const o=t[e.trigger];if(o&&e.options[o]){const a=e.options[o];Array.isArray(a)?r.push(...a):"components"in a&&r.push(...a.components)}}});let p=0;return r.forEach(e=>{const o=t[e.name],a=e.optional||!1;(o||!a)&&((o==="Lainnya..."?s[e.name]:o)||!a)&&e.label.length>p&&(p=e.label.length)}),r.forEach(e=>{const o=t[e.name],a=e.optional||!1;if(o||!a){const l=o==="Lainnya..."?s[e.name]||"":o;if(l||!a){const y=e.label.padEnd(p," ");i+=`${y}: ${l||"[Tidak diisi]"}
`}}}),i.trim()},v=(n,t,s,i)=>{const r=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(o=>{if(o&&o.trigger){const a=s[o.trigger];if(a&&o.options[a]){const l=o.options[a];l&&("components"in l&&Array.isArray(l.components)?r.push(...l.components):Array.isArray(l)&&r.push(...l))}}});const p={...s};r.forEach(o=>{s[o.name]==="Lainnya..."&&(p[o.name]=i[o.name]||"")});const e={id_kerangka:n.id_kerangka||"",nama_kerangka:n.nama_kerangka||t,perspektif_user:n.perspektif_user||n.description||"",ai_logic_description:n.ai_logic_description||"",komponen_prompt:{PERAN:g(n.komponen_prompt?.PERAN||"",p,i),KONTEKS:g(n.komponen_prompt?.KONTEKS||"",p,i),TUGAS:g(n.komponen_prompt?.TUGAS||"",p,i),FORMAT_OUTPUT:g(n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"]||"",p,i)},konteks_tambahan_instruksi_khusus:g(n.konteks_tambahan_instruksi_khusus||"",p,i),contoh_kalimat:n.contoh_kalimat||"",output:n.output||"natural_language_prompt or json_prompt",input_komponen:r.reduce((o,a)=>{let l=s[a.name];return l==="Lainnya..."?l=i[a.name]||"":Array.isArray(l)&&(l=l.map(y=>y==="Lainnya..."?i[a.name]||"":y)),o[a.name]=l??"",o},{})};return JSON.stringify(e,null,2)},O=(n,t,s,i)=>{if(t===h.MIDJOURNEY){const r=s.subject||"",c=s.style||"";if(!n.components)return"";const p=n.components.map(e=>{const o=s[e.name];if(!o||e.name==="subject"||e.name==="style")return null;const a=o==="Lainnya..."?i[e.name]||"":o;if(!a)return null;const l=e.label.match(/--([\w\d.-]+)/);return l&&l[1]?`--${l[1]} ${a}`:null}).filter(Boolean).join(" ");return`${r} ${c} ${p}`.replace(/\s+/g," ").trim()}if(t===h.STABLE_DIFFUSION){const r=s.positivePrompt||"",c=s.negativePrompt||"",p=s.technicalParameters||"";let e=`Positive Prompt:
${r}

`;return c&&(e+=`Negative Prompt:
${c}

`),p&&(e+=`Parameters: ${p}`),e.trim()}if(h.GENERIC_IMAGE_VIDEO.includes(t)){const r=[];return n.components&&n.components.forEach(c=>{const p=s[c.name];if(p){const e=p==="Lainnya..."?i[c.name]||"":p;e&&r.push(`${c.label.replace(/\(.+\)/,"").trim()}: ${e}`)}}),`A ${n.toolType} of ${s.subject||t}. ${r.join(", ")}.`}return E(n,s,i)};export{V as a,$ as b,P as c,v as d,U as e,R as f,b as g};
