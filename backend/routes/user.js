const express = require("express");
const router = express.Router();
const UserController = require("../Controller/user");

router.get("/me", UserController.getCurrentUser);
router.put("/me", UserController.updateCurrentUser);

module.exports = router;