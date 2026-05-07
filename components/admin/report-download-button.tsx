'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ReportDownloadButtonProps {
  title: string;
  stats: Record<string, number>;
}

export function ReportDownloadButton({ title, stats }: ReportDownloadButtonProps) {
  return (
    <Button
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
      onClick={() => {
        const blob = new Blob(
          [JSON.stringify({ title, generatedAt: new Date().toISOString(), stats }, null, 2)],
          { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }}
    >
      <Download className="w-4 h-4" />
      Download Report
    </Button>
  );
}
