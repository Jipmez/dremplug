const Jwt = require("jsonwebtoken");
const appConfig = require("../../config/app.configuration");

class TokenService {
  static sign(data, prolonged = 1) {
    return new Promise((resolve, reject) => {
      Jwt.sign(
        data,
        appConfig.hashSalt,
        { expiresIn: prolonged ? prolonged * 60 * 60 : 60 * 60 },
        (error, data) => {
          if (error) reject(error);
          resolve(data);
        }
      );
    });
  }

  static verify(token) {
    return new Promise((resolve, reject) => {
      Jwt.verify(token, appConfig.hashSalt, (err, decoded) => {
        if (decoded) {
          resolve(decoded);
        }
        if (err) {
          reject(err);
        }
      });
    });
  }
}

module.exports = { TokenService };
