"use client"
import { Button } from "./ui/button"
import axios from "axios"

interface Props{
    inviteCode: string
}

export default function AcceptInviteBtn({inviteCode}:Props){
    const acceptInvite = async(inviteCode:string) => {
        try{
            await axios.patch(`/api/invite/${inviteCode}`);
        }catch(error){
            console.log("ERROR")
        }
    }
    return (
        <Button onClick={() => acceptInvite(inviteCode)} className="w-full" variant={"primary"}>Accept Invite</Button>
    )
}

