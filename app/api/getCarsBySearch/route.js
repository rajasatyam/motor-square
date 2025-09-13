import Car from "@/app/model/car";
import { serializedCarData } from "@/lib/helper";
import { connect } from "@/lib/database";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/app/model/user";
import userSavedCar from "@/app/model/savedCars";

export async function GET(request){
    try{
        await connect()
        const {searchParams}=new URL(request.url)
        const search=searchParams.get('search')
        console.log(search,"dekho search")
                       const currUser=await currentUser();
                       console.log(currUser,"dekho current usert")
                      
                   
                       if(!currUser){
                        
                           console.log('Unauthorized')
                       }
         const user=await User.findOne({clerkUserId:currUser.id})
 const where={};
    if(search){
      where.$or=[
        {make:{$regex:search,$options:'i'}},
        {model:{$regex:search,$options:'i'}},
        {color:{$regex:search,$options:'i'}}
      ]
    }

    const cars=await Car.find(where).sort({createdAt:-1})
    console.log(cars,"dekho car")


  let wishlisted=new Set()
    if(user){
        const savedCars=await userSavedCar.find({  userId:user._id }).select("carId")
        console.log(savedCars,"save")
             wishlisted = new Set(savedCars.map((saved) => saved.carId.toString()));
    }

const serializedCars = cars.map((car) => serializedCarData(car, wishlisted.has(car._id.toString())) );
    return NextResponse.json({
      success: true,
      serializedCars
    });
    }catch(error){
       return NextResponse.json(
         { error: `Failed to generate car response: ${error.message}` },
         { status: 401 }
       );
    }
}