import mongoose from 'mongoose'

const carSchema=new mongoose.Schema({
    make:{
        type:String,
        required:true,
        index:true

    },
    model:{
     type:String,
     required:true,
     index:true
    },
    year:{
        type:mongoose.SchemaTypes.Int32,
        required:true,
        index:true
    },
    price:{
        type:String,
        required:true,
        index:true
    },
    mileage:{
        type:String,
        required:true,
    
    },
    color:{
    type:String,
    },
    fuelType:{
        type:String,
        index:true
    },
    transmission:{
     type:String
    },
    bodyType:{
        type:String
    },
    seats:{
        type:mongoose.SchemaTypes.Int32
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:{
            values:["AVAILABLE","UNAVAILABLE","SOLD"],
            message:`{VALUE} is not a valid status`
        },
        index:true
    },
    featured:{
        type:Boolean,
        default:"false",
        index:true
    },
    images:[
          {
    fileId: { type: String, required: true },
    url: { type: String, required: true },

  }
    ],
   savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSavedCar',
  }],
    testDriveBookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestDriveBooking',
    }],


},{
    timestamps:true
})

const carModel=(mongoose.models.Car)||mongoose.model("Car",carSchema)

export default carModel
