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
  // Email & Communication
  SENDER: [
    "Hiring Manager: PT Teknologi Masa Depan",
    "Customer Support: Layanan Pelanggan 24/7",
    "Event Organizer: Konser Musik Amal",
    "Project Manager: Tim Pengembangan Alpha",
    "Kepala Sekolah: SMA Negeri 1 Kota Harapan",
  ],
  RECIPIENT: [
    "Bapak/Ibu HRD Manager",
    "Seluruh Karyawan Divisi Pemasaran",
    "Pelanggan Setia Toko Buku Kami",
    "Mahasiswa Baru Angkatan 2024",
    "Mitra Bisnis dan Vendor",
  ],
  // Narrative & Storytelling
  CHARACTER: [
    "Seorang detektif swasta yang sinis tapi berhati emas",
    "Seorang putri kerajaan yang melarikan diri untuk menjadi bajak laut",
    "Seorang ilmuwan jenius yang tidak sengaja menciptakan mesin waktu",
    "Seorang pedagang keliling yang sebenarnya mata-mata kerajaan",
    "Seorang robot yang mulai merasakan emosi manusia",
  ],
  PLOT_ELEMENT: [
    "Sebuah artefak kuno yang memiliki kutukan mengerikan",
    "Surat rahasia yang tidak boleh jatuh ke tangan musuh",
    "Pintu tersembunyi di perpustakaan tua",
    "Sinyal radio misterius dari luar angkasa",
    "Ramuan yang bisa membuat peminumnya menghilang",
  ],
  SETTING: [
    "Kota metropolitan masa depan dengan mobil terbang",
    "Desa kecil yang damai di kaki gunung berapi",
    "Stasiun luar angkasa yang ditinggalkan",
    "Hutan terlarang yang penuh dengan makhluk ajaib",
    "Kastil tua di atas tebing curam saat badai",
  ],
  // Event & Promotion
  EVENT_NAME: [
    "Webinar: Strategi Digital Marketing 2025",
    "Workshop: Dasar-Dasar Fotografi Alam Liar",
    "Grand Opening: Kafe Kopi Senja",
    "Festival Musik Indie Tahunan",
    "Seminar Kesehatan Mental di Era Digital",
  ],
  // Data & Analysis
  DATA_SOURCE: [
    "Laporan Penjualan Kuartal 1-3",
    "Hasil Survei Kepuasan Pelanggan (N=500)",
    "Data Transaksi E-commerce 2023-2024",
    "Log Aktivitas Server 7 Hari Terakhir",
    "Statistik Media Sosial Bulan Lalu",
  ],
  ERROR_MESSAGE: [
    "Error 404: Resource Not Found",
    "Connection Timed Out after 3000ms",
    "NullReferenceException in Module X",
    "SyntaxError: Unexpected token < in JSON",
    "Permission Denied: Access is forbidden",
  ],
  // Cyber Security - Blue Team
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
  USP: [
    "Teknologi AI yang 10x lebih cepat dari kompetitor",
    "Desain minimalis yang sangat mudah digunakan lansia",
    "Satu-satunya platform dengan garansi uang kembali 100%",
    "Integrasi mulus dengan lebih dari 500 aplikasi pihak ketiga",
    "Harga paling terjangkau di kelasnya tanpa biaya tersembunyi",
  ],
  SOLUTION: [
    "Platform manajemen inventaris otomatis untuk toko retail",
    "Aplikasi konsultasi kesehatan mental berbasis chatting",
    "Marketplace bahan makanan organik langsung dari petani",
    "Sistem keamanan rumah pintar yang terintegrasi dengan drone",
    "Layanan berlangganan pakaian kantor untuk profesional muda",
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
  // Planning & Projects
  GOAL: [
    "Meningkatkan konversi penjualan sebesar 25% dalam 3 bulan",
    "Membangun komunitas pengguna loyal sebanyak 10.000 orang",
    "Meluncurkan MVP (Minimum Viable Product) ke publik",
    "Mengotomatiskan 80% proses entri data manual",
    "Mengurangi biaya operasional bulanan sebesar 15%",
  ],
  SUCCESS_METRICS: [
    "Jumlah pengguna aktif harian (DAU) > 1000",
    "Tingkat retensi pengguna bulan pertama di atas 40%",
    "Skor kepuasan pelanggan (NPS) minimal 8/10",
    "Waktu rata-rata penyelesaian tugas berkurang 30 menit",
  ],
  // Creative & Visual
  VISUAL_IDEA: [
    "Gaya Cyberpunk dengan lampu neon ungu dan biru",
    "Estetika Minimalis Zen dengan palet warna earthy",
    "Desain Retro 80-an dengan grain dan distorsi VHS",
    "Tampilan Futuristik Bersih dengan elemen kaca transparan",
    "Gaya Ilustrasi Cat Air yang lembut dan artistik",
  ],
  HOOK: [
    "Tahukah Anda bahwa 90% orang melakukan kesalahan ini saat...",
    "Saya menemukan rahasia kecil yang mengubah hidup saya dalam 7 hari",
    "Hentikan semua yang Anda lakukan dan dengarkan fakta mengejutkan ini",
    "Ini adalah alasan sebenarnya mengapa bisnis Anda tidak kunjung berkembang",
    "Cara mudah mendapatkan [Benefit] tanpa harus [Pain Point]",
  ],
  VIDEO_TOPIC: [
    "A day in the life of a remote software engineer",
    "5 Tools AI rahasia yang akan membuat Anda lebih produktif",
    "Mengapa saya berhenti menggunakan media sosial selama 30 hari",
    "Review jujur gadget terbaru yang sedang trending",
    "Panduan lengkap memulai investasi dari nol untuk pemula",
  ],
  // Personal
  INTERESTS: [
    "Fotografi alam dan traveling murah",
    "Masakan fusion Asia-Eropa dan kopi manual brew",
    "Teknologi blockchain dan pengembangan game indie",
    "Olahraga angkat beban dan diet keto",
    "Membaca buku pengembangan diri dan psikologi populer",
  ],
  WORKOUT_TYPE: [
    "High-Intensity Interval Training (HIIT) 20 menit",
    "Latihan beban fokus pada Upper Body",
    "Yoga Vinyasa untuk fleksibilitas dan ketenangan",
    "Lari santai (Jogging) sejauh 5km",
    "Latihan kekuatan inti (Core Strength) di rumah",
  ],
};

