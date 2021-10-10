require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const courseRouter = require("./routes/course");
const cartRouter = require("./routes/cart");

const cors = require("cors");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qft2o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      (err) => {
        if (err) throw err;
        console.log("MongoDB Connected");
      }
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/carts", cartRouter);

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
