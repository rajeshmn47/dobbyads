const Client = require("../models/client");
const bodyParser = require("body-parser");
var express = require("express");
const server_secret_key =
  "iamrajesh675gjhchshskijdiucacuijnuijniusjiudjcsdijcjsijcisjijsoisju";
const jwt = require("jsonwebtoken");

const router = express.Router();

function checkloggedinuser(req, res, next) {
  console.log(req.headers);
  const { authorization } = req.headers || req.headers;
  const tokenHeader = authorization.split(" ")[1];
  if (tokenHeader) {
    jwt.verify(tokenHeader, server_secret_key, function (err, decoded) {
      if (!err) {
        req.body.uidfromtoken = decoded.uid;
        console.log("rajesh");
      }
      next();
    });
  } else {
    res.status(200).json({
      success: false,
    });
  }
}

router.get("/getallclients", checkloggedinuser, async function (req, res) {
  console.log(req.query.page);
  const page = req.query.page ? req.query.page : 1;
  console.log("rajesh");
  const clients = await Client.find({ userId: req.body.uidfromtoken });
  res.status(200).json({
    clients: clients,
  });
});

router.post("/createimage", checkloggedinuser, async function (req, res) {
  console.log("i am rajesh");
  const { name, uidfromtoken, image } = req.body;
  const user = Client({
    name: name,
    image: image,
    userId: uidfromtoken,
  });
  await user.save();

  res.status(200).json({
    clients: "useddr",
  });
});

router.post("/editimage", checkloggedinuser, async function (req, res) {
  console.log(req.body, "req.boidy");
  const images = await Client.findById(req.body._id);
  const { name, image, uidfromtoken } = req.body;
  images.name = name;
  images.userId = uidfromtoken;
  images.image = image;
  await images.save();
  res.status(200).json({
    users: "user",
    id: req.body,
  });
});

router.get("/deleteimage/:id", async function (req, res) {
  console.log(req.params.id, "rajeshhgffddasddfg");
  const user = await Client.findById(req.params.id);
  await user.remove();
  res.status(200).json({
    deleted: "ok",
    id: req.params.id,
  });
});

router.get("/getonequestion/:id", async (req, res, next) => {
  console.log(req.params.d);
  res.status(200).json({
    success: true,
    id: req.params.id,
  });
});

module.exports = router;
