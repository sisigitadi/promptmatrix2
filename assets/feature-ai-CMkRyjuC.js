import{A as Te,t as ie,a as Pe,b as $e,c as xe,d as Ee,e as Ke,f as Be}from"./data-localization-BEmRbY13.js";const U=a=>a?a.replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/\r\n/g,`
`).replace(/\r/g,`
`):"",it=(a,e,n,t,i,r,l,o)=>{var T;const c=e||"Prompt Framework",g=n||"General",m=t||void 0;let p="";const h=(a==null?void 0:a.ai_logic_description)||(a==null?void 0:a.logika_ai);h&&(o==="en"?p=Te[c]||`AI Persona: ${ie(h.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,""),"en")}`:p=`Persona AI: ${h.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,"").trim()}`),p=U(p);let k=(a==null?void 0:a.components)||[];k.length===0&&((T=a==null?void 0:a.komponen_prompt)!=null&&T["VARIABEL INPUT"])&&(k=Object.entries(a.komponen_prompt["VARIABEL INPUT"]).map(([C,A])=>({...A,name:A.name||C})));let s=[];if(a!=null&&a.dynamicSubcomponents){const C=a.dynamicSubcomponents.trigger,A=String(i[C]||"");A&&a.dynamicSubcomponents.options[A]&&(s=a.dynamicSubcomponents.options[A])}const d=[...k,...s],y={},S=[];d.forEach(C=>{let A=i[C.name];if((A==="Lainnya..."||A==="Other...")&&(A=r[C.name]?`${A} (${r[C.name]})`:A),A!=null&&String(A).trim()!==""){const N=o==="en"?Pe(C.label||C.name,"en"):C.label||C.name;let v=A;if(typeof A=="string"){const P=o==="en"?$e(A,"en"):A;v=U(P)}else Array.isArray(A)&&(v=A.map(P=>U(String(P))));y[N]=v,S.push(`${N}: ${Array.isArray(v)?v.join(", "):v}`)}});let b;if(a!=null&&a.konteks_tambahan_instruksi_khusus){const C=o==="en"?ie(a.konteks_tambahan_instruksi_khusus,"en"):a.konteks_tambahan_instruksi_khusus;b=U(C),S.push(`${o==="id"?"Instruksi Tambahan":"Additional Instructions"}: ${b}`)}let w;const O=i.__few_shot_input,f=i.__few_shot_output;(O||f)&&(w={sample_input:O?U(String(O)):void 0,expected_output:f?U(String(f)):void 0});const $=[];p&&$.push({role:"system",content:p});const L=S.length>0?S.join(`

`):l?U(l):"Execute task according to framework specifications.";return $.push({role:"user",content:L}),{template:c,category:g,subcategory:m,language:o,persona:p,parameters:y,additional_instructions:b,few_shot:w,prompt:U(l),messages:$}},st=(a,e="full")=>{let n;e==="messages"?n={messages:a.messages}:e==="prompt_only"?n={prompt:a.prompt}:n=a;try{const t=JSON.stringify(n,null,2);return JSON.parse(t),t}catch(t){return console.warn("First serialization pass failed, applying strict ASCII/fallback sanitization:",t),JSON.stringify(n,(r,l)=>typeof l=="string"?U(l):l,2)}},X=64,se=1024,ue=/^[a-z0-9]+(?:-[a-z0-9]+)*$/,M=a=>U(a).replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim(),je=(a,e)=>{const n=a.replace(/\s+/g," ").trim();if(n.length<=e)return n;const t=n.slice(0,Math.max(0,e-3)),i=t.lastIndexOf(" ");return`${(i>Math.floor(e*.6)?t.slice(0,i):t).trim()}...`},z=a=>`"${M(a).replace(/\s+/g," ").trim().replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`,J=a=>{const e=M(a).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"");return e&&e.slice(0,X).replace(/-+$/g,"")||"promptmatrix-agent-skill"},_e=(a,e)=>{var t;if(!a)return[];let n=a.components?[...a.components]:[];if(n.length===0&&((t=a.komponen_prompt)!=null&&t["VARIABEL INPUT"])&&(n=Object.entries(a.komponen_prompt["VARIABEL INPUT"]).map(([i,r])=>({...r,name:r.name||i}))),a.dynamicSubcomponents){const i=a.dynamicSubcomponents.trigger,r=String(e[i]??""),l=a.dynamicSubcomponents.options[r];r&&Array.isArray(l)&&(n=[...n,...l])}return n},rt=a=>{const{framework:e,frameworkName:n,category:t,subcategory:i,formValues:r,customOtherValues:l,compiledPrompt:o,language:c,author:g="Sigit Adi (PromptMatrix)",version:m="1.0.0"}=a,p=n||"PromptMatrix Custom Skill",h=M(Ke(p,c)),k=J(p),d=M(xe(t||"General",c)),y=i?M(Ee(i,c)):"";let S="";const b=(e==null?void 0:e.ai_logic_description)||(e==null?void 0:e.logika_ai);if(b){const R=b.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,"").trim();c==="en"?S=M(Te[p]||`AI Persona: ${ie(R,"en")}`):S=M(`Persona AI: ${R}`)}const w=(e==null?void 0:e.description)||"",O=M(Be(w,c,p)),f=y?`${d} (${y})`:d,$=c==="id"?`Gunakan skill ini saat pengguna membutuhkan workflow terstruktur untuk ${h} pada domain ${f}.`:`Use this skill when the user needs a structured workflow for ${h} in ${f}.`,L=O?`${O} ${$}`:`${h} workflow skill. ${$}`,T=je(M(L),se),C=_e(e,r),A=[],N=new Set;C.forEach(R=>{N.add(R.name);let K=r[R.name];if(K==="Lainnya..."||K==="Other..."){const V=l[R.name];K=V?`${K} (${V})`:K}const te=M(c==="en"?Pe(R.label||R.name,"en"):R.label||R.name);if(K!=null&&String(K).trim()!==""){const V=Array.isArray(K)?K.map(le=>M(String(le))).join(", "):M(typeof K=="string"&&c==="en"?$e(K,"en"):String(K));A.push(`- **${te}**: ${V}`)}else{const V=R.optional?c==="id"?"opsional":"optional":c==="id"?"isi sesuai konteks":"provide per context",le=R.placeholder?` (${M(R.placeholder)})`:"";A.push(`- **${te}**: _${V}_${le}`)}}),Object.entries(r).forEach(([R,K])=>{if(R==="__few_shot_input"||R==="__few_shot_output"||N.has(R)||K===void 0||K===null||String(K).trim()==="")return;const te=Array.isArray(K)?K.map(V=>M(String(V))).join(", "):M(String(K));A.push(`- **${M(R)}**: ${te}`)});let v="";e!=null&&e.konteks_tambahan_instruksi_khusus&&(v=M(c==="en"?ie(e.konteks_tambahan_instruksi_khusus,"en"):e.konteks_tambahan_instruksi_khusus));const P=r.__few_shot_input?M(String(r.__few_shot_input)):"",D=r.__few_shot_output?M(String(r.__few_shot_output)):"",I=[S||(c==="id"?`Bertindak sebagai spesialis untuk menjalankan kerangka kerja ${h}.`:`Act as a domain specialist executing the ${h} workflow.`),"",c==="id"?`- **Pemicu Utama**: Aktifkan saat tugas berkaitan dengan ${h} (${f}).`:`- **Trigger Condition**: Activate when the task involves ${h} (${f}).`,c==="id"?`- **Format Keluaran Target**: ${(e==null?void 0:e.output)==="json_prompt"?"JSON terstruktur sesuai kontrak":"Respons terstruktur sesuai parameter"}.`:`- **Target Output Format**: ${(e==null?void 0:e.output)==="json_prompt"?"Structured JSON contract":"Structured response aligned with parameters"}.`].join(`
`),E=A.length>0?A.join(`
`):c==="id"?"- Tidak ada parameter wajib; gunakan konteks permintaan pengguna secara langsung.":"- No mandatory input variables; operate directly from the user request context.",G=M(o),F=c==="id"?["1. Validasi seluruh parameter masukan dan klarifikasi bagian yang belum terisi jika krusial.","2. Terapkan persona serta batasan instruksi di bawah ini secara konsisten.","3. Susun keluaran akhir menggunakan struktur kerja berikut:"]:["1. Validate all input parameters and clarify missing critical constraints before proceeding.","2. Apply the assigned role, constraints, and domain instructions consistently.","3. Produce the final deliverable following the compiled prompt contract below:"];v&&(F.push(""),F.push(c==="id"?`**Instruksi Khusus**: ${v}`:`**Additional Instructions**: ${v}`)),G&&(F.push(""),F.push("```text"),F.push(G),F.push("```"));const H=F.join(`
`),Q=c==="id"?["- [ ] Seluruh parameter input utama telah tercermin pada hasil akhir.","- [ ] Format keluaran bersih, bebas placeholder kosong, dan siap pakai.","- [ ] Batasan keamanan, privasi, dan konsistensi fakta telah diperiksa."].join(`
`):["- [ ] Every filled input parameter is reflected accurately in the output.","- [ ] Output format is clean, free of unresolved placeholders, and ready to use.","- [ ] Constraints, edge cases, and factual accuracy have been verified."].join(`
`);let W;if(P||D){const R=[];P&&(R.push(c==="id"?"### Contoh Masukan":"### Sample Input"),R.push("```text"),R.push(P),R.push("```")),D&&(R.length>0&&R.push(""),R.push(c==="id"?"### Contoh Keluaran yang Diharapkan":"### Expected Output"),R.push("```text"),R.push(D),R.push("```")),W=R.join(`
`)}const Ie=[`# ${h}`,"","## Role & Trigger",I,"","## Input Parameters",E,"","## Execution Steps",H,"","## Verification Checklist",Q];return W&&Ie.push("","## Few-Shot Reference",W),{name:k,description:T,license:"MIT",compatibility:"Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills runners.",metadata:{author:M(g),version:M(m),source:"PromptMatrix 2.0",category:d,language:c,framework:M(p)},body:Ie.join(`
`).trim(),sections:{roleAndTrigger:I,inputParameters:E,executionSteps:H,verificationChecklist:Q,fewShotReference:W}}},ot=a=>{const e=[],n=[],t=a.name.trim(),i=a.description.trim(),r=a.body.trim();return t?(t.length>X&&e.push(`Skill name exceeds ${X} characters (${t.length}).`),ue.test(t)||e.push("Skill name must be lowercase kebab-case (a-z, 0-9, single hyphens only).")):e.push("Skill name is required."),i?i.length>se&&e.push(`Skill description exceeds ${se} characters (${i.length}).`):e.push("Skill description is required."),r||e.push("Skill Markdown body cannot be empty."),a.license.trim()||n.push("License field is empty; MIT is recommended."),i.length>0&&i.length<40&&n.push("Description is short; include clearer trigger conditions for agent discovery."),{valid:e.length===0,errors:e,warnings:n,nameLength:t.length,descriptionLength:i.length}},Fe=a=>`${["---",`name: ${a.name}`,`description: ${z(a.description)}`,`license: ${a.license||"MIT"}`,`compatibility: ${z(a.compatibility)}`,"metadata:",`  author: ${z(a.metadata.author)}`,`  version: ${z(a.metadata.version)}`,`  source: ${z(a.metadata.source)}`,`  category: ${z(a.metadata.category)}`,`  language: ${z(a.metadata.language)}`,`  framework: ${z(a.metadata.framework)}`,"---"].join(`
`)}

${a.body.trim()}
`,Ge=new Set(["and","the","for","with","from","into","your"]),Ue=["unlock","elevate","empower","delve","showcase","testament","landscape","journey","robust","game-changer","next-level","next-generation","seamless","seamlessly","cutting-edge","revolutionary","revolutionizing","ultimate","unleash","tapestry"],qe=new RegExp(`\\b(${Ue.join("|")})\\b`,"gi"),Ve=[{heading:"Role & Trigger",pattern:/^##\s+Role\s*&\s*Trigger\b/im},{heading:"Input Parameters",pattern:/^##\s+Input\s+Parameters\b/im},{heading:"Execution Steps",pattern:/^##\s+Execution\s+Steps\b/im},{heading:"Verification Checklist",pattern:/^##\s+Verification\s+Checklist\b/im}],lt=(a,e)=>{const n=a.name.trim(),t=a.description.trim(),i=a.body.trim(),r=((e==null?void 0:e.tagline)??"").trim(),l=((e==null?void 0:e.demoRequest)??"").trim(),o=((e==null?void 0:e.demoResult)??"").trim(),c=(e==null?void 0:e.tags)??[],g=n.length>0&&n.length<=X&&ue.test(n),m=t.length>=40&&t.length<=se,p=Ve.filter(P=>!P.pattern.test(i)).map(P=>P.heading),h=p.length===0,k=[n,t,a.compatibility,i,r,l,o,c.join(" ")].join(`
`),s=(k.match(/\u2014/g)||[]).length,d=s===0,y=Array.from(new Set((k.match(qe)||[]).map(P=>P.toLowerCase()))),S=y.length===0,b=c.filter(P=>{const D=P.trim();return!D||D.startsWith("#")||Ge.has(D.toLowerCase())||!ue.test(D)}),w=c.length>=3&&c.length<=7,O=w&&b.length===0,f=r.length>0,$=l.length>=25,L=/^##\s+Summary\b/im.test(o),T=o.length>=700&&L,C=[{id:"valid-name",label:"Valid kebab-case slug (<= 64 chars)",passed:g,detail:g?`${n} (${n.length}/${X} chars)`:"Skill name must be non-empty lowercase kebab-case and at most 64 characters."},{id:"valid-description",label:"Discovery description (40-1024 chars)",passed:m,detail:m?`${t.length} chars (within 40-1024 limit)`:`Description is ${t.length} chars; target 40-1024 chars.`},{id:"required-sections",label:"Required SKILL.md playbook sections",passed:h,detail:h?"All 4 sections present (Role & Trigger, Input Parameters, Execution Steps, Verification Checklist).":`Missing sections: ${p.join(", ")}`},{id:"zero-em-dashes",label:"Zero em-dash characters (U+2014)",passed:d,detail:d?"No em-dash characters found.":`Found ${s} em-dash character(s); replace with commas, colons, or parentheses.`},{id:"zero-ai-buzzwords",label:"Zero banned AI marketing buzzwords",passed:S,detail:S?"Copy passes anti-buzzword check.":`Remove buzzwords: ${y.join(", ")}`},{id:"clean-tags",label:"Clean marketplace tags (3-7 kebab-case, no # or stopwords)",passed:O,detail:O?`${c.length} clean tags: ${c.join(", ")}`:w?`Invalid tag(s): ${b.join(", ")}`:`Expected 3-7 tags; received ${c.length}.`},{id:"tagline-present",label:"Marketplace tagline present",passed:f,detail:f?`${r.length} chars`:"Add a concise 1-sentence tagline describing the concrete skill outcome."},{id:"demo-request",label:"Step 3 demo request (>= 25 chars)",passed:$,detail:$?`${l.length} chars`:`Demo request is ${l.length} chars (minimum 25 chars).`},{id:"demo-result",label:"Step 3 demo result (>= 700 chars + ## Summary)",passed:T,detail:T?`${o.length} chars with ## Summary section`:`Demo result is ${o.length} chars (need >= 700 chars and a ## Summary heading).`}],A=C.length,N=C.filter(P=>P.passed).length;return{score:A>0?Math.round(N/A*100):0,passedCount:N,totalCount:A,checks:C}},ct="__blank_canvas__",he="pm_blank_canvas_draft",be="Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills runners.",Z=64,me=1024,ne=[{type:"persona",labelId:"Persona AI",labelEn:"AI Persona",placeholderId:"Contoh: Senior Software Architect dengan pengalaman 10 tahun di sistem terdistribusi...",placeholderEn:"e.g. Senior Software Architect with 10 years of experience in distributed systems...",hintId:"Tetapkan peran, keahlian, dan sudut pandang model AI.",hintEn:"Define the role, expertise, and perspective of the AI model.",editableLabel:!1},{type:"context",labelId:"Konteks & Tujuan",labelEn:"Context & Goal",placeholderId:"Jelaskan latar belakang proyek, situasi saat ini, dan sasaran akhir yang ingin dicapai...",placeholderEn:"Describe project background, current situation, and the end objective...",hintId:"Berikan informasi situasi agar AI memahami ruang lingkup masalah.",hintEn:"Provide situational context so the AI understands the problem scope.",editableLabel:!1},{type:"task",labelId:"Tugas Utama",labelEn:"Core Task",placeholderId:"Uraikan tugas spesifik yang harus dikerjakan AI langkah demi langkah...",placeholderEn:"Specify the exact task the AI needs to execute step by step...",hintId:"Fokus pada aksi konkret yang diharapkan dari model.",hintEn:"Focus on the concrete action expected from the model.",editableLabel:!1},{type:"constraints",labelId:"Batasan & Kriteria",labelEn:"Constraints & Rules",placeholderId:"Contoh: Jangan mengarang fakta, hindari jargon berlebihan, maksimal 300 kata...",placeholderEn:"e.g. Do not fabricate facts, avoid unnecessary jargon, max 300 words...",hintId:"Tetapkan pagar pengaman, larangan, dan syarat kualitas.",hintEn:"Set guardrails, exclusions, and quality criteria.",editableLabel:!1},{type:"output_format",labelId:"Format Output",labelEn:"Output Format",placeholderId:"Contoh: Tabel Markdown dengan 3 kolom, JSON valid, atau poin bernomor...",placeholderEn:"e.g. 3-column Markdown table, valid JSON, or numbered action items...",hintId:"Tentukan struktur visual atau format data dari hasil akhir.",hintEn:"Specify the visual structure or data format of the final output.",editableLabel:!1},{type:"audience",labelId:"Target Audiens",labelEn:"Target Audience",placeholderId:"Contoh: Manajer produk non-teknis, developer pemula, atau eksekutif C-level...",placeholderEn:"e.g. Non-technical product managers, junior developers, or C-level executives...",hintId:"Sesuaikan tingkat kedalaman bahasa dengan pembaca akhir.",hintEn:"Tailor vocabulary and depth to the intended reader.",editableLabel:!1},{type:"variable",labelId:"Variabel Input",labelEn:"Input Variable",placeholderId:"Masukkan nilai data, cuplikan teks, atau parameter khusus untuk diproses...",placeholderEn:"Provide input data, source text snippet, or custom parameter to process...",hintId:"Label dapat diubah sesuai nama variabel atau data masukan Anda.",hintEn:"Label can be edited to match your custom input variable name.",editableLabel:!0},{type:"custom",labelId:"Bagian Kustom",labelEn:"Custom Section",placeholderId:"Isi instruksi atau referensi tambahan sesuai kebutuhan spesifik Anda...",placeholderEn:"Enter additional instructions or references tailored to your workflow...",hintId:"Label bebas disesuaikan untuk kebutuhan blok apa pun.",hintEn:"Label can be freely customized for any section you need.",editableLabel:!0}],ze=new Set(ne.map(a=>a.type)),u=a=>U(a).replace(/\u2014/g,", ").replace(/\u2013/g,"-"),fe=a=>{if(typeof a=="number"&&Number.isFinite(a)&&a>=0)return Number(a.toFixed(2));if(typeof a=="string"&&a.trim()){const e=Number(a.trim());if(Number.isFinite(e)&&e>=0)return Number(e.toFixed(2))}},ye=(a,e)=>{const n=a.replace(/\s+/g," ").trim();if(n.length<=e)return n;const t=n.slice(0,Math.max(0,e-3)),i=t.lastIndexOf(" ");return`${(i>Math.floor(e*.6)?t.slice(0,i):t).trim()}...`},ee=a=>ne.find(n=>n.type===a)??ne[ne.length-1],Re=a=>{const e=Math.random().toString(36).slice(2,8),n=Date.now().toString(36);return`canvas_${a}_${n}_${e}`},Y=(a,e,n,t)=>{const i=ee(a),r=e==="id"?i.labelId:i.labelEn,l=n&&n.trim()?u(n.trim()):r;return{id:Re(a),type:a,label:l,value:t?u(t):"",isCustomLabel:i.editableLabel}},Se=()=>({title:"",description:"",targetMode:"prompt",scratchpad:"",blocks:[],fewShotInput:"",fewShotOutput:"",skillName:"",skillDescription:"",skillCompatibility:be,skillTagline:"",skillPriceUsd:void 0,skillTags:"",skillDemoRequest:"",skillDemoResult:"",updatedAt:Date.now()}),Le=a=>{if(!a||typeof a!="object")return null;const e=a,n=typeof e.type=="string"?e.type:"custom",t=ze.has(n)?n:"custom",i=ee(t),r=typeof e.id=="string"&&e.id.trim()?u(e.id.trim()):Re(t),l=typeof e.label=="string"&&e.label.trim()?u(e.label):i.labelId,o=typeof e.value=="string"?u(e.value):"",c=typeof e.isCustomLabel=="boolean"?e.isCustomLabel:i.editableLabel;return{id:r,type:t,label:l,value:o,isCustomLabel:c}},dt=()=>{const a=Se();if(typeof window>"u"||typeof localStorage>"u")return a;try{const e=localStorage.getItem(he);if(!e)return a;const n=JSON.parse(e);if(!n||typeof n!="object")return a;const t=n,i=t.targetMode==="skill"?"skill":"prompt",r=Array.isArray(t.blocks)?t.blocks.map(l=>Le(l)).filter(l=>l!==null):[];return{title:typeof t.title=="string"?u(t.title):"",description:typeof t.description=="string"?u(t.description):"",targetMode:i,scratchpad:typeof t.scratchpad=="string"?u(t.scratchpad):"",blocks:r,fewShotInput:typeof t.fewShotInput=="string"?u(t.fewShotInput):"",fewShotOutput:typeof t.fewShotOutput=="string"?u(t.fewShotOutput):"",skillName:typeof t.skillName=="string"?u(t.skillName):"",skillDescription:typeof t.skillDescription=="string"?u(t.skillDescription):"",skillCompatibility:typeof t.skillCompatibility=="string"&&t.skillCompatibility.trim()?u(t.skillCompatibility):be,skillTagline:typeof t.skillTagline=="string"?u(t.skillTagline):"",skillPriceUsd:fe(t.skillPriceUsd),skillTags:typeof t.skillTags=="string"?u(t.skillTags):"",skillDemoRequest:typeof t.skillDemoRequest=="string"?u(t.skillDemoRequest):"",skillDemoResult:typeof t.skillDemoResult=="string"?u(t.skillDemoResult):"",updatedAt:typeof t.updatedAt=="number"&&Number.isFinite(t.updatedAt)?t.updatedAt:Date.now()}}catch(e){return console.warn("Failed to load Blank Canvas draft from localStorage:",e),a}},pt=a=>{if(!(typeof window>"u"||typeof localStorage>"u"))try{const e={...a,skillTagline:typeof a.skillTagline=="string"?u(a.skillTagline):"",skillPriceUsd:fe(a.skillPriceUsd),skillTags:typeof a.skillTags=="string"?u(a.skillTags):"",skillDemoRequest:typeof a.skillDemoRequest=="string"?u(a.skillDemoRequest):"",skillDemoResult:typeof a.skillDemoResult=="string"?u(a.skillDemoResult):"",updatedAt:a.updatedAt||Date.now()};localStorage.setItem(he,JSON.stringify(e))}catch(e){console.warn("Failed to save Blank Canvas draft to localStorage:",e)}},ut=()=>{if(!(typeof window>"u"||typeof localStorage>"u"))try{localStorage.removeItem(he)}catch(a){console.warn("Failed to clear Blank Canvas draft from localStorage:",a)}},mt=a=>!!(a.title.trim()||a.description.trim()||a.scratchpad.trim()||a.fewShotInput.trim()||a.fewShotOutput.trim()||a.skillName.trim()||a.skillDescription.trim()||(a.skillTagline||"").trim()||typeof a.skillPriceUsd=="number"||(a.skillTags||"").trim()||(a.skillDemoRequest||"").trim()||(a.skillDemoResult||"").trim()||a.blocks.length>0),Je=(a,e)=>{const n=[],t=a.blocks.filter(o=>o.value.trim().length>0);t.forEach(o=>{const c=ee(o.type),g=e==="id"?c.labelId:c.labelEn,m=u(o.label.trim())||g,p=u(o.value.trim());n.push(`${m}: ${p}`)});const i=u(a.scratchpad.trim());if(i)if(t.length>0){const o=e==="id"?"Instruksi Utama":"Core Instructions";n.push(`${o}:
${i}`)}else n.push(i);const r=u(a.fewShotInput.trim()),l=u(a.fewShotOutput.trim());if(r){const o=e==="id"?"Contoh Masukan":"Sample Input";n.push(`${o}:
${r}`)}if(l){const o=e==="id"?"Contoh Keluaran yang Diharapkan":"Expected Output";n.push(`${o}:
${l}`)}return u(n.join(`

`))},kt=(a,e,n)=>{const t=u(a.title.trim())||(n==="id"?"Canvas Kosong":"Blank Canvas"),i=n==="id"?"Canvas Kosong":"Blank Canvas",r=a.targetMode==="skill"?"Agent Skill (SKILL.md)":"Custom Prompt",l=a.blocks.filter(b=>b.value.trim().length>0),o=l.filter(b=>b.type==="persona"),c=u(o.map(b=>b.value.trim()).join(`

`)),g={},m=[];l.forEach(b=>{const w=ee(b.type),O=n==="id"?w.labelId:w.labelEn,f=u(b.label.trim())||O,$=u(b.value.trim());let L=f,T=2;for(;Object.prototype.hasOwnProperty.call(g,L);)L=`${f} (${T})`,T+=1;g[L]=$,b.type!=="persona"&&m.push(`${f}: ${$}`)});const p=u(a.scratchpad.trim());if(p){const b=n==="id"?"Instruksi Utama":"Core Instructions";m.push(`${b}:
${p}`)}const h=u(a.fewShotInput.trim()),k=u(a.fewShotOutput.trim()),s=h||k?{sample_input:h||void 0,expected_output:k||void 0}:void 0,d=[];c&&d.push({role:"system",content:c});const y=u(e.trim()),S=n==="id"?"Jalankan instruksi sesuai spesifikasi Canvas Kosong.":"Execute task according to Blank Canvas specifications.";return d.push({role:"user",content:m.length>0?m.join(`

`):y||S}),{template:t,category:i,subcategory:r,language:n,persona:c,parameters:g,additional_instructions:p||void 0,few_shot:s,prompt:y,messages:d}},He=(a,e,n)=>{const t=u(a.title.trim())||(n==="id"?"Skill Canvas Kustom":"Custom Canvas Skill"),i=a.skillName.trim()||a.title.trim()||"custom-canvas-skill",r=J(i).slice(0,Z),l=u(a.description.trim()),o=u(a.skillDescription.trim()),c=n==="id"?`Gunakan skill ini saat pengguna membutuhkan alur kerja terstruktur untuk ${t}.`:`Use this skill when the user needs a structured workflow for ${t}.`,g=o||(l?`${l} ${c}`:c),m=ye(u(g),me),p=u(a.skillCompatibility.trim())||be,h=a.blocks.filter(I=>I.value.trim().length>0),k=h.filter(I=>I.type==="persona"),s=h.filter(I=>I.type==="output_format"),d=h.filter(I=>I.type==="constraints"),y=k.length>0?u(k.map(I=>I.value.trim()).join(" ")):n==="id"?`Bertindak sebagai spesialis domain untuk menjalankan skill ${t}.`:`Act as a domain specialist executing the ${t} skill.`,S=o||l||t,b=s.length>0?u(s.map(I=>I.value.trim()).join("; ")):n==="id"?"Respons terstruktur sesuai parameter dan instruksi.":"Structured response aligned with parameters and instructions.",w=[y,"",n==="id"?`- **Pemicu Utama**: ${S}`:`- **Trigger Condition**: ${S}`,n==="id"?`- **Format Keluaran Target**: ${b}`:`- **Target Output Format**: ${b}`].join(`
`),O=h.map(I=>{const E=ee(I.type),G=n==="id"?E.labelId:E.labelEn,F=u(I.label.trim())||G,H=u(I.value.trim());return`- **${F}**: ${H}`}),f=O.length>0?O.join(`
`):n==="id"?"- Tidak ada blok parameter khusus; jalankan langsung berdasarkan konteks permintaan pengguna.":"- No dedicated parameter blocks defined; operate directly from the user request context.",$=u(a.scratchpad.trim()),L=u(e.trim()),T=n==="id"?["1. Tinjau seluruh konteks, variabel masukan, dan batasan yang ditetapkan.","2. Ikuti instruksi inti secara berurutan tanpa melewati langkah verifikasi.","3. Hasilkan keluaran akhir mengikuti spesifikasi prompt di bawah ini:"]:["1. Review all context, input variables, and constraints defined in this skill.","2. Follow the core instructions sequentially without skipping verification steps.","3. Produce the final deliverable matching the prompt specification below:"];$&&h.length>0&&(T.push(""),T.push(n==="id"?`**Instruksi Scratchpad**: ${$}`:`**Scratchpad Instructions**: ${$}`)),L&&(T.push(""),T.push("```text"),T.push(L),T.push("```"));const C=T.join(`
`),A=n==="id"?["- [ ] Seluruh blok parameter dan instruksi inti telah dipenuhi.","- [ ] Format keluaran bersih, bebas placeholder kosong, dan siap digunakan.","- [ ] Fakta, konsistensi, serta keamanan informasi telah divalidasi."]:["- [ ] Every defined parameter block and core instruction is satisfied.","- [ ] Output format is clean, free of unresolved placeholders, and ready to use.","- [ ] Factual accuracy, consistency, and safety constraints are verified."];if(d.length>0){const I=u(d.map(E=>E.value.trim()).join("; "));A.push(n==="id"?`- [ ] Batasan khusus dipatuhi: ${I}`:`- [ ] Custom constraints honored: ${I}`)}const N=A.join(`
`),v=u(a.fewShotInput.trim()),P=u(a.fewShotOutput.trim());let D;if(v||P){const I=[];v&&(I.push(n==="id"?"### Contoh Masukan":"### Sample Input"),I.push("```text"),I.push(v),I.push("```")),P&&(I.length>0&&I.push(""),I.push(n==="id"?"### Contoh Keluaran yang Diharapkan":"### Expected Output"),I.push("```text"),I.push(P),I.push("```")),D=I.join(`
`)}const _=[`# ${t}`,"","## Role & Trigger",w,"","## Input Parameters",f,"","## Execution Steps",C,"","## Verification Checklist",N];return D&&_.push("","## Few-Shot Reference",D),{name:r,description:m,license:"MIT",compatibility:p,metadata:{author:"Sigit Adi (PromptMatrix)",version:"1.0.0",source:"PromptMatrix 2.0 (Blank Canvas)",category:n==="id"?"Canvas Kosong":"Blank Canvas",language:n,framework:t},body:_.join(`
`).trim(),sections:{roleAndTrigger:w,inputParameters:f,executionSteps:C,verificationChecklist:N,fewShotReference:D}}},ve=a=>{if(!a)return"";const e=a.trim().replace(/^.*[\\/]/,"");return u(e.replace(/\.[^.]+$/,""))},ce=a=>{const e=a.split(`
`);for(const n of e){const t=u(n.replace(/^#+\s*/,"").replace(/^[-*]\s*/,"").trim());if(t&&t!=="---")return ye(t,60)}return""},ke=a=>{const e=a.trim().toLowerCase();return/^(?:few[\s-]*shot.*input|sample\s+input|contoh\s+masukan)$/.test(e)?"few_shot_input":/^(?:few[\s-]*shot.*output|expected\s+output|contoh\s+keluaran(?:\s+yang\s+diharapkan)?)$/.test(e)?"few_shot_output":/^(?:core\s+instructions?|instructions?|instruksi\s+utama|scratchpad)$/.test(e)?"scratchpad":/(?:persona|role|peran)/.test(e)?"persona":/(?:context|konteks|background|latar\s+belakang|goal|tujuan)/.test(e)?"context":/(?:input\s*parameters?|parameters?|variable|variabel|inputs?)/.test(e)?"variable":/(?:constraints?|rules?|batasan|kriteria|guardrails?)/.test(e)?"constraints":/(?:output\s*format|format\s*(?:output|keluaran)|deliverables?|^output$)/.test(e)?"output_format":/(?:audience|audiens)/.test(e)?"audience":/(?:execution\s*steps?|steps?|task|tugas|workflow|langkah)/.test(e)?"task":"custom"},We=a=>{const e=a.split(`
`);let n="",t="",i="";const r=l=>{const o=l.trim();return o.startsWith('"')&&o.endsWith('"')||o.startsWith("'")&&o.endsWith("'")?o.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`).replace(/\\\\/g,"\\").trim():o};for(const l of e){const o=l.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);if(!o)continue;const c=o[1].toLowerCase(),g=u(r(o[2]));c==="name"&&g?n=g:c==="description"&&g?t=g:c==="compatibility"&&g&&(i=g)}return{name:n,description:t,compatibility:i}},Ye=a=>{const e=a.trim(),n=o=>u(o.replace(/^```[a-zA-Z0-9_-]*\s*\n?/gm,"").replace(/\n?```\s*$/gm,"").trim()),t=e.match(/(?:###\s*(?:Sample\s+Input|Contoh\s+Masukan)|(?:Sample\s+Input|Contoh\s+Masukan)\s*:)\s*\n?([\s\S]*?)(?=(?:###\s*(?:Expected\s+Output|Contoh\s+Keluaran)|(?:Expected\s+Output|Contoh\s+Keluaran)[^\n]*:)|$)/i),i=e.match(/(?:###\s*(?:Expected\s+Output|Contoh\s+Keluaran[^\n]*)|(?:Expected\s+Output|Contoh\s+Keluaran[^\n]*)\s*:)\s*\n?([\s\S]*)$/i),r=t?n(t[1]):"",l=i?n(i[1]):"";return!r&&!l&&e?{input:n(e),output:""}:{input:r,output:l}},Qe=a=>{const e=a.trim(),n=e.match(/###\s*The\s+Request\s*\n([\s\S]*?)(?=###\s*The\s+Result\b|$)/i),t=e.match(/###\s*The\s+Result\s*\n([\s\S]*)$/i);return{request:n?u(n[1].trim()):"",result:t?u(t[1].trim()):""}},Ce=(a,e)=>{const n=a.split(`
`);let t="";const i=[],r=[];let l=null;for(const s of n){const d=!t&&!l?s.match(/^#\s+(.+)$/):null;if(d){t=u(d[1].trim());continue}const y=s.match(/^##\s+(.+)$/);if(y){l&&r.push(l),l={heading:u(y[1].trim()),lines:[]};continue}l?l.lines.push(s):i.push(s)}l&&r.push(l);const o=[],c=[];let g="",m="",p="",h="";const k=u(i.join(`
`).trim());k&&c.push(k);for(const s of r){const d=s.lines.join(`
`).trim(),y=u(d);if(!y)continue;if(/see\s+it\s+in\s+action/i.test(s.heading)){const b=Qe(d);b.request&&!p&&(p=b.request),b.result&&!h&&(h=b.result);continue}if(/few[\s-]*shot/i.test(s.heading)){const b=Ye(d);b.input&&!g&&(g=b.input),b.output&&!m&&(m=b.output);continue}const S=ke(s.heading);S==="scratchpad"?c.push(y):S==="few_shot_input"?g=g||y:S==="few_shot_output"?m=m||y:S==="custom"?o.push(Y("custom",e,s.heading,y)):o.push(Y(S,e,s.heading,y))}return{headingTitle:t,blocks:o,scratchpadParts:c,fewShotInput:g,fewShotOutput:m,demoRequest:p,demoResult:h}},B=a=>typeof a=="string"?u(a.trim()):typeof a=="number"||typeof a=="boolean"?String(a):Array.isArray(a)?u(a.map(e=>typeof e=="string"?e.trim():JSON.stringify(e)).filter(Boolean).join(", ")):a&&typeof a=="object"?u(JSON.stringify(a)):"",ge=(a,e)=>{if(e&&/skill\.md$/i.test(e.trim()))return"skill";const n=a.replace(/\r\n/g,`
`).trim();if(!n)return"prompt";const t=n.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);return t&&/^\s*(?:name|description)\s*:/im.test(t[1])||/^##\s+(?:Role\s*&\s*Trigger|Execution\s+Steps|Verification\s+Checklist)\b/im.test(n)?"skill":"prompt"},gt=(a,e,n="id")=>{const t=Se(),i=a.replace(/\r\n/g,`
`).trim();if(!i)return e&&(t.title=ve(e)),t.targetMode=ge(a,e),t;const r=ve(e);if(i.startsWith("{")||e&&/\.json$/i.test(e.trim()))try{const k=JSON.parse(i);if(k&&typeof k=="object"&&!Array.isArray(k)){const s=k,d=B(s.template)||B(s.title)||B(s.name)||r||(n==="id"?"Prompt Impor JSON":"Imported JSON Prompt"),y=B(s.description),S=[],b=B(s.persona);b&&S.push(Y("persona",n,void 0,b)),Array.isArray(s.blocks)&&s.blocks.forEach(f=>{const $=Le(f);$&&$.value.trim()&&S.push($)}),s.parameters&&typeof s.parameters=="object"&&!Array.isArray(s.parameters)&&Object.entries(s.parameters).forEach(([f,$])=>{const L=B($);if(!L)return;const T=ke(f);if(T==="persona"&&b&&L===b)return;if(T==="scratchpad"){t.scratchpad||(t.scratchpad=L);return}if(T==="few_shot_input"){t.fewShotInput=t.fewShotInput||L;return}if(T==="few_shot_output"){t.fewShotOutput=t.fewShotOutput||L;return}const C=T==="custom"?"variable":T;S.push(Y(C,n,u(f),L))});const w=B(s.scratchpad)||B(s.additional_instructions)||B(s.prompt);if(w&&(t.scratchpad=t.scratchpad?`${t.scratchpad}

${w}`:w),s.few_shot&&typeof s.few_shot=="object"&&!Array.isArray(s.few_shot)){const f=s.few_shot;t.fewShotInput=B(f.sample_input)||t.fewShotInput,t.fewShotOutput=B(f.expected_output)||t.fewShotOutput}else t.fewShotInput=B(s.fewShotInput)||t.fewShotInput,t.fewShotOutput=B(s.fewShotOutput)||t.fewShotOutput;const O=s.targetMode==="skill"||typeof s.subcategory=="string"&&/skill/i.test(s.subcategory)||!!(e&&/skill/i.test(e));if(t.title=d,t.description=y,t.blocks=S,t.targetMode=O?"skill":"prompt",t.targetMode==="skill"){const f=B(s.skillName)||d;t.skillName=J(f).slice(0,Z),t.skillDescription=u(B(s.skillDescription)||y).slice(0,me),t.skillTagline=B(s.skillTagline),t.skillPriceUsd=fe(s.skillPriceUsd),t.skillTags=B(s.skillTags),t.skillDemoRequest=B(s.skillDemoRequest),t.skillDemoResult=B(s.skillDemoResult)}return t.updatedAt=Date.now(),t}}catch{}const l=i.match(/^---\n([\s\S]*?)\n---(?:\n([\s\S]*))?$/);if(l){const k=We(l[1]),s=(l[2]??"").trim(),d=Ce(s,n);return t.targetMode="skill",t.skillName=k.name?J(k.name).slice(0,Z):J(d.headingTitle||r||"custom-skill"),t.skillDescription=ye(u(k.description),me),k.compatibility&&(t.skillCompatibility=k.compatibility),t.title=d.headingTitle||u(k.name)||r||ce(s)||(n==="id"?"Agent Skill Impor":"Imported Agent Skill"),t.description=t.skillDescription,t.blocks=d.blocks,t.scratchpad=u(d.scratchpadParts.join(`

`)),t.fewShotInput=d.fewShotInput,t.fewShotOutput=d.fewShotOutput,d.demoRequest&&(t.skillDemoRequest=d.demoRequest),d.demoResult&&(t.skillDemoResult=d.demoResult),t.updatedAt=Date.now(),t}const o=ge(i,e),c=(i.match(/^##\s+.+$/gm)||[]).length>=2;if(o==="skill"||c){const k=Ce(i,n);if(k.blocks.length>0||k.scratchpadParts.length>0)return t.targetMode=o,t.title=k.headingTitle||r||ce(i)||(n==="id"?"Prompt Impor":"Imported Prompt"),t.blocks=k.blocks,t.scratchpad=u(k.scratchpadParts.join(`

`)),t.fewShotInput=k.fewShotInput,t.fewShotOutput=k.fewShotOutput,o==="skill"&&(t.skillName=J(t.title).slice(0,Z)),t.updatedAt=Date.now(),t}const g=i.split(/\n{2,}/).map(k=>k.trim()).filter(Boolean),m=[],p=[];let h=0;for(const k of g){const s=k.match(/^([A-Za-z0-9 &/_()-]{2,40}):\s*([\s\S]+)$/),d=s?s[1].trim():"",y=/^https?$/i.test(d)||s&&s[2].startsWith("//");if(s&&!y){h+=1;const S=u(d),b=u(s[2].trim()),w=ke(S);w==="scratchpad"?p.push(b):w==="few_shot_input"?t.fewShotInput=t.fewShotInput||b:w==="few_shot_output"?t.fewShotOutput=t.fewShotOutput||b:m.push(Y(w,n,S,b))}else p.push(u(k))}return t.targetMode=o,t.title=r||ce(i)||(n==="id"?"Prompt Impor":"Imported Prompt"),h>=2?(t.blocks=m,t.scratchpad=u(p.join(`

`))):(t.blocks=[],t.scratchpad=u(i)),t.targetMode==="skill"&&(t.skillName=J(t.title).slice(0,Z)),t.updatedAt=Date.now(),t},Ze={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1},re={gemini:{id:"gemini",name:"Google Gemini (AI Studio)",shortLabel:"Gemini",badge:"GOOGLE",defaultBaseUrl:"https://generativelanguage.googleapis.com",defaultModel:"gemini-4-carbon",models:[{id:"gemini-4-carbon",label:"Gemini 4 Carbon",description:"Flagship frontier penalaran mendalam, rekayasa software kompleks & arsitektur sistem (1M+ konteks, Rekomendasi Utama)"},{id:"gemini-4-argon",label:"Gemini 4 Argon",description:"Model frontier penalaran cepat, tajam & efisiensi tinggi untuk alur kerja produksi"},{id:"gemini-4-hydrogen",label:"Gemini 4 Hydrogen",description:"Workhorse agentic & coding harian berefisiensi tinggi, konteks 1M token"},{id:"gemini-3.8-flash",label:"Gemini 3.8 Flash",description:"Model multimodal produksi latensi ultra-rendah dengan thinking budget adaptif"},{id:"gemini-3.7-flash",label:"Gemini 3.7 Flash",description:"Model multimodal cepat untuk pemrosesan volume tinggi"},{id:"gemini-3.5-flash-lite",label:"Gemini 3.5 Flash-Lite",description:"Model ultra-ringan, super cepat & paling hemat kuota token"}],requiresApiKey:!0,docUrl:"https://aistudio.google.com/app/apikey",placeholderKey:"AIzaSy...",icon:"✨"},openai:{id:"openai",name:"OpenAI (GPT-6 & Reasoning)",shortLabel:"OpenAI",badge:"OPENAI",defaultBaseUrl:"https://api.openai.com/v1",defaultModel:"gpt-6.1-sol",models:[{id:"gpt-6.1-sol",label:"GPT-6.1 Sol",description:"Workhorse optimal menyeimbangkan kecerdasan frontier dan efisiensi biaya (Rekomendasi Utama)"},{id:"gpt-6-astra",label:"GPT-6 Astra",description:"Flagship kecerdasan tertinggi OpenAI untuk coding berat, arsitektur & penalaran ilmiah"},{id:"gpt-6.1-terra",label:"GPT-6.1 Terra",description:"Spesialis penalaran visual, audit dokumen & analisis mendalam"},{id:"gpt-6.1-luna",label:"GPT-6.1 Luna",description:"Latensi sub-detik untuk pemrosesan volume tinggi & otomasi harian"},{id:"gpt-5.2-codex",label:"GPT-5.2 Codex",description:"Model spesialis rekayasa perangkat lunak & refactoring kode kompleks"},{id:"gpt-5",label:"GPT-5",description:"Flagship enterprise stabil generasi GPT-5"}],requiresApiKey:!0,docUrl:"https://platform.openai.com/api-keys",placeholderKey:"sk-proj-...",icon:"🟢"},anthropic:{id:"anthropic",name:"Anthropic (Claude 5.5 & Fable 5.2)",shortLabel:"Claude",badge:"ANTHROPIC",defaultBaseUrl:"https://api.anthropic.com/v1",defaultModel:"claude-sonnet-5-5",models:[{id:"claude-sonnet-5-5",label:"Claude Sonnet 5.5",description:"Flagship keseimbangan kecepatan, coding & penulisan terstruktur (Rekomendasi Utama)"},{id:"claude-opus-5-5",label:"Claude Opus 5.5",description:"Model kelas proyek kompleks, riset mendalam & long-running agentic coding"},{id:"claude-fable-5-2",label:"Claude Fable 5.2",description:"Model penalaran puncak untuk orkestrator sistem & tugas agen jangka panjang"},{id:"claude-haiku-5-5",label:"Claude Haiku 5.5",description:"Eksekusi ultra-cepat & paling ekonomis untuk subagent dan volume tinggi"},{id:"claude-sonnet-4-5",label:"Claude Sonnet 4.5",description:"Generasi 4.5 stabil untuk kompatibilitas router legacy"}],requiresApiKey:!0,docUrl:"https://console.anthropic.com/settings/keys",placeholderKey:"sk-ant-...",icon:"🟧"},deepseek:{id:"deepseek",name:"DeepSeek AI (V4 & R1)",shortLabel:"DeepSeek",badge:"DEEPSEEK",defaultBaseUrl:"https://api.deepseek.com/v1",defaultModel:"deepseek-chat",models:[{id:"deepseek-chat",label:"DeepSeek-Chat (V3 / V4)",description:"Endpoint chat standar teruji untuk tugas umum, coding & penulisan (Rekomendasi Utama Produksi)"},{id:"deepseek-reasoner",label:"DeepSeek-R1 (Reasoner)",description:"Penalaran Chain of Thought 671B untuk logika murni & matematika"},{id:"deepseek-v4-pro",label:"DeepSeek-V4 Pro",description:"Flagship V4 Pro 1M konteks untuk agentic workflow & coding berat (Preset Generasi 4)"},{id:"deepseek-flash",label:"DeepSeek-V4.1 Flash",description:"Model V4.1 Flash super cepat dan sangat hemat biaya"}],requiresApiKey:!0,docUrl:"https://platform.deepseek.com/api_keys",placeholderKey:"sk-...",icon:"🔵"},xai:{id:"xai",name:"xAI (Grok 4.7 & Reasoning)",shortLabel:"xAI Grok",badge:"XAI",defaultBaseUrl:"https://api.x.ai/v1",defaultModel:"grok-4.7",models:[{id:"grok-4.7",label:"Grok 4.7",description:"Flagship xAI 500K+ konteks untuk reasoning, coding, agentic & visi (Rekomendasi)"},{id:"grok-420-reasoning",label:"Grok 420 Reasoning",description:"Model penalaran multi-langkah untuk logika, matematika & audit kode"},{id:"grok-4.6",label:"Grok 4.6",description:"Generasi 4.6 stabil untuk tugas kompleks"},{id:"grok-4.1-fast",label:"Grok 4.1 Fast",description:"Model cepat dan hemat biaya untuk pemrosesan volume tinggi"}],requiresApiKey:!0,docUrl:"https://console.x.ai/",placeholderKey:"xai-...",icon:"🖤"},mistral:{id:"mistral",name:"Mistral AI (La Plateforme)",shortLabel:"Mistral",badge:"MISTRAL",defaultBaseUrl:"https://api.mistral.ai/v1",defaultModel:"mistral-large-latest",models:[{id:"mistral-large-latest",label:"Mistral Large 4 (Latest)",description:"Flagship multimodal 1M konteks untuk penalaran kompleks & tool-use (Rekomendasi)"},{id:"mistral-small-latest",label:"Mistral Small 4 (Latest)",description:"Model hybrid efisien menyatukan instruct, reasoning & coding"},{id:"codestral-latest",label:"Codestral (Latest)",description:"Model spesialis sintesis kode dan refactoring"},{id:"ministral-3b-latest",label:"Ministral 3B (Latest)",description:"Model ringan latensi ultra rendah untuk tugas terarah"}],requiresApiKey:!0,docUrl:"https://console.mistral.ai/api-keys/",placeholderKey:"mis_...",icon:"🌪️"},groq:{id:"groq",name:"Groq Cloud (LPU Ultra-Fast Inference)",shortLabel:"Groq",badge:"LPU",defaultBaseUrl:"https://api.groq.com/openai/v1",defaultModel:"llama-3.3-70b-versatile",models:[{id:"llama-3.3-70b-versatile",label:"Llama 3.3 70B Versatile",description:"Model 70B stabil 300+ token/detik (Rekomendasi Utama Produksi)"},{id:"llama-3.1-8b-instant",label:"Llama 3.1 8B Instant",description:"Respons instan sub-detik untuk tugas ringan"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"Llama 4 Maverick (128E)",description:"Flagship Llama 4 MoE di Groq LPU dengan kecepatan ekstrem"},{id:"meta-llama/llama-4-scout-17b-16e-instruct",label:"Llama 4 Scout (16E)",description:"Llama 4 Scout cepat dengan dukungan konteks panjang"},{id:"qwen/qwen3.8-27b",label:"Qwen 3.8 27B",description:"Model multimodal & penalaran cepat generasi Qwen 3.8"},{id:"openai/gpt-oss-20b",label:"OpenAI GPT-OSS 20B",description:"Model open-weights OpenAI berlatensi sub-detik"}],requiresApiKey:!0,docUrl:"https://console.groq.com/keys",placeholderKey:"gsk_...",icon:"⚡"},openrouter:{id:"openrouter",name:"OpenRouter (Universal Model Aggregator)",shortLabel:"OpenRouter",badge:"ROUTER",defaultBaseUrl:"https://openrouter.ai/api/v1",defaultModel:"anthropic/claude-sonnet-5.5",models:[{id:"anthropic/claude-sonnet-5.5",label:"Claude Sonnet 5.5",description:"Flagship Anthropic 1M konteks untuk coding & penulisan (Rekomendasi Utama)"},{id:"anthropic/claude-opus-5.5",label:"Claude Opus 5.5",description:"Flagship Anthropic untuk proyek kompleks & riset mendalam"},{id:"anthropic/claude-fable-5.2",label:"Claude Fable 5.2",description:"Model penalaran puncak Anthropic untuk alur kerja jangka panjang"},{id:"google/gemini-4-carbon",label:"Gemini 4 Carbon",description:"Flagship Google Gemini 4 penalaran mendalam & rekayasa sistem"},{id:"google/gemini-4-argon",label:"Gemini 4 Argon",description:"Frontier reasoning cepat & efisiensi tinggi Google"},{id:"google/gemini-4-hydrogen",label:"Gemini 4 Hydrogen",description:"Workhorse agentic & coding harian Google"},{id:"google/gemini-3.8-flash",label:"Gemini 3.8 Flash",description:"Workhorse multimodal cepat generasi 3.8"},{id:"openai/gpt-6-astra",label:"OpenAI GPT-6 Astra",description:"Flagship tertinggi OpenAI GPT-6 untuk penalaran berat"},{id:"openai/gpt-6.1-sol",label:"OpenAI GPT-6.1 Sol",description:"GPT-6 keseimbangan kecerdasan dan efisiensi biaya"},{id:"deepseek/deepseek-v4-pro",label:"DeepSeek V4 Pro",description:"Flagship open-frontier DeepSeek 1M konteks"},{id:"deepseek/deepseek-r1",label:"DeepSeek R1",description:"Reasoning 671B Chain of Thought"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"Llama 4 Maverick",description:"Flagship open-weights MoE Meta generasi 4"},{id:"x-ai/grok-4.7",label:"xAI Grok 4.7",description:"Flagship xAI 500K+ konteks"}],requiresApiKey:!0,docUrl:"https://openrouter.ai/keys",placeholderKey:"sk-or-v1-...",icon:"🟣"},perplexity:{id:"perplexity",name:"Perplexity AI (Live Web Search & Reasoning)",shortLabel:"Perplexity",badge:"SEARCH",defaultBaseUrl:"https://api.perplexity.ai",defaultModel:"sonar-reasoning-pro",models:[{id:"sonar-reasoning-pro",label:"Sonar Reasoning Pro",description:"Penalaran multi-langkah dengan sitasi web real-time (Rekomendasi)"},{id:"sonar-deep-research",label:"Sonar Deep Research",description:"Riset agen komprehensif lintas banyak sumber web"},{id:"sonar-pro",label:"Sonar Pro",description:"Pencarian internet mendalam multi-sumber"},{id:"sonar",label:"Sonar",description:"Pencarian web ringan dan cepat"}],requiresApiKey:!0,docUrl:"https://www.perplexity.ai/settings/api",placeholderKey:"pplx-...",icon:"🌐"},together:{id:"together",name:"Together AI (Open-Source Frontier)",shortLabel:"Together AI",badge:"CLOUD",defaultBaseUrl:"https://api.together.xyz/v1",defaultModel:"meta-llama/Llama-3.3-70B-Instruct-Turbo",models:[{id:"meta-llama/Llama-3.3-70B-Instruct-Turbo",label:"Llama 3.3 70B Turbo",description:"Model 70B berlatensi sangat cepat & teruji (Rekomendasi)"},{id:"deepseek-ai/DeepSeek-R1",label:"DeepSeek R1 (Full 671B)",description:"Model penalaran rantai pemikiran DeepSeek R1"},{id:"deepseek-ai/DeepSeek-V3",label:"DeepSeek V3",description:"Model general chat 671B efisien"},{id:"deepseek-ai/DeepSeek-V4-Pro",label:"DeepSeek V4 Pro",description:"Flagship DeepSeek V4 Pro serverless (Preset)"},{id:"Qwen/Qwen2.5-72B-Instruct-Turbo",label:"Qwen 2.5 72B Turbo",description:"Model penalaran & multilingual kuat dari Qwen"}],requiresApiKey:!0,docUrl:"https://api.together.ai/settings/api-keys",placeholderKey:"tog-...",icon:"🤝"},cerebras:{id:"cerebras",name:"Cerebras Cloud (World-Record WSE Speed)",shortLabel:"Cerebras",badge:"WSE",defaultBaseUrl:"https://api.cerebras.ai/v1",defaultModel:"llama-3.3-70b",models:[{id:"llama-3.3-70b",label:"Llama 3.3 70B (2000+ tps)",description:"Model 70B dengan kecepatan instan wafer-scale engine (Rekomendasi)"},{id:"llama3.1-8b",label:"Llama 3.1 8B",description:"Eksekusi ultra instan"},{id:"gpt-oss-120b",label:"GPT-OSS 120B (~3000 tps)",description:"Model open-weights 120B berkecepatan ~3.000 token/detik"},{id:"qwen-3.8-27b",label:"Qwen 3.8 27B (~1850 tps)",description:"Qwen 3.8 berkecepatan ~1.850 token/detik"}],requiresApiKey:!0,docUrl:"https://cloud.cerebras.ai/",placeholderKey:"csk-...",icon:"🚀"},sambanova:{id:"sambanova",name:"SambaNova Cloud (Full Precision RDU)",shortLabel:"SambaNova",badge:"RDU",defaultBaseUrl:"https://api.sambanova.ai/v1",defaultModel:"Meta-Llama-3.3-70B-Instruct",models:[{id:"Meta-Llama-3.3-70B-Instruct",label:"Llama 3.3 70B (Full Precision)",description:"Kualitas FP16 murni berkecepatan tinggi di SambaNova RDU (Rekomendasi)"},{id:"DeepSeek-R1",label:"DeepSeek R1 (Full 671B)",description:"Penalaran penuh 671B di atas cluster SambaNova RDU"},{id:"DeepSeek-V3",label:"DeepSeek V3",description:"Model chat general-purpose throughput tinggi"},{id:"gemma-4-31B-it",label:"Gemma 4 31B Instruct",description:"Model terbuka terbaru Google Gemma 4 presisi tinggi"}],requiresApiKey:!0,docUrl:"https://cloud.sambanova.ai/",placeholderKey:"samba-...",icon:"⚡"},cohere:{id:"cohere",name:"Cohere (Command A Enterprise)",shortLabel:"Cohere",badge:"COMMAND",defaultBaseUrl:"https://api.cohere.ai/compatibility/v1",defaultModel:"command-r-plus-08-2024",models:[{id:"command-r-plus-08-2024",label:"Command R+ (Enterprise Live)",description:"Model enterprise stabil untuk RAG, penalaran bisnis & tool-use (Rekomendasi)"},{id:"command-r7b-12-2024",label:"Command R 7B",description:"Versi ringan berkecepatan tinggi"},{id:"command-a-plus-05-2026",label:"Command A+ (MoE Multimodal)",description:"Flagship enterprise MoE generasi Command A (Preset Next-Gen)"},{id:"command-a-reasoning-08-2025",label:"Command A Reasoning",description:"Varian penalaran mendalam untuk analisis bisnis kompleks"},{id:"command-a-03-2025",label:"Command A (Base)",description:"Model utama generasi Command A untuk instruksi terstruktur"}],requiresApiKey:!0,docUrl:"https://dashboard.cohere.com/api-keys",placeholderKey:"coh-...",icon:"🏛️"},huggingface:{id:"huggingface",name:"Hugging Face (Inference Providers Router)",shortLabel:"Hugging Face",badge:"HF",defaultBaseUrl:"https://router.huggingface.co/v1",defaultModel:"meta-llama/Llama-3.3-70B-Instruct",models:[{id:"meta-llama/Llama-3.3-70B-Instruct",label:"Llama 3.3 70B Instruct",description:"Open-weights stabil Meta di HF Router (Rekomendasi)"},{id:"deepseek-ai/DeepSeek-R1",label:"DeepSeek R1",description:"Model penalaran frontier di HF Router"},{id:"deepseek-ai/DeepSeek-V4.1-Flash:fastest",label:"DeepSeek V4.1 Flash (:fastest)",description:"Auto-routed tercepat melalui HF Inference Providers"},{id:"Qwen/Qwen3-Coder-30B-A3B-Instruct",label:"Qwen3 Coder 30B A3B",description:"Spesialis coding MoE efisien di HF Router"}],requiresApiKey:!0,docUrl:"https://huggingface.co/settings/tokens",placeholderKey:"hf_...",icon:"🤗"},ollama:{id:"ollama",name:"Ollama (Local Offline AI)",shortLabel:"Ollama",badge:"LOCAL",defaultBaseUrl:"http://localhost:11434/v1",defaultModel:"qwen3.8:27b",models:[{id:"qwen3.8:27b",label:"Qwen 3.8 (27B)",description:"Workhorse penalaran & chat lokal terbaik untuk 24GB VRAM (Rekomendasi)"},{id:"qwen3-coder:30b",label:"Qwen3 Coder (30B MoE)",description:"Standar emas coding lokal & RAG cepat (24GB VRAM)"},{id:"gemma4:12b",label:"Gemma 4 (12B)",description:"Model multimodal Google Gemma 4 optimal di 16GB RAM/VRAM"},{id:"gemma4:31b",label:"Gemma 4 (31B)",description:"Model workstation presisi tinggi untuk 32-48GB VRAM"},{id:"llama4:16x17b",label:"Llama 4 (Scout MoE)",description:"Model multimodal & konteks masif Meta Llama 4 lokal"},{id:"qwen3.5:9b",label:"Qwen 3.5 (9B)",description:"Daily driver ringan dan tajam untuk 16GB RAM/VRAM"},{id:"deepseek-r1:14b",label:"DeepSeek-R1 (14B)",description:"Penalaran R1 optimal di 16GB RAM/VRAM"},{id:"deepseek-r1:8b",label:"DeepSeek-R1 (8B)",description:"Penalaran R1 ringkas untuk 8GB VRAM"},{id:"deepseek-r1:latest",label:"DeepSeek-R1 (Latest)",description:"Tag default resmi DeepSeek R1 di Ollama"}],requiresApiKey:!1,docUrl:"https://ollama.com/",placeholderKey:"Opsional (tidak wajib untuk Ollama)",icon:"🦙"},internai:{id:"internai",name:"Intern-Discovery / 书生·端砚 (Shanghai AI Lab)",shortLabel:"Intern-AI",badge:"INTERN-AI",defaultBaseUrl:"https://discovery-api.intern-ai.org.cn/v1",defaultModel:"intern-s2",models:[{id:"Agents-A1",label:"Agents-A1 (Multimodal 256K · Hot)",description:"Shanghai AI Lab Agents-A1 multimodal (Input 4 / Output 16 credits)"},{id:"Atria-Dawn",label:"Atria-Dawn (LLM 512K · Hot)",description:"Shanghai AI Lab Atria-Dawn 512K long-context LLM (Input 80 / Output 280 credits)"},{id:"Sage-A1.5",label:"Sage-A1.5 (Multimodal 512K · Hot)",description:"Shanghai AI Lab Sage-A1.5 multimodal (Input 4 / Output 16 credits)"},{id:"Sage-A1.5-Taiyi",label:"Sage-A1.5-Taiyi (Agent 512K)",description:"Shanghai AI Lab Sage-A1.5-Taiyi specialized reasoning agent (Input 32 / Output 128 credits)"},{id:"Sage-S2.1-Flash",label:"Sage-S2.1-Flash (Multimodal 512K · New)",description:"Shanghai AI Lab Sage-S2.1-Flash high-speed multimodal (Input 8 / Output 28 credits)"},{id:"deepseek-v4.1-flash-1017",label:"DeepSeek-V4.1-Flash-1017 (Multimodal 1M)",description:"DeepSeek V4.1 Flash 1M context via Intern-Discovery"},{id:"glm-5.3",label:"GLM-5.3 (LLM 1M)",description:"GLM-5.3 1M context via Intern-Discovery"},{id:"intern-decision-4b",label:"书生·Decision-4B (Decision 8K)",description:"Shanghai AI Lab Decision-4B model (SystemOne protocol)"},{id:"intern-s2",label:"书生·S2 (Multimodal 256K · Flagship)",description:"Shanghai AI Lab Intern-S2 flagship multimodal (Input 30 / Output 180 credits)"},{id:"kimi-k3.1-pro",label:"Kimi-K3.1-Pro (Multimodal 1M · New)",description:"Moonshot Kimi K3.1 Pro 1M context via Intern-Discovery"},{id:"qwen3.8-27b",label:"Qwen3.8-27B (Multimodal 256K)",description:"Qwen 3.8 27B multimodal via Intern-Discovery"}],requiresApiKey:!0,docUrl:"https://discovery.intern-ai.org.cn/",placeholderKey:"API key dari https://discovery.intern-ai.org.cn/",icon:"🧪"},custom:{id:"custom",name:"OpenAI-Compatible / Kustom (LM Studio, vLLM, LiteLLM, Cloudflare AI)",shortLabel:"OpenAI-Comp",badge:"OPENAI-COMP",defaultBaseUrl:"http://localhost:1234/v1",defaultModel:"local-model",models:[{id:"local-model",label:"local-model",description:"Model aktif di LM Studio / vLLM / Local Host"},{id:"intern-s2",label:"intern-s2",description:"Intern-Discovery Flagship Multimodal (Shanghai AI Lab)"},{id:"Sage-S2.1-Flash",label:"Sage-S2.1-Flash",description:"Intern-Discovery Sage-S2.1-Flash Multimodal 512K (New)"},{id:"Agents-A1",label:"Agents-A1",description:"Intern-Discovery Agents-A1 Multimodal 256K (Hot)"},{id:"Atria-Dawn",label:"Atria-Dawn",description:"Intern-Discovery Atria-Dawn LLM 512K (Hot)"},{id:"Sage-A1.5",label:"Sage-A1.5",description:"Intern-Discovery Sage-A1.5 Multimodal 512K (Hot)"},{id:"Sage-A1.5-Taiyi",label:"Sage-A1.5-Taiyi",description:"Intern-Discovery Sage-A1.5-Taiyi Agent 512K"},{id:"deepseek-v4.1-flash-1017",label:"deepseek-v4.1-flash-1017",description:"DeepSeek V4.1 Flash 1M via Intern-Discovery"},{id:"glm-5.3",label:"glm-5.3",description:"GLM-5.3 1M via Intern-Discovery"},{id:"intern-decision-4b",label:"intern-decision-4b",description:"Shanghai AI Lab Decision-4B (SystemOne)"},{id:"kimi-k3.1-pro",label:"kimi-k3.1-pro",description:"Moonshot Kimi K3.1 Pro 1M via Intern-Discovery"},{id:"qwen3.8-27b",label:"qwen3.8-27b",description:"Qwen 3.8 27B via Intern-Discovery"},{id:"gemini-4-carbon",label:"gemini-4-carbon",description:"Google Gemini 4 Carbon (Frontier Reasoning Flagship)"},{id:"gemini-4-argon",label:"gemini-4-argon",description:"Google Gemini 4 Argon (Optimized Frontier Intelligence)"},{id:"gemini-4-hydrogen",label:"gemini-4-hydrogen",description:"Google Gemini 4 Hydrogen (Agentic & Daily Coding)"},{id:"gemini-3.8-flash",label:"gemini-3.8-flash",description:"Google Gemini 3.8 Flash (Multimodal Cepat Produksi)"},{id:"google/gemini-4-carbon",label:"google/gemini-4-carbon",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"google/gemini-4-argon",label:"google/gemini-4-argon",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"google/gemini-4-hydrogen",label:"google/gemini-4-hydrogen",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"gpt-6-astra",label:"gpt-6-astra",description:"OpenAI GPT-6 Astra Flagship"},{id:"gpt-6.1-sol",label:"gpt-6.1-sol",description:"OpenAI GPT-6.1 Sol Workhorse"},{id:"claude-sonnet-5-5",label:"claude-sonnet-5-5",description:"Anthropic Claude Sonnet 5.5"},{id:"claude-opus-5-5",label:"claude-opus-5-5",description:"Anthropic Claude Opus 5.5"},{id:"claude-fable-5-2",label:"claude-fable-5-2",description:"Anthropic Claude Fable 5.2 Reasoning"},{id:"deepseek-v4-pro",label:"deepseek-v4-pro",description:"DeepSeek V4 Pro 1M Konteks"},{id:"deepseek-reasoner",label:"deepseek-reasoner",description:"DeepSeek R1 CoT Reasoner via Proxy"},{id:"deepseek-chat",label:"deepseek-chat",description:"DeepSeek Chat (V4 / V3 Alias)"},{id:"grok-4.7",label:"grok-4.7",description:"xAI Grok 4.7 Flagship via Proxy"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"llama-4-maverick",description:"Meta Llama 4 Maverick MoE"},{id:"qwen3.8:27b",label:"qwen3.8:27b",description:"Qwen 3.8 27B via Local / Proxy"},{id:"default",label:"default",description:"Model default fallback server"}],requiresApiKey:!1,docUrl:"https://platform.openai.com/docs/api-reference",placeholderKey:"API key kustom Anda (jika diperlukan)",icon:"⚙️"}},Ae="promptmatrix_ai_unified_settings",we="promptmatrix_gemini_api_key",de=()=>({provider:"gemini",apiKey:"",baseUrl:re.gemini.defaultBaseUrl,model:re.gemini.defaultModel}),De=()=>{try{const a=localStorage.getItem(Ae);if(a){const n=JSON.parse(a);return{...de(),...n}}const e=localStorage.getItem(we);if(e&&e.trim())return{...de(),apiKey:e.trim()}}catch(a){console.warn("Error reading AI settings from storage:",a)}return de()},ht=a=>{try{localStorage.setItem(Ae,JSON.stringify(a)),a.provider==="gemini"&&localStorage.setItem(we,a.apiKey)}catch(e){console.error("Error saving AI settings:",e)}},bt=()=>{try{localStorage.removeItem(Ae),localStorage.removeItem(we)}catch(a){console.error("Error removing AI settings:",a)}},ft=()=>{const a=De();return(re[a.provider]||re.custom).requiresApiKey?!!(a.apiKey&&a.apiKey.trim().length>0):!0},j=async(a,e="",n)=>{const t=n||De(),{provider:i,apiKey:r,baseUrl:l,model:o}=t;return i==="gemini"?Xe(a,e,r,o,l):i==="anthropic"&&(!l||l.includes("anthropic.com"))?tt(a,e,r,l,o):et(a,e,r,l,o)},Xe=async(a,e,n,t,i)=>{var k,s,d,y,S,b;if(!n)throw new Error("API Key Google Gemini belum diisi. Silakan atur di menu Pengaturan AI ⚙️.");let r=(i||"https://generativelanguage.googleapis.com").replace(/\/+$/,"");r=r.replace(/\/models$/,"").replace(/\/chat\/completions$/,"");const l=r.endsWith("/v1beta")?r:`${r}/v1beta`,o={contents:[{role:"user",parts:[{text:a}]}],generationConfig:{temperature:.7,maxOutputTokens:2048}};e&&(o.systemInstruction={parts:[{text:e}]});const c=async w=>{const O=`${l}/models/${w}:generateContent?key=${encodeURIComponent(n.trim())}`;return fetch(O,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})};let g=t||"gemini-4-carbon",m=await c(g);if(m.status===404){const w=["gemini-4-argon","gemini-4-hydrogen","gemini-3.8-flash"].filter(O=>O!==g);for(const O of w){const f=await c(O);if(f.ok){m=f,g=O;break}}}if(!m.ok){const w=await m.json().catch(()=>({})),O=((k=w==null?void 0:w.error)==null?void 0:k.message)||m.statusText;let f="";throw m.status===404&&(f=" (Tips: Pastikan model aktif di Google AI Studio atau pilih gemini-4-carbon / gemini-4-argon / gemini-4-hydrogen)"),new Error(`Google Gemini Error (${m.status}): ${O}${f}`)}const p=await m.json(),h=(b=(S=(y=(d=(s=p==null?void 0:p.candidates)==null?void 0:s[0])==null?void 0:d.content)==null?void 0:y.parts)==null?void 0:S[0])==null?void 0:b.text;if(!h)throw new Error("Google Gemini tidak menghasilkan respons teks.");return h.trim()},et=async(a,e,n,t,i)=>{var h,k,s,d,y,S,b,w,O,f,$,L,T,C,A,N;let r=(t||"https://api.openai.com/v1").replace(/\/+$/,""),l=r.endsWith("/chat/completions")?r:`${r}/chat/completions`;const o={"Content-Type":"application/json",Accept:"application/json, text/event-stream"};n&&n.trim()&&(o.Authorization=`Bearer ${n.trim()}`),r.includes("openrouter.ai")&&(o["HTTP-Referer"]="https://github.com/sisigitadi/promptmatrix",o["X-Title"]="PromptMatrix");const c=[];e&&c.push({role:"system",content:e}),c.push({role:"user",content:a});const m=await fetch(l,{method:"POST",headers:o,body:JSON.stringify({model:i||"gpt-6.1-sol",messages:c,temperature:.7,stream:!1})}),p=await m.text();if(!m.ok){let v="";try{const D=JSON.parse(p);v=((h=D==null?void 0:D.error)==null?void 0:h.message)||(D==null?void 0:D.message)||""}catch{v=p}let P="";throw m.status===404&&i.includes("gemini")&&(P=' (Tips: Untuk router kustom / OpenAI-compatible, pastikan model terdaftar atau coba gunakan prefix seperti "google/gemini-4-carbon" atau "gemini-4-argon")'),new Error(`AI Provider Error (${m.status}): ${v||m.statusText}${P}`)}if(p.trim().startsWith("data:")){const v=p.split(`
`);let P="";for(const D of v){const _=D.trim();if(!(!_||_==="data: [DONE]"||_==="[DONE]")&&_.startsWith("data:")){const I=_.replace(/^data:\s*/,"");try{const E=JSON.parse(I),G=((d=(s=(k=E==null?void 0:E.choices)==null?void 0:k[0])==null?void 0:s.delta)==null?void 0:d.content)||((b=(S=(y=E==null?void 0:E.choices)==null?void 0:y[0])==null?void 0:S.message)==null?void 0:b.content)||((O=(w=E==null?void 0:E.choices)==null?void 0:w[0])==null?void 0:O.text)||"";P+=G}catch{}}}if(P.trim())return P.trim()}try{const v=JSON.parse(p),P=((L=($=(f=v==null?void 0:v.choices)==null?void 0:f[0])==null?void 0:$.message)==null?void 0:L.content)||((C=(T=v==null?void 0:v.choices)==null?void 0:T[0])==null?void 0:C.text)||((N=(A=v==null?void 0:v.content)==null?void 0:A[0])==null?void 0:N.text);if(P)return P.trim()}catch(v){console.warn("Direct JSON parse failed, trying chunk extraction:",v)}if(p&&!p.includes('{"error":'))return p.trim();throw new Error("Model AI tidak mengembalikan konten teks yang valid.")},tt=async(a,e,n,t,i)=>{var p,h,k;if(!n)throw new Error("API Key Anthropic Claude belum diisi.");const r=(t||"https://api.anthropic.com/v1").replace(/\/+$/,""),l=r.endsWith("/messages")?r:`${r}/messages`,o={"Content-Type":"application/json","x-api-key":n.trim(),"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},c={model:i||"claude-sonnet-5-5",max_tokens:2048,messages:[{role:"user",content:a}]};e&&(c.system=e);const g=await fetch(l,{method:"POST",headers:o,body:JSON.stringify(c)}),m=await g.text();if(!g.ok){let s="";try{const d=JSON.parse(m);s=((p=d==null?void 0:d.error)==null?void 0:p.message)||g.statusText}catch{s=m}throw new Error(`Anthropic Error (${g.status}): ${s}`)}try{const s=JSON.parse(m),d=(k=(h=s==null?void 0:s.content)==null?void 0:h[0])==null?void 0:k.text;if(d)return d.trim()}catch{}return m.trim()},yt=async(a,e,n)=>{var c;let t=(a||"https://api.openai.com/v1").replace(/\/+$/,"");if(t=t.replace(/\/chat\/completions$/,""),t.includes("intern-ai.org.cn")||n==="internai")return["Agents-A1","Atria-Dawn","Sage-A1.5","Sage-A1.5-Taiyi","Sage-S2.1-Flash","deepseek-v4.1-flash-1017","glm-5.3","intern-decision-4b","intern-s2","kimi-k3.1-pro","qwen3.8-27b"];const i=n==="gemini"||t.includes("generativelanguage.googleapis.com"),r=n==="anthropic"||t.includes("api.anthropic.com");let l=t.endsWith("/models")?t:`${t}/models`;const o={"Content-Type":"application/json"};if(i){if(!e||!e.trim())throw new Error("API Key Google Gemini diperlukan untuk mengambil daftar model.");l=`${t.endsWith("/v1beta")?t:`${t}/v1beta`}/models?key=${encodeURIComponent(e.trim())}`}else if(r){if(!e||!e.trim())throw new Error("API Key Anthropic diperlukan untuk mengambil daftar model.");o["x-api-key"]=e.trim(),o["anthropic-version"]="2023-06-01",o["anthropic-dangerous-direct-browser-access"]="true"}else e&&e.trim()&&(o.Authorization=`Bearer ${e.trim()}`);try{const g=await fetch(l,{method:"GET",headers:o}),m=await g.text();if(!g.ok){let h="";try{const k=JSON.parse(m);h=((c=k==null?void 0:k.error)==null?void 0:c.message)||(k==null?void 0:k.message)||""}catch{h=m}throw new Error(`Gagal mengambil model (${g.status}): ${h||g.statusText}`)}const p=JSON.parse(m);if(!Array.isArray(p)&&Array.isArray(p==null?void 0:p.data))return p.data.map(h=>h.id||h.name||"").filter(Boolean);if(!Array.isArray(p)&&Array.isArray(p==null?void 0:p.models))return p.models.map(h=>{const k=h.id||h.name||"";return i?k.replace(/^models\//,""):k}).filter(Boolean);if(Array.isArray(p))return p.map(h=>typeof h=="string"?h:h.id||h.name||"").filter(Boolean)}catch(g){if(t.includes("intern-ai.org.cn"))return["Agents-A1","Atria-Dawn","Sage-A1.5","Sage-A1.5-Taiyi","Sage-S2.1-Flash","deepseek-v4.1-flash-1017","glm-5.3","intern-decision-4b","intern-s2","kimi-k3.1-pro","qwen3.8-27b"];const m=g instanceof Error?g.message:String(g);throw m.includes("Failed to fetch")||m.includes("NetworkError")?new Error("Koneksi ke endpoint /models terhalang kebijakan CORS browser atau server tidak aktif. Silakan pilih model dari daftar terkurasi atau ketik nama model secara manual."):g}return[]},at=a=>{if(!a)return"";let e=a.replace(/\r\n/g,`
`).trim();const n=["Persona AI","AI Persona","Peran AI","Peran","Role","System Role","Konteks & Tujuan","Konteks","Context","Background","Latar Belakang","Tugas Utama","Tugas","Task","Objective","Tujuan","Goal","Variabel Input","Detail Masukan","Input Details","Instruksi Utama","Instruksi Khusus","Instruksi Tambahan","Instruksi","Instructions","Guidelines","Batasan Mutlak","Batasan & Kriteria","Batasan","Constraints","Hard Constraints","Format Output","Format Keluaran","Output Format","Deliverables","Target Audiens","Audiens Target","Target Audience","Audience","Nada Bicara","Gaya Bahasa","Tone of Voice","Tone & Style","Tone","Voice","Attention","Interest","Desire","Action","Hook","Story","Offer","Call to Action","Pencahayaan","Sudut Kamera","Optik","Lighting","Camera","Catatan Khusus","Important Notes","Catatan","Notes"],t=new RegExp(`([^
])
((?:[-*•#>]+\\s*)?(?:${n.join("|")}):)`,"gi");return e=e.replace(t,`$1

$2`),e=e.replace(/([^\n])\n((?:Step|Langkah|\d+\.)\s+[A-Za-z0-9\s()&/._-]{1,30}:)/gi,`$1

$2`),e=e.replace(/([^\n])\n(\[(?:Intro|Verse|Pre-Chorus|Chorus|Bridge|Guitar Solo|Outro|Drop|Hook|Build-up)[^\]]*\])/gi,`$1

$2`),e=e.replace(/\n{3,}/g,`

`),e.trim()},q=a=>{if(!a)return"";let e=a.trim();return e=e.replace(/^```[a-zA-Z0-9_-]*\s*\r?\n?/i,""),e=e.replace(/\r?\n?```\s*$/g,""),e=e.replace(/^(?:Tentu,?\s*)?(?:Berikut\s+(?:adalah\s+)?(?:hasil\s+)?(?:versi\s+)?(?:prompt\s+)?(?:yang\s+)?(?:telah\s+)?(?:disempurnakan|dioptimalkan|ditingkatkan|diperbarui)?[^:\n]*:?\s*[\r\n]+)/i,""),e=e.replace(/^(?:Sure,?\s*)?(?:Here\s+(?:is|are)\s+(?:the\s+)?(?:enhanced|improved|refined|optimized)\s+prompt[^:\n]*:?\s*[\r\n]+)/i,""),e=e.replace(/\*\*([^*]+)\*\*/g,"$1"),e=e.replace(/__([^_]+)__/g,"$1"),(e.startsWith('"')&&e.endsWith('"')||e.startsWith("'")&&e.endsWith("'"))&&(e=e.slice(1,-1).trim()),at(e)},St=async(a,e,n,t="id")=>{const i=t==="id",r=/few-shot|contoh masukan|contoh keluaran|sample input|expected output/i.test(a);let l=i?"Anda adalah seorang ahli prompt engineering handal. Tugas Anda adalah memberikan satu saran isian terbaik dan spesifik untuk kolom formulir yang diminta. Berikan HANYA nilai isian langsung tanpa pembuka, tanpa tanda kutip, tanpa format tebal (**), dan tanpa penjelasan tambahan.":"You are an expert AI prompt engineer. Provide ONLY the direct, high-quality, specific value for the requested form field. Do not include markdown quotes, bold asterisks (**), pleasantries, or preamble.";r&&(l=i?'Anda adalah Master Prompt Engineer spesialis Few-Shot In-Context Learning. Tugas Anda adalah menyusun contoh acuan (few-shot reference exemplar) yang konkret, realistis, dan mencerminkan standar emas. Berikan HANYA teks contoh acuan langsung tanpa kata pengantar ("Berikut adalah..."), tanpa tanda kutip pembungkus, dan tanpa format tebal berlebihan.':"You are a Master Prompt Engineer specializing in Few-Shot In-Context Learning. Provide ONLY the direct, realistic, gold-standard reference exemplar text without introductory preamble or markdown quotes.");let o=i?`Kerangka Kerja: "${e}"
Kolom yang perlu diisi: "${a}"
Konteks isian kolom lain yang sudah ada:
${n||"(Belum ada kolom lain yang diisi)"}

Berikan satu saran isian teks biasa yang kreatif, kontekstual, dan bernilai tinggi:`:`Framework: "${e}"
Target Field: "${a}"
Other Filled Context:
${n||"(No other fields filled yet)"}

Provide one creative, highly specific, and relevant plain-text value for this field:`;r&&(o=i?`Kerangka Kerja: "${e}"
Target Komponen Few-Shot: "${a}"
Konteks parameter framework yang sudah terisi:
${n||"(Gunakan konteks umum kerangka kerja)"}

Susun satu contoh ${a} yang konkret, realistis, dan siap ditiru oleh model AI:`:`Framework: "${e}"
Target Few-Shot Component: "${a}"
Existing Framework Context:
${n||"(Use general framework context)"}

Draft one concrete, realistic ${a} exemplar ready for in-context learning:`);const c=await j(o,l);return q(c)},At=async(a,e,n="id")=>{const t=n==="id",i=t?`Anda adalah Master Prompt Optimizer & AI Prompt Architect Kelas Dunia. Tugas Anda adalah menyempurnakan prompt yang diberikan agar lebih tajam, kaya konteks terarah, minim ambiguitas, dan menghasilkan output maksimal pada LLM modern.

ATURAN STRUKTUR & KETERBACAAN (MUTLAK):
1. Kembalikan HANYA teks prompt hasil perbaikan dalam bentuk teks polos (plain text) tanpa kata pengantar ("Berikut adalah...") dan tanpa penutup.
2. DILARANG KERAS menggunakan blok kode markdown (JANGAN gunakan \`\`\` atau \`\`\`markdown).
3. DILARANG KERAS menggunakan format tebal asterisks (JANGAN gunakan **teks**).
4. WAJIB BERIKAN SPASI KOSONG (DOUBLE NEWLINE / DUA KALI ENTER) ANTAR SETIAP BAGIAN DAN SETIAP PARAGRAF:
   - Pisahkan Persona AI, Konteks, Instruksi/Poin Tindakan, Batasan Keras, dan Format Output dengan 1 baris kosong di antaranya.
   - Jangan pernah menggabungkan beberapa instruksi berbeda ke dalam satu blok teks padat yang rapat.
   - Format setiap seksi dengan judul jelas diikuti titik dua, contoh:

     Persona AI: [deskripsi peran mendalam]

     Konteks & Tujuan: [latar belakang dan tujuan spesifik]

     Instruksi Utama:
     - [langkah/poin tindakan 1]
     - [langkah/poin tindakan 2]

     Batasan & Kriteria: [larangan dan batasan ketat]

     Format Output: [format hasil akhir yang diharapkan]`:`You are a World-Class Master Prompt Optimizer & AI Prompt Architect. Elevate and polish the prompt to be sharper, richer in clarity and constraints, and maximize output quality on modern AI models.

STRICT STRUCTURE & READABILITY RULES (MANDATORY):
1. Return ONLY the plain text enhanced prompt without any introductory or concluding remarks.
2. DO NOT use markdown code block fences (NO \`\`\` or \`\`\`markdown).
3. DO NOT use bold asterisks (NO **text**).
4. MANDATORY DOUBLE NEWLINE BETWEEN SECTIONS & PARAGRAPHS:
   - Separate AI Role, Context/Objective, Key Instructions, Hard Constraints, and Output Format with a blank line between each section.
   - Never compress distinct instructions into a single dense wall of text.
   - Format each section with clear labels followed by a colon, e.g.:

     AI Role: [detailed persona description]

     Context & Goal: [specific background and objective]

     Key Instructions:
     - [action point 1]
     - [action point 2]

     Constraints: [hard constraints and boundaries]

     Output Format: [deliverables specification]`,r=t?`Kerangka Kerja: "${e}"
Prompt Awal:
"""
${a}
"""

Tingkatkan dan poles prompt di atas menjadi versi paling optimal. Pastikan setiap bagian/paragraf dipisahkan oleh satu baris kosong agar sangat rapi, nyaman dibaca, dan mudah ditinjau sebelum disalin:`:`Framework: "${e}"
Initial Prompt:
"""
${a}
"""

Enhance and refine the prompt above to the absolute highest standard. Ensure every section and paragraph is separated by an empty line so it is exceptionally clean, comfortable to read, and easy to review before copying:`,l=await j(r,i);return q(l)},wt=async(a,e,n="id")=>{const t=n==="id",i=t?`Anda adalah Evaluator Kualitas Prompt AI. Analisis prompt yang diberikan dan berikan penilaian dalam format JSON baku persis seperti berikut:
{
  "clarityScore": 85,
  "specificityScore": 90,
  "overallScore": 88,
  "feedback": "Evaluasi singkat 2-3 kalimat mengenai kekuatan prompt.",
  "suggestions": [
    "Saran perbaikan konkret 1",
    "Saran perbaikan konkret 2"
  ]
}
Skor berupa bilangan bulat 0 sampai 100. Kembalikan HANYA string JSON yang valid.`:"You are an AI Prompt Quality Evaluator. Analyze the prompt and return pure JSON format with clarityScore (0-100), specificityScore (0-100), overallScore (0-100), feedback (string), suggestions (string array). Return pure JSON only.",r=t?`Kerangka Kerja: "${e}"
Prompt yang dievaluasi:
"""
${a}
"""`:`Framework: "${e}"
Prompt to evaluate:
"""
${a}
"""`;try{const o=(await j(r,i)).replace(/```json/gi,"").replace(/```/g,"").trim(),c=JSON.parse(o);return{clarityScore:typeof c.clarityScore=="number"?c.clarityScore:80,specificityScore:typeof c.specificityScore=="number"?c.specificityScore:85,overallScore:typeof c.overallScore=="number"?c.overallScore:83,feedback:c.feedback||(t?"Prompt tersusun dengan baik dan jelas.":"Well-structured prompt."),suggestions:Array.isArray(c.suggestions)?c.suggestions:[]}}catch(l){return console.warn("Fallback parsing quality analysis result:",l),{clarityScore:82,specificityScore:86,overallScore:84,feedback:t?"Prompt memiliki struktur yang cukup baik dan dapat dieksekusi dengan baik oleh AI.":"The prompt has solid clarity and structure.",suggestions:t?["Pertimbangkan untuk menambahkan contoh keluaran (*few-shot example*) untuk hasil yang lebih spesifik."]:["Consider adding an example output to guide the model further."]}}},It=async a=>{try{return{success:!0,message:`Koneksi berhasil! Respons model: "${(await j('Uji coba koneksi: balas dengan kata "OK" jika terhubung.','Balas hanya "OK".',a)).slice(0,100)}"`}}catch(e){return{success:!1,message:(e instanceof Error?e.message:String(e))||"Gagal terhubung ke API endpoint."}}},Ne=new Set(["persona","context","task","constraints","output_format","audience","variable","custom"]),x=a=>typeof a!="string"?"":q(a).replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim(),Me=a=>{const e=a.replace(/```json/gi,"").replace(/```/g,"").trim(),n=e.indexOf("{"),t=e.lastIndexOf("}");return n!==-1&&t>n?e.slice(n,t+1):e},vt=async(a,e,n="id")=>{const t=n==="id",i=a.trim(),r=e==="skill"?t?`Target Mode adalah AGENT SKILL (SKILL.md). Anda WAJIB menyertakan:
  "skillName": "nama-skill-kebab-case-maks-64-karakter",
  "skillDescription": "deskripsi kapan AI agent harus mengaktifkan skill ini (maks 1024 karakter, jelas dan spesifik)",`:`Target Mode is AGENT SKILL (SKILL.md). You MUST include:
  "skillName": "kebab-case-skill-name-max-64-chars",
  "skillDescription": "clear trigger description explaining when an AI agent should invoke this skill (max 1024 chars)",`:t?"Target Mode adalah PROMPT STANDAR. Fokus pada kejelasan instruksi, batasan, dan format keluaran.":"Target Mode is STANDARD PROMPT. Focus on instruction clarity, constraints, and output format.",l=t?`Anda adalah Arsitek Prompt & Agent Skill Profesional. Tugas Anda mengubah ide singkat pengguna menjadi draft terstruktur untuk Blank Canvas.
${r}

Kembalikan HANYA JSON murni yang valid tanpa markdown code fence, tanpa kata pengantar, dan TANPA karakter em dash.
Skema JSON wajib:
{
  "title": "Judul ringkas dan jelas",
  "description": "Deskripsi singkat 1-2 kalimat",
  "scratchpad": "Instruksi inti atau langkah kerja terstruktur",
  "blocks": [
    {
      "type": "persona | context | task | constraints | output_format | audience | variable | custom",
      "label": "Nama label bagian",
      "value": "Isi detail bagian ini"
    }
  ],
  "fewShotInput": "Contoh input singkat (opsional, kosongkan string jika tidak perlu)",
  "fewShotOutput": "Contoh output ideal (opsional, kosongkan string jika tidak perlu)"${e==="skill"?`,
  "skillName": "nama-skill-kebab-case",
  "skillDescription": "Gunakan skill ini saat..."`:""}
}
Gunakan 3 sampai 5 blok yang paling relevan dari daftar type yang tersedia.`:`You are a Principal Prompt & Agent Skill Architect. Transform the user's brief idea into a structured Blank Canvas draft.
${r}

Return ONLY pure valid JSON with no markdown code fences, no preamble, and NO em dash characters.
Required JSON schema:
{
  "title": "Concise, clear title",
  "description": "Short 1-2 sentence description",
  "scratchpad": "Core instructions or structured execution workflow",
  "blocks": [
    {
      "type": "persona | context | task | constraints | output_format | audience | variable | custom",
      "label": "Section label name",
      "value": "Detailed content for this section"
    }
  ],
  "fewShotInput": "Brief sample input (optional, empty string if unnecessary)",
  "fewShotOutput": "Ideal expected output (optional, empty string if unnecessary)"${e==="skill"?`,
  "skillName": "kebab-case-skill-name",
  "skillDescription": "Use this skill when..."`:""}
}
Select 3 to 5 of the most relevant block types.`,o=t?`Ide pengguna:
"""
${i}
"""
Susun JSON draft Blank Canvas dalam Bahasa Indonesia.`:`User idea:
"""
${i}
"""
Compose the Blank Canvas draft JSON in English.`,c=await j(o,l);try{const g=Me(c),m=JSON.parse(g);if(!m||typeof m!="object")throw new Error("Parsed draft is not an object.");const p=m,k=(Array.isArray(p.blocks)?p.blocks:[]).map(f=>{if(!f||typeof f!="object")return null;const $=f,L=typeof $.type=="string"?$.type.trim():"custom",T=Ne.has(L)?L:"custom",C=x($.value);if(!C)return null;const A=x($.label);return{type:T,label:A||void 0,value:C}}).filter(f=>f!==null),s=x(p.title)||x(i).slice(0,60)||(t?"Draft Canvas AI":"AI Canvas Draft"),d=x(p.description),y=x(p.scratchpad),S=x(p.fewShotInput)||void 0,b=x(p.fewShotOutput)||void 0,w=x(p.skillName)||void 0,O=x(p.skillDescription)||void 0;return{title:s,description:d,scratchpad:y,blocks:k,fewShotInput:S,fewShotOutput:b,skillName:w,skillDescription:O}}catch(g){console.warn("Fallback parsing Canvas AI draft JSON:",g);const m=x(c);return{title:x(i).slice(0,60)||(t?"Draft Canvas AI":"AI Canvas Draft"),description:t?"Draft disusun otomatis dari ide pengguna.":"Draft generated automatically from user idea.",scratchpad:m,blocks:[]}}},ae=(a,e)=>typeof a!="number"||!Number.isFinite(a)?e:Math.max(0,Math.min(100,Math.round(a))),oe=a=>{if(typeof a!="string")return"";let e=a.replace(/\r\n/g,`
`).replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim();return/^```[a-zA-Z0-9_-]*\s*\n/.test(e)&&/\n```$/.test(e)&&(e=e.replace(/^```[a-zA-Z0-9_-]*\s*\n/,"").replace(/\n```$/,"").trim()),e},Oe=a=>Array.isArray(a)?a.map(e=>x(e)).filter(e=>e.length>0):[],pe=(a,e,n)=>{const t=Se();t.title=a.title,t.description=a.description,t.targetMode=e,t.scratchpad=a.scratchpad,t.fewShotInput=a.fewShotInput||"",t.fewShotOutput=a.fewShotOutput||"",t.skillName=a.skillName||"",t.skillDescription=a.skillDescription||"",t.blocks=a.blocks.map(r=>Y(r.type,n,r.label,r.value));const i=Je(t,n);if(e==="skill"){const r=He(t,i,n);return oe(Fe(r))}return oe(i||a.scratchpad)},Ct=async(a,e,n,t="id")=>{const i=t==="id",r=a.trim(),l=ge(r),o=e==="auto"?l:e,c=o==="skill"?i?`Karena target adalah AGENT SKILL (SKILL.md), evaluasi juga standar Open Agent Skills:
- YAML frontmatter wajib memiliki "name" (kebab-case, huruf kecil/angka/tanda hubung, maksimal 64 karakter) dan "description" pemicu yang jelas (maksimal 1024 karakter).
- Struktur bagian markdown harus jelas: ## Role & Trigger, ## Input Parameters, ## Execution Steps, dan ## Verification Checklist.
- Pastikan "upgradedDraft" menyertakan "skillName" dan "skillDescription", serta "upgradedFullText" adalah dokumen SKILL.md lengkap dengan YAML frontmatter (--- ... ---) dan isi markdown.`:`Because the target is AGENT SKILL (SKILL.md), also evaluate Open Agent Skills compliance:
- YAML frontmatter must include "name" (lowercase kebab-case, max 64 chars) and a clear trigger "description" (max 1024 chars).
- Markdown sections should clearly cover: ## Role & Trigger, ## Input Parameters, ## Execution Steps, and ## Verification Checklist.
- Ensure "upgradedDraft" includes "skillName" and "skillDescription", and "upgradedFullText" is a complete SKILL.md document with YAML frontmatter (--- ... ---) and markdown body.`:i?'Target adalah PROMPT STANDAR. Pastikan "upgradedFullText" adalah teks prompt siap pakai yang terstruktur rapi (pisahkan bagian dengan baris kosong ganda, tanpa markdown code fence pembungkus).':'Target is STANDARD PROMPT. Ensure "upgradedFullText" is a complete, ready-to-use prompt with clear sections separated by blank lines (no outer markdown code fence).',g=i?`Anda adalah Auditor & Arsitek Prompt/Agent Skill Senior. Tugas Anda:
1. Analisis konten unggahan pengguna berdasarkan kejelasan (clarity), kekhususan (specificity), dan struktur (structure) dengan skor 0-100.
2. Identifikasi kekuatan utama (strengths) dan kelemahan/celah (weaknesses).
3. Tingkatkan konten tersebut menjadi versi yang jauh lebih presisi, terstruktur, dan siap pakai sesuai tujuan peningkatan dari pengguna.
${c}

ATURAN FORMAT MUTLAK:
- Kembalikan HANYA objek JSON murni yang valid tanpa pembuka, tanpa penutup, tanpa code fence \`\`\`json, dan TANPA karakter em dash.
- Seluruh teks penjelasan (strengths, weaknesses, upgradeSummary, dan isi upgradedDraft) ditulis dalam Bahasa Indonesia.

Skema JSON wajib:
{
  "detectedKind": "${o}",
  "scores": {
    "clarity": 75,
    "specificity": 70,
    "structure": 65,
    "overall": 70
  },
  "strengths": ["Kekuatan 1", "Kekuatan 2"],
  "weaknesses": ["Celah atau kelemahan 1", "Celah atau kelemahan 2"],
  "upgradeSummary": "Ringkasan 1-3 kalimat mengenai perbaikan yang diterapkan.",
  "upgradedDraft": {
    "title": "Judul ringkas dan jelas",
    "description": "Deskripsi singkat 1-2 kalimat",
    "scratchpad": "Instruksi inti lengkap",
    "blocks": [
      {
        "type": "persona | context | task | constraints | output_format | audience | variable | custom",
        "label": "Nama label bagian",
        "value": "Isi bagian yang sudah ditingkatkan"
      }
    ],
    "fewShotInput": "Contoh masukan (opsional, string kosong jika tidak perlu)",
    "fewShotOutput": "Contoh keluaran ideal (opsional, string kosong jika tidak perlu)"${o==="skill"?`,
    "skillName": "nama-skill-kebab-case",
    "skillDescription": "Gunakan skill ini saat..."`:""}
  },
  "upgradedFullText": "Teks lengkap prompt hasil upgrade atau dokumen SKILL.md lengkap dengan YAML frontmatter"
}`:`You are a Principal Prompt & Agent Skill Auditor and Architect. Your job:
1. Analyze the uploaded content across clarity, specificity, and structure on a 0-100 scale.
2. List concrete strengths and weaknesses/gaps.
3. Upgrade the content into a sharper, well-structured, production-ready version aligned with the user's upgrade goal.
${c}

STRICT FORMAT RULES:
- Return ONLY a single valid JSON object with no preamble, no closing remarks, no \`\`\`json code fences, and NO em dash characters.
- Write all diagnostic text (strengths, weaknesses, upgradeSummary, and upgradedDraft content) in English.

Required JSON schema:
{
  "detectedKind": "${o}",
  "scores": {
    "clarity": 75,
    "specificity": 70,
    "structure": 65,
    "overall": 70
  },
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness or gap 1", "Weakness or gap 2"],
  "upgradeSummary": "1-3 sentence summary of key upgrades applied.",
  "upgradedDraft": {
    "title": "Concise clear title",
    "description": "Short 1-2 sentence description",
    "scratchpad": "Complete core instructions",
    "blocks": [
      {
        "type": "persona | context | task | constraints | output_format | audience | variable | custom",
        "label": "Section label",
        "value": "Upgraded section content"
      }
    ],
    "fewShotInput": "Sample input (optional, empty string if unnecessary)",
    "fewShotOutput": "Ideal expected output (optional, empty string if unnecessary)"${o==="skill"?`,
    "skillName": "kebab-case-skill-name",
    "skillDescription": "Use this skill when..."`:""}
  },
  "upgradedFullText": "Complete upgraded prompt text or full SKILL.md document with YAML frontmatter"
}`,m=n.trim()?n.trim():i?"Tingkatkan kejelasan instruksi, batasan kualitas, dan struktur agar siap pakai.":"Improve instruction clarity, quality guardrails, and structure for production use.",p=i?`Mode Target: ${e==="auto"?`Otomatis (terdeteksi awal: ${l})`:o}
Tujuan Upgrade: ${m}

Konten yang diunggah:
"""
${r}
"""`:`Target Mode: ${e==="auto"?`Auto (initial detection: ${l})`:o}
Upgrade Goal: ${m}

Uploaded Content:
"""
${r}
"""`,h=await j(p,g);try{const k=Me(h),s=JSON.parse(k);if(!s||typeof s!="object")throw new Error("Parsed upgrade analysis is not an object.");const d=s,y=d.detectedKind,S=e!=="auto"?e:y==="skill"||y==="prompt"?y:o,b=d.scores&&typeof d.scores=="object"?d.scores:{},w=ae(b.clarity,75),O=ae(b.specificity,72),f=ae(b.structure,74),$=Math.round((w+O+f)/3),L=ae(b.overall,$),T=Oe(d.strengths),C=Oe(d.weaknesses),A=x(d.upgradeSummary)||(i?"Struktur instruksi, kejelasan peran, dan batasan kualitas telah ditingkatkan.":"Instruction structure, role clarity, and quality constraints have been upgraded."),N=d.upgradedDraft&&typeof d.upgradedDraft=="object"?d.upgradedDraft:{},P=(Array.isArray(N.blocks)?N.blocks:[]).map(E=>{if(!E||typeof E!="object")return null;const G=E,F=typeof G.type=="string"?G.type.trim():"custom",H=Ne.has(F)?F:"custom",Q=x(G.value);if(!Q)return null;const W=x(G.label);return{type:H,label:W||void 0,value:Q}}).filter(E=>E!==null),D={title:x(N.title)||(i?"Hasil Upgrade Canvas":"Upgraded Canvas Draft"),description:x(N.description),scratchpad:x(N.scratchpad),blocks:P,fewShotInput:x(N.fewShotInput)||void 0,fewShotOutput:x(N.fewShotOutput)||void 0,skillName:x(N.skillName)||void 0,skillDescription:x(N.skillDescription)||void 0};let _=oe(d.upgradedFullText);const I=S==="skill"&&!/^---\n[\s\S]*?\n---/.test(_);return(!_||I)&&(_=pe(D,S,t)),{detectedKind:S,scores:{clarity:w,specificity:O,structure:f,overall:L},strengths:T.length>0?T:[i?"Memiliki maksud dan arah tugas dasar yang dapat dikenali.":"Has an identifiable core objective and direction."],weaknesses:C.length>0?C:[i?"Dapat diperkuat dengan batasan eksplisit dan format keluaran yang lebih terstruktur.":"Can be strengthened with explicit constraints and a stricter output format."],upgradeSummary:A,upgradedDraft:D,upgradedFullText:_}}catch(k){console.warn("Fallback parsing uploaded content upgrade JSON:",k);const s=oe(h),d={title:i?"Hasil Upgrade AI":"AI Upgraded Draft",description:i?"Hasil analisis dan peningkatan otomatis dari konten unggahan.":"Automated analysis and upgrade generated from uploaded content.",scratchpad:x(s||r),blocks:[]},y=o==="skill"&&!/^---\n[\s\S]*?\n---/.test(s)?pe(d,"skill",t):s||pe(d,o,t);return{detectedKind:o,scores:{clarity:74,specificity:70,structure:72,overall:72},strengths:[i?"Konten awal memiliki topik utama yang jelas untuk ditingkatkan.":"Original content has a clear core topic ready for refinement."],weaknesses:[i?"Struktur blok dan batasan eksplisit masih dapat diperkuat.":"Block structure and explicit guardrails can be further reinforced."],upgradeSummary:i?"Konten telah diproses ulang menjadi draf yang lebih rapi dan siap disunting di Canvas.":"Content has been refined into a cleaner draft ready for editing in Canvas.",upgradedDraft:d,upgradedFullText:y}}},Ot=async a=>{const{skillName:e,frameworkName:n="Custom Agent Skill",compiledPrompt:t="",field:i,existingTitle:r="",existingTagline:l="",existingDemoRequest:o="",language:c="id"}=a,g=c==="id",m=g?`Anda adalah Principal Product Architect & Spesialis Optimasi SEO & GEO (Generative Engine Optimization) untuk AI Agent Skills. Tugas Anda adalah merancang profil produk dan live demo berkualitas tinggi yang mudah ditemukan oleh mesin pencari web (Google, Bing) dan mesin jawaban AI (Perplexity, ChatGPT Search, Claude, Google AI Overviews) serta calon pembeli di marketplace digital.
ATURAN MUTLAK:
1. DILARANG menggunakan tanda em-dash (—). Gunakan koma, strip (-), atau tanda kurung.
2. DILARANG menggunakan kata klise generik AI seperti "Revolusioner", "Unleash", "Game-changer", "Delve", "Transformasi tanpa batas".
3. Gunakan kata kunci pencarian berniat tinggi (search intent): production agent skill, verified workflow, cross-runtime, deterministic, zero hallucination.
4. Buat kalimat padat, bernilai tinggi, dan memiliki definisi konkret (answer capsule) yang dapat dikutip langsung oleh LLM dan mesin pencari.`:`You are a Principal Product Architect and SEO/GEO (Generative Engine Optimization) Specialist for AI Agent Skills. Your mission is to craft commercial, discoverable product copy and real-world demo exemplars (Request and Result) optimized for web search engines (Google, Bing) and AI answer engines (Perplexity, ChatGPT Search, Claude, Google AI Overviews).
STRICT RULES:
1. NEVER use em-dashes (—). Use commas, hyphens (-), or parentheses.
2. NEVER use generic AI cliches such as "Revolutionary", "Unleash", "Game-changer", "Delve", "Tapestry".
3. Incorporate high-intent search keywords: production agent skill, deterministic workflow, cross-runtime, zero hallucination.
4. Provide concrete, quotable definition capsules and structured deliverables that search engines and AI agents can cite as authoritative sources.`;if(i==="name"){const s=g?`Nama Judul Skill: "${r||n||e}"
Konteks Prompt:
${t?t.slice(0,1e3):"(Kompiler otomatis)"}

Buat SATU nama identifier skill standar Open Agent Skills dalam format KEBAB-CASE murni (hanya huruf kecil a-z, angka 0-9, dan tanda hubung '-', maksimal 64 karakter, contoh: "nextjs-fullstack-architect" atau "seo-geo-content-engine").
HANYA kembalikan teks kebab-case saja tanpa tanda kutip, tanpa spasi, dan tanpa penjelasan:`:`Skill Title: "${r||n||e}"
Prompt Context:
${t?t.slice(0,1e3):"(Auto-compiled)"}

Generate ONE clean Open Agent Skills identifier name in pure KEBAB-CASE format (lowercase a-z, numbers 0-9, and '-' only, max 64 chars, e.g. "nextjs-fullstack-architect" or "seo-geo-content-engine").
Return ONLY the kebab-case identifier without quotes, without spaces, and without explanation:`,d=await j(s,m);return{name:q(d).toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"").slice(0,64)||"custom-agent-skill"}}if(i==="title"){const s=g?`Nama Kebab-Case Skill: "${e}"
Kerangka Kerja Terkait: "${n}"
Konteks Prompt Bawaan:
${t?t.slice(0,1500):"(Kompiler prompt otomatis)"}

Buat SATU judul produk komersial ramah SEO yang mengandung kata kunci pencarian berniat tinggi (maksimal 60 karakter, contoh: "Next.js Fullstack Production Agent Skill").
HANYA kembalikan teks judul saja tanpa tanda kutip dan tanpa penjelasan:`:`Kebab-Case Skill Name: "${e}"
Related Framework: "${n}"
Prompt Context:
${t?t.slice(0,1500):"(Auto-compiled prompt)"}

Generate ONE high-intent, SEO-friendly commercial title for an agent skill marketplace (max 60 chars, e.g. "Next.js Fullstack Production Agent Skill").
Return ONLY the title text without quotes or explanations:`,d=await j(s,m);return{title:q(d).replace(/^["']|["']$/g,"").trim()}}if(i==="tagline"){const s=g?`Nama Skill: "${r||e}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${t?t.slice(0,1500):""}

Buat SATU kalimat tagline bernilai tinggi dan ramah GEO (answer capsule, maksimal 120 karakter, fokus pada hasil kerja konkret yang diotomasi).
HANYA kembalikan teks tagline saja tanpa tanda kutip:`:`Skill Name: "${r||e}"
Framework: "${n}"
Prompt Context:
${t?t.slice(0,1500):""}

Create ONE punchy value-proposition tagline and GEO answer capsule stating the concrete buyer outcome (max 120 chars).
Return ONLY the tagline text without quotes:`,d=await j(s,m);return{tagline:q(d).replace(/^["']|["']$/g,"").trim()}}if(i==="tags"){const s=g?`Nama Skill: "${r||e}"
Kerangka Kerja: "${n}"

Berikan 5 hingga 7 tag penemuan SEO & marketplace tanpa tanda pagar (#), dipisahkan dengan koma.
Sertakan tag format ('open-agent-skills', 'agent-skill'), runtime ('claude-code', 'cursor-rules', 'antigravity'), serta kata kunci domain teknis.
HANYA kembalikan teks tag dipisahkan koma:`:`Skill Name: "${r||e}"
Framework: "${n}"

Provide 5 to 7 high-intent SEO & marketplace discovery tags without hash symbols (#), separated by commas.
Include format tags ('open-agent-skills', 'agent-skill'), runtime keywords ('claude-code', 'cursor-rules', 'antigravity'), and specific technical domain keywords.
Return ONLY comma-separated tags:`,d=await j(s,m);return{tags:q(d).replace(/^["']|["']$/g,"").trim().split(",").map(b=>b.trim().replace(/^#/,"")).filter(Boolean)}}if(i==="description"){const s=g?`Nama Produk Skill: "${r||e}"
Tagline: "${l||""}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${t?t.slice(0,2e3):""}

Susun draf deskripsi produk Markdown listing SEO & GEO friendly dengan format terstruktur:
## Definisi Produk & Ringkasan Eksekutif
(Satu paragraf padat 40-60 kata menjelaskan fungsi spesifik skill dan masalah konkret yang diotomasi, siap dikutip oleh Perplexity & Google AI Overviews)

## Kemampuan Utama & Alur Kerja
- Fitur teknis konkret 1
- Fitur teknis konkret 2
- Fitur teknis konkret 3
- Fitur teknis konkret 4

## Sasaran Pengguna & Nilai Tambah
(Siapa yang membutuhkan skill ini dan perbandingannya dengan prompt biasa)

## Kompatibilitas Runner
Didukung penuh pada 27 runtime Open Agent Skills termasuk Google Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, Codex, dan OpenCode.`:`Skill Product Name: "${r||e}"
Tagline: "${l||""}"
Framework: "${n}"
Prompt Context:
${t?t.slice(0,2e3):""}

Draft an SEO & GEO-optimized Markdown listing description formatted as:
## Product Overview & Executive Summary
(One concise 40-60 word quotable answer capsule explaining what this skill automates, ready for Perplexity & Google AI citation)

## Key Capabilities & Workflow
- Concrete technical capability 1
- Concrete technical capability 2
- Concrete technical capability 3
- Concrete technical capability 4

## Target Audience & Value Proposition
(Who needs this skill and why it outperforms generic prompt templates)

## Runner Compatibility
Supported across 27 Open Agent Skills runtimes including Google Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, Codex, and OpenCode.`,d=await j(s,m);return{description:q(d).trim()}}if(i==="demoRequest"){const s=g?`Nama Skill: "${r||e}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${t?t.slice(0,1500):""}

Susun SATU contoh permintaan nyata (Demo Request) yang realistis, menantang, dan mencerminkan kueri pencarian pembeli potensial (high-intent user search query).
Permintaan harus spesifik, memberikan konteks masalah nyata, dan meminta solusi teknis lengkap.
HANYA kembalikan teks prompt permintaan tanpa kata pengantar:`:`Skill Name: "${r||e}"
Framework: "${n}"
Prompt Context:
${t?t.slice(0,1500):""}

Draft ONE realistic, high-intent demo request (the user prompt) that mirrors real customer search queries when looking for an agent solution.
It should provide realistic task context and request complete deliverables.
Return ONLY the prompt request text without preamble:`,d=await j(s,m);return{demoRequest:q(d).trim()}}if(i==="demoResult"){const s=g?`Nama Skill: "${r||e}"
Kerangka Kerja: "${n}"
Permintaan Pengguna (Demo Request):
"${o||"Lakukan audit dan implementasi solusi sesuai standar arsitektur terbaik."}"
Konteks Prompt:
${t?t.slice(0,1500):""}

Susun SATU contoh hasil eksekusi (Demo Result) berstandar emas yang diberikan oleh AI Agent.
Hasil harus ramah GEO (mudah dikutip oleh Perplexity / SearchGPT) dan mencakup:
## Ringkasan Eksekutif
## Hasil Eksekusi / Spesifikasi Solusi
## Langkah Penerapan & Verifikasi Mutu
Minimal 700 karakter, terstruktur rapi, deterministik, dan konkret.
HANYA kembalikan teks output hasil tanpa kata pengantar:`:`Skill Name: "${r||e}"
Framework: "${n}"
User Request (Demo Request):
"${o||"Perform an audit and deliver the production solution following architecture best practices."}"
Prompt Context:
${t?t.slice(0,1500):""}

Draft ONE gold-standard execution result (Demo Result) delivered by the AI Agent.
It must be GEO-friendly (quotable by Perplexity / SearchGPT) and include:
## Executive Summary
## Deliverable / Solution Specification
## Quality Gate & Verification Steps
At least 700 characters, structured, concrete.
Return ONLY the output result markdown without preamble:`,d=await j(s,m);return{demoResult:q(d).trim()}}const p=g?`Nama Kebab-Case Skill: "${e}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${t?t.slice(0,2e3):""}

Susun paket lengkap listing komersial berstandar SEO & GEO (mudah ditemukan di Google Search, marketplace, dan dikutip oleh AI Answer Engines) dalam format JSON murni:
{
  "title": "Judul Komersial Berkata Kunci (maksimal 60 karakter, contoh: Next.js Fullstack Production Agent Skill)",
  "tagline": "Satu kalimat manfaat utama konkret bernada pasti (maksimal 120 karakter)",
  "tags": ["open-agent-skills", "agent-skill", "claude-code", "cursor-rules", "antigravity", "TagDomain"],
  "priceUsd": 14.99,
  "description": "Deskripsi lengkap Markdown dengan ## Definisi Produk & Ringkasan, ## Kemampuan Utama, ## Nilai Tambah, dan ## Kompatibilitas Runner",
  "demoRequest": "Contoh pertanyaan/tugas teknis realistis dan berniat tinggi dari pengguna (The Request)",
  "demoResult": "Contoh hasil eksekusi agen yang berstandar emas, terstruktur dengan ## Executive Summary, ## Solution Deliverable, ## Verification Checklist, minimal 700 karakter (The Result)"
}
Kembalikan HANYA format JSON valid tanpa tanda pembungkus markdown quotes (\`\`\`json):`:`Kebab-Case Skill Name: "${e}"
Framework: "${n}"
Prompt Context:
${t?t.slice(0,2e3):""}

Generate a complete commercial listing package and demo exemplar adhering to SEO & GEO standards in pure JSON format:
{
  "title": "Keyword-Rich Commercial Title (max 60 chars, e.g. Next.js Fullstack Production Agent Skill)",
  "tagline": "One clear sentence stating concrete outcome in answer-capsule style (max 120 chars)",
  "tags": ["open-agent-skills", "agent-skill", "claude-code", "cursor-rules", "antigravity", "DomainTag"],
  "priceUsd": 14.99,
  "description": "Full Markdown description with ## Product Overview & Summary, ## Key Capabilities, ## Value Proposition, and ## Runner Compatibility",
  "demoRequest": "Realistic, high-intent user task prompt mirroring real search queries (The Request)",
  "demoResult": "Comprehensive, structured agent execution result with ## Executive Summary, ## Deliverable Specification, ## Verification Steps, at least 700 characters (The Result)"
}
Return ONLY valid JSON without markdown codeblock wrapper (\`\`\`json):`,h=await j(p,m),k=h.replace(/^```json\s*/i,"").replace(/^```\s*/,"").replace(/\s*```$/,"").trim();try{const s=JSON.parse(k);return{title:typeof s.title=="string"?s.title.trim():void 0,tagline:typeof s.tagline=="string"?s.tagline.trim():void 0,tags:Array.isArray(s.tags)?s.tags.map(String):void 0,priceUsd:typeof s.priceUsd=="number"?s.priceUsd:14.99,description:typeof s.description=="string"?s.description.trim():void 0,demoRequest:typeof s.demoRequest=="string"?s.demoRequest.trim():void 0,demoResult:typeof s.demoResult=="string"?s.demoResult.trim():void 0}}catch{return{title:g?`Paket Spesialis ${n}`:`${n} Specialist Pack`,tagline:g?"Otomasi alur kerja prompt cerdas dan deterministik dengan panduan teruji.":"Automates intelligent, deterministic prompt workflows with production guardrails.",tags:["AI Agent","Prompt Engineering","Productivity"],priceUsd:14.99,description:h}}},Tt=async(a,e,n="id")=>{const t=n==="id",i=t?`Anda adalah Copywriter Produk AI dan Penjualan Agent Skills berstandar tinggi. Buat teks promosi singkat, menarik, dan bernilai tinggi untuk mempromosikan paket skill ini kepada praktisi AI, kreator, dan engineer.
DILARANG menggunakan kata-kata klise seperti "Revolusioner", "Game-changer", "Unleash", atau tanda em-dash (—). Gunakan kalimat lugas, profesional, dan tajam.`:`You are an elite AI Product and Agent Skills copywriter. Create a concise, compelling, high-converting promotional post for this skill pack targeting AI practitioners, creators, and engineers.
DO NOT use overused AI cliches like "Revolutionary", "Game-changer", "Unleash", or em-dashes (—). Keep it crisp, professional, and punchy.`,r=t?`Nama Paket Skill: "${a}"
Ringkasan Kemampuan: "${e}"

Susun 1 draft posting promosi / pitch singkat (X / LinkedIn / Komunitas):
1. Hook pembuka yang menyorot masalah nyata (pain point) yang sering dihadapi.
2. Solusi konkret yang diberikan oleh paket skill ini dalam format 3 poin ringkas.
3. Call to Action (CTA) yang jelas.

Format teks polos yang rapi dan siap disalin:`:`Skill Pack Name: "${a}"
Capability Summary: "${e}"

Draft 1 concise promotional post / pitch hook (for X / LinkedIn / Communities):
1. Opening hook highlighting a real workflow pain point.
2. Concrete solution delivered by this skill pack in 3 bullet points.
3. Clear Call to Action (CTA).

Plain text format, cleanly formatted and ready to copy:`,l=await j(r,i);return q(l).trim()};export{re as A,ut as B,ne as C,Se as D,At as E,wt as F,ct as G,gt as H,Ct as I,It as a,U as b,Y as c,ge as d,lt as e,yt as f,De as g,mt as h,ft as i,Ot as j,Tt as k,dt as l,pt as m,Je as n,kt as o,it as p,st as q,bt as r,ht as s,J as t,He as u,ot as v,rt as w,Fe as x,St as y,vt as z};
