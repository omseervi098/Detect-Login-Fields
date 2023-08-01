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
  let url = req.body.URL;
  //extract domain name from url
  url = url.split("/")[2];
  let currentTimeSpan = new Date().getTime();
  let folderName = `${url}`;
  let fileName = `${url}-${currentTimeSpan}.json`;
  //create folder if not exist
  fs.mkdir(`Data/${folderName}`, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  //write in Data Folder
  fs.writeFile(
    `Data/${folderName}/${fileName}`,
    JSON.stringify(req.body),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  res.status(200).send({
    message: "Data received",
  });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
