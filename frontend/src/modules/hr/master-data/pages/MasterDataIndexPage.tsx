import { ArrowRight, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { masterDataResourceConfig } from "@/modules/hr/master-data/config";

export default function MasterDataIndexPage() {
  const navigate = useNavigate();
  const resources = Object.values(masterDataResourceConfig);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B2A47] via-[#243B69] to-[#31518F] p-6 text-white shadow-panel">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Database className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Master Data HR</h1>
            <p className="mt-0.5 text-sm text-white/70">
              Kelola seluruh referensi data Human Resources dari satu tempat terpusat.
            </p>
          </div>
        </div>
      </div>

      {/* ── Resource Cards ── */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => {
          const Icon = resource.icon;

          return (
            <Card
              key={resource.key}
              className="group shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge className="text-[10px]" variant="secondary">{resource.badgeLabel}</Badge>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription className="text-xs">{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="gap-2" onClick={() => navigate(resource.route)} size="sm">
                  Kelola
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
