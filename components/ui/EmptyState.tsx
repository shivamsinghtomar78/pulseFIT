"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-sunken text-ink-tertiary">
        {icon}
      </div>
      <h3 className="mb-1 text-base font-semibold text-ink-primary">{title}</h3>
      <p className="max-w-xs text-sm text-ink-tertiary">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </motion.div>
  );
}
