const mongoose=require("mongoose")


const myschema=new mongoose.Schema({
    name:String,
    phoneNumber:Number,
    email:String,
    date:String,
    timing:String

})


module.exports=mongoose.model('Booked_User',myschema,"Booked_User")