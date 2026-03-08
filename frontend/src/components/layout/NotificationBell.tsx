import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  CheckCircle2,
  Info,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/stores/notificationStore";

function getNotificationIcon(type: "sukses" | "error" | "warning" | "info") {
  switch (type) {
    case "sukses":
      return <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />;
    case "error":
      return <XCircle className="mt-0.5 h-4 w-4 text-rose-500" />;
    case "warning":
      return <TriangleAlert className="mt-0.5 h-4 w-4 text-amber-500" />;
    default:
      return <Info className="mt-0.5 h-4 w-4 text-sky-500" />;
  }
}

export function NotificationBell() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative" size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          ) : null}
          <span className="sr-only">Notifikasi</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="px-0">Notifikasi Sistem</DropdownMenuLabel>
          {notifications.length > 0 ? (
            <Button className="h-auto px-2 py-1 text-xs" onClick={markAllRead} variant="ghost">
              Tandai semua dibaca
            </Button>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem className="cursor-default flex-col items-start gap-1 p-3 focus:bg-transparent">
            <span className="font-medium text-foreground">Tidak ada notifikasi baru</span>
            <span className="text-xs text-muted-foreground">Semua pembaruan sistem akan muncul di sini.</span>
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`cursor-default items-start gap-3 p-3 ${notification.read ? "" : "bg-muted/60"}`}
            >
              {getNotificationIcon(notification.type)}
              <div className="space-y-1">
                <div className="font-medium text-foreground">{notification.title}</div>
                <div className="text-xs text-muted-foreground">{notification.message}</div>
                <div className="text-[11px] text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.timestamp), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
