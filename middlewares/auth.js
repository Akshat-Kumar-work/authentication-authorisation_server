 
 const jwt = require("jsonwebtoken");
 require("dotenv").config();
 //authenticationChecker middleware
 exports.authenticationChecker = (req,res ,next)=>{
    try{

        //extract jwt token , to extract token we have three ways -> from header , from req.body if token is inserted into the req and from cookies too
        //extracting from req body or cookies or header
       
        const token =  req.body.token|| req.cookies.newlogincookie || req.header("Authorization").replace("Bearer ","");
       
        //if token not available
        if(!token){
            return res.status(401).json({
              success:false,
              message: "token missing",
            })
        }

        //verifying the token from verify method present in jwt library BY passing token and secret key
        //verify method first check the validity of token by matching or comparing the jwt_secret key if key matched
        //it decode the token and return the payload
        try{
            const decode = jwt.verify(token , process.env.JWT_secret);
            console.log(decode);

            //putting decoded token which contain the payload info into request for further authorization for student and admin
            req.user = decode;
        }
        catch(err){
            console.log(err)
            return res.status(401).json({
                success:false,
                message:"token is invalid",
            })
        }

        //this next method is used to go to the next middleware
        next();
    }
    catch(err){
         return res.status(401).json({
            success:false,
            message:"something went wrong while verifying the token"
         })
    }
}

 //isStudentChecker middleware
 exports.isStudentChecker = (req ,res ,next)=>{
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for student"
            })
        }

        next();
    }
    catch{
        return res.status(500).json({
            success:false,
            message:"user role is not matching"
    })
 }
}

 //isAdmin checker middleware
 exports.isAdminChecker = (req , res , next)=>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for admin"
            })
        }
        next()
       
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"user role is not matching"
        })
    }
 }