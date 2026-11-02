"use client";
import { AppShell, PageHeader, ContentWrapper } from "@/components/layout/app-shell";
import { mockClasses, mockStudents, mockModules, mockMissions } from "@/lib/mock-data";
import {
  BarChart3, Download, Printer, Filter, Users,
  CheckCircle2, AlertTriangle, TrendingUp, Calendar, Send
} from "lucide-react";
import { useState } from "react";
import { showToast, showConfirmDialog, showSuccessAlert } from "@/lib/swal";

export default function GuruLaporanPage() {
  const [selectedClass, setSelectedClass] = useState("semua");
  const [selectedPeriod, setSelectedPeriod] = useState("semester");
  const [isExporting, setIsExporting] = useState(false);

  // Student analytics mock
  const [studentsNeedingSupport, setStudentsNeedingSupport] = useState([
    { name: "Fajar Nugraha", class: "Kelas 10A", issue: "Nilai kuis di bawah 65 (Skor: 60)", action: "Remedial Modul 3: Sensor IoT", contacted: false },
    { name: "Rina Kusuma", class: "Kelas 10B", issue: "Belum mengumpulkan Misi Detektif Tanaman", action: "Perlu pendampingan pengerjaan lab", contacted: false },
    { name: "Deni Saputra", class: "Kelas 10A", issue: "Tingkat kehadiran pengamatan IoT rendah (< 40%)", action: "Jadwalkan praktikum mandiri", contacted: false },
  ]);

  const handleDownloadReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csv = [
        "Nama Siswa,Kelas,Modul Selesai,Skor Rata-Rata Kuis,Status Misi,Status Rekomendasi",
        "Andi Pratama,Kelas 10A,3/4,88,Terkumpul,Sangat Baik",
        "Budi Santoso,Kelas 10A,2/4,75,Terkumpul,Baik",
        "Citra Dewi,Kelas 10A,4/4,95,Terkumpul,Sangat Baik",
        "Fajar Nugraha,Kelas 10A,1/4,60,Belum,Perlu Bimbingan Remedial",
        "Gita Permata,Kelas 10A,3/4,84,Terkumpul,Baik",
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `laporan_analitik_agroedu_${selectedPeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      showToast("Laporan analitik CSV berhasil diekspor!", "success", 1600);
    }, 400);
  };

  return (
    <AppShell role="guru">
      <PageHeader
        title="Laporan & Analitik Kelas"
        description="Evaluasi perkembangan belajar siswa, pencapaian kompetensi IoT, dan deteksi dini kebutuhan bimbingan."
        action={
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-xs gap-1.5 inline-flex items-center"
            >
              <Printer className="h-3.5 w-3.5" />
              Cetak
            </button>
            <button
              onClick={handleDownloadReport}
              disabled={isExporting}
              className="btn-primary text-xs gap-1.5 inline-flex items-center"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? "Mengunduh..." : "Ekspor CSV"}
            </button>
          </div>
        }
      />

      <ContentWrapper className="space-y-6 pb-12">
        {/* Filter Bar */}
        <div className="card flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-ink">Filter Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field text-xs py-1.5 w-auto"
            >
              <option value="semua">Semua Kelas (78 Siswa)</option>
              {mockClasses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink">Periode:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field text-xs py-1.5 w-auto"
            >
              <option value="minggu">7 Hari Terakhir</option>
              <option value="bulan">30 Hari Terakhir</option>
              <option value="semester">Semester Ini (Genap 2026)</option>
            </select>
          </div>
        </div>

        {/* Metrik Analitik Utama */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Tingkat Penyelesaian Modul</p>
            <p className="text-2xl font-extrabold text-ink mt-1">74.2%</p>
            <p className="text-[11px] text-emerald-700 mt-1">↑ +5.1% dibanding bulan lalu</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Rata-Rata Nilai Kuis</p>
            <p className="text-2xl font-extrabold text-guru-700 mt-1">81.8</p>
            <p className="text-[11px] text-ink-muted mt-1">Skala 0 – 100</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Pengumpulan Kartu Misi</p>
            <p className="text-2xl font-extrabold text-ink mt-1">86.5%</p>
            <p className="text-[11px] text-ink-muted mt-1">68 dari 78 siswa submit</p>
          </div>

          <div className="card bg-surface-muted/60">
            <p className="text-[11px] uppercase tracking-wider font-bold text-ink-muted">Praktik Telemetri Mandiri</p>
            <p className="text-2xl font-extrabold text-ink mt-1">420 Sesi</p>
            <p className="text-[11px] text-ink-muted mt-1">Akses Lab IoT siswa</p>
          </div>
        </div>

        {/* Tabel Siswa yang Membutuhkan Dukungan / Remedial */}
        <div className="card border-amber-200">
          <div className="panel-header -mx-4 -mt-4 md:-mx-5 md:-mt-5 mb-4 rounded-t-card flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            SISWA YANG MEMBUTUHKAN PENDAMPINGAN KHUSUS (EARLY WARNING)
          </div>

          <p className="text-xs text-ink-muted mb-3">
            Sistem mendeteksi siswa dengan keterlambatan pengumpulan misi atau skor evaluasi di bawah ambang ketuntasan belajar.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-line text-ink-muted uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3">Indikator Masalah</th>
                  <th className="py-2.5 px-3">Rekomendasi Tindak Lanjut</th>
                  <th className="py-2.5 px-3 text-right">Aksi Pembimbing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {studentsNeedingSupport.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-ink">{item.name}</td>
                    <td className="py-3 px-3 text-ink-muted">{item.class}</td>
                    <td className="py-3 px-3 text-amber-800 font-medium">{item.issue}</td>
                    <td className="py-3 px-3 text-guru-700 font-semibold">{item.action}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        disabled={item.contacted}
                        onClick={async () => {
                          const confirm = await showConfirmDialog({
                            title: `Kirim Bimbingan ke ${item.name}?`,
                            text: `Siswa akan menerima pemberitahuan: "${item.action}".`,
                            icon: "question",
                            confirmButtonText: "Ya, Kirim Arahan",
                            cancelButtonText: "Batal",
                            role: "guru",
                          });
                          if (confirm.isConfirmed) {
                            const updated = [...studentsNeedingSupport];
                            updated[idx].contacted = true;
                            setStudentsNeedingSupport(updated);
                            await showSuccessAlert("Arahan Terkirim!", `Pemberitahuan bimbingan telah dikirimkan ke akun ${item.name}.`, 1600);
                          }
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                          item.contacted
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                            : "btn-secondary text-guru-700 hover:bg-guru-100"
                        }`}
                      >
                        {item.contacted ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Terkirim
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Kirim Bimbingan
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ringkasan Distribusi Nilai */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card space-y-3">
            <h3 className="text-sm font-bold text-ink">Distribusi Nilai Kuis Teori & Praktik</h3>
            <div className="space-y-2 pt-1 text-xs">
              <div>
                <div className="flex justify-between text-ink-muted mb-1">
                  <span>Sangat Memuaskan (85 - 100)</span>
                  <span className="font-bold text-ink">48 Siswa (62%)</span>
                </div>
                <div className="w-full bg-line rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "62%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ink-muted mb-1">
                  <span>Cukup / Berkembang (70 - 84)</span>
                  <span className="font-bold text-ink">24 Siswa (31%)</span>
                </div>
                <div className="w-full bg-line rounded-full h-2">
                  <div className="bg-sky-600 h-2 rounded-full" style={{ width: "31%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ink-muted mb-1">
                  <span>Perlu Bimbingan (&lt; 70)</span>
                  <span className="font-bold text-amber-600">6 Siswa (7%)</span>
                </div>
                <div className="w-full bg-line rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "7%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card space-y-3">
            <h3 className="text-sm font-bold text-ink">Pencapaian Rubrik Misi Digital</h3>
            <p className="text-xs text-ink-muted">
              Rata-rata capaian 4 pilar kompetensi ilmiah dari seluruh laporan yang telah dinilai:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-surface-muted border border-line">
                <span className="text-[11px] text-ink-muted block">Pengamatan</span>
                <strong className="text-base text-ink font-mono">23.4 / 25</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-muted border border-line">
                <span className="text-[11px] text-ink-muted block">Penggunaan Data</span>
                <strong className="text-base text-ink font-mono">21.8 / 25</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-muted border border-line">
                <span className="text-[11px] text-ink-muted block">Kesimpulan</span>
                <strong className="text-base text-ink font-mono">20.5 / 25</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-muted border border-line">
                <span className="text-[11px] text-ink-muted block">Refleksi</span>
                <strong className="text-base text-ink font-mono">22.1 / 25</strong>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </AppShell>
  );
}
