"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, ArrowRight, Info } from "lucide-react";
import { mockClasses } from "@/lib/mock-data";
import { showSuccessAlert, showWarningAlert } from "@/lib/swal";

export default function LoginSiswaPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: "", kelas: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim()) {
      setError("Nama wajib diisi.");
      await showWarningAlert("Data Belum Lengkap", "Silakan masukkan nama lengkapmu terlebih dahulu.");
      return;
    }
    if (!form.kelas) {
      setError("Pilih kelas terlebih dahulu.");
      await showWarningAlert("Kelas Belum Dipilih", "Silakan pilih kelas agribisnis tempat kamu terdaftar.");
      return;
    }
    setLoading(true);
    // Simulate auth
    await new Promise((r) => setTimeout(r, 600));
    await showSuccessAlert("Berhasil Masuk!", `Selamat datang, ${form.nama}! Siap untuk bereksplorasi di AgroEdu Box.`, 1300);
    router.push("/beranda");
  };

  return (
    <div data-role="siswa" className="min-h-dvh bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-siswa-100 shadow-sm">
              <Leaf className="h-8 w-8 text-siswa-600" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">AGRO EDU BOX</h1>
            <p className="text-sm text-ink-muted mt-1">Platform Pembelajaran Agrikultur IoT</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card shadow-sm">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-5 rounded-t-card">
            MASUK SEBAGAI SISWA
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nama" className="block text-xs font-medium text-ink-muted mb-1">
                Nama Lengkap <span className="text-[#B42318]">*</span>
              </label>
              <input
                id="nama"
                type="text"
                autoComplete="name"
                className="input-field"
                placeholder="Masukkan nama lengkapmu"
                value={form.nama}
                onChange={(e) => { setForm((f) => ({ ...f, nama: e.target.value })); setError(""); }}
              />
            </div>

            <div>
              <label htmlFor="kelas" className="block text-xs font-medium text-ink-muted mb-1">
                Kelas <span className="text-[#B42318]">*</span>
              </label>
              <select
                id="kelas"
                className="input-field bg-surface"
                value={form.kelas}
                onChange={(e) => { setForm((f) => ({ ...f, kelas: e.target.value })); setError(""); }}
              >
                <option value="">Pilih kelas...</option>
                {mockClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code})
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-xs text-[#B42318] flex items-center gap-1">
                <Info className="h-3 w-3" strokeWidth={2} />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full gap-2"
            >
              {loading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  Mulai Belajar
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Guru link */}
        <p className="text-center text-xs text-ink-muted">
          Kamu seorang guru?{" "}
          <a href="/guru/login" className="text-guru-600 font-semibold hover:underline">
            Masuk ke AGRO EDU TRACK →
          </a>
        </p>
      </div>
    </div>
  );
}
