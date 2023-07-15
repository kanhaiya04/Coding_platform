const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const PORT=5000;

dotenv.config();

(async function () {
  try {
    await mongoose.connect(process.env.MongoDB, { useNewUrlParser: true });
    console.log("connected to db");
  } catch (error) {
        console.log("Error in connecting to db");
  }
})();

app.use(express.json());

app.use("/user/",require("./routes/userRoute.js"))

app.listen(PORT|| process.env.PORT,()=>{
        console.log(`Sever is running at ${PORT}`);
})
