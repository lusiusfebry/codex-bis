import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowRight, Building2, MapPin, ShieldCheck, UserCheck, Users } from "lucide-react";
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

  const statCards = [
    { label: "Total Karyawan", value: stats.totalKaryawan, icon: Users, color: "text-primary" },
    { label: "Karyawan Aktif", value: stats.karyawanAktif, icon: UserCheck, color: "text-emerald-600" },
    { label: "Total Divisi", value: stats.totalDivisi, icon: Building2, color: "text-amber-600" },
    { label: "Total Lokasi", value: stats.totalLokasi, icon: MapPin, color: "text-sky-600" },
  ];

  const modules = [
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

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-[linear-gradient(120deg,#1B2A47_0%,#243B69_52%,#31518F_100%)] text-white shadow-panel">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-accent">Dashboard Utama</p>
            <h1 className="mt-3 text-3xl font-black md:text-4xl">Selamat Datang, {user?.nama ?? "Pengguna"}!</h1>
            <p className="mt-3 text-white/80">PT Prima Sarana Gemilang · Site Taliabu</p>
            <p className="mt-2 text-sm text-white/70">{today}</p>
          </div>
          <Avatar className="h-20 w-20 border-4 border-white/20 md:h-24 md:w-24">
            <AvatarImage alt={user?.nama ?? "Pengguna"} src={user?.fotoUrl ?? undefined} />
            <AvatarFallback className="bg-accent text-xl font-black text-accent-foreground">{getInitials(user?.nama ?? "BSI")}</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          : statCards.map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="border-l-4 border-l-accent shadow-sm">
                <CardContent className="flex items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-3xl font-black text-foreground">{value}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                    <Icon className={`h-7 w-7 ${color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-black text-primary">Shortcut Modul</h2>
          <p className="text-sm text-muted-foreground">Akses cepat ke modul utama yang tersedia di sistem.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map(({ title, description, icon: Icon, action, enabled }) => (
            <Card key={title} className={enabled ? "border-accent/60 shadow-sm" : "cursor-default border-dashed opacity-60"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {!enabled ? <Badge variant="warning">Segera Hadir</Badge> : null}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                {enabled ? (
                  <Button className="gap-2" onClick={() => navigate("/hr")} variant="default">
                    {action}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="text-sm font-medium text-amber-700">{action}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Sistem</CardTitle>
            <CardDescription>Struktur aktivitas akan dihubungkan pada fase berikutnya.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Belum ada aktivitas terbaru
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
