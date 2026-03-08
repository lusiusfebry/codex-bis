import { useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  FolderKanban,
  GitBranch,
  HardHat,
  House,
  KeyRound,
  Landmark,
  LogOut,
  MapPin,
  Mountain,
  Package2,
  ShieldCheck,
  Tags,
  Users,
  Waypoints,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const { user, logout } = useAuth();
  const [hrExpanded, setHrExpanded] = useState(true);
  const [masterDataExpanded, setMasterDataExpanded] = useState(true);
  const masterDataMenus = [
    { icon: Building2, label: "Divisi", to: "/hr/master-data/divisi" },
    { icon: FolderKanban, label: "Department", to: "/hr/master-data/department" },
    { icon: BriefcaseBusiness, label: "Posisi Jabatan", to: "/hr/master-data/posisi-jabatan" },
    { icon: Landmark, label: "Kategori Pangkat", to: "/hr/master-data/kategori-pangkat" },
    { icon: GitBranch, label: "Golongan", to: "/hr/master-data/golongan" },
    { icon: Waypoints, label: "Sub Golongan", to: "/hr/master-data/sub-golongan" },
    { icon: Users, label: "Jenis Hubungan Kerja", to: "/hr/master-data/jenis-hubungan-kerja" },
    { icon: Tags, label: "Tag", to: "/hr/master-data/tag" },
    { icon: MapPin, label: "Lokasi Kerja", to: "/hr/master-data/lokasi-kerja" },
    { icon: ShieldCheck, label: "Status Karyawan", to: "/hr/master-data/status-karyawan" },
  ];

  return (
    <aside className="flex w-full flex-col bg-sidebar text-sidebar-foreground md:w-72">
      {/* ── Logo ── */}
      <div className="border-b border-sidebar-border px-5 py-5">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
            <HardHat className="h-5 w-5" />
            <Mountain className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-accent p-0.5 text-accent-foreground" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-[0.2em] text-white">BSI</div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-accent">Bebang Sistem Informasi</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-sidebar-foreground/60">PT Prima Sarana Gemilang</div>
      </div>

      {/* ── Navigation ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1.5">
          <NavLink
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent/80 hover:text-white",
                isActive && "bg-sidebar-accent text-white shadow-md shadow-sidebar-accent/30",
              )
            }
            to="/"
          >
            <House className="h-4 w-4" />
            Dashboard
          </NavLink>

          <div className="rounded-xl border border-sidebar-border/60 bg-white/[0.03]">
            <button
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 hover:text-white"
              onClick={() => setHrExpanded((value) => !value)}
              type="button"
            >
              <span className="flex items-center gap-3">
                <Users className="h-4 w-4" />
                Human Resources
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", hrExpanded && "rotate-180")} />
            </button>
            {hrExpanded ? (
              <div className="space-y-0.5 px-2.5 pb-2.5">
                <div className="rounded-lg bg-black/10">
                  <button
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-sidebar-foreground/80 transition-colors duration-200 hover:bg-sidebar-accent/70 hover:text-white"
                    onClick={() => setMasterDataExpanded((value) => !value)}
                    type="button"
                  >
                    <span>Master Data</span>
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", masterDataExpanded && "rotate-180")} />
                  </button>
                  {masterDataExpanded ? (
                    <div className="space-y-0.5 px-1.5 pb-2">
                      <NavLink
                        className={({ isActive }) =>
                          cn(
                            "flex items-center rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground/70 transition-colors duration-200 hover:bg-sidebar-accent/70 hover:text-white",
                            (isActive || window.location.pathname.startsWith("/hr/master-data")) && "bg-sidebar-accent text-white",
                          )
                        }
                        to="/hr/master-data"
                      >
                        Semua Master Data
                      </NavLink>
                      {masterDataMenus.map(({ icon: Icon, label, to }) => (
                        <NavLink
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground/70 transition-colors duration-200 hover:bg-sidebar-accent/70 hover:text-white",
                              isActive && "bg-sidebar-accent text-white",
                            )
                          }
                          key={to}
                          to={to}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </NavLink>
                      ))}
                    </div>
                  ) : null}
                </div>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-sidebar-foreground/80 transition-colors duration-200 hover:bg-sidebar-accent/70 hover:text-white",
                      (isActive || window.location.pathname.startsWith("/hr/karyawan")) &&
                      "bg-sidebar-accent text-white",
                    )
                  }
                  end
                  to="/hr/karyawan"
                >
                  Karyawan
                </NavLink>
              </div>
            ) : null}
          </div>

          {disabledMenus.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex cursor-default items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-sidebar-foreground/50"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              <Badge className="border-0 bg-sidebar-border/60 text-[10px] text-sidebar-foreground/50" variant="secondary">
                Segera
              </Badge>
            </div>
          ))}
        </nav>
      </div>

      {/* ── User Card ── */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="rounded-xl bg-white/[0.04] p-3.5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-accent/30 ring-offset-1 ring-offset-sidebar">
              <AvatarImage alt={user?.nama ?? "Pengguna"} src={user?.fotoUrl ?? undefined} />
              <AvatarFallback className="bg-sidebar-accent text-xs font-semibold text-white">
                {getInitials(user?.nama ?? "BSI")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{user?.nama ?? "-"}</div>
              <div className="text-xs text-sidebar-foreground/60">NIK {user?.nik ?? "-"}</div>
            </div>
          </div>
          <Button
            className="mt-3 w-full justify-start gap-2 rounded-lg bg-accent/90 text-xs font-semibold text-accent-foreground shadow-sm shadow-accent/20 transition-all hover:bg-accent"
            onClick={logout}
            size="sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
