import { redirect } from "next/navigation";
import currentUser from "@/lib/current-user";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from 'next/link'
import AcceptInviteBtn from "@/components/accept-invite-btn"

interface InviteCodeProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodeProps) => {
  const profile = await currentUser();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  if (!params.inviteCode) {
    return redirect("/");
  }
  console.log(params.inviteCode)

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    // console.log(existingServer)
    return redirect(`/servers/${existingServer.id}`);
  }
  
  const serverDetails = await db.server.findUnique({
    where: {
        inviteCode: params.inviteCode
    }
  })
  if(!serverDetails){
    return <h1>The invite link is either wrong or it is expired</h1>
  }

  return (
    <div className="h-screen flex justify-center items-center">
        <div className="h-max px-16 py-4 border border-gray-700 dark:bg-[#1E1F22] bg-[#E3E5E8] space-y-4">
            <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-gray-400 text-sm">Do you want to join this server?</h1>
                <Image
                className="rounded-full"
                src={serverDetails?.imageUrl}
                alt="SERVER_IMAGE"
                height={66}
                width={66}
                />
                <h1 className="text-white font-bold text-xl">{serverDetails?.name}</h1>
            </div>
            <div className="space-y-2 flex flex-col justify-center items-center">
                <AcceptInviteBtn inviteCode={params.inviteCode}/>
                <Link href="http://localhost:3000" className=" text-sm ">Decline</Link>
            </div>
        </div>
    </div>
  );
};

export default InviteCodePage;
