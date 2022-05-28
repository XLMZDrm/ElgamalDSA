import ElGamal from "elgamal";
let getHomePage = (req, res) => {
  try {
    return res.render("home");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
let elgamalEncrypt = async (
  prime,
  generator,
  publicKey,
  privateKey,
  string
) => {
  try {
    const eg = new ElGamal(prime, generator, publicKey, privateKey);
    return eg.encryptAsync(string).toString();
  } catch (error) {
    console.log(error);
  }
};
let elgamalDecrypt = async (
  prime,
  generator,
  publicKey,
  privateKey,
  string
) => {
  try {
    const eg = new ElGamal(prime, generator, publicKey, privateKey);
    return eg.decryptAsync(string).toString();
  } catch (error) {
    console.log(error);
  }
};
let elgamalEncryptAuto = async (string) => {
  try {
    const eg = await ElGamal.generateAsync();
    return eg.encryptAsync(string).toString();
  } catch (error) {
    console.log(error);
  }
};
let elgamalDecryptAuto = async (string) => {
  try {
    const eg = await ElGamal.generateAsync();
    return eg.decryptAsync(string).toString();
  } catch (error) {
    console.log(error);
  }
};
export default {
  getHomePage,
  elgamalEncrypt,
  elgamalDecrypt,
  elgamalEncryptAuto,
  elgamalDecryptAuto,
};
