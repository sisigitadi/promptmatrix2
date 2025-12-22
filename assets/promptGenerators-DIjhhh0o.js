const f={MIDJOURNEY:"Midjourney",STABLE_DIFFUSION:"Stable Diffusion",GENERIC_IMAGE_VIDEO:["DALL-E 3","Sora (OpenAI)","Pika","Runway","Google VEO"]},A=n=>{if(!n)return"";let e=n;return e.match(/^(Level|Opsi|Tahap) \d+\s*:/i)&&(e=e.replace(/^(Level|Opsi|Tahap) \d+\s*:\s*/i,"")),e=e.split(/\s+[-–—]\s+/)[0],e=e.split(/\s*\(/)[0],e.trim()},S=(n,e,a)=>n.replace(/\[([^\]]+)\]/g,(t,l)=>{const u=l.match(/\{([a-zA-Z0-9_]+)\}/g);if(!u)return l;let r=!1;for(const p of u){const o=p.replace(/\{|\}/g,"");let s=e[o];if(s==="Lainnya..."&&(s=a[o]),s&&(typeof s!="string"||s.trim()!=="")&&(!Array.isArray(s)||s.length>0)){r=!0;break}}return r?l:""}),m=(n,e,a)=>{let t=S(n,e,a);for(const p in e){const o=`{${p}}`;let s=e[p];if(s==="Lainnya..."&&(s=a[p]||""),typeof s=="string"||typeof s=="number"){const i=A(String(s));t=t.replace(new RegExp(o,"g"),i)}else if(Array.isArray(s)){const i=s.map(c=>c==="Lainnya..."?a[p]||"":A(String(c)));t=t.replace(new RegExp(o,"g"),i.filter(Boolean).join(", "))}}const l="dari|ke|via|menggunakan|dengan|untuk|tentang|pada|di|pakai|sebagai",u=new RegExp(`\\b(${l})\\b\\s+(?=\\s|[.,:;!?\\n]|$)`,"gi");let r="";for(;t!==r;)r=t,t=t.replace(u,"");return t=t.replace(/  +/g," ").trim(),t=t.replace(/\s+([.,:;!?])/g,"$1"),t=t.replace(/,\s*,/g,","),t=t.replace(/,\s*\./g,"."),t=t.replace(/^\s*,/,""),t},$=(n,e,a)=>{if(!n||!n.komponen_prompt)return P(n,n.nama_kerangka||"",e,a);const{PERAN:t,KONTEKS:l,TUGAS:u}=n.komponen_prompt,r=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(_=>{if(_&&_.trigger){const h=e[_.trigger];if(h&&_.options[h]){const y=_.options[h];y&&("components"in y&&Array.isArray(y.components)?r.push(...y.components):Array.isArray(y)&&r.push(...y))}}});const o={...e};r.forEach(_=>{e[_.name]==="Lainnya..."&&(o[_.name]=a[_.name]||"")});const s=m(t||"",o,a),i=m(l||"",o,a);let c=u||"";if(n.dynamicSubcomponents&&!Array.isArray(n.dynamicSubcomponents)){const _=n.dynamicSubcomponents.trigger,h=o[_];if(h){const y=n.dynamicSubcomponents.options[h];y&&!Array.isArray(y)&&typeof y=="object"&&"komponen_prompt"in y&&y.komponen_prompt?.TUGAS&&(c=y.komponen_prompt.TUGAS)}}const g=m(c,o,a);let d="";s&&(d+=`**Peran:**
${s}

`),i&&(d+=`**Konteks:**
${i}

`),g&&(d+=`**Tugas:**
${g}

`),n.konteks_tambahan_instruksi_khusus&&(d+=`**Instruksi Tambahan:**
${m(n.konteks_tambahan_instruksi_khusus,o,a)}

`);const T=n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"];return T&&(d+=`**Format Output:**
${m(T,o,a)}
`),d.trim()},O=(n,e,a)=>{if(!n)return"Pilih kerangka kerja untuk melihat pratinjau.";const t=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(i=>{if(i&&i.trigger){const c=e[i.trigger];if(c&&i.options[c]){const g=i.options[c];g&&("components"in g&&Array.isArray(g.components)?t.push(...g.components):Array.isArray(g)&&t.push(...g))}}});let u=!1;t.forEach(i=>{const c=e[i.name];c!==void 0&&c!==""&&c!==null&&(!Array.isArray(c)||c.length>0)&&(u=!0)});let r="";if(n.komponen_prompt){if(n.komponen_prompt.PERAN){const i=m(n.komponen_prompt.PERAN,e,a);r+=`${i.replace(/\*\*/g,"")}

`}if(u&&n.komponen_prompt.KONTEKS){let i=m(n.komponen_prompt.KONTEKS,e,a);i=i.replace(/\*\*\s*\*\*/g,"").trim(),i&&(r+=`${i.replace(/\*\*/g,"")}

`)}}else n.ai_logic_description&&(r+=`${n.ai_logic_description.replace(/\*\*/g,"")}

`);const p=[n.komponen_prompt.PERAN,n.komponen_prompt.KONTEKS,n.komponen_prompt.TUGAS,n.konteks_tambahan_instruksi_khusus].join(" ");let o=!1,s=`
Berikut adalah detail spesifikasi tambahan:
`;return t.forEach(i=>{if(p.includes(`{${i.name}}`))return;const c=e[i.name];if(c!==void 0&&c!==""&&c!==null&&(!Array.isArray(c)||c.length>0)){let g="";c==="Lainnya..."?g=a[i.name]||"":Array.isArray(c)?g=c.map(d=>d==="Lainnya..."?a[i.name]||"":A(String(d))).filter(Boolean).join(", "):g=A(String(c)),g&&(s+=`- ${i.label}: ${g}
`,o=!0)}}),o&&(r+=s),u||(r+=`
(Belum ada input yang diisi)`),r.trim()},b=n=>{if(!n||n.length===0)return"Tambahkan blok untuk membangun prompt visual Anda.";let e=`Isi Prompt Visual:
--------------------`;return n.forEach((a,t)=>{a.type==="text"?e+=`[Blok Teks #${t+1}]:
${a.content||"(kosong)"}

`:a.type==="image"&&(e+=`[Blok Gambar #${t+1}]:
(Gambar telah ditambahkan)

`)}),e.trim()},V=n=>n?n.map(e=>{if(e.type==="text"&&e.content)return{text:e.content};if(e.type==="image"&&e.content){const a=e.content.match(/^data:(image\/\w+);base64,(.+)$/);if(a){const t=a[1],l=a[2];return{inlineData:{mimeType:t,data:l}}}}return null}).filter(e=>e!==null):[],R=n=>{if(!n||!n.komponen_prompt)return"";const{PERAN:e,KONTEKS:a,TUGAS:t}=n.komponen_prompt;let l="";e&&(l+=`**Peran:**
${e}

`),a&&(l+=`**Konteks:**
${a}

`),t&&(l+=`**Tugas:**
${t}

`),n.konteks_tambahan_instruksi_khusus&&(l+=`**Instruksi Tambahan:**
${n.konteks_tambahan_instruksi_khusus}

`);const u=n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"];return u&&(l+=`**Format Output:**
${u}
`),l.trim()},U=(n,e)=>{const a=n.replace(/[^a-zA-Z0-9_-]/g,"_").replace(/__+/g,"_"),t=new Date().toISOString().replace(/[:\-.]/g,"").slice(0,15);return`${a}_${t}.${e}`},E=(n,e,a)=>{let t="";n.ai_logic_description&&(t+=`${n.ai_logic_description}

`);const l=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(p=>{if(p&&p.trigger){const o=e[p.trigger];if(o&&p.options[o]){const s=p.options[o];Array.isArray(s)?l.push(...s):"components"in s&&l.push(...s.components)}}});let r=0;return l.forEach(p=>{const o=e[p.name],s=p.optional||!1;(o||!s)&&((o==="Lainnya..."?a[p.name]:o)||!s)&&p.label.length>r&&(r=p.label.length)}),l.forEach(p=>{const o=e[p.name],s=p.optional||!1;if(o||!s){const i=o==="Lainnya..."?a[p.name]||"":o;if(i||!s){const c=p.label.padEnd(r," ");t+=`${c}: ${i||"[Tidak diisi]"}
`}}}),t.trim()},v=(n,e,a,t)=>{const l=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(o=>{if(o&&o.trigger){const s=a[o.trigger];if(s&&o.options[s]){const i=o.options[s];i&&("components"in i&&Array.isArray(i.components)?l.push(...i.components):Array.isArray(i)&&l.push(...i))}}});const r={...a};l.forEach(o=>{a[o.name]==="Lainnya..."&&(r[o.name]=t[o.name]||"")});const p={id_kerangka:n.id_kerangka||"",nama_kerangka:n.nama_kerangka||e,perspektif_user:n.perspektif_user||n.description||"",ai_logic_description:n.ai_logic_description||"",komponen_prompt:{PERAN:m(n.komponen_prompt?.PERAN||"",r,t),KONTEKS:m(n.komponen_prompt?.KONTEKS||"",r,t),TUGAS:m(n.komponen_prompt?.TUGAS||"",r,t),FORMAT_OUTPUT:m(n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"]||"",r,t)},konteks_tambahan_instruksi_khusus:m(n.konteks_tambahan_instruksi_khusus||"",r,t),contoh_kalimat:n.contoh_kalimat||"",output:n.output||"natural_language_prompt or json_prompt",input_komponen:l.reduce((o,s)=>{let i=a[s.name];return i==="Lainnya..."?i=t[s.name]||"":Array.isArray(i)&&(i=i.map(c=>c==="Lainnya..."?t[s.name]||"":c)),o[s.name]=i??"",o},{})};return JSON.stringify(p,null,2)},P=(n,e,a,t)=>{if(e===f.MIDJOURNEY){const l=a.subject||"",u=a.style||"";if(!n.components)return"";const r=n.components.map(p=>{const o=a[p.name];if(!o||p.name==="subject"||p.name==="style")return null;const s=o==="Lainnya..."?t[p.name]||"":o;if(!s)return null;const i=p.label.match(/--([\w\d.-]+)/);return i&&i[1]?`--${i[1]} ${s}`:null}).filter(Boolean).join(" ");return`${l} ${u} ${r}`.replace(/\s+/g," ").trim()}if(e===f.STABLE_DIFFUSION){const l=a.positivePrompt||"",u=a.negativePrompt||"",r=a.technicalParameters||"";let p=`Positive Prompt:
${l}

`;return u&&(p+=`Negative Prompt:
${u}

`),r&&(p+=`Parameters: ${r}`),p.trim()}if(f.GENERIC_IMAGE_VIDEO.includes(e)){const l=[];return n.components&&n.components.forEach(u=>{const r=a[u.name];if(r){const p=r==="Lainnya..."?t[u.name]||"":r;p&&l.push(`${u.label.replace(/\(.+\)/,"").trim()}: ${p}`)}}),`A ${n.toolType} of ${a.subject||e}. ${l.join(", ")}.`}return E(n,a,t)};export{V as a,O as b,$ as c,v as d,U as e,R as f,b as g};
