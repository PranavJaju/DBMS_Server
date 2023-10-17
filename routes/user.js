const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/user");
const {signin,signup,logUserOut} = require("../controller/user")
router.post("/signup",signup);
router.post("/signin",signin);
router.post("/logout",isAuthenticated,logUserOut);

module.exports = router;