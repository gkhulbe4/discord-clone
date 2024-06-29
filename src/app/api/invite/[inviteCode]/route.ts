import currentUser from "@/lib/current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request , {params}: {params: {inviteCode: string}}) {
    const profile = await currentUser();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    try {
        const server = await db.server.update({
            where: {
              inviteCode: params.inviteCode,
            },
            data: {
              members: {
                create: [{ profileId: profile.id }],
              },
            },
          });
          return new NextResponse("Successfully invited", {status: 200})
    } catch (error) {
      console.log("SERVER_ID" , error)
      return new NextResponse("Internal Error" , {status: 500})
    }
  }
  