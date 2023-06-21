const express = require("express");
const router = express.Router();

//importing controllers
const {login , signup} = require("../controllers/Auth")

//login and signup route with route handler
router.post("/login", login)
router.post("/signup", signup)

//importing middlewares
const {isAdminChecker , isStudentChecker , authenticationChecker}  = require("../middlewares/auth")

//authentication route for testing
router.get("/auth",authenticationChecker ,(req ,res)=>{
    res.json({
        success:true,
        message:"authentication is running"
    })
}
)
//student route with middlewares to make student route protected
router.get("/student",authenticationChecker , isStudentChecker , (req ,res)=>{
    res.json({
        success:true,
        message:"welcome student your route is protected or secured",
    })
})

//admin route with middlewares to make admin route protected or secure
router.get("/admin",authenticationChecker , isAdminChecker , (req , res) =>{
    res.json({
        success:true,
        message:"welcome admin your route is protected or secured"
    })
})

module.exports = router;