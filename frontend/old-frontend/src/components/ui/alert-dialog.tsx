"use client";

import * as React from "react";
import {
  createContext,
  useContext,
  useCallback,
  useState,
  memo,
  useRef,
} from "react";
import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "./progress";

// Define valid color types
type AlertColor =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default";
type AlertVariant = "solid" | "outline";

interface BaseAlertProps {
  title: string;
  description: string;
  variant?: AlertVariant;
  color?: AlertColor;
  isLoading?: boolean;
  progress?: number;
  duration?: number;
  icon?: React.ReactNode;
}

interface ExtendedAlertProps extends BaseAlertProps {
  id: string;
}

// Define the interface for the Alert Dialog context
interface AlertContextProps {
  showAlert: (props: BaseAlertProps) => string;
  updateAlert: (id: string, props: Partial<BaseAlertProps>) => void;
  hideAlert: (id: string) => void;
}

// Create the context
const AlertContext = createContext<AlertContextProps | undefined>(undefined);

interface AlertItemProps {
  alert: ExtendedAlertProps;
  onClose: (id: string) => void;
  colorClasses: Record<string, string>;
}

// Memoized Alert Item Component
const AlertItem = memo(({ alert, onClose, colorClasses }: AlertItemProps) => {
  const progress = alert.progress || 0;

  return (
    <motion.div
      key={alert.id}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="relative"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg shadow-lg",
          `${colorClasses.bg} border ${colorClasses.border}`,
          "transition-all duration-200",
        )}
      >
        <div
          className={cn(
            "px-4 py-3 bg-transparent border-0",
            colorClasses.text,
            "flex items-start gap-3",
          )}
        >
          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-medium mb-0.5 truncate">
              {alert.title}
            </h5>
            {alert.description && (
              <p className="text-sm opacity-85 line-clamp-2">
                {alert.description}
              </p>
            )}
          </div>
          {alert.icon}
        </div>

        {alert.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-lg z-10">
            <Loader2
              className={cn("h-5 w-5 animate-spin", colorClasses.icon)}
            />
          </div>
        )}

        <button
          onClick={() => onClose(alert.id)}
          className={cn(
            "absolute top-2 right-2 p-1 rounded-full",
            "hover:bg-black/5 active:bg-black/10",
            "transition-colors duration-200 z-20",
          )}
        >
          <X className="h-4 w-4 opacity-60" />
        </button>

        {!alert.isLoading && (
          <Progress
            value={progress}
            className={cn(
              "absolute bottom-0 left-0 h-0.5 w-full",
              alert.variant === "solid"
                ? "bg-white/20"
                : alert.color === "primary"
                  ? "bg-violet-200"
                  : alert.color === "success"
                    ? "bg-emerald-200"
                    : alert.color === "warning"
                      ? "bg-amber-200"
                      : alert.color === "danger"
                        ? "bg-red-200"
                        : alert.color === "info"
                          ? "bg-blue-200"
                          : "bg-gray-200",
            )}
            indicatorClassName={cn(
              alert.variant === "solid"
                ? "bg-white"
                : alert.color === "primary"
                  ? "bg-violet-500"
                  : alert.color === "success"
                    ? "bg-emerald-500"
                    : alert.color === "warning"
                      ? "bg-amber-500"
                      : alert.color === "danger"
                        ? "bg-red-500"
                        : alert.color === "info"
                          ? "bg-blue-500"
                          : "bg-gray-500",
            )}
          />
        )}
      </div>
    </motion.div>
  );
});

AlertItem.displayName = "AlertItem";

