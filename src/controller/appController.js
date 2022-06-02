import full from "@babel/core/lib/config/full";
import multer from "multer";
import ElGamal from "../models/index";
import path from "path";
// import { BigInteger } from "jsbn";
import EncryptedValue from "../models/encrypted-value";
import { BigInteger } from "jsbn";
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
function compareJSON(a, b) {
  for (var prop in a) {
    for (var miniProp in prop) {
      if (a[prop][miniProp] !== b[prop][miniProp]) {
        return false;
      }
    }
  }
  return true;
}
let getSign = async (req, res) => {
  try {
    p = req.body.p;
    g = req.body.g;
    x = 1;
    y = req.body.y;
    const eg = new ElGamal(p, g, y, x);
    const fileBuffer = fs.readFileSync(
      appRoot + "/src/public/files/" + req.file.filename
    );
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    const hex = hashSum.digest("hex");
    const enHex = await eg.encryptAsync(hex, 0);
    // console.log(enHex);
    fs.appendFileSync(
      appRoot + "/src/public/files/" + req.file.filename + ".key",
      JSON.stringify(enHex)
    );
    signature.sign = "/files/" + req.file.filename + ".key";
    message.mess = "Ký thành công. Bấm nút download để tải file chữ ký.";
    fs.unlinkSync(appRoot + "/src/public/files/" + req.file.filename);
    return res.render("home", { message: message, signature: signature });
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
    const files = req.files;
    var eg = new ElGamal(p, g, y, x);
    var fileKey;
    var enHex;
    var fileReHex;
    var hex;
    files.forEach((file) => {
      if (path.extname(file.filename) === ".key") {
        fileKey = fs.readFileSync(
          appRoot + "/src/public/files/" + file.filename
        );
        fileKey = JSON.parse(fileKey);
        fs.unlinkSync(appRoot + "/src/public/files/" + file.filename);
      } else {
        const fileSign = fs.readFileSync(
          appRoot + "/src/public/files/" + file.filename
        );
        const hashSum = crypto.createHash("sha256");
        hashSum.update(fileSign);
        hex = hashSum.digest("hex");
        fs.unlinkSync(appRoot + "/src/public/files/" + file.filename);
      }
    });
    enHex = await eg.encryptAsync(hex, 0);
    fs.appendFileSync(
      appRoot + "/src/public/files/" + files[0].filename + ".keys",
      JSON.stringify(enHex)
    );
    fileReHex = fs.readFileSync(
      appRoot + "/src/public/files/" + files[0].filename + ".keys"
    );
    fs.unlinkSync(appRoot + "/src/public/files/" + files[0].filename + ".keys");
    fileReHex = JSON.parse(fileReHex);
    if (compareJSON(fileKey, fileReHex)) {
      message.mess = "Đây là tài liệu chuẩn, không bị chỉnh sửa.";
      return res.render("home", { message: message, signature: signature });
    } else {
      message.mess = "Tài liệu đã bị thay đổi bạn không nên sử dụng";
      return res.render("home", { message: message, signature: signature });
    }
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
