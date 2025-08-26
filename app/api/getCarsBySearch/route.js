import Car from "@/app/model/car";
import { serializedCarData } from "@/lib/helper";
import { connect } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        await connect()
        const {searchParams}=new URL(request.url)
        const search=searchParams.get('search')
        console.log(search,"dekho search")
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
    const serializedCars=cars.map(serializedCarData)
    console.log(serializedCars,"dekho serial")

  
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