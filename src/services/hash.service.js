const bcrypt = require("bcrypt");
const appConfiguration = require("../../config/app.configuration");

class HashService {
  constructor(plainPassword) {
    this._plainPassword = plainPassword;
  }

  encode() {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(appConfiguration.hashRound, (error, salt) => {
        if (error) reject(error);
        bcrypt.hash(this._plainPassword, salt, (error, hash) => {
          if (error) reject(error);
          resolve(hash);
        });
      });
    });
  }

  decode(hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(this._plainPassword, hashedPassword, (error, data) => {
        if (error) reject(error);
        resolve(data);
      });
    });
  }
}

module.exports = {
  HashService,
};
