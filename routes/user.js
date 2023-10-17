const express = require("express");
const router = express.Router();
const {signin,signup,logUserOut} = require("../controller/user")
router.post("/signup",signup);
router.post("/signin",signin);
router.post("/logout",logUserOut);

module.exports = router;