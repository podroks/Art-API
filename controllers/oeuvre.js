const fs = require("fs");
const path = require("path");
const multer = require("multer");
//import oeuvre model
const Oeuvre = require("../models/oeuvre");

const dirUploads = "./uploads/oeuvre";

const storageAdd = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirUploads);
  },
  filename: function (req, file, cb) {
    if (!req.body) cb(new Error("Request body is required."), null);
    if (!req.body.title) cb(new Error("Oeuvre title is required."), null);
    Oeuvre.findOne({ title: req.body.title }, (err, data) => {
      if (!data) {
        const title =
          encodeURIComponent(req.body.title) + path.extname(file.originalname);
        cb(null, title);
      } else {
        if (err)
          cb(new Error(`Something went wrong, please try again. ${err}`), null);
        else cb(new Error("Oeuvre already exists."), null);
      }
    });
  },
});
const uploadAdd = multer({ storage: storageAdd }).single("image");

const storageUpdate = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirUploads);
  },
  filename: function (req, file, cb) {
    if (!req.body) cb(new Error("Request body is required."), null);

    Oeuvre.findOne({ _id: req.params.id }, (err, data) => {
      if (err || !data) {
        cb(new Error("Oeuvre doesn't exist."), null);
      } else {
        if (!req.body.title) {
          const title =
            encodeURIComponent(data.title) + path.extname(file.originalname);
          cb(null, title);
          if (`${dirUploads}/${title}` != data.image.src) {
            removeImage(data.image.src);
          }
        } else {
          // Check if title is unique
          Oeuvre.findOne({ title: req.body.title }, (err, oeuvreByTitle) => {
            if (err)
              cb(
                new Error(`Something went wrong, please try again. ${err}`),
                null
              );
            if (oeuvreByTitle && !oeuvreByTitle._id.equals(data._id)) {
              cb(new Error("Oeuvre already exists."), null);
            } else {
              const title =
                encodeURIComponent(req.body.title) +
                path.extname(file.originalname);
              cb(null, title);
              if (`${dirUploads}/${title}` != data.image.src) {
                removeImage(data.image.src);
              }
            }
          });
        }
      }
    });
  },
});
const uploadUpdate = multer({ storage: storageUpdate }).single("image");

const removeImage = function (imgSrc) {
  if (!imgSrc) return;
  try {
    if (fs.existsSync(imgSrc)) {
      fs.unlink(imgSrc, (err) => {
        if (err) throw err;
      });
    }
  } catch (err) {
    console.error(`No file to the path : ${imgSrc}`);
  }
};

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
        keywords: req.body.keywords,
        date: req.body.date,
        image: {
          src: req.file && req.file.path,
          style: req.body.image?.style,
        },
        ref: req.body.ref,
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
          // Update
          if (req.body.title) data.title = req.body.title;
          if (req.body.description) data.description = req.body.description;
          if (req.body.keywords) data.keywords = req.body.keywords;
          if (req.body.date) data.date = req.body.date;
          if (req.file) data.image.src = req.file.path;
          if (req.body.image?.style) data.image.style = req.body.image.style;
          if (req.body.ref) data.ref = req.body.ref;
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
  // Delete all images
  fs.readdir(dirUploads, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(`${dirUploads}/${file}`, (err) => {
        if (err) throw err;
      });
    }
  });
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

  Oeuvre.deleteOne({ _id: id }, (err, data) => {
    //if there's nothing to delete return a message
    if (data.deletedCount == 0)
      return res.json({ message: "Oeuvre doesn't exist." });
    //else if there's an error, return the err message
    else if (err)
      return res.json(`Something went wrong, please try again. ${err}`);
    //else, return the success message
    else return res.json({ message: "Oeuvre deleted." });
  });
};

module.exports = {
  uploadAdd,
  uploadUpdate,
  getAllOeuvre,
  getOneOeuvre,
  newOeuvre,
  updateOneOeuvre,
  deleteAllOeuvre,
  deleteOneOeuvre,
};
