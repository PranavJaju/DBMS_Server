const express = require("express")
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
app.use(cors());
const client = require("./db/connect")
client.connect().then(() => console.log("connected"))
.catch((err) => console.error("connection error", err.stack));
const userRoutes = require("./routes/user");
const bloodRoutes = require("./routes/donate-receive");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/",userRoutes);
app.use("/",bloodRoutes);
app.listen(5000,()=>{
    console.log("Server running")
})