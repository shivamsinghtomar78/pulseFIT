"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger";
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  icon?: ReactNode;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onClose,
  icon,
  isLoading = false,
}: ConfirmDialogProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-bg-surface p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: prefersReducedMotion ? 1000 : 500,
              damping: 30,
            }}
          >
            {icon ? (
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-sunken text-pulse">
                {icon}
              </div>
            ) : null}
            <h2
              id="confirm-dialog-title"
              className="font-display text-2xl font-bold text-ink-primary"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-ink-secondary">{body}</p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button
                variant={confirmVariant}
                onClick={onConfirm}
                className="flex-1"
                isLoading={isLoading}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
