"use client";
import { ReactNode, useEffect, useState } from "react";
import { Sidebar, BottomNav } from "./nav";
import { BibooMascot } from "@/components/agro/biboo-mascot";
import { Star, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { showConfirmDialog, showSuccessAlert } from "@/lib/swal";

interface AppShellProps {
  role: "siswa" | "guru";
  children: ReactNode;
}

export function AppShell({ role, children }: AppShellProps) {
  const router = useRouter();
  const [stars, setStars] = useState(120);
  const [character, setCharacter] = useState<"original" | "girl">("original");

  useEffect(() => {
    if (role === "siswa") {
      try {
        const stored = localStorage.getItem("agro_student_profile");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.stars) setStars(parsed.stars);
          if (parsed.character) setCharacter(parsed.character);
        }
      } catch {
        // ignore
      }
    }
  }, [role]);

  const handleMobileLogout = async () => {
    const result = await showConfirmDialog({
      title: "Mau Istirahat Dulu?",
      text: role === "siswa"
        ? "Progres dan bintangmu sudah tersimpan aman. Yakin ingin keluar?"
        : "Apakah Anda yakin ingin keluar dari portal AGRO EDU TRACK?",
      icon: "warning",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Lanjut",
      isDanger: true,
      role,
    });

    if (result.isConfirmed) {
      await showSuccessAlert(
        "Sampai Jumpa!",
        role === "siswa"
          ? "Sampai ketemu lagi bersama BiBoo!"
          : "Anda telah keluar dari sesi guru.",
        1200
      );
      router.push(role === "siswa" ? "/" : "/guru/login");
    }
  };

  return (
    <div data-role={role} className="min-h-dvh bg-[#F3F9EC] text-ink-900 font-body overflow-x-hidden">
      <Sidebar role={role} />

      {/* Top Header Mobile */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b-2 border-green-200 bg-white/95 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-green-100 border border-green-300 flex items-center justify-center p-0.5 flex-shrink-0">
            {role === "siswa" ? (
              <BibooMascot mood="happy" size="sm" character={character} animated={false} />
            ) : (
              <span className="text-base">🌿</span>
            )}
          </div>
          <div>
            <span className="font-heading font-extrabold text-sm text-ink-900 tracking-tight leading-none block">
              Agro-Edu BiBoo
            </span>
            <span className="text-[9px] text-ink-600 font-bold block mt-0.5">
              {role === "siswa" ? "Area Siswa" : "AGRO EDU TRACK"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {role === "siswa" && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-pill bg-cream-50 border border-yellow-300 text-xs font-heading font-extrabold text-brown-600 shadow-xs">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
              <span>{stars}</span>
            </div>
          )}

          <button
            onClick={handleMobileLogout}
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full text-red-500 hover:bg-red-50 border border-red-200 transition-colors"
            title="Keluar"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main content — offset for sidebar on lg, offset for bottom nav on mobile */}
      <main className="lg:pl-60">
        <div className="min-h-dvh pb-[calc(max(env(safe-area-inset-bottom,0px),16px)+64px)] lg:pb-10">
          {children}
        </div>
      </main>

      <BottomNav role={role} />
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({ title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 px-3.5 pt-4 pb-2 sm:px-8 sm:pt-8">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-ink-900 leading-tight">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-[11px] sm:text-xs md:text-sm text-ink-600 font-medium">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 mt-0.5">{action}</div>
      )}
    </div>
  );
}

export function ContentWrapper({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-3.5 sm:px-8 max-w-6xl mx-auto ${className}`}>
      {children}
    </div>
  );
}
