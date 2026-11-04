"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, BookOpen, Cpu, ClipboardCheck, HelpCircle, User,
  LayoutDashboard, Users, Database, BookMarked, ClipboardList, BarChart3, Settings,
  LogOut, Star
} from "lucide-react";
import { showConfirmDialog, showSuccessAlert } from "@/lib/swal";
import { logoutStudent } from "@/lib/student-session";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { BrandIcon } from "@/components/agro/brand-logo";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string; shortLabel: string; icon: React.ElementType };

const SISWA_NAV: NavItem[] = [
  { href: "/beranda", label: "Beranda", shortLabel: "Beranda", icon: Home },
  { href: "/materi", label: "Materi Lab", shortLabel: "Materi", icon: BookOpen },
  { href: "/lab-iot", label: "Lab IoT", shortLabel: "Lab IoT", icon: Cpu },
  { href: "/misi", label: "Kartu Misi", shortLabel: "Misi", icon: ClipboardCheck },
  { href: "/kuis", label: "Kuis Pintar", shortLabel: "Kuis", icon: HelpCircle },
  { href: "/profil", label: "Profil & Piala", shortLabel: "Profil", icon: User },
];

const GURU_NAV: NavItem[] = [
  { href: "/guru/dashboard", label: "Dashboard", shortLabel: "Dash", icon: LayoutDashboard },
  { href: "/guru/kelas", label: "Kelola Kelas", shortLabel: "Kelas", icon: Users },
  { href: "/guru/iot", label: "Data & Sensor", shortLabel: "IoT", icon: Database },
  { href: "/guru/materi", label: "Materi Modul", shortLabel: "Materi", icon: BookMarked },
  { href: "/guru/tugas", label: "Tugas & Misi", shortLabel: "Tugas", icon: ClipboardList },
  { href: "/guru/laporan", label: "Laporan & Nilai", shortLabel: "Laporan", icon: BarChart3 },
  { href: "/guru/pengaturan", label: "Pengaturan IoT", shortLabel: "Setting", icon: Settings },
];

interface SidebarProps {
  role: "siswa" | "guru";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [studentProfile, setStudentProfile] = useState<{
    name: string;
    className: string;
    classCode: string;
    character: "original" | "girl";
    stars: number;
  }>({
    name: "",
    className: "",
    classCode: "",
    character: "original",
    stars: 120,
  });

  useEffect(() => {
    if (role === "siswa") {
      try {
        const stored = localStorage.getItem("agro_student_profile");
        if (stored) {
          const parsed = JSON.parse(stored);
          setStudentProfile((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      } catch {
        // ignore
      }
    }
  }, [role]);

  const navItems = role === "siswa" ? SISWA_NAV : GURU_NAV;

  const handleLogout = async () => {
    const result = await showConfirmDialog({
      title: "Mau Istirahat Dulu?",
      text: role === "siswa"
        ? "Progres dan bintangmu sudah tersimpan aman kok. Yakin ingin keluar?"
        : "Apakah Anda yakin ingin keluar dari portal AGRO EDU TRACK?",
      icon: "warning",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Lanjut Belajar",
      isDanger: true,
      role,
    });

    if (result.isConfirmed) {
      if (role === "siswa") await logoutStudent();
      await showSuccessAlert(
        "Sampai Jumpa!",
        role === "siswa"
          ? "Tetap rawat tanamanmu ya! Sampai ketemu lagi bersama BiBoo!"
          : "Anda telah keluar dari sesi guru.",
        1300
      );
      if (role === "siswa") {
        router.push("/");
      } else {
        router.push("/guru/login");
      }
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-dvh bg-white border-r-3 border-green-200/60 p-4 gap-3 fixed left-0 top-0 z-30 shadow-[4px_0_16px_rgba(63,155,46,0.06)]">
      {/* Logo Header */}
      <Link href={role === "siswa" ? "/beranda" : "/guru/dashboard"} className="flex items-center gap-3 px-2 py-2 mb-1 group">
        <div className="w-11 h-11 rounded-2xl bg-white border-2 border-green-300 flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
          <BrandIcon />
        </div>
        <div>
          <p className="font-heading font-extrabold text-base text-ink-900 tracking-tight leading-tight group-hover:text-green-600 transition-colors">
            Agro-Edu Box
          </p>
          <p className="text-[10px] font-bold text-ink-600 uppercase tracking-wider">
            {role === "siswa" ? "Area Petani Muda" : "AGRO EDU TRACK"}
          </p>
        </div>
      </Link>

      {/* Gamification Badges for Siswa */}
      {role === "siswa" && (
        <div className="bg-cream-50 p-3 rounded-2xl border-2 border-yellow-300/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-white shadow-xs">
              <Star className="w-4 h-4 fill-white" />
            </span>
            <div>
              <p className="text-[10px] font-bold text-ink-600 uppercase tracking-wider leading-none">Bintang</p>
              <p className="font-heading font-extrabold text-base text-ink-900 leading-tight">{studentProfile.stars} ⭐</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-pill bg-green-100 text-green-700 text-[10px] font-bold border border-green-300">
            <span className="w-2 h-2 rounded-full bg-green-500 dot-pulse" />
            IoT Aktif
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto scrollbar-thin py-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/beranda" && href !== "/guru/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-pill px-4 py-2.5 text-sm font-heading font-bold transition-all duration-150 ${
                isActive
                  ? role === "siswa"
                    ? "bg-green-500 text-white shadow-[0_4px_0_#2F7A22] translate-y-[-1px]"
                    : "bg-blue-500 text-white shadow-[0_4px_0_#2A82B8] translate-y-[-1px]"
                  : "text-ink-600 hover:bg-green-100 hover:text-ink-900"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Card & Logout */}
      <div className="pt-3 border-t-2 border-green-200/60 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-green-50 border border-green-200">
          <div className="h-9 w-9 rounded-full bg-green-200 border border-green-300 flex items-center justify-center font-heading font-extrabold text-sm text-green-700 overflow-hidden">
            {role === "siswa" ? (
              <BibooMascot mood="happy" size="sm" character={studentProfile.character} animated={false} />
            ) : (
              "E"
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading font-extrabold text-xs text-ink-900 truncate">
              {role === "siswa" ? studentProfile.name : "Pak Eko Mulyadi"}
            </p>
            <p className="text-[10px] text-ink-600 truncate font-semibold">
              {role === "siswa" ? studentProfile.classCode : "Guru Pembimbing"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-pill text-xs font-heading font-bold text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition-all cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}

interface BottomNavProps {
  role: "siswa" | "guru";
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const navItems = role === "siswa" ? SISWA_NAV : GURU_NAV.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-green-200 px-1 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),8px)] shadow-[0_-4px_16px_rgba(63,155,46,0.08)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(({ href, shortLabel, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/beranda" && href !== "/guru/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-2xl flex-1 transition-all ${
                isActive
                  ? "text-green-600 scale-105"
                  : "text-ink-600 hover:text-ink-900 opacity-75"
              }`}
            >
              <div
                className={`p-1 rounded-full transition-colors ${
                  isActive ? "bg-green-100 text-green-700 shadow-xs" : ""
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="font-heading font-bold text-[9px] sm:text-[10px] leading-tight truncate">
                {shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
