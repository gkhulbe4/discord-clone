import currentUser from "@/lib/current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  const { serverId } = await req.json();
  const profile = await currentUser();
  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!serverId) {
    return new NextResponse("Server ID is missing", { status: 400 });
  }
  if (!params.memberId) {
    return new NextResponse("Member ID is missing", { status: 400 });
  }
  try {
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
        channels: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    return NextResponse.json(
      { message: "Member kicked", server },
      { status: 200 }
    );
  } catch (error) {
    console.log("[MEMBERS_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  const { serverId, role } = await req.json();
  const profile = await currentUser();
  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!serverId) {
    return new NextResponse("Server ID is missing", { status: 400 });
  }
  if (!params.memberId) {
    return new NextResponse("Member ID is missing", { status: 400 });
  }
  try {
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role: role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
        channels: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    return NextResponse.json(
      { message: "Role changed", server },
      { status: 200 }
    );
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
