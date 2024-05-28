import { auth } from "@clerk/nextjs/server";
import db from "./db";

export default async function currentUser(){
    const {userId} = auth();
    if(!userId){
        return null;
    }
    const profile = await db.profile.findUnique({
        where:{
            user_id: userId
        }
    })
    return profile;
}