// Map simpler keys to existing arrays if needed to avoid duplication
INPUT_SUGGESTIONS["THEME"] = INPUT_SUGGESTIONS["TOPIK"];
INPUT_SUGGESTIONS["BAHASA"] = INPUT_SUGGESTIONS["LANGUAGE"];
INPUT_SUGGESTIONS["SUBJECT_MATTER"] = INPUT_SUGGESTIONS["SUBJECT"];
INPUT_SUGGESTIONS["SPECIFIC_CONCEPT"] = INPUT_SUGGESTIONS["SUBJECT"];

// Business Aliases
INPUT_SUGGESTIONS["UNIQUE_SELLING_POINT"] = INPUT_SUGGESTIONS["USP"];
INPUT_SUGGESTIONS["UNIQUE_BENEFIT"] = INPUT_SUGGESTIONS["USP"];
INPUT_SUGGESTIONS["TARGET_CUSTOMER"] = INPUT_SUGGESTIONS["TARGET_MARKET"];
INPUT_SUGGESTIONS["TARGET_AUDIENS"] = INPUT_SUGGESTIONS["TARGET_MARKET"];

// Creative & Content Aliases
INPUT_SUGGESTIONS["VIDEO_CONCEPT"] = INPUT_SUGGESTIONS["VIDEO_TOPIC"];
INPUT_SUGGESTIONS["VISUAL_STYLE"] = INPUT_SUGGESTIONS["VISUAL_IDEA"];
INPUT_SUGGESTIONS["VISUAL_DESCRIPTION"] = INPUT_SUGGESTIONS["VISUAL_IDEA"];
INPUT_SUGGESTIONS["TRENDING_SOUND"] = INPUT_SUGGESTIONS["CONTEXT"];

