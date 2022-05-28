import express from "express";
import { route } from "express/lib/application";
import appController from "../controller/appController";

let router = express.Router();
const initWebRoute = (app) => {
  router.get("/", appController.getHomePage);
  return app.use("/", router);
};
export default initWebRoute;
