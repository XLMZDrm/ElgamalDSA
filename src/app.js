import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoute from "./route/web";

const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
configViewEngine(app);
initWebRoute(app);
app.use((req, res) => {
  return res.redirect("/");
});
app.listen(PORT);
