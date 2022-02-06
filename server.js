require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const OeuvreRoutes = require("./routes/oeuvre");

Object.defineProperty(String.prototype, "hashCode", {
  value: function () {
    var hash = 0,
      i,
      chr;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },
});

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) return console.log("Error: ", err);
    console.log(
      "MongoDB Connection -- Ready state is:",
      mongoose.connection.readyState
    );
  }
);

const app = express();

app.use(express.json());

app.use("/uploads", express.static("./uploads"));

// Router
app.use("/oeuvre", OeuvreRoutes);

// Catch middleware error
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ message: "[middleware] " + err.message });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening on port " + listener.address().port);
});
