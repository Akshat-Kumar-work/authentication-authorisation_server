const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        //enum means enn teen value m se hi koi ek hoga , by defining enum hmara role bs y jo 3 value define kri hai unhe hi le skta hai
        enum:["Admin","Student","Visitor"]
    }
})

module.exports = mongoose.model("user", userSchema);