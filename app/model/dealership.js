import mongoose from "mongoose";

const dealershipSchema=new mongoose.Schema({
name:{
    type:String,
    default:"Vehiql Motors"
},
address:{
    type:String,
    default:"69 Car Street,AutoVille,CA 69420"
},
phone:{
    type:String,
    default:"(+1 (555) 123-4567)"
},
email:{
    type:String,
    default:"contact@vehiql.com"
},
workingHour: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkingHour',
  }],

},{
    timestamps:true
})

const dealershipModel=(mongoose.models.Dealership)||mongoose.model("Dealership",dealershipSchema)
export default dealershipModel