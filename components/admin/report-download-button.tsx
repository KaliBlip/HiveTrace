'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ReportDownloadButtonProps {
  title: string;
  stats: Record<string, number>;
}

export function ReportDownloadButton({ title, stats }: ReportDownloadButtonProps) {
  return (
    <Button
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
      onClick={() => {
        const generatedAt = new Date();
        const rows = Object.entries(stats).map(([metric, value]) => ({
          Metric: metric,
          Value: value,
        }));
        const worksheet = XLSX.utils.json_to_sheet(rows);
        worksheet['!cols'] = [{ wch: 28 }, { wch: 16 }];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Metrics');
        XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_').toLowerCase()}_${generatedAt.toISOString().split('T')[0]}.xlsx`);
      }}
    >
      <Download className="w-4 h-4" />
      Download Report
    </Button>
  );
}
