import ElGamal from "elgamal";
let getHomePage = () => {
  try {
    return res.render("home");
  } catch (error) {
    console(error);
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
    return eg.encryptAsync(string);
  } catch (error) {
    return res.redirect("/");
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
    return res.redirect("/");
  }
};
export default {
  getHomePage,
  elgamalEncrypt,
  elgamalDecrypt,
};
