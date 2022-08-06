import express from "express";
import configViewEngine from "./configs/viewEngine.js";
import indexRouter from "./route/web.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
configViewEngine(app);
app.use('/', indexRouter);
app.use((req, res) => {
  return res.redirect("/");
});
app.listen(PORT);
