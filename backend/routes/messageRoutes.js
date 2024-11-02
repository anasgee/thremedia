const express = require("express");
const { createMessage } = require("../controllers/messageController");
const protectedRoute = require("../middlewares/protectedRoute")

const router = express.Router();


router.post("/",protectedRoute,createMessage);


module.exports = router;
