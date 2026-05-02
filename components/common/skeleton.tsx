export function SkeletonCard() {
  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30 animate-pulse">
      <div className="h-6 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      <div className="h-10 bg-muted rounded w-full"></div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded"
          style={{ width: `${80 + Math.random() * 20}%` }}
        ></div>
      ))}
    </div>
  );
}

export function SkeletonBatchCard() {
  return (
    <div className="space-y-4 p-6 border border-border rounded-lg bg-card animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="h-8 bg-muted rounded w-24"></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 bg-muted rounded w-3/4"></div>
            <div className="h-5 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-muted rounded"></div>
        </td>
      ))}
    </tr>
  );
}

export function SkeletonGraph() {
  return (
    <div className="space-y-4 p-6 border border-border rounded-lg bg-card animate-pulse">
      <div className="h-6 bg-muted rounded w-1/4"></div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-8 bg-muted rounded w-12"></div>
            <div
              className="h-8 bg-muted rounded"
              style={{ width: `${30 + Math.random() * 50}%` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBatchCard key={i} />
        ))}
      </div>
    </div>
  );
}
