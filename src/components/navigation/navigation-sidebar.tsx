import currentUser from "@/lib/current-user";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "../ui/modde-toggle";
import { UserButton } from "@clerk/nextjs";


async function NavigationSidebar() {
  const profile = await currentUser();
  if (!profile) {
    redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  
  return (
    <div className="space-y-7 justify-between flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <div className="flex flex-col space-y-4">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
      <ScrollArea className="max-h-[470px]">
        {servers.map((server) => (
            <div key={server.id} className="mb-4">
                <NavigationItem name={server.name} id={server.id} imageUrl={server.imageUrl}/>
            </div>
        ))}
      </ScrollArea>
      </div>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
                avatarBox: "h-[48px] w-[48px]",                
            },
          }}
        />
      </div>
    </div>
  );
}

export default NavigationSidebar;
