import Car from "@/app/model/car"
import Dealership from "@/app/model/dealership"
import userSavedCarSchemaModel from "@/app/model/savedCars"
import UserSavedCar from "@/app/model/savedCars"
import TestDriveBooking from "@/app/model/testDriveBooking"
import User from "@/app/model/user"
import { connect } from "@/lib/database"
import { serializedCarData } from "@/lib/helper"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

 export async function GET(request){ 
    try{

    
              await connect()
  const {searchParams}=new URL(request.url)
        const carId=searchParams.get('carId')
        console.log(carId,"dekho search")
       
              const {userId}=await auth()
              console.log(userId,"yha aa gye")
          
              if(!userId){
               return NextResponse.json({
                    message:"User does not exist"
                })
              }
          
              const user=await User.findOne({clerkUserId:userId})
              console.log("dekho user ",user)
              if(!user){
                throw new Error("User Not Found")
              }
              const car=await Car.findById({_id:carId})
                console.log("dekho car",car)
              if(!car){
                return NextResponse.json({
                    message:"Car does not exist"
                })
              }

              let isWishlisted=false

 let wishlisted=new Set()
  
              if(user){
                const savedCars=await UserSavedCar.find({$and:[{userId:user._id},{carId:car._id}]})
                  console.log(savedCars,"saved")
                  const finalData=await UserSavedCar.find({})
                  wishlisted = new Set(finalData.map((saved) => saved.carId.toString()))
                  console.log(wishlisted,"......")
                         
                          const FinalCar=Array.from(wishlisted)
                          console.log(FinalCar,"final")
                          console.log(carId,"id dekh")
               
              if(FinalCar.includes(carId)){
                console.log("thala")
   const serializedCars= serializedCarData(car, wishlisted.has(car._id.toString()))
     
                 console.log(serializedCars,"piyush")
                 isWishlisted=serializedCars.wishlisted
      }
         
              }

              const existingTestDrive=await TestDriveBooking.find({carId:car._id,userId:user._id,status:{$in:['PENDING','CONFIRMED','COMPLETED']}}).sort({createdAt:-1})

              
              let userTestDrive=null
              if(existingTestDrive){
              
              userTestDrive={
                id:existingTestDrive._id,
                status:existingTestDrive.status,
                bookingDate:existingTestDrive.bookingDate
              }
            }
          

const dealership = await Dealership.find({}).populate("workingHour","dealershipId dayOfWeek openTime closeTime isOpen")

console.log(dealership,"dekho dealer")

return NextResponse.json({
    success:true,
    data:{
        ...serializedCarData(car,isWishlisted),
        testDriveInfo:{
          userTestDrive,
          dealership:dealership ? {
            ...dealership,
          
          }:null
        }
    }
}

)

            }catch(error){
                 return NextResponse.json(
                             { error: `Failed to generate user saved car: ${error.message}` },
                             { status: 401 }
                           );
            }

            }