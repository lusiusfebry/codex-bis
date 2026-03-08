import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, HardHat, Mountain, Pickaxe } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { loginApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

type LoginErrors = {
  nik?: string;
  password?: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    nik: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});

  const validate = () => {
    const nextErrors: LoginErrors = {};

    if (!formValues.nik.trim()) {
      nextErrors.nik = "NIK wajib diisi.";
    } else if (!/^\d{2}-\d{5}$/.test(formValues.nik.trim())) {
      nextErrors.nik = "Format NIK harus mengikuti pola xx-xxxxx.";
    }

    if (!formValues.password) {
      nextErrors.password = "Kata sandi wajib diisi.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginApi({
        nik: formValues.nik.trim(),
        password: formValues.password,
      });

      login(response.token, response.user);
      toast.success("Login berhasil. Selamat datang kembali.");
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("NIK atau kata sandi tidak valid");
      } else {
        toast.error("Terjadi kesalahan saat memproses login.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[45%_55%]">
      {/* ── Branding Panel ── */}
      <section className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#0F1923_0%,#1B2A47_50%,#243B69_100%)] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-mining-grid opacity-30" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-indigo-500/8 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-lg backdrop-blur">
            <HardHat className="h-6 w-6 text-accent" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-accent">BSI</div>
            <h1 className="mt-0.5 text-2xl font-extrabold">Bebang Sistem Informasi</h1>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-6 flex items-center gap-3 text-accent/80">
            <Mountain className="h-12 w-12" />
            <Pickaxe className="h-10 w-10" />
          </div>
          <h2 className="text-4xl font-black leading-tight tracking-tight">PT Prima Sarana Gemilang</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300/90">
            Sistem operasi digital terpadu untuk mendukung Human Resources dan operasional site pertambangan Taliabu.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-400/80">Site Taliabu · Industri Pertambangan</div>
      </section>

      {/* ── Login Form ── */}
      <section className="flex items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-10">
        <Card className="w-full max-w-xl animate-fade-up border-border/60 shadow-panel">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 shadow-sm ring-1 ring-border/50">
              <span className="text-xl font-black text-primary">PSG</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-extrabold tracking-tight text-primary">Selamat Datang</CardTitle>
              <CardDescription className="mt-1.5 text-sm">Masuk menggunakan NIK & kata sandi Anda</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium" htmlFor="nik">NIK</Label>
                <Input
                  className="h-11"
                  id="nik"
                  placeholder="Contoh: 02-03827"
                  value={formValues.nik}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, nik: event.target.value }))}
                />
                {errors.nik ? <p className="text-sm font-medium text-destructive">{errors.nik}</p> : null}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium" htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Input
                    className="h-11 pr-10"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formValues.password}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, password: event.target.value }))}
                  />
                  <button
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    type="button"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password ? <p className="text-sm font-medium text-destructive">{errors.password}</p> : null}
              </div>

              <Button className="h-11 w-full text-sm font-bold" disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-xs text-muted-foreground/70">Bebang Sistem Informasi · PT Prima Sarana Gemilang</div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
