const express= require("express");
const router= express.Router();
const protectedRoute = require("../middlewares/protectedRoute")

const {createPost,getPost,deletePost,likeUnlikePost,replyPost,getFeedPosts,getUserPosts} = require("../controllers/postController")

router.get('/feed',protectedRoute,getFeedPosts);
router.get('/:id',getPost);
router.get('/user/:username',getUserPosts);
router.delete('/:id',protectedRoute,deletePost);
router.post('/create',protectedRoute,createPost);
router.put('/like/:id',protectedRoute,likeUnlikePost);
router.put('/reply/:id',protectedRoute,replyPost);



module.exports= router;

