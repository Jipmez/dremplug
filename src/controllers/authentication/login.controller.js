const DataHandlerService = require("../../services/DataHandler.service");
/* import {HashService} from require('../../services/hash.service'); */
const { TokenService } = require("../../services/token.service");
const { TokenEnum } = require("../../enum/token.enum");

const index = async function (req, res) {
  this._email = "";
  this._password = "";

  const missingParameter = await DataHandlerService.missingParameter(req.body, [
    "email",
    "password",
  ]);

  if (missingParameter) {
    return DataHandlerService.response(
      res,
      400,
      missingParameter + " is missing",
      {}
    );
  }

  try {
    this._email = req.body.email;
    this._password = req.password;

    const user = await req.db.User.findOne({ where: { email: this._email } });

    if (!user || !user.id) {
      return DataHandlerService.response(
        req,
        401,
        "Invalid E-mail or password or both",
        {}
      );
    }

    const passwordService = new HashService(this._password);

    const passwordMatched = await passwordService.decode(user.password);

    if (!passwordMatched) {
      return DataHandlerService.response(
        req,
        401,
        "Invalid E-mail or password or both",
        {}
      );
    }
    const token = await TokenService.sign(
      { id: user.id, email: user.email, type: TokenEnum.LOGIN },
      52
    );

    return DataHandlerService.response(res, 200, "Login successful", {
      token: token,
      user: user.id,
      profileUpdated: user.country > 0,
    });
  } catch (e) {
    console.log(e);
    return DataHandlerService.response(
      req,
      500,
      "Error occurred. Please try again",
      {},
      e
    );
  }
};

module.exports = { index };
