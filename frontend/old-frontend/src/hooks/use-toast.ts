import { useCallback } from "react";

type ToastVariant = "default" | "success" | "destructive";

interface ToastOptions {
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
}

// This is a simple implementation. In a real app, you might want to use a state management solution
// or a proper toast library like react-hot-toast or react-toastify
export function useToast() {
  const toast = useCallback(
    ({
      title,
      description,
      variant = "default",
      duration = 3000,
    }: ToastOptions) => {
      // Create toast element
      const toastElement = document.createElement("div");
      toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all transform translate-y-0 opacity-100 z-50 ${
        variant === "destructive"
          ? "bg-red-50 text-red-900 border border-red-200"
          : variant === "success"
            ? "bg-green-50 text-green-900 border border-green-200"
            : "bg-white text-gray-900 border border-gray-200"
      }`;

      // Create title if provided
      if (title) {
        const titleElement = document.createElement("div");
        titleElement.className = "font-medium";
        titleElement.textContent = title;
        toastElement.appendChild(titleElement);
      }

      // Create description
      const descriptionElement = document.createElement("div");
      descriptionElement.className = "text-sm";
      descriptionElement.textContent = description;
      toastElement.appendChild(descriptionElement);

      // Add to document
      document.body.appendChild(toastElement);

      // Animate out and remove
      setTimeout(() => {
        toastElement.classList.add("translate-y-2", "opacity-0");
        setTimeout(() => {
          document.body.removeChild(toastElement);
        }, 300);
      }, duration);
    },
    [],
  );

  return { toast };
}
