import { connect } from "@/lib/database";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import ImageKit from "imagekit"
import { auth } from "@clerk/nextjs/server";
import { getAdmin } from "@/actions/admin";
import Car from "@/app/model/car";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, 
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT 
});


export async function POST(request){
  try{
    await connect()

   const formData= await request.formData()
      console.log(formData,"dekho jo bhja hai")

      const files=formData.getAll("images");
      console.log(files,"file piyush")

      if(!files && files.length===0){
        return NextResponse.error({
            error:"No Files Provided"
        })
      }
      const imageUrls=[]
    for(const file of files){
if(!file){
    return NextResponse.json({error:"No file Provided"},{status:401})
}
if(!file.type.startsWith("image/") ){
    return NextResponse.json({error:"Only images are allowed"})
}

const buffer=await file.arrayBuffer()
const fileBuffer=Buffer.from(buffer)

const originalFilename=file.name
console.log(originalFilename,"original")
const fileExtension=originalFilename.split(".").pop() || ""
console.log(fileExtension,"extension")
const uniqueFilename=`${uuidv4()}.${fileExtension}`
console.log(uniqueFilename,"unique")

const uploadedImage=await imagekit.upload({
    file:fileBuffer,
    fileName:uniqueFilename,
    uniqueFilename:false
})

    console.log("Image uploaded:", uploadedImage);

    imageUrls.push({
    fileId: uploadedImage.fileId,
    url: uploadedImage.url,
   })

     
    } 
 console.log(imageUrls,"see all urls");
    const data={}

    for(const [key,value] of formData.entries())
    {
        if(key==="year" || key==="seats"){
            data[key]=parseInt(value)
        } else if(key==="price"){
            data[key]=parseInt(value)
        }
        else if(key==="featured"){
            data[key]=value === "true"
        }
        else{
            data[key]=value
        }
          
    }

const { make, model, year, price, mileage, color, fuelType, transmission, bodyType, seats, description, status, featured } = data;

    const car=new Car({
        make,
        model,
        year,
        price,
        mileage,
        color,
        fuelType,
        transmission,
        bodyType,
        seats,
        description,
        status,
        featured,
       images:imageUrls
    })

    await car.save();





return NextResponse.json({
   message:"All Data Uploaded Successfully",
   data:car
})

  }
  catch(error){

    console.error("Failed to upload images",error)
    
    
    return NextResponse.json(
      { error: `Failed to upload image ${error.message}` },
      { status: 401 }
    );
    
  }  
}
