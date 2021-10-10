const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Course = require("../models/Course");

//Route Get api/courses
//Description: Get all courses
//Access: Public

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({ user: null });
    return res.json({ success: true, courses });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

//Route Get api/yourcourses
//Description: Get user cousres
//Access: Private

router.get("/mycourse", verifyToken, async (req, res) => {
  try {
    const newCourses = await Course.find({ user: req.userId }).populate(
      "user",
      ["userName"]
    );
    res.json({ success: true, newCourses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Route Post api/courses
//Description: Create course
//Access: Private

router.post("/", verifyToken, async (req, res) => {
  const { topic, title, lecture, rate, imageUrl, price } = req.body;

  //Simple validation

  if (!title || !lecture || !imageUrl || !price) {
    return res
      .status(400)
      .json({ success: false, message: "You missing something" });
  }

  try {
    const newCourse = new Course({
      topic: topic,
      title: title,
      lecture: lecture,
      rate: rate,
      imageUrl: imageUrl,
      price: price,
      user: req.userId,
    });

    await newCourse.save();

    return res.json({
      success: true,
      message: "Your course is created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const getCourseCondition = { _id: req.params.id };
    const tempCourse = await Course.findOne(getCourseCondition);
    //User not authorised or course not found
    if (!tempCourse)
      return res.status(401).json({
        success: false,
        message: "Course not found or user not authorised",
      });
    res.json({ success: true, course: tempCourse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
