import { useState } from "react";
import { Building2, ChevronDown, HardHat, House, KeyRound, LogOut, Mountain, Package2, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const disabledMenus = [
  { icon: Package2, label: "Inventori" },
  { icon: House, label: "Mess Management" },
  { icon: Building2, label: "Building Management" },
  { icon: KeyRound, label: "Manajemen Akses" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hrExpanded, setHrExpanded] = useState(true);

  return (
    <aside className="flex w-full flex-col bg-sidebar text-sidebar-foreground md:w-80">
      <div className="border-b border-sidebar-border px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/80 text-primary-foreground shadow-lg">
            <HardHat className="h-7 w-7" />
            <Mountain className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-accent p-1 text-accent-foreground" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-[0.22em] text-white">BSI</div>
            <div className="text-xs uppercase tracking-[0.18em] text-accent">Bebang Sistem Informasi</div>
          </div>
        </div>
        <div className="mt-4 border-t border-accent/30 pt-4 text-sm text-sidebar-foreground/80">PT Prima Sarana Gemilang</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <nav className="space-y-2">
          <NavLink
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl border-l-4 border-transparent px-4 py-3 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-white",
                isActive && "border-accent bg-sidebar-accent text-white shadow-md",
              )
            }
            to="/"
          >
            <House className="h-4 w-4" />
            Dashboard
          </NavLink>

          <div className="rounded-2xl border border-sidebar-border/80 bg-white/5">
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:text-white"
              onClick={() => setHrExpanded((value) => !value)}
              type="button"
            >
              <span className="flex items-center gap-3">
                <Users className="h-4 w-4" />
                Human Resources
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", hrExpanded && "rotate-180")} />
            </button>
            {hrExpanded ? (
              <div className="space-y-1 px-3 pb-3">
                <button
                  className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-white"
                  onClick={() => navigate("/hr")}
                  type="button"
                >
                  Master Data
                </button>
                <button
                  className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-white"
                  onClick={() => navigate("/hr")}
                  type="button"
                >
                  Karyawan
                </button>
              </div>
            ) : null}
          </div>

          {disabledMenus.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex cursor-default items-center justify-between rounded-xl border border-sidebar-border/70 px-4 py-3 text-sm text-sidebar-foreground/65 opacity-80"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              <Badge variant="secondary">Segera Hadir</Badge>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="rounded-2xl bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-white/20">
              <AvatarImage alt={user?.nama ?? "Pengguna"} src={user?.fotoUrl ?? undefined} />
              <AvatarFallback>{getInitials(user?.nama ?? "BSI")}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{user?.nama ?? "-"}</div>
              <div className="text-xs text-sidebar-foreground/70">NIK {user?.nik ?? "-"}</div>
            </div>
          </div>
          <Separator className="my-4 bg-white/10" />
          <Button className="w-full justify-start gap-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
