export const INPUT_SUGGESTIONS: { [key: string]: string[] } = {
  // Common inputs
  TOPIK: [
    "Kecerdasan Buatan dalam Pendidikan",
    "Pemanasan Global",
    "Manajemen Waktu untuk Freelancer",
    "Resep Masakan Tradisional Modern",
    "Strategi Pemasaran Digital",
    "Kesehatan Mental di Tempat Kerja",
    "Pengembangan Kota Pintar",
    "Cryptocurrency dan Blockchain",
  ],
  ROLE: [
    "Seorang Guru SD yang sabar",
    "Seorang Konsultan Bisnis Senior",
    "Seorang Koki Bintang Lima",
    "Seorang Programmer Python Ahli",
    "Seorang Penulis Fiksi Ilmiah",
    "Seorang Terapis Pernikahan",
    "Seorang Sejarawan Seni",
    "Seorang Ahli Strategi SEO",
  ],
  AUDIENCE: [
    "Mahasiswa tingkat akhir",
    "Anak-anak usia 5-10 tahun",
    "Eksekutif perusahaan",
    "Ibu rumah tangga",
    "Pengembang pemula",
    "Investor aset kripto",
    "Pencinta kucing",
    "Wisatawan backpacker",
  ],
  TONE: [
    "Profesional dan Otoritatif",
    "Ramah dan Mengundang",
    "Lucu dan Menghibur",
    "Sarkastik dan Tajam",
    "Empatik dan Mendukung",
    "Akademis dan Formal",
    "Antusias dan Berenergi",
    "Misterius dan Menarik",
  ],
  CONTEXT: [
    "Untuk postingan LinkedIn viral",
    "Untuk email penawaran dingin (cold email)",
    "Untuk thread Twitter/X",
    "Untuk artikel blog SEO-friendly",
    "Untuk skrip video YouTube pendek",
    "Untuk deskripsi produk e-commerce",
    "Untuk surat lamaran kerja",
    "Untuk caption Instagram estetik",
  ],
  STYLE: [
    "Sangat detail dan komprehensif",
    "Singkat, padat, dan jelas (poin-poin)",
    "Bercerita (Storytelling)",
    "Debat pro dan kontra",
    "Panduan langkah demi langkah (How-to)",
    "Q&A (Tanya Jawab)",
    "Studi kasus nyata",
    "Analogi metaforis",
  ],
  LANGUAGE: [
    "Bahasa Indonesia Formal (EYD)",
    "Bahasa Indonesia Gaul/Santai",
    "Bahasa Inggris (UK Professional)",
    "Bahasa Inggris (US Casual)",
    "Campuran Indoglish (Jaksel style)",
    "Bahasa Jawa Krama Inggil",
  ],
  // Specific inputs
  GENRE: [
    "Cyberpunk Dystopian",
    "High Fantasy Medieval",
    "Space Opera Sci-Fi",
    "Noir Detective Mystery",
    "Romantic Comedy",
    "Slice of Life Anime",
    "Dark Psychological Horror",
  ],
  PLATFORM: [
    "Instagram Reels",
    "TikTok Video",
    "YouTube Shorts",
    "LinkedIn Article",
    "Medium Post",
    "Twitter Thread",
    "Facebook Group Post",
  ],
  // English Aliases
  TOPIC: [
    "Artificial Intelligence in Education",
    "Global Warming and Climate Change",
    "Time Management for Freelancers",
    "Modern Twist on Traditional Recipes",
    "Digital Marketing Strategies 2024",
    "Mental Health in the Workplace",
    "Smart City Development",
    "Cryptocurrency and Blockchain",
  ],
  SUBJECT: [
    "Physics: Quantum Mechanics",
    "History: The Industrial Revolution",
    "Biology: Photosynthesis",
    "Math: Calculus Derivatives",
    "Literature: Shakespearean Tragedy",
  ],
  KEYWORD: [
    "Sustainable, Eco-friendly, Green",
    "Minimalist, Clean, Modern",
    "Luxury, Premium, Exclusive",
    "Affordable, Budget, Cheap",
    "Fast, Efficient, Quick",
  ],
  // Cyber Security - Red Team
  RED_TEAM_TACTIC: [
    "Initial Access (T1190 - Exploit Public-Facing Application)",
    "Execution (T1059 - Command and Scripting Interpreter)",
    "Persistence (T1547 - Boot or Logon Autostart Execution)",
    "Privilege Escalation (T1068 - Exploitation for Privilege Escalation)",
    "Defense Evasion (T1027 - Obfuscated Files or Information)",
    "Credential Access (T1003 - OS Credential Dumping)",
    "Discovery (T1087 - Account Discovery)",
    "Lateral Movement (T1021 - Remote Services)",
    "Collection (T1119 - Automated Collection)",
    "Command and Control (T1105 - Ingress Tool Transfer)",
  ],
  OSINT_TARGET: [
    "External DNS Records & Subdomains",
    "Public Employee Profiles (LinkedIn/Social Media)",
    "Exposed Cloud Storage Buckets (S3/Azure)",
    "Historical WHOIS & Domain Registration Data",
    "Publicly Accessible GitHub Repositories",
    "Leaked Credentials from Breach Databases",
    "Public Corporate Financial Reports",
    "Registered Trade Marks & Patent Filings",
  ],
  RECON_TYPE: [
    "Passive Intelligence Gathering (Non-Intrusive)",
    "Active Port Scanning & Service Identification",
    "Vulnerability Assessment & Version Detection",
    "Network Topology Mapping & SNMP Polling",
    "Web Application Path Discovery & Fuzzing",
    "Wireless Network Signal Mapping (Wardriving)",
    "Cloud Asset Discovery & API Enumeration",
  ],
  RECON_TOOLS: [
    "Nmap, Masscan, ZMap",
    "Shodan, Censys, GreyNoise",
    "Burp Suite Professional, OWASP ZAP",
    "Amass, Subfinder, Assetfinder",
    "Metasploit Framework, Cobalt Strike",
    "Wireshark, Tcpdump, Bettercap",
  ],
  // Cyber Security - Blue Team
  BLUE_TEAM_TASK: [
    "Alert Triage (Analyzing SIEM Piling)",
    "Email Phishing Header Analysis",
    "Host Forensics (Memory and Artifacts)",
    "Network Flow Analysis for C2 Detection",
    "Active Threat Hunting (YARA/Sigma Rules)",
    "Vulnerability Management & Patch Prioritization",
    "Incident Response Coordination (IR Playbook)",
  ],
  // Business & Startup
  BUSINESS_MODEL: [
    "SaaS (Software as a Service)",
    "B2B Subscription Model",
    "Direct-to-Consumer (D2C) E-commerce",
    "Marketplace Aggregator (P2P)",
    "Freemium with Enterprise Upsell",
    "AI-as-a-Service (Token Billing)",
    "Hyper-local Delivery Service",
  ],
  TARGET_MARKET: [
    "Late-stage Millennials in Urban Areas",
    "SMBs (Small Medium Businesses) in Tech",
    "Enterprise Healthcare Providers",
    "Remote-first Creative Professionals",
    "Gen Z interested in Sustainable Fashion",
    "Fortune 500 Fintech Companies",
  ],
  REVENUE_STREAM: [
    "Monthly/Annual Subscription Fees",
    "Transaction-based Commission (2-5%)",
    "Tiered Premium Features & Plugins",
    "White-label Licensing for Partners",
    "API Usage-based Metered Billing",
    "Managed Services & Implementation Fees",
  ],
  // Software Development
  TUGAS_PENGEMBANGAN: [
    "Generate New Code (Boilerplate/Logic)",
    "Bug Fixing & Root Cause Analysis",
    "Code Refactoring for Readability",
    "Unit and Integration Test Generation",
    "Technical Documentation & API Specs",
    "Performance Optimization & Profiling",
  ],
  TECH_STACK: [
    "React, TypeScript, Tailwind CSS, Vite",
    "Next.js, Prisma, PostgreSQL, Vercel",
    "Python, FastAPI, MongoDB, Docker",
    "Go, Gin, Redis, Kubernetes",
    "Flutter, Dart, Firebase",
    "Java, Spring Boot, AWS, Terraform",
  ],
  PROGRAMMING_LANGUAGE: [
    "TypeScript",
    "Python",
    "Go (Golang)",
    "Rust",
    "Java",
    "C#",
    "Kotlin",
    "Swift",
  ],
};

