const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  amount: {
    type: Number,
    default: 1,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "courses",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("carts", CartSchema);
