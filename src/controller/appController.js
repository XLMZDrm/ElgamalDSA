import ElGamal from "../models/index.js";
import fse from "fs-extra";
import path from "path";
import crypto from 'crypto';
import fs from 'fs';
import appRoot from 'app-root-path';
import WordExtractor from "word-extractor";
// send
var mess = "WELCOME";
var message = { mess: mess };
var sign = "";
var key = "";
var text = "";
var link = "";
var signature = { sign: sign, key: key, text: text, link: link };
let getHomePage = (req, res) => {
  try {
    return res.render("home", { message: message, signature: signature });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
let reset = (req, res) => {
  try {
    message.mess = "WELCOME";
    signature.sign = "";
    signature.key = "";
    signature.text = "";
    clearCache();
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
    let fileName = Date.now() + ".key";
    message.mess = "Tạo khoá thành công";
    fs.appendFileSync(appRoot + "/src/public/files/" + fileName, signature.key);
    signature.link = "/files/" + fileName;
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
let clearCache = () => {
  fse.emptyDirSync(appRoot + "/src/public/files/");
  fs.appendFileSync(appRoot + "/src/public/files/.gitkeep", "");
};
let signText = async (req, res) => {
  try {
    var { key, text } = req.body;
    const hashSum = crypto.createHash('sha256');
    hashSum.update(text);
    const hex = hashSum.digest('hex');
    var elgamal = await ElGamal.getElgamalBase64(key);
    signature.sign = await elgamal.encryptBase64(hex);
    let fileName = Date.now() + ".sig";
    fs.appendFileSync(appRoot + "/src/public/files/" + fileName, signature.sign);
    signature.link = "/files/" + fileName;
    signature.text = text;
    message.mess = "Ký thành công";
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
    hashSum.update(text);
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
let readingFile = (req, res) => {
  try {
    if (path.extname(req.file.filename) === ".txt") {
      fs.readFile(appRoot + "/src/public/files/" + req.file.filename, "utf-8", (err, data) => {
        signature.text = data;
        res.redirect("/");
      });
    } else if (path.extname(req.file.filename) === '.docx' || path.extname(req.file.filename) === ".doc") {
      var text;
      const extractor = new WordExtractor();
      const extracted = extractor.extract(appRoot + "/src/public/files/" + req.file.filename);
      extracted.then(function (doc) {
        text = doc.getBody();
        signature.text = text;
        res.redirect("/");
      });
    } else if (path.extname(req.file.filename) === ".sig") {
      fs.readFile(appRoot + "/src/public/files/" + req.file.filename, "utf-8", (err, data) => {
        signature.sign = data;
        res.redirect("/");
      });
    } else if (path.extname(req.file.filename) === ".key") {
      fs.readFile(appRoot + "/src/public/files/" + req.file.filename, "utf-8", (err, data) => {
        signature.key = data;
        res.redirect("/");
      });
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
export {
  getHomePage,
  clearCache,
  generateKey,
  signText,
  verifyText,
  reset,
  readingFile
};
