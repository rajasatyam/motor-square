import Dealership from "@/app/model/dealership";
import workingHour from "@/app/model/workingHour";
import { NextResponse } from "next/server";

export async function POST(request){
    
  try{
    const {workingHours}=request.json()
    await connect()

    const dealership=await Dealership.findOne()
    if(!dealership){
      throw new Error("Dealership not found")
    }
      
   await workingHour.deleteMany({ dealershipId: dealership._id });
    
       const docs = workingHours.map(hour => ({
      dayOfWeek: hour.dayOfWeek,
      openTime: hour.openTime,
      closeTime: hour.closeTime,
      isOpen: hour.isOpen,
      dealershipId: dealership._id,
    }));

    const inserted = await workingHour.insertMany(docs);

       
    dealership.workingHours = inserted.map(w => w._id);
    await dealership.save();

   
    revalidatePath("/admin/settings");
    revalidatePath("/");

   return NextResponse.json({
              success:true,
              message:"Saved Dealership Working Hour",
              data:dealership
             })
    
  }catch(error){
return NextResponse.json(
                    { error: `Error Saving Working Hour: ${error.message}` },
                    { status: 401 }
                  );
  }

}