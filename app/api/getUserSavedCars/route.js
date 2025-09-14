import Car from "@/app/model/car";
import userSavedCar from "@/app/model/savedCars";
import User from "@/app/model/user";
import { connect } from "@/lib/database";
import { serializedCarData } from "@/lib/helper";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        await connect()
        const {searchParams}=new URL(request.url)
        const search=searchParams.get('search')
        console.log(search,"dekho search")
                       const currUser=await currentUser();
                       console.log(currUser,"dekho current usert")
          if(!currUser){
                
              return NextResponse.json(
                {error:`Unauthorized`},
                {status:401}
              )
     
               }
 const user=await User.findOne({clerkUserId:currUser.id})

 let wishlisted=new Set()
 const savedCars=await userSavedCar.find({userId:user._id}).sort({createdAt:-1}).select("carId")
   console.log(savedCars,"hello bdcoe")


           console.log(savedCars,"save")
                wishlisted = new Set(savedCars.map((saved) => saved.carId.toString()));
                console.log(wishlisted,"dekho wish")
                const FinalCar=Array.from(wishlisted)
                console.log(FinalCar,"final")

                const car=await Car.find({_id:{$in:FinalCar}})
                console.log("dekho final car",car)
                const serializedCars = car.map((car) => serializedCarData(car, wishlisted.has(car._id.toString())) );
                  return NextResponse.json({
         success: true,
         data: serializedCars,
          
       });
    }catch(error){
 return NextResponse.json(
             { error: `Failed to generate user saved car: ${error.message}` },
             { status: 401 }
           );
    }      
}