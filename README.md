# MoneyTalks : Platform Berbasis Web dan Mobile untuk Klasifikasi Uang Rupiah Bagi Tunanetra

![Logo MoneyTalks](https://raw.githubusercontent.com/Pragiptalrs/Capstone-MoneyTalks/main/logomoneytalks.png)
![Versi MoneyTalks](https://raw.githubusercontent.com/Pragiptalrs/Capstone-MoneyTalks/main/versimoneytalks.png)

Hai semuanya, kami dari CC25-CF104 dengan bangga mempersembahkan, MoneyTalks! Inovasi kami untuk membantu tunanetra dalam mengenali uang rupiah.

## Daftar Isi

- [Developer](#developer)
- [Tentang MoneyTalks](#tentang-moneytalks)
  - [Latar Belakang](#latar-belakang)
  - [Tujuan Proyek](#tujuan-proyek)
  - [Pembangunan dan Deploy Model](#pembangunan-dan-deploy-model)
    - [Dataset](#dataset)
    - [Membangun Model](#membangun-model)
    - [Instalasi Proyek](#instalasi-proyek)
  - [Fitur](#fitur)
  - [Screenshot](#screenshot)
- [Alur Kerja MoneyTalks](#alur-kerja-moneytalks)
- [Video Demo](#video-demo)
- [Didukung Oleh](#didukung-oleh)

## Developer

<div>
  <h3>ID Tim: CC25-CF104</h3>
  <table>
    <tr>
      <th>Student ID</th>
      <th>Nama</th>
      <th>Learning Path</th>
      <th>Profil</th>
    </tr>
    <tr>
      <td>MC312D5X0660</td>
      <td>Cloudya Filia Putri</td>
      <td>Machine Learning Engineer</td>
      <td>
        <a href="https://www.linkedin.com/in/cloudyafilia/"><img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white"></a>
      </td>
    </tr>
    <tr>
      <td>MC312D5X1762</td>
      <td>Devi Endang Pratiwi</td>
      <td>Machine Learning Engineer</td>
    <td>
        <a href="https://www.linkedin.com/in/deviendangpratiwi/"><img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white"></a>
      </td>
    </tr>
    <tr>
      <td>MC312D5X0338</td>
      <td>Pragipta Septyaningrum Larasati</td>
      <td>Machine Learning Engineer</td>
    <td>
        <a href="https://www.linkedin.com/in/pragiptaseptyaningrumlarasati/"><img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white"></a>
      </td>
    </tr>
    <tr>
      <td>FC240D5Y1027</td>
      <td>Ludgerdus Pati Hurit</td>
      <td>Front End and Back End Developer</td>
 <td>
        <a href="https://www.linkedin.com/in/ludgerdus-pati-hurit-331181266/"><img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white"></a>
      </td>
    </tr>
    <tr>
      <td>FC240D5Y1852</td>
      <td>Rekarius</td>
      <td>Front End and Back End Developer</td>
   <td>
        <a href="https://www.linkedin.com/in/rekarius/"><img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white"></a>
      </td>
    </tr>
    <tr>
      <td>FC240D5Y0975</td>
      <td>Victor Crisman Mendrofa</td>
      <td>Front End and Back End Developer</td>
 <td>
        <a href="https://www.linkedin.com/in/victor-crisman-mendrofa-1b2bba275/"><img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white"></a>
      </td>
    </tr>
  </table>
</div>

## Tentang MoneyTalks

MoneyTalks adalah aplikasi web yang memanfaatkan teknologi pengenalan gambar (image classification) dan text-to-speech untuk membantu tunanetra mengenali nominal uang secara mandiri. Fokus proyek ini adalah menciptakan solusi yang bisa digunakan dengan mudah oleh pengguna melalui kamera ponsel dan browser dengan umpan balik suara.

## Latar Belakang

Data Kementerian Kesehatan RI mencatat sekitar 1,5 persen penduduk Indonesia merupakan penyandang tunanetra. Kelompok ini kerap menjadi korban penipuan dalam transaksi keuangan. Misalnya, pada 2024 di Bandung, seorang penjual kerupuk tunanetra ditipu pembeli yang membayar Rp5.000 namun mengaku Rp50.000 [(Tribun Jabar, 2024).](https://jabar.tribunnews.com/2024/11/06/kisah-pilu-penjual-kerupuk-tunanetra-ditipu-pembeli-bayar-pakai-uang-rp-5-ribu-ngakunya-rp-50-ribu) Kasus serupa terjadi di Jakarta Timur, di mana pedagang tunanetra sering menerima uang palsu atau nominal yang salah [(Kompas, 2023).](https://megapolitan.kompas.com/read/2023/02/22/06261591/kisah-pilu-pedagang-tunanetra-kerap-ditipu-pembeli-yang-bayar-pakai-uang) Meski memiliki kebutuhan tinggi terhadap alat bantu visual, hanya sekitar 11,7% penyandang disabilitas di Indonesia yang menggunakan alat bantu penglihatan. Hal ini menunjukkan bahwa akses terhadap teknologi bantu yang layak masih sangat terbatas, baik karena faktor ekonomi, edukasi, maupun kurangnya solusi yang praktis dan mudah diakses. MoneyTalks hadir sebagai solusi berbasis teknologi inklusif yang memungkinkan tunanetra mengenali uang secara mandiri dan aman melalui klasifikasi gambar dan output suara otomatis yang dapat diakses langsung dari browser tanpa perlu bantuan orang lain.

## Tujuan Proyek

1. Membantu tunanetra mengenali nominal uang secara mandiri.
2. Mengurangi ketergantungan tunanetra terhadap pihak ketiga dalam melakukan transaksi uang tunai.
3. Meningkatkan inklusi finansial bagi penyandang tunanetra.

## Pembangunan dan Deploy Model

### Dataset

Kami menggabungkan beberapa dataset uang rupiah dari Kaggle dan menghasilkan dataset sebagai berikut.
[Dataset MoneyTalks](https://drive.google.com/file/d/1pfp23p8zYdz1zAOaEw4fEYiHFXm4ixvJ/view?usp=sharing)

### Membangun Model

Kami membangun model menggunakan TensorFlow Sequential Model setelah melakukan tahapan pra-pemrosesan data pada dataset. Model yang telah dilatih kemudian disimpan langsung dalam format SavedModel, TensorFlow.js, dan TensorFlow Lite, sehingga dapat digunakan di berbagai platform seperti web dan perangkat mobile. Setelah itu, model ini dideploy menggunakan FAST API dan Docker.
Untuk melihat detail kode yang kami gunakan, silakan klik tautan berikut:

- [Notebook MoneyTalks](https://colab.research.google.com/drive/114lNiIakORxkFqQPaWJayhMHSfSsAAwM#scrollTo=mMLZesHm5F2I)
- [Website MoneyTalks](https://money-talks-final.vercel.app/)

### Instalasi Proyek

</div>

#### Tech Stack

<div>

|                                                   **Frontend**                                                    |                                                      **AI/ML**                                                      |                                                       **Audio**                                                       |                                                  **Camera**                                                  |
| :---------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
|        ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)         | ![AI](https://img.shields.io/badge/Image_Classification-FF6B6B?style=for-the-badge&logo=tensorflow&logoColor=white) |      ![TTS](https://img.shields.io/badge/Text_to_Speech-4ECDC4?style=for-the-badge&logo=google&logoColor=white)       |    ![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)     |
|          ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)          |     ![ML](https://img.shields.io/badge/Machine_Learning-FF9500?style=for-the-badge&logo=python&logoColor=white)     | ![Speech API](https://img.shields.io/badge/Web_Speech_API-45B7D1?style=for-the-badge&logo=javascript&logoColor=white) | ![Camera](https://img.shields.io/badge/Camera_Access-96CEB4?style=for-the-badge&logo=camera&logoColor=white) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |

#### Prasyarat

- **Node.js** (versi 16+ recommended)
- **npm** atau **yarn**
- **Browser modern** dengan dukungan WebRTC

#### Quick Start

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

## Screenshots

![1](link github)

## Alur Kerja MoneyTalks

</div>

**Buka App** → **Halaman Utama** → **"Buka Halaman Deteksi Uang"** → **Halaman Deteksi** → **"Buka Kamera"** → **Kamera Aktif** → **"Mulai Deteksi Uang"** → **Arahkan Uang** → **Proses** → **Hasil Suara** → **"Tutup Kamera"** → **Selesai**

</div>

<details>
<summary><strong>Panduan Detail Step-by-Step</strong></summary>

<br>

### 1️. **Membuka Aplikasi**

```
Buka aplikasi MoneyTalks atau kunjungi website MoneyTalks
Anda akan masuk ke halaman selamat datang
```

### 2️. **Navigasi ke Halaman Deteksi**

```
Di halaman selamat datang, ucapkan: "Buka Halaman Deteksi Uang"
Sistem akan mengarahkan Anda ke halaman deteksi
```

### 3️. **Mengaktifkan Kamera**

```
Di halaman deteksi uang, ucapkan: "Buka Kamera"
Kamera akan aktif dan siap digunakan
```

### 4️. **Memulai Proses Deteksi**

```
Ucapkan: "Mulai Deteksi Uang"
Arahkan uang kertas pada kamera dengan posisi yang benar
Pastikan uang terlihat jelas dan pencahayaan cukup
```

### 5️. **Menunggu Hasil**

```
Tunggu hingga sistem selesai memproses gambar
Dengarkan output suara yang akan menyebutkan nominal uang
```

### 6️. **Menutup Aplikasi**

```
Setelah selesai, ucapkan: "Tutup Kamera"
Kamera akan tertutup dan proses deteksi berhenti
```

> **Tips Penggunaan Optimal:**
>
> - Pastikan uang kertas dalam kondisi baik dan tidak terlipat
> - Gunakan pencahayaan yang cukup untuk hasil deteksi terbaik
> - Posisikan uang tegak lurus dengan kamera
> - Tunggu sebentar setelah memberikan perintah suara

</details>

## Video Demo

Video demo penggunaan aplikasi MoneyTalks dapat dilihat melalui link berikut. [Video Panduan Penggunaan MoneyTalks](link).

## Didukung Oleh

<table>
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/Pragiptalrs/Capstone-MoneyTalks/main/logodbs.webp" alt="DBS Foundation" width="320"/><br>DBS Foundation
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/Pragiptalrs/Capstone-MoneyTalks/main/logo_dicoding.png" alt="Dicoding Indonesia" width="320"/><br>Dicoding Indonesia
    </td>
  </tr>
</table>
