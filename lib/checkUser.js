import { currentUser } from "@clerk/nextjs/server"
import { connect } from "./database";
import User from "@/app/model/user";

export const checkUser=async()=>{
    const user=await currentUser();
    if(!user){
        return null;
    }
    console.log(user.id,"user 2 dekh")

    try{
        await connect();
const loggedInUser=await User.findOne({clerkUserId:user.id})

if(loggedInUser){
    return loggedInUser;
}

const newUser=new User({
    clerkUserId:user.id,
    name:`${user.firstName} ${user.lastName}`,
    imageUrl:user.imageUrl,
    email:user.emailAddresses[0].emailAddress,
    role:"ADMIN"
})
    const savedUser= await newUser.save();
    return savedUser;


    }catch(error){
console.log("yha error aya",error)
    }
}