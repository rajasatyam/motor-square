import Car from "@/app/model/car";

export async function getCarFilter(){
    const makes=await Car.distinct("make",{'status':'AVAILABLE'}).sort({'price':1})
    
}