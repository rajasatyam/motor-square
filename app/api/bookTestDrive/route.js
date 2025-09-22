import Car from "@/app/model/car";
import TestDriveBooking from "@/app/model/testDriveBooking";
import User from "@/app/model/user";
import { connect } from "@/lib/database";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request){
    
  try{
 const {searchParams}=new URL(request.url)
  const carId=searchParams.get('carId')
//   const bookingDate=searchParams.get('bookingDate')
//   const startTime=searchParams.get('startTime')
//   const endTime=searchParams.get('endTime')
//   const notes=searchParams.get('notes')
 const testDriveData=await request.json()
  console.log(testDriveData.notes,"test big data")
  const {date,timeSlot,notes}=testDriveData

  const startTime=timeSlot.split('-')[0]
  const endTime=timeSlot.split('-')[1]
  console.log(startTime,"start")
  console.log(endTime,"end")
    await connect()
const {userId}=await auth()

      if(!userId){
       
          console.log('Unauthorized')
      }
  
      const user=await User.findOne({clerkUserId:userId})

      if(!user || user.role !== "ADMIN"){
        throw new Error("Unauthorized:Admin access required")
      }

      const car=await Car.findOne({_id:carId,status:'AVAILABLE'})

      if(!car) throw new Error("Car not available for test drive")
        
   
        const existingTestDrive=await TestDriveBooking.find({carId:car._id,bookingDate:new Date(date),startTime:startTime,status:{$in:['PENDING','CONFIRMED']}})

        if(existingTestDrive.length>0){
          console.log(existingTestDrive,"exist")
            throw new Error("This time slot is already booked.Please select another time.")
        }

        const booking=new TestDriveBooking({
            carId:carId,
            userId:user._id,
            bookingDate:new Date(date),
            startTime,
            endTime,
            notes:notes || null,
            status:"PENDING"
        })
    
        await booking.save()
        revalidatePath(`test-drive/${carId}`)
        revalidatePath(`/cars/${carId}`)
   return NextResponse.json({
              success:true,
              message:"TestDrive Booked Successfully",
              data:booking
             })
    
             
  }catch(error){
return NextResponse.json(
                    { error: `Error Booking Test Drive: ${error.message}` },
                    { status: 401 }
                  );
  }

}