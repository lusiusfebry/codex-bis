import { LogOut, User } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const breadcrumbMap: Record<string, Array<{ label: string; href?: string }>> = {
  "/": [{ label: "Dashboard" }],
  "/hr": [{ label: "Dashboard", href: "/" }, { label: "Human Resources" }],
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const breadcrumbItems = breadcrumbMap[location.pathname] ?? [{ label: "Dashboard", href: "/" }];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/95 px-4 shadow-sm backdrop-blur md:px-6">
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center gap-2">
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-auto gap-3 rounded-full px-2 py-1.5" variant="ghost">
              <Avatar className="h-9 w-9">
                <AvatarImage alt={user?.nama ?? "Pengguna"} src={user?.fotoUrl ?? undefined} />
                <AvatarFallback>{getInitials(user?.nama ?? "BSI")}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <div className="text-sm font-semibold text-foreground">{user?.nama ?? "-"}</div>
                <div className="text-xs text-muted-foreground">NIK {user?.nik ?? "-"}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              {user?.role ?? "Profil"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
