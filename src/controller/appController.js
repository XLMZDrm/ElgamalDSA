import ElGamal from "elgamal";
import multer from "multer";
const crypto = require("crypto");
const fs = require("fs");
var appRoot = require("app-root-path");
let getHomePage = (req, res) => {
  try {
    return res.render("home");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
const upload = multer().single("file_sign");

let getSign = async (req, res) => {
  try {
    upload(req, res, function (err) {
      // if (req.fileValidationError) {
      //   console.log(req.fileValidationError);
      // } else if (!req.file) {
      //   console.log("Please select an image to upload");
      // } else if (err instanceof multer.MulterError) {
      //   console.log(err);
      // } else if (err) {
      //   console.log(err);
      // }
      const fileBuffer = fs.readFileSync(
        appRoot + "/src/public/files/" + req.file.filename
      );
      const hashSum = crypto.createHash("sha256");
      hashSum.update(fileBuffer);
      const hex = hashSum.digest("hex");
      console.log(hex);
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/bug");
  }
};
export default {
  getHomePage,
  getSign,
};