// Project Planning Aliases
INPUT_SUGGESTIONS["TUJUAN_PROYEK"] = INPUT_SUGGESTIONS["GOAL"];
INPUT_SUGGESTIONS["MISSION"] = INPUT_SUGGESTIONS["GOAL"];
INPUT_SUGGESTIONS["SUBTASKS"] = INPUT_SUGGESTIONS["TUGAS_PENGEMBANGAN"];
INPUT_SUGGESTIONS["SPECIFIC_TASKS"] = INPUT_SUGGESTIONS["TUGAS_PENGEMBANGAN"];

// Personal Aliases
INPUT_SUGGESTIONS["USER_INTERESTS"] = INPUT_SUGGESTIONS["INTERESTS"];

// Narrative & Storytelling Aliases
INPUT_SUGGESTIONS["PROTAGONIST"] = INPUT_SUGGESTIONS["CHARACTER"];
INPUT_SUGGESTIONS["ANTAGONIST"] = INPUT_SUGGESTIONS["CHARACTER"];
INPUT_SUGGESTIONS["WRITER_PERSONA"] = INPUT_SUGGESTIONS["ROLE"];
INPUT_SUGGESTIONS["ALUR_CERITA"] = INPUT_SUGGESTIONS["PLOT_ELEMENT"];
INPUT_SUGGESTIONS["SCENE_DESCRIPTION"] = INPUT_SUGGESTIONS["SETTING"];
INPUT_SUGGESTIONS["LOKASI"] = INPUT_SUGGESTIONS["SETTING"];

// Email & Communication Aliases
INPUT_SUGGESTIONS["SENDER_NAME"] = INPUT_SUGGESTIONS["SENDER"];
INPUT_SUGGESTIONS["NAMA_PENGIRIM"] = INPUT_SUGGESTIONS["SENDER"];
INPUT_SUGGESTIONS["NAMA_PENERIMA"] = INPUT_SUGGESTIONS["RECIPIENT"];
INPUT_SUGGESTIONS["RSVP_INFO"] = INPUT_SUGGESTIONS["CONTACT"];

// Event Aliases
INPUT_SUGGESTIONS["NAMA_ACARA"] = INPUT_SUGGESTIONS["EVENT_NAME"];
INPUT_SUGGESTIONS["EVENT_DETAILS"] = INPUT_SUGGESTIONS["CONTEXT"];

// Data Aliases
INPUT_SUGGESTIONS["DATASET_DESCRIPTION"] = INPUT_SUGGESTIONS["DATA_SOURCE"];
INPUT_SUGGESTIONS["SUMBER_DATA"] = INPUT_SUGGESTIONS["DATA_SOURCE"];
INPUT_SUGGESTIONS["TECHNICAL_ERROR"] = INPUT_SUGGESTIONS["ERROR_MESSAGE"];

// SWOT Analysis
INPUT_SUGGESTIONS["STRENGTHS"] = [
  "Brand recognition yang kuat di pasar lokal",
  "Tim R&D yang inovatif dan berpengalaman",
  "Biaya produksi rendah karena efisiensi rantai pasok",
  "Basis pelanggan yang loyal dan aktif",
  "Teknologi proprietary yang sulit ditiru",
];
INPUT_SUGGESTIONS["WEAKNESSES"] = [
  "Ketergantungan tinggi pada satu pemasok utama",
  "Kurangnya kehadiran digital yang kuat",
  "Cash flow yang tidak stabil di kuartal tertentu",
  "Sistem IT yang sudah usang",
  "Turnover karyawan yang tinggi",
];
INPUT_SUGGESTIONS["OPPORTUNITIES"] = [
  "Ekspansi ke pasar internasional yang sedang berkembang",
  "Tren gaya hidup sehat yang meningkat",
  "Kemitraan strategis dengan perusahaan teknologi",
  "Pemanfaatan AI untuk personalisasi layanan",
  "Subsidi pemerintah untuk industri hijau",
];
INPUT_SUGGESTIONS["THREATS"] = [
  "Kompetitor baru dengan modal besar",
  "Perubahan regulasi yang ketat",
  "Kenaikan harga bahan baku global",
  "Pergeseran preferensi konsumen yang cepat",
  "Ancaman keamanan siber",
];

