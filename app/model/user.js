import mongoose from "mongoose";
import validator from "validator";

const userSchema=new mongoose.Schema({
    clerkUserId:{
       type:String,
    required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        default:"https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a valid url",url)
            }
        }
    },
    phone:{
        type:String,
        
    },
    role:{
        type:String,
        enum:{
            values:["USER","ADMIN"],
            message:`{VALUE} is not a valid role`
        },
        default:"User",
        validate(value){
        if(!["USER","ADMIN"].includes(value)){
            throw new Error("Role data is not valid")
        }
        }
    },
     savedCars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSavedCar',
  }],
  testDrives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestDriveBooking',
  }],

},{
    timestamps:true
})

const UserModel = (mongoose.models.User)||mongoose.model("User",userSchema)

export default UserModel;
