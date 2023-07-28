const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  //save the data to the database
  res.send("Hello World");
});
app.post("/api/json", (req, res) => {
  //write req.body.loginFields to a json file

  fs.writeFile("data.json", JSON.stringify(req.body), (err) => {
    console.log(err);
  });
  res.status(200).send({
    message: "Data received",
  });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
