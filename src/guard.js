const { DataHandlerService } = require("./services/DataHandler.service");
const { TokenService } = require("./services/token.service");
const appConfig = require("../config/app.configuration").fomart;

module.exports = class Guard {
  constructor() {
    this._token = "";
    this._users = {};
  }

  async protectedAuthenticated(req, res, next) {
    try {
      console.log(
        " ------------------- CONNECTED AUTH USER ------------------------"
      );
      console.log(
        ".................................................................."
      );
      console.log("-----------  IP ADDRESS:         " + req.ip);
      console.log(
        "......................................................................"
      );
      console.log(
        "---------------  Date  " +
          new Date().toISOString() +
          " .................."
      );
      console.log(
        "....................................................................."
      );
      console.log(
        "........................... body ......................................"
      );
      //  console.log(req.body);
      // console.log("header ", req.headers);

      if (appConfig == "api") {
        if (!req.headers || !req.headers.authorization) {
          req.body = DataHandlerService.response(req, 403, "Unauthorized", []);
          return;
        }

        this._token = req.headers.authorization;

        const decodedToken = await TokenService.verify(this._token);

        if (decodedToken.type !== TokenEnum.LOGIN) {
          req.body = DataHandlerService.response(req, 403, "Invalid token", []);
          return;
        }

        const user = await req.db.User.findOne({
          where: {
            uuid: decodedToken.id,
          },
        });

        if (!user || !user.id) {
          req.body = DataHandlerService.response(req, 403, "Invalid token", []);
          return;
        }
        req.state = { user };

        await next();
      }

      if (!req.cookies.access_token) {
        DataHandlerService.response(req, 403, "Unauthorized", []);
        return;
      }

      this._token = req.cookies.access_token;

      const decodedToken = await TokenService.verify(this._token);

      const user = await req.db.User.findOne({
        where: {
          uuid: decodedToken.id,
        },
      });

      if (!user || !user.id) {
        req.body = DataHandlerService.response(req, 403, "Invalid token", []);
        return;
      }

      req.state = user;

      return next();
    } catch (e) {
      console.log(e);
      console.log(
        "   -------------- FAILED ATTEMPT TO AUTHENTICATED ----------"
      );
      return res.render("login");
    }
  }
};
