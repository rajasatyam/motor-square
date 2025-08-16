import Dealership from "@/app/model/dealership";
import User from "@/app/model/user";
import workingHourModel from "@/app/model/workingHour";

import workingHour from "@/app/model/workingHour";
import { connect } from "@/lib/database";
import { auth } from "@clerk/nextjs/dist/types/server";
import { revalidatePath } from "next/cache";

export async  function getDealershipInfo(){
    
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


dealership.workingHours = workingHours.map(w => w._id);
await dealership.save();


const result = await Dealership.findById(dealership._id)
  .populate({
    path: "workingHours",
    options: { sort: { dayOfWeek: 1 } }
  });

console.log(result);

return {
success:true,
data:result
}

 }

    }catch(error){
throw new Error("Error fetching dealership info:" +error.message)
    }



}


export async function saveWorkingHours(workingHours){
    
  try{
    await connect()

    const dealership=await Dealership.findOne()
    if(!dealership){
      throw new Error("Dealership not found")
    }
      
   await workingHourModel.deleteMany({ dealershipId: dealership._id });
    
       const docs = workingHours.map(hour => ({
      dayOfWeek: hour.dayOfWeek,
      openTime: hour.openTime,
      closeTime: hour.closeTime,
      isOpen: hour.isOpen,
      dealershipId: dealership._id,
    }));

    const inserted = await workingHourModel.insertMany(docs);

       
    dealership.workingHours = inserted.map(w => w._id);
    await dealership.save();

   
    revalidatePath("/admin/settings");
    revalidatePath("/");

    return {
success:true,
data:dealership
}
    
  }catch(error){
    throw new Error("Error saving the working Hours:" +error.message)
  }

}

export async function getUser(){
  try{
      await connect()
           
      const {userId}=await auth()
   
  
      if(!userId){
       
          console.log('Unauthorized')
      }
  
      const user=await User.findOne({clerkUserId:userId})

      if(!user || user.role !== "ADMIN"){
        throw new Error("Unauthorized:Admin access required")
      }

      const users=await User.find({}).sort({createdAt:-1})
       
      return {
        success:true,
        data:users
      }

    }catch(error){
          throw new Error("Error Fetching Users:" +error.message)
    }
}

export async function updateUserRole(userId,role){
  try{
        await connect()
           
      const {userId:adminId}=await auth()
   
  
      if(!adminId){
       
          console.log('Unauthorized')
      }
  
      const user=await User.findOne({clerkUserId:userId})

      if(!user || user.role !== "ADMIN"){
        throw new Error("Unauthorized:Admin access required")
      }

      await User.findByIdAndUpdate({_id:userId},{$set:{'role':role}})
      revalidatePath("/admin/settings")


    return {
      success:true
    }
  }catch(error){
    throw new Error("Error Updating user:" + error.message)
  }
}