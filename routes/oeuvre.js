const express = require("express");

const router = express.Router();

const oeuvreController = require("../controllers/oeuvre");

router.get("/oeuvre", oeuvreController.getAllOeuvre);
router.post("/oeuvre", oeuvreController.uploadAdd, oeuvreController.newOeuvre);
router.delete("/oeuvre", oeuvreController.deleteAllOeuvre);

router.get("/oeuvre/:id", oeuvreController.getOneOeuvre);
router.put(
  "/oeuvre/:id",
  oeuvreController.uploadUpdate,
  oeuvreController.updateOneOeuvre
);
router.delete("/oeuvre/:id", oeuvreController.deleteOneOeuvre);

module.exports = router; // export to use in server.js
