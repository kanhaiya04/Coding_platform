const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("./../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fetchUser = require("../middleWare/fetchUser");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

//create new user
router.post(
  "/createuser",
  [
    //validation
    body("role", "Can't be null").exists(),
    body("email", "Invalid email").isEmail(),
    body("name", "Min. Length should be 3 char").isLength({ min: 3 }),
    body("password", "Min. Length should be 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }

      //find if email already exists
      let User = await userModel.findOne({ email: req.body.email });
      if (User) {
        return res
          .status(400)
          .json({ success, errors: "Email already exits!" });
      }

      //adding a new user
      const salt = await bcrypt.genSaltSync(10);
      const secPassword = await bcrypt.hashSync(req.body.password, salt);
      User = await userModel.create({
        role:req.body.role,
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
      });
      const data = {
        user: {
          id: User.id,
          role:User.role,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.send({ success: true, authToken,email:req.body.email });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ success, error: "Some internal error occured" });
    }
  }
);

//login endpoint
router.post(
  "/login",
  [
    body("role", "Can't be null").exists(),
    body("email", "Invalid email").isEmail(),
    body("password", "Can't be null").exists(),
  ],
  async (req, res) => {
    var success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password,role } = req.body;
    try {
      let User = await userModel.findOne({ email });
      if (!User) {
        return res
          .status(400)
          .json({ success, errors: "Invalid creds, please try again" });
      }
      if(User.role!==role){
        return res
          .status(400)
          .json({ success, errors: "Invalid creds, please try again" });
      }
      const passCompare = await bcrypt.compare(password, User.password);
      if (!passCompare) {
        return res
          .status(400)
          .json({ success, errors: "Invalid creds, please try again" });
      }
      const data = {
        user: {
          id: User.id,
          role:User.role,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.send({ success: true, authToken,email });
    } catch (error) {
      res.status(500).send({ success, error: "Some internal error occured" });
    }
  }
);

//get user route
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userid = req.user.id;
    const User = await userModel.findById(userid).select("-password");
    res.send({User,role:req.user.role});
  } catch (error) {
    res.status(500).send({ error: "Some internal error occured" });
  }
});

module.exports = router;
