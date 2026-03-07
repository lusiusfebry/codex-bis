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
      <section className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#0F1923_0%,#1B2A47_100%)] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-mining-grid opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_28%)]" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
            <HardHat className="h-8 w-8 text-accent" />
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.35em] text-accent">BSI</div>
            <h1 className="mt-1 text-3xl font-black">Bebang Sistem Informasi</h1>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-8 flex items-center gap-4 text-accent">
            <Mountain className="h-14 w-14" />
            <Pickaxe className="h-12 w-12" />
          </div>
          <h2 className="text-4xl font-black leading-tight">PT Prima Sarana Gemilang</h2>
          <p className="mt-4 text-lg text-slate-300">
            Sistem operasi digital terpadu untuk mendukung Human Resources dan operasional site pertambangan Taliabu.
          </p>
        </div>

        <div className="relative z-10 text-sm text-slate-400">Site Taliabu · Industri Pertambangan</div>
      </section>

      <section className="flex items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-10">
        <Card className="w-full max-w-xl animate-fade-up border-slate-200 shadow-panel">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-accent/20 bg-white shadow-sm">
              <span className="text-2xl font-black text-primary">PSG</span>
            </div>
            <div>
              <CardTitle className="text-3xl font-black tracking-tight text-primary">Selamat Datang</CardTitle>
              <CardDescription className="mt-2 text-base">Masuk menggunakan NIK & kata sandi Anda</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  placeholder="Contoh: 02-03827"
                  value={formValues.nik}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, nik: event.target.value }))}
                />
                {errors.nik ? <p className="text-sm font-medium text-destructive">{errors.nik}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Input
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

              <Button className="h-12 w-full text-base font-bold" disabled={isSubmitting} type="submit">
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

            <div className="mt-8 text-center text-sm text-muted-foreground">Bebang Sistem Informasi · PT Prima Sarana Gemilang</div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
