const client = require("../db/connect");
const {generateUserToken} = require("../middleware/user");
const signup = async(req,res)=>{
    try{
        const {first_name,last_name,email,mobile_number,country,blood,gender,medical_issue,dob,password} = req.body;
        if(!first_name || !email || !mobile_number || !gender || !dob || !password){
           return  res.status(400).json({error:"Fill all the required fields"});
        }
        let query = "select * from user where email = $1";
        let result = await client.query(query,[email]);
        if(result.rows[0].length>0){
           return res.status(400).json({error:"Email already registered"});
        }
         query = "select * from user where mobile_number = $1";
         result = await client.query(query,[mobile_number]);
        if(result.rows[0].length>0){
            return res.status(400).json({error:"Mobile already registered"});
        }

        result = await client.query("insert into user(first_name,last_name,email,mobile_number,country,blood,gender,medical_issue,dob,password,created_at,updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",
        [first_name,last_name,email,mobile_number,country,blood,gender,medical_issue,dob,password,Date.now(),Date.now()]);
        
        const token = generateUserToken(result.rows[0].id);
        return res.status(201).json({token:token,user:{...result.rows[0]}});

    }catch(e){
        res.status(500).json({error:"Internal Server error"});
    }
};

const signin = async(req,res)=>{
    try{
        text = "select * from users where email = $1";
        values = [req.body?.email?.toLowerCase()];
        const data = await client.query(text, values);
        if (data.rowCount === 1) {
          const auth = await bcrypt.compare(
            req.body.password,
            data.rows[0].password
          );
          if (auth) {
            const token = await generateUserToken(data.rows[0].id);
            const user = data.rows[0];
            delete user.password;
            return res.json({
              token,
              user,
            });
          } else {
            return res
              .status(403)
              .json({ error: "email and password does not match" });
          }
        } else {
          return res.status(404).json({ error: "No user Found" });
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}

const logUserOut = async (req, res) => {
    try {
      const query = "delete from user_token where token = $1";
      const params = [req.token];
      const data = await client.query(query, params);
      if (data.rowCount === 1) {
        return res.status(200).json({ success: "successfully logged out" });
      } else {
        return res.status(500).json({ error: "Unable to log out" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  module.exports = {signin,signup,logUserOut};