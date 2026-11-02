"use client";
import { ReactNode } from "react";
import { Sidebar, BottomNav } from "./nav";
import { Leaf, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface AppShellProps {
  role: "siswa" | "guru";
  children: ReactNode;
}

export function AppShell({ role, children }: AppShellProps) {
  const router = useRouter();

  const handleMobileLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      router.push(role === "siswa" ? "/login" : "/guru/login");
    }
  };

  return (
    <div data-role={role} className="min-h-dvh bg-bg">
      <Sidebar role={role} />

      {/* Top Header Mobile */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface/90 backdrop-blur-md px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${role === "siswa" ? "bg-siswa-100" : "bg-guru-100"}`}>
            <Leaf className={`h-3.5 w-3.5 ${role === "siswa" ? "text-siswa-600" : "text-guru-600"}`} />
          </div>
          <div>
            <span className="text-xs font-extrabold tracking-tight text-ink">AGRO EDU BOX</span>
            <span className="text-[10px] text-ink-muted ml-1.5 font-medium">
              {role === "siswa" ? "· Siswa" : "· Guru"}
            </span>
          </div>
        </div>

        <button
          onClick={handleMobileLogout}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200/60 transition-colors"
          title="Keluar dari akun"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Keluar</span>
        </button>
      </header>

      {/* Main content — offset for sidebar on lg */}
      <main className="lg:pl-52">
        <div className="min-h-dvh pb-20 lg:pb-8">
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
    <div className="flex items-start justify-between gap-4 px-4 pt-6 pb-4 md:px-6 md:pt-8">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink leading-tight">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-ink-muted">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 mt-1">{action}</div>
      )}
    </div>
  );
}

export function ContentWrapper({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-4 md:px-6 max-w-6xl ${className}`}>
      {children}
    </div>
  );
}
