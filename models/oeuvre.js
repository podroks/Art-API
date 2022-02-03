const mongoose = require("mongoose"); //import mongoose

// oeuvre schema
const OeuvreSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  keywords: { type: [String], default: [] },
  date: { type: Date, default: Date.now },
  image: {
    src: { type: String, default: "" },
    style: { type: String, default: "" },
  },
  ref: {
    image: {
      src: { type: String, default: "" },
      style: { type: String, default: "" },
    },
  },
  priorityOrder: { type: Number, default: 0 },
});

const Oeuvre = mongoose.model("Oeuvre", OeuvreSchema); //convert to model named Oeuvre
module.exports = Oeuvre; //export for controller use
