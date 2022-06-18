import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoute from "./route/web";
const herokuAwake = require("heroku-awake");
const app = express();
const url = "https://elgamal-app.herokuapp.com/";
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
configViewEngine(app);
initWebRoute(app);
app.use((req, res) => {
  return res.redirect("/");
});
app.listen(PORT, () => {
  herokuAwake(url);
  const time = 10;
  herokuAwake(url, time);
});

// var appRoot = require('app-root-path');
// const WordExtractor = require("word-extractor");
// const extractor = new WordExtractor();
// const extracted = extractor.extract(appRoot+"/src/public/files/a.docx");

// extracted.then(function(doc) { console.log(doc.getBody()); });