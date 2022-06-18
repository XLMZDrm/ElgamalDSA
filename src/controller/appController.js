import ElGamal from "../models/index";
import fse from "fs-extra";
import extract from "extract-zip";
import EncryptedValue from "../models/encrypted-value";
import { BigInteger } from "jsbn";
var zip = require('cross-zip');
const crypto = require("crypto");
const fs = require("fs");
var appRoot = require("app-root-path");
var base64 = require('base-64');
var utf8 = require('utf8');
// send
var mess = "";
var message = { mess: mess };
var sign = "";
var key = "";
var signature = { sign: sign, key: key };
let getHomePage = (req, res) => {
  try {
    message.mess = "WELCOME";
    return res.render("home", { message: message, signature: signature });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
// let getSign = async (req, res) => {
//   try {
//     fs.renameSync(appRoot + "/src/public/files/" + req.file.filename, appRoot + '/src/public/files/' + req.file.filename + ".zip");
//     await extract(appRoot + "/src/public/files/" + req.file.filename + ".zip", { dir: appRoot + "/src/public/files/" + req.file.filename + "_unzip/" });
//     const fileBuffer = fs.readFileSync(
//       appRoot + "/src/public/files/" + req.file.filename + "_unzip/[Content_Types].xml"
//     );
//     const hashSum = crypto.createHash("sha256");
//     hashSum.update(fileBuffer);
//     const hex = hashSum.digest("hex");
//     const eg = await ElGamal.generateAsync();
//     const enHex = await eg.encryptAsync(hex);
//     var text = JSON.stringify(eg.getValues());
//     var bytes = utf8.encode(text);
//     var encoded = base64.encode(bytes);
//     fs.appendFileSync(appRoot + "/src/public/files/" + req.file.filename + "_unzip/_rels/.keys", encoded);
//     var text = JSON.stringify(enHex);
//     var bytes = utf8.encode(text);
//     var encoded = base64.encode(bytes);
//     fs.appendFileSync(appRoot + "/src/public/files/" + req.file.filename + "_unzip/_rels/.DS", encoded);
//     zip.zip(appRoot + "/src/public/files/" + req.file.filename + "_unzip", appRoot + "/src/public/files/" + req.file.filename + "_DS" + ".zip", () => {
//       fs.renameSync(appRoot + "/src/public/files/" + req.file.filename + "_DS" + ".zip", appRoot + "/src/public/files/DS_" + req.file.filename);
//     });
//     signature.sign = "/files/DS_" + req.file.filename;
//     message.mess = "Ký thành công. Bấm nút download để tải file.";
//     return res.render("home", { message: message, signature: signature });
//   } catch (error) {
//     console.log(error);
//     return res.redirect("/");
//   }
// };
// let getVerify = async (req, res) => {
//   var keys, DS;
//   try {
//     fs.renameSync(appRoot + "/src/public/files/" + req.file.filename, appRoot + '/src/public/files/' + req.file.filename + ".zip");
//     await extract(appRoot + "/src/public/files/" + req.file.filename + ".zip", { dir: appRoot + "/src/public/files/" + req.file.filename + "_unzip/" });
//     try {
//       keys = fs.readFileSync(appRoot + "/src/public/files/" + req.file.filename + "_unzip/_rels/.keys", { encoding: 'utf-8' });
//       var bytes = base64.decode(keys);
//       keys = utf8.decode(bytes);
//       keys = JSON.parse(keys);
//       DS = fs.readFileSync(appRoot + "/src/public/files/" + req.file.filename + "_unzip/_rels/.DS", { encoding: 'utf-8' });
//       var bytes = base64.decode(DS);
//       DS = utf8.decode(bytes);
//       DS = JSON.parse(DS);
//     } catch (error) {
//       message.mess = "Tài liệu đã bị thay đổi.\nHoặc chưa ký ^_^";
//       return res.render("home", { message: message, signature: signature });
//     }
//     var eg = new ElGamal(keys.p, keys.g, keys.y, keys.x);
//     var encrypt = new EncryptedValue();
//     encrypt.a = new BigInteger();
//     encrypt.b = new BigInteger();
//     for (var prop in DS) {
//       for (var mProp in DS[prop]) {
//         encrypt[prop][mProp] = DS[prop][mProp];
//       }
//     }
//     var de = await eg.decryptAsync(encrypt);
//     de = de.toString();
//     const fileBuffer = fs.readFileSync(
//       appRoot + "/src/public/files/" + req.file.filename + "_unzip/[Content_Types].xml"
//     );
//     const hashSum = crypto.createHash("sha256");
//     hashSum.update(fileBuffer);
//     const hex = hashSum.digest("hex");
//     if (de === hex) {
//       message.mess = "Đây là tài liệu chuẩn, không bị chỉnh sửa.";
//       return res.render("home", { message: message, signature: signature });
//     } else {
//       message.mess = "Tài liệu đã bị thay đổi.\nHoặc chưa ký ^_^";
//       return res.render("home", { message: message, signature: signature });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.redirect("/");
//   }
// };
let getSign = async (req, res) => {

};
let getVerify = async (req, res) => {

};
let generateKey = async (req, res) => {
  try {
    var eg = await ElGamal.generateAsync();
    signature.key = eg.getKeyBase64();
    return res.render("home", { message: message, signature: signature });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
let clearCache = (req, res) => {
  fse.emptyDirSync(appRoot + "/src/public/files/");
  fs.appendFileSync(appRoot + "/src/public/files/.gitkeep", "");
  return res.redirect("/");
};
let getTextPage = async (req, res) => {

};
let getDocxPage = async (req, res) => {
  return res.render("docx", { message: message, signature: signature });
};
let getTxtFilePage = async (req, res) => {

};
export default {
  getHomePage,
  getSign,
  getVerify,
  clearCache,
  generateKey,
  getTextPage,
  getTxtFilePage,
  getDocxPage
};