// Hero's Journey
INPUT_SUGGESTIONS["CALL_TO_ADVENTURE"] = [
  "Pesan misterius muncul di layar komputer tua",
  "Desa diserang oleh pasukan bayangan",
  "Peta harta karun ditemukan di loteng",
  "Undangan untuk bergabung dengan akademi sihir",
  "Ramalan kuno tentang yang terpilih",
];
INPUT_SUGGESTIONS["REFUSAL_OF_CALL"] = [
  "Merasa tidak pantas dan takut gagal",
  "Kewajiban menjaga keluarga yang sakit",
  "Tidak percaya pada sihir atau takhayul",
  "Trauma masa lalu yang menghantui",
  "Keinginan untuk hidup normal dan damai",
];
INPUT_SUGGESTIONS["MEETING_MENTOR"] = [
  "Seorang petapa tua gila di puncak gunung",
  "Hologram AI dari masa lalu",
  "Guru silat yang menyamar sebagai tukang sapu",
  "Buku yang bisa bicara",
  "Roh leluhur yang muncul dalam mimpi",
];

// Cyber Security Specifics
INPUT_SUGGESTIONS["CYBER_TOOLS"] = [
  "Nmap, Masscan, Wireshark",
  "Burp Suite Professional, OWASP ZAP",
  "Metasploit, Cobalt Strike, Empire",
  "Shodan, Maltego, theHarvester",
  "Mimikatz, BloodHound, PowerView",
];
INPUT_SUGGESTIONS["ATTACK_VECTOR"] = [
  "Spearphishing dengan lampiran malicious (Macro)",
  "Eksploitasi kerentanan publik (mis. CVE-2021-44228)",
  "Brute-force serangan pada RDP/SSH",
  "Supply chain compromise melalui update pihak ketiga",
  "USB Drop attack di area publik target",
];
INPUT_SUGGESTIONS["SOCIAL_ENGINEERING_SCENARIO"] = [
  "Email mendesak dari 'CEO' minta transfer dana",
  "Telepon dari 'IT Support' minta verifikasi password",
  "Kurir paket palsu yang meminta akses gedung",
  "Undangan meeting palsu dengan link phishing",
  "Pemberitahuan perubahan benefit HR palsu",
];
INPUT_SUGGESTIONS["PAYLOAD_TYPE"] = [
  "Reverse Shell (TCP/HTTPS)",
  "Cobalt Strike Beacon",
  "Meterpreter Session",
  "Webshell (PHP/JSP)",
  "Keylogger & Screen Capture Implant",
];
INPUT_SUGGESTIONS["VULNERABILITY_TYPE"] = [
  "SQL Injection (Blind/Error-based)",
  "Cross-Site Scripting (Stored XSS)",
  "Insecure Direct Object References (IDOR)",
  "Broken Authentication & Session Management",
  "Server-Side Request Forgery (SSRF)",
];

// Generic Content & Structure
INPUT_SUGGESTIONS["CONTENT_STRUCTURE"] = [
  "Pendahuluan - Isi (3 Poin) - Kesimpulan",
  "Masalah - Agitasi - Solusi (PAS)",
  "Attention - Interest - Desire - Action (AIDA)",
  "Ringkasan Eksekutif - Temuan Utama - Rekomendasi",
  "Kronologis: Dulu - Sekarang - Masa Depan",
];

// Time & Schedule
INPUT_SUGGESTIONS["TIMEFRAME"] = [
  "Jangka Pendek (1-3 Bulan)",
  "Jangka Menengah (6-12 Bulan)",
  "Jangka Panjang (3-5 Tahun)",
  "Segera (ASAP)",
  "Bertahap per Kuartal",
];

