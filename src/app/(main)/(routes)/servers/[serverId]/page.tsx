import currentUser from "@/lib/current-user";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

async function ServerPage({ params }: ServerIdPageProps) {
  const profile = currentUser();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initalChannel = server?.channels[0];

  if (initalChannel?.name !== "general") {
    return null;
  }
  return redirect(`/servers/${params.serverId}/channels/${initalChannel?.id}`);
}

export default ServerPage;
