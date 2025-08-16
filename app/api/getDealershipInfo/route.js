import Dealership from "@/app/model/dealership";
import workingHour from "@/app/model/workingHour";
import { connect } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(request){
   
     try{
           await connect();
           
          const dealership = await Dealership.findOne()
      .populate({
        path: 'workingHour',
        select: 'dayOfWeek',
        options: { sort: { dayOfWeek: 1 } } 
      });
     if(!dealership){
    
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
    
    
    const result = await Dealership.findById(dealership._id)
      .populate({
        path: "workingHour",
        options: { sort: { dayOfWeek: 1 } }
      });
    
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