// Provider component
export function AlertDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alerts, setAlerts] = useState<ExtendedAlertProps[]>([]);
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>(
    {},
  );
  const colorClassesRef = useRef<Record<AlertColor, Record<string, string>>>({
    primary: {
      bg: "bg-violet-50/95 backdrop-blur-sm",
      border: "border-violet-200",
      progress: "bg-violet-500",
      icon: "text-violet-500",
      text: "text-violet-800",
    },
    success: {
      bg: "bg-emerald-50/95 backdrop-blur-sm",
      border: "border-emerald-200",
      progress: "bg-emerald-500",
      icon: "text-emerald-500",
      text: "text-emerald-800",
    },
    warning: {
      bg: "bg-amber-50/95 backdrop-blur-sm",
      border: "border-amber-200",
      progress: "bg-amber-500",
      icon: "text-amber-500",
      text: "text-amber-800",
    },
    danger: {
      bg: "bg-red-50/95 backdrop-blur-sm",
      border: "border-red-200",
      progress: "bg-red-500",
      icon: "text-red-500",
      text: "text-red-800",
    },
    info: {
      bg: "bg-blue-50/95 backdrop-blur-sm",
      border: "border-blue-200",
      progress: "bg-blue-500",
      icon: "text-blue-500",
      text: "text-blue-800",
    },
    default: {
      bg: "bg-gray-50/95 backdrop-blur-sm",
      border: "border-gray-200",
      progress: "bg-gray-500",
      icon: "text-gray-500",
      text: "text-gray-800",
    },
  });

  const showAlert = useCallback((props: BaseAlertProps) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newAlert: ExtendedAlertProps = {
      ...props,
      id,
      color: props.color || "default",
      description: props.description || "",
      duration: props.isLoading ? undefined : props.duration || 3000, // Shorter duration for non-loading alerts
    };

    setAlerts((prev) => [...prev, newAlert]);

    // Only set up interval for non-loading alerts
    if (!props.isLoading) {
      const duration = props.duration || 3000;
      const startTime = Date.now();
      const endTime = startTime + duration;

      intervalsRef.current[id] = setInterval(() => {
        const now = Date.now();
        if (now >= endTime) {
          clearInterval(intervalsRef.current[id]);
          delete intervalsRef.current[id];
          hideAlert(id);
        } else {
          const progress = ((now - startTime) / duration) * 100;
          setAlerts((prev) =>
            prev.map((alert) =>
              alert.id === id ? { ...alert, progress } : alert,
            ),
          );
        }
      }, 10);
    }

    return id;
  }, []);

  const updateAlert = useCallback(
    (id: string, props: Partial<BaseAlertProps>) => {
      if (intervalsRef.current[id]) {
        clearInterval(intervalsRef.current[id]);
        delete intervalsRef.current[id];
      }

      if (!props.isLoading) {
        const duration = props.duration || 3000;
        const startTime = Date.now();
        const endTime = startTime + duration;

        intervalsRef.current[id] = setInterval(() => {
          const now = Date.now();
          if (now >= endTime) {
            clearInterval(intervalsRef.current[id]);
            delete intervalsRef.current[id];
            hideAlert(id);
          } else {
            const progress = ((now - startTime) / duration) * 100;
            setAlerts((prev) =>
              prev.map((alert) =>
                alert.id === id ? { ...alert, progress } : alert,
              ),
            );
          }
        }, 10);
      }

      setAlerts((prev) =>
        prev.map((alert) => (alert.id === id ? { ...alert, ...props } : alert)),
      );
    },
    [],
  );

  const hideAlert = useCallback((id: string) => {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id]);
      delete intervalsRef.current[id];
    }
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // Clean up intervals on unmount
  React.useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, updateAlert, hideAlert }}>
      {children}
      <div className="fixed top-0 right-0 p-4 space-y-3 z-50 max-w-sm w-full">
        {alerts.map((alert) => (
          <AlertItem
            key={alert.id}
            alert={alert}
            onClose={hideAlert}
            colorClasses={colorClassesRef.current[alert.color || "default"]}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
}

// Hook to use the alert dialog
export function useAlertDialog() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error(
      "useAlertDialog must be used within an AlertDialogProvider",
    );
  }
  return context;
}

// Custom hook for loading alerts
export function useLoadingAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error(
      "useLoadingAlert must be used within an AlertDialogProvider",
    );
  }

  const { showAlert, updateAlert, hideAlert } = context;

  return {
    show: (
      title: string,
      description: string = "",
      color: AlertColor = "primary",
    ) => {
      const id = showAlert({
        title,
        description,
        color,
        isLoading: true,
      });

      return {
        updateMessage: (newTitle: string, newDescription: string = "") => {
          updateAlert(id, { title: newTitle, description: newDescription });
        },
        complete: (successTitle: string, successDescription: string = "") => {
          updateAlert(id, {
            title: successTitle,
            description: successDescription,
            color: "success",
            isLoading: false,
          });
        },
        error: (errorTitle: string, errorDescription: string = "") => {
          updateAlert(id, {
            title: errorTitle,
            description: errorDescription,
            color: "danger",
            isLoading: false,
          });
        },
        dismiss: () => hideAlert(id),
      };
    },
  };
}
