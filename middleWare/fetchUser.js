const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = (req, res, next) => {
  //fetching auto-token from header
  const token = req.header("autho-token");
  if (!token) {
    return res.status(401).send({ error: "Invalid token" });
  }
  try {
    //verifying the auto-token and fetching data
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    //to handle any internal error
    return res.status(401).send({ error: "Internal Server Error" });
  }
};

module.exports = fetchUser;
