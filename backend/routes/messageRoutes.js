const express = require("express");
const { createMessage, getMessages ,getConversations} = require("../controllers/messageController");
const protectedRoute = require("../middlewares/protectedRoute")

const router = express.Router();


router.post("/",protectedRoute,createMessage);
router.get("/conversations",protectedRoute,getConversations);
router.get("/:otherUserId",protectedRoute,getMessages);


module.exports = router;