import User from "@/app/model/user"
import { NextResponse } from "next/server"

export async function PUT(request){
  try{
    const {userId,role}=request.json()
        await connect()
           
      const {userId:adminId}=await auth()
   
  
      if(!adminId){
       
          console.log('Unauthorized')
      }
  
      const user=await User.findOne({clerkUserId:userId})

      if(!user || user.role !== "ADMIN"){
        throw new Error("Unauthorized:Admin access required")
      }

     const updateUser= await User.findByIdAndUpdate({_id:userId},{$set:{'role':role}})
      revalidatePath("/admin/settings")
  if(!updateUser){
    return NextResponse.json(
        {
             error:"No Car Provided"
        }
    )
  }
  return NextResponse.json({
             success:true,
             message:"User Role Updated Successfully",
             data:updateUser
            })
   
  }catch(error){
 return NextResponse.json({
              success:false,
              error:error.message
             })
  }
}