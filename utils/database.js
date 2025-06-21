import mongoose from "mongoose"

const MONDODB_URL=process.env.MONDODB_URL

if(!MONDODB_URL){
    throw new Error("Please define mongo_uri in env")
}

export async function connectToDataBase(){
    try{
 await mongoose.connect(MONDODB_URL)
 const connection=mongoose.connection
 connection.on('connected',()=>{
    console.log('MONGO_DB CONNECTED')
 })
 connection.on('error',(err)=>{
    console.log("Mongodb connection error"+err)

 })
     const gracefulExit = async () => {
        await mongoose.connection.close();
        process.exit(0);
    }
    process.on("SIGINT", gracefulExit);
    process.on("SIGTERM", gracefulExit);
    }catch(error){
     console.log("Something went wrong in connecting to db")
     console.log(error)
    }
   
}