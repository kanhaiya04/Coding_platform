const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const PORT = 5000;

dotenv.config();

//connecting to db
(async function () {
  try {
    await mongoose.connect(process.env.MongoDB, { useNewUrlParser: true });
    console.log("connected to db");
  } catch (error) {
    console.log("Error in connecting to db");
  }
})();

//middleware
app.use(express.json());

//routers
app.use("/user/", require("./routes/userRoute.js"));
app.use("/question/", require("./routes/questionRoute.js"));

//starting the server
app.listen(PORT || process.env.PORT, () => {
  console.log(`Sever is running at ${PORT}`);
});
