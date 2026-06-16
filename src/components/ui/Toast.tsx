import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastItem, ToastType, useToastStore } from '@/store/useToastStore';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-success" />,
  error: <AlertCircle className="h-5 w-5 text-danger" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning" />,
  info: <Info className="h-5 w-5 text-info" />,
};

const bgColors: Record<ToastType, string> = {
  success: 'bg-[#e6fcf5] border-[#0acf97]/30 text-[#09a074] dark:bg-[#102d28] dark:border-[#10b981]/30 dark:text-[#10b981]',
  error: 'bg-[#fff5f5] border-[#ff5b5b]/30 text-[#e03131] dark:bg-[#2d1215] dark:border-[#ef4444]/30 dark:text-[#ef4444]',
  warning: 'bg-[#fff9db] border-[#f1b53d]/30 text-[#f0a202] dark:bg-[#2d2310] dark:border-[#f1b53d]/30 dark:text-[#f1b53d]',
  info: 'bg-[#eef9fd] border-[#39afd1]/30 text-[#1f87a4] dark:bg-[#10252f] dark:border-[#39afd1]/30 dark:text-[#39afd1]',
};

interface ToastProps {
  toast: ToastItem;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 w-full max-w-sm p-4 rounded-lg border shadow-lg ${bgColors[toast.type]}`}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-[13px] font-medium leading-normal">{toast.message}</div>
      <button
        onClick={() => dismissToast(toast.id)}
        className="flex-shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-current opacity-70 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};
