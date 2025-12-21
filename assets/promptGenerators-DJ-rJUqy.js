const d={MIDJOURNEY:"Midjourney",STABLE_DIFFUSION:"Stable Diffusion",GENERIC_IMAGE_VIDEO:["DALL-E 3","Sora (OpenAI)","Pika","Runway","Google VEO"]},y=(n,o,i)=>{let a=n;for(const p in o){const c=`{${p}}`;let r=o[p];if(r==="Lainnya..."&&(r=i[p]||""),typeof r=="string"||typeof r=="number")a=a.replace(new RegExp(c,"g"),String(r));else if(Array.isArray(r)){const e=r.map(t=>t==="Lainnya..."?i[p]||"":t);a=a.replace(new RegExp(c,"g"),e.filter(Boolean).join(", "))}}return a},P=(n,o,i)=>{if(!n||!n.komponen_prompt)return T(n,n.nama_kerangka||"",o,i);const{PERAN:a,KONTEKS:p,TUGAS:c}=n.komponen_prompt,r=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(g=>{if(g&&g.trigger){const A=o[g.trigger];if(A&&g.options[A]){const u=g.options[A];u&&("components"in u&&Array.isArray(u.components)?r.push(...u.components):Array.isArray(u)&&r.push(...u))}}});const t={...o};r.forEach(g=>{o[g.name]==="Lainnya..."&&(t[g.name]=i[g.name]||"")});const s=y(a||"",t,i),l=y(p||"",t,i);let m=c||"";if(n.dynamicSubcomponents&&!Array.isArray(n.dynamicSubcomponents)){const g=n.dynamicSubcomponents.trigger,A=t[g];if(A){const u=n.dynamicSubcomponents.options[A];u&&!Array.isArray(u)&&typeof u=="object"&&"komponen_prompt"in u&&u.komponen_prompt?.TUGAS&&(m=u.komponen_prompt.TUGAS)}}const h=y(m,t,i);let _="";s&&(_+=`**Peran:**
${s}

`),l&&(_+=`**Konteks:**
${l}

`),h&&(_+=`**Tugas:**
${h}

`),n.konteks_tambahan_instruksi_khusus&&(_+=`**Instruksi Tambahan:**
${y(n.konteks_tambahan_instruksi_khusus,t,i)}

`);const f=n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"];return f&&(_+=`**Format Output:**
${y(f,t,i)}
`),_.trim()},E=(n,o,i)=>{if(!n)return"Pilih kerangka kerja untuk melihat pratinjau.";let a="";n.ai_logic_description&&(a+=`${n.ai_logic_description.replace(/\*\*/g,"")}

`);const p=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(e=>{if(e&&e.trigger){const t=o[e.trigger];if(t&&e.options[t]){const s=e.options[t];s&&("components"in s&&Array.isArray(s.components)?p.push(...s.components):Array.isArray(s)&&p.push(...s))}}});let r=!1;return p.forEach(e=>{const t=o[e.name];if(t!==void 0&&t!==""&&t!==null&&(!Array.isArray(t)||t.length>0)){r=!0;let s="";t==="Lainnya..."?s=i[e.name]||"":Array.isArray(t)?s=t.map(l=>String(l).replace(/\*\*/g,"")).filter(Boolean).join(", "):s=String(t).replace(/\*\*/g,""),s&&(a+=`${e.label}: ${s}
`)}}),!r&&!n.ai_logic_description&&(a="Isi komponen untuk melihat pratinjau."),a.trim()},O=n=>{if(!n||n.length===0)return"Tambahkan blok untuk membangun prompt visual Anda.";let o=`Isi Prompt Visual:
--------------------`;return n.forEach((i,a)=>{i.type==="text"?o+=`[Blok Teks #${a+1}]:
${i.content||"(kosong)"}

`:i.type==="image"&&(o+=`[Blok Gambar #${a+1}]:
(Gambar telah ditambahkan)

`)}),o.trim()},$=n=>n?n.map(o=>{if(o.type==="text"&&o.content)return{text:o.content};if(o.type==="image"&&o.content){const i=o.content.match(/^data:(image\/\w+);base64,(.+)$/);if(i){const a=i[1],p=i[2];return{inlineData:{mimeType:a,data:p}}}}return null}).filter(o=>o!==null):[],b=n=>{if(!n||!n.komponen_prompt)return"";const{PERAN:o,KONTEKS:i,TUGAS:a}=n.komponen_prompt;let p="";o&&(p+=`**Peran:**
${o}

`),i&&(p+=`**Konteks:**
${i}

`),a&&(p+=`**Tugas:**
${a}

`),n.konteks_tambahan_instruksi_khusus&&(p+=`**Instruksi Tambahan:**
${n.konteks_tambahan_instruksi_khusus}

`);const c=n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"];return c&&(p+=`**Format Output:**
${c}
`),p.trim()},U=(n,o)=>{const i=n.replace(/[^a-zA-Z0-9_-]/g,"_").replace(/__+/g,"_"),a=new Date().toISOString().replace(/[:\-.]/g,"").slice(0,15);return`${i}_${a}.${o}`},S=(n,o,i)=>{let a="";n.ai_logic_description&&(a+=`${n.ai_logic_description}

`);const p=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(e=>{if(e&&e.trigger){const t=o[e.trigger];if(t&&e.options[t]){const s=e.options[t];Array.isArray(s)?p.push(...s):"components"in s&&p.push(...s.components)}}});let r=0;return p.forEach(e=>{const t=o[e.name],s=e.optional||!1;(t||!s)&&((t==="Lainnya..."?i[e.name]:t)||!s)&&e.label.length>r&&(r=e.label.length)}),p.forEach(e=>{const t=o[e.name],s=e.optional||!1;if(t||!s){const l=t==="Lainnya..."?i[e.name]||"":t;if(l||!s){const m=e.label.padEnd(r," ");a+=`${m}: ${l||"[Tidak diisi]"}
`}}}),a.trim()},V=(n,o,i,a)=>{const p=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(t=>{if(t&&t.trigger){const s=i[t.trigger];if(s&&t.options[s]){const l=t.options[s];l&&("components"in l&&Array.isArray(l.components)?p.push(...l.components):Array.isArray(l)&&p.push(...l))}}});const r={...i};p.forEach(t=>{i[t.name]==="Lainnya..."&&(r[t.name]=a[t.name]||"")});const e={id_kerangka:n.id_kerangka||"",nama_kerangka:n.nama_kerangka||o,perspektif_user:n.perspektif_user||n.description||"",ai_logic_description:n.ai_logic_description||"",komponen_prompt:{PERAN:y(n.komponen_prompt?.PERAN||"",r,a),KONTEKS:y(n.komponen_prompt?.KONTEKS||"",r,a),TUGAS:y(n.komponen_prompt?.TUGAS||"",r,a),FORMAT_OUTPUT:y(n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"]||"",r,a)},konteks_tambahan_instruksi_khusus:y(n.konteks_tambahan_instruksi_khusus||"",r,a),contoh_kalimat:n.contoh_kalimat||"",output:n.output||"natural_language_prompt or json_prompt",input_komponen:p.reduce((t,s)=>{let l=i[s.name];return l==="Lainnya..."?l=a[s.name]||"":Array.isArray(l)&&(l=l.map(m=>m==="Lainnya..."?a[s.name]||"":m)),t[s.name]=l??"",t},{})};return JSON.stringify(e,null,2)},T=(n,o,i,a)=>{if(o===d.MIDJOURNEY){const p=i.subject||"",c=i.style||"";if(!n.components)return"";const r=n.components.map(e=>{const t=i[e.name];if(!t||e.name==="subject"||e.name==="style")return null;const s=t==="Lainnya..."?a[e.name]||"":t;if(!s)return null;const l=e.label.match(/--([\w\d.-]+)/);return l&&l[1]?`--${l[1]} ${s}`:null}).filter(Boolean).join(" ");return`${p} ${c} ${r}`.replace(/\s+/g," ").trim()}if(o===d.STABLE_DIFFUSION){const p=i.positivePrompt||"",c=i.negativePrompt||"",r=i.technicalParameters||"";let e=`Positive Prompt:
${p}

`;return c&&(e+=`Negative Prompt:
${c}

`),r&&(e+=`Parameters: ${r}`),e.trim()}if(d.GENERIC_IMAGE_VIDEO.includes(o)){const p=[];return n.components&&n.components.forEach(c=>{const r=i[c.name];if(r){const e=r==="Lainnya..."?a[c.name]||"":r;e&&p.push(`${c.label.replace(/\(.+\)/,"").trim()}: ${e}`)}}),`A ${n.toolType} of ${i.subject||o}. ${p.join(", ")}.`}return S(n,i,a)};export{$ as a,E as b,P as c,V as d,U as e,b as f,O as g};
