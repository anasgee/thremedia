const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB=  require("./db/connectDB");
const cookieParser = require("cookie-parser");
const userRoutes= require("./routes/userRoutes");
const postRoutes = require('./routes/postRoutes');
const messageRoute =require("./routes/messageRoutes")
const v2 = require("cloudinary")
const cloudinary = v2;
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

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



app.listen(PORT,()=>{
    console.log(`Server is listening to the port ${PORT} at localhost`);
})
