"use server"

import User from "@/app/model/user"
import { connect } from "@/lib/database"
import { auth } from "@clerk/nextjs/server"

export async function getAdmin() {
    await connect()
         
    const {userId}=await auth()
 

    if(!userId){
     
        console.log('Unauthorized')
    }

    const user=await User.findOne({clerkUserId:userId})
      

    if(!user || user.role !== "ADMIN"){
return {authorized:false,reason:"not-admin"}
    }

    return {authorized:true,user}
}