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
  router.get("/", appController.getHomePage);
  router.post("/sign", upload.single("file_sign"), appController.getSign);
  router.post("/verify", upload.single("file_sign"), appController.getVerify);
  router.post("/generateKey", appController.generateKey);
  router.get("/clear", appController.clearCache);
  router.get("/text", appController.getTextPage);
  router.get("/txt", appController.getTxtFilePage);
  router.get("/docx", appController.getDocxPage);
  return app.use("/", router);
};
export default initWebRoute;
