"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockModules, mockClasses } from "@/lib/mock-data";
import { ArrowLeft, Save, Plus, Trash2, Eye, Check } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { ContentStatus } from "@/lib/types";
import { showSuccessAlert, showWarningAlert } from "@/lib/swal";

export default function EditModulMateriPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = (params?.id as string) || "mod-1";

  const existing = mockModules.find((m) => m.id === moduleId) || mockModules[0];

  const [title, setTitle] = useState(existing.title);
  const [topic, setTopic] = useState(existing.topic);
  const [duration, setDuration] = useState(existing.durationMin);
  const [status, setStatus] = useState<ContentStatus>(existing.status);
  const [description, setDescription] = useState(existing.description);
  const [content, setContent] = useState(existing.content);
  const [objectives, setObjectives] = useState<string[]>(existing.objectives);
  const [newObjective, setNewObjective] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>(existing.classIds);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    setObjectives([...objectives, newObjective.trim()]);
    setNewObjective("");
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleToggleClass = (classId: string) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter((c) => c !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      await showWarningAlert("Data Tidak Lengkap", "Judul modul dan konten materi wajib diisi.");
      return;
    }
    setSavedSuccess(true);
    await showSuccessAlert(
      "Modul Berhasil Disimpan!",
      `Materi "${title}" dengan status '${status}' telah berhasil diperbarui.`,
      1600
    );
    router.push("/guru/materi");
  };

  return (
    <AppShell role="guru">
      <PageHeader
        title={moduleId === "baru" ? "Buat Modul Baru" : `Edit Modul: ${existing.title}`}
        description="Sesuaikan konten materi, tujuan pembelajaran, dan kelas sasaran."
        action={
          <Link href="/guru/materi" className="btn-secondary text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-3.5 w-3.5" />
            Batal
          </Link>
        }
      />

      <ContentWrapper className="pb-12 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          {savedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="h-4 w-4 text-emerald-600" />
              Modul berhasil disimpan dan diperbarui! Mengalihkan...
            </div>
          )}

          {/* Pengaturan Utama */}
          <div className="card space-y-4">
            <h3 className="text-sm font-bold text-ink">Informasi Umum Modul</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-ink block mb-1">Judul Modul</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Topik Pembelajaran</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Dasar-Dasar">Dasar-Dasar</option>
                  <option value="Nutrisi">Nutrisi</option>
                  <option value="Teknologi">Teknologi</option>
                  <option value="Perlindungan">Perlindungan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Durasi Belajar (Menit)</label>
                <input
                  type="number"
                  min={10}
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Status Publikasi</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContentStatus)}
                  className="input-field text-xs"
                >
                  <option value="terbit">Terbit (Dapat diakses siswa)</option>
                  <option value="draf">Draf (Hanya guru)</option>
                  <option value="diarsipkan">Diarsipkan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Kelas Sasaran</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {mockClasses.map((cls) => {
                    const isSelected = selectedClasses.includes(cls.id);
                    return (
                      <button
                        type="button"
                        key={cls.id}
                        onClick={() => handleToggleClass(cls.id)}
                        className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
                          isSelected
                            ? "bg-guru-600 text-white border-guru-600"
                            : "bg-surface border-line text-ink-muted hover:text-ink"
                        }`}
                      >
                        {cls.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-ink block mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>

          {/* Tujuan Pembelajaran */}
          <div className="card space-y-3">
            <h3 className="text-sm font-bold text-ink">Tujuan Pembelajaran</h3>
            <p className="text-xs text-ink-muted">
              Tuliskan target kompetensi yang dicapai siswa setelah mempelajari materi ini.
            </p>

            <div className="space-y-2 pt-1">
              {objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-surface-muted border border-line">
                  <span className="text-xs font-bold text-guru-700 w-6 text-center">{i + 1}.</span>
                  <span className="text-xs text-ink flex-1">{obj}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(i)}
                    className="text-ink-muted hover:text-rose-600 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Tambah butir tujuan baru..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddObjective();
                  }
                }}
                className="input-field text-xs flex-1"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="btn-secondary text-xs gap-1 inline-flex items-center"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah
              </button>
            </div>
          </div>

          {/* Konten Materi */}
          <div className="card space-y-3">
            <h3 className="text-sm font-bold text-ink">Konten Inti Pembelajaran</h3>
            <p className="text-xs text-ink-muted">
              Materi teks bacaan, instruksi, dan panduan praktikum untuk modul ini.
            </p>

            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan materi pembelajaran secara lengkap..."
              className="input-field text-xs font-sans leading-relaxed"
            />
          </div>

          {/* Aksi Form */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href={`/materi/${existing.slug}`}
              target="_blank"
              className="text-xs text-ink-muted hover:text-ink inline-flex items-center gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" />
              Pratinjau Halaman
            </Link>

            <button type="submit" className="btn-primary text-xs gap-1.5 inline-flex items-center px-5 py-2.5">
              <Save className="h-4 w-4" />
              Simpan Modul
            </button>
          </div>
        </form>
      </ContentWrapper>
    </AppShell>
  );
}
