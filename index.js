const express = require("express");
const server = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

//to parse the json data into js object
server.use(express.json());

const routes = require("./routes/mainRoutes")
server.use("/api/v1",routes);

server.listen(PORT,()=>{
    console.log("server is started");
})

const dbconnect = require("./config/database");
dbconnect();