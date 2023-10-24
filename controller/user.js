const client = require("../db/connect");
const {generateUserToken} = require("../middleware/user");
const bcrypt = require("bcryptjs")
const signup = async (req, res) => {
  try {
      const { first_name, last_name, email, mobile_number, country, blood, gender, medical_issue, dob, password } = req.body;
      let enpassword  = await bcrypt.hash(password, 10);
      // Check for required fields
      if (!first_name || !email || !mobile_number || !gender || !dob || !password) {
          return res.status(400).json({ error: "Fill all the required fields" });
      }

      let query = "SELECT * FROM users WHERE email = $1";
      let result = await client.query(query, [email]);

      // Check if email is already registered
      if (result.rows.length > 0) {
          return res.status(400).json({ error: "Email already registered" });
      }

      query = "SELECT * FROM users WHERE mobile_number = $1";
      result = await client.query(query, [mobile_number]);

      // Check if mobile number is already registered
      if (result.rows.length > 0) {
          return res.status(400).json({ error: "Mobile already registered" });
      }

      // Insert user data into the database
      const created_at = new Date(); // Get the current date and time
      const updated_at = new Date(); // Get the current date and time

      const data = await client.query("INSERT INTO users (first_name, last_name, email, mobile_number, country, blood, gender, medical_issue, dob, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning user_id,first_name",
          [first_name, last_name, email, mobile_number, country, blood, gender, medical_issue, dob, enpassword, created_at, updated_at]);
      
        const token = await generateUserToken(data.rows[0].user_id);
      return res.status(201).json({ token: token,user:{...data.rows[0] }});
  } catch (e) {
      console.error(e); // Log the error for debugging
      res.status(500).json({ error: "Internal Server error" });
  }
};


const signin = async (req, res) => {
  try {
      const text = "SELECT * FROM users WHERE email = $1";
      const values = [req.body?.email?.toLowerCase()];
      const data = await client.query(text, values);

      if (data.rowCount === 1) {
          const auth = await bcrypt.compare(req.body.password, data.rows[0].password);

          if (auth) {
              const token = await generateUserToken(data.rows[0].user_id);
              const user = { ...data.rows[0] };
              delete user.password;

              return res.json({
                  token,
                  user,
              });
          } else {
              return res.status(403).json({ error: "Password does not match" });
          }
      } else {
          return res.status(404).json({ error: "No user found with that email" });
      }
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
  }
};


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