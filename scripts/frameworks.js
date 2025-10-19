"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_ORDER =
  exports.AI_PLATFORMS =
  exports.PROGRAMMING_LANGUAGES =
  exports.PROMPT_FRAMEWORKS =
    void 0;
exports.PROMPT_FRAMEWORKS = {
  "Koleksi & Inovasi": {
    Bisnis: {
      "Keuangan & Investasi": {
        id_kerangka: "BIS-KEU-001",
        nama_kerangka: "Pusat Analisis Keuangan & Investasi",
        version: "1.0.0",
        kategori: ["Bisnis", "Keuangan & Investasi"],
        description:
          "Pusat komando untuk semua kebutuhan analisis keuangan dan investasi, dari strategi jangka panjang hingga analisis saham individual.",
        perspektif_user:
          "Saya butuh alat fleksibel untuk membantu saya dengan berbagai tugas keuangan, seperti merancang rencana investasi, menganalisis saham, membandingkan produk, atau mensimulasikan dana pensiun.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Analis Keuangan yang akan memandu pengguna memilih jenis analisis.",
        components: [
          {
            name: "TUGAS_ANALISIS_KEUANGAN",
            label: "Jenis Analisis Keuangan",
            type: "select",
            options: [
              "Perencanaan Strategi Investasi",
              "Analisis Saham Tunggal",
              "Perbandingan Produk Investasi",
              "Simulasi Proyeksi Dana",
            ],
            default: "Perencanaan Strategi Investasi",
            info: "Pilihan Anda akan menampilkan serangkaian input yang dirancang khusus untuk area tersebut.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_ANALISIS_KEUANGAN",
            options: {
              "Perencanaan Strategi Investasi": [
                {
                  name: "TUJUAN_INVESTASI",
                  label: "Tujuan Investasi Anda",
                  type: "text",
                  placeholder:
                    "Contoh: Mempersiapkan dana pensiun dalam 20 tahun",
                  info: "Tujuan yang spesifik akan menghasilkan rekomendasi yang lebih akurat.",
                },
                {
                  name: "MODAL_AWAL",
                  label: "Modal Awal & Investasi Bulanan",
                  type: "text",
                  placeholder:
                    "Contoh: Modal awal Rp 10.000.000, investasi bulanan Rp 1.000.000",
                  info: "Sebutkan jumlah beserta mata uangnya.",
                },
                {
                  name: "TINGKAT_RISIKO",
                  label: "Toleransi Risiko Anda",
                  type: "select",
                  options: ["Konservatif", "Moderat", "Agresif"],
                  default: "Moderat",
                  info: "Ini akan sangat mempengaruhi jenis instrumen investasi yang akan direkomendasikan.",
                },
                {
                  name: "HORIZON_WAKTU",
                  label: "Horizon Waktu Investasi",
                  type: "text",
                  placeholder: "Contoh: 10 tahun",
                  info: "Jangka waktu (pendek, menengah, panjang) sangat mempengaruhi strategi.",
                },
              ],
              "Analisis Saham Tunggal": [
                {
                  name: "KODE_SAHAM",
                  label: "Kode Ticker atau Nama Saham",
                  type: "text",
                  placeholder: "Contoh: BBCA atau Bank Central Asia",
                  info: "Masukkan kode saham (ticker) atau nama perusahaan yang ingin dianalisis.",
                },
                {
                  name: "FOKUS_ANALISIS_SAHAM",
                  label: "Fokus Analisis",
                  type: "multiselect",
                  options: [
                    "Analisis Fundamental",
                    "Analisis Teknikal",
                    "Sentimen Berita",
                  ],
                  default: ["Analisis Fundamental"],
                  info: "Pilih aspek yang ingin Anda dalami dari saham tersebut.",
                },
              ],
              "Perbandingan Produk Investasi": [
                {
                  name: "PRODUK_A",
                  label: "Nama Produk Investasi Pertama",
                  type: "text",
                  placeholder: "Contoh: Reksa Dana Saham Manulife",
                  info: "Nama produk pertama yang akan dibandingkan.",
                },
                {
                  name: "PRODUK_B",
                  label: "Nama Produk Investasi Kedua",
                  type: "text",
                  placeholder: "Contoh: Reksa Dana Indeks Batavia",
                  info: "Nama produk kedua yang akan dibandingkan.",
                },
                {
                  name: "METRIK_PERBANDINGAN",
                  label: "Metrik Perbandingan",
                  type: "multiselect",
                  options: [
                    "Imbal Hasil (1th, 3th, 5th)",
                    "Tingkat Risiko (Volatility)",
                    "Biaya Manajemen",
                    "Minimum Investasi",
                  ],
                  default: [
                    "Imbal Hasil (1th, 3th, 5th)",
                    "Tingkat Risiko (Volatility)",
                  ],
                  info: "Pilih kriteria yang ingin Anda gunakan untuk membandingkan.",
                },
              ],
              "Simulasi Proyeksi Dana": [
                {
                  name: "TARGET_DANA",
                  label: "Target Dana di Masa Depan",
                  type: "number",
                  placeholder: "1000000000",
                  unit: "Rp",
                  info: "Jumlah total dana yang ingin Anda capai.",
                },
                {
                  name: "SALDO_SAAT_INI",
                  label: "Saldo Investasi Saat Ini",
                  type: "number",
                  placeholder: "50000000",
                  unit: "Rp",
                  info: "Jumlah dana yang sudah Anda miliki saat ini.",
                },
                {
                  name: "INVESTASI_BULANAN",
                  label: "Investasi Rutin per Bulan",
                  type: "number",
                  placeholder: "1000000",
                  unit: "Rp",
                  info: "Jumlah yang akan Anda tambahkan setiap bulan.",
                },
                {
                  name: "ASUMSI_RETURN",
                  label: "Asumsi Imbal Hasil Tahunan (%)",
                  type: "slider",
                  min: 1,
                  max: 25,
                  step: 1,
                  default: 8,
                  info: "Perkiraan rata-rata keuntungan investasi Anda per tahun.",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN:
            "Anda adalah seorang Analis Keuangan dan Perencana Investasi profesional.",
          KONTEKS:
            "Seorang klien meminta bantuan analisis keuangan. Tugas yang dipilih adalah: '{TUGAS_ANALISIS_KEUANGAN}'.",
          TUGAS:
            "Berdasarkan tugas yang dipilih, berikan output yang sesuai:\n\n- **Jika 'Perencanaan Strategi Investasi'**: Buat proposal strategi investasi komprehensif berdasarkan tujuan '{TUJUAN_INVESTASI}', modal '{MODAL_AWAL}', risiko '{TINGKAT_RISIKO}', dan horizon '{HORIZON_WAKTU}'. Sertakan alokasi aset, contoh instrumen, dan justifikasi.\n- **Jika 'Analisis Saham Tunggal'**: Lakukan analisis pada saham '{KODE_SAHAM}' dengan fokus pada '{FOKUS_ANALISIS_SAHAM}'. Sajikan laporan yang mencakup valuasi kunci, tren harga, sentimen berita, serta potensi kelebihan dan kekurangan.\n- **Jika 'Perbandingan Produk Investasi'**: Buat tabel perbandingan antara '{PRODUK_A}' dan '{PRODUK_B}' berdasarkan metrik '{METRIK_PERBANDINGAN}'. Berikan ringkasan perbandingan di akhir.\n- **Jika 'Simulasi Proyeksi Dana'**: Hitung proyeksi untuk mencapai target '{TARGET_DANA}' dengan saldo awal '{SALDO_SAAT_INI}', investasi bulanan '{INVESTASI_BULANAN}', dan asumsi return '{ASUMSI_RETURN}%'. Tampilkan perkiraan waktu yang dibutuhkan dan berikan saran jika perlu.",
          "FORMAT OUTPUT":
            "Gunakan format Markdown. Sajikan dalam bentuk laporan yang terstruktur dengan judul yang jelas untuk setiap bagian. Gunakan daftar berpoin atau tabel untuk mempermudah pembacaan.",
        },
        toolType: "text",
        konteks_tambahan_instruksi_khusus:
          "Selalu berikan disclaimer bahwa semua investasi mengandung risiko dan kinerja masa lalu tidak mencerminkan hasil di masa depan. Gunakan bahasa yang profesional namun mudah dimengerti.",
        contoh_kalimat: "Bantu saya menganalisis saham BBCA.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
      "Akselerator Perencanaan Startup": {
        id_kerangka: "BIS-STP-001",
        nama_kerangka: "Akselerator Perencanaan Startup",
        version: "1.0.0",
        kategori: ["Bisnis", "Startup"],
        description:
          "Co-founder AI strategis untuk memandu wirausahawan melalui tahapan krusial membangun bisnis, dari ide hingga pitch deck.",
        perspektif_user:
          "Saya butuh bantuan terstruktur untuk setiap tahap memulai bisnis, mulai dari mencari ide, menganalisis pasar, hingga membuat materi untuk investor.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang ahli strategi startup yang akan memandu pengguna memilih tugas perencanaan.",
        components: [
          {
            name: "TUGAS_PERENCANAAN_STARTUP",
            label: "Tugas Perencanaan Startup",
            type: "select",
            options: [
              "Generator Ide Bisnis",
              "Penyusun Model Bisnis Kanvas",
              "Analisis Persaingan dan Pasar",
              "Pembuat Draf Konten Pitch Deck",
            ],
            default: "Generator Ide Bisnis",
            info: "Pilih tugas yang paling relevan dengan tahap Anda saat ini.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_PERENCANAAN_STARTUP",
            options: {
              "Generator Ide Bisnis": [
                {
                  name: "INDUSTRI_STARTUP",
                  label: "Industri atau Sektor",
                  type: "text",
                  placeholder:
                    "Contoh: Teknologi Pendidikan, Makanan & Minuman",
                  info: "Sebutkan industri yang Anda minati.",
                },
                {
                  name: "MASALAH_STARTUP",
                  label: "Masalah Spesifik yang Ingin Dipecahkan",
                  type: "text",
                  placeholder: "Contoh: Sulitnya mencari mentor berkualitas",
                  info: "Masalah apa yang ingin Anda selesaikan dengan bisnis ini?",
                },
              ],
              "Penyusun Model Bisnis Kanvas": [
                {
                  name: "BMC_PROPOSISI_NILAI",
                  label: "Proposisi Nilai (Value Propositions)",
                  type: "textarea",
                  placeholder:
                    "Contoh: Platform mentor on-demand yang terjangkau dan terverifikasi.",
                  info: "Apa nilai unik yang Anda tawarkan kepada pelanggan?",
                },
                {
                  name: "BMC_SEGMEN_PELANGGAN",
                  label: "Segmen Pelanggan (Customer Segments)",
                  type: "textarea",
                  placeholder:
                    "Contoh: Mahasiswa tingkat akhir dan profesional muda.",
                  info: "Siapa target pelanggan utama Anda?",
                },
              ],
              "Analisis Persaingan dan Pasar": [
                {
                  name: "ANALISIS_DESKRIPSI_BISNIS",
                  label: "Deskripsi Singkat Bisnis Anda",
                  type: "textarea",
                  placeholder:
                    "Contoh: Platform marketplace untuk menghubungkan mentor dengan mentee.",
                  info: "Jelaskan bisnis Anda secara singkat untuk analisis.",
                },
                {
                  name: "ANALISIS_KOMPETITOR",
                  label: "Nama 2-3 Kompetitor Utama",
                  type: "text",
                  placeholder: "Contoh: Top-Mentor, Mentor.io",
                  info: "Sebutkan pemain utama lain di pasar Anda.",
                },
              ],
              "Pembuat Draf Konten Pitch Deck": [
                {
                  name: "PITCH_NAMA_STARTUP",
                  label: "Nama Startup",
                  type: "text",
                  placeholder: "Contoh: MentorConnect",
                  info: "Nama startup Anda untuk pitch deck.",
                },
                {
                  name: "PITCH_MASALAH_SOLUSI",
                  label: "Masalah dan Solusi",
                  type: "textarea",
                  placeholder:
                    "Masalah: Mahasiswa sulit menemukan mentor yang sesuai. Solusi: Aplikasi kami menggunakan AI untuk mencocokkan mereka secara instan.",
                  info: "Jelaskan masalah yang ada dan bagaimana startup Anda menyelesaikannya.",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN: "Anda adalah seorang ahli strategi startup dan co-founder AI.",
          KONTEKS:
            "Pengguna memerlukan bantuan untuk tahap '{TUGAS_PERENCANAAN_STARTUP}' dari perjalanan startup mereka.",
          TUGAS:
            "Berdasarkan tugas yang dipilih, berikan output yang sesuai:\n\n- **Jika 'Generator Ide Bisnis'**: Berikan 3 ide startup unik di industri '{INDUSTRI_STARTUP}' yang menyelesaikan masalah '{MASALAH_STARTUP}'. Sertakan usulan nama, proposisi nilai, dan langkah validasi awal.\n- **Jika 'Penyusun Model Bisnis Kanvas'**: Buat draf Business Model Canvas berdasarkan proposisi nilai '{BMC_PROPOSISI_NILAI}' dan segmen pelanggan '{BMC_SEGMEN_PELANGGAN}'. Isi blok lainnya dengan asumsi yang cerdas dan berikan saran perbaikan.\n- **Jika 'Analisis Persaingan dan Pasar'**: Lakukan analisis SWOT untuk bisnis '{ANALISIS_DESKRIPSI_BISNIS}' dan analisis singkat kompetitor '{ANALISIS_KOMPETITOR}'.\n- **Jika 'Pembuat Draf Konten Pitch Deck'**: Buat draf konten terstruktur untuk 10 slide pitch deck untuk startup '{PITCH_NAMA_STARTUP}' yang menyelesaikan '{PITCH_MASALAH_SOLUSI}'.",
          "FORMAT OUTPUT":
            "Gunakan format Markdown. Sajikan dalam bentuk laporan atau dokumen yang terstruktur dengan judul dan sub-judul yang jelas.",
        },
        toolType: "text",
        konteks_tambahan_instruksi_khusus:
          "Selalu gunakan pendekatan yang praktis dan berorientasi pada tindakan. Berikan saran yang realistis untuk startup tahap awal.",
        contoh_kalimat:
          "Bantu saya membuat model bisnis kanvas untuk ide startup saya.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
      "Pusat Analisis Data Bisnis": {
        id_kerangka: "BIS-DAT-001",
        nama_kerangka: "Pusat Analisis Data Bisnis",
        version: "1.0.0",
        kategori: ["Bisnis", "Analisis Data"],
        description:
          "Analis data virtual untuk mengekstrak wawasan bisnis berharga dari data mentah, dari eksplorasi hingga visualisasi.",
        perspektif_user:
          "Saya punya data penjualan tapi tidak tahu harus mulai dari mana untuk menganalisisnya. Saya butuh bantuan untuk memahami data, menemukan tren, dan mendapatkan saran visualisasi.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Analis Data yang akan memandu pengguna non-teknis untuk memahami dan mendapatkan wawasan.",
        components: [
          {
            name: "TUGAS_ANALISIS_DATA",
            label: "Tugas Analisis Data",
            type: "select",
            options: [
              "Eksplorasi & Pembersihan Data",
              "Analisis Statistik Deskriptif",
              "Identifikasi Tren dan Pola",
              "Rekomendasi Visualisasi Data",
            ],
            default: "Identifikasi Tren dan Pola",
            info: "Pilih jenis analisis yang ingin Anda lakukan.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_ANALISIS_DATA",
            options: {
              "Eksplorasi & Pembersihan Data": [
                {
                  name: "DATA_SAMPEL_EKSPLORASI",
                  label: "Tempelkan Sampel Data Anda",
                  type: "textarea",
                  placeholder:
                    "Contoh: salin beberapa baris dari file CSV atau Excel Anda di sini.",
                  info: "Berikan sampel data untuk dianalisis kesehatannya.",
                },
              ],
              "Analisis Statistik Deskriptif": [
                {
                  name: "DATA_SAMPEL_STATISTIK",
                  label: "Tempelkan Sampel Data Anda",
                  type: "textarea",
                  placeholder: "Contoh: salin data numerik Anda di sini.",
                  info: "Data untuk dihitung statistik dasarnya.",
                },
                {
                  name: "KOLOM_STATISTIK",
                  label: "Nama Kolom yang Dianalisis",
                  type: "text",
                  placeholder:
                    "Contoh: Kolom 'Pendapatan' dan 'Usia Pelanggan'",
                  info: "Sebutkan kolom mana yang ingin Anda hitung statistiknya.",
                },
              ],
              "Identifikasi Tren dan Pola": [
                {
                  name: "DATA_SAMPEL_TREN",
                  label: "Tempelkan Sampel Data Anda",
                  type: "textarea",
                  placeholder:
                    "Contoh: salin data time-series atau data kategorikal Anda.",
                  info: "Data yang akan dianalisis untuk menemukan pola.",
                },
                {
                  name: "PERTANYAAN_BISNIS_TREN",
                  label: "Pertanyaan Bisnis yang Ingin Dijawab",
                  type: "text",
                  placeholder:
                    "Contoh: Bagaimana tren penjualan produk A selama 6 bulan terakhir?",
                  info: "Pertanyaan spesifik akan mengarahkan analisis.",
                },
              ],
              "Rekomendasi Visualisasi Data": [
                {
                  name: "DATA_VISUALISASI",
                  label: "Jelaskan Data yang Ingin Divisualisasikan",
                  type: "textarea",
                  placeholder:
                    "Contoh: Saya punya data penjualan bulanan per kategori produk.",
                  info: "Deskripsi data Anda.",
                },
                {
                  name: "PESAN_VISUALISASI",
                  label: "Pesan Utama yang Ingin Disampaikan",
                  type: "text",
                  placeholder:
                    "Contoh: Saya ingin menunjukkan kategori produk mana yang paling cepat bertumbuh.",
                  info: "Apa cerita yang ingin Anda sampaikan dengan data ini?",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN: "Anda adalah seorang Analis Data Bisnis yang terampil.",
          KONTEKS:
            "Pengguna ingin menganalisis data mereka dan telah memilih tugas: '{TUGAS_ANALISIS_DATA}'.",
          TUGAS:
            "Berdasarkan tugas yang dipilih, berikan output yang sesuai:\n\n- **Jika 'Eksplorasi & Pembersihan Data'**: Analisis sampel data '{DATA_SAMPEL_EKSPLORASI}'. Berikan ringkasan profil data, identifikasi masalah (data hilang, duplikat), dan sarankan langkah pembersihan.\n- **Jika 'Analisis Statistik Deskriptif'**: Hitung statistik dasar (rata-rata, median, min, max) dari kolom '{KOLOM_STATISTIK}' pada data '{DATA_SAMPEL_STATISTIK}' dan berikan interpretasi bisnisnya.\n- **Jika 'Identifikasi Tren dan Pola'**: Jawab pertanyaan bisnis '{PERTANYAAN_BISNIS_TREN}' dengan menganalisis data '{DATA_SAMPEL_TREN}'. Soroti tren, pola, atau korelasi yang signifikan.\n- **Jika 'Rekomendasi Visualisasi Data'**: Berdasarkan deskripsi data '{DATA_VISUALISASI}' dan pesan '{PESAN_VISUALISASI}', rekomendasikan 2-3 jenis grafik yang paling efektif dan jelaskan alasannya.",
          "FORMAT OUTPUT":
            "Gunakan format Markdown. Sajikan analisis dalam format laporan yang jelas dengan poin-poin dan penjelasan yang mudah dimengerti.",
        },
        toolType: "text",
        konteks_tambahan_instruksi_khusus:
          "Fokus pada penyajian wawasan dalam bahasa bisnis yang sederhana, bukan jargon teknis data science.",
        contoh_kalimat:
          "Bantu saya menemukan tren dari data penjualan bulanan saya.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
      "Konsultan Dokumen & Kepatuhan Hukum": {
        id_kerangka: "BIS-LGL-001",
        nama_kerangka: "Konsultan Dokumen & Kepatuhan Hukum",
        version: "1.0.0",
        kategori: ["Bisnis", "Legal"],
        description:
          "Asisten legal virtual untuk kebutuhan bisnis sehari-hari, dari draf perjanjian hingga checklist kepatuhan.",
        perspektif_user:
          "Saya butuh bantuan untuk membuat draf dokumen legal umum atau memahami istilah hukum tanpa harus langsung ke pengacara untuk draf pertama.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang asisten legal virtual yang akan membantu pengguna membuat draf dokumen umum dan memahami konsep hukum bisnis.",
        components: [
          {
            name: "TUGAS_BANTUAN_HUKUM",
            label: "Jenis Bantuan Hukum",
            type: "select",
            options: [
              "Pembuat Draf Perjanjian Dasar",
              "Generator Kebijakan Privasi & Syarat Layanan",
              "Penerjemah Istilah Hukum",
              "Checklist Kepatuhan Bisnis",
            ],
            default: "Pembuat Draf Perjanjian Dasar",
            info: "Pilih tugas legal yang Anda butuhkan.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_BANTUAN_HUKUM",
            options: {
              "Pembuat Draf Perjanjian Dasar": [
                {
                  name: "JENIS_PERJANJIAN",
                  label: "Jenis Perjanjian",
                  type: "select",
                  options: [
                    "Perjanjian Kerja (PKWT)",
                    "Perjanjian Kerahasiaan (NDA)",
                    "Surat Perjanjian Kerja Sama (MoU)",
                  ],
                  default: "Perjanjian Kerja (PKWT)",
                  info: "Pilih jenis dokumen yang ingin Anda buat drafnya.",
                },
                {
                  name: "PIHAK_PERTAMA",
                  label: "Nama Pihak Pertama",
                  type: "text",
                  placeholder: "Contoh: PT Jaya Abadi",
                  info: "Nama perusahaan atau individu pihak pertama.",
                },
                {
                  name: "PIHAK_KEDUA",
                  label: "Nama Pihak Kedua",
                  type: "text",
                  placeholder: "Contoh: John Doe",
                  info: "Nama perusahaan atau individu pihak kedua.",
                },
              ],
              "Generator Kebijakan Privasi & Syarat Layanan": [
                {
                  name: "NAMA_WEBSITE_APP",
                  label: "Nama Website atau Aplikasi Anda",
                  type: "text",
                  placeholder: "Contoh: Aplikasi 'BelajarKuy'",
                  info: "Nama layanan Anda untuk dicantumkan dalam kebijakan.",
                },
                {
                  name: "JENIS_DATA_PENGGUNA",
                  label: "Jenis Data Pengguna yang Dikumpulkan",
                  type: "textarea",
                  placeholder:
                    "Contoh: Nama, email, nomor telepon, data lokasi, riwayat pembelian.",
                  info: "Sebutkan semua jenis data pribadi yang Anda kumpulkan dari pengguna.",
                },
              ],
              "Penerjemah Istilah Hukum": [
                {
                  name: "ISTILAH_HUKUM",
                  label: "Istilah atau Klausul Hukum",
                  type: "textarea",
                  placeholder:
                    "Contoh: Apa arti dari klausul 'force majeure'? atau salin-tempel satu klausul penuh di sini.",
                  info: "Masukkan istilah atau klausul yang ingin Anda pahami.",
                },
              ],
              "Checklist Kepatuhan Bisnis": [
                {
                  name: "BENTUK_BADAN_USAHA",
                  label: "Bentuk Badan Usaha",
                  type: "select",
                  options: ["PT Perorangan", "CV", "Firma", "UMKM Perorangan"],
                  default: "UMKM Perorangan",
                  info: "Pilih bentuk badan usaha Anda.",
                },
                {
                  name: "BIDANG_USAHA",
                  label: "Bidang Usaha",
                  type: "text",
                  placeholder: "Contoh: Kafe, Toko Online, Jasa Konsultasi IT",
                  info: "Sebutkan bidang usaha spesifik Anda.",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN:
            "Anda adalah seorang asisten legal virtual yang terampil dalam penyusunan dokumen.",
          KONTEKS:
            "Pengguna memerlukan bantuan untuk tugas '{TUGAS_BANTUAN_HUKUM}'. Penting untuk diingat bahwa output yang Anda berikan adalah draf awal dan bukan nasihat hukum formal.",
          TUGAS:
            "Berdasarkan tugas yang dipilih, berikan output yang sesuai:\n\n- **Jika 'Pembuat Draf Perjanjian Dasar'**: Buat draf '{JENIS_PERJANJIAN}' antara '{PIHAK_PERTAMA}' dan '{PIHAK_KEDUA}'. Gunakan klausul-klausul standar yang umum dan sertakan placeholder untuk detail spesifik.\n- **Jika 'Generator Kebijakan Privasi & Syarat Layanan'**: Buat draf Kebijakan Privasi dan Syarat & Ketentuan untuk '{NAMA_WEBSITE_APP}' yang mengumpulkan data seperti '{JENIS_DATA_PENGGUNA}'.\n- **Jika 'Penerjemah Istilah Hukum'**: Jelaskan istilah atau klausul '{ISTILAH_HUKUM}' dalam bahasa bisnis yang sederhana dan berikan contoh implikasi praktisnya.\n- **Jika 'Checklist Kepatuhan Bisnis'**: Buat checklist umum mengenai izin dan pendaftaran yang mungkin diperlukan untuk '{BENTUK_BADAN_USAHA}' di bidang '{BIDANG_USAHA}' di Indonesia.",
          "FORMAT OUTPUT":
            "Gunakan format Markdown. Untuk draf dokumen, gunakan struktur yang jelas dengan judul, pasal, dan ayat. Selalu awali output dengan disclaimer bahwa ini adalah draf dan perlu ditinjau oleh ahli hukum.",
        },
        toolType: "text",
        konteks_tambahan_instruksi_khusus:
          "Disclaimer hukum adalah yang paling penting. Pastikan setiap output menekankan bahwa ini bukan pengganti nasihat pengacara profesional.",
        contoh_kalimat: "Bantu saya membuat draf Perjanjian Kerahasiaan (NDA).",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
      "Studio Desain UI/UX": {
        id_kerangka: "BIS-UIX-001",
        nama_kerangka: "Studio Desain UI/UX",
        version: "1.0.0",
        kategori: ["Bisnis", "UI/UX"],
        description:
          "Konsultan desain produk digital untuk merencanakan pengalaman dan antarmuka pengguna yang efektif, dari alur pengguna hingga konsep visual.",
        perspektif_user:
          "Saya perlu bantuan untuk merancang aplikasi saya, mulai dari bagaimana pengguna akan memakainya, seperti apa tampilan halamannya, hingga teks yang harus ditulis di tombol.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Konsultan Desain UI/UX yang akan membantu pengguna memetakan alur, merancang struktur halaman, dan menulis teks antarmuka.",
        components: [
          {
            name: "TUGAS_DESAIN_UIUX",
            label: "Tugas Desain UI/UX",
            type: "select",
            options: [
              "Perancangan Alur Pengguna (User Flow)",
              "Generator Konsep Tata Letak (Wireframe)",
              "Analisis & Umpan Balik Desain",
              "Generator Teks Antarmuka (UX Writing)",
            ],
            default: "Perancangan Alur Pengguna (User Flow)",
            info: "Pilih jenis bantuan desain yang Anda perlukan.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_DESAIN_UIUX",
            options: {
              "Perancangan Alur Pengguna (User Flow)": [
                {
                  name: "FLOW_TUGAS_PENGGUNA",
                  label: "Tugas Utama Pengguna",
                  type: "text",
                  placeholder: "Contoh: Melakukan pendaftaran akun baru",
                  info: "Jelaskan tugas yang ingin Anda petakan alurnya.",
                },
                {
                  name: "FLOW_TITIK_AWAL_AKHIR",
                  label: "Titik Awal dan Akhir Alur",
                  type: "text",
                  placeholder:
                    "Contoh: Dari halaman utama hingga halaman 'selamat datang'",
                  info: "Sebutkan dari mana alur dimulai dan di mana berakhir.",
                },
              ],
              "Generator Konsep Tata Letak (Wireframe)": [
                {
                  name: "WIREFRAME_JENIS_HALAMAN",
                  label: "Jenis Halaman/Layar",
                  type: "text",
                  placeholder: "Contoh: Halaman Beranda, Layar Login",
                  info: "Sebutkan halaman yang ingin dibuatkan konsep tata letaknya.",
                },
                {
                  name: "WIREFRAME_ELEMEN_KUNCI",
                  label: "Elemen-elemen Kunci",
                  type: "textarea",
                  placeholder:
                    "Contoh: Logo, Tombol Login, Banner Promo, Daftar Produk",
                  info: "Sebutkan semua elemen yang wajib ada di halaman tersebut.",
                },
              ],
              "Analisis & Umpan Balik Desain": [
                {
                  name: "ANALISIS_DESKRIPSI_DESAIN",
                  label: "Deskripsi atau Link ke Desain Anda",
                  type: "textarea",
                  placeholder:
                    "Jelaskan desain Anda saat ini atau tempelkan link ke gambar (misal: Imgur).",
                  info: "Berikan konteks sebanyak mungkin tentang desain yang ingin dianalisis.",
                },
                {
                  name: "ANALISIS_TUJUAN_DESAIN",
                  label: "Tujuan Utama Halaman/Desain",
                  type: "text",
                  placeholder:
                    "Contoh: Meyakinkan pengguna untuk menekan tombol 'Daftar Gratis'",
                  info: "Apa aksi terpenting yang diharapkan dari pengguna di halaman ini?",
                },
              ],
              "Generator Teks Antarmuka (UX Writing)": [
                {
                  name: "UXWRITING_KONTEKS",
                  label: "Konteks dan Elemen UI",
                  type: "text",
                  placeholder:
                    "Contoh: Pesan error untuk form login, Teks untuk tombol konfirmasi",
                  info: "Jelaskan di mana teks ini akan muncul.",
                },
                {
                  name: "UXWRITING_TONE",
                  label: "Nada Suara (Tone of Voice)",
                  type: "select",
                  options: ["Formal", "Ramah", "Jenaka", "Profesional"],
                  default: "Ramah",
                  info: "Pilih gaya bahasa yang sesuai dengan brand Anda.",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN: "Anda adalah seorang Konsultan Desain Produk Digital (UI/UX)",
          KONTEKS:
            "Pengguna memerlukan bantuan dengan '{TUGAS_DESAIN_UIUX}' untuk produk digital mereka.",
          TUGAS:
            "Berdasarkan tugas yang dipilih, berikan output yang sesuai:\n\n- **Jika 'Perancangan Alur Pengguna (User Flow)'**: Petakan alur langkah-demi-langkah untuk tugas '{FLOW_TUGAS_PENGGUNA}' dari '{FLOW_TITIK_AWAL_AKHIR}'. Identifikasi potensi masalah dan berikan saran penyederhanaan.\n- **Jika 'Generator Konsep Tata Letak (Wireframe)'**: Buat deskripsi tekstual konsep wireframe untuk '{WIREFRAME_JENIS_HALAMAN}' yang mengandung elemen '{WIREFRAME_ELEMEN_KUNCI}'. Jelaskan alasan di balik penempatan elemen.\n- **Jika 'Analisis & Umpan Balik Desain'**: Berikan kritik membangun untuk desain '{ANALISIS_DESKRIPSI_DESAIN}' yang bertujuan untuk '{ANALISIS_TUJUAN_DESAIN}'. Gunakan prinsip usability sebagai dasar analisis.\n- **Jika 'Generator Teks Antarmuka (UX Writing)'**: Buat 3 alternatif teks untuk '{UXWRITING_KONTEKS}' dengan nada '{UXWRITING_TONE}'. Jelaskan kelebihan masing-masing alternatif.",
          "FORMAT OUTPUT":
            "Gunakan format Markdown. Sajikan output secara terstruktur, jelas, dan mudah ditindaklanjuti. Gunakan daftar berpoin atau bernomor untuk alur dan analisis.",
        },
        toolType: "text",
        konteks_tambahan_instruksi_khusus:
          "Fokus pada pengguna. Semua saran dan output harus bertujuan untuk membuat pengalaman pengguna lebih mudah, lebih jelas, dan lebih menyenangkan.",
        contoh_kalimat:
          "Bantu saya membuat konsep tata letak untuk halaman beranda website saya.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
      "Manajer Produk Virtual": {
        id_kerangka: "BIS-PRD-001",
        nama_kerangka: "Manajer Produk Virtual",
        version: "1.0.0",
        kategori: ["Bisnis", "Manajemen Produk"],
        description:
          "Partner strategis AI untuk manajer produk, membantu dalam penulisan PRD, penyusunan roadmap, dan prioritas fitur.",
        perspektif_user:
          "Sebagai manajer produk, saya butuh bantuan untuk menyusun dokumen persyaratan, membuat roadmap, dan memprioritaskan pekerjaan tim secara efisien.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Manajer Produk senior yang akan membantu pengguna menstrukturkan dan memprioritaskan pekerjaan pengembangan.",
        components: [
          {
            name: "TUGAS_MANAJEMEN_PRODUK",
            label: "Tugas Manajemen Produk",
            type: "select",
            options: [
              "Penulis Dokumen Persyaratan Produk (PRD)",
              "Generator Peta Jalan Produk (Roadmap)",
              "Asisten Prioritas Fitur",
              "Penulis Cerita Pengguna (User Story)",
            ],
            default: "Penulis Dokumen Persyaratan Produk (PRD)",
            info: "Pilih tugas manajemen produk yang ingin Anda selesaikan.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_MANAJEMEN_PRODUK",
            options: {
              "Penulis Dokumen Persyaratan Produk (PRD)": [
                {
                  name: "PRD_NAMA_FITUR",
                  label: "Nama Fitur atau Produk",
                  type: "text",
                  placeholder: "Contoh: Fitur 'Kolaborasi Tim Real-time'",
                  info: "Fitur yang akan dibuatkan dokumen persyaratannya.",
                },
                {
                  name: "PRD_MASALAH_PENGGUNA",
                  label: "Masalah Pengguna yang Diselesaikan",
                  type: "textarea",
                  placeholder:
                    "Contoh: Tim yang bekerja remote kesulitan untuk berdiskusi secara sinkron.",
                  info: "Jelaskan masalah yang ingin Anda pecahkan dengan fitur ini.",
                },
              ],
              "Generator Peta Jalan Produk (Roadmap)": [
                {
                  name: "ROADMAP_VISI_PRODUK",
                  label: "Visi Produk (Jangka Panjang)",
                  type: "text",
                  placeholder:
                    "Contoh: Menjadi platform kolaborasi nomor satu untuk tim kreatif.",
                  info: "Apa tujuan besar dari produk Anda?",
                },
                {
                  name: "ROADMAP_TUJUAN_BISNIS",
                  label: "Tujuan Bisnis untuk 3-6 Bulan ke Depan",
                  type: "textarea",
                  placeholder:
                    "Contoh: Meningkatkan retensi pengguna sebesar 15%",
                  info: "Apa target bisnis yang ingin dicapai dalam waktu dekat?",
                },
              ],
              "Asisten Prioritas Fitur": [
                {
                  name: "PRIORITAS_DAFTAR_FITUR",
                  label: "Daftar Fitur (pisahkan dengan koma)",
                  type: "textarea",
                  placeholder: "Contoh: Fitur A, Fitur B, Fitur C",
                  info: "Masukkan daftar fitur yang perlu diprioritaskan.",
                },
                {
                  name: "PRIORITAS_KERANGKA",
                  label: "Kerangka Prioritas",
                  type: "select",
                  options: [
                    "RICE (Reach, Impact, Confidence, Effort)",
                    "MoSCoW (Must, Should, Could, Won't)",
                  ],
                  default: "RICE (Reach, Impact, Confidence, Effort)",
                  info: "Pilih metode untuk membantu prioritas.",
                },
              ],
              "Penulis Cerita Pengguna (User Story)": [
                {
                  name: "USERSTORY_DESKRIPSI_FITUR",
                  label: "Deskripsi Singkat Fitur",
                  type: "textarea",
                  placeholder:
                    "Contoh: Pengguna ingin bisa memfilter produk berdasarkan warna agar lebih cepat menemukan barang.",
                  info: "Jelaskan kebutuhan dari sudut pandang pengguna.",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN:
            "Anda adalah seorang Manajer Produk (Product Manager) AI yang strategis.",
          KONTEKS:
            "Pengguna memerlukan bantuan dengan tugas '{TUGAS_MANAJEMEN_PRODUK}'.",
          TUGAS:
            "Berdasarkan tugas yang dipilih, berikan output yang sesuai:\n\n- **Jika 'Penulis Dokumen Persyaratan Produk (PRD)'**: Buat draf PRD untuk fitur '{PRD_NAMA_FITUR}' yang menyelesaikan masalah '{PRD_MASALAH_PENGGUNA}'. Sertakan bagian Latar Belakang, Tujuan, Target Pengguna, dan Persyaratan Fungsional.\n- **Jika 'Generator Peta Jalan Produk (Roadmap)'**: Buat draf roadmap berbasis teks per kuartal berdasarkan visi '{ROADMAP_VISI_PRODUK}' dan tujuan '{ROADMAP_TUJUAN_BISNIS}'.\n- **Jika 'Asisten Prioritas Fitur'**: Prioritaskan daftar fitur '{PRIORITAS_DAFTAR_FITUR}' menggunakan kerangka '{PRIORITAS_KERANGKA}' dan sajikan dalam bentuk tabel dengan justifikasi.\n- **Jika 'Penulis Cerita Pengguna (User Story)'**: Ubah deskripsi '{USERSTORY_DESKRIPSI_FITUR}' menjadi format User Story yang benar ('Sebagai seorang..., saya ingin..., agar...') lengkap dengan beberapa contoh Kriteria Penerimaan (Acceptance Criteria).",
          "FORMAT OUTPUT":
            "Gunakan format Markdown. Sajikan output dalam format dokumen yang terstruktur, profesional, dan mudah ditindaklanjuti.",
        },
        toolType: "text",
        konteks_tambahan_instruksi_khusus:
          "Fokus pada kejelasan, kelengkapan informasi, dan keselarasan antara masalah pengguna dengan solusi yang diusulkan.",
        contoh_kalimat: "Bantu saya membuat PRD untuk fitur kolaborasi baru.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
      "Asisten Rekrutmen & SDM": {
        id_kerangka: "BIS-HR-001",
        nama_kerangka: "Asisten Rekrutmen & SDM",
        version: "1.0.0",
        kategori: ["Bisnis", "SDM"],
        description:
          "Asisten personalia untuk menyederhanakan tugas rekrutmen dan SDM, dari deskripsi pekerjaan hingga rencana onboarding.",
        perspektif_user:
          "Saya perlu bantuan untuk tugas-tugas HR seperti membuat lowongan kerja yang menarik, menyiapkan pertanyaan wawancara yang bagus, dan merancang proses orientasi untuk karyawan baru.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis SDM yang akan membantu pengguna menyusun dokumen dan rencana rekrutmen.",
        components: [
          {
            name: "TUGAS_SDM",
            label: "Tugas Rekrutmen atau SDM",
            type: "select",
            options: [
              "Pembuat Deskripsi Pekerjaan",
              "Generator Pertanyaan Wawancara",
              "Penyusun Rencana Onboarding",
              "Pembuat Draf Email Rekrutmen",
            ],
            default: "Pembuat Deskripsi Pekerjaan",
            info: "Pilih tugas SDM yang ingin Anda kerjakan.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_SDM",
            options: {
              "Pembuat Deskripsi Pekerjaan": [
                {
                  name: "HR_POSISI_JABATAN",
                  label: "Posisi Jabatan dan Level",
                  type: "text",
                  placeholder: "Contoh: Senior Graphic Designer",
                  info: "Sebutkan jabatan yang sedang dibuka.",
                },
                {
                  name: "HR_TANGGUNG_JAWAB",
                  label: "3-5 Tanggung Jawab Utama",
                  type: "textarea",
                  placeholder:
                    "- Membuat desain untuk media sosial\n- Mengembangkan konsep visual untuk kampanye",
                  info: "Sebutkan poin-poin tanggung jawab terpenting.",
                },
              ],
              "Generator Pertanyaan Wawancara": [
                {
                  name: "HR_POSISI_WAWANCARA",
                  label: "Posisi Jabatan",
                  type: "text",
                  placeholder: "Contoh: Customer Service, Software Engineer",
                  info: "Posisi yang akan diwawancarai.",
                },
                {
                  name: "HR_SOFT_SKILL",
                  label: "Soft Skill yang Dicari",
                  type: "text",
                  placeholder:
                    "Contoh: Kemampuan memecahkan masalah, kolaborasi tim",
                  info: "Karakteristik perilaku yang penting untuk posisi ini.",
                },
              ],
              "Penyusun Rencana Onboarding": [
                {
                  name: "HR_POSISI_ONBOARDING",
                  label: "Posisi Jabatan Karyawan Baru",
                  type: "text",
                  placeholder: "Contoh: Junior Accountant",
                  info: "Posisi karyawan yang akan menjalani orientasi.",
                },
                {
                  name: "HR_TUJUAN_30_HARI",
                  label: "Tujuan Utama untuk 30 Hari Pertama",
                  type: "text",
                  placeholder:
                    "Contoh: Memahami alur kerja tim dan berhasil menangani 5 klien kecil.",
                  info: "Apa target utama yang harus dicapai karyawan baru di bulan pertama?",
                },
              ],
              "Pembuat Draf Email Rekrutmen": [
                {
                  name: "HR_JENIS_EMAIL",
                  label: "Jenis Email",
                  type: "select",
                  options: [
                    "Undangan Wawancara",
                    "Surat Penolakan Kandidat",
                    "Surat Penawaran Kerja",
                  ],
                  default: "Undangan Wawancara",
                  info: "Pilih templat email yang Anda butuhkan.",
                },
                {
                  name: "HR_NAMA_KANDIDAT",
                  label: "Nama Kandidat",
                  type: "text",
                  placeholder: "Contoh: Budi Santoso",
                  info: "Nama kandidat untuk personalisasi email.",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN:
            "Anda adalah seorang Spesialis SDM (Human Resources) yang berpengalaman.",
          KONTEKS: "Pengguna memerlukan bantuan untuk tugas '{TUGAS_SDM}'.",
          TUGAS:
            "Berdasarkan tugas yang dipilih, berikan output yang sesuai:\n\n- **Jika 'Pembuat Deskripsi Pekerjaan'**: Buat draf deskripsi pekerjaan yang lengkap untuk posisi '{HR_POSISI_JABATAN}' dengan tanggung jawab utama '{HR_TANGGUNG_JAWAB}'. Sertakan bagian Kualifikasi dan paragraf 'Tentang Kami' yang menarik.\n- **Jika 'Generator Pertanyaan Wawancara'**: Buat daftar pertanyaan wawancara yang terstruktur untuk posisi '{HR_POSISI_WAWANCARA}' yang menguji soft skill '{HR_SOFT_SKILL}'. Kategorikan pertanyaan menjadi Perilaku, Teknis/Studi Kasus, dan Kecocokan Budaya.\n- **Jika 'Penyusun Rencana Onboarding'**: Buat checklist rencana onboarding 30 hari untuk posisi '{HR_POSISI_ONBOARDING}' dengan tujuan '{HR_TUJUAN_30_HARI}'. Pisahkan rencana per Hari ke-1, Minggu ke-1, dan 30 Hari Pertama.\n- **Jika 'Pembuat Draf Email Rekrutmen'**: Buat draf '{HR_JENIS_EMAIL}' yang ditujukan kepada '{HR_NAMA_KANDIDAT}'. Pastikan email penolakan tetap sopan dan email penawaran jelas serta profesional.",
          "FORMAT OUTPUT":
            "Gunakan format Markdown. Sajikan output dalam format dokumen yang sesuai (misalnya, deskripsi pekerjaan atau checklist) yang rapi dan mudah digunakan.",
        },
        toolType: "text",
        konteks_tambahan_instruksi_khusus:
          "Gunakan bahasa yang inklusif dan profesional. Untuk email, selalu gunakan nada yang sopan dan menghargai kandidat.",
        contoh_kalimat:
          "Buatkan saya templat email untuk menanggapi keluhan produk rusak.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
      "Asisten Akuntansi & Keuangan Bisnis": {
        id_kerangka: "BIS-ACC-001",
        nama_kerangka: "Asisten Akuntansi & Keuangan Bisnis",
        version: "1.0.0",
        kategori: ["Bisnis", "Akuntansi"],
        description:
          "Asisten akuntansi virtual untuk membantu tugas keuangan dasar, seperti membuat laporan, faktur, dan menganalisis biaya.",
        perspektif_user:
          "Sebagai pemilik usaha kecil, saya butuh bantuan untuk tugas akuntansi dasar seperti membuat laporan laba rugi atau menghitung titik impas tanpa harus menjadi akuntan.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang asisten akuntansi yang akan membantu pengguna non-akuntan dengan tugas-tugas keuangan dasar.",
        components: [
          {
            name: "TUGAS_AKUNTANSI",
            label: "Tugas Akuntansi atau Keuangan",
            type: "select",
            options: [
              "Pembuat Laporan Keuangan Sederhana",
              "Generator Draf Faktur (Invoice)",
              "Alat Analisis & Kategorisasi Biaya",
              "Kalkulator Titik Impas (Break-Even Point)",
            ],
            default: "Pembuat Laporan Keuangan Sederhana",
            info: "Pilih tugas keuangan yang ingin Anda selesaikan.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_AKUNTANSI",
            options: {
              "Pembuat Laporan Keuangan Sederhana": [
                {
                  name: "ACC_JENIS_LAPORAN",
                  label: "Jenis Laporan Keuangan",
                  type: "select",
                  options: ["Laporan Laba Rugi", "Laporan Arus Kas Sederhana"],
                  default: "Laporan Laba Rugi",
                  info: "Pilih jenis laporan yang ingin Anda buat.",
                },
                {
                  name: "ACC_PERIODE",
                  label: "Periode Laporan",
                  type: "text",
                  placeholder: "Contoh: Bulan Juli 2025",
                  info: "Sebutkan periode waktu yang dicakup laporan.",
                },
                {
                  name: "ACC_DATA_RINGKAS",
                  label: "Data Keuangan Ringkas",
                  type: "textarea",
                  placeholder:
                    "Contoh L/R: Total Pendapatan: 50jt, HPP: 20jt, Biaya Operasional: 15jt",
                  info: "Masukkan data keuangan ringkas sesuai jenis laporan.",
                },
              ],
              "Generator Draf Faktur (Invoice)": [
                {
                  name: "INV_NAMA_KLIEN",
                  label: "Nama Klien",
                  type: "text",
                  placeholder: "Contoh: PT Sejahtera Makmur",
                  info: "Nama klien yang akan ditagih.",
                },
                {
                  name: "INV_DETAIL_TAGIHAN",
                  label: "Detail Barang/Jasa (pisahkan baris)",
                  type: "textarea",
                  placeholder:
                    "Contoh: Desain Logo (1, Rp 2.000.000)\nJasa Konsultasi (2 jam, Rp 500.000/jam)",
                  info: "Masukkan setiap item, kuantitas, dan harga.",
                },
              ],
              "Alat Analisis & Kategorisasi Biaya": [
                {
                  name: "BIAYA_DAFTAR",
                  label: "Tempelkan Daftar Pengeluaran Anda",
                  type: "textarea",
                  placeholder:
                    "- Sewa kantor 5.000.000\n- Gaji staf 15.000.000\n- Iklan online 2.000.000",
                  info: "Masukkan daftar pengeluaran Anda, satu per baris.",
                },
              ],
              "Kalkulator Titik Impas (Break-Even Point)": [
                {
                  name: "BEP_BIAYA_TETAP",
                  label: "Total Biaya Tetap per Bulan",
                  type: "number",
                  placeholder: "20000000",
                  unit: "Rp",
                  info: "Biaya yang selalu sama, tidak peduli penjualan (gaji, sewa).",
                },
                {
                  name: "BEP_HARGA_JUAL",
                  label: "Harga Jual per Unit",
                  type: "number",
                  placeholder: "100000",
                  unit: "Rp",
                  info: "Harga jual satu unit produk/jasa Anda.",
                },
                {
                  name: "BEP_BIAYA_VARIABEL",
                  label: "Biaya Variabel per Unit",
                  type: "number",
                  placeholder: "40000",
                  unit: "Rp",
                  info: "Biaya yang hanya muncul jika ada penjualan (bahan baku, komisi).",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN:
            "Anda adalah seorang asisten akuntansi yang praktis dan mudah dimengerti.",
          KONTEKS:
            "Pengguna memerlukan bantuan untuk tugas '{TUGAS_AKUNTANSI}'. Tujuannya adalah menyederhanakan konsep akuntansi untuk non-akuntan.",
          TUGAS:
            "Berdasarkan tugas yang dipilih, berikan output yang sesuai:\n\n- **Jika 'Pembuat Laporan Keuangan Sederhana'**: Buat '{ACC_JENIS_LAPORAN}' untuk periode '{ACC_PERIODE}' menggunakan data '{ACC_DATA_RINGKAS}'. Sajikan dalam tabel yang jelas.\n- **Jika 'Generator Draf Faktur (Invoice)'**: Buat draf faktur profesional untuk '{INV_NAMA_KLIEN}' dengan detail tagihan '{INV_DETAIL_TAGIHAN}'. Sertakan semua elemen standar faktur.\n- **Jika 'Alat Analisis & Kategorisasi Biaya'**: Analisis daftar pengeluaran '{BIAYA_DAFTAR}'. Kategorikan setiap biaya, hitung total per kategori, dan tunjukkan persentasenya dari total pengeluaran.\n- **Jika 'Kalkulator Titik Impas (Break-Even Point)'**: Hitung titik impas (dalam unit dan Rupiah) menggunakan biaya tetap '{BEP_BIAYA_TETAP}', harga jual '{BEP_HARGA_JUAL}', dan biaya variabel '{BEP_BIAYA_VARIABEL}'. Jelaskan artinya.",
          "FORMAT OUTPUT":
            "Gunakan format Markdown. Sajikan output dalam format yang rapi, mudah dibaca, dan profesional. Gunakan tabel untuk data keuangan dan faktur.",
        },
        toolType: "text",
        konteks_tambahan_instruksi_khusus:
          "Hindari jargon akuntansi yang rumit. Selalu berikan penjelasan singkat tentang arti angka atau laporan yang dihasilkan. Ingatkan pengguna bahwa ini adalah alat bantu dan bukan pengganti akuntan profesional.",
        contoh_kalimat: "Bantu saya hitung titik impas usaha saya.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
      "Pusat Bantuan Layanan Pelanggan": {
        id_kerangka: "BIS-CS-001",
        nama_kerangka: "Pusat Bantuan Layanan Pelanggan",
        version: "1.0.0",
        kategori: ["Bisnis", "Layanan Pelanggan"],
        description:
          "Pusat komando untuk tim layanan pelanggan untuk meningkatkan kualitas, konsistensi, dan efisiensi interaksi.",
        perspektif_user:
          "Tim saya butuh bantuan untuk membuat respons standar yang baik, menangani keluhan, dan menganalisis umpan balik pelanggan secara efisien.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Manajer Layanan Pelanggan yang akan membantu tim menyusun templat, skrip, dan menganalisis data.",
        components: [
          {
            name: "TUGAS_LAYANAN_PELANGGAN",
            label: "Tugas Layanan Pelanggan",
            type: "select",
            options: [
              "Generator Templat Respons",
              "Penyusun Skrip Eskalasi Masalah",
              "Pembuat Konten Halaman FAQ",
              "Analisis Umpan Balik Pelanggan",
            ],
            default: "Generator Templat Respons",
            info: "Pilih tugas yang ingin Anda optimalkan.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_LAYANAN_PELANGGAN",
            options: {
              "Generator Templat Respons": [
                {
                  name: "CS_SKENARIO",
                  label: "Skenario Pelanggan",
                  type: "text",
                  placeholder:
                    "Contoh: Keluhan produk rusak, Pertanyaan status pengiriman",
                  info: "Jelaskan situasi umum yang dihadapi agen Anda.",
                },
                {
                  name: "CS_TONE",
                  label: "Nada Suara Respons",
                  type: "select",
                  options: [
                    "Empatik & Profesional",
                    "Cepat & Efisien",
                    "Sangat Sopan & Formal",
                  ],
                  default: "Empatik & Profesional",
                  info: "Pilih gaya bahasa untuk respons.",
                },
              ],
              "Penyusun Skrip Eskalasi Masalah": [
                {
                  name: "CS_MASALAH_ESKALASI",
                  label: "Jenis Masalah yang Perlu Eskalasi",
                  type: "text",
                  placeholder:
                    "Contoh: Masalah teknis kompleks, Pelanggan yang sangat tidak puas",
                  info: "Sebutkan situasi yang memerlukan penanganan tim senior.",
                },
              ],
              "Pembuat Konten Halaman FAQ": [
                {
                  name: "CS_PRODUK_FAQ",
                  label: "Produk atau Layanan",
                  type: "text",
                  placeholder: "Contoh: Layanan langganan premium kami",
                  info: "Produk yang akan dibuatkan halaman FAQ-nya.",
                },
                {
                  name: "CS_PERTANYAAN_UMUM",
                  label: "Contoh Pertanyaan Umum (Opsional)",
                  type: "textarea",
                  placeholder:
                    "- Bagaimana cara membatalkan langganan?\n- Apakah ada refund?",
                  info: "Jika Anda sudah punya daftar, masukkan di sini. Jika tidak, AI akan membuatnya.",
                  optional: true,
                },
              ],
              "Analisis Umpan Balik Pelanggan": [
                {
                  name: "CS_UMPAN_BALIK",
                  label: "Tempelkan Umpan Balik Pelanggan",
                  type: "textarea",
                  placeholder:
                    "Salin dan tempel beberapa ulasan pelanggan dari Google Reviews, App Store, atau survei di sini...",
                  info: "AI akan menganalisis teks ini untuk menemukan tema umum.",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN:
            "Anda adalah seorang Manajer Layanan Pelanggan yang berpengalaman.",
          KONTEKS:
            "Pengguna memerlukan bantuan untuk tugas '{TUGAS_LAYANAN_PELANGGAN}' untuk meningkatkan kualitas layanan mereka.",
          TUGAS:
            "Berdasarkan tugas yang dipilih, berikan output yang sesuai:\n\n- **Jika 'Generator Templat Respons'**: Buat draf templat email/chat untuk skenario '{CS_SKENARIO}' dengan nada '{CS_TONE}'. Sertakan placeholder untuk personalisasi.\n- **Jika 'Penyusun Skrip Eskalasi Masalah'**: Buat panduan skrip untuk agen tentang cara mengeskalasi masalah '{CS_MASALAH_ESKALASI}' ke tim senior, termasuk informasi apa yang harus dikumpulkan.\n- **Jika 'Pembuat Konten Halaman FAQ'**: Buat daftar Pertanyaan dan Jawaban yang jelas dan ringkas untuk produk '{CS_PRODUK_FAQ}', berdasarkan '{CS_PERTANYAAN_UMUM}' jika ada.\n- **Jika 'Analisis Umpan Balik Pelanggan'**: Analisis umpan balik di '{CS_UMPAN_BALIK}'. Identifikasi 3 tema positif utama, 3 tema negatif utama, dan berikan saran perbaikan yang dapat ditindaklanjuti.",
          "FORMAT OUTPUT":
            "Gunakan format Markdown. Sajikan output dalam format yang paling praktis untuk setiap tugas (misalnya, templat, checklist, atau laporan analisis).",
        },
        toolType: "text",
        konteks_tambahan_instruksi_khusus:
          "Prioritaskan kejelasan, empati, dan solusi dalam setiap output. Tujuannya adalah untuk menyelesaikan masalah pelanggan secara efisien sambil menjaga kepuasan mereka.",
        contoh_kalimat:
          "Buatkan saya templat email untuk menanggapi keluhan produk rusak.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
    },
    "Pengembangan Perangkat Lunak": {
      "Asisten Pengembang Cerdas": {
        id_kerangka: "KOL-PP-100",
        nama_kerangka: "Asisten Pengembang Cerdas",
        version: "1.0.0",
        kategori: ["Koleksi & Inovasi", "Pengembangan Perangkat Lunak"],
        description:
          "Pusat komprehensif untuk tugas-tugas pengembangan perangkat lunak, mulai dari pembuatan kode, analisis, pengujian, hingga dokumentasi, menggunakan pendekatan dinamis untuk alur kerja yang efisien.",
        perspektif_user:
          "Sebagai seorang pengembang, saya membutuhkan satu alat terpusat yang dapat membantu saya dengan berbagai tugas pengembangan sehari-hari, seperti menulis kode baru, meninjau kode yang ada, membuat pengujian, dan menghasilkan dokumentasi, tanpa harus berpindah-pindah kerangka kerja.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Asisten Pengembang Cerdas yang akan membantu berbagai tugas pengembangan.",
        components: [
          {
            name: "TUGAS_PENGEMBANGAN",
            label: "Tugas Pengembangan",
            type: "select",
            options: [
              "Buat Kode Baru",
              "Tinjau & Perbaiki Kode",
              "Jelaskan Kode",
              "Buat Pengujian Otomatis",
              "Buat Dokumentasi Teknis",
              "Lainnya...",
            ],
            description:
              "Pilih tugas pengembangan utama yang ingin Anda lakukan.",
            default: "Buat Kode Baru",
            info: "Pilih tugas utama yang ingin Anda lakukan. Pilihan Anda akan menampilkan opsi-opsi yang relevan di bawah.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_PENGEMBANGAN",
            options: {
              "Buat Kode Baru": [
                {
                  name: "functionalityDescription",
                  label: "Deskripsi Fungsionalitas yang Diinginkan",
                  type: "textarea",
                  placeholder:
                    "e.g., 'Fungsi Python untuk menghitung faktorial dari sebuah angka.'",
                  description:
                    "Jelaskan secara detail fungsionalitas kode yang Anda inginkan.",
                  validation: { min_length: 20 },
                  info: "Jelaskan secara detail fungsionalitas kode yang Anda inginkan.",
                },
                {
                  name: "programmingLanguage",
                  label: "Bahasa Pemrograman",
                  type: "select",
                  options: ["Python", "JavaScript", "Java", "C#", "Lainnya..."],
                  description:
                    "Pilih bahasa pemrograman untuk kode yang akan dihasilkan.",
                  default: "Python",
                  info: "Pilih bahasa pemrograman untuk kode yang akan dihasilkan.",
                },
                {
                  name: "codeStyle",
                  label: "Gaya Kode (Opsional)",
                  type: "text",
                  placeholder: "e.g., 'Pythonic, ES6, Java Clean Code'",
                  description:
                    "Sebutkan preferensi gaya pengkodean (misalnya, PEP 8 untuk Python).",
                  optional: true,
                  info: "Sebutkan preferensi gaya pengkodean (misalnya, PEP 8 untuk Python).",
                },
                {
                  name: "includeComments",
                  label: "Sertakan Komentar?",
                  type: "boolean",
                  description:
                    "Apakah Anda ingin kode disertai komentar penjelasan?",
                  default: false,
                  info: "Apakah Anda ingin kode disertai komentar penjelasan?",
                },
                {
                  name: "additionalInstructions",
                  label: "Instruksi Tambahan & Batasan",
                  type: "textarea",
                  placeholder:
                    "e.g., 'Pastikan fungsi ini menangani input negatif. Gunakan rekursi.'",
                  description:
                    "Sebutkan batasan, kompleksitas, atau instruksi khusus lainnya untuk kode.",
                  optional: true,
                  info: "Sebutkan batasan, kompleksitas, atau instruksi khusus lainnya untuk kode.",
                },
              ],
              "Tinjau & Perbaiki Kode": [
                {
                  name: "codeSnippet",
                  label: "Potongan Kode untuk Ditinjau",
                  type: "code",
                  placeholder:
                    "e.g., 'function calculateTotal(price, quantity) { ... }'",
                  description:
                    "Tempelkan potongan kode yang ingin Anda tinjau di sini.",
                  validation: { min_length: 10 },
                  info: "Tempelkan potongan kode yang ingin Anda tinjau di sini.",
                },
                {
                  name: "programmingLanguage",
                  label: "Bahasa Pemrograman",
                  type: "select",
                  options: [
                    "JavaScript",
                    "Python",
                    "Java",
                    "C++",
                    "Go",
                    "Ruby",
                    "PHP",
                    "Swift",
                    "Kotlin",
                    "TypeScript",
                    "Lainnya...",
                  ],
                  description: "Pilih bahasa pemrograman dari potongan kode.",
                  default: "Python",
                  info: "Pilih bahasa pemrograman dari potongan kode.",
                },
                {
                  name: "reviewFocus",
                  label: "Fokus Peninjauan & Refactoring",
                  type: "multiselect",
                  options: [
                    "Keterbacaan",
                    "Pemeliharaan",
                    "Skalabilitas",
                    "Efisiensi",
                    "Keamanan",
                    "Kepatuhan Standar",
                    "Struktur",
                    "Pengurangan Duplikasi",
                    "Lainnya...",
                  ],
                  description:
                    "Pilih aspek yang ingin Anda fokuskan dalam peninjauan dan refactoring.",
                  default: ["Keterbacaan", "Efisiensi"],
                  info: "Pilih aspek yang ingin Anda fokuskan dalam peninjauan dan refactoring.",
                },
                {
                  name: "userLevel",
                  label: "Tingkat Keahlian Anda",
                  type: "select",
                  options: ["Pemula", "Menengah", "Ahli", "Lainnya..."],
                  description:
                    "Tingkat keahlian Anda akan mempengaruhi kedalaman penjelasan dan saran.",
                  default: "Menengah",
                  info: "Tingkat keahlian Anda akan mempengaruhi kedalaman penjelasan dan saran.",
                },
                {
                  name: "additionalInstructions",
                  label: "Instruksi Tambahan & Gaya",
                  type: "textarea",
                  description:
                    "Sebutkan preferensi gaya, batasan, atau instruksi khusus lainnya untuk AI.",
                  optional: true,
                  placeholder:
                    "e.g., 'Berikan contoh kode sebelum dan sesudah. Jelaskan manfaatnya secara bisnis.'",
                  info: "Sebutkan preferensi gaya, batasan, atau instruksi khusus lainnya untuk AI.",
                },
              ],
              "Jelaskan Kode": [
                {
                  name: "codeSnippet",
                  label: "Potongan Kode",
                  type: "code",
                  description:
                    "Tempelkan potongan kode yang ingin Anda terjemahkan di sini.",
                  validation: { min_length: 10 },
                  placeholder: "e.g., function factorial(n) { ... }",
                  info: "Tempelkan potongan kode yang ingin Anda terjemahkan di sini.",
                },
                {
                  name: "programmingLanguage",
                  label: "Bahasa Pemrograman",
                  type: "select",
                  options: [
                    "JavaScript",
                    "Python",
                    "Java",
                    "C++",
                    "Go",
                    "Ruby",
                    "PHP",
                    "Swift",
                    "Kotlin",
                    "TypeScript",
                    "Lainnya...",
                  ],
                  info: "Pilih bahasa pemrograman dari potongan kode.",
                },
                {
                  name: "targetAudience",
                  label: "Target Audiens Penjelasan",
                  type: "select",
                  options: [
                    "Pemula (non-teknis)",
                    "Mahasiswa (dasar)",
                    "Pengembang Junior",
                    "Pengembang Senior",
                    "Manajer Proyek (non-teknis)",
                    "Lainnya...",
                  ],
                  info: "Siapa yang akan membaca penjelasan ini?",
                },
                {
                  name: "explanationDetailLevel",
                  label: "Tingkat Detail Penjelasan",
                  type: "select",
                  options: [
                    "Sangat Sederhana (gambaran umum)",
                    "Menengah (konsep kunci)",
                    "Rinci (langkah demi langkah)",
                    "Lainnya...",
                  ],
                  info: "Pilih seberapa detail penjelasan yang Anda inginkan.",
                },
                {
                  name: "additionalInstructions",
                  label: "Instruksi Tambahan & Gaya",
                  type: "textarea",
                  description:
                    "Sebutkan preferensi gaya, batasan, atau instruksi khusus lainnya untuk AI.",
                  optional: true,
                  placeholder:
                    "e.g., 'Gunakan analogi memasak. Jangan lebih dari 200 kata.'",
                  info: "Sebutkan preferensi gaya, batasan, atau instruksi khusus lainnya untuk AI.",
                },
              ],
              "Buat Pengujian Otomatis": [
                {
                  name: "codeSnippet",
                  label: "Potongan Kode/Fungsionalitas untuk Dites",
                  type: "code",
                  placeholder: "e.g., 'function validateEmail(email) { ... }'",
                  description:
                    "Tempelkan kode atau jelaskan fungsionalitas yang ingin Anda tulis tesnya.",
                  validation: { min_length: 10 },
                  info: "Tempelkan kode atau jelaskan fungsionalitas yang ingin Anda tulis tesnya.",
                },
                {
                  name: "programmingLanguage",
                  label: "Bahasa Pemrograman",
                  type: "select",
                  options: ["Python", "JavaScript", "Java", "C#", "Lainnya..."],
                  description: "Pilih bahasa pemrograman dari kode.",
                  default: "JavaScript",
                  info: "Pilih bahasa pemrograman dari kode.",
                },
                {
                  name: "testType",
                  label: "Jenis Tes",
                  type: "select",
                  options: [
                    "Unit Test",
                    "Integration Test",
                    "End-to-End Test",
                    "Lainnya...",
                  ],
                  description: "Pilih jenis tes yang ingin Anda buat.",
                  default: "Unit Test",
                  info: "Pilih jenis tes yang ingin Anda buat.",
                },
                {
                  name: "testFramework",
                  label: "Framework Tes (Opsional)",
                  type: "text",
                  placeholder: "e.g., 'Jest, Pytest, JUnit'",
                  description: "Sebutkan framework tes yang Anda gunakan.",
                  optional: true,
                  info: "Sebutkan framework tes yang Anda gunakan.",
                },
                {
                  name: "additionalInstructions",
                  label: "Instruksi Tambahan & Skenario",
                  type: "textarea",
                  placeholder:
                    "e.g., 'Sertakan kasus uji untuk input yang tidak valid. Fokus pada skenario edge case.'",
                  description:
                    "Sebutkan skenario spesifik, batasan, atau instruksi khusus lainnya untuk tes.",
                  optional: true,
                  info: "Sebutkan skenario spesifik, batasan, atau instruksi khusus lainnya untuk tes.",
                },
              ],
              "Buat Dokumentasi Teknis": [
                {
                  name: "documentType",
                  label: "Jenis Dokumen",
                  type: "select",
                  options: [
                    "README Proyek",
                    "Panduan API",
                    "Panduan Pengguna",
                    "Dokumentasi Kode Internal",
                    "Lainnya...",
                  ],
                  placeholder: "Pilih jenis dokumen",
                  info: "Pilih jenis dokumentasi yang ingin Anda buat.",
                },
                {
                  name: "projectDescription",
                  label: "Deskripsi Proyek/Fungsionalitas",
                  type: "textarea",
                  placeholder:
                    "e.g., 'Aplikasi web untuk manajemen tugas dengan fitur CRUD dan autentikasi pengguna.'",
                  info: "Jelaskan proyek atau fungsionalitas yang ingin Anda dokumentasikan.",
                },
                {
                  name: "targetAudience",
                  label: "Target Audiens Dokumen",
                  type: "select",
                  options: [
                    "Pengembang (Internal)",
                    "Pengembang (Eksternal/API User)",
                    "Pengguna Akhir",
                    "Manajer Proyek",
                    "Lainnya...",
                  ],
                  placeholder: "Pilih target audiens",
                  info: "Siapa yang akan membaca dokumentasi ini?",
                },
                {
                  name: "codeSnippet",
                  label: "Potongan Kode (Opsional)",
                  type: "code",
                  placeholder: "e.g., function createUser(name, email) { ... }",
                  optional: true,
                  info: "Tempelkan potongan kode yang relevan jika Anda ingin dokumentasi berfokus pada kode.",
                },
                {
                  name: "additionalInstructions",
                  label: "Instruksi Tambahan & Gaya",
                  type: "textarea",
                  description:
                    "Sebutkan preferensi gaya, batasan, atau instruksi khusus lainnya untuk AI.",
                  optional: true,
                  placeholder:
                    "e.g., 'Gunakan bahasa yang formal dan ringkas. Sertakan contoh penggunaan.'",
                  info: "Sebutkan preferensi gaya, batasan, atau instruksi khusus lainnya untuk AI.",
                },
              ],
              "Lainnya...": [
                {
                  name: "customDevelopmentTask",
                  label: "Sebutkan Tugas Pengembangan Lainnya",
                  type: "textarea",
                  description:
                    "Jelaskan secara rinci tugas pengembangan spesifik yang ingin Anda lakukan.",
                  placeholder:
                    "e.g., 'Optimalkan query database untuk performa', 'Buat skema database untuk aplikasi e-commerce'",
                  info: "Jelaskan tugas kustom Anda di sini. AI akan mencoba memahaminya dan memberikan bantuan yang relevan.",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN:
            "Anda adalah seorang Asisten Pengembang Cerdas serbaguna, siap membantu dengan berbagai tugas pengembangan perangkat lunak.",
          KONTEKS:
            "Pengguna telah memilih tugas: '{TUGAS_PENGEMBANGAN}'. Berdasarkan pilihan ini, Anda akan bertindak sebagai spesialis yang relevan (misalnya, Insinyur Kode, Auditor Kode, Penulis Teknis).",
          TUGAS:
            "Berdasarkan tugas '{TUGAS_PENGEMBANGAN}', lakukan hal berikut:\n\n*   **Jika 'Buat Kode Baru'**: Hasilkan kode fungsional berdasarkan deskripsi: '{functionalityDescription}' dalam bahasa '{programmingLanguage}'. Jika bahasa adalah 'Lainnya...', gunakan '{customProgrammingLanguage}'. Gunakan gaya '{codeStyle}'. {additionalInstructions}\n*   **Jika 'Tinjau & Perbaiki Kode'**: Analisis kode '{codeSnippet}' dalam bahasa '{programmingLanguage}'. Jika bahasa adalah 'Lainnya...', gunakan '{customProgrammingLanguage}'. Fokus pada: {reviewFocus}. Jika fokus adalah 'Lainnya...', gunakan '{customReviewFocus}'. Berikan saran perbaikan yang sesuai untuk tingkat keahlian '{userLevel}'. Jika tingkat keahlian adalah 'Lainnya...', gunakan '{customUserLevel}'. {additionalInstructions}\n*   **Jika 'Jelaskan Kode'**: Terjemahkan kode '{codeSnippet}' dalam bahasa '{programmingLanguage}'. Jika bahasa adalah 'Lainnya...', gunakan '{customProgrammingLanguage}'. Jadikan penjelasan mudah dipahami untuk audiens '{targetAudience}'. Jika audiens adalah 'Lainnya...', gunakan '{customTargetAudience}', dengan tingkat detail '{explanationDetailLevel}'. Jika tingkat detail adalah 'Lainnya...', gunakan '{customExplanationDetailLevel}'. {additionalInstructions}\n*   **Jika 'Buat Pengujian Otomatis'**: Buat '{testType}'. Jika jenis tes adalah 'Lainnya...', gunakan '{customTestType}'. Buat tes untuk kode/fungsionalitas '{codeSnippet}' dalam bahasa '{programmingLanguage}'. Jika bahasa adalah 'Lainnya...', gunakan '{customProgrammingLanguage}', menggunakan framework '{testFramework}'. {additionalInstructions}\n*   **Jika 'Buat Dokumentasi Teknis'**: Buat '{documentType}'. Jika jenis dokumen adalah 'Lainnya...', gunakan '{customDocumentType}'. Buat dokumentasi untuk proyek '{projectDescription}' yang ditujukan untuk '{targetAudience}'. Jika audiens adalah 'Lainnya...', gunakan '{customTargetAudience}'. Gunakan kode '{codeSnippet}' jika disediakan. {additionalInstructions}\n*   **Jika 'Lainnya...**: Tanggapi permintaan kustom '{customDevelopmentTask}' dengan memberikan solusi, kode, atau panduan terbaik.",
          "FORMAT OUTPUT":
            "Sajikan output dalam format yang paling sesuai dengan tugas yang diminta (misalnya, blok kode untuk pembuatan kode, daftar poin-poin untuk ulasan, Markdown terstruktur untuk dokumentasi). Pastikan output jelas, akurat, dan dapat ditindaklanjuti.",
        },
        toolType: "code",
        konteks_tambahan_instruksi_khusus:
          "Selalu prioritaskan kode yang bersih, efisien, dan mudah dipelihara. Berikan penjelasan yang mendidik di balik saran Anda. Jika ada ambiguitas dalam permintaan pengguna, ajukan pertanyaan klarifikasi sebelum menghasilkan output.",
        contoh_kalimat:
          "Gunakan Asisten Pengembang Cerdas untuk membuat fungsi Python baru.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
      "Panduan DevOps & MLOps": {
        id_kerangka: "KOL-PP-101",
        nama_kerangka: "Panduan DevOps & MLOps",
        version: "1.0.0",
        kategori: ["Koleksi & Inovasi", "Pengembangan Perangkat Lunak"],
        description:
          "Panduan terpusat untuk manajemen proyek, infrastruktur, dan operasional, mencakup siklus hidup DevOps dan MLOps dari perencanaan hingga pemantauan.",
        perspektif_user:
          "Sebagai seorang insinyur DevOps, MLOps, atau manajer proyek, saya memerlukan alat terintegrasi untuk membantu saya dengan berbagai tugas operasional seperti perencanaan Agile, manajemen dependensi, containerization, CI/CD, pemantauan, IaC, dan alur kerja data science.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli DevOps dan MLOps yang akan memandu pengguna dalam tugas operasional dan manajemen.",
        components: [
          {
            name: "TUGAS_OPERASIONAL",
            label: "Tugas Operasional",
            type: "select",
            options: [
              "Manajemen Proyek Agile",
              "Manajemen Dependensi & Versi",
              "Containerization & Deployment",
              "Bangun CI/CD Pipeline",
              "Monitoring & Logging",
              "Infrastructure as Code (IaC)",
              "Alur Kerja Data Science",
              "Lainnya...",
            ],
            description:
              "Pilih tugas operasional utama yang ingin Anda lakukan.",
            default: "Manajemen Proyek Agile",
            info: "Pilih tugas utama yang ingin Anda lakukan. Pilihan Anda akan menampilkan opsi-opsi yang relevan di bawah.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TUGAS_OPERASIONAL",
            options: {
              "Manajemen Proyek Agile": [
                {
                  name: "agileFramework",
                  label: "Kerangka Kerja Agile",
                  type: "select",
                  options: ["Scrum", "Kanban", "Lainnya..."],
                  default: "Scrum",
                  info: "Pilih kerangka kerja Agile yang Anda gunakan.",
                },
                {
                  name: "projectGoal",
                  label: "Tujuan Proyek/Sprint",
                  type: "textarea",
                  placeholder:
                    "e.g., 'Mengembangkan fitur autentikasi pengguna baru'",
                  info: "Jelaskan tujuan utama dari proyek atau sprint ini.",
                },
                {
                  name: "teamSize",
                  label: "Ukuran Tim",
                  type: "number",
                  placeholder: "e.g., 5",
                  info: "Masukkan jumlah anggota dalam tim Anda.",
                },
              ],
              "Manajemen Dependensi & Versi": [
                {
                  name: "helpTopic",
                  label: "Topik Bantuan",
                  type: "select",
                  options: [
                    "Manajemen Dependensi",
                    "Kontrol Versi (Git)",
                    "Keduanya",
                  ],
                  default: "Kontrol Versi (Git)",
                  info: "Pilih topik yang Anda butuhkan bantuan.",
                },
                {
                  name: "programmingLanguage",
                  label: "Bahasa/Ekosistem Pemrograman (Opsional)",
                  type: "text",
                  placeholder:
                    "e.g., 'Node.js (npm), Python (pip), Java (Maven/Gradle)'",
                  optional: true,
                  info: "Sebutkan bahasa atau ekosistem pemrograman Anda.",
                },
                {
                  name: "specificProblem",
                  label: "Masalah Spesifik (Opsional)",
                  type: "textarea",
                  placeholder:
                    "e.g., 'Saya tidak tahu cara menggabungkan dua branch di Git tanpa konflik.'",
                  optional: true,
                  info: "Jelaskan masalah spesifik yang Anda hadapi.",
                },
              ],
              "Containerization & Deployment": [
                {
                  name: "taskType",
                  label: "Jenis Tugas",
                  type: "select",
                  options: [
                    "Membuat Dockerfile",
                    "Membangun Image Docker",
                    "Menjalankan Kontainer",
                    "Deployment ke Cloud",
                    "Lainnya...",
                  ],
                  default: "Membuat Dockerfile",
                  info: "Pilih tugas yang ingin Anda lakukan.",
                },
                {
                  name: "applicationType",
                  label: "Jenis Aplikasi",
                  type: "text",
                  placeholder:
                    "e.g., 'Aplikasi web Node.js', 'API Python dengan Flask'",
                  info: "Jelaskan jenis aplikasi Anda.",
                },
                {
                  name: "programmingLanguage",
                  label: "Bahasa Pemrograman",
                  type: "select",
                  options: ["Node.js", "Python", "Java", "Go", "Lainnya..."],
                  default: "Node.js",
                  info: "Pilih bahasa pemrograman aplikasi Anda.",
                },
              ],
              "Bangun CI/CD Pipeline": [
                {
                  name: "ciCdPlatform",
                  label: "Platform CI/CD",
                  type: "select",
                  options: [
                    "GitHub Actions",
                    "GitLab CI/CD",
                    "Jenkins",
                    "CircleCI",
                    "Lainnya...",
                  ],
                  default: "GitHub Actions",
                  info: "Pilih platform CI/CD yang ingin Anda gunakan.",
                },
                {
                  name: "projectType",
                  label: "Jenis Proyek",
                  type: "text",
                  placeholder:
                    "e.g., 'Aplikasi web frontend', 'API backend', 'Library Python'",
                  info: "Jelaskan jenis proyek Anda.",
                },
                {
                  name: "pipelineStages",
                  label: "Tahapan Pipeline yang Diinginkan",
                  type: "multiselect",
                  options: [
                    "Linting",
                    "Testing",
                    "Building",
                    "Deployment",
                    "Notifikasi",
                    "Lainnya...",
                  ],
                  default: ["Linting", "Testing", "Building", "Deployment"],
                  info: "Pilih tahapan yang ingin Anda sertakan dalam pipeline.",
                },
              ],
              "Monitoring & Logging": [
                {
                  name: "monitoringTool",
                  label: "Alat Pemantauan/Pencatatan",
                  type: "select",
                  options: [
                    "Prometheus & Grafana",
                    "ELK Stack (Elasticsearch, Logstash, Kibana)",
                    "Datadog",
                    "New Relic",
                    "Lainnya...",
                  ],
                  default: "Prometheus & Grafana",
                  info: "Pilih alat yang ingin Anda gunakan.",
                },
                {
                  name: "applicationType",
                  label: "Jenis Aplikasi",
                  type: "text",
                  placeholder:
                    "e.g., 'Aplikasi web Node.js', 'Microservice Java'",
                  info: "Jelaskan jenis aplikasi yang akan dipantau.",
                },
                {
                  name: "metricsToTrack",
                  label: "Metrik Kunci yang Ingin Dilacak",
                  type: "multiselect",
                  options: [
                    "Penggunaan CPU",
                    "Penggunaan Memori",
                    "Latensi Permintaan",
                    "Jumlah Error",
                    "Trafik Jaringan",
                    "Lainnya...",
                  ],
                  default: [
                    "Penggunaan CPU",
                    "Latensi Permintaan",
                    "Jumlah Error",
                  ],
                  info: "Pilih metrik yang paling penting untuk Anda.",
                },
              ],
              "Infrastructure as Code (IaC)": [
                {
                  name: "iacTool",
                  label: "Alat IaC",
                  type: "select",
                  options: [
                    "Terraform",
                    "AWS CloudFormation",
                    "Azure Resource Manager (ARM)",
                    "Pulumi",
                    "Lainnya...",
                  ],
                  default: "Terraform",
                  info: "Pilih alat Infrastructure as Code yang ingin Anda gunakan.",
                },
                {
                  name: "cloudProvider",
                  label: "Penyedia Cloud",
                  type: "select",
                  options: [
                    "AWS",
                    "Azure",
                    "Google Cloud Platform (GCP)",
                    "Lainnya...",
                  ],
                  default: "AWS",
                  info: "Pilih penyedia layanan cloud Anda.",
                },
                {
                  name: "resourceType",
                  label: "Jenis Sumber Daya",
                  type: "multiselect",
                  options: [
                    "Virtual Machine (VM)",
                    "Database",
                    "Jaringan (VPC/VNet)",
                    "Penyimpanan (Storage)",
                    "Load Balancer",
                    "Lainnya...",
                  ],
                  default: ["Virtual Machine (VM)", "Jaringan (VPC/VNet)"],
                  info: "Pilih jenis sumber daya yang ingin Anda definisikan.",
                },
              ],
              "Alur Kerja Data Science": [
                {
                  name: "workflowTask",
                  label: "Tugas Alur Kerja",
                  type: "select",
                  options: [
                    "Pengumpulan Data",
                    "Pembersihan & Pra-pemrosesan Data",
                    "Eksplorasi Data (EDA)",
                    "Pelatihan Model",
                    "Evaluasi Model",
                    "Deployment Model",
                    "Lainnya...",
                  ],
                  default: "Eksplorasi Data (EDA)",
                  info: "Pilih tugas dalam alur kerja data science yang Anda butuhkan bantuan.",
                },
                {
                  name: "datasetDescription",
                  label: "Deskripsi Dataset (Opsional)",
                  type: "textarea",
                  placeholder:
                    "e.g., 'Dataset berisi data transaksi pelanggan selama 1 tahun.'",
                  optional: true,
                  info: "Jelaskan secara singkat tentang dataset yang Anda gunakan.",
                },
                {
                  name: "goal",
                  label: "Tujuan Analisis/Model",
                  type: "textarea",
                  placeholder:
                    "e.g., 'Memprediksi churn pelanggan', 'Mengelompokkan pelanggan berdasarkan perilaku pembelian'",
                  info: "Jelaskan tujuan akhir dari analisis atau model yang ingin Anda bangun.",
                },
              ],
              "Lainnya...": [
                {
                  name: "customOperationalTask",
                  label: "Sebutkan Tugas Operasional Lainnya",
                  type: "textarea",
                  description:
                    "Jelaskan secara rinci tugas operasional spesifik yang ingin Anda lakukan.",
                  placeholder:
                    "e.g., 'Melakukan audit keamanan pada infrastruktur cloud', 'Merancang strategi pemulihan bencana'",
                  info: "Jelaskan tugas kustom Anda di sini. AI akan mencoba memahaminya dan memberikan bantuan yang relevan.",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN: "Anda adalah seorang Ahli DevOps dan MLOps serbaguna.",
          KONTEKS:
            "Pengguna telah memilih tugas operasional: '{TUGAS_OPERASIONAL}'. Anda akan bertindak sebagai spesialis yang relevan untuk memandu pengguna.",
          TUGAS:
            "Berdasarkan tugas '{TUGAS_OPERASIONAL}', berikan panduan, konfigurasi, atau rencana yang relevan. Gunakan variabel input yang disediakan dari sub-komponen yang sesuai untuk menyusun respons Anda.",
          "FORMAT OUTPUT":
            "Sajikan output dalam format yang paling sesuai dengan tugas yang diminta (misalnya, file konfigurasi YAML, daftar langkah-langkah dalam Markdown, atau rencana proyek). Pastikan output jelas, akurat, dan dapat ditindaklanjuti.",
        },
        toolType: "planning",
        konteks_tambahan_instruksi_khusus:
          "Selalu prioritaskan praktik terbaik industri untuk keamanan, efisiensi, dan skalabilitas. Jika ada ambiguitas, ajukan pertanyaan klarifikasi.",
        contoh_kalimat:
          "Bantu saya merancang CI/CD pipeline untuk aplikasi web Node.js saya menggunakan GitHub Actions.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
      "Tutor Pemrograman & Konsep Lanjutan": {
        id_kerangka: "KOL-PP-102",
        nama_kerangka: "Tutor Pemrograman & Konsep Lanjutan",
        version: "1.0.0",
        kategori: ["Koleksi & Inovasi", "Pengembangan Perangkat Lunak"],
        description:
          "Pusat pembelajaran terintegrasi untuk pemula hingga ahli, mencakup pemilihan bahasa, dasar-dasar pemrograman, debugging, dan konsep lanjutan seperti AI, keamanan siber, dan blockchain.",
        perspektif_user:
          "Sebagai seseorang yang ingin belajar atau memperdalam ilmu pemrograman, saya memerlukan satu tempat untuk mendapatkan bimbingan, mulai dari memilih bahasa pertama, memahami dasar-dasarnya, hingga menjelajahi topik-topik canggih seperti AI dan keamanan siber.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Tutor Pemrograman yang akan memandu pengguna mempelajari berbagai konsep teknologi.",
        components: [
          {
            name: "TOPIK_PEMBELAJARAN",
            label: "Topik Pembelajaran",
            type: "select",
            options: [
              "Pilih Bahasa Pemrograman Pertama",
              "Dasar-Dasar Pemrograman",
              "Visualisasi Algoritma & Struktur Data",
              "Dasar-Dasar Keamanan Siber",
              "Dasar-Dasar AI/Machine Learning",
              "Dasar-Dasar Web3 & Blockchain",
              "Panduan Debugging",
              "Lainnya...",
            ],
            description: "Pilih topik pembelajaran yang ingin Anda jelajahi.",
            default: "Dasar-Dasar Pemrograman",
            info: "Pilih topik utama yang ingin Anda pelajari. Pilihan Anda akan menampilkan opsi-opsi yang relevan di bawah.",
          },
        ],
        dynamicSubcomponents: [
          {
            trigger: "TOPIK_PEMBELAJARAN",
            options: {
              "Pilih Bahasa Pemrograman Pertama": [
                {
                  name: "userInterests",
                  label: "Minat Anda",
                  type: "text",
                  placeholder: "e.g., 'Pengembangan web, game, analisis data'",
                  info: "Sebutkan area minat Anda dalam pemrograman.",
                },
                {
                  name: "careerGoals",
                  label: "Tujuan Karir",
                  type: "text",
                  placeholder:
                    "e.g., 'Menjadi full-stack developer, ilmuwan data'",
                  info: "Sebutkan tujuan karir jangka panjang Anda.",
                },
              ],
              "Dasar-Dasar Pemrograman": [
                {
                  name: "programmingLanguage",
                  label: "Bahasa Pemrograman",
                  type: "select",
                  options: [
                    "Python",
                    "JavaScript",
                    "Java",
                    "C++",
                    "Lainnya...",
                  ],
                  default: "Python",
                  info: "Pilih bahasa pemrograman yang ingin Anda pelajari.",
                },
                {
                  name: "focusConcepts",
                  label: "Konsep yang Ingin Dipelajari",
                  type: "multiselect",
                  options: [
                    "Variabel",
                    "Tipe Data",
                    "Kondisi (if/else)",
                    "Loop (for/while)",
                    "Fungsi",
                  ],
                  default: ["Variabel", "Kondisi (if/else)"],
                  info: "Pilih konsep dasar yang ingin Anda fokuskan.",
                },
              ],
              "Visualisasi Algoritma & Struktur Data": [
                {
                  name: "specificConcept",
                  label: "Konsep Spesifik",
                  type: "text",
                  placeholder:
                    "e.g., 'Bubble Sort', 'Linked List', 'Binary Tree'",
                  info: "Sebutkan algoritma atau struktur data yang ingin divisualisasikan.",
                },
                {
                  name: "inputData",
                  label: "Data Input (Opsional)",
                  type: "text",
                  placeholder: "e.g., '5, 2, 8, 1, 9'",
                  optional: true,
                  info: "Masukkan data yang akan digunakan untuk visualisasi (pisahkan dengan koma).",
                },
              ],
              "Dasar-Dasar Keamanan Siber": [
                {
                  name: "securityTopic",
                  label: "Topik Keamanan",
                  type: "select",
                  options: [
                    "Pencegahan Injeksi SQL",
                    "Cross-Site Scripting (XSS)",
                    "Manajemen Kata Sandi yang Aman",
                    "Lainnya...",
                  ],
                  default: "Pencegahan Injeksi SQL",
                  info: "Pilih topik keamanan siber yang ingin Anda pelajari.",
                },
                {
                  name: "codeSnippet",
                  label: "Contoh Kode Rentan (Opsional)",
                  type: "code",
                  placeholder: "Tempelkan contoh kode yang mungkin rentan...",
                  optional: true,
                  info: "Jika Anda memiliki contoh kode, tempelkan di sini untuk dianalisis.",
                },
              ],
              "Dasar-Dasar AI/Machine Learning": [
                {
                  name: "mlConcept",
                  label: "Konsep AI/ML",
                  type: "select",
                  options: [
                    "Regresi Linear",
                    "Klasifikasi",
                    "Clustering",
                    "Jaringan Saraf Tiruan",
                    "Lainnya...",
                  ],
                  default: "Regresi Linear",
                  info: "Pilih konsep AI/ML yang ingin Anda pelajari.",
                },
                {
                  name: "datasetDescription",
                  label: "Deskripsi Dataset (Opsional)",
                  type: "textarea",
                  placeholder:
                    "e.g., 'Dataset harga rumah dengan fitur luas tanah dan jumlah kamar.'",
                  optional: true,
                  info: "Jelaskan dataset yang ingin Anda gunakan untuk membangun model.",
                },
              ],
              "Dasar-Dasar Web3 & Blockchain": [
                {
                  name: "blockchainConcept",
                  label: "Konsep Web3/Blockchain",
                  type: "select",
                  options: [
                    "Apa itu Blockchain?",
                    "Smart Contract",
                    "Decentralized Applications (dApps)",
                    "NFT",
                    "Lainnya...",
                  ],
                  default: "Apa itu Blockchain?",
                  info: "Pilih konsep Web3/Blockchain yang ingin Anda pelajari.",
                },
              ],
              "Panduan Debugging": [
                {
                  name: "problemDescription",
                  label: "Jelaskan Masalah Debugging",
                  type: "textarea",
                  placeholder:
                    "e.g., 'Aplikasi saya crash saat mencoba menyimpan data, dengan pesan error 'NullPointerException'.",
                  info: "Jelaskan masalah atau error yang Anda hadapi.",
                },
                {
                  name: "programmingLanguage",
                  label: "Bahasa Pemrograman",
                  type: "select",
                  options: [
                    "Python",
                    "JavaScript",
                    "Java",
                    "C++",
                    "Lainnya...",
                  ],
                  default: "Python",
                  info: "Pilih bahasa pemrograman yang relevan.",
                },
              ],
              "Lainnya...": [
                {
                  name: "customLearningTopic",
                  label: "Sebutkan Topik Pembelajaran Lainnya",
                  type: "textarea",
                  description:
                    "Jelaskan secara rinci topik pembelajaran spesifik yang ingin Anda jelajahi.",
                  placeholder:
                    "e.g., 'Pengantar Komputasi Kuantum', 'Praktik Terbaik untuk Arsitektur Mikroservis'",
                  info: "Jelaskan topik kustom Anda di sini. AI akan mencoba memahaminya dan memberikan bantuan yang relevan.",
                },
              ],
            },
          },
        ],
        komponen_prompt: {
          PERAN:
            "Anda adalah seorang Tutor Pemrograman serbaguna dan ahli dalam konsep-konsep teknologi canggih.",
          KONTEKS:
            "Pengguna telah memilih topik pembelajaran: '{TOPIK_PEMBELAJARAN}'. Anda akan bertindak sebagai tutor atau ahli di bidang tersebut.",
          TUGAS:
            "Berdasarkan topik '{TOPIK_PEMBELAJARAN}', berikan penjelasan, panduan, atau contoh kode yang relevan. Gunakan variabel input dari sub-komponen yang sesuai untuk menyusun respons Anda.",
          "FORMAT OUTPUT":
            "Sajikan output dalam format yang paling sesuai dengan topik pembelajaran (misalnya, panduan langkah demi langkah, penjelasan konsep dengan contoh, atau visualisasi teks). Gunakan Markdown untuk keterbacaan yang baik.",
        },
        toolType: "text",
        konteks_tambahan_instruksi_khusus:
          "Sesuaikan kedalaman penjelasan dengan topik yang dipilih. Untuk pemula, gunakan analogi dan bahasa yang sederhana. Untuk topik lanjutan, berikan detail teknis yang akurat.",
        contoh_kalimat:
          "Bantu saya memahami dasar-dasar pemrograman Python, khususnya tentang loop.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
    },
    Pemasaran: {
      "Pusat Strategi Pemasaran 360°": {
        id_kerangka: "KI-PEM-001",
        nama_kerangka: "Pusat Strategi Pemasaran 360°",
        version: "1.0.0",
        kategori: ["Koleksi & Inovasi", "Pemasaran"],
        description:
          "Dasbor komprehensif untuk merancang, mengimplementasikan, dan menganalisis berbagai aspek kampanye pemasaran, dari SEO hingga peluncuran produk.",
        perspektif_user:
          "Sebagai seorang profesional pemasaran, saya memerlukan satu alat terpusat yang dapat membantu saya dengan berbagai tugas pemasaran sehari-hari tanpa harus berpindah-pindah kerangka kerja.",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Strategi Pemasaran 360° yang akan memandu pengguna memilih disiplin pemasaran.",
        components: [
          {
            name: "TUGAS_PEMASARAN_UTAMA",
            label: "Tugas Pemasaran Utama",
            type: "select",
            options: [
              "Strategi SEO & SEM",
              "Pengembangan Konten & Blog",
              "Manajemen Media Sosial",
              "Kampanye Pemasaran Email",
              "Peluncuran Produk & Kampanye",
              "Riset Pasar & Analisis Kompetitor",
              "Branding & Hubungan Masyarakat (PR)",
              "Optimasi Penjualan & Konversi",
            ],
            default: "Strategi SEO & SEM",
            info: "Pilihan Anda akan menampilkan serangkaian input yang dirancang khusus untuk area tersebut.",
          },
        ],
        dynamicSubcomponents: {
          trigger: "TUGAS_PEMASARAN_UTAMA",
          options: {
            "Strategi SEO & SEM": [
              {
                name: "TOPIK_UTAMA",
                label: "Topik Utama / Kata Kunci Target",
                type: "text",
                placeholder: "Contoh: software akuntansi untuk UMKM",
                info: "Masukkan topik inti atau kata kunci utama yang ingin Anda targetkan.",
              },
              {
                name: "TARGET_AUDIENS_SEO",
                label: "Deskripsi Target Audiens",
                type: "textarea",
                placeholder:
                  "Contoh: Pemilik bisnis kecil yang tidak punya latar belakang akuntansi",
                info: "Siapa target audiens untuk strategi SEO/SEM ini?",
              },
              {
                name: "FOKUS_STRATEGI_SEO",
                label: "Fokus Strategi",
                type: "multiselect",
                options: [
                  "Riset Kata Kunci",
                  "Analisis SERP",
                  "Outline Konten SEO",
                  "Ide Iklan SEM",
                ],
                default: ["Riset Kata Kunci", "Outline Konten SEO"],
                info: "Pilih aspek yang ingin Anda dalami.",
              },
            ],
            "Pengembangan Konten & Blog": [
              {
                name: "JENIS_KONTEN",
                label: "Jenis Konten yang Diinginkan",
                type: "select",
                options: ["Artikel Blog", "Naskah Video", "Utas Media Sosial"],
                default: "Artikel Blog",
                info: "Pilih format konten yang ingin dibuat.",
              },
              {
                name: "JUDUL_KONTEN",
                label: "Judul atau Ide Utama Konten",
                type: "text",
                placeholder: "Contoh: 5 Cara Mengelola Keuangan Bisnis",
                info: "Apa topik utama konten Anda?",
              },
              {
                name: "POIN_KUNCI_KONTEN",
                label: "Poin-Poin Kunci",
                type: "textarea",
                placeholder:
                  "1. Pisahkan rekening pribadi & bisnis\n2. Gunakan software akuntansi\n3. ...",
                info: "Sebutkan poin-poin utama yang harus ada dalam konten.",
              },
              {
                name: "GAYA_BAHASA_KONTEN",
                label: "Gaya Bahasa dan Nada",
                type: "select",
                options: [
                  "Profesional",
                  "Santai & Ramah",
                  "Edukasi & Informatif",
                  "Menghibur",
                ],
                default: "Profesional",
                info: "Pilih tone yang sesuai dengan brand Anda.",
              },
            ],
            "Manajemen Media Sosial": [
              {
                name: "PLATFORM_TARGET",
                label: "Platform Media Sosial",
                type: "multiselect",
                options: [
                  "Instagram",
                  "TikTok",
                  "LinkedIn",
                  "X/Twitter",
                  "Facebook",
                ],
                default: ["Instagram", "LinkedIn"],
                info: "Pilih platform di mana Anda ingin aktif.",
              },
              {
                name: "TUJUAN_POSTING",
                label: "Tujuan Utama Posting",
                type: "select",
                options: [
                  "Meningkatkan Awareness",
                  "Mendorong Engagement",
                  "Memicu Konversi",
                ],
                default: "Meningkatkan Awareness",
                info: "Apa gol dari aktivitas media sosial Anda?",
              },
              {
                name: "DESKRIPSI_BRAND_MEDSOS",
                label: "Deskripsi Singkat Brand/Produk",
                type: "textarea",
                placeholder:
                  "Contoh: Kami adalah brand kopi spesialti yang fokus pada biji lokal.",
                info: "Berikan konteks tentang brand Anda untuk pembuatan konten.",
              },
            ],
            "Kampanye Pemasaran Email": [
              {
                name: "JENIS_KAMPANYE_EMAIL",
                label: "Jenis Kampanye Email",
                type: "select",
                options: [
                  "Welcome Email Series",
                  "Newsletter Bulanan",
                  "Email Promosi",
                  "Email Re-engagement",
                ],
                default: "Welcome Email Series",
                info: "Pilih jenis kampanye email yang ingin Anda buat.",
              },
              {
                name: "NAMA_BRAND_EMAIL",
                label: "Nama Brand Anda",
                type: "text",
                placeholder: "Contoh: Kopi Aroma Pagi",
                info: "Nama brand untuk personalisasi email.",
              },
              {
                name: "PENAWARAN_UTAMA_EMAIL",
                label: "Penawaran Utama (jika ada)",
                type: "text",
                placeholder: "Contoh: Diskon 20% untuk pembelian pertama",
                info: "Sebutkan insentif yang ingin ditawarkan.",
                optional: true,
              },
            ],
            "Peluncuran Produk & Kampanye": [
              {
                name: "NAMA_PRODUK_BARU",
                label: "Nama Produk/Kampanye Baru",
                type: "text",
                placeholder: "Contoh: Aplikasi TaskMaster Pro",
                info: "Nama resmi produk atau kampanye Anda.",
              },
              {
                name: "USP_PRODUK",
                label: "Unique Selling Proposition (USP)",
                type: "textarea",
                placeholder:
                  "Contoh: Satu-satunya aplikasi to-do-list dengan prediksi waktu selesai tugas.",
                info: "Apa yang membuat produk Anda unik dan lebih baik dari yang lain?",
              },
              {
                name: "ASET_KAMPANYE",
                label: "Aset Kampanye yang Dibutuhkan",
                type: "multiselect",
                options: [
                  "Siaran Pers (Press Release)",
                  "Email Pengumuman",
                  "Paket Konten Media Sosial",
                  "Draf Iklan Digital",
                ],
                default: ["Email Pengumuman", "Paket Konten Media Sosial"],
                info: "Pilih materi komunikasi yang ingin Anda hasilkan.",
              },
            ],
            "Riset Pasar & Analisis Kompetitor": [
              {
                name: "NAMA_BISNIS_RISET",
                label: "Nama Bisnis/Produk Anda",
                type: "text",
                placeholder: "Contoh: Kedai Kopi 'Aroma Pagi'",
                info: "Bisnis yang akan menjadi subjek analisis.",
              },
              {
                name: "DESKRIPSI_BISNIS_RISET",
                label: "Deskripsi Singkat Bisnis",
                type: "textarea",
                placeholder:
                  "Contoh: Kedai kopi di Jakarta Selatan yang fokus pada biji lokal dan suasana kerja nyaman.",
                info: "Berikan konteks untuk analisis SWOT.",
              },
              {
                name: "URL_KOMPETITOR_RISET",
                label: "URL atau Nama Kompetitor Utama",
                type: "textarea",
                placeholder: "https://www.kompetitor.com\nKopi Kenangan",
                info: "Sebutkan pemain utama lain di pasar Anda.",
                optional: true,
              },
              {
                name: "FOKUS_RISET",
                label: "Fokus Riset",
                type: "multiselect",
                options: [
                  "Analisis SWOT",
                  "Analisis Kompetitor",
                  "Pembuatan Buyer Persona",
                ],
                default: ["Analisis SWOT", "Analisis Kompetitor"],
                info: "Pilih jenis analisis yang Anda butuhkan.",
              },
            ],
            "Branding & Hubungan Masyarakat (PR)": [
              {
                name: "NAMA_BRAND_PR",
                label: "Nama Brand",
                type: "text",
                placeholder: "Contoh: EcoRun Shoes",
                info: "Brand yang akan dibangun citranya.",
              },
              {
                name: "NILAI_INTI_BRAND",
                label: "3 Nilai Inti Brand",
                type: "text",
                placeholder: "Contoh: Keberlanjutan, Performa, Komunitas",
                info: "Sebutkan 3 pilar utama brand Anda.",
              },
              {
                name: "TUGAS_BRANDING_PR",
                label: "Tugas Branding/PR",
                type: "select",
                options: [
                  "Platform Identitas Merek",
                  "Draf Siaran Pers",
                  "Rencana Komunikasi Krisis",
                ],
                default: "Platform Identitas Merek",
                info: "Pilih output yang Anda butuhkan.",
              },
            ],
            "Optimasi Penjualan & Konversi": [
              {
                name: "PRODUK_DIJUAL",
                label: "Produk/Layanan yang Dijual",
                type: "text",
                placeholder: "Contoh: Langganan software SaaS",
                info: "Apa yang Anda tawarkan kepada pelanggan?",
              },
              {
                name: "TARGET_PROSPEK",
                label: "Deskripsi Target Prospek",
                type: "textarea",
                placeholder:
                  "Contoh: Manajer marketing di perusahaan startup teknologi.",
                info: "Siapa yang ingin Anda jangkau dengan pesan penjualan ini?",
              },
              {
                name: "FOKUS_OPTIMASI_PENJUALAN",
                label: "Fokus Optimasi",
                type: "select",
                options: [
                  "Naskah Penjualan (Sales Script)",
                  "Copy Halaman Arahan (Landing Page)",
                  "Ide Lead Magnet",
                ],
                default: "Copy Halaman Arahan (Landing Page)",
                info: "Pilih aset penjualan yang ingin Anda buat.",
              },
            ],
          },
        },
        komponen_prompt: {
          PERAN:
            "Anda adalah seorang Ahli Strategi Pemasaran 360° yang serbaguna.",
          KONTEKS:
            "Pengguna memerlukan bantuan untuk tugas pemasaran: '{TUGAS_PEMASARAN_UTAMA}'. Anda harus memandu mereka untuk memberikan input yang relevan dan menghasilkan output yang dapat ditindaklanjuti.",
          TUGAS:
            "Berdasarkan tugas yang dipilih, gunakan input yang diberikan untuk menghasilkan output yang komprehensif dan profesional. Sesuaikan respons Anda dengan setiap sub-tugas yang dipilih pengguna.",
          "FORMAT OUTPUT":
            "Gunakan format Markdown. Sajikan output dalam format yang paling sesuai dengan tugas yang diminta (misalnya, laporan, draf konten, rencana, atau tabel). Pastikan output jelas, terstruktur, dan mudah dipahami.",
        },
        toolType: "planning",
        konteks_tambahan_instruksi_khusus:
          "Selalu prioritaskan strategi yang berpusat pada pelanggan. Berikan saran yang praktis dan dapat diimplementasikan. Jika ada ambiguitas, berikan asumsi yang cerdas atau ajukan pertanyaan klarifikasi.",
        contoh_kalimat:
          "Bantu saya membuat strategi SEO untuk website e-commerce saya.",
        output: "natural_language_prompt",
        crossValidationRules: [],
      },
    },
  },
  "Teks & Konten": {
    "Penulisan & Konten": {
      "Penulisan Artikel SEO": {
        description:
          "Buat konten artikel yang dioptimalkan untuk mesin pencari.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Artikel SEO yang akan membuat konten artikel yang dioptimalkan untuk mesin pencari.",
        components: [
          {
            name: "targetKeyword",
            label: "Kata Kunci Utama",
            type: "text",
            placeholder: "e.g., 'manfaat teh hijau'",
            info: "Kata kunci utama yang akan menjadi fokus artikel Anda. Ini penting untuk SEO.",
            validation: { min_length: 5 },
          },
          {
            name: "secondaryKeywords",
            label: "Kata Kunci Sekunder (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'antioksidan, kesehatan kulit'",
            info: "Kata kunci tambahan yang relevan untuk memperkaya isi artikel dan meningkatkan visibilitas SEO.",
            validation: { min_length: 3 },
          },
          {
            name: "targetAudience",
            label: "Target Audiens Artikel",
            type: "text",
            placeholder: "e.g., 'penggemar kesehatan, usia 25-40'",
            info: "Siapa yang akan membaca artikel ini?",
            validation: { min_length: 5 },
          },
          {
            name: "tone",
            label: "Gaya Bahasa Artikel",
            type: "select",
            options: [
              "Formal",
              "Kasual",
              "Informatif",
              "Persuasif",
              "Lucu",
              "Lainnya...",
            ],
            info: "Pilih nuansa tulisan yang diinginkan.",
          },
          {
            name: "wordCount",
            label: "Target Jumlah Kata",
            type: "number",
            placeholder: "e.g., 800",
            info: "Perkiraan panjang artikel yang Anda butuhkan.",
            validation: { min_value: 100, max_value: 5000 },
          },
          {
            name: "outline",
            label: "Kerangka Artikel (Opsional)",
            type: "textarea",
            placeholder: "H1: Judul Utama\n H2: Poin Pertama\n H3: Sub-poin...",
            info: "Berikan struktur atau poin-poin utama yang harus ada.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Jangan sebutkan brand kompetitor. Gunakan analogi dari dunia olahraga. Pastikan artikel diakhiri dengan pertanyaan untuk memancing komentar.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Blog Post": {
        description:
          "Buat draf blog post lengkap dengan fokus pada narasi dan storytelling, lebih dari sekadar SEO.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Storyteller Konten yang akan menyusun blog post.",
        components: [
          {
            name: "topic",
            label: "Topik Utama Blog",
            type: "text",
            placeholder:
              "e.g., 'Perjalanan saya mengatasi burnout sebagai developer'",
            info: "Judul atau ide utama yang ingin Anda eksplorasi.",
            validation: { min_length: 10 },
          },
          {
            name: "uniqueAngle",
            label: "Sudut Pandang Unik",
            type: "text",
            placeholder:
              "e.g., 'Bukan tips biasa, tapi cerita kegagalan & pembelajaran'",
            info: "Apa yang membuat blog post Anda berbeda dari yang lain?",
            validation: { min_length: 10 },
          },
          {
            name: "writerPersona",
            label: "Persona Penulis",
            type: "text",
            placeholder:
              "e.g., 'Seorang mentor yang berpengalaman, teman yang berbagi cerita'",
            info: "Dari sudut pandang siapa cerita ini ditulis?",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Target Pembaca",
            type: "text",
            placeholder: "e.g., 'Developer junior, pekerja kreatif'",
            info: "Siapa yang ingin Anda ajak bicara melalui tulisan ini?",
            validation: { min_length: 5 },
          },
          {
            name: "keyTakeaway",
            label: "Pesan Kunci untuk Pembaca",
            type: "text",
            placeholder:
              "e.g., 'Beristirahat bukanlah kemunduran, melainkan bagian dari proses'",
            info: "Satu hal yang harus diingat pembaca setelah selesai membaca.",
            validation: { min_length: 10 },
          },
          {
            name: "interactionPrompt",
            label: "Ajakan Interaksi di Akhir",
            type: "text",
            placeholder: "e.g., 'Bagikan pengalaman burnout Anda di komentar!'",
            info: "Pertanyaan atau ajakan untuk memancing diskusi.",
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Pembuat Studi Kasus (Case Study)": {
        description:
          "Ubah data dan hasil proyek menjadi narasi studi kasus yang persuasif dan profesional.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Analis Studi Kasus yang akan menyusun narasi studi kasus.",
        components: [
          {
            name: "clientName",
            label: "Nama Klien/Proyek",
            type: "text",
            placeholder: "e.g., 'Proyek Redesain untuk Kopi ABC'",
            info: "Subjek dari studi kasus ini.",
            validation: { min_length: 5 },
          },
          {
            name: "problem",
            label: "Masalah atau Tantangan Awal",
            type: "textarea",
            placeholder:
              "e.g., 'Klien mengalami penurunan penjualan online sebesar 30% karena website yang ketinggalan zaman dan sulit dinavigasi.'",
            info: "Jelaskan situasi awal yang dihadapi klien sebelum proyek dimulai.",
            validation: { min_length: 20 },
          },
          {
            name: "solution",
            label: "Solusi yang Diterapkan",
            type: "textarea",
            placeholder:
              "e.g., 'Kami melakukan riset pengguna, mendesain ulang UI/UX dengan fokus pada mobile-first, dan mengimplementasikan platform e-commerce baru.'",
            info: "Jelaskan langkah-langkah konkret yang Anda atau tim Anda lakukan untuk mengatasi masalah.",
            validation: { min_length: 20 },
          },
          {
            name: "results",
            label: "Hasil & Metrik Kuantitatif",
            type: "textarea",
            placeholder:
              "e.g., 'Peningkatan konversi 50%, penurunan bounce rate 40%, peningkatan waktu sesi 2 menit.'",
            info: "Sajikan hasil yang terukur dan berbasis data. Angka sangat penting di sini.",
            validation: { min_length: 20 },
          },
          {
            name: "clientQuote",
            label: "Kutipan dari Klien (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Kerja sama dengan tim ini mengubah bisnis kami!' - CEO Kopi ABC",
            info: "Testimoni singkat untuk menambah kredibilitas.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tulis dengan gaya formal dan berwibawa. Fokus pada bagaimana proses kolaboratif kami menjadi kunci keberhasilan. Buat judul yang menyoroti angka pencapaian terbesar.",
            info: "Instruksi tentang nada penulisan atau aspek tertentu yang ingin ditonjolkan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis White Paper/Laporan": {
        description:
          "Hasilkan dokumen laporan atau white paper yang informatif dan berwibawa berdasarkan data atau riset.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Laporan Korporat yang akan menyusun dokumen informatif.",
        components: [
          {
            name: "reportTitle",
            label: "Judul Laporan/White Paper",
            type: "text",
            placeholder: "e.g., 'Masa Depan AI dalam Industri Keuangan'",
            info: "Judul yang jelas dan profesional.",
            validation: { min_length: 10 },
          },
          {
            name: "mainThesis",
            label: "Tesis atau Argumen Utama",
            type: "text",
            placeholder:
              "e.g., 'AI akan secara fundamental mengubah manajemen risiko dan layanan pelanggan di sektor perbankan.'",
            info: "Satu kalimat yang merangkum poin utama dari laporan Anda.",
            validation: { min_length: 10 },
          },
          {
            name: "targetAudience",
            label: "Target Pembaca",
            type: "select",
            options: [
              "Eksekutif C-Level",
              "Manajer Teknis",
              "Akademisi/Peneliti",
              "Publik Umum",
              "Lainnya...",
            ],
            info: "Siapa audiens utama dokumen ini? Ini akan menentukan tingkat kedalaman teknis.",
          },
          {
            name: "supportingData",
            label: "Poin Data & Bukti Pendukung",
            type: "textarea",
            placeholder:
              "Tempelkan poin-poin data, hasil survei, statistik, atau kutipan riset di sini. Pisahkan dengan baris baru.",
            info: "Inti dari laporan Anda. Semakin banyak data konkret, semakin baik.",
            validation: { min_length: 20 },
          },
          {
            name: "structure",
            label: "Struktur Laporan (Opsional)",
            type: "textarea",
            placeholder:
              "e.g., '1. Ringkasan Eksekutif\n2. Pendahuluan\n3. Analisis Pasar\n4. Kesimpulan & Rekomendasi'",
            info: "Berikan kerangka yang diinginkan jika Anda punya.",
            optional: true,
            validation: { min_length: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan bahasa yang formal dan objektif. Sertakan bagian 'Rekomendasi' di akhir. Hindari spekulasi yang tidak didukung data.",
            info: "Instruksi tentang gaya, nada, atau bagian spesifik yang harus disertakan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Deskripsi Produk": {
        description:
          "Buat deskripsi produk yang menarik dan persuasif untuk e-commerce.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Copywriting Produk yang akan membuat deskripsi produk.",
        components: [
          {
            name: "productName",
            label: "Nama Produk",
            type: "text",
            placeholder: "e.g., 'Sepatu Lari Ultra-Light X1'",
            info: "Nama lengkap dan spesifik produk Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Target Pengguna Produk",
            type: "text",
            placeholder: "e.g., 'Pelari maraton, penggemar kebugaran'",
            info: "Siapa pembeli ideal untuk produk ini?",
            validation: { min_length: 5 },
          },
          {
            name: "usp",
            label: "Unique Selling Proposition (USP)",
            type: "text",
            placeholder: "e.g., 'Satu-satunya sepatu lari dengan sol grafena'",
            info: "Apa yang membuat produk ini unik dan lebih baik dari kompetitor?",
            validation: { min_length: 10 },
          },
          {
            name: "keyFeatures",
            label: "Fitur & Manfaat Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Bahan jaring berpori untuk sirkulasi udara maksimal, sol busa responsif yang mengembalikan energi, desain aerodinamis untuk kecepatan.'",
            info: "Jelaskan fitur dan terjemahkan menjadi manfaat bagi pengguna. Pisahkan dengan koma atau baris baru.",
            validation: { min_length: 20 },
          },
          {
            name: "brandVoice",
            label: "Gaya Bahasa Brand",
            type: "select",
            options: [
              "Mewah & Eksklusif",
              "Teknis & Detail",
              "Santai & Ramah",
              "Minimalis & Modern",
              "Lainnya...",
            ],
            info: "Pilih suara brand yang konsisten dengan produk Anda.",
          },
          {
            name: "length",
            label: "Panjang Deskripsi",
            type: "select",
            options: [
              "Singkat (1 paragraf)",
              "Sedang (2-3 paragraf)",
              "Detail (lebih dari 3 paragraf)",
              "Lainnya...",
            ],
            info: "Pilih panjang deskripsi sesuai kebutuhan platform e-commerce.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tonjolkan aspek 'ramah lingkungan' dari material yang digunakan. Sebutkan ada garansi 2 tahun. Hindari penggunaan superlatif seperti 'terbaik'.",
            info: "Informasi penting lainnya. Misalnya, detail garansi, material, atau hal yang perlu ditonjolkan secara implisit.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Naskah Podcast": {
        description:
          "Ubah ide atau poin-poin menjadi naskah podcast yang terstruktur, lengkap dengan intro, segmen, dan outro.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Naskah Podcast yang akan menyusun naskah.",
        components: [
          {
            name: "podcastTitle",
            label: "Judul Episode Podcast",
            type: "text",
            placeholder: "e.g., 'Episode 5: Seni Berkata Tidak'",
            info: "Judul yang menarik dan informatif untuk episode Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "hostPersona",
            label: "Persona Host",
            type: "text",
            placeholder:
              "e.g., 'Seorang ahli yang ramah, dua sahabat yang bercanda'",
            info: "Siapa yang berbicara dalam podcast ini?",
            validation: { min_length: 5 },
          },
          {
            name: "podcastFormat",
            label: "Format Podcast",
            type: "select",
            options: [
              "Monolog (Solo)",
              "Wawancara",
              "Diskusi Panel",
              "Storytelling Naratif",
              "Lainnya...",
            ],
            info: "Struktur umum dari episode podcast Anda.",
          },
          {
            name: "keySegments",
            label: "Segmen-segmen Kunci",
            type: "textarea",
            placeholder:
              "e.g., 'Intro & Hook\nSegmen 1: Mengapa sulit berkata tidak\nSegmen 2: Teknik praktis\nOutro & CTA'",
            info: "Pecah episode menjadi beberapa bagian atau topik bahasan.",
            validation: { min_length: 20 },
          },
          {
            name: "targetDuration",
            label: "Target Durasi (menit)",
            type: "number",
            placeholder: "e.g., 20",
            info: "Perkiraan panjang naskah yang dibutuhkan.",
            validation: { min_value: 1, max_value: 120 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Sertakan jeda musik di antara segmen. Naskah harus terasa seperti percakapan, bukan membaca. Akhiri dengan pertanyaan untuk pendengar.",
            info: "Instruksi tentang gaya bahasa, musik, atau elemen audio lainnya.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Halaman 'Tentang Kami'": {
        description:
          "Buat narasi yang menarik dan otentik untuk halaman 'Tentang Kami' di sebuah website.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Narator Brand yang akan menciptakan narasi 'Tentang Kami'.",
        components: [
          {
            name: "companyName",
            label: "Nama Perusahaan/Brand",
            type: "text",
            placeholder: "e.g., 'Warung Koding'",
            info: "Nama entitas yang akan diceritakan.",
            validation: { min_length: 5 },
          },
          {
            name: "missionStatement",
            label: "Misi Perusahaan",
            type: "textarea",
            placeholder:
              "e.g., 'Memberdayakan semua orang untuk bisa membuat website tanpa perlu coding.'",
            info: "Apa tujuan besar dan alasan keberadaan perusahaan Anda?",
            validation: { min_length: 20 },
          },
          {
            name: "originStory",
            label: "Cerita Awal Berdiri (Opsional)",
            type: "textarea",
            placeholder:
              "e.g., 'Dimulai dari garasi pada tahun 2020, kami frustrasi dengan betapa sulitnya...' ",
            info: "Cerita singkat tentang bagaimana semuanya dimulai. Ini menambah sentuhan personal.",
            optional: true,
            validation: { min_length: 20 },
          },
          {
            name: "coreValues",
            label: "Nilai-nilai Inti (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'Inovasi, Komunitas, Kesederhanaan'",
            info: "Prinsip-prinsip yang menjadi panduan perusahaan Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "tone",
            label: "Gaya Bahasa Halaman",
            type: "select",
            options: [
              "Profesional & Korporat",
              "Inspiratif & Visioner",
              "Rendah Hati & Personal",
              "Menyenangkan & Unik",
              "Lainnya...",
            ],
            info: "Pilih nada yang paling merepresentasikan budaya perusahaan Anda.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tulis dalam sudut pandang 'kami'. Sertakan satu paragraf tentang tim. Akhiri dengan ajakan untuk bergabung dengan komunitas kami.",
            info: "Elemen spesifik lain yang ingin Anda masukkan dalam cerita.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Alat Bantu Menulis": {
      "Asisten Pembuat Resume/CV": {
        description:
          "Buat poin-poin pencapaian yang kuat untuk resume atau CV Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Konsultan Karir yang akan menghasilkan poin-poin pencapaian untuk resume.",
        components: [
          {
            name: "jobTitle",
            label: "Posisi yang Dilamar",
            type: "text",
            placeholder: "e.g., 'Senior Software Engineer'",
            info: "Posisi spesifik yang Anda tuju akan menentukan fokus dari poin yang dibuat.",
            validation: { min_length: 5 },
          },
          {
            name: "experienceLevel",
            label: "Tingkat Pengalaman",
            type: "select",
            options: [
              "Fresh Graduate",
              "Junior",
              "Mid-level",
              "Senior",
              "Manager",
              "Lainnya...",
            ],
            info: "Tingkat pengalaman Anda saat ini.",
          },
          {
            name: "sectionToGenerate",
            label: "Bagian yang Akan Dibuat",
            type: "select",
            options: [
              "Ringkasan Profesional",
              "Poin Pengalaman Kerja",
              "Deskripsi Proyek",
              "Lainnya...",
            ],
            info: "Pilih bagian CV yang ingin Anda tulis atau perbaiki.",
          },
          {
            name: "keySkills",
            label: "Keterampilan Utama (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'React, Node.js, Agile'",
            info: "Skill teknis atau non-teknis yang paling relevan dengan posisi yang dilamar.",
            validation: { min_length: 5 },
          },
          {
            name: "achievements",
            label: "Deskripsi Tugas & Pencapaian",
            type: "textarea",
            placeholder:
              "e.g., 'Mengembangkan fitur X yang meningkatkan efisiensi sebesar 20%. Memimpin tim proyek Y.'",
            info: "Gunakan metrik dan angka untuk mengukur dampak. Gunakan metode STAR (Situation, Task, Action, Result) jika memungkinkan.",
            validation: { min_length: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan kata kerja aksi yang kuat (e.g., spearheaded, orchestrated, executed). Kuantifikasi semua pencapaian jika memungkinkan. Tulis dalam sudut pandang orang pertama.",
            info: "Instruksi spesifik tentang bagaimana AI harus menyusun kalimat atau kata-kata yang digunakan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Ulang & Parafraser": {
        description:
          "Ubah tulisan yang ada menjadi versi baru untuk menyederhanakan, mengubah gaya, atau menghindari plagiarisme.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Parafrase yang akan menulis ulang teks.",
        components: [
          {
            name: "originalText",
            label: "Teks Asli",
            type: "textarea",
            placeholder:
              "Tempelkan teks yang ingin Anda tulis ulang di sini...",
            info: "Semakin lengkap teks asli, semakin baik hasil parafrasenya.",
            validation: { min_length: 20 },
          },
          {
            name: "rewriteGoal",
            label: "Tujuan Penulisan Ulang",
            type: "select",
            options: [
              "Menyederhanakan Bahasa",
              "Membuat Lebih Formal",
              "Membuat Lebih Kasual",
              "Memperpanjang Teks",
              "Meringkas Teks",
              "Lainnya...",
            ],
            info: "Pilih hasil akhir yang Anda inginkan dari teks baru.",
          },
          {
            name: "targetAudience",
            label: "Target Audiens Baru",
            type: "text",
            placeholder: "e.g., 'Anak-anak usia 10-12 tahun, eksekutif bisnis'",
            info: "Siapa yang akan membaca teks baru ini? This will affect word choice.",
            validation: { min_length: 5 },
          },
          {
            name: "keywordsToKeep",
            label: "Kata Kunci yang Harus Dipertahankan",
            type: "text",
            placeholder: "e.g., 'fotosintesis, klorofil'",
            info: "Istilah penting atau nama brand yang tidak boleh diubah atau dihilangkan.",
            optional: true,
          },
          {
            name: "styleToEmulate",
            label: "Tiru Gaya Penulisan (Opsional)",
            type: "text",
            placeholder: "e.g., 'Seperti artikel di Harvard Business Review'",
            info: "Sebutkan contoh penulis atau publikasi yang gayanya ingin ditiru.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Hindari kalimat pasif. Pertahankan struktur paragraf asli. Ganti jargon teknis dengan analogi yang mudah dipahami.",
            info: "Instruksi tentang perubahan spesifik yang diinginkan pada struktur, gaya, atau konten.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Pemeriksa & Penyempurna Gaya Bahasa": {
        description:
          "Perbaiki tulisan yang ada agar lebih jelas, ringkas, kuat, dan berdampak.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Editor Gaya Bahasa yang akan menganalisis dan menyempurnakan tulisan.",
        components: [
          {
            name: "originalText",
            label: "Teks Asli",
            type: "textarea",
            placeholder:
              "Tempelkan paragraf atau tulisan yang ingin disempurnakan di sini.",
            info: "AI akan menganalisis dan memberikan saran perbaikan, bukan menulis ulang total.",
            validation: { min_length: 20 },
          },
          {
            name: "improvementGoal",
            label: "Fokus Penyempurnaan",
            type: "select",
            options: [
              "Meningkatkan Kejelasan & Keringkasan",
              "Membuat Lebih Persuasif",
              "Menguatkan Gaya Bahasa",
              "Memeriksa Alur & Logika",
              "Lainnya...",
            ],
            info: "Pilih aspek utama yang ingin Anda perbaiki dari tulisan ini.",
          },
          {
            name: "targetAudience",
            label: "Target Pembaca",
            type: "text",
            placeholder: "e.g., 'Tim internal, klien potensial, pembaca umum'",
            info: "Mengetahui audiens membantu AI memberikan saran yang lebih relevan.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Pertahankan nada yang ramah. Ganti semua kalimat pasif menjadi aktif. Tawarkan alternatif untuk kata-kata yang terlalu sering digunakan.",
            info: "Instruksi spesifik tentang jenis perbaikan yang Anda cari.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Judul & Headline": {
        description:
          "Dapatkan beberapa opsi judul yang menarik (click-worthy) untuk artikel, blog, email, atau video.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Kreator Headline yang akan menghasilkan berbagai opsi judul.",
        components: [
          {
            name: "mainTopic",
            label: "Topik Utama Konten",
            type: "text",
            placeholder: "e.g., 'Tips produktivitas kerja dari rumah'",
            info: "Jelaskan secara singkat isi dari konten Anda.",
            validation: { min_length: 5, max_length: 50 },
          },
          {
            name: "keywords",
            label: "Kata Kunci yang Harus Ada",
            type: "text",
            placeholder: "e.g., 'WFH, produktivitas'",
            info: "Kata atau frasa yang wajib ada di dalam judul.",
            validation: { min_length: 3 },
          },
          {
            name: "headlineStyle",
            label: "Gaya Headline",
            type: "select",
            options: [
              "Berbasis Angka (e.g., 7 Cara...)",
              "Berbasis Manfaat (e.g., Dapatkan...)",
              "Berbasis Pertanyaan (e.g., Apakah Anda...)",
              "Membangkitkan Rasa Penasaran",
              "Langsung & Jelas",
              "Provokatif",
              "Lainnya...",
            ],
            info: "Pilih pendekatan psikologis yang ingin Anda gunakan.",
          },
          {
            name: "numberOfOptions",
            label: "Jumlah Opsi Judul",
            type: "number",
            placeholder: "e.g., 5",
            info: "Berapa banyak alternatif judul yang ingin Anda hasilkan?",
            validation: { min_value: 1, max_value: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Judul tidak boleh lebih dari 70 karakter. Target audiens adalah pemula. Hindari clickbait yang berlebihan.",
            info: "Batasan atau panduan spesifik lainnya untuk pembuatan judul.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator FAQ (Frequently Asked Questions)": {
        description:
          "Buat daftar pertanyaan yang sering diajukan (FAQ) secara otomatis dari sebuah blok teks atau deskripsi.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis FAQ yang akan menghasilkan pertanyaan dan jawaban.",
        components: [
          {
            name: "sourceText",
            label: "Teks Sumber atau Deskripsi Produk",
            type: "textarea",
            placeholder:
              "Tempelkan teks lengkap, deskripsi produk, atau artikel di sini...",
            info: "AI akan menganalisis teks ini untuk membuat pertanyaan dan jawaban yang relevan.",
            validation: { min_length: 20 },
          },
          {
            name: "targetAudience",
            label: "Target Audiens FAQ",
            type: "text",
            placeholder:
              "e.g., 'Pelanggan baru, developer, pengguna non-teknis'",
            info: "Siapa yang akan membaca FAQ ini? Ini mempengaruhi kompleksitas jawaban.",
            validation: { min_length: 5 },
          },
          {
            name: "questionStyle",
            label: "Gaya Pertanyaan",
            type: "select",
            options: [
              "Langsung & Jelas",
              "Berbasis Masalah Pengguna",
              "Membangkitkan Rasa Ingin Tahu",
              "Lainnya...",
            ],
            info: "Pilih bagaimana pertanyaan harus dirumuskan.",
          },
          {
            name: "answerStyle",
            label: "Gaya Jawaban",
            type: "select",
            options: [
              "Singkat & Langsung ke Poin",
              "Detail & Langkah-demi-Langkah",
              "Ramah & Percakapan",
              "Lainnya...",
            ],
            info: "Pilih bagaimana jawaban harus disampaikan.",
          },
          {
            name: "faqCount",
            label: "Jumlah Pertanyaan (Opsional)",
            type: "number",
            placeholder: "e.g., 5",
            info: "Jumlah pasangan tanya-jawab yang ingin Anda hasilkan.",
            optional: true,
            validation: { min_value: 1, max_value: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Fokus pada pertanyaan tentang kebijakan pengembalian dan garansi. Hindari jawaban yang terlalu teknis. Pastikan satu pertanyaan tentang kompatibilitas.",
            info: "Berikan instruksi spesifik untuk memandu pembuatan FAQ.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Peringkas Teks & Artikel": {
        description:
          "Ambil teks panjang (artikel, laporan, email) dan rangkum menjadi poin-poin kunci atau paragraf singkat.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Ringkasan yang akan mengekstrak ide-ide utama dari teks.",
        components: [
          {
            name: "originalText",
            label: "Teks Asli yang Akan Diringkas",
            type: "textarea",
            placeholder:
              "Tempelkan seluruh teks di sini. Semakin panjang dan terstruktur, semakin baik hasilnya.",
            info: "AI akan membaca dan mengekstrak ide-ide utama dari teks ini.",
            validation: { min_length: 50 },
          },
          {
            name: "summaryLength",
            label: "Panjang Ringkasan yang Diinginkan",
            type: "select",
            options: [
              "Sangat Singkat (1-2 kalimat)",
              "Ringkasan Poin-poin",
              "Paragraf Singkat",
              "Lainnya...",
            ],
            info: "Pilih format dan panjang output yang paling sesuai kebutuhan Anda.",
          },
          {
            name: "focus",
            label: "Fokus Ringkasan (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Fokus pada dampak finansial', 'Hanya rangkum bagian kesimpulan'",
            info: "Beri tahu AI jika ada bagian atau aspek tertentu dari teks yang lebih penting.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tulis ringkasan untuk audiens non-teknis. Pertahankan semua angka dan statistik. Jangan menyertakan opini dari teks asli, hanya fakta.",
            info: "Instruksi spesifik tentang gaya atau konten dari ringkasan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
        crossValidationRules: [
          {
            triggerField: "aspectRatio",
            triggerValue: "Lainnya...",
            dependentField: "customAspectRatio",
            validationType: "required",
            errorMessage:
              "'Rasio Aspek Kustom' wajib diisi jika 'Rasio Aspek' adalah 'Lainnya...'.",
          },
        ],
      },
      "Generator Meta Deskripsi SEO": {
        description:
          "Buat meta deskripsi yang menarik dan kaya kata kunci (<160 karakter) untuk halaman web.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis SEO On-Page yang akan membuat meta deskripsi.",
        components: [
          {
            name: "pageTitle",
            label: "Judul Halaman",
            type: "text",
            placeholder: "e.g., 'Panduan Lengkap Teh Hijau untuk Kesehatan'",
            info: "Judul halaman web Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "mainKeyword",
            label: "Kata Kunci Utama Halaman",
            type: "text",
            placeholder: "e.g., 'manfaat teh hijau'",
            info: "Kata kunci yang paling ingin Anda rangking di Google.",
            validation: { min_length: 3 },
          },
          {
            name: "pageSummary",
            label: "Ringkasan Singkat Isi Halaman",
            type: "textarea",
            placeholder:
              "Jelaskan secara singkat apa isi halaman ini. Apa yang akan didapatkan pengunjung?",
            info: "Berikan AI konteks tentang isi halaman agar deskripsi relevan.",
            validation: { min_length: 20 },
          },
          {
            name: "callToAction",
            label: "Ajakan Bertindak (Call-to-Action)",
            type: "text",
            placeholder:
              "e.g., 'Pelajari lebih lanjut!', 'Temukan faktanya di sini!'",
            info: "Dorong pengguna untuk mengklik hasil pencarian Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan nada yang membangkitkan rasa penasaran. Pastikan kata kunci utama ada di awal kalimat. Jangan lebih dari 155 karakter.",
            info: "Batasan teknis atau gaya penulisan yang spesifik.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Komunikasi Profesional": {
      "Email Marketing": {
        description: "Hasilkan naskah email untuk kampanye pemasaran.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Pemasaran Email yang akan menghasilkan naskah email.",
        components: [
          {
            name: "objective",
            label: "Tujuan Email",
            type: "text",
            placeholder: "e.g., 'promo produk baru, newsletter bulanan'",
            info: "Apa hasil yang diharapkan dari email ini?",
            validation: { min_length: 5 },
          },
          {
            name: "productName",
            label: "Nama Produk/Layanan",
            type: "text",
            placeholder: "e.g., 'Langganan Premium Aplikasi X'",
            info: "Fokus utama yang ditawarkan dalam email.",
            validation: { min_length: 5 },
          },
          {
            name: "recipientSegment",
            label: "Segmen Penerima",
            type: "text",
            placeholder: "e.g., 'pelanggan setia, pengguna baru'",
            info: "Jelaskan segmen penerima untuk personalisasi. (Contoh: pengguna yang belum membeli, pelanggan VIP).",
            validation: { min_length: 5 },
          },
          {
            name: "senderPersona",
            label: "Persona Pengirim",
            type: "text",
            placeholder: "e.g., 'CEO, Tim Marketing, Sahabat Brand'",
            info: "Dari sudut pandang siapa email ini ditulis.",
            validation: { min_length: 5 },
          },
          {
            name: "callToAction",
            label: "Call To Action (CTA)",
            type: "text",
            placeholder: "e.g., 'Beli Sekarang, Pelajari Lebih Lanjut'",
            info: "Tindakan spesifik yang Anda ingin penerima lakukan.",
            validation: { min_length: 5 },
          },
          {
            name: "tone",
            label: "Gaya Bahasa Email",
            type: "select",
            options: [
              "Profesional",
              "Ramah",
              "Mendesak",
              "Antusias",
              "Inspiratif",
              "Lainnya...",
            ],
            info: "Nuansa pesan yang ingin disampaikan dalam email.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Ciptakan rasa urgensi tapi jangan terkesan memaksa. Sebutkan bahwa penawaran ini eksklusif untuk segmen penerima ini. Jangan gunakan emoji.",
            info: "Instruksi khusus untuk AI. Misalnya, target emosi tertentu, atau hal yang harus dihindari.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Email Profesional": {
        description:
          "Buat draf email yang jelas dan efektif untuk berbagai skenario bisnis sehari-hari.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Asisten Komunikasi Profesional yang akan menyusun draf email.",
        components: [
          {
            name: "scenario",
            label: "Skenario Email",
            type: "select",
            options: [
              "Permintaan Informasi",
              "Follow-up Setelah Rapat",
              "Perkenalan Diri/Jaringan",
              "Mengajukan Pertemuan",
              "Ucapan Terima Kasih",
              "Lainnya...",
            ],
            info: "Pilih tujuan utama dari email Anda.",
          },
          {
            name: "recipient",
            label: "Penerima Email",
            type: "text",
            placeholder:
              "e.g., 'Manajer Pemasaran, Calon Klien, Kolega dari departemen lain'",
            info: "Jelaskan siapa penerima dan apa hubungan Anda dengan mereka.",
            validation: { min_length: 5 },
          },
          {
            name: "keyInfo",
            label: "Informasi Kunci yang Harus Disampaikan",
            type: "textarea",
            placeholder:
              "e.g., 'Meminta data penjualan Q3. Mengusulkan jadwal rapat hari Selasa atau Rabu sore. Melampirkan presentasi yang dibahas.'",
            info: "Sebutkan semua poin penting yang harus ada dalam isi email.",
            validation: { min_length: 20 },
          },
          {
            name: "tone",
            label: "Tingkat Formalitas",
            type: "select",
            options: [
              "Sangat Formal",
              "Profesional Standar",
              "Semi-Formal",
              "Santai & Ramah",
              "Lainnya...",
            ],
            info: "Sesuaikan nada email dengan budaya perusahaan dan hubungan Anda dengan penerima.",
          },
          {
            name: "desiredAction",
            label: "Tindakan yang Diharapkan dari Penerima",
            type: "text",
            placeholder: "e.g., 'Memberikan feedback pada dokumen terlampir'",
            info: "Apa yang Anda ingin penerima lakukan setelah membaca email ini?",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat email se-ringkas mungkin. Tawarkan untuk menjelaskan lebih lanjut melalui telepon. Sebutkan bahwa tenggat waktu untuk ini adalah hari Jumat.",
            info: "Instruksi lain yang relevan, seperti urgensi atau informasi latar belakang.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Respon Ulasan Pelanggan": {
        description:
          "Buat balasan yang profesional dan empatik untuk ulasan pelanggan (positif maupun negatif).",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Manajer Hubungan Pelanggan yang akan menghasilkan balasan.",
        components: [
          {
            name: "originalReview",
            label: "Teks Ulasan Pelanggan",
            type: "textarea",
            placeholder: "Tempelkan ulasan lengkap dari pelanggan di sini.",
            info: "AI akan menganalisis teks ini untuk membuat balasan yang relevan.",
            validation: { min_length: 20 },
          },
          {
            name: "sentiment",
            label: "Sentimen Ulasan",
            type: "select",
            options: [
              "Sangat Positif",
              "Positif",
              "Netral",
              "Negatif",
              "Sangat Negatif",
              "Lainnya...",
            ],
            info: "Bagaimana perasaan pelanggan dalam ulasan tersebut?",
          },
          {
            name: "businessName",
            label: "Nama Bisnis/Produk Anda",
            type: "text",
            placeholder: "e.g., 'Restoran Lezat'",
            info: "Nama yang akan digunakan dalam balasan (misal, 'Terima kasih telah berkunjung ke...').",
            validation: { min_length: 5 },
          },
          {
            name: "solutionOffered",
            label: "Solusi yang Ditawarkan (jika ulasan negatif)",
            type: "text",
            placeholder:
              "e.g., 'Menawarkan voucher, mengundang kembali, menghubungi via email'",
            info: "Langkah konkret apa yang Anda ambil untuk menyelesaikan masalah pelanggan?",
            optional: true,
          },
          {
            name: "tone",
            label: "Gaya Bahasa Balasan",
            type: "select",
            options: [
              "Profesional & Korporat",
              "Hangat & Personal",
              "Cepat & Efisien",
              "Penuh Empati & Pengertian",
              "Lainnya...",
            ],
            info: "Pilih nada yang paling sesuai dengan citra brand Anda.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Sebutkan nama pelanggan jika ada. Ajak pelanggan untuk menghubungi layanan pelanggan secara pribadi. Jangan terdengar defensif. Untuk ulasan positif, tanyakan apa hidangan favorit mereka.",
            info: "Instruksi spesifik tentang apa yang harus atau tidak boleh dikatakan dalam balasan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Naskah Pidato/Presentasi": {
        description:
          "Susun kerangka atau naskah lengkap untuk pidato yang terstruktur dan meyakinkan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Konsultan Pidato yang akan menyusun naskah.",
        components: [
          {
            name: "audienceProfile",
            label: "Profil Audiens",
            type: "text",
            placeholder:
              "e.g., 'Investor teknologi, mahasiswa baru, kolega internal'",
            info: "Memahami audiens adalah kunci. Apa latar belakang dan tingkat pengetahuan mereka?",
            validation: { min_length: 5 },
          },
          {
            name: "coreMessage",
            label: "Pesan Inti (Satu Kalimat)",
            type: "text",
            placeholder:
              "e.g., 'Inovasi berkelanjutan adalah kunci untuk relevansi pasar.'",
            info: "Jika audiens hanya boleh mengingat satu hal, apa itu?",
            validation: { min_length: 10 },
          },
          {
            name: "deliveryStyle",
            label: "Gaya Penyampaian",
            type: "select",
            options: [
              "Inspiratif & Penuh Semangat",
              "Informatif & Berbasis Data",
              "Persuasif & Meyakinkan",
              "Santai & Bercerita",
              "Lainnya...",
            ],
            info: "Pilih nuansa yang paling sesuai dengan pesan dan audiens Anda.",
          },
          {
            name: "duration",
            label: "Target Durasi (menit)",
            type: "number",
            placeholder: "e.g., 15",
            info: "Perkiraan waktu akan menentukan tingkat kedalaman dan jumlah poin.",
            validation: { min_value: 1, max_value: 60 },
          },
          {
            name: "keyPoints",
            label: "Poin-Poin Utama (Opsional)",
            type: "textarea",
            placeholder:
              "e.g., 'Poin 1: Masalah saat ini.\nPoin 2: Solusi yang kami tawarkan.\nPoin 3: Visi masa depan.'",
            info: "Sebutkan poin-poin kunci yang harus ada dalam struktur pidato.",
            optional: true,
            validation: { min_length: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Mulai dengan sebuah cerita pribadi. Sertakan satu kutipan dari tokoh terkenal. Akhiri dengan ajakan bertindak yang jelas. Hindari jargon teknis.",
            info: "Instruksi spesifik tentang elemen pembuka, penutup, atau gaya bahasa.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Surat Lamaran (Cover Letter Writer)": {
        description:
          "Buat surat lamaran kerja yang personal dan meyakinkan untuk posisi spesifik.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Lamaran Kerja yang akan membuat surat lamaran.",
        components: [
          {
            name: "jobTitle",
            label: "Posisi yang Dilamar",
            type: "text",
            placeholder: "e.g., 'Digital Marketing Specialist'",
            info: "Nama jabatan persis seperti yang tertulis di lowongan.",
            validation: { min_length: 5 },
          },
          {
            name: "companyName",
            label: "Nama Perusahaan",
            type: "text",
            placeholder: "e.g., 'PT Inovasi Digital'",
            info: "Perusahaan yang Anda tuju.",
            validation: { min_length: 5 },
          },
          {
            name: "keyRequirements",
            label: "Kualifikasi Utama dari Lowongan",
            type: "textarea",
            placeholder:
              "Salin-tempel poin-poin kualifikasi utama dari iklan lowongan kerja di sini. Contoh: 'Pengalaman 3 tahun di SEO', 'Menguasai Google Analytics'.",
            info: "Ini adalah bagian terpenting. AI akan menggunakan ini untuk menyesuaikan surat Anda.",
            validation: { min_length: 20 },
          },
          {
            name: "mySkillsAndExperience",
            label: "Pengalaman & Keterampilan Relevan Saya",
            type: "textarea",
            placeholder:
              "e.g., 'Saya telah mengelola kampanye SEO untuk klien e-commerce selama 4 tahun dan berhasil meningkatkan trafik organik sebesar 150%.'",
            info: "Hubungkan pengalaman Anda secara langsung dengan apa yang dicari perusahaan.",
            validation: { min_length: 20 },
          },
          {
            name: "companyKnowledge",
            label: "Pengetahuan Tentang Perusahaan (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Saya terkesan dengan peluncuran produk X baru-baru ini.'",
            info: "Tunjukkan bahwa Anda melakukan riset. Sebutkan proyek, nilai, atau berita terbaru tentang perusahaan.",
            optional: true,
          },
          {
            name: "tone",
            label: "Gaya Bahasa Surat",
            type: "select",
            options: [
              "Profesional & Langsung",
              "Antusias & Penuh Semangat",
              "Kreatif & Menonjol",
              "Formal & Hormat",
              "Lainnya...",
            ],
            info: "Sesuaikan dengan budaya perusahaan yang Anda persepsikan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tonjolkan pengalaman saya dalam memimpin tim. Sebutkan bahwa saya adalah seorang pembelajar yang cepat. Buat agar surat tidak lebih dari 4 paragraf.",
            info: "Instruksi lain yang relevan, seperti panjang surat atau aspek tertentu yang ingin ditonjolkan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Ringkasan Rapat (Meeting Summarizer)": {
        description:
          "Ubah transkrip atau catatan rapat yang panjang menjadi ringkasan yang padat dan berisi daftar tindakan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Notulis Rapat yang akan menghasilkan ringkasan.",
        components: [
          {
            name: "meetingTranscript",
            label: "Transkrip atau Catatan Rapat",
            type: "textarea",
            placeholder:
              "Tempelkan seluruh transkrip atau catatan detail rapat di sini...",
            info: "Semakin detail inputnya, semakin akurat ringkasannya.",
            validation: { min_length: 50 },
          },
          {
            name: "attendees",
            label: "Daftar Peserta (Opsional)",
            type: "text",
            placeholder: "e.g., 'Andi, Budi (Marketing), Citra (Teknik)'",
            info: "Membantu AI mengidentifikasi siapa mengatakan apa dan siapa yang bertanggung jawab.",
            optional: true,
          },
          {
            name: "summaryStyle",
            label: "Gaya Ringkasan",
            type: "select",
            options: [
              "Poin-Poin Utama",
              "Paragraf Naratif",
              "Tabel Keputusan & Tindakan",
              "Lainnya...",
            ],
            info: "Pilih format output yang paling sesuai dengan kebutuhan Anda.",
          },
          {
            name: "keyTopics",
            label: "Topik Utama yang Dibahas (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Anggaran Q4, Peluncuran Produk Baru, Umpan Balik Klien'",
            info: "Bantu AI untuk fokus pada bagian terpenting dari diskusi.",
            optional: true,
          },
          {
            name: "actionItemsToExtract",
            label: "Fokus Ekstraksi 'Action Items'",
            type: "select",
            options: ["Ya, ekstrak dengan detail", "Tidak perlu", "Lainnya..."],
            info: "Minta AI untuk secara khusus mencari, mengumpulkan, dan mendaftar semua tugas, penanggung jawab, dan tenggat waktu.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Abaikan bagian obrolan santai di awal rapat. Fokus hanya pada keputusan yang dibuat setelah menit ke-10. Tulis ringkasan dalam sudut pandang orang ketiga.",
            info: "Instruksi spesifik tentang bagian mana yang harus difokuskan atau diabaikan oleh AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Penulis Memo & Pengumuman Internal": {
        description:
          "Buat pengumuman internal perusahaan yang jelas, ringkas, dan profesional untuk berbagai keperluan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Komunikasi Internal yang akan membuat pengumuman.",
        components: [
          {
            name: "subject",
            label: "Subjek Memo/Pengumuman",
            type: "text",
            placeholder: "e.g., 'Perubahan Kebijakan Kerja Jarak Jauh'",
            info: "Judul yang jelas dan langsung ke intinya.",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Ditujukan Kepada",
            type: "text",
            placeholder: "e.g., 'Semua Karyawan', 'Tim Pemasaran'",
            info: "Siapa penerima pesan ini?",
            validation: { min_length: 5 },
          },
          {
            name: "keyInformation",
            label: "Informasi Kunci yang Disampaikan",
            type: "textarea",
            placeholder:
              "e.g., 'Mulai 1 Agustus, kebijakan WFH menjadi 3 hari di kantor, 2 hari di rumah. Alasan: meningkatkan kolaborasi.'",
            info: "Sebutkan poin-poin utama pengumuman secara jelas.",
            validation: { min_length: 20 },
          },
          {
            name: "effectiveDate",
            label: "Tanggal Efektif",
            type: "text",
            placeholder: "e.g., 'Senin, 1 Agustus 2024'",
            info: "Kapan perubahan atau pengumuman ini mulai berlaku?",
            validation: { min_length: 5 },
          },
          {
            name: "sender",
            label: "Pengirim/Departemen",
            type: "text",
            placeholder: "e.g., 'Departemen HR', 'Manajemen'",
            info: "Siapa yang bertanggung jawab atas pengumuman ini?",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan nada yang formal namun suportif. Sertakan link ke dokumen kebijakan lengkap. Sediakan kontak person untuk pertanyaan lebih lanjut.",
            info: "Detail tambahan untuk memastikan pesan tersampaikan dengan baik.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator 'Icebreaker' untuk Rapat": {
        description:
          "Ciptakan pertanyaan atau topik pembuka yang menarik untuk mencairkan suasana di awal rapat.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Fasilitator Rapat yang akan menciptakan pertanyaan icebreaker.",
        components: [
          {
            name: "meetingContext",
            label: "Konteks Rapat",
            type: "text",
            placeholder:
              "e.g., 'Rapat mingguan tim', 'Sesi brainstorming proyek baru'",
            info: "Jenis rapat akan menentukan jenis icebreaker yang cocok.",
            validation: { min_length: 5 },
          },
          {
            name: "teamProfile",
            label: "Profil Tim",
            type: "text",
            placeholder:
              "e.g., 'Tim teknis yang introvert, tim kreatif yang ekstrovert'",
            info: "Karakter umum dari peserta rapat.",
            validation: { min_length: 5 },
          },
          {
            name: "icebreakerType",
            label: "Jenis Icebreaker",
            type: "select",
            options: [
              "Pertanyaan Ringan & Lucu",
              "Pertanyaan untuk Mengenal Lebih Dalam",
              "Terkait Pekerjaan tapi Santai",
              "Permainan Cepat (e.g., Dua Kebenaran Satu Kebohongan)",
              "Lainnya...",
            ],
            info: "Pilih jenis interaksi yang Anda inginkan.",
          },
          {
            name: "timeLimit",
            label: "Batasan Waktu (menit)",
            type: "number",
            placeholder: "e.g., 5",
            info: "Berapa lama sesi icebreaker ini akan berlangsung?",
            validation: { min_value: 1, max_value: 30 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Hindari pertanyaan yang terlalu personal. Pastikan icebreaker relevan dengan tema rapat. Buat agar bisa dilakukan secara online.",
            info: "Batasan atau panduan lain untuk memastikan icebreaker berjalan lancar.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Pemasaran & Penjualan": {
      "Generator Skrip Video Sales Letter (VSL)": {
        description:
          "Buat skrip video penjualan yang mengikuti formula copywriting terbukti untuk memaksimalkan konversi.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Skrip Penjualan yang akan membuat skrip VSL.",
        components: [
          {
            name: "productName",
            label: "Nama Produk/Layanan",
            type: "text",
            placeholder: "e.g., 'Kursus Online 'Master of Code''",
            info: "Produk yang Anda jual.",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Target Penonton VSL",
            type: "text",
            placeholder:
              "e.g., 'Orang yang ingin beralih karir menjadi programmer'",
            info: "Siapa audiens ideal yang akan menonton video ini?",
            validation: { min_length: 5 },
          },
          {
            name: "hook",
            label: "Hook (Pembuka yang Menarik)",
            type: "textarea",
            placeholder:
              "e.g., 'Sebuah statistik mengejutkan, pertanyaan retoris yang provokatif, atau sebuah janji besar.'",
            info: "Bagaimana cara Anda merebut perhatian penonton dalam 5 detik pertama?",
            validation: { min_length: 20 },
          },
          {
            name: "problem",
            label: "Masalah & Penderitaan Audiens",
            type: "textarea",
            placeholder:
              "e.g., 'Merasa terjebak di pekerjaan yang tidak memuaskan? Khawatir dengan masa depan karir?'",
            info: "Jelaskan masalah yang dihadapi audiens yang bisa diselesaikan oleh produk Anda.",
            validation: { min_length: 20 },
          },
          {
            name: "solution",
            label: "Produk Anda sebagai Solusi",
            type: "textarea",
            placeholder:
              "e.g., 'Kursus kami adalah jembatan menuju karir impian Anda, memberikan peta jalan yang jelas...'",
            info: "Perkenalkan produk Anda sebagai solusi dari masalah mereka.",
            validation: { min_length: 20 },
          },
          {
            name: "offer",
            label: "Penawaran Spesifik",
            type: "textarea",
            placeholder:
              "e.g., 'Akses seumur hidup ke semua modul, bonus e-book, komunitas eksklusif. Harga diskon 50% hanya untuk 24 jam.'",
            info: "Jelaskan secara detail apa yang akan mereka dapatkan dan urgensinya.",
            validation: { min_length: 20 },
          },
          {
            name: "callToAction",
            label: "Call to Action (CTA)",
            type: "text",
            placeholder: "e.g., 'Klik tombol di bawah ini sekarang juga!'",
            info: "Perintah akhir yang spesifik dan mendesak.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan nada yang sangat empatik di bagian 'masalah'. Buat penawaran terasa sangat bernilai. Ulangi CTA sebanyak 3 kali di akhir.",
            info: "Instruksi tentang gaya penyampaian, emosi yang ditargetkan, atau struktur VSL.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Pembuat Proposisi Nilai (Value Proposition)": {
        description:
          "Rumuskan pernyataan yang jelas dan ringkas tentang mengapa pelanggan harus memilih produk Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Strategis Nilai Produk yang akan merumuskan proposisi nilai.",
        components: [
          {
            name: "productName",
            label: "Nama Produk/Layanan",
            type: "text",
            placeholder: "e.g., 'Aplikasi FinTrack'",
            info: "Fokus dari proposisi nilai ini.",
            validation: { min_length: 5 },
          },
          {
            name: "targetCustomer",
            label: "Segmen Pelanggan Target",
            type: "text",
            placeholder: "e.g., 'Freelancer, pemilik usaha kecil'",
            info: "Untuk siapa produk ini diciptakan?",
            validation: { min_length: 5 },
          },
          {
            name: "customerProblem",
            label: "Masalah yang Diselesaikan",
            type: "textarea",
            placeholder:
              "e.g., 'Kesulitan melacak pengeluaran bisnis dan pribadi secara terpisah, membuang waktu saat musim pajak.'",
            info: "Jelaskan 'penderitaan' yang dialami pelanggan.",
            validation: { min_length: 20 },
          },
          {
            name: "mainBenefit",
            label: "Manfaat Utama yang Ditawarkan",
            type: "textarea",
            placeholder:
              "e.g., 'Memberikan kejelasan finansial dan menghemat waktu berjam-jam dengan pelaporan otomatis.'",
            info: "Bagaimana produk Anda membuat hidup mereka lebih baik?",
            validation: { min_length: 20 },
          },
          {
            name: "differentiator",
            label: "Pembeda dari Kompetitor",
            type: "text",
            placeholder:
              "e.g., 'Satu-satunya aplikasi dengan integrasi AI untuk prediksi arus kas.'",
            info: "Apa yang membuat Anda unik dan lebih baik dari yang lain?",
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat dalam format: 'Untuk [pelanggan], yang [masalah], produk kami [solusi] tidak seperti [kompetitor].' Fokus pada kesederhanaan.",
            info: "Instruksi tentang format atau kata-kata kunci yang ingin digunakan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Konten Pilar & Klaster Topik": {
        description:
          "Rencanakan strategi konten SEO dengan mengidentifikasi satu topik pilar utama dan beberapa klaster topik pendukungnya.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Arsitek Konten SEO yang akan merencanakan strategi konten.",
        components: [
          {
            name: "mainTheme",
            label: "Tema Utama Bisnis/Website",
            type: "text",
            placeholder: "e.g., 'Hidup Sehat Organik'",
            info: "Topik luas yang menjadi payung dari semua konten Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Target Audiens",
            type: "text",
            placeholder: "e.g., 'Ibu muda yang peduli kesehatan keluarga'",
            info: "Siapa yang ingin Anda jangkau dengan konten ini?",
            validation: { min_length: 5 },
          },
          {
            name: "pillarTopic",
            label: "Ide Topik Pilar",
            type: "text",
            placeholder: "e.g., 'Panduan Lengkap Memulai Diet Organik'",
            info: "Satu konten yang sangat komprehensif yang bisa dipecah menjadi banyak artikel kecil.",
            validation: { min_length: 10 },
          },
          {
            name: "clusterCount",
            label: "Jumlah Klaster Topik yang Diinginkan",
            type: "number",
            placeholder: "e.g., 10",
            info: "Berapa banyak ide artikel pendukung yang ingin Anda hasilkan?",
            validation: { min_value: 1, max_value: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Fokus pada topik untuk pemula. Hindari topik yang membutuhkan biaya mahal. Setiap klaster topik harus bisa menjadi judul artikel blog.",
            info: "Panduan untuk AI agar ide yang dihasilkan lebih sesuai dengan strategi Anda.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Postingan Media Sosial": {
        description:
          "Buat postingan yang menarik dan ringkas untuk berbagai platform.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Konten Media Sosial yang akan membuat postingan.",
        components: [
          {
            name: "platform",
            label: "Platform",
            type: "select",
            options: [
              "LinkedIn",
              "Instagram",
              "Twitter (X)",
              "Facebook",
              "TikTok",
            ],
            info: "Setiap platform memiliki format dan ekspektasi audiens yang berbeda.",
            validation: { regex: "^(?!Pilih Platform...).*$" },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
        dynamicSubcomponents: {
          trigger: "platform",
          options: {
            LinkedIn: [
              {
                name: "postType",
                label: "Jenis Postingan LinkedIn",
                type: "select",
                options: [
                  "Teks Saja",
                  "Artikel",
                  "Polling",
                  "Berbagi Link",
                  "Gambar/Video",
                  "Lainnya...",
                ],
                info: "Pilih format konten yang akan dibuat.",
                validation: { regex: "^(?!Lainnya).*$" },
              },
              {
                name: "topic",
                label: "Topik Pembahasan",
                type: "text",
                placeholder: "e.g., 'Tren terbaru dalam AI generatif'",
                info: "Inti dari pesan yang ingin Anda sampaikan.",
                validation: { min_length: 10 },
              },
              {
                name: "objective",
                label: "Tujuan Postingan",
                type: "select",
                options: [
                  "Thought Leadership",
                  "Networking",
                  "Promosi Layanan",
                  "Merekrut Talenta",
                  "Berbagi Berita",
                  "Lainnya...",
                ],
                info: "Apa yang ingin Anda capai dengan postingan ini?",
                validation: { regex: "^(?!Lainnya).*$" },
              },
              {
                name: "hashtags",
                label: "Hashtag Relevan (pisahkan koma)",
                type: "text",
                placeholder: "e.g., '#AI, #FutureOfWork, #Innovation'",
                info: "Membantu postingan Anda ditemukan oleh audiens yang lebih luas.",
                validation: { min_length: 3 },
              },
            ],
            Instagram: [
              {
                name: "visualDescription",
                label: "Deskripsi Visual Foto/Reel",
                type: "textarea",
                placeholder:
                  "e.g., 'Sebuah foto flat-lay meja kerja yang rapi dengan laptop, secangkir kopi, dan tanaman hias.'",
                info: "Jelaskan elemen visual agar AI bisa membuat caption yang relevan.",
                validation: { min_length: 20 },
              },
              {
                name: "captionStyle",
                label: "Gaya Caption Instagram",
                type: "select",
                options: [
                  "Informatif",
                  "Inspiratif",
                  "Storytelling",
                  "Singkat & Tajam",
                  "Humoris",
                  "Lainnya...",
                ],
                info: "Pilih nuansa teks yang cocok dengan visual Anda.",
              },
              {
                name: "callToAction",
                label: "Call To Action",
                type: "text",
                placeholder:
                  "e.g., 'Simpan postingan ini!', 'Komentari pendapatmu!'",
                info: "Ajak audiens untuk berinteraksi.",
                validation: { min_length: 5 },
              },
              {
                name: "hashtags",
                label: "Hashtag (pisahkan koma)",
                type: "text",
                placeholder: "e.g., '#workfromhome, #productivity, #desksetup'",
                info: "Gunakan campuran hashtag populer dan niche.",
                validation: { min_length: 3 },
              },
            ],
            "Twitter (X)": [
              {
                name: "tweetFormat",
                label: "Format Tweet",
                type: "select",
                options: [
                  "Single Tweet",
                  "Thread (Rangkaian Tweet)",
                  "Lainnya...",
                ],
                info: "Apakah ini tweet tunggal atau rangkaian bersambung?",
              },
              {
                name: "topic",
                label: "Topik Utama",
                type: "text",
                placeholder: "e.g., 'Kesan pertama menggunakan produk Y'",
                info: "Poin utama dari tweet atau thread Anda.",
                validation: { min_length: 10 },
              },
              {
                name: "hook",
                label: "Kalimat Pembuka (Hook)",
                type: "text",
                placeholder:
                  "e.g., 'Saya baru saja mencoba Y dan ini hasilnya...'",
                info: "Kalimat pertama yang membuat orang berhenti scrolling.",
                validation: { min_length: 10 },
              },
              {
                name: "tone",
                label: "Gaya Bahasa Twitter",
                type: "select",
                options: [
                  "Santai",
                  "Profesional",
                  "Humoris",
                  "Provokatif",
                  "Informatif",
                  "Lainnya...",
                ],
                info: "Sesuaikan gaya bahasa dengan audiens Twitter.",
              },
            ],
            Facebook: [
              {
                name: "postType",
                label: "Jenis Postingan Facebook",
                type: "select",
                options: [
                  "Berbagi Cerita",
                  "Update Produk",
                  "Bertanya",
                  "Berbagi Link/Artikel",
                  "Event",
                  "Lainnya...",
                ],
                info: "Pilih format yang paling sesuai dengan pesan Anda.",
              },
              {
                name: "targetAudience",
                label: "Target Audiens Facebook",
                type: "text",
                placeholder:
                  "e.g., 'Anggota grup Komunitas Z', 'Pengikut Halaman'",
                info: "Siapa audiens spesifik yang Anda sapa?",
                validation: { min_length: 5 },
              },
              {
                name: "visualIdea",
                label: "Ide Visual Pendamping",
                type: "text",
                placeholder:
                  "e.g., 'Album foto acara kemarin, infografis sederhana'",
                info: "Deskripsikan gambar atau video yang akan menyertai teks.",
                validation: { min_length: 10 },
              },
              {
                name: "interactionGoal",
                label: "Tujuan Interaksi",
                type: "text",
                placeholder: "e.g., 'Memicu diskusi di kolom komentar'",
                info: "Jenis respons apa yang Anda harapkan?",
                validation: { min_length: 5 },
              },
            ],
            TikTok: [
              {
                name: "videoConcept",
                label: "Konsep Video Singkat",
                type: "textarea",
                placeholder:
                  "e.g., 'Transisi sebelum dan sesudah menggunakan produk X dengan lagu yang sedang tren.'",
                info: "Jelaskan alur cerita atau konsep visual video Anda.",
                validation: { min_length: 20 },
              },
              {
                name: "trendingSound",
                label: "Saran Suara/Lagu Tren",
                type: "text",
                placeholder: "e.g., 'Gunakan lagu 'xyz' yang sedang viral'",
                info: "Sebutkan nama lagu atau jenis suara untuk meningkatkan jangkauan.",
                optional: true,
              },
              {
                name: "caption",
                label: "Teks Caption TikTok",
                type: "text",
                placeholder: "e.g., 'Jangan kaget sama hasilnya! ✨'",
                info: "Buat caption yang singkat, menarik, dan relevan dengan video.",
                validation: { min_length: 5 },
              },
              {
                name: "hashtags",
                label: "Hashtag FYP (pisahkan koma)",
                type: "text",
                placeholder: "e.g., '#fyp, #productreview, #lifehack'",
                info: "Gunakan hashtag yang sedang tren untuk masuk For You Page.",
                validation: { min_length: 3 },
              },
            ],
          },
        },
      },
      "Penulis Teks Iklan (Ad Copy)": {
        description:
          "Buat teks iklan pendek dan persuasif untuk platform seperti Google Ads atau Facebook Ads.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Iklan Digital yang akan membuat teks iklan.",
        components: [
          {
            name: "platform",
            label: "Platform Iklan",
            type: "select",
            options: [
              "Google Ads",
              "Facebook/Instagram Ads",
              "LinkedIn Ads",
              "Twitter Ads",
              "Lainnya...",
            ],
            info: "Setiap platform memiliki batasan karakter dan format yang berbeda.",
          },
          {
            name: "product",
            label: "Produk/Jasa yang Diiklankan",
            type: "text",
            placeholder: "e.g., 'Software CRM untuk UKM'",
            info: "Apa yang Anda promosikan?",
            validation: { min_length: 5 },
          },
          {
            name: "targetAudience",
            label: "Target Audiens Iklan",
            type: "text",
            placeholder: "e.g., 'Pemilik usaha kecil, manajer penjualan'",
            info: "Siapa yang ingin Anda jangkau dengan iklan ini?",
            validation: { min_length: 5 },
          },
          {
            name: "uniqueBenefit",
            label: "Manfaat Unik & Utama",
            type: "text",
            placeholder: "e.g., 'Hemat waktu 10 jam per minggu'",
            info: "Apa satu manfaat paling kuat yang akan menarik perhatian?",
            validation: { min_length: 10 },
          },
          {
            name: "callToAction",
            label: "Call to Action (CTA)",
            type: "text",
            placeholder: "e.g., 'Coba Gratis Sekarang', 'Unduh Laporannya'",
            info: "Perintah yang jelas dan spesifik untuk pengguna.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat 3 variasi headline. Gunakan nada yang mendesak. Tonjolkan penawaran diskon 20%.",
            info: "Instruksi spesifik tentang jumlah variasi, nada, atau penawaran.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Pembuat Urutan Email Otomatis": {
        description:
          "Rancang serangkaian email (misal: welcome series, nurture sequence) untuk memandu pelanggan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Otomatisasi Email yang akan merancang serangkaian email otomatis.",
        components: [
          {
            name: "sequenceType",
            label: "Jenis Urutan Email",
            type: "select",
            options: [
              "Welcome Series (untuk pelanggan baru)",
              "Nurture Sequence (untuk prospek)",
              "Re-engagement (untuk pengguna tidak aktif)",
              "Lainnya...",
            ],
            info: "Pilih tujuan utama dari rangkaian email ini.",
          },
          {
            name: "product",
            label: "Produk/Layanan Terkait",
            type: "text",
            placeholder: "e.g., 'Aplikasi produktivitas 'Fokus''",
            info: "Fokus dari konten email.",
            validation: { min_length: 5 },
          },
          {
            name: "numberOfEmails",
            label: "Jumlah Email dalam Urutan",
            type: "number",
            placeholder: "e.g., 5",
            info: "Berapa banyak email yang akan ada dalam rangkaian ini?",
            validation: { min_value: 1, max_value: 10 },
          },
          {
            name: "sequenceGoal",
            label: "Tujuan Akhir Urutan Email",
            type: "text",
            placeholder:
              "e.g., 'Mendorong pengguna untuk upgrade ke versi Pro'",
            info: "Apa hasil yang Anda harapkan setelah email terakhir terkirim?",
            validation: { min_length: 10 },
          },
          {
            name: "emailTopics",
            label: "Topik untuk Setiap Email (Opsional)",
            type: "textarea",
            placeholder:
              "Email 1: Cerita di balik produk\nEmail 2: Tips menggunakan fitur X\nEmail 3: Studi kasus pengguna",
            info: "Jika Anda punya ide, jabarkan alur konten dari email ke email.",
            optional: true,
            validation: { min_length: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Jarak antar email adalah 2 hari. Nada harus semakin persuasif seiring berjalannya urutan. Setiap email harus memiliki satu CTA yang jelas.",
            info: "Instruksi tentang waktu, nada, atau struktur setiap email.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Akademis & Edukasi": {
      "Generator Rencana Pembelajaran (Lesson Plan)": {
        description:
          "Bantu guru dan instruktur membuat rencana pembelajaran (RPP) yang terstruktur dan efektif.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perencana Pembelajaran yang akan membantu menyusun rencana pembelajaran.",
        components: [
          {
            name: "subject",
            label: "Mata Pelajaran",
            type: "text",
            placeholder: "e.g., 'Sejarah, Matematika, Biologi'",
            info: "Bidang studi yang akan diajarkan.",
            validation: { min_length: 2 },
          },
          {
            name: "gradeLevel",
            label: "Tingkat Kelas",
            type: "text",
            placeholder: "e.g., 'Kelas 10 SMA, Kelas 5 SD'",
            info: "Tingkat pendidikan dari siswa.",
            validation: { min_length: 3 },
          },
          {
            name: "topic",
            label: "Topik Spesifik Pelajaran",
            type: "text",
            placeholder: "e.g., 'Perang Dunia II, Fotosintesis, Aljabar Dasar'",
            info: "Materi utama yang akan dibahas dalam sesi ini.",
            validation: { min_length: 5 },
          },
          {
            name: "duration",
            label: "Durasi Pelajaran (menit)",
            type: "number",
            placeholder: "e.g., 90",
            info: "Total waktu yang tersedia untuk pelajaran.",
            validation: { min_value: 15, max_value: 240 },
          },
          {
            name: "learningObjectives",
            label: "Tujuan Pembelajaran",
            type: "textarea",
            placeholder:
              "e.g., 'Siswa mampu menjelaskan 3 penyebab utama PD II. Siswa dapat mengidentifikasi klorofil dalam diagram sel tumbuhan.'",
            info: "Apa yang harus bisa dilakukan siswa setelah pelajaran selesai? Gunakan kata kerja yang terukur.",
            validation: { min_length: 20 },
          },
          {
            name: "activities",
            label: "Ide Aktivitas Pembelajaran",
            type: "textarea",
            placeholder:
              "e.g., 'Diskusi kelompok, eksperimen sederhana, menonton video pendek, kuis.'",
            info: "Bagaimana cara Anda akan menyampaikan materi?",
            validation: { min_length: 20 },
          },
          {
            name: "assessment",
            label: "Metode Penilaian/Evaluasi",
            type: "text",
            placeholder:
              "e.g., 'Lembar kerja, presentasi kelompok, esai singkat'",
            info: "Bagaimana Anda akan mengukur pemahaman siswa?",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Fokus pada pembelajaran berbasis proyek. Sertakan satu aktivitas yang melibatkan gerakan fisik. Pelajaran ini dilakukan secara online.",
            info: "Kebutuhan khusus atau batasan yang perlu diperhatikan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Asisten Penulis Esai Akademis": {
        description:
          "Bantu membuat kerangka, argumen, dan kalimat tesis yang kuat untuk esai akademis.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Esai Akademis yang akan membantu menyusun kerangka, argumen, dan kalimat tesis.",
        components: [
          {
            name: "essayQuestion",
            label: "Pertanyaan atau Topik Esai",
            type: "text",
            placeholder:
              "e.g., 'Diskusikan dampak Revolusi Industri terhadap masyarakat urban.'",
            info: "Tuliskan pertanyaan esai persis seperti yang diberikan.",
            validation: { min_length: 10 },
          },
          {
            name: "myStance",
            label: "Posisi/Argumen Utama Saya",
            type: "text",
            placeholder:
              "e.g., 'Revolusi Industri memiliki dampak ganda: kemajuan ekonomi dan kemunduran sosial.'",
            info: "Apa jawaban atau argumen utama Anda terhadap pertanyaan tersebut?",
            validation: { min_length: 10 },
          },
          {
            name: "supportingPoints",
            label: "Poin-Poin Pendukung (Opsional)",
            type: "textarea",
            placeholder:
              "Poin 1: Munculnya kelas pekerja baru.\nPoin 2: Kondisi hidup yang buruk di kota.\nPoin 3: Teknologi baru meningkatkan produksi.",
            info: "Sebutkan 2-3 argumen utama yang akan mendukung posisi Anda.",
            optional: true,
            validation: { min_length: 20 },
          },
          {
            name: "essayType",
            label: "Jenis Esai",
            type: "select",
            options: [
              "Argumentatif",
              "Komparatif (Bandingkan & Kontraskan)",
              "Analitis",
              "Ekspositori",
              "Lainnya...",
            ],
            info: "Jenis esai akan menentukan struktur dan pendekatan.",
          },
          {
            name: "outputToGenerate",
            label: "Output yang Diinginkan",
            type: "select",
            options: [
              "Hanya Kalimat Tesis",
              "Kerangka Esai Lengkap (Outline)",
              "Paragraf Pembuka",
              "Lainnya...",
            ],
            info: "Pilih bagian mana dari esai yang Anda perlukan bantuannya.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan bahasa akademis yang formal. Sertakan satu argumen tandingan (counter-argument) dalam kerangka. Tesis harus jelas dan dapat diperdebatkan.",
            info: "Instruksi spesifik tentang gaya penulisan atau struktur esai.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Soal Kuis & Ujian": {
        description:
          "Buat berbagai jenis soal (pilihan ganda, esai singkat) berdasarkan materi pelajaran yang diberikan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pembuat Soal Ujian yang akan membuat berbagai jenis soal kuis dan ujian.",
        components: [
          {
            name: "subjectMatter",
            label: "Materi Pelajaran",
            type: "textarea",
            placeholder:
              "Tempelkan teks atau poin-poin materi pelajaran di sini. Semakin detail, semakin baik.",
            info: "AI akan menggunakan teks ini sebagai dasar untuk membuat soal.",
            validation: { min_length: 3 },
          },
          {
            name: "questionType",
            label: "Jenis Soal",
            type: "select",
            options: [
              "Pilihan Ganda",
              "Esai Singkat",
              "Benar/Salah",
              "Isian Singkat",
              "Campuran",
              "Lainnya...",
            ],
            info: "Pilih format soal yang Anda butuhkan.",
          },
          {
            name: "numberOfQuestions",
            label: "Jumlah Soal",
            type: "number",
            placeholder: "e.g., 10",
            info: "Berapa banyak soal yang ingin Anda buat?",
            validation: { min_value: 1, max_value: 20 },
          },
          {
            name: "difficultyLevel",
            label: "Tingkat Kesulitan",
            type: "select",
            options: [
              "Mudah (Pemahaman Dasar)",
              "Menengah (Aplikasi Konsep)",
              "Sulit (Analisis & Evaluasi)",
              "Lainnya...",
            ],
            info: "Tingkat kesulitan akan mempengaruhi kompleksitas soal.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Untuk pilihan ganda, buat pengecoh yang masuk akal. Sertakan kunci jawaban. Soal harus berbasis studi kasus.",
            info: "Instruksi spesifik untuk pembuatan soal dan kunci jawaban.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Pembuat Abstrak Penelitian": {
        description:
          "Bantu peneliti merangkum makalah atau penelitian yang kompleks menjadi abstrak yang padat dan informatif.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Abstrak Penelitian yang akan merangkum makalah atau penelitian.",
        components: [
          {
            name: "researchTitle",
            label: "Judul Penelitian",
            type: "text",
            placeholder:
              "e.g., 'Pengaruh Tidur Cukup Terhadap Produktivitas Kerja'",
            info: "Judul lengkap dari makalah atau penelitian Anda.",
            validation: { min_length: 10 },
          },
          {
            name: "background",
            label: "Latar Belakang/Konteks",
            type: "textarea",
            placeholder:
              "Jelaskan secara singkat masalah atau celah pengetahuan yang mendorong penelitian ini.",
            info: "Satu atau dua kalimat untuk memberikan konteks.",
            validation: { min_length: 20 },
          },
          {
            name: "methods",
            label: "Metodologi",
            type: "textarea",
            placeholder:
              "e.g., 'Survei kuantitatif terhadap 200 karyawan di industri teknologi.'",
            info: "Jelaskan secara singkat bagaimana Anda melakukan penelitian.",
            validation: { min_length: 20 },
          },
          {
            name: "keyFindings",
            label: "Temuan Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Ditemukan korelasi positif yang signifikan. Karyawan yang tidur 7-8 jam 30% lebih produktif.'",
            info: "Sebutkan hasil terpenting dari penelitian Anda.",
            validation: { min_length: 20 },
          },
          {
            name: "conclusion",
            label: "Kesimpulan & Implikasi",
            type: "textarea",
            placeholder:
              "e.g., 'Kebijakan kerja yang mendukung keseimbangan hidup-kerja dapat meningkatkan kinerja perusahaan.'",
            info: "Apa arti dari temuan Anda? Apa implikasinya?",
            validation: { min_length: 20 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat abstrak tidak lebih dari 250 kata. Gunakan bahasa yang sesuai untuk jurnal akademis. Sertakan 3-5 kata kunci di akhir.",
            info: "Batasan atau persyaratan format yang spesifik.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Kehidupan & Produktivitas": {
      "Perencana Perjalanan (Itinerary Planner)": {
        description:
          "Buat jadwal perjalanan harian yang detail dan logis berdasarkan preferensi Anda.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perencana Perjalanan yang akan membuat jadwal perjalanan harian.",
        components: [
          {
            name: "destination",
            label: "Tujuan (Kota/Negara)",
            type: "text",
            placeholder: "e.g., 'Kyoto, Jepang'",
            info: "Lokasi utama dari perjalanan Anda.",
            validation: { min_length: 3 },
          },
          {
            name: "duration",
            label: "Jumlah Hari Perjalanan",
            type: "number",
            placeholder: "e.g., 5",
            info: "Berapa lama Anda akan berada di sana?",
            validation: { min_value: 1, max_value: 30 },
          },
          {
            name: "interests",
            label: "Minat Utama (pisahkan koma)",
            type: "text",
            placeholder:
              "e.g., 'Kuliner, Kuil & Sejarah, Alam, Belanja, Seni Kontemporer'",
            info: "Jenis aktivitas apa yang paling Anda nikmati.",
            validation: { min_length: 5 },
          },
          {
            name: "travelStyle",
            label: "Gaya Perjalanan",
            type: "select",
            options: [
              "Santai & Fleksibel",
              "Padat & Efisien",
              "Ramah Anggaran (Budget)",
              "Mewah & Nyaman",
              "Petualangan",
              "Lainnya...",
            ],
            info: "Pilih pendekatan umum untuk perjalanan Anda.",
          },
          {
            name: "mustVisit",
            label: "Tempat yang Wajib Dikunjungi (Opsional)",
            type: "text",
            placeholder: "e.g., 'Kuil Fushimi Inari, Hutan Bambu Arashiyama'",
            info: "Sebutkan tempat spesifik yang tidak boleh terlewatkan.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Saya tidak suka keramaian, cari waktu kunjungan yang sepi. Saya bepergian dengan anak-anak. Sertakan setidaknya satu kafe unik setiap hari. Alokasikan waktu untuk istirahat siang.",
            info: "Preferensi personal atau batasan yang perlu diperhatikan oleh AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Resep Masakan": {
        description:
          "Buat resep masakan baru dan kreatif berdasarkan bahan-bahan yang Anda miliki.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Koki AI yang akan membuat resep masakan baru dan kreatif.",
        components: [
          {
            name: "mainIngredients",
            label: "Bahan Utama yang Tersedia",
            type: "text",
            placeholder: "e.g., 'dada ayam, brokoli, bawang putih'",
            info: "Bahan protein dan sayuran utama yang Anda punya.",
            validation: { min_length: 5 },
          },
          {
            name: "pantryStaples",
            label: "Bahan Dapur Lainnya (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'nasi, telur, saus tiram, minyak wijen'",
            info: "Bahan umum yang biasanya ada di dapur Anda.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "cuisineType",
            label: "Jenis Masakan yang Diinginkan",
            type: "select",
            options: [
              "Apa Saja",
              "Asia (Umum)",
              "Italia",
              "Meksiko",
              "Indonesia",
              "Sehat & Cepat",
              "Lainnya...",
            ],
            info: "Pilih profil rasa yang Anda inginkan.",
          },
          {
            name: "dietaryRestrictions",
            label: "Pantangan/Preferensi Diet (Opsional)",
            type: "text",
            placeholder: "e.g., 'Rendah karbohidrat, tanpa susu, vegetarian'",
            info: "Sebutkan batasan diet yang perlu diikuti.",
            optional: true,
          },
          {
            name: "difficultyLevel",
            label: "Tingkat Kesulitan",
            type: "select",
            options: [
              "Sangat Mudah (di bawah 20 menit)",
              "Mudah (sekitar 30 menit)",
              "Menengah",
              "Lainnya...",
            ],
            info: "Berapa banyak waktu dan usaha yang ingin Anda curahkan?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat resep untuk satu porsi saja. Saya tidak punya oven. Resep harus ramah untuk anak-anak.",
            info: "Batasan alat masak atau preferensi lain yang penting.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Perencana Tujuan Pribadi": {
        description:
          "Pecah tujuan besar Anda menjadi langkah-langkah kecil yang dapat ditindaklanjuti dan terukur.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pelatih Tujuan Pribadi yang akan membantu memecah tujuan besar menjadi langkah-langkah kecil.",
        components: [
          {
            name: "mainGoal",
            label: "Tujuan Utama",
            type: "text",
            placeholder:
              "e.g., 'Belajar bermain gitar', 'Menurunkan berat badan 5 kg'",
            info: "Tuliskan satu tujuan besar yang ingin Anda capai.",
            validation: { min_length: 10 },
          },
          {
            name: "timeframe",
            label: "Jangka Waktu",
            type: "text",
            placeholder: "e.g., '3 bulan', 'Tahun ini'",
            info: "Kapan Anda ingin tujuan ini tercapai?",
            validation: { min_length: 5 },
          },
          {
            name: "currentSituation",
            label: "Situasi Saat Ini",
            type: "textarea",
            placeholder:
              "e.g., 'Belum pernah memegang gitar sama sekali', 'Berolahraga tidak teratur'",
            info: "Jelaskan titik awal Anda secara jujur. Ini membantu AI membuat langkah yang realistis.",
            validation: { min_length: 20 },
          },
          {
            name: "planningFramework",
            label: "Kerangka Perencanaan",
            type: "select",
            options: [
              "SMART (Specific, Measurable, Achievable, Relevant, Time-bound)",
              "WOOP (Wish, Outcome, Obstacle, Plan)",
              "Langkah-langkah Mingguan",
              "Lainnya...",
            ],
            info: "Pilih metode perencanaan yang ingin digunakan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Saya hanya punya waktu 30 menit setiap hari. Saya butuh rencana yang sangat detail. Sertakan cara untuk melacak kemajuan.",
            info: "Berikan batasan atau preferensi personal Anda.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Template Balasan Cepat": {
        description:
          "Buat template balasan email atau pesan untuk situasi yang sering terjadi untuk menghemat waktu.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Asisten Komunikasi Cepat yang akan membuat template balasan cepat.",
        components: [
          {
            name: "scenario",
            label: "Skenario Komunikasi",
            type: "text",
            placeholder:
              "e.g., 'Menjawab pertanyaan umum tentang harga', 'Mengatakan tidak pada sebuah permintaan'",
            info: "Jelaskan situasi spesifik di mana Anda memerlukan template balasan.",
            validation: { min_length: 10 },
          },
          {
            name: "myRole",
            label: "Peran Saya",
            type: "text",
            placeholder:
              "e.g., 'Freelancer', 'Customer Service', 'Manajer Tim'",
            info: "Dari sudut pandang siapa balasan ini akan dikirim?",
            validation: { min_length: 5 },
          },
          {
            name: "keyMessage",
            label: "Pesan Kunci yang Harus Disampaikan",
            type: "textarea",
            placeholder:
              "e.g., 'Terima kasih atas pertanyaannya. Harga kami adalah X. Berikut link ke detailnya.'",
            info: "Informasi inti yang harus ada dalam balasan.",
            validation: { min_length: 20 },
          },
          {
            name: "tone",
            label: "Gaya Bahasa Template",
            type: "select",
            options: [
              "Efisien & Langsung",
              "Ramah & Hangat",
              "Formal & Profesional",
              "Empatik & Membantu",
              "Lainnya...",
            ],
            info: "Pilih nada yang sesuai dengan peran dan audiens Anda.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat placeholder seperti [Nama Klien] agar mudah diganti. Sertakan kalimat pembuka dan penutup yang sopan. Buat agar template bisa digunakan di WhatsApp.",
            info: "Instruksi untuk membuat template lebih fleksibel dan mudah digunakan.",
            optional: true,
            validation: { min_length: 20 },
          },
        ],
      },
    },
    "Kreatif & Ideasi": {
      "Generator Ide Cerita & Plot": {
        description:
          "Kembangkan ide cerita atau kerangka plot yang kreatif untuk novel, skenario, atau cerita pendek.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Cerita Kreatif yang akan mengembangkan ide cerita dan kerangka plot.",
        components: [
          {
            name: "genre",
            label: "Genre Cerita",
            type: "select",
            options: [
              "Fiksi Ilmiah",
              "Fantasi",
              "Misteri",
              "Thriller",
              "Horor",
              "Romantis",
              "Petualangan",
              "Drama",
              "Lainnya...",
            ],
            info: "Genre akan menentukan konvensi dan ekspektasi pembaca.",
          },
          {
            name: "mainCharacter",
            label: "Deskripsi Tokoh Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Seorang detektif tua yang sinis di ambang pensiun, dihantui oleh kasus yang belum terpecahkan.'",
            info: "Jelaskan latar belakang, motivasi, dan kelemahan karakter untuk membuatnya 'hidup'.",
            validation: { min_length: 20 },
          },
          {
            name: "setting",
            label: "Setting (Waktu & Tempat)",
            type: "textarea",
            placeholder:
              "e.g., 'Kota neo-noir yang selalu hujan di tahun 2077, di mana teknologi dan kesenjangan sosial mencapai puncaknya.'",
            info: "Setting bisa menjadi karakter tersendiri dalam cerita.",
            validation: { min_length: 20 },
          },
          {
            name: "mainConflict",
            label: "Konflik Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Harus menemukan seorang peretas misterius yang membocorkan rahasia korporasi terbesar sebelum kota jatuh ke dalam kekacauan.'",
            info: "Apa masalah utama yang harus dihadapi dan diatasi oleh tokoh utama?",
            validation: { min_length: 20 },
          },
          {
            name: "twist",
            label: "Elemen Unik/Twist (Opsional)",
            type: "text",
            placeholder: "e.g., 'Ternyata tokoh pahlawan adalah dalangnya.'",
            info: "Elemen kejutan yang ingin Anda sertakan dalam cerita untuk mengubah perspektif pembaca.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Cerita harus memiliki akhir yang ambigu. Fokus pada dialog antar karakter. Sertakan elemen magis yang halus, bukan yang mencolok.",
            info: "Instruksi tentang tema, mood, atau elemen naratif spesifik yang harus dimasukkan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Nama Brand/Produk": {
        description:
          "Temukan nama yang unik, berkesan, dan relevan untuk bisnis atau produk Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Penamaan yang akan menghasilkan nama brand atau produk.",
        components: [
          {
            name: "coreConcept",
            label: "Deskripsi Konsep/Produk",
            type: "textarea",
            placeholder:
              "e.g., 'Aplikasi pengelola keuangan pribadi yang menggunakan AI untuk memberikan saran hemat.'",
            info: "Jelaskan apa yang Anda buat dalam 1-2 kalimat.",
            validation: { min_length: 20 },
          },
          {
            name: "coreValues",
            label: "Nilai Inti Brand (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'Kepercayaan, kesederhanaan, pemberdayaan'",
            info: "Kata-kata yang merepresentasikan jiwa dari brand atau produk Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "nameStyle",
            label: "Gaya Nama yang Diinginkan",
            type: "select",
            options: [
              "Modern & Singkat (e.g., Google, X)",
              "Klasik & Dapat Dipercaya (e.g., General Electric)",
              "Evokatif & Imajinatif (e.g., Patagonia)",
              "Deskriptif (e.g., The Weather Channel)",
              "Lainnya...",
            ],
            info: "Pilih jenis nuansa nama yang Anda cari.",
          },
          {
            name: "keywordsToInclude",
            label: "Kata atau Akar Kata untuk Disertakan (Opsional)",
            type: "text",
            placeholder: "e.g., 'Zen, Nova, Eco, Tech'",
            info: "Kata spesifik yang mungkin ingin Anda masukkan ke dalam nama.",
            optional: true,
          },
          {
            name: "keywordsToAvoid",
            label: "Kata atau Konsep untuk Dihindari",
            type: "text",
            placeholder: "e.g., 'Cloud, Sync, Global'",
            info: "Kata-words yang terlalu umum atau tidak sesuai dengan brand Anda.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Nama harus mudah diucapkan. Harus tersedia sebagai domain .com. Tidak boleh lebih dari 3 suku kata. Hindari nama yang terdengar seperti brand yang sudah ada.",
            info: "Batasan teknis atau kreatif lainnya yang sangat penting.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Slogan/Tagline": {
        description:
          "Ciptakan slogan atau tagline yang singkat, menarik, dan berkesan untuk brand atau kampanye Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pakar Slogan yang akan menciptakan slogan atau tagline.",
        components: [
          {
            name: "brandName",
            label: "Nama Brand/Produk",
            type: "text",
            placeholder: "e.g., 'Kopi Kenangan'",
            info: "Nama yang akan diasosiasikan dengan slogan ini.",
            validation: { min_length: 5 },
          },
          {
            name: "coreBenefit",
            label: "Manfaat atau Perasaan Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Menyediakan kopi berkualitas tinggi dengan cepat untuk menemani setiap momen.'",
            info: "Apa satu hal terpenting yang harus dirasakan audiens dari slogan ini?",
            validation: { min_length: 20 },
          },
          {
            name: "targetAudience",
            label: "Target Audiens",
            type: "text",
            placeholder: "e.g., 'Pekerja muda, mahasiswa'",
            info: "Siapa yang ingin Anda sapa dengan slogan ini?",
            validation: { min_length: 5 },
          },
          {
            name: "sloganStyle",
            label: "Gaya Slogan",
            type: "select",
            options: [
              "Cerdas & Canggih",
              "Singkat & Berkesan",
              "Deskriptif & Jelas",
              "Mewah & Premium",
              "Humoris & Unik",
              "Lainnya...",
            ],
            info: "Pilih nuansa atau jenis slogan yang Anda inginkan.",
          },
          {
            name: "keywordsToInclude",
            label: "Kata Kunci Wajib (Opsional)",
            type: "text",
            placeholder: "e.g., 'Cepat, Momen, Rasa'",
            info: "Kata spesifik yang ingin Anda coba masukkan ke dalam slogan.",
            optional: true,
            validation: { min_length: 3 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Slogan harus terdiri dari 3-5 kata. Harus berima. Hindari kata 'terbaik'. Harus terdengar modern dan energik.",
            info: "Berikan batasan panjang, gaya, atau kata-kata yang harus dihindari.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Generator Premis Film/Serial TV": {
        description:
          "Kembangkan ide premis satu kalimat (logline) yang menarik untuk film atau serial TV.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Premis Sinematik yang akan mengembangkan ide premis satu kalimat.",
        components: [
          {
            name: "genre",
            label: "Genre Utama",
            type: "text",
            placeholder: "e.g., 'Fiksi Ilmiah, Komedi Romantis'",
            info: "Genre utama akan menentukan nada dan ekspektasi.",
          },
          {
            name: "mainCharacter",
            label: "Tokoh Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Seorang pustakawan pemalu yang menemukan buku ajaib'",
            info: "Siapa protagonis cerita Anda dan apa ciri khasnya?",
          },
          {
            name: "goal",
            label: "Tujuan Tokoh Utama",
            type: "textarea",
            placeholder:
              "e.g., '...harus menggunakan buku itu untuk menyelamatkan dunianya dari kehampaan.'",
            info: "Apa yang ingin dicapai oleh tokoh utama?",
          },
          {
            name: "obstacle",
            label: "Rintangan Utama",
            type: "textarea",
            placeholder:
              "e.g., '...sambil diburu oleh perkumpulan rahasia yang ingin merebut buku itu.'",
            info: "Apa atau siapa yang menghalangi tujuan tokoh utama?",
          },
          {
            name: "twist",
            label: "Elemen Unik/Twist (Opsional)",
            type: "text",
            placeholder: "e.g., 'Ternyata buku itu menulis dirinya sendiri.'",
            info: "Apa yang membuat cerita Anda berbeda dan tidak klise?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat beberapa variasi logline. Gabungkan dua genre yang tidak biasa. Premis harus cocok untuk serial animasi.",
            info: "Instruksi kreatif lainnya.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Asisten Brainstorming": {
        description:
          "Ambil satu ide sentral dan hasilkan cabang-cabang ide terkait untuk mind mapping atau eksplorasi kreatif.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Fasilitator Ide yang akan menghasilkan cabang-cabang ide terkait dari ide sentral.",
        components: [
          {
            name: "centralIdea",
            label: "Ide Sentral",
            type: "text",
            placeholder: "e.g., 'Membuka kedai kopi ramah lingkungan'",
            info: "Topik utama yang ingin Anda eksplorasi lebih dalam.",
            validation: { min_length: 10 },
          },
          {
            name: "brainstormingFocus",
            label: "Fokus Brainstorming",
            type: "select",
            options: [
              "Ide Pemasaran",
              "Fitur Produk/Layanan",
              "Potensi Masalah & Solusi",
              "Nama & Tagline",
              "Semua Aspek",
              "Lainnya...",
            ],
            info: "Pilih area spesifik yang ingin Anda gali idenya.",
          },
          {
            name: "numberOfIdeas",
            label: "Jumlah Ide yang Diinginkan",
            type: "number",
            placeholder: "e.g., 10",
            info: "Berapa banyak ide cabang yang ingin Anda hasilkan?",
            validation: { min_value: 1, max_value: 20 },
          },
          {
            name: "constraints",
            label: "Batasan (Opsional)",
            type: "text",
            placeholder: "e.g., 'Anggaran rendah, hanya untuk pasar lokal'",
            info: "Batasan akan membuat ide yang dihasilkan lebih realistis dan relevan.",
            optional: true,
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Pikirkan ide yang paling tidak biasa dan 'out-of-the-box'. Kategorikan ide-ide yang dihasilkan. Setiap ide harus dijelaskan dalam satu kalimat.",
            info: "Instruksi tentang bagaimana AI harus melakukan brainstorming.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Utilitas & Development": {
      "Generator Data Dummy": {
        description:
          "Buat data palsu (dummy data) yang terstruktur untuk keperluan testing, prototyping, atau mengisi desain mockup.",
        toolType: "code",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Generator Data yang akan menghasilkan data palsu.",
        components: [
          {
            name: "schemaName",
            label: "Nama Skema Data",
            type: "text",
            placeholder: "e.g., 'Daftar Pengguna'",
            info: "Nama objek data yang akan dibuat.",
          },
          {
            name: "schemaFields",
            label: "Spesifikasi Field (nama:tipe)",
            type: "textarea",
            placeholder:
              "e.g., 'nama:nama_lengkap\nemail:email\nusia:angka(18-65)\nstatus:pilihan(aktif|tidak aktif)'",
            info: "Definisikan setiap field dan tipenya (nama_lengkap, email, angka, teks, pilihan, dll.). Gunakan format 'nama:tipe(opsi)'.",
          },
          {
            name: "recordCount",
            label: "Jumlah Record",
            type: "number",
            placeholder: "e.g., 10",
            info: "Berapa banyak baris data yang ingin Anda hasilkan?",
          },
          {
            name: "outputFormat",
            label: "Format Output",
            type: "select",
            options: ["JSON Array", "CSV", "Lainnya..."],
            info: "Pilih format output yang diinginkan (misalnya, JSON Array, CSV).",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Pastikan email unik untuk setiap record. Buat data terlihat realistis. Usia harus berdistribusi normal.",
            info: "Instruksi spesifik tentang batasan data, relasi antar field, atau tingkat kerandoman.",
          },
        ],
      },
      "Penulis Dokumentasi Kode": {
        description:
          "Buat penjelasan (docstring) yang jelas untuk fungsi atau kelas dalam kode pemrograman.",
        toolType: "code",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Dokumentasi Kode yang akan menganalisis potongan kode dan menghasilkan dokumentasi.",
        components: [
          {
            name: "codeSnippet",
            label: "Potongan Kode (Code Snippet)",
            type: "textarea",
            placeholder: "Tempelkan fungsi, kelas, atau metode Anda di sini.",
            info: "AI akan menganalisis kode untuk menghasilkan dokumentasi yang relevan.",
          },
          {
            name: "language",
            label: "Bahasa Pemrograman",
            type: "select",
            options: [
              "Python",
              "JavaScript",
              "TypeScript",
              "Java",
              "PHP",
              "Lainnya...",
            ],
            info: "Bahasa pemrograman akan menentukan format docstring (e.g., reST, JSDoc).",
          },
          {
            name: "documentationStyle",
            label: "Gaya Dokumentasi",
            type: "select",
            options: [
              "Google Style",
              "NumPy/SciPy Style",
              "JSDoc",
              "Standar",
              "Lainnya...",
            ],
            info: "Pilih format komentar dokumentasi yang umum digunakan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Jelaskan parameter 'user_id' secara lebih detail. Sertakan satu contoh penggunaan. Jelaskan apa yang di-return oleh fungsi ini.",
            info: "Informasi tambahan yang tidak bisa disimpulkan hanya dari kode.",
          },
        ],
      },
      "Generator Pesan Error Ramah Pengguna": {
        description:
          "Ubah pesan error teknis menjadi penjelasan yang mudah dipahami oleh pengguna non-teknis.",
        toolType: "code",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penerjemah Error yang akan mengubah pesan error teknis menjadi penjelasan yang mudah dipahami.",
        components: [
          {
            name: "technicalError",
            label: "Pesan Error Teknis",
            type: "text",
            placeholder:
              "e.g., 'Error 500: Internal Server Error', 'TypeError: Cannot read property 'name' of undefined'",
            info: "Pesan error asli dari sistem atau log.",
          },
          {
            name: "userContext",
            label: "Konteks Tindakan Pengguna",
            type: "textarea",
            placeholder:
              "e.g., 'Pengguna sedang mencoba mengunggah foto profil.'",
            info: "Apa yang sedang dilakukan pengguna saat error ini terjadi?",
          },
          {
            name: "targetAudience",
            label: "Target Audiens Pesan",
            type: "text",
            placeholder: "e.g., 'Pengguna umum aplikasi kami'",
            info: "Siapa yang akan melihat pesan error yang baru?",
          },
          {
            name: "suggestedAction",
            label: "Saran Tindakan untuk Pengguna",
            type: "text",
            placeholder:
              "e.g., 'Coba lagi beberapa saat, periksa koneksi internet Anda'",
            info: "Langkah apa yang bisa dicoba pengguna untuk menyelesaikan masalah?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan nada yang menenangkan dan jangan menyalahkan pengguna. Sertakan nomor ID error untuk referensi dukungan pelanggan. Buat pesan se-singkat mungkin.",
            info: "Instruksi tentang gaya bahasa, nada, atau informasi tambahan.",
          },
        ],
      },
      "Analis & Perangkum Dokumen Legal": {
        description:
          "Rangkum dokumen hukum yang panjang (misal: Ketentuan Layanan) ke dalam bahasa yang mudah dipahami.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Analis Hukum yang akan menganalisis dokumen hukum dan mengekstrak poin-poin penting.",
        components: [
          {
            name: "legalDocument",
            label: "Teks Dokumen Legal",
            type: "textarea",
            placeholder:
              "Tempelkan seluruh teks dari dokumen legal seperti Ketentuan Layanan atau Kebijakan Privasi di sini.",
            info: "AI akan menganalisis teks ini untuk menemukan poin-poin terpentipenting.",
            validation: { min_length: 50 },
          },
          {
            name: "myRole",
            label: "Peran Saya",
            type: "select",
            options: [
              "Sebagai Konsumen/Pengguna",
              "Sebagai Pemilik Bisnis",
              "Lainnya...",
            ],
            info: "Dari sudut pandang mana AI harus menganalisis dokumen ini?",
          },
          {
            name: "focus",
            label: "Fokus Analisis",
            type: "text",
            placeholder:
              "e.g., 'Kewajiban saya', 'Hak saya atas data', 'Klausul pembatalan'",
            info: "Aspek apa dari dokumen yang paling ingin Anda pahami?",
          },
          {
            name: "outputFormat",
            label: "Format Output",
            type: "select",
            options: [
              "Poin-poin Ringkasan",
              "Tanya Jawab (FAQ)",
              "Tabel Hak & Kewajiban",
              "Lainnya...",
            ],
            info: "Pilih cara penyajian ringkasan yang paling mudah Anda pahami.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Cari 'red flags' atau klausa yang tidak biasa. Terjemahkan jargon hukum ke bahasa sehari-hari. Abaikan bagian definisi.",
            info: "Instruksi spesifik tentang apa yang harus dicari atau diabaikan oleh AI.",
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Analisis & Ekstraksi Data": {
      "Ekstraktor Entitas dari Teks": {
        description:
          "Tarik keluar informasi spesifik dari blok teks tidak terstruktur (nama orang, organisasi, lokasi, dll.).",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ekstraktor Data yang akan menganalisis teks tidak terstruktur dan mengekstrak entitas.",
        components: [
          {
            name: "sourceText",
            label: "Teks Sumber",
            type: "textarea",
            placeholder:
              "Tempelkan artikel, laporan, atau email di sini. AI akan memindai teks ini.",
            info: "Teks yang akan dianalisis untuk diekstrak informasinya.",
            validation: { min_length: 50 },
          },
          {
            name: "entitiesToExtract",
            label: "Entitas yang Akan Diekstrak (pisahkan koma)",
            type: "text",
            placeholder:
              "e.g., 'Nama Orang, Nama Organisasi, Lokasi, Tanggal, Produk, Uang'",
            info: "Jenis informasi apa yang Anda cari di dalam teks?",
          },
          {
            name: "outputFormat",
            label: "Format Output",
            type: "select",
            options: [
              "Daftar Sederhana per Kategori",
              "JSON dengan Kategori",
              "Tabel",
              "Lainnya...",
            ],
            info: "Pilih cara penyajian data yang diekstrak.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Abaikan nama orang yang hanya disebutkan sekali. Kelompokkan semua lokasi berdasarkan negara. Pastikan format tanggal konsisten (YYYY-MM-DD).",
            info: "Aturan spesifik untuk proses ekstraksi dan pemformatan.",
          },
        ],
      },
      "Analis Sentimen & Tema Umpan Balik": {
        description:
          "Proses puluhan ulasan pelanggan untuk mengidentifikasi sentimen umum dan tema yang sering dibicarakan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Analis Sentimen yang akan menganalisis data umpan balik dan mengidentifikasi sentimen dan tema.",
        components: [
          {
            name: "feedbackData",
            label: "Data Umpan Balik/Ulasan",
            type: "textarea",
            placeholder:
              "Tempelkan semua ulasan di sini, pisahkan setiap ulasan dengan baris baru atau sebuah simbol (e.g., '---').",
            info: "Semakin banyak data yang Anda berikan, semakin akurat analisisnya.",
            validation: { min_length: 50 },
          },
          {
            name: "analysisType",
            label: "Jenis Analisis",
            type: "select",
            options: [
              "Analisis Sentimen (Positif/Negatif/Netral)",
              "Identifikasi Tema Utama",
              "Keduanya",
              "Lainnya...",
            ],
            info: "Pilih apa yang ingin Anda ketahui dari data ini.",
          },
          {
            name: "outputFormat",
            label: "Format Laporan",
            type: "select",
            options: [
              "Ringkasan Paragraf",
              "Poin-poin per Tema",
              "Tabel dengan Persentase Sentimen",
              "Lainnya...",
            ],
            info: "Pilih cara penyajian hasil analisis.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Kelompokkan tema ke dalam kategori 'Layanan', 'Produk', 'Harga'. Hitung berapa kali setiap tema disebutkan. Abaikan ulasan yang kurang dari 5 kata.",
            info: "Instruksi spesifik untuk proses analisis dan pelaporan.",
          },
        ],
      },
    },
    "Pengembangan Diri & Psikologi": {
      "Alat Bantu Jurnal Terpandu": {
        description:
          "Dapatkan serangkaian pertanyaan atau prompt yang merangsang pemikiran untuk jurnal harian Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Fasilitator Jurnal yang akan menghasilkan serangkaian pertanyaan atau prompt untuk jurnal.",
        components: [
          {
            name: "journalTheme",
            label: "Tema Jurnal Hari Ini",
            type: "select",
            options: [
              "Rasa Syukur (Gratitude)",
              "Refleksi Harian",
              "Penetapan Tujuan",
              "Mengatasi Stres/Kecemasan",
              "Meningkatkan Kreativitas",
              "Lainnya...",
            ],
            info: "Pilih fokus untuk sesi jurnal Anda.",
          },
          {
            name: "currentMood",
            label: "Perasaan Anda Saat Ini (Opsional)",
            type: "text",
            placeholder: "e.g., 'Merasa lelah', 'Bersemangat', 'Sedikit cemas'",
            info: "Membantu AI menyesuaikan pertanyaan agar lebih relevan dengan kondisi Anda.",
          },
          {
            name: "numberOfPrompts",
            label: "Jumlah Prompt/Pertanyaan",
            type: "number",
            placeholder: "e.g., 5",
            info: "Berapa banyak pertanyaan panduan yang Anda inginkan?",
          },
          {
            name: "promptStyle",
            label: "Gaya Prompt",
            type: "select",
            options: [
              "Pertanyaan Reflektif Mendalam",
              "Latihan Singkat & Praktis",
              "Prompt Kreatif & Imajinatif",
              "Lainnya...",
            ],
            info: "Pilih jenis pertanyaan yang paling Anda butuhkan saat ini.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Fokus pada pencapaian kecil. Hindari pertanyaan tentang pekerjaan. Buat pertanyaan yang bisa dijawab dalam 1-2 kalimat.",
            info: "Preferensi personal untuk memandu AI.",
          },
        ],
      },
      "Simulator Latihan Percakapan Sulit": {
        description:
          "Berlatih untuk percakapan sulit dengan AI yang berperan sebagai lawan bicara.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pelatih Komunikasi yang akan mensimulasikan percakapan sulit.",
        components: [
          {
            name: "scenario",
            label: "Skenario Percakapan",
            type: "text",
            placeholder:
              "e.g., 'Meminta kenaikan gaji', 'Memberikan umpan balik negatif kepada rekan kerja'",
            info: "Jelaskan situasi spesifik dari percakapan yang akan Anda latih.",
          },
          {
            name: "myRole",
            label: "Peran Saya",
            type: "text",
            placeholder: "e.g., 'Karyawan', 'Manajer Proyek'",
            info: "Anda akan berperan sebagai siapa dalam simulasi ini?",
          },
          {
            name: "aiRole",
            label: "Peran AI (Lawan Bicara)",
            type: "textarea",
            placeholder:
              "e.g., 'Seorang atasan yang sibuk dan fokus pada data.', 'Seorang rekan kerja yang defensif dan mudah tersinggung.'",
            info: "Berikan AI persona yang spesifik. Jelaskan kepribadian dan kemungkinan reaksinya.",
          },
          {
            name: "myOpeningStatement",
            label: "Kalimat Pembuka Saya",
            type: "textarea",
            placeholder:
              "e.g., 'Pak/Bu, terima kasih atas waktunya. Saya ingin mendiskusikan tentang kompensasi saya.'",
            info: "Bagaimana Anda akan memulai percakapan ini? AI akan merespons dari sini.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tujuan saya adalah mendapatkan kenaikan 15%. AI harus mencoba untuk menolak permintaan saya setidaknya dua kali. Buat agar AI memberikan argumen balasan yang logis.",
            info: "Aturan main dan tujuan dari simulasi ini.",
          },
        ],
      },
    },
    "Hiburan & Permainan": {
      "Generator Deskripsi Karakter RPG": {
        description:
          "Buat latar belakang, kepribadian, dan penampilan untuk karakter dalam permainan role-playing (e.g., D&D).",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pencipta Karakter RPG yang akan menghasilkan latar belakang, kepribadian, dan penampilan untuk karakter.",
        components: [
          {
            name: "gameSystem",
            label: "Sistem Permainan (Opsional)",
            type: "text",
            placeholder: "e.g., 'Dungeons & Dragons 5e', 'Pathfinder'",
            info: "Sistem permainan dapat mempengaruhi terminologi.",
          },
          {
            name: "characterClass",
            label: "Kelas Karakter",
            type: "text",
            placeholder: "e.g., 'Rogue', 'Wizard', 'Paladin'",
            info: "Profesi atau peran karakter dalam petualangan.",
          },
          {
            name: "characterRace",
            label: "Ras Karakter",
            type: "text",
            placeholder: "e.g., 'Elf', 'Dwarf', 'Human'",
            info: "Asal-usul atau spesies dari karakter.",
          },
          {
            name: "alignment",
            label: "Alignment (Watak)",
            type: "select",
            options: [
              "Lawful Good",
              "Neutral Good",
              "Chaotic Good",
              "Lawful Neutral",
              "True Neutral",
              "Chaotic Neutral",
              "Lawful Evil",
              "Neutral Evil",
              "Chaotic Evil",
              "Lainnya...",
            ],
            info: "Kompas moral dari karakter Anda.",
          },
          {
            name: "keyTraits",
            label: "Sifat Kunci/Keunikan",
            type: "textarea",
            placeholder:
              "e.g., 'Sangat takut pada laba-labar, memiliki bekas luka di mata kiri, selalu berbicara dengan sarkasme.'",
            info: "Berikan 2-3 detail unik untuk membuat karakter menonjol.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Buat latar belakang yang tragis. Hubungkan cerita karakter dengan sebuah artefak kuno. Karakternya harus berasal dari kota di padang pasir.",
            info: "Instruksi kreatif untuk memperkaya narasi karakter.",
          },
        ],
      },
      "Generator Teka-teki & Riddle": {
        description:
          "Buat teka-teki, riddle, atau puzzle logika yang orisinal berdasarkan sebuah tema atau jawaban.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perancang Teka-Teki yang akan membuat teka-teki, riddle, atau puzzle logika.",
        components: [
          {
            name: "puzzleType",
            label: "Jenis Teka-teki",
            type: "select",
            options: [
              "Riddle (Teka-teki kiasan)",
              "Puzzle Logika",
              "Teka-teki Kata",
              "Lainnya...",
            ],
            info: "Pilih jenis tantangan yang ingin Anda buat.",
          },
          {
            name: "answer",
            label: "Jawaban Teka-teki",
            type: "text",
            placeholder: "e.g., 'Sebuah gema', 'Waktu', 'Papan catur'",
            info: "Apa jawaban dari teka-teki yang akan dibuat?",
          },
          {
            name: "difficultyLevel",
            label: "Tingkat Kesulitan",
            type: "select",
            options: [
              "Mudah (untuk anak-anak)",
              "Menengah",
              "Sulit",
              "Sangat Sulit (Kriptik)",
              "Lainnya...",
            ],
            info: "Seberapa menantang teka-teki yang Anda inginkan?",
          },
          {
            name: "theme",
            label: "Tema (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Alam', 'Teknologi', 'Fantasi Abad Pertengahan'",
            info: "Tema akan mempengaruhi pilihan kata dan kiasan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Teka-teki harus berima. Buat dalam bentuk dialog. Jawaban tidak boleh disebutkan secara langsung di dalam teka-teki. Sertakan satu petunjuk palsu.",
            info: "Aturan atau batasan spesifik untuk pembuatan teka-teki.",
          },
        ],
      },
    },
  },
  "Prompt Proyek": {
    "Kreasi Digital Personal & Acara": {
      "Generator Undangan & Kartu Acara Dinamis": {
        description:
          "Buat undangan atau kartu ucapan untuk berbagai keperluan, dari pernikahan hingga bisnis.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perancang Undangan yang akan menganalisis jenis acara dan menyusun teks undangan atau kartu ucapan.",
        components: [
          {
            name: "eventType",
            label: "Jenis Acara",
            type: "select",
            options: [
              "Pernikahan",
              "Bisnis/Resmi",
              "Ulang Tahun/Personal",
              "Workshop/Komunitas",
              "Terima Kasih",
            ],
            info: "Pilih jenis acara untuk menentukan format dan nada.",
            validation: { regex: "^(?!Pilih Jenis Acara...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "eventType",
          options: {
            Pernikahan: [
              {
                name: "coupleNames",
                label: "Nama Pasangan",
                type: "text",
                placeholder: "e.g., 'Sarah & David'",
                info: "Nama kedua mempelai.",
                validation: { min_length: 3 },
              },
              {
                name: "hosting_info",
                label: "Penyelenggara Acara",
                type: "text",
                placeholder: "e.g., 'Bersama kedua orang tua'",
                info: "Siapa yang mengundang? (misal: 'Mr. & Mrs. Budiman mengundang...')",
                validation: { min_length: 3 },
              },
              {
                name: "weddingStyle",
                label: "Gaya Pernikahan",
                type: "select",
                options: [
                  "Formal & Tradisional",
                  "Modern & Minimalis",
                  "Rustic & Santai",
                  "Bohemian & Unik",
                ],
                info: "Gaya keseluruhan akan mempengaruhi pilihan kata.",
              },
              {
                name: "ceremonyDateTime",
                label: "Tanggal & Waktu Akad/Pemberkatan",
                type: "text",
                placeholder: "e.g., 'Sabtu, 28 Desember 2025, Pukul 09:00'",
                info: "Waktu untuk acara inti.",
                validation: { min_length: 3 },
              },
              {
                name: "ceremonyLocation",
                label: "Lokasi Akad/Pemberkatan",
                type: "text",
                placeholder: "e.g., 'Masjid Istiqlal, Jakarta'",
                info: "Tempat acara inti.",
                validation: { min_length: 3 },
              },
              {
                name: "receptionDateTime",
                label: "Tanggal & Waktu Resepsi",
                type: "text",
                placeholder: "e.g., 'Sabtu, 28 Desember 2025, Pukul 19:00'",
                info: "Waktu untuk perayaan.",
                validation: { min_length: 3 },
              },
              {
                name: "receptionLocation",
                label: "Lokasi Resepsi",
                type: "text",
                placeholder:
                  "e.g., 'Gedung Serbaguna ABC, Jl. Merdeka No. 123'",
                info: "Tempat perayaan.",
                validation: { min_length: 3 },
              },
              {
                name: "dressCode",
                label: "Aturan Berpakaian (Dress Code)",
                type: "text",
                placeholder: "e.g., 'Batik, Jas Formal'",
                info: "Pakaian yang disarankan untuk tamu.",
                validation: { min_length: 3 },
              },
              {
                name: "rsvpInfo",
                label: "Informasi RSVP",
                type: "text",
                placeholder:
                  "e.g., 'Mohon konfirmasi ke 0812-3456-7890 (WhatsApp) sebelum 1 Desember'",
                info: "Cara dan batas waktu konfirmasi kehadiran.",
                validation: { min_length: 3 },
              },
              {
                name: "googleMapsLink",
                label: "Tautan Google Maps",
                type: "text",
                placeholder: "e.g., 'https://maps.app.goo.gl/xyz'",
                info: "Tautan Google Maps untuk lokasi acara.",
              },
            ],
            "Bisnis/Resmi": [
              {
                name: "eventName",
                label: "Nama Acara",
                type: "text",
                placeholder: "e.g., 'Konferensi Pers Tahunan'",
                info: "Judul resmi acara.",
                validation: { min_length: 5 },
              },
              {
                name: "organizer",
                label: "Penyelenggara",
                type: "text",
                placeholder: "e.g., 'PT Jaya Abadi'",
                info: "Organisasi atau departemen yang bertanggung jawab.",
                validation: { min_length: 5 },
              },
              {
                name: "objective",
                label: "Tujuan Acara",
                type: "text",
                placeholder: "e.g., 'Meluncurkan produk baru'",
                info: "Apa tujuan utama dari acara ini?",
                validation: { min_length: 5 },
              },
              {
                name: "keySpeaker",
                label: "Pembicara Utama",
                type: "text",
                placeholder: "e.g., 'Dr. Budi Santoso, CEO'",
                info: "Tokoh penting yang akan berbicara.",
                validation: { min_length: 5 },
              },
              {
                name: "dateTime",
                label: "Tanggal & Waktu",
                type: "text",
                placeholder:
                  "e.g., 'Senin, 20 Oktober 2025, 10:00 - 12:00 WIB'",
                info: "Waktu pelaksanaan acara.",
                validation: { min_length: 5 },
              },
              {
                name: "location",
                label: "Lokasi/Platform",
                type: "text",
                placeholder: "e.g., 'Ballroom Hotel Indonesia / Zoom Webinar'",
                info: "Tempat fisik atau platform virtual.",
                validation: { min_length: 5 },
              },
              {
                name: "agenda",
                label: "Agenda Singkat",
                type: "textarea",
                placeholder:
                  "e.g., '10:00 - Pembukaan\n10:15 - Sambutan CEO\n10:30 - Demo Produk'",
                info: "Rundown singkat acara.",
                validation: { min_length: 20 },
              },
              {
                name: "registrationLink",
                label: "Tautan Pendaftaran/RSVP",
                type: "text",
                placeholder: "e.g., 'bit.ly/DaftarAcaraXYZ'",
                info: "Link untuk konfirmasi atau pendaftaran.",
                validation: { min_length: 10 },
              },
              {
                name: "googleMapsLink",
                label: "Tautan Google Maps",
                type: "text",
                placeholder: "e.g., 'https://maps.app.goo.gl/xyz'",
                info: "Tautan Google Maps untuk lokasi acara.",
              },
            ],
            "Ulang Tahun/Personal": [
              {
                name: "personBeingCelebrated",
                label: "Nama yang Berulang Tahun",
                type: "text",
                placeholder: "e.g., 'Andi'",
                info: "Siapa yang merayakan?",
                validation: { min_length: 3 },
              },
              {
                name: "age",
                label: "Ulang Tahun ke- (Opsional)",
                type: "number",
                placeholder: "e.g., 30",
                info: "Perayaan ulang tahun yang ke berapa.",
                validation: { min_value: 1, max_value: 120 },
              },
              {
                name: "theme",
                label: "Tema Pesta",
                type: "text",
                placeholder: "e.g., 'Pesta Topeng, 90-an, Superhero'",
                info: "Tema spesifik untuk kostum atau dekorasi.",
                validation: { min_length: 3 },
              },
              {
                name: "dateTime",
                label: "Tanggal & Waktu",
                type: "text",
                placeholder: "e.g., 'Sabtu, 15 November 2025, Pukul 19:00'",
                info: "Kapan pesta akan diadakan?",
                validation: { min_length: 5 },
              },
              {
                name: "location",
                label: "Lokasi Pesta",
                type: "text",
                placeholder: "e.g., 'Rumah Andi, Jl. Bahagia No. 5'",
                info: "Di mana pesta akan diadakan?",
                validation: { min_length: 5 },
              },
              {
                name: "dressCode",
                label: "Aturan Berpakaian (Dress Code)",
                type: "text",
                placeholder: "e.g., 'Santai, Sesuai tema'",
                info: "Pakaian yang disarankan.",
                validation: { min_length: 3 },
              },
              {
                name: "rsvpContact",
                label: "Kontak RSVP",
                type: "text",
                placeholder: "e.g., 'Hubungi Budi di 0811-2233-4455'",
                info: "Siapa yang harus dihubungi untuk konfirmasi.",
                validation: { min_length: 5 },
              },
              {
                name: "giftInfo",
                label: "Informasi Kado (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Tidak perlu membawa kado, kehadiranmu adalah hadiah terbaik!'",
                info: "Petunjuk mengenai hadiah.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "googleMapsLink",
                label: "Tautan Google Maps",
                type: "text",
                placeholder: "e.g., 'https://maps.app.goo.gl/xyz'",
                info: "Tautan Google Maps untuk lokasi acara.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
            "Workshop/Komunitas": [
              {
                name: "eventName",
                label: "Nama Workshop/Acara",
                type: "text",
                placeholder: "e.g., 'Workshop Desain UI/UX Dasar'",
                info: "Judul lengkap workshop atau acara komunitas.",
                validation: { min_length: 5 },
              },
              {
                name: "organizer",
                label: "Penyelenggara",
                type: "text",
                placeholder: "e.g., 'Komunitas Developer Jakarta'",
                info: "Nama organisasi atau individu yang menyelenggarakan acara.",
                validation: { min_length: 5 },
              },
              {
                name: "shortDescription",
                label: "Deskripsi Singkat Acara",
                type: "textarea",
                placeholder:
                  "e.g., 'Pelajari dasar-dasar desain antarmuka pengguna dan pengalaman pengguna dalam workshop interaktif ini.'",
                info: "Ringkasan singkat tentang apa yang akan dipelajari atau dilakukan peserta.",
                validation: { min_length: 20 },
              },
              {
                name: "dateTime",
                label: "Tanggal & Waktu",
                type: "text",
                placeholder:
                  "e.g., 'Sabtu, 10 Agustus 2025, Pukul 09:00 - 16:00 WIB'",
                info: "Waktu pelaksanaan acara.",
                validation: { min_length: 5 },
              },
              {
                name: "location",
                label: "Lokasi/Platform",
                type: "text",
                placeholder:
                  "e.g., 'Co-working Space X, Jl. Sudirman No. 10 / Zoom Webinar'",
                info: "Tempat fisik atau platform virtual.",
                validation: { min_length: 5 },
              },
              {
                name: "speakers",
                label: "Pembicara/Fasilitator (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Andi Wijaya (Desainer Senior), Budi Santoso (Praktisi UX)'",
                info: "Nama dan peran pembicara atau fasilitator.",
                optional: true,
                validation: { min_length: 10 },
              },
              {
                name: "agenda",
                label: "Agenda/Materi Kunci (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Sesi 1: Pengantar UI/UX. Sesi 2: Prinsip Desain. Sesi 3: Studi Kasus & Praktik.'",
                info: "Poin-poin utama atau jadwal singkat acara.",
                optional: true,
                validation: { min_length: 20 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder:
                  "e.g., 'Mahasiswa desain, pemula di bidang IT, anggota komunitas umum'",
                info: "Siapa yang dituju oleh workshop/acara ini?",
                validation: { min_length: 5 },
              },
              {
                name: "registrationFee",
                label: "Biaya Pendaftaran (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Gratis', 'Rp 50.000 (termasuk sertifikat)'",
                info: "Informasi biaya dan apa yang didapatkan peserta.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "registrationLink",
                label: "Tautan Pendaftaran/RSVP",
                type: "text",
                placeholder: "e.g., 'bit.ly/DaftarWorkshopUIUX'",
                info: "Link untuk pendaftaran atau konfirmasi kehadiran.",
                optional: true,
                validation: { min_length: 10 },
              },
              {
                name: "contactInfo",
                label: "Kontak Informasi",
                type: "text",
                placeholder: "e.g., 'admin@komunitas.com / 0812-3456-7890'",
                info: "Informasi kontak untuk pertanyaan lebih lanjut.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "googleMapsLink",
                label: "Tautan Google Maps (Opsional)",
                type: "text",
                placeholder: "e.g., 'https://maps.app.goo.gl/xyz'",
                info: "Tautan Google Maps untuk lokasi acara fisik.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
            "Terima Kasih": [
              {
                name: "senderName",
                label: "Nama Pengirim",
                type: "text",
                placeholder: "e.g., 'Sarah & David', 'Tim XYZ'",
                info: "Siapa yang mengucapkan terima kasih.",
                validation: { min_length: 3 },
              },
              {
                name: "recipientName",
                label: "Nama Penerima (Opsional)",
                type: "text",
                placeholder: "e.g., 'Bapak/Ibu Budi', 'Para Tamu Undangan'",
                info: "Jika ingin personalisasi, sebutkan nama penerima.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "reason",
                label: "Alasan Ucapan Terima Kasih",
                type: "textarea",
                placeholder:
                  "e.g., 'atas kehadiran Anda di pernikahan kami', 'atas dukungan Anda pada proyek ini', 'atas hadiah yang indah'",
                info: "Jelaskan secara spesifik mengapa Anda berterima kasih.",
                validation: { min_length: 10 },
              },
              {
                name: "eventReference",
                label: "Referensi Acara (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Pernikahan kami pada 28 Desember', 'Acara peluncuran produk'",
                info: "Jika ucapan terima kasih terkait acara tertentu.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "messageTone",
                label: "Gaya & Nada Pesan",
                type: "select",
                options: [
                  "Tulus & Hangat",
                  "Formal & Profesional",
                  "Singkat & Efisien",
                  "Penuh Sukacita",
                ],
                info: "Pilih nuansa pesan yang ingin disampaikan.",
              },
              {
                name: "additionalDetails",
                label: "Detail Tambahan (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Sertakan foto kami berdua.', 'Sebutkan harapan untuk kolaborasi di masa depan.'",
                info: "Informasi atau instruksi spesifik lainnya.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus sangat peka terhadap `Jenis Acara`. Jika pengguna tidak memberikan `Gaya & Nada`, AI harus memilih yang paling sesuai secara default (misal: 'Elegan' untuk Pernikahan, 'Profesional' untuk Bisnis). Tujuan utamanya adalah menghasilkan output yang terasa otentik dan dibuat khusus untuk acara tersebut, bukan hasil dari template generik.",
      },
    },
    "Konten & Pemasaran": {
      "Generator Konten Multi-Platform": {
        description:
          "Buat konten untuk berbagai platform—artikel blog yang SEO-friendly, postingan media sosial yang menarik, deskripsi produk yang menjual, skrip video pendek, bahkan lirik lagu.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Kepala Strategi Konten yang akan menghasilkan konten yang dioptimalkan untuk berbagai platform.",
        components: [
          {
            name: "contentType",
            label: "Jenis Konten",
            type: "select",
            options: [
              "Artikel Blog",
              "Post Media Sosial",
              "Deskripsi Produk",
              "Skrip Video Pendek",
              "Resensi",
              "Lirik Lagu",
              "Naskah Iklan",
            ],
            info: "Pilih jenis konten yang ingin Anda hasilkan.",
          },
        ],
        dynamicSubcomponents: {
          trigger: "contentType",
          options: {
            "Artikel Blog": [
              {
                name: "topic",
                label: "Topik/Judul Utama",
                type: "text",
                placeholder: "e.g., 'Manfaat Kopi Organik'",
                info: "Inti dari konten yang akan dibuat.",
                validation: { min_length: 5 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder: "e.g., 'Profesional muda, Ibu rumah tangga'",
                info: "Siapa yang akan mengonsumsi konten ini?",
                validation: { min_length: 5 },
              },
              {
                name: "keywords",
                label: "Kata Kunci SEO",
                type: "text",
                placeholder: "e.g., 'kopi organik, kesehatan, produktivitas'",
                info: "Kata kunci untuk optimasi mesin pencari.",
                validation: { min_length: 3 },
              },
              {
                name: "tone",
                label: "Gaya & Nada",
                type: "select",
                options: ["Informatif", "Profesional", "Kasual", "Persuasif"],
                info: "Pilih nuansa yang diinginkan untuk artikel Anda.",
              },
              {
                name: "cta",
                label: "Tujuan/Call to Action (CTA)",
                type: "text",
                placeholder:
                  "e.g., 'Kunjungi website kami untuk info lebih lanjut'",
                info: "Tindakan apa yang Anda ingin pembaca lakukan?",
                validation: { min_length: 5 },
              },
            ],
            "Post Media Sosial": [
              {
                name: "platform",
                label: "Platform Spesifik",
                type: "select",
                options: [
                  "Instagram",
                  "Facebook",
                  "Twitter/X",
                  "LinkedIn",
                  "TikTok",
                ],
                info: "Pilih platform media sosial yang dituju.",
              },
              {
                name: "topic",
                label: "Pesan Utama Postingan",
                type: "text",
                placeholder: "e.g., 'Diskon 50% untuk produk baru kami!'",
                info: "Inti dari pesan yang ingin disampaikan.",
                validation: { min_length: 5 },
              },
              {
                name: "visualIdea",
                label: "Ide Visual",
                type: "text",
                placeholder: "e.g., 'Foto produk dengan latar belakang cerah'",
                info: "Deskripsikan gambar atau video yang akan menyertai teks.",
                validation: { min_length: 10 },
              },
              {
                name: "tone",
                label: "Gaya & Nada",
                type: "select",
                options: [
                  "Menarik & Singkat",
                  "Humoris",
                  "Inspiratif",
                  "Informatif",
                ],
                info: "Pilih nuansa yang sesuai dengan platform.",
              },
              {
                name: "hashtagSuggestions",
                label: "Saran Hashtag",
                type: "text",
                placeholder: "e.g., '#promo #diskon #produkkecantikan'",
                info: "Saran hashtag untuk meningkatkan jangkauan.",
                validation: { min_length: 3 },
              },
            ],
            "Deskripsi Produk": [
              {
                name: "productName",
                label: "Nama Produk",
                type: "text",
                placeholder: "e.g., 'Sepatu Lari Cepat X2000'",
                info: "Nama lengkap produk.",
                validation: { min_length: 5 },
              },
              {
                name: "features",
                label: "Fitur-Fitur Utama",
                type: "textarea",
                placeholder:
                  "e.g., 'Sol responsif, bahan ringan, desain aerodinamis'",
                info: "Sebutkan fitur-fitur utama produk.",
                validation: { min_length: 10 },
              },
              {
                name: "benefits",
                label: "Manfaat untuk Pelanggan",
                type: "textarea",
                placeholder:
                  "e.g., 'Lari lebih cepat, mengurangi risiko cedera, nyaman dipakai seharian'",
                info: "Jelaskan bagaimana fitur tersebut menguntungkan pelanggan.",
                validation: { min_length: 10 },
              },
              {
                name: "targetAudience",
                label: "Target Pelanggan",
                type: "text",
                placeholder: "e.g., 'Pelari profesional, penggemar olahraga'",
                info: "Siapa target pasar utama produk ini?",
                validation: { min_length: 5 },
              },
              {
                name: "tone",
                label: "Gaya & Nada",
                type: "select",
                options: [
                  "Persuasif & Menjual",
                  "Teknis & Detail",
                  "Mewah & Eksklusif",
                ],
                info: "Pilih nuansa yang sesuai dengan citra merek Anda.",
              },
            ],
            "Skrip Video Pendek": [
              {
                name: "videoTopic",
                label: "Topik Video",
                type: "text",
                placeholder: "e.g., 'Tutorial makeup 5 menit'",
                info: "Judul atau ide utama video.",
                validation: { min_length: 5 },
              },
              {
                name: "hook",
                label: "Hook (3 Detik Pertama)",
                type: "text",
                placeholder: "e.g., 'Tampil cantik dalam 5 menit? Bisa!'",
                info: "Kalimat pembuka yang menarik perhatian.",
                validation: { min_length: 5 },
              },
              {
                name: "keyScenes",
                label: "Adegan-Adegan Kunci",
                type: "textarea",
                placeholder:
                  "e.g., 'Scene 1: Tampilkan semua produk. Scene 2: Langkah pertama. Scene 3: Hasil akhir.'",
                info: "Urutan adegan utama dalam video.",
                validation: { min_length: 10 },
              },
              {
                name: "duration",
                label: "Target Durasi (detik)",
                type: "number",
                placeholder: "e.g., 60",
                info: "Perkiraan panjang video.",
                validation: { min_value: 5, max_value: 300 },
              },
              {
                name: "cta",
                label: "Call to Action di Akhir",
                type: "text",
                placeholder: "e.g., 'Jangan lupa like dan follow!'",
                info: "Ajak penonton untuk berinteraksi.",
                validation: { min_length: 5 },
              },
            ],
            Resensi: [
              {
                name: "itemToReview",
                label: "Item yang Diresensi",
                type: "text",
                placeholder:
                  "e.g., 'Buku 'Filosofi Teras', Film 'Parasite', Smartphone XYZ'",
                info: "Produk, buku, film, atau layanan yang akan diresensi.",
                validation: { min_length: 5 },
              },
              {
                name: "reviewType",
                label: "Jenis Resensi",
                type: "select",
                options: ["Positif", "Negatif", "Seimbang", "Perbandingan"],
                info: "Fokus resensi (misal: menyoroti kelebihan, kekurangan, atau perbandingan).",
              },
              {
                name: "keyPoints",
                label: "Poin-Poin Kunci yang Ingin Disampaikan",
                type: "textarea",
                placeholder:
                  "e.g., 'Kelebihan: plot twist tak terduga, akting memukau. Kekurangan: pacing lambat di awal.'",
                info: "Sebutkan aspek-aspek utama yang ingin Anda bahas.",
                validation: { min_length: 20 },
              },
              {
                name: "rating",
                label: "Rating (Opsional)",
                type: "text",
                placeholder: "e.g., '4/5 bintang', 'Sangat Direkomendasikan'",
                info: "Penilaian keseluruhan jika ada.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "targetAudience",
                label: "Target Pembaca Resensi",
                type: "text",
                placeholder:
                  "e.g., 'Penggemar film horor, calon pembeli gadget'",
                info: "Siapa yang akan membaca resensi ini?",
                validation: { min_length: 5 },
              },
            ],
            "Lirik Lagu": [
              {
                name: "songTitle",
                label: "Judul Lagu (Opsional)",
                type: "text",
                placeholder: "e.g., 'Senja di Batas Kota'",
                info: "Judul lagu jika sudah ada.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "genre",
                label: "Genre Musik",
                type: "select",
                options: [
                  "Pop",
                  "Rock",
                  "R&B",
                  "Folk",
                  "Hip-Hop",
                  "Electronic",
                  "Lainnya...",
                ],
                info: "Genre akan mempengaruhi gaya bahasa dan struktur lirik.",
              },
              {
                name: "theme",
                label: "Tema Lagu",
                type: "text",
                placeholder:
                  "e.g., 'cinta pertama, patah hati, perjalanan hidup'",
                info: "Gagasan atau cerita utama di balik lagu.",
                validation: { min_length: 5 },
              },
              {
                name: "mood",
                label: "Suasana Hati Lagu",
                type: "select",
                options: [
                  "Senang & Ceria",
                  "Sedih & Melankolis",
                  "Energik & Memotivasi",
                  "Romantis & Intim",
                ],
                info: "Emosi utama yang ingin disampaikan melalui lirik.",
              },
              {
                name: "keyElements",
                label: "Elemen/Kata Kunci Wajib",
                type: "textarea",
                placeholder:
                  "e.g., 'sebutkan kata 'bintang', 'malam', 'harapan'",
                info: "Gambar, kata, atau frasa spesifik yang harus ada dalam lirik.",
                validation: { min_length: 5 },
              },
            ],
            "Naskah Iklan": [
              {
                name: "adPlatform",
                label: "Platform Iklan",
                type: "select",
                options: [
                  "Google Ads",
                  "Facebook/Instagram Ads",
                  "TikTok Ads",
                  "YouTube Ads",
                  "Lainnya...",
                ],
                info: "Platform akan mempengaruhi batasan karakter dan format.",
              },
              {
                name: "productService",
                label: "Produk/Layanan yang Diiklankan",
                type: "text",
                placeholder: "e.g., 'Kursus Online Bahasa Inggris'",
                info: "Apa yang Anda promosikan?",
              },
              {
                name: "targetAudience",
                label: "Target Audiens Iklan",
                type: "text",
                placeholder: "e.g., 'Pelajar SMA, Profesional Muda'",
                info: "Siapa yang ingin Anda jangkau dengan iklan ini?",
              },
              {
                name: "uniqueSellingPoint",
                label: "Unique Selling Point (USP)",
                type: "textarea",
                placeholder:
                  "e.g., 'Metode belajar interaktif, garansi mahir dalam 3 bulan.'",
                info: "Apa yang membuat produk/layanan Anda unik dan lebih baik?",
              },
              {
                name: "callToAction",
                label: "Call to Action (CTA)",
                type: "text",
                placeholder:
                  "e.g., 'Daftar Sekarang!', 'Unduh Aplikasi Gratis!'",
                info: "Tindakan spesifik yang Anda ingin audiens lakukan.",
              },
              {
                name: "adLength",
                label: "Panjang Iklan",
                type: "select",
                options: [
                  "Sangat Singkat (Headline & Deskripsi)",
                  "Singkat (Beberapa Kalimat)",
                  "Sedang (Paragraf Singkat)",
                ],
                info: "Pilih panjang teks iklan yang diinginkan.",
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus proaktif. Jika pengguna meminta 'Post Media Sosial' tanpa menyebut platform, buat versi untuk Instagram sebagai default. Jika tidak ada 'Gaya & Nada', pilih yang paling umum untuk 'Jenis Konten' (misal: 'Informatif' untuk Blog, 'Persuasif' untuk Deskripsi Produk). Selalu prioritaskan kejelasan, keringkasan, dan dampak sesuai dengan tujuan akhir konten (menjual, mengedukasi, atau menghibur). Untuk konten kreatif seperti lirik, jangan takut untuk menjadi lebih puitis dan abstrak.",
      },
    },
    "Branding & Identitas": {
      "Studio Branding & Identitas": {
        description:
          "Dapatkan bantuan untuk nama, slogan, dan konsep logo untuk bisnis atau proyek baru Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Direktur Kreatif Branding yang akan menerjemahkan esensi ide menjadi aset kreatif.",
        components: [
          {
            name: "assetType",
            label: "Jenis Aset Branding",
            type: "select",
            options: ["Nama Brand", "Slogan/Tagline", "Konsep Logo"],
            info: "Pilih aset branding yang Anda butuhkan.",
            validation: { regex: "^(?!Pilih Jenis Aset Branding...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "assetType",
          options: {
            "Nama Brand": [
              {
                name: "projectDescription",
                label: "Deskripsi Singkat Proyek",
                type: "textarea",
                placeholder:
                  "e.g., 'Sebuah kedai kopi yang fokus pada biji lokal dan suasana yang nyaman untuk bekerja.'",
                info: "Jelaskan apa yang Anda lakukan atau tawarkan.",
                validation: { min_length: 20 },
              },
              {
                name: "brandPersonality",
                label: "Kepribadian & Nilai Brand",
                type: "text",
                placeholder: "e.g., 'Modern, minimalis, ramah, tepercaya'",
                info: "Sebutkan 3-5 kata yang mendeskripsikan brand Anda.",
                validation: { min_length: 5 },
              },
              {
                name: "keywords",
                label: "Kata Kunci untuk Disertakan",
                type: "text",
                placeholder: "e.g., 'Jawa, pagi, tenang'",
                info: "Kata atau ide yang ingin Anda sertakan dalam nama.",
                validation: { min_length: 3 },
              },
              {
                name: "nameStyle",
                label: "Gaya Nama",
                type: "select",
                options: [
                  "Modern & Singkat",
                  "Klasik & Elegan",
                  "Deskriptif",
                  "Imajinatif & Unik",
                ],
                info: "Pilih gaya nama yang Anda inginkan.",
              },
            ],
            "Slogan/Tagline": [
              {
                name: "projectName",
                label: "Nama Proyek/Bisnis",
                type: "text",
                placeholder: "e.g., 'Kopi Pagi'",
                info: "Nama yang akan diasosiasikan dengan slogan ini.",
                validation: { min_length: 3 },
              },
              {
                name: "coreBenefit",
                label: "Manfaat Utama",
                type: "text",
                placeholder:
                  "e.g., 'Secangkir semangat untuk memulai hari Anda'",
                info: "Apa manfaat atau perasaan utama yang ingin disampaikan?",
                validation: { min_length: 10 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder: "e.g., 'Pekerja remote, mahasiswa'",
                info: "Siapa yang ingin Anda sapa dengan slogan ini?",
                validation: { min_length: 5 },
              },
              {
                name: "sloganStyle",
                label: "Gaya Slogan",
                type: "select",
                options: [
                  "Singkat & Berkesan",
                  "Deskriptif & Jelas",
                  "Cerdas & Berima",
                ],
                info: "Pilih gaya slogan yang Anda inginkan.",
              },
            ],
            "Konsep Logo": [
              {
                name: "projectName",
                label: "Nama Proyek/Bisnis",
                type: "text",
                placeholder: "e.g., 'Kopi Pagi'",
                info: "Teks utama yang mungkin ada di logo.",
                validation: { min_length: 3 },
              },
              {
                name: "logoType",
                label: "Jenis Logo",
                type: "select",
                options: [
                  "Wordmark (teks saja)",
                  "Pictorial Mark (simbol/ikon)",
                  "Combination Mark (teks & simbol)",
                  "Emblem",
                ],
                info: "Pilih jenis struktur logo yang Anda inginkan.",
              },
              {
                name: "visualElements",
                label: "Elemen Visual yang Diinginkan",
                type: "text",
                placeholder: "e.g., 'Biji kopi, matahari terbit, cangkir'",
                info: "Sebutkan objek atau simbol yang ingin Anda lihat di logo.",
                validation: { min_length: 5 },
              },
              {
                name: "colorPalette",
                label: "Palet Warna",
                type: "text",
                placeholder: "e.g., 'Coklat hangat, oranye, krem'",
                info: "Warna-warna yang Anda inginkan untuk logo.",
                validation: { min_length: 5 },
              },
              {
                name: "styleAesthetic",
                label: "Gaya & Estetika",
                type: "select",
                options: [
                  "Minimalis & Modern",
                  "Vintage & Klasik",
                  "Hand-drawn & Organik",
                ],
                info: "Pilih gaya visual keseluruhan untuk logo.",
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu memberikan beberapa opsi yang bervariasi dalam gaya dan pendekatan. Untuk nama, AI harus menyarankan nama yang terdengar baik saat diucapkan dan mudah dieja. Untuk slogan, prioritaskan keringkasan. Untuk konsep logo, fokus pada deskripsi yang bisa dipahami oleh desainer maupun non-desainer. Penting: Selalu sertakan disclaimer bahwa AI tidak dapat memeriksa ketersediaan merek dagang (trademark) atau domain, dan pengguna harus melakukan verifikasi sendiri.",
      },
    },
    "Perencanaan & Produktivitas Personal": {
      "Asisten Perencana Gaya Hidup Personal": {
        description:
          "Dapatkan rencana terstruktur untuk diet, olahraga, kebersihan, dan pengembangan diri.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Lifestyle Architect yang akan membuat rencana yang paling efektif dan memotivasi.",
        components: [
          {
            name: "planType",
            label: "Jenis Rencana",
            type: "select",
            options: [
              "Rencana Menu Makan",
              "Jadwal Olahraga",
              "Daftar Tugas",
              "Jadwal Kebersihan",
              "Rencana Pengembangan Diri",
              "Pelacak Kebiasaan",
            ],
            info: "Pilih aspek kehidupan yang ingin Anda rencanakan.",
            validation: { regex: "^(?!Pilih Jenis Rencana...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "planType",
          options: {
            "Rencana Menu Makan": [
              {
                name: "dietaryPreferences",
                label: "Preferensi Diet",
                type: "select",
                options: ["Omnivore", "Vegetarian", "Vegan", "Keto", "Paleo"],
                info: "Pilih jenis diet yang Anda ikuti.",
              },
              {
                name: "allergies",
                label: "Alergi atau Pantangan",
                type: "text",
                placeholder: "e.g., 'Kacang, gluten, susu'",
                info: "Sebutkan makanan yang harus dihindari.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "healthGoal",
                label: "Tujuan Kesehatan",
                type: "text",
                placeholder:
                  "e.g., 'Menurunkan berat badan, menambah massa otot'",
                info: "Apa tujuan utama dari rencana makan ini?",
                validation: { min_length: 5 },
              },
              {
                name: "numberOfMeals",
                label: "Jumlah Makanan per Hari",
                type: "number",
                placeholder: "e.g., 3",
                info: "Berapa kali Anda makan dalam sehari?",
                validation: { min_value: 1, max_value: 6 },
              },
              {
                name: "cookTime",
                label: "Waktu Memasak Maksimal (menit)",
                type: "number",
                placeholder: "e.g., 30",
                info: "Berapa lama waktu yang Anda miliki untuk memasak?",
                validation: { min_value: 5, max_value: 180 },
              },
            ],
            "Jadwal Olahraga": [
              {
                name: "fitnessLevel",
                label: "Tingkat Kebugaran",
                type: "select",
                options: ["Pemula", "Menengah", "Mahir"],
                info: "Pilih tingkat kebugaran Anda saat ini.",
              },
              {
                name: "workoutFrequency",
                label: "Frekuensi Olahraga (hari/minggu)",
                type: "number",
                placeholder: "e.g., 3",
                info: "Berapa hari dalam seminggu Anda bisa berolahraga?",
                validation: { min_value: 1, max_value: 7 },
              },
              {
                name: "workoutDuration",
                label: "Durasi Olahraga (menit)",
                type: "number",
                placeholder: "e.g., 45",
                info: "Berapa lama waktu yang Anda miliki untuk setiap sesi?",
                validation: { min_value: 15, max_value: 180 },
              },
              {
                name: "workoutType",
                label: "Jenis Olahraga yang Disukai",
                type: "text",
                placeholder: "e.g., 'Angkat beban, lari, yoga'",
                info: "Sebutkan jenis olahraga yang Anda nikmati.",
                validation: { min_length: 3 },
              },
              {
                name: "equipment",
                label: "Peralatan yang Tersedia",
                type: "text",
                placeholder: "e.g., 'Dumbbell, matras yoga, tidak ada alat'",
                info: "Sebutkan peralatan yang Anda miliki.",
                optional: true,
                validation: { min_length: 3 },
              },
            ],
            "Daftar Tugas": [
              {
                name: "mainProject",
                label: "Proyek atau Tujuan Utama",
                type: "text",
                placeholder: "e.g., 'Menyelesaikan laporan kuartalan'",
                info: "Apa tujuan besar yang ingin Anda capai?",
                validation: { min_length: 5 },
              },
              {
                name: "deadline",
                label: "Tenggat Waktu",
                type: "text",
                placeholder: "e.g., 'Jumat ini'",
                info: "Kapan proyek ini harus selesai?",
                validation: { min_length: 5 },
              },
              {
                name: "priorityLevel",
                label: "Tingkat Prioritas",
                type: "select",
                options: ["Tinggi", "Sedang", "Rendah"],
                info: "Seberapa penting proyek ini?",
              },
              {
                name: "subtasks",
                label: "Tugas-tugas Kecil (jika sudah ada)",
                type: "textarea",
                placeholder: "e.g., 'Kumpulkan data, buat draf, revisi'",
                info: "Sebutkan langkah-langkah yang sudah Anda ketahui.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
            "Jadwal Kebersihan": [
              {
                name: "cleaningFrequency",
                label: "Frekuensi Kebersihan",
                type: "select",
                options: ["Harian", "Mingguan", "Bulanan", "Musiman"],
                info: "Seberapa sering Anda ingin membersihkan?",
              },
              {
                name: "areasToClean",
                label: "Area yang Akan Dibersihkan",
                type: "textarea",
                placeholder:
                  "e.g., 'Dapur, Kamar Mandi, Ruang Tamu, Kamar Tidur'",
                info: "Sebutkan area spesifik di rumah atau kantor yang perlu dibersihkan.",
                validation: { min_length: 5 },
              },
              {
                name: "specificTasks",
                label: "Tugas Spesifik per Area (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Dapur: cuci piring, lap meja, buang sampah. Kamar Mandi: sikat toilet, bersihkan wastafel.'",
                info: "Detail tugas kebersihan untuk setiap area.",
                optional: true,
                validation: { min_length: 10 },
              },
              {
                name: "timePerTask",
                label: "Estimasi Waktu per Tugas (menit)",
                type: "number",
                placeholder: "e.g., 15",
                info: "Perkiraan waktu yang dibutuhkan untuk setiap tugas kebersihan.",
                optional: true,
                validation: { min_value: 1, max_value: 240 },
              },
            ],
            "Rencana Pengembangan Diri": [
              {
                name: "developmentArea",
                label: "Area Pengembangan",
                type: "text",
                placeholder:
                  "e.g., 'Keterampilan Komunikasi, Manajemen Waktu, Belajar Bahasa Baru'",
                info: "Aspek diri yang ingin Anda tingkatkan.",
                validation: { min_length: 5 },
              },
              {
                name: "currentLevel",
                label: "Tingkat Saat Ini",
                type: "text",
                placeholder:
                  "e.g., 'Pemula, Cukup Baik, Perlu Peningkatan Signifikan'",
                info: "Evaluasi diri Anda saat ini di area tersebut.",
                validation: { min_length: 5 },
              },
              {
                name: "desiredOutcome",
                label: "Hasil yang Diinginkan",
                type: "textarea",
                placeholder:
                  "e.g., 'Mampu presentasi dengan percaya diri di depan 50 orang. Menguasai percakapan dasar bahasa Mandarin.'",
                info: "Apa yang ingin Anda capai secara spesifik dan terukur?",
                validation: { min_length: 10 },
              },
              {
                name: "actionSteps",
                label: "Langkah-Langkah Tindakan",
                type: "textarea",
                placeholder:
                  "e.g., 'Minggu 1: Ikuti kursus online. Minggu 2: Latihan berbicara dengan native speaker.'",
                info: "Langkah-langkah konkret yang akan Anda ambil untuk mencapai tujuan.",
                validation: { min_length: 10 },
              },
              {
                name: "resources",
                label: "Sumber Daya yang Dibutuhkan (Opsional)",
                type: "text",
                placeholder: "e.g., 'Buku, kursus online, mentor'",
                info: "Daftar sumber daya yang mungkin diperlukan.",
                optional: true,
                validation: { min_length: 3 },
              },
            ],
            "Pelacak Kebiasaan": [
              {
                name: "habitName",
                label: "Nama Kebiasaan",
                type: "text",
                placeholder: "e.g., 'Minum 8 gelas air', 'Membaca 30 menit'",
                info: "Kebiasaan yang ingin Anda bangun atau lacak.",
                validation: { min_length: 5 },
              },
              {
                name: "frequency",
                label: "Frekuensi",
                type: "select",
                options: ["Harian", "Mingguan", "Beberapa Kali Seminggu"],
                info: "Seberapa sering kebiasaan ini akan dilakukan?",
              },
              {
                name: "trigger",
                label: "Pemicu (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Setelah bangun tidur', 'Sebelum makan malam'",
                info: "Apa yang akan memicu Anda untuk melakukan kebiasaan ini?",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "reward",
                label: "Hadiah (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Menonton episode serial favorit', 'Makan camilan sehat'",
                info: "Hadiah kecil untuk memotivasi diri setelah berhasil.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "trackingMethod",
                label: "Metode Pelacakan",
                type: "select",
                options: ["Checklist Harian", "Aplikasi Mobile", "Jurnal"],
                info: "Bagaimana Anda akan melacak kemajuan kebiasaan ini?",
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu memberikan nasihat yang positif dan memotivasi. Untuk rencana terkait kesehatan (diet & olahraga), AI wajib menyertakan disclaimer: 'Saya adalah asisten AI dan bukan profesional medis. Selalu konsultasikan dengan dokter atau ahli gizi/pelatih bersertifikat sebelum memulai program kesehatan baru.' Jika pengguna memberikan batasan yang tidak realistis, AI harus memberikan saran yang lebih masuk akal dengan cara yang suportif.",
      },
    },
    "Generator Nama & Ide Kreatif": {
      "Generator Nama Universal": {
        description:
          "Dapatkan nama kreatif untuk bayi, bisnis, tim, karakter fiksi, dan lainnya.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Nomenclaturist & Onomastika Kreatif yang akan memberikan opsi nama yang relevan dan kreatif.",
        components: [
          {
            name: "category",
            label: "Kategori Penamaan",
            type: "select",
            options: [
              "Nama Bayi",
              "Nama Hewan Peliharaan",
              "Nama Bisnis/Produk",
              "Nama Tim/Komunitas",
              "Nama Karakter Fiksi",
              "Judul Acara/Karya",
              "Nama Domain/Hashtag",
            ],
            info: "Pilih untuk apa nama ini akan digunakan.",
          },
        ],
        dynamicSubcomponents: {
          trigger: "category",
          options: {
            "Nama Bayi": [
              {
                name: "gender",
                label: "Jenis Kelamin",
                type: "select",
                options: ["Laki-laki", "Perempuan", "Unisex"],
                info: "Pilih jenis kelamin.",
              },
              {
                name: "origin",
                label: "Asal Bahasa/Budaya (Opsional)",
                type: "text",
                placeholder: "e.g., 'Sansekerta, Latin, Jepang'",
                info: "Sebutkan asal nama yang Anda inginkan.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "meaning",
                label: "Makna yang Diinginkan",
                type: "text",
                placeholder: "e.g., 'Cahaya, bijaksana, kuat'",
                info: "Sebutkan makna atau harapan yang terkandung dalam nama.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "nameStyle",
                label: "Gaya Nama",
                type: "select",
                options: [
                  "Klasik & Populer",
                  "Modern & Unik",
                  "Singkat & Manis",
                ],
                info: "Pilih gaya nama yang Anda inginkan.",
              },
            ],
            "Nama Bisnis/Produk": [
              {
                name: "industry",
                label: "Industri/Bidang Usaha",
                type: "text",
                placeholder: "e.g., 'Teknologi, kuliner, fashion'",
                info: "Sebutkan industri tempat bisnis Anda beroperasi.",
                validation: { min_length: 3 },
              },
              {
                name: "coreConcept",
                label: "Konsep Inti",
                type: "text",
                placeholder: "e.g., 'Aplikasi untuk belajar investasi saham'",
                info: "Jelaskan secara singkat apa yang dilakukan bisnis/produk Anda.",
                validation: { min_length: 10 },
              },
              {
                name: "brandPersonality",
                label: "Kepribadian Brand",
                type: "text",
                placeholder: "e.g., 'Modern, tepercaya, mudah diakses'",
                info: "Sebutkan 3-5 kata yang mendeskripsikan brand Anda.",
                validation: { min_length: 5 },
              },
              {
                name: "keywords",
                label: "Kata Kunci untuk Disertakan",
                type: "text",
                placeholder: "e.g., 'Invest, dana, cerdas'",
                info: "Kata atau ide yang ingin Anda sertakan dalam nama.",
                optional: true,
                validation: { min_length: 3 },
              },
            ],
            "Nama Karakter Fiksi": [
              {
                name: "genre",
                label: "Genre Cerita",
                type: "text",
                placeholder: "e.g., 'Fantasi, fiksi ilmiah, misteri'",
                info: "Sebutkan genre cerita karakter Anda.",
                validation: { min_length: 3 },
              },
              {
                name: "role",
                label: "Peran Karakter",
                type: "select",
                options: ["Protagonis", "Antagonis", "Pendukung"],
                info: "Pilih peran karakter dalam cerita.",
              },
              {
                name: "traits",
                label: "Sifat & Ciri Khas",
                type: "text",
                placeholder:
                  "e.g., 'Pemberani, misterius, memiliki kekuatan sihir'",
                info: "Sebutkan sifat-sifat utama karakter.",
                validation: { min_length: 5 },
              },
              {
                name: "origin",
                label: "Asal-usul/Ras Karakter",
                type: "text",
                placeholder:
                  "e.g., 'Elf dari hutan kuno, manusia dari kota metropolitan'",
                info: "Sebutkan latar belakang karakter.",
                validation: { min_length: 5 },
              },
            ],
            "Nama Hewan Peliharaan": [
              {
                name: "animalType",
                label: "Jenis Hewan",
                type: "text",
                placeholder: "e.g., 'Kucing, Anjing, Burung'",
                info: "Jenis hewan peliharaan Anda.",
                validation: { min_length: 3 },
              },
              {
                name: "gender",
                label: "Jenis Kelamin (Opsional)",
                type: "select",
                options: ["Jantan", "Betina", "Tidak Tahu"],
                info: "Jenis kelamin hewan peliharaan.",
              },
              {
                name: "personalityTraits",
                label: "Sifat/Ciri Khas",
                type: "textarea",
                placeholder: "e.g., 'Lucu, Pemberani, Tenang, Aktif'",
                info: "Sifat atau ciri khas yang menonjol dari hewan peliharaan Anda.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "nameStyle",
                label: "Gaya Nama",
                type: "select",
                options: [
                  "Klasik",
                  "Modern",
                  "Unik",
                  "Lucu",
                  "Berdasarkan Makanan",
                ],
                info: "Pilih gaya nama yang Anda inginkan.",
              },
            ],
            "Nama Tim/Komunitas": [
              {
                name: "teamPurpose",
                label: "Tujuan Tim/Komunitas",
                type: "text",
                placeholder: "e.g., 'Tim Olahraga, Proyek IT, Komunitas Hobi'",
                info: "Tujuan utama dari tim atau komunitas ini.",
                validation: { min_length: 5 },
              },
              {
                name: "teamVibe",
                label: "Suasana/Vibe Tim",
                type: "select",
                options: [
                  "Profesional",
                  "Santai & Kreatif",
                  "Kompetitif",
                  "Inklusif",
                ],
                info: "Nuansa atau atmosfer yang ingin dibangun dalam tim/komunitas.",
              },
              {
                name: "keywords",
                label: "Kata Kunci untuk Disertakan (Opsional)",
                type: "text",
                placeholder: "e.g., 'Inovasi, Juara, Bersama, Solidaritas'",
                info: "Kata atau ide yang ingin Anda sertakan dalam nama tim/komunitas.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "memberCount",
                label: "Jumlah Anggota (Opsional)",
                type: "number",
                placeholder: "e.g., 5, 20, 100+",
                info: "Perkiraan jumlah anggota tim atau komunitas.",
                optional: true,
                validation: { min_value: 1 },
              },
            ],
            "Judul Acara/Karya": [
              {
                name: "eventType",
                label: "Jenis Acara/Karya",
                type: "select",
                options: [
                  "Seminar",
                  "Workshop",
                  "Konser Musik",
                  "Pameran Seni",
                  "Buku",
                  "Film",
                  "Podcast",
                ],
                info: "Pilih jenis acara atau karya yang akan diberi judul.",
              },
              {
                name: "mainTopic",
                label: "Topik Utama",
                type: "text",
                placeholder:
                  "e.g., 'Masa Depan AI', 'Seni Melukis Abstrak', 'Perjalanan Kuliner Indonesia'",
                info: "Inti dari acara atau karya tersebut.",
                validation: { min_length: 5 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder: "e.g., 'Developer, Seniman, Pecinta Kuliner'",
                info: "Siapa target audiens utama untuk judul ini?",
                validation: { min_length: 5 },
              },
              {
                name: "mood",
                label: "Suasana/Mood",
                type: "select",
                options: [
                  "Inspiratif",
                  "Edukatif",
                  "Menghibur",
                  "Misterius",
                  "Serius",
                ],
                info: "Suasana atau emosi yang ingin disampaikan oleh judul.",
              },
            ],
            "Nama Domain/Hashtag": [
              {
                name: "purpose",
                label: "Tujuan",
                type: "text",
                placeholder:
                  "e.g., 'Website Pribadi, Kampanye Pemasaran, Toko Online'",
                info: "Untuk apa nama domain atau hashtag ini akan digunakan?",
                validation: { min_length: 5 },
              },
              {
                name: "keywords",
                label: "Kata Kunci Utama",
                type: "text",
                placeholder: "e.g., 'fotografi, jakarta, kuliner'",
                info: "Kata kunci yang relevan dengan tujuan Anda.",
                validation: { min_length: 3 },
              },
              {
                name: "lengthPreference",
                label: "Preferensi Panjang",
                type: "select",
                options: ["Singkat", "Sedang", "Panjang"],
                info: "Apakah Anda menginginkan nama yang singkat, sedang, atau panjang?",
              },
              {
                name: "callToAction",
                label: "Saran untuk Cek Ketersediaan",
                type: "text",
                placeholder:
                  "e.g., 'Pastikan untuk memeriksa ketersediaan domain (.com, .id) dan handle media sosial (Instagram, Twitter) sebelum memutuskan.'",
                info: "Penting untuk selalu memeriksa ketersediaan nama yang dihasilkan.",
                validation: { min_length: 10 },
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu memberikan variasi nama yang luas, dari yang aman hingga yang lebih berani. Untuk nama bisnis/produk, sertakan saran untuk memeriksa ketersediaan domain dan media sosial. Untuk nama personal, pertimbangkan kemudahan pengucapan. Disclaimer wajib: 'Nama yang dihasilkan adalah saran kreatif. Pastikan untuk memeriksa ketersediaan merek dagang, domain, dan handle media sosial secara mandiri sebelum mengadopsi sebuah nama.'",
      },
    },
    "Perencanaan Acara & Manajemen": {
      "Manajer Perencanaan Acara Lengkap": {
        description:
          "Dapatkan bantuan terstruktur untuk merencanakan semua detail acara Anda.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Event Organizer Pro yang akan menyusun dokumen perencanaan acara.",
        components: [
          {
            name: "documentType",
            label: "Jenis Dokumen Acara",
            type: "select",
            options: [
              "Agenda/Itinerary",
              "Ide Tema Pesta",
              "Rencana Anggaran",
              "Daftar Tamu & RSVP",
              "Teks Pidato/Sambutan",
              "Checklist Vendor",
              "Ide Souvenir/Lomba",
            ],
            info: "Pilih dokumen perencanaan yang Anda butuhkan.",
            validation: { regex: "^(?!Pilih Jenis Dokumen Acara...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "documentType",
          options: {
            "Agenda/Itinerary": [
              {
                name: "eventType",
                label: "Jenis Acara",
                type: "text",
                placeholder: "e.g., 'Konferensi Bisnis'",
                info: "Sebutkan jenis acara untuk konteks.",
                validation: { min_length: 5 },
              },
              {
                name: "startTime",
                label: "Waktu Mulai Acara",
                type: "text",
                placeholder: "e.g., '09:00'",
                info: "Jam dimulainya acara.",
                validation: { min_length: 4 },
              },
              {
                name: "endTime",
                label: "Waktu Selesai Acara",
                type: "text",
                placeholder: "e.g., '17:00'",
                info: "Jam berakhirnya acara.",
                validation: { min_length: 4 },
              },
              {
                name: "keyActivities",
                label: "Aktivitas Utama & Durasi (menit)",
                type: "textarea",
                placeholder:
                  "e.g., 'Registrasi:30, Pembukaan:15, Sesi 1:60, Makan Siang:60'",
                info: "Sebutkan aktivitas utama dan perkiraan durasinya.",
                validation: { min_length: 20 },
              },
            ],
            "Rencana Anggaran": [
              {
                name: "totalBudget",
                label: "Total Anggaran",
                type: "number",
                placeholder: "e.g., 50000000",
                info: "Jumlah total dana yang tersedia.",
                validation: { min_value: 100000 },
              },
              {
                name: "expenseCategories",
                label: "Kategori Pengeluaran Utama",
                type: "text",
                placeholder: "e.g., 'Venue, Katering, Pemasaran, Hiburan'",
                info: "Sebutkan pos-pos pengeluaran utama.",
                validation: { min_length: 5 },
              },
              {
                name: "priority",
                label: "Prioritas Anggaran",
                type: "select",
                options: [
                  "Pengalaman Tamu",
                  "Pemasaran & Jangkauan",
                  "Hemat Biaya",
                ],
                info: "Pilih area yang menjadi prioritas utama dalam pengalokasian dana.",
              },
            ],
            "Teks Pidato/Sambutan": [
              {
                name: "speakerRole",
                label: "Peran Pembicara",
                type: "text",
                placeholder: "e.g., 'Ayah mempelai wanita, CEO, Ketua Panitia'",
                info: "Siapa yang akan memberikan pidato?",
                validation: { min_length: 5 },
              },
              {
                name: "speechGoal",
                label: "Tujuan Pidato",
                type: "text",
                placeholder: "e.g., 'Mengharukan, memotivasi, menyambut tamu'",
                info: "Apa pesan utama yang ingin disampaikan?",
                validation: { min_length: 10 },
              },
              {
                name: "speechTone",
                label: "Gaya & Nada Pidato",
                type: "select",
                options: ["Formal", "Santai & Humoris", "Inspiratif"],
                info: "Pilih nuansa yang diinginkan untuk pidato.",
              },
              {
                name: "duration",
                label: "Target Durasi (menit)",
                type: "number",
                placeholder: "e.g., 5",
                info: "Perkiraan panjang pidato.",
                validation: { min_value: 1, max_value: 60 },
              },
            ],
            "Ide Tema Pesta": [
              {
                name: "partyType",
                label: "Jenis Pesta",
                type: "text",
                placeholder:
                  "e.g., 'Ulang Tahun Anak, Pesta Kantor, Baby Shower'",
                info: "Jenis acara yang akan dirayakan.",
                validation: { min_length: 5 },
              },
              {
                name: "ageGroup",
                label: "Kelompok Usia Tamu",
                type: "text",
                placeholder: "e.g., 'Anak-anak (5-10 tahun), Remaja, Dewasa'",
                info: "Membantu menyesuaikan tema dan aktivitas.",
                validation: { min_length: 5 },
              },
              {
                name: "budgetLevel",
                label: "Tingkat Anggaran",
                type: "select",
                options: ["Hemat", "Menengah", "Mewah"],
                info: "Estimasi anggaran untuk pesta.",
              },
              {
                name: "interests",
                label: "Minat/Hobi (Opsional)",
                type: "text",
                placeholder:
                  "e.g., 'Superheroes, Luar Angkasa, Vintage, Musik 80-an'",
                info: "Minat khusus yang bisa menjadi inspirasi tema.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "locationType",
                label: "Jenis Lokasi (Opsional)",
                type: "select",
                options: ["Indoor", "Outdoor", "Keduanya"],
                info: "Apakah pesta akan diadakan di dalam atau luar ruangan?",
              },
            ],
            "Daftar Tamu & RSVP": [
              {
                name: "eventType",
                label: "Jenis Acara",
                type: "text",
                placeholder: "e.g., 'Pernikahan, Pesta Ulang Tahun'",
                info: "Acara yang daftar tamunya akan dibuat.",
                validation: { min_length: 5 },
              },
              {
                name: "totalGuests",
                label: "Perkiraan Jumlah Tamu",
                type: "number",
                placeholder: "e.g., 100",
                info: "Estimasi jumlah tamu yang diundang.",
                validation: { min_value: 1 },
              },
              {
                name: "rsvpDeadline",
                label: "Batas Waktu RSVP",
                type: "text",
                placeholder: "e.g., '1 November 2025'",
                info: "Tanggal terakhir untuk konfirmasi kehadiran.",
                validation: { min_length: 5 },
              },
              {
                name: "contactMethod",
                label: "Metode Kontak RSVP",
                type: "select",
                options: ["Email", "Telepon/WhatsApp", "Formulir Online"],
                info: "Bagaimana tamu harus mengkonfirmasi kehadiran?",
              },
              {
                name: "additionalInfo",
                label: "Informasi Tambahan (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Sertakan kolom untuk alergi makanan. Minta konfirmasi jumlah anak-anak.'",
                info: "Detail lain yang perlu dikumpulkan dari tamu.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
            "Checklist Vendor": [
              {
                name: "eventType",
                label: "Jenis Acara",
                type: "text",
                placeholder: "e.g., 'Pernikahan, Konferensi'",
                info: "Acara yang vendornya akan dikelola.",
              },
              {
                name: "vendorCategory",
                label: "Kategori Vendor",
                type: "select",
                options: [
                  "Katering",
                  "Venue",
                  "Fotografi/Videografi",
                  "Hiburan",
                  "Dekorasi",
                  "Logistik",
                  "Lainnya...",
                ],
                info: "Pilih kategori vendor yang ingin Anda buat checklist-nya.",
              },
              {
                name: "keyTasks",
                label: "Tugas Kunci per Vendor",
                type: "textarea",
                placeholder:
                  "e.g., 'Katering: Penawaran menu, food tasting, jadwal pengiriman. Venue: Ketersediaan, kapasitas, fasilitas.'",
                info: "Daftar tugas atau poin penting yang harus dibahas dengan vendor.",
              },
              {
                name: "contactPerson",
                label: "Kontak Person Vendor (Opsional)",
                type: "text",
                placeholder: "e.g., 'Nama, Telepon, Email'",
                info: "Informasi kontak utama vendor.",
              },
              {
                name: "notes",
                label: "Catatan Tambahan (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Perlu diskon khusus. Pastikan ada opsi vegetarian.'",
                info: "Catatan atau persyaratan khusus untuk vendor.",
              },
            ],
            "Ide Souvenir/Lomba": [
              {
                name: "eventType",
                label: "Jenis Acara",
                type: "text",
                placeholder:
                  "e.g., 'Ulang Tahun Anak, Pernikahan, Gathering Kantor'",
                info: "Acara yang membutuhkan ide souvenir atau lomba.",
                validation: { min_length: 5 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder: "e.g., 'Anak-anak, Dewasa, Campuran'",
                info: "Siapa yang akan menerima souvenir atau mengikuti lomba?",
                validation: { min_length: 5 },
              },
              {
                name: "budgetPerItem",
                label: "Anggaran per Item (Opsional)",
                type: "text",
                placeholder: "e.g., 'Rp 10.000 - Rp 25.000'",
                info: "Estimasi biaya per souvenir atau hadiah lomba.",
                optional: true,
                validation: { min_length: 5 },
              },
              {
                name: "theme",
                label: "Tema Acara (Opsional)",
                type: "text",
                placeholder: "e.g., 'Tropical, Vintage, Futuristik'",
                info: "Tema acara jika ada, untuk menyesuaikan ide.",
                optional: true,
                validation: { min_length: 3 },
              },
              {
                name: "ideaType",
                label: "Jenis Ide",
                type: "select",
                options: ["Souvenir", "Lomba", "Keduanya"],
                info: "Apakah Anda mencari ide souvenir, lomba, atau keduanya?",
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu memberikan saran yang praktis dan realistis. Untuk anggaran, jika tidak ada input, berikan persentase alokasi yang umum sebagai contoh. Untuk checklist, berikan pertanyaan-pertanyaan kunci yang sering terlupakan. Untuk ide tema, berikan 3-5 opsi yang bervariasi dari segi biaya dan kompleksitas. Selalu akhiri dengan kalimat yang memotivasi dan mengurangi stres pengguna, seperti 'Perencanaan adalah kunci, nikmati setiap langkahnya!'",
      },
    },
    "Pendidikan & Pembelajaran": {
      "Asisten Akademik & Pembelajaran": {
        description:
          "Dapatkan bantuan untuk membuat rencana belajar, kuis, RPP, dan materi edukasi lainnya.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pelatih Akademik & Desainer Instruksional yang akan membuat materi edukasi yang efektif.",
        components: [
          {
            name: "assistanceType",
            label: "Jenis Bantuan Akademik",
            type: "select",
            options: [
              "Rencana Belajar",
              "Materi Belajar (Kuis/Flashcard)",
              "Rencana Mengajar (RPP)",
              "Ide Topik Diskusi",
            ],
            info: "Pilih jenis bantuan yang Anda butuhkan.",
            validation: { regex: "^(?!Pilih Jenis Bantuan Akademik...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "assistanceType",
          options: {
            "Rencana Belajar": [
              {
                name: "subject",
                label: "Mata Pelajaran/Ujian",
                type: "text",
                placeholder: "e.g., 'Ujian Akhir Semester Matematika'",
                info: "Sebutkan subjek atau ujian yang akan dihadapi.",
                validation: { min_length: 5 },
              },
              {
                name: "timeframe",
                label: "Jangka Waktu Belajar",
                type: "text",
                placeholder: "e.g., '2 minggu'",
                info: "Berapa lama waktu yang Anda miliki untuk belajar?",
                validation: { min_length: 3 },
              },
              {
                name: "studyHoursPerDay",
                label: "Jam Belajar per Hari",
                type: "number",
                placeholder: "e.g., 2",
                info: "Berapa jam sehari Anda bisa fokus belajar?",
                validation: { min_value: 1, max_value: 24 },
              },
              {
                name: "topicsToCover",
                label: "Topik-topik yang Harus Dipelajari",
                type: "textarea",
                placeholder: "e.g., 'Aljabar, Geometri, Kalkulus Dasar'",
                info: "Sebutkan semua materi yang perlu dipelajari.",
                validation: { min_length: 10 },
              },
            ],
            "Materi Belajar (Kuis/Flashcard)": [
              {
                name: "sourceMaterial",
                label: "Materi Sumber",
                type: "textarea",
                placeholder: "Tempelkan teks atau poin-poin materi di sini",
                info: "AI akan menggunakan ini untuk membuat materi belajar.",
                validation: { min_length: 20 },
              },
              {
                name: "materialType",
                label: "Jenis Materi",
                type: "select",
                options: [
                  "Soal Pilihan Ganda",
                  "Flashcard (Tanya-Jawab)",
                  "Soal Esai Singkat",
                ],
                info: "Pilih jenis materi belajar yang ingin dibuat.",
              },
              {
                name: "numberOfItems",
                label: "Jumlah Soal/Kartu",
                type: "number",
                placeholder: "e.g., 10",
                info: "Berapa banyak soal atau kartu yang ingin dibuat?",
                validation: { min_value: 1, max_value: 50 },
              },
            ],
            "Rencana Mengajar (RPP)": [
              {
                name: "subject",
                label: "Mata Pelajaran",
                type: "text",
                placeholder: "e.g., 'Biologi'",
                info: "Sebutkan mata pelajaran yang akan diajarkan.",
                validation: { min_length: 2 },
              },
              {
                name: "gradeLevel",
                label: "Tingkat Kelas",
                type: "text",
                placeholder: "e.g., 'Kelas 10 SMA'",
                info: "Untuk kelas berapa RPP ini dibuat?",
                validation: { min_length: 3 },
              },
              {
                name: "topic",
                label: "Topik Spesifik",
                type: "text",
                placeholder: "e.g., 'Fotosintesis'",
                info: "Sebutkan topik spesifik yang akan dibahas.",
                validation: { min_length: 5 },
              },
              {
                name: "duration",
                label: "Alokasi Waktu (menit)",
                type: "number",
                placeholder: "e.g., 90",
                info: "Berapa lama sesi pengajaran akan berlangsung?",
                validation: { min_value: 15, max_value: 240 },
              },
            ],
            "Ide Topik Diskusi": [
              {
                name: "discussionSubject",
                label: "Subjek Diskusi",
                type: "text",
                placeholder:
                  "e.g., 'Etika AI, Perubahan Iklim, Dampak Media Sosial'",
                info: "Topik utama yang ingin didiskusikan.",
                validation: { min_length: 5 },
              },
              {
                name: "discussionGoal",
                label: "Tujuan Diskusi",
                type: "select",
                options: [
                  "Membangun Pemahaman",
                  "Mencari Solusi",
                  "Debat/Perdebatan",
                  "Brainstorming Ide",
                ],
                info: "Apa yang ingin dicapai dari diskusi ini?",
              },
              {
                name: "targetAudience",
                label: "Target Audiens Diskusi",
                type: "text",
                placeholder: "e.g., 'Mahasiswa, Profesional, Komunitas Umum'",
                info: "Siapa peserta diskusi ini?",
                validation: { min_length: 5 },
              },
              {
                name: "discussionFormat",
                label: "Format Diskusi",
                type: "select",
                options: ["Terbuka", "Terstruktur", "Panel", "Debat"],
                info: "Bagaimana diskusi akan dijalankan?",
              },
              {
                name: "keyQuestions",
                label: "Pertanyaan Kunci (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Bagaimana AI mempengaruhi pekerjaan di masa depan? Apa peran individu dalam mengatasi perubahan iklim?'",
                info: "Pertanyaan-pertanyaan pemicu untuk memulai atau memandu diskusi.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu menekankan pentingnya pemahaman konsep di atas hafalan. Untuk pembuatan soal, pastikan tingkat kesulitan sesuai dengan tingkat audiens yang diberikan. Untuk RPP, sarankan variasi aktivitas untuk menjaga keterlibatan siswa. Wajib sertakan disclaimer: 'Materi yang dihasilkan adalah alat bantu. Guru/pelajar disarankan untuk memverifikasi informasi dan menyesuaikannya dengan kurikulum atau kebutuhan belajar yang spesifik.'",
      },
    },
    "Bisnis & Profesional": {
      "Asisten Dokumen Profesional": {
        description:
          "Buat draf cepat untuk surat lamaran, laporan, notulen rapat, dan email profesional.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Asisten Eksekutif Virtual yang akan menghasilkan draf dokumen profesional.",
        components: [
          {
            name: "documentType",
            label: "Jenis Dokumen",
            type: "select",
            options: [
              "Surat Lamaran Kerja",
              "Laporan Progres Proyek",
              "Kontrak Sederhana",
              "Notulen Rapat",
              "Faktur/Invoice",
              "Email Profesional",
            ],
            info: "Pilih jenis dokumen bisnis yang Anda butuhkan.",
            validation: { regex: "^(?!Pilih Jenis Dokumen...).*$" },
          },
        ],
        dynamicSubcomponents: {
          trigger: "documentType",
          options: {
            "Surat Lamaran Kerja": [
              {
                name: "jobTitle",
                label: "Posisi yang Dilamar",
                type: "text",
                placeholder: "e.g., 'Digital Marketing Specialist'",
                info: "Nama jabatan persis seperti yang tertulis di lowongan.",
                validation: { min_length: 5 },
              },
              {
                name: "companyName",
                label: "Nama Perusahaan",
                type: "text",
                placeholder: "e.g., 'PT Inovasi Digital'",
                info: "Perusahaan yang Anda tuju.",
                validation: { min_length: 5 },
              },
              {
                name: "keyRequirements",
                label: "Kualifikasi Utama dari Lowongan",
                type: "textarea",
                placeholder:
                  "Salin-tempel poin-poin kualifikasi utama dari iklan lowongan kerja di sini.",
                info: "AI akan menggunakan ini untuk menyesuaikan surat Anda.",
                validation: { min_length: 20 },
              },
              {
                name: "mySkills",
                label: "Pengalaman & Keterampilan Relevan Saya",
                type: "textarea",
                placeholder:
                  "e.g., 'Saya telah mengelola kampanye SEO untuk klien e-commerce selama 4 tahun.'",
                info: "Hubungkan pengalaman Anda secara langsung dengan apa yang dicari perusahaan.",
                validation: { min_length: 20 },
              },
            ],
            "Laporan Progres Proyek": [
              {
                name: "projectName",
                label: "Nama Proyek",
                type: "text",
                placeholder: "e.g., 'Pengembangan Aplikasi Mobile'",
                info: "Proyek yang akan dilaporkan.",
                validation: { min_length: 5 },
              },
              {
                name: "timePeriod",
                label: "Periode Laporan",
                type: "text",
                placeholder: "e.g., '1 - 7 Juli 2025'",
                info: "Cakupan waktu laporan.",
                validation: { min_length: 5 },
              },
              {
                name: "completedTasks",
                label: "Tugas yang Selesai",
                type: "textarea",
                placeholder: "e.g., 'Desain UI, Pengembangan API Login'",
                info: "Sebutkan tugas-tugas yang telah selesai pada periode ini.",
                validation: { min_length: 10 },
              },
              {
                name: "ongoingTasks",
                label: "Tugas yang Sedang Berjalan",
                type: "textarea",
                placeholder: "e.g., 'Pengujian fitur X, Integrasi pembayaran'",
                info: "Sebutkan tugas-tugas yang masih dalam proses.",
                validation: { min_length: 10 },
              },
              {
                name: "blockers",
                label: "Hambatan (Blockers)",
                type: "textarea",
                placeholder: "e.g., 'Menunggu akses ke server database'",
                info: "Sebutkan kendala yang menghambat kemajuan.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
            "Email Profesional": [
              {
                name: "recipient",
                label: "Penerima Email",
                type: "text",
                placeholder: "e.g., 'Manajer Pemasaran, Calon Klien'",
                info: "Jelaskan siapa penerima dan hubungan Anda.",
                validation: { min_length: 5 },
              },
              {
                name: "subject",
                label: "Subjek Email",
                type: "text",
                placeholder: "e.g., 'Follow-up Rapat Mengenai Proyek X'",
                info: "Judul email yang jelas dan ringkas.",
                validation: { min_length: 5 },
              },
              {
                name: "keyMessage",
                label: "Pesan Kunci",
                type: "textarea",
                placeholder:
                  "e.g., 'Meminta data penjualan Q3. Mengusulkan jadwal rapat.'",
                info: "Sebutkan semua poin penting yang harus ada dalam isi email.",
                validation: { min_length: 10 },
              },
              {
                name: "tone",
                label: "Gaya & Nada",
                type: "select",
                options: [
                  "Sangat Formal",
                  "Profesional Standar",
                  "Ramah tapi Jelas",
                ],
                info: "Pilih nada yang sesuai untuk email Anda.",
              },
            ],
            "Kontrak Sederhana": [
              {
                name: "contractType",
                label: "Jenis Kontrak",
                type: "text",
                placeholder:
                  "e.g., 'Perjanjian Kerahasiaan (NDA), Kontrak Freelance, Perjanjian Sewa'",
                info: "Sebutkan jenis kontrak yang ingin Anda buat.",
                validation: { min_length: 5 },
              },
              {
                name: "parties",
                label: "Pihak-pihak yang Terlibat",
                type: "textarea",
                placeholder:
                  "e.g., 'Pihak 1: [Nama Perusahaan/Individu], Pihak 2: [Nama Perusahaan/Individu]'",
                info: "Sebutkan nama lengkap pihak-pihak yang akan menandatangani kontrak.",
                validation: { min_length: 10 },
              },
              {
                name: "keyTerms",
                label: "Syarat & Ketentuan Kunci",
                type: "textarea",
                placeholder:
                  "e.g., 'Durasi: 1 tahun. Pembayaran: Rp 5.000.000 per bulan. Lingkup Pekerjaan: Pengembangan aplikasi mobile.'",
                info: "Poin-poin utama yang harus diatur dalam kontrak.",
                validation: { min_length: 20 },
              },
              {
                name: "governingLaw",
                label: "Hukum yang Mengatur (Opsional)",
                type: "text",
                placeholder: "e.g., 'Hukum Republik Indonesia'",
                info: "Yurisdiksi hukum yang berlaku untuk kontrak.",
                optional: true,
                validation: { min_length: 5 },
              },
            ],
            "Notulen Rapat": [
              {
                name: "meetingTitle",
                label: "Judul Rapat",
                type: "text",
                placeholder: "e.g., 'Rapat Koordinasi Proyek Q3'",
                info: "Judul resmi rapat.",
                validation: { min_length: 5 },
              },
              {
                name: "dateTime",
                label: "Tanggal & Waktu Rapat",
                type: "text",
                placeholder: "e.g., '10 Juli 2025, 10:00 - 11:00 WIB'",
                info: "Kapan rapat dilaksanakan.",
                validation: { min_length: 5 },
              },
              {
                name: "attendees",
                label: "Daftar Peserta",
                type: "textarea",
                placeholder:
                  "e.g., 'Andi (Ketua), Budi (Sekretaris), Citra, Doni'",
                info: "Sebutkan semua yang hadir dalam rapat.",
                validation: { min_length: 10 },
              },
              {
                name: "discussionPoints",
                label: "Poin Diskusi Utama",
                type: "textarea",
                placeholder:
                  "e.g., 'Pembahasan anggaran, Progres pengembangan fitur X, Tantangan tim.'",
                info: "Topik-topik utama yang dibahas.",
                validation: { min_length: 10 },
              },
              {
                name: "decisionsMade",
                label: "Keputusan yang Diambil",
                type: "textarea",
                placeholder:
                  "e.g., 'Anggaran disetujui. Fitur X ditunda 1 minggu.'",
                info: "Keputusan penting yang dihasilkan dari rapat.",
                validation: { min_length: 10 },
              },
              {
                name: "actionItems",
                label: "Daftar Tindakan (Action Items)",
                type: "textarea",
                placeholder:
                  "e.g., 'Andi: Siapkan laporan keuangan (Deadline: 15 Juli). Citra: Koordinasi dengan tim desain (Deadline: 12 Juli).'",
                info: "Tugas yang harus dilakukan, penanggung jawab, dan tenggat waktu.",
                validation: { min_length: 10 },
              },
            ],
            "Faktur/Invoice": [
              {
                name: "invoiceNumber",
                label: "Nomor Faktur",
                type: "text",
                placeholder: "e.g., 'INV-2025-001'",
                info: "Nomor unik untuk faktur ini.",
                validation: { min_length: 5 },
              },
              {
                name: "issueDate",
                label: "Tanggal Terbit",
                type: "text",
                placeholder: "e.g., '11 Juli 2025'",
                info: "Tanggal faktur dibuat.",
                validation: { min_length: 5 },
              },
              {
                name: "dueDate",
                label: "Tanggal Jatuh Tempo",
                type: "text",
                placeholder: "e.g., '25 Juli 2025'",
                info: "Batas waktu pembayaran.",
                validation: { min_length: 5 },
              },
              {
                name: "billTo",
                label: "Ditagihkan Kepada (Nama & Alamat)",
                type: "textarea",
                placeholder: "e.g., 'PT Maju Jaya\nJl. Contoh No. 10, Jakarta'",
                info: "Informasi pelanggan yang akan ditagih.",
                validation: { min_length: 10 },
              },
              {
                name: "items",
                label: "Daftar Item/Layanan (Nama, Jumlah, Harga Satuan)",
                type: "textarea",
                placeholder:
                  "e.g., 'Jasa Desain Logo, 1, Rp 5.000.000\nRevisi Desain, 2, Rp 500.000'",
                info: "Detail barang atau jasa yang ditagihkan.",
                validation: { min_length: 10 },
              },
              {
                name: "totalAmount",
                label: "Jumlah Total",
                type: "number",
                placeholder: "e.g., 6000000",
                info: "Total biaya keseluruhan.",
                validation: { min_value: 0 },
              },
              {
                name: "paymentInstructions",
                label: "Instruksi Pembayaran (Opsional)",
                type: "textarea",
                placeholder:
                  "e.g., 'Transfer ke Rekening BCA 1234567890 a.n. PT XYZ. Mohon konfirmasi setelah pembayaran.'",
                info: "Cara pembayaran yang diinginkan.",
                optional: true,
                validation: { min_length: 10 },
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus sangat peka terhadap `Gaya & Nada` yang diminta. Untuk dokumen legal seperti kontrak, AI wajib menyertakan disclaimer tebal: '**PENTING: Ini adalah template sederhana dan bukan merupakan nasihat hukum. Selalu konsultasikan dengan profesional hukum untuk kebutuhan spesifik Anda.**' Untuk laporan, prioritaskan kejelasan data. Untuk email, prioritaskan keringkasan dan kejelasan tujuan.",
      },
    },
    "Desain & Pengembangan Proyek": {
      "Perancang Proyek Digital & UX": {
        description:
          "Dapatkan cetak biru (blueprint) terstruktur untuk website, aplikasi, atau proyek digital lainnya.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Arsitek Produk Digital yang akan mengubah ide menjadi rencana yang dapat ditindaklanjuti.",
        components: [
          {
            name: "documentType",
            label: "Jenis Dokumen Proyek",
            type: "select",
            options: [
              "Struktur Website/Aplikasi",
              "Desain Halaman/Slide",
              "Konsep MVP/Database",
              "Strategi Peluncuran",
            ],
            info: "Pilih jenis dokumen perencanaan yang Anda butuhkan.",
          },
        ],
        dynamicSubcomponents: {
          trigger: "documentType",
          options: {
            "Struktur Website/Aplikasi": [
              {
                name: "projectType",
                label: "Jenis Proyek",
                type: "select",
                options: ["Website", "Aplikasi Mobile", "Aplikasi Web"],
                info: "Pilih jenis proyek yang akan dirancang.",
              },
              {
                name: "mainGoal",
                label: "Tujuan Utama Proyek",
                type: "text",
                placeholder: "e.g., 'Meningkatkan penjualan online'",
                info: "Apa tujuan utama dari proyek ini?",
                validation: { min_length: 10 },
              },
              {
                name: "mainPages",
                label: "Halaman/Fitur Utama",
                type: "textarea",
                placeholder: "e.g., 'Beranda, Produk, Tentang Kami, Kontak'",
                info: "Sebutkan halaman atau fitur utama yang harus ada.",
                validation: { min_length: 10 },
              },
            ],
            "Desain Halaman/Slide": [
              {
                name: "pageName",
                label: "Nama Halaman/Slide",
                type: "text",
                placeholder: "e.g., 'Halaman Beranda'",
                info: "Halaman atau slide spesifik yang akan dirancang.",
                validation: { min_length: 5 },
              },
              {
                name: "sections",
                label: "Bagian-bagian Halaman/Slide",
                type: "textarea",
                placeholder: "e.g., 'Header, Hero, Testimoni, Footer'",
                info: "Sebutkan bagian-bagian utama dari atas ke bawah.",
                validation: { min_length: 10 },
              },
              {
                name: "keyInfo",
                label: "Informasi Kunci per Bagian",
                type: "textarea",
                placeholder:
                  "e.g., 'Hero: Judul yang menarik, gambar produk. Testimoni: 3 kutipan dari klien.'",
                info: "Jelaskan konten utama untuk setiap bagian.",
                validation: { min_length: 10 },
              },
            ],
            "Konsep MVP/Database": [
              {
                name: "appName",
                label: "Nama Aplikasi",
                type: "text",
                placeholder: "e.g., 'Aplikasi Resep MasakYuk'",
                info: "Nama aplikasi yang akan dibuat.",
                validation: { min_length: 5 },
              },
              {
                name: "coreFeatures",
                label: "Fitur Inti MVP",
                type: "textarea",
                placeholder:
                  "e.g., 'Pencarian resep, simpan resep, daftar belanja'",
                info: "Sebutkan 3-5 fitur paling penting untuk versi pertama.",
                validation: { min_length: 10 },
              },
              {
                name: "dataModels",
                label: "Model Data Utama",
                type: "text",
                placeholder: "e.g., 'User, Recipe, Ingredient'",
                info: "Sebutkan entitas data utama dalam sistem.",
                validation: { min_length: 5 },
              },
            ],
            "Strategi Peluncuran": [
              {
                name: "productName",
                label: "Nama Produk/Aplikasi",
                type: "text",
                placeholder: "e.g., 'Aplikasi Meditasi Tenang'",
                info: "Nama produk atau aplikasi yang akan diluncurkan.",
                validation: { min_length: 5 },
              },
              {
                name: "launchDate",
                label: "Target Tanggal Peluncuran",
                type: "text",
                placeholder: "e.g., '1 September 2025'",
                info: "Tanggal yang direncanakan untuk peluncuran.",
                validation: { min_length: 5 },
              },
              {
                name: "targetAudience",
                label: "Target Audiens",
                type: "text",
                placeholder: "e.g., 'Profesional muda yang stres, mahasiswa'",
                info: "Siapa target utama peluncuran ini?",
                validation: { min_length: 5 },
              },
              {
                name: "marketingChannels",
                label: "Kanal Pemasaran",
                type: "textarea",
                placeholder:
                  "e.g., 'Media Sosial (Instagram, TikTok), Influencer Marketing, Iklan Google, PR'",
                info: "Saluran yang akan digunakan untuk mempromosikan peluncuran.",
                validation: { min_length: 10 },
              },
              {
                name: "keyMessages",
                label: "Pesan Kunci Peluncuran",
                type: "textarea",
                placeholder:
                  "e.g., 'Temukan ketenangan dalam genggaman Anda. Kurangi stres dengan meditasi 5 menit sehari.'",
                info: "Pesan utama yang ingin disampaikan kepada audiens.",
                validation: { min_length: 10 },
              },
              {
                name: "successMetrics",
                label: "Metrik Keberhasilan (Opsional)",
                type: "text",
                placeholder:
                  "e.g., '10.000 unduhan dalam bulan pertama, 500 ulasan positif'",
                info: "Bagaimana Anda akan mengukur keberhasilan peluncuran?",
                optional: true,
                validation: { min_length: 5 },
              },
            ],
          },
        },
        konteks_tambahan_instruksi_khusus:
          "AI harus selalu menekankan bahwa output ini adalah untuk tujuan perencanaan dan konseptual, bukan kode atau desain final. Untuk database, gunakan format yang mudah dibaca. Untuk user flow, gunakan penomoran dan panah (->) untuk menunjukkan alur. Selalu gunakan bahasa yang jelas dan hindari jargon teknis yang berlebihan.",
      },
    },
  },
  "Gambar & Desain": {
    "Perencanaan Video & Visual": {
      "Ide Konten Video": {
        description:
          "Hasilkan ide-ide video yang menarik untuk platform media sosial.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Strategis Konten Video yang akan menghasilkan ide-ide video.",
        components: [
          {
            name: "platform",
            label: "Platform Video",
            type: "select",
            options: [
              "YouTube",
              "TikTok",
              "Instagram Reels",
              "LinkedIn Video",
              "Lainnya...",
            ],
            info: "Platform menentukan format, durasi, dan gaya konten.",
          },
          {
            name: "niche",
            label: "Niche / Tema Channel",
            type: "text",
            placeholder:
              "e.g., 'memasak untuk pemula, review gadget, keuangan pribadi'",
            info: "Fokus utama dari channel atau akun Anda.",
          },
          {
            name: "videoFormat",
            label: "Format Video",
            type: "select",
            options: [
              "Tutorial / How-to",
              "Vlog Harian/Mingguan",
              "Review Produk/Jasa",
              "Listicle (e.g., Top 5...)",
              "Edukasi Singkat / Explainer",
              "Wawancara",
              "Lainnya...",
            ],
            info: "Pilih jenis struktur video yang diinginkan.",
          },
          {
            name: "desiredOutcome",
            label: "Tujuan Video",
            type: "textarea",
            placeholder:
              "e.g., 'meningkatkan subscriber, mendapatkan engagement tinggi, mengarahkan trafik ke website'",
            info: "Apa hasil yang ingin Anda capai dengan video ini?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Saya ingin ide yang bisa dikolaborasikan dengan kreator lain. Fokus pada budget produksi rendah. Hindari topik politik.",
            info: "Detail tambahan yang bisa mengarahkan ide AI menjadi lebih unik dan sesuai dengan channel Anda.",
          },
        ],
      },
      "Script Iklan": {
        description: "Buat naskah singkat untuk iklan video atau audio.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Naskah Iklan yang akan membuat naskah iklan.",
        components: [
          {
            name: "product",
            label: "Produk/Jasa yang Diiklankan",
            type: "text",
            placeholder: "e.g., 'Aplikasi Belajar Bahasa Asing'",
            info: "Produk yang menjadi fokus utama iklan.",
          },
          {
            name: "targetAudience",
            label: "Target Audiens Iklan",
            type: "text",
            placeholder: "e.g., 'mahasiswa, profesional muda, orang tua'",
            info: "Siapa yang ingin Anda jangkau dengan iklan ini?",
          },
          {
            name: "duration",
            label: "Durasi Iklan (detik)",
            type: "number",
            placeholder: "e.g., 30",
            info: "Durasi akan sangat mempengaruhi kepadatan naskah.",
          },
          {
            name: "keyMessage",
            label: "Pesan Kunci Iklan",
            type: "textarea",
            placeholder:
              "e.g., 'Belajar bahasa jadi mudah dan menyenangkan di mana saja.'",
            info: "Satu hal terpenting yang harus diingat audiens setelah melihat iklan.",
          },
          {
            name: "platform",
            label: "Platform Penayangan",
            type: "select",
            options: [
              "TV",
              "Radio",
              "YouTube (Pre-roll)",
              "TikTok/Reels/Shorts",
              "Lainnya...",
            ],
            info: "Platform akan mempengaruhi gaya dan kecepatan naskah.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Tempo harus cepat dan energik. Sertakan anjuran untuk sound effect 'swoosh' saat produk muncul. Aktor harus terdengar antusias dan percaya diri.",
            info: "Instruksi tentang nuansa, tempo, atau elemen audio/visual yang harus dibayangkan oleh AI.",
          },
        ],
      },
    },
    "Prompt AI Gambar (Text-to-Image)": {
      Midjourney: {
        description:
          "Buat prompt yang sangat detail untuk Midjourney, lengkap dengan parameter teknis untuk kontrol maksimal.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Seniman Prompt Midjourney yang akan menghasilkan prompt Midjourney yang optimal.",
        components: [
          {
            name: "subject",
            label: "Subjek Utama",
            type: "textarea",
            placeholder:
              "e.g., 'A hyper-detailed portrait of a futuristic cyborg knight'",
            info: "Deskripsi utama dari apa yang ingin Anda lihat.",
            validation: { min_length: 20 },
          },
          {
            name: "style",
            label: "Gaya & Estetika",
            type: "textarea",
            placeholder:
              "e.g., 'cinematic lighting, epic, photorealistic, octane render, unreal engine, 8k'",
            info: "Kata kunci yang mendefinisikan gaya visual, artis, atau medium.",
            validation: { min_length: 10 },
          },
          {
            name: "aspectRatio",
            label: "Aspect Ratio (--ar)",
            type: "select",
            options: [
              "1:1 (Square)",
              "2:3 (Vertical)",
              "3:2 (Horizontal)",
              "16:9 (Widescreen)",
              "Lainnya...",
            ],
            info: "Rasio lebar dan tinggi gambar.",
          },
          {
            name: "version",
            label: "Model Version (--v)",
            type: "select",
            options: ["6.0", "5.2", "5.1", "niji 5", "6.1"],
            info: "Versi model Midjourney yang akan digunakan.",
          },
          {
            name: "p",
            label: "Permutations (--p)",
            type: "text",
            placeholder: "e.g., '{a,b,c} dog'",
            info: "Membuat permutasi dari prompt, memungkinkan beberapa variasi dari satu input.",
            validation: { min_length: 3 },
          },
          {
            name: "chaos",
            label: "Chaos (--c)",
            type: "number",
            placeholder: "0-100",
            info: "Seberapa bervariasi dan tidak terduga hasil yang Anda inginkan? (0-100)",
            validation: { min_value: 0, max_value: 100 },
          },
          {
            name: "quality",
            label: "Quality (--q)",
            type: "number",
            placeholder: "0.25, 0.5, 1, 2",
            info: "Kontrol kualitas rendering dan waktu. Nilai lebih tinggi menggunakan lebih banyak waktu GPU dan menciptakan gambar yang lebih detail. `--q 2` adalah baru di v6.1 untuk detail yang ditingkatkan.",
            validation: { min_value: 0.25, max_value: 2 },
          },
          {
            name: "stylize",
            label: "Stylize (--s)",
            type: "number",
            placeholder: "0-1000",
            info: "Seberapa kuat estetika gaya Midjourney yang diterapkan? (0-1000)",
            validation: { min_value: 0, max_value: 1000 },
          },
          {
            name: "weird",
            label: "Weird (--w)",
            type: "number",
            placeholder: "0-3000",
            info: "Jelajahi estetika yang tidak biasa dan eksperimental.",
            validation: { min_value: 0, max_value: 3000 },
          },
          {
            name: "negativePrompt",
            label: "Negative Prompt (--no)",
            type: "text",
            placeholder: "e.g., 'cartoon, blurry, text, watermark'",
            info: "Hal-hal yang tidak Anda inginkan muncul di gambar.",
            validation: { min_length: 5 },
          },
          {
            name: "sref",
            label: "Style Reference (--sref)",
            type: "text",
            placeholder: "e.g., 'URL_gambar_gaya'",
            info: "URL gambar untuk referensi gaya.",
            validation: { min_length: 10 },
          },
          {
            name: "sw",
            label: "Style Weight (--sw)",
            type: "number",
            placeholder: "0-1000",
            info: "Seberapa kuat pengaruh referensi gaya? (Default: 100)",
            validation: { min_value: 0, max_value: 1000 },
          },
          {
            name: "cref",
            label: "Character Reference (--cref)",
            type: "text",
            placeholder: "e.g., 'URL_gambar_karakter'",
            info: "URL gambar untuk menjaga konsistensi karakter.",
            validation: { min_length: 10 },
          },
          {
            name: "cw",
            label: "Character Weight (--cw)",
            type: "number",
            placeholder: "0-100",
            info: "Seberapa kuat pengaruh referensi karakter? (Default: 100)",
            validation: { min_value: 0, max_value: 100 },
          },
          {
            name: "seed",
            label: "Seed (--seed)",
            type: "number",
            placeholder: "0-4294967295",
            info: "Gunakan seed yang sama untuk menghasilkan gambar yang mirip.",
            validation: { min_value: 0, max_value: 4294967295 },
          },
          {
            name: "stop",
            label: "Stop (--stop)",
            type: "number",
            placeholder: "10-100",
            info: "Hentikan generasi pada persentase tertentu.",
            validation: { min_value: 10, max_value: 100 },
          },
          {
            name: "repeat",
            label: "Repeat (--r)",
            type: "number",
            placeholder: "1-40",
            info: "Ulangi prompt beberapa kali.",
            validation: { min_value: 1, max_value: 40 },
          },
          {
            name: "tile",
            label: "Tile (--tile)",
            type: "select",
            options: ["No", "Yes"],
            info: "Buat gambar yang bisa di-tile secara seamless.",
          },
          {
            name: "styleRaw",
            label: "Style Raw (--style raw)",
            type: "select",
            options: ["No", "Yes"],
            info: "Mengurangi beautifikasi otomatis, membuat gambar lebih akurat terhadap prompt dan umumnya lebih fotorealistik. Dapat juga digunakan dengan kode gaya (misalnya, `--style raw --sref random`) untuk menerapkan estetika tertentu.",
          },
          {
            name: "inputImage",
            label: "Input Gambar (Opsional)",
            type: "image",
            info: "Unggah gambar untuk digunakan sebagai referensi visual atau input untuk AI.",
          },
        ],
      },
      "DALL-E 3": {
        description:
          "Tulis prompt naratif dan deskriptif yang kaya untuk DALL-E 3, yang unggul dalam memahami bahasa alami.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pelukis Digital AI yang akan menghasilkan gambar yang kreatif dan akurat.",
        components: [
          {
            name: "subject",
            label: "Subjek & Aksi",
            type: "textarea",
            placeholder:
              "e.g., 'Seekor rubah oranye terang dengan pakaian astronot sedang duduk di bulan, memandangi bumi.'",
            info: "Jelaskan subjek utama dan apa yang sedang dilakukannya secara detail.",
            validation: { min_length: 20 },
          },
          {
            name: "style",
            label: "Gaya Visual",
            type: "text",
            placeholder:
              "e.g., 'gaya lukisan cat minyak digital', 'seni piksel (pixel art)', 'foto sinematik'",
            info: "Medium atau gaya artistik dari gambar.",
            validation: { min_length: 5 },
          },
          {
            name: "composition",
            label: "Komposisi & Sudut Pandang",
            type: "text",
            placeholder:
              "e.g., 'close-up shot', 'wide-angle view', 'dari bawah'",
            info: "Bagaimana adegan dibingkai?",
            validation: { min_length: 5 },
          },
          {
            name: "lightingAndMood",
            label: "Pencahayaan & Suasana",
            type: "text",
            placeholder:
              "e.g., 'pencahayaan dramatis saat senja', 'suasana misterius dan berkabut'",
            info: "Bagaimana pencahayaan dan emosi yang ingin Anda tangkap?",
            validation: { min_length: 5 },
          },
          {
            name: "colorPalette",
            label: "Palet Warna",
            type: "text",
            placeholder:
              "e.g., 'warna-warna pastel yang lembut', 'monokromatik dengan aksen merah'",
            info: "Warna dominan yang Anda inginkan.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Stable Diffusion": {
        description:
          "Buat prompt positif dan negatif yang terstruktur untuk kontrol mendetail pada model Stable Diffusion.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pengendali Gambar yang akan menghasilkan gambar yang sesuai.",
        components: [
          {
            name: "positivePrompt",
            label: "Positive Prompt",
            type: "textarea",
            placeholder:
              "e.g., '(best quality:1.2), ultra-detailed, masterpiece, a majestic lion on a rock, cinematic lighting, (photorealistic:1.3)'",
            info: "Deskripsi detail dari apa yang Anda inginkan. Gunakan bobot (word:1.2) untuk penekanan.",
            validation: { min_length: 20 },
          },
          {
            name: "negativePrompt",
            label: "Negative Prompt",
            type: "textarea",
            placeholder:
              "e.g., '(worst quality, low quality:1.4), blurry, ugly, deformed, text, watermark, extra limbs'",
            info: "Deskripsi detail dari apa yang TIDAK Anda inginkan. Sangat penting untuk hasil yang bersih.",
            validation: { min_length: 10 },
          },
          {
            name: "technicalParameters",
            label: "Parameter Teknis (untuk referensi)",
            type: "text",
            placeholder:
              "e.g., 'Sampler: DPM++ 2M Karras, CFG Scale: 7, Steps: 25, Seed: 12345'",
            info: "Catat parameter teknis yang Anda gunakan di luar prompt untuk replikasi.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Leonardo AI": {
        description:
          "Prompt untuk Leonardo AI, dengan penekanan pada model dan elemen khasnya.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Kreator Visual Leonardo yang akan menghasilkan gambar yang unik dan berkualitas tinggi.",
        components: [
          {
            name: "positivePrompt",
            label: "Positive Prompt",
            type: "textarea",
            placeholder:
              "e.g., 'A beautiful fantasy world, enchanted forest, by Artgerm and Greg Rutkowski, soft lighting, high detail'",
            info: "Deskripsi utama dari gambar yang diinginkan.",
            validation: { min_length: 20 },
          },
          {
            name: "negativePrompt",
            label: "Negative Prompt",
            type: "textarea",
            placeholder:
              "e.g., 'blurry, noise, ugly, tiling, poorly drawn hands'",
            info: "Hal-hal yang ingin Anda hindari dalam gambar.",
            validation: { min_length: 10 },
          },
          {
            name: "leonardoModel",
            label: "Model Leonardo",
            type: "text",
            placeholder: "e.g., 'Leonardo Diffusion XL', 'DreamShaper v7'",
            info: "Model spesifik yang Anda gunakan di platform Leonardo AI.",
            validation: { min_length: 5 },
          },
          {
            name: "leonardoElements",
            label: "Elemen Leonardo (Opsional)",
            type: "text",
            placeholder: "e.g., 'Fantasy, Vintage, Toon'",
            info: "Elemen atau gaya khusus yang disediakan oleh Leonardo AI.",
            optional: true,
            validation: { min_length: 3 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      Ideogram: {
        description:
          "Buat prompt untuk Ideogram, dengan fokus khusus pada kemampuannya merender teks di dalam gambar.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perancang Tipografi Visual yang akan memprioritaskan rendering teks yang akurat di dalam gambar.",
        components: [
          {
            name: "textToRender",
            label: "Teks untuk Ditampilkan di Gambar",
            type: "text",
            placeholder: "e.g., 'Selamat Datang!', 'KOPI'",
            info: "Tuliskan teks persis seperti yang Anda ingin muncul di gambar.",
            validation: { min_length: 1 },
          },
          {
            name: "subjectAndScene",
            label: "Deskripsi Adegan & Subjek",
            type: "textarea",
            placeholder:
              "e.g., 'Sebuah tanda neon menyala dengan tulisan [Teks Anda] di atas pintu masuk sebuah kafe cyberpunk.'",
            info: "Jelaskan gambar yang akan menjadi latar belakang teks Anda.",
            validation: { min_length: 20 },
          },
          {
            name: "style",
            label: "Gaya Visual",
            type: "text",
            placeholder: "e.g., 'typography, 3d render, cinematic, photo'",
            info: "Gaya keseluruhan dari gambar dan teks.",
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Firefly (Adobe)": {
        description:
          "Prompt untuk Adobe Firefly, dengan penekanan pada gaya dan efek yang tersedia.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Seniman Efek Digital yang akan menerapkan gaya dan efek pada subjek.",
        components: [
          {
            name: "subject",
            label: "Deskripsi Subjek",
            type: "textarea",
            placeholder:
              "e.g., 'A fluffy baby owl reading a book in a cozy library'",
            info: "Deskripsi utama dari apa yang ingin Anda buat.",
            validation: { min_length: 20 },
          },
          {
            name: "styleAndEffects",
            label: "Gaya & Efek",
            type: "text",
            placeholder:
              "e.g., 'Steampunk, synthwave, layered paper, bokeh effect'",
            info: "Gaya visual, teknik, atau efek yang ingin diterapkan.",
            validation: { min_length: 5 },
          },
          {
            name: "colorAndTone",
            label: "Warna & Nada",
            type: "text",
            placeholder: "e.g., 'Vibrant colors, muted tones, golden hour'",
            info: "Palet warna dan suasana pencahayaan.",
            validation: { min_length: 5 },
          },
          {
            name: "negativePrompt",
            label: "Kata Kunci Negatif",
            type: "text",
            placeholder: "e.g., 'dark, scary, blurry'",
            info: "Hal-hal yang ingin dikecualikan dari gambar.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Playground AI": {
        description:
          "Buat prompt untuk Playground AI, platform yang fleksibel untuk berbagai gaya.",
        toolType: "image-editing",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Eksplorator Visual yang akan menghasilkan gambar berdasarkan prompt utama.",
        components: [
          {
            name: "prompt",
            label: "Prompt Utama",
            type: "textarea",
            placeholder:
              "e.g., 'A majestic castle in the clouds, fantasy, hyperrealistic, epic scale'",
            info: "Deskripsi utama dari gambar yang diinginkan.",
            validation: { min_length: 20 },
          },
          {
            name: "excludeFromImage",
            label: "Kecualikan dari Gambar (Negative Prompt)",
            type: "textarea",
            placeholder: "e.g., 'trees, people, fog'",
            info: "Hal-hal yang tidak ingin Anda lihat di hasil akhir.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      NightCafe: {
        description:
          "Buat prompt untuk NightCafe Creator, dengan mempertimbangkan model dan preset gayanya.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Kurator Seni AI yang akan menghasilkan karya seni berdasarkan prompt utama.",
        components: [
          {
            name: "mainPrompt",
            label: "Prompt Utama",
            type: "textarea",
            placeholder:
              "e.g., 'The celestial wolf, cosmic dust, stars, nebula, vibrant colors'",
            info: "Deskripsi utama dari karya seni Anda.",
            validation: { min_length: 20 },
          },
          {
            name: "stylePreset",
            label: "Preset Gaya",
            type: "text",
            placeholder: "e.g., 'Cosmic', 'Oil Painting', 'Cyberpunk'",
            info: "Gaya preset yang Anda pilih di NightCafe.",
            validation: { min_length: 3 },
          },
          {
            name: "model",
            label: "Model AI",
            type: "text",
            placeholder: "e.g., 'SDXL 1.0', 'DALL-E 3'",
            info: "Model dasar yang digunakan untuk generasi.",
            validation: { min_length: 3 },
          },
          {
            name: "negativePrompt",
            label: "Prompt Negatif",
            type: "text",
            placeholder: "e.g., 'low resolution, dull colors'",
            info: "Elemen yang ingin dihindari.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Custom Image Generator": {
        description:
          "Demonstrasi input interaktif: color picker, date picker, dan slider.",
        toolType: "image-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Demonstrator Input yang akan menampilkan bagaimana berbagai jenis input interaktif dapat digunakan.",
        components: [
          {
            name: "mainSubject",
            label: "Subjek Utama",
            type: "text",
            placeholder: "e.g., 'Pemandangan gunung'",
            info: "Deskripsi subjek gambar.",
            validation: { min_length: 5 },
          },
          {
            name: "primaryColor",
            label: "Warna Utama",
            type: "color",
            info: "Pilih warna dominan untuk gambar.",
          },
          {
            name: "creationDate",
            label: "Tanggal Kreasi",
            type: "date",
            info: "Tanggal gambar dibuat.",
          },
          {
            name: "detailLevel",
            label: "Tingkat Detail",
            type: "slider",
            min: 0,
            max: 100,
            step: 1,
            info: "Sesuaikan tingkat detail gambar (0-100).",
          },
          {
            name: "contrast",
            label: "Kontras",
            type: "slider",
            min: -50,
            max: 50,
            step: 5,
            info: "Sesuaikan kontras gambar (-50 hingga 50).",
          },
          {
            name: "additionalNotes",
            label: "Catatan Tambahan",
            type: "textarea",
            placeholder: "e.g., 'Gaya realistis, pencahayaan dramatis.'",
            info: "Catatan atau instruksi tambahan.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Prompt AI Video (Text-to-Video)": {
      "Sora (OpenAI)": {
        description:
          "Buat prompt yang sangat deskriptif dan sinematik untuk menghasilkan video berkualitas tinggi dengan Sora.",
        toolType: "video",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Sutradara AI yang akan menghasilkan video sinematik yang detail dan berkualitas tinggi.",
        components: [
          {
            name: "sceneDescription",
            label: "Deskripsi Adegan Detail",
            type: "textarea",
            placeholder:
              "e.g., 'A stylish woman walks through a Tokyo street filled with warm glowing neon and animated city signage. She wears a black leather jacket, a long red dress, and black boots. The street is damp and reflective, creating a mirror effect of the colorful lights.'",
            info: "Jelaskan adegan, subjek, latar belakang, dan atmosfer secara naratif dan mendetail.",
            validation: { min_length: 50 },
          },
          {
            name: "cameraWork",
            label: "Gerakan & Sudut Kamera",
            type: "text",
            placeholder:
              "e.g., 'Extreme close-up, tracking shot, drone footage flying over a landscape'",
            info: "Deskripsikan bagaimana kamera harus bergerak atau membingkai adegan.",
            validation: { min_length: 10 },
          },
          {
            name: "visualStyle",
            label: "Gaya Visual",
            type: "text",
            placeholder:
              "e.g., 'cinematic, 35mm film, photorealistic, anime, black and white'",
            info: "Gaya keseluruhan dari video.",
            validation: { min_length: 5 },
          },
          {
            name: "durationHint",
            label: "Petunjuk Durasi (Opsional)",
            type: "text",
            placeholder: "e.g., 'a short clip', 'a looping video'",
            info: "Berikan petunjuk tentang panjang atau sifat video.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      Pika: {
        description:
          "Buat prompt untuk Pika, dengan opsi untuk menganimasikan gambar atau menghasilkan video dari teks.",
        toolType: "video",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Animator AI yang akan menganimasikan gambar atau menghasilkan video dari teks.",
        components: [
          {
            name: "mainPrompt",
            label: "Prompt Utama",
            type: "textarea",
            placeholder:
              "e.g., 'A robot surfing on a giant wave, cinematic, epic'",
            info: "Deskripsi utama dari video yang ingin Anda buat.",
            validation: { min_length: 20 },
          },
          {
            name: "negativePrompt",
            label: "Prompt Negatif",
            type: "text",
            placeholder: "e.g., 'blurry, low quality, watermark'",
            info: "Elemen yang ingin Anda hindari.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "motionControl",
            label: "Kontrol Gerakan",
            type: "text",
            placeholder:
              "e.g., 'camera zooming in', 'panning left', 'high motion'",
            info: "Deskripsikan intensitas atau arah gerakan yang diinginkan.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "imageInput",
            label: "Input Gambar (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Gunakan gambar seekor kucing untuk dianimasikan.'",
            info: "Sebutkan jika Anda ingin menganimasikan gambar yang sudah ada.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      Runway: {
        description:
          "Buat prompt untuk Runway, platform serbaguna untuk generasi video dari teks, gambar, atau video lain.",
        toolType: "video",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Produser Video AI yang akan menghasilkan video berdasarkan prompt.",
        components: [
          {
            name: "prompt",
            label: "Prompt Utama",
            type: "textarea",
            placeholder: "e.g., 'A drone shot of a futuristic city at sunset.'",
            info: "Deskripsi adegan yang ingin Anda hasilkan.",
            validation: { min_length: 20 },
          },
          {
            name: "inputSource",
            label: "Sumber Input (Opsional)",
            type: "text",
            placeholder:
              "e.g., 'Gunakan gambar X sebagai referensi gaya', 'Ubah video Y menjadi gaya Z'",
            info: "Sebutkan jika Anda menggunakan gambar atau video sebagai input (Image to Video, Video to Video).",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "cameraMotion",
            label: "Gerakan Kamera",
            type: "text",
            placeholder: "e.g., 'pan, tilt, zoom, roll'",
            info: "Kontrol pergerakan kamera virtual.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "motionBrush",
            label: "Motion Brush (Konsep)",
            type: "text",
            placeholder: "e.g., 'Isolasi gerakan hanya pada awan di langit.'",
            info: "Deskripsikan area spesifik pada gambar yang ingin Anda animasikan.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      Kaiber: {
        description:
          "Buat prompt untuk Kaiber, yang dikenal dengan gaya visual artistik dan transformasi video.",
        toolType: "video",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Transformator Visual yang akan menghasilkan video dengan gaya visual artistik yang unik.",
        components: [
          {
            name: "subject",
            label: "Subjek Video",
            type: "text",
            placeholder: "e.g., 'A dancing silhouette'",
            info: "Fokus utama dari video Anda.",
            validation: { min_length: 5 },
          },
          {
            name: "style",
            label: "Gaya Visual",
            type: "textarea",
            placeholder:
              "e.g., 'in the style of a psychedelic painting, vibrant, abstract'",
            info: "Deskripsi gaya artistik yang Anda inginkan.",
            validation: { min_length: 10 },
          },
          {
            name: "transformation",
            label: "Transformasi (untuk video-ke-video)",
            type: "text",
            placeholder: "e.g., 'Transform my video into an anime scene'",
            info: "Jelaskan bagaimana video input harus diubah.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "aspectRatio",
            label: "Aspect Ratio",
            type: "select",
            options: ["9:16 (Portrait)", "16:9 (Landscape)", "1:1 (Square)"],
            info: "Pilih orientasi video Anda.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
      "Google VEO": {
        description:
          "Buat prompt yang sangat deskriptif dan sinematik untuk menghasilkan video berkualitas tinggi dengan Google VEO.",
        toolType: "video",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Sinematografer AI yang akan menghasilkan video berkualitas tinggi.",
        components: [
          {
            name: "prompt",
            label: "Prompt Deskriptif",
            type: "textarea",
            placeholder:
              "e.g., 'Several majestic elephants stride toward a watering hole at sunset, their wrinkled skin catching the golden light. The African savanna stretches out behind them.'",
            info: "Tulis prompt yang kaya detail, seolah-olah mendeskripsikan adegan film.",
            validation: { min_length: 50 },
          },
          {
            name: "aspectRatio",
            label: "Aspect Ratio",
            type: "select",
            options: ["16:9", "9:16", "1:1"],
            info: 'Nilai yang didukung adalah "16:9" (layar lebar, bagus untuk lanskap), "9:16" (potret/vertikal, bagus untuk objek tinggi), dan "1:1" (persegi). Default adalah "16:9".',
          },
          {
            name: "personGeneration",
            label: "Generasi Orang",
            type: "select",
            options: ["allow", "dont_allow", "allow_adult"],
            info: 'Kontrol penyertaan orang dengan "dont_allow" atau "allow_adult".',
          },
          {
            name: "negativePrompt",
            label: "Negative Prompt",
            type: "textarea",
            placeholder: "e.g., 'wall, frame'",
            info: 'Tentukan elemen yang akan dikecualikan dari video. Jelaskan apa yang tidak Anda inginkan (misalnya, "dinding, bingkai") daripada menggunakan bahasa instruktif seperti "tidak" atau "jangan".',
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "generateAudio",
            label: "Generate Audio",
            type: "select",
            options: ["true", "false"],
            info: "Kontrol apakah audio dihasilkan untuk video.",
          },
          {
            name: "image",
            label: "Image (First Frame)",
            type: "text",
            placeholder: "e.g., 'URL_gambar'",
            info: "Gunakan gambar sebagai bingkai pertama untuk generasi gambar-ke-video.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "durationSeconds",
            label: "Durasi (detik)",
            type: "number",
            placeholder: "e.g., 8",
            info: "Klip video yang dihasilkan biasanya berdurasi 8 detik, tetapi dapat diperpanjang hingga 60 detik.",
            validation: { min_value: 1, max_value: 60 },
          },
          {
            name: "resolution",
            label: "Resolusi",
            type: "text",
            placeholder: "e.g., '1280x720px'",
            info: "Veo 2 menghasilkan 1280x720px (720p), dengan potensi resolusi 4K.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "model",
            label: "Model",
            type: "text",
            placeholder: "e.g., 'veo-2.0-generate-001'",
            info: 'Tentukan versi model, misalnya, "veo-2.0-generate-001" atau "veo-3.0-generate-preview".',
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "cinematicTerms",
            label: "Istilah Sinematik",
            type: "text",
            placeholder:
              "e.g., 'time-lapse of a blooming flower', 'aerial shot of a coastline'",
            info: "Gunakan istilah teknis perfilman untuk mengarahkan hasil.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "styleModifier",
            label: "Pengubah Gaya",
            type: "text",
            placeholder:
              "e.g., 'in a surreal, dreamlike style', 'as a black and white film noir'",
            info: "Tambahkan frasa untuk menentukan gaya visual secara keseluruhan.",
            optional: true,
            validation: { min_length: 5 },
          },
          {
            name: "dialog",
            label: "Dialog",
            type: "textarea",
            placeholder:
              "e.g., 'Narator: Selamat datang di masa depan. Karakter A: Ini luar biasa!'",
            info: "Sertakan dialog yang akan diucapkan dalam video.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              'Contoh: Veo 3 adalah versi terbaru, menawarkan realisme yang ditingkatkan, simulasi fisika, dan kemampuan audio asli. Klip biasanya berdurasi 8 detik, tetapi dapat diperpanjang hingga 60 detik. Filter keamanan diterapkan pada konten yang dihasilkan. Veo memiliki pemahaman yang kuat tentang bahasa sinematik, memungkinkan kontrol yang tepat atas output video. Titik Akses: Veo dapat diakses melalui Gemini API, Vertex AI, dan aplikasi Flow. Paket Google One AI Premium mungkin termasuk akses. Harga: Veo adalah fitur berbayar; periksa halaman harga resmi Google untuk detailnya. Hindari Pencampuran Gaya: Jangan mencampur gaya yang bertentangan (misalnya, kartun dan fotorealistik) dalam satu prompt. Subtitle: Untuk menghindari subtitle yang tidak diinginkan, tambahkan "(tanpa subtitle)" ke prompt atau gunakan metode prompt dialog tertentu. Watermark: Video yang dihasilkan mungkin menyertakan watermark.',
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Platform Desain Berbasis AI": {
      "Canva (Magic Design)": {
        description:
          "Gunakan deskripsi teks untuk menghasilkan template desain yang dapat disesuaikan secara instan di Canva.",
        toolType: "image-editing",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Desainer Grafis AI yang akan menghasilkan template desain yang dapat disesuaikan di Canva.",
        components: [
          {
            name: "designType",
            label: "Jenis Desain",
            type: "select",
            options: [
              "Presentasi",
              "Postingan Instagram",
              "Poster",
              "Logo",
              "Selebaran (Flyer)",
              "Lainnya...",
            ],
            info: "Pilih jenis dokumen atau format desain yang Anda butuhkan.",
          },
          {
            name: "description",
            label: "Deskripsi Desain Anda",
            type: "textarea",
            placeholder:
              "e.g., 'Sebuah postingan Instagram untuk mempromosikan workshop tentang berkebun di perkotaan. Gunakan gaya yang modern dan organik dengan warna hijau dan krem.'",
            info: "Jelaskan secara singkat (5+ kata) tentang ide, gaya, dan konten desain Anda.",
            validation: { min_length: 20 },
          },
          {
            name: "contentToInclude",
            label: "Teks & Konten Utama",
            type: "textarea",
            placeholder:
              "e.g., 'Judul: Urban Gardening 101. Tanggal: 25 Juli. Pembicara: Jane Doe.'",
            info: "Sebutkan teks, judul, atau informasi penting yang harus ada di dalam desain.",
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
    "Utilitas & Penyuntingan AI": {
      Clipdrop: {
        description:
          "Gunakan prompt untuk berbagai alat bantu AI dari Clipdrop, seperti mengganti latar belakang atau memperbesar gambar.",
        toolType: "image-editing",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Editor Foto AI yang akan menerapkan fungsi alat Clipdrop.",
        components: [
          {
            name: "tool",
            label: "Alat Clipdrop yang Digunakan",
            type: "select",
            options: [
              "Stable Diffusion XL",
              "Uncrop",
              "Reimagine XL",
              "Stable Doodle",
              "Cleanup",
              "Remove Background",
              "Replace Background",
              "Image Upscaler",
              "Lainnya...",
            ],
            info: "Pilih alat spesifik yang ingin Anda gunakan.",
          },
          {
            name: "prompt",
            label: "Prompt / Instruksi",
            type: "textarea",
            placeholder:
              "e.g., 'A photo of a corgi wearing a superhero cape' atau 'replace the background with a beautiful beach at sunset'",
            info: "Deskripsikan apa yang ingin Anda hasilkan atau ubah.",
            validation: { min_length: 10 },
          },
          {
            name: "imageInput",
            label: "Input Gambar (jika ada)",
            type: "text",
            placeholder: "e.g., 'Gunakan gambar anjing saya.'",
            info: "Sebutkan gambar yang akan diedit jika menggunakan alat seperti Remove Background atau Uncrop.",
            optional: true,
            validation: { min_length: 10 },
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
            optional: true,
            validation: { min_length: 10 },
          },
        ],
      },
    },
  },
  "Audio & Musik": {
    "Alat Bantu Komposisi": {
      "Penulisan Lirik Lagu": {
        description:
          "Buat lirik untuk lagu dengan struktur dan nuansa tertentu.",
        toolType: "music-composition",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Lirik Profesional yang akan menghasilkan komposisi lagu.",
        components: [
          {
            name: "genre",
            label: "Genre Musik",
            type: "select",
            options: [
              "Pop",
              "Rock",
              "R&B",
              "Folk",
              "Hip-Hop",
              "Electronic",
              "Lainnya...",
            ],
            info: "Genre akan mempengaruhi gaya bahasa dan struktur lirik.",
          },
          {
            name: "theme",
            label: "Tema Lagu",
            type: "text",
            placeholder:
              "e.g., 'cinta pertama, patah hati, perjalanan hidup, protes sosial'",
            info: "Gagasan atau cerita utama di balik lagu.",
          },
          {
            name: "mood",
            label: "Suasana Hati Lagu",
            type: "select",
            options: [
              "Senang & Ceria",
              "Sedih & Melankolis",
              "Energik & Memotivasi",
              "Marah & Frustrasi",
              "Romantis & Intim",
              "Lainnya...",
            ],
            info: "Emosi utama yang ingin disampaikan melalui lirik.",
          },
          {
            name: "structure",
            label: "Struktur Lagu (Opsional)",
            type: "text",
            placeholder: "e.g., 'Verse-Chorus-Verse-Chorus-Bridge-Chorus'",
            info: "Tentukan urutan bagian-bagian lagu jika Anda punya preferensi.",
          },
          {
            name: "keyElements",
            label: "Elemen/Kata Kunci Wajib",
            type: "textarea",
            placeholder: "e.g., 'sebutkan kata 'bintang', 'malam', 'harapan''",
            info: "Gambar, kata, atau frasa spesifik yang harus ada dalam lirik.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan banyak metafora alam (laut, gunung, hutan). Hindari rima yang terlalu klise. Cerita harus berkembang dari sedih menjadi penuh harapan di bagian akhir.",
            info: "Detail artistik atau batasan kreatif untuk AI. Misalnya, penggunaan metafora atau majas tertentu.",
          },
        ],
      },
      "Ide Progresi Kord": {
        description: "Hasilkan ide progresi kord berdasarkan genre dan mood.",
        toolType: "music-composition",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Komposer Musik yang akan menghasilkan ide progresi kord.",
        components: [
          {
            name: "genre",
            label: "Genre Musik",
            type: "select",
            options: [
              "Blues",
              "Jazz",
              "Pop Ballad",
              "Rock Alternatif",
              "Sinematik",
              "Lainnya...",
            ],
            info: "Genre seringkali memiliki progresi kord yang khas.",
          },
          {
            name: "mood",
            label: "Mood yang Diinginkan",
            type: "select",
            options: [
              "Ceria & Terang",
              "Sedih & Minor",
              "Misterius & Tegang",
              "Tenang & Damai",
              "Epik & Megah",
              "Lainnya...",
            ],
            info: "Pilihan kord (mayor/minor/dll) akan sangat dipengaruhi oleh mood.",
          },
          {
            name: "key",
            label: "Kunci Nada (Opsional)",
            type: "text",
            placeholder: "e.g., 'C Major, A minor'",
            info: "Menentukan 'rumah' atau pusat tonal dari progresi.",
          },
          {
            name: "complexity",
            label: "Tingkat Kompleksitas Kord",
            type: "select",
            options: [
              "Sederhana (3-4 kord dasar)",
              "Menengah (dengan kord ke-7)",
              "Kompleks (dengan kord ekstensi/substitusi)",
              "Lainnya...",
            ],
            info: "'Sederhana' untuk lagu pop, 'Kompleks' mungkin menyertakan kord 7, 9, atau substitusi.",
          },
          {
            name: "partOfSong",
            label: "Untuk Bagian Lagu Mana?",
            type: "select",
            options: [
              "Verse",
              "Chorus",
              "Bridge",
              "Semua Bagian",
              "Lainnya...",
            ],
            info: "Progresi untuk chorus biasanya lebih kuat dan 'catchy' daripada verse.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Sertakan setidaknya satu kord pinjaman dari minor paralel. Progresi harus cocok untuk dimainkan dengan gitar akustik. Buat bagian bridge yang terasa 'mengawang'.",
            info: "Instruksi teknis atau artistik tambahan untuk progresi kord yang dihasilkan.",
          },
        ],
      },
    },
    "Prompt AI Musik & Audio": {
      "Suno AI": {
        description:
          "Buat lagu lengkap dengan vokal dari deskripsi teks menggunakan Suno AI.",
        toolType: "music-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Produser Musik AI yang akan menghasilkan komposisi lagu.",
        components: [
          {
            name: "lyrics",
            label: "Lirik Lagu",
            type: "textarea",
            placeholder:
              "e.g., '[Verse 1]\nWalking through the city lights\n[Chorus]\nOh, I feel so alive tonight'",
            info: "Masukkan lirik lengkap dengan penanda bagian seperti [Verse] dan [Chorus]. Atau biarkan kosong dan jelaskan di deskripsi gaya.",
          },
          {
            name: "model",
            label: "Model",
            type: "select",
            options: ["v3.5", "v3.5-turbo", "v4-alpha", "chirp-v3"],
            info: "Pilih versi model Suno AI yang akan digunakan.",
          },
          {
            name: "instrumental",
            label: "Instrumental?",
            type: "select",
            options: ["Tidak", "Ya"],
            info: "Pilih 'Ya' jika Anda hanya ingin musik tanpa vokal.",
          },
          {
            name: "styleOfMusic",
            label: "Gaya Musik",
            type: "text",
            placeholder:
              "e.g., 'acoustic pop', '80s synthwave with female vocal', 'epic cinematic orchestral'",
            info: "Deskripsikan genre, mood, instrumen, dan tipe vokal yang Anda inginkan.",
          },
          {
            name: "makeInstrumental",
            label: "Buat Versi Instrumental?",
            type: "select",
            options: ["Tidak", "Ya"],
            info: "Pilih 'Ya' jika Anda hanya ingin musik tanpa vokal.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Gunakan gaya bahasa yang sangat personal dan rentan. Sertakan satu analogi tentang berkebun. Akhiri dengan nada yang penuh harapan. Untuk hasil terbaik, gunakan model v3.5 atau v3.5-turbo.",
            info: "Instruksi spesifik tentang gaya, nada, atau elemen naratif yang harus ada.",
          },
        ],
      },
      Udio: {
        description:
          "Buat prompt untuk Udio, yang dikenal dengan kualitas audio dan fleksibilitas gayanya.",
        toolType: "music-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Komposer Audio Kreatif yang akan menghasilkan musik berdasarkan prompt deskriptif.",
        components: [
          {
            name: "prompt",
            label: "Prompt Deskriptif",
            type: "textarea",
            placeholder:
              "e.g., 'A soulful blues track about a long road trip, with harmonica solos, male vocals, and a steady drum beat'",
            info: "Deskripsikan musik Anda secara detail, termasuk genre, instrumen, mood, dan tema.",
          },
          {
            name: "lyrics",
            label: "Lirik (Opsional)",
            type: "textarea",
            placeholder: "e.g., '[Verse]\nSunrise on the highway...'",
            info: "Masukkan lirik jika Anda punya, atau biarkan Udio yang membuatnya.",
          },
          {
            name: "instrumental",
            label: "Instrumental?",
            type: "select",
            options: ["Tidak", "Ya"],
            info: "Pilih 'Ya' untuk membuat lagu tanpa vokal.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Stable Audio": {
        description:
          "Hasilkan audio, efek suara, atau musik instrumental berkualitas tinggi dari deskripsi teks.",
        toolType: "audio-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Insinyur Audio AI yang akan menghasilkan audio, efek suara, atau musik instrumental.",
        components: [
          {
            name: "prompt",
            label: "Deskripsi Audio",
            type: "textarea",
            placeholder:
              "e.g., 'A cinematic soundtrack with a powerful orchestra, epic drums, and a choir. 120 BPM. Dramatic, adventurous.'",
            info: "Jelaskan suara yang Anda inginkan. Sertakan genre, mood, instrumen, dan BPM.",
          },
          {
            name: "negativePrompt",
            label: "Prompt Negatif (Opsional)",
            type: "text",
            placeholder: "e.g., 'low quality, noisy, distorted'",
            info: "Suara atau kualitas yang ingin Anda hindari.",
          },
          {
            name: "duration",
            label: "Durasi (detik)",
            type: "number",
            placeholder: "e.g., 45",
            info: "Panjang klip audio yang diinginkan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "MusicFX (Google)": {
        description:
          "Eksplorasi ide musik dengan cepat menggunakan model MusicLM from Google.",
        toolType: "music-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Eksplorator Musik Cepat yang akan menghasilkan ide musik berdasarkan prompt deskriptif.",
        components: [
          {
            name: "prompt",
            label: "Prompt Deskriptif",
            type: "textarea",
            placeholder:
              "e.g., 'lo-fi chill beat for studying', 'reggae song with a catchy bassline', 'epic rock anthem with electric guitar solos'",
            info: "Deskripsikan musik yang ingin Anda buat dengan fokus pada mood, genre, dan instrumen.",
          },
          {
            name: "duration",
            label: "Durasi (detik)",
            type: "select",
            options: ["30", "50", "70"],
            info: "Pilih panjang loop musik yang akan dihasilkan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      Mubert: {
        description:
          "Hasilkan musik fungsional bebas royalti berdasarkan durasi, mood, atau aktivitas.",
        toolType: "music-generation",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Kurator Musik Fungsional yang akan menghasilkan musik fungsional bebas royalti.",
        components: [
          {
            name: "prompt",
            label: "Prompt (Genre, Mood, atau Aktivitas)",
            type: "text",
            placeholder: "e.g., 'techno', 'melancholic', 'workout', 'gaming'",
            info: "Deskripsikan jenis musik yang Anda butuhkan dalam satu kata atau frasa singkat.",
          },
          {
            name: "duration",
            label: "Durasi (menit)",
            type: "number",
            placeholder: "e.g., 5",
            info: "Tentukan panjang trek musik yang Anda inginkan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
    },
  },
  "Prompt Ringkas": {
    "Formula Persuasi & Pemasaran": {
      AIDA: {
        description:
          "Buat teks persuasif yang menarik perhatian, membangun minat, menciptakan keinginan, dan mendorong tindakan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Persuasi yang akan menghasilkan teks persuasif.",
        components: [
          {
            name: "productOrService",
            label: "Produk/Layanan",
            type: "text",
            placeholder: "e.g., 'Aplikasi manajemen waktu'",
            info: "Apa yang Anda tawarkan?",
          },
          {
            name: "targetAudience",
            label: "Target Audiens",
            type: "text",
            placeholder: "e.g., 'Profesional sibuk, pelajar'",
            info: "Siapa yang Anda sasar?",
          },
          {
            name: "attentionHook",
            label: "Poin untuk Menarik Perhatian (Attention)",
            type: "textarea",
            placeholder:
              "e.g., 'Berhenti membuang-buang waktu. Dapatkan kembali kendali hari Anda.'",
            info: "Bagaimana cara Anda menghentikan scroll audiens?",
          },
          {
            name: "interestPoints",
            label: "Poin untuk Membangun Minat (Interest)",
            type: "textarea",
            placeholder:
              "e.g., 'Fitur pelacakan otomatis, integrasi kalender, laporan produktivitas mingguan.'",
            info: "Informasi menarik atau relevan yang membuat mereka terus membaca.",
          },
          {
            name: "desireDrivers",
            label: "Poin untuk Menciptakan Keinginan (Desire)",
            type: "textarea",
            placeholder:
              "e.g., 'Bayangkan menyelesaikan semua tugas Anda sebelum jam 3 sore. Rasakan kebebasan dan ketenangan pikiran.'",
            info: "Bagaimana produk Anda membuat hidup mereka lebih baik? Fokus pada manfaat emosional.",
          },
          {
            name: "callToAction",
            label: "Ajakan Bertindak (Action)",
            type: "text",
            placeholder:
              "e.g., 'Unduh sekarang dan coba gratis selama 7 hari!'",
            info: "Apa langkah selanjutnya yang harus diambil audiens?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      PAS: {
        description:
          "Identifikasi masalah audiens, buat mereka merasakan urgensinya, lalu tawarkan solusi Anda.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Diagnostik Pemasaran yang akan mengidentifikasi masalah audiens dan menawarkan solusi.",
        components: [
          {
            name: "problem",
            label: "Masalah yang Dihadapi Audiens (Problem)",
            type: "textarea",
            placeholder:
              "e.g., 'Sulit untuk tetap fokus saat bekerja dari rumah dengan banyaknya distraksi.'",
            info: "Apa titik sakit utama audiens?",
          },
          {
            name: "agitation",
            label: "Detail untuk Memperburuk Masalah (Agitate)",
            type: "textarea",
            placeholder:
              "e.g., 'Tenggat waktu terlewat, pekerjaan menumpuk, dan perasaan bersalah di akhir hari.'",
            info: "Gali lebih dalam masalah tersebut. Buat audiens merasakannya.",
          },
          {
            name: "solution",
            label: "Solusi yang Ditawarkan (Solution)",
            type: "textarea",
            placeholder:
              "e.g., 'Aplikasi kami membantu Anda memblokir distraksi, menjadwalkan fokus, dan mencapai tujuan harian Anda.'",
            info: "Perkenalkan produk/layanan Anda sebagai jalan keluar.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      FAB: {
        description:
          "Jelaskan fitur produk, keunggulannya dibanding yang lain, dan manfaatnya bagi pelanggan.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penjelas Produk yang akan menjelaskan fitur produk, keunggulannya, dan manfaatnya.",
        components: [
          {
            name: "productOrService",
            label: "Produk/Layanan",
            type: "text",
            placeholder: "e.g., 'Botol minum pintar'",
            info: "Produk atau layanan yang akan dijelaskan.",
          },
          {
            name: "features",
            label: "Fitur-fitur (Features)",
            type: "textarea",
            placeholder:
              "e.g., 'Sensor pelacak hidrasi, terbuat dari stainless steel vakum, terhubung ke aplikasi via Bluetooth.'",
            info: "Apa saja karakteristik teknis atau fungsional dari produk Anda?",
          },
          {
            name: "advantages",
            label: "Keunggulan (Advantages)",
            type: "textarea",
            placeholder:
              "e.g., 'Satu-satunya botol yang secara aktif mengingatkan Anda untuk minum, menjaga suhu 24 jam.'",
            info: "Apa yang membuat fitur Anda lebih baik dari kompetitor?",
          },
          {
            name: "benefits",
            label: "Manfaat bagi Pelanggan (Benefits)",
            type: "textarea",
            placeholder:
              "e.g., 'Anda akan tetap terhidrasi sepanjang hari, meningkatkan energi dan fokus, serta memiliki minuman dingin/panas kapan saja.'",
            info: "Apa hasil positif yang didapat pelanggan dari penggunaan produk?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      CARE: {
        description:
          "Struktur umpan balik atau studi kasus dengan memberikan konteks, tindakan yang diambil, hasil yang dicapai, dan contoh nyata.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pencerita Dampak yang akan menyusun umpan balik atau studi kasus.",
        components: [
          {
            name: "context",
            label: "Konteks Situasi (Context)",
            type: "textarea",
            placeholder:
              "e.g., 'Tim penjualan kami kesulitan mengelola data prospek yang masuk dari berbagai kanal.'",
            info: "Latar belakang atau situasi awal.",
          },
          {
            name: "action",
            label: "Tindakan yang Diambil (Action)",
            type: "textarea",
            placeholder:
              "e.g., 'Kami mengimplementasikan CRM baru dan melatih seluruh tim dalam waktu 2 minggu.'",
            info: "Langkah-langkah spesifik yang dilakukan.",
          },
          {
            name: "result",
            label: "Hasil yang Dicapai (Result)",
            type: "textarea",
            placeholder:
              "e.g., 'Tingkat konversi meningkat 25% dan waktu respons terhadap prospek berkurang 50%.'",
            info: "Dampak kuantitatif atau kualitatif dari tindakan tersebut.",
          },
          {
            name: "example",
            label: "Contoh Spesifik (Example)",
            type: "textarea",
            placeholder:
              "e.g., 'Sebagai contoh, seorang anggota tim berhasil menutup 5 kesepakatan besar bulan lalu, naik dari rata-rata 2 kesepakatan.'",
            info: "Ilustrasi atau cerita singkat yang mendukung hasil.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      RACE: {
        description:
          "Rencanakan strategi pemasaran digital lengkap dari menjangkau audiens hingga mempertahankan mereka.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perencana Pemasaran Digital yang akan merencanakan strategi pemasaran digital.",
        components: [
          {
            name: "reachStrategy",
            label: "Strategi Menjangkau Audiens (Reach)",
            type: "textarea",
            placeholder:
              "e.g., 'Konten blog SEO, iklan media sosial bertarget, kolaborasi dengan influencer.'",
            info: "Bagaimana cara audiens menemukan Anda?",
          },
          {
            name: "actPrompt",
            label: "Cara Mendorong Interaksi Awal (Act)",
            type: "textarea",
            placeholder:
              "e.g., 'Menawarkan e-book gratis, kuis interaktif, ajakan untuk berkomentar di postingan.'",
            info: "Apa langkah pertama yang Anda ingin audiens lakukan di situs/media sosial Anda?",
          },
          {
            name: "convertStrategy",
            label: "Strategi Konversi (Convert)",
            type: "textarea",
            placeholder:
              "e.g., 'Landing page dengan penawaran terbatas, demo produk, testimoni pelanggan.'",
            info: "Bagaimana cara mengubah pengunjung menjadi pelanggan?",
          },
          {
            name: "engageStrategy",
            label: "Strategi Mempertahankan Pelanggan (Engage)",
            type: "textarea",
            placeholder:
              "e.g., 'Newsletter eksklusif, grup komunitas, program loyalitas.'",
            info: "Bagaimana cara Anda membangun hubungan jangka panjang setelah pembelian?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      BAB: {
        description:
          "Gambarkan dunia audiens sebelum dan sesudah menggunakan produk Anda, lalu posisikan produk sebagai jembatannya.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Narator Transformasi yang akan menggambarkan kondisi audiens sebelum dan sesudah menggunakan produk.",
        components: [
          {
            name: "beforeState",
            label: "Kondisi Audiens Saat Ini (Before)",
            type: "textarea",
            placeholder:
              "e.g., 'Menghabiskan berjam-jam setiap minggu untuk membuat laporan manual yang membosankan dan rentan kesalahan.'",
            info: "Gambarkan dunia yang penuh masalah tanpa produk Anda.",
          },
          {
            name: "afterState",
            label: "Kondisi Ideal yang Diinginkan (After)",
            type: "textarea",
            placeholder:
              "e.g., 'Bayangkan laporan dibuat secara otomatis dalam hitungan detik, memberi Anda waktu untuk fokus pada strategi.'",
            info: "Gambarkan dunia yang lebih baik dengan produk Anda.",
          },
          {
            name: "bridge",
            label: "Produk/Layanan sebagai Jembatan (Bridge)",
            type: "textarea",
            placeholder:
              "e.g., 'Software kami adalah jembatan yang membawa Anda dari kerumitan ke efisiensi dengan satu klik.'",
            info: "Jelaskan bagaimana produk Anda adalah solusi yang menghubungkan 'Before' dan 'After'.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
    },
    "Pemikiran Terstruktur & Analisis": {
      "CoT (Chain of Thought)": {
        description:
          "Pandu AI untuk memecah masalah kompleks menjadi langkah-langkah kecil dan menunjukkannya, menghasilkan jawaban yang lebih logis.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pemikir Logis yang akan memecah masalah kompleks menjadi langkah-langkah penalaran.",
        components: [
          {
            name: "complexQuestion",
            label: "Pertanyaan atau Masalah Kompleks",
            type: "textarea",
            placeholder:
              "e.g., 'Jika sebuah mobil melaju 60 km/jam, berapa jarak yang ditempuh dalam 3 jam dan 45 menit?'",
            info: "Pertanyaan yang membutuhkan beberapa langkah penalaran untuk dijawab.",
          },
          {
            name: "exampleReasoning",
            label: "Contoh Penalaran (Opsional, untuk Few-Shot)",
            type: "textarea",
            placeholder:
              "e.g., 'Q: Berapa banyak bola tenis dalam 3 kaleng jika setiap kaleng berisi 4 bola? A: Kaleng 1 punya 4 bola. Kaleng 2 punya 4 bola. Kaleng 3 punya 4 bola. Jadi 3 * 4 = 12 bola.'",
            info: "Berikan contoh cara Anda ingin AI berpikir. Untuk Zero-Shot, biarkan kosong dan tambahkan 'Mari kita berpikir langkah demi langkah' pada instruksi tambahan.",
          },
          {
            name: "additionalContext",
            label: "Instruksi Tambahan",
            type: "textarea",
            placeholder: "e.g., 'Mari kita berpikir langkah demi langkah.'",
            info: "Instruksi akhir untuk memicu proses penalaran.",
          },
        ],
      },
      "Zero-shot CoT": {
        description:
          "Versi sederhana dari Chain of Thought, cukup dengan menambahkan frasa ajaib untuk memicu penalaran langkah-demi-langkah.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penalaran Cepat yang akan menerapkan penalaran langkah-demi-langkah.",
        components: [
          {
            name: "question",
            label: "Pertanyaan",
            type: "textarea",
            placeholder: "e.g., 'Jelaskan mengapa langit berwarna biru.'",
            info: "Pertanyaan yang ingin Anda ajukan ke AI.",
          },
          {
            name: "magicPhrase",
            label: "Frasa Pemicu",
            type: "text",
            placeholder: "e.g., 'Mari kita berpikir langkah demi langkah.'",
            info: "Frasa sederhana yang ditambahkan di akhir prompt untuk mendorong penalaran terstruktur.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "ToT (Tree of Thoughts)": {
        description:
          "Minta AI untuk mengeksplorasi beberapa jalur pemikiran yang berbeda secara bersamaan dan mengevaluasinya untuk menemukan solusi terbaik.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pemikir Strategis yang akan mengeksplorasi beberapa jalur pemikiran.",
        components: [
          {
            name: "problem",
            label: "Masalah Kompleks",
            type: "textarea",
            placeholder:
              "e.g., 'Bagaimana cara merancang sistem transportasi yang efisien untuk kota metropolitan baru?'",
            info: "Masalah yang memiliki banyak kemungkinan solusi dan variabel.",
          },
          {
            name: "thoughtPaths",
            label: "Jumlah Jalur Pemikiran untuk Dieksplorasi",
            type: "number",
            placeholder: "e.g., 3",
            info: "Berapa banyak ide atau pendekatan awal yang harus dipertimbangkan AI?",
          },
          {
            name: "evaluationCriteria",
            label: "Kriteria Evaluasi",
            type: "textarea",
            placeholder:
              "e.g., 'Biaya, dampak lingkungan, kecepatan implementasi, skalabilitas.'",
            info: "Bagaimana setiap jalur pemikiran akan dinilai dan dibandingkan?",
          },
          {
            name: "additionalContext",
            label: "Instruksi Tambahan",
            type: "textarea",
            placeholder:
              "e.g., 'Untuk setiap jalur pemikiran, pertimbangkan pro dan kontranya. Di akhir, berikan rekomendasi jalur terbaik berdasarkan kriteria.'",
            info: "Panduan untuk proses eksplorasi dan evaluasi.",
          },
        ],
      },
      STAR: {
        description:
          "Strukturkan jawaban untuk pertanyaan wawancara berbasis perilaku atau jelaskan sebuah pencapaian.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Narator Pencapaian yang akan menyusun jawaban atau deskripsi pencapaian.",
        components: [
          {
            name: "situation",
            label: "Situasi (Situation)",
            type: "textarea",
            placeholder:
              "e.g., 'Saat peluncuran produk baru, kami menemukan bug kritis beberapa jam sebelum live.'",
            info: "Berikan konteks dan latar belakang dari cerita Anda.",
          },
          {
            name: "task",
            label: "Tugas (Task)",
            type: "textarea",
            placeholder:
              "e.g., 'Tugas saya adalah mengkoordinasikan tim developer dan QA untuk memperbaiki bug tanpa menunda peluncuran.'",
            info: "Apa tanggung jawab spesifik Anda dalam situasi tersebut?",
          },
          {
            name: "action",
            label: "Tindakan (Action)",
            type: "textarea",
            placeholder:
              "e.g., 'Saya segera membuat ruang perang virtual, mendelegasikan tugas investigasi, dan mengatur komunikasi setiap 30 menit.'",
            info: "Langkah-langkah konkret yang Anda ambil.",
          },
          {
            name: "result",
            label: "Hasil (Result)",
            type: "textarea",
            placeholder:
              "e.g., 'Kami berhasil mengisolasi dan memperbaiki bug dalam 2 jam, dan produk diluncurkan tepat waktu dengan sukses.'",
            info: "Apa hasil dari tindakan Anda? Kuantifikasi jika memungkinkan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      SWOT: {
        description:
          "Lakukan analisis strategis dengan mengidentifikasi Kekuatan, Kelemahan, Peluang, dan Ancaman.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Analis Strategis yang akan melakukan analisis SWOT.",
        components: [
          {
            name: "subject",
            label: "Subjek Analisis",
            type: "text",
            placeholder:
              "e.g., 'Kedai Kopi Lokal Saya', 'Proyek Peluncuran Aplikasi Mobile'",
            info: "Apa yang sedang Anda analisis?",
          },
          {
            name: "strengths",
            label: "Kekuatan (Strengths)",
            type: "textarea",
            placeholder:
              "e.g., 'Lokasi strategis, biji kopi unik, barista berpengalaman.'",
            info: "Faktor internal positif yang memberi Anda keunggulan.",
          },
          {
            name: "weaknesses",
            label: "Kelemahan (Weaknesses)",
            type: "textarea",
            placeholder:
              "e.g., 'Kapasitas tempat duduk terbatas, belum ada layanan pesan antar.'",
            info: "Faktor internal negatif yang menghambat Anda.",
          },
          {
            name: "opportunities",
            label: "Peluang (Opportunities)",
            type: "textarea",
            placeholder:
              "e.g., 'Tren kerja dari kafe, meningkatnya permintaan kopi spesialti di area tersebut.'",
            info: "Faktor eksternal yang dapat Anda manfaatkan.",
          },
          {
            name: "threats",
            label: "Ancaman (Threats)",
            type: "textarea",
            placeholder:
              "e.g., 'Munculnya kedai kopi waralaba besar di dekat lokasi, kenaikan harga sewa.'",
            info: "Faktor eksternal yang dapat merugikan Anda.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "First Principles Thinking": {
        description:
          "Pecah masalah kompleks menjadi kebenaran-kebenaran fundamentalnya untuk membangun solusi dari dasar.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pemikir Fundamental yang akan memecah masalah kompleks menjadi kebenaran-kebenaran fundamentalnya.",
        components: [
          {
            name: "problem",
            label: "Masalah atau Konsep",
            type: "text",
            placeholder:
              "e.g., 'Meningkatkan efisiensi baterai', 'Apa itu bisnis?'",
            info: "Masalah yang ingin Anda dekonstruksi.",
          },
          {
            name: "assumptions",
            label: "Asumsi yang Ada Saat Ini",
            type: "textarea",
            placeholder:
              "e.g., 'Baterai harus terbuat dari lithium-ion. Bisnis harus punya kantor fisik.'",
            info: "Apa saja keyakinan umum atau 'cara lama' dalam memandang masalah ini?",
          },
          {
            name: "firstPrinciples",
            label: "Identifikasi Prinsip Pertama",
            type: "textarea",
            placeholder:
              "e.g., 'Apa fungsi dasar baterai? Menyimpan and melepaskan energi. Apa hukum fisika yang mengaturnya? Apa esensi dari bisnis? Pertukaran nilai.'",
            info: "Ajukan pertanyaan 'mengapa' berulang kali untuk menemukan kebenaran yang tidak dapat dipecah lagi.",
          },
          {
            name: "rebuildSolution",
            label: "Bangun Solusi Baru dari Dasar",
            type: "textarea",
            placeholder:
              "e.g., 'Dari prinsip pertama, bisakah kita menyimpan energi dengan cara lain? Bisakah pertukaran nilai terjadi tanpa kantor?'",
            info: "Gunakan kebenaran fundamental untuk merakit pendekatan atau solusi baru yang inovatif.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      SCAMPER: {
        description:
          "Gunakan 7 pemicu pemikiran untuk melakukan brainstorming dan inovasi pada ide atau produk yang sudah ada.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Inovator Kreatif yang akan menerapkan kerangka SCAMPER.",
        components: [
          {
            name: "subject",
            label: "Produk/Ide yang Akan Di-SCAMPER",
            type: "text",
            placeholder: "e.g., 'Payung', 'Aplikasi catatan'",
            info: "Fokus dari sesi brainstorming.",
          },
          {
            name: "substitute",
            label: "Ganti (Substitute)",
            type: "textarea",
            placeholder:
              "e.g., 'Apa yang bisa diganti? Materialnya? Sumber energinya? Orangnya?'",
            info: "Pikirkan tentang penggantian komponen, material, atau proses.",
          },
          {
            name: "combine",
            label: "Kombinasikan (Combine)",
            type: "textarea",
            placeholder:
              "e.g., 'Apa yang bisa digabungkan? Payung dengan senter? Aplikasi catatan dengan pelacak kebiasaan?'",
            info: "Pikirkan tentang menggabungkan dua atau lebih ide/fitur.",
          },
          {
            name: "adapt",
            label: "Adaptasi (Adapt)",
            type: "textarea",
            placeholder:
              "e.g., 'Ide apa yang bisa diadaptasi? Bagaimana cara kerja di industri lain yang bisa diterapkan di sini?'",
            info: "Pikirkan tentang mengadaptasi fungsi dari konteks lain.",
          },
          {
            name: "modify",
            label: "Modifikasi (Modify)",
            type: "textarea",
            placeholder:
              "e.g., 'Apa yang bisa diperbesar atau diperkecil? Ubah bentuknya? Warnanya?'",
            info: "Pikirkan tentang mengubah atribut produk.",
          },
          {
            name: "putToAnotherUse",
            label: "Gunakan untuk Tujuan Lain (Put to another use)",
            type: "textarea",
            placeholder:
              "e.g., 'Bisakah ini digunakan oleh orang lain? Di industri lain? Apa kegunaan lainnya jika dimodifikasi?'",
            info: "Pikirkan tentang penggunaan alternatif.",
          },
          {
            name: "eliminate",
            label: "Hilangkan (Eliminate)",
            type: "textarea",
            placeholder:
              "e.g., 'Apa yang bisa disederhanakan atau dihilangkan? Fitur apa yang paling jarang dipakai?'",
            info: "Pikirkan tentang mengurangi kompleksitas.",
          },
          {
            name: "reverse",
            label: "Balikkan/Susun Ulang (Reverse/Rearrange)",
            type: "textarea",
            placeholder:
              "e.g., 'Bagaimana jika prosesnya dibalik? Bagaimana jika komponennya disusun ulang?'",
            info: "Pikirkan tentang membalikkan urutan atau tata letak.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      TREF: {
        description:
          "Struktur prompt dengan menentukan Tugas, Persyaratan, Ekspektasi, dan Format.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perencana Tugas yang akan menyusun respons berdasarkan struktur TREF.",
        components: [
          {
            name: "task",
            label: "Tugas (Task)",
            type: "textarea",
            placeholder:
              "e.g., 'Tulis email untuk mengumumkan peluncuran fitur baru.'",
            info: "Apa tugas utama yang harus dilakukan AI?",
          },
          {
            name: "requirements",
            label: "Persyaratan (Requirements)",
            type: "textarea",
            placeholder:
              "e.g., 'Sebutkan 3 manfaat utama. Target audiens adalah pengguna premium. Nada harus antusias.'",
            info: "Informasi dan batasan penting yang harus disertakan.",
          },
          {
            name: "expectations",
            label: "Ekspektasi (Ekspektasi)",
            type: "textarea",
            placeholder:
              "e.g., 'Email harus ringkas, tidak lebih dari 150 kata. Harus ada satu ajakan bertindak yang jelas.'",
            info: "Kriteria kualitas atau hasil akhir yang diharapkan.",
          },
          {
            name: "format",
            label: "Format (Format)",
            type: "text",
            placeholder:
              "e.g., 'Format sebagai email dengan Subjek, Isi, dan Penutup.'",
            info: "Bagaimana struktur output yang diinginkan?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      RACEF: {
        description:
          "Kerangka kerja untuk pembuatan konten: Peran, Aksi, Konteks, Contoh, Format.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Komunikator Efektif yang akan menghasilkan konten berdasarkan kerangka RACEF.",
        components: [
          {
            name: "role",
            label: "Peran (Role)",
            type: "text",
            placeholder:
              "e.g., 'Bertindak sebagai seorang ahli pemasaran digital.'",
            info: "Berikan AI sebuah persona.",
          },
          {
            name: "action",
            label: "Aksi (Action)",
            type: "textarea",
            placeholder:
              "e.g., 'Buat 5 ide judul untuk postingan blog tentang SEO.'",
            info: "Tugas spesifik yang harus dilakukan.",
          },
          {
            name: "context",
            label: "Konteks (Context)",
            type: "textarea",
            placeholder:
              "e.g., 'Target audiens adalah pemilik usaha kecil yang baru memulai.'",
            info: "Informasi latar belakang yang relevan.",
          },
          {
            name: "example",
            label: "Contoh (Example)",
            type: "textarea",
            placeholder:
              "e.g., 'Contoh judul yang bagus: '5 Kesalahan SEO yang Harus Dihindari Pemula'.'",
            info: "Berikan contoh output yang Anda suka.",
          },
          {
            name: "format",
            label: "Format (Format)",
            type: "text",
            placeholder: "e.g., 'Sajikan dalam bentuk daftar bernomor.'",
            info: "Struktur output yang diinginkan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      GRADE: {
        description:
          "Struktur prompt dengan menentukan Goal, Role, Audience, Desired format, and Extra details.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perancang Respons yang akan menghasilkan respons yang terstruktur berdasarkan kerangka GRADE.",
        components: [
          {
            name: "goal",
            label: "Goal",
            type: "textarea",
            placeholder: "Apa tujuan utama dari prompt ini?",
          },
          {
            name: "role",
            label: "Role",
            type: "textarea",
            placeholder: "Peran apa yang harus diambil oleh AI?",
          },
          {
            name: "audience",
            label: "Audience",
            type: "textarea",
            placeholder: "Siapa target audiens untuk outputnya?",
          },
          {
            name: "desiredFormat",
            label: "Desired Format",
            type: "textarea",
            placeholder: "Bagaimana format output yang diinginkan?",
          },
          {
            name: "extraDetails",
            label: "Extra Details",
            type: "textarea",
            placeholder: "Detail atau batasan tambahan lainnya.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
    },
    "Persona, Gaya & Skenario": {
      "Expert Persona": {
        description:
          "Minta AI untuk mengadopsi persona seorang ahli di bidang tertentu untuk mendapatkan jawaban yang lebih mendalam dan berwibawa.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Persona yang akan mengadopsi persona seorang ahli.",
        components: [
          {
            name: "expertRole",
            label: "Peran Ahli",
            type: "text",
            placeholder:
              "e.g., 'Seorang ahli biologi kelautan dengan pengalaman 20 tahun', 'Seorang sejarawan yang berspesialisasi dalam Kekaisaran Romawi'",
            info: "Jelaskan persona ahli secara spesifik. Sebutkan bidang, pengalaman, dan bahkan gaya komunikasinya.",
          },
          {
            name: "task",
            label: "Tugas untuk Ahli",
            type: "textarea",
            placeholder:
              "e.g., 'Jelaskan dampak perubahan iklim terhadap terumbu karang.'",
            info: "Pertanyaan atau tugas yang ingin Anda berikan kepada persona ahli ini.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan",
            type: "textarea",
            placeholder:
              "e.g., 'Jelaskan seolah-olah Anda sedang berbicara kepada mahasiswa tingkat pertama. Gunakan analogi yang mudah dipahami.'",
            info: "Instruksi untuk menjaga keaslian persona.",
          },
        ],
      },
      "Fictional Dialogue": {
        description:
          "Eksplorasi ide atau jelaskan konsep kompleks melalui dialog antara dua atau lebih karakter fiksi.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Penulis Dialog yang akan menghasilkan dialog fiksi antara karakter.",
        components: [
          {
            name: "topic",
            label: "Topik Dialog",
            type: "text",
            placeholder:
              "e.g., 'Konsep black hole', 'Perdebatan antara etika dan keuntungan'",
            info: "Topik utama yang akan didiskusikan dalam dialog.",
          },
          {
            name: "character1",
            label: "Karakter 1",
            type: "textarea",
            placeholder:
              "e.g., 'Skeptis: Seorang jurnalis yang selalu bertanya dan mencari bukti.'",
            info: "Deskripsikan nama, peran, dan sudut pandang karakter pertama.",
          },
          {
            name: "character2",
            label: "Karakter 2",
            type: "textarea",
            placeholder:
              "e.g., 'Optimis: Seorang ilmuwan yang antusias dan visioner.'",
            info: "Deskripsikan nama, peran, dan sudut pandang karakter kedua.",
          },
          {
            name: "setting",
            label: "Latar (Setting)",
            type: "text",
            placeholder: "e.g., 'Di sebuah observatorium pada malam hari.'",
            info: "Di mana dan kapan dialog ini terjadi?",
          },
          {
            name: "keyPoints",
            label: "Poin Kunci yang Harus Muncul",
            type: "textarea",
            placeholder:
              "e.g., 'Singularitas, gravitasi, cakrawala peristiwa (event horizon)..'",
            info: "Konsep atau argumen penting yang harus dibahas dalam dialog.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Historical Figure": {
        description:
          "Minta AI untuk berperan sebagai tokoh sejarah dan menjawab pertanyaan dari sudut pandang mereka.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Sejarawan Berbicara yang akan mengadopsi persona tokoh sejarah dan menjawab pertanyaan.",
        components: [
          {
            name: "figure",
            label: "Tokoh Sejarah",
            type: "text",
            placeholder: "e.g., 'Leonardo da Vinci', 'Cleopatra'",
            info: "Pilih tokoh sejarah yang persona dan pengetahuannya diketahui.",
          },
          {
            name: "question",
            label: "Pertanyaan untuk Tokoh Tersebut",
            type: "textarea",
            placeholder:
              "e.g., 'Apa penemuan Anda yang paling membanggakan dan mengapa?'",
            info: "Ajukan pertanyaan yang relevan dengan kehidupan dan zaman tokoh tersebut.",
          },
          {
            name: "context",
            label: "Konteks Tambahan",
            type: "textarea",
            placeholder:
              "e.g., 'Jawab dengan gaya bahasa yang sesuai dengan abad ke-15. Pertahankan persona Anda sepanjang jawaban.'",
            info: "Instruksi untuk menjaga keaslian persona.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Hero's Journey": {
        description:
          "Rancang narasi atau cerita brand menggunakan struktur klasik Perjalanan Pahlawan (Monomyth).",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pencerita Brand yang akan merancang narasi atau cerita brand.",
        components: [
          {
            name: "hero",
            label: "Sang Pahlawan (Pelanggan Anda)",
            type: "text",
            placeholder: "e.g., 'Seorang pemilik usaha kecil yang berjuang.'",
            info: "Siapa protagonis dari cerita ini?",
          },
          {
            name: "ordinaryWorld",
            label: "Dunia Biasa (The Ordinary World)",
            type: "textarea",
            placeholder:
              "e.g., 'Dia terjebak dalam pekerjaan administratif yang memakan waktu.'",
            info: "Kehidupan normal sang pahlawan sebelum petualangan dimulai.",
          },
          {
            name: "callToAdventure",
            label: "Panggilan untuk Bertualang (Call to Adventure)",
            type: "textarea",
            placeholder:
              "e.g., 'Dia menyadari bahwa dia kehilangan peluang besar karena tidak efisien.'",
            info: "Masalah atau peluang yang mengganggu status quo.",
          },
          {
            name: "mentorAndTalisman",
            label: "Mentor & Benda Ajaib (Produk Anda)",
            type: "textarea",
            placeholder:
              "e.g., 'Dia menemukan software otomatisasi kami (mentor/benda ajaib) yang menjanjikan solusi.'",
            info: "Bagaimana produk Anda muncul untuk membantu sang pahlawan?",
          },
          {
            name: "trialsAndTriumphs",
            label: "Ujian & Kemenangan (Trials & Triumphs)",
            type: "textarea",
            placeholder:
              "e.g., 'Dia belajar menggunakan software, mengatasi keraguan, dan mulai melihat hasil positif.'",
            info: "Tantangan yang dihadapi dan diatasi dengan bantuan produk Anda.",
          },
          {
            name: "returnWithElixir",
            label: "Kembali dengan Ramuan (Return with the Elixir)",
            type: "textarea",
            placeholder:
              "e.g., 'Bisnisnya sekarang berkembang pesat, dan dia memiliki kebebasan untuk menjadi strategis.'",
            info: "Transformasi akhir dan kesuksesan yang dicapai oleh pahlawan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Socratic Method": {
        description:
          "Gunakan metode bertanya ala Socrates untuk mengeksplorasi sebuah topik secara mendalam dan kritis.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Filsuf yang akan menggunakan metode bertanya ala Socrates.",
        components: [
          {
            name: "topic",
            label: "Topik atau Pernyataan Awal",
            type: "text",
            placeholder:
              "e.g., 'Apa itu keadilan?', 'Media sosial membuat kita lebih terhubung.'",
            info: "Konsep atau keyakinan yang akan dieksplorasi.",
          },
          {
            name: "aiRole",
            label: "Peran AI",
            type: "text",
            placeholder: "e.g., 'Bertindak sebagai Socrates.'",
            info: "Minta AI untuk mengambil peran sebagai penanya yang kritis.",
          },
          {
            name: "myRole",
            label: "Peran Saya",
            type: "text",
            placeholder: "e.g., 'Saya akan menjadi murid Anda.'",
            info: "Posisikan diri Anda sebagai orang yang akan menjawab pertanyaan AI.",
          },
          {
            name: "instruction",
            label: "Instruksi",
            type: "textarea",
            placeholder:
              "e.g., 'Tanggapi pernyataan awal saya, lalu ajukan pertanyaan yang menantang asumsi saya. Lanjutkan dialog ini selama beberapa putaran.'",
            info: "Pandu proses dialog Socrates.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Style Transfer": {
        description:
          "Tulis ulang sebuah teks dengan meniru gaya penulisan dari sumber lain (penulis, publikasi, dll.).",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Peniru Gaya yang akan menulis ulang teks dengan meniru gaya penulisan.",
        components: [
          {
            name: "originalText",
            label: "Teks Asli",
            type: "textarea",
            placeholder: "Tempelkan teks yang ingin Anda ubah gayanya di sini.",
            info: "Konten yang akan diadaptasi.",
          },
          {
            name: "styleSource",
            label: "Sumber Gaya Penulisan",
            type: "text",
            placeholder:
              "e.g., 'Ernest Hemingway', 'Majalah The Economist', 'Seorang anak usia 5 tahun'",
            info: "Gaya siapa atau apa yang ingin Anda tiru?",
          },
          {
            name: "keyElementsToKeep",
            label: "Elemen Kunci yang Harus Dipertahankan",
            type: "textarea",
            placeholder:
              "e.g., 'Pertahankan semua data dan angka. Jangan ubah nama produk.'",
            info: "Informasi penting dari teks asli yang tidak boleh hilang.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      Metaphor: {
        description:
          "Jelaskan konsep yang kompleks atau abstrak dengan menggunakan metafora atau analogi yang mudah dipahami.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Ahli Metafora yang akan menjelaskan konsep kompleks atau abstrak menggunakan metafora atau analogi.",
        components: [
          {
            name: "complexConcept",
            label: "Konsep Kompleks",
            type: "text",
            placeholder: "e.g., 'Blockchain', 'Machine Learning', 'Inflasi'",
            info: "Topik sulit yang perlu disederhanakan.",
          },
          {
            name: "targetAudience",
            label: "Target Audiens",
            type: "text",
            placeholder: "e.g., 'Siswa SMA', 'Manajer non-teknis', 'Anak-anak'",
            info: "Siapa yang akan membaca penjelasan ini?",
          },
          {
            name: "numberOfMetaphors",
            label: "Jumlah Opsi Metafora",
            type: "number",
            placeholder: "e.g., 3",
            info: "Berapa banyak ide metafora yang ingin Anda hasilkan?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      SceneCraft: {
        description:
          "Bangun sebuah adegan untuk cerita atau skenario dengan mendeskripsikan lingkungan, karakter, dan dialog.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Perancang Adegan yang akan membangun sebuah adegan yang detail untuk cerita atau skenario.",
        components: [
          {
            name: "setting",
            label: "Latar (Setting)",
            type: "textarea",
            placeholder:
              "e.g., 'Sebuah kafe remang-remang di Paris saat hujan. Bau kopi dan roti panggang terasa di udara.'",
            info: "Deskripsikan tempat, waktu, dan suasana adegan.",
          },
          {
            name: "characters",
            label: "Karakter dalam Adegan",
            type: "textarea",
            placeholder:
              "e.g., 'ELARA (30-an), seorang seniman yang cemas, memegang cangkir teh. JAVIER (40-an), tenang dan misterius, membaca buku.'",
            info: "Siapa saja yang ada di adegan itu dan apa yang mereka lakukan?",
          },
          {
            name: "plotPoint",
            label: "Poin Plot atau Tujuan Adegan",
            type: "textarea",
            placeholder:
              "e.g., 'Elara harus memberanikan diri untuk berbicara dengan Javier dan menanyakan tentang simbol misterius yang terus muncul dalam mimpinya.'",
            info: "Apa tujuan atau peristiwa penting yang harus terjadi dalam adegan ini?",
          },
          {
            name: "dialoguePrompt",
            label: "Pemicu Dialog",
            type: "textarea",
            placeholder:
              "e.g., 'Mulai dengan Elara yang menjatuhkan sendoknya, menarik perhatian Javier.'",
            info: "Bagaimana percakapan atau interaksi dimulai?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
    },
    "Refleksi & Peningkatan Prompt": {
      "Prompt Critique": {
        description:
          "Minta AI untuk menganalisis dan memberikan umpan balik tentang prompt Anda sendiri untuk memperbaikinya.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Kritikus Prompt yang akan menganalisis prompt dan memberikan umpan balik konstruktif.",
        components: [
          {
            name: "originalPrompt",
            label: "Prompt yang Akan Dikritik",
            type: "textarea",
            placeholder: "e.g., 'Tulis tentang anjing.'",
            info: "Tempelkan prompt awal Anda di sini.",
          },
          {
            name: "goal",
            label: "Tujuan Awal Prompt",
            type: "textarea",
            placeholder:
              "e.g., 'Saya ingin mendapatkan artikel blog yang menarik tentang sejarah anjing domestik.'",
            info: "Apa hasil yang sebenarnya Anda harapkan dari prompt tersebut?",
          },
          {
            name: "critiqueCriteria",
            label: "Kriteria Kritik",
            type: "textarea",
            placeholder:
              "e.g., 'Analisis kejelasan, kekhususan, dan informasi konteks yang hilang. Berikan saran untuk perbaikan.'",
            info: "Aspek apa dari prompt yang harus dievaluasi oleh AI?",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Self-Correction": {
        description:
          "Minta AI untuk menghasilkan respons awal, lalu mengkritik dan memperbaikinya sendiri dalam satu prompt.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pelatih AI yang akan melakukan proses self-correction untuk meningkatkan kualitas dan akurasi respons.",
        components: [
          {
            name: "task",
            label: "Tugas Awal",
            type: "textarea",
            placeholder:
              "e.g., 'Buat paragraf pembuka untuk cerita fantasi tentang naga.'",
            info: "Tugas utama yang harus diselesaikan.",
          },
          {
            name: "correctionInstruction",
            label: "Instruksi untuk Koreksi Diri",
            type: "textarea",
            placeholder:
              "e.g., 'Setelah Anda menulis draf pertama, identifikasi 3 kelemahan (misalnya, klise, kurang deskriptif) dan tulis ulang paragraf tersebut untuk memperbaikinya.'",
            info: "Pandu AI tentang bagaimana cara mengevaluasi dan memperbaiki pekerjaannya sendiri.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "APE (Author, Publisher, Editor)": {
        description:
          "Metode multi-langkah di mana AI berperan sebagai Penulis, Penerbit, dan Editor untuk menyempurnakan teks.",
        toolType: "planning",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Editor Multi-Tahap yang akan menerapkan metode APE untuk menyempurnakan teks.",
        components: [
          {
            name: "topic",
            label: "Topik Teks",
            type: "text",
            placeholder: "e.g., 'Manfaat meditasi untuk produktivitas.'",
            info: "Topik utama yang akan ditulis.",
          },
          {
            name: "authorPrompt",
            label: "Prompt untuk Penulis (Author)",
            type: "textarea",
            placeholder:
              "e.g., 'Tulis draf artikel 500 kata tentang topik ini. Fokus pada aliran ide dan konten yang kaya.'",
            info: "Langkah 1: Minta AI untuk menghasilkan draf awal.",
          },
          {
            name: "publisherPrompt",
            label: "Prompt untuk Penerbit (Publisher)",
            type: "textarea",
            placeholder:
              "e.g., 'Tinjau draf. Apakah ini menarik untuk audiens target (profesional muda)? Buat judul yang menarik dan periksa keterbacaan.'",
            info: "Langkah 2: Minta AI untuk meninjau dari sudut pandang audiens dan daya tarik.",
          },
          {
            name: "editorPrompt",
            label: "Prompt untuk Editor",
            type: "textarea",
            placeholder:
              "e.g., 'Periksa draf untuk kesalahan tata bahasa, ejaan, dan gaya. Pertajam kalimat dan pastikan alurnya logis.'",
            info: "Langkah 3: Minta AI untuk melakukan penyuntingan teknis.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Summarization Constraints": {
        description:
          "Kontrol output ringkasan dengan memberikan batasan yang jelas pada panjang, format, dan fokus.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Spesialis Ringkasan yang akan meringkas teks dengan menerapkan batasan yang ketat.",
        components: [
          {
            name: "textToSummarize",
            label: "Teks yang Akan Diringkas",
            type: "textarea",
            placeholder: "Tempelkan artikel atau dokumen panjang di sini.",
            info: "Sumber konten yang akan diringkas.",
          },
          {
            name: "lengthConstraint",
            label: "Batasan Panjang",
            type: "text",
            placeholder:
              "e.g., 'Tidak lebih dari 100 kata', 'Dalam 3 poin utama', 'Tepat 1 kalimat'",
            info: "Seberapa panjang atau pendek ringkasan yang Anda inginkan?",
          },
          {
            name: "formatConstraint",
            label: "Batasan Format",
            type: "text",
            placeholder:
              "e.g., 'Format sebagai daftar bernomor', 'Harus berupa paragraf'",
            info: "Bagaimana struktur output yang diinginkan?",
          },
          {
            name: "focusConstraint",
            label: "Batasan Fokus",
            type: "textarea",
            placeholder:
              "e.g., 'Hanya fokus pada dampak ekonomi. Abaikan aspek sejarah.'",
            info: "Bagian atau tema apa dari teks asli yang harus diprioritaskan atau diabaikan?",
          },
        ],
      },
    },
    "Utilitas & Format Khusus": {
      "JSON Formatter": {
        description:
          "Ubah data tidak terstruktur atau teks biasa menjadi format JSON yang bersih dan valid.",
        toolType: "code",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pemformat Data yang akan mengonversi data tidak terstruktur menjadi format JSON yang bersih dan valid.",
        components: [
          {
            name: "unstructuredData",
            label: "Data Tidak Terstruktur",
            type: "textarea",
            placeholder:
              "e.g., 'Nama: John Doe, Usia: 30, Pekerjaan: Developer. Kontak - Email: john@example.com, Telepon: 12345.'",
            info: "Tempelkan teks, daftar, atau data mentah yang ingin Anda konversi.",
          },
          {
            name: "schemaHint",
            label: "Petunjuk Skema (Opsional)",
            type: "textarea",
            placeholder:
              "e.g., 'Buat objek utama dengan kunci: nama, usia, pekerjaan. Kontak harus menjadi objek bersarang.'",
            info: "Berikan petunjuk tentang bagaimana struktur JSON yang Anda inginkan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Text to Table": {
        description:
          "Ekstrak informasi dari teks dan sajikan dalam format tabel yang rapi.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Konverter Data yang akan mengekstrak informasi dari teks sumber dan menyajikannya dalam format tabel yang rapi.",
        components: [
          {
            name: "sourceText",
            label: "Teks Sumber",
            type: "textarea",
            placeholder:
              "Tempelkan paragraf atau teks yang berisi data di sini.",
            info: "Teks yang akan dianalisis.",
          },
          {
            name: "columns",
            label: "Nama Kolom Tabel (pisahkan koma)",
            type: "text",
            placeholder: "e.g., 'Nama Produk, Harga, Ketersediaan'",
            info: "Definikan kolom-kolom yang Anda inginkan untuk tabel.",
          },
          {
            name: "extractionInstruction",
            label: "Instruksi Ekstraksi",
            type: "textarea",
            placeholder:
              "e.g., 'Ekstrak semua produk yang disebutkan beserta harga dan status ketersediaan.'",
            info: "Panduan untuk AI tentang cara menemukan dan memformat data.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
      "Fill in the Blanks": {
        description:
          "Buat template teks dengan bagian kosong, lalu minta AI untuk mengisinya berdasarkan konteks.",
        toolType: "text",
        ai_logic_description:
          "Persona AI: Anda adalah seorang Pengisi Template yang akan mengisi bagian kosong dalam template teks berdasarkan konteks yang diberikan.",
        components: [
          {
            name: "templateText",
            label: "Teks Template dengan Bagian Kosong",
            type: "textarea",
            placeholder:
              "e.g., 'Hari ini saya merasa [PERASAAN] karena saya baru saja menyelesaikan [TUGAS]. Rencana saya selanjutnya adalah [RENCANA].'",
            info: "Gunakan tanda kurung siku atau simbol lain untuk menandai bagian yang kosong.",
          },
          {
            name: "context",
            label: "Konteks untuk Mengisi Bagian Kosong",
            type: "textarea",
            placeholder:
              "e.g., 'Konteks: Saya seorang programmer yang baru saja berhasil men-debug kode yang sulit selama 3 hari. Saya ingin merayakaninya dengan bersantai.'",
            info: "Berikan informasi latar belakang agar AI dapat mengisi bagian kosong secara relevan.",
          },
          {
            name: "additionalContext",
            label: "Konteks Tambahan & Instruksi Khusus",
            type: "textarea",
            placeholder:
              "Contoh: Berikan batasan atau instruksi spesifik untuk memandu AI.",
            info: "Sebutkan batasan, gaya penulisan spesifik, atau informasi latar yang penting untuk dipahami AI.",
          },
        ],
      },
    },
  },
};
exports.PROGRAMMING_LANGUAGES = {
  text: [
    "Python",
    "JavaScript",
    "Java",
    "C++",
    "Go",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "TypeScript",
    "Rust",
    "Shell Script",
    "R",
    "MATLAB",
    "Perl",
    "Lua",
    "Dart",
    "C#",
    "Scala",
    "Haskell",
    "Elixir",
    "Clojure",
    "F#",
    "Erlang",
    "Julia",
    "Groovy",
    "Objective-C",
    "Assembly",
    "VBA",
    "SQL",
    "HTML",
    "CSS",
    "XML",
    "JSON",
    "YAML",
    "Markdown",
    "Bash",
    "PowerShell",
    "Batch",
    "Dockerfile",
    "Terraform",
    "Solidity",
    "Verilog",
    "VHDL",
    "GDScript",
    "GLSL",
    "HLSL",
    "Cg",
    "OpenCL",
    "CUDA",
    "WebAssembly",
    "Lisp",
    "Prolog",
    "Scheme",
    "Smalltalk",
    "COBOL",
    "Fortran",
    "Pascal",
    "Ada",
    "PL/SQL",
    "Transact-SQL",
    "ABAP",
    "Apex",
    "Visual Basic",
    "Delphi",
    "ActionScript",
    "ColdFusion",
    "ASP",
    "JSP",
    "E.g., Python",
  ],
  code: [
    "Python",
    "JavaScript",
    "TypeScript",
    "Java",
    "C++",
    "Go",
    "C#",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Rust",
    "Shell Script",
    "SQL",
    "HTML",
    "CSS",
    "XML",
    "JSON",
    "YAML",
    "Markdown",
    "Bash",
    "PowerShell",
    "Batch",
    "Dockerfile",
    "Terraform",
    "Solidity",
    "Verilog",
    "VHDL",
    "GDScript",
    "GLSL",
    "HLSL",
    "Cg",
    "OpenCL",
    "CUDA",
    "WebAssembly",
    "Lisp",
    "Prolog",
    "Scheme",
    "Smalltalk",
    "COBOL",
    "Fortran",
    "Pascal",
    "Ada",
    "PL/SQL",
    "Transact-SQL",
    "ABAP",
    "Apex",
    "Visual Basic",
    "Delphi",
    "ActionScript",
    "ColdFusion",
    "ASP",
    "JSP",
    "E.g., Python",
  ],
  music: [
    "MIDI",
    "Python (for music generation libraries)",
    "JavaScript (for web audio APIs)",
    "Max/MSP",
    "Pure Data",
    "SuperCollider",
    "Csound",
    "Chuck",
    "Faust",
    "OpenMusic",
    "Common Lisp Music",
    "Sonic Pi",
    "E.g., Python",
  ],
  image: [
    "Python (for image processing libraries)",
    "JavaScript (for canvas/WebGL)",
    "C++",
    "GLSL",
    "HLSL",
    "E.g., Python",
  ],
  planning: ["Markdown", "YAML", "JSON", "XML", "Plain Text", "E.g., Markdown"],
};
exports.AI_PLATFORMS = {
  text: [
    { name: "ChatGPT (OpenAI)", url: "https://chat.openai.com/" },
    { name: "Gemini (Google)", url: "https://gemini.google.com/" },
    { name: "Copilot (Microsoft)", url: "https://copilot.microsoft.com/" },
    { name: "Claude (Anthropic)", url: "https://claude.ai/" },
    { name: "Perplexity AI", url: "https://www.perplexity.ai/" },
    { name: "Meta AI", url: "https://www.meta.ai/" },
    { name: "Jasper", url: "https://www.jasper.ai/" },
    { name: "Copy.ai", url: "https://www.copy.ai/" },
  ],
  code: [
    { name: "DeepSeek", url: "https://chat.deepseek.com/" },
    { name: "Blackbox AI", url: "https://www.blackbox.ai/" },
    { name: "ChatGPT (OpenAI)", url: "https://chat.openai.com/" },
    { name: "Gemini (Google)", url: "https://gemini.google.com/" },
    { name: "Copilot (Microsoft)", url: "https://copilot.microsoft.com/" },
  ],
  "music-composition": [],
  "music-generation": [
    { name: "Suno AI", url: "https://suno.com/" },
    { name: "Udio", url: "https://www.udio.com/" },
  ],
  "audio-generation": [],
  "image-generation": [
    { name: "Midjourney", url: "https://www.midjourney.com/" },
    { name: "DALL-E 3 (via ChatGPT)", url: "https://chat.openai.com/" },
    { name: "Stable Diffusion", url: "https://stablediffusionweb.com/" },
  ],
  "image-editing": [],
  planning: [
    { name: "Miro", url: "https://miro.com/" },
    { name: "FigJam", url: "https://www.figma.com/figjam/" },
    { name: "ChatGPT (OpenAI)", url: "https://chat.openai.com/" },
    { name: "Gemini (Google)", url: "https://gemini.google.com/" },
  ],
  video: [],
};
exports.CATEGORY_ORDER = [
  "Gambar & Desain",
  "Audio & Musik",
  "Prompt Ringkas",
  "Prompt Proyek",
  "Koleksi & Inovasi",
  "Teks & Konten",
];
