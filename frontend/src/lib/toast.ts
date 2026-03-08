import { toast } from "sonner";

import { useNotificationStore } from "@/stores/notificationStore";

function pushToastNotification(
  type: "sukses" | "error" | "warning" | "info",
  message: string,
  title: string,
) {
  useNotificationStore.getState().addNotification(type, title, message);
}

export function toastSuccess(message: string, title?: string) {
  const resolvedTitle = title ?? "Sukses";
  pushToastNotification("sukses", message, resolvedTitle);

  if (title) {
    toast.success(resolvedTitle, { description: message });
    return;
  }

  toast.success(message);
}

export function toastError(message: string, title?: string) {
  const resolvedTitle = title ?? "Error";
  pushToastNotification("error", message, resolvedTitle);

  if (title) {
    toast.error(resolvedTitle, { description: message });
    return;
  }

  toast.error(message);
}

export function toastWarning(message: string, title?: string) {
  const resolvedTitle = title ?? "Peringatan";
  pushToastNotification("warning", message, resolvedTitle);

  if (title) {
    toast.warning(resolvedTitle, { description: message });
    return;
  }

  toast.warning(message);
}

export function toastInfo(message: string, title?: string) {
  const resolvedTitle = title ?? "Info";
  pushToastNotification("info", message, resolvedTitle);

  if (title) {
    toast.info(resolvedTitle, { description: message });
    return;
  }

  toast.info(message);
}
