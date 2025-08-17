
import User from "@/app/model/user";
import { connect } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        await connect()
        const {searchParams}=new URL(request.url)
        const search=searchParams.get('search')
        console.log(search,"dekho search")


const user=await User.find({name:{$regex:search,$options:'i'}})
    console.log(user,"dekho user")
  
  
    return NextResponse.json({
      success: true,
     user
    });
    }catch(error){
       return NextResponse.json(
         { error: `Failed to fetch user: ${error.message}` },
         { status: 401 }
       );
    }
}