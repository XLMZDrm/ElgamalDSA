import multer from "multer";
import ElGamal from "../models/index";
var mess = "";
var message = { mess: mess };
var sign = "";
var p;
var g;
var x;
var y;
var signature = { sign: sign, p: p, g: g, y: y, x: x };
const crypto = require("crypto");
const fs = require("fs");
var appRoot = require("app-root-path");
let getHomePage = (req, res) => {
  try {
    return res.render("home", { message: message, signature: signature });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
const upload = multer().single("file_sign");
let getSign = async (req, res) => {
  try {
    p = req.body.p;
    g = req.body.g;
    x = req.body.x;
    y = req.body.y;
    upload(req, res, async function (err) {
      const eg = new ElGamal(p, g, y, x);
      const fileBuffer = fs.readFileSync(
        appRoot + "/src/public/files/" + req.file.filename
      );
      const hashSum = crypto.createHash("sha256");
      hashSum.update(fileBuffer);
      const hex = hashSum.digest("hex");
      const enHex = await eg.encryptAsync(hex);
      signature.sign = JSON.stringify(enHex);
      message.mess = "Ký thành công.";
      return res.render("home", { message: message, signature: signature });
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/bug");
  }
};
let getVerify = async (req, res) => {
  try {
    p = req.body.p;
    g = req.body.g;
    x = req.body.x;
    y = req.body.y;
    sign = req.body.sign;
    upload(req, res, async function (err) {
      const eg = new ElGamal(p, g, y, x);
      const fileBuffer = fs.readFileSync(
        appRoot + "/src/public/files/" + req.file.filename
      );
      const hashSum = crypto.createHash("sha256");
      hashSum.update(fileBuffer);
      const hex = hashSum.digest("hex");
      const deHex = eg.decryptAsync(JSON.parse(sign));
      if (deHex.toString() === hex) {
        message.mess = "Đây là tài liệu chuẩn, không bị chỉnh sửa.";
        return res.render("home", { message: message, signature: signature });
      } else {
        message.mess = "Tài liệu đã bị thay đổi bạn không nên sử dụng";
        return res.render("home", { message: message, signature: signature });
      }
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/bug");
  }
};
export default {
  getHomePage,
  getSign,
  getVerify,
};
