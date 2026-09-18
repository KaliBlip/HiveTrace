import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { auth } from '@/lib/auth';

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']);

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || String((session.user as { role?: string }).role).toUpperCase() !== 'VALIDATION_BOARD') {
    return NextResponse.json({ error: 'Only Validation Board members can upload inspection evidence' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files').filter((item): item is File => item instanceof File);
    if (!files.length) return NextResponse.json({ error: 'At least one evidence file is required' }, { status: 400 });

    const evidenceDir = path.join(process.cwd(), 'public', 'uploads', 'inspection-evidence');
    await mkdir(evidenceDir, { recursive: true });
    const urls = await Promise.all(files.map(async (file) => {
      if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) throw new Error(`${file.name} is not an accepted inspection evidence file`);
      const extension = file.name.includes('.') ? file.name.split('.').pop() : file.type.split('/')[1];
      const filename = `evidence-${Date.now()}-${crypto.randomUUID()}.${extension}`;
      await writeFile(path.join(evidenceDir, filename), Buffer.from(await file.arrayBuffer()));
      return `/uploads/inspection-evidence/${filename}`;
    }));
    return NextResponse.json({ urls });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Evidence upload failed' }, { status: 400 });
  }
}
