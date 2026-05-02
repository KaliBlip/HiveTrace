import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'CONSUMER',
      },
    });

    // If the user is a producer, create a producer profile
    if (role === 'PRODUCER') {
      const crypto = await import('crypto');
      const verificationHash = crypto.createHash('sha256').update(`${user.id}-${Date.now()}`).digest('hex');

      await prisma.producer.create({
        data: {
          userId: user.id,
          businessName: name,
          location: '',
          verificationHash,
        },
      });
    }

    return NextResponse.json({ 
      message: 'User created successfully',
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
