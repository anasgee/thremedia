const express = require("express");
const {signupUser,signinUser,logoutUser,followUnFollowUser,updateUser,getUserProfile,suggestedUsers} =require("../controllers/userController")
const protectedRoute = require("../middlewares/protectedRoute")


const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get('/suggested',protectedRoute,suggestedUsers)
router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/signout", logoutUser);
router.post("/follow/:id",protectedRoute, followUnFollowUser);
router.put("/update/:id",protectedRoute, updateUser);


module.exports = router;