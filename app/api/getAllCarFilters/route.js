import Car from "@/app/model/car";
import { connect } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(){
    try{
       await connect()
    //    const makes=await Car.distinct("make",{'status':'AVAILABLE'}).sort({'price':1})

    {/* aggregate by car makes */ }
const makes=await Car.aggregate([
    {
        $match:{'status':'AVAILABLE'}
    },
    {
       $group:{
        _id:"$make",
  
       }
    },
     {
      $sort:{_id:1}
    },

      { 
        $group:{
         _id: null,
       makes: { $addToSet: "$_id" } }
    }, 
    {
        $project:{
            _id:0,
            makes:1
        }
    },
   
   
   
])

const bodyType=await Car.aggregate([
    {
        $match:{'status':'AVAILABLE'}
    },
    {
       $group:{
        _id:"$bodyType",
  
       }
    },
     {
      $sort:{_id:1}
    },

      { 
        $group:{
         _id: null,
       bodyTypes: { $addToSet: "$_id" } }
    }, 
    {
        $project:{
            _id:0,
             bodyTypes:1
        }
    },
   
   
   
])

const fuelType=await Car.aggregate([
    {
        $match:{'status':'AVAILABLE'}
    },
    {
       $group:{
        _id:"$fuelType",
  
       }
    },
     {
      $sort:{_id:1}
    },

      { 
        $group:{
         _id: null,
       fuelTypes: { $addToSet: "$_id" } }
    }, 
    {
        $project:{
            _id:0,
             fuelTypes:1
        }
    },
   
   
   
])

const transmission=await Car.aggregate([
    {
        $match:{'status':'AVAILABLE'}
    },
    {
       $group:{
        _id:"$transmission",
  
       }
    },
     {
      $sort:{_id:1}
    },

      { 
        $group:{
         _id: null,
       transmissions: { $addToSet: "$_id" } }
    }, 
    {
        $project:{
            _id:0,
             transmissions:1
        }
    },
   
   
   
])

const priceAggregations=await Car.aggregate([
    {$match:{'status':'AVAILABLE'}},
   {
    $group:{
        _id:null,
       maxPrice: { $max: { $toDouble: "$price" } },
       minPrice: { $min: { $toDouble: "$price" } }

    }
   }, {
    $project: {
      _id: 0,
      maxPrice: 1,
      minPrice: 1,
 
    }
  }
]
)
       console.log(makes[0]?.makes)
        return NextResponse.json({
      success: true,
      data:{
        make:makes[0]?.makes,
        bodyType:bodyType[0]?.bodyTypes,
        fuelType:fuelType[0]?.fuelTypes,
        transmission:transmission[0]?.transmissions,
        priceRange:priceAggregations
      }
    });
    }catch(error){
         return NextResponse.json(
                 { error: `Failed to get car filters : ${error.message}` },
                 { status: 401 }
               );
    }
    
}