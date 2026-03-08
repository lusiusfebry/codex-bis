import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowRight, Building2, Clock, MapPin, ShieldCheck, UserCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "@/api/axiosInstance";
import { getKaryawanStatsApi } from "@/api/karyawan";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

type StatState = {
  totalKaryawan: number;
  karyawanAktif: number;
  totalDivisi: number;
  totalLokasi: number;
};

type MasterDataListResponse = {
  success: boolean;
  data: Array<{
    id: string;
    namaStatus?: string;
  }>;
  meta: {
    total: number;
  };
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

const STAT_CONFIG = [
  { key: "totalKaryawan", label: "Total Karyawan", icon: Users, borderColor: "border-l-primary" },
  { key: "karyawanAktif", label: "Karyawan Aktif", icon: UserCheck, borderColor: "border-l-emerald-500" },
  { key: "totalDivisi", label: "Total Divisi", icon: Building2, borderColor: "border-l-amber-500" },
  { key: "totalLokasi", label: "Total Lokasi", icon: MapPin, borderColor: "border-l-sky-500" },
] as const;

const MODULE_CONFIG = [
  {
    title: "Human Resources",
    icon: Users,
    description: "Kelola master data, karyawan, dan operasional SDM.",
    action: "Buka Modul",
    enabled: true,
  },
  {
    title: "Inventori",
    icon: Building2,
    description: "Pemantauan stok dan kebutuhan logistik site.",
    action: "Segera Hadir",
    enabled: false,
  },
  {
    title: "Mess Management",
    icon: MapPin,
    description: "Pengelolaan kamar, penghuni, dan fasilitas mess.",
    action: "Segera Hadir",
    enabled: false,
  },
  {
    title: "Building Management",
    icon: Building2,
    description: "Kontrol aset bangunan dan pemeliharaan fasilitas.",
    action: "Segera Hadir",
    enabled: false,
  },
  {
    title: "Manajemen Akses",
    icon: ShieldCheck,
    description: "Kontrol role, izin, dan pengamanan akses modul.",
    action: "Segera Hadir",
    enabled: false,
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatState>({
    totalKaryawan: 0,
    karyawanAktif: 0,
    totalDivisi: 0,
    totalLokasi: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [totalKaryawan, statusResponse, divisiResponse, lokasiResponse] = await Promise.all([
          getKaryawanStatsApi(),
          axiosInstance.get<MasterDataListResponse>("/hr/master-data/status-karyawan", { params: { limit: 100 } }),
          axiosInstance.get<MasterDataListResponse>("/hr/master-data/divisi", { params: { limit: 1 } }),
          axiosInstance.get<MasterDataListResponse>("/hr/master-data/lokasi-kerja", { params: { limit: 1 } }),
        ]);

        const activeStatusId =
          statusResponse.data.data.find((item) => item.namaStatus?.toLowerCase() === "aktif")?.id ?? null;
        const karyawanAktif = activeStatusId ? await getKaryawanStatsApi({ statusKaryawanId: activeStatusId }) : 0;

        setStats({
          totalKaryawan,
          karyawanAktif,
          totalDivisi: divisiResponse.data.meta.total,
          totalLokasi: lokasiResponse.data.meta.total,
        });
      } finally {
        setLoading(false);
      }
    };

    void loadStats();
  }, []);

  const today = format(new Date(), "EEEE, dd MMMM yyyy", { locale: id });

  return (
    <div className="space-y-6">
      {/* ── Hero Card ── */}
      <Card className="relative overflow-hidden border-0 bg-[linear-gradient(120deg,#1B2A47_0%,#243B69_52%,#31518F_100%)] text-white shadow-panel">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
        <CardContent className="relative z-10 flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <Clock className="h-3.5 w-3.5" />
              {today}
            </div>
            <h1 className="mt-2.5 text-3xl font-extrabold md:text-4xl">Selamat Datang, {user?.nama ?? "Pengguna"}!</h1>
            <p className="mt-2 text-sm text-white/70">PT Prima Sarana Gemilang · Site Taliabu</p>
          </div>
          <Avatar className="h-18 w-18 ring-4 ring-white/15 md:h-20 md:w-20">
            <AvatarImage alt={user?.nama ?? "Pengguna"} src={user?.fotoUrl ?? undefined} />
            <AvatarFallback className="bg-accent text-lg font-extrabold text-accent-foreground">{getInitials(user?.nama ?? "BSI")}</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>

      {/* ── Stat Cards ── */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))
          : STAT_CONFIG.map(({ key, label, icon: Icon, borderColor }) => (
            <Card key={key} className={`border-l-[3px] shadow-sm transition-shadow hover:shadow-md ${borderColor}`}>
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <p className="mt-1.5 text-3xl font-extrabold text-foreground">{stats[key]}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
      </section>

      {/* ── Module Shortcuts ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">Shortcut Modul</h2>
          <p className="mt-1 text-sm text-muted-foreground">Akses cepat ke modul utama yang tersedia di sistem.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MODULE_CONFIG.map(({ title, description, icon: Icon, action, enabled }) => (
            <Card
              key={title}
              className={`transition-all duration-200 ${enabled
                  ? "shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                  : "cursor-default border-dashed opacity-50"
                }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {!enabled ? (
                    <Badge className="text-[10px]" variant="secondary">Segera Hadir</Badge>
                  ) : null}
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
              </CardHeader>
              <CardContent>
                {enabled ? (
                  <Button className="gap-2" onClick={() => navigate("/hr/master-data")} size="sm" variant="default">
                    {action}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <div className="text-xs font-medium text-muted-foreground">{action}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Aktivitas Sistem ── */}
      <section>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Aktivitas Sistem</CardTitle>
            <CardDescription className="text-xs">Struktur aktivitas akan dihubungkan pada fase berikutnya.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
              <Clock className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Belum ada aktivitas terbaru</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
