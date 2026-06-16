import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Keyboard, X } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

export const CustomDialogs: React.FC = () => {
  const confirmState = useToastStore((state) => state.confirmState);
  const promptState = useToastStore((state) => state.promptState);
  const closeConfirm = useToastStore((state) => state.closeConfirm);
  const closePrompt = useToastStore((state) => state.closePrompt);

  const [promptValue, setPromptValue] = useState('');

  // Sync state for prompt input when prompt modal is opened
  useEffect(() => {
    if (promptState) {
      setTimeout(() => {
        setPromptValue(promptState.defaultValue || '');
      }, 0);
    }
  }, [promptState]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmState) closeConfirm(false);
        if (promptState) closePrompt(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmState, promptState, closeConfirm, closePrompt]);

  return (
    <AnimatePresence>
      {/* Confirmation Dialog */}
      {confirmState?.isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeConfirm(false)}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px]"
          />
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 overflow-hidden z-10"
          >
            <button
              onClick={() => closeConfirm(false)}
              className="absolute top-4 right-4 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-soft-primary rounded-full flex items-center justify-center text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-semibold text-foreground leading-snug">
                  {confirmState.title}
                </h3>
                <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
                  {confirmState.message}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-6">
              {confirmState.cancelText && (
                <button
                  type="button"
                  onClick={() => closeConfirm(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
                >
                  {confirmState.cancelText}
                </button>
              )}
              <button
                type="button"
                onClick={() => closeConfirm(true)}
                className="px-4 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/95 shadow-md hover:shadow-lg rounded-lg transition-all cursor-pointer"
              >
                {confirmState.confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Prompt Dialog */}
      {promptState?.isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closePrompt(null)}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px]"
          />
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 overflow-hidden z-10"
            onSubmit={(e) => {
              e.preventDefault();
              closePrompt(promptValue);
            }}
          >
            <button
              onClick={() => closePrompt(null)}
              className="absolute top-4 right-4 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                closePrompt(promptValue);
              }}
            >
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-soft-info rounded-full flex items-center justify-center text-info">
                  <Keyboard className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-semibold text-foreground leading-snug">
                    {promptState.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
                    {promptState.message}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  autoFocus
                  placeholder={promptState.placeholder}
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  className="w-full px-3.5 py-2 text-[13px] text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex gap-2 justify-end mt-6">
                {promptState.cancelText && (
                  <button
                    type="button"
                    onClick={() => closePrompt(null)}
                    className="px-4 py-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
                  >
                    {promptState.cancelText}
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/95 shadow-md hover:shadow-lg rounded-lg transition-all cursor-pointer"
                >
                  {promptState.confirmText}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
