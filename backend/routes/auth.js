const express = require("express");
const router = express.Router();
const AuthController = require("../Controller/auth");

router.post("/login", AuthController.login);
router.post("/google-login", AuthController.googleLogin);
router.post("/register", AuthController.register);

module.exports = router;