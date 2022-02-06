const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Oeuvre = require("../models/oeuvre");

const dirUploads = "./uploads/oeuvre";
const refImage = {
  fieldname: "refImage",
  path: "_ref",
};

const storageAdd = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirUploads);
  },
  filename: function (req, file, cb) {
    if (!req.body) cb(new Error("Request body is required."), null);
    if (!req.body.title) cb(new Error("Oeuvre title is required."), null);
    Oeuvre.findOne({ title: req.body.title }, (err, data) => {
      if (!data) {
        const title = makeFilePath(req.body.title, file);
        cb(null, title);
      } else {
        if (err)
          cb(new Error(`Something went wrong, please try again. ${err}`), null);
        else cb(new Error("Oeuvre already exists."), null);
      }
    });
  },
});
const uploadAdd = multer({ storage: storageAdd }).fields([
  {
    name: "refImage",
    maxCount: 1,
  },
  {
    name: "image",
    maxCount: 1,
  },
]);

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
          const title = makeFilePath(data.title, file);
          cb(null, title);
          removeImageFromFieldname(file.fieldname, title, data);
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
              const title = makeFilePath(req.body.title, file);
              cb(null, title);
              removeImageFromFieldname(file.fieldname, title, data);
            }
          });
        }
      }
    });
  },
});
const uploadUpdate = multer({ storage: storageUpdate }).fields([
  {
    name: "refImage",
    maxCount: 1,
  },
  {
    name: "image",
    maxCount: 1,
  },
]);

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

const removeAllImage = function () {
  // Delete all images
  fs.readdir(dirUploads, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(`${dirUploads}/${file}`, (err) => {
        if (err) throw err;
      });
    }
  });
};

const makeFilePath = function (title, { fieldname, originalname }) {
  let res = title.hashCode();
  if (fieldname === refImage.fieldname) {
    res += refImage.path;
  }
  res += path.extname(originalname);
  return res;
};

const removeImageFromFieldname = function (fieldname, title, data) {
  if (
    refImage.fieldname === fieldname &&
    `${dirUploads}/${title}` != data.ref.image.src
  ) {
    removeImage(data.ref.image.src);
  } else if (
    refImage.fieldname !== fieldname &&
    `${dirUploads}/${title}` != data.image.src
  ) {
    removeImage(data.image.src);
  }
};

const renameImage = function (oldPath, newTitle, fieldname = null) {
  const newPath = makeFilePath(newTitle, {
    fieldname: fieldname,
    originalname: oldPath,
  });
  console.log(oldPath, `${dirUploads}/${newPath}`);
  fs.rename(oldPath, `${dirUploads}/${newPath}`, (err) => {
    if (err) throw err;
  });
  return `${dirUploads}/${newPath}`;
};

module.exports = {
  uploadAdd,
  uploadUpdate,
  removeImage,
  removeAllImage,
  renameImage,
};
