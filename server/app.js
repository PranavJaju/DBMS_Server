const express = require("express")
const app = express();
const cors = require("cors");
app.use(cors());
require("../db/connect");
const userRoutes = require("../routes/user");


app.use("/user",userRoutes);
app.listen(3000,()=>{
    console.log("Server running")
})