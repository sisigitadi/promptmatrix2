const T={MIDJOURNEY:"Midjourney",STABLE_DIFFUSION:"Stable Diffusion",GENERIC_IMAGE_VIDEO:["DALL-E 3","Sora (OpenAI)","Pika","Runway","Google VEO"]},f=n=>{if(!n)return"";let e=n;return e.match(/^(Level|Opsi|Tahap) \d+\s*:/i)&&(e=e.replace(/^(Level|Opsi|Tahap) \d+\s*:\s*/i,"")),e=e.split(/\s+[-–—]\s+/)[0],e=e.split(/\s*\(/)[0],e.trim()},S=(n,e,i)=>n.replace(/\[([^\]]+)\]/g,(t,p)=>{const u=p.match(/\{([a-zA-Z0-9_]+)\}/g);if(!u)return p;let r=!1;for(const s of u){const a=s.replace(/\{|\}/g,"");let o=e[a];if(o==="Lainnya..."&&(o=i[a]),o&&(typeof o!="string"||o.trim()!=="")&&(!Array.isArray(o)||o.length>0)){r=!0;break}}return r?p:""}),_=(n,e,i)=>{let t=S(n,e,i);for(const s in e){const a=`{${s}}`;let o=e[s];if(o==="Lainnya..."&&(o=i[s]||""),typeof o=="string"||typeof o=="number"){const l=f(String(o));t=t.replace(new RegExp(a,"g"),l)}else if(Array.isArray(o)){const l=o.map(c=>c==="Lainnya..."?i[s]||"":f(String(c)));t=t.replace(new RegExp(a,"g"),l.filter(Boolean).join(", "))}}const p="dari|ke|via|menggunakan|dengan|untuk|tentang|pada|di|pakai|sebagai",u=new RegExp(`\\b(${p})\\b\\s+(?=\\s|[.,:;!?\\n]|$)`,"gi");let r="";for(;t!==r;)r=t,t=t.replace(u,"");return t=t.replace(/  +/g," ").trim(),t=t.replace(/\s+([.,:;!?])/g,"$1"),t=t.replace(/,\s*,/g,","),t=t.replace(/,\s*\./g,"."),t=t.replace(/^\s*,/,""),t},$=(n,e,i)=>{if(!n||!n.komponen_prompt)return P(n,n?.nama_kerangka||"",e,i);const{PERAN:t="",KONTEKS:p="",TUGAS:u=""}=n.komponen_prompt||{},r=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(d=>{if(d&&d.trigger){const A=e[d.trigger];if(A&&d.options[A]){const m=d.options[A];m&&("components"in m&&Array.isArray(m.components)?r.push(...m.components):Array.isArray(m)&&r.push(...m))}}});const a={...e};r.forEach(d=>{e[d.name]==="Lainnya..."&&(a[d.name]=i[d.name]||"")});const o=_(t||"",a,i),l=_(p||"",a,i);let c=u||"";if(n.dynamicSubcomponents&&!Array.isArray(n.dynamicSubcomponents)){const d=n.dynamicSubcomponents.trigger,A=a[d];if(A){const m=n.dynamicSubcomponents.options[A];m&&!Array.isArray(m)&&typeof m=="object"&&"komponen_prompt"in m&&m.komponen_prompt?.TUGAS&&(c=m.komponen_prompt.TUGAS)}}const g=_(c,a,i);let y="";o&&(y+=`**Peran:**
${o}

`),l&&(y+=`**Konteks:**
${l}

`),g&&(y+=`**Tugas:**
${g}

`),n.konteks_tambahan_instruksi_khusus&&(y+=`**Instruksi Tambahan:**
${_(n.konteks_tambahan_instruksi_khusus,a,i)}

`);const h=n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"];return h&&(y+=`**Format Output:**
${_(h,a,i)}
`),y.trim()},O=(n,e,i)=>{if(!n)return"";const t=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(c=>{if(c&&c.trigger){const g=e[c.trigger];if(g&&c.options[g]){const y=c.options[g];y&&("components"in y&&Array.isArray(y.components)?t.push(...y.components):Array.isArray(y)&&t.push(...y))}}});let u=!1;t.forEach(c=>{const g=e[c.name];g!==void 0&&g!==""&&g!==null&&(!Array.isArray(g)||g.length>0)&&(u=!0)});let r="";if(n.komponen_prompt){if(n.komponen_prompt.PERAN){const c=_(n.komponen_prompt.PERAN,e,i);r+=`${c.replace(/\*\*/g,"")}

`}if(u&&n.komponen_prompt.KONTEKS){let c=_(n.komponen_prompt.KONTEKS,e,i);c=c.replace(/\*\*\s*\*\*/g,"").trim(),c&&(r+=`${c.replace(/\*\*/g,"")}

`)}}else n.ai_logic_description&&(r+=`${n.ai_logic_description.replace(/\*\*/g,"")}

`);const s=n.komponen_prompt||{},a=[s.PERAN,s.KONTEKS,s.TUGAS,n.konteks_tambahan_instruksi_khusus].filter(Boolean).join(" ");let o=!1,l=`
Berikut adalah detail spesifikasi tambahan:
`;return t.forEach(c=>{if(a.includes(`{${c.name}}`))return;const g=e[c.name];if(g!==void 0&&g!==""&&g!==null&&(!Array.isArray(g)||g.length>0)){let y="";g==="Lainnya..."?y=i[c.name]||"":Array.isArray(g)?y=g.map(h=>h==="Lainnya..."?i[c.name]||"":f(String(h))).filter(Boolean).join(", "):y=f(String(g)),y&&(l+=`- ${c.label}: ${y}
`,o=!0)}}),o&&(r+=l),u||(r+=`
(Belum ada input yang diisi)`),r.trim()},b=n=>{if(!n||n.length===0)return"Tambahkan blok untuk membangun prompt visual Anda.";let e=`Isi Prompt Visual:
--------------------`;return n.forEach((i,t)=>{i.type==="text"?e+=`[Blok Teks #${t+1}]:
${i.content||"(kosong)"}

`:i.type==="image"&&(e+=`[Blok Gambar #${t+1}]:
(Gambar telah ditambahkan)

`)}),e.trim()},V=n=>n?n.map(e=>{if(e.type==="text"&&e.content)return{text:e.content};if(e.type==="image"&&e.content){const i=e.content.match(/^data:(image\/\w+);base64,(.+)$/);if(i){const t=i[1],p=i[2];return{inlineData:{mimeType:t,data:p}}}}return null}).filter(e=>e!==null):[],R=n=>{if(!n||!n.komponen_prompt)return"";const{PERAN:e="",KONTEKS:i="",TUGAS:t=""}=n.komponen_prompt||{};let p="";e&&(p+=`**Peran:**
${e}

`),i&&(p+=`**Konteks:**
${i}

`),t&&(p+=`**Tugas:**
${t}

`),n.konteks_tambahan_instruksi_khusus&&(p+=`**Instruksi Tambahan:**
${n.konteks_tambahan_instruksi_khusus}

`);const u=n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"];return u&&(p+=`**Format Output:**
${u}
`),p.trim()},U=(n,e)=>{const i=n.replace(/[^a-zA-Z0-9_-]/g,"_").replace(/__+/g,"_"),t=new Date().toISOString().replace(/[:\-.]/g,"").slice(0,15);return`${i}_${t}.${e}`},E=(n,e,i)=>{let t="";n.ai_logic_description&&(t+=`${n.ai_logic_description}

`);const p=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(s=>{if(s&&s.trigger){const a=e[s.trigger];if(a&&s.options[a]){const o=s.options[a];Array.isArray(o)?p.push(...o):"components"in o&&p.push(...o.components)}}});let r=0;return p.forEach(s=>{const a=e[s.name],o=s.optional||!1;(a||!o)&&((a==="Lainnya..."?i[s.name]:a)||!o)&&s.label.length>r&&(r=s.label.length)}),p.forEach(s=>{const a=e[s.name],o=s.optional||!1;if(a||!o){const l=a==="Lainnya..."?i[s.name]||"":a;if(l||!o){const c=s.label.padEnd(r," ");t+=`${c}: ${l||"[Tidak diisi]"}
`}}}),t.trim()},v=(n,e,i,t)=>{const p=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(a=>{if(a&&a.trigger){const o=i[a.trigger];if(o&&a.options[o]){const l=a.options[o];l&&("components"in l&&Array.isArray(l.components)?p.push(...l.components):Array.isArray(l)&&p.push(...l))}}});const r={...i};p.forEach(a=>{i[a.name]==="Lainnya..."&&(r[a.name]=t[a.name]||"")});const s={id_kerangka:n.id_kerangka||"",nama_kerangka:n.nama_kerangka||e,perspektif_user:n.perspektif_user||n.description||"",ai_logic_description:n.ai_logic_description||"",komponen_prompt:{PERAN:_(n.komponen_prompt?.PERAN||"",r,t),KONTEKS:_(n.komponen_prompt?.KONTEKS||"",r,t),TUGAS:_(n.komponen_prompt?.TUGAS||"",r,t),FORMAT_OUTPUT:_(n.komponen_prompt?.FORMAT_OUTPUT||n.komponen_prompt?.["FORMAT OUTPUT"]||"",r,t)},konteks_tambahan_instruksi_khusus:_(n.konteks_tambahan_instruksi_khusus||"",r,t),contoh_kalimat:n.contoh_kalimat||"",output:n.output||"natural_language_prompt or json_prompt",input_komponen:p.reduce((a,o)=>{let l=i[o.name];return l==="Lainnya..."?l=t[o.name]||"":Array.isArray(l)&&(l=l.map(c=>c==="Lainnya..."?t[o.name]||"":c)),a[o.name]=l??"",a},{})};return JSON.stringify(s,null,2)},P=(n,e,i,t)=>{if(e===T.MIDJOURNEY){const p=i.subject||"",u=i.style||"";if(!n.components)return"";const r=n.components.map(s=>{const a=i[s.name];if(!a||s.name==="subject"||s.name==="style")return null;const o=a==="Lainnya..."?t[s.name]||"":a;if(!o)return null;const l=s.label.match(/--([\w\d.-]+)/);return l&&l[1]?`--${l[1]} ${o}`:null}).filter(Boolean).join(" ");return`${p} ${u} ${r}`.replace(/\s+/g," ").trim()}if(e===T.STABLE_DIFFUSION){const p=i.positivePrompt||"",u=i.negativePrompt||"",r=i.technicalParameters||"";let s=`Positive Prompt:
${p}

`;return u&&(s+=`Negative Prompt:
${u}

`),r&&(s+=`Parameters: ${r}`),s.trim()}if(T.GENERIC_IMAGE_VIDEO.includes(e)){const p=[];return n.components&&n.components.forEach(u=>{const r=i[u.name];if(r){const s=r==="Lainnya..."?t[u.name]||"":r;s&&p.push(`${u.label.replace(/\(.+\)/,"").trim()}: ${s}`)}}),`A ${n.toolType} of ${i.subject||e}. ${p.join(", ")}.`}return E(n,i,t)};export{V as a,O as b,$ as c,v as d,U as e,R as f,b as g};
