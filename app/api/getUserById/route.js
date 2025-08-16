import User from "@/app/model/user"
import { connect } from "@/lib/database"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(){
  try{
      await connect()
           
      const {userId}=await auth()
      console.log(userId,"yha aa gye")
  
      if(!userId){
       
          console.log('Unauthorized')
      }
  
      const user=await User.findOne({clerkUserId:userId})

      if(!user || user.role !== "ADMIN"){
        throw new Error("Unauthorized:Admin access required")
      }

      const users=await User.find({}).sort({createdAt:-1})
       
      return NextResponse.json({
             success: true,
             data:users
           });
       

    }catch(error){
          return NextResponse.json(
                    { error: `Error Fetching Users: ${error.message}` },
                    { status: 401 }
                  );
    }
}