// Resources
INPUT_SUGGESTIONS["RESOURCES"] = [
  "Budget pemasaran $5000",
  "Tim yang terdiri dari 3 developer dan 1 desainer",
  "Akses ke database pelanggan premium",
  "Kemitraan media nasional",
  "Perangkat lunak analitik canggih",
];

// ==========================================
// ALIAS MAPPINGS
// ==========================================

// Cyber Security Aliases (Red Team)
INPUT_SUGGESTIONS["OSINT_TOOLS"] = INPUT_SUGGESTIONS["CYBER_TOOLS"];
INPUT_SUGGESTIONS["RECON_TOOLS"] = INPUT_SUGGESTIONS["CYBER_TOOLS"];
INPUT_SUGGESTIONS["C2_FRAMEWORK"] = INPUT_SUGGESTIONS["CYBER_TOOLS"];
INPUT_SUGGESTIONS["IA_VECTOR"] = INPUT_SUGGESTIONS["ATTACK_VECTOR"];
INPUT_SUGGESTIONS["PERSIST_TECHNIQUE"] = INPUT_SUGGESTIONS["ATTACK_VECTOR"];
INPUT_SUGGESTIONS["LATERAL_MOVEMENT_TECHNIQUE"] =
  INPUT_SUGGESTIONS["ATTACK_VECTOR"];
INPUT_SUGGESTIONS["DEFENSE_EVASION_TECHNIQUE"] =
  INPUT_SUGGESTIONS["ATTACK_VECTOR"];
INPUT_SUGGESTIONS["SE_PRETEXT"] =
  INPUT_SUGGESTIONS["SOCIAL_ENGINEERING_SCENARIO"];
INPUT_SUGGESTIONS["IA_PAYLOAD_TYPE"] = INPUT_SUGGESTIONS["PAYLOAD_TYPE"];
INPUT_SUGGESTIONS["PERSIST_IMPLANT_TYPE"] = INPUT_SUGGESTIONS["PAYLOAD_TYPE"];
INPUT_SUGGESTIONS["APPSEC_VULN_FOCUS"] =
  INPUT_SUGGESTIONS["VULNERABILITY_TYPE"];
INPUT_SUGGESTIONS["OSINT_OBJECTIVES"] = INPUT_SUGGESTIONS["GOAL"];
INPUT_SUGGESTIONS["CAMPAIGN_OBJECTIVE"] = INPUT_SUGGESTIONS["GOAL"];
INPUT_SUGGESTIONS["OSINT_TARGET"] = INPUT_SUGGESTIONS["TARGET_AUDIENCE"];
INPUT_SUGGESTIONS["RECON_TARGET_SCOPE"] = INPUT_SUGGESTIONS["TARGET_AUDIENCE"]; // fallback
INPUT_SUGGESTIONS["SE_TARGET_GROUP"] = INPUT_SUGGESTIONS["TARGET_AUDIENCE"];
INPUT_SUGGESTIONS["LATERAL_MOVEMENT_TARGET_HOST"] =
  INPUT_SUGGESTIONS["TARGET_AUDIENCE"];

// SWOT Aliases
INPUT_SUGGESTIONS["KEKUATAN"] = INPUT_SUGGESTIONS["STRENGTHS"];
INPUT_SUGGESTIONS["KELEMAHAN"] = INPUT_SUGGESTIONS["WEAKNESSES"];
INPUT_SUGGESTIONS["PELUANG"] = INPUT_SUGGESTIONS["OPPORTUNITIES"];
INPUT_SUGGESTIONS["ANCAMAN"] = INPUT_SUGGESTIONS["THREATS"];
INPUT_SUGGESTIONS["CHALLENGES"] = INPUT_SUGGESTIONS["THREATS"];
INPUT_SUGGESTIONS["PAIN_POINTS"] = INPUT_SUGGESTIONS["WEAKNESSES"];

// Hero's Journey Aliases
INPUT_SUGGESTIONS["PANGGILAN_PETUALANGAN"] =
  INPUT_SUGGESTIONS["CALL_TO_ADVENTURE"];
