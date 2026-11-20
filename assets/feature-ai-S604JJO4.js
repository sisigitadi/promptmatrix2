import{A as Oe,t as re,a as $e,b as Le,c as xe,d as Ne,e as _e,f as Be}from"./data-localization-BEmRbY13.js";const U=e=>e?e.replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/\r\n/g,`
`).replace(/\r/g,`
`):"",ra=(e,t,n,a,i,r,l,o)=>{var O;const c=t||"Prompt Framework",h=n||"General",g=a||void 0;let u="";const p=(e==null?void 0:e.ai_logic_description)||(e==null?void 0:e.logika_ai);p&&(o==="en"?u=Oe[c]||`AI Persona: ${re(p.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,""),"en")}`:u=`Persona AI: ${p.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,"").trim()}`),u=U(u);let d=(e==null?void 0:e.components)||[];d.length===0&&((O=e==null?void 0:e.komponen_prompt)!=null&&O["VARIABEL INPUT"])&&(d=Object.entries(e.komponen_prompt["VARIABEL INPUT"]).map(([v,w])=>({...w,name:w.name||v})));let s=[];if(e!=null&&e.dynamicSubcomponents){const v=e.dynamicSubcomponents.trigger,w=String(i[v]||"");w&&e.dynamicSubcomponents.options[w]&&(s=e.dynamicSubcomponents.options[w])}const m=[...d,...s],f={},y=[];m.forEach(v=>{let w=i[v.name];if((w==="Lainnya..."||w==="Other...")&&(w=r[v.name]?`${w} (${r[v.name]})`:w),w!=null&&String(w).trim()!==""){const R=o==="en"?$e(v.label||v.name,"en"):v.label||v.name;let N=w;if(typeof w=="string"){const K=o==="en"?Le(w,"en"):w;N=U(K)}else Array.isArray(w)&&(N=w.map(K=>U(String(K))));f[R]=N,y.push(`${R}: ${Array.isArray(N)?N.join(", "):N}`)}});let b;if(e!=null&&e.konteks_tambahan_instruksi_khusus){const v=o==="en"?re(e.konteks_tambahan_instruksi_khusus,"en"):e.konteks_tambahan_instruksi_khusus;b=U(v),y.push(`${o==="id"?"Instruksi Tambahan":"Additional Instructions"}: ${b}`)}let P;const L=i.__few_shot_input,S=i.__few_shot_output;(L||S)&&(P={sample_input:L?U(String(L)):void 0,expected_output:S?U(String(S)):void 0});const I=[];u&&I.push({role:"system",content:u});const T=y.length>0?y.join(`

`):l?U(l):"Execute task according to framework specifications.";return I.push({role:"user",content:T}),{template:c,category:h,subcategory:g,language:o,persona:u,parameters:f,additional_instructions:b,few_shot:P,prompt:U(l),messages:I}},oa=(e,t="full")=>{let n;t==="messages"?n={messages:e.messages}:t==="prompt_only"?n={prompt:e.prompt}:n=e;try{const a=JSON.stringify(n,null,2);return JSON.parse(a),a}catch(a){return console.warn("First serialization pass failed, applying strict ASCII/fallback sanitization:",a),JSON.stringify(n,(r,l)=>typeof l=="string"?U(l):l,2)}},ae=64,oe=1024,me=/^[a-z0-9]+(?:-[a-z0-9]+)*$/,M=e=>U(e).replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim(),je=(e,t)=>{const n=e.replace(/\s+/g," ").trim();if(n.length<=t)return n;const a=n.slice(0,Math.max(0,t-3)),i=a.lastIndexOf(" ");return`${(i>Math.floor(t*.6)?a.slice(0,i):a).trim()}...`},J=e=>`"${M(e).replace(/\s+/g," ").trim().replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`,W=e=>{const t=M(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"");return t&&t.slice(0,ae).replace(/-+$/g,"")||"promptmatrix-agent-skill"},Fe=(e,t)=>{var a;if(!e)return[];let n=e.components?[...e.components]:[];if(n.length===0&&((a=e.komponen_prompt)!=null&&a["VARIABEL INPUT"])&&(n=Object.entries(e.komponen_prompt["VARIABEL INPUT"]).map(([i,r])=>({...r,name:r.name||i}))),e.dynamicSubcomponents){const i=e.dynamicSubcomponents.trigger,r=String(t[i]??""),l=e.dynamicSubcomponents.options[r];r&&Array.isArray(l)&&(n=[...n,...l])}return n},la=e=>{const{framework:t,frameworkName:n,category:a,subcategory:i,formValues:r,customOtherValues:l,compiledPrompt:o,language:c,author:h="Sigit Adi (PromptMatrix)",version:g="1.0.0"}=e,u=n||"PromptMatrix Custom Skill",p=M(_e(u,c)),d=W(u),m=M(xe(a||"General",c)),f=i?M(Ne(i,c)):"";let y="";const b=(t==null?void 0:t.ai_logic_description)||(t==null?void 0:t.logika_ai);if(b){const $=b.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,"").trim();c==="en"?y=M(Oe[u]||`AI Persona: ${re($,"en")}`):y=M(`Persona AI: ${$}`)}const P=(t==null?void 0:t.description)||"",L=M(Be(P,c,u)),S=f?`${m} (${f})`:m,I=c==="id"?`Gunakan skill ini saat pengguna membutuhkan workflow terstruktur untuk ${p} pada domain ${S}.`:`Use this skill when the user needs a structured workflow for ${p} in ${S}.`,T=L?`${L} ${I}`:`${p} workflow skill. ${I}`,O=je(M(T),oe),v=Fe(t,r),w=[],R=new Set;v.forEach($=>{R.add($.name);let _=r[$.name];if(_==="Lainnya..."||_==="Other..."){const H=l[$.name];_=H?`${_} (${H})`:_}const ne=M(c==="en"?$e($.label||$.name,"en"):$.label||$.name);if(_!=null&&String(_).trim()!==""){const H=Array.isArray(_)?_.map(ce=>M(String(ce))).join(", "):M(typeof _=="string"&&c==="en"?Le(_,"en"):String(_));w.push(`- **${ne}**: ${H}`)}else{const H=$.optional?c==="id"?"opsional":"optional":c==="id"?"isi sesuai konteks":"provide per context",ce=$.placeholder?` (${M($.placeholder)})`:"";w.push(`- **${ne}**: _${H}_${ce}`)}}),Object.entries(r).forEach(([$,_])=>{if($==="__few_shot_input"||$==="__few_shot_output"||R.has($)||_===void 0||_===null||String(_).trim()==="")return;const ne=Array.isArray(_)?_.map(H=>M(String(H))).join(", "):M(String(_));w.push(`- **${M($)}**: ${ne}`)});let N="";t!=null&&t.konteks_tambahan_instruksi_khusus&&(N=M(c==="en"?re(t.konteks_tambahan_instruksi_khusus,"en"):t.konteks_tambahan_instruksi_khusus));const K=r.__few_shot_input?M(String(r.__few_shot_input)):"",C=r.__few_shot_output?M(String(r.__few_shot_output)):"",A=[y||(c==="id"?`Bertindak sebagai spesialis untuk menjalankan kerangka kerja ${p}.`:`Act as a domain specialist executing the ${p} workflow.`),"",c==="id"?`- **Pemicu Utama**: Aktifkan saat tugas berkaitan dengan ${p} (${S}).`:`- **Trigger Condition**: Activate when the task involves ${p} (${S}).`,c==="id"?`- **Format Keluaran Target**: ${(t==null?void 0:t.output)==="json_prompt"?"JSON terstruktur sesuai kontrak":"Respons terstruktur sesuai parameter"}.`:`- **Target Output Format**: ${(t==null?void 0:t.output)==="json_prompt"?"Structured JSON contract":"Structured response aligned with parameters"}.`].join(`
`),B=w.length>0?w.join(`
`):c==="id"?"- Tidak ada parameter wajib; gunakan konteks permintaan pengguna secara langsung.":"- No mandatory input variables; operate directly from the user request context.",G=M(o),x=c==="id"?["1. Validasi seluruh parameter masukan dan klarifikasi bagian yang belum terisi jika krusial.","2. Terapkan persona serta batasan instruksi di bawah ini secara konsisten.","3. Susun keluaran akhir menggunakan struktur kerja berikut:"]:["1. Validate all input parameters and clarify missing critical constraints before proceeding.","2. Apply the assigned role, constraints, and domain instructions consistently.","3. Produce the final deliverable following the compiled prompt contract below:"];N&&(x.push(""),x.push(c==="id"?`**Instruksi Khusus**: ${N}`:`**Additional Instructions**: ${N}`)),G&&(x.push(""),x.push("```text"),x.push(G),x.push("```"));const z=x.join(`
`),X=c==="id"?["- [ ] Seluruh parameter input utama telah tercermin pada hasil akhir.","- [ ] Format keluaran bersih, bebas placeholder kosong, dan siap pakai.","- [ ] Batasan keamanan, privasi, dan konsistensi fakta telah diperiksa."].join(`
`):["- [ ] Every filled input parameter is reflected accurately in the output.","- [ ] Output format is clean, free of unresolved placeholders, and ready to use.","- [ ] Constraints, edge cases, and factual accuracy have been verified."].join(`
`);let Y;if(K||C){const $=[];K&&($.push(c==="id"?"### Contoh Masukan":"### Sample Input"),$.push("```text"),$.push(K),$.push("```")),C&&($.length>0&&$.push(""),$.push(c==="id"?"### Contoh Keluaran yang Diharapkan":"### Expected Output"),$.push("```text"),$.push(C),$.push("```")),Y=$.join(`
`)}const ve=[`# ${p}`,"","## Role & Trigger",A,"","## Input Parameters",B,"","## Execution Steps",z,"","## Verification Checklist",X];return Y&&ve.push("","## Few-Shot Reference",Y),{name:d,description:O,license:"MIT",compatibility:"Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills runners.",metadata:{author:M(h),version:M(g),source:"PromptMatrix 2.0",category:m,language:c,framework:M(u)},body:ve.join(`
`).trim(),sections:{roleAndTrigger:A,inputParameters:B,executionSteps:z,verificationChecklist:X,fewShotReference:Y}}},ca=e=>{const t=[],n=[],a=e.name.trim(),i=e.description.trim(),r=e.body.trim();return a?(a.length>ae&&t.push(`Skill name exceeds ${ae} characters (${a.length}).`),me.test(a)||t.push("Skill name must be lowercase kebab-case (a-z, 0-9, single hyphens only).")):t.push("Skill name is required."),i?i.length>oe&&t.push(`Skill description exceeds ${oe} characters (${i.length}).`):t.push("Skill description is required."),r||t.push("Skill Markdown body cannot be empty."),e.license.trim()||n.push("License field is empty; MIT is recommended."),i.length>0&&i.length<40&&n.push("Description is short; include clearer trigger conditions for agent discovery."),{valid:t.length===0,errors:t,warnings:n,nameLength:a.length,descriptionLength:i.length}},Ge=e=>`${["---",`name: ${e.name}`,`description: ${J(e.description)}`,`license: ${e.license||"MIT"}`,`compatibility: ${J(e.compatibility)}`,"metadata:",`  author: ${J(e.metadata.author)}`,`  version: ${J(e.metadata.version)}`,`  source: ${J(e.metadata.source)}`,`  category: ${J(e.metadata.category)}`,`  language: ${J(e.metadata.language)}`,`  framework: ${J(e.metadata.framework)}`,"---"].join(`
`)}

${e.body.trim()}
`,Ue=new Set(["and","the","for","with","from","into","your"]),qe=["unlock","elevate","empower","delve","showcase","testament","landscape","journey","robust","game-changer","next-level","next-generation","seamless","seamlessly","cutting-edge","revolutionary","revolutionizing","ultimate","unleash","tapestry"],Ve=new RegExp(`\\b(${qe.join("|")})\\b`,"gi"),ze=[{heading:"Role & Trigger",pattern:/^##\s+Role\s*&\s*Trigger\b/im},{heading:"Input Parameters",pattern:/^##\s+Input\s+Parameters\b/im},{heading:"Execution Steps",pattern:/^##\s+Execution\s+Steps\b/im},{heading:"Verification Checklist",pattern:/^##\s+Verification\s+Checklist\b/im}],da=(e,t)=>{const n=e.name.trim(),a=e.description.trim(),i=e.body.trim(),r=((t==null?void 0:t.tagline)??"").trim(),l=((t==null?void 0:t.demoRequest)??"").trim(),o=((t==null?void 0:t.demoResult)??"").trim(),c=(t==null?void 0:t.tags)??[],h=n.length>0&&n.length<=ae&&me.test(n),g=a.length>=40&&a.length<=oe,u=ze.filter(K=>!K.pattern.test(i)).map(K=>K.heading),p=u.length===0,d=[n,a,e.compatibility,i,r,l,o,c.join(" ")].join(`
`),s=(d.match(/\u2014/g)||[]).length,m=s===0,f=Array.from(new Set((d.match(Ve)||[]).map(K=>K.toLowerCase()))),y=f.length===0,b=c.filter(K=>{const C=K.trim();return!C||C.startsWith("#")||Ue.has(C.toLowerCase())||!me.test(C)}),P=c.length>=3&&c.length<=7,L=P&&b.length===0,S=r.length>0,I=l.length>=25,T=/^##\s+Summary\b/im.test(o),O=o.length>=700&&T,v=[{id:"valid-name",label:"Valid kebab-case slug (<= 64 chars)",passed:h,detail:h?`${n} (${n.length}/${ae} chars)`:"Skill name must be non-empty lowercase kebab-case and at most 64 characters."},{id:"valid-description",label:"Discovery description (40-1024 chars)",passed:g,detail:g?`${a.length} chars (within 40-1024 limit)`:`Description is ${a.length} chars; target 40-1024 chars.`},{id:"required-sections",label:"Required SKILL.md playbook sections",passed:p,detail:p?"All 4 sections present (Role & Trigger, Input Parameters, Execution Steps, Verification Checklist).":`Missing sections: ${u.join(", ")}`},{id:"zero-em-dashes",label:"Zero em-dash characters (U+2014)",passed:m,detail:m?"No em-dash characters found.":`Found ${s} em-dash character(s); replace with commas, colons, or parentheses.`},{id:"zero-ai-buzzwords",label:"Zero banned AI marketing buzzwords",passed:y,detail:y?"Copy passes anti-buzzword check.":`Remove buzzwords: ${f.join(", ")}`},{id:"clean-tags",label:"Clean marketplace tags (3-7 kebab-case, no # or stopwords)",passed:L,detail:L?`${c.length} clean tags: ${c.join(", ")}`:P?`Invalid tag(s): ${b.join(", ")}`:`Expected 3-7 tags; received ${c.length}.`},{id:"tagline-present",label:"Marketplace tagline present",passed:S,detail:S?`${r.length} chars`:"Add a concise 1-sentence tagline describing the concrete skill outcome."},{id:"demo-request",label:"Step 3 demo request (>= 25 chars)",passed:I,detail:I?`${l.length} chars`:`Demo request is ${l.length} chars (minimum 25 chars).`},{id:"demo-result",label:"Step 3 demo result (>= 700 chars + ## Summary)",passed:O,detail:O?`${o.length} chars with ## Summary section`:`Demo result is ${o.length} chars (need >= 700 chars and a ## Summary heading).`}],w=v.length,R=v.filter(K=>K.passed).length;return{score:w>0?Math.round(R/w*100):0,passedCount:R,totalCount:w,checks:v}},ua="__blank_canvas__",be="pm_blank_canvas_draft",fe="Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills runners.",ee=64,ke=1024,se=[{type:"persona",labelId:"Persona AI",labelEn:"AI Persona",placeholderId:"Contoh: Senior Software Architect dengan pengalaman 10 tahun di sistem terdistribusi...",placeholderEn:"e.g. Senior Software Architect with 10 years of experience in distributed systems...",hintId:"Tetapkan peran, keahlian, dan sudut pandang model AI.",hintEn:"Define the role, expertise, and perspective of the AI model.",editableLabel:!1},{type:"context",labelId:"Konteks & Tujuan",labelEn:"Context & Goal",placeholderId:"Jelaskan latar belakang proyek, situasi saat ini, dan sasaran akhir yang ingin dicapai...",placeholderEn:"Describe project background, current situation, and the end objective...",hintId:"Berikan informasi situasi agar AI memahami ruang lingkup masalah.",hintEn:"Provide situational context so the AI understands the problem scope.",editableLabel:!1},{type:"task",labelId:"Tugas Utama",labelEn:"Core Task",placeholderId:"Uraikan tugas spesifik yang harus dikerjakan AI langkah demi langkah...",placeholderEn:"Specify the exact task the AI needs to execute step by step...",hintId:"Fokus pada aksi konkret yang diharapkan dari model.",hintEn:"Focus on the concrete action expected from the model.",editableLabel:!1},{type:"constraints",labelId:"Batasan & Kriteria",labelEn:"Constraints & Rules",placeholderId:"Contoh: Jangan mengarang fakta, hindari jargon berlebihan, maksimal 300 kata...",placeholderEn:"e.g. Do not fabricate facts, avoid unnecessary jargon, max 300 words...",hintId:"Tetapkan pagar pengaman, larangan, dan syarat kualitas.",hintEn:"Set guardrails, exclusions, and quality criteria.",editableLabel:!1},{type:"output_format",labelId:"Format Output",labelEn:"Output Format",placeholderId:"Contoh: Tabel Markdown dengan 3 kolom, JSON valid, atau poin bernomor...",placeholderEn:"e.g. 3-column Markdown table, valid JSON, or numbered action items...",hintId:"Tentukan struktur visual atau format data dari hasil akhir.",hintEn:"Specify the visual structure or data format of the final output.",editableLabel:!1},{type:"audience",labelId:"Target Audiens",labelEn:"Target Audience",placeholderId:"Contoh: Manajer produk non-teknis, developer pemula, atau eksekutif C-level...",placeholderEn:"e.g. Non-technical product managers, junior developers, or C-level executives...",hintId:"Sesuaikan tingkat kedalaman bahasa dengan pembaca akhir.",hintEn:"Tailor vocabulary and depth to the intended reader.",editableLabel:!1},{type:"variable",labelId:"Variabel Input",labelEn:"Input Variable",placeholderId:"Masukkan nilai data, cuplikan teks, atau parameter khusus untuk diproses...",placeholderEn:"Provide input data, source text snippet, or custom parameter to process...",hintId:"Label dapat diubah sesuai nama variabel atau data masukan Anda.",hintEn:"Label can be edited to match your custom input variable name.",editableLabel:!0},{type:"custom",labelId:"Bagian Kustom",labelEn:"Custom Section",placeholderId:"Isi instruksi atau referensi tambahan sesuai kebutuhan spesifik Anda...",placeholderEn:"Enter additional instructions or references tailored to your workflow...",hintId:"Label bebas disesuaikan untuk kebutuhan blok apa pun.",hintEn:"Label can be freely customized for any section you need.",editableLabel:!0}],He=new Set(se.map(e=>e.type)),k=e=>U(e).replace(/\u2014/g,", ").replace(/\u2013/g,"-"),ye=e=>{if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return Number(e.toFixed(2));if(typeof e=="string"&&e.trim()){const t=Number(e.trim());if(Number.isFinite(t)&&t>=0)return Number(t.toFixed(2))}},Se=(e,t)=>{const n=e.replace(/\s+/g," ").trim();if(n.length<=t)return n;const a=n.slice(0,Math.max(0,t-3)),i=a.lastIndexOf(" ");return`${(i>Math.floor(t*.6)?a.slice(0,i):a).trim()}...`},te=e=>se.find(n=>n.type===e)??se[se.length-1],Ke=e=>{const t=Math.random().toString(36).slice(2,8),n=Date.now().toString(36);return`canvas_${e}_${n}_${t}`},Q=(e,t,n,a)=>{const i=te(e),r=t==="id"?i.labelId:i.labelEn,l=n&&n.trim()?k(n.trim()):r;return{id:Ke(e),type:e,label:l,value:a?k(a):"",isCustomLabel:i.editableLabel}},Ae=()=>({title:"",description:"",targetMode:"prompt",scratchpad:"",blocks:[],fewShotInput:"",fewShotOutput:"",skillName:"",skillDescription:"",skillCompatibility:fe,skillTagline:"",skillPriceUsd:void 0,skillTags:"",skillDemoRequest:"",skillDemoResult:"",updatedAt:Date.now()}),Re=e=>{if(!e||typeof e!="object")return null;const t=e,n=typeof t.type=="string"?t.type:"custom",a=He.has(n)?n:"custom",i=te(a),r=typeof t.id=="string"&&t.id.trim()?k(t.id.trim()):Ke(a),l=typeof t.label=="string"&&t.label.trim()?k(t.label):i.labelId,o=typeof t.value=="string"?k(t.value):"",c=typeof t.isCustomLabel=="boolean"?t.isCustomLabel:i.editableLabel;return{id:r,type:a,label:l,value:o,isCustomLabel:c}},pa=()=>{const e=Ae();if(typeof window>"u"||typeof localStorage>"u")return e;try{const t=localStorage.getItem(be);if(!t)return e;const n=JSON.parse(t);if(!n||typeof n!="object")return e;const a=n,i=a.targetMode==="skill"?"skill":"prompt",r=Array.isArray(a.blocks)?a.blocks.map(l=>Re(l)).filter(l=>l!==null):[];return{title:typeof a.title=="string"?k(a.title):"",description:typeof a.description=="string"?k(a.description):"",targetMode:i,scratchpad:typeof a.scratchpad=="string"?k(a.scratchpad):"",blocks:r,fewShotInput:typeof a.fewShotInput=="string"?k(a.fewShotInput):"",fewShotOutput:typeof a.fewShotOutput=="string"?k(a.fewShotOutput):"",skillName:typeof a.skillName=="string"?k(a.skillName):"",skillDescription:typeof a.skillDescription=="string"?k(a.skillDescription):"",skillCompatibility:typeof a.skillCompatibility=="string"&&a.skillCompatibility.trim()?k(a.skillCompatibility):fe,skillTagline:typeof a.skillTagline=="string"?k(a.skillTagline):"",skillPriceUsd:ye(a.skillPriceUsd),skillTags:typeof a.skillTags=="string"?k(a.skillTags):"",skillDemoRequest:typeof a.skillDemoRequest=="string"?k(a.skillDemoRequest):"",skillDemoResult:typeof a.skillDemoResult=="string"?k(a.skillDemoResult):"",updatedAt:typeof a.updatedAt=="number"&&Number.isFinite(a.updatedAt)?a.updatedAt:Date.now()}}catch(t){return console.warn("Failed to load Blank Canvas draft from localStorage:",t),e}},ma=e=>{if(!(typeof window>"u"||typeof localStorage>"u"))try{const t={...e,skillTagline:typeof e.skillTagline=="string"?k(e.skillTagline):"",skillPriceUsd:ye(e.skillPriceUsd),skillTags:typeof e.skillTags=="string"?k(e.skillTags):"",skillDemoRequest:typeof e.skillDemoRequest=="string"?k(e.skillDemoRequest):"",skillDemoResult:typeof e.skillDemoResult=="string"?k(e.skillDemoResult):"",updatedAt:e.updatedAt||Date.now()};localStorage.setItem(be,JSON.stringify(t))}catch(t){console.warn("Failed to save Blank Canvas draft to localStorage:",t)}},ka=()=>{if(!(typeof window>"u"||typeof localStorage>"u"))try{localStorage.removeItem(be)}catch(e){console.warn("Failed to clear Blank Canvas draft from localStorage:",e)}},ga=e=>!!(e.title.trim()||e.description.trim()||e.scratchpad.trim()||e.fewShotInput.trim()||e.fewShotOutput.trim()||e.skillName.trim()||e.skillDescription.trim()||(e.skillTagline||"").trim()||typeof e.skillPriceUsd=="number"||(e.skillTags||"").trim()||(e.skillDemoRequest||"").trim()||(e.skillDemoResult||"").trim()||e.blocks.length>0),Je=(e,t)=>{const n=[],a=e.blocks.filter(o=>o.value.trim().length>0);a.forEach(o=>{const c=te(o.type),h=t==="id"?c.labelId:c.labelEn,g=k(o.label.trim())||h,u=k(o.value.trim());n.push(`${g}: ${u}`)});const i=k(e.scratchpad.trim());if(i)if(a.length>0){const o=t==="id"?"Instruksi Utama":"Core Instructions";n.push(`${o}:
${i}`)}else n.push(i);const r=k(e.fewShotInput.trim()),l=k(e.fewShotOutput.trim());if(r){const o=t==="id"?"Contoh Masukan":"Sample Input";n.push(`${o}:
${r}`)}if(l){const o=t==="id"?"Contoh Keluaran yang Diharapkan":"Expected Output";n.push(`${o}:
${l}`)}return k(n.join(`

`))},ha=(e,t,n)=>{const a=k(e.title.trim())||(n==="id"?"Canvas Kosong":"Blank Canvas"),i=n==="id"?"Canvas Kosong":"Blank Canvas",r=e.targetMode==="skill"?"Agent Skill (SKILL.md)":"Custom Prompt",l=e.blocks.filter(b=>b.value.trim().length>0),o=l.filter(b=>b.type==="persona"),c=k(o.map(b=>b.value.trim()).join(`

`)),h={},g=[];l.forEach(b=>{const P=te(b.type),L=n==="id"?P.labelId:P.labelEn,S=k(b.label.trim())||L,I=k(b.value.trim());let T=S,O=2;for(;Object.prototype.hasOwnProperty.call(h,T);)T=`${S} (${O})`,O+=1;h[T]=I,b.type!=="persona"&&g.push(`${S}: ${I}`)});const u=k(e.scratchpad.trim());if(u){const b=n==="id"?"Instruksi Utama":"Core Instructions";g.push(`${b}:
${u}`)}const p=k(e.fewShotInput.trim()),d=k(e.fewShotOutput.trim()),s=p||d?{sample_input:p||void 0,expected_output:d||void 0}:void 0,m=[];c&&m.push({role:"system",content:c});const f=k(t.trim()),y=n==="id"?"Jalankan instruksi sesuai spesifikasi Canvas Kosong.":"Execute task according to Blank Canvas specifications.";return m.push({role:"user",content:g.length>0?g.join(`

`):f||y}),{template:a,category:i,subcategory:r,language:n,persona:c,parameters:h,additional_instructions:u||void 0,few_shot:s,prompt:f,messages:m}},We=(e,t,n)=>{const a=k(e.title.trim())||(n==="id"?"Skill Canvas Kustom":"Custom Canvas Skill"),i=e.skillName.trim()||e.title.trim()||"custom-canvas-skill",r=W(i).slice(0,ee),l=k(e.description.trim()),o=k(e.skillDescription.trim()),c=n==="id"?`Gunakan skill ini saat pengguna membutuhkan alur kerja terstruktur untuk ${a}.`:`Use this skill when the user needs a structured workflow for ${a}.`,h=o||(l?`${l} ${c}`:c),g=Se(k(h),ke),u=k(e.skillCompatibility.trim())||fe,p=e.blocks.filter(A=>A.value.trim().length>0),d=p.filter(A=>A.type==="persona"),s=p.filter(A=>A.type==="output_format"),m=p.filter(A=>A.type==="constraints"),f=d.length>0?k(d.map(A=>A.value.trim()).join(" ")):n==="id"?`Bertindak sebagai spesialis domain untuk menjalankan skill ${a}.`:`Act as a domain specialist executing the ${a} skill.`,y=o||l||a,b=s.length>0?k(s.map(A=>A.value.trim()).join("; ")):n==="id"?"Respons terstruktur sesuai parameter dan instruksi.":"Structured response aligned with parameters and instructions.",P=[f,"",n==="id"?`- **Pemicu Utama**: ${y}`:`- **Trigger Condition**: ${y}`,n==="id"?`- **Format Keluaran Target**: ${b}`:`- **Target Output Format**: ${b}`].join(`
`),L=p.map(A=>{const B=te(A.type),G=n==="id"?B.labelId:B.labelEn,x=k(A.label.trim())||G,z=k(A.value.trim());return`- **${x}**: ${z}`}),S=L.length>0?L.join(`
`):n==="id"?"- Tidak ada blok parameter khusus; jalankan langsung berdasarkan konteks permintaan pengguna.":"- No dedicated parameter blocks defined; operate directly from the user request context.",I=k(e.scratchpad.trim()),T=k(t.trim()),O=n==="id"?["1. Tinjau seluruh konteks, variabel masukan, dan batasan yang ditetapkan.","2. Ikuti instruksi inti secara berurutan tanpa melewati langkah verifikasi.","3. Hasilkan keluaran akhir mengikuti spesifikasi prompt di bawah ini:"]:["1. Review all context, input variables, and constraints defined in this skill.","2. Follow the core instructions sequentially without skipping verification steps.","3. Produce the final deliverable matching the prompt specification below:"];I&&p.length>0&&(O.push(""),O.push(n==="id"?`**Instruksi Scratchpad**: ${I}`:`**Scratchpad Instructions**: ${I}`)),T&&(O.push(""),O.push("```text"),O.push(T),O.push("```"));const v=O.join(`
`),w=n==="id"?["- [ ] Seluruh blok parameter dan instruksi inti telah dipenuhi.","- [ ] Format keluaran bersih, bebas placeholder kosong, dan siap digunakan.","- [ ] Fakta, konsistensi, serta keamanan informasi telah divalidasi."]:["- [ ] Every defined parameter block and core instruction is satisfied.","- [ ] Output format is clean, free of unresolved placeholders, and ready to use.","- [ ] Factual accuracy, consistency, and safety constraints are verified."];if(m.length>0){const A=k(m.map(B=>B.value.trim()).join("; "));w.push(n==="id"?`- [ ] Batasan khusus dipatuhi: ${A}`:`- [ ] Custom constraints honored: ${A}`)}const R=w.join(`
`),N=k(e.fewShotInput.trim()),K=k(e.fewShotOutput.trim());let C;if(N||K){const A=[];N&&(A.push(n==="id"?"### Contoh Masukan":"### Sample Input"),A.push("```text"),A.push(N),A.push("```")),K&&(A.length>0&&A.push(""),A.push(n==="id"?"### Contoh Keluaran yang Diharapkan":"### Expected Output"),A.push("```text"),A.push(K),A.push("```")),C=A.join(`
`)}const D=[`# ${a}`,"","## Role & Trigger",P,"","## Input Parameters",S,"","## Execution Steps",v,"","## Verification Checklist",R];return C&&D.push("","## Few-Shot Reference",C),{name:r,description:g,license:"MIT",compatibility:u,metadata:{author:"Sigit Adi (PromptMatrix)",version:"1.0.0",source:"PromptMatrix 2.0 (Blank Canvas)",category:n==="id"?"Canvas Kosong":"Blank Canvas",language:n,framework:a},body:D.join(`
`).trim(),sections:{roleAndTrigger:P,inputParameters:S,executionSteps:v,verificationChecklist:R,fewShotReference:C}}},Ce=e=>{if(!e)return"";const t=e.trim().replace(/^.*[\\/]/,"");return k(t.replace(/\.[^.]+$/,""))},de=e=>{const t=e.split(`
`);for(const n of t){const a=k(n.replace(/^#+\s*/,"").replace(/^[-*]\s*/,"").trim());if(a&&a!=="---")return Se(a,60)}return""},ge=e=>{const t=e.trim().toLowerCase();return/^(?:few[\s-]*shot.*input|sample\s+input|contoh\s+masukan)$/.test(t)?"few_shot_input":/^(?:few[\s-]*shot.*output|expected\s+output|contoh\s+keluaran(?:\s+yang\s+diharapkan)?)$/.test(t)?"few_shot_output":/^(?:core\s+instructions?|instructions?|instruksi\s+utama|scratchpad)$/.test(t)?"scratchpad":/(?:persona|role|peran)/.test(t)?"persona":/(?:context|konteks|background|latar\s+belakang|goal|tujuan)/.test(t)?"context":/(?:input\s*parameters?|parameters?|variable|variabel|inputs?)/.test(t)?"variable":/(?:constraints?|rules?|batasan|kriteria|guardrails?)/.test(t)?"constraints":/(?:output\s*format|format\s*(?:output|keluaran)|deliverables?|^output$)/.test(t)?"output_format":/(?:audience|audiens)/.test(t)?"audience":/(?:execution\s*steps?|steps?|task|tugas|workflow|langkah)/.test(t)?"task":"custom"},Ye=e=>{const t=e.split(`
`);let n="",a="",i="";const r=l=>{const o=l.trim();return o.startsWith('"')&&o.endsWith('"')||o.startsWith("'")&&o.endsWith("'")?o.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`).replace(/\\\\/g,"\\").trim():o};for(const l of t){const o=l.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);if(!o)continue;const c=o[1].toLowerCase(),h=k(r(o[2]));c==="name"&&h?n=h:c==="description"&&h?a=h:c==="compatibility"&&h&&(i=h)}return{name:n,description:a,compatibility:i}},Qe=e=>{const t=e.trim(),n=o=>k(o.replace(/^```[a-zA-Z0-9_-]*\s*\n?/gm,"").replace(/\n?```\s*$/gm,"").trim()),a=t.match(/(?:###\s*(?:Sample\s+Input|Contoh\s+Masukan)|(?:Sample\s+Input|Contoh\s+Masukan)\s*:)\s*\n?([\s\S]*?)(?=(?:###\s*(?:Expected\s+Output|Contoh\s+Keluaran)|(?:Expected\s+Output|Contoh\s+Keluaran)[^\n]*:)|$)/i),i=t.match(/(?:###\s*(?:Expected\s+Output|Contoh\s+Keluaran[^\n]*)|(?:Expected\s+Output|Contoh\s+Keluaran[^\n]*)\s*:)\s*\n?([\s\S]*)$/i),r=a?n(a[1]):"",l=i?n(i[1]):"";return!r&&!l&&t?{input:n(t),output:""}:{input:r,output:l}},Ze=e=>{const t=e.trim(),n=t.match(/###\s*The\s+Request\s*\n([\s\S]*?)(?=###\s*The\s+Result\b|$)/i),a=t.match(/###\s*The\s+Result\s*\n([\s\S]*)$/i);return{request:n?k(n[1].trim()):"",result:a?k(a[1].trim()):""}},Pe=(e,t)=>{const n=e.split(`
`);let a="";const i=[],r=[];let l=null;for(const s of n){const m=!a&&!l?s.match(/^#\s+(.+)$/):null;if(m){a=k(m[1].trim());continue}const f=s.match(/^##\s+(.+)$/);if(f){l&&r.push(l),l={heading:k(f[1].trim()),lines:[]};continue}l?l.lines.push(s):i.push(s)}l&&r.push(l);const o=[],c=[];let h="",g="",u="",p="";const d=k(i.join(`
`).trim());d&&c.push(d);for(const s of r){const m=s.lines.join(`
`).trim(),f=k(m);if(!f)continue;if(/see\s+it\s+in\s+action/i.test(s.heading)){const b=Ze(m);b.request&&!u&&(u=b.request),b.result&&!p&&(p=b.result);continue}if(/few[\s-]*shot/i.test(s.heading)){const b=Qe(m);b.input&&!h&&(h=b.input),b.output&&!g&&(g=b.output);continue}const y=ge(s.heading);y==="scratchpad"?c.push(f):y==="few_shot_input"?h=h||f:y==="few_shot_output"?g=g||f:y==="custom"?o.push(Q("custom",t,s.heading,f)):o.push(Q(y,t,s.heading,f))}return{headingTitle:a,blocks:o,scratchpadParts:c,fewShotInput:h,fewShotOutput:g,demoRequest:u,demoResult:p}},j=e=>typeof e=="string"?k(e.trim()):typeof e=="number"||typeof e=="boolean"?String(e):Array.isArray(e)?k(e.map(t=>typeof t=="string"?t.trim():JSON.stringify(t)).filter(Boolean).join(", ")):e&&typeof e=="object"?k(JSON.stringify(e)):"",he=(e,t)=>{if(t&&/skill\.md$/i.test(t.trim()))return"skill";const n=e.replace(/\r\n/g,`
`).trim();if(!n)return"prompt";const a=n.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);return a&&/^\s*(?:name|description)\s*:/im.test(a[1])||/^##\s+(?:Role\s*&\s*Trigger|Execution\s+Steps|Verification\s+Checklist)\b/im.test(n)?"skill":"prompt"},ba=(e,t,n="id")=>{const a=Ae(),i=e.replace(/\r\n/g,`
`).trim();if(!i)return t&&(a.title=Ce(t)),a.targetMode=he(e,t),a;const r=Ce(t);if(i.startsWith("{")||t&&/\.json$/i.test(t.trim()))try{const d=JSON.parse(i);if(d&&typeof d=="object"&&!Array.isArray(d)){const s=d,m=j(s.template)||j(s.title)||j(s.name)||r||(n==="id"?"Prompt Impor JSON":"Imported JSON Prompt"),f=j(s.description),y=[],b=j(s.persona);b&&y.push(Q("persona",n,void 0,b)),Array.isArray(s.blocks)&&s.blocks.forEach(S=>{const I=Re(S);I&&I.value.trim()&&y.push(I)}),s.parameters&&typeof s.parameters=="object"&&!Array.isArray(s.parameters)&&Object.entries(s.parameters).forEach(([S,I])=>{const T=j(I);if(!T)return;const O=ge(S);if(O==="persona"&&b&&T===b)return;if(O==="scratchpad"){a.scratchpad||(a.scratchpad=T);return}if(O==="few_shot_input"){a.fewShotInput=a.fewShotInput||T;return}if(O==="few_shot_output"){a.fewShotOutput=a.fewShotOutput||T;return}const v=O==="custom"?"variable":O;y.push(Q(v,n,k(S),T))});const P=j(s.scratchpad)||j(s.additional_instructions)||j(s.prompt);if(P&&(a.scratchpad=a.scratchpad?`${a.scratchpad}

${P}`:P),s.few_shot&&typeof s.few_shot=="object"&&!Array.isArray(s.few_shot)){const S=s.few_shot;a.fewShotInput=j(S.sample_input)||a.fewShotInput,a.fewShotOutput=j(S.expected_output)||a.fewShotOutput}else a.fewShotInput=j(s.fewShotInput)||a.fewShotInput,a.fewShotOutput=j(s.fewShotOutput)||a.fewShotOutput;const L=s.targetMode==="skill"||typeof s.subcategory=="string"&&/skill/i.test(s.subcategory)||!!(t&&/skill/i.test(t));if(a.title=m,a.description=f,a.blocks=y,a.targetMode=L?"skill":"prompt",a.targetMode==="skill"){const S=j(s.skillName)||m;a.skillName=W(S).slice(0,ee),a.skillDescription=k(j(s.skillDescription)||f).slice(0,ke),a.skillTagline=j(s.skillTagline),a.skillPriceUsd=ye(s.skillPriceUsd),a.skillTags=j(s.skillTags),a.skillDemoRequest=j(s.skillDemoRequest),a.skillDemoResult=j(s.skillDemoResult)}return a.updatedAt=Date.now(),a}}catch{}const l=i.match(/^---\n([\s\S]*?)\n---(?:\n([\s\S]*))?$/);if(l){const d=Ye(l[1]),s=(l[2]??"").trim(),m=Pe(s,n);return a.targetMode="skill",a.skillName=d.name?W(d.name).slice(0,ee):W(m.headingTitle||r||"custom-skill"),a.skillDescription=Se(k(d.description),ke),d.compatibility&&(a.skillCompatibility=d.compatibility),a.title=m.headingTitle||k(d.name)||r||de(s)||(n==="id"?"Agent Skill Impor":"Imported Agent Skill"),a.description=a.skillDescription,a.blocks=m.blocks,a.scratchpad=k(m.scratchpadParts.join(`

`)),a.fewShotInput=m.fewShotInput,a.fewShotOutput=m.fewShotOutput,m.demoRequest&&(a.skillDemoRequest=m.demoRequest),m.demoResult&&(a.skillDemoResult=m.demoResult),a.updatedAt=Date.now(),a}const o=he(i,t),c=(i.match(/^##\s+.+$/gm)||[]).length>=2;if(o==="skill"||c){const d=Pe(i,n);if(d.blocks.length>0||d.scratchpadParts.length>0)return a.targetMode=o,a.title=d.headingTitle||r||de(i)||(n==="id"?"Prompt Impor":"Imported Prompt"),a.blocks=d.blocks,a.scratchpad=k(d.scratchpadParts.join(`

`)),a.fewShotInput=d.fewShotInput,a.fewShotOutput=d.fewShotOutput,o==="skill"&&(a.skillName=W(a.title).slice(0,ee)),a.updatedAt=Date.now(),a}const h=i.split(/\n{2,}/).map(d=>d.trim()).filter(Boolean),g=[],u=[];let p=0;for(const d of h){const s=d.match(/^([A-Za-z0-9 &/_()-]{2,40}):\s*([\s\S]+)$/),m=s?s[1].trim():"",f=/^https?$/i.test(m)||s&&s[2].startsWith("//");if(s&&!f){p+=1;const y=k(m),b=k(s[2].trim()),P=ge(y);P==="scratchpad"?u.push(b):P==="few_shot_input"?a.fewShotInput=a.fewShotInput||b:P==="few_shot_output"?a.fewShotOutput=a.fewShotOutput||b:g.push(Q(P,n,y,b))}else u.push(k(d))}return a.targetMode=o,a.title=r||de(i)||(n==="id"?"Prompt Impor":"Imported Prompt"),p>=2?(a.blocks=g,a.scratchpad=k(u.join(`

`))):(a.blocks=[],a.scratchpad=k(i)),a.targetMode==="skill"&&(a.skillName=W(a.title).slice(0,ee)),a.updatedAt=Date.now(),a},Xe={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1},Z={gemini:{id:"gemini",name:"Google Gemini (AI Studio)",shortLabel:"Gemini",badge:"GOOGLE",defaultBaseUrl:"https://generativelanguage.googleapis.com",defaultModel:"gemini-4-carbon",models:[{id:"gemini-4-carbon",label:"Gemini 4 Carbon",description:"Flagship frontier penalaran mendalam, rekayasa software kompleks & arsitektur sistem (1M+ konteks, Rekomendasi Utama)"},{id:"gemini-4-argon",label:"Gemini 4 Argon",description:"Model frontier penalaran cepat, tajam & efisiensi tinggi untuk alur kerja produksi"},{id:"gemini-4-hydrogen",label:"Gemini 4 Hydrogen",description:"Workhorse agentic & coding harian berefisiensi tinggi, konteks 1M token"},{id:"gemini-3.8-flash",label:"Gemini 3.8 Flash",description:"Model multimodal produksi latensi ultra-rendah dengan thinking budget adaptif"},{id:"gemini-3.7-flash",label:"Gemini 3.7 Flash",description:"Model multimodal cepat untuk pemrosesan volume tinggi"},{id:"gemini-3.5-flash-lite",label:"Gemini 3.5 Flash-Lite",description:"Model ultra-ringan, super cepat & paling hemat kuota token"}],requiresApiKey:!0,docUrl:"https://aistudio.google.com/app/apikey",placeholderKey:"AIzaSy...",icon:"✨"},openai:{id:"openai",name:"OpenAI (GPT-6 & Reasoning)",shortLabel:"OpenAI",badge:"OPENAI",defaultBaseUrl:"https://api.openai.com/v1",defaultModel:"gpt-6.1-sol",models:[{id:"gpt-6.1-sol",label:"GPT-6.1 Sol",description:"Workhorse optimal menyeimbangkan kecerdasan frontier dan efisiensi biaya (Rekomendasi Utama)"},{id:"gpt-6-astra",label:"GPT-6 Astra",description:"Flagship kecerdasan tertinggi OpenAI untuk coding berat, arsitektur & penalaran ilmiah"},{id:"gpt-6.1-terra",label:"GPT-6.1 Terra",description:"Spesialis penalaran visual, audit dokumen & analisis mendalam"},{id:"gpt-6.1-luna",label:"GPT-6.1 Luna",description:"Latensi sub-detik untuk pemrosesan volume tinggi & otomasi harian"},{id:"gpt-5.2-codex",label:"GPT-5.2 Codex",description:"Model spesialis rekayasa perangkat lunak & refactoring kode kompleks"},{id:"gpt-5",label:"GPT-5",description:"Flagship enterprise stabil generasi GPT-5"}],requiresApiKey:!0,docUrl:"https://platform.openai.com/api-keys",placeholderKey:"sk-proj-...",icon:"🟢"},anthropic:{id:"anthropic",name:"Anthropic (Claude 5.5 & Fable 5.2)",shortLabel:"Claude",badge:"ANTHROPIC",defaultBaseUrl:"https://api.anthropic.com/v1",defaultModel:"claude-sonnet-5-5",models:[{id:"claude-sonnet-5-5",label:"Claude Sonnet 5.5",description:"Flagship keseimbangan kecepatan, coding & penulisan terstruktur (Rekomendasi Utama)"},{id:"claude-opus-5-5",label:"Claude Opus 5.5",description:"Model kelas proyek kompleks, riset mendalam & long-running agentic coding"},{id:"claude-fable-5-2",label:"Claude Fable 5.2",description:"Model penalaran puncak untuk orkestrator sistem & tugas agen jangka panjang"},{id:"claude-haiku-5-5",label:"Claude Haiku 5.5",description:"Eksekusi ultra-cepat & paling ekonomis untuk subagent dan volume tinggi"},{id:"claude-sonnet-4-5",label:"Claude Sonnet 4.5",description:"Generasi 4.5 stabil untuk kompatibilitas router legacy"}],requiresApiKey:!0,docUrl:"https://console.anthropic.com/settings/keys",placeholderKey:"sk-ant-...",icon:"🟧"},deepseek:{id:"deepseek",name:"DeepSeek AI (V4 & R1)",shortLabel:"DeepSeek",badge:"DEEPSEEK",defaultBaseUrl:"https://api.deepseek.com/v1",defaultModel:"deepseek-chat",models:[{id:"deepseek-chat",label:"DeepSeek-Chat (V3 / V4)",description:"Endpoint chat standar teruji untuk tugas umum, coding & penulisan (Rekomendasi Utama Produksi)"},{id:"deepseek-reasoner",label:"DeepSeek-R1 (Reasoner)",description:"Penalaran Chain of Thought 671B untuk logika murni & matematika"},{id:"deepseek-v4-pro",label:"DeepSeek-V4 Pro",description:"Flagship V4 Pro 1M konteks untuk agentic workflow & coding berat (Preset Generasi 4)"},{id:"deepseek-flash",label:"DeepSeek-V4.1 Flash",description:"Model V4.1 Flash super cepat dan sangat hemat biaya"}],requiresApiKey:!0,docUrl:"https://platform.deepseek.com/api_keys",placeholderKey:"sk-...",icon:"🔵"},xai:{id:"xai",name:"xAI (Grok 4.7 & Reasoning)",shortLabel:"xAI Grok",badge:"XAI",defaultBaseUrl:"https://api.x.ai/v1",defaultModel:"grok-4.7",models:[{id:"grok-4.7",label:"Grok 4.7",description:"Flagship xAI 500K+ konteks untuk reasoning, coding, agentic & visi (Rekomendasi)"},{id:"grok-420-reasoning",label:"Grok 420 Reasoning",description:"Model penalaran multi-langkah untuk logika, matematika & audit kode"},{id:"grok-4.6",label:"Grok 4.6",description:"Generasi 4.6 stabil untuk tugas kompleks"},{id:"grok-4.1-fast",label:"Grok 4.1 Fast",description:"Model cepat dan hemat biaya untuk pemrosesan volume tinggi"}],requiresApiKey:!0,docUrl:"https://console.x.ai/",placeholderKey:"xai-...",icon:"🖤"},mistral:{id:"mistral",name:"Mistral AI (La Plateforme)",shortLabel:"Mistral",badge:"MISTRAL",defaultBaseUrl:"https://api.mistral.ai/v1",defaultModel:"mistral-large-latest",models:[{id:"mistral-large-latest",label:"Mistral Large 4 (Latest)",description:"Flagship multimodal 1M konteks untuk penalaran kompleks & tool-use (Rekomendasi)"},{id:"mistral-small-latest",label:"Mistral Small 4 (Latest)",description:"Model hybrid efisien menyatukan instruct, reasoning & coding"},{id:"codestral-latest",label:"Codestral (Latest)",description:"Model spesialis sintesis kode dan refactoring"},{id:"ministral-3b-latest",label:"Ministral 3B (Latest)",description:"Model ringan latensi ultra rendah untuk tugas terarah"}],requiresApiKey:!0,docUrl:"https://console.mistral.ai/api-keys/",placeholderKey:"mis_...",icon:"🌪️"},groq:{id:"groq",name:"Groq Cloud (LPU Ultra-Fast Inference)",shortLabel:"Groq",badge:"LPU",defaultBaseUrl:"https://api.groq.com/openai/v1",defaultModel:"llama-3.3-70b-versatile",models:[{id:"llama-3.3-70b-versatile",label:"Llama 3.3 70B Versatile",description:"Model 70B stabil 300+ token/detik (Rekomendasi Utama Produksi)"},{id:"llama-3.1-8b-instant",label:"Llama 3.1 8B Instant",description:"Respons instan sub-detik untuk tugas ringan"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"Llama 4 Maverick (128E)",description:"Flagship Llama 4 MoE di Groq LPU dengan kecepatan ekstrem"},{id:"meta-llama/llama-4-scout-17b-16e-instruct",label:"Llama 4 Scout (16E)",description:"Llama 4 Scout cepat dengan dukungan konteks panjang"},{id:"qwen/qwen3.8-27b",label:"Qwen 3.8 27B",description:"Model multimodal & penalaran cepat generasi Qwen 3.8"},{id:"openai/gpt-oss-20b",label:"OpenAI GPT-OSS 20B",description:"Model open-weights OpenAI berlatensi sub-detik"}],requiresApiKey:!0,docUrl:"https://console.groq.com/keys",placeholderKey:"gsk_...",icon:"⚡"},openrouter:{id:"openrouter",name:"OpenRouter (Universal Model Aggregator)",shortLabel:"OpenRouter",badge:"ROUTER",defaultBaseUrl:"https://openrouter.ai/api/v1",defaultModel:"anthropic/claude-sonnet-5.5",models:[{id:"anthropic/claude-sonnet-5.5",label:"Claude Sonnet 5.5",description:"Flagship Anthropic 1M konteks untuk coding & penulisan (Rekomendasi Utama)"},{id:"anthropic/claude-opus-5.5",label:"Claude Opus 5.5",description:"Flagship Anthropic untuk proyek kompleks & riset mendalam"},{id:"anthropic/claude-fable-5.2",label:"Claude Fable 5.2",description:"Model penalaran puncak Anthropic untuk alur kerja jangka panjang"},{id:"google/gemini-4-carbon",label:"Gemini 4 Carbon",description:"Flagship Google Gemini 4 penalaran mendalam & rekayasa sistem"},{id:"google/gemini-4-argon",label:"Gemini 4 Argon",description:"Frontier reasoning cepat & efisiensi tinggi Google"},{id:"google/gemini-4-hydrogen",label:"Gemini 4 Hydrogen",description:"Workhorse agentic & coding harian Google"},{id:"google/gemini-3.8-flash",label:"Gemini 3.8 Flash",description:"Workhorse multimodal cepat generasi 3.8"},{id:"openai/gpt-6-astra",label:"OpenAI GPT-6 Astra",description:"Flagship tertinggi OpenAI GPT-6 untuk penalaran berat"},{id:"openai/gpt-6.1-sol",label:"OpenAI GPT-6.1 Sol",description:"GPT-6 keseimbangan kecerdasan dan efisiensi biaya"},{id:"deepseek/deepseek-v4-pro",label:"DeepSeek V4 Pro",description:"Flagship open-frontier DeepSeek 1M konteks"},{id:"deepseek/deepseek-r1",label:"DeepSeek R1",description:"Reasoning 671B Chain of Thought"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"Llama 4 Maverick",description:"Flagship open-weights MoE Meta generasi 4"},{id:"x-ai/grok-4.7",label:"xAI Grok 4.7",description:"Flagship xAI 500K+ konteks"}],requiresApiKey:!0,docUrl:"https://openrouter.ai/keys",placeholderKey:"sk-or-v1-...",icon:"🟣"},perplexity:{id:"perplexity",name:"Perplexity AI (Live Web Search & Reasoning)",shortLabel:"Perplexity",badge:"SEARCH",defaultBaseUrl:"https://api.perplexity.ai",defaultModel:"sonar-reasoning-pro",models:[{id:"sonar-reasoning-pro",label:"Sonar Reasoning Pro",description:"Penalaran multi-langkah dengan sitasi web real-time (Rekomendasi)"},{id:"sonar-deep-research",label:"Sonar Deep Research",description:"Riset agen komprehensif lintas banyak sumber web"},{id:"sonar-pro",label:"Sonar Pro",description:"Pencarian internet mendalam multi-sumber"},{id:"sonar",label:"Sonar",description:"Pencarian web ringan dan cepat"}],requiresApiKey:!0,docUrl:"https://www.perplexity.ai/settings/api",placeholderKey:"pplx-...",icon:"🌐"},together:{id:"together",name:"Together AI (Open-Source Frontier)",shortLabel:"Together AI",badge:"CLOUD",defaultBaseUrl:"https://api.together.xyz/v1",defaultModel:"meta-llama/Llama-3.3-70B-Instruct-Turbo",models:[{id:"meta-llama/Llama-3.3-70B-Instruct-Turbo",label:"Llama 3.3 70B Turbo",description:"Model 70B berlatensi sangat cepat & teruji (Rekomendasi)"},{id:"deepseek-ai/DeepSeek-R1",label:"DeepSeek R1 (Full 671B)",description:"Model penalaran rantai pemikiran DeepSeek R1"},{id:"deepseek-ai/DeepSeek-V3",label:"DeepSeek V3",description:"Model general chat 671B efisien"},{id:"deepseek-ai/DeepSeek-V4-Pro",label:"DeepSeek V4 Pro",description:"Flagship DeepSeek V4 Pro serverless (Preset)"},{id:"Qwen/Qwen2.5-72B-Instruct-Turbo",label:"Qwen 2.5 72B Turbo",description:"Model penalaran & multilingual kuat dari Qwen"}],requiresApiKey:!0,docUrl:"https://api.together.ai/settings/api-keys",placeholderKey:"tog-...",icon:"🤝"},cerebras:{id:"cerebras",name:"Cerebras Cloud (World-Record WSE Speed)",shortLabel:"Cerebras",badge:"WSE",defaultBaseUrl:"https://api.cerebras.ai/v1",defaultModel:"llama-3.3-70b",models:[{id:"llama-3.3-70b",label:"Llama 3.3 70B (2000+ tps)",description:"Model 70B dengan kecepatan instan wafer-scale engine (Rekomendasi)"},{id:"llama3.1-8b",label:"Llama 3.1 8B",description:"Eksekusi ultra instan"},{id:"gpt-oss-120b",label:"GPT-OSS 120B (~3000 tps)",description:"Model open-weights 120B berkecepatan ~3.000 token/detik"},{id:"qwen-3.8-27b",label:"Qwen 3.8 27B (~1850 tps)",description:"Qwen 3.8 berkecepatan ~1.850 token/detik"}],requiresApiKey:!0,docUrl:"https://cloud.cerebras.ai/",placeholderKey:"csk-...",icon:"🚀"},sambanova:{id:"sambanova",name:"SambaNova Cloud (Full Precision RDU)",shortLabel:"SambaNova",badge:"RDU",defaultBaseUrl:"https://api.sambanova.ai/v1",defaultModel:"Meta-Llama-3.3-70B-Instruct",models:[{id:"Meta-Llama-3.3-70B-Instruct",label:"Llama 3.3 70B (Full Precision)",description:"Kualitas FP16 murni berkecepatan tinggi di SambaNova RDU (Rekomendasi)"},{id:"DeepSeek-R1",label:"DeepSeek R1 (Full 671B)",description:"Penalaran penuh 671B di atas cluster SambaNova RDU"},{id:"DeepSeek-V3",label:"DeepSeek V3",description:"Model chat general-purpose throughput tinggi"},{id:"gemma-4-31B-it",label:"Gemma 4 31B Instruct",description:"Model terbuka terbaru Google Gemma 4 presisi tinggi"}],requiresApiKey:!0,docUrl:"https://cloud.sambanova.ai/",placeholderKey:"samba-...",icon:"⚡"},cohere:{id:"cohere",name:"Cohere (Command A Enterprise)",shortLabel:"Cohere",badge:"COMMAND",defaultBaseUrl:"https://api.cohere.ai/compatibility/v1",defaultModel:"command-r-plus-08-2024",models:[{id:"command-r-plus-08-2024",label:"Command R+ (Enterprise Live)",description:"Model enterprise stabil untuk RAG, penalaran bisnis & tool-use (Rekomendasi)"},{id:"command-r7b-12-2024",label:"Command R 7B",description:"Versi ringan berkecepatan tinggi"},{id:"command-a-plus-05-2026",label:"Command A+ (MoE Multimodal)",description:"Flagship enterprise MoE generasi Command A (Preset Next-Gen)"},{id:"command-a-reasoning-08-2025",label:"Command A Reasoning",description:"Varian penalaran mendalam untuk analisis bisnis kompleks"},{id:"command-a-03-2025",label:"Command A (Base)",description:"Model utama generasi Command A untuk instruksi terstruktur"}],requiresApiKey:!0,docUrl:"https://dashboard.cohere.com/api-keys",placeholderKey:"coh-...",icon:"🏛️"},huggingface:{id:"huggingface",name:"Hugging Face (Inference Providers Router)",shortLabel:"Hugging Face",badge:"HF",defaultBaseUrl:"https://router.huggingface.co/v1",defaultModel:"meta-llama/Llama-3.3-70B-Instruct",models:[{id:"meta-llama/Llama-3.3-70B-Instruct",label:"Llama 3.3 70B Instruct",description:"Open-weights stabil Meta di HF Router (Rekomendasi)"},{id:"deepseek-ai/DeepSeek-R1",label:"DeepSeek R1",description:"Model penalaran frontier di HF Router"},{id:"deepseek-ai/DeepSeek-V4.1-Flash:fastest",label:"DeepSeek V4.1 Flash (:fastest)",description:"Auto-routed tercepat melalui HF Inference Providers"},{id:"Qwen/Qwen3-Coder-30B-A3B-Instruct",label:"Qwen3 Coder 30B A3B",description:"Spesialis coding MoE efisien di HF Router"}],requiresApiKey:!0,docUrl:"https://huggingface.co/settings/tokens",placeholderKey:"hf_...",icon:"🤗"},ollama:{id:"ollama",name:"Ollama (Local Offline AI)",shortLabel:"Ollama",badge:"LOCAL",defaultBaseUrl:"http://localhost:11434/v1",defaultModel:"qwen3.8:27b",models:[{id:"qwen3.8:27b",label:"Qwen 3.8 (27B)",description:"Workhorse penalaran & chat lokal terbaik untuk 24GB VRAM (Rekomendasi)"},{id:"qwen3-coder:30b",label:"Qwen3 Coder (30B MoE)",description:"Standar emas coding lokal & RAG cepat (24GB VRAM)"},{id:"gemma4:12b",label:"Gemma 4 (12B)",description:"Model multimodal Google Gemma 4 optimal di 16GB RAM/VRAM"},{id:"gemma4:31b",label:"Gemma 4 (31B)",description:"Model workstation presisi tinggi untuk 32-48GB VRAM"},{id:"llama4:16x17b",label:"Llama 4 (Scout MoE)",description:"Model multimodal & konteks masif Meta Llama 4 lokal"},{id:"qwen3.5:9b",label:"Qwen 3.5 (9B)",description:"Daily driver ringan dan tajam untuk 16GB RAM/VRAM"},{id:"deepseek-r1:14b",label:"DeepSeek-R1 (14B)",description:"Penalaran R1 optimal di 16GB RAM/VRAM"},{id:"deepseek-r1:8b",label:"DeepSeek-R1 (8B)",description:"Penalaran R1 ringkas untuk 8GB VRAM"},{id:"deepseek-r1:latest",label:"DeepSeek-R1 (Latest)",description:"Tag default resmi DeepSeek R1 di Ollama"}],requiresApiKey:!1,docUrl:"https://ollama.com/",placeholderKey:"Opsional (tidak wajib untuk Ollama)",icon:"🦙"},internai:{id:"internai",name:"Intern-Discovery / 书生·端砚 (Shanghai AI Lab)",shortLabel:"Intern-AI",badge:"INTERN-AI",defaultBaseUrl:"https://discovery-api.intern-ai.org.cn/v1",defaultModel:"intern-s2",models:[{id:"Agents-A1",label:"Agents-A1 (Multimodal 256K · Hot)",description:"Shanghai AI Lab Agents-A1 multimodal (Input 4 / Output 16 credits)"},{id:"Atria-Dawn",label:"Atria-Dawn (LLM 512K · Hot)",description:"Shanghai AI Lab Atria-Dawn 512K long-context LLM (Input 80 / Output 280 credits)"},{id:"Sage-A1.5",label:"Sage-A1.5 (Multimodal 512K · Hot)",description:"Shanghai AI Lab Sage-A1.5 multimodal (Input 4 / Output 16 credits)"},{id:"Sage-A1.5-Taiyi",label:"Sage-A1.5-Taiyi (Agent 512K)",description:"Shanghai AI Lab Sage-A1.5-Taiyi specialized reasoning agent (Input 32 / Output 128 credits)"},{id:"Sage-S2.1-Flash",label:"Sage-S2.1-Flash (Multimodal 512K · New)",description:"Shanghai AI Lab Sage-S2.1-Flash high-speed multimodal (Input 8 / Output 28 credits)"},{id:"deepseek-v4.1-flash-1017",label:"DeepSeek-V4.1-Flash-1017 (Multimodal 1M)",description:"DeepSeek V4.1 Flash 1M context via Intern-Discovery"},{id:"glm-5.3",label:"GLM-5.3 (LLM 1M)",description:"GLM-5.3 1M context via Intern-Discovery"},{id:"intern-decision-4b",label:"书生·Decision-4B (Decision 8K)",description:"Shanghai AI Lab Decision-4B model (SystemOne protocol)"},{id:"intern-s2",label:"书生·S2 (Multimodal 256K · Flagship)",description:"Shanghai AI Lab Intern-S2 flagship multimodal (Input 30 / Output 180 credits)"},{id:"kimi-k3.1-pro",label:"Kimi-K3.1-Pro (Multimodal 1M · New)",description:"Moonshot Kimi K3.1 Pro 1M context via Intern-Discovery"},{id:"qwen3.8-27b",label:"Qwen3.8-27B (Multimodal 256K)",description:"Qwen 3.8 27B multimodal via Intern-Discovery"}],requiresApiKey:!0,docUrl:"https://discovery.intern-ai.org.cn/",placeholderKey:"API key dari https://discovery.intern-ai.org.cn/",icon:"🧪"},custom:{id:"custom",name:"OpenAI-Compatible / Kustom (LM Studio, vLLM, LiteLLM, Cloudflare AI)",shortLabel:"OpenAI-Comp",badge:"OPENAI-COMP",defaultBaseUrl:"http://localhost:1234/v1",defaultModel:"local-model",models:[{id:"__custom_empty__",label:"✍️ [Kustom] Ketik Model Sendiri (Kosong)",description:"Pilihan kosong untuk mengetik model AI kustom Anda sendiri"},{id:"local-model",label:"local-model",description:"Model aktif di LM Studio / vLLM / Local Host"},{id:"intern-s2",label:"intern-s2",description:"Intern-Discovery Flagship Multimodal (Shanghai AI Lab)"},{id:"Sage-S2.1-Flash",label:"Sage-S2.1-Flash",description:"Intern-Discovery Sage-S2.1-Flash Multimodal 512K (New)"},{id:"Agents-A1",label:"Agents-A1",description:"Intern-Discovery Agents-A1 Multimodal 256K (Hot)"},{id:"Atria-Dawn",label:"Atria-Dawn",description:"Intern-Discovery Atria-Dawn LLM 512K (Hot)"},{id:"Sage-A1.5",label:"Sage-A1.5",description:"Intern-Discovery Sage-A1.5 Multimodal 512K (Hot)"},{id:"Sage-A1.5-Taiyi",label:"Sage-A1.5-Taiyi",description:"Intern-Discovery Sage-A1.5-Taiyi Agent 512K"},{id:"deepseek-v4.1-flash-1017",label:"deepseek-v4.1-flash-1017",description:"DeepSeek V4.1 Flash 1M via Intern-Discovery"},{id:"glm-5.3",label:"glm-5.3",description:"GLM-5.3 1M via Intern-Discovery"},{id:"intern-decision-4b",label:"intern-decision-4b",description:"Shanghai AI Lab Decision-4B (SystemOne)"},{id:"kimi-k3.1-pro",label:"kimi-k3.1-pro",description:"Moonshot Kimi K3.1 Pro 1M via Intern-Discovery"},{id:"qwen3.8-27b",label:"qwen3.8-27b",description:"Qwen 3.8 27B via Intern-Discovery"},{id:"gemini-4-carbon",label:"gemini-4-carbon",description:"Google Gemini 4 Carbon (Frontier Reasoning Flagship)"},{id:"gemini-4-argon",label:"gemini-4-argon",description:"Google Gemini 4 Argon (Optimized Frontier Intelligence)"},{id:"gemini-4-hydrogen",label:"gemini-4-hydrogen",description:"Google Gemini 4 Hydrogen (Agentic & Daily Coding)"},{id:"gemini-3.8-flash",label:"gemini-3.8-flash",description:"Google Gemini 3.8 Flash (Multimodal Cepat Produksi)"},{id:"google/gemini-4-carbon",label:"google/gemini-4-carbon",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"google/gemini-4-argon",label:"google/gemini-4-argon",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"google/gemini-4-hydrogen",label:"google/gemini-4-hydrogen",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"gpt-6-astra",label:"gpt-6-astra",description:"OpenAI GPT-6 Astra Flagship"},{id:"gpt-6.1-sol",label:"gpt-6.1-sol",description:"OpenAI GPT-6.1 Sol Workhorse"},{id:"claude-sonnet-5-5",label:"claude-sonnet-5-5",description:"Anthropic Claude Sonnet 5.5"},{id:"claude-opus-5-5",label:"claude-opus-5-5",description:"Anthropic Claude Opus 5.5"},{id:"claude-fable-5-2",label:"claude-fable-5-2",description:"Anthropic Claude Fable 5.2 Reasoning"},{id:"deepseek-v4-pro",label:"deepseek-v4-pro",description:"DeepSeek V4 Pro 1M Konteks"},{id:"deepseek-reasoner",label:"deepseek-reasoner",description:"DeepSeek R1 CoT Reasoner via Proxy"},{id:"deepseek-chat",label:"deepseek-chat",description:"DeepSeek Chat (V4 / V3 Alias)"},{id:"grok-4.7",label:"grok-4.7",description:"xAI Grok 4.7 Flagship via Proxy"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"llama-4-maverick",description:"Meta Llama 4 Maverick MoE"},{id:"qwen3.8:27b",label:"qwen3.8:27b",description:"Qwen 3.8 27B via Local / Proxy"},{id:"default",label:"default",description:"Model default fallback server"}],requiresApiKey:!1,docUrl:"https://platform.openai.com/docs/api-reference",placeholderKey:"API key kustom Anda (jika diperlukan)",icon:"⚙️"}},Ie="promptmatrix_ai_unified_settings",we="promptmatrix_gemini_api_key",V=e=>{if(!e)return"";let t=e.trim();return t=t.replace(/[\u200B-\u200D\uFEFF\u00A0]/g,""),t=t.replace(/[\r\n\t]/g,""),t=t.replace(/^["']+|["']+$/g,""),t=t.replace(/^bearer\s+/i,""),t.trim()},ea=(e,t)=>{const n=V(e);return!n||n.length<10?null:n.startsWith("AIzaSy")&&t!=="gemini"?"Kunci ini berformat Google Gemini (AIzaSy...). Anda saat ini memilih provider lain. Harap gunakan API Key resmi dari provider yang dipilih.":n.startsWith("sk-ant-")&&t!=="anthropic"?"Kunci ini berformat Anthropic Claude (sk-ant-...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.":n.startsWith("gsk_")&&t!=="groq"?"Kunci ini berformat Groq (gsk_...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.":n.startsWith("hf_")&&t!=="huggingface"?"Kunci ini berformat Hugging Face (hf_...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.":null},ue=()=>({provider:"gemini",apiKey:"",baseUrl:Z.gemini.defaultBaseUrl,model:Z.gemini.defaultModel,providerKeys:{}}),De=()=>{try{const e=localStorage.getItem(Ie);if(e){const n=JSON.parse(e),a=n.provider||"gemini",i=n.providerKeys||{};return n.apiKey&&!i[a]&&(i[a]=V(n.apiKey)),{...ue(),...n,apiKey:V(n.apiKey||i[a]||""),providerKeys:i}}const t=localStorage.getItem(we);if(t&&t.trim()){const n=V(t);return{...ue(),apiKey:n,providerKeys:{gemini:n}}}}catch(e){console.warn("Error reading AI settings from storage:",e)}return ue()},fa=e=>{try{const t=V(e.apiKey),n={...e.providerKeys||{},[e.provider]:t},a={...e,apiKey:t,baseUrl:(e.baseUrl||"").trim(),model:(e.model||"").trim(),providerKeys:n};localStorage.setItem(Ie,JSON.stringify(a)),a.provider==="gemini"&&localStorage.setItem(we,a.apiKey)}catch(t){console.error("Error saving AI settings:",t)}},ya=()=>{try{localStorage.removeItem(Ie),localStorage.removeItem(we)}catch(e){console.error("Error removing AI settings:",e)}},Sa=()=>{const e=De();return(Z[e.provider]||Z.custom).requiresApiKey?!!(e.apiKey&&V(e.apiKey).length>0):!0},F=async(e,t="",n,a)=>{const i=n||De(),{provider:r,apiKey:l,baseUrl:o}=i,c=(i.model||"").trim();if(c==="__custom_empty__")throw new Error("Harap pilih atau ketik nama model AI terlebih dahulu.");return r==="gemini"?aa(e,t,l,c,o,a):r==="anthropic"&&(!o||o.includes("anthropic.com"))?na(e,t,l,o,c,a):ta(e,t,l,o,c,a)},aa=async(e,t,n,a,i,r)=>{var m,f,y,b,P,L;const l=V(n);if(!l)throw new Error("API Key Google Gemini belum diisi. Silakan atur di menu Pengaturan AI ⚙️.");let o=(i||"https://generativelanguage.googleapis.com").replace(/\/+$/,"");o=o.replace(/\/models$/,"").replace(/\/chat\/completions$/,"");const c=o.endsWith("/v1beta")?o:`${o}/v1beta`,h={contents:[{role:"user",parts:[{text:e}]}],generationConfig:{temperature:(r==null?void 0:r.temperature)??.7,maxOutputTokens:(r==null?void 0:r.maxTokens)??2048}};t&&(h.systemInstruction={parts:[{text:t}]});const g=async S=>{const I=`${c}/models/${S}:generateContent?key=${encodeURIComponent(l)}`;return fetch(I,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(h)})};let u=a||"gemini-4-carbon",p=await g(u);if(p.status===404){const S=["gemini-4-argon","gemini-4-hydrogen","gemini-3.8-flash"].filter(I=>I!==u);for(const I of S){const T=await g(I);if(T.ok){p=T,u=I;break}}}if(!p.ok){const S=await p.json().catch(()=>({})),I=((m=S==null?void 0:S.error)==null?void 0:m.message)||p.statusText;let T="";throw p.status===404&&(T=" (Tips: Pastikan model aktif di Google AI Studio atau pilih gemini-4-carbon / gemini-4-argon / gemini-4-hydrogen)"),new Error(`Google Gemini Error (${p.status}): ${I}${T}`)}const d=await p.json(),s=(L=(P=(b=(y=(f=d==null?void 0:d.candidates)==null?void 0:f[0])==null?void 0:y.content)==null?void 0:b.parts)==null?void 0:P[0])==null?void 0:L.text;if(!s)throw new Error("Google Gemini tidak menghasilkan respons teks.");return s.trim()},ta=async(e,t,n,a,i,r)=>{var s,m,f,y,b,P,L,S,I,T,O,v,w,R,N,K;let l=(a||"https://api.openai.com/v1").replace(/\/+$/,""),o=l.endsWith("/chat/completions")?l:`${l}/chat/completions`;const c={"Content-Type":"application/json",Accept:"application/json, text/event-stream"},h=V(n);h&&(c.Authorization=`Bearer ${h}`),l.includes("openrouter.ai")&&(c["HTTP-Referer"]="https://github.com/sisigitadi/promptmatrix",c["X-Title"]="PromptMatrix");const g=[];t&&g.push({role:"system",content:t}),g.push({role:"user",content:e});const u={model:i||"gpt-6.1-sol",messages:g,temperature:(r==null?void 0:r.temperature)??.7,stream:(r==null?void 0:r.stream)??!1};r!=null&&r.maxTokens&&(u.max_tokens=r.maxTokens,u.max_completion_tokens=r.maxTokens);const p=await fetch(o,{method:"POST",headers:c,body:JSON.stringify(u)}),d=await p.text();if(!p.ok){let C="";try{const A=JSON.parse(d);C=((s=A==null?void 0:A.error)==null?void 0:s.message)||(A==null?void 0:A.message)||""}catch{C=d}let D="";if(p.status===401||p.status===403){const A=h.length;A===0?D=" (Diagnostik: API Key kosong. Harap isi API Key dari dashboard provider Anda.)":l.includes("intern-ai.org.cn")?D=` (Diagnostik Intern-Discovery: API Key terdeteksi (${A} karakter) namun ditolak server. Pastikan API Key disalin lengkap dari tab "API Key" di https://discovery.intern-ai.org.cn/ tanpa spasi tambahan. Model yang dikirim: "${i}")`:D=` (Diagnostik: API Key terdeteksi (${A} karakter) namun ditolak server. Pastikan key disalin lengkap tanpa spasi dari dashboard provider. Endpoint: ${o}, Model: "${i}")`}else p.status===404&&i.includes("gemini")?D=' (Tips: Untuk router kustom / OpenAI-compatible, pastikan model terdaftar atau coba gunakan prefix seperti "google/gemini-4-carbon" atau "gemini-4-argon")':p.status===404?D=` (Tips: Model "${i}" tidak ditemukan di server endpoint ${l}. Pastikan nama model benar atau gunakan tombol "Muat Model" untuk melihat model yang tersedia.)`:p.status===429&&(l.includes("intern-ai.org.cn")?D=" (Tips Intern-Discovery: Server terhubung & API Key valid, namun saldo kredit akun habis atau rate-limited. Silakan periksa sisa kredit di dashboard https://discovery.intern-ai.org.cn/ atau pilih model hemat seperti Agents-A1 atau Sage-A1.5)":D=" (Tips: Server terhubung & API Key valid, namun kuota atau saldo kredit akun Anda di provider habis)");throw new Error(`AI Provider Error (${p.status}): ${C||p.statusText}${D}`)}if(d.trim().startsWith("data:")){const C=d.split(`
`);let D="";for(const A of C){const B=A.trim();if(!(!B||B==="data: [DONE]"||B==="[DONE]")&&B.startsWith("data:")){const G=B.replace(/^data:\s*/,"");try{const x=JSON.parse(G),z=((y=(f=(m=x==null?void 0:x.choices)==null?void 0:m[0])==null?void 0:f.delta)==null?void 0:y.content)||((L=(P=(b=x==null?void 0:x.choices)==null?void 0:b[0])==null?void 0:P.message)==null?void 0:L.content)||((I=(S=x==null?void 0:x.choices)==null?void 0:S[0])==null?void 0:I.text)||"";D+=z}catch{}}}if(D.trim())return D.trim()}try{const C=JSON.parse(d),D=((v=(O=(T=C==null?void 0:C.choices)==null?void 0:T[0])==null?void 0:O.message)==null?void 0:v.content)||((R=(w=C==null?void 0:C.choices)==null?void 0:w[0])==null?void 0:R.text)||((K=(N=C==null?void 0:C.content)==null?void 0:N[0])==null?void 0:K.text);if(D)return D.trim()}catch(C){console.warn("Direct JSON parse failed, trying chunk extraction:",C)}if(d&&!d.includes('{"error":'))return d.trim();throw new Error("Model AI tidak mengembalikan konten teks yang valid.")},na=async(e,t,n,a,i,r)=>{var d,s,m;const l=V(n);if(!l)throw new Error("API Key Anthropic Claude belum diisi.");const o=(a||"https://api.anthropic.com/v1").replace(/\/+$/,""),c=o.endsWith("/messages")?o:`${o}/messages`,h={"Content-Type":"application/json","x-api-key":l,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},g={model:i||"claude-sonnet-5-5",max_tokens:(r==null?void 0:r.maxTokens)??2048,messages:[{role:"user",content:e}]};t&&(g.system=t);const u=await fetch(c,{method:"POST",headers:h,body:JSON.stringify(g)}),p=await u.text();if(!u.ok){let f="";try{const y=JSON.parse(p);f=((d=y==null?void 0:y.error)==null?void 0:d.message)||u.statusText}catch{f=p}throw new Error(`Anthropic Error (${u.status}): ${f}`)}try{const f=JSON.parse(p),y=(m=(s=f==null?void 0:f.content)==null?void 0:s[0])==null?void 0:m.text;if(y)return y.trim()}catch{}return p.trim()},Aa=async(e,t,n)=>{var h;let a=(e||"https://api.openai.com/v1").replace(/\/+$/,"");if(a=a.replace(/\/chat\/completions$/,""),a.includes("intern-ai.org.cn")||n==="internai")return["Agents-A1","Atria-Dawn","Sage-A1.5","Sage-A1.5-Taiyi","Sage-S2.1-Flash","deepseek-v4.1-flash-1017","glm-5.3","intern-decision-4b","intern-s2","kimi-k3.1-pro","qwen3.8-27b"];const i=n==="gemini"||a.includes("generativelanguage.googleapis.com"),r=n==="anthropic"||a.includes("api.anthropic.com");let l=a.endsWith("/models")?a:`${a}/models`;const o={"Content-Type":"application/json"},c=V(t);if(i){if(!c)throw new Error("API Key Google Gemini diperlukan untuk mengambil daftar model.");l=`${a.endsWith("/v1beta")?a:`${a}/v1beta`}/models?key=${encodeURIComponent(c)}`}else if(r){if(!c)throw new Error("API Key Anthropic diperlukan untuk mengambil daftar model.");o["x-api-key"]=c,o["anthropic-version"]="2023-06-01",o["anthropic-dangerous-direct-browser-access"]="true"}else c&&(o.Authorization=`Bearer ${c}`);try{const g=await fetch(l,{method:"GET",headers:o}),u=await g.text();if(!g.ok){let d="";try{const s=JSON.parse(u);d=((h=s==null?void 0:s.error)==null?void 0:h.message)||(s==null?void 0:s.message)||""}catch{d=u}throw new Error(`Gagal mengambil model (${g.status}): ${d||g.statusText}`)}const p=JSON.parse(u);if(!Array.isArray(p)&&Array.isArray(p==null?void 0:p.data))return p.data.map(d=>d.id||d.name||"").filter(Boolean);if(!Array.isArray(p)&&Array.isArray(p==null?void 0:p.models))return p.models.map(d=>{const s=d.id||d.name||"";return i?s.replace(/^models\//,""):s}).filter(Boolean);if(Array.isArray(p))return p.map(d=>typeof d=="string"?d:d.id||d.name||"").filter(Boolean)}catch(g){if(a.includes("intern-ai.org.cn"))return["Agents-A1","Atria-Dawn","Sage-A1.5","Sage-A1.5-Taiyi","Sage-S2.1-Flash","deepseek-v4.1-flash-1017","glm-5.3","intern-decision-4b","intern-s2","kimi-k3.1-pro","qwen3.8-27b"];const u=g instanceof Error?g.message:String(g);throw u.includes("Failed to fetch")||u.includes("NetworkError")?new Error("Koneksi ke endpoint /models terhalang kebijakan CORS browser atau server tidak aktif. Silakan pilih model dari daftar terkurasi atau ketik nama model secara manual."):g}return[]},ia=e=>{if(!e)return"";let t=e.replace(/\r\n/g,`
`).trim();const n=["Persona AI","AI Persona","Peran AI","Peran","Role","System Role","Konteks & Tujuan","Konteks","Context","Background","Latar Belakang","Tugas Utama","Tugas","Task","Objective","Tujuan","Goal","Variabel Input","Detail Masukan","Input Details","Instruksi Utama","Instruksi Khusus","Instruksi Tambahan","Instruksi","Instructions","Guidelines","Batasan Mutlak","Batasan & Kriteria","Batasan","Constraints","Hard Constraints","Format Output","Format Keluaran","Output Format","Deliverables","Target Audiens","Audiens Target","Target Audience","Audience","Nada Bicara","Gaya Bahasa","Tone of Voice","Tone & Style","Tone","Voice","Attention","Interest","Desire","Action","Hook","Story","Offer","Call to Action","Pencahayaan","Sudut Kamera","Optik","Lighting","Camera","Catatan Khusus","Important Notes","Catatan","Notes"],a=new RegExp(`([^
])
((?:[-*•#>]+\\s*)?(?:${n.join("|")}):)`,"gi");return t=t.replace(a,`$1

$2`),t=t.replace(/([^\n])\n((?:Step|Langkah|\d+\.)\s+[A-Za-z0-9\s()&/._-]{1,30}:)/gi,`$1

$2`),t=t.replace(/([^\n])\n(\[(?:Intro|Verse|Pre-Chorus|Chorus|Bridge|Guitar Solo|Outro|Drop|Hook|Build-up)[^\]]*\])/gi,`$1

$2`),t=t.replace(/\n{3,}/g,`

`),t.trim()},q=e=>{if(!e)return"";let t=e.trim();return t=t.replace(/^```[a-zA-Z0-9_-]*\s*\r?\n?/i,""),t=t.replace(/\r?\n?```\s*$/g,""),t=t.replace(/^(?:Tentu,?\s*)?(?:Berikut\s+(?:adalah\s+)?(?:hasil\s+)?(?:versi\s+)?(?:prompt\s+)?(?:yang\s+)?(?:telah\s+)?(?:disempurnakan|dioptimalkan|ditingkatkan|diperbarui)?[^:\n]*:?\s*[\r\n]+)/i,""),t=t.replace(/^(?:Sure,?\s*)?(?:Here\s+(?:is|are)\s+(?:the\s+)?(?:enhanced|improved|refined|optimized)\s+prompt[^:\n]*:?\s*[\r\n]+)/i,""),t=t.replace(/\*\*([^*]+)\*\*/g,"$1"),t=t.replace(/__([^_]+)__/g,"$1"),(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))&&(t=t.slice(1,-1).trim()),ia(t)},Ia=async(e,t,n,a="id")=>{const i=a==="id",r=/few-shot|contoh masukan|contoh keluaran|sample input|expected output/i.test(e);let l=i?"Anda adalah seorang ahli prompt engineering handal. Tugas Anda adalah memberikan satu saran isian terbaik dan spesifik untuk kolom formulir yang diminta. Berikan HANYA nilai isian langsung tanpa pembuka, tanpa tanda kutip, tanpa format tebal (**), dan tanpa penjelasan tambahan.":"You are an expert AI prompt engineer. Provide ONLY the direct, high-quality, specific value for the requested form field. Do not include markdown quotes, bold asterisks (**), pleasantries, or preamble.";r&&(l=i?'Anda adalah Master Prompt Engineer spesialis Few-Shot In-Context Learning. Tugas Anda adalah menyusun contoh acuan (few-shot reference exemplar) yang konkret, realistis, dan mencerminkan standar emas. Berikan HANYA teks contoh acuan langsung tanpa kata pengantar ("Berikut adalah..."), tanpa tanda kutip pembungkus, dan tanpa format tebal berlebihan.':"You are a Master Prompt Engineer specializing in Few-Shot In-Context Learning. Provide ONLY the direct, realistic, gold-standard reference exemplar text without introductory preamble or markdown quotes.");let o=i?`Kerangka Kerja: "${t}"
Kolom yang perlu diisi: "${e}"
Konteks isian kolom lain yang sudah ada:
${n||"(Belum ada kolom lain yang diisi)"}

Berikan satu saran isian teks biasa yang kreatif, kontekstual, dan bernilai tinggi:`:`Framework: "${t}"
Target Field: "${e}"
Other Filled Context:
${n||"(No other fields filled yet)"}

Provide one creative, highly specific, and relevant plain-text value for this field:`;r&&(o=i?`Kerangka Kerja: "${t}"
Target Komponen Few-Shot: "${e}"
Konteks parameter framework yang sudah terisi:
${n||"(Gunakan konteks umum kerangka kerja)"}

Susun satu contoh ${e} yang konkret, realistis, dan siap ditiru oleh model AI:`:`Framework: "${t}"
Target Few-Shot Component: "${e}"
Existing Framework Context:
${n||"(Use general framework context)"}

Draft one concrete, realistic ${e} exemplar ready for in-context learning:`);const c=await F(o,l);return q(c)},wa=async(e,t,n="id")=>{const a=n==="id",i=a?`Anda adalah Master Prompt Optimizer & AI Prompt Architect Kelas Dunia. Tugas Anda adalah menyempurnakan prompt yang diberikan agar lebih tajam, kaya konteks terarah, minim ambiguitas, dan menghasilkan output maksimal pada LLM modern.

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

     Output Format: [deliverables specification]`,r=a?`Kerangka Kerja: "${t}"
Prompt Awal:
"""
${e}
"""

Tingkatkan dan poles prompt di atas menjadi versi paling optimal. Pastikan setiap bagian/paragraf dipisahkan oleh satu baris kosong agar sangat rapi, nyaman dibaca, dan mudah ditinjau sebelum disalin:`:`Framework: "${t}"
Initial Prompt:
"""
${e}
"""

Enhance and refine the prompt above to the absolute highest standard. Ensure every section and paragraph is separated by an empty line so it is exceptionally clean, comfortable to read, and easy to review before copying:`,l=await F(r,i);return q(l)},va=async(e,t,n="id")=>{const a=n==="id",i=a?`Anda adalah Evaluator Kualitas Prompt AI. Analisis prompt yang diberikan dan berikan penilaian dalam format JSON baku persis seperti berikut:
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
Skor berupa bilangan bulat 0 sampai 100. Kembalikan HANYA string JSON yang valid.`:"You are an AI Prompt Quality Evaluator. Analyze the prompt and return pure JSON format with clarityScore (0-100), specificityScore (0-100), overallScore (0-100), feedback (string), suggestions (string array). Return pure JSON only.",r=a?`Kerangka Kerja: "${t}"
Prompt yang dievaluasi:
"""
${e}
"""`:`Framework: "${t}"
Prompt to evaluate:
"""
${e}
"""`;try{const o=(await F(r,i)).replace(/```json/gi,"").replace(/```/g,"").trim(),c=JSON.parse(o);return{clarityScore:typeof c.clarityScore=="number"?c.clarityScore:80,specificityScore:typeof c.specificityScore=="number"?c.specificityScore:85,overallScore:typeof c.overallScore=="number"?c.overallScore:83,feedback:c.feedback||(a?"Prompt tersusun dengan baik dan jelas.":"Well-structured prompt."),suggestions:Array.isArray(c.suggestions)?c.suggestions:[]}}catch(l){return console.warn("Fallback parsing quality analysis result:",l),{clarityScore:82,specificityScore:86,overallScore:84,feedback:a?"Prompt memiliki struktur yang cukup baik dan dapat dieksekusi dengan baik oleh AI.":"The prompt has solid clarity and structure.",suggestions:a?["Pertimbangkan untuk menambahkan contoh keluaran (*few-shot example*) untuk hasil yang lebih spesifik."]:["Consider adding an example output to guide the model further."]}}},Ca=async e=>{var l,o,c,h;const t=(e.model||"").trim();if(!t||t==="__custom_empty__")return{success:!1,message:"Harap tentukan atau ketik nama model AI terlebih dahulu sebelum melakukan uji coba koneksi."};const n=Z[e.provider]||Z.custom,a=V(e.apiKey),i=ea(a,e.provider);if(i)return{success:!1,isAuthError:!0,message:`Format API Key tidak cocok dengan ${n.name}!

⚠️ ${i}

Pastikan Anda menyalin kunci dari dashboard resmi yang sesuai (${n.docUrl||"dashboard provider"}).`};if(n.requiresApiKey&&!a)return{success:!1,isAuthError:!0,message:`API Key untuk ${n.name} belum diisi.

Harap salin API Key dari dashboard provider dan tempel di kolom "API Key" sebelum melakukan uji coba koneksi.`};const r={...e,apiKey:a,model:t};try{return{success:!0,message:`Koneksi berhasil! Respons model: "${(await F("Ping",'Balas hanya kata "OK".',r,{maxTokens:8,temperature:.1})).slice(0,100)}"`}}catch(g){const u=g instanceof Error?g.message:String(g);if(u.includes("429")||u.toLowerCase().includes("quota")||u.toLowerCase().includes("rate limit")){const d=((l=e.baseUrl)==null?void 0:l.includes("intern-ai.org.cn"))||e.provider==="internai"?"Endpoint & API Key BERHASIL terhubung dan terotentikasi oleh server Shanghai AI Lab! Namun akun Anda saat ini kehabisan saldo kredit (HTTP 429 Quota Exceeded). Silakan cek saldo kredit di dashboard https://discovery.intern-ai.org.cn/ (menu Usage/API Key) atau coba model hemat seperti Agents-A1 atau Sage-A1.5 yang membutuhkan hanya 4 kredit.":"Endpoint & API Key BERHASIL terhubung dan terotentikasi! Namun akun Anda di provider mengalami limitasi kuota atau saldo kredit habis (HTTP 429 Quota Exceeded). Silakan periksa sisa kuota/billing di dashboard provider Anda.";return{success:!1,isQuotaExceeded:!0,message:`${u}

--- Diagnostik: ${d}`}}if(u.includes("401")||u.includes("403")||u.toLowerCase().includes("invalid token")||u.toLowerCase().includes("invalid_api_key")||u.toLowerCase().includes("unauthorized")||u.toLowerCase().includes("forbidden")){const p=a.length,d=((o=e.baseUrl)==null?void 0:o.includes("intern-ai.org.cn"))||e.provider==="internai";let s="";return p===0?s="API Key kosong. Harap isi API Key dari dashboard provider Anda.":d?s=`API Key terdeteksi (${p} karakter) namun ditolak server Intern-Discovery (Shanghai AI Lab).

📌 Mengapa error ini muncul di SEMUA model?
Karena HTTP 401 adalah penolakan otentikasi token akun di gateway server, sebelum server mengecek nama model apa pun.

💡 Panduan Perbaikan:
1. Buka https://discovery.intern-ai.org.cn/ dan masuk ke akun Anda
2. Klik tab "API Key" (di sebelah kiri tab "Models")
3. Buat API Key baru jika belum ada, atau klik tombol salin (copy) pada API Key aktif
4. Tempel di kolom API Key PromptMatrix (sistem otomatis membersihkan spasi/tanda kutip)
5. Pastikan yang disalin adalah API Key, bukan Session ID atau Cookie peramban`:s=`API Key terdeteksi (${p} karakter) namun ditolak server.

📌 Mengapa error ini muncul di SEMUA model?
Karena HTTP 401 adalah penolakan otentikasi token pada tingkat server, sebelum server memproses permintaan ke model spesifik.

💡 Panduan Perbaikan:
1. Pastikan API Key disalin lengkap dari dashboard ${n.name}
2. Periksa apakah key belum expired, dinonaktifkan, atau memiliki batasan IP
3. Pastikan Base API URL sesuai provider (saat ini: ${e.baseUrl})
4. Untuk gateway proxy/router (OneAPI/LiteLLM), pastikan token terdaftar di panel admin`,{success:!1,isAuthError:!0,message:`${u}

--- Diagnostik Autentikasi:
${s}`}}if(u.toLowerCase().includes("failed to fetch")||u.toLowerCase().includes("networkerror")||u.toLowerCase().includes("cors")){const p=((c=e.baseUrl)==null?void 0:c.includes("localhost"))||((h=e.baseUrl)==null?void 0:h.includes("127.0.0.1"));let d="";return p?d=`Tidak dapat terhubung ke server lokal ${e.baseUrl}.

Pastikan:
1. Server AI lokal (Ollama / LM Studio / vLLM) sedang berjalan
2. Port yang dikonfigurasi sudah benar
3. Server mengizinkan koneksi dari browser (CORS)`:d=`Tidak dapat terhubung ke endpoint ${e.baseUrl}.

Kemungkinan penyebab:
1. URL endpoint salah atau tidak aktif
2. Server memblokir permintaan dari browser (CORS restriction)
3. Jaringan internet terputus atau firewall memblokir`,{success:!1,message:`${u}

--- Diagnostik Jaringan:
${d}`}}return{success:!1,message:u||"Gagal terhubung ke API endpoint."}}},Me=new Set(["persona","context","task","constraints","output_format","audience","variable","custom"]),E=e=>typeof e!="string"?"":q(e).replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim(),Ee=e=>{const t=e.replace(/```json/gi,"").replace(/```/g,"").trim(),n=t.indexOf("{"),a=t.lastIndexOf("}");return n!==-1&&a>n?t.slice(n,a+1):t},Pa=async(e,t,n="id")=>{const a=n==="id",i=e.trim(),r=t==="skill"?a?`Target Mode adalah AGENT SKILL (SKILL.md). Anda WAJIB menyertakan:
  "skillName": "nama-skill-kebab-case-maks-64-karakter",
  "skillDescription": "deskripsi kapan AI agent harus mengaktifkan skill ini (maks 1024 karakter, jelas dan spesifik)",`:`Target Mode is AGENT SKILL (SKILL.md). You MUST include:
  "skillName": "kebab-case-skill-name-max-64-chars",
  "skillDescription": "clear trigger description explaining when an AI agent should invoke this skill (max 1024 chars)",`:a?"Target Mode adalah PROMPT STANDAR. Fokus pada kejelasan instruksi, batasan, dan format keluaran.":"Target Mode is STANDARD PROMPT. Focus on instruction clarity, constraints, and output format.",l=a?`Anda adalah Arsitek Prompt & Agent Skill Profesional. Tugas Anda mengubah ide singkat pengguna menjadi draft terstruktur untuk Blank Canvas.
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
  "fewShotOutput": "Contoh output ideal (opsional, kosongkan string jika tidak perlu)"${t==="skill"?`,
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
  "fewShotOutput": "Ideal expected output (optional, empty string if unnecessary)"${t==="skill"?`,
  "skillName": "kebab-case-skill-name",
  "skillDescription": "Use this skill when..."`:""}
}
Select 3 to 5 of the most relevant block types.`,o=a?`Ide pengguna:
"""
${i}
"""
Susun JSON draft Blank Canvas dalam Bahasa Indonesia.`:`User idea:
"""
${i}
"""
Compose the Blank Canvas draft JSON in English.`,c=await F(o,l);try{const h=Ee(c),g=JSON.parse(h);if(!g||typeof g!="object")throw new Error("Parsed draft is not an object.");const u=g,d=(Array.isArray(u.blocks)?u.blocks:[]).map(S=>{if(!S||typeof S!="object")return null;const I=S,T=typeof I.type=="string"?I.type.trim():"custom",O=Me.has(T)?T:"custom",v=E(I.value);if(!v)return null;const w=E(I.label);return{type:O,label:w||void 0,value:v}}).filter(S=>S!==null),s=E(u.title)||E(i).slice(0,60)||(a?"Draft Canvas AI":"AI Canvas Draft"),m=E(u.description),f=E(u.scratchpad),y=E(u.fewShotInput)||void 0,b=E(u.fewShotOutput)||void 0,P=E(u.skillName)||void 0,L=E(u.skillDescription)||void 0;return{title:s,description:m,scratchpad:f,blocks:d,fewShotInput:y,fewShotOutput:b,skillName:P,skillDescription:L}}catch(h){console.warn("Fallback parsing Canvas AI draft JSON:",h);const g=E(c);return{title:E(i).slice(0,60)||(a?"Draft Canvas AI":"AI Canvas Draft"),description:a?"Draft disusun otomatis dari ide pengguna.":"Draft generated automatically from user idea.",scratchpad:g,blocks:[]}}},ie=(e,t)=>typeof e!="number"||!Number.isFinite(e)?t:Math.max(0,Math.min(100,Math.round(e))),le=e=>{if(typeof e!="string")return"";let t=e.replace(/\r\n/g,`
`).replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim();return/^```[a-zA-Z0-9_-]*\s*\n/.test(t)&&/\n```$/.test(t)&&(t=t.replace(/^```[a-zA-Z0-9_-]*\s*\n/,"").replace(/\n```$/,"").trim()),t},Te=e=>Array.isArray(e)?e.map(t=>E(t)).filter(t=>t.length>0):[],pe=(e,t,n)=>{const a=Ae();a.title=e.title,a.description=e.description,a.targetMode=t,a.scratchpad=e.scratchpad,a.fewShotInput=e.fewShotInput||"",a.fewShotOutput=e.fewShotOutput||"",a.skillName=e.skillName||"",a.skillDescription=e.skillDescription||"",a.blocks=e.blocks.map(r=>Q(r.type,n,r.label,r.value));const i=Je(a,n);if(t==="skill"){const r=We(a,i,n);return le(Ge(r))}return le(i||e.scratchpad)},Ta=async(e,t,n,a="id")=>{const i=a==="id",r=e.trim(),l=he(r),o=t==="auto"?l:t,c=o==="skill"?i?`Karena target adalah AGENT SKILL (SKILL.md), evaluasi juga standar Open Agent Skills:
- YAML frontmatter wajib memiliki "name" (kebab-case, huruf kecil/angka/tanda hubung, maksimal 64 karakter) dan "description" pemicu yang jelas (maksimal 1024 karakter).
- Struktur bagian markdown harus jelas: ## Role & Trigger, ## Input Parameters, ## Execution Steps, dan ## Verification Checklist.
- Pastikan "upgradedDraft" menyertakan "skillName" dan "skillDescription", serta "upgradedFullText" adalah dokumen SKILL.md lengkap dengan YAML frontmatter (--- ... ---) dan isi markdown.`:`Because the target is AGENT SKILL (SKILL.md), also evaluate Open Agent Skills compliance:
- YAML frontmatter must include "name" (lowercase kebab-case, max 64 chars) and a clear trigger "description" (max 1024 chars).
- Markdown sections should clearly cover: ## Role & Trigger, ## Input Parameters, ## Execution Steps, and ## Verification Checklist.
- Ensure "upgradedDraft" includes "skillName" and "skillDescription", and "upgradedFullText" is a complete SKILL.md document with YAML frontmatter (--- ... ---) and markdown body.`:i?'Target adalah PROMPT STANDAR. Pastikan "upgradedFullText" adalah teks prompt siap pakai yang terstruktur rapi (pisahkan bagian dengan baris kosong ganda, tanpa markdown code fence pembungkus).':'Target is STANDARD PROMPT. Ensure "upgradedFullText" is a complete, ready-to-use prompt with clear sections separated by blank lines (no outer markdown code fence).',h=i?`Anda adalah Auditor & Arsitek Prompt/Agent Skill Senior. Tugas Anda:
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
}`,g=n.trim()?n.trim():i?"Tingkatkan kejelasan instruksi, batasan kualitas, dan struktur agar siap pakai.":"Improve instruction clarity, quality guardrails, and structure for production use.",u=i?`Mode Target: ${t==="auto"?`Otomatis (terdeteksi awal: ${l})`:o}
Tujuan Upgrade: ${g}

Konten yang diunggah:
"""
${r}
"""`:`Target Mode: ${t==="auto"?`Auto (initial detection: ${l})`:o}
Upgrade Goal: ${g}

Uploaded Content:
"""
${r}
"""`,p=await F(u,h);try{const d=Ee(p),s=JSON.parse(d);if(!s||typeof s!="object")throw new Error("Parsed upgrade analysis is not an object.");const m=s,f=m.detectedKind,y=t!=="auto"?t:f==="skill"||f==="prompt"?f:o,b=m.scores&&typeof m.scores=="object"?m.scores:{},P=ie(b.clarity,75),L=ie(b.specificity,72),S=ie(b.structure,74),I=Math.round((P+L+S)/3),T=ie(b.overall,I),O=Te(m.strengths),v=Te(m.weaknesses),w=E(m.upgradeSummary)||(i?"Struktur instruksi, kejelasan peran, dan batasan kualitas telah ditingkatkan.":"Instruction structure, role clarity, and quality constraints have been upgraded."),R=m.upgradedDraft&&typeof m.upgradedDraft=="object"?m.upgradedDraft:{},K=(Array.isArray(R.blocks)?R.blocks:[]).map(B=>{if(!B||typeof B!="object")return null;const G=B,x=typeof G.type=="string"?G.type.trim():"custom",z=Me.has(x)?x:"custom",X=E(G.value);if(!X)return null;const Y=E(G.label);return{type:z,label:Y||void 0,value:X}}).filter(B=>B!==null),C={title:E(R.title)||(i?"Hasil Upgrade Canvas":"Upgraded Canvas Draft"),description:E(R.description),scratchpad:E(R.scratchpad),blocks:K,fewShotInput:E(R.fewShotInput)||void 0,fewShotOutput:E(R.fewShotOutput)||void 0,skillName:E(R.skillName)||void 0,skillDescription:E(R.skillDescription)||void 0};let D=le(m.upgradedFullText);const A=y==="skill"&&!/^---\n[\s\S]*?\n---/.test(D);return(!D||A)&&(D=pe(C,y,a)),{detectedKind:y,scores:{clarity:P,specificity:L,structure:S,overall:T},strengths:O.length>0?O:[i?"Memiliki maksud dan arah tugas dasar yang dapat dikenali.":"Has an identifiable core objective and direction."],weaknesses:v.length>0?v:[i?"Dapat diperkuat dengan batasan eksplisit dan format keluaran yang lebih terstruktur.":"Can be strengthened with explicit constraints and a stricter output format."],upgradeSummary:w,upgradedDraft:C,upgradedFullText:D}}catch(d){console.warn("Fallback parsing uploaded content upgrade JSON:",d);const s=le(p),m={title:i?"Hasil Upgrade AI":"AI Upgraded Draft",description:i?"Hasil analisis dan peningkatan otomatis dari konten unggahan.":"Automated analysis and upgrade generated from uploaded content.",scratchpad:E(s||r),blocks:[]},f=o==="skill"&&!/^---\n[\s\S]*?\n---/.test(s)?pe(m,"skill",a):s||pe(m,o,a);return{detectedKind:o,scores:{clarity:74,specificity:70,structure:72,overall:72},strengths:[i?"Konten awal memiliki topik utama yang jelas untuk ditingkatkan.":"Original content has a clear core topic ready for refinement."],weaknesses:[i?"Struktur blok dan batasan eksplisit masih dapat diperkuat.":"Block structure and explicit guardrails can be further reinforced."],upgradeSummary:i?"Konten telah diproses ulang menjadi draf yang lebih rapi dan siap disunting di Canvas.":"Content has been refined into a cleaner draft ready for editing in Canvas.",upgradedDraft:m,upgradedFullText:f}}},Oa=async e=>{const{skillName:t,frameworkName:n="Custom Agent Skill",compiledPrompt:a="",field:i,existingTitle:r="",existingTagline:l="",existingDemoRequest:o="",language:c="id"}=e,h=c==="id",g=h?`Anda adalah Principal Product Architect & Spesialis Optimasi SEO & GEO (Generative Engine Optimization) untuk AI Agent Skills. Tugas Anda adalah merancang profil produk dan live demo berkualitas tinggi yang mudah ditemukan oleh mesin pencari web (Google, Bing) dan mesin jawaban AI (Perplexity, ChatGPT Search, Claude, Google AI Overviews) serta calon pembeli di marketplace digital.
ATURAN MUTLAK:
1. DILARANG menggunakan tanda em-dash (—). Gunakan koma, strip (-), atau tanda kurung.
2. DILARANG menggunakan kata klise generik AI seperti "Revolusioner", "Unleash", "Game-changer", "Delve", "Transformasi tanpa batas".
3. Gunakan kata kunci pencarian berniat tinggi (search intent): production agent skill, verified workflow, cross-runtime, deterministic, zero hallucination.
4. Buat kalimat padat, bernilai tinggi, dan memiliki definisi konkret (answer capsule) yang dapat dikutip langsung oleh LLM dan mesin pencari.`:`You are a Principal Product Architect and SEO/GEO (Generative Engine Optimization) Specialist for AI Agent Skills. Your mission is to craft commercial, discoverable product copy and real-world demo exemplars (Request and Result) optimized for web search engines (Google, Bing) and AI answer engines (Perplexity, ChatGPT Search, Claude, Google AI Overviews).
STRICT RULES:
1. NEVER use em-dashes (—). Use commas, hyphens (-), or parentheses.
2. NEVER use generic AI cliches such as "Revolutionary", "Unleash", "Game-changer", "Delve", "Tapestry".
3. Incorporate high-intent search keywords: production agent skill, deterministic workflow, cross-runtime, zero hallucination.
4. Provide concrete, quotable definition capsules and structured deliverables that search engines and AI agents can cite as authoritative sources.`;if(i==="name"){const s=h?`Nama Judul Skill: "${r||n||t}"
Konteks Prompt:
${a?a.slice(0,1e3):"(Kompiler otomatis)"}

Buat SATU nama identifier skill standar Open Agent Skills dalam format KEBAB-CASE murni (hanya huruf kecil a-z, angka 0-9, dan tanda hubung '-', maksimal 64 karakter, contoh: "nextjs-fullstack-architect" atau "seo-geo-content-engine").
HANYA kembalikan teks kebab-case saja tanpa tanda kutip, tanpa spasi, dan tanpa penjelasan:`:`Skill Title: "${r||n||t}"
Prompt Context:
${a?a.slice(0,1e3):"(Auto-compiled)"}

Generate ONE clean Open Agent Skills identifier name in pure KEBAB-CASE format (lowercase a-z, numbers 0-9, and '-' only, max 64 chars, e.g. "nextjs-fullstack-architect" or "seo-geo-content-engine").
Return ONLY the kebab-case identifier without quotes, without spaces, and without explanation:`,m=await F(s,g);return{name:q(m).toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"").slice(0,64)||"custom-agent-skill"}}if(i==="title"){const s=h?`Nama Kebab-Case Skill: "${t}"
Kerangka Kerja Terkait: "${n}"
Konteks Prompt Bawaan:
${a?a.slice(0,1500):"(Kompiler prompt otomatis)"}

Buat SATU judul produk komersial ramah SEO yang mengandung kata kunci pencarian berniat tinggi (maksimal 60 karakter, contoh: "Next.js Fullstack Production Agent Skill").
HANYA kembalikan teks judul saja tanpa tanda kutip dan tanpa penjelasan:`:`Kebab-Case Skill Name: "${t}"
Related Framework: "${n}"
Prompt Context:
${a?a.slice(0,1500):"(Auto-compiled prompt)"}

Generate ONE high-intent, SEO-friendly commercial title for an agent skill marketplace (max 60 chars, e.g. "Next.js Fullstack Production Agent Skill").
Return ONLY the title text without quotes or explanations:`,m=await F(s,g);return{title:q(m).replace(/^["']|["']$/g,"").trim()}}if(i==="tagline"){const s=h?`Nama Skill: "${r||t}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${a?a.slice(0,1500):""}

Buat SATU kalimat tagline bernilai tinggi dan ramah GEO (answer capsule, maksimal 120 karakter, fokus pada hasil kerja konkret yang diotomasi).
HANYA kembalikan teks tagline saja tanpa tanda kutip:`:`Skill Name: "${r||t}"
Framework: "${n}"
Prompt Context:
${a?a.slice(0,1500):""}

Create ONE punchy value-proposition tagline and GEO answer capsule stating the concrete buyer outcome (max 120 chars).
Return ONLY the tagline text without quotes:`,m=await F(s,g);return{tagline:q(m).replace(/^["']|["']$/g,"").trim()}}if(i==="tags"){const s=h?`Nama Skill: "${r||t}"
Kerangka Kerja: "${n}"

Berikan 5 hingga 7 tag penemuan SEO & marketplace tanpa tanda pagar (#), dipisahkan dengan koma.
Sertakan tag format ('open-agent-skills', 'agent-skill'), runtime ('claude-code', 'cursor-rules', 'antigravity'), serta kata kunci domain teknis.
HANYA kembalikan teks tag dipisahkan koma:`:`Skill Name: "${r||t}"
Framework: "${n}"

Provide 5 to 7 high-intent SEO & marketplace discovery tags without hash symbols (#), separated by commas.
Include format tags ('open-agent-skills', 'agent-skill'), runtime keywords ('claude-code', 'cursor-rules', 'antigravity'), and specific technical domain keywords.
Return ONLY comma-separated tags:`,m=await F(s,g);return{tags:q(m).replace(/^["']|["']$/g,"").trim().split(",").map(b=>b.trim().replace(/^#/,"")).filter(Boolean)}}if(i==="description"){const s=h?`Nama Produk Skill: "${r||t}"
Tagline: "${l||""}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${a?a.slice(0,2e3):""}

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
Didukung penuh pada 27 runtime Open Agent Skills termasuk Google Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, Codex, dan OpenCode.`:`Skill Product Name: "${r||t}"
Tagline: "${l||""}"
Framework: "${n}"
Prompt Context:
${a?a.slice(0,2e3):""}

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
Supported across 27 Open Agent Skills runtimes including Google Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, Codex, and OpenCode.`,m=await F(s,g);return{description:q(m).trim()}}if(i==="demoRequest"){const s=h?`Nama Skill: "${r||t}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${a?a.slice(0,1500):""}

Susun SATU contoh permintaan nyata (Demo Request) yang realistis, menantang, dan mencerminkan kueri pencarian pembeli potensial (high-intent user search query).
Permintaan harus spesifik, memberikan konteks masalah nyata, dan meminta solusi teknis lengkap.
HANYA kembalikan teks prompt permintaan tanpa kata pengantar:`:`Skill Name: "${r||t}"
Framework: "${n}"
Prompt Context:
${a?a.slice(0,1500):""}

Draft ONE realistic, high-intent demo request (the user prompt) that mirrors real customer search queries when looking for an agent solution.
It should provide realistic task context and request complete deliverables.
Return ONLY the prompt request text without preamble:`,m=await F(s,g);return{demoRequest:q(m).trim()}}if(i==="demoResult"){const s=h?`Nama Skill: "${r||t}"
Kerangka Kerja: "${n}"
Permintaan Pengguna (Demo Request):
"${o||"Lakukan audit dan implementasi solusi sesuai standar arsitektur terbaik."}"
Konteks Prompt:
${a?a.slice(0,1500):""}

Susun SATU contoh hasil eksekusi (Demo Result) berstandar emas yang diberikan oleh AI Agent.
Hasil harus ramah GEO (mudah dikutip oleh Perplexity / SearchGPT) dan mencakup:
## Ringkasan Eksekutif
## Hasil Eksekusi / Spesifikasi Solusi
## Langkah Penerapan & Verifikasi Mutu
Minimal 700 karakter, terstruktur rapi, deterministik, dan konkret.
HANYA kembalikan teks output hasil tanpa kata pengantar:`:`Skill Name: "${r||t}"
Framework: "${n}"
User Request (Demo Request):
"${o||"Perform an audit and deliver the production solution following architecture best practices."}"
Prompt Context:
${a?a.slice(0,1500):""}

Draft ONE gold-standard execution result (Demo Result) delivered by the AI Agent.
It must be GEO-friendly (quotable by Perplexity / SearchGPT) and include:
## Executive Summary
## Deliverable / Solution Specification
## Quality Gate & Verification Steps
At least 700 characters, structured, concrete.
Return ONLY the output result markdown without preamble:`,m=await F(s,g);return{demoResult:q(m).trim()}}const u=h?`Nama Kebab-Case Skill: "${t}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${a?a.slice(0,2e3):""}

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
Kembalikan HANYA format JSON valid tanpa tanda pembungkus markdown quotes (\`\`\`json):`:`Kebab-Case Skill Name: "${t}"
Framework: "${n}"
Prompt Context:
${a?a.slice(0,2e3):""}

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
Return ONLY valid JSON without markdown codeblock wrapper (\`\`\`json):`,p=await F(u,g),d=p.replace(/^```json\s*/i,"").replace(/^```\s*/,"").replace(/\s*```$/,"").trim();try{const s=JSON.parse(d);return{title:typeof s.title=="string"?s.title.trim():void 0,tagline:typeof s.tagline=="string"?s.tagline.trim():void 0,tags:Array.isArray(s.tags)?s.tags.map(String):void 0,priceUsd:typeof s.priceUsd=="number"?s.priceUsd:14.99,description:typeof s.description=="string"?s.description.trim():void 0,demoRequest:typeof s.demoRequest=="string"?s.demoRequest.trim():void 0,demoResult:typeof s.demoResult=="string"?s.demoResult.trim():void 0}}catch{return{title:h?`Paket Spesialis ${n}`:`${n} Specialist Pack`,tagline:h?"Otomasi alur kerja prompt cerdas dan deterministik dengan panduan teruji.":"Automates intelligent, deterministic prompt workflows with production guardrails.",tags:["AI Agent","Prompt Engineering","Productivity"],priceUsd:14.99,description:p}}},$a=async(e,t,n="id")=>{const a=n==="id",i=a?`Anda adalah Copywriter Produk AI dan Penjualan Agent Skills berstandar tinggi. Buat teks promosi singkat, menarik, dan bernilai tinggi untuk mempromosikan paket skill ini kepada praktisi AI, kreator, dan engineer.
DILARANG menggunakan kata-kata klise seperti "Revolusioner", "Game-changer", "Unleash", atau tanda em-dash (—). Gunakan kalimat lugas, profesional, dan tajam.`:`You are an elite AI Product and Agent Skills copywriter. Create a concise, compelling, high-converting promotional post for this skill pack targeting AI practitioners, creators, and engineers.
DO NOT use overused AI cliches like "Revolutionary", "Game-changer", "Unleash", or em-dashes (—). Keep it crisp, professional, and punchy.`,r=a?`Nama Paket Skill: "${e}"
Ringkasan Kemampuan: "${t}"

Susun 1 draft posting promosi / pitch singkat (X / LinkedIn / Komunitas):
1. Hook pembuka yang menyorot masalah nyata (pain point) yang sering dihadapi.
2. Solusi konkret yang diberikan oleh paket skill ini dalam format 3 poin ringkas.
3. Call to Action (CTA) yang jelas.

Format teks polos yang rapi dan siap disalin:`:`Skill Pack Name: "${e}"
Capability Summary: "${t}"

Draft 1 concise promotional post / pitch hook (for X / LinkedIn / Communities):
1. Opening hook highlighting a real workflow pain point.
2. Concrete solution delivered by this skill pack in 3 bullet points.
3. Clear Call to Action (CTA).

Plain text format, cleanly formatted and ready to copy:`,l=await F(r,i);return q(l).trim()};export{Z as A,Ia as B,se as C,Pa as D,ka as E,Ae as F,wa as G,va as H,ua as I,ba as J,Ta as K,fa as a,Ca as b,Q as c,ea as d,he as e,Aa as f,De as g,ga as h,Sa as i,U as j,da as k,Oa as l,$a as m,pa as n,ma as o,Je as p,ha as q,ya as r,V as s,W as t,ra as u,ca as v,oa as w,We as x,la as y,Ge as z};
