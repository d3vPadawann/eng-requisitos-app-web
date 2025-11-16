import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    // Get client profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientProfile) {
      return NextResponse.json(
        { message: "Perfil de cliente não encontrado" },
        { status: 404 }
      );
    }

    const { engineerId, availabilityId, description, amount, startTime, endTime } =
      await request.json();

    // Validate availability is still available
    const availability = await prisma.availability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability || !availability.isAvailable) {
      return NextResponse.json(
        { message: "Esse horário não está mais disponível" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        clientId: clientProfile.id,
        engineerId,
        availabilityId,
        description,
        amount,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "PENDING",
      },
    });

    // Mark availability as unavailable
    await prisma.availability.update({
      where: { id: availabilityId },
      data: { isAvailable: false },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { message: "Erro ao criar agendamento" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    // Get client profile and their bookings
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        bookings: {
          include: {
            engineer: {
              include: {
                user: {
                  select: { name: true },
                },
              },
            },
          },
          orderBy: { startTime: "desc" },
        },
      },
    });

    if (!clientProfile) {
      return NextResponse.json(
        { message: "Perfil de cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(clientProfile.bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
}
