const h={MIDJOURNEY:"Midjourney",STABLE_DIFFUSION:"Stable Diffusion",GENERIC_IMAGE_VIDEO:["DALL-E 3","Sora (OpenAI)","Pika","Runway","Google VEO"]},m=(n,a,o)=>{let s=n;for(const l in a){const u=`{${l}}`;let r=a[l];if(r==="Lainnya..."&&(r=o[l]||""),typeof r=="string"||typeof r=="number")s=s.replace(new RegExp(u,"g"),String(r));else if(Array.isArray(r)){const t=r.map(e=>e==="Lainnya..."?o[l]||"":e);s=s.replace(new RegExp(u,"g"),t.filter(Boolean).join(", "))}}return s},$=(n,a,o)=>{if(!n||!n.komponen_prompt)return E(n,n.nama_kerangka||"",a,o);const{PERAN:s,KONTEKS:l,TUGAS:u}=n.komponen_prompt,r=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(y=>{if(y&&y.trigger){const d=a[y.trigger];if(d&&y.options[d]){const g=y.options[d];g&&("components"in g&&Array.isArray(g.components)?r.push(...g.components):Array.isArray(g)&&r.push(...g))}}});const e={...a};r.forEach(y=>{a[y.name]==="Lainnya..."&&(e[y.name]=o[y.name]||"")});const i=m(s||"",e,o),p=m(l||"",e,o);let c=u||"";if(n.dynamicSubcomponents&&!Array.isArray(n.dynamicSubcomponents)){const y=n.dynamicSubcomponents.trigger,d=e[y];if(d){const g=n.dynamicSubcomponents.options[d];g&&!Array.isArray(g)&&typeof g=="object"&&"komponen_prompt"in g&&g.komponen_prompt?.TUGAS&&(c=g.komponen_prompt.TUGAS)}}const A=m(c,e,o);let _="";i&&(_+=`**Peran:**
${i}

`),p&&(_+=`**Konteks:**
${p}

`),A&&(_+=`**Tugas:**
${A}

`),n.konteks_tambahan_instruksi_khusus&&(_+=`**Instruksi Tambahan:**
${m(n.konteks_tambahan_instruksi_khusus,e,o)}

`);const f=n.komponen_prompt?.["FORMAT OUTPUT"];return f&&(_+=`**Format Output:**
${m(f,e,o)}
`),_.trim()},b=(n,a,o)=>{if(!n)return"Pilih kerangka kerja untuk melihat pratinjau.";let s="";n.ai_logic_description&&(s+=`${n.ai_logic_description.replace(/\*\*/g,"")}

`);const l=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(t=>{if(t&&t.trigger){const e=a[t.trigger];if(e&&t.options[e]){const i=t.options[e];i&&("components"in i&&Array.isArray(i.components)?l.push(...i.components):Array.isArray(i)&&l.push(...i))}}});let r=!1;return l.forEach(t=>{const e=a[t.name];if(e!==void 0&&e!==""&&e!==null&&(!Array.isArray(e)||e.length>0)){r=!0;let i="";e==="Lainnya..."?i=o[t.name]||"":Array.isArray(e)?i=e.map(p=>String(p).replace(/\*\*/g,"")).filter(Boolean).join(", "):i=String(e).replace(/\*\*/g,""),i&&(s+=`${t.label}: ${i}
`)}}),!r&&!n.ai_logic_description&&(s="Isi komponen untuk melihat pratinjau."),s.trim()},P=n=>{if(!n||n.length===0)return"Tambahkan blok untuk membangun prompt visual Anda.";let a=`Isi Prompt Visual:
--------------------`;return n.forEach((o,s)=>{o.type==="text"?a+=`[Blok Teks #${s+1}]:
${o.content||"(kosong)"}

`:o.type==="image"&&(a+=`[Blok Gambar #${s+1}]:
(Gambar telah ditambahkan)

`)}),a.trim()},O=n=>n?n.map(a=>{if(a.type==="text"&&a.content)return{text:a.content};if(a.type==="image"&&a.content){const o=a.content.match(/^data:(image\/\w+);base64,(.+)$/);if(o){const s=o[1],l=o[2];return{inlineData:{mimeType:s,data:l}}}}return null}).filter(a=>a!==null):[],T=(n,a)=>{const o=n.replace(/[^a-zA-Z0-9_-]/g,"_").replace(/__+/g,"_"),s=new Date().toISOString().replace(/[:\-.]/g,"").slice(0,15);return`${o}_${s}.${a}`},S=(n,a,o)=>{let s="";n.ai_logic_description&&(s+=`${n.ai_logic_description}

`);const l=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(t=>{if(t&&t.trigger){const e=a[t.trigger];if(e&&t.options[e]){const i=t.options[e];Array.isArray(i)?l.push(...i):"components"in i&&l.push(...i.components)}}});let r=0;return l.forEach(t=>{const e=a[t.name],i=t.optional||!1;(e||!i)&&((e==="Lainnya..."?o[t.name]:e)||!i)&&t.label.length>r&&(r=t.label.length)}),l.forEach(t=>{const e=a[t.name],i=t.optional||!1;if(e||!i){const p=e==="Lainnya..."?o[t.name]||"":e;if(p||!i){const c=t.label.padEnd(r," ");s+=`${c}: ${p||"[Tidak diisi]"}
`}}}),s.trim()},V=(n,a,o,s)=>{const l=[...n.components||[]];(Array.isArray(n.dynamicSubcomponents)?n.dynamicSubcomponents:n.dynamicSubcomponents?[n.dynamicSubcomponents]:[]).forEach(i=>{if(i&&i.trigger){const p=o[i.trigger];if(p&&i.options[p]){const c=i.options[p];c&&("components"in c&&Array.isArray(c.components)?l.push(...c.components):Array.isArray(c)&&l.push(...c))}}});const r={...o};l.forEach(i=>{o[i.name]==="Lainnya..."&&(r[i.name]=s[i.name]||"")});const t="FORMAT OUTPUT",e={id_kerangka:n.id_kerangka||"",nama_kerangka:n.nama_kerangka||a,perspektif_user:n.perspektif_user||n.description||"",ai_logic_description:n.ai_logic_description||"",komponen_prompt:{PERAN:m(n.komponen_prompt?.PERAN||"",r,s),KONTEKS:m(n.komponen_prompt?.KONTEKS||"",r,s),TUGAS:m(n.komponen_prompt?.TUGAS||"",r,s),[t]:m(n.komponen_prompt?.[t]||"",r,s)},konteks_tambahan_instruksi_khusus:m(n.konteks_tambahan_instruksi_khusus||"",r,s),contoh_kalimat:n.contoh_kalimat||"",output:n.output||"natural_language_prompt or json_prompt",input_komponen:l.reduce((i,p)=>{let c=o[p.name];return c==="Lainnya..."?c=s[p.name]||"":Array.isArray(c)&&(c=c.map(A=>A==="Lainnya..."?s[p.name]||"":A)),i[p.name]=c??"",i},{})};return JSON.stringify(e,null,2)},E=(n,a,o,s)=>{if(a===h.MIDJOURNEY){const l=o.subject||"",u=o.style||"";if(!n.components)return"";const r=n.components.map(t=>{const e=o[t.name];if(!e||t.name==="subject"||t.name==="style")return null;const i=e==="Lainnya..."?s[t.name]||"":e;if(!i)return null;const p=t.label.match(/--([\w\d.-]+)/);return p&&p[1]?`--${p[1]} ${i}`:null}).filter(Boolean).join(" ");return`${l} ${u} ${r}`.replace(/\s+/g," ").trim()}if(a===h.STABLE_DIFFUSION){const l=o.positivePrompt||"",u=o.negativePrompt||"",r=o.technicalParameters||"";let t=`Positive Prompt:
${l}

`;return u&&(t+=`Negative Prompt:
${u}

`),r&&(t+=`Parameters: ${r}`),t.trim()}if(h.GENERIC_IMAGE_VIDEO.includes(a)){const l=[];return n.components&&n.components.forEach(u=>{const r=o[u.name];if(r){const t=r==="Lainnya..."?s[u.name]||"":r;t&&l.push(`${u.label.replace(/\(.+\)/,"").trim()}: ${t}`)}}),`A ${n.toolType} of ${o.subject||a}. ${l.join(", ")}.`}return S(n,o,s)};export{O as a,b,$ as c,V as d,T as e,P as g};
