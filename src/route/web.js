import express from "express";
import { route } from "express/lib/application";

let router = express.Router();
const initWebRoute = (app) => {
  router.get("/", appController.getHomePage);
};
