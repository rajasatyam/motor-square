import Dealership from "@/app/model/dealership";
import workingHour from "@/app/model/workingHour";
import { connect } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(request){
   
     try{
           await connect();
           
           const dealershipData='dealershipId dayOfWeek openTime closeTime isOpen'
          const dealership = await Dealership.findOne().populate("workingHour",dealershipData)
            console.log(dealership,"dekho dealership")

            if(dealership){
                 return NextResponse.json({
          success: true,
          data:dealership
        });
            }
     if(!dealership){
    console.log("csk aa gye")
    const dealership = await Dealership.create({});
    
    
    const workingHours = await workingHour.insertMany([
      { dayOfWeek: "Monday", openTime: "09:00", closeTime: "18:00", isOpen: true, dealershipId: dealership._id },
      { dayOfWeek: "Tuesday", openTime: "09:00", closeTime: "18:00", isOpen: true, dealershipId: dealership._id },
      { dayOfWeek: "Wednesday", openTime: "09:00", closeTime: "18:00", isOpen: true, dealershipId: dealership._id },
      { dayOfWeek: "Thursday", openTime: "09:00", closeTime: "18:00", isOpen: true, dealershipId: dealership._id },
      { dayOfWeek: "Friday", openTime: "09:00", closeTime: "18:00", isOpen: true, dealershipId: dealership._id },
      { dayOfWeek: "Saturday", openTime: "10:00", closeTime: "16:00", isOpen: true, dealershipId: dealership._id },
      { dayOfWeek: "Sunday", openTime: "10:00", closeTime: "16:00", isOpen: false, dealershipId: dealership._id },
    ]);
    
    
    dealership.workingHour = workingHours.map(w => w._id);
    await dealership.save();
    
    
    const result = await Dealership.findById(dealership._id).populate("workingHour",dealershipData)
     
    
    console.log(result);
    
       return NextResponse.json({
          success: true,
          data:result
        });
    
     }
     
    
    
        }catch(error){
   return NextResponse.json(
           { error: `Failed to generate delaership data: ${error.message}` },
           { status: 401 }
         );
        }
}