"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { BrandIcon } from "@/components/agro/brand-logo";
import { Butterfly, Ladybug, SoftCloud, HillBackdrop } from "@/components/agro/decorative-nature";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { showSuccessAlert, showWarningAlert } from "@/lib/swal";
import { getStudentProfile, saveStudentProfile } from "@/lib/student-session";
import Link from "next/link";

interface KelasOption {
  id: string;
  nama: string;
  kode: string;
  jumlahSiswa: number;
}

interface SiswaOption {
  id: string;
  nama: string;
}

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<"welcome" | "kelas" | "nama">("welcome");
  const [kelasList, setKelasList] = useState<KelasOption[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<KelasOption | null>(null);
  const [siswaList, setSiswaList] = useState<SiswaOption[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [loggingInId, setLoggingInId] = useState<string | null>(null);

  useEffect(() => {
    if (getStudentProfile()) router.replace("/beranda");
  }, [router]);

  const loadList = async <T,>(url: string, onLoaded: (json: T) => void, errorMessage: string) => {
    setLoadingList(true);
    setLoadError("");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onLoaded(await res.json());
    } catch {
      setLoadError(errorMessage);
    } finally {
      setLoadingList(false);
    }
  };

  const openKelasStep = () => {
    setStep("kelas");
    loadList<{ kelas: KelasOption[] }>(
      "/api/kelas",
      (json) => setKelasList(json.kelas),
      "Daftar kelas belum bisa dimuat. Periksa internetmu lalu coba lagi."
    );
  };

  const openNamaStep = (kelas: KelasOption) => {
    setSelectedKelas(kelas);
    setSiswaList([]);
    setStep("nama");
    loadList<{ siswa: SiswaOption[] }>(
      `/api/kelas/${encodeURIComponent(kelas.id)}/siswa`,
      (json) => setSiswaList(json.siswa),
      "Daftar nama belum bisa dimuat. Periksa internetmu lalu coba lagi."
    );
  };

  const handleLogin = async (siswaId: string) => {
    setLoggingInId(siswaId);
    try {
      const res = await fetch("/api/siswa/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siswaId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { profile } = await res.json();
      saveStudentProfile(profile);

      await showSuccessAlert(`Halo, ${profile.name}! 🌿`, "Situnas siap menemanimu belajar hidroponik & IoT!", 1500);
      router.push("/beranda");
    } catch {
      setLoggingInId(null);
      showWarningAlert("Belum Bisa Masuk", "Periksa internetmu lalu ketuk namamu sekali lagi ya!");
    }
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
            <BrandIcon />
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
                  bubbleText="Halo, Petani Muda! Aku Situnas!"
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
                onClick={openKelasStep}
                className="btn-primary w-full text-sm sm:text-base h-12 group cursor-pointer"
              >
                Mulai Petualanganku!
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* STEP 2: PILIH KELAS */}
          {step === "kelas" && (
            <div className="card-cream space-y-4 sm:space-y-5 p-5 sm:p-7 shadow-card">
              <div className="text-center">
                <BibooMascot mood="thinking" size="md" className="mx-auto -mt-1" />
                <h2 className="font-heading font-extrabold text-lg sm:text-xl md:text-2xl text-ink-900 mt-1">
                  Kamu Kelas Berapa?
                </h2>
                <p className="text-xs text-ink-600">Pilih kelasmu untuk melihat daftar nama.</p>
              </div>

              {loadingList && <p className="text-center text-sm text-ink-600 py-6">Memuat daftar kelas...</p>}

              {loadError && (
                <div className="text-center space-y-2 py-4">
                  <p className="text-sm text-ink-600">{loadError}</p>
                  <button type="button" onClick={openKelasStep} className="btn-primary w-full text-sm h-11">
                    Coba Lagi
                  </button>
                </div>
              )}

              {!loadingList && !loadError && (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {kelasList.map((kelas) => (
                    <button
                      key={kelas.id}
                      type="button"
                      onClick={() => openNamaStep(kelas)}
                      className="p-4 sm:p-5 rounded-2xl border-3 border-white bg-white hover:border-green-500 hover:bg-green-50 flex flex-col items-center gap-1 transition-all cursor-pointer"
                    >
                      <span className="font-heading font-extrabold text-lg sm:text-xl text-ink-900">{kelas.nama}</span>
                      <span className="text-[11px] text-ink-600">{kelas.jumlahSiswa} siswa</span>
                    </button>
                  ))}
                </div>
              )}

              <button type="button" onClick={() => setStep("welcome")} className="btn-ghost w-full text-xs sm:text-sm">
                Kembali
              </button>
            </div>
          )}

          {/* STEP 3: PILIH NAMA, LANGSUNG MASUK */}
          {step === "nama" && selectedKelas && (
            <div className="card-cream space-y-3.5 sm:space-y-4 p-5 sm:p-7 shadow-card">
              <div className="text-center">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl md:text-2xl text-ink-900">
                  Siapa Namamu?
                </h2>
                <p className="text-xs text-ink-600">{selectedKelas.nama} · Ketuk namamu untuk masuk.</p>
              </div>

              {loadingList && <p className="text-center text-sm text-ink-600 py-6">Memuat daftar nama...</p>}

              {loadError && (
                <div className="text-center space-y-2 py-4">
                  <p className="text-sm text-ink-600">{loadError}</p>
                  <button
                    type="button"
                    onClick={() => openNamaStep(selectedKelas)}
                    className="btn-primary w-full text-sm h-11"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {!loadingList && !loadError && (
                <ul className="max-h-[45dvh] overflow-y-auto space-y-1.5 pr-1">
                  {siswaList.map((siswa) => (
                    <li key={siswa.id}>
                      <button
                        type="button"
                        disabled={loggingInId !== null}
                        onClick={() => handleLogin(siswa.id)}
                        className="w-full min-h-11 px-3.5 py-2 rounded-xl border-2 border-white bg-white hover:border-green-500 hover:bg-green-50 disabled:opacity-60 text-left text-sm font-bold text-ink-900 flex items-center justify-between gap-2 transition-all cursor-pointer"
                      >
                        <span>{siswa.nama}</span>
                        {loggingInId === siswa.id ? (
                          <span className="text-[11px] font-normal text-ink-600 flex-shrink-0">Masuk...</span>
                        ) : (
                          <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                disabled={loggingInId !== null}
                onClick={openKelasStep}
                className="btn-ghost w-full text-xs sm:text-sm"
              >
                Ganti Kelas
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Grassy Green Hills Backdrop */}
      <HillBackdrop />
    </div>
  );
}
