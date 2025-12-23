const d={MIDJOURNEY:"Midjourney",STABLE_DIFFUSION:"Stable Diffusion",GENERIC_IMAGE_VIDEO:["DALL-E 3","Sora (OpenAI)","Pika","Runway","Google VEO"]},f=n=>{if(!n)return"";let i=n;return i.match(/^(Level|Opsi|Tahap) \d+\s*:/i)&&(i=i.replace(/^(Level|Opsi|Tahap) \d+\s*:\s*/i,"")),i=i.split(/\s+[-–—]\s+/)[0],i=i.split(/\s*\(/)[0],i.trim()},S=(n,i,a)=>n.replace(/\[([^\]]+)\]/g,(o,l)=>{const c=l.match(/\{([a-zA-Z0-9_]+)\}/g);if(!c)return l;let p=!1;for(const s of c){const e=s.replace(/\{|\}/g,"");let t=i[e];if(t==="Lainnya..."&&(t=a[e]),t&&(typeof t!="string"||t.trim()!=="")&&(!Array.isArray(t)||t.length>0)){p=!0;break}}return p?l:""}),m=(n,i,a)=>{let o=S(n,i,a);for(const s in i){const e=`{${s}}`;let t=i[s];if(t==="Lainnya..."&&(t=a[s]||""),typeof t=="string"||typeof t=="number"){const r=f(String(t));o=o.replace(new RegExp(e,"g"),r)}else if(Array.isArray(t)){const r=t.map(g=>g==="Lainnya..."?a[s]||"":f(String(g)));o=o.replace(new RegExp(e,"g"),r.filter(Boolean).join(", "))}}const l="dari|ke|via|menggunakan|dengan|untuk|tentang|pada|di|pakai|sebagai",c=new RegExp(`\\b(${l})\\b\\s+(?=\\s|[.,:;!?\\n]|$)`,"gi");let p="";for(;o!==p;)p=o,o=o.replace(c,"");return o=o.replace(/  +/g," ").trim(),o=o.replace(/\s+([.,:;!?])/g,"$1"),o=o.replace(/,\s*,/g,","),o=o.replace(/,\s*\./g,"."),o=o.replace(/^\s*,/,""),o},P=(n,i,a)=>{if(!n||!n.komponen_prompt)return O(n,n?.nama_kerangka||"",i,a);const{PERAN:o="",KONTEKS:l="",TUGAS:c=""}=n.komponen_prompt||{},p=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(y=>{if(y&&y.trigger){const A=i[y.trigger];if(A&&y.options[A]){const u=y.options[A];u&&("components"in u&&Array.isArray(u.components)?p.push(...u.components):Array.isArray(u)&&p.push(...u))}}});const e={...i};p.forEach(y=>{i[y.name]==="Lainnya..."&&(e[y.name]=a[y.name]||"")});const t=m(o||"",e,a),r=m(l||"",e,a);let g=c||"";if(n.dynamicSubcomponents&&!Array.isArray(n.dynamicSubcomponents)){const y=n.dynamicSubcomponents.trigger,A=e[y];if(A){const u=n.dynamicSubcomponents.options[A];u&&!Array.isArray(u)&&typeof u=="object"&&"komponen_prompt"in u&&u.komponen_prompt?.TUGAS&&(g=u.komponen_prompt.TUGAS)}}const h=m(g,e,a);let _="";t&&(_+=`**Peran:**
${t}

`),r&&(_+=`**Konteks:**
${r}

`),h&&(_+=`**Tugas:**
${h}

`),n.konteks_tambahan_instruksi_khusus&&(_+=`**Instruksi Tambahan:**
${m(n.konteks_tambahan_instruksi_khusus,e,a)}

`);const T=n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"];return T&&(_+=`**Format Output:**
${m(T,e,a)}
`),_.trim()},$=(n,i,a)=>{if(!n)return"";const o=[...n.components||[]],l=Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[];l.forEach(e=>{if(e&&e.trigger){const t=i[e.trigger];if(t&&e.options[t]){const r=e.options[t];r&&("components"in r&&Array.isArray(r.components)?o.push(...r.components):Array.isArray(r)&&o.push(...r))}}});let c=!1;o.forEach(e=>{const t=i[e.name];t!==void 0&&t!==""&&t!==null&&(!Array.isArray(t)||t.length>0)&&(c=!0)});let p={...n.komponen_prompt};l.forEach(e=>{if(e&&e.trigger){const t=i[e.trigger];if(t&&e.options[t]){const r=e.options[t];if(r&&"komponen_prompt"in r){const g=r.komponen_prompt;p={PERAN:g.PERAN||p.PERAN||"",KONTEKS:g.KONTEKS||p.KONTEKS||"",TUGAS:g.TUGAS||p.TUGAS||"",FORMAT_OUTPUT:g.FORMAT_OUTPUT||p.FORMAT_OUTPUT||""}}}}});let s="";if(p){if(p.PERAN){let e=m(p.PERAN,i,a);e=e.replace(/\*\*/g,""),e=e.replace(/\[\s*\]/g,""),e=e.replace(/\[\s*:\s*\]/g,""),s+=`${e}

`}if(c&&p.KONTEKS){let e=m(p.KONTEKS,i,a);e=e.replace(/\*\*/g,""),e=e.replace(/\[\s*\]/g,""),e=e.replace(/\[\s*:\s*\]/g,""),e=e.replace(/\[\s*\.\s*\]/g,""),e=e.replace(/\s+\./g,"."),e=e.replace(/\.\s*\./g,"."),e=e.replace(/,\s*\./g,"."),e=e.replace(/\s{2,}/g," "),e=e.trim(),e&&e.length>0&&(s+=`${e}

`)}}else n.ai_logic_description&&(s+=`${n.ai_logic_description.replace(/\*\*/g,"")}

`);return c||(s+=`
(Belum ada input yang diisi)`),s.trim()},U=n=>{if(!n||n.length===0)return"Tambahkan blok untuk membangun prompt visual Anda.";let i=`Isi Prompt Visual:
--------------------`;return n.forEach((a,o)=>{a.type==="text"?i+=`[Blok Teks #${o+1}]:
${a.content||"(kosong)"}

`:a.type==="image"&&(i+=`[Blok Gambar #${o+1}]:
(Gambar telah ditambahkan)

`)}),i.trim()},b=n=>n?n.map(i=>{if(i.type==="text"&&i.content)return{text:i.content};if(i.type==="image"&&i.content){const a=i.content.match(/^data:(image\/\w+);base64,(.+)$/);if(a){const o=a[1],l=a[2];return{inlineData:{mimeType:o,data:l}}}}return null}).filter(i=>i!==null):[],R=n=>{if(!n||!n.komponen_prompt)return"";const{PERAN:i="",KONTEKS:a="",TUGAS:o=""}=n.komponen_prompt||{};let l="";i&&(l+=`**Peran:**
${i}

`),a&&(l+=`**Konteks:**
${a}

`),o&&(l+=`**Tugas:**
${o}

`),n.konteks_tambahan_instruksi_khusus&&(l+=`**Instruksi Tambahan:**
${n.konteks_tambahan_instruksi_khusus}

`);const c=n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"];return c&&(l+=`**Format Output:**
${c}
`),l.trim()},V=(n,i)=>{const a=n.replace(/[^a-zA-Z0-9_-]/g,"_").replace(/__+/g,"_"),o=new Date().toISOString().replace(/[:\-.]/g,"").slice(0,15);return`${a}_${o}.${i}`},E=(n,i,a)=>{let o="";n.ai_logic_description&&(o+=`${n.ai_logic_description}

`);const l=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(s=>{if(s&&s.trigger){const e=i[s.trigger];if(e&&s.options[e]){const t=s.options[e];Array.isArray(t)?l.push(...t):"components"in t&&l.push(...t.components)}}});let p=0;return l.forEach(s=>{const e=i[s.name],t=s.optional||!1;(e||!t)&&((e==="Lainnya..."?a[s.name]:e)||!t)&&s.label.length>p&&(p=s.label.length)}),l.forEach(s=>{const e=i[s.name],t=s.optional||!1;if(e||!t){const r=e==="Lainnya..."?a[s.name]||"":e;if(r||!t){const g=s.label.padEnd(p," ");o+=`${g}: ${r||"[Tidak diisi]"}
`}}}),o.trim()},N=(n,i,a,o)=>{const l=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(e=>{if(e&&e.trigger){const t=a[e.trigger];if(t&&e.options[t]){const r=e.options[t];r&&("components"in r&&Array.isArray(r.components)?l.push(...r.components):Array.isArray(r)&&l.push(...r))}}});const p={...a};l.forEach(e=>{a[e.name]==="Lainnya..."&&(p[e.name]=o[e.name]||"")});const s={id_kerangka:n.id_kerangka||"",nama_kerangka:n.nama_kerangka||i,perspektif_user:n.perspektif_user||n.description||"",ai_logic_description:n.ai_logic_description||"",komponen_prompt:{PERAN:m(n.komponen_prompt?.PERAN||"",p,o),KONTEKS:m(n.komponen_prompt?.KONTEKS||"",p,o),TUGAS:m(n.komponen_prompt?.TUGAS||"",p,o),FORMAT_OUTPUT:m(n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"]||"",p,o)},konteks_tambahan_instruksi_khusus:m(n.konteks_tambahan_instruksi_khusus||"",p,o),contoh_kalimat:n.contoh_kalimat||"",output:n.output||"natural_language_prompt or json_prompt",input_komponen:l.reduce((e,t)=>{let r=a[t.name];return r==="Lainnya..."?r=o[t.name]||"":Array.isArray(r)&&(r=r.map(g=>g==="Lainnya..."?o[t.name]||"":g)),e[t.name]=r??"",e},{})};return JSON.stringify(s,null,2)},O=(n,i,a,o)=>{if(i===d.MIDJOURNEY){const l=a.subject||"",c=a.style||"";if(!n.components)return"";const p=n.components.map(s=>{const e=a[s.name];if(!e||s.name==="subject"||s.name==="style")return null;const t=e==="Lainnya..."?o[s.name]||"":e;if(!t)return null;const r=s.label.match(/--([\w\d.-]+)/);return r&&r[1]?`--${r[1]} ${t}`:null}).filter(Boolean).join(" ");return`${l} ${c} ${p}`.replace(/\s+/g," ").trim()}if(i===d.STABLE_DIFFUSION){const l=a.positivePrompt||"",c=a.negativePrompt||"",p=a.technicalParameters||"";let s=`Positive Prompt:
${l}

`;return c&&(s+=`Negative Prompt:
${c}

`),p&&(s+=`Parameters: ${p}`),s.trim()}if(d.GENERIC_IMAGE_VIDEO.includes(i)){const l=[];return n.components&&n.components.forEach(c=>{const p=a[c.name];if(p){const s=p==="Lainnya..."?o[c.name]||"":p;s&&l.push(`${c.label.replace(/\(.+\)/,"").trim()}: ${s}`)}}),`A ${n.toolType} of ${a.subject||i}. ${l.join(", ")}.`}return E(n,a,o)};export{b as a,$ as b,P as c,N as d,V as e,R as f,U as g};
