import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const engineers = await prisma.engineerProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        activities: true, // include activities with specific prices
        projects: true, // include previous projects
      },
      orderBy: {
        rating: "desc", // show highest rated first
      },
    })

    return NextResponse.json({ engineers })
  } catch (error) {
    console.error("Error fetching engineers:", error)
    return NextResponse.json({ error: "Failed to fetch engineers" }, { status: 500 })
  }
}
