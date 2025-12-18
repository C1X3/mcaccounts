import { prisma } from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { affiliateCode, ipAddress } = await request.json();
    
    let affiliateId: string | null = null;
    
    if (affiliateCode) {
      const affiliate = await prisma.affiliate.findFirst({
        where: { 
          code: { equals: affiliateCode, mode: 'insensitive' }, 
          active: true 
        },
      });
      
      if (affiliate) {
        affiliateId = affiliate.id;
      }
    }
    
    await prisma.siteClick.create({
      data: {
        affiliateId,
        ipAddress: ipAddress || null,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking site click:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
