"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { Butterfly, Ladybug, SoftCloud, HillBackdrop } from "@/components/agro/decorative-nature";
import { mockClasses } from "@/lib/mock-data";
import { Check, Sparkles, ArrowRight, Star } from "lucide-react";
import { showSuccessAlert, showWarningAlert } from "@/lib/swal";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<"welcome" | "identity" | "character">("welcome");
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("kelas-1");
  const [character, setCharacter] = useState<"original" | "girl">("original");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("agro_student_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setName(parsed.name);
          if (parsed.classId) setClassId(parsed.classId);
          if (parsed.character) setCharacter(parsed.character);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleNextToCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showWarningAlert("Nama Masih Kosong", "Silakan masukkan nama panggilan atau nama lengkapmu dulu ya!");
      return;
    }
    setStep("character");
  };

  const handleCompleteLogin = async () => {
    setLoading(true);
    const selectedClass = mockClasses.find((c) => c.id === classId) || mockClasses[0];

    const studentProfile = {
      id: `siswa-${Date.now()}`,
      name: name.trim(),
      classId: selectedClass.id,
      className: selectedClass.name,
      classCode: selectedClass.code,
      character,
      stars: 120,
      registeredAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("agro_student_profile", JSON.stringify(studentProfile));
    } catch {
      // ignore
    }

    await showSuccessAlert(
      `Halo, ${name.trim()}! 🌿`,
      `Karakter ${character === "girl" ? "BiBoo Girl" : "BiBoo Original"} siap menemanimu belajar hidroponik & IoT!`,
      1500
    );

    router.push("/beranda");
  };

  return (
    <div className="relative min-h-dvh bg-gradient-to-b from-[#BFE6F7] via-[#EAF6D9] to-[#CDEBB0] flex flex-col justify-between overflow-x-hidden">
      {/* Decorative clouds */}
      <SoftCloud className="absolute top-4 left-4 w-20 sm:w-28 opacity-70" />
      <SoftCloud className="absolute top-10 right-4 w-20 sm:w-24 opacity-70" />

      {/* Top Navbar — Responsive for mobile & iPhone */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 max-w-5xl mx-auto w-full gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white shadow-card flex items-center justify-center p-1 border-2 border-green-200 flex-shrink-0">
            <span className="text-lg sm:text-xl">🌱</span>
          </div>
          <div className="min-w-0">
            <span className="font-heading font-extrabold text-base sm:text-lg text-ink-900 tracking-tight block leading-tight truncate">
              Agro-Edu Box
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-ink-600 uppercase tracking-wider hidden sm:block">
              Smart IoT Agriculture
            </span>
          </div>
        </div>

        <Link
          href="/guru/login"
          className="btn-ghost text-xs px-3 py-1.5 rounded-pill shadow-xs whitespace-nowrap flex-shrink-0"
        >
          <span className="sm:hidden">Portal Guru 🎓</span>
          <span className="hidden sm:inline">Masuk sebagai Guru →</span>
        </Link>
      </header>

      {/* Main Flow Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-2 sm:py-6">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* STEP 1: WELCOME SCREEN */}
          {step === "welcome" && (
            <div className="card-cream text-center space-y-3.5 sm:space-y-5 p-5 sm:p-7 shadow-card">
              <div className="relative pt-1">
                <BibooMascot
                  mood="wave"
                  size="lg"
                  character={character}
                  bubbleText="Halo, Petani Muda! Aku BiBoo!"
                  className="mx-auto scale-90 sm:scale-100"
                />
              </div>

              <div className="space-y-1.5">
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-ink-900 leading-snug">
                  Selamat Datang di <span className="text-green-600">Agro-Edu Box!</span>
                </h1>
                <p className="text-xs sm:text-sm text-ink-600 leading-relaxed max-w-xs mx-auto">
                  Eksplorasi seru pertanian pintar, pantau sensor tanaman secara langsung, selesaikan misi, dan raih bintang!
                </p>
              </div>

              {/* Highlights Chips */}
              <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-green-100 text-green-700 rounded-pill text-[11px] sm:text-xs font-bold border border-green-200">
                  <Sparkles className="w-3 h-3 text-yellow-500" /> Live IoT Sensor
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-yellow-300/40 text-brown-600 rounded-pill text-[11px] sm:text-xs font-bold border border-yellow-300">
                  <Star className="w-3 h-3 text-yellow-500" /> Kuis & Sertifikat
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStep("identity")}
                className="btn-primary w-full text-sm sm:text-base h-12 group cursor-pointer"
              >
                Mulai Petualanganku!
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* STEP 2: INPUT NAMA & KELAS */}
          {step === "identity" && (
            <div className="card-cream space-y-4 sm:space-y-5 p-5 sm:p-7 shadow-card">
              <div className="text-center">
                <BibooMascot
                  mood="thinking"
                  size="md"
                  character={character}
                  className="mx-auto -mt-1"
                />
                <h2 className="font-heading font-extrabold text-lg sm:text-xl md:text-2xl text-ink-900 mt-1">
                  Siapa Namamu, Petani Cilik?
                </h2>
                <p className="text-xs text-ink-600">
                  Masukkan identitasmu agar sertifikat dan misimu tersimpan rapi.
                </p>
              </div>

              <form onSubmit={handleNextToCharacter} className="space-y-3.5">
                <div>
                  <label htmlFor="student-name" className="block text-xs font-heading font-bold text-ink-600 mb-1">
                    Nama Panggilan / Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Andi Pratama"
                    className="input-field"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="class-select" className="block text-xs font-heading font-bold text-ink-600 mb-1">
                    Pilih Kelas / Kelompok <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="class-select"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="input-field bg-white cursor-pointer"
                  >
                    {mockClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep("welcome")}
                    className="btn-ghost flex-1 text-xs sm:text-sm"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-[2] text-xs sm:text-sm h-11 sm:h-12"
                  >
                    Lanjut Pilih Karakter
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: PILIH KARAKTER (ORIGINAL VS GIRL) */}
          {step === "character" && (
            <div className="card-cream space-y-4 sm:space-y-5 p-5 sm:p-7 shadow-card">
              <div className="text-center">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl md:text-2xl text-ink-900">
                  Pilih Karakter BiBoo-mu!
                </h2>
                <p className="text-xs text-ink-600">
                  Pilih teman belajar favoritmu untuk menemani petualangan.
                </p>
              </div>

              {/* Character selection cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Original Character */}
                <button
                  type="button"
                  onClick={() => setCharacter("original")}
                  className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                    character === "original"
                      ? "border-green-500 bg-green-100 shadow-card scale-102 sm:scale-105"
                      : "border-white bg-white hover:bg-green-50"
                  }`}
                >
                  <BibooMascot
                    mood="happy"
                    size="md"
                    character="original"
                    animated={character === "original"}
                  />
                  <div className="text-center">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-ink-900 block leading-tight">
                      BiBoo Original
                    </span>
                    <span className="text-[10px] text-ink-600">Tunas Ceria Hijau</span>
                  </div>
                  {character === "original" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[9px] sm:text-[10px] font-bold">
                      <Check className="w-3 h-3" /> Terpilih
                    </span>
                  )}
                </button>

                {/* Girl Character */}
                <button
                  type="button"
                  onClick={() => setCharacter("girl")}
                  className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                    character === "girl"
                      ? "border-green-500 bg-green-100 shadow-card scale-102 sm:scale-105"
                      : "border-white bg-white hover:bg-green-50"
                  }`}
                >
                  <BibooMascot
                    mood="happy"
                    size="md"
                    character="girl"
                    animated={character === "girl"}
                  />
                  <div className="text-center">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-ink-900 block leading-tight">
                      BiBoo Girl
                    </span>
                    <span className="text-[10px] text-ink-600">Bunga Merah Muda</span>
                  </div>
                  {character === "girl" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[9px] sm:text-[10px] font-bold">
                      <Check className="w-3 h-3" /> Terpilih
                    </span>
                  )}
                </button>
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep("identity")}
                  className="btn-ghost flex-1 text-xs sm:text-sm"
                >
                  Ganti Nama
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleCompleteLogin}
                  className="btn-secondary flex-[2] text-ink-900 text-xs sm:text-sm h-11 sm:h-12"
                >
                  {loading ? "Menyiapkan Lab..." : "Masuk ke Dashboard!"}
                  <Sparkles className="w-4 h-4 text-brown-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Grassy Green Hills Backdrop */}
      <HillBackdrop />
    </div>
  );
}
