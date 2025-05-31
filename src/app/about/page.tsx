"use client";
import React from "react";
import ResponsiveHeader from "@/components/currency/Header";
import { User, Target, Award, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <ResponsiveHeader />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            Tentang Kami
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Kami adalah tim yang berdedikasi untuk memberikan solusi terbaik dan
            pengalaman luar biasa bagi setiap klien yang bekerja sama dengan
            kami.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              500+
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Klien Puas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              1000+
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Proyek Selesai</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              5+
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Tahun Pengalaman</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Cerita Kami
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Dimulai dari sebuah visi sederhana untuk memberikan solusi
                teknologi yang mudah diakses dan bermanfaat bagi semua orang.
                Kami percaya bahwa teknologi harus melayani manusia, bukan
                sebaliknya.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Dengan tim yang berpengalaman dan semangat inovasi yang tinggi,
                kami terus berkembang untuk memberikan yang terbaik bagi
                klien-klien kami.
              </p>
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <Heart className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  Dibuat dengan dedikasi tinggi
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl h-80 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold">Tim Passionate</h3>
                  <p className="mt-2 opacity-90">Bekerja dengan hati</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-12">
            Nilai-Nilai Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group-hover:-translate-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Fokus</h3>
                <p className="text-gray-600 text-sm">
                  Berkonsentrasi pada hasil terbaik
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group-hover:-translate-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Kerjasama</h3>
                <p className="text-gray-600 text-sm">
                  Membangun hubungan yang kuat
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group-hover:-translate-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Inovasi</h3>
                <p className="text-gray-600 text-sm">
                  Selalu mencari solusi kreatif
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group-hover:-translate-y-2">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Passion</h3>
                <p className="text-gray-600 text-sm">
                  Bekerja dengan penuh semangat
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Siap Bekerja Sama?</h2>
          <p className="text-xl mb-8 opacity-90">
            Mari kita wujudkan proyek impian Anda bersama-sama
          </p>
          <button
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            onClick={() => {
              window.open("https://wa.me/6281234567890", "_blank");
            }}
          >
            Hubungi Kami
          </button>
        </div>
      </main>
    </div>
  );
}
