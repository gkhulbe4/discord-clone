"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { ServerWithMembersWithProfiles } from "../../../types";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";

const roleMap = {
  USER: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

function MembersModal() {
  const [loadingId, setLoadingId] = useState("");
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const { server } = data as { server: ServerWithMembersWithProfiles };
  const isModalOpened = isOpen && type === "members";

  async function onRoleChange(memberId: string, role: MemberRole) {
    try {
      setLoadingId(memberId);
      const res = await axios.patch(`/api/members/${memberId}`, {
        serverId: server.id,
        role: role,
      });
      if (res.status === 200) {
        router.refresh();
        onOpen("members", { server: res.data.server });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  }

  async function onKick(memberId: string) {
    try {
      setLoadingId(memberId);
      const res = await axios.post(`/api/members/${memberId}`, {
        serverId: server.id,
      });
      if (res.status === 200) {
        router.refresh();
        onOpen("members", { server: res.data.server });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  }

  function handleClose() {
    onClose();
  }

  return (
    <Dialog open={isModalOpened} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6 pl-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold gap-x-1 flex items-center">
                  {member.profile.name}
                  {roleMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profile.id &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  onRoleChange(member.id, "USER");
                                }}
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                User
                                {member.role === "USER" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "MODERATOR")
                                }
                              >
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default MembersModal;
