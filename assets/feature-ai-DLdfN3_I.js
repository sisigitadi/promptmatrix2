var We=Object.defineProperty;var Ye=(a,t,n)=>t in a?We(a,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):a[t]=n;var ae=(a,t,n)=>Ye(a,typeof t!="symbol"?t+"":t,n);import{A as xe,t as le,a as _e,b as Be,c as Qe,d as Ze,e as Xe,f as ea}from"./data-localization-BEmRbY13.js";const F=a=>a?a.replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/\r\n/g,`
`).replace(/\r/g,`
`):"",Ca=(a,t,n,e,i,s,r,l)=>{var P;const c=t||"Prompt Framework",p=n||"General",m=e||void 0;let h="";const b=(a==null?void 0:a.ai_logic_description)||(a==null?void 0:a.logika_ai);b&&(l==="en"?h=xe[c]||`AI Persona: ${le(b.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,""),"en")}`:h=`Persona AI: ${b.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,"").trim()}`),h=F(h);let k=(a==null?void 0:a.components)||[];k.length===0&&((P=a==null?void 0:a.komponen_prompt)!=null&&P["VARIABEL INPUT"])&&(k=Object.entries(a.komponen_prompt["VARIABEL INPUT"]).map(([w,A])=>({...A,name:A.name||w})));let o=[];if(a!=null&&a.dynamicSubcomponents){const w=a.dynamicSubcomponents.trigger,A=String(i[w]||"");A&&a.dynamicSubcomponents.options[A]&&(o=a.dynamicSubcomponents.options[A])}const d=[...k,...o],f={},y=[];d.forEach(w=>{let A=i[w.name];if((A==="Lainnya..."||A==="Other...")&&(A=s[w.name]?`${A} (${s[w.name]})`:A),A!=null&&String(A).trim()!==""){const K=l==="en"?_e(w.label||w.name,"en"):w.label||w.name;let N=A;if(typeof A=="string"){const M=l==="en"?Be(A,"en"):A;N=F(M)}else Array.isArray(A)&&(N=A.map(M=>F(String(M))));f[K]=N,y.push(`${K}: ${Array.isArray(N)?N.join(", "):N}`)}});let g;if(a!=null&&a.konteks_tambahan_instruksi_khusus){const w=l==="en"?le(a.konteks_tambahan_instruksi_khusus,"en"):a.konteks_tambahan_instruksi_khusus;g=F(w),y.push(`${l==="id"?"Instruksi Tambahan":"Additional Instructions"}: ${g}`)}let v;const R=i.__few_shot_input,S=i.__few_shot_output;(R||S)&&(v={sample_input:R?F(String(R)):void 0,expected_output:S?F(String(S)):void 0});const O=[];h&&O.push({role:"system",content:h});const T=y.length>0?y.join(`

`):r?F(r):"Execute task according to framework specifications.";return O.push({role:"user",content:T}),{template:c,category:p,subcategory:m,language:l,persona:h,parameters:f,additional_instructions:g,few_shot:v,prompt:F(r),messages:O}},Oa=(a,t="full")=>{let n;t==="messages"?n={messages:a.messages}:t==="prompt_only"?n={prompt:a.prompt}:n=a;try{const e=JSON.stringify(n,null,2);return JSON.parse(e),e}catch(e){return console.warn("First serialization pass failed, applying strict ASCII/fallback sanitization:",e),JSON.stringify(n,(s,r)=>typeof r=="string"?F(r):r,2)}},ne=64,ce=1024,ge=/^[a-z0-9]+(?:-[a-z0-9]+)*$/,$=a=>F(a).replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim(),aa=(a,t)=>{const n=a.replace(/\s+/g," ").trim();if(n.length<=t)return n;const e=n.slice(0,Math.max(0,t-3)),i=e.lastIndexOf(" ");return`${(i>Math.floor(t*.6)?e.slice(0,i):e).trim()}...`},J=a=>`"${$(a).replace(/\s+/g," ").trim().replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`,Y=a=>{const t=$(a).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"");return t&&t.slice(0,ne).replace(/-+$/g,"")||"promptmatrix-agent-skill"},ta=(a,t)=>{var e;if(!a)return[];let n=a.components?[...a.components]:[];if(n.length===0&&((e=a.komponen_prompt)!=null&&e["VARIABEL INPUT"])&&(n=Object.entries(a.komponen_prompt["VARIABEL INPUT"]).map(([i,s])=>({...s,name:s.name||i}))),a.dynamicSubcomponents){const i=a.dynamicSubcomponents.trigger,s=String(t[i]??""),r=a.dynamicSubcomponents.options[s];s&&Array.isArray(r)&&(n=[...n,...r])}return n},Ta=a=>{const{framework:t,frameworkName:n,category:e,subcategory:i,formValues:s,customOtherValues:r,compiledPrompt:l,language:c,author:p="Sigit Adi (PromptMatrix)",version:m="1.0.0"}=a,h=n||"PromptMatrix Custom Skill",b=$(Xe(h,c)),k=Y(h),d=$(Qe(e||"General",c)),f=i?$(Ze(i,c)):"";let y="";const g=(t==null?void 0:t.ai_logic_description)||(t==null?void 0:t.logika_ai);if(g){const C=g.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,"").trim();c==="en"?y=$(xe[h]||`AI Persona: ${le(C,"en")}`):y=$(`Persona AI: ${C}`)}const v=(t==null?void 0:t.description)||"",R=$(ea(v,c,h)),S=f?`${d} (${f})`:d,O=c==="id"?`Gunakan skill ini saat pengguna membutuhkan workflow terstruktur untuk ${b} pada domain ${S}.`:`Use this skill when the user needs a structured workflow for ${b} in ${S}.`,T=R?`${R} ${O}`:`${b} workflow skill. ${O}`,P=aa($(T),ce),w=ta(t,s),A=[],K=new Set;w.forEach(C=>{K.add(C.name);let D=s[C.name];if(D==="Lainnya..."||D==="Other..."){const z=r[C.name];D=z?`${D} (${z})`:D}const se=$(c==="en"?_e(C.label||C.name,"en"):C.label||C.name);if(D!=null&&String(D).trim()!==""){const z=Array.isArray(D)?D.map(ue=>$(String(ue))).join(", "):$(typeof D=="string"&&c==="en"?Be(D,"en"):String(D));A.push(`- **${se}**: ${z}`)}else{const z=C.optional?c==="id"?"opsional":"optional":c==="id"?"isi sesuai konteks":"provide per context",ue=C.placeholder?` (${$(C.placeholder)})`:"";A.push(`- **${se}**: _${z}_${ue}`)}}),Object.entries(s).forEach(([C,D])=>{if(C==="__few_shot_input"||C==="__few_shot_output"||K.has(C)||D===void 0||D===null||String(D).trim()==="")return;const se=Array.isArray(D)?D.map(z=>$(String(z))).join(", "):$(String(D));A.push(`- **${$(C)}**: ${se}`)});let N="";t!=null&&t.konteks_tambahan_instruksi_khusus&&(N=$(c==="en"?le(t.konteks_tambahan_instruksi_khusus,"en"):t.konteks_tambahan_instruksi_khusus));const M=s.__few_shot_input?$(String(s.__few_shot_input)):"",x=s.__few_shot_output?$(String(s.__few_shot_output)):"",I=[y||(c==="id"?`Bertindak sebagai spesialis untuk menjalankan kerangka kerja ${b}.`:`Act as a domain specialist executing the ${b} workflow.`),"",c==="id"?`- **Pemicu Utama**: Aktifkan saat tugas berkaitan dengan ${b} (${S}).`:`- **Trigger Condition**: Activate when the task involves ${b} (${S}).`,c==="id"?`- **Format Keluaran Target**: ${(t==null?void 0:t.output)==="json_prompt"?"JSON terstruktur sesuai kontrak":"Respons terstruktur sesuai parameter"}.`:`- **Target Output Format**: ${(t==null?void 0:t.output)==="json_prompt"?"Structured JSON contract":"Structured response aligned with parameters"}.`].join(`
`),B=A.length>0?A.join(`
`):c==="id"?"- Tidak ada parameter wajib; gunakan konteks permintaan pengguna secara langsung.":"- No mandatory input variables; operate directly from the user request context.",q=$(l),j=c==="id"?["1. Validasi seluruh parameter masukan dan klarifikasi bagian yang belum terisi jika krusial.","2. Terapkan persona serta batasan instruksi di bawah ini secara konsisten.","3. Susun keluaran akhir menggunakan struktur kerja berikut:"]:["1. Validate all input parameters and clarify missing critical constraints before proceeding.","2. Apply the assigned role, constraints, and domain instructions consistently.","3. Produce the final deliverable following the compiled prompt contract below:"];N&&(j.push(""),j.push(c==="id"?`**Instruksi Khusus**: ${N}`:`**Additional Instructions**: ${N}`)),q&&(j.push(""),j.push("```text"),j.push(q),j.push("```"));const Q=j.join(`
`),ee=c==="id"?["- [ ] Seluruh parameter input utama telah tercermin pada hasil akhir.","- [ ] Format keluaran bersih, bebas placeholder kosong, dan siap pakai.","- [ ] Batasan keamanan, privasi, dan konsistensi fakta telah diperiksa."].join(`
`):["- [ ] Every filled input parameter is reflected accurately in the output.","- [ ] Output format is clean, free of unresolved placeholders, and ready to use.","- [ ] Constraints, edge cases, and factual accuracy have been verified."].join(`
`);let Z;if(M||x){const C=[];M&&(C.push(c==="id"?"### Contoh Masukan":"### Sample Input"),C.push("```text"),C.push(M),C.push("```")),x&&(C.length>0&&C.push(""),C.push(c==="id"?"### Contoh Keluaran yang Diharapkan":"### Expected Output"),C.push("```text"),C.push(x),C.push("```")),Z=C.join(`
`)}const Me=[`# ${b}`,"","## Role & Trigger",I,"","## Input Parameters",B,"","## Execution Steps",Q,"","## Verification Checklist",ee];return Z&&Me.push("","## Few-Shot Reference",Z),{name:k,description:P,license:"MIT",compatibility:"Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills runners.",metadata:{author:$(p),version:$(m),source:"PromptMatrix 2.0",category:d,language:c,framework:$(h)},body:Me.join(`
`).trim(),sections:{roleAndTrigger:I,inputParameters:B,executionSteps:Q,verificationChecklist:ee,fewShotReference:Z}}},$a=a=>{const t=[],n=[],e=a.name.trim(),i=a.description.trim(),s=a.body.trim();return e?(e.length>ne&&t.push(`Skill name exceeds ${ne} characters (${e.length}).`),ge.test(e)||t.push("Skill name must be lowercase kebab-case (a-z, 0-9, single hyphens only).")):t.push("Skill name is required."),i?i.length>ce&&t.push(`Skill description exceeds ${ce} characters (${i.length}).`):t.push("Skill description is required."),s||t.push("Skill Markdown body cannot be empty."),a.license.trim()||n.push("License field is empty; MIT is recommended."),i.length>0&&i.length<40&&n.push("Description is short; include clearer trigger conditions for agent discovery."),{valid:t.length===0,errors:t,warnings:n,nameLength:e.length,descriptionLength:i.length}},na=a=>`${["---",`name: ${a.name}`,`description: ${J(a.description)}`,`license: ${a.license||"MIT"}`,`compatibility: ${J(a.compatibility)}`,"metadata:",`  author: ${J(a.metadata.author)}`,`  version: ${J(a.metadata.version)}`,`  source: ${J(a.metadata.source)}`,`  category: ${J(a.metadata.category)}`,`  language: ${J(a.metadata.language)}`,`  framework: ${J(a.metadata.framework)}`,"---"].join(`
`)}

${a.body.trim()}
`,ia=new Set(["and","the","for","with","from","into","your"]),sa=["unlock","elevate","empower","delve","showcase","testament","landscape","journey","robust","game-changer","next-level","next-generation","seamless","seamlessly","cutting-edge","revolutionary","revolutionizing","ultimate","unleash","tapestry"],ra=new RegExp(`\\b(${sa.join("|")})\\b`,"gi"),oa=[{heading:"Role & Trigger",isPresent:(a,t)=>{var n,e;return/^##\s+(?:Role\s*&?\s*Trigger|When\s+to\s+(?:Activate|Use)|Trigger(?:\s+Condition)?|Activation(?:\s+Criteria)?|Role\s+and\s+Trigger)\b/im.test(a)||!!((e=(n=t.sections)==null?void 0:n.roleAndTrigger)!=null&&e.trim())}},{heading:"Input Parameters",isPresent:(a,t)=>{var n,e;return/^##\s+(?:Input\s+Parameters?|Parameters?|Inputs?|Input\s+Context|Input\s+Variables?|Configuration)\b/im.test(a)||!!((e=(n=t.sections)==null?void 0:n.inputParameters)!=null&&e.trim())||/(?:templates\/|sample-input|parameters?|input\s+context|variables?)/i.test(a)||/^##\s+Step\s+1\b/im.test(a)}},{heading:"Execution Steps",isPresent:(a,t)=>{var n,e;return/^##\s+(?:Execution\s+Steps?|Step\s+1\b|Workflow|Core\s+Workflow|Instructions?|Procedure)\b/im.test(a)||!!((e=(n=t.sections)==null?void 0:n.executionSteps)!=null&&e.trim())}},{heading:"Verification Checklist",isPresent:(a,t)=>{var n,e;return/^##\s+(?:Verification\s+Checklist|Quality\s+Checklist|Verification|Checklist)\b/im.test(a)||!!((e=(n=t.sections)==null?void 0:n.verificationChecklist)!=null&&e.trim())}}],La=(a,t)=>{const n=a.name.trim(),e=a.description.trim(),i=a.body.trim(),s=((t==null?void 0:t.tagline)??"").trim(),r=((t==null?void 0:t.demoRequest)??"").trim(),l=((t==null?void 0:t.demoResult)??"").trim(),c=(t==null?void 0:t.tags)??[],p=n.length>0&&n.length<=ne&&ge.test(n),m=e.length>=40&&e.length<=ce,h=oa.filter(M=>!M.isPresent(i,a)).map(M=>M.heading),b=h.length===0,k=[n,e,a.compatibility,i,s,r,l,c.join(" ")].join(`
`),o=(k.match(/\u2014/g)||[]).length,d=o===0,f=Array.from(new Set((k.match(ra)||[]).map(M=>M.toLowerCase()))),y=f.length===0,g=c.filter(M=>{const x=M.trim();return!x||x.startsWith("#")||ia.has(x.toLowerCase())||!ge.test(x)}),v=c.length>=3&&c.length<=7,R=v&&g.length===0,S=s.length>0,O=r.length>=25,T=/^##\s+Summary\b/im.test(l),P=l.length>=700&&T,w=[{id:"valid-name",label:"Valid kebab-case slug (<= 64 chars)",passed:p,detail:p?`${n} (${n.length}/${ne} chars)`:"Skill name must be non-empty lowercase kebab-case and at most 64 characters."},{id:"valid-description",label:"Discovery description (40-1024 chars)",passed:m,detail:m?`${e.length} chars (within 40-1024 limit)`:`Description is ${e.length} chars; target 40-1024 chars.`},{id:"required-sections",label:"Required SKILL.md playbook sections",passed:b,detail:b?"All 4 sections present (Role & Trigger, Input Parameters, Execution Steps, Verification Checklist).":`Missing sections: ${h.join(", ")}`},{id:"zero-em-dashes",label:"Zero em-dash characters (U+2014)",passed:d,detail:d?"No em-dash characters found.":`Found ${o} em-dash character(s); replace with commas, colons, or parentheses.`},{id:"zero-ai-buzzwords",label:"Zero banned AI marketing buzzwords",passed:y,detail:y?"Copy passes anti-buzzword check.":`Remove buzzwords: ${f.join(", ")}`},{id:"clean-tags",label:"Clean marketplace tags (3-7 kebab-case, no # or stopwords)",passed:R,detail:R?`${c.length} clean tags: ${c.join(", ")}`:v?`Invalid tag(s): ${g.join(", ")}`:`Expected 3-7 tags; received ${c.length}.`},{id:"tagline-present",label:"Marketplace tagline present",passed:S,detail:S?`${s.length} chars`:"Add a concise 1-sentence tagline describing the concrete skill outcome."},{id:"demo-request",label:"Step 3 demo request (>= 25 chars)",passed:O,detail:O?`${r.length} chars`:`Demo request is ${r.length} chars (minimum 25 chars).`},{id:"demo-result",label:"Step 3 demo result (>= 700 chars + ## Summary)",passed:P,detail:P?`${l.length} chars with ## Summary section`:`Demo result is ${l.length} chars (need >= 700 chars and a ## Summary heading).`}],A=w.length,K=w.filter(M=>M.passed).length;return{score:A>0?Math.round(K/A*100):0,passedCount:K,totalCount:A,checks:w}},Ma="__blank_canvas__",Ae="pm_blank_canvas_draft",Se="Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills runners.",te=64,he=1024,oe=[{type:"persona",labelId:"Persona AI",labelEn:"AI Persona",placeholderId:"Contoh: Senior Software Architect dengan pengalaman 10 tahun di sistem terdistribusi...",placeholderEn:"e.g. Senior Software Architect with 10 years of experience in distributed systems...",hintId:"Tetapkan peran, keahlian, dan sudut pandang model AI.",hintEn:"Define the role, expertise, and perspective of the AI model.",editableLabel:!1},{type:"context",labelId:"Konteks & Tujuan",labelEn:"Context & Goal",placeholderId:"Jelaskan latar belakang proyek, situasi saat ini, dan sasaran akhir yang ingin dicapai...",placeholderEn:"Describe project background, current situation, and the end objective...",hintId:"Berikan informasi situasi agar AI memahami ruang lingkup masalah.",hintEn:"Provide situational context so the AI understands the problem scope.",editableLabel:!1},{type:"task",labelId:"Tugas Utama",labelEn:"Core Task",placeholderId:"Uraikan tugas spesifik yang harus dikerjakan AI langkah demi langkah...",placeholderEn:"Specify the exact task the AI needs to execute step by step...",hintId:"Fokus pada aksi konkret yang diharapkan dari model.",hintEn:"Focus on the concrete action expected from the model.",editableLabel:!1},{type:"constraints",labelId:"Batasan & Kriteria",labelEn:"Constraints & Rules",placeholderId:"Contoh: Jangan mengarang fakta, hindari jargon berlebihan, maksimal 300 kata...",placeholderEn:"e.g. Do not fabricate facts, avoid unnecessary jargon, max 300 words...",hintId:"Tetapkan pagar pengaman, larangan, dan syarat kualitas.",hintEn:"Set guardrails, exclusions, and quality criteria.",editableLabel:!1},{type:"output_format",labelId:"Format Output",labelEn:"Output Format",placeholderId:"Contoh: Tabel Markdown dengan 3 kolom, JSON valid, atau poin bernomor...",placeholderEn:"e.g. 3-column Markdown table, valid JSON, or numbered action items...",hintId:"Tentukan struktur visual atau format data dari hasil akhir.",hintEn:"Specify the visual structure or data format of the final output.",editableLabel:!1},{type:"audience",labelId:"Target Audiens",labelEn:"Target Audience",placeholderId:"Contoh: Manajer produk non-teknis, developer pemula, atau eksekutif C-level...",placeholderEn:"e.g. Non-technical product managers, junior developers, or C-level executives...",hintId:"Sesuaikan tingkat kedalaman bahasa dengan pembaca akhir.",hintEn:"Tailor vocabulary and depth to the intended reader.",editableLabel:!1},{type:"variable",labelId:"Variabel Input",labelEn:"Input Variable",placeholderId:"Masukkan nilai data, cuplikan teks, atau parameter khusus untuk diproses...",placeholderEn:"Provide input data, source text snippet, or custom parameter to process...",hintId:"Label dapat diubah sesuai nama variabel atau data masukan Anda.",hintEn:"Label can be edited to match your custom input variable name.",editableLabel:!0},{type:"custom",labelId:"Bagian Kustom",labelEn:"Custom Section",placeholderId:"Isi instruksi atau referensi tambahan sesuai kebutuhan spesifik Anda...",placeholderEn:"Enter additional instructions or references tailored to your workflow...",hintId:"Label bebas disesuaikan untuk kebutuhan blok apa pun.",hintEn:"Label can be freely customized for any section you need.",editableLabel:!0}],la=new Set(oe.map(a=>a.type)),u=a=>F(a).replace(/\u2014/g,", ").replace(/\u2013/g,"-"),Ie=a=>{if(typeof a=="number"&&Number.isFinite(a)&&a>=0)return Number(a.toFixed(2));if(typeof a=="string"&&a.trim()){const t=Number(a.trim());if(Number.isFinite(t)&&t>=0)return Number(t.toFixed(2))}},we=(a,t)=>{const n=a.replace(/\s+/g," ").trim();if(n.length<=t)return n;const e=n.slice(0,Math.max(0,t-3)),i=e.lastIndexOf(" ");return`${(i>Math.floor(t*.6)?e.slice(0,i):e).trim()}...`},ie=a=>oe.find(n=>n.type===a)??oe[oe.length-1],je=a=>{const t=Math.random().toString(36).slice(2,8),n=Date.now().toString(36);return`canvas_${a}_${n}_${t}`},X=(a,t,n,e)=>{const i=ie(a),s=t==="id"?i.labelId:i.labelEn,r=n&&n.trim()?u(n.trim()):s;return{id:je(a),type:a,label:r,value:e?u(e):"",isCustomLabel:i.editableLabel}},ve=()=>({title:"",description:"",targetMode:"prompt",scratchpad:"",blocks:[],fewShotInput:"",fewShotOutput:"",skillName:"",skillDescription:"",skillCompatibility:Se,skillTagline:"",skillPriceUsd:void 0,skillTags:"",skillDemoRequest:"",skillDemoResult:"",updatedAt:Date.now()}),Fe=a=>{if(!a||typeof a!="object")return null;const t=a,n=typeof t.type=="string"?t.type:"custom",e=la.has(n)?n:"custom",i=ie(e),s=typeof t.id=="string"&&t.id.trim()?u(t.id.trim()):je(e),r=typeof t.label=="string"&&t.label.trim()?u(t.label):i.labelId,l=typeof t.value=="string"?u(t.value):"",c=typeof t.isCustomLabel=="boolean"?t.isCustomLabel:i.editableLabel;return{id:s,type:e,label:r,value:l,isCustomLabel:c}},Ra=()=>{const a=ve();if(typeof window>"u"||typeof localStorage>"u")return a;try{const t=localStorage.getItem(Ae);if(!t)return a;const n=JSON.parse(t);if(!n||typeof n!="object")return a;const e=n,i=e.targetMode==="skill"?"skill":"prompt",s=Array.isArray(e.blocks)?e.blocks.map(r=>Fe(r)).filter(r=>r!==null):[];return{title:typeof e.title=="string"?u(e.title):"",description:typeof e.description=="string"?u(e.description):"",targetMode:i,scratchpad:typeof e.scratchpad=="string"?u(e.scratchpad):"",blocks:s,fewShotInput:typeof e.fewShotInput=="string"?u(e.fewShotInput):"",fewShotOutput:typeof e.fewShotOutput=="string"?u(e.fewShotOutput):"",skillName:typeof e.skillName=="string"?u(e.skillName):"",skillDescription:typeof e.skillDescription=="string"?u(e.skillDescription):"",skillCompatibility:typeof e.skillCompatibility=="string"&&e.skillCompatibility.trim()?u(e.skillCompatibility):Se,skillTagline:typeof e.skillTagline=="string"?u(e.skillTagline):"",skillPriceUsd:Ie(e.skillPriceUsd),skillTags:typeof e.skillTags=="string"?u(e.skillTags):"",skillDemoRequest:typeof e.skillDemoRequest=="string"?u(e.skillDemoRequest):"",skillDemoResult:typeof e.skillDemoResult=="string"?u(e.skillDemoResult):"",updatedAt:typeof e.updatedAt=="number"&&Number.isFinite(e.updatedAt)?e.updatedAt:Date.now()}}catch(t){return console.warn("Failed to load Blank Canvas draft from localStorage:",t),a}},Ka=a=>{if(!(typeof window>"u"||typeof localStorage>"u"))try{const t={...a,skillTagline:typeof a.skillTagline=="string"?u(a.skillTagline):"",skillPriceUsd:Ie(a.skillPriceUsd),skillTags:typeof a.skillTags=="string"?u(a.skillTags):"",skillDemoRequest:typeof a.skillDemoRequest=="string"?u(a.skillDemoRequest):"",skillDemoResult:typeof a.skillDemoResult=="string"?u(a.skillDemoResult):"",updatedAt:a.updatedAt||Date.now()};localStorage.setItem(Ae,JSON.stringify(t))}catch(t){console.warn("Failed to save Blank Canvas draft to localStorage:",t)}},Da=()=>{if(!(typeof window>"u"||typeof localStorage>"u"))try{localStorage.removeItem(Ae)}catch(a){console.warn("Failed to clear Blank Canvas draft from localStorage:",a)}},Ea=a=>!!(a.title.trim()||a.description.trim()||a.scratchpad.trim()||a.fewShotInput.trim()||a.fewShotOutput.trim()||a.skillName.trim()||a.skillDescription.trim()||(a.skillTagline||"").trim()||typeof a.skillPriceUsd=="number"||(a.skillTags||"").trim()||(a.skillDemoRequest||"").trim()||(a.skillDemoResult||"").trim()||a.blocks.length>0),ca=(a,t)=>{const n=[],e=a.blocks.filter(l=>l.value.trim().length>0);e.forEach(l=>{const c=ie(l.type),p=t==="id"?c.labelId:c.labelEn,m=u(l.label.trim())||p,h=u(l.value.trim());n.push(`${m}: ${h}`)});const i=u(a.scratchpad.trim());if(i)if(e.length>0){const l=t==="id"?"Instruksi Utama":"Core Instructions";n.push(`${l}:
${i}`)}else n.push(i);const s=u(a.fewShotInput.trim()),r=u(a.fewShotOutput.trim());if(s){const l=t==="id"?"Contoh Masukan":"Sample Input";n.push(`${l}:
${s}`)}if(r){const l=t==="id"?"Contoh Keluaran yang Diharapkan":"Expected Output";n.push(`${l}:
${r}`)}return u(n.join(`

`))},Na=(a,t,n)=>{const e=u(a.title.trim())||(n==="id"?"Canvas Kosong":"Blank Canvas"),i=n==="id"?"Canvas Kosong":"Blank Canvas",s=a.targetMode==="skill"?"Agent Skill (SKILL.md)":"Custom Prompt",r=a.blocks.filter(g=>g.value.trim().length>0),l=r.filter(g=>g.type==="persona"),c=u(l.map(g=>g.value.trim()).join(`

`)),p={},m=[];r.forEach(g=>{const v=ie(g.type),R=n==="id"?v.labelId:v.labelEn,S=u(g.label.trim())||R,O=u(g.value.trim());let T=S,P=2;for(;Object.prototype.hasOwnProperty.call(p,T);)T=`${S} (${P})`,P+=1;p[T]=O,g.type!=="persona"&&m.push(`${S}: ${O}`)});const h=u(a.scratchpad.trim());if(h){const g=n==="id"?"Instruksi Utama":"Core Instructions";m.push(`${g}:
${h}`)}const b=u(a.fewShotInput.trim()),k=u(a.fewShotOutput.trim()),o=b||k?{sample_input:b||void 0,expected_output:k||void 0}:void 0,d=[];c&&d.push({role:"system",content:c});const f=u(t.trim()),y=n==="id"?"Jalankan instruksi sesuai spesifikasi Canvas Kosong.":"Execute task according to Blank Canvas specifications.";return d.push({role:"user",content:m.length>0?m.join(`

`):f||y}),{template:e,category:i,subcategory:s,language:n,persona:c,parameters:p,additional_instructions:h||void 0,few_shot:o,prompt:f,messages:d}},da=(a,t,n)=>{const e=u(a.title.trim())||(n==="id"?"Skill Canvas Kustom":"Custom Canvas Skill"),i=a.skillName.trim()||a.title.trim()||"custom-canvas-skill",s=Y(i).slice(0,te),r=u(a.description.trim()),l=u(a.skillDescription.trim()),c=n==="id"?`Gunakan skill ini saat pengguna membutuhkan alur kerja terstruktur untuk ${e}.`:`Use this skill when the user needs a structured workflow for ${e}.`,p=l||(r?`${r} ${c}`:c),m=we(u(p),he),h=u(a.skillCompatibility.trim())||Se,b=a.blocks.filter(I=>I.value.trim().length>0),k=b.filter(I=>I.type==="persona"),o=b.filter(I=>I.type==="output_format"),d=b.filter(I=>I.type==="constraints"),f=k.length>0?u(k.map(I=>I.value.trim()).join(" ")):n==="id"?`Bertindak sebagai spesialis domain untuk menjalankan skill ${e}.`:`Act as a domain specialist executing the ${e} skill.`,y=l||r||e,g=o.length>0?u(o.map(I=>I.value.trim()).join("; ")):n==="id"?"Respons terstruktur sesuai parameter dan instruksi.":"Structured response aligned with parameters and instructions.",v=[f,"",n==="id"?`- **Pemicu Utama**: ${y}`:`- **Trigger Condition**: ${y}`,n==="id"?`- **Format Keluaran Target**: ${g}`:`- **Target Output Format**: ${g}`].join(`
`),R=b.map(I=>{const B=ie(I.type),q=n==="id"?B.labelId:B.labelEn,j=u(I.label.trim())||q,Q=u(I.value.trim());return`- **${j}**: ${Q}`}),S=R.length>0?R.join(`
`):n==="id"?"- Tidak ada blok parameter khusus; jalankan langsung berdasarkan konteks permintaan pengguna.":"- No dedicated parameter blocks defined; operate directly from the user request context.",O=u(a.scratchpad.trim()),T=u(t.trim()),P=n==="id"?["1. Tinjau seluruh konteks, variabel masukan, dan batasan yang ditetapkan.","2. Ikuti instruksi inti secara berurutan tanpa melewati langkah verifikasi.","3. Hasilkan keluaran akhir mengikuti spesifikasi prompt di bawah ini:"]:["1. Review all context, input variables, and constraints defined in this skill.","2. Follow the core instructions sequentially without skipping verification steps.","3. Produce the final deliverable matching the prompt specification below:"];O&&b.length>0&&(P.push(""),P.push(n==="id"?`**Instruksi Scratchpad**: ${O}`:`**Scratchpad Instructions**: ${O}`)),T&&(P.push(""),P.push("```text"),P.push(T),P.push("```"));const w=P.join(`
`),A=n==="id"?["- [ ] Seluruh blok parameter dan instruksi inti telah dipenuhi.","- [ ] Format keluaran bersih, bebas placeholder kosong, dan siap digunakan.","- [ ] Fakta, konsistensi, serta keamanan informasi telah divalidasi."]:["- [ ] Every defined parameter block and core instruction is satisfied.","- [ ] Output format is clean, free of unresolved placeholders, and ready to use.","- [ ] Factual accuracy, consistency, and safety constraints are verified."];if(d.length>0){const I=u(d.map(B=>B.value.trim()).join("; "));A.push(n==="id"?`- [ ] Batasan khusus dipatuhi: ${I}`:`- [ ] Custom constraints honored: ${I}`)}const K=A.join(`
`),N=u(a.fewShotInput.trim()),M=u(a.fewShotOutput.trim());let x;if(N||M){const I=[];N&&(I.push(n==="id"?"### Contoh Masukan":"### Sample Input"),I.push("```text"),I.push(N),I.push("```")),M&&(I.length>0&&I.push(""),I.push(n==="id"?"### Contoh Keluaran yang Diharapkan":"### Expected Output"),I.push("```text"),I.push(M),I.push("```")),x=I.join(`
`)}const H=[`# ${e}`,"","## Role & Trigger",v,"","## Input Parameters",S,"","## Execution Steps",w,"","## Verification Checklist",K];return x&&H.push("","## Few-Shot Reference",x),{name:s,description:m,license:"MIT",compatibility:h,metadata:{author:"Sigit Adi (PromptMatrix)",version:"1.0.0",source:"PromptMatrix 2.0 (Blank Canvas)",category:n==="id"?"Canvas Kosong":"Blank Canvas",language:n,framework:e},body:H.join(`
`).trim(),sections:{roleAndTrigger:v,inputParameters:S,executionSteps:w,verificationChecklist:K,fewShotReference:x}}},Re=a=>{if(!a)return"";const t=a.trim().replace(/^.*[\\/]/,"");return u(t.replace(/\.[^.]+$/,""))},pe=a=>{const t=a.split(`
`);for(const n of t){const e=u(n.replace(/^#+\s*/,"").replace(/^[-*]\s*/,"").trim());if(e&&e!=="---")return we(e,60)}return""},be=a=>{const t=a.trim().toLowerCase();return/^(?:few[\s-]*shot.*input|sample\s+input|contoh\s+masukan)$/.test(t)?"few_shot_input":/^(?:few[\s-]*shot.*output|expected\s+output|contoh\s+keluaran(?:\s+yang\s+diharapkan)?)$/.test(t)?"few_shot_output":/^(?:core\s+instructions?|instructions?|instruksi\s+utama|scratchpad)$/.test(t)?"scratchpad":/(?:persona|role|peran)/.test(t)?"persona":/(?:context|konteks|background|latar\s+belakang|goal|tujuan)/.test(t)?"context":/(?:input\s*parameters?|parameters?|variable|variabel|inputs?)/.test(t)?"variable":/(?:constraints?|rules?|batasan|kriteria|guardrails?)/.test(t)?"constraints":/(?:output\s*format|format\s*(?:output|keluaran)|deliverables?|^output$)/.test(t)?"output_format":/(?:audience|audiens)/.test(t)?"audience":/(?:execution\s*steps?|steps?|task|tugas|workflow|langkah)/.test(t)?"task":"custom"},ua=a=>{const t=a.split(`
`);let n="",e="",i="";const s=r=>{const l=r.trim();return l.startsWith('"')&&l.endsWith('"')||l.startsWith("'")&&l.endsWith("'")?l.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`).replace(/\\\\/g,"\\").trim():l};for(const r of t){const l=r.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);if(!l)continue;const c=l[1].toLowerCase(),p=u(s(l[2]));c==="name"&&p?n=p:c==="description"&&p?e=p:c==="compatibility"&&p&&(i=p)}return{name:n,description:e,compatibility:i}},pa=a=>{const t=a.trim(),n=l=>u(l.replace(/^```[a-zA-Z0-9_-]*\s*\n?/gm,"").replace(/\n?```\s*$/gm,"").trim()),e=t.match(/(?:###\s*(?:Sample\s+Input|Contoh\s+Masukan)|(?:Sample\s+Input|Contoh\s+Masukan)\s*:)\s*\n?([\s\S]*?)(?=(?:###\s*(?:Expected\s+Output|Contoh\s+Keluaran)|(?:Expected\s+Output|Contoh\s+Keluaran)[^\n]*:)|$)/i),i=t.match(/(?:###\s*(?:Expected\s+Output|Contoh\s+Keluaran[^\n]*)|(?:Expected\s+Output|Contoh\s+Keluaran[^\n]*)\s*:)\s*\n?([\s\S]*)$/i),s=e?n(e[1]):"",r=i?n(i[1]):"";return!s&&!r&&t?{input:n(t),output:""}:{input:s,output:r}},ma=a=>{const t=a.trim(),n=t.match(/###\s*The\s+Request\s*\n([\s\S]*?)(?=###\s*The\s+Result\b|$)/i),e=t.match(/###\s*The\s+Result\s*\n([\s\S]*)$/i);return{request:n?u(n[1].trim()):"",result:e?u(e[1].trim()):""}},Ke=(a,t)=>{const n=a.split(`
`);let e="";const i=[],s=[];let r=null;for(const o of n){const d=!e&&!r?o.match(/^#\s+(.+)$/):null;if(d){e=u(d[1].trim());continue}const f=o.match(/^##\s+(.+)$/);if(f){r&&s.push(r),r={heading:u(f[1].trim()),lines:[]};continue}r?r.lines.push(o):i.push(o)}r&&s.push(r);const l=[],c=[];let p="",m="",h="",b="";const k=u(i.join(`
`).trim());k&&c.push(k);for(const o of s){const d=o.lines.join(`
`).trim(),f=u(d);if(!f)continue;if(/see\s+it\s+in\s+action/i.test(o.heading)){const g=ma(d);g.request&&!h&&(h=g.request),g.result&&!b&&(b=g.result);continue}if(/few[\s-]*shot/i.test(o.heading)){const g=pa(d);g.input&&!p&&(p=g.input),g.output&&!m&&(m=g.output);continue}const y=be(o.heading);y==="scratchpad"?c.push(f):y==="few_shot_input"?p=p||f:y==="few_shot_output"?m=m||f:y==="custom"?l.push(X("custom",t,o.heading,f)):l.push(X(y,t,o.heading,f))}return{headingTitle:e,blocks:l,scratchpadParts:c,fewShotInput:p,fewShotOutput:m,demoRequest:h,demoResult:b}},E=a=>typeof a=="string"?u(a.trim()):typeof a=="number"||typeof a=="boolean"?String(a):Array.isArray(a)?u(a.map(t=>typeof t=="string"?t.trim():JSON.stringify(t)).filter(Boolean).join(", ")):a&&typeof a=="object"?u(JSON.stringify(a)):"",fe=(a,t)=>{if(t&&/skill\.md$/i.test(t.trim()))return"skill";const n=a.replace(/\r\n/g,`
`).trim();if(!n)return"prompt";const e=n.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);return e&&/^\s*(?:name|description)\s*:/im.test(e[1])||/^##\s+(?:Role\s*&\s*Trigger|Execution\s+Steps|Verification\s+Checklist)\b/im.test(n)?"skill":"prompt"},xa=(a,t,n="id")=>{const e=ve(),i=a.replace(/\r\n/g,`
`).trim();if(!i)return t&&(e.title=Re(t)),e.targetMode=fe(a,t),e;const s=Re(t);if(i.startsWith("{")||t&&/\.json$/i.test(t.trim()))try{const k=JSON.parse(i);if(k&&typeof k=="object"&&!Array.isArray(k)){const o=k,d=E(o.template)||E(o.title)||E(o.name)||s||(n==="id"?"Prompt Impor JSON":"Imported JSON Prompt"),f=E(o.description),y=[],g=E(o.persona);g&&y.push(X("persona",n,void 0,g)),Array.isArray(o.blocks)&&o.blocks.forEach(S=>{const O=Fe(S);O&&O.value.trim()&&y.push(O)}),o.parameters&&typeof o.parameters=="object"&&!Array.isArray(o.parameters)&&Object.entries(o.parameters).forEach(([S,O])=>{const T=E(O);if(!T)return;const P=be(S);if(P==="persona"&&g&&T===g)return;if(P==="scratchpad"){e.scratchpad||(e.scratchpad=T);return}if(P==="few_shot_input"){e.fewShotInput=e.fewShotInput||T;return}if(P==="few_shot_output"){e.fewShotOutput=e.fewShotOutput||T;return}const w=P==="custom"?"variable":P;y.push(X(w,n,u(S),T))});const v=E(o.scratchpad)||E(o.additional_instructions)||E(o.prompt);if(v&&(e.scratchpad=e.scratchpad?`${e.scratchpad}

${v}`:v),o.few_shot&&typeof o.few_shot=="object"&&!Array.isArray(o.few_shot)){const S=o.few_shot;e.fewShotInput=E(S.sample_input)||e.fewShotInput,e.fewShotOutput=E(S.expected_output)||e.fewShotOutput}else e.fewShotInput=E(o.fewShotInput)||e.fewShotInput,e.fewShotOutput=E(o.fewShotOutput)||e.fewShotOutput;const R=o.targetMode==="skill"||typeof o.subcategory=="string"&&/skill/i.test(o.subcategory)||!!(t&&/skill/i.test(t));if(e.title=d,e.description=f,e.blocks=y,e.targetMode=R?"skill":"prompt",e.targetMode==="skill"){const S=E(o.skillName)||d;e.skillName=Y(S).slice(0,te),e.skillDescription=u(E(o.skillDescription)||f).slice(0,he),e.skillTagline=E(o.skillTagline),e.skillPriceUsd=Ie(o.skillPriceUsd),e.skillTags=E(o.skillTags),e.skillDemoRequest=E(o.skillDemoRequest),e.skillDemoResult=E(o.skillDemoResult)}return e.updatedAt=Date.now(),e}}catch{}const r=i.match(/^---\n([\s\S]*?)\n---(?:\n([\s\S]*))?$/);if(r){const k=ua(r[1]),o=(r[2]??"").trim(),d=Ke(o,n);return e.targetMode="skill",e.skillName=k.name?Y(k.name).slice(0,te):Y(d.headingTitle||s||"custom-skill"),e.skillDescription=we(u(k.description),he),k.compatibility&&(e.skillCompatibility=k.compatibility),e.title=d.headingTitle||u(k.name)||s||pe(o)||(n==="id"?"Agent Skill Impor":"Imported Agent Skill"),e.description=e.skillDescription,e.blocks=d.blocks,e.scratchpad=u(d.scratchpadParts.join(`

`)),e.fewShotInput=d.fewShotInput,e.fewShotOutput=d.fewShotOutput,d.demoRequest&&(e.skillDemoRequest=d.demoRequest),d.demoResult&&(e.skillDemoResult=d.demoResult),e.updatedAt=Date.now(),e}const l=fe(i,t),c=(i.match(/^##\s+.+$/gm)||[]).length>=2;if(l==="skill"||c){const k=Ke(i,n);if(k.blocks.length>0||k.scratchpadParts.length>0)return e.targetMode=l,e.title=k.headingTitle||s||pe(i)||(n==="id"?"Prompt Impor":"Imported Prompt"),e.blocks=k.blocks,e.scratchpad=u(k.scratchpadParts.join(`

`)),e.fewShotInput=k.fewShotInput,e.fewShotOutput=k.fewShotOutput,l==="skill"&&(e.skillName=Y(e.title).slice(0,te)),e.updatedAt=Date.now(),e}const p=i.split(/\n{2,}/).map(k=>k.trim()).filter(Boolean),m=[],h=[];let b=0;for(const k of p){const o=k.match(/^([A-Za-z0-9 &/_()-]{2,40}):\s*([\s\S]+)$/),d=o?o[1].trim():"",f=/^https?$/i.test(d)||o&&o[2].startsWith("//");if(o&&!f){b+=1;const y=u(d),g=u(o[2].trim()),v=be(y);v==="scratchpad"?h.push(g):v==="few_shot_input"?e.fewShotInput=e.fewShotInput||g:v==="few_shot_output"?e.fewShotOutput=e.fewShotOutput||g:m.push(X(v,n,y,g))}else h.push(u(k))}return e.targetMode=l,e.title=s||pe(i)||(n==="id"?"Prompt Impor":"Imported Prompt"),b>=2?(e.blocks=m,e.scratchpad=u(h.join(`

`))):(e.blocks=[],e.scratchpad=u(i)),e.targetMode==="skill"&&(e.skillName=Y(e.title).slice(0,te)),e.updatedAt=Date.now(),e},ka={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1},G={gemini:{id:"gemini",name:"Google Gemini (AI Studio)",shortLabel:"Gemini",badge:"GOOGLE",defaultBaseUrl:"https://generativelanguage.googleapis.com/v1beta/openai",defaultModel:"gemini-4-carbon",models:[{id:"gemini-4-carbon",label:"Gemini 4 Carbon",description:"Flagship frontier penalaran mendalam, rekayasa software kompleks & arsitektur sistem (1M+ konteks, Rekomendasi Utama)"},{id:"gemini-4-argon",label:"Gemini 4 Argon",description:"Model frontier penalaran cepat, tajam & efisiensi tinggi untuk alur kerja produksi"},{id:"gemini-4-hydrogen",label:"Gemini 4 Hydrogen",description:"Workhorse agentic & coding harian berefisiensi tinggi, konteks 1M token"},{id:"gemini-3.8-flash",label:"Gemini 3.8 Flash",description:"Model multimodal produksi latensi ultra-rendah dengan thinking budget adaptif"},{id:"gemini-3.7-flash",label:"Gemini 3.7 Flash",description:"Model multimodal cepat untuk pemrosesan volume tinggi"},{id:"gemini-3.5-flash-lite",label:"Gemini 3.5 Flash-Lite",description:"Model ultra-ringan, super cepat & paling hemat kuota token"}],requiresApiKey:!0,docUrl:"https://aistudio.google.com/app/apikey",placeholderKey:"AIzaSy...",icon:"✨"},openai:{id:"openai",name:"OpenAI (GPT-6 & Reasoning)",shortLabel:"OpenAI",badge:"OPENAI",defaultBaseUrl:"https://api.openai.com/v1",defaultModel:"gpt-6.1-sol",models:[{id:"gpt-6.1-sol",label:"GPT-6.1 Sol",description:"Workhorse optimal menyeimbangkan kecerdasan frontier dan efisiensi biaya (Rekomendasi Utama)"},{id:"gpt-6-astra",label:"GPT-6 Astra",description:"Flagship kecerdasan tertinggi OpenAI untuk coding berat, arsitektur & penalaran ilmiah"},{id:"gpt-6.1-terra",label:"GPT-6.1 Terra",description:"Spesialis penalaran visual, audit dokumen & analisis mendalam"},{id:"gpt-6.1-luna",label:"GPT-6.1 Luna",description:"Latensi sub-detik untuk pemrosesan volume tinggi & otomasi harian"},{id:"gpt-5.2-codex",label:"GPT-5.2 Codex",description:"Model spesialis rekayasa perangkat lunak & refactoring kode kompleks"},{id:"gpt-5",label:"GPT-5",description:"Flagship enterprise stabil generasi GPT-5"}],requiresApiKey:!0,docUrl:"https://platform.openai.com/api-keys",placeholderKey:"sk-proj-...",icon:"🟢"},anthropic:{id:"anthropic",name:"Anthropic (Claude 5.5 & Fable 5.2)",shortLabel:"Claude",badge:"ANTHROPIC",defaultBaseUrl:"https://api.anthropic.com/v1",defaultModel:"claude-sonnet-5-5",models:[{id:"claude-sonnet-5-5",label:"Claude Sonnet 5.5",description:"Flagship keseimbangan kecepatan, coding & penulisan terstruktur (Rekomendasi Utama)"},{id:"claude-opus-5-5",label:"Claude Opus 5.5",description:"Model kelas proyek kompleks, riset mendalam & long-running agentic coding"},{id:"claude-fable-5-2",label:"Claude Fable 5.2",description:"Model penalaran puncak untuk orkestrator sistem & tugas agen jangka panjang"},{id:"claude-haiku-5-5",label:"Claude Haiku 5.5",description:"Eksekusi ultra-cepat & paling ekonomis untuk subagent dan volume tinggi"},{id:"claude-sonnet-4-5",label:"Claude Sonnet 4.5",description:"Generasi 4.5 stabil untuk kompatibilitas router legacy"}],requiresApiKey:!0,docUrl:"https://console.anthropic.com/settings/keys",placeholderKey:"sk-ant-...",icon:"🟧"},deepseek:{id:"deepseek",name:"DeepSeek AI (V4 & R1)",shortLabel:"DeepSeek",badge:"DEEPSEEK",defaultBaseUrl:"https://api.deepseek.com/v1",defaultModel:"deepseek-chat",models:[{id:"deepseek-chat",label:"DeepSeek-Chat (V3 / V4)",description:"Endpoint chat standar teruji untuk tugas umum, coding & penulisan (Rekomendasi Utama Produksi)"},{id:"deepseek-reasoner",label:"DeepSeek-R1 (Reasoner)",description:"Penalaran Chain of Thought 671B untuk logika murni & matematika"},{id:"deepseek-v4-pro",label:"DeepSeek-V4 Pro",description:"Flagship V4 Pro 1M konteks untuk agentic workflow & coding berat (Preset Generasi 4)"},{id:"deepseek-flash",label:"DeepSeek-V4.1 Flash",description:"Model V4.1 Flash super cepat dan sangat hemat biaya"}],requiresApiKey:!0,docUrl:"https://platform.deepseek.com/api_keys",placeholderKey:"sk-...",icon:"🔵"},xai:{id:"xai",name:"xAI (Grok 4.7 & Reasoning)",shortLabel:"xAI Grok",badge:"XAI",defaultBaseUrl:"https://api.x.ai/v1",defaultModel:"grok-4.7",models:[{id:"grok-4.7",label:"Grok 4.7",description:"Flagship xAI 500K+ konteks untuk reasoning, coding, agentic & visi (Rekomendasi)"},{id:"grok-420-reasoning",label:"Grok 420 Reasoning",description:"Model penalaran multi-langkah untuk logika, matematika & audit kode"},{id:"grok-4.6",label:"Grok 4.6",description:"Generasi 4.6 stabil untuk tugas kompleks"},{id:"grok-4.1-fast",label:"Grok 4.1 Fast",description:"Model cepat dan hemat biaya untuk pemrosesan volume tinggi"}],requiresApiKey:!0,docUrl:"https://console.x.ai/",placeholderKey:"xai-...",icon:"🖤"},mistral:{id:"mistral",name:"Mistral AI (La Plateforme)",shortLabel:"Mistral",badge:"MISTRAL",defaultBaseUrl:"https://api.mistral.ai/v1",defaultModel:"mistral-large-latest",models:[{id:"mistral-large-latest",label:"Mistral Large 4 (Latest)",description:"Flagship multimodal 1M konteks untuk penalaran kompleks & tool-use (Rekomendasi)"},{id:"mistral-small-latest",label:"Mistral Small 4 (Latest)",description:"Model hybrid efisien menyatukan instruct, reasoning & coding"},{id:"codestral-latest",label:"Codestral (Latest)",description:"Model spesialis sintesis kode dan refactoring"},{id:"ministral-3b-latest",label:"Ministral 3B (Latest)",description:"Model ringan latensi ultra rendah untuk tugas terarah"}],requiresApiKey:!0,docUrl:"https://console.mistral.ai/api-keys/",placeholderKey:"mis_...",icon:"🌪️"},groq:{id:"groq",name:"Groq Cloud (LPU Ultra-Fast Inference)",shortLabel:"Groq",badge:"LPU",defaultBaseUrl:"https://api.groq.com/openai/v1",defaultModel:"llama-3.3-70b-versatile",models:[{id:"llama-3.3-70b-versatile",label:"Llama 3.3 70B Versatile",description:"Model 70B stabil 300+ token/detik (Rekomendasi Utama Produksi)"},{id:"llama-3.1-8b-instant",label:"Llama 3.1 8B Instant",description:"Respons instan sub-detik untuk tugas ringan"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"Llama 4 Maverick (128E)",description:"Flagship Llama 4 MoE di Groq LPU dengan kecepatan ekstrem"},{id:"meta-llama/llama-4-scout-17b-16e-instruct",label:"Llama 4 Scout (16E)",description:"Llama 4 Scout cepat dengan dukungan konteks panjang"},{id:"qwen/qwen3.8-27b",label:"Qwen 3.8 27B",description:"Model multimodal & penalaran cepat generasi Qwen 3.8"},{id:"openai/gpt-oss-20b",label:"OpenAI GPT-OSS 20B",description:"Model open-weights OpenAI berlatensi sub-detik"}],requiresApiKey:!0,docUrl:"https://console.groq.com/keys",placeholderKey:"gsk_...",icon:"⚡"},openrouter:{id:"openrouter",name:"OpenRouter (Universal Model Aggregator)",shortLabel:"OpenRouter",badge:"ROUTER",defaultBaseUrl:"https://openrouter.ai/api/v1",defaultModel:"anthropic/claude-sonnet-5.5",models:[{id:"anthropic/claude-sonnet-5.5",label:"Claude Sonnet 5.5",description:"Flagship Anthropic 1M konteks untuk coding & penulisan (Rekomendasi Utama)"},{id:"anthropic/claude-opus-5.5",label:"Claude Opus 5.5",description:"Flagship Anthropic untuk proyek kompleks & riset mendalam"},{id:"anthropic/claude-fable-5.2",label:"Claude Fable 5.2",description:"Model penalaran puncak Anthropic untuk alur kerja jangka panjang"},{id:"google/gemini-4-carbon",label:"Gemini 4 Carbon",description:"Flagship Google Gemini 4 penalaran mendalam & rekayasa sistem"},{id:"google/gemini-4-argon",label:"Gemini 4 Argon",description:"Frontier reasoning cepat & efisiensi tinggi Google"},{id:"google/gemini-4-hydrogen",label:"Gemini 4 Hydrogen",description:"Workhorse agentic & coding harian Google"},{id:"google/gemini-3.8-flash",label:"Gemini 3.8 Flash",description:"Workhorse multimodal cepat generasi 3.8"},{id:"openai/gpt-6-astra",label:"OpenAI GPT-6 Astra",description:"Flagship tertinggi OpenAI GPT-6 untuk penalaran berat"},{id:"openai/gpt-6.1-sol",label:"OpenAI GPT-6.1 Sol",description:"GPT-6 keseimbangan kecerdasan dan efisiensi biaya"},{id:"deepseek/deepseek-v4-pro",label:"DeepSeek V4 Pro",description:"Flagship open-frontier DeepSeek 1M konteks"},{id:"deepseek/deepseek-r1",label:"DeepSeek R1",description:"Reasoning 671B Chain of Thought"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"Llama 4 Maverick",description:"Flagship open-weights MoE Meta generasi 4"},{id:"x-ai/grok-4.7",label:"xAI Grok 4.7",description:"Flagship xAI 500K+ konteks"}],requiresApiKey:!0,docUrl:"https://openrouter.ai/keys",placeholderKey:"sk-or-v1-...",icon:"🟣"},perplexity:{id:"perplexity",name:"Perplexity AI (Live Web Search & Reasoning)",shortLabel:"Perplexity",badge:"SEARCH",defaultBaseUrl:"https://api.perplexity.ai",defaultModel:"sonar-reasoning-pro",models:[{id:"sonar-reasoning-pro",label:"Sonar Reasoning Pro",description:"Penalaran multi-langkah dengan sitasi web real-time (Rekomendasi)"},{id:"sonar-deep-research",label:"Sonar Deep Research",description:"Riset agen komprehensif lintas banyak sumber web"},{id:"sonar-pro",label:"Sonar Pro",description:"Pencarian internet mendalam multi-sumber"},{id:"sonar",label:"Sonar",description:"Pencarian web ringan dan cepat"}],requiresApiKey:!0,docUrl:"https://www.perplexity.ai/settings/api",placeholderKey:"pplx-...",icon:"🌐"},together:{id:"together",name:"Together AI (Open-Source Frontier)",shortLabel:"Together AI",badge:"CLOUD",defaultBaseUrl:"https://api.together.xyz/v1",defaultModel:"meta-llama/Llama-3.3-70B-Instruct-Turbo",models:[{id:"meta-llama/Llama-3.3-70B-Instruct-Turbo",label:"Llama 3.3 70B Turbo",description:"Model 70B berlatensi sangat cepat & teruji (Rekomendasi)"},{id:"deepseek-ai/DeepSeek-R1",label:"DeepSeek R1 (Full 671B)",description:"Model penalaran rantai pemikiran DeepSeek R1"},{id:"deepseek-ai/DeepSeek-V3",label:"DeepSeek V3",description:"Model general chat 671B efisien"},{id:"deepseek-ai/DeepSeek-V4-Pro",label:"DeepSeek V4 Pro",description:"Flagship DeepSeek V4 Pro serverless (Preset)"},{id:"Qwen/Qwen2.5-72B-Instruct-Turbo",label:"Qwen 2.5 72B Turbo",description:"Model penalaran & multilingual kuat dari Qwen"}],requiresApiKey:!0,docUrl:"https://api.together.ai/settings/api-keys",placeholderKey:"tog-...",icon:"🤝"},cerebras:{id:"cerebras",name:"Cerebras Cloud (World-Record WSE Speed)",shortLabel:"Cerebras",badge:"WSE",defaultBaseUrl:"https://api.cerebras.ai/v1",defaultModel:"llama-3.3-70b",models:[{id:"llama-3.3-70b",label:"Llama 3.3 70B (2000+ tps)",description:"Model 70B dengan kecepatan instan wafer-scale engine (Rekomendasi)"},{id:"llama3.1-8b",label:"Llama 3.1 8B",description:"Eksekusi ultra instan"},{id:"gpt-oss-120b",label:"GPT-OSS 120B (~3000 tps)",description:"Model open-weights 120B berkecepatan ~3.000 token/detik"},{id:"qwen-3.8-27b",label:"Qwen 3.8 27B (~1850 tps)",description:"Qwen 3.8 berkecepatan ~1.850 token/detik"}],requiresApiKey:!0,docUrl:"https://cloud.cerebras.ai/",placeholderKey:"csk-...",icon:"🚀"},sambanova:{id:"sambanova",name:"SambaNova Cloud (Full Precision RDU)",shortLabel:"SambaNova",badge:"RDU",defaultBaseUrl:"https://api.sambanova.ai/v1",defaultModel:"Meta-Llama-3.3-70B-Instruct",models:[{id:"Meta-Llama-3.3-70B-Instruct",label:"Llama 3.3 70B (Full Precision)",description:"Kualitas FP16 murni berkecepatan tinggi di SambaNova RDU (Rekomendasi)"},{id:"DeepSeek-R1",label:"DeepSeek R1 (Full 671B)",description:"Penalaran penuh 671B di atas cluster SambaNova RDU"},{id:"DeepSeek-V3",label:"DeepSeek V3",description:"Model chat general-purpose throughput tinggi"},{id:"gemma-4-31B-it",label:"Gemma 4 31B Instruct",description:"Model terbuka terbaru Google Gemma 4 presisi tinggi"}],requiresApiKey:!0,docUrl:"https://cloud.sambanova.ai/",placeholderKey:"samba-...",icon:"⚡"},cohere:{id:"cohere",name:"Cohere (Command A Enterprise)",shortLabel:"Cohere",badge:"COMMAND",defaultBaseUrl:"https://api.cohere.ai/compatibility/v1",defaultModel:"command-r-plus-08-2024",models:[{id:"command-r-plus-08-2024",label:"Command R+ (Enterprise Live)",description:"Model enterprise stabil untuk RAG, penalaran bisnis & tool-use (Rekomendasi)"},{id:"command-r7b-12-2024",label:"Command R 7B",description:"Versi ringan berkecepatan tinggi"},{id:"command-a-plus-05-2026",label:"Command A+ (MoE Multimodal)",description:"Flagship enterprise MoE generasi Command A (Preset Next-Gen)"},{id:"command-a-reasoning-08-2025",label:"Command A Reasoning",description:"Varian penalaran mendalam untuk analisis bisnis kompleks"},{id:"command-a-03-2025",label:"Command A (Base)",description:"Model utama generasi Command A untuk instruksi terstruktur"}],requiresApiKey:!0,docUrl:"https://dashboard.cohere.com/api-keys",placeholderKey:"coh-...",icon:"🏛️"},huggingface:{id:"huggingface",name:"Hugging Face (Inference Providers Router)",shortLabel:"Hugging Face",badge:"HF",defaultBaseUrl:"https://router.huggingface.co/v1",defaultModel:"meta-llama/Llama-3.3-70B-Instruct",models:[{id:"meta-llama/Llama-3.3-70B-Instruct",label:"Llama 3.3 70B Instruct",description:"Open-weights stabil Meta di HF Router (Rekomendasi)"},{id:"deepseek-ai/DeepSeek-R1",label:"DeepSeek R1",description:"Model penalaran frontier di HF Router"},{id:"deepseek-ai/DeepSeek-V4.1-Flash:fastest",label:"DeepSeek V4.1 Flash (:fastest)",description:"Auto-routed tercepat melalui HF Inference Providers"},{id:"Qwen/Qwen3-Coder-30B-A3B-Instruct",label:"Qwen3 Coder 30B A3B",description:"Spesialis coding MoE efisien di HF Router"}],requiresApiKey:!0,docUrl:"https://huggingface.co/settings/tokens",placeholderKey:"hf_...",icon:"🤗"},ollama:{id:"ollama",name:"Ollama (Local Offline AI)",shortLabel:"Ollama",badge:"LOCAL",defaultBaseUrl:"http://localhost:11434/v1",defaultModel:"qwen3.8:27b",models:[{id:"qwen3.8:27b",label:"Qwen 3.8 (27B)",description:"Workhorse penalaran & chat lokal terbaik untuk 24GB VRAM (Rekomendasi)"},{id:"qwen3-coder:30b",label:"Qwen3 Coder (30B MoE)",description:"Standar emas coding lokal & RAG cepat (24GB VRAM)"},{id:"gemma4:12b",label:"Gemma 4 (12B)",description:"Model multimodal Google Gemma 4 optimal di 16GB RAM/VRAM"},{id:"gemma4:31b",label:"Gemma 4 (31B)",description:"Model workstation presisi tinggi untuk 32-48GB VRAM"},{id:"llama4:16x17b",label:"Llama 4 (Scout MoE)",description:"Model multimodal & konteks masif Meta Llama 4 lokal"},{id:"qwen3.5:9b",label:"Qwen 3.5 (9B)",description:"Daily driver ringan dan tajam untuk 16GB RAM/VRAM"},{id:"deepseek-r1:14b",label:"DeepSeek-R1 (14B)",description:"Penalaran R1 optimal di 16GB RAM/VRAM"},{id:"deepseek-r1:8b",label:"DeepSeek-R1 (8B)",description:"Penalaran R1 ringkas untuk 8GB VRAM"},{id:"deepseek-r1:latest",label:"DeepSeek-R1 (Latest)",description:"Tag default resmi DeepSeek R1 di Ollama"}],requiresApiKey:!1,docUrl:"https://ollama.com/",placeholderKey:"Opsional (tidak wajib untuk Ollama)",icon:"🦙"},internai:{id:"internai",name:"Intern-Discovery / 书生·端砚 (Shanghai AI Lab)",shortLabel:"Intern-AI",badge:"INTERN-AI",defaultBaseUrl:"https://discovery-api.intern-ai.org.cn/v1",defaultModel:"Agents-A1",models:[{id:"Agents-A1",label:"Agents-A1 (Multimodal 256K · Paling Hemat 4 Kredit · Rekomendasi Utama)",description:"Shanghai AI Lab Agents-A1 multimodal ultra hemat (Input 4 / Output 16 credits - Rekomendasi Utama)"},{id:"Sage-A1.5",label:"Sage-A1.5 (Multimodal 512K · Hemat 4 Kredit)",description:"Shanghai AI Lab Sage-A1.5 multimodal efisien (Input 4 / Output 16 credits)"},{id:"Sage-S2.1-Flash",label:"Sage-S2.1-Flash (Multimodal 512K · Cepat 8 Kredit)",description:"Shanghai AI Lab Sage-S2.1-Flash high-speed multimodal (Input 8 / Output 28 credits)"},{id:"intern-s2",label:"书生·S2 (Multimodal 256K · Flagship 30 Kredit)",description:"Shanghai AI Lab Intern-S2 flagship multimodal (Input 30 / Output 180 credits)"},{id:"Sage-A1.5-Taiyi",label:"Sage-A1.5-Taiyi (Agent 512K · 32 Kredit)",description:"Shanghai AI Lab Sage-A1.5-Taiyi specialized reasoning agent (Input 32 / Output 128 credits)"},{id:"Atria-Dawn",label:"Atria-Dawn (LLM 512K · 80 Kredit)",description:"Shanghai AI Lab Atria-Dawn 512K long-context LLM (Input 80 / Output 280 credits)"},{id:"intern-decision-4b",label:"书生·Decision-4B (Decision 8K)",description:"Shanghai AI Lab Decision-4B model (SystemOne protocol)"},{id:"deepseek-v4.1-flash-1017",label:"DeepSeek-V4.1-Flash-1017 (Multimodal 1M)",description:"DeepSeek V4.1 Flash 1M context via Intern-Discovery"},{id:"glm-5.3",label:"GLM-5.3 (LLM 1M)",description:"GLM-5.3 1M context via Intern-Discovery"},{id:"kimi-k3.1-pro",label:"Kimi-K3.1-Pro (Multimodal 1M)",description:"Moonshot Kimi K3.1 Pro 1M context via Intern-Discovery"},{id:"qwen3.8-27b",label:"Qwen3.8-27B (Multimodal 256K)",description:"Qwen 3.8 27B multimodal via Intern-Discovery"}],requiresApiKey:!0,docUrl:"https://discovery.intern-ai.org.cn/",placeholderKey:"API key dari https://discovery.intern-ai.org.cn/",icon:"🧪"},custom:{id:"custom",name:"OpenAI-Compatible / Kustom (LM Studio, vLLM, LiteLLM, Cloudflare AI)",shortLabel:"OpenAI-Comp",badge:"OPENAI-COMP",defaultBaseUrl:"http://localhost:1234/v1",defaultModel:"local-model",models:[{id:"__custom_empty__",label:"✍️ [Kustom] Ketik Model Sendiri (Kosong)",description:"Pilihan kosong untuk mengetik model AI kustom Anda sendiri"},{id:"local-model",label:"local-model",description:"Model aktif di LM Studio / vLLM / Local Host"},{id:"intern-s2",label:"intern-s2",description:"Intern-Discovery Flagship Multimodal (Shanghai AI Lab)"},{id:"Sage-S2.1-Flash",label:"Sage-S2.1-Flash",description:"Intern-Discovery Sage-S2.1-Flash Multimodal 512K (New)"},{id:"Agents-A1",label:"Agents-A1",description:"Intern-Discovery Agents-A1 Multimodal 256K (Hot)"},{id:"Atria-Dawn",label:"Atria-Dawn",description:"Intern-Discovery Atria-Dawn LLM 512K (Hot)"},{id:"Sage-A1.5",label:"Sage-A1.5",description:"Intern-Discovery Sage-A1.5 Multimodal 512K (Hot)"},{id:"Sage-A1.5-Taiyi",label:"Sage-A1.5-Taiyi",description:"Intern-Discovery Sage-A1.5-Taiyi Agent 512K"},{id:"deepseek-v4.1-flash-1017",label:"deepseek-v4.1-flash-1017",description:"DeepSeek V4.1 Flash 1M via Intern-Discovery"},{id:"glm-5.3",label:"glm-5.3",description:"GLM-5.3 1M via Intern-Discovery"},{id:"intern-decision-4b",label:"intern-decision-4b",description:"Shanghai AI Lab Decision-4B (SystemOne)"},{id:"kimi-k3.1-pro",label:"kimi-k3.1-pro",description:"Moonshot Kimi K3.1 Pro 1M via Intern-Discovery"},{id:"qwen3.8-27b",label:"qwen3.8-27b",description:"Qwen 3.8 27B via Intern-Discovery"},{id:"gemini-4-carbon",label:"gemini-4-carbon",description:"Google Gemini 4 Carbon (Frontier Reasoning Flagship)"},{id:"gemini-4-argon",label:"gemini-4-argon",description:"Google Gemini 4 Argon (Optimized Frontier Intelligence)"},{id:"gemini-4-hydrogen",label:"gemini-4-hydrogen",description:"Google Gemini 4 Hydrogen (Agentic & Daily Coding)"},{id:"gemini-3.8-flash",label:"gemini-3.8-flash",description:"Google Gemini 3.8 Flash (Multimodal Cepat Produksi)"},{id:"google/gemini-4-carbon",label:"google/gemini-4-carbon",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"google/gemini-4-argon",label:"google/gemini-4-argon",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"google/gemini-4-hydrogen",label:"google/gemini-4-hydrogen",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"gpt-6-astra",label:"gpt-6-astra",description:"OpenAI GPT-6 Astra Flagship"},{id:"gpt-6.1-sol",label:"gpt-6.1-sol",description:"OpenAI GPT-6.1 Sol Workhorse"},{id:"claude-sonnet-5-5",label:"claude-sonnet-5-5",description:"Anthropic Claude Sonnet 5.5"},{id:"claude-opus-5-5",label:"claude-opus-5-5",description:"Anthropic Claude Opus 5.5"},{id:"claude-fable-5-2",label:"claude-fable-5-2",description:"Anthropic Claude Fable 5.2 Reasoning"},{id:"deepseek-v4-pro",label:"deepseek-v4-pro",description:"DeepSeek V4 Pro 1M Konteks"},{id:"deepseek-reasoner",label:"deepseek-reasoner",description:"DeepSeek R1 CoT Reasoner via Proxy"},{id:"deepseek-chat",label:"deepseek-chat",description:"DeepSeek Chat (V4 / V3 Alias)"},{id:"grok-4.7",label:"grok-4.7",description:"xAI Grok 4.7 Flagship via Proxy"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"llama-4-maverick",description:"Meta Llama 4 Maverick MoE"},{id:"qwen3.8:27b",label:"qwen3.8:27b",description:"Qwen 3.8 27B via Local / Proxy"},{id:"default",label:"default",description:"Model default fallback server"}],requiresApiKey:!1,docUrl:"https://platform.openai.com/docs/api-reference",placeholderKey:"API key kustom Anda (jika diperlukan)",icon:"⚙️"}},Pe="promptmatrix_ai_unified_settings",Ce="promptmatrix_gemini_api_key",V=a=>{if(!a)return"";let t=a.trim();return t=t.replace(/[\u200B-\u200D\uFEFF\u00A0]/g,""),t=t.replace(/[\r\n\t]/g,""),t=t.replace(/^["']+|["']+$/g,""),t=t.replace(/^bearer\s+/i,""),t.trim()},ga=(a,t)=>{const n=V(a);return!n||n.length<10?null:n.startsWith("AIzaSy")&&t!=="gemini"?"Kunci ini berformat Google Gemini (AIzaSy...). Anda saat ini memilih provider lain. Harap gunakan API Key resmi dari provider yang dipilih.":n.startsWith("sk-ant-")&&t!=="anthropic"?"Kunci ini berformat Anthropic Claude (sk-ant-...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.":n.startsWith("gsk_")&&t!=="groq"?"Kunci ini berformat Groq (gsk_...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.":n.startsWith("hf_")&&t!=="huggingface"?"Kunci ini berformat Hugging Face (hf_...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.":null},Oe=(a,t,n)=>{const e=(t||"").toLowerCase().trim(),i=(n||"").toLowerCase().trim();return e.includes("intern-ai.org.cn")?"internai":["atria-dawn","agents-a1","sage-a1.5","sage-a1.5-taiyi","sage-s2.1-flash","deepseek-v4.1-flash-1017","glm-5.3","intern-decision-4b","intern-s2","kimi-k3.1-pro","qwen3.8-27b"].includes(i)&&(a==="gemini"||a==="custom")?e.includes("intern-ai.org.cn")?"internai":"custom":e.includes("openrouter.ai")?"openrouter":e.includes("deepseek.com")?"deepseek":e.includes("groq.com")?"groq":e.includes("anthropic.com")?"anthropic":e.includes("localhost:11434")||e.includes("127.0.0.1:11434")?"ollama":e.includes("api.openai.com")?"openai":a==="gemini"&&e&&!e.includes("generativelanguage.googleapis.com")&&!e.includes("googleapis.com")?"custom":a},me=()=>({provider:"gemini",apiKey:"",baseUrl:G.gemini.defaultBaseUrl,model:G.gemini.defaultModel,providerKeys:{}}),Ue=()=>{try{const a=localStorage.getItem(Pe);if(a){const n=JSON.parse(a),e=n.provider||"gemini",i=n.providerKeys||{};return n.apiKey&&!i[e]&&(i[e]=V(n.apiKey)),{...me(),...n,apiKey:V(n.apiKey||i[e]||""),providerKeys:i}}const t=localStorage.getItem(Ce);if(t&&t.trim()){const n=V(t);return{...me(),apiKey:n,providerKeys:{gemini:n}}}}catch(a){console.warn("Error reading AI settings from storage:",a)}return me()},_a=a=>{try{const t=V(a.apiKey),n={...a.providerKeys||{},[a.provider]:t},e={...a,apiKey:t,baseUrl:(a.baseUrl||"").trim(),model:(a.model||"").trim(),providerKeys:n};localStorage.setItem(Pe,JSON.stringify(e)),e.provider==="gemini"&&localStorage.setItem(Ce,e.apiKey)}catch(t){console.error("Error saving AI settings:",t)}},Ba=()=>{try{localStorage.removeItem(Pe),localStorage.removeItem(Ce)}catch(a){console.error("Error removing AI settings:",a)}},ja=()=>{const a=Ue();return(G[a.provider]||G.custom).requiresApiKey?!!(a.apiKey&&V(a.apiKey).length>0):!0},ha="https://generativelanguage.googleapis.com/v1beta/openai",ba=["Agents-A1","Atria-Dawn","Sage-A1.5","Sage-A1.5-Taiyi","Sage-S2.1-Flash","deepseek-v4.1-flash-1017","glm-5.3","intern-decision-4b","intern-s2","kimi-k3.1-pro","qwen3.8-27b"],Te=(a,t="custom")=>{const n=G[t]||G.custom;let e=(a||"").trim()||n.defaultBaseUrl||"https://api.openai.com/v1";e=e.replace(/\/+$/,"").replace(/\/(chat\/completions|models|messages)$/i,"").replace(/\/+$/,"");let i=e.toLowerCase();const s=i.includes("generativelanguage.googleapis.com");return s&&!i.includes("/openai")&&(e=ha,i=e.toLowerCase()),i.includes("anthropic.com")?(/\/v1$/i.test(e)||(e=`${e}/v1`),{protocol:"anthropic",base:e,chatUrl:`${e}/messages`,modelsUrl:`${e}/models`,isGemini:!1,isInternAI:!1,isOpenRouter:!1,isOpenAIOfficial:!1}):{protocol:"openai",base:e,chatUrl:`${e}/chat/completions`,modelsUrl:`${e}/models`,isGemini:s,isInternAI:i.includes("intern-ai.org.cn"),isOpenRouter:i.includes("openrouter.ai"),isOpenAIOfficial:i.includes("api.openai.com")}},Ge=(a,t)=>{const n=(a||"").trim();return t.isGemini?n.replace(/^models\//,"").replace(/^google\//,""):n};class W extends Error{constructor(n){super(n.message);ae(this,"status");ae(this,"kind");ae(this,"endpoint");ae(this,"providerMessage");this.name="AIRequestError",this.status=n.status,this.kind=n.kind,this.endpoint=n.endpoint,this.providerMessage=n.providerMessage}}const fa=/model.{0,40}(not.?found|not exist|does not exist|unknown|invalid|unsupported|not available)|no such model|无效的模型|模型不存在/i,ya=(a,t)=>a===0?"network":a===401||a===403?"auth":a===429||/quota|rate.?limit|insufficient.?(balance|credit|quota)/i.test(t)?"quota":a===404||fa.test(t)?"not_found":a>=500?"server":"bad_request",Aa=a=>{var t;if(!a)return"";try{const n=JSON.parse(a);return typeof n.error=="string"?n.error:((t=n.error)==null?void 0:t.message)||n.message||n.detail||a.slice(0,300)}catch{return a.slice(0,300)}},Sa=(a,t)=>{const{endpoint:n,model:e,keyLength:i,operation:s}=t;return a==="auth"?i===0?" (Diagnostik: API Key kosong. Harap isi API Key dari dashboard provider Anda.)":n.isInternAI?` (Diagnostik Intern-Discovery: API Key (${i} karakter) ditolak gateway. Salin ulang API Key dari tab "API Key" di https://discovery.intern-ai.org.cn/)`:` (Diagnostik: API Key (${i} karakter) ditolak server. Pastikan key berasal dari dashboard provider yang sama dengan Base URL.)`:a==="not_found"?s==="models"?" (Server ini tidak menyediakan endpoint /models. Ketik nama model secara manual.)":e.includes("gemini")&&!n.isGemini?' (Tips: Untuk router OpenAI-compatible, coba prefix seperti "google/gemini-4-carbon".)':` (Tips: Model "${e}" tidak dikenali server ${n.base}. Gunakan tombol "Muat Model" untuk melihat model yang tersedia.)`:a==="quota"?n.isInternAI?" (Tips Intern-Discovery: API Key valid, namun saldo kredit habis atau rate-limited. Cek kredit di https://discovery.intern-ai.org.cn/ atau pilih model hemat Agents-A1 / Sage-A1.5.)":" (Tips: API Key valid, namun kuota atau saldo kredit akun Anda di provider habis.)":""},$e=async(a,t,n)=>{let e;try{e=await fetch(a,t)}catch(s){const r=s instanceof Error?s.message:String(s);throw new W({status:0,kind:"network",endpoint:a,providerMessage:r,message:`Gagal menghubungi ${a}: ${r}. Kemungkinan URL salah, server tidak aktif, atau permintaan diblokir kebijakan CORS browser.`})}const i=await e.text();if(!e.ok){const s=Aa(i)||e.statusText,r=ya(e.status,s);throw new W({status:e.status,kind:r,endpoint:a,providerMessage:s,message:`AI Provider Error (${e.status}): ${s}${Sa(r,n)} [Endpoint: ${a}]`})}return i},Le=(a,t,n)=>{const e={};return n&&(e["Content-Type"]="application/json"),a.protocol==="anthropic"?(e["x-api-key"]=t,e["anthropic-version"]="2023-06-01",e["anthropic-dangerous-direct-browser-access"]="true",e):(t&&(e.Authorization=`Bearer ${t}`),a.isOpenRouter&&(e["HTTP-Referer"]="https://github.com/sisigitadi/promptmatrix",e["X-Title"]="PromptMatrix"),e)},De=a=>{var n,e;if(!a)return"";const t=(n=a.message)==null?void 0:n.content;return typeof t=="string"?t:Array.isArray(t)?t.map(i=>i.text||"").join(""):((e=a.delta)==null?void 0:e.content)||a.text||""},qe=a=>{var n,e,i;const t=a.trim();if(!t)return"";if(t.startsWith("data:")){let s="";for(const r of t.split(`
`)){const l=r.trim();if(!l.startsWith("data:"))continue;const c=l.replace(/^data:\s*/,"");if(!(!c||c==="[DONE]"))try{const p=JSON.parse(c);s+=De((n=p.choices)==null?void 0:n[0])}catch{}}return s.trim()}try{const s=JSON.parse(t),r=De((e=s.choices)==null?void 0:e[0]);return r?r.trim():(((i=s.content)==null?void 0:i.map(c=>c.text||"").join(""))||"").trim()}catch{return t.startsWith("{")||t.startsWith("[")?"":t}},ye=async(a,t,n,e,i,s)=>{const r=[];t&&r.push({role:"system",content:t}),r.push({role:"user",content:a});const l={model:i,messages:r};(s==null?void 0:s.stream)!==void 0&&(l.stream=s.stream),s!=null&&s.skipTemperature||(l.temperature=(s==null?void 0:s.temperature)??.7),s!=null&&s.maxTokens&&(l[e.isOpenAIOfficial?"max_completion_tokens":"max_tokens"]=s.maxTokens);const c={endpoint:e,model:i,keyLength:n.length,operation:"chat"},p=await $e(e.chatUrl,{method:"POST",headers:Le(e,n,!0),body:JSON.stringify(l)},c),m=qe(p);if(m||s!=null&&s.allowEmpty)return m;throw new W({status:200,kind:"empty_response",endpoint:e.chatUrl,providerMessage:p.slice(0,200),message:"Model AI tidak mengembalikan konten teks yang valid."})},Ve=async(a,t,n,e,i,s)=>{const r={model:i,max_tokens:(s==null?void 0:s.maxTokens)??2048,messages:[{role:"user",content:a}]};t&&(r.system=t),!(s!=null&&s.skipTemperature)&&(s==null?void 0:s.temperature)!==void 0&&(r.temperature=s.temperature);const l={endpoint:e,model:i,keyLength:n.length,operation:"chat"},c=await $e(e.chatUrl,{method:"POST",headers:Le(e,n,!0),body:JSON.stringify(r)},l),p=qe(c);if(p||s!=null&&s.allowEmpty)return p;throw new W({status:200,kind:"empty_response",endpoint:e.chatUrl,providerMessage:c.slice(0,200),message:"Anthropic tidak mengembalikan konten teks yang valid."})},_=async(a,t="",n,e)=>{const i=Ue(),s=(i.model||"").trim();if(s==="__custom_empty__")throw new Error("Harap pilih atau ketik nama model AI terlebih dahulu.");const r=Oe(i.provider,i.baseUrl,s),l=Te(i.baseUrl,r),c=G[r]||G.custom,p=Ge(s||c.defaultModel,l),m=V(i.apiKey);if(l.protocol==="anthropic"){if(!m)throw new Error("API Key Anthropic Claude belum diisi.");return Ve(a,t,m,l,p,e)}if(l.isGemini&&!m)throw new Error("API Key Google Gemini belum diisi. Silakan atur di menu Pengaturan AI ⚙️.");return ye(a,t,m,l,p,e)},Ia=(a,t)=>{let n=[];try{const i=JSON.parse(a);Array.isArray(i)?n=i.map(s=>typeof s=="string"?s:s.id||s.name||""):n=(i.data||i.models||[]).map(r=>r.id||r.name||"")}catch{return[]}const e=n.map(i=>(t.isGemini?i.replace(/^models\//,""):i).trim()).filter(Boolean);return Array.from(new Set(e)).sort((i,s)=>i.localeCompare(s))},He=async(a,t)=>{const n={endpoint:a,model:"",keyLength:t.length,operation:"models"},e=await $e(a.modelsUrl,{method:"GET",headers:Le(a,t,!1)},n);return Ia(e,a)},Fa=async(a,t,n)=>{const e=Oe(n||"custom",a,""),i=Te(a,e);if(i.isInternAI)return[...ba];const s=V(t);if((i.isGemini||i.protocol==="anthropic")&&!s)throw new Error("API Key diperlukan untuk mengambil daftar model dari provider ini.");try{return await He(i,s)}catch(r){throw r instanceof W&&r.kind==="network"?new Error(`Koneksi ke ${i.modelsUrl} terhalang kebijakan CORS browser atau server tidak aktif. Pilih model dari daftar terkurasi atau ketik nama model secara manual.`):r}},wa=a=>{if(!a)return"";let t=a.replace(/\r\n/g,`
`).trim();const n=["Persona AI","AI Persona","Peran AI","Peran","Role","System Role","Konteks & Tujuan","Konteks","Context","Background","Latar Belakang","Tugas Utama","Tugas","Task","Objective","Tujuan","Goal","Variabel Input","Detail Masukan","Input Details","Instruksi Utama","Instruksi Khusus","Instruksi Tambahan","Instruksi","Instructions","Guidelines","Batasan Mutlak","Batasan & Kriteria","Batasan","Constraints","Hard Constraints","Format Output","Format Keluaran","Output Format","Deliverables","Target Audiens","Audiens Target","Target Audience","Audience","Nada Bicara","Gaya Bahasa","Tone of Voice","Tone & Style","Tone","Voice","Attention","Interest","Desire","Action","Hook","Story","Offer","Call to Action","Pencahayaan","Sudut Kamera","Optik","Lighting","Camera","Catatan Khusus","Important Notes","Catatan","Notes"],e=new RegExp(`([^
])
((?:[-*•#>]+\\s*)?(?:${n.join("|")}):)`,"gi");return t=t.replace(e,`$1

$2`),t=t.replace(/([^\n])\n((?:Step|Langkah|\d+\.)\s+[A-Za-z0-9\s()&/._-]{1,30}:)/gi,`$1

$2`),t=t.replace(/([^\n])\n(\[(?:Intro|Verse|Pre-Chorus|Chorus|Bridge|Guitar Solo|Outro|Drop|Hook|Build-up)[^\]]*\])/gi,`$1

$2`),t=t.replace(/\n{3,}/g,`

`),t.trim()},U=a=>{if(!a)return"";let t=a.trim();return t=t.replace(/^```[a-zA-Z0-9_-]*\s*\r?\n?/i,""),t=t.replace(/\r?\n?```\s*$/g,""),t=t.replace(/^(?:Tentu,?\s*)?(?:Berikut\s+(?:adalah\s+)?(?:hasil\s+)?(?:versi\s+)?(?:prompt\s+)?(?:yang\s+)?(?:telah\s+)?(?:disempurnakan|dioptimalkan|ditingkatkan|diperbarui)?[^:\n]*:?\s*[\r\n]+)/i,""),t=t.replace(/^(?:Sure,?\s*)?(?:Here\s+(?:is|are)\s+(?:the\s+)?(?:enhanced|improved|refined|optimized)\s+prompt[^:\n]*:?\s*[\r\n]+)/i,""),t=t.replace(/\*\*([^*]+)\*\*/g,"$1"),t=t.replace(/__([^_]+)__/g,"$1"),(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))&&(t=t.slice(1,-1).trim()),wa(t)},Ua=async(a,t,n,e="id")=>{const i=e==="id",s=/few-shot|contoh masukan|contoh keluaran|sample input|expected output/i.test(a);let r=i?"Anda adalah seorang ahli prompt engineering handal. Tugas Anda adalah memberikan satu saran isian terbaik dan spesifik untuk kolom formulir yang diminta. Berikan HANYA nilai isian langsung tanpa pembuka, tanpa tanda kutip, tanpa format tebal (**), dan tanpa penjelasan tambahan.":"You are an expert AI prompt engineer. Provide ONLY the direct, high-quality, specific value for the requested form field. Do not include markdown quotes, bold asterisks (**), pleasantries, or preamble.";s&&(r=i?'Anda adalah Master Prompt Engineer spesialis Few-Shot In-Context Learning. Tugas Anda adalah menyusun contoh acuan (few-shot reference exemplar) yang konkret, realistis, dan mencerminkan standar emas. Berikan HANYA teks contoh acuan langsung tanpa kata pengantar ("Berikut adalah..."), tanpa tanda kutip pembungkus, dan tanpa format tebal berlebihan.':"You are a Master Prompt Engineer specializing in Few-Shot In-Context Learning. Provide ONLY the direct, realistic, gold-standard reference exemplar text without introductory preamble or markdown quotes.");let l=i?`Kerangka Kerja: "${t}"
Kolom yang perlu diisi: "${a}"
Konteks isian kolom lain yang sudah ada:
${n||"(Belum ada kolom lain yang diisi)"}

Berikan satu saran isian teks biasa yang kreatif, kontekstual, dan bernilai tinggi:`:`Framework: "${t}"
Target Field: "${a}"
Other Filled Context:
${n||"(No other fields filled yet)"}

Provide one creative, highly specific, and relevant plain-text value for this field:`;s&&(l=i?`Kerangka Kerja: "${t}"
Target Komponen Few-Shot: "${a}"
Konteks parameter framework yang sudah terisi:
${n||"(Gunakan konteks umum kerangka kerja)"}

Susun satu contoh ${a} yang konkret, realistis, dan siap ditiru oleh model AI:`:`Framework: "${t}"
Target Few-Shot Component: "${a}"
Existing Framework Context:
${n||"(Use general framework context)"}

Draft one concrete, realistic ${a} exemplar ready for in-context learning:`);const c=await _(l,r);return U(c)},Ga=async(a,t,n="id")=>{const e=n==="id",i=e?`Anda adalah Master Prompt Optimizer & AI Prompt Architect Kelas Dunia. Tugas Anda adalah menyempurnakan prompt yang diberikan agar lebih tajam, kaya konteks terarah, minim ambiguitas, dan menghasilkan output maksimal pada LLM modern.

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

     Output Format: [deliverables specification]`,s=e?`Kerangka Kerja: "${t}"
Prompt Awal:
"""
${a}
"""

Tingkatkan dan poles prompt di atas menjadi versi paling optimal. Pastikan setiap bagian/paragraf dipisahkan oleh satu baris kosong agar sangat rapi, nyaman dibaca, dan mudah ditinjau sebelum disalin:`:`Framework: "${t}"
Initial Prompt:
"""
${a}
"""

Enhance and refine the prompt above to the absolute highest standard. Ensure every section and paragraph is separated by an empty line so it is exceptionally clean, comfortable to read, and easy to review before copying:`,r=await _(s,i);return U(r)},qa=async(a,t,n="id")=>{const e=n==="id",i=e?`Anda adalah Evaluator Kualitas Prompt AI. Analisis prompt yang diberikan dan berikan penilaian dalam format JSON baku persis seperti berikut:
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
Skor berupa bilangan bulat 0 sampai 100. Kembalikan HANYA string JSON yang valid.`:"You are an AI Prompt Quality Evaluator. Analyze the prompt and return pure JSON format with clarityScore (0-100), specificityScore (0-100), overallScore (0-100), feedback (string), suggestions (string array). Return pure JSON only.",s=e?`Kerangka Kerja: "${t}"
Prompt yang dievaluasi:
"""
${a}
"""`:`Framework: "${t}"
Prompt to evaluate:
"""
${a}
"""`;try{const l=(await _(s,i)).replace(/```json/gi,"").replace(/```/g,"").trim(),c=JSON.parse(l);return{clarityScore:typeof c.clarityScore=="number"?c.clarityScore:80,specificityScore:typeof c.specificityScore=="number"?c.specificityScore:85,overallScore:typeof c.overallScore=="number"?c.overallScore:83,feedback:c.feedback||(e?"Prompt tersusun dengan baik dan jelas.":"Well-structured prompt."),suggestions:Array.isArray(c.suggestions)?c.suggestions:[]}}catch(r){return console.warn("Fallback parsing quality analysis result:",r),{clarityScore:82,specificityScore:86,overallScore:84,feedback:e?"Prompt memiliki struktur yang cukup baik dan dapat dieksekusi dengan baik oleh AI.":"The prompt has solid clarity and structure.",suggestions:e?["Pertimbangkan untuk menambahkan contoh keluaran (*few-shot example*) untuk hasil yang lebih spesifik."]:["Consider adding an example output to guide the model further."]}}},Ee=(a,t,n,e)=>{if(a===0)return"API Key kosong. Harap isi API Key dari dashboard provider Anda.";if(t.isInternAI)return`API Key terdeteksi (${a} karakter) namun ditolak gateway Intern-Discovery (Shanghai AI Lab).

Mengapa error ini muncul di SEMUA model?
HTTP 401 adalah penolakan token di gateway, sebelum server memeriksa nama model.

Panduan perbaikan:
1. Buka https://discovery.intern-ai.org.cn/ dan masuk ke akun Anda
2. Klik tab "API Key" (di sebelah kiri tab "Models")
3. Buat API Key baru atau klik tombol salin pada API Key aktif
4. Tempel di kolom API Key PromptMatrix (spasi dan tanda kutip dibersihkan otomatis)
5. Pastikan yang disalin adalah API Key, bukan Session ID atau cookie peramban`;const i=/invalid token/i.test(e)?`

Catatan: pesan "Invalid token" umumnya berasal dari router/proxy (One API, New API, LiteLLM). Gateway Intern-Discovery membalas "invalid API key". Periksa apakah Base URL di atas memang endpoint yang Anda maksud.`:"";return`API Key terdeteksi (${a} karakter) namun ditolak server ${t.base}.

Mengapa error ini muncul di SEMUA model?
HTTP 401 adalah penolakan token di tingkat server, sebelum model diproses.

Panduan perbaikan:
1. Pastikan API Key disalin lengkap dari dashboard ${n}
2. Pastikan key berasal dari provider yang SAMA dengan Base URL
3. Periksa apakah key belum expired, dinonaktifkan, atau dibatasi IP
4. Untuk router/proxy (One API, LiteLLM), pastikan token terdaftar di panel admin${i}`},Va=async a=>{const t=(a.model||"").trim();if(!t||t==="__custom_empty__")return{success:!1,message:"Harap tentukan atau ketik nama model AI terlebih dahulu sebelum melakukan uji coba koneksi."};const n=Oe(a.provider,a.baseUrl,t),e=G[n]||G.custom,i=V(a.apiKey),s=ga(i,n);if(s)return{success:!1,isAuthError:!0,message:`Format API Key tidak cocok dengan ${e.name}!

⚠️ ${s}

Pastikan Anda menyalin kunci dari dashboard resmi yang sesuai (${e.docUrl||"dashboard provider"}).`};if(e.requiresApiKey&&!i)return{success:!1,isAuthError:!0,message:`API Key untuk ${e.name} belum diisi.

Harap salin API Key dari dashboard provider dan tempel di kolom "API Key" sebelum melakukan uji coba koneksi.`};const r=Te(a.baseUrl,n),l=Ge(t,r),c=Date.now();let p=null;if(!r.isInternAI)try{p=await He(r,i)}catch(m){if(m instanceof W&&m.kind==="auth")return{success:!1,isAuthError:!0,endpoint:r.modelsUrl,latencyMs:Date.now()-c,message:`${m.message}

--- Diagnostik Autentikasi:
${Ee(i.length,r,e.name,m.providerMessage)}`}}try{const m={temperature:.7,allowEmpty:!0},h=r.protocol==="anthropic"?await Ve("Ping",'Balas hanya kata "OK".',i,r,l,m):await ye("Halo","",i,r,l,m),b=Date.now()-c,k=[`Koneksi berhasil dalam ${b}ms.`,`Endpoint: ${r.chatUrl}`,`Model: ${l}`];return p&&k.push(`${p.length} model terdeteksi di server.`),k.push(h?`Respons model: "${h.slice(0,100)}"`:"Model merespons dengan konten kosong (normal untuk model penalaran pada uji coba awal)."),{success:!0,message:k.join(`
`),latencyMs:b,modelsCount:p==null?void 0:p.length,endpoint:r.chatUrl}}catch(m){const h=Date.now()-c,b=m instanceof Error?m.message:String(m),k=m instanceof W?m.kind:"bad_request",o=m instanceof W?m.providerMessage:b,d={latencyMs:h,endpoint:r.chatUrl,modelsCount:p==null?void 0:p.length};if(k==="quota"){if(r.isInternAI&&l!=="Agents-A1")try{const g=await ye("Halo","",i,r,"Agents-A1",{temperature:.7,allowEmpty:!0}),v=Date.now()-c;return{...d,success:!0,latencyMs:v,message:`Koneksi & Otentikasi Berhasil dalam ${v}ms!
Endpoint: ${r.chatUrl}
Model Uji Hemat: Agents-A1 (Respons: "${(g||"OK").slice(0,50)}")

ℹ️ Catatan Kuota: Model "${l}" memerlukan saldo kredit lebih tinggi (HTTP 429), namun gateway terhubung 100% dan model hemat "Agents-A1" (4 kredit) aktif dan siap digunakan.`}}catch{}const f=r.isInternAI?"Server Shanghai AI Lab mengonfirmasi API Key & Endpoint aktif 100%, namun saldo kredit akun saat ini habis / 0 (HTTP 429). Cek saldo di https://discovery.intern-ai.org.cn/ (menu Usage/API Key) atau gunakan model hemat Agents-A1 / Sage-A1.5 (4 kredit).":"Server mengonfirmasi API Key & Endpoint aktif 100%, namun kuota kredit akun saat ini habis atau mencapai batas penggunaan (HTTP 429). Periksa billing di dashboard provider Anda.";return{...d,success:!0,isQuotaExceeded:!0,message:`Koneksi & Otentikasi Berhasil dalam ${h}ms!
Endpoint: ${r.chatUrl}
Status: API Key dan Endpoint terverifikasi 100% valid oleh server provider.

⚠️ Catatan Saldo / Kuota (HTTP 429):
${f}`}}if(k==="auth")return{...d,success:!1,isAuthError:!0,message:`${b}

--- Diagnostik Autentikasi:
${Ee(i.length,r,e.name,o)}`};if(k==="not_found"&&p&&p.length>0){const f=p.slice(0,8).join(", ");return{...d,success:!1,message:`${b}

--- Diagnostik Model:
API Key VALID (${p.length} model terdeteksi di server), tetapi model "${l}" tidak tersedia.
Contoh model yang tersedia: ${f}

Klik "Muat Model" untuk memilih dari daftar lengkap.`}}if(k==="network"){const y=/localhost|127\.0\.0\.1/.test(r.base)?`Tidak dapat terhubung ke server lokal ${r.base}.

Pastikan:
1. Server AI lokal (Ollama / LM Studio / vLLM) sedang berjalan
2. Port yang dikonfigurasi sudah benar
3. Server mengizinkan koneksi dari browser (CORS, misal OLLAMA_ORIGINS=*)`:`Tidak dapat terhubung ke ${r.chatUrl}.

Kemungkinan penyebab:
1. URL endpoint salah atau tidak aktif
2. Server memblokir permintaan dari browser (CORS)
3. Jaringan internet terputus atau firewall memblokir`;return{...d,success:!1,message:`${b}

--- Diagnostik Jaringan:
${y}`}}return{...d,success:!1,message:b||"Gagal terhubung ke API endpoint."}}},ze=new Set(["persona","context","task","constraints","output_format","audience","variable","custom"]),L=a=>typeof a!="string"?"":U(a).replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim(),Je=a=>{const t=a.replace(/```json/gi,"").replace(/```/g,"").trim(),n=t.indexOf("{"),e=t.lastIndexOf("}");return n!==-1&&e>n?t.slice(n,e+1):t},Ha=async(a,t,n="id")=>{const e=n==="id",i=a.trim(),s=t==="skill"?e?`Target Mode adalah AGENT SKILL (SKILL.md). Anda WAJIB menyertakan:
  "skillName": "nama-skill-kebab-case-maks-64-karakter",
  "skillDescription": "deskripsi kapan AI agent harus mengaktifkan skill ini (maks 1024 karakter, jelas dan spesifik)",`:`Target Mode is AGENT SKILL (SKILL.md). You MUST include:
  "skillName": "kebab-case-skill-name-max-64-chars",
  "skillDescription": "clear trigger description explaining when an AI agent should invoke this skill (max 1024 chars)",`:e?"Target Mode adalah PROMPT STANDAR. Fokus pada kejelasan instruksi, batasan, dan format keluaran.":"Target Mode is STANDARD PROMPT. Focus on instruction clarity, constraints, and output format.",r=e?`Anda adalah Arsitek Prompt & Agent Skill Profesional. Tugas Anda mengubah ide singkat pengguna menjadi draft terstruktur untuk Blank Canvas.
${s}

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
${s}

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
Select 3 to 5 of the most relevant block types.`,l=e?`Ide pengguna:
"""
${i}
"""
Susun JSON draft Blank Canvas dalam Bahasa Indonesia.`:`User idea:
"""
${i}
"""
Compose the Blank Canvas draft JSON in English.`,c=await _(l,r);try{const p=Je(c),m=JSON.parse(p);if(!m||typeof m!="object")throw new Error("Parsed draft is not an object.");const h=m,k=(Array.isArray(h.blocks)?h.blocks:[]).map(S=>{if(!S||typeof S!="object")return null;const O=S,T=typeof O.type=="string"?O.type.trim():"custom",P=ze.has(T)?T:"custom",w=L(O.value);if(!w)return null;const A=L(O.label);return{type:P,label:A||void 0,value:w}}).filter(S=>S!==null),o=L(h.title)||L(i).slice(0,60)||(e?"Draft Canvas AI":"AI Canvas Draft"),d=L(h.description),f=L(h.scratchpad),y=L(h.fewShotInput)||void 0,g=L(h.fewShotOutput)||void 0,v=L(h.skillName)||void 0,R=L(h.skillDescription)||void 0;return{title:o,description:d,scratchpad:f,blocks:k,fewShotInput:y,fewShotOutput:g,skillName:v,skillDescription:R}}catch(p){console.warn("Fallback parsing Canvas AI draft JSON:",p);const m=L(c);return{title:L(i).slice(0,60)||(e?"Draft Canvas AI":"AI Canvas Draft"),description:e?"Draft disusun otomatis dari ide pengguna.":"Draft generated automatically from user idea.",scratchpad:m,blocks:[]}}},re=(a,t)=>typeof a!="number"||!Number.isFinite(a)?t:Math.max(0,Math.min(100,Math.round(a))),de=a=>{if(typeof a!="string")return"";let t=a.replace(/\r\n/g,`
`).replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim();return/^```[a-zA-Z0-9_-]*\s*\n/.test(t)&&/\n```$/.test(t)&&(t=t.replace(/^```[a-zA-Z0-9_-]*\s*\n/,"").replace(/\n```$/,"").trim()),t},Ne=a=>Array.isArray(a)?a.map(t=>L(t)).filter(t=>t.length>0):[],ke=(a,t,n)=>{const e=ve();e.title=a.title,e.description=a.description,e.targetMode=t,e.scratchpad=a.scratchpad,e.fewShotInput=a.fewShotInput||"",e.fewShotOutput=a.fewShotOutput||"",e.skillName=a.skillName||"",e.skillDescription=a.skillDescription||"",e.blocks=a.blocks.map(s=>X(s.type,n,s.label,s.value));const i=ca(e,n);if(t==="skill"){const s=da(e,i,n);return de(na(s))}return de(i||a.scratchpad)},za=async(a,t,n,e="id")=>{const i=e==="id",s=a.trim(),r=fe(s),l=t==="auto"?r:t,c=l==="skill"?i?`Karena target adalah AGENT SKILL (SKILL.md), evaluasi juga standar Open Agent Skills:
- YAML frontmatter wajib memiliki "name" (kebab-case, huruf kecil/angka/tanda hubung, maksimal 64 karakter) dan "description" pemicu yang jelas (maksimal 1024 karakter).
- Struktur bagian markdown harus jelas: ## Role & Trigger, ## Input Parameters, ## Execution Steps, dan ## Verification Checklist.
- Pastikan "upgradedDraft" menyertakan "skillName" dan "skillDescription", serta "upgradedFullText" adalah dokumen SKILL.md lengkap dengan YAML frontmatter (--- ... ---) dan isi markdown.`:`Because the target is AGENT SKILL (SKILL.md), also evaluate Open Agent Skills compliance:
- YAML frontmatter must include "name" (lowercase kebab-case, max 64 chars) and a clear trigger "description" (max 1024 chars).
- Markdown sections should clearly cover: ## Role & Trigger, ## Input Parameters, ## Execution Steps, and ## Verification Checklist.
- Ensure "upgradedDraft" includes "skillName" and "skillDescription", and "upgradedFullText" is a complete SKILL.md document with YAML frontmatter (--- ... ---) and markdown body.`:i?'Target adalah PROMPT STANDAR. Pastikan "upgradedFullText" adalah teks prompt siap pakai yang terstruktur rapi (pisahkan bagian dengan baris kosong ganda, tanpa markdown code fence pembungkus).':'Target is STANDARD PROMPT. Ensure "upgradedFullText" is a complete, ready-to-use prompt with clear sections separated by blank lines (no outer markdown code fence).',p=i?`Anda adalah Auditor & Arsitek Prompt/Agent Skill Senior. Tugas Anda:
1. Analisis konten unggahan pengguna berdasarkan kejelasan (clarity), kekhususan (specificity), dan struktur (structure) dengan skor 0-100.
2. Identifikasi kekuatan utama (strengths) dan kelemahan/celah (weaknesses).
3. Tingkatkan konten tersebut menjadi versi yang jauh lebih presisi, terstruktur, dan siap pakai sesuai tujuan peningkatan dari pengguna.
${c}

ATURAN FORMAT MUTLAK:
- Kembalikan HANYA objek JSON murni yang valid tanpa pembuka, tanpa penutup, tanpa code fence \`\`\`json, dan TANPA karakter em dash.
- Seluruh teks penjelasan (strengths, weaknesses, upgradeSummary, dan isi upgradedDraft) ditulis dalam Bahasa Indonesia.

Skema JSON wajib:
{
  "detectedKind": "${l}",
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
    "fewShotOutput": "Contoh keluaran ideal (opsional, string kosong jika tidak perlu)"${l==="skill"?`,
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
  "detectedKind": "${l}",
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
    "fewShotOutput": "Ideal expected output (optional, empty string if unnecessary)"${l==="skill"?`,
    "skillName": "kebab-case-skill-name",
    "skillDescription": "Use this skill when..."`:""}
  },
  "upgradedFullText": "Complete upgraded prompt text or full SKILL.md document with YAML frontmatter"
}`,m=n.trim()?n.trim():i?"Tingkatkan kejelasan instruksi, batasan kualitas, dan struktur agar siap pakai.":"Improve instruction clarity, quality guardrails, and structure for production use.",h=i?`Mode Target: ${t==="auto"?`Otomatis (terdeteksi awal: ${r})`:l}
Tujuan Upgrade: ${m}

Konten yang diunggah:
"""
${s}
"""`:`Target Mode: ${t==="auto"?`Auto (initial detection: ${r})`:l}
Upgrade Goal: ${m}

Uploaded Content:
"""
${s}
"""`,b=await _(h,p);try{const k=Je(b),o=JSON.parse(k);if(!o||typeof o!="object")throw new Error("Parsed upgrade analysis is not an object.");const d=o,f=d.detectedKind,y=t!=="auto"?t:f==="skill"||f==="prompt"?f:l,g=d.scores&&typeof d.scores=="object"?d.scores:{},v=re(g.clarity,75),R=re(g.specificity,72),S=re(g.structure,74),O=Math.round((v+R+S)/3),T=re(g.overall,O),P=Ne(d.strengths),w=Ne(d.weaknesses),A=L(d.upgradeSummary)||(i?"Struktur instruksi, kejelasan peran, dan batasan kualitas telah ditingkatkan.":"Instruction structure, role clarity, and quality constraints have been upgraded."),K=d.upgradedDraft&&typeof d.upgradedDraft=="object"?d.upgradedDraft:{},M=(Array.isArray(K.blocks)?K.blocks:[]).map(B=>{if(!B||typeof B!="object")return null;const q=B,j=typeof q.type=="string"?q.type.trim():"custom",Q=ze.has(j)?j:"custom",ee=L(q.value);if(!ee)return null;const Z=L(q.label);return{type:Q,label:Z||void 0,value:ee}}).filter(B=>B!==null),x={title:L(K.title)||(i?"Hasil Upgrade Canvas":"Upgraded Canvas Draft"),description:L(K.description),scratchpad:L(K.scratchpad),blocks:M,fewShotInput:L(K.fewShotInput)||void 0,fewShotOutput:L(K.fewShotOutput)||void 0,skillName:L(K.skillName)||void 0,skillDescription:L(K.skillDescription)||void 0};let H=de(d.upgradedFullText);const I=y==="skill"&&!/^---\n[\s\S]*?\n---/.test(H);return(!H||I)&&(H=ke(x,y,e)),{detectedKind:y,scores:{clarity:v,specificity:R,structure:S,overall:T},strengths:P.length>0?P:[i?"Memiliki maksud dan arah tugas dasar yang dapat dikenali.":"Has an identifiable core objective and direction."],weaknesses:w.length>0?w:[i?"Dapat diperkuat dengan batasan eksplisit dan format keluaran yang lebih terstruktur.":"Can be strengthened with explicit constraints and a stricter output format."],upgradeSummary:A,upgradedDraft:x,upgradedFullText:H}}catch(k){console.warn("Fallback parsing uploaded content upgrade JSON:",k);const o=de(b),d={title:i?"Hasil Upgrade AI":"AI Upgraded Draft",description:i?"Hasil analisis dan peningkatan otomatis dari konten unggahan.":"Automated analysis and upgrade generated from uploaded content.",scratchpad:L(o||s),blocks:[]},f=l==="skill"&&!/^---\n[\s\S]*?\n---/.test(o)?ke(d,"skill",e):o||ke(d,l,e);return{detectedKind:l,scores:{clarity:74,specificity:70,structure:72,overall:72},strengths:[i?"Konten awal memiliki topik utama yang jelas untuk ditingkatkan.":"Original content has a clear core topic ready for refinement."],weaknesses:[i?"Struktur blok dan batasan eksplisit masih dapat diperkuat.":"Block structure and explicit guardrails can be further reinforced."],upgradeSummary:i?"Konten telah diproses ulang menjadi draf yang lebih rapi dan siap disunting di Canvas.":"Content has been refined into a cleaner draft ready for editing in Canvas.",upgradedDraft:d,upgradedFullText:f}}},Ja=async a=>{const{skillName:t,frameworkName:n="Custom Agent Skill",compiledPrompt:e="",field:i,existingTitle:s="",existingTagline:r="",existingDemoRequest:l="",language:c="id"}=a,p=c==="id",m=p?`Anda adalah Principal Product Architect & Spesialis Optimasi SEO & GEO (Generative Engine Optimization) untuk AI Agent Skills. Tugas Anda adalah merancang profil produk dan live demo berkualitas tinggi yang mudah ditemukan oleh mesin pencari web (Google, Bing) dan mesin jawaban AI (Perplexity, ChatGPT Search, Claude, Google AI Overviews) serta calon pembeli di marketplace digital.
ATURAN MUTLAK:
1. DILARANG menggunakan tanda em-dash (—). Gunakan koma, strip (-), atau tanda kurung.
2. DILARANG menggunakan kata klise generik AI seperti "Revolusioner", "Unleash", "Game-changer", "Delve", "Transformasi tanpa batas".
3. Gunakan kata kunci pencarian berniat tinggi (search intent): production agent skill, verified workflow, cross-runtime, deterministic, zero hallucination.
4. Buat kalimat padat, bernilai tinggi, dan memiliki definisi konkret (answer capsule) yang dapat dikutip langsung oleh LLM dan mesin pencari.`:`You are a Principal Product Architect and SEO/GEO (Generative Engine Optimization) Specialist for AI Agent Skills. Your mission is to craft commercial, discoverable product copy and real-world demo exemplars (Request and Result) optimized for web search engines (Google, Bing) and AI answer engines (Perplexity, ChatGPT Search, Claude, Google AI Overviews).
STRICT RULES:
1. NEVER use em-dashes (—). Use commas, hyphens (-), or parentheses.
2. NEVER use generic AI cliches such as "Revolutionary", "Unleash", "Game-changer", "Delve", "Tapestry".
3. Incorporate high-intent search keywords: production agent skill, deterministic workflow, cross-runtime, zero hallucination.
4. Provide concrete, quotable definition capsules and structured deliverables that search engines and AI agents can cite as authoritative sources.`;if(i==="name"){const o=p?`Nama Judul Skill: "${s||n||t}"
Konteks Prompt:
${e?e.slice(0,1e3):"(Kompiler otomatis)"}

Buat SATU nama identifier skill standar Open Agent Skills dalam format KEBAB-CASE murni (hanya huruf kecil a-z, angka 0-9, dan tanda hubung '-', maksimal 64 karakter, contoh: "nextjs-fullstack-architect" atau "seo-geo-content-engine").
HANYA kembalikan teks kebab-case saja tanpa tanda kutip, tanpa spasi, dan tanpa penjelasan:`:`Skill Title: "${s||n||t}"
Prompt Context:
${e?e.slice(0,1e3):"(Auto-compiled)"}

Generate ONE clean Open Agent Skills identifier name in pure KEBAB-CASE format (lowercase a-z, numbers 0-9, and '-' only, max 64 chars, e.g. "nextjs-fullstack-architect" or "seo-geo-content-engine").
Return ONLY the kebab-case identifier without quotes, without spaces, and without explanation:`,d=await _(o,m);return{name:U(d).toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"").slice(0,64)||"custom-agent-skill"}}if(i==="title"){const o=p?`Nama Kebab-Case Skill: "${t}"
Kerangka Kerja Terkait: "${n}"
Konteks Prompt Bawaan:
${e?e.slice(0,1500):"(Kompiler prompt otomatis)"}

Buat SATU judul produk komersial ramah SEO yang mengandung kata kunci pencarian berniat tinggi (maksimal 60 karakter, contoh: "Next.js Fullstack Production Agent Skill").
HANYA kembalikan teks judul saja tanpa tanda kutip dan tanpa penjelasan:`:`Kebab-Case Skill Name: "${t}"
Related Framework: "${n}"
Prompt Context:
${e?e.slice(0,1500):"(Auto-compiled prompt)"}

Generate ONE high-intent, SEO-friendly commercial title for an agent skill marketplace (max 60 chars, e.g. "Next.js Fullstack Production Agent Skill").
Return ONLY the title text without quotes or explanations:`,d=await _(o,m);return{title:U(d).replace(/^["']|["']$/g,"").trim()}}if(i==="tagline"){const o=p?`Nama Skill: "${s||t}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${e?e.slice(0,1500):""}

Buat SATU kalimat tagline bernilai tinggi dan ramah GEO (answer capsule, maksimal 120 karakter, fokus pada hasil kerja konkret yang diotomasi).
HANYA kembalikan teks tagline saja tanpa tanda kutip:`:`Skill Name: "${s||t}"
Framework: "${n}"
Prompt Context:
${e?e.slice(0,1500):""}

Create ONE punchy value-proposition tagline and GEO answer capsule stating the concrete buyer outcome (max 120 chars).
Return ONLY the tagline text without quotes:`,d=await _(o,m);return{tagline:U(d).replace(/^["']|["']$/g,"").trim()}}if(i==="tags"){const o=p?`Nama Skill: "${s||t}"
Kerangka Kerja: "${n}"

Berikan 5 hingga 7 tag penemuan SEO & marketplace tanpa tanda pagar (#), dipisahkan dengan koma.
Sertakan tag format ('open-agent-skills', 'agent-skill'), runtime ('claude-code', 'cursor-rules', 'antigravity'), serta kata kunci domain teknis.
HANYA kembalikan teks tag dipisahkan koma:`:`Skill Name: "${s||t}"
Framework: "${n}"

Provide 5 to 7 high-intent SEO & marketplace discovery tags without hash symbols (#), separated by commas.
Include format tags ('open-agent-skills', 'agent-skill'), runtime keywords ('claude-code', 'cursor-rules', 'antigravity'), and specific technical domain keywords.
Return ONLY comma-separated tags:`,d=await _(o,m);return{tags:U(d).replace(/^["']|["']$/g,"").trim().split(",").map(g=>g.trim().replace(/^#/,"")).filter(Boolean)}}if(i==="description"){const o=p?`Nama Produk Skill: "${s||t}"
Tagline: "${r||""}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${e?e.slice(0,2e3):""}

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
Didukung penuh pada 27 runtime Open Agent Skills termasuk Google Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, Codex, dan OpenCode.`:`Skill Product Name: "${s||t}"
Tagline: "${r||""}"
Framework: "${n}"
Prompt Context:
${e?e.slice(0,2e3):""}

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
Supported across 27 Open Agent Skills runtimes including Google Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, Codex, and OpenCode.`,d=await _(o,m);return{description:U(d).trim()}}if(i==="demoRequest"){const o=p?`Nama Skill: "${s||t}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${e?e.slice(0,1500):""}

Susun SATU contoh permintaan nyata (Demo Request) yang realistis, menantang, dan mencerminkan kueri pencarian pembeli potensial (high-intent user search query).
Permintaan harus spesifik, memberikan konteks masalah nyata, dan meminta solusi teknis lengkap.
HANYA kembalikan teks prompt permintaan tanpa kata pengantar:`:`Skill Name: "${s||t}"
Framework: "${n}"
Prompt Context:
${e?e.slice(0,1500):""}

Draft ONE realistic, high-intent demo request (the user prompt) that mirrors real customer search queries when looking for an agent solution.
It should provide realistic task context and request complete deliverables.
Return ONLY the prompt request text without preamble:`,d=await _(o,m);return{demoRequest:U(d).trim()}}if(i==="demoResult"){const o=p?`Nama Skill: "${s||t}"
Kerangka Kerja: "${n}"
Permintaan Pengguna (Demo Request):
"${l||"Lakukan audit dan implementasi solusi sesuai standar arsitektur terbaik."}"
Konteks Prompt:
${e?e.slice(0,1500):""}

Susun SATU contoh hasil eksekusi (Demo Result) berstandar emas yang diberikan oleh AI Agent.
Hasil harus ramah GEO (mudah dikutip oleh Perplexity / SearchGPT) dan mencakup:
## Ringkasan Eksekutif
## Hasil Eksekusi / Spesifikasi Solusi
## Langkah Penerapan & Verifikasi Mutu
Minimal 700 karakter, terstruktur rapi, deterministik, dan konkret.
HANYA kembalikan teks output hasil tanpa kata pengantar:`:`Skill Name: "${s||t}"
Framework: "${n}"
User Request (Demo Request):
"${l||"Perform an audit and deliver the production solution following architecture best practices."}"
Prompt Context:
${e?e.slice(0,1500):""}

Draft ONE gold-standard execution result (Demo Result) delivered by the AI Agent.
It must be GEO-friendly (quotable by Perplexity / SearchGPT) and include:
## Executive Summary
## Deliverable / Solution Specification
## Quality Gate & Verification Steps
At least 700 characters, structured, concrete.
Return ONLY the output result markdown without preamble:`,d=await _(o,m);return{demoResult:U(d).trim()}}const h=p?`Nama Kebab-Case Skill: "${t}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${e?e.slice(0,2e3):""}

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
${e?e.slice(0,2e3):""}

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
Return ONLY valid JSON without markdown codeblock wrapper (\`\`\`json):`,b=await _(h,m),k=b.replace(/^```json\s*/i,"").replace(/^```\s*/,"").replace(/\s*```$/,"").trim();try{const o=JSON.parse(k);return{title:typeof o.title=="string"?o.title.trim():void 0,tagline:typeof o.tagline=="string"?o.tagline.trim():void 0,tags:Array.isArray(o.tags)?o.tags.map(String):void 0,priceUsd:typeof o.priceUsd=="number"?o.priceUsd:14.99,description:typeof o.description=="string"?o.description.trim():void 0,demoRequest:typeof o.demoRequest=="string"?o.demoRequest.trim():void 0,demoResult:typeof o.demoResult=="string"?o.demoResult.trim():void 0}}catch{return{title:p?`Paket Spesialis ${n}`:`${n} Specialist Pack`,tagline:p?"Otomasi alur kerja prompt cerdas dan deterministik dengan panduan teruji.":"Automates intelligent, deterministic prompt workflows with production guardrails.",tags:["AI Agent","Prompt Engineering","Productivity"],priceUsd:14.99,description:b}}},Wa=async(a,t,n="id")=>{const e=n==="id",i=e?`Anda adalah Copywriter Produk AI dan Penjualan Agent Skills berstandar tinggi. Buat teks promosi singkat, menarik, dan bernilai tinggi untuk mempromosikan paket skill ini kepada praktisi AI, kreator, dan engineer.
DILARANG menggunakan kata-kata klise seperti "Revolusioner", "Game-changer", "Unleash", atau tanda em-dash (—). Gunakan kalimat lugas, profesional, dan tajam.`:`You are an elite AI Product and Agent Skills copywriter. Create a concise, compelling, high-converting promotional post for this skill pack targeting AI practitioners, creators, and engineers.
DO NOT use overused AI cliches like "Revolutionary", "Game-changer", "Unleash", or em-dashes (—). Keep it crisp, professional, and punchy.`,s=e?`Nama Paket Skill: "${a}"
Ringkasan Kemampuan: "${t}"

Susun 1 draft posting promosi / pitch singkat (X / LinkedIn / Komunitas):
1. Hook pembuka yang menyorot masalah nyata (pain point) yang sering dihadapi.
2. Solusi konkret yang diberikan oleh paket skill ini dalam format 3 poin ringkas.
3. Call to Action (CTA) yang jelas.

Format teks polos yang rapi dan siap disalin:`:`Skill Pack Name: "${a}"
Capability Summary: "${t}"

Draft 1 concise promotional post / pitch hook (for X / LinkedIn / Communities):
1. Opening hook highlighting a real workflow pain point.
2. Concrete solution delivered by this skill pack in 3 bullet points.
3. Clear Call to Action (CTA).

Plain text format, cleanly formatted and ready to copy:`,r=await _(s,i);return U(r).trim()};export{G as A,Ta as B,oe as C,na as D,Ua as E,Ha as F,Da as G,ve as H,Ga as I,qa as J,Ma as K,xa as L,za as M,Oe as a,_a as b,X as c,ga as d,Va as e,Fa as f,Ue as g,Ea as h,ja as i,Ba as j,fe as k,F as l,La as m,Ja as n,Wa as o,Ra as p,Ka as q,Te as r,V as s,Y as t,ca as u,$a as v,Na as w,Ca as x,Oa as y,da as z};
