<div align="center">
  <h1>💰 MoneyTalks</h1>
  <p><strong>Aplikasi Web Pengenalan Uang untuk Tunanetra</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
    <img src="https://img.shields.io/badge/AI-Machine_Learning-blue?style=for-the-badge" alt="Machine Learning">
  </p>
  
  <p>
    <img src="https://img.shields.io/github/license/ludgerdusl/moneytalks?style=flat-square" alt="License">
    <img src="https://img.shields.io/github/stars/ludgerdusl/moneytalks?style=flat-square" alt="Stars">
    <img src="https://img.shields.io/github/forks/ludgerdusl/moneytalks?style=flat-square" alt="Forks">
  </p>
</div>

---

## 📋 Deskripsi

**MoneyTalks** adalah aplikasi web revolusioner yang memanfaatkan teknologi _**image classification**_ (pengenalan gambar) dan _**text-to-speech**_ (TTS) untuk membantu penyandang tunanetra mengenali nominal uang secara mandiri.

Proyek ini dirancang khusus untuk menjadi solusi yang mudah diakses dan digunakan melalui kamera ponsel dan browser, dengan umpan balik suara sebagai panduan pengguna yang intuitif.

## 🎯 Tujuan Proyek

<table>
<tr>
<td align="center">🎯<br><strong>Mandiri</strong><br>Mengenali nominal uang kertas secara mandiri</td>
<td align="center">🎤<br><strong>Intuitif</strong><br>Menggunakan teknologi suara dan kamera</td>
<td align="center">🌐<br><strong>Aksesibel</strong><br>Dapat diakses melalui browser tanpa instalasi</td>
</tr>
</table>

## ✨ Fitur Utama

<div align="center">

|              🎯 **Deteksi Real-time**               |               🎤 **Voice Command**                |          🔊 **Audio Feedback**          |               📱 **Mobile Ready**               |
| :-------------------------------------------------: | :-----------------------------------------------: | :-------------------------------------: | :---------------------------------------------: |
| Deteksi nominal uang melalui kamera secara langsung | Navigasi dan interaksi menggunakan perintah suara | Umpan balik suara melalui teknologi TTS | Antarmuka ramah disabilitas di perangkat mobile |

</div>

## 🚀 Cara Menggunakan

### 🎮 Langkah-langkah Sederhana

```mermaid
graph LR
    A[🌐 Buka Aplikasi] --> B[📸 Buka Kamera]
    B --> C[🗣️ Ucapkan 'Foto']
    C --> D[🔊 Dengar Hasil]
    D --> E[🔄 Ulangi atau Tutup]
```

<details>
<summary><strong>📋 Panduan Detail</strong></summary>

### 1️⃣ Membuka Halaman Deteksi Uang

Setelah membuka aplikasi, Anda bisa langsung mengakses halaman deteksi dengan menekan tombol atau menggunakan perintah suara.

### 2️⃣ Memulai dan Menghentikan Deteksi

- **🎥 Mengaktifkan kamera:** Ucapkan: _**"Buka Kamera"**_
- **📸 Mengambil gambar:** Ucapkan: _**"Foto"**_ untuk mendeteksi nominal uang. Sistem akan memberikan umpan balik suara dengan nominal uang yang dikenali.
  > ⚠️ **Note:** Jika gambar yang diambil bukan uang, sistem tetap memberikan deteksi gambar tetapi tanpa umpan balik suara.
- **❌ Menutup kamera:** Ucapkan: _**"Tutup Kamera"**_ untuk menghentikan proses deteksi.

</details>

## 🛠️ Tech Stack

<div align="center">

|                                                   **Frontend**                                                    |                                                      **AI/ML**                                                      |                                                       **Audio**                                                       |                                                  **Camera**                                                  |
| :---------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
|        ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)         | ![AI](https://img.shields.io/badge/Image_Classification-FF6B6B?style=for-the-badge&logo=tensorflow&logoColor=white) |      ![TTS](https://img.shields.io/badge/Text_to_Speech-4ECDC4?style=for-the-badge&logo=google&logoColor=white)       |    ![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)     |
|          ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)          |     ![ML](https://img.shields.io/badge/Machine_Learning-FF9500?style=for-the-badge&logo=python&logoColor=white)     | ![Speech API](https://img.shields.io/badge/Web_Speech_API-45B7D1?style=for-the-badge&logo=javascript&logoColor=white) | ![Camera](https://img.shields.io/badge/Camera_Access-96CEB4?style=for-the-badge&logo=camera&logoColor=white) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |                                                                                                                     |                                                                                                                       |                                                                                                              |

</div>

## 🚀 Instalasi & Pengembangan

### 📋 Prasyarat

- ✅ **Node.js** (versi 16+ recommended)
- ✅ **npm** atau **yarn**
- ✅ **Browser modern** dengan dukungan WebRTC

### ⚡ Quick Start

```bash
# 1. Clone repository
git clone https://github.com/ludgerdusl/moneytalks.git

# 2. Masuk ke direktori
cd moneytalks

# 3. Install dependencies
npm install

# 4. Jalankan aplikasi
npm run dev
```

<div align="center">
  <img src="https://img.shields.io/badge/Ready_to_Go!-28a745?style=for-the-badge&logo=rocket&logoColor=white" alt="Ready">
</div>

---

## 🤝 Kontribusi

<div align="center">

**Kami sangat menghargai kontribusi Anda!** 🌟

[![Contributors](https://img.shields.io/badge/Contributors-Welcome-brightgreen?style=for-the-badge&logo=github)](https://github.com/ludgerdusl/moneytalks/graphs/contributors)

</div>

### 🔥 Cara Berkontribusi:

- 🐛 **Bug Reports:** Laporkan bug melalui [Issues](https://github.com/ludgerdusl/moneytalks/issues)
- ✨ **Feature Requests:** Ajukan fitur baru
- 🔧 **Pull Requests:** Submit code improvements
- 📖 **Documentation:** Bantu perbaiki dokumentasi

---

## 📜 Lisensi

<div align="center">
  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Proyek ini dilisensikan di bawah [MIT License](LICENSE)**

</div>

---

## 📧 Kontak & Support

<div align="center">

### 💬 Mari Terhubung!

[![Email](https://img.shields.io/badge/Email-ludgerdusl@gmail.com-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ludgerdusl@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-ludgerdusl-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ludgerdusl)

</div>

---

<div align="center">
  <h3>🌟 Jika proyek ini membantu, jangan lupa beri ⭐ Star! 🌟</h3>
  <p><em>Dibuat dengan ❤️ untuk aksesibilitas yang lebih baik</em></p>
</div>
