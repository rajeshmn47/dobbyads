const User = require("../models/user");
const crypto = require("crypto");
var express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const salt = bcrypt.genSaltSync(10);
const server_secret_key =
  "iamrajesh675gjhchshskijdiucacuijnuijniusjiudjcsdijcjsijcisjijsoisju";
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const catchasyncerror = require("../catchasyncerrors");
const ErrorHandler = require("../errorhandler");
const { OAuth2Client } = require("google-auth-library");
// Register a User
router.post(
  "/register",
  catchasyncerror(async (req, res, next) => {
    console.log("hi boy");
    console.log(req.body);
    const { username, password, email } = req.body;
    var passwordToSave = bcrypt.hashSync(password, salt);
    console.log(passwordToSave);

    const user = await User.create({
      username: username,
      password: passwordToSave,
      email: email,
    });
    const server_token = jwt.sign({ uid: user._id }, server_secret_key);
    res.status(200).json({
      success: true,
      user,
      server_token,
    });
  })
);

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

router.get(
  "/loaduser",
  checkloggedinuser,
  catchasyncerror(async function (req, res, next) {
    console.log(req.headers);
    console.log(req.body.uidfromtoken);
    const user = await User.find({ _id: { $eq: req.body.uidfromtoken } });
    res.status(200).json({
      message: user,
    });
  })
);

router.post(
  "/login",
  catchasyncerror(async function (req, res, next) {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(req.body);
    // checking if user has given password and email both

    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const server_token = jwt.sign({ uid: user._id }, server_secret_key);
    res.status(200).json({
      success: true,
      user,
      server_token,
    });
  })
);

const client = new OAuth2Client(
  "711974125982-gaeieriu9q60ctbps2qpbjitv0374d7l.apps.googleusercontent.com"
);

const clientId =
  "711974125982-gaeieriu9q60ctbps2qpbjitv0374d7l.apps.googleusercontent.com";

router.post(
  "/googlelogin",
  catchasyncerror(async function (req, res, next) {
    var tokenId = req.body.tokenId;
    var verifyObject = {};
    verifyObject.idToken = tokenId;
    verifyObject.audience = clientId;
    var response = await client.verifyIdToken(verifyObject);
    const { email_verified } = response.payload;
    if (email_verified) {
      console.log(response.payload);
      const usert = await User.findOne({
        username: { $eq: response.payload.name },
      });
      if (usert) {
        usert.profilePicture = response.payload.picture;
        await usert.save();
        const server_token = jwt.sign({ uid: usert._id }, server_secret_key);
        res.status(200).json({
          success: true,
          usert,
          server_token,
        });
      } else {
        const user = await User.create({
          username: response.payload.name,
          password: "passwordtosave",
          profilePhoto: response.payload.picture,
        });
        console.log(response.payload);
        const server_token = jwt.sign({ uid: user._id }, server_secret_key);
        res.status(200).json({
          success: true,
          user,
          server_token,
        });
      }
    } else {
      res.json({
        status: 403,
        message: "Email Not Verified, use another method to login!",
      });
    }
  })
);

router.get(
  "/getoneuser/:id",
  catchasyncerror(async function (req, res, next) {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      message: user,
    });
  })
);

module.exports = router;
