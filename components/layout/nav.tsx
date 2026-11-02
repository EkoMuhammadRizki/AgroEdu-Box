"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, BookOpen, Cpu, ClipboardCheck, HelpCircle, User,
  LayoutDashboard, Users, Database, BookMarked, ClipboardList, BarChart3, Settings,
  Leaf, LogOut
} from "lucide-react";
import { showConfirmDialog, showSuccessAlert } from "@/lib/swal";

type NavItem = { href: string; label: string; icon: React.ElementType };

const SISWA_NAV: NavItem[] = [
  { href: "/beranda", label: "Beranda", icon: Home },
  { href: "/materi", label: "Materi", icon: BookOpen },
  { href: "/lab-iot", label: "Lab IoT", icon: Cpu },
  { href: "/misi", label: "Misi & Tugas", icon: ClipboardCheck },
  { href: "/kuis", label: "Kuis", icon: HelpCircle },
  { href: "/profil", label: "Profil", icon: User },
];

const GURU_NAV: NavItem[] = [
  { href: "/guru/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/guru/kelas", label: "Kelas", icon: Users },
  { href: "/guru/iot", label: "Data IoT", icon: Database },
  { href: "/guru/materi", label: "Materi", icon: BookMarked },
  { href: "/guru/tugas", label: "Tugas", icon: ClipboardList },
  { href: "/guru/laporan", label: "Laporan", icon: BarChart3 },
  { href: "/guru/pengaturan", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
  role: "siswa" | "guru";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = role === "siswa" ? SISWA_NAV : GURU_NAV;
  const accentClass = role === "siswa" ? "text-siswa-600" : "text-guru-600";
  const activeClass = role === "siswa" ? "bg-siswa-100 text-siswa-600" : "bg-guru-100 text-guru-600";

  const userName = role === "siswa" ? "Andi Pratama" : "Pak Eko Mulyadi";
  const userSubtitle = role === "siswa" ? "Kelas 10A · Siswa" : "Guru Pembimbing";
  const avatarLetter = role === "siswa" ? "A" : "E";

  const handleLogout = async () => {
    const result = await showConfirmDialog({
      title: "Konfirmasi Keluar",
      text: role === "siswa"
        ? "Apakah kamu yakin ingin keluar dari AgroEdu Box?"
        : "Apakah Anda yakin ingin keluar dari portal AGRO EDU TRACK?",
      icon: "warning",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      isDanger: true,
      role,
    });

    if (result.isConfirmed) {
      await showSuccessAlert(
        "Berhasil Keluar",
        role === "siswa"
          ? "Kamu telah berhasil keluar. Semangat belajar kembali nanti!"
          : "Anda telah keluar dari sesi guru.",
        1200
      );
      if (role === "siswa") {
        router.push("/login");
      } else {
        router.push("/guru/login");
      }
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-52 min-h-dvh bg-surface-muted border-r border-line p-3 gap-2 fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-4 mb-1">
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${role === "siswa" ? "bg-siswa-100" : "bg-guru-100"}`}>
          <Leaf className={`h-4 w-4 ${accentClass}`} />
        </div>
        <div>
          <p className={`text-xs font-extrabold tracking-tight leading-none ${accentClass}`}>AGRO EDU</p>
          <p className="text-[10px] text-ink-muted font-medium leading-none mt-0.5">BOX</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto scrollbar-thin">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? activeClass
                  : "text-ink-muted hover:bg-line/40 hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User Card & Logout Button */}
      <div className="pt-2 border-t border-line space-y-2">
        {/* Info Akun */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-surface border border-line">
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs ${
            role === "siswa" ? "bg-siswa-100 text-siswa-700" : "bg-guru-100 text-guru-700"
          }`}>
            {avatarLetter}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-ink truncate">{userName}</p>
            <p className="text-[10px] text-ink-muted truncate">{userSubtitle}</p>
          </div>
        </div>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-transparent hover:border-rose-200 transition-all duration-150 cursor-pointer"
          title="Keluar dari akun"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Keluar (Logout)</span>
        </button>

        {/* Role badge kecil */}
        <div className="px-1 text-center">
          <p className="text-[9px] uppercase tracking-widest text-ink-muted/80 font-semibold">
            {role === "siswa" ? "Area Siswa" : "AGRO EDU TRACK"}
          </p>
        </div>
      </div>
    </aside>
  );
}

interface BottomNavProps {
  role: "siswa" | "guru";
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = role === "siswa" ? SISWA_NAV : GURU_NAV.slice(0, 5);
  const activeClass = role === "siswa" ? "text-siswa-600" : "text-guru-600";

  const handleLogout = async () => {
    const result = await showConfirmDialog({
      title: "Konfirmasi Keluar",
      text: role === "siswa"
        ? "Apakah kamu yakin ingin keluar dari AgroEdu Box?"
        : "Apakah Anda yakin ingin keluar dari portal AGRO EDU TRACK?",
      icon: "warning",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      isDanger: true,
      role,
    });

    if (result.isConfirmed) {
      await showSuccessAlert(
        "Berhasil Keluar",
        role === "siswa"
          ? "Kamu telah berhasil keluar. Semangat belajar kembali nanti!"
          : "Anda telah keluar dari sesi guru.",
        1200
      );
      if (role === "siswa") {
        router.push("/login");
      } else {
        router.push("/guru/login");
      }
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line">
      <div className="flex items-center">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-[10px] font-medium transition-colors duration-150 ${
                isActive ? activeClass : "text-ink-muted"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 1.75} />
              <span className="leading-none text-[9px]">{label}</span>
            </Link>
          );
        })}

        {/* Tombol Logout di Bottom Nav Mobile */}
        <button
          onClick={handleLogout}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-[10px] font-medium text-rose-500 hover:text-rose-600 transition-colors duration-150 cursor-pointer"
          title="Keluar"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          <span className="leading-none text-[9px]">Keluar</span>
        </button>
      </div>
    </nav>
  );
}