INPUT_SUGGESTIONS["PENOLAKAN_PANGGILAN"] = INPUT_SUGGESTIONS["REFUSAL_OF_CALL"];
INPUT_SUGGESTIONS["PERTEMUAN_MENTOR"] = INPUT_SUGGESTIONS["MEETING_MENTOR"];
INPUT_SUGGESTIONS["ORDINARY_WORLD"] = INPUT_SUGGESTIONS["SETTING"];
INPUT_SUGGESTIONS["CROSSING_THRESHOLD"] = INPUT_SUGGESTIONS["PLOT_ELEMENT"];
INPUT_SUGGESTIONS["REWARD"] = INPUT_SUGGESTIONS["SUCCESS_METRICS"];
INPUT_SUGGESTIONS["RETURN_WITH_ELIXIR"] = INPUT_SUGGESTIONS["GOAL"];

// Project & Dev Aliases
INPUT_SUGGESTIONS["REQUIREMENTS"] = INPUT_SUGGESTIONS["CONTENT_STRUCTURE"];
INPUT_SUGGESTIONS["CRITERIA"] = INPUT_SUGGESTIONS["SUCCESS_METRICS"];
INPUT_SUGGESTIONS["CONSTRAINTS"] = INPUT_SUGGESTIONS["WEAKNESSES"];
INPUT_SUGGESTIONS["DEPENDENCY"] = INPUT_SUGGESTIONS["TECH_STACK"];
INPUT_SUGGESTIONS["LIBRARY"] = INPUT_SUGGESTIONS["TECH_STACK"];
INPUT_SUGGESTIONS["PARAMETERS"] = INPUT_SUGGESTIONS["TECH_STACK"];
INPUT_SUGGESTIONS["SCHEMA_FIELDS"] = INPUT_SUGGESTIONS["TECH_STACK"];

// Content & Structure Aliases
INPUT_SUGGESTIONS["SECTIONS"] = INPUT_SUGGESTIONS["CONTENT_STRUCTURE"];
INPUT_SUGGESTIONS["OUTLINE"] = INPUT_SUGGESTIONS["CONTENT_STRUCTURE"];
INPUT_SUGGESTIONS["FORMAT"] = INPUT_SUGGESTIONS["CONTENT_STRUCTURE"];
INPUT_SUGGESTIONS["CHAPTERS"] = INPUT_SUGGESTIONS["CONTENT_STRUCTURE"];
INPUT_SUGGESTIONS["KEY_POINTS"] = INPUT_SUGGESTIONS["CONTENT_STRUCTURE"];

// Time Aliases
INPUT_SUGGESTIONS["DEADLINE"] = INPUT_SUGGESTIONS["TIMEFRAME"];
INPUT_SUGGESTIONS["DURASI"] = INPUT_SUGGESTIONS["TIMEFRAME"];
INPUT_SUGGESTIONS["JADWAL"] = INPUT_SUGGESTIONS["TIMEFRAME"];
INPUT_SUGGESTIONS["TIME_PERIOD"] = INPUT_SUGGESTIONS["TIMEFRAME"];
INPUT_SUGGESTIONS["START_TIME"] = INPUT_SUGGESTIONS["TIMEFRAME"];

// Resource Aliases
INPUT_SUGGESTIONS["SUMBER_DAYA"] = INPUT_SUGGESTIONS["RESOURCES"];
INPUT_SUGGESTIONS["MATERIALS"] = INPUT_SUGGESTIONS["RESOURCES"];
INPUT_SUGGESTIONS["AVAILABLE_RESOURCES"] = INPUT_SUGGESTIONS["RESOURCES"];
INPUT_SUGGESTIONS["SUMBER_DAYA_TERSEDIA"] = INPUT_SUGGESTIONS["RESOURCES"];

