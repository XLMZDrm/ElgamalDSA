import ElGamal from "../models/index";
import fse from "fs-extra";
import EncryptedValue from "../models/encrypted-value";
import { BigInteger } from "jsbn";
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
let signText = async (req, res) => {
  try {
    var { key, text } = req.body;
    let bytes = base64.decode(key);
    let decode = utf8.decode(bytes);
    key = JSON.parse(decode);
    var elgamal = new ElGamal(key.p, key.g, key.y, key.x);
    signature.sign = await elgamal.encryptBase64(text);
    return res.render('home', { message: message, signature: signature });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
let getDocxPage = async (req, res) => {
  return res.render("docx", { message: message, signature: signature });
};
let getTxtFilePage = async (req, res) => {

};
export default {
  getHomePage,
  clearCache,
  generateKey,
  signText,
  getTxtFilePage,
  getDocxPage
};
