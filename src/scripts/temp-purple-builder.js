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
