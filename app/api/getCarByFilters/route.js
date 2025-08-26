import Car from "@/app/model/car";
import userSavedCar from "@/app/model/savedCars";
import User from "@/app/model/user";
import { connect } from "@/lib/database";
import { serializedCarData } from "@/lib/helper";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
         await connect()
       
        const {searchParams}=new URL(request.url)
        const search=searchParams.get('search')
        const make=searchParams.get('make')
        const bodyType=searchParams.get('bodyType')
        const fuelType=searchParams.get('fuelType')
        const transmission=searchParams.get('transmission')
        const maxPrice=parseFloat(searchParams.get('maxPrice')) || 0;
        const minPrice=parseFloat(searchParams.get('minPrice')) || Number.MAX_SAFE_INTEGER;
        const sortBy=searchParams.get('sortBy') || "newest";
        const page=searchParams.get('page') || 1;
        const limit=searchParams.get('skip') || 6;

        console.log(search,"see search")
        console.log(make,"see make")
        console.log(bodyType,"see bodyType")
        console.log(fuelType,"see fuelType")
        console.log(transmission,"see transmission")

        console.log(search,"dekho search")
               
               const currUser=await currentUser();
              //  console.log(currUser,"dekho current usert")
              //  console.log(currUser.id,"yha aa gye")
           
               if(!currUser){
                
                   console.log('Unauthorized')
               }

               let where={
                status:"AVAILABLE"
               }

               const user=await User.findOne({clerkUserId:currUser.id})
                if(search){
      where.$or=[
        {make:{$regex:search,$options:'i'}},
        {model:{$regex:search,$options:'i'}},
        {color:{$regex:search,$options:'i'}}
      ]
    }

    if(make) where.make={$regex:`${make}$`,$options:'i'}
    if (bodyType) where.bodyType = { $regex: `^${bodyType}$`, $options: "i" };
    if (fuelType) where.fuelType = { $regex: `^${fuelType}$`, $options: "i" };
   if (transmission) where.transmission = { $regex: `^${transmission}$`, $options: "i" };
    if(maxPrice && minPrice) where.price={$gte:minPrice,$lte:minPrice}

let sort={createdAt:1}

if(sortBy === "priceAsc") sort={price:1}
if(sortBy === 'priceDesc') sort={price:-1}

console.log("Final Query:", where, "Sort:", sort);
const car=await Car.find(where).sort(sort).skip((page-1)*limit)
const total = await Car.countDocuments(where);

console.log(car,"see car")
console.log(total,"see total")
let wishlisted=new Set()
    if(user){
        const savedCars=await userSavedCar.find({  userId:user._id }).select("carId")
             wishlisted = new Set(savedCars.map((saved) => saved.carId));
    }

const serializedCars = car.map((car) => serializedCarData(car, wishlisted.has(car._id.toString())) );
    return NextResponse.json({
      success: true,
      data: serializedCars,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
   
    });
    }catch(error){
 console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  
    }
}