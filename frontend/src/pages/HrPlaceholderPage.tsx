import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HrPlaceholderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Human Resources</CardTitle>
        <CardDescription>Modul HR akan dikembangkan pada fase berikutnya.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-sm text-muted-foreground">
          Halaman placeholder untuk navigasi modul Human Resources.
        </div>
      </CardContent>
    </Card>
  );
}
