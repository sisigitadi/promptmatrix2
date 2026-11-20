import{A as $e,t as re,a as Le,b as Ke,c as Ne,d as _e,e as Be,f as je}from"./data-localization-BEmRbY13.js";const U=a=>a?a.replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/\r\n/g,`
`).replace(/\r/g,`
`):"",oa=(a,t,n,e,i,r,c,o)=>{var O;const l=t||"Prompt Framework",k=n||"General",h=e||void 0;let m="";const u=(a==null?void 0:a.ai_logic_description)||(a==null?void 0:a.logika_ai);u&&(o==="en"?m=$e[l]||`AI Persona: ${re(u.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,""),"en")}`:m=`Persona AI: ${u.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,"").trim()}`),m=U(m);let p=(a==null?void 0:a.components)||[];p.length===0&&((O=a==null?void 0:a.komponen_prompt)!=null&&O["VARIABEL INPUT"])&&(p=Object.entries(a.komponen_prompt["VARIABEL INPUT"]).map(([v,w])=>({...w,name:w.name||v})));let s=[];if(a!=null&&a.dynamicSubcomponents){const v=a.dynamicSubcomponents.trigger,w=String(i[v]||"");w&&a.dynamicSubcomponents.options[w]&&(s=a.dynamicSubcomponents.options[w])}const d=[...p,...s],f={},y=[];d.forEach(v=>{let w=i[v.name];if((w==="Lainnya..."||w==="Other...")&&(w=r[v.name]?`${w} (${r[v.name]})`:w),w!=null&&String(w).trim()!==""){const R=o==="en"?Le(v.label||v.name,"en"):v.label||v.name;let N=w;if(typeof w=="string"){const K=o==="en"?Ke(w,"en"):w;N=U(K)}else Array.isArray(w)&&(N=w.map(K=>U(String(K))));f[R]=N,y.push(`${R}: ${Array.isArray(N)?N.join(", "):N}`)}});let b;if(a!=null&&a.konteks_tambahan_instruksi_khusus){const v=o==="en"?re(a.konteks_tambahan_instruksi_khusus,"en"):a.konteks_tambahan_instruksi_khusus;b=U(v),y.push(`${o==="id"?"Instruksi Tambahan":"Additional Instructions"}: ${b}`)}let P;const L=i.__few_shot_input,S=i.__few_shot_output;(L||S)&&(P={sample_input:L?U(String(L)):void 0,expected_output:S?U(String(S)):void 0});const I=[];m&&I.push({role:"system",content:m});const T=y.length>0?y.join(`

`):c?U(c):"Execute task according to framework specifications.";return I.push({role:"user",content:T}),{template:l,category:k,subcategory:h,language:o,persona:m,parameters:f,additional_instructions:b,few_shot:P,prompt:U(c),messages:I}},la=(a,t="full")=>{let n;t==="messages"?n={messages:a.messages}:t==="prompt_only"?n={prompt:a.prompt}:n=a;try{const e=JSON.stringify(n,null,2);return JSON.parse(e),e}catch(e){return console.warn("First serialization pass failed, applying strict ASCII/fallback sanitization:",e),JSON.stringify(n,(r,c)=>typeof c=="string"?U(c):c,2)}},ae=64,oe=1024,me=/^[a-z0-9]+(?:-[a-z0-9]+)*$/,D=a=>U(a).replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim(),Fe=(a,t)=>{const n=a.replace(/\s+/g," ").trim();if(n.length<=t)return n;const e=n.slice(0,Math.max(0,t-3)),i=e.lastIndexOf(" ");return`${(i>Math.floor(t*.6)?e.slice(0,i):e).trim()}...`},J=a=>`"${D(a).replace(/\s+/g," ").trim().replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`,W=a=>{const t=D(a).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"");return t&&t.slice(0,ae).replace(/-+$/g,"")||"promptmatrix-agent-skill"},Ge=(a,t)=>{var e;if(!a)return[];let n=a.components?[...a.components]:[];if(n.length===0&&((e=a.komponen_prompt)!=null&&e["VARIABEL INPUT"])&&(n=Object.entries(a.komponen_prompt["VARIABEL INPUT"]).map(([i,r])=>({...r,name:r.name||i}))),a.dynamicSubcomponents){const i=a.dynamicSubcomponents.trigger,r=String(t[i]??""),c=a.dynamicSubcomponents.options[r];r&&Array.isArray(c)&&(n=[...n,...c])}return n},ca=a=>{const{framework:t,frameworkName:n,category:e,subcategory:i,formValues:r,customOtherValues:c,compiledPrompt:o,language:l,author:k="Sigit Adi (PromptMatrix)",version:h="1.0.0"}=a,m=n||"PromptMatrix Custom Skill",u=D(Be(m,l)),p=W(m),d=D(Ne(e||"General",l)),f=i?D(_e(i,l)):"";let y="";const b=(t==null?void 0:t.ai_logic_description)||(t==null?void 0:t.logika_ai);if(b){const $=b.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i,"").trim();l==="en"?y=D($e[m]||`AI Persona: ${re($,"en")}`):y=D(`Persona AI: ${$}`)}const P=(t==null?void 0:t.description)||"",L=D(je(P,l,m)),S=f?`${d} (${f})`:d,I=l==="id"?`Gunakan skill ini saat pengguna membutuhkan workflow terstruktur untuk ${u} pada domain ${S}.`:`Use this skill when the user needs a structured workflow for ${u} in ${S}.`,T=L?`${L} ${I}`:`${u} workflow skill. ${I}`,O=Fe(D(T),oe),v=Ge(t,r),w=[],R=new Set;v.forEach($=>{R.add($.name);let _=r[$.name];if(_==="Lainnya..."||_==="Other..."){const H=c[$.name];_=H?`${_} (${H})`:_}const ne=D(l==="en"?Le($.label||$.name,"en"):$.label||$.name);if(_!=null&&String(_).trim()!==""){const H=Array.isArray(_)?_.map(ce=>D(String(ce))).join(", "):D(typeof _=="string"&&l==="en"?Ke(_,"en"):String(_));w.push(`- **${ne}**: ${H}`)}else{const H=$.optional?l==="id"?"opsional":"optional":l==="id"?"isi sesuai konteks":"provide per context",ce=$.placeholder?` (${D($.placeholder)})`:"";w.push(`- **${ne}**: _${H}_${ce}`)}}),Object.entries(r).forEach(([$,_])=>{if($==="__few_shot_input"||$==="__few_shot_output"||R.has($)||_===void 0||_===null||String(_).trim()==="")return;const ne=Array.isArray(_)?_.map(H=>D(String(H))).join(", "):D(String(_));w.push(`- **${D($)}**: ${ne}`)});let N="";t!=null&&t.konteks_tambahan_instruksi_khusus&&(N=D(l==="en"?re(t.konteks_tambahan_instruksi_khusus,"en"):t.konteks_tambahan_instruksi_khusus));const K=r.__few_shot_input?D(String(r.__few_shot_input)):"",C=r.__few_shot_output?D(String(r.__few_shot_output)):"",A=[y||(l==="id"?`Bertindak sebagai spesialis untuk menjalankan kerangka kerja ${u}.`:`Act as a domain specialist executing the ${u} workflow.`),"",l==="id"?`- **Pemicu Utama**: Aktifkan saat tugas berkaitan dengan ${u} (${S}).`:`- **Trigger Condition**: Activate when the task involves ${u} (${S}).`,l==="id"?`- **Format Keluaran Target**: ${(t==null?void 0:t.output)==="json_prompt"?"JSON terstruktur sesuai kontrak":"Respons terstruktur sesuai parameter"}.`:`- **Target Output Format**: ${(t==null?void 0:t.output)==="json_prompt"?"Structured JSON contract":"Structured response aligned with parameters"}.`].join(`
`),B=w.length>0?w.join(`
`):l==="id"?"- Tidak ada parameter wajib; gunakan konteks permintaan pengguna secara langsung.":"- No mandatory input variables; operate directly from the user request context.",G=D(o),x=l==="id"?["1. Validasi seluruh parameter masukan dan klarifikasi bagian yang belum terisi jika krusial.","2. Terapkan persona serta batasan instruksi di bawah ini secara konsisten.","3. Susun keluaran akhir menggunakan struktur kerja berikut:"]:["1. Validate all input parameters and clarify missing critical constraints before proceeding.","2. Apply the assigned role, constraints, and domain instructions consistently.","3. Produce the final deliverable following the compiled prompt contract below:"];N&&(x.push(""),x.push(l==="id"?`**Instruksi Khusus**: ${N}`:`**Additional Instructions**: ${N}`)),G&&(x.push(""),x.push("```text"),x.push(G),x.push("```"));const z=x.join(`
`),X=l==="id"?["- [ ] Seluruh parameter input utama telah tercermin pada hasil akhir.","- [ ] Format keluaran bersih, bebas placeholder kosong, dan siap pakai.","- [ ] Batasan keamanan, privasi, dan konsistensi fakta telah diperiksa."].join(`
`):["- [ ] Every filled input parameter is reflected accurately in the output.","- [ ] Output format is clean, free of unresolved placeholders, and ready to use.","- [ ] Constraints, edge cases, and factual accuracy have been verified."].join(`
`);let Y;if(K||C){const $=[];K&&($.push(l==="id"?"### Contoh Masukan":"### Sample Input"),$.push("```text"),$.push(K),$.push("```")),C&&($.length>0&&$.push(""),$.push(l==="id"?"### Contoh Keluaran yang Diharapkan":"### Expected Output"),$.push("```text"),$.push(C),$.push("```")),Y=$.join(`
`)}const Ce=[`# ${u}`,"","## Role & Trigger",A,"","## Input Parameters",B,"","## Execution Steps",z,"","## Verification Checklist",X];return Y&&Ce.push("","## Few-Shot Reference",Y),{name:p,description:O,license:"MIT",compatibility:"Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills runners.",metadata:{author:D(k),version:D(h),source:"PromptMatrix 2.0",category:d,language:l,framework:D(m)},body:Ce.join(`
`).trim(),sections:{roleAndTrigger:A,inputParameters:B,executionSteps:z,verificationChecklist:X,fewShotReference:Y}}},da=a=>{const t=[],n=[],e=a.name.trim(),i=a.description.trim(),r=a.body.trim();return e?(e.length>ae&&t.push(`Skill name exceeds ${ae} characters (${e.length}).`),me.test(e)||t.push("Skill name must be lowercase kebab-case (a-z, 0-9, single hyphens only).")):t.push("Skill name is required."),i?i.length>oe&&t.push(`Skill description exceeds ${oe} characters (${i.length}).`):t.push("Skill description is required."),r||t.push("Skill Markdown body cannot be empty."),a.license.trim()||n.push("License field is empty; MIT is recommended."),i.length>0&&i.length<40&&n.push("Description is short; include clearer trigger conditions for agent discovery."),{valid:t.length===0,errors:t,warnings:n,nameLength:e.length,descriptionLength:i.length}},Ue=a=>`${["---",`name: ${a.name}`,`description: ${J(a.description)}`,`license: ${a.license||"MIT"}`,`compatibility: ${J(a.compatibility)}`,"metadata:",`  author: ${J(a.metadata.author)}`,`  version: ${J(a.metadata.version)}`,`  source: ${J(a.metadata.source)}`,`  category: ${J(a.metadata.category)}`,`  language: ${J(a.metadata.language)}`,`  framework: ${J(a.metadata.framework)}`,"---"].join(`
`)}

${a.body.trim()}
`,qe=new Set(["and","the","for","with","from","into","your"]),Ve=["unlock","elevate","empower","delve","showcase","testament","landscape","journey","robust","game-changer","next-level","next-generation","seamless","seamlessly","cutting-edge","revolutionary","revolutionizing","ultimate","unleash","tapestry"],ze=new RegExp(`\\b(${Ve.join("|")})\\b`,"gi"),He=[{heading:"Role & Trigger",pattern:/^##\s+Role\s*&\s*Trigger\b/im},{heading:"Input Parameters",pattern:/^##\s+Input\s+Parameters\b/im},{heading:"Execution Steps",pattern:/^##\s+Execution\s+Steps\b/im},{heading:"Verification Checklist",pattern:/^##\s+Verification\s+Checklist\b/im}],ua=(a,t)=>{const n=a.name.trim(),e=a.description.trim(),i=a.body.trim(),r=((t==null?void 0:t.tagline)??"").trim(),c=((t==null?void 0:t.demoRequest)??"").trim(),o=((t==null?void 0:t.demoResult)??"").trim(),l=(t==null?void 0:t.tags)??[],k=n.length>0&&n.length<=ae&&me.test(n),h=e.length>=40&&e.length<=oe,m=He.filter(K=>!K.pattern.test(i)).map(K=>K.heading),u=m.length===0,p=[n,e,a.compatibility,i,r,c,o,l.join(" ")].join(`
`),s=(p.match(/\u2014/g)||[]).length,d=s===0,f=Array.from(new Set((p.match(ze)||[]).map(K=>K.toLowerCase()))),y=f.length===0,b=l.filter(K=>{const C=K.trim();return!C||C.startsWith("#")||qe.has(C.toLowerCase())||!me.test(C)}),P=l.length>=3&&l.length<=7,L=P&&b.length===0,S=r.length>0,I=c.length>=25,T=/^##\s+Summary\b/im.test(o),O=o.length>=700&&T,v=[{id:"valid-name",label:"Valid kebab-case slug (<= 64 chars)",passed:k,detail:k?`${n} (${n.length}/${ae} chars)`:"Skill name must be non-empty lowercase kebab-case and at most 64 characters."},{id:"valid-description",label:"Discovery description (40-1024 chars)",passed:h,detail:h?`${e.length} chars (within 40-1024 limit)`:`Description is ${e.length} chars; target 40-1024 chars.`},{id:"required-sections",label:"Required SKILL.md playbook sections",passed:u,detail:u?"All 4 sections present (Role & Trigger, Input Parameters, Execution Steps, Verification Checklist).":`Missing sections: ${m.join(", ")}`},{id:"zero-em-dashes",label:"Zero em-dash characters (U+2014)",passed:d,detail:d?"No em-dash characters found.":`Found ${s} em-dash character(s); replace with commas, colons, or parentheses.`},{id:"zero-ai-buzzwords",label:"Zero banned AI marketing buzzwords",passed:y,detail:y?"Copy passes anti-buzzword check.":`Remove buzzwords: ${f.join(", ")}`},{id:"clean-tags",label:"Clean marketplace tags (3-7 kebab-case, no # or stopwords)",passed:L,detail:L?`${l.length} clean tags: ${l.join(", ")}`:P?`Invalid tag(s): ${b.join(", ")}`:`Expected 3-7 tags; received ${l.length}.`},{id:"tagline-present",label:"Marketplace tagline present",passed:S,detail:S?`${r.length} chars`:"Add a concise 1-sentence tagline describing the concrete skill outcome."},{id:"demo-request",label:"Step 3 demo request (>= 25 chars)",passed:I,detail:I?`${c.length} chars`:`Demo request is ${c.length} chars (minimum 25 chars).`},{id:"demo-result",label:"Step 3 demo result (>= 700 chars + ## Summary)",passed:O,detail:O?`${o.length} chars with ## Summary section`:`Demo result is ${o.length} chars (need >= 700 chars and a ## Summary heading).`}],w=v.length,R=v.filter(K=>K.passed).length;return{score:w>0?Math.round(R/w*100):0,passedCount:R,totalCount:w,checks:v}},pa="__blank_canvas__",be="pm_blank_canvas_draft",fe="Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills runners.",ee=64,ke=1024,se=[{type:"persona",labelId:"Persona AI",labelEn:"AI Persona",placeholderId:"Contoh: Senior Software Architect dengan pengalaman 10 tahun di sistem terdistribusi...",placeholderEn:"e.g. Senior Software Architect with 10 years of experience in distributed systems...",hintId:"Tetapkan peran, keahlian, dan sudut pandang model AI.",hintEn:"Define the role, expertise, and perspective of the AI model.",editableLabel:!1},{type:"context",labelId:"Konteks & Tujuan",labelEn:"Context & Goal",placeholderId:"Jelaskan latar belakang proyek, situasi saat ini, dan sasaran akhir yang ingin dicapai...",placeholderEn:"Describe project background, current situation, and the end objective...",hintId:"Berikan informasi situasi agar AI memahami ruang lingkup masalah.",hintEn:"Provide situational context so the AI understands the problem scope.",editableLabel:!1},{type:"task",labelId:"Tugas Utama",labelEn:"Core Task",placeholderId:"Uraikan tugas spesifik yang harus dikerjakan AI langkah demi langkah...",placeholderEn:"Specify the exact task the AI needs to execute step by step...",hintId:"Fokus pada aksi konkret yang diharapkan dari model.",hintEn:"Focus on the concrete action expected from the model.",editableLabel:!1},{type:"constraints",labelId:"Batasan & Kriteria",labelEn:"Constraints & Rules",placeholderId:"Contoh: Jangan mengarang fakta, hindari jargon berlebihan, maksimal 300 kata...",placeholderEn:"e.g. Do not fabricate facts, avoid unnecessary jargon, max 300 words...",hintId:"Tetapkan pagar pengaman, larangan, dan syarat kualitas.",hintEn:"Set guardrails, exclusions, and quality criteria.",editableLabel:!1},{type:"output_format",labelId:"Format Output",labelEn:"Output Format",placeholderId:"Contoh: Tabel Markdown dengan 3 kolom, JSON valid, atau poin bernomor...",placeholderEn:"e.g. 3-column Markdown table, valid JSON, or numbered action items...",hintId:"Tentukan struktur visual atau format data dari hasil akhir.",hintEn:"Specify the visual structure or data format of the final output.",editableLabel:!1},{type:"audience",labelId:"Target Audiens",labelEn:"Target Audience",placeholderId:"Contoh: Manajer produk non-teknis, developer pemula, atau eksekutif C-level...",placeholderEn:"e.g. Non-technical product managers, junior developers, or C-level executives...",hintId:"Sesuaikan tingkat kedalaman bahasa dengan pembaca akhir.",hintEn:"Tailor vocabulary and depth to the intended reader.",editableLabel:!1},{type:"variable",labelId:"Variabel Input",labelEn:"Input Variable",placeholderId:"Masukkan nilai data, cuplikan teks, atau parameter khusus untuk diproses...",placeholderEn:"Provide input data, source text snippet, or custom parameter to process...",hintId:"Label dapat diubah sesuai nama variabel atau data masukan Anda.",hintEn:"Label can be edited to match your custom input variable name.",editableLabel:!0},{type:"custom",labelId:"Bagian Kustom",labelEn:"Custom Section",placeholderId:"Isi instruksi atau referensi tambahan sesuai kebutuhan spesifik Anda...",placeholderEn:"Enter additional instructions or references tailored to your workflow...",hintId:"Label bebas disesuaikan untuk kebutuhan blok apa pun.",hintEn:"Label can be freely customized for any section you need.",editableLabel:!0}],Je=new Set(se.map(a=>a.type)),g=a=>U(a).replace(/\u2014/g,", ").replace(/\u2013/g,"-"),ye=a=>{if(typeof a=="number"&&Number.isFinite(a)&&a>=0)return Number(a.toFixed(2));if(typeof a=="string"&&a.trim()){const t=Number(a.trim());if(Number.isFinite(t)&&t>=0)return Number(t.toFixed(2))}},Se=(a,t)=>{const n=a.replace(/\s+/g," ").trim();if(n.length<=t)return n;const e=n.slice(0,Math.max(0,t-3)),i=e.lastIndexOf(" ");return`${(i>Math.floor(t*.6)?e.slice(0,i):e).trim()}...`},te=a=>se.find(n=>n.type===a)??se[se.length-1],Re=a=>{const t=Math.random().toString(36).slice(2,8),n=Date.now().toString(36);return`canvas_${a}_${n}_${t}`},Q=(a,t,n,e)=>{const i=te(a),r=t==="id"?i.labelId:i.labelEn,c=n&&n.trim()?g(n.trim()):r;return{id:Re(a),type:a,label:c,value:e?g(e):"",isCustomLabel:i.editableLabel}},Ae=()=>({title:"",description:"",targetMode:"prompt",scratchpad:"",blocks:[],fewShotInput:"",fewShotOutput:"",skillName:"",skillDescription:"",skillCompatibility:fe,skillTagline:"",skillPriceUsd:void 0,skillTags:"",skillDemoRequest:"",skillDemoResult:"",updatedAt:Date.now()}),Me=a=>{if(!a||typeof a!="object")return null;const t=a,n=typeof t.type=="string"?t.type:"custom",e=Je.has(n)?n:"custom",i=te(e),r=typeof t.id=="string"&&t.id.trim()?g(t.id.trim()):Re(e),c=typeof t.label=="string"&&t.label.trim()?g(t.label):i.labelId,o=typeof t.value=="string"?g(t.value):"",l=typeof t.isCustomLabel=="boolean"?t.isCustomLabel:i.editableLabel;return{id:r,type:e,label:c,value:o,isCustomLabel:l}},ma=()=>{const a=Ae();if(typeof window>"u"||typeof localStorage>"u")return a;try{const t=localStorage.getItem(be);if(!t)return a;const n=JSON.parse(t);if(!n||typeof n!="object")return a;const e=n,i=e.targetMode==="skill"?"skill":"prompt",r=Array.isArray(e.blocks)?e.blocks.map(c=>Me(c)).filter(c=>c!==null):[];return{title:typeof e.title=="string"?g(e.title):"",description:typeof e.description=="string"?g(e.description):"",targetMode:i,scratchpad:typeof e.scratchpad=="string"?g(e.scratchpad):"",blocks:r,fewShotInput:typeof e.fewShotInput=="string"?g(e.fewShotInput):"",fewShotOutput:typeof e.fewShotOutput=="string"?g(e.fewShotOutput):"",skillName:typeof e.skillName=="string"?g(e.skillName):"",skillDescription:typeof e.skillDescription=="string"?g(e.skillDescription):"",skillCompatibility:typeof e.skillCompatibility=="string"&&e.skillCompatibility.trim()?g(e.skillCompatibility):fe,skillTagline:typeof e.skillTagline=="string"?g(e.skillTagline):"",skillPriceUsd:ye(e.skillPriceUsd),skillTags:typeof e.skillTags=="string"?g(e.skillTags):"",skillDemoRequest:typeof e.skillDemoRequest=="string"?g(e.skillDemoRequest):"",skillDemoResult:typeof e.skillDemoResult=="string"?g(e.skillDemoResult):"",updatedAt:typeof e.updatedAt=="number"&&Number.isFinite(e.updatedAt)?e.updatedAt:Date.now()}}catch(t){return console.warn("Failed to load Blank Canvas draft from localStorage:",t),a}},ka=a=>{if(!(typeof window>"u"||typeof localStorage>"u"))try{const t={...a,skillTagline:typeof a.skillTagline=="string"?g(a.skillTagline):"",skillPriceUsd:ye(a.skillPriceUsd),skillTags:typeof a.skillTags=="string"?g(a.skillTags):"",skillDemoRequest:typeof a.skillDemoRequest=="string"?g(a.skillDemoRequest):"",skillDemoResult:typeof a.skillDemoResult=="string"?g(a.skillDemoResult):"",updatedAt:a.updatedAt||Date.now()};localStorage.setItem(be,JSON.stringify(t))}catch(t){console.warn("Failed to save Blank Canvas draft to localStorage:",t)}},ga=()=>{if(!(typeof window>"u"||typeof localStorage>"u"))try{localStorage.removeItem(be)}catch(a){console.warn("Failed to clear Blank Canvas draft from localStorage:",a)}},ha=a=>!!(a.title.trim()||a.description.trim()||a.scratchpad.trim()||a.fewShotInput.trim()||a.fewShotOutput.trim()||a.skillName.trim()||a.skillDescription.trim()||(a.skillTagline||"").trim()||typeof a.skillPriceUsd=="number"||(a.skillTags||"").trim()||(a.skillDemoRequest||"").trim()||(a.skillDemoResult||"").trim()||a.blocks.length>0),We=(a,t)=>{const n=[],e=a.blocks.filter(o=>o.value.trim().length>0);e.forEach(o=>{const l=te(o.type),k=t==="id"?l.labelId:l.labelEn,h=g(o.label.trim())||k,m=g(o.value.trim());n.push(`${h}: ${m}`)});const i=g(a.scratchpad.trim());if(i)if(e.length>0){const o=t==="id"?"Instruksi Utama":"Core Instructions";n.push(`${o}:
${i}`)}else n.push(i);const r=g(a.fewShotInput.trim()),c=g(a.fewShotOutput.trim());if(r){const o=t==="id"?"Contoh Masukan":"Sample Input";n.push(`${o}:
${r}`)}if(c){const o=t==="id"?"Contoh Keluaran yang Diharapkan":"Expected Output";n.push(`${o}:
${c}`)}return g(n.join(`

`))},ba=(a,t,n)=>{const e=g(a.title.trim())||(n==="id"?"Canvas Kosong":"Blank Canvas"),i=n==="id"?"Canvas Kosong":"Blank Canvas",r=a.targetMode==="skill"?"Agent Skill (SKILL.md)":"Custom Prompt",c=a.blocks.filter(b=>b.value.trim().length>0),o=c.filter(b=>b.type==="persona"),l=g(o.map(b=>b.value.trim()).join(`

`)),k={},h=[];c.forEach(b=>{const P=te(b.type),L=n==="id"?P.labelId:P.labelEn,S=g(b.label.trim())||L,I=g(b.value.trim());let T=S,O=2;for(;Object.prototype.hasOwnProperty.call(k,T);)T=`${S} (${O})`,O+=1;k[T]=I,b.type!=="persona"&&h.push(`${S}: ${I}`)});const m=g(a.scratchpad.trim());if(m){const b=n==="id"?"Instruksi Utama":"Core Instructions";h.push(`${b}:
${m}`)}const u=g(a.fewShotInput.trim()),p=g(a.fewShotOutput.trim()),s=u||p?{sample_input:u||void 0,expected_output:p||void 0}:void 0,d=[];l&&d.push({role:"system",content:l});const f=g(t.trim()),y=n==="id"?"Jalankan instruksi sesuai spesifikasi Canvas Kosong.":"Execute task according to Blank Canvas specifications.";return d.push({role:"user",content:h.length>0?h.join(`

`):f||y}),{template:e,category:i,subcategory:r,language:n,persona:l,parameters:k,additional_instructions:m||void 0,few_shot:s,prompt:f,messages:d}},Ye=(a,t,n)=>{const e=g(a.title.trim())||(n==="id"?"Skill Canvas Kustom":"Custom Canvas Skill"),i=a.skillName.trim()||a.title.trim()||"custom-canvas-skill",r=W(i).slice(0,ee),c=g(a.description.trim()),o=g(a.skillDescription.trim()),l=n==="id"?`Gunakan skill ini saat pengguna membutuhkan alur kerja terstruktur untuk ${e}.`:`Use this skill when the user needs a structured workflow for ${e}.`,k=o||(c?`${c} ${l}`:l),h=Se(g(k),ke),m=g(a.skillCompatibility.trim())||fe,u=a.blocks.filter(A=>A.value.trim().length>0),p=u.filter(A=>A.type==="persona"),s=u.filter(A=>A.type==="output_format"),d=u.filter(A=>A.type==="constraints"),f=p.length>0?g(p.map(A=>A.value.trim()).join(" ")):n==="id"?`Bertindak sebagai spesialis domain untuk menjalankan skill ${e}.`:`Act as a domain specialist executing the ${e} skill.`,y=o||c||e,b=s.length>0?g(s.map(A=>A.value.trim()).join("; ")):n==="id"?"Respons terstruktur sesuai parameter dan instruksi.":"Structured response aligned with parameters and instructions.",P=[f,"",n==="id"?`- **Pemicu Utama**: ${y}`:`- **Trigger Condition**: ${y}`,n==="id"?`- **Format Keluaran Target**: ${b}`:`- **Target Output Format**: ${b}`].join(`
`),L=u.map(A=>{const B=te(A.type),G=n==="id"?B.labelId:B.labelEn,x=g(A.label.trim())||G,z=g(A.value.trim());return`- **${x}**: ${z}`}),S=L.length>0?L.join(`
`):n==="id"?"- Tidak ada blok parameter khusus; jalankan langsung berdasarkan konteks permintaan pengguna.":"- No dedicated parameter blocks defined; operate directly from the user request context.",I=g(a.scratchpad.trim()),T=g(t.trim()),O=n==="id"?["1. Tinjau seluruh konteks, variabel masukan, dan batasan yang ditetapkan.","2. Ikuti instruksi inti secara berurutan tanpa melewati langkah verifikasi.","3. Hasilkan keluaran akhir mengikuti spesifikasi prompt di bawah ini:"]:["1. Review all context, input variables, and constraints defined in this skill.","2. Follow the core instructions sequentially without skipping verification steps.","3. Produce the final deliverable matching the prompt specification below:"];I&&u.length>0&&(O.push(""),O.push(n==="id"?`**Instruksi Scratchpad**: ${I}`:`**Scratchpad Instructions**: ${I}`)),T&&(O.push(""),O.push("```text"),O.push(T),O.push("```"));const v=O.join(`
`),w=n==="id"?["- [ ] Seluruh blok parameter dan instruksi inti telah dipenuhi.","- [ ] Format keluaran bersih, bebas placeholder kosong, dan siap digunakan.","- [ ] Fakta, konsistensi, serta keamanan informasi telah divalidasi."]:["- [ ] Every defined parameter block and core instruction is satisfied.","- [ ] Output format is clean, free of unresolved placeholders, and ready to use.","- [ ] Factual accuracy, consistency, and safety constraints are verified."];if(d.length>0){const A=g(d.map(B=>B.value.trim()).join("; "));w.push(n==="id"?`- [ ] Batasan khusus dipatuhi: ${A}`:`- [ ] Custom constraints honored: ${A}`)}const R=w.join(`
`),N=g(a.fewShotInput.trim()),K=g(a.fewShotOutput.trim());let C;if(N||K){const A=[];N&&(A.push(n==="id"?"### Contoh Masukan":"### Sample Input"),A.push("```text"),A.push(N),A.push("```")),K&&(A.length>0&&A.push(""),A.push(n==="id"?"### Contoh Keluaran yang Diharapkan":"### Expected Output"),A.push("```text"),A.push(K),A.push("```")),C=A.join(`
`)}const M=[`# ${e}`,"","## Role & Trigger",P,"","## Input Parameters",S,"","## Execution Steps",v,"","## Verification Checklist",R];return C&&M.push("","## Few-Shot Reference",C),{name:r,description:h,license:"MIT",compatibility:m,metadata:{author:"Sigit Adi (PromptMatrix)",version:"1.0.0",source:"PromptMatrix 2.0 (Blank Canvas)",category:n==="id"?"Canvas Kosong":"Blank Canvas",language:n,framework:e},body:M.join(`
`).trim(),sections:{roleAndTrigger:P,inputParameters:S,executionSteps:v,verificationChecklist:R,fewShotReference:C}}},Pe=a=>{if(!a)return"";const t=a.trim().replace(/^.*[\\/]/,"");return g(t.replace(/\.[^.]+$/,""))},de=a=>{const t=a.split(`
`);for(const n of t){const e=g(n.replace(/^#+\s*/,"").replace(/^[-*]\s*/,"").trim());if(e&&e!=="---")return Se(e,60)}return""},ge=a=>{const t=a.trim().toLowerCase();return/^(?:few[\s-]*shot.*input|sample\s+input|contoh\s+masukan)$/.test(t)?"few_shot_input":/^(?:few[\s-]*shot.*output|expected\s+output|contoh\s+keluaran(?:\s+yang\s+diharapkan)?)$/.test(t)?"few_shot_output":/^(?:core\s+instructions?|instructions?|instruksi\s+utama|scratchpad)$/.test(t)?"scratchpad":/(?:persona|role|peran)/.test(t)?"persona":/(?:context|konteks|background|latar\s+belakang|goal|tujuan)/.test(t)?"context":/(?:input\s*parameters?|parameters?|variable|variabel|inputs?)/.test(t)?"variable":/(?:constraints?|rules?|batasan|kriteria|guardrails?)/.test(t)?"constraints":/(?:output\s*format|format\s*(?:output|keluaran)|deliverables?|^output$)/.test(t)?"output_format":/(?:audience|audiens)/.test(t)?"audience":/(?:execution\s*steps?|steps?|task|tugas|workflow|langkah)/.test(t)?"task":"custom"},Qe=a=>{const t=a.split(`
`);let n="",e="",i="";const r=c=>{const o=c.trim();return o.startsWith('"')&&o.endsWith('"')||o.startsWith("'")&&o.endsWith("'")?o.slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,`
`).replace(/\\\\/g,"\\").trim():o};for(const c of t){const o=c.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);if(!o)continue;const l=o[1].toLowerCase(),k=g(r(o[2]));l==="name"&&k?n=k:l==="description"&&k?e=k:l==="compatibility"&&k&&(i=k)}return{name:n,description:e,compatibility:i}},Ze=a=>{const t=a.trim(),n=o=>g(o.replace(/^```[a-zA-Z0-9_-]*\s*\n?/gm,"").replace(/\n?```\s*$/gm,"").trim()),e=t.match(/(?:###\s*(?:Sample\s+Input|Contoh\s+Masukan)|(?:Sample\s+Input|Contoh\s+Masukan)\s*:)\s*\n?([\s\S]*?)(?=(?:###\s*(?:Expected\s+Output|Contoh\s+Keluaran)|(?:Expected\s+Output|Contoh\s+Keluaran)[^\n]*:)|$)/i),i=t.match(/(?:###\s*(?:Expected\s+Output|Contoh\s+Keluaran[^\n]*)|(?:Expected\s+Output|Contoh\s+Keluaran[^\n]*)\s*:)\s*\n?([\s\S]*)$/i),r=e?n(e[1]):"",c=i?n(i[1]):"";return!r&&!c&&t?{input:n(t),output:""}:{input:r,output:c}},Xe=a=>{const t=a.trim(),n=t.match(/###\s*The\s+Request\s*\n([\s\S]*?)(?=###\s*The\s+Result\b|$)/i),e=t.match(/###\s*The\s+Result\s*\n([\s\S]*)$/i);return{request:n?g(n[1].trim()):"",result:e?g(e[1].trim()):""}},Te=(a,t)=>{const n=a.split(`
`);let e="";const i=[],r=[];let c=null;for(const s of n){const d=!e&&!c?s.match(/^#\s+(.+)$/):null;if(d){e=g(d[1].trim());continue}const f=s.match(/^##\s+(.+)$/);if(f){c&&r.push(c),c={heading:g(f[1].trim()),lines:[]};continue}c?c.lines.push(s):i.push(s)}c&&r.push(c);const o=[],l=[];let k="",h="",m="",u="";const p=g(i.join(`
`).trim());p&&l.push(p);for(const s of r){const d=s.lines.join(`
`).trim(),f=g(d);if(!f)continue;if(/see\s+it\s+in\s+action/i.test(s.heading)){const b=Xe(d);b.request&&!m&&(m=b.request),b.result&&!u&&(u=b.result);continue}if(/few[\s-]*shot/i.test(s.heading)){const b=Ze(d);b.input&&!k&&(k=b.input),b.output&&!h&&(h=b.output);continue}const y=ge(s.heading);y==="scratchpad"?l.push(f):y==="few_shot_input"?k=k||f:y==="few_shot_output"?h=h||f:y==="custom"?o.push(Q("custom",t,s.heading,f)):o.push(Q(y,t,s.heading,f))}return{headingTitle:e,blocks:o,scratchpadParts:l,fewShotInput:k,fewShotOutput:h,demoRequest:m,demoResult:u}},j=a=>typeof a=="string"?g(a.trim()):typeof a=="number"||typeof a=="boolean"?String(a):Array.isArray(a)?g(a.map(t=>typeof t=="string"?t.trim():JSON.stringify(t)).filter(Boolean).join(", ")):a&&typeof a=="object"?g(JSON.stringify(a)):"",he=(a,t)=>{if(t&&/skill\.md$/i.test(t.trim()))return"skill";const n=a.replace(/\r\n/g,`
`).trim();if(!n)return"prompt";const e=n.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);return e&&/^\s*(?:name|description)\s*:/im.test(e[1])||/^##\s+(?:Role\s*&\s*Trigger|Execution\s+Steps|Verification\s+Checklist)\b/im.test(n)?"skill":"prompt"},fa=(a,t,n="id")=>{const e=Ae(),i=a.replace(/\r\n/g,`
`).trim();if(!i)return t&&(e.title=Pe(t)),e.targetMode=he(a,t),e;const r=Pe(t);if(i.startsWith("{")||t&&/\.json$/i.test(t.trim()))try{const p=JSON.parse(i);if(p&&typeof p=="object"&&!Array.isArray(p)){const s=p,d=j(s.template)||j(s.title)||j(s.name)||r||(n==="id"?"Prompt Impor JSON":"Imported JSON Prompt"),f=j(s.description),y=[],b=j(s.persona);b&&y.push(Q("persona",n,void 0,b)),Array.isArray(s.blocks)&&s.blocks.forEach(S=>{const I=Me(S);I&&I.value.trim()&&y.push(I)}),s.parameters&&typeof s.parameters=="object"&&!Array.isArray(s.parameters)&&Object.entries(s.parameters).forEach(([S,I])=>{const T=j(I);if(!T)return;const O=ge(S);if(O==="persona"&&b&&T===b)return;if(O==="scratchpad"){e.scratchpad||(e.scratchpad=T);return}if(O==="few_shot_input"){e.fewShotInput=e.fewShotInput||T;return}if(O==="few_shot_output"){e.fewShotOutput=e.fewShotOutput||T;return}const v=O==="custom"?"variable":O;y.push(Q(v,n,g(S),T))});const P=j(s.scratchpad)||j(s.additional_instructions)||j(s.prompt);if(P&&(e.scratchpad=e.scratchpad?`${e.scratchpad}

${P}`:P),s.few_shot&&typeof s.few_shot=="object"&&!Array.isArray(s.few_shot)){const S=s.few_shot;e.fewShotInput=j(S.sample_input)||e.fewShotInput,e.fewShotOutput=j(S.expected_output)||e.fewShotOutput}else e.fewShotInput=j(s.fewShotInput)||e.fewShotInput,e.fewShotOutput=j(s.fewShotOutput)||e.fewShotOutput;const L=s.targetMode==="skill"||typeof s.subcategory=="string"&&/skill/i.test(s.subcategory)||!!(t&&/skill/i.test(t));if(e.title=d,e.description=f,e.blocks=y,e.targetMode=L?"skill":"prompt",e.targetMode==="skill"){const S=j(s.skillName)||d;e.skillName=W(S).slice(0,ee),e.skillDescription=g(j(s.skillDescription)||f).slice(0,ke),e.skillTagline=j(s.skillTagline),e.skillPriceUsd=ye(s.skillPriceUsd),e.skillTags=j(s.skillTags),e.skillDemoRequest=j(s.skillDemoRequest),e.skillDemoResult=j(s.skillDemoResult)}return e.updatedAt=Date.now(),e}}catch{}const c=i.match(/^---\n([\s\S]*?)\n---(?:\n([\s\S]*))?$/);if(c){const p=Qe(c[1]),s=(c[2]??"").trim(),d=Te(s,n);return e.targetMode="skill",e.skillName=p.name?W(p.name).slice(0,ee):W(d.headingTitle||r||"custom-skill"),e.skillDescription=Se(g(p.description),ke),p.compatibility&&(e.skillCompatibility=p.compatibility),e.title=d.headingTitle||g(p.name)||r||de(s)||(n==="id"?"Agent Skill Impor":"Imported Agent Skill"),e.description=e.skillDescription,e.blocks=d.blocks,e.scratchpad=g(d.scratchpadParts.join(`

`)),e.fewShotInput=d.fewShotInput,e.fewShotOutput=d.fewShotOutput,d.demoRequest&&(e.skillDemoRequest=d.demoRequest),d.demoResult&&(e.skillDemoResult=d.demoResult),e.updatedAt=Date.now(),e}const o=he(i,t),l=(i.match(/^##\s+.+$/gm)||[]).length>=2;if(o==="skill"||l){const p=Te(i,n);if(p.blocks.length>0||p.scratchpadParts.length>0)return e.targetMode=o,e.title=p.headingTitle||r||de(i)||(n==="id"?"Prompt Impor":"Imported Prompt"),e.blocks=p.blocks,e.scratchpad=g(p.scratchpadParts.join(`

`)),e.fewShotInput=p.fewShotInput,e.fewShotOutput=p.fewShotOutput,o==="skill"&&(e.skillName=W(e.title).slice(0,ee)),e.updatedAt=Date.now(),e}const k=i.split(/\n{2,}/).map(p=>p.trim()).filter(Boolean),h=[],m=[];let u=0;for(const p of k){const s=p.match(/^([A-Za-z0-9 &/_()-]{2,40}):\s*([\s\S]+)$/),d=s?s[1].trim():"",f=/^https?$/i.test(d)||s&&s[2].startsWith("//");if(s&&!f){u+=1;const y=g(d),b=g(s[2].trim()),P=ge(y);P==="scratchpad"?m.push(b):P==="few_shot_input"?e.fewShotInput=e.fewShotInput||b:P==="few_shot_output"?e.fewShotOutput=e.fewShotOutput||b:h.push(Q(P,n,y,b))}else m.push(g(p))}return e.targetMode=o,e.title=r||de(i)||(n==="id"?"Prompt Impor":"Imported Prompt"),u>=2?(e.blocks=h,e.scratchpad=g(m.join(`

`))):(e.blocks=[],e.scratchpad=g(i)),e.targetMode==="skill"&&(e.skillName=W(e.title).slice(0,ee)),e.updatedAt=Date.now(),e},ea={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1},Z={gemini:{id:"gemini",name:"Google Gemini (AI Studio)",shortLabel:"Gemini",badge:"GOOGLE",defaultBaseUrl:"https://generativelanguage.googleapis.com",defaultModel:"gemini-4-carbon",models:[{id:"gemini-4-carbon",label:"Gemini 4 Carbon",description:"Flagship frontier penalaran mendalam, rekayasa software kompleks & arsitektur sistem (1M+ konteks, Rekomendasi Utama)"},{id:"gemini-4-argon",label:"Gemini 4 Argon",description:"Model frontier penalaran cepat, tajam & efisiensi tinggi untuk alur kerja produksi"},{id:"gemini-4-hydrogen",label:"Gemini 4 Hydrogen",description:"Workhorse agentic & coding harian berefisiensi tinggi, konteks 1M token"},{id:"gemini-3.8-flash",label:"Gemini 3.8 Flash",description:"Model multimodal produksi latensi ultra-rendah dengan thinking budget adaptif"},{id:"gemini-3.7-flash",label:"Gemini 3.7 Flash",description:"Model multimodal cepat untuk pemrosesan volume tinggi"},{id:"gemini-3.5-flash-lite",label:"Gemini 3.5 Flash-Lite",description:"Model ultra-ringan, super cepat & paling hemat kuota token"}],requiresApiKey:!0,docUrl:"https://aistudio.google.com/app/apikey",placeholderKey:"AIzaSy...",icon:"✨"},openai:{id:"openai",name:"OpenAI (GPT-6 & Reasoning)",shortLabel:"OpenAI",badge:"OPENAI",defaultBaseUrl:"https://api.openai.com/v1",defaultModel:"gpt-6.1-sol",models:[{id:"gpt-6.1-sol",label:"GPT-6.1 Sol",description:"Workhorse optimal menyeimbangkan kecerdasan frontier dan efisiensi biaya (Rekomendasi Utama)"},{id:"gpt-6-astra",label:"GPT-6 Astra",description:"Flagship kecerdasan tertinggi OpenAI untuk coding berat, arsitektur & penalaran ilmiah"},{id:"gpt-6.1-terra",label:"GPT-6.1 Terra",description:"Spesialis penalaran visual, audit dokumen & analisis mendalam"},{id:"gpt-6.1-luna",label:"GPT-6.1 Luna",description:"Latensi sub-detik untuk pemrosesan volume tinggi & otomasi harian"},{id:"gpt-5.2-codex",label:"GPT-5.2 Codex",description:"Model spesialis rekayasa perangkat lunak & refactoring kode kompleks"},{id:"gpt-5",label:"GPT-5",description:"Flagship enterprise stabil generasi GPT-5"}],requiresApiKey:!0,docUrl:"https://platform.openai.com/api-keys",placeholderKey:"sk-proj-...",icon:"🟢"},anthropic:{id:"anthropic",name:"Anthropic (Claude 5.5 & Fable 5.2)",shortLabel:"Claude",badge:"ANTHROPIC",defaultBaseUrl:"https://api.anthropic.com/v1",defaultModel:"claude-sonnet-5-5",models:[{id:"claude-sonnet-5-5",label:"Claude Sonnet 5.5",description:"Flagship keseimbangan kecepatan, coding & penulisan terstruktur (Rekomendasi Utama)"},{id:"claude-opus-5-5",label:"Claude Opus 5.5",description:"Model kelas proyek kompleks, riset mendalam & long-running agentic coding"},{id:"claude-fable-5-2",label:"Claude Fable 5.2",description:"Model penalaran puncak untuk orkestrator sistem & tugas agen jangka panjang"},{id:"claude-haiku-5-5",label:"Claude Haiku 5.5",description:"Eksekusi ultra-cepat & paling ekonomis untuk subagent dan volume tinggi"},{id:"claude-sonnet-4-5",label:"Claude Sonnet 4.5",description:"Generasi 4.5 stabil untuk kompatibilitas router legacy"}],requiresApiKey:!0,docUrl:"https://console.anthropic.com/settings/keys",placeholderKey:"sk-ant-...",icon:"🟧"},deepseek:{id:"deepseek",name:"DeepSeek AI (V4 & R1)",shortLabel:"DeepSeek",badge:"DEEPSEEK",defaultBaseUrl:"https://api.deepseek.com/v1",defaultModel:"deepseek-chat",models:[{id:"deepseek-chat",label:"DeepSeek-Chat (V3 / V4)",description:"Endpoint chat standar teruji untuk tugas umum, coding & penulisan (Rekomendasi Utama Produksi)"},{id:"deepseek-reasoner",label:"DeepSeek-R1 (Reasoner)",description:"Penalaran Chain of Thought 671B untuk logika murni & matematika"},{id:"deepseek-v4-pro",label:"DeepSeek-V4 Pro",description:"Flagship V4 Pro 1M konteks untuk agentic workflow & coding berat (Preset Generasi 4)"},{id:"deepseek-flash",label:"DeepSeek-V4.1 Flash",description:"Model V4.1 Flash super cepat dan sangat hemat biaya"}],requiresApiKey:!0,docUrl:"https://platform.deepseek.com/api_keys",placeholderKey:"sk-...",icon:"🔵"},xai:{id:"xai",name:"xAI (Grok 4.7 & Reasoning)",shortLabel:"xAI Grok",badge:"XAI",defaultBaseUrl:"https://api.x.ai/v1",defaultModel:"grok-4.7",models:[{id:"grok-4.7",label:"Grok 4.7",description:"Flagship xAI 500K+ konteks untuk reasoning, coding, agentic & visi (Rekomendasi)"},{id:"grok-420-reasoning",label:"Grok 420 Reasoning",description:"Model penalaran multi-langkah untuk logika, matematika & audit kode"},{id:"grok-4.6",label:"Grok 4.6",description:"Generasi 4.6 stabil untuk tugas kompleks"},{id:"grok-4.1-fast",label:"Grok 4.1 Fast",description:"Model cepat dan hemat biaya untuk pemrosesan volume tinggi"}],requiresApiKey:!0,docUrl:"https://console.x.ai/",placeholderKey:"xai-...",icon:"🖤"},mistral:{id:"mistral",name:"Mistral AI (La Plateforme)",shortLabel:"Mistral",badge:"MISTRAL",defaultBaseUrl:"https://api.mistral.ai/v1",defaultModel:"mistral-large-latest",models:[{id:"mistral-large-latest",label:"Mistral Large 4 (Latest)",description:"Flagship multimodal 1M konteks untuk penalaran kompleks & tool-use (Rekomendasi)"},{id:"mistral-small-latest",label:"Mistral Small 4 (Latest)",description:"Model hybrid efisien menyatukan instruct, reasoning & coding"},{id:"codestral-latest",label:"Codestral (Latest)",description:"Model spesialis sintesis kode dan refactoring"},{id:"ministral-3b-latest",label:"Ministral 3B (Latest)",description:"Model ringan latensi ultra rendah untuk tugas terarah"}],requiresApiKey:!0,docUrl:"https://console.mistral.ai/api-keys/",placeholderKey:"mis_...",icon:"🌪️"},groq:{id:"groq",name:"Groq Cloud (LPU Ultra-Fast Inference)",shortLabel:"Groq",badge:"LPU",defaultBaseUrl:"https://api.groq.com/openai/v1",defaultModel:"llama-3.3-70b-versatile",models:[{id:"llama-3.3-70b-versatile",label:"Llama 3.3 70B Versatile",description:"Model 70B stabil 300+ token/detik (Rekomendasi Utama Produksi)"},{id:"llama-3.1-8b-instant",label:"Llama 3.1 8B Instant",description:"Respons instan sub-detik untuk tugas ringan"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"Llama 4 Maverick (128E)",description:"Flagship Llama 4 MoE di Groq LPU dengan kecepatan ekstrem"},{id:"meta-llama/llama-4-scout-17b-16e-instruct",label:"Llama 4 Scout (16E)",description:"Llama 4 Scout cepat dengan dukungan konteks panjang"},{id:"qwen/qwen3.8-27b",label:"Qwen 3.8 27B",description:"Model multimodal & penalaran cepat generasi Qwen 3.8"},{id:"openai/gpt-oss-20b",label:"OpenAI GPT-OSS 20B",description:"Model open-weights OpenAI berlatensi sub-detik"}],requiresApiKey:!0,docUrl:"https://console.groq.com/keys",placeholderKey:"gsk_...",icon:"⚡"},openrouter:{id:"openrouter",name:"OpenRouter (Universal Model Aggregator)",shortLabel:"OpenRouter",badge:"ROUTER",defaultBaseUrl:"https://openrouter.ai/api/v1",defaultModel:"anthropic/claude-sonnet-5.5",models:[{id:"anthropic/claude-sonnet-5.5",label:"Claude Sonnet 5.5",description:"Flagship Anthropic 1M konteks untuk coding & penulisan (Rekomendasi Utama)"},{id:"anthropic/claude-opus-5.5",label:"Claude Opus 5.5",description:"Flagship Anthropic untuk proyek kompleks & riset mendalam"},{id:"anthropic/claude-fable-5.2",label:"Claude Fable 5.2",description:"Model penalaran puncak Anthropic untuk alur kerja jangka panjang"},{id:"google/gemini-4-carbon",label:"Gemini 4 Carbon",description:"Flagship Google Gemini 4 penalaran mendalam & rekayasa sistem"},{id:"google/gemini-4-argon",label:"Gemini 4 Argon",description:"Frontier reasoning cepat & efisiensi tinggi Google"},{id:"google/gemini-4-hydrogen",label:"Gemini 4 Hydrogen",description:"Workhorse agentic & coding harian Google"},{id:"google/gemini-3.8-flash",label:"Gemini 3.8 Flash",description:"Workhorse multimodal cepat generasi 3.8"},{id:"openai/gpt-6-astra",label:"OpenAI GPT-6 Astra",description:"Flagship tertinggi OpenAI GPT-6 untuk penalaran berat"},{id:"openai/gpt-6.1-sol",label:"OpenAI GPT-6.1 Sol",description:"GPT-6 keseimbangan kecerdasan dan efisiensi biaya"},{id:"deepseek/deepseek-v4-pro",label:"DeepSeek V4 Pro",description:"Flagship open-frontier DeepSeek 1M konteks"},{id:"deepseek/deepseek-r1",label:"DeepSeek R1",description:"Reasoning 671B Chain of Thought"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"Llama 4 Maverick",description:"Flagship open-weights MoE Meta generasi 4"},{id:"x-ai/grok-4.7",label:"xAI Grok 4.7",description:"Flagship xAI 500K+ konteks"}],requiresApiKey:!0,docUrl:"https://openrouter.ai/keys",placeholderKey:"sk-or-v1-...",icon:"🟣"},perplexity:{id:"perplexity",name:"Perplexity AI (Live Web Search & Reasoning)",shortLabel:"Perplexity",badge:"SEARCH",defaultBaseUrl:"https://api.perplexity.ai",defaultModel:"sonar-reasoning-pro",models:[{id:"sonar-reasoning-pro",label:"Sonar Reasoning Pro",description:"Penalaran multi-langkah dengan sitasi web real-time (Rekomendasi)"},{id:"sonar-deep-research",label:"Sonar Deep Research",description:"Riset agen komprehensif lintas banyak sumber web"},{id:"sonar-pro",label:"Sonar Pro",description:"Pencarian internet mendalam multi-sumber"},{id:"sonar",label:"Sonar",description:"Pencarian web ringan dan cepat"}],requiresApiKey:!0,docUrl:"https://www.perplexity.ai/settings/api",placeholderKey:"pplx-...",icon:"🌐"},together:{id:"together",name:"Together AI (Open-Source Frontier)",shortLabel:"Together AI",badge:"CLOUD",defaultBaseUrl:"https://api.together.xyz/v1",defaultModel:"meta-llama/Llama-3.3-70B-Instruct-Turbo",models:[{id:"meta-llama/Llama-3.3-70B-Instruct-Turbo",label:"Llama 3.3 70B Turbo",description:"Model 70B berlatensi sangat cepat & teruji (Rekomendasi)"},{id:"deepseek-ai/DeepSeek-R1",label:"DeepSeek R1 (Full 671B)",description:"Model penalaran rantai pemikiran DeepSeek R1"},{id:"deepseek-ai/DeepSeek-V3",label:"DeepSeek V3",description:"Model general chat 671B efisien"},{id:"deepseek-ai/DeepSeek-V4-Pro",label:"DeepSeek V4 Pro",description:"Flagship DeepSeek V4 Pro serverless (Preset)"},{id:"Qwen/Qwen2.5-72B-Instruct-Turbo",label:"Qwen 2.5 72B Turbo",description:"Model penalaran & multilingual kuat dari Qwen"}],requiresApiKey:!0,docUrl:"https://api.together.ai/settings/api-keys",placeholderKey:"tog-...",icon:"🤝"},cerebras:{id:"cerebras",name:"Cerebras Cloud (World-Record WSE Speed)",shortLabel:"Cerebras",badge:"WSE",defaultBaseUrl:"https://api.cerebras.ai/v1",defaultModel:"llama-3.3-70b",models:[{id:"llama-3.3-70b",label:"Llama 3.3 70B (2000+ tps)",description:"Model 70B dengan kecepatan instan wafer-scale engine (Rekomendasi)"},{id:"llama3.1-8b",label:"Llama 3.1 8B",description:"Eksekusi ultra instan"},{id:"gpt-oss-120b",label:"GPT-OSS 120B (~3000 tps)",description:"Model open-weights 120B berkecepatan ~3.000 token/detik"},{id:"qwen-3.8-27b",label:"Qwen 3.8 27B (~1850 tps)",description:"Qwen 3.8 berkecepatan ~1.850 token/detik"}],requiresApiKey:!0,docUrl:"https://cloud.cerebras.ai/",placeholderKey:"csk-...",icon:"🚀"},sambanova:{id:"sambanova",name:"SambaNova Cloud (Full Precision RDU)",shortLabel:"SambaNova",badge:"RDU",defaultBaseUrl:"https://api.sambanova.ai/v1",defaultModel:"Meta-Llama-3.3-70B-Instruct",models:[{id:"Meta-Llama-3.3-70B-Instruct",label:"Llama 3.3 70B (Full Precision)",description:"Kualitas FP16 murni berkecepatan tinggi di SambaNova RDU (Rekomendasi)"},{id:"DeepSeek-R1",label:"DeepSeek R1 (Full 671B)",description:"Penalaran penuh 671B di atas cluster SambaNova RDU"},{id:"DeepSeek-V3",label:"DeepSeek V3",description:"Model chat general-purpose throughput tinggi"},{id:"gemma-4-31B-it",label:"Gemma 4 31B Instruct",description:"Model terbuka terbaru Google Gemma 4 presisi tinggi"}],requiresApiKey:!0,docUrl:"https://cloud.sambanova.ai/",placeholderKey:"samba-...",icon:"⚡"},cohere:{id:"cohere",name:"Cohere (Command A Enterprise)",shortLabel:"Cohere",badge:"COMMAND",defaultBaseUrl:"https://api.cohere.ai/compatibility/v1",defaultModel:"command-r-plus-08-2024",models:[{id:"command-r-plus-08-2024",label:"Command R+ (Enterprise Live)",description:"Model enterprise stabil untuk RAG, penalaran bisnis & tool-use (Rekomendasi)"},{id:"command-r7b-12-2024",label:"Command R 7B",description:"Versi ringan berkecepatan tinggi"},{id:"command-a-plus-05-2026",label:"Command A+ (MoE Multimodal)",description:"Flagship enterprise MoE generasi Command A (Preset Next-Gen)"},{id:"command-a-reasoning-08-2025",label:"Command A Reasoning",description:"Varian penalaran mendalam untuk analisis bisnis kompleks"},{id:"command-a-03-2025",label:"Command A (Base)",description:"Model utama generasi Command A untuk instruksi terstruktur"}],requiresApiKey:!0,docUrl:"https://dashboard.cohere.com/api-keys",placeholderKey:"coh-...",icon:"🏛️"},huggingface:{id:"huggingface",name:"Hugging Face (Inference Providers Router)",shortLabel:"Hugging Face",badge:"HF",defaultBaseUrl:"https://router.huggingface.co/v1",defaultModel:"meta-llama/Llama-3.3-70B-Instruct",models:[{id:"meta-llama/Llama-3.3-70B-Instruct",label:"Llama 3.3 70B Instruct",description:"Open-weights stabil Meta di HF Router (Rekomendasi)"},{id:"deepseek-ai/DeepSeek-R1",label:"DeepSeek R1",description:"Model penalaran frontier di HF Router"},{id:"deepseek-ai/DeepSeek-V4.1-Flash:fastest",label:"DeepSeek V4.1 Flash (:fastest)",description:"Auto-routed tercepat melalui HF Inference Providers"},{id:"Qwen/Qwen3-Coder-30B-A3B-Instruct",label:"Qwen3 Coder 30B A3B",description:"Spesialis coding MoE efisien di HF Router"}],requiresApiKey:!0,docUrl:"https://huggingface.co/settings/tokens",placeholderKey:"hf_...",icon:"🤗"},ollama:{id:"ollama",name:"Ollama (Local Offline AI)",shortLabel:"Ollama",badge:"LOCAL",defaultBaseUrl:"http://localhost:11434/v1",defaultModel:"qwen3.8:27b",models:[{id:"qwen3.8:27b",label:"Qwen 3.8 (27B)",description:"Workhorse penalaran & chat lokal terbaik untuk 24GB VRAM (Rekomendasi)"},{id:"qwen3-coder:30b",label:"Qwen3 Coder (30B MoE)",description:"Standar emas coding lokal & RAG cepat (24GB VRAM)"},{id:"gemma4:12b",label:"Gemma 4 (12B)",description:"Model multimodal Google Gemma 4 optimal di 16GB RAM/VRAM"},{id:"gemma4:31b",label:"Gemma 4 (31B)",description:"Model workstation presisi tinggi untuk 32-48GB VRAM"},{id:"llama4:16x17b",label:"Llama 4 (Scout MoE)",description:"Model multimodal & konteks masif Meta Llama 4 lokal"},{id:"qwen3.5:9b",label:"Qwen 3.5 (9B)",description:"Daily driver ringan dan tajam untuk 16GB RAM/VRAM"},{id:"deepseek-r1:14b",label:"DeepSeek-R1 (14B)",description:"Penalaran R1 optimal di 16GB RAM/VRAM"},{id:"deepseek-r1:8b",label:"DeepSeek-R1 (8B)",description:"Penalaran R1 ringkas untuk 8GB VRAM"},{id:"deepseek-r1:latest",label:"DeepSeek-R1 (Latest)",description:"Tag default resmi DeepSeek R1 di Ollama"}],requiresApiKey:!1,docUrl:"https://ollama.com/",placeholderKey:"Opsional (tidak wajib untuk Ollama)",icon:"🦙"},internai:{id:"internai",name:"Intern-Discovery / 书生·端砚 (Shanghai AI Lab)",shortLabel:"Intern-AI",badge:"INTERN-AI",defaultBaseUrl:"https://discovery-api.intern-ai.org.cn/v1",defaultModel:"intern-s2",models:[{id:"Agents-A1",label:"Agents-A1 (Multimodal 256K · Hot)",description:"Shanghai AI Lab Agents-A1 multimodal (Input 4 / Output 16 credits)"},{id:"Atria-Dawn",label:"Atria-Dawn (LLM 512K · Hot)",description:"Shanghai AI Lab Atria-Dawn 512K long-context LLM (Input 80 / Output 280 credits)"},{id:"Sage-A1.5",label:"Sage-A1.5 (Multimodal 512K · Hot)",description:"Shanghai AI Lab Sage-A1.5 multimodal (Input 4 / Output 16 credits)"},{id:"Sage-A1.5-Taiyi",label:"Sage-A1.5-Taiyi (Agent 512K)",description:"Shanghai AI Lab Sage-A1.5-Taiyi specialized reasoning agent (Input 32 / Output 128 credits)"},{id:"Sage-S2.1-Flash",label:"Sage-S2.1-Flash (Multimodal 512K · New)",description:"Shanghai AI Lab Sage-S2.1-Flash high-speed multimodal (Input 8 / Output 28 credits)"},{id:"deepseek-v4.1-flash-1017",label:"DeepSeek-V4.1-Flash-1017 (Multimodal 1M)",description:"DeepSeek V4.1 Flash 1M context via Intern-Discovery"},{id:"glm-5.3",label:"GLM-5.3 (LLM 1M)",description:"GLM-5.3 1M context via Intern-Discovery"},{id:"intern-decision-4b",label:"书生·Decision-4B (Decision 8K)",description:"Shanghai AI Lab Decision-4B model (SystemOne protocol)"},{id:"intern-s2",label:"书生·S2 (Multimodal 256K · Flagship)",description:"Shanghai AI Lab Intern-S2 flagship multimodal (Input 30 / Output 180 credits)"},{id:"kimi-k3.1-pro",label:"Kimi-K3.1-Pro (Multimodal 1M · New)",description:"Moonshot Kimi K3.1 Pro 1M context via Intern-Discovery"},{id:"qwen3.8-27b",label:"Qwen3.8-27B (Multimodal 256K)",description:"Qwen 3.8 27B multimodal via Intern-Discovery"}],requiresApiKey:!0,docUrl:"https://discovery.intern-ai.org.cn/",placeholderKey:"API key dari https://discovery.intern-ai.org.cn/",icon:"🧪"},custom:{id:"custom",name:"OpenAI-Compatible / Kustom (LM Studio, vLLM, LiteLLM, Cloudflare AI)",shortLabel:"OpenAI-Comp",badge:"OPENAI-COMP",defaultBaseUrl:"http://localhost:1234/v1",defaultModel:"local-model",models:[{id:"__custom_empty__",label:"✍️ [Kustom] Ketik Model Sendiri (Kosong)",description:"Pilihan kosong untuk mengetik model AI kustom Anda sendiri"},{id:"local-model",label:"local-model",description:"Model aktif di LM Studio / vLLM / Local Host"},{id:"intern-s2",label:"intern-s2",description:"Intern-Discovery Flagship Multimodal (Shanghai AI Lab)"},{id:"Sage-S2.1-Flash",label:"Sage-S2.1-Flash",description:"Intern-Discovery Sage-S2.1-Flash Multimodal 512K (New)"},{id:"Agents-A1",label:"Agents-A1",description:"Intern-Discovery Agents-A1 Multimodal 256K (Hot)"},{id:"Atria-Dawn",label:"Atria-Dawn",description:"Intern-Discovery Atria-Dawn LLM 512K (Hot)"},{id:"Sage-A1.5",label:"Sage-A1.5",description:"Intern-Discovery Sage-A1.5 Multimodal 512K (Hot)"},{id:"Sage-A1.5-Taiyi",label:"Sage-A1.5-Taiyi",description:"Intern-Discovery Sage-A1.5-Taiyi Agent 512K"},{id:"deepseek-v4.1-flash-1017",label:"deepseek-v4.1-flash-1017",description:"DeepSeek V4.1 Flash 1M via Intern-Discovery"},{id:"glm-5.3",label:"glm-5.3",description:"GLM-5.3 1M via Intern-Discovery"},{id:"intern-decision-4b",label:"intern-decision-4b",description:"Shanghai AI Lab Decision-4B (SystemOne)"},{id:"kimi-k3.1-pro",label:"kimi-k3.1-pro",description:"Moonshot Kimi K3.1 Pro 1M via Intern-Discovery"},{id:"qwen3.8-27b",label:"qwen3.8-27b",description:"Qwen 3.8 27B via Intern-Discovery"},{id:"gemini-4-carbon",label:"gemini-4-carbon",description:"Google Gemini 4 Carbon (Frontier Reasoning Flagship)"},{id:"gemini-4-argon",label:"gemini-4-argon",description:"Google Gemini 4 Argon (Optimized Frontier Intelligence)"},{id:"gemini-4-hydrogen",label:"gemini-4-hydrogen",description:"Google Gemini 4 Hydrogen (Agentic & Daily Coding)"},{id:"gemini-3.8-flash",label:"gemini-3.8-flash",description:"Google Gemini 3.8 Flash (Multimodal Cepat Produksi)"},{id:"google/gemini-4-carbon",label:"google/gemini-4-carbon",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"google/gemini-4-argon",label:"google/gemini-4-argon",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"google/gemini-4-hydrogen",label:"google/gemini-4-hydrogen",description:"Prefix Google untuk OpenRouter / LiteLLM / OneAPI"},{id:"gpt-6-astra",label:"gpt-6-astra",description:"OpenAI GPT-6 Astra Flagship"},{id:"gpt-6.1-sol",label:"gpt-6.1-sol",description:"OpenAI GPT-6.1 Sol Workhorse"},{id:"claude-sonnet-5-5",label:"claude-sonnet-5-5",description:"Anthropic Claude Sonnet 5.5"},{id:"claude-opus-5-5",label:"claude-opus-5-5",description:"Anthropic Claude Opus 5.5"},{id:"claude-fable-5-2",label:"claude-fable-5-2",description:"Anthropic Claude Fable 5.2 Reasoning"},{id:"deepseek-v4-pro",label:"deepseek-v4-pro",description:"DeepSeek V4 Pro 1M Konteks"},{id:"deepseek-reasoner",label:"deepseek-reasoner",description:"DeepSeek R1 CoT Reasoner via Proxy"},{id:"deepseek-chat",label:"deepseek-chat",description:"DeepSeek Chat (V4 / V3 Alias)"},{id:"grok-4.7",label:"grok-4.7",description:"xAI Grok 4.7 Flagship via Proxy"},{id:"meta-llama/llama-4-maverick-17b-128e-instruct",label:"llama-4-maverick",description:"Meta Llama 4 Maverick MoE"},{id:"qwen3.8:27b",label:"qwen3.8:27b",description:"Qwen 3.8 27B via Local / Proxy"},{id:"default",label:"default",description:"Model default fallback server"}],requiresApiKey:!1,docUrl:"https://platform.openai.com/docs/api-reference",placeholderKey:"API key kustom Anda (jika diperlukan)",icon:"⚙️"}},Ie="promptmatrix_ai_unified_settings",we="promptmatrix_gemini_api_key",V=a=>{if(!a)return"";let t=a.trim();return t=t.replace(/[\u200B-\u200D\uFEFF\u00A0]/g,""),t=t.replace(/[\r\n\t]/g,""),t=t.replace(/^["']+|["']+$/g,""),t=t.replace(/^bearer\s+/i,""),t.trim()},aa=(a,t)=>{const n=V(a);return!n||n.length<10?null:n.startsWith("AIzaSy")&&t!=="gemini"?"Kunci ini berformat Google Gemini (AIzaSy...). Anda saat ini memilih provider lain. Harap gunakan API Key resmi dari provider yang dipilih.":n.startsWith("sk-ant-")&&t!=="anthropic"?"Kunci ini berformat Anthropic Claude (sk-ant-...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.":n.startsWith("gsk_")&&t!=="groq"?"Kunci ini berformat Groq (gsk_...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.":n.startsWith("hf_")&&t!=="huggingface"?"Kunci ini berformat Hugging Face (hf_...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.":null},ve=(a,t,n)=>{const e=(t||"").toLowerCase().trim(),i=(n||"").toLowerCase().trim();return e.includes("intern-ai.org.cn")?"internai":["atria-dawn","agents-a1","sage-a1.5","sage-a1.5-taiyi","sage-s2.1-flash","deepseek-v4.1-flash-1017","glm-5.3","intern-decision-4b","intern-s2","kimi-k3.1-pro","qwen3.8-27b"].includes(i)&&(a==="gemini"||a==="custom")?e.includes("intern-ai.org.cn")?"internai":"custom":e.includes("openrouter.ai")?"openrouter":e.includes("deepseek.com")?"deepseek":e.includes("groq.com")?"groq":e.includes("anthropic.com")?"anthropic":e.includes("localhost:11434")||e.includes("127.0.0.1:11434")?"ollama":e.includes("api.openai.com")?"openai":a==="gemini"&&e&&!e.includes("generativelanguage.googleapis.com")&&!e.includes("googleapis.com")?"custom":a},ue=()=>({provider:"gemini",apiKey:"",baseUrl:Z.gemini.defaultBaseUrl,model:Z.gemini.defaultModel,providerKeys:{}}),De=()=>{try{const a=localStorage.getItem(Ie);if(a){const n=JSON.parse(a),e=n.provider||"gemini",i=n.providerKeys||{};return n.apiKey&&!i[e]&&(i[e]=V(n.apiKey)),{...ue(),...n,apiKey:V(n.apiKey||i[e]||""),providerKeys:i}}const t=localStorage.getItem(we);if(t&&t.trim()){const n=V(t);return{...ue(),apiKey:n,providerKeys:{gemini:n}}}}catch(a){console.warn("Error reading AI settings from storage:",a)}return ue()},ya=a=>{try{const t=V(a.apiKey),n={...a.providerKeys||{},[a.provider]:t},e={...a,apiKey:t,baseUrl:(a.baseUrl||"").trim(),model:(a.model||"").trim(),providerKeys:n};localStorage.setItem(Ie,JSON.stringify(e)),e.provider==="gemini"&&localStorage.setItem(we,e.apiKey)}catch(t){console.error("Error saving AI settings:",t)}},Sa=()=>{try{localStorage.removeItem(Ie),localStorage.removeItem(we)}catch(a){console.error("Error removing AI settings:",a)}},Aa=()=>{const a=De();return(Z[a.provider]||Z.custom).requiresApiKey?!!(a.apiKey&&V(a.apiKey).length>0):!0},F=async(a,t="",n,e)=>{const i=n||De(),r=ve(i.provider,i.baseUrl,i.model),c={...i,provider:r},{provider:o,apiKey:l,baseUrl:k}=c,h=(c.model||"").trim();if(h==="__custom_empty__")throw new Error("Harap pilih atau ketik nama model AI terlebih dahulu.");const m=!k||k.includes("generativelanguage.googleapis.com")||k.includes("googleapis.com");return o==="gemini"&&m?ta(a,t,l,h,k,e):o==="anthropic"&&(!k||k.includes("anthropic.com"))?ia(a,t,l,k,h,e):na(a,t,l,k,h,e)},ta=async(a,t,n,e,i,r)=>{var d,f,y,b,P,L;const c=V(n);if(!c)throw new Error("API Key Google Gemini belum diisi. Silakan atur di menu Pengaturan AI ⚙️.");let o=(i||"https://generativelanguage.googleapis.com").replace(/\/+$/,"");o=o.replace(/\/models$/,"").replace(/\/chat\/completions$/,"");const l=o.endsWith("/v1beta")?o:`${o}/v1beta`,k={contents:[{role:"user",parts:[{text:a}]}],generationConfig:{temperature:(r==null?void 0:r.temperature)??.7,maxOutputTokens:(r==null?void 0:r.maxTokens)??2048}};t&&(k.systemInstruction={parts:[{text:t}]});const h=async S=>{const I=`${l}/models/${S}:generateContent?key=${encodeURIComponent(c)}`;return fetch(I,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(k)})};let m=e||"gemini-4-carbon",u=await h(m);if(u.status===404){const S=["gemini-4-argon","gemini-4-hydrogen","gemini-3.8-flash"].filter(I=>I!==m);for(const I of S){const T=await h(I);if(T.ok){u=T,m=I;break}}}if(!u.ok){const S=await u.json().catch(()=>({})),I=((d=S==null?void 0:S.error)==null?void 0:d.message)||u.statusText;let T="";throw u.status===404&&(T=" (Tips: Pastikan model aktif di Google AI Studio atau pilih gemini-4-carbon / gemini-4-argon / gemini-4-hydrogen)"),new Error(`Google Gemini Error (${u.status}): ${I}${T}`)}const p=await u.json(),s=(L=(P=(b=(y=(f=p==null?void 0:p.candidates)==null?void 0:f[0])==null?void 0:y.content)==null?void 0:b.parts)==null?void 0:P[0])==null?void 0:L.text;if(!s)throw new Error("Google Gemini tidak menghasilkan respons teks.");return s.trim()},na=async(a,t,n,e,i,r)=>{var s,d,f,y,b,P,L,S,I,T,O,v,w,R,N,K;let c=(e||"https://api.openai.com/v1").replace(/\/+$/,""),o=c.endsWith("/chat/completions")?c:`${c}/chat/completions`;const l={"Content-Type":"application/json",Accept:"application/json, text/event-stream"},k=V(n);k&&(l.Authorization=`Bearer ${k}`),c.includes("openrouter.ai")&&(l["HTTP-Referer"]="https://github.com/sisigitadi/promptmatrix",l["X-Title"]="PromptMatrix");const h=[];t&&h.push({role:"system",content:t}),h.push({role:"user",content:a});const m={model:i||"gpt-6.1-sol",messages:h,temperature:(r==null?void 0:r.temperature)??.7,stream:(r==null?void 0:r.stream)??!1};r!=null&&r.maxTokens&&(m.max_tokens=r.maxTokens,m.max_completion_tokens=r.maxTokens);const u=await fetch(o,{method:"POST",headers:l,body:JSON.stringify(m)}),p=await u.text();if(!u.ok){let C="";try{const A=JSON.parse(p);C=((s=A==null?void 0:A.error)==null?void 0:s.message)||(A==null?void 0:A.message)||""}catch{C=p}let M="";if(u.status===401||u.status===403){const A=k.length;A===0?M=" (Diagnostik: API Key kosong. Harap isi API Key dari dashboard provider Anda.)":c.includes("intern-ai.org.cn")?M=` (Diagnostik Intern-Discovery: API Key terdeteksi (${A} karakter) namun ditolak server. Pastikan API Key disalin lengkap dari tab "API Key" di https://discovery.intern-ai.org.cn/ tanpa spasi tambahan. Model yang dikirim: "${i}")`:M=` (Diagnostik: API Key terdeteksi (${A} karakter) namun ditolak server. Pastikan key disalin lengkap tanpa spasi dari dashboard provider. Endpoint: ${o}, Model: "${i}")`}else u.status===404&&i.includes("gemini")?M=' (Tips: Untuk router kustom / OpenAI-compatible, pastikan model terdaftar atau coba gunakan prefix seperti "google/gemini-4-carbon" atau "gemini-4-argon")':u.status===404?M=` (Tips: Model "${i}" tidak ditemukan di server endpoint ${c}. Pastikan nama model benar atau gunakan tombol "Muat Model" untuk melihat model yang tersedia.)`:u.status===429&&(c.includes("intern-ai.org.cn")?M=" (Tips Intern-Discovery: Server terhubung & API Key valid, namun saldo kredit akun habis atau rate-limited. Silakan periksa sisa kredit di dashboard https://discovery.intern-ai.org.cn/ atau pilih model hemat seperti Agents-A1 atau Sage-A1.5)":M=" (Tips: Server terhubung & API Key valid, namun kuota atau saldo kredit akun Anda di provider habis)");throw new Error(`AI Provider Error (${u.status}): ${C||u.statusText}${M}`)}if(p.trim().startsWith("data:")){const C=p.split(`
`);let M="";for(const A of C){const B=A.trim();if(!(!B||B==="data: [DONE]"||B==="[DONE]")&&B.startsWith("data:")){const G=B.replace(/^data:\s*/,"");try{const x=JSON.parse(G),z=((y=(f=(d=x==null?void 0:x.choices)==null?void 0:d[0])==null?void 0:f.delta)==null?void 0:y.content)||((L=(P=(b=x==null?void 0:x.choices)==null?void 0:b[0])==null?void 0:P.message)==null?void 0:L.content)||((I=(S=x==null?void 0:x.choices)==null?void 0:S[0])==null?void 0:I.text)||"";M+=z}catch{}}}if(M.trim())return M.trim()}try{const C=JSON.parse(p),M=((v=(O=(T=C==null?void 0:C.choices)==null?void 0:T[0])==null?void 0:O.message)==null?void 0:v.content)||((R=(w=C==null?void 0:C.choices)==null?void 0:w[0])==null?void 0:R.text)||((K=(N=C==null?void 0:C.content)==null?void 0:N[0])==null?void 0:K.text);if(M)return M.trim()}catch(C){console.warn("Direct JSON parse failed, trying chunk extraction:",C)}if(p&&!p.includes('{"error":'))return p.trim();throw new Error("Model AI tidak mengembalikan konten teks yang valid.")},ia=async(a,t,n,e,i,r)=>{var p,s,d;const c=V(n);if(!c)throw new Error("API Key Anthropic Claude belum diisi.");const o=(e||"https://api.anthropic.com/v1").replace(/\/+$/,""),l=o.endsWith("/messages")?o:`${o}/messages`,k={"Content-Type":"application/json","x-api-key":c,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},h={model:i||"claude-sonnet-5-5",max_tokens:(r==null?void 0:r.maxTokens)??2048,messages:[{role:"user",content:a}]};t&&(h.system=t);const m=await fetch(l,{method:"POST",headers:k,body:JSON.stringify(h)}),u=await m.text();if(!m.ok){let f="";try{const y=JSON.parse(u);f=((p=y==null?void 0:y.error)==null?void 0:p.message)||m.statusText}catch{f=u}throw new Error(`Anthropic Error (${m.status}): ${f}`)}try{const f=JSON.parse(u),y=(d=(s=f==null?void 0:f.content)==null?void 0:s[0])==null?void 0:d.text;if(y)return y.trim()}catch{}return u.trim()},Ia=async(a,t,n)=>{var h;let e=(a||"https://api.openai.com/v1").replace(/\/+$/,"");e=e.replace(/\/chat\/completions$/,"");const i=ve(n||"custom",e,"");if(e.includes("intern-ai.org.cn")||i==="internai")return["Agents-A1","Atria-Dawn","Sage-A1.5","Sage-A1.5-Taiyi","Sage-S2.1-Flash","deepseek-v4.1-flash-1017","glm-5.3","intern-decision-4b","intern-s2","kimi-k3.1-pro","qwen3.8-27b"];const r=i==="gemini"&&(e.includes("generativelanguage.googleapis.com")||e.includes("googleapis.com")),c=i==="anthropic"&&(e.includes("api.anthropic.com")||e.includes("anthropic.com"));let o=e.endsWith("/models")?e:`${e}/models`;const l={"Content-Type":"application/json"},k=V(t);if(r){if(!k)throw new Error("API Key Google Gemini diperlukan untuk mengambil daftar model.");o=`${e.endsWith("/v1beta")?e:`${e}/v1beta`}/models?key=${encodeURIComponent(k)}`}else if(c){if(!k)throw new Error("API Key Anthropic diperlukan untuk mengambil daftar model.");l["x-api-key"]=k,l["anthropic-version"]="2023-06-01",l["anthropic-dangerous-direct-browser-access"]="true"}else k&&(l.Authorization=`Bearer ${k}`);try{const m=await fetch(o,{method:"GET",headers:l}),u=await m.text();if(!m.ok){let s="";try{const d=JSON.parse(u);s=((h=d==null?void 0:d.error)==null?void 0:h.message)||(d==null?void 0:d.message)||""}catch{s=u}throw new Error(`Gagal mengambil model (${m.status}): ${s||m.statusText}`)}const p=JSON.parse(u);if(!Array.isArray(p)&&Array.isArray(p==null?void 0:p.data))return p.data.map(s=>s.id||s.name||"").filter(Boolean);if(!Array.isArray(p)&&Array.isArray(p==null?void 0:p.models))return p.models.map(s=>{const d=s.id||s.name||"";return r?d.replace(/^models\//,""):d}).filter(Boolean);if(Array.isArray(p))return p.map(s=>typeof s=="string"?s:s.id||s.name||"").filter(Boolean)}catch(m){if(e.includes("intern-ai.org.cn"))return["Agents-A1","Atria-Dawn","Sage-A1.5","Sage-A1.5-Taiyi","Sage-S2.1-Flash","deepseek-v4.1-flash-1017","glm-5.3","intern-decision-4b","intern-s2","kimi-k3.1-pro","qwen3.8-27b"];const u=m instanceof Error?m.message:String(m);throw u.includes("Failed to fetch")||u.includes("NetworkError")?new Error("Koneksi ke endpoint /models terhalang kebijakan CORS browser atau server tidak aktif. Silakan pilih model dari daftar terkurasi atau ketik nama model secara manual."):m}return[]},sa=a=>{if(!a)return"";let t=a.replace(/\r\n/g,`
`).trim();const n=["Persona AI","AI Persona","Peran AI","Peran","Role","System Role","Konteks & Tujuan","Konteks","Context","Background","Latar Belakang","Tugas Utama","Tugas","Task","Objective","Tujuan","Goal","Variabel Input","Detail Masukan","Input Details","Instruksi Utama","Instruksi Khusus","Instruksi Tambahan","Instruksi","Instructions","Guidelines","Batasan Mutlak","Batasan & Kriteria","Batasan","Constraints","Hard Constraints","Format Output","Format Keluaran","Output Format","Deliverables","Target Audiens","Audiens Target","Target Audience","Audience","Nada Bicara","Gaya Bahasa","Tone of Voice","Tone & Style","Tone","Voice","Attention","Interest","Desire","Action","Hook","Story","Offer","Call to Action","Pencahayaan","Sudut Kamera","Optik","Lighting","Camera","Catatan Khusus","Important Notes","Catatan","Notes"],e=new RegExp(`([^
])
((?:[-*•#>]+\\s*)?(?:${n.join("|")}):)`,"gi");return t=t.replace(e,`$1

$2`),t=t.replace(/([^\n])\n((?:Step|Langkah|\d+\.)\s+[A-Za-z0-9\s()&/._-]{1,30}:)/gi,`$1

$2`),t=t.replace(/([^\n])\n(\[(?:Intro|Verse|Pre-Chorus|Chorus|Bridge|Guitar Solo|Outro|Drop|Hook|Build-up)[^\]]*\])/gi,`$1

$2`),t=t.replace(/\n{3,}/g,`

`),t.trim()},q=a=>{if(!a)return"";let t=a.trim();return t=t.replace(/^```[a-zA-Z0-9_-]*\s*\r?\n?/i,""),t=t.replace(/\r?\n?```\s*$/g,""),t=t.replace(/^(?:Tentu,?\s*)?(?:Berikut\s+(?:adalah\s+)?(?:hasil\s+)?(?:versi\s+)?(?:prompt\s+)?(?:yang\s+)?(?:telah\s+)?(?:disempurnakan|dioptimalkan|ditingkatkan|diperbarui)?[^:\n]*:?\s*[\r\n]+)/i,""),t=t.replace(/^(?:Sure,?\s*)?(?:Here\s+(?:is|are)\s+(?:the\s+)?(?:enhanced|improved|refined|optimized)\s+prompt[^:\n]*:?\s*[\r\n]+)/i,""),t=t.replace(/\*\*([^*]+)\*\*/g,"$1"),t=t.replace(/__([^_]+)__/g,"$1"),(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))&&(t=t.slice(1,-1).trim()),sa(t)},wa=async(a,t,n,e="id")=>{const i=e==="id",r=/few-shot|contoh masukan|contoh keluaran|sample input|expected output/i.test(a);let c=i?"Anda adalah seorang ahli prompt engineering handal. Tugas Anda adalah memberikan satu saran isian terbaik dan spesifik untuk kolom formulir yang diminta. Berikan HANYA nilai isian langsung tanpa pembuka, tanpa tanda kutip, tanpa format tebal (**), dan tanpa penjelasan tambahan.":"You are an expert AI prompt engineer. Provide ONLY the direct, high-quality, specific value for the requested form field. Do not include markdown quotes, bold asterisks (**), pleasantries, or preamble.";r&&(c=i?'Anda adalah Master Prompt Engineer spesialis Few-Shot In-Context Learning. Tugas Anda adalah menyusun contoh acuan (few-shot reference exemplar) yang konkret, realistis, dan mencerminkan standar emas. Berikan HANYA teks contoh acuan langsung tanpa kata pengantar ("Berikut adalah..."), tanpa tanda kutip pembungkus, dan tanpa format tebal berlebihan.':"You are a Master Prompt Engineer specializing in Few-Shot In-Context Learning. Provide ONLY the direct, realistic, gold-standard reference exemplar text without introductory preamble or markdown quotes.");let o=i?`Kerangka Kerja: "${t}"
Kolom yang perlu diisi: "${a}"
Konteks isian kolom lain yang sudah ada:
${n||"(Belum ada kolom lain yang diisi)"}

Berikan satu saran isian teks biasa yang kreatif, kontekstual, dan bernilai tinggi:`:`Framework: "${t}"
Target Field: "${a}"
Other Filled Context:
${n||"(No other fields filled yet)"}

Provide one creative, highly specific, and relevant plain-text value for this field:`;r&&(o=i?`Kerangka Kerja: "${t}"
Target Komponen Few-Shot: "${a}"
Konteks parameter framework yang sudah terisi:
${n||"(Gunakan konteks umum kerangka kerja)"}

Susun satu contoh ${a} yang konkret, realistis, dan siap ditiru oleh model AI:`:`Framework: "${t}"
Target Few-Shot Component: "${a}"
Existing Framework Context:
${n||"(Use general framework context)"}

Draft one concrete, realistic ${a} exemplar ready for in-context learning:`);const l=await F(o,c);return q(l)},va=async(a,t,n="id")=>{const e=n==="id",i=e?`Anda adalah Master Prompt Optimizer & AI Prompt Architect Kelas Dunia. Tugas Anda adalah menyempurnakan prompt yang diberikan agar lebih tajam, kaya konteks terarah, minim ambiguitas, dan menghasilkan output maksimal pada LLM modern.

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

     Output Format: [deliverables specification]`,r=e?`Kerangka Kerja: "${t}"
Prompt Awal:
"""
${a}
"""

Tingkatkan dan poles prompt di atas menjadi versi paling optimal. Pastikan setiap bagian/paragraf dipisahkan oleh satu baris kosong agar sangat rapi, nyaman dibaca, dan mudah ditinjau sebelum disalin:`:`Framework: "${t}"
Initial Prompt:
"""
${a}
"""

Enhance and refine the prompt above to the absolute highest standard. Ensure every section and paragraph is separated by an empty line so it is exceptionally clean, comfortable to read, and easy to review before copying:`,c=await F(r,i);return q(c)},Ca=async(a,t,n="id")=>{const e=n==="id",i=e?`Anda adalah Evaluator Kualitas Prompt AI. Analisis prompt yang diberikan dan berikan penilaian dalam format JSON baku persis seperti berikut:
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
Skor berupa bilangan bulat 0 sampai 100. Kembalikan HANYA string JSON yang valid.`:"You are an AI Prompt Quality Evaluator. Analyze the prompt and return pure JSON format with clarityScore (0-100), specificityScore (0-100), overallScore (0-100), feedback (string), suggestions (string array). Return pure JSON only.",r=e?`Kerangka Kerja: "${t}"
Prompt yang dievaluasi:
"""
${a}
"""`:`Framework: "${t}"
Prompt to evaluate:
"""
${a}
"""`;try{const o=(await F(r,i)).replace(/```json/gi,"").replace(/```/g,"").trim(),l=JSON.parse(o);return{clarityScore:typeof l.clarityScore=="number"?l.clarityScore:80,specificityScore:typeof l.specificityScore=="number"?l.specificityScore:85,overallScore:typeof l.overallScore=="number"?l.overallScore:83,feedback:l.feedback||(e?"Prompt tersusun dengan baik dan jelas.":"Well-structured prompt."),suggestions:Array.isArray(l.suggestions)?l.suggestions:[]}}catch(c){return console.warn("Fallback parsing quality analysis result:",c),{clarityScore:82,specificityScore:86,overallScore:84,feedback:e?"Prompt memiliki struktur yang cukup baik dan dapat dieksekusi dengan baik oleh AI.":"The prompt has solid clarity and structure.",suggestions:e?["Pertimbangkan untuk menambahkan contoh keluaran (*few-shot example*) untuk hasil yang lebih spesifik."]:["Consider adding an example output to guide the model further."]}}},Pa=async a=>{var o,l,k,h;const t=(a.model||"").trim();if(!t||t==="__custom_empty__")return{success:!1,message:"Harap tentukan atau ketik nama model AI terlebih dahulu sebelum melakukan uji coba koneksi."};const n=ve(a.provider,a.baseUrl,t),e=Z[n]||Z.custom,i=V(a.apiKey),r=aa(i,n);if(r)return{success:!1,isAuthError:!0,message:`Format API Key tidak cocok dengan ${e.name}!

⚠️ ${r}

Pastikan Anda menyalin kunci dari dashboard resmi yang sesuai (${e.docUrl||"dashboard provider"}).`};if(e.requiresApiKey&&!i)return{success:!1,isAuthError:!0,message:`API Key untuk ${e.name} belum diisi.

Harap salin API Key dari dashboard provider dan tempel di kolom "API Key" sebelum melakukan uji coba koneksi.`};const c={...a,provider:n,apiKey:i,model:t};try{return{success:!0,message:`Koneksi berhasil! Respons model: "${(await F("Ping",'Balas hanya kata "OK".',c,{maxTokens:8,temperature:.1})).slice(0,100)}"`}}catch(m){const u=m instanceof Error?m.message:String(m);if(u.includes("429")||u.toLowerCase().includes("quota")||u.toLowerCase().includes("rate limit")){const s=((o=a.baseUrl)==null?void 0:o.includes("intern-ai.org.cn"))||a.provider==="internai"?"Endpoint & API Key BERHASIL terhubung dan terotentikasi oleh server Shanghai AI Lab! Namun akun Anda saat ini kehabisan saldo kredit (HTTP 429 Quota Exceeded). Silakan cek saldo kredit di dashboard https://discovery.intern-ai.org.cn/ (menu Usage/API Key) atau coba model hemat seperti Agents-A1 atau Sage-A1.5 yang membutuhkan hanya 4 kredit.":"Endpoint & API Key BERHASIL terhubung dan terotentikasi! Namun akun Anda di provider mengalami limitasi kuota atau saldo kredit habis (HTTP 429 Quota Exceeded). Silakan periksa sisa kuota/billing di dashboard provider Anda.";return{success:!1,isQuotaExceeded:!0,message:`${u}

--- Diagnostik: ${s}`}}if(u.includes("401")||u.includes("403")||u.toLowerCase().includes("invalid token")||u.toLowerCase().includes("invalid_api_key")||u.toLowerCase().includes("unauthorized")||u.toLowerCase().includes("forbidden")){const p=i.length,s=((l=a.baseUrl)==null?void 0:l.includes("intern-ai.org.cn"))||a.provider==="internai";let d="";return p===0?d="API Key kosong. Harap isi API Key dari dashboard provider Anda.":s?d=`API Key terdeteksi (${p} karakter) namun ditolak server Intern-Discovery (Shanghai AI Lab).

📌 Mengapa error ini muncul di SEMUA model?
Karena HTTP 401 adalah penolakan otentikasi token akun di gateway server, sebelum server mengecek nama model apa pun.

💡 Panduan Perbaikan:
1. Buka https://discovery.intern-ai.org.cn/ dan masuk ke akun Anda
2. Klik tab "API Key" (di sebelah kiri tab "Models")
3. Buat API Key baru jika belum ada, atau klik tombol salin (copy) pada API Key aktif
4. Tempel di kolom API Key PromptMatrix (sistem otomatis membersihkan spasi/tanda kutip)
5. Pastikan yang disalin adalah API Key, bukan Session ID atau Cookie peramban`:d=`API Key terdeteksi (${p} karakter) namun ditolak server.

📌 Mengapa error ini muncul di SEMUA model?
Karena HTTP 401 adalah penolakan otentikasi token pada tingkat server, sebelum server memproses permintaan ke model spesifik.

💡 Panduan Perbaikan:
1. Pastikan API Key disalin lengkap dari dashboard ${e.name}
2. Periksa apakah key belum expired, dinonaktifkan, atau memiliki batasan IP
3. Pastikan Base API URL sesuai provider (saat ini: ${a.baseUrl})
4. Untuk gateway proxy/router (OneAPI/LiteLLM), pastikan token terdaftar di panel admin`,{success:!1,isAuthError:!0,message:`${u}

--- Diagnostik Autentikasi:
${d}`}}if(u.toLowerCase().includes("failed to fetch")||u.toLowerCase().includes("networkerror")||u.toLowerCase().includes("cors")){const p=((k=a.baseUrl)==null?void 0:k.includes("localhost"))||((h=a.baseUrl)==null?void 0:h.includes("127.0.0.1"));let s="";return p?s=`Tidak dapat terhubung ke server lokal ${a.baseUrl}.

Pastikan:
1. Server AI lokal (Ollama / LM Studio / vLLM) sedang berjalan
2. Port yang dikonfigurasi sudah benar
3. Server mengizinkan koneksi dari browser (CORS)`:s=`Tidak dapat terhubung ke endpoint ${a.baseUrl}.

Kemungkinan penyebab:
1. URL endpoint salah atau tidak aktif
2. Server memblokir permintaan dari browser (CORS restriction)
3. Jaringan internet terputus atau firewall memblokir`,{success:!1,message:`${u}

--- Diagnostik Jaringan:
${s}`}}return{success:!1,message:u||"Gagal terhubung ke API endpoint."}}},Ee=new Set(["persona","context","task","constraints","output_format","audience","variable","custom"]),E=a=>typeof a!="string"?"":q(a).replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim(),xe=a=>{const t=a.replace(/```json/gi,"").replace(/```/g,"").trim(),n=t.indexOf("{"),e=t.lastIndexOf("}");return n!==-1&&e>n?t.slice(n,e+1):t},Ta=async(a,t,n="id")=>{const e=n==="id",i=a.trim(),r=t==="skill"?e?`Target Mode adalah AGENT SKILL (SKILL.md). Anda WAJIB menyertakan:
  "skillName": "nama-skill-kebab-case-maks-64-karakter",
  "skillDescription": "deskripsi kapan AI agent harus mengaktifkan skill ini (maks 1024 karakter, jelas dan spesifik)",`:`Target Mode is AGENT SKILL (SKILL.md). You MUST include:
  "skillName": "kebab-case-skill-name-max-64-chars",
  "skillDescription": "clear trigger description explaining when an AI agent should invoke this skill (max 1024 chars)",`:e?"Target Mode adalah PROMPT STANDAR. Fokus pada kejelasan instruksi, batasan, dan format keluaran.":"Target Mode is STANDARD PROMPT. Focus on instruction clarity, constraints, and output format.",c=e?`Anda adalah Arsitek Prompt & Agent Skill Profesional. Tugas Anda mengubah ide singkat pengguna menjadi draft terstruktur untuk Blank Canvas.
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
Select 3 to 5 of the most relevant block types.`,o=e?`Ide pengguna:
"""
${i}
"""
Susun JSON draft Blank Canvas dalam Bahasa Indonesia.`:`User idea:
"""
${i}
"""
Compose the Blank Canvas draft JSON in English.`,l=await F(o,c);try{const k=xe(l),h=JSON.parse(k);if(!h||typeof h!="object")throw new Error("Parsed draft is not an object.");const m=h,p=(Array.isArray(m.blocks)?m.blocks:[]).map(S=>{if(!S||typeof S!="object")return null;const I=S,T=typeof I.type=="string"?I.type.trim():"custom",O=Ee.has(T)?T:"custom",v=E(I.value);if(!v)return null;const w=E(I.label);return{type:O,label:w||void 0,value:v}}).filter(S=>S!==null),s=E(m.title)||E(i).slice(0,60)||(e?"Draft Canvas AI":"AI Canvas Draft"),d=E(m.description),f=E(m.scratchpad),y=E(m.fewShotInput)||void 0,b=E(m.fewShotOutput)||void 0,P=E(m.skillName)||void 0,L=E(m.skillDescription)||void 0;return{title:s,description:d,scratchpad:f,blocks:p,fewShotInput:y,fewShotOutput:b,skillName:P,skillDescription:L}}catch(k){console.warn("Fallback parsing Canvas AI draft JSON:",k);const h=E(l);return{title:E(i).slice(0,60)||(e?"Draft Canvas AI":"AI Canvas Draft"),description:e?"Draft disusun otomatis dari ide pengguna.":"Draft generated automatically from user idea.",scratchpad:h,blocks:[]}}},ie=(a,t)=>typeof a!="number"||!Number.isFinite(a)?t:Math.max(0,Math.min(100,Math.round(a))),le=a=>{if(typeof a!="string")return"";let t=a.replace(/\r\n/g,`
`).replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/\u2014/g,", ").replace(/\u2013/g,"-").trim();return/^```[a-zA-Z0-9_-]*\s*\n/.test(t)&&/\n```$/.test(t)&&(t=t.replace(/^```[a-zA-Z0-9_-]*\s*\n/,"").replace(/\n```$/,"").trim()),t},Oe=a=>Array.isArray(a)?a.map(t=>E(t)).filter(t=>t.length>0):[],pe=(a,t,n)=>{const e=Ae();e.title=a.title,e.description=a.description,e.targetMode=t,e.scratchpad=a.scratchpad,e.fewShotInput=a.fewShotInput||"",e.fewShotOutput=a.fewShotOutput||"",e.skillName=a.skillName||"",e.skillDescription=a.skillDescription||"",e.blocks=a.blocks.map(r=>Q(r.type,n,r.label,r.value));const i=We(e,n);if(t==="skill"){const r=Ye(e,i,n);return le(Ue(r))}return le(i||a.scratchpad)},Oa=async(a,t,n,e="id")=>{const i=e==="id",r=a.trim(),c=he(r),o=t==="auto"?c:t,l=o==="skill"?i?`Karena target adalah AGENT SKILL (SKILL.md), evaluasi juga standar Open Agent Skills:
- YAML frontmatter wajib memiliki "name" (kebab-case, huruf kecil/angka/tanda hubung, maksimal 64 karakter) dan "description" pemicu yang jelas (maksimal 1024 karakter).
- Struktur bagian markdown harus jelas: ## Role & Trigger, ## Input Parameters, ## Execution Steps, dan ## Verification Checklist.
- Pastikan "upgradedDraft" menyertakan "skillName" dan "skillDescription", serta "upgradedFullText" adalah dokumen SKILL.md lengkap dengan YAML frontmatter (--- ... ---) dan isi markdown.`:`Because the target is AGENT SKILL (SKILL.md), also evaluate Open Agent Skills compliance:
- YAML frontmatter must include "name" (lowercase kebab-case, max 64 chars) and a clear trigger "description" (max 1024 chars).
- Markdown sections should clearly cover: ## Role & Trigger, ## Input Parameters, ## Execution Steps, and ## Verification Checklist.
- Ensure "upgradedDraft" includes "skillName" and "skillDescription", and "upgradedFullText" is a complete SKILL.md document with YAML frontmatter (--- ... ---) and markdown body.`:i?'Target adalah PROMPT STANDAR. Pastikan "upgradedFullText" adalah teks prompt siap pakai yang terstruktur rapi (pisahkan bagian dengan baris kosong ganda, tanpa markdown code fence pembungkus).':'Target is STANDARD PROMPT. Ensure "upgradedFullText" is a complete, ready-to-use prompt with clear sections separated by blank lines (no outer markdown code fence).',k=i?`Anda adalah Auditor & Arsitek Prompt/Agent Skill Senior. Tugas Anda:
1. Analisis konten unggahan pengguna berdasarkan kejelasan (clarity), kekhususan (specificity), dan struktur (structure) dengan skor 0-100.
2. Identifikasi kekuatan utama (strengths) dan kelemahan/celah (weaknesses).
3. Tingkatkan konten tersebut menjadi versi yang jauh lebih presisi, terstruktur, dan siap pakai sesuai tujuan peningkatan dari pengguna.
${l}

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
${l}

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
}`,h=n.trim()?n.trim():i?"Tingkatkan kejelasan instruksi, batasan kualitas, dan struktur agar siap pakai.":"Improve instruction clarity, quality guardrails, and structure for production use.",m=i?`Mode Target: ${t==="auto"?`Otomatis (terdeteksi awal: ${c})`:o}
Tujuan Upgrade: ${h}

Konten yang diunggah:
"""
${r}
"""`:`Target Mode: ${t==="auto"?`Auto (initial detection: ${c})`:o}
Upgrade Goal: ${h}

Uploaded Content:
"""
${r}
"""`,u=await F(m,k);try{const p=xe(u),s=JSON.parse(p);if(!s||typeof s!="object")throw new Error("Parsed upgrade analysis is not an object.");const d=s,f=d.detectedKind,y=t!=="auto"?t:f==="skill"||f==="prompt"?f:o,b=d.scores&&typeof d.scores=="object"?d.scores:{},P=ie(b.clarity,75),L=ie(b.specificity,72),S=ie(b.structure,74),I=Math.round((P+L+S)/3),T=ie(b.overall,I),O=Oe(d.strengths),v=Oe(d.weaknesses),w=E(d.upgradeSummary)||(i?"Struktur instruksi, kejelasan peran, dan batasan kualitas telah ditingkatkan.":"Instruction structure, role clarity, and quality constraints have been upgraded."),R=d.upgradedDraft&&typeof d.upgradedDraft=="object"?d.upgradedDraft:{},K=(Array.isArray(R.blocks)?R.blocks:[]).map(B=>{if(!B||typeof B!="object")return null;const G=B,x=typeof G.type=="string"?G.type.trim():"custom",z=Ee.has(x)?x:"custom",X=E(G.value);if(!X)return null;const Y=E(G.label);return{type:z,label:Y||void 0,value:X}}).filter(B=>B!==null),C={title:E(R.title)||(i?"Hasil Upgrade Canvas":"Upgraded Canvas Draft"),description:E(R.description),scratchpad:E(R.scratchpad),blocks:K,fewShotInput:E(R.fewShotInput)||void 0,fewShotOutput:E(R.fewShotOutput)||void 0,skillName:E(R.skillName)||void 0,skillDescription:E(R.skillDescription)||void 0};let M=le(d.upgradedFullText);const A=y==="skill"&&!/^---\n[\s\S]*?\n---/.test(M);return(!M||A)&&(M=pe(C,y,e)),{detectedKind:y,scores:{clarity:P,specificity:L,structure:S,overall:T},strengths:O.length>0?O:[i?"Memiliki maksud dan arah tugas dasar yang dapat dikenali.":"Has an identifiable core objective and direction."],weaknesses:v.length>0?v:[i?"Dapat diperkuat dengan batasan eksplisit dan format keluaran yang lebih terstruktur.":"Can be strengthened with explicit constraints and a stricter output format."],upgradeSummary:w,upgradedDraft:C,upgradedFullText:M}}catch(p){console.warn("Fallback parsing uploaded content upgrade JSON:",p);const s=le(u),d={title:i?"Hasil Upgrade AI":"AI Upgraded Draft",description:i?"Hasil analisis dan peningkatan otomatis dari konten unggahan.":"Automated analysis and upgrade generated from uploaded content.",scratchpad:E(s||r),blocks:[]},f=o==="skill"&&!/^---\n[\s\S]*?\n---/.test(s)?pe(d,"skill",e):s||pe(d,o,e);return{detectedKind:o,scores:{clarity:74,specificity:70,structure:72,overall:72},strengths:[i?"Konten awal memiliki topik utama yang jelas untuk ditingkatkan.":"Original content has a clear core topic ready for refinement."],weaknesses:[i?"Struktur blok dan batasan eksplisit masih dapat diperkuat.":"Block structure and explicit guardrails can be further reinforced."],upgradeSummary:i?"Konten telah diproses ulang menjadi draf yang lebih rapi dan siap disunting di Canvas.":"Content has been refined into a cleaner draft ready for editing in Canvas.",upgradedDraft:d,upgradedFullText:f}}},$a=async a=>{const{skillName:t,frameworkName:n="Custom Agent Skill",compiledPrompt:e="",field:i,existingTitle:r="",existingTagline:c="",existingDemoRequest:o="",language:l="id"}=a,k=l==="id",h=k?`Anda adalah Principal Product Architect & Spesialis Optimasi SEO & GEO (Generative Engine Optimization) untuk AI Agent Skills. Tugas Anda adalah merancang profil produk dan live demo berkualitas tinggi yang mudah ditemukan oleh mesin pencari web (Google, Bing) dan mesin jawaban AI (Perplexity, ChatGPT Search, Claude, Google AI Overviews) serta calon pembeli di marketplace digital.
ATURAN MUTLAK:
1. DILARANG menggunakan tanda em-dash (—). Gunakan koma, strip (-), atau tanda kurung.
2. DILARANG menggunakan kata klise generik AI seperti "Revolusioner", "Unleash", "Game-changer", "Delve", "Transformasi tanpa batas".
3. Gunakan kata kunci pencarian berniat tinggi (search intent): production agent skill, verified workflow, cross-runtime, deterministic, zero hallucination.
4. Buat kalimat padat, bernilai tinggi, dan memiliki definisi konkret (answer capsule) yang dapat dikutip langsung oleh LLM dan mesin pencari.`:`You are a Principal Product Architect and SEO/GEO (Generative Engine Optimization) Specialist for AI Agent Skills. Your mission is to craft commercial, discoverable product copy and real-world demo exemplars (Request and Result) optimized for web search engines (Google, Bing) and AI answer engines (Perplexity, ChatGPT Search, Claude, Google AI Overviews).
STRICT RULES:
1. NEVER use em-dashes (—). Use commas, hyphens (-), or parentheses.
2. NEVER use generic AI cliches such as "Revolutionary", "Unleash", "Game-changer", "Delve", "Tapestry".
3. Incorporate high-intent search keywords: production agent skill, deterministic workflow, cross-runtime, zero hallucination.
4. Provide concrete, quotable definition capsules and structured deliverables that search engines and AI agents can cite as authoritative sources.`;if(i==="name"){const s=k?`Nama Judul Skill: "${r||n||t}"
Konteks Prompt:
${e?e.slice(0,1e3):"(Kompiler otomatis)"}

Buat SATU nama identifier skill standar Open Agent Skills dalam format KEBAB-CASE murni (hanya huruf kecil a-z, angka 0-9, dan tanda hubung '-', maksimal 64 karakter, contoh: "nextjs-fullstack-architect" atau "seo-geo-content-engine").
HANYA kembalikan teks kebab-case saja tanpa tanda kutip, tanpa spasi, dan tanpa penjelasan:`:`Skill Title: "${r||n||t}"
Prompt Context:
${e?e.slice(0,1e3):"(Auto-compiled)"}

Generate ONE clean Open Agent Skills identifier name in pure KEBAB-CASE format (lowercase a-z, numbers 0-9, and '-' only, max 64 chars, e.g. "nextjs-fullstack-architect" or "seo-geo-content-engine").
Return ONLY the kebab-case identifier without quotes, without spaces, and without explanation:`,d=await F(s,h);return{name:q(d).toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"").slice(0,64)||"custom-agent-skill"}}if(i==="title"){const s=k?`Nama Kebab-Case Skill: "${t}"
Kerangka Kerja Terkait: "${n}"
Konteks Prompt Bawaan:
${e?e.slice(0,1500):"(Kompiler prompt otomatis)"}

Buat SATU judul produk komersial ramah SEO yang mengandung kata kunci pencarian berniat tinggi (maksimal 60 karakter, contoh: "Next.js Fullstack Production Agent Skill").
HANYA kembalikan teks judul saja tanpa tanda kutip dan tanpa penjelasan:`:`Kebab-Case Skill Name: "${t}"
Related Framework: "${n}"
Prompt Context:
${e?e.slice(0,1500):"(Auto-compiled prompt)"}

Generate ONE high-intent, SEO-friendly commercial title for an agent skill marketplace (max 60 chars, e.g. "Next.js Fullstack Production Agent Skill").
Return ONLY the title text without quotes or explanations:`,d=await F(s,h);return{title:q(d).replace(/^["']|["']$/g,"").trim()}}if(i==="tagline"){const s=k?`Nama Skill: "${r||t}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${e?e.slice(0,1500):""}

Buat SATU kalimat tagline bernilai tinggi dan ramah GEO (answer capsule, maksimal 120 karakter, fokus pada hasil kerja konkret yang diotomasi).
HANYA kembalikan teks tagline saja tanpa tanda kutip:`:`Skill Name: "${r||t}"
Framework: "${n}"
Prompt Context:
${e?e.slice(0,1500):""}

Create ONE punchy value-proposition tagline and GEO answer capsule stating the concrete buyer outcome (max 120 chars).
Return ONLY the tagline text without quotes:`,d=await F(s,h);return{tagline:q(d).replace(/^["']|["']$/g,"").trim()}}if(i==="tags"){const s=k?`Nama Skill: "${r||t}"
Kerangka Kerja: "${n}"

Berikan 5 hingga 7 tag penemuan SEO & marketplace tanpa tanda pagar (#), dipisahkan dengan koma.
Sertakan tag format ('open-agent-skills', 'agent-skill'), runtime ('claude-code', 'cursor-rules', 'antigravity'), serta kata kunci domain teknis.
HANYA kembalikan teks tag dipisahkan koma:`:`Skill Name: "${r||t}"
Framework: "${n}"

Provide 5 to 7 high-intent SEO & marketplace discovery tags without hash symbols (#), separated by commas.
Include format tags ('open-agent-skills', 'agent-skill'), runtime keywords ('claude-code', 'cursor-rules', 'antigravity'), and specific technical domain keywords.
Return ONLY comma-separated tags:`,d=await F(s,h);return{tags:q(d).replace(/^["']|["']$/g,"").trim().split(",").map(b=>b.trim().replace(/^#/,"")).filter(Boolean)}}if(i==="description"){const s=k?`Nama Produk Skill: "${r||t}"
Tagline: "${c||""}"
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
Didukung penuh pada 27 runtime Open Agent Skills termasuk Google Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, Codex, dan OpenCode.`:`Skill Product Name: "${r||t}"
Tagline: "${c||""}"
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
Supported across 27 Open Agent Skills runtimes including Google Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, Codex, and OpenCode.`,d=await F(s,h);return{description:q(d).trim()}}if(i==="demoRequest"){const s=k?`Nama Skill: "${r||t}"
Kerangka Kerja: "${n}"
Konteks Prompt:
${e?e.slice(0,1500):""}

Susun SATU contoh permintaan nyata (Demo Request) yang realistis, menantang, dan mencerminkan kueri pencarian pembeli potensial (high-intent user search query).
Permintaan harus spesifik, memberikan konteks masalah nyata, dan meminta solusi teknis lengkap.
HANYA kembalikan teks prompt permintaan tanpa kata pengantar:`:`Skill Name: "${r||t}"
Framework: "${n}"
Prompt Context:
${e?e.slice(0,1500):""}

Draft ONE realistic, high-intent demo request (the user prompt) that mirrors real customer search queries when looking for an agent solution.
It should provide realistic task context and request complete deliverables.
Return ONLY the prompt request text without preamble:`,d=await F(s,h);return{demoRequest:q(d).trim()}}if(i==="demoResult"){const s=k?`Nama Skill: "${r||t}"
Kerangka Kerja: "${n}"
Permintaan Pengguna (Demo Request):
"${o||"Lakukan audit dan implementasi solusi sesuai standar arsitektur terbaik."}"
Konteks Prompt:
${e?e.slice(0,1500):""}

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
${e?e.slice(0,1500):""}

Draft ONE gold-standard execution result (Demo Result) delivered by the AI Agent.
It must be GEO-friendly (quotable by Perplexity / SearchGPT) and include:
## Executive Summary
## Deliverable / Solution Specification
## Quality Gate & Verification Steps
At least 700 characters, structured, concrete.
Return ONLY the output result markdown without preamble:`,d=await F(s,h);return{demoResult:q(d).trim()}}const m=k?`Nama Kebab-Case Skill: "${t}"
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
Return ONLY valid JSON without markdown codeblock wrapper (\`\`\`json):`,u=await F(m,h),p=u.replace(/^```json\s*/i,"").replace(/^```\s*/,"").replace(/\s*```$/,"").trim();try{const s=JSON.parse(p);return{title:typeof s.title=="string"?s.title.trim():void 0,tagline:typeof s.tagline=="string"?s.tagline.trim():void 0,tags:Array.isArray(s.tags)?s.tags.map(String):void 0,priceUsd:typeof s.priceUsd=="number"?s.priceUsd:14.99,description:typeof s.description=="string"?s.description.trim():void 0,demoRequest:typeof s.demoRequest=="string"?s.demoRequest.trim():void 0,demoResult:typeof s.demoResult=="string"?s.demoResult.trim():void 0}}catch{return{title:k?`Paket Spesialis ${n}`:`${n} Specialist Pack`,tagline:k?"Otomasi alur kerja prompt cerdas dan deterministik dengan panduan teruji.":"Automates intelligent, deterministic prompt workflows with production guardrails.",tags:["AI Agent","Prompt Engineering","Productivity"],priceUsd:14.99,description:u}}},La=async(a,t,n="id")=>{const e=n==="id",i=e?`Anda adalah Copywriter Produk AI dan Penjualan Agent Skills berstandar tinggi. Buat teks promosi singkat, menarik, dan bernilai tinggi untuk mempromosikan paket skill ini kepada praktisi AI, kreator, dan engineer.
DILARANG menggunakan kata-kata klise seperti "Revolusioner", "Game-changer", "Unleash", atau tanda em-dash (—). Gunakan kalimat lugas, profesional, dan tajam.`:`You are an elite AI Product and Agent Skills copywriter. Create a concise, compelling, high-converting promotional post for this skill pack targeting AI practitioners, creators, and engineers.
DO NOT use overused AI cliches like "Revolutionary", "Game-changer", "Unleash", or em-dashes (—). Keep it crisp, professional, and punchy.`,r=e?`Nama Paket Skill: "${a}"
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

Plain text format, cleanly formatted and ready to copy:`,c=await F(r,i);return q(c).trim()};export{Z as A,Ue as B,se as C,wa as D,Ta as E,ga as F,Ae as G,va as H,Ca as I,pa as J,fa as K,Oa as L,ve as a,ya as b,Q as c,aa as d,Pa as e,Ia as f,De as g,ha as h,Aa as i,he as j,U as k,ua as l,$a as m,La as n,ma as o,ka as p,We as q,Sa as r,V as s,W as t,ba as u,da as v,oa as w,la as x,Ye as y,ca as z};
