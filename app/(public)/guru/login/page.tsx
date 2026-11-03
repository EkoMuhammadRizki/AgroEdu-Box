"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { showSuccessAlert, showWarningAlert } from "@/lib/swal";
import Link from "next/link";

export default function GuruLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "eko.mulyadi@sekolah.sch.id", password: "password123" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      await showWarningAlert("Email Wajib Diisi", "Silakan masukkan email guru terdaftar.");
      return;
    }
    if (!form.password) {
      setError("Kata sandi wajib diisi.");
      await showWarningAlert("Kata Sandi Wajib Diisi", "Silakan masukkan kata sandi akun guru Anda.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    await showSuccessAlert("Login Guru Berhasil! 🎓", "Selamat datang kembali di Portal AGRO EDU TRACK.", 1300);
    router.push("/guru/dashboard");
  };

  return (
    <div data-role="guru" className="min-h-dvh bg-gradient-to-b from-[#BFE6F7] via-[#EAF6D9] to-[#CDEBB0] flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-3xl bg-white shadow-card flex items-center justify-center border-2 border-blue-200">
              <span className="text-3xl">🌿</span>
            </div>
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-ink-900 tracking-tight">
              AGRO EDU TRACK
            </h1>
            <p className="text-xs text-ink-600 font-bold">Portal Guru & Bimbingan IoT</p>
          </div>
        </div>

        <div className="card-cream space-y-4 shadow-card">
          <div className="panel-header -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-2 bg-blue-200/60 border-blue-300 text-blue-500">
            MASUK SEBAGAI GURU PEMBIMBING
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-heading font-bold text-ink-600 mb-1">
                Email Guru Terdaftar <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input-field"
                placeholder="nama.guru@sekolah.sch.id"
                value={form.email}
                onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setError(""); }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-heading font-bold text-ink-600 mb-1">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  className="input-field pr-10"
                  placeholder="Masukkan kata sandi"
                  value={form.password}
                  onChange={(e) => { setForm((f) => ({ ...f, password: e.target.value })); setError(""); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-600 hover:text-ink-900"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-info w-full text-base cursor-pointer"
            >
              {loading ? "Memverifikasi..." : "Masuk ke Dashboard Guru"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-600 font-medium">
          Kamu seorang siswa?{" "}
          <Link href="/" className="text-green-700 font-heading font-extrabold hover:underline">
            Masuk bersama BiBoo →
          </Link>
        </p>
      </div>
    </div>
  );
}
