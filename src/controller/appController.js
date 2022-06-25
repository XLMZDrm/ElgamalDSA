import ElGamal from "../models/index";
import fse from "fs-extra";
import path from "path";
const crypto = require('crypto');
const fs = require("fs");
var appRoot = require("app-root-path");
const WordExtractor = require("word-extractor");
// send
var mess = "WELCOME";
var message = { mess: mess };
var sign = "";
var key = "";
var text = "";
var signature = { sign: sign, key: key, text: text };
let getHomePage = (req, res) => {
  try {
    return res.render("home", { message: message, signature: signature });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  str = str.replace(/ + /g, " ");
  str = str.trim();
  return str;
}
let reset = async (req, res) => {
  try {
    message.mess = "WELCOME";
    signature.sign = "";
    signature.key = "";
    signature.text = "";
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
let generateKey = async (req, res) => {
  try {
    var eg = await ElGamal.generateAsync();
    signature.key = eg.getKeyBase64();
    return res.redirect("/");
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
let signText = async (req, res) => {
  try {
    var { key, text } = req.body;
    const hashSum = crypto.createHash('sha256');
    hashSum.update(change_alias(text));
    const hex = hashSum.digest('hex');
    var elgamal = await ElGamal.getElgamalBase64(key);
    signature.sign = await elgamal.encryptBase64(hex);
    signature.text = text;
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
let verifyText = async (req, res) => {
  try {
    var { key, text, sign } = req.body;
    signature.key = key;
    var elgamal = await ElGamal.getElgamalBase64(key);
    var result = await elgamal.decryptBase64(sign);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(change_alias(text));
    const hex = hashSum.digest('hex');
    if (result.toString() === hex) {
      message.mess = "Chữ ký chuẩn.";
      return res.redirect("/");
    } else {
      message.mess = "Chữ ký không khớp.";
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
let readingFile = async (req, res) => {
  try {
    if (path.extname(req.file.filename) === ".txt") {
      var text = fs.readFileSync(appRoot + "/src/public/files/" + req.file.filename, "utf-8");
      signature.text = text;
      return res.redirect("/");
    } else if (path.extname(req.file.filename) === '.docx' || path.extname(req.file.filename) === ".doc") {
      var text;
      const extractor = new WordExtractor();
      const extracted = extractor.extract(appRoot + "/src/public/files/" + req.file.filename);
      extracted.then(function (doc) {
        text = doc.getBody();
        signature.text = text;
        return res.redirect("/");
      });
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
export default {
  getHomePage,
  clearCache,
  generateKey,
  signText,
  verifyText,
  reset,
  readingFile
};
