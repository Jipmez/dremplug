//const AuthenticationRoute = require("./src/controllers/authentication");
const express = require("express");
const TemplateRoute = require("./src/controllers/template");
const router = express.Router();

module.exports = class RestRouter {
  constructor(protection) {
    this._protection = protection;
  }

  setup() {
    // authentication router
    /*  const authentication = new AuthenticationRoute(
      router,
      this._protection.protectedAuthenticated
    );
    authentication.setup(); */

    // template routers
    const Template = new TemplateRoute(
      router,
      this._protection.protectedAuthenticated
    );
    Template.setup();

    return router;
  }
};
