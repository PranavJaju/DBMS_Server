const express = require("express")
const app = express();
require("../db/connect");
app.listen(3000,()=>{
    console.log("Server running")
})