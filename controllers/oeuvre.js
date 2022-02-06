const {
  removeAllImage,
  removeImage,
  renameImage,
} = require("../middleware/oeuvre");
//import oeuvre model
const Oeuvre = require("../models/oeuvre");

// function for GET /oeuvre route
const getAllOeuvre = (req, res) => {
  Oeuvre.find({}, (err, data) => {
    if (err) {
      return res.json({ Error: err });
    }
    return res.json(data);
  });
};

// function for GET /oeuvre/:id route
const getOneOeuvre = (req, res) => {
  let id = req.params.id;

  Oeuvre.findOne({ _id: id }, (err, data) => {
    if (err || !data) {
      return res.json({ message: "Oeuvre doesn't exist." });
    } else return res.json(data);
  });
};

// function for POST /oeuvre route
const newOeuvre = (req, res) => {
  if (!req.body.title) return res.json({ message: "Oeuvre title is required" });

  //check if the oeuvre title already exists in db
  Oeuvre.findOne({ title: req.body.title }, (err, data) => {
    if (!data) {
      //create a new oeuvre object using the Oeuvre model and req.body
      const newOeuvre = new Oeuvre({
        title: req.body.title,
        description: req.body.description,
        keywords: req.body.keywords ? req.body.keywords : [],
        date: req.body.date,
        image: {
          src: req.files && req.files.image && req.files.image[0].path,
          style: req.body["image.style"],
        },
        ref: {
          image: {
            src: req.files && req.files.refImage && req.files.refImage[0].path,
            style: req.body["ref.image.style"],
          },
        },
        priorityOrder: req.body.priorityOrder,
      });

      // save this object to database
      newOeuvre.save((err, data) => {
        if (err) return res.json({ Error: err });
        return res.json(data);
      });
    } else {
      if (err)
        return res.json(`Something went wrong, please try again. ${err}`);
      return res.json({ message: "Oeuvre already exists" });
    }
  });
};

// function for PUT /oeuvre route
const updateOneOeuvre = (req, res) => {
  if (!req.body) return res.json({ message: "Request body is required." });

  let id = req.params.id;

  Oeuvre.findOne({ _id: id }, (err, data) => {
    if (err || !data) {
      return res.json({ message: "Oeuvre doesn't exist." });
    } else {
      // Check if title is unique
      Oeuvre.findOne({ title: req.body.title }, (err, oeuvreByTitle) => {
        if (err)
          return res.json(`Something went wrong, please try again. ${err}`);
        if (oeuvreByTitle && !oeuvreByTitle._id.equals(data._id)) {
          return res.json({ message: "Oeuvre already exists" });
        } else {
          const oldTitle = data.title;
          // Update
          if (req.body.title) data.title = req.body.title;
          if ("description" in req.body)
            data.description = req.body.description;
          if ("keywords" in req.body) {
            data.keywords = req.body.keywords ? req.body.keywords : [];
          }
          if (req.body.date) data.date = req.body.date;
          if (req.files && req.files.image) {
            data.image.src = req.files.image[0].path;
          } else if ("image.src" in req.body && data.image.src) {
            removeImage(data.image.src);
            data.image.src = "";
          } else if (data.image.src && oldTitle != data.title) {
            data.image.src = renameImage(data.image.src, data.title);
          }
          if (req.files && req.files.refImage) {
            data.ref.image.src = req.files.refImage[0].path;
          } else if ("ref.image.src" in req.body && data.ref.image.src) {
            removeImage(data.ref.image.src);
            data.ref.image.src = "";
          } else if (data.ref.image.src && oldTitle != data.title) {
            data.ref.image.src = renameImage(
              data.ref.image.src,
              data.title,
              "refImage"
            );
          }
          if ("image.style" in req.body)
            data.image.style = req.body["image.style"];
          if ("ref.image.style" in req.body)
            data.ref.image.style = req.body["ref.image.style"];
          if (req.body.priorityOrder)
            data.priorityOrder = req.body.priorityOrder;

          // Save changes to db
          data.save((err) => {
            if (err) {
              return res.json({
                message: "Oeuvre failed to update.",
                error: err,
              });
            }
            return res.json(data);
          });
        }
      });
    }
  });
};

// function for DELETE /oeuvre route
const deleteAllOeuvre = (req, res) => {
  removeAllImage();
  // Delete all Oeuvre Object
  Oeuvre.deleteMany({}, (err) => {
    if (err) {
      return res.json({ message: "Complete delete failed" });
    }
    return res.json({ message: "Complete delete successful" });
  });
};

// function for DELETE /oeuvre route
const deleteOneOeuvre = (req, res) => {
  let id = req.params.id;

  Oeuvre.findOne({ _id: id }, (err, deletedOeuvre) => {
    if (err || !deletedOeuvre) {
      return res.json({ message: "Oeuvre doesn't exist." });
    } else {
      Oeuvre.deleteOne({ _id: id }, (err, data) => {
        if (data.deletedCount == 0) {
          return res.json({ message: "Oeuvre doesn't exist." });
        } else if (err) {
          return res.json(`Something went wrong, please try again. ${err}`);
        } else {
          if (deletedOeuvre.image.src) removeImage(deletedOeuvre.image.src);
          if (deletedOeuvre.ref.image.src)
            removeImage(deletedOeuvre.ref.image.src);
          return res.json({ message: "Oeuvre deleted." });
        }
      });
    }
  });
};

module.exports = {
  getAllOeuvre,
  getOneOeuvre,
  newOeuvre,
  updateOneOeuvre,
  deleteAllOeuvre,
  deleteOneOeuvre,
};
