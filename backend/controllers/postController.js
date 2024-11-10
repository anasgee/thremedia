const User = require("../models/userModel");
const Post = require("../models/postModel");
const v2 = require('cloudinary');
const cloudinary = v2;



const createPost = async(req,res)=>{
    const {postedBy,text} = req.body;
    let {img} =req.body;

    try{
        // const user = await User.findOne(req.user._id);
        if(!postedBy || !text){
            res.status(400).json({error:"PostedBy and text are mandatory"});
        }
        const user = await User.findById(postedBy);
        if(!user){
            res.status(400).json({error:"User Not Found"});
        }

        if(user._id.toString() !== req.user._id.toString()){
            res.status(400).json({error:"You can create post on your profile only"});
        }
        const maxLength = 500;
        if(text.length > maxLength){
            res.status(400).json({error:"Text Length should be less than 500 characters"});
        }
if(img){
    const uploadedResponse = await cloudinary.uploader.upload(img);
    img = uploadedResponse.secure_url;
}

        const newPost = new Post({postedBy,img,text});
        await newPost.save();

        res.status(201).json(newPost)
    }catch(error){
        res.status(400).json({error:error.message});
        // console.log("Something goes wrong in creating post" + error.message );
    }
}


//Get post by id


const getPost = async(req,res)=>{

    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            res.status(400).json({error:"Post not found"});

        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}
        if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}
		else{
            await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
        }
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async(req,res)=>{

    const {id:postId} = req.params;
    const userId = req.user._id;

    try {
        
        const post = await Post.findById(postId);
        if(!post){
		res.status(400).json({ error: "Post not Found"});
        }
    
        const likedPost = post.likes.includes(userId);
        if(likedPost){
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});
            res.status(200).json({ message: "Post unliked successfully" });
        }
        else{
            await post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post liked successfully" }); 

        }
        


    } catch (error) {
        res.status(500).json({
            error:error.message,
                   })
                //    console.log("Error in like / unlike post");
    }


}

//Reply Post

const replyPost =async(req,res)=>{
    const {text} = req.body;
    const {id:postId} = req.params;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

   try {
    
    if(!text){
        res.status(400).json({ error: "Text Field is required" }); 
        
    }
    const post=  await Post.findById(postId);

    if(!post){
        res.status(404).json({ error: "Post Not Found" }); 
    }

    const reply = {text,userId,userProfilePic,username}

    post.replies.push(reply);
    await post.save();
    res.status(201).json(reply); 

   } catch (error) {
    res.status(404).json({ error: error.message}); 
    //    console.log(" Error in replies function"+error.message)
   }
}

//FEED POSTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS

const getFeedPosts = async(req,res)=>{

    try {
        const userId = req.user._id;
        const user  = await User.findById(userId);

    if(!user){
    res.status(404).json({ error: "User not found, please try again"}); 
    }

    const following = user.following;

    const feedPosts = await Post.find({postedBy:{$in:following}}).sort({createdAt:-1});
    res.status(200).json(feedPosts); 
    } 
    catch (error) {
        res.status(500).json({error:error.message}); 
        // console.log( "Error in fetching following posts" + error.message  )
    }
}


const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({error:error.message} );
	}
};



module.exports = {createPost,getPost,deletePost,likeUnlikePost,replyPost,getFeedPosts,getUserPosts}