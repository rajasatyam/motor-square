import testDriveBookingModel from "@/app/model/testDriveBooking";
import User from "@/app/model/user";
import { connect } from "@/lib/database";
import { serializedCarData } from "@/lib/helper";
import { auth } from "@clerk/nextjs/server";

export async function GET(request){
   
     try{
      await connect();
           
        const {userId}=await auth()

      if(!userId){
       
          console.log('Unauthorized')
      }
  
      const user=await User.findOne({clerkUserId:userId})

      const booking=await testDriveBookingModel.find({userId:user._id}).sort({bookingDate:-1}).populate("carId")

    
        const formatBooking=booking.map((booking)=>(
            {
            id:booking._id,
            carId:booking.carId,
            car:serializedCarData(booking.car),
            bookingDate:booking.bookingDate,
            startTime:booking.startTime,
            endTime:booking.endTime,
            status:booking.status,
            notes:booking.notes


        }))
               return NextResponse.json({
          success: true,
          data:formatBooking
        });
     }
     
    
    
        catch(error){
   return NextResponse.json(
           { error: `Failed to fetch user test drive: ${error.message}` },
           { status: 401 }
         );
        }
}