"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { showSuccessAlert, showWarningAlert } from "@/lib/swal";

export default function GuruLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      await showWarningAlert("Email Wajib Diisi", "Silakan masukkan email terdaftar akun guru Anda.");
      return;
    }
    if (!form.password) {
      setError("Kata sandi wajib diisi.");
      await showWarningAlert("Kata Sandi Wajib Diisi", "Silakan masukkan kata sandi akun guru Anda.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    await showSuccessAlert("Login Guru Berhasil!", "Selamat datang kembali di Portal AGRO EDU TRACK.", 1300);
    router.push("/guru/dashboard");
  };

  return (
    <div data-role="guru" className="min-h-dvh bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-guru-100 shadow-sm">
              <Leaf className="h-8 w-8 text-guru-600" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">AGRO EDU TRACK</h1>
            <p className="text-sm text-ink-muted mt-1">Portal Guru — AGRO EDU BOX</p>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-5 rounded-t-card" style={{ background: "#E6EEFF", color: "#1F55B8" }}>
            MASUK SEBAGAI GURU
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-ink-muted mb-1">
                Email <span className="text-[#B42318]">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input-field"
                placeholder="email@sekolah.sch.id"
                value={form.email}
                onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setError(""); }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-ink-muted mb-1">
                Kata Sandi <span className="text-[#B42318]">*</span>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                >
                  {showPass ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-[#B42318]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-ctl bg-guru-600 text-white font-semibold text-sm hover:bg-guru-700 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : "Masuk"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-muted">
          Kamu siswa?{" "}
          <a href="/login" className="text-siswa-600 font-semibold hover:underline">
            Masuk sebagai Siswa →
          </a>
        </p>
      </div>
    </div>
  );
}
