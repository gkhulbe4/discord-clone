import currentUser from "@/lib/current-user";
import db from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from './server-header';

interface ServerSidebarProps {
  serverId: string;
}

async function ServerSidebar({ serverId }: ServerSidebarProps) {

  const profile = await currentUser();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where:{
        id: serverId 
    },
    include:{
        members:{
            include: {
                profile: true
            },
            orderBy:{
                role: "asc"
            }
        },
        channels:{
            orderBy:{
                createdAt: "asc"
            }
        }
    },
  })

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
  const members = server?.members.filter((member) => member.profileId !== profile.id)
  const role = server?.members.find((member) => member.profileId === profile.id)?.role

  if(!server) return redirect("/");

  return(
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader
        server={server}
        role={role}
        />
    </div>
  )
}

export default ServerSidebar;
