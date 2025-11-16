import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role } = body;

    if (role === "ENGINEER") {
      await prisma.engineerProfile.create({
        data: {
          userId,
          role: "ENGINEER",
        },
      });
    } else {
      await prisma.clientProfile.create({
        data: {
          userId,
          role: "CLIENT",
        },
      });
    }

    return NextResponse.json(
      { message: "Profile created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { message: "Error creating profile" },
      { status: 500 }
    );
  }
}
