import { ChevronRight, LogOut, User } from "lucide-react";
import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import { NotificationBell } from "@/components/layout/NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function HeaderBreadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {isLast || !item.href ? (
                  <span className="font-semibold text-foreground">{item.label}</span>
                ) : (
                  <Link className="transition-colors hover:text-primary" to={item.href}>
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast ? (
                <li>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const breadcrumbItems = breadcrumbMap[location.pathname] ?? [{ label: "Dashboard", href: "/" }];

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-white/80 px-4 shadow-sm backdrop-blur-xl md:px-6">
      <HeaderBreadcrumb items={breadcrumbItems} />
      <div className="flex items-center gap-1.5">
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-auto gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted/50" variant="ghost">
              <Avatar className="h-8 w-8 ring-1 ring-border">
                <AvatarImage alt={user?.nama ?? "Pengguna"} src={user?.fotoUrl ?? undefined} />
                <AvatarFallback className="text-xs font-semibold">{getInitials(user?.nama ?? "BSI")}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <div className="text-sm font-semibold text-foreground">{user?.nama ?? "-"}</div>
                <div className="text-[11px] text-muted-foreground">NIK {user?.nik ?? "-"}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl">
            <DropdownMenuItem className="gap-2 rounded-lg">
              <User className="h-4 w-4" />
              {user?.role ?? "Profil"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 rounded-lg text-destructive focus:text-destructive" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
