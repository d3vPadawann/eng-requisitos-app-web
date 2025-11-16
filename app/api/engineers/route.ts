import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const engineers = await prisma.engineerProfile.findMany({
      where: {
        isVerified: true, // only show verified engineers
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        rating: "desc", // show highest rated first
      },
    });

    return NextResponse.json({ engineers });
  } catch (error) {
    console.error("Error fetching engineers:", error);
    return NextResponse.json(
      { error: "Failed to fetch engineers" },
      { status: 500 }
    );
  }
}
