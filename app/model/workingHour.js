import mongoose from 'mongoose'


const workingHourSchema=new mongoose.Schema({
    dealershipId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"Dealership",
        required:true
    },
    dayOfWeek:{
        type:String,
        enum:{
            values:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            message:`{VALUE} is not a valid day of week`
        },
        trim:true,

    },
    openTime:{
        type:String,
        required: true,
 
    validate(value){
         if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error('Invalid time format. Expected HH:MM');
    }
    }
  },
  closeTime: {
    type: String,
    required: true,
     validate(value){
         if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      throw new Error('Invalid time format. Expected HH:MM');
    }
  }
},
  isOpen: {
    type: Boolean,
    default: true,
  },

}
,{
    timestamps:true
})

workingHourSchema.index({dealershipId:1,dayOfWeek:1},{unique:true})
workingHourSchema.index({isOpen:1})

const workingHourModel=(mongoose.models.WorkingHour)||mongoose.model("WorkingHour",workingHourSchema)

export default workingHourModel
