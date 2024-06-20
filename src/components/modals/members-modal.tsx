"use client";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { ServerWithMembersWithProfiles } from "../../../types";

function MembersModal() {

  const { onOpen, isOpen, onClose, type, data } = useModal();
  const { server } = data as {server: ServerWithMembersWithProfiles};
  const isModalOpened = isOpen && type === "members"


  function handleClose(){
    onClose()
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
      <div className="p-6">
        All members
      </div>
    </DialogContent>
  </Dialog>
  );
}

export default MembersModal;
