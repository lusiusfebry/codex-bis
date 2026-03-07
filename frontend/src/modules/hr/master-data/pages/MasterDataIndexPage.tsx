import { ArrowRight } from "lucide-react";
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
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-black text-primary">Master Data HR</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kelola seluruh referensi data Human Resources dari satu tempat terpusat.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => {
          const Icon = resource.icon;

          return (
            <Card key={resource.key} className="border-accent/20 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">{resource.badgeLabel}</Badge>
                </div>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="gap-2" onClick={() => navigate(resource.route)}>
                  Kelola
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
