import currentUser from "@/lib/current-user";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentUser();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID is missing", { status: 400 });
    }
    if (name === "general") {
      return new NextResponse("Name cannot be general", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN || MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name: name,
            type: type,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse("CHANNEL_CREATION_ERROR", { status: 500 });
  }
}
