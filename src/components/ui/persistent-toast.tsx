
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const PersistentToast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ toast, onRemove }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
          {
            "border-green-500/30 bg-green-50 text-green-800 dark:border-green-500/30 dark:bg-green-950/50 dark:text-green-300":
              toast.type === "success",
            "border-red-500/30 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-300":
              toast.type === "error",
            "border-blue-500/30 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-950/50 dark:text-blue-300":
              toast.type === "info",
            "border-yellow-500/30 bg-yellow-50 text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-950/50 dark:text-yellow-300":
              toast.type === "warning",
          }
        )}
      >
        <div className="flex items-center gap-3">
          {toast.type === "success" && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          {toast.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
          {toast.type === "warning" && (
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          )}
          <div className="flex flex-col gap-1">
            <p className="font-medium">{toast.title}</p>
            <p className="text-sm">{toast.message}</p>
            <p className="text-xs opacity-75 mt-1">
              {new Date(toast.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
);

PersistentToast.displayName = "PersistentToast";

export default PersistentToast;
