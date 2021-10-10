const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();

const Cart = require("../models/Cart");
const Course = require("../models/Course");

//Route GET api/carts
//Description: Get carts
//Access: Private

router.get("/", verifyToken, async (req, res) => {
  try {
    const carts = await Cart.find({ user: req.userId }).populate("course", [
      "topic",
      "title",
      "lecture",
      "rate",
      "imageUrl",
      "price",
    ]);
    res.json({ success: true, carts });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Route post api/carts
//Description: Create cart
//Access: Private

router.post("/", verifyToken, async (req, res) => {
  const { title } = req.body;

  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Somethings went wrong" });

  const findedCourse = await Course.findOne({ title: title }).populate();

  try {
    const newCart = new Cart({
      course: findedCourse,
      user: req.userId,
    });

    await newCart.save();

    res.json({
      success: true,
      message: "Your cart is created successfully",
      cart: newCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/allcarts", verifyToken, async (req, res) => {
  try {
    const allCartDeleteCondition = { user: req.userId };
    const deletedCarts = await Cart.deleteMany(allCartDeleteCondition);

    //User not authorised
    if (!deletedCarts)
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    res.json({ success: true, carts: deletedCarts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.delete("/", verifyToken, async (req, res) => {
  const { title } = req.body;

  try {
    const cartDeleteCondition = { title: title, user: req.userId };
    const deletedCart = await Cart.findOneAndDelete(cartDeleteCondition);

    //User not authorized or cart not found
    if (!deletedCart)
      return res.status(401).json({
        success: false,
        message: "Cart not found or user is null",
      });
    res.json({ success: true, cart: deletedCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
