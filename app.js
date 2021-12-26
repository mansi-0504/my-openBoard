 
const express = require("express");
 const socket = require("socket.io");

 const app = express();//initialize the application and server ready

 app.use(express.static("public"));
 let port = process.env.PORT || 5000;
 let server = app.listen(port, ()=>{
     console.log("listening to port " + port);
 })

 let io = socket(server);
 io.on("connection",(socket)=>{
     console.log("made socket");
    //received data from host computer
     socket.on("beginPath", (data)=>{
         //data comng from frontend
         //transfer data through socket to all the connected computers
         io.sockets.emit("beginPath",data);

     })

     socket.on("drawStroke",(data)=>{
         io.sockets.emit("drawStroke",data);
     })

     socket.on("redoUndo",(data)=>{
         io.sockets.emit("redoUndo",data);
     })
 })

 