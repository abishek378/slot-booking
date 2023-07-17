const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const schema = require("./schema");
const port = 7773

const server = () => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(cors());


  app.get("/", async (req, res) => {
    const data = await schema.find();
    res.send(data);
    console.log(data);
  });
  

  app.post("/post", async (req, res) => {
    try {
      const user = new schema({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        date: req.body.date,
        timing: req.body.timing,
      });

      const result = await user.save();
      console.log("posted user", result);
      res.send("Successfully Posted");
    } catch (error) {
      console.error("Error saving user:", error);
      res.send("Internal Server Error");
    }
  });

  app.listen(port, () => {
    console.log("server running on port", port);
  });
};

const url = "mongodb://127.0.0.1:27017/booking_task";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
    server();
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
