import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg shadow-lg border text-sm transition-all duration-200 ${
            toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : toast.type === 'warning'
              ? 'bg-amber-900 text-white border-amber-800'
              : toast.type === 'info'
              ? 'bg-stone-900 text-stone-100 border-stone-800'
              : 'bg-emerald-900 text-emerald-50 border-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 shrink-0 text-stone-300" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
            )}
            <span className="font-medium text-xs sm:text-sm">{toast.message}</span>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 hover:opacity-75 transition-opacity ml-2 shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
