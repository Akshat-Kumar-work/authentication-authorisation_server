const mongoose = require("mongoose");

require("dotenv").config();


const connectWithDB = ()=>{
    mongoose.connect(process.env.DB_URL , {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

.then( ()=>{
    console.log("db connected succesfully")
})
.catch( (err)=>{
    console.log(err)
    err.message,
    process.exit(1);
})
}

module.exports = connectWithDB;