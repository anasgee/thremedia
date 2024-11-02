const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const protectedRoute = async(req,res,next)=>{

    try{
        const token = req.cookies.jwt;
        if(!token){
            res.status(400).json({error:"Unauthorized access detected"});

        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded.userId)

        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;

        next();

    }catch(error){
        res.status(400).json({error:error.message})
        console.log("Auhtentication error " + error.message)
    }
}


module.exports= protectedRoute;