// Narrative & Storytelling Aliases
INPUT_SUGGESTIONS["PROTAGONIST"] = INPUT_SUGGESTIONS["CHARACTER"];
INPUT_SUGGESTIONS["ANTAGONIST"] = INPUT_SUGGESTIONS["CHARACTER"];
INPUT_SUGGESTIONS["WRITER_PERSONA"] = INPUT_SUGGESTIONS["ROLE"];
INPUT_SUGGESTIONS["ALUR_CERITA"] = INPUT_SUGGESTIONS["PLOT_ELEMENT"];
INPUT_SUGGESTIONS["SCENE_DESCRIPTION"] = INPUT_SUGGESTIONS["SETTING"];
INPUT_SUGGESTIONS["LOKASI"] = INPUT_SUGGESTIONS["SETTING"];

// Email & Communication Aliases
INPUT_SUGGESTIONS["SENDER_NAME"] = INPUT_SUGGESTIONS["SENDER"];
INPUT_SUGGESTIONS["NAMA_PENGIRIM"] = INPUT_SUGGESTIONS["SENDER"];
INPUT_SUGGESTIONS["NAMA_PENERIMA"] = INPUT_SUGGESTIONS["RECIPIENT"];
INPUT_SUGGESTIONS["RSVP_INFO"] = INPUT_SUGGESTIONS["CONTACT"];

// Event Aliases
INPUT_SUGGESTIONS["NAMA_ACARA"] = INPUT_SUGGESTIONS["EVENT_NAME"];
INPUT_SUGGESTIONS["EVENT_DETAILS"] = INPUT_SUGGESTIONS["CONTEXT"];

// Data Aliases
INPUT_SUGGESTIONS["DATASET_DESCRIPTION"] = INPUT_SUGGESTIONS["DATA_SOURCE"];
INPUT_SUGGESTIONS["SUMBER_DATA"] = INPUT_SUGGESTIONS["DATA_SOURCE"];
INPUT_SUGGESTIONS["TECHNICAL_ERROR"] = INPUT_SUGGESTIONS["ERROR_MESSAGE"];

// General Aliases
INPUT_SUGGESTIONS["METADATA"] = INPUT_SUGGESTIONS["KEYWORD"];
INPUT_SUGGESTIONS["TAGS"] = INPUT_SUGGESTIONS["KEYWORD"];
INPUT_SUGGESTIONS["LABEL"] = INPUT_SUGGESTIONS["KEYWORD"];

// Catch-all Aliases for Description/Details
INPUT_SUGGESTIONS["SHORT_DESCRIPTION"] = INPUT_SUGGESTIONS["CONTEXT"];
INPUT_SUGGESTIONS["DESCRIPTION"] = INPUT_SUGGESTIONS["CONTEXT"];
INPUT_SUGGESTIONS["DETAILS"] = INPUT_SUGGESTIONS["CONTEXT"];
INPUT_SUGGESTIONS["ADDITIONAL_INFO"] = INPUT_SUGGESTIONS["CONTEXT"];
INPUT_SUGGESTIONS["BACKGROUND"] = INPUT_SUGGESTIONS["CONTEXT"];
INPUT_SUGGESTIONS["SITUATION"] = INPUT_SUGGESTIONS["CONTEXT"];
INPUT_SUGGESTIONS["SCENARIO"] = INPUT_SUGGESTIONS["CONTEXT"];

// Catch-all for "Name" or "Title"
INPUT_SUGGESTIONS["TITLE"] = INPUT_SUGGESTIONS["TOPIK"];
INPUT_SUGGESTIONS["NAME"] = INPUT_SUGGESTIONS["TOPIK"];
INPUT_SUGGESTIONS["LABEL"] = INPUT_SUGGESTIONS["TOPIK"];
INPUT_SUGGESTIONS["PROJECT_NAME"] = INPUT_SUGGESTIONS["TOPIK"];
INPUT_SUGGESTIONS["SONG_TITLE"] = INPUT_SUGGESTIONS["TOPIK"];

// Personal Aliases (Ensuring these exist)
INPUT_SUGGESTIONS["USER_INTERESTS"] = INPUT_SUGGESTIONS["INTERESTS"];

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
