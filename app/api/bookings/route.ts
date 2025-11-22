import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);

    console.log("[v0] Creating booking - Session user:", session?.user?.id)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 })
    }

    // Get client profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
    })

    console.log("[v0] Client profile found:", !!clientProfile)

    if (!clientProfile) {
      return NextResponse.json({ message: "Perfil de cliente não encontrado" }, { status: 404 })
    }

    const { engineerId, availabilityId, description, amount, startTime, endTime } = await request.json()

    console.log("[v0] Booking data:", { engineerId, availabilityId, amount })

    // Validate availability is still available
    const availability = await prisma.availability.findUnique({
      where: { id: availabilityId },
    })

    console.log("[v0] Availability found:", !!availability, "isAvailable:", availability?.isAvailable)

    if (!availability || !availability.isAvailable) {
      return NextResponse.json({ message: "Esse horário não está mais disponível" }, { status: 400 })
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
    })

    console.log("[v0] Booking created:", booking.id)

    // Mark availability as unavailable
    await prisma.availability.update({
      where: { id: availabilityId },
      data: { isAvailable: false },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ message: "Erro ao criar agendamento" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 })
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
    })

    if (!clientProfile) {
      return NextResponse.json({ message: "Perfil de cliente não encontrado" }, { status: 404 })
    }

    return NextResponse.json(clientProfile.bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ message: "Erro ao buscar agendamentos" }, { status: 500 })
  }
}
