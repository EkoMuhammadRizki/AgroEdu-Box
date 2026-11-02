"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockMissions, mockSubmissions, mockStudents, missionRubric } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ArrowLeft, CheckCircle2, Clock, Send, RotateCcw,
  User, Check, AlertCircle, FileText, Database
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { showSuccessAlert, showConfirmDialog } from "@/lib/swal";

type LevelKey = "needsGuidance" | "developing" | "good";

export default function GuruPenilaianPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = (params?.id as string) || "misi-1";

  const mission = mockMissions.find((m) => m.id === missionId) || mockMissions[0];
  const submission = mockSubmissions[0]; // Andi Pratama
  const student = mockStudents.find((s) => s.id === submission.studentId) || mockStudents[0];

  // Rubric state per criteria index
  const [rubricScores, setRubricScores] = useState<Record<number, LevelKey>>({
    0: "good",
    1: "good",
    2: "developing",
    3: "good",
  });

  const [teacherNote, setTeacherNote] = useState(
    "Pengamatan visual dan pencatatan sensor sangat baik dan teliti. Pada bagian kesimpulan, coba jelaskan lebih detail bagaimana kelembapan tanah 45% berpengaruh pada laju transpirasi daun kangkung."
  );

  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  // Score calculation: good = 25 pts, developing = 18 pts, needsGuidance = 10 pts
  const pointsMap = { good: 25, developing: 18, needsGuidance: 10 };
  const currentTotal = Object.values(rubricScores).reduce((acc, lvl) => acc + pointsMap[lvl], 0);

  const handlePublishGrade = async (isRevision = false) => {
    if (isRevision) {
      const confirm = await showConfirmDialog({
        title: "Minta Siswa Revisi?",
        text: `Status laporan ${student.name} akan diubah menjadi 'Perlu Revisi' dengan umpan balik Anda.`,
        icon: "warning",
        confirmButtonText: "Ya, Minta Revisi",
        cancelButtonText: "Batal",
        role: "guru",
      });

      if (confirm.isConfirmed) {
        setSubmittedStatus("revisi");
        await showSuccessAlert("Revisi Diminta", "Catatan telah terkirim ke siswa untuk perbaikan laporan.", 1600);
        router.push("/guru/tugas");
      }
    } else {
      const confirm = await showConfirmDialog({
        title: "Terbitkan Nilai?",
        text: `Nilai akhir ${currentTotal}/100 beserta catatan guru akan dipublikasikan ke siswa ${student.name}.`,
        icon: "question",
        confirmButtonText: "Ya, Terbitkan Nilai",
        cancelButtonText: "Periksa Lagi",
        role: "guru",
      });

      if (confirm.isConfirmed) {
        setSubmittedStatus("dinilai");
        await showSuccessAlert("Nilai Berhasil Diterbitkan!", `Nilai ${currentTotal}/100 telah dikirimkan ke siswa.`, 1600);
        router.push("/guru/tugas");
      }
    }
  };

  return (
    <AppShell role="guru">
      <PageHeader
        title={`Penilaian: ${mission.title}`}
        description={`Siswa: ${student.name} · Dikumpulkan: 2 jam yang lalu (Revisi #${submission.revision})`}
        action={
          <Link href="/guru/tugas" className="btn-secondary text-xs gap-1.5 inline-flex items-center">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Tugas
          </Link>
        }
      />

      <ContentWrapper className="space-y-6 pb-12 max-w-5xl">
        {submittedStatus && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="h-4 w-4 text-emerald-600" />
            {submittedStatus === "revisi"
              ? "Status pengumpulan diubah menjadi 'Perlu Revisi'. Catatan terkirim ke siswa!"
              : `Nilai berhasil disimpan (${currentTotal}/100) dan umpan balik telah diterbitkan ke siswa!`}
          </div>
        )}

        {/* 2 Kolom: Kiri Jawaban Siswa, Kanan Rubrik Penilaian */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri: Hasil Kerja Siswa */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-guru-100 text-guru-700 flex items-center justify-center font-bold text-xs">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-ink">{student.name}</h3>
                    <p className="text-[10px] text-ink-muted">Kelas: {student.classCode}</p>
                  </div>
                </div>
                <StatusBadge status={submission.status} />
              </div>

              {/* 1. Pengamatan Visual */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  1. Catatan Pengamatan Visual
                </span>
                <div className="p-3 rounded-xl bg-surface-muted border border-line text-xs text-ink leading-relaxed">
                  {submission.observation}
                </div>
              </div>

              {/* 2. Referensi Data Sensor IoT */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  2. Bukti Data Sensor Terpilih (Timestamp)
                </span>
                <div className="p-3 rounded-xl bg-surface-muted border border-line space-y-2">
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-2 rounded-lg bg-surface border border-line">
                      <span className="block text-[10px] text-ink-muted">Suhu</span>
                      <strong className="text-xs text-ink font-mono">28.4°C</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-surface border border-line">
                      <span className="block text-[10px] text-ink-muted">Kelembapan</span>
                      <strong className="text-xs text-ink font-mono">62%</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-surface border border-line">
                      <span className="block text-[10px] text-ink-muted">Tanah</span>
                      <strong className="text-xs text-ink font-mono">45%</strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-ink-muted italic">
                    Sumber: ESP32 Box 1 · Pembacaan terekam valid
                  </p>
                </div>
              </div>

              {/* 3. Kesimpulan Ilmiah */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  3. Kesimpulan Ilmiah Siswa
                </span>
                <div className="p-3 rounded-xl bg-surface-muted border border-line text-xs text-ink leading-relaxed">
                  {submission.conclusion}
                </div>
              </div>

              {/* 4. Refleksi & Pertanyaan Lanjutan */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  4. Refleksi & Pertanyaan Lanjutan
                </span>
                <div className="p-3 rounded-xl bg-surface-muted border border-line text-xs text-ink leading-relaxed">
                  {submission.reflection}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Evaluasi Rubrik */}
          <div className="lg:col-span-7 space-y-4">
            <div className="card space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div>
                  <h3 className="text-sm font-bold text-ink">Rubrik Evaluasi Kinerja Ilmiah</h3>
                  <p className="text-xs text-ink-muted">Pilih level capaian untuk setiap kriteria pengamatan.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-ink-muted">Skor Total</span>
                  <div className="text-2xl font-black font-mono text-guru-700">{currentTotal} / 100</div>
                </div>
              </div>

              {/* Baris Rubrik */}
              <div className="space-y-4">
                {missionRubric.map((r, idx) => {
                  const currentLevel = rubricScores[idx];

                  return (
                    <div key={idx} className="p-3.5 rounded-xl border border-line bg-surface-muted/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink">
                          {idx + 1}. {r.criteria}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-guru-700">
                          {pointsMap[currentLevel]} Poin
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {/* Perlu Bimbingan */}
                        <button
                          type="button"
                          onClick={() => setRubricScores({ ...rubricScores, [idx]: "needsGuidance" })}
                          className={`p-2 rounded-xl text-left border text-[11px] transition-all ${
                            currentLevel === "needsGuidance"
                              ? "bg-amber-500/15 border-amber-500 text-amber-900 font-medium ring-1 ring-amber-500"
                              : "bg-surface border-line text-ink-muted hover:border-ink-muted"
                          }`}
                        >
                          <span className="block font-bold text-[10px] text-amber-800 uppercase mb-0.5">
                            Perlu Bimbingan (10)
                          </span>
                          <span className="leading-snug block line-clamp-3">{r.needsGuidance}</span>
                        </button>

                        {/* Berkembang */}
                        <button
                          type="button"
                          onClick={() => setRubricScores({ ...rubricScores, [idx]: "developing" })}
                          className={`p-2 rounded-xl text-left border text-[11px] transition-all ${
                            currentLevel === "developing"
                              ? "bg-sky-500/15 border-sky-500 text-sky-900 font-medium ring-1 ring-sky-500"
                              : "bg-surface border-line text-ink-muted hover:border-ink-muted"
                          }`}
                        >
                          <span className="block font-bold text-[10px] text-sky-800 uppercase mb-0.5">
                            Berkembang (18)
                          </span>
                          <span className="leading-snug block line-clamp-3">{r.developing}</span>
                        </button>

                        {/* Baik */}
                        <button
                          type="button"
                          onClick={() => setRubricScores({ ...rubricScores, [idx]: "good" })}
                          className={`p-2 rounded-xl text-left border text-[11px] transition-all ${
                            currentLevel === "good"
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-900 font-medium ring-1 ring-emerald-500"
                              : "bg-surface border-line text-ink-muted hover:border-ink-muted"
                          }`}
                        >
                          <span className="block font-bold text-[10px] text-emerald-800 uppercase mb-0.5">
                            Baik (25)
                          </span>
                          <span className="leading-snug block line-clamp-3">{r.good}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Catatan / Feedback Guru */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-ink block">
                  Umpan Balik Guru (Dapat Dibaca Siswa)
                </label>
                <textarea
                  rows={3}
                  value={teacherNote}
                  onChange={(e) => setTeacherNote(e.target.value)}
                  placeholder="Berikan saran konkret untuk pengembangan cara berpikir ilmiah siswa..."
                  className="input-field text-xs leading-relaxed"
                />
              </div>

              {/* Tombol Aksi Final */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => handlePublishGrade(true)}
                  className="btn-secondary text-xs gap-1.5 w-full sm:w-auto inline-flex items-center justify-center text-amber-800 hover:text-amber-900"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Minta Siswa Revisi
                </button>

                <button
                  type="button"
                  onClick={() => handlePublishGrade(false)}
                  className="btn-primary text-xs gap-1.5 w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Terbitkan Nilai ({currentTotal}) & Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
