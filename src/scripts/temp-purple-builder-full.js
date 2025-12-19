import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const purpleTeamFramework = {
  id_kerangka: "KI-CS-SFW-003",
  nama_kerangka: "Purple Team Operations",
  version: "1.0.0",
  kategori: ["Koleksi & Inovasi", "Cyber Security"],
  description:
    "Super-framework untuk memfasilitasi kolaborasi antara Red Team dan Blue Team guna meningkatkan postur keamanan secara keseluruhan.",
  perspektif_user:
    "Saya seorang profesional keamanan (Red Team, Blue Team, atau manajer) yang ingin menggunakan AI untuk merancang, mengelola, dan melaporkan hasil dari latihan Purple Team.",
  ai_logic_description:
    "Persona AI: Anda adalah seorang fasilitator Purple Team yang berpengalaman. Anda memahami perspektif ofensif dan defensif, dan dapat menerjemahkannya menjadi sesi kolaboratif yang produktif.",
  toolType: "code",
  output: "natural_language_prompt",
  components: [
    {
      name: "PURPLE_TEAM_TASK",
      label: "Pilih Aktivitas Purple Team",
      type: "select",
      description:
        "Pilih aktivitas kolaboratif yang ingin Anda rancang atau simulasikan.",
      info: "Setiap pilihan akan menampilkan serangkaian input yang relevan untuk tugas tersebut.",
      options: [
        "Validasi Deteksi Taktis",
        "Penyesuaian & Pengoptimalan Aturan",
        "Evaluasi Alat Keamanan",
        "Pemodelan Ancaman Kolaboratif",
        "Sesi Rekayasa Deteksi",
        "Desain Skenario Simulasi Serangan (BAS)",
        "Sesi Perburuan Terpandu",
        "Pengujian Efektivitas Kontrol Keamanan",
        "Analisis Kesenjangan Pertahanan",
        "Post-Mortem Insiden Kolaboratif",
        "Debriefing & Laporan Latihan Gabungan",
        "Pengukuran & Pelaporan Program Keamanan",
      ],
      default: "Validasi Deteksi Taktis",
    },
  ],
  dynamicSubcomponents: {
    trigger: "PURPLE_TEAM_TASK",
    options: {
      "Validasi Deteksi Taktis": {
        components: [
          {
            name: "RED_TEAM_ACTION",
            label: "Aksi Red Team yang Disimulasikan",
            type: "textarea",
            placeholder:
              "e.g., Menjalankan Mimikatz untuk credential dumping dari proses LSASS.",
          },
          {
            name: "BLUE_TEAM_DETECTION",
            label: "Peringatan/Log Blue Team yang Diharapkan",
            type: "textarea",
            placeholder:
              "e.g., Peringatan dari Microsoft Defender for Endpoint terkait akses proses LSASS.",
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Rancang skenario validasi deteksi taktis. \nRed Team akan melakukan: '{RED_TEAM_ACTION}'.\nBlue Team diharapkan melihat: '{BLUE_TEAM_DETECTION}'.\n\nBuat rencana pengujian langkah demi langkah, termasuk perintah spesifik untuk Red Team dan query atau nama peringatan yang harus dicari oleh Blue Team.",
        },
      },
      "Penyesuaian & Pengoptimalan Aturan": {
        components: [
          {
            name: "DETECTION_RULE_NAME",
            label: "Nama Aturan Deteksi",
            type: "text",
            placeholder: "e.g., Powershell Download Activity",
          },
          {
            name: "FALSE_POSITIVE_SCENARIO",
            label: "Skenario False Positive",
            type: "textarea",
            placeholder:
              "e.g., Aturan terpicu oleh skrip login admin yang sah yang juga menggunakan PowerShell untuk mengunduh file konfigurasi.",
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Aturan deteksi '{DETECTION_RULE_NAME}' menghasilkan false positive dalam skenario berikut: '{FALSE_POSITIVE_SCENARIO}'.\n\nAnalisis masalahnya dan sarankan modifikasi pada logika aturan (dalam format pseudocode atau SPL/KQL) untuk mengurangi false positive tanpa kehilangan cakupan deteksi yang sebenarnya.",
        },
      },
      "Evaluasi Alat Keamanan": {
        components: [
          {
            name: "TOOL_NAME",
            label: "Nama Alat Keamanan",
            type: "text",
            placeholder: "e.g., EDR X, SIEM Y, Firewall Z",
          },
          {
            name: "EVALUATION_CRITERIA",
            label: "Kriteria Evaluasi",
            type: "textarea",
            placeholder:
              "e.g., Kemampuan deteksi ransomware, integrasi dengan SOAR, kemudahan penggunaan.",
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Rancang rencana evaluasi untuk alat keamanan '{TOOL_NAME}' berdasarkan kriteria: '{EVALUATION_CRITERIA}'.\n\nSertakan langkah-langkah pengujian yang melibatkan Red Team (untuk simulasi serangan) dan Blue Team (untuk memverifikasi deteksi dan respons).",
        },
      },
      "Pemodelan Ancaman Kolaboratif": {
        components: [
          {
            name: "APPLICATION_OR_SYSTEM",
            label: "Aplikasi/Sistem yang Dimodelkan",
            type: "text",
            placeholder:
              "e.g., Aplikasi Perbankan Online baru, Arsitektur Jaringan Kantor Cabang",
          },
          {
            name: "THREAT_MODELING_FRAMEWORK",
            label: "Kerangka Kerja Pemodelan Ancaman",
            type: "select",
            options: ["STRIDE", "PASTA", "MITRE ATT&CK"],
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Fasilitasi sesi pemodelan ancaman kolaboratif untuk '{APPLICATION_OR_SYSTEM}' menggunakan kerangka kerja '{THREAT_MODELING_FRAMEWORK}'.\n\nBuat agenda sesi, daftar pertanyaan kunci untuk ditanyakan kepada Red Team (ancaman) dan Blue Team (kontrol), dan template untuk mendokumentasikan hasilnya.",
        },
      },
      "Sesi Rekayasa Deteksi": {
        components: [
          {
            name: "THREAT_DESCRIPTION",
            label: "Deskripsi Ancaman/Teknik",
            type: "textarea",
            placeholder:
              "e.g., Penyerang menggunakan WMI untuk eksekusi jarak jauh dan gerakan lateral.",
          },
          {
            name: "AVAILABLE_LOGS",
            label: "Sumber Log yang Tersedia",
            type: "text",
            placeholder:
              "e.g., Sysmon (Event ID 1, 3), Windows Security Events (ID 4688)",
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Berdasarkan deskripsi ancaman: '{THREAT_DESCRIPTION}' dan ketersediaan log: '{AVAILABLE_LOGS}'.\n\nBuat query pencarian (misalnya dalam KQL atau SPL) yang dapat digunakan sebagai dasar untuk aturan deteksi baru. Jelaskan logika di balik query tersebut.",
        },
      },
      "Desain Skenario Simulasi Serangan (BAS)": {
        components: [
          {
            name: "BAS_PLATFORM",
            label: "Platform BAS",
            type: "select",
            options: [
              "AttackIQ",
              "Picus Security",
              "Mandiant Advantage",
              "Open-source (APTSimulator)",
            ],
          },
          {
            name: "ATTACK_SCENARIO_GOAL",
            label: "Tujuan Skenario Serangan",
            type: "textarea",
            placeholder:
              "e.g., Menguji deteksi credential dumping dari LSASS, memverifikasi blokir koneksi C2 ke domain tertentu.",
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Rancang skenario simulasi serangan untuk platform '{BAS_PLATFORM}' dengan tujuan: '{ATTACK_SCENARIO_GOAL}'.\n\nJelaskan langkah-langkah serangan yang akan disimulasikan dan metrik keberhasilan/kegagalan yang harus diukur.",
        },
      },
      "Sesi Perburuan Terpandu": {
        components: [
          {
            name: "RED_TEAM_INSIGHT",
            label: "Wawasan Red Team (TTPs)",
            type: "textarea",
            placeholder:
              "e.g., Kami menggunakan teknik Process Hollowing untuk menyuntikkan beacon ke proses explorer.exe.",
          },
          {
            name: "BLUE_TEAM_TOOLING",
            label: "Alat Blue Team",
            type: "text",
            placeholder: "e.g., Sysmon, EDR, Splunk",
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Berdasarkan wawasan Red Team: '{RED_TEAM_INSIGHT}' dan alat Blue Team yang tersedia: '{BLUE_TEAM_TOOLING}'.\n\nBuat panduan perburuan ancaman terpandu untuk Blue Team. Jelaskan artefak apa yang harus dicari, di mana mencarinya, dan query (jika berlaku) untuk menemukan jejak aktivitas Red Team.",
        },
      },
      "Pengujian Efektivitas Kontrol Keamanan": {
        components: [
          {
            name: "SECURITY_CONTROL",
            label: "Kontrol Keamanan yang Diuji",
            type: "text",
            placeholder: "e.g., EDR, Firewall Aplikasi Web (WAF), DLP",
          },
          {
            name: "ATTACK_VECTOR_TESTED",
            label: "Vektor Serangan yang Diuji",
            type: "textarea",
            placeholder:
              "e.g., Eksekusi PowerShell yang di-obfuscate, SQL Injection, upaya eksfiltrasi data melalui DNS.",
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Rancang rencana pengujian untuk mengevaluasi efektivitas kontrol keamanan '{SECURITY_CONTROL}' terhadap vektor serangan '{ATTACK_VECTOR_TESTED}'.\n\nSertakan langkah-langkah pengujian (Red Team), metrik keberhasilan/kegagalan, dan bagaimana Blue Team akan memverifikasi deteksi atau blokir.",
        },
      },
      "Analisis Kesenjangan Pertahanan": {
        components: [
          {
            name: "RED_TEAM_FINDINGS",
            label: "Temuan Red Team (yang tidak terdeteksi)",
            type: "textarea",
            placeholder:
              "e.g., Gerakan lateral menggunakan WMI tidak terdeteksi oleh EDR. Kredensial admin domain berhasil dicuri tanpa peringatan.",
          },
          {
            name: "BLUE_TEAM_CAPABILITIES",
            label: "Kapabilitas Blue Team Saat Ini",
            type: "textarea",
            placeholder:
              "e.g., Memiliki SIEM, EDR, tetapi kurang visibilitas di endpoint Linux.",
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Berdasarkan temuan Red Team yang tidak terdeteksi: '{RED_TEAM_FINDINGS}' dan kapabilitas Blue Team saat ini: '{BLUE_TEAM_CAPABILITIES}'.\n\nLakukan analisis kesenjangan pertahanan. Identifikasi area di mana Blue Team perlu meningkatkan visibilitas, deteksi, atau respons. Berikan rekomendasi konkret.",
        },
      },
      "Post-Mortem Insiden Kolaboratif": {
        components: [
          {
            name: "INCIDENT_SUMMARY",
            label: "Ringkasan Insiden",
            type: "textarea",
            placeholder:
              "e.g., Serangan ransomware yang berhasil mengenkripsi server file. Penyerang masuk melalui email phishing.",
          },
          {
            name: "LESSONS_LEARNED_FOCUS",
            label: "Fokus Pelajaran yang Diambil",
            type: "select",
            options: ["Pencegahan", "Deteksi", "Respons", "Pemulihan"],
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Fasilitasi sesi post-mortem insiden kolaboratif untuk insiden: '{INCIDENT_SUMMARY}'.\n\nFokus pada pelajaran yang diambil di area '{LESSONS_LEARNED_FOCUS}'. Buat daftar pertanyaan untuk Red Team (bagaimana mereka berhasil) dan Blue Team (mengapa mereka gagal/berhasil), serta rekomendasi untuk perbaikan.",
        },
      },
      "Debriefing & Laporan Latihan Gabungan": {
        components: [
          {
            name: "EXERCISE_SUMMARY",
            label: "Ringkasan Latihan",
            type: "textarea",
            placeholder:
              "e.g., Latihan Purple Team selama 3 hari untuk menguji deteksi C2 dan eksfiltrasi data.",
          },
          {
            name: "KEY_FINDINGS",
            label: "Temuan Kunci (Red & Blue Team)",
            type: "textarea",
            placeholder:
              "e.g., Red Team berhasil eksfiltrasi data melalui DNS. Blue Team mendeteksi 70% serangan awal, tetapi gagal mendeteksi gerakan lateral.",
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Buat draf laporan debriefing latihan gabungan berdasarkan ringkasan: '{EXERCISE_SUMMARY}' dan temuan kunci: '{KEY_FINDINGS}'.\n\nLaporan harus mencakup: Tujuan Latihan, Metodologi, Temuan Kunci (Red Team & Blue Team), Analisis Kesenjangan, dan Rekomendasi untuk Peningkatan.",
        },
      },
      "Pengukuran & Pelaporan Program Keamanan": {
        components: [
          {
            name: "METRIC_FOCUS",
            label: "Fokus Metrik",
            type: "select",
            options: [
              "Efektivitas Deteksi",
              "Waktu Respons Insiden",
              "Cakupan Kontrol Keamanan",
            ],
          },
          {
            name: "CURRENT_DATA",
            label: "Data/Hasil Saat Ini",
            type: "textarea",
            placeholder:
              "e.g., Tingkat deteksi phishing 85%, Waktu rata-rata untuk menahan insiden 4 jam.",
          },
        ],
        komponen_prompt: {
          TUGAS:
            "Berdasarkan fokus metrik '{METRIC_FOCUS}' dan data saat ini: '{CURRENT_DATA}'.\n\nBuat draf bagian laporan yang menjelaskan status program keamanan. Interpretasikan data, identifikasi tren, dan berikan rekomendasi untuk peningkatan. Sajikan dalam format yang mudah dipahami oleh manajemen.",
        },
      },
    },
  },
  komponen_prompt: {
    PERAN:
      "Anda adalah seorang fasilitator Purple Team yang berpengalaman, memahami perspektif ofensif dan defensif.",
    KONTEKS:
      "Pengguna ingin merancang atau mensimulasikan aktivitas kolaboratif antara Red Team dan Blue Team. Tugas yang dipilih adalah: '{PURPLE_TEAM_TASK}'.",
    FORMAT_OUTPUT:
      "Gunakan format Markdown. Sajikan semua perintah, query, atau agenda dalam format yang jelas dan terstruktur. Gunakan blok kode jika sesuai.",
  },
};

const outputPath = path.resolve(
  __dirname,
  "..",
  "src",
  "data",
  "frameworks",
  "Koleksi & Inovasi",
  "Cyber Security",
  "Purple Team Operations.json",
);
fs.writeFileSync(
  outputPath,
  JSON.stringify(purpleTeamFramework, null, 2),
  "utf8",
);

console.log(`File created successfully at ${outputPath}`);
