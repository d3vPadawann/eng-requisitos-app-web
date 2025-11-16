import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const availability = await prisma.availability.create({
      data: {
        engineerId: data.engineerId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        isAvailable: data.isAvailable,
      },
    });

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("Error creating availability:", error);
    return NextResponse.json({ error: "Failed to create availability" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await prisma.availability.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting availability:", error);
    return NextResponse.json({ error: "Failed to delete availability" }, { status: 500 });
  }
}
