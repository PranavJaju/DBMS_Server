const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/user");
const {getallblood,getactivedonations,receive,show_transcation,donateblood} = require("../controller/transaction");

router.get("/getblood",getallblood);
router.post("/donate",isAuthenticated,donateblood);
router.post("/recieve",isAuthenticated,receive);
router.get("/transcation",isAuthenticated,show_transcation);
router.get("/activeDonation",isAuthenticated,getactivedonations);

module.exports = router;