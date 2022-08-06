import express from "express";
import * as appController from "../controller/appController.js";
import multer from "multer";
import path from "path";
import appRoot from 'app-root-path';

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

// post
router.post("/generateKey", appController.generateKey);
router.post("/signText", appController.signText);
router.post("/verifyText", appController.verifyText);
router.post("/readingFile", upload.single("file_sign"), appController.readingFile);
// get
router.get("/reset", appController.reset);
router.get("/", appController.getHomePage);
export default router;
