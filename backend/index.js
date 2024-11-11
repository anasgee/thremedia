const express = require("express");
const dotenv = require("dotenv");
const connectDB=  require("./db/connectDB");
const cookieParser = require("cookie-parser");
const userRoutes= require("./routes/userRoutes");
const postRoutes = require('./routes/postRoutes');
const messageRoute =require("./routes/messageRoutes")
const v2 = require("cloudinary")
const cloudinary = v2;
const {server,app}  =require("./socket/socket")
const path  = require("path")


dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();
// console.log();

app.use(cors(
  {
    origin:["https://thremedia.vercel.app"],
    methods:["GET","POST"],
    credentials:true
  }
))  

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret:process.env.API_SECRET 
});
app.use(express.json({limit:'50mb'})); //to parse json data into req.body
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

          


// routes
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/messages',messageRoute);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
}


app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
})

server.listen(PORT,()=>{
    console.log(`Server is listening to the port ${PORT} at localhost`);
})
