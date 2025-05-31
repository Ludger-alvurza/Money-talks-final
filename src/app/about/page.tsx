"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  User,
  Target,
  Award,
  Heart,
  Sparkles,
  Zap,
  Shield,
  Rocket,
} from "lucide-react";
import ResponsiveHeader from "@/components/currency/Header";

// Custom hook untuk Intersection Observer
const useScrollAnimation = (
  threshold: number = 0.1
): [React.RefObject<HTMLElement | null>, boolean] => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

// Custom hook untuk parallax effect
const useParallax = (): number => {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
};

// Animated Counter Component
const AnimatedCounter = ({
  end,
  duration = 2000,
  isVisible,
}: {
  end: number;
  duration?: number;
  isVisible: boolean;
}) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | undefined;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [end, duration, isVisible]);

  return count;
};

// Floating Elements Component
const FloatingElements = ({ scrollY }: { scrollY: number }) => {
  // Predefined positions to avoid hydration mismatch
  const dotPositions = [
    { left: 15.5, top: 23.7, duration: 3.2, delay: 0.05 },
    { left: 67.8, top: 45.2, duration: 2.8, delay: 0.08 },
    { left: 43.1, top: 78.9, duration: 3.7, delay: 0.06 },
    { left: 82.4, top: 12.3, duration: 2.5, delay: 0.09 },
    { left: 28.9, top: 67.1, duration: 3.1, delay: 0.07 },
    { left: 91.2, top: 34.8, duration: 2.9, delay: 0.06 },
    { left: 8.7, top: 89.4, duration: 3.4, delay: 0.08 },
    { left: 56.3, top: 21.6, duration: 2.7, delay: 0.05 },
    { left: 74.1, top: 58.9, duration: 3.3, delay: 0.07 },
    { left: 19.8, top: 42.5, duration: 2.6, delay: 0.09 },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating circles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 backdrop-blur-sm"
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
            transform: `translateY(${scrollY * (0.1 + i * 0.05)}px) rotate(${
              scrollY * 0.02
            }deg)`,
            animation: `float ${3 + i}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Animated dots with predefined positions */}
      {dotPositions.map((dot, i) => (
        <div
          key={`dot-${i}`}
          className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            transform: `translateY(${scrollY * dot.delay}px)`,
            animation: `pulse ${dot.duration}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default function AdvancedAbout() {
  const scrollY = useParallax();
  const [heroRef, heroVisible] = useScrollAnimation(0.2);
  const [statsRef, statsVisible] = useScrollAnimation(0.3);
  const [storyRef, storyVisible] = useScrollAnimation(0.2);
  const [valuesRef, valuesVisible] = useScrollAnimation(0.2);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500 relative overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingElements scrollY={scrollY} />

      {/* Header dengan glassmorphism effect */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-white/20 shadow-lg">
        <ResponsiveHeader />
      </header>

      <main className="relative z-10 pt-20">
        {/* Hero Section dengan advanced parallax */}
        <section
          ref={heroRef}
          className="min-h-screen flex items-center justify-center relative"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <div
              className={`transform transition-all duration-1000 ease-out ${
                heroVisible
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-20 opacity-0 scale-95"
              }`}
            >
              <div className="mb-8 relative">
                <Sparkles className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin-slow" />
                <div className="absolute inset-0 w-16 h-16 mx-auto animate-ping bg-blue-500/20 rounded-full"></div>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Tentang Kami
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Kami adalah tim yang berdedikasi untuk memberikan solusi terbaik
                dan pengalaman luar biasa bagi setiap klien yang bekerja sama
                dengan kami.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
                  <span className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Mulai Sekarang
                  </span>
                </button>
                <button className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Stats Section dengan advanced animations */}
        <section ref={statsRef} className="py-20 relative">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              background:
                "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: User,
                  count: 500,
                  label: "Klien Puas",
                  color: "blue",
                  delay: 0,
                },
                {
                  icon: Target,
                  count: 1000,
                  label: "Proyek Selesai",
                  color: "green",
                  delay: 200,
                },
                {
                  icon: Award,
                  count: 5,
                  label: "Tahun Pengalaman",
                  color: "purple",
                  delay: 400,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 ease-out ${
                    statsVisible
                      ? "translate-y-0 opacity-100 scale-100"
                      : "translate-y-20 opacity-0 scale-95"
                  }`}
                  style={{ transitionDelay: `${stat.delay}ms` }}
                >
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-500 group border border-white/20">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}
                    >
                      <stat.icon className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-5xl font-bold text-gray-800 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      <AnimatedCounter
                        end={stat.count}
                        isVisible={statsVisible}
                      />
                      {stat.count >= 100 ? "+" : ""}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section dengan parallax dan morphism */}
        <section ref={storyRef} className="py-20 relative">
          <div
            className="absolute inset-0"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)",
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div
              className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/20 transform transition-all duration-1000 ease-out ${
                storyVisible
                  ? "translate-x-0 opacity-100 scale-100"
                  : "-translate-x-20 opacity-0 scale-95"
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <Zap className="w-8 h-8 text-yellow-500 mr-3 animate-pulse" />
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Cerita Kami
                    </h2>
                  </div>

                  <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p className="text-lg">
                      Dimulai dari sebuah visi sederhana untuk memberikan solusi
                      teknologi yang mudah diakses dan bermanfaat bagi semua
                      orang. Kami percaya bahwa teknologi harus melayani
                      manusia, bukan sebaliknya.
                    </p>

                    <p className="text-lg">
                      Dengan tim yang berpengalaman dan semangat inovasi yang
                      tinggi, kami terus berkembang untuk memberikan yang
                      terbaik bagi klien-klien kami.
                    </p>

                    <div className="flex items-center space-x-4 pt-4">
                      <div className="flex items-center text-red-500">
                        <Heart className="w-6 h-6 mr-2 animate-pulse" />
                        <span className="font-semibold">
                          Dibuat dengan dedikasi tinggi
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative transform transition-all duration-1000 ease-out delay-300 ${
                    storyVisible
                      ? "translate-x-0 opacity-100 scale-100"
                      : "translate-x-20 opacity-0 scale-95"
                  }`}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl h-80 flex items-center justify-center hover:scale-105 transition-all duration-500 shadow-2xl">
                      <div className="text-center text-white">
                        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-white/30 transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                          <Heart className="w-16 h-16 animate-bounce" />
                        </div>
                        <h3 className="text-3xl font-bold mb-2">
                          Tim Passionate
                        </h3>
                        <p className="text-xl opacity-90">
                          Bekerja dengan hati
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section dengan staggered animations */}
        <section ref={valuesRef} className="py-20 relative">
          <div
            className="absolute inset-0"
            style={{
              transform: `translateY(${scrollY * -0.1}px)`,
            }}
          >
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300/20 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div
              className={`text-center mb-16 transform transition-all duration-800 ease-out ${
                valuesVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <Shield className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-spin-slow" />
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nilai-Nilai Kami
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Prinsip-prinsip yang menjadi fondasi dalam setiap langkah
                perjalanan kami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  emoji: "🎯",
                  title: "Fokus",
                  desc: "Berkonsentrasi pada hasil terbaik dengan dedikasi penuh",
                  color: "blue",
                  delay: 0,
                },
                {
                  emoji: "🤝",
                  title: "Kerjasama",
                  desc: "Membangun hubungan yang kuat dan saling menguntungkan",
                  color: "green",
                  delay: 150,
                },
                {
                  emoji: "💡",
                  title: "Inovasi",
                  desc: "Selalu mencari solusi kreatif dan terobosan baru",
                  color: "purple",
                  delay: 300,
                },
                {
                  emoji: "❤️",
                  title: "Passion",
                  desc: "Bekerja dengan penuh semangat dan antusiasme tinggi",
                  color: "red",
                  delay: 450,
                },
              ].map((value, index) => (
                <div key={index} className="group">
                  <div
                    className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-6 group-hover:scale-105 transform border border-white/20 ${
                      valuesVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-20 opacity-0"
                    }`}
                    style={{ transitionDelay: `${value.delay}ms` }}
                  >
                    <div className="relative mb-6">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br from-${value.color}-400 to-${value.color}-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}
                      >
                        <span className="text-3xl group-hover:animate-bounce">
                          {value.emoji}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {value.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section dengan advanced effects */}
        <section ref={ctaRef} className="py-20 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div
              className={`relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl transform transition-all duration-1000 ease-out ${
                ctaVisible
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-20 opacity-0 scale-95"
              }`}
            >
              {/* Animated background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-slide"></div>
              </div>

              <div className="relative z-10">
                <Rocket className="w-16 h-16 mx-auto mb-6 animate-bounce" />
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Siap Bekerja Sama?
                </h2>
                <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                  Mari kita wujudkan proyek impian Anda bersama-sama dengan
                  solusi terbaik
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 hover:scale-110 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-lg"
                    onClick={() => {
                      window.open("https://wa.me/6281234567890", "_blank");
                    }}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      Hubungi Kami Sekarang
                    </span>
                  </button>

                  <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 hover:scale-110 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-lg">
                    <span className="inline-flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      Lihat Portfolio
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-slide {
          animation: slide 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
