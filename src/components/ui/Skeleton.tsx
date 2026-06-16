import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded bg-black/5 dark:bg-white/5 ${className}`}
      {...props}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className="w-full space-y-4 p-4 bg-card border border-border rounded-xl">
      {/* Header skeleton */}
      <div className="flex space-x-4 border-b border-border pb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows skeletons */}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`r-${r}`} className="flex space-x-4 items-center py-2">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={`c-${c}`} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4 shadow-card">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-1/4 rounded-lg" />
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-card w-full" style={{ height }}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-1/3" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
      <div className="flex items-end justify-between h-[80%] pt-6 gap-2">
        {Array.from({ length: 12 }).map((_, i) => {
          const heights = [30, 45, 60, 25, 70, 50, 40, 65, 80, 35, 55, 60];
          const randomHeight = heights[i % heights.length];
          return (
            <Skeleton
              key={`bar-${i}`}
              className="w-full rounded-t-lg"
              style={{ height: `${randomHeight}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};
