const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const socketHandler = require("./socket/socketHandler");
const connectDB = require("./config/database");

require("dotenv").config();


const app = express();


app.use(cors());

app.use(express.json());



connectDB();



const server = http.createServer(app);



const io = new Server(server, {

    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }

});




app.get("/",(req,res)=>{

    res.send("Backend Running...");

});



// IMPORTANT
// only once

socketHandler(io);





const PORT =
process.env.PORT || 8000;



server.listen(PORT,()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});