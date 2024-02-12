const express = require("express");
const authController = require("../controllers/authController");
//const authenticate = require("../Middlerware/authMiddleware");

const router = express.Router();

// Authentication routes
router.post("/signUp", authController.signUp);
router.post("/login", authController.login);



module.exports = router;
