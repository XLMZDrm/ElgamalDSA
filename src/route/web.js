import express from "express";
import appController from "../controller/appController";
import multer from "multer";
import path from "path";
var appRoot = require("app-root-path");

let router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + "/src/public/files/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});
let upload = multer({ storage: storage });

const initWebRoute = (app) => {
  // post
  router.post("/generateKey", appController.generateKey);
  router.post("/signText", appController.signText);
  router.post("/verifyText", appController.verifyText);
  router.post("/readingFile", upload.single("file_sign"), appController.readingFile);
  // get
  router.get("/reset", appController.reset);
  router.get("/", appController.getHomePage);
  return app.use("/", router);
};
export default initWebRoute;
