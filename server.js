const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");
const clientscontroller = require("./controllers/company");
const authcontroller = require("./controllers/signup");
const bodyParser = require("body-parser");
const multer = require("multer");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/image/", clientscontroller);
app.use("/auth/", authcontroller);
const ATLAS_URI =
  "mongodb+srv://rajeshmn47:uni1ver%40se@cluster0.bpxam.mongodb.net/assignmentimages?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;
mongoose.connect(
  ATLAS_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (error) {
    if (error) {
      console.log("Error!" + error);
    }
  }
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/client/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.get("/", async (req, res) => {
  res.send("API running success");
});

app.get("/pushcategories", async (req, res) => {
  res.send("API running");
});
app.get("/createproduct", async (req, res) => {
  res.send("API running");
});
app.get("/findout", async (req, res) => {
  res.send("API running");
});
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.warn(`App listening on http://localhost:${PORT}`);
});
