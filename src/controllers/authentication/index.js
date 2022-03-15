const LoginController = require("./login.controller");
/* import {RegisterController } from './register.controller';
import {PasswordChange} from './password.change.controller';
import {ValidationController} from './validation.controllerr';
import {PusherAuthentication} from "./pusher.controller"; */

module.exports = class AuthenticationRoute {
  constructor(route, protection) {
    this.route = route;
    this._protection = protection;
  }

  setup() {
    // login route
    this.route.post(`/auth/login`, LoginController.index);

    /*    // register route
        this.route.post(`/auth/register`,async (ctx,next) => ctx.body =await (new RegisterController()).setup(ctx));

        // register route
        this.route.post(`/auth/register/validate`,async (ctx,next) => ctx.body =await (new RegisterController()).validateRegister(ctx));

        // _password change
        this.route.post(`/auth/validate`, async (ctx,next) => ctx.body = await (new ValidationController()).setup(ctx));

        //validation controller
        this.route.post(`/auth/password`, async (ctx,next) =>ctx.body = await (new PasswordChange()).setup(ctx));

        // validate pusher channel authentication
        this.route.post('/auth/pusher', async (ctx, next) => this._protection(ctx, next) ,
            async (ctx) => ctx.body = await (new PusherAuthentication()).setup(ctx)); */
  }
};
