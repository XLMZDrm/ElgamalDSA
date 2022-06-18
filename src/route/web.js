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
  router.post("/generateKey", appController.generateKey);
  router.get("/clear", appController.clearCache);
  router.post("/text", appController.signText);
  router.post("/txt", appController.getTxtFilePage);
  router.post("/docx", appController.getDocxPage);
  return app.use("/", router);
};
export default initWebRoute;
