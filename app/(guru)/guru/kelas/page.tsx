"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockClasses, mockStudents } from "@/lib/mock-data";
import { Users, Plus, Copy, Check, ChevronRight, BookOpen, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Class } from "@/lib/types";
import { showSuccessAlert, showWarningAlert, showToast } from "@/lib/swal";

export default function GuruKelasPage() {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCode, setNewClassCode] = useState("");

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyCode = async (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    await showToast(`Kode kelas ${code} disalin ke clipboard!`, "success", 1500);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !newClassCode.trim()) {
      await showWarningAlert("Data Tidak Lengkap", "Silakan masukkan nama kelas dan kode masuk kelas.");
      return;
    }

    const newClass: Class = {
      id: `kelas-${classes.length + 1}`,
      name: newClassName.trim(),
      code: newClassCode.trim().toUpperCase(),
      teacherId: "guru-1",
      studentCount: 0,
    };

    setClasses([...classes, newClass]);
    setNewClassName("");
    setNewClassCode("");
    setShowAddModal(false);
    await showSuccessAlert("Kelas Berhasil Ditambahkan!", `Kelas ${newClass.name} (${newClass.code}) berhasil dibuat.`, 1600);
  };

  return (
    <AppShell role="guru">
      <PageHeader
        title="Kelola Kelas"
        description="Kelola kelas agribisnis, pantau kode masuk kelas, dan kelola partisipasi siswa."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs gap-1.5 inline-flex items-center"
          >
            <Plus className="h-4 w-4" />
            Tambah Kelas
          </button>
        }
      />

      <ContentWrapper className="space-y-6 pb-8">
        {/* Ringkasan & Pencarian */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="search"
              placeholder="Cari kelas atau kode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span>Total: <strong className="text-ink">{classes.length} Kelas</strong></span>
            <span>·</span>
            <span>Total Siswa: <strong className="text-ink">{classes.reduce((acc, c) => acc + c.studentCount, 0)} Siswa</strong></span>
          </div>
        </div>

        {/* Modal Tambah Kelas */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-surface rounded-2xl border border-line shadow-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-ink">Tambah Kelas Baru</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-ink-muted hover:text-ink text-sm p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-ink block mb-1">Nama Kelas</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kelas 10C – Agribisnis"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink block mb-1">Kode Kelas (Untuk Siswa Masuk)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: AGRO10C"
                    value={newClassCode}
                    onChange={(e) => setNewClassCode(e.target.value.toUpperCase())}
                    className="input-field text-xs uppercase font-mono"
                  />
                  <p className="text-[11px] text-ink-muted mt-1">
                    Kode ini dibagikan kepada siswa agar otomatis terdaftar ke kelas ini.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary text-xs"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn-primary text-xs">
                    Simpan Kelas
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Grid Kartu Kelas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((cls) => {
            return (
              <div
                key={cls.id}
                className="card flex flex-col justify-between hover:border-[var(--accent)] hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2.5 rounded-xl bg-guru-100 text-guru-700">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    {/* Copy Kode Kelas */}
                    <button
                      onClick={() => handleCopyCode(cls.code)}
                      title="Salin kode kelas"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-surface-muted border border-line hover:border-[var(--accent)] transition-all"
                    >
                      {copiedCode === cls.code ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-ink-muted" />
                          <span>{cls.code}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-ink leading-tight">{cls.name}</h3>
                    <p className="text-xs text-ink-muted mt-1 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span>{cls.studentCount} Siswa terdaftar</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-line/60 grid grid-cols-2 gap-2 text-[11px] text-ink-muted">
                    <div>
                      <span className="block text-ink font-semibold">Box 1, Box 2</span>
                      <span>Perangkat IoT aktif</span>
                    </div>
                    <div>
                      <span className="block text-ink font-semibold">2 Misi Aktif</span>
                      <span>Tugas semester</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-line flex items-center justify-between">
                  <span className="text-xs text-ink-muted font-medium">Semester Genap 2026</span>
                  <Link
                    href={`/guru/kelas/${cls.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:underline"
                  >
                    Buka Kelas
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
