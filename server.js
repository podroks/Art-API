require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/oeuvre");

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

app.use("/", routes);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ message: "[middleware] " + err.message });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening on port " + listener.address().port);
});
