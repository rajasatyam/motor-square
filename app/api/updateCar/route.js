import Car from "@/app/model/car"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request){
    try{
  const {searchParams}=new URL(request.url)
  const id=searchParams.get("id")
  const featured=searchParams.get("featured")
  const status=searchParams.get("status")


  console.log(request,"request dekho")
  const updatedData={}

    if (status !== null) {
      updatedData.status = status;
    }
    if (featured !== null) {
      updatedData.featured = featured === "true";
    }

  const updateCar=await Car.findByIdAndUpdate(id,{$set:updatedData}, { new: true })
  if(!updateCar){
    return NextResponse.json(
        {
             error:"No Car Provided"
        }
    )
  }
  console.log(updateCar)

    return NextResponse.json({
           success:true,
           message:"Car Updated Successfully",
           data:updateCar
          })
    }catch(error){
            console.error("Error Deleting Cars",error)
             return NextResponse.json({
              success:false,
              error:error.message
             })
    }
}