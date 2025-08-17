import User from "@/app/model/user"
import { connect } from "@/lib/database"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function PUT(request){
  try{

        await connect()

         const {searchParams}=new URL(request.url)
        const role=searchParams.get('role')
        const userId=searchParams.get('id')
 
           
      const {userId:adminId}=await auth()
   
  
      if(!adminId){
       
          console.log('Unauthorized')
      }
  
      const user=await User.findOne({_id:userId})

      if(!user ){
     return NextResponse.json(
        {
             error:"User Not Found"
        }
    )
      }

     const updateUser= await User.findByIdAndUpdate({_id:userId},{$set:{'role':role}})
    
      revalidatePath("/admin/settings")
  if(!updateUser){
    return NextResponse.json(
        {
             error:"User Not Provided"
        }
    )
  }
  return NextResponse.json({
             success:true,
             message:"User Role Updated Successfully",
             data:updateUser
            })
   
  }catch(error){
   return NextResponse.json(
          { error: `Failed to generate update response: ${error.message}` },
          { status: 401 }
        );
  }
}