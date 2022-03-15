const DataHandlerService = require("../../services/DataHandler.service");
const UserController = require("./user.controller");
const PostController = require("./post.controller");

module.exports = class TemplateRoute {
  constructor(route, protection) {
    this.route = route;
    this._protection = protection;
  }
  setup() {
    this.route.get("/", UserController.index);
    this.route.get("/page/:id", UserController.index);
    this.route.get("/articles/:uo", UserController.show);
    this.route.post("/articles/:uo", UserController.comment);

    // user routes
    this.route.post("/user/create", UserController.createUser);
    this.route.get("/user", UserController.getUsers);
    this.route.post("/user/login", UserController.loginUser);
    this.route.get("/user/login", UserController.renderLoginPage);
    this.route.get("/user/logout", UserController.logout);
    this.route.get(
      "/user/dashboard/index",
      async (req, res, next) => await this._protection(req, res, next),
      UserController.renderDashboardPage
    );

    this.route.get(
      "/user/dashboard/index/st/:id",
      async (req, res, next) => await this._protection(req, res, next),
      UserController.renderDashboardStatus
    );

    this.route.get(
      "/user/dashboard/index/:id",
      async (req, res, next) => await this._protection(req, res, next),
      UserController.renderDashboardPage
    );

    // post routes
    this.route.get(
      "/user/dashboard/create-post",
      PostController.renderPostPage
    );

    this.route.get(
      "/user/dashboard/edit-post/:id",
      PostController.renderEditPage
    );

    this.route.post(
      "/user/dashboard/edit-post/:id",
      async (req, res, next) => await this._protection(req, res, next),
      PostController.Editpost
    );

    this.route.post(
      "/user/dashboard/create-post",
      async (req, res, next) => await this._protection(req, res, next),
      PostController.createPost
    );

    this.route.post(
      "/user/dashboard/index/delete/:id",
      async (req, res, next) => await this._protection(req, res, next),
      UserController.deletePost
    );

    this.route.post(
      "/user/dashboard/index/feat/:id",
      async (req, res, next) => await this._protection(req, res, next),
      UserController.featPost
    );

    //  this.route.post('page', controller);
  }
};
