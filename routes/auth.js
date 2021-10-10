const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");

//Route Get api/auth
//Description: Check if user is logged in
//Access: Public

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

//Route Post api/auth/login
//Description: Login user
//Access Public

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing user name or password" });
  }

  try {
    //Check for existing user
    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect User Name or Password" });
    }

    //Username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect User Name or Password" });

    //All good we return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.json({
      success: true,
      message: "Login successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "unknow" });
  }
});

router.put("/", verifyToken, async (req, res) => {
  const { userName, surplus, minusValue } = req.body;

  try {
    let updatedUser = {
      userName,
      surplus: surplus - minusValue,
    };
    const updateCondition = { userName: userName };

    updatedUser = await User.findOneAndUpdate(updateCondition, updatedUser, {
      new: true,
    });

    if (!updatedUser)
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    res.json({
      success: true,
      message: "Excellent progress!",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//Route Post api/auth/register
//Description: Register user
//Access Public

router.post("/register", async (req, res) => {
  //Simple Validation
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  }

  try {
    //Check for existing user
    const user = await User.findOne({ userName });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username is already taken" });
    }

    //All good

    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      userName: userName,
      password: hashedPassword,
    });
    await newUser.save();

    //Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.json({
      success: true,
      message: "Congratulation, your account is created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "An error occured while creating account",
    });
  }
});

module.exports = router;
