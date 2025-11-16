import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
   const session = await auth.api.getSession(request);


    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    const { userType, bio, phone } = await request.json();

    if (userType === "client") {
      // Create client profile
      await prisma.clientProfile.create({
        data: {
          userId: session.user.id,
          bio,
          phone,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting up profile:", error);
    return NextResponse.json(
      { message: "Erro ao configurar perfil" },
      { status: 500 }
    );
  }
}
