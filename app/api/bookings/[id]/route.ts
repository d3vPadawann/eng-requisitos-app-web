import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { BookingStatus } from "@prisma/client"
import { auth } from "@/lib/auth";

export async function GET(request: Readonly<NextRequest>, { params }: Readonly<{ params: Promise<{ id: number }> }>) {
  const { id: bookingId } = await params;

  const session = await auth.api.getSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // validate route param
  if (!bookingId) {
    return NextResponse.json({ error: "Booking id is required" }, { status: 400 })
  }

  const booking = await prisma.booking.findUnique({
    where: { id: String(bookingId) },
    include: {
      client: { include: { user: { select: { name: true, email: true } } } },
      engineer: { include: { user: { select: { name: true, email: true } } } },
      availability: true,
    },
  })

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  const userIsClient = booking.client.userId === session.user.id
  const userIsEngineer = booking.engineer.userId === session.user.id

  if (!userIsClient && !userIsEngineer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  return NextResponse.json(booking)
}

export async function PUT(request: Readonly<NextRequest>, { params }: Readonly<{ params: Promise<{ id: number }> }>) {
  const { id: bookingId } = await params;
  const session = await auth.api.getSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { status } = body

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 })
  }

  if (!bookingId) {
    return NextResponse.json({ error: "Booking id is required" }, { status: 400 })
  }

  const booking = await prisma.booking.findUnique({
    where: { id: String(bookingId) },
    include: {
      client: true,
      engineer: true,
    },
  })

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  // Only engineer can update status (or admin in future)
  if (booking.engineer.userId !== session.user.id) {
    return NextResponse.json({ error: "Only the engineer can update booking status" }, { status: 403 })
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: String(bookingId) },
    data: { status: status as BookingStatus },
    include: {
      client: { include: { user: true } },
      engineer: { include: { user: true } },
    },
  })

  return NextResponse.json(updatedBooking)
}