// Map simpler keys to existing arrays if needed to avoid duplication
INPUT_SUGGESTIONS["THEME"] = INPUT_SUGGESTIONS["TOPIK"];
INPUT_SUGGESTIONS["BAHASA"] = INPUT_SUGGESTIONS["LANGUAGE"];

export const getRandomSuggestion = (key: string): string => {
  // Normalize key to uppercase and replace spaces with underscores to match potential dictionary keys or formats
  const normalizedKey = key.toUpperCase().replace(/\s+/g, "_");

  // 1. Try exact match
  let suggestions = INPUT_SUGGESTIONS[normalizedKey];

  // 2. Try partial match: if dictionary key is contained in input key (e.g. "INPUT_TOPIK" contains "TOPIK")
  if (!suggestions) {
    const foundKeyStr = Object.keys(INPUT_SUGGESTIONS).find((dictKey) =>
      normalizedKey.includes(dictKey),
    );
    if (foundKeyStr) {
      suggestions = INPUT_SUGGESTIONS[foundKeyStr];
    }
  }

  // 3. Try reverse partial match: if input key is contained in dictionary key (less likely but possible)
  if (!suggestions) {
    const foundKeyStr = Object.keys(INPUT_SUGGESTIONS).find((dictKey) =>
      dictKey.includes(normalizedKey),
    );
    if (foundKeyStr) {
      suggestions = INPUT_SUGGESTIONS[foundKeyStr];
    }
  }

  if (suggestions && suggestions.length > 0) {
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  }

  return "";
};
