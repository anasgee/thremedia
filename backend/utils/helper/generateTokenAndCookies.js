const jwt = require("jsonwebtoken")


const generateTokenAndCookie=(userId,res)=>{

    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"1010101010d"
    });

    res.cookie("jwt",token,{httpOnly:true,expiresIn:1*24*60*60*1000,
    sameSite:"strict"})

    return token;
}

module.exports=generateTokenAndCookie;