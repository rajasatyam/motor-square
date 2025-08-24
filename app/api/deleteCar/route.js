import Car from "@/app/model/car"
import { NextResponse } from "next/server"

export async function DELETE(request){
    try{
        const {searchParams}=new URL(request.url)
        const id=searchParams.get("id")
   
        const deleteCar=await Car.findByIdAndDelete({_id:id})
        console.log(deleteCar)
         const finalUpdatedCar=await Car.find({})
        if(!deleteCar){
          return NextResponse.json({
               error:"No Car Provided"
           })
        }
        return NextResponse.json({
         success:true,
         message:"Car deleted Successfully",
         data:finalUpdatedCar
        })
        
     }catch(error){
          console.error("Error Deleting Cars",error)
      return NextResponse.json({
       success:false,
       error:error.message
      })
     }

}
