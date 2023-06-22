const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const secretKey = process.env.JWT_secret;


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
           const user = await User.create({name,email,password:hashedPassword,role});
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
        //fetch data from the req body
        const { email , password } = req.body;

        //validation on email and password 
        //agar email aur password m data nahi hai
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"data is not filled please fill the data"
            });
        }

        //check kro user exist karta hai ya nahi, login k lie 
        
        let user =  await User.findOne({email});
        //agar email nahi match hoti toh , if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user does not exist go and sign up first"
            }) 
        }

        //payload for tokens
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }
        
        //agar user exist karta hai toh verify kro password
        //verify password and generate a JWT (json web token) to transfer the email , user id , role as a token in every response to client 
        //to verify password we will use .compare method and pass, password present in request body and hashed password to compare it and verify it
        if(await bcrypt.compare(password , user.password)){

            //if password matched , agar password match hojata hai toh token create kro
            //creating token
            let token = jwt.sign( payload , secretKey , { expiresIn:"3d"});

            //jo info data base se fetch karke dali thi user variable mie ,  us user variable ko object m convert kia toObject() se aur
            //usme token naam ki new entry daldi jo token uppr create kia tha
            user = user.toObject();
            user.token = token;
            //aur uss user object m se password hta dia , data base m se nai htaya password jo user fetch kia hai db m se us se htaya hai kyu ki usko hum as a response send karngy client par toh password nai hona chaie security purposes
            user.password = undefined; 

            //creating options for cookie
            const options = {
                //3 din m expire hojaega cookie 
                expires: new Date(Date.now() + 3* 24 * 60 * 60 * 1000) ,
                //client side p access nai kar skty cookie ko
                httpOnly: true,
            }

            //creating cookie to send cookie as response and in cookie we are sending the token as a data
            //  we can send the token directly as well but to understand the cookie concept we had created one
            //  res.cookie("newlogincookie",token,options).status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:"user logged in succesfully"
            // })
            res.status(200).json({
                success:true,
                token,
                user,
                message:"user logged in succesfully"
            })
        }
        else{
            //when password does not match
            return res.status(403).json({
                success:false,
                message:"password is incorrect"
            })
        }
       

    }
    catch(err){
        console.log(err)
       return res.status(500).json({
            success:false,
            message:"unable to login please try again later"
        })
    }
}