import Car from "@/app/model/car"
import userSavedCar from "@/app/model/savedCars"
import User from "@/app/model/user"
import { connect } from "@/lib/database"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(request){
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
              const car=await Car.find({_id:carId})

              if(!car){
                return NextResponse.json({
                    message:"Car does not exist"
                })
              }

              const existingSave=await userSavedCar.find({
                $and:[{'userId':user.id},{carId:carId}]
              })
              console.log(existingSave,"exist")
              
              //if car is already saved remove it

              if(existingSave && existingSave.length>0){
                await userSavedCar.deleteMany({
                    $and:[{'userId':user.id},{carId:carId}]
                })
                revalidatePath("/saved-cars")
                return NextResponse.json({
                    success:true,
                    saved:false,
                    message:"Car removed from favourites"
                })
              }
 

                 await userSavedCar.insertOne({
                    userId:user.id,
                    carId:carId
                 })
               
                 await Car.updateOne({_id:carId},{$addToSet:{savedBy:user._id}})

                 await User.updateOne({_id:user._id},{$addToSet:{savedCars:carId}})
            const finalSavedCars=await userSavedCar.find({
                userId:user.id
            }).populate("userId","name")

                 revalidatePath(`/saved-cars`)
                 return NextResponse.json({
                            success:true,
                            message:"Car Added To Favourite",
                            data:finalSavedCars,
                            saved:true
                           })

    }catch(error){
                   return NextResponse.json({
                    success:false,
              error: `Error Toggling Saved Cars: ${error.message}` ,
                   })
    }
}