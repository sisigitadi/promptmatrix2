const h={MIDJOURNEY:"Midjourney",STABLE_DIFFUSION:"Stable Diffusion",GENERIC_IMAGE_VIDEO:["DALL-E 3","Sora (OpenAI)","Pika","Runway","Google VEO"]},m=(n,a,e)=>{let s=n;for(const r in a){const u=`{${r}}`;let p=a[r];if(p==="Lainnya..."&&(p=e[r]||""),typeof p=="string"||typeof p=="number")s=s.replace(new RegExp(u,"g"),String(p));else if(Array.isArray(p)){const t=p.map(i=>i==="Lainnya..."?e[r]||"":i);s=s.replace(new RegExp(u,"g"),t.filter(Boolean).join(", "))}}return s},$=(n,a,e)=>{if(!n||!n.komponen_prompt)return E(n,n.nama_kerangka||"",a,e);const{PERAN:s,KONTEKS:r,TUGAS:u}=n.komponen_prompt,p=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(y=>{if(y&&y.trigger){const d=a[y.trigger];if(d&&y.options[d]){const g=y.options[d];g&&("components"in g&&Array.isArray(g.components)?p.push(...g.components):Array.isArray(g)&&p.push(...g))}}});const i={...a};p.forEach(y=>{a[y.name]==="Lainnya..."&&(i[y.name]=e[y.name]||"")});const o=m(s||"",i,e),l=m(r||"",i,e);let c=u||"";if(n.dynamicSubcomponents&&!Array.isArray(n.dynamicSubcomponents)){const y=n.dynamicSubcomponents.trigger,d=i[y];if(d){const g=n.dynamicSubcomponents.options[d];g&&!Array.isArray(g)&&typeof g=="object"&&"komponen_prompt"in g&&g.komponen_prompt?.TUGAS&&(c=g.komponen_prompt.TUGAS)}}const A=m(c,i,e);let _="";o&&(_+=`**Peran:**
${o}

`),l&&(_+=`**Konteks:**
${l}

`),A&&(_+=`**Tugas:**
${A}

`),n.konteks_tambahan_instruksi_khusus&&(_+=`**Instruksi Tambahan:**
${m(n.konteks_tambahan_instruksi_khusus,i,e)}

`);const f=n.komponen_prompt?.["FORMAT OUTPUT"];return f&&(_+=`**Format Output:**
${m(f,i,e)}
`),_.trim()},P=(n,a,e)=>{if(!n)return"Pilih kerangka kerja untuk melihat pratinjau.";let s="";n.ai_logic_description&&(s+=`${n.ai_logic_description.replace(/\*\*/g,"")}

`);const r=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(t=>{if(t&&t.trigger){const i=a[t.trigger];if(i&&t.options[i]){const o=t.options[i];o&&("components"in o&&Array.isArray(o.components)?r.push(...o.components):Array.isArray(o)&&r.push(...o))}}});let p=!1;return r.forEach(t=>{const i=a[t.name];if(i!==void 0&&i!==""&&i!==null&&(!Array.isArray(i)||i.length>0)){p=!0;let o="";i==="Lainnya..."?o=e[t.name]||"":Array.isArray(i)?o=i.map(l=>String(l).replace(/\*\*/g,"")).filter(Boolean).join(", "):o=String(i).replace(/\*\*/g,""),o&&(s+=`${t.label}: ${o}
`)}}),!p&&!n.ai_logic_description&&(s="Isi komponen untuk melihat pratinjau."),s.trim()},b=n=>{if(!n||n.length===0)return"Tambahkan blok untuk membangun prompt visual Anda.";let a=`Isi Prompt Visual:
--------------------`;return n.forEach((e,s)=>{e.type==="text"?a+=`[Blok Teks #${s+1}]:
${e.content||"(kosong)"}

`:e.type==="image"&&(a+=`[Blok Gambar #${s+1}]:
(Gambar telah ditambahkan)

`)}),a.trim()},T=n=>n?n.map(a=>{if(a.type==="text"&&a.content)return{text:a.content};if(a.type==="image"&&a.content){const e=a.content.match(/^data:(image\/\w+);base64,(.+)$/);if(e){const s=e[1],r=e[2];return{inlineData:{mimeType:s,data:r}}}}return null}).filter(a=>a!==null):[],O=n=>{if(!n||!n.komponen_prompt)return"";const{PERAN:a,KONTEKS:e,TUGAS:s}=n.komponen_prompt;let r="";a&&(r+=`**Peran:**
${a}

`),e&&(r+=`**Konteks:**
${e}

`),s&&(r+=`**Tugas:**
${s}

`),n.konteks_tambahan_instruksi_khusus&&(r+=`**Instruksi Tambahan:**
${n.konteks_tambahan_instruksi_khusus}

`);const u=n.komponen_prompt?.["FORMAT OUTPUT"];return u&&(r+=`**Format Output:**
${u}
`),r.trim()},V=(n,a)=>{const e=n.replace(/[^a-zA-Z0-9_-]/g,"_").replace(/__+/g,"_"),s=new Date().toISOString().replace(/[:\-.]/g,"").slice(0,15);return`${e}_${s}.${a}`},S=(n,a,e)=>{let s="";n.ai_logic_description&&(s+=`${n.ai_logic_description}

`);const r=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(t=>{if(t&&t.trigger){const i=a[t.trigger];if(i&&t.options[i]){const o=t.options[i];Array.isArray(o)?r.push(...o):"components"in o&&r.push(...o.components)}}});let p=0;return r.forEach(t=>{const i=a[t.name],o=t.optional||!1;(i||!o)&&((i==="Lainnya..."?e[t.name]:i)||!o)&&t.label.length>p&&(p=t.label.length)}),r.forEach(t=>{const i=a[t.name],o=t.optional||!1;if(i||!o){const l=i==="Lainnya..."?e[t.name]||"":i;if(l||!o){const c=t.label.padEnd(p," ");s+=`${c}: ${l||"[Tidak diisi]"}
`}}}),s.trim()},L=(n,a,e,s)=>{const r=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(o=>{if(o&&o.trigger){const l=e[o.trigger];if(l&&o.options[l]){const c=o.options[l];c&&("components"in c&&Array.isArray(c.components)?r.push(...c.components):Array.isArray(c)&&r.push(...c))}}});const p={...e};r.forEach(o=>{e[o.name]==="Lainnya..."&&(p[o.name]=s[o.name]||"")});const t="FORMAT OUTPUT",i={id_kerangka:n.id_kerangka||"",nama_kerangka:n.nama_kerangka||a,perspektif_user:n.perspektif_user||n.description||"",ai_logic_description:n.ai_logic_description||"",komponen_prompt:{PERAN:m(n.komponen_prompt?.PERAN||"",p,s),KONTEKS:m(n.komponen_prompt?.KONTEKS||"",p,s),TUGAS:m(n.komponen_prompt?.TUGAS||"",p,s),[t]:m(n.komponen_prompt?.[t]||"",p,s)},konteks_tambahan_instruksi_khusus:m(n.konteks_tambahan_instruksi_khusus||"",p,s),contoh_kalimat:n.contoh_kalimat||"",output:n.output||"natural_language_prompt or json_prompt",input_komponen:r.reduce((o,l)=>{let c=e[l.name];return c==="Lainnya..."?c=s[l.name]||"":Array.isArray(c)&&(c=c.map(A=>A==="Lainnya..."?s[l.name]||"":A)),o[l.name]=c??"",o},{})};return JSON.stringify(i,null,2)},E=(n,a,e,s)=>{if(a===h.MIDJOURNEY){const r=e.subject||"",u=e.style||"";if(!n.components)return"";const p=n.components.map(t=>{const i=e[t.name];if(!i||t.name==="subject"||t.name==="style")return null;const o=i==="Lainnya..."?s[t.name]||"":i;if(!o)return null;const l=t.label.match(/--([\w\d.-]+)/);return l&&l[1]?`--${l[1]} ${o}`:null}).filter(Boolean).join(" ");return`${r} ${u} ${p}`.replace(/\s+/g," ").trim()}if(a===h.STABLE_DIFFUSION){const r=e.positivePrompt||"",u=e.negativePrompt||"",p=e.technicalParameters||"";let t=`Positive Prompt:
${r}

`;return u&&(t+=`Negative Prompt:
${u}

`),p&&(t+=`Parameters: ${p}`),t.trim()}if(h.GENERIC_IMAGE_VIDEO.includes(a)){const r=[];return n.components&&n.components.forEach(u=>{const p=e[u.name];if(p){const t=p==="Lainnya..."?s[u.name]||"":p;t&&r.push(`${u.label.replace(/\(.+\)/,"").trim()}: ${t}`)}}),`A ${n.toolType} of ${e.subject||a}. ${r.join(", ")}.`}return S(n,e,s)};export{T as a,P as b,$ as c,L as d,V as e,O as f,b as g};
