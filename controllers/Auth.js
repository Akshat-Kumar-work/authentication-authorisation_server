const bcrypt = require("bcrypt");
const User = require("../models/user");



//signup route handler
exports.signup = async(req , res)=>{
    try{
        //fetch the data
        const {name , email , password , role } = req.body;

        //check if user already exist , check karo data base m ki jo email request m ayi hai vse koi email db m present hai ya nai
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"user already exist"
            })
        }

        //secure password using hash function present in bcrypt library
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch(err){
            console.log(err)
            return res.status(500),json({
                success:false,
                message:"err in hashing password",
            })
        }

        //create user entry in db 
           const user = await User.create({name,email,password,role});
           return res.status(201).json({
               success:true,
               message:"user created succesfully"
            });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"user cannot register please try again later"
        })
    }
}


//login route handler
exports.login = async (req , res)=>{
    try{

    }
    catch{

    }
}