"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ActionTooltip } from "../action-tooltip";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  name: string;
  imageUrl: string;
  id: string;
}

function NavigationItem({ name, id, imageUrl }: NavigationItemProps) {
  const router = useRouter();
  const params = useParams();

  function onClick() {
    router.push("/servers/" + id);
  }

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={() => onClick()} className="group flex items-center relative">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} className="object-cover" alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
}

export default NavigationItem;
