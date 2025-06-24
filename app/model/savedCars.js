import mongoose from "mongoose";

const userSavedCarSchema=new mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    carId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"Car",
        required:true,
        index:true
    },
  

},{timestamps:true})

userSavedCarSchema.index({userId:1,carId:1},{unique:true})
userSavedCarSchema.index({userId:1})
userSavedCarSchema.index({carId:1})

const userSavedCarSchemaModel=(mongoose.models.UserSavedCar)||mongoose.model("UserSavedCar",userSavedCarSchema)
export default userSavedCarSchemaModel