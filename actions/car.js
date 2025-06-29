import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import User from "@/app/model/user"

async function fileToBase64(file){

      const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
        toast.success("image uploaded successfully")
        return reader.result
    }
    reader.onerror = ()=>{
          toast.error("Image Not Uploaded Successfully")
    }
}

export async function processCarImageWithAI(file){
   try{
      if(!process.env.GEMINI_API_KEY){
        throw new Error("Gemini Api is not configured")
      }

      const ai = new GoogleGenAI({});
      const base64Image=await fileToBase64(file)

      const contents = [
  {
    inlineData: {
      mimeType: file.type,
      data: base64Image
    },
  },
  { text:`  Analyze this car image and extract the following information:
      1. Make (manufacturer)
      2. Model
      3. Year (approximately)
      4. Color
      5. Body type (SUV, Sedan, Hatchback, etc.)
      6. Mileage
      7. Fuel type (your best guess)
      8. Transmission type (your best guess)
      9. Price (your best guess)
      9. Short Description as to be added to a car listing

      Format your response as a clean JSON object with these fields:
      {
        "make": "",
        "model": "",
        "year": 0000,
        "color": "",
        "price": "",
        "mileage": "",
        "bodyType": "",
        "fuelType": "",
        "transmission": "",
        "description": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.
   ` },
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
});

const text=response.text()

   const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

try{
const carDetails=JSON.parse(cleanedText)

 const requiredFields = [
        "make",
        "model",
        "year",
        "color",
        "bodyType",
        "price",
        "mileage",
        "fuelType",
        "transmission",
        "description",
        "confidence",
      ];
const carDetailKeys = Object.keys(carDetails);

const missingFields = requiredFields.filter(field => !carDetailKeys.includes(field));

if(missingFields.length>0){
    throw new Error(
        `AI response missing required fields:${missingFields.join(",")}`
    )
}

return {
    success:"true",
    data:carDetails
}

}catch(error){
console.error("Failed to parse AI response",parseError)
return{
 success:false,
 error:"failed to parse AI response"
}
}
   }catch(error){
throw new Error("Gemini API error"+error.message)
   }
}

export async function addCar({carData,images}){

        const {userId}=await auth()
     
    
        if(!userId){
         
            console.log('Unauthorized')
        }
 const user=await User.findOne({clerkUserId:userId})

            if(!user || user.role !== "ADMIN"){
        return {authorized:false,reason:"not-admin"}
            }
    
}