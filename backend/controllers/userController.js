const User = require("../models/userModel");
const bcrypt = require("bcryptjs")
const generateTokenAndCookie = require("../utils/helper/generateTokenAndCookies");
const mongoose = require('mongoose')

const v2 = require("cloudinary")
const cloudinary = v2;




// *****************************   Get User Profiles   **************************


const getUserProfile=async(req,res)=>{
    
    const {query} = req.params;

    try{
        let user;
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id:query}).select("-password").select("-updatedAt");
        }

        else{
        user = await User.findOne({username:query}).select("-password").select("-updatedAt");
        }

        if(!user){
            res.status(400).json({error:"User not found"})
            console.log('user not found')
        }
        
      else{
        res.status(200).json(user);
      }

    }
    catch(error){
        res.status(500).json({
            error:error.message  })
            console.log("Error in getting user" + error.message)
       }


}




// *****************************     Sign up user **************************


const signupUser =async(req,res)=>{
    const {email,name,username,password} = req.body;
    try{
        const user = await User.findOne({$or:[{email},{username}]})
        if(user){
        return res.status(400).json({error:"User Already Exists"});
        }
        
        const hashpassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name,email,username,password:hashpassword
        });
        
        await newUser.save();
       if(newUser){
        generateTokenAndCookie(newUser._id,res);
        res.status(201).json({
            _id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			username: newUser.username,
			bio: newUser.bio,
			profilePic: newUser.profilePic,
        })
       }else{
           res.status(500).json({error:"invalid user data"})
       }

    }catch(error){
        res.status(500).json({error:error.message})
    }

}
// *****************************     Sign in user **************************

const signinUser =async(req,res)=>{
    
    const {username,password}=req.body;
    try{
            const user = await User.findOne({username});
            const isPasswordCorrect = await bcrypt.compare(password , user?.password || " ");

            if(!user || !isPasswordCorrect){
                res.status(400).json({
                    error: "Invalid username or password" });
            }
            else{
        generateTokenAndCookie(user._id,res);
        res.status(200).json({
            _id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			bio: user.bio,
			profilePic: user.profilePic,

        });}
    }
    catch(error){   
        res.status(400).json({error:error.message});
        console.log(`Error in login ${error.message}`);
    }
    
}

const logoutUser = (req,res)=>{

   try{
    res.cookie("jwt", " ",{expiresIn:1});

    res.status(200).json({message:"Logged out successfully"});
   }catch(err){
       res.status(500).json({
           error:err.message
       })
   }
}


const followUnFollowUser = async(req,res)=>{

    const {id} = req.params;
    try{

        const userToModify = await User.findById(id);
        const currentUser =  await User.findById(req.user._id);

        if(id === req.user._id.toString()){
            res.status(400).json({error:"you cannot follow/unfollow yourself"});
        }
        if(!userToModify || !currentUser ){
            res.status(400).json({error:"User not found"})
        };
//now check if current user is following user to modify
        const isFollowing = currentUser.following.includes(id);
 
        if(isFollowing){
            await User.findByIdAndUpdate(req.user._id,{$pull :{following:id}} );
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
            res.status(200).json({message:"User followed successfully"})

        }else{
            await User.findByIdAndUpdate(req.user._id,{$push :{following:id}} );
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
            res.status(200).json({message:"User unfollowed successfully"})

        }

    }catch(error){
        res.status(400).json({error:error.message});
        console.log(`Error in Follow ${error.message}`);
    }



}




const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let {profilePic} = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id.toString() !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}
        user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;
		

		user = await user.save();

		// Find all posts that this user replied and update username and userProfilePic fields
		// await Post.updateMany(
		// 	{ "replies.userId": userId },
		// 	{
		// 		$set: {
		// 			"replies.$[reply].username": user.username,
		// 			"replies.$[reply].userProfilePic": user.profilePic,
		// 		},
		// 	},
		// 	{ arrayFilters: [{ "reply.userId": userId }] }
		// );

		// // password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};


module.exports={
    signupUser,signinUser,logoutUser,followUnFollowUser,updateUser,getUserProfile
}