import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-card border border-border border-dashed rounded-xl shadow-card transition-colors my-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-soft-primary text-primary mb-4">
        <Icon className="h-7 w-7 animate-pulse" />
      </div>
      <h3 className="text-[16px] font-semibold text-foreground leading-snug">
        {title}
      </h3>
      <p className="text-[13px] text-muted-foreground mt-2 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-4 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/95 shadow-md hover:shadow-lg rounded-lg transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
