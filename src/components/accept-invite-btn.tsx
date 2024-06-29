"use client"
import { useState } from "react"
import { Button } from "./ui/button"
import axios from "axios"
import { useRouter } from "next/navigation";
interface Props{
    inviteCode: string
}

export default function AcceptInviteBtn({inviteCode}:Props){
    const [loading , setLoading] = useState(false) 
    const router = useRouter();
    const acceptInvite = async(inviteCode:string) => {
        setLoading(true)
        try{
            const res = await axios.patch(`/api/invite/${inviteCode}`);
            if(res.status === 200){
                router.refresh()
            }
        }catch(error){
            console.log("ERROR")
        }finally{
            setLoading(false)
        }
    }
    return (
        <Button disabled={loading} onClick={() => acceptInvite(inviteCode)} className="w-full" variant={"primary"}>Accept Invite</Button>
    )
}

