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
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({ storage: storage });

const initWebRoute = (app) => {
  router.get("/", appController.getHomePage);
  router.post("/sign", upload.single("file_sign"), appController.getSign);
  router.post(
    "/verify",
    upload.array("files_sign", 2),
    appController.getVerify
  );
  return app.use("/", router);
};
export default initWebRoute;
