"use client";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useOrigin } from "@/hooks/use-origin";

function InviteModal() {

  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [isLoading , setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();
  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const isModalOpened = isOpen && type === "invite"
//   console.log(server)
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
    //   console.log("RESPONSE",response.data);
      onOpen("invite", { server: response.data });
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };


  function handleClose(){
    onClose()
  }
//   console.log("invite ->",isModalOpened)

  return (
    <Dialog open={isModalOpened} onOpenChange={handleClose}>
    <DialogContent className="bg-white text-black p-0 overflow-hidden">
      <DialogHeader className="pt-8 px-6">
        <DialogTitle className="text-2xl text-center font-bold">
          Invite People
        </DialogTitle>
      </DialogHeader>
      <div className="p-6">
        <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
          Server Invite Link
        </Label>
        <div className="flex items-center mt-2 gap-x-2">
          <Input
            disabled={isLoading}
            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
            value={inviteUrl}
          />
          <Button disabled={isLoading} onClick={onCopy} size="icon">
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <Button
          disabled={isLoading}
          onClick={onNew}
          variant="link"
          size="sm"
          className="text-xs text-zinc-500 mt-4"
        >
          <RefreshCw className="w-4 h-4 ml-2" />
          Generate link
        </Button>
      </div>
    </DialogContent>
  </Dialog>
  );
}

export default InviteModal;
