import { SkeletonCard } from "@/components/SkeletonCard";

export default function CatalogoLoading() {
  return (
    <div className="w-full bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado Skeleton */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="h-3.5 bg-khaki/30 dark:bg-muted rounded-md w-28 animate-pulse" />
              <div className="h-9 bg-khaki/40 dark:bg-muted rounded-xl w-64 animate-pulse" />
            </div>
            <div className="h-7 bg-khaki/30 dark:bg-muted rounded-full w-36 animate-pulse" />
          </div>
          <div className="h-11 bg-khaki/20 dark:bg-muted rounded-xl max-w-xl animate-pulse" />
        </div>

        {/* Filtros Skeleton */}
        <div className="p-4 rounded-2xl bg-card border border-border h-16 animate-pulse" />

        {/* Grilla con SkeletonCard Reutilizable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SkeletonCard count={8} />
        </div>
      </div>
    </div>
  );
}

