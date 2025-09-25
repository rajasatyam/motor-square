import TestDriveBooking from "@/app/model/testDriveBooking"
import User from "@/app/model/user"
import { connect } from "@/lib/database"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(request){
    try{
await connect()
        const {searchParams}=new URL(request.url)
        const bookingId=searchParams.get("bookingId")
const {userId}=await auth()
   
      if(!userId){
       
          console.log('Unauthorized')
      }
  
      const user=await User.findOne({clerkUserId:userId})

      if(!user){
        throw new Error("User not found in database")
      }

    const booking=await TestDriveBooking.findById(bookingId)
    if(!booking){
        throw new Error("Booking Not Found")
    }
     console.log(booking.userId,"booking user")
     console.log(user._id,"userid")    
    if(booking.userId.toString() !== user._id.toString()){
        throw new Error("Unauthorized to cancel this booking")
    }

    if(booking.status==="CANCELLED") {
        throw new Error("Booking is already cancelled")
    }

        if(booking.status==="COMPLETED") {
        throw new Error("Cannot cancel a completed booking")
    }

    const updatedTestDrive=await TestDriveBooking.updateOne({_id:bookingId},{
        $set:{status:'CANCELLED'}
    })
const updatedData=await TestDriveBooking.findOne({_id:bookingId})
    revalidatePath('/reservations')
    revalidatePath('/admin/test-drives')
        return NextResponse.json({
         success:true,
         message:"Test drive cancelled Successfully",
         data:updatedData
        })

     }catch(error){
          console.error("Error Deleting Test Drive",error)
     return NextResponse.json(
       { success: false, message:error.message },
       { status: 500 }
     );
     }

}
