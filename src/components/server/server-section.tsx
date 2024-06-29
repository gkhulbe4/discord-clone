"use client";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import { ServerWithMembersWithProfiles } from "../../../types";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { Plus, Settings } from "lucide-react";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

function ServerSection({
  sectionType,
  channelType,
  role,
  label,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModal();
  return (
    <div className="flex justify-between items-center py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.USER && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("channel", { channelType })}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Member" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}

export default ServerSection;
