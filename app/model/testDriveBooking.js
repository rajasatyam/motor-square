import mongoose, { SchemaType } from 'mongoose'

const testDriveBookingSchema=new mongoose.Schema({
    carId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:"Car"
    },
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:"User"
    },
    bookingDate:{
        type:mongoose.SchemaTypes.Date,
        required:true
    },
        StartTime:{
        type:String,
        required: true,
 
    validate(value){
         if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error('Invalid time format. Expected HH:MM');
    }
    }
  },
     EndTime: {
    type: String,
    required: true,
     validate(value){
         if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error('Invalid time format. Expected HH:MM');
    }
  }
},
status:{
    type:String,
    enum:{
        values:["PENDING","CONFIRMED","COMPLETED","CANCELLED","NO_SHOW"],
        message:`{VALUE} of status is not valid`
    },
    validate(value){
        if(!["PENDING","CONFIRMED","COMPLETED","CANCELLED","NO_SHOW"].includes(value)){
            throw new Error("Invalid Status Type")
        }
    },
    default:"PENDING"
},
notes:{
    type:String
}


},{timestamps:true})

testDriveBookingSchema.index({carId:1})
testDriveBookingSchema.index({userIdId:1})
testDriveBookingSchema.index({bookingDate:1})
testDriveBookingSchema.index({status:1})


const testDriveBookingModel=(mongoose.models.TestDriveBooking)||mongoose.model("TestDriveBooking",testDriveBookingSchema)

export default testDriveBookingModel
