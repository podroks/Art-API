const express = require("express");

const router = express.Router();

const oeuvreController = require("../controllers/oeuvre");
const oeuvreMiddleware = require("../middleware/oeuvre");

router.get("/", oeuvreController.getAllOeuvre);
router.post("/", oeuvreMiddleware.uploadAdd, oeuvreController.newOeuvre);
router.delete("/", oeuvreController.deleteAllOeuvre);

router.get("/:id", oeuvreController.getOneOeuvre);
router.put(
  "/:id",
  oeuvreMiddleware.uploadUpdate,
  oeuvreController.updateOneOeuvre
);
router.delete("/:id", oeuvreController.deleteOneOeuvre);

module.exports = router; // export to use in server.js
