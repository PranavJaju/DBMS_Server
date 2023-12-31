const client = require("../db/connect");
const jwt = require("jsonwebtoken")
exports.isAuthenticated = async (req, res, next) => {
    try {
      let query = "select * from user_token where token = $1";
      const token = req.header("Authorization").replace("Bearer ", "");
      let params = [token];
      const data = await client.query(query, params);
      if (data.rowCount < 1) {
        return res.status(401).json({ error: "Unauthorized user!" });
      }

      const userId = data.rows[0].fk_user;
      //console.log(userId);
      query =
        "SELECT user_id, first_name, last_name, email, mobile_number,blood,dob, created_at, updated_at from users where user_id = $1";
      params = [userId];
      //console.log(params);
      const result = await client.query(query, params);
      

      if (result.rowCount < 1) {
        return res.status(401).json({ error: "Unauthorized user!" });
      }
      req.user = result.rows[0];
      req.token = token;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized user!" });
    }
  };

exports.generateUserToken = async (userId) => {
    console.log(userId);
    try {
      const timestamp = new Date();
      const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET);
      let tokenRecord =
        "insert into user_token(token, is_valid, created_at, updated_at, fk_user) VALUES ($1, $2, $3, $4, $5)";
      let tokenValues = [token, true, timestamp, timestamp, userId];
      await client.query(tokenRecord, tokenValues);
      return token;
    } catch (err) {
      throw new Error(err);
    }
  };