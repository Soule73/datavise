import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";


export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface ToastProps {
  open: boolean;
  onClose: () => void;
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number; // ms
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const typeStyles: Record<ToastType, string> = {
  success: "bg-white border-green-500",
  error: "bg-white border-red-500",
  warning: "bg-white border-amber-500",
  info: "bg-white border-blue-500",
  default: "bg-white border-gray-300",
};

const iconBgStyles: Record<ToastType, string> = {
  success: "bg-green-100 text-green-600",
  error: "bg-red-100 text-red-600",
  warning: "bg-amber-100 text-amber-600",
  info: "bg-blue-100 text-blue-600",
  default: "bg-gray-100 text-gray-600",
};

const barStyles: Record<ToastType, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  default: "bg-gray-400",
};

const posStyles: Record<string, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

export default function Toast({
  open,
  onClose,
  type = "default",
  title,
  description,
  duration = 3500,
  position = "bottom-right",
}: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      if (barRef.current) {
        barRef.current.style.width = "100%";
        barRef.current.style.transition = "none";

        void barRef.current.offsetWidth;
        barRef.current.style.transition = `width ${duration}ms linear`;
        barRef.current.style.width = "0%";
      }
      timerRef.current = setTimeout(onClose, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, duration, onClose]);

  if (!open) return null;

  const icons: Record<ToastType, React.ReactElement> = {
    success: <CheckCircleIcon className="w-6 h-6" />,
    error: <XCircleIcon className="w-6 h-6" />,
    warning: <ExclamationTriangleIcon className="w-6 h-6" />,
    info: <InformationCircleIcon className="w-6 h-6" />,
    default: <InformationCircleIcon className="w-6 h-6" />,
  };

  return (
    <div
      className={`fixed z-50 ${posStyles[position]} flex flex-col items-end gap-2`}
      style={{ minWidth: 360 }}
    >
      <div
        className={`relative border-l-4 rounded-r-lg shadow-xl px-4 py-4 w-full max-w-md animate-fade-in-up ${typeStyles[type]} dark:bg-gray-800 dark:border-opacity-70`}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconBgStyles[type]} dark:opacity-90`}>
            {icons[type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base text-gray-900 dark:text-gray-100 leading-tight">
              {title}
            </div>
            {description && (
              <div className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            className="shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors -mt-0.5"
            onClick={onClose}
            aria-label="Fermer la notification"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute left-0 bottom-0 h-1 w-full overflow-hidden rounded-br-lg">
          <div
            ref={barRef}
            className={`h-1 ${barStyles[type]} transition-all dark:opacity-80`}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
