import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const updated = await prisma.engineerProfile.update({
      where: { userId: session.user.id },
      data: {
        bio: data.bio,
        specialties: data.specialties,
        location: data.location,
        hourlyRate: data.hourlyRate,
        yearsOfExp: data.yearsOfExp,
        education: data.education,
        phone: data.phone,
      },
    });

    return NextResponse.json({ engineer: updated });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
