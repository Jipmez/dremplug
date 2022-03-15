const DataHandlerService = require("../../services/DataHandler.service");
const { TokenService } = require("../../services/token.service");
const { HashService } = require("../../services/hash.service");

const index = async function (req, res) {
  let param = req.params.id ? req.params.id : 1;
  const limit = 10;
  const offset = (param - 1) * limit;
  const posts = await req.db.posts.findAndCountAll({
    limit: limit,
    offset: offset,
    where: {
      status: "publish",
    },
    include: [{ model: req.db.User }],
  });

  const totalPages = Math.ceil(posts.count / limit);
  const currentPage = param ? +param : 0;

  const feat = await req.db.posts.findAll({
    where: {
      status: "publish",
      featured: 1,
    },
    include: [{ model: req.db.User }],
  });

  const tags = await req.db.tags.findAll();

  return DataHandlerService.response(
    res,
    200,
    "",
    {
      post: posts.rows,
      tags: tags,
      feat: feat,
      totalPages: totalPages,
      currentPage: currentPage,
    },
    "",
    "index",
    "render"
  );
};

const show = async function (req, res) {
  try {
    const data = await req.db.posts.findOne({
      where: {
        title: req.params.uo,
      },
      include: [{ model: req.db.comments }],
    });
    data.update({ views: data.views + 1 });

    const tags = await req.db.tags.findAll();

    return DataHandlerService.response(
      res,
      200,
      "",
      { content: data, tags: tags },
      "",
      "show",
      "render"
    );
  } catch (error) {
    console.log(error);
  }
};

const comment = async function (req, res) {
  const missingParameter = DataHandlerService.missingParameter(req.body, [
    "email",
    "name",
    "comment",
  ]);
  if (missingParameter) {
    return DataHandlerService.response(
      res,
      200,
      "Login successful",
      { failed: "Error occured. Please try again" },
      {},
      "/articles/" + req.params.uo,
      "render"
    );
  }

  const { name, email, comment } = req.body;

  try {
    const data = await req.db.posts.findOne({
      where: {
        title: req.params.uo,
      },
    });
    data.update({ comment_no: data.comment_no + 1 });
    await req.db.comments.create({
      postsId: data.id,
      name,
      email,
      comment,
    });

    return DataHandlerService.response(
      res,
      200,
      "success",
      {},
      "",
      "/articles/" + req.params.uo,
      "redirect"
    );
  } catch (e) {
    return DataHandlerService.response(
      res,
      500,
      "Error occurred. Please try again",
      { failed: "Error occured. Please try again" },
      e,
      "dashboard/post",
      "render"
    );
  }

  return res.status(200);
};

const createUser = async function (req, res) {
  const missingParameter = DataHandlerService.missingParameter(req.body, [
    "email",
    "password",
  ]);
  if (missingParameter) {
    return DataHandlerService.response(
      res,
      400,
      missingParameter + " is required",
      missingParameter,
      "",
      "/",
      "render"
    );
  }
  const { name, email, role, password } = req.body;
  const passwordd = await new HashService(password).encode();

  try {
    const user = await req.db.User.create({
      name,
      email,
      password: passwordd,
      role,
    });
    return DataHandlerService.response(
      res,
      200,
      "success",
      user,
      "",
      "/login",
      "redirect"
    );
  } catch (err) {
    DataHandlerService.response(res, 500, "failed", {}, err);
  }
};

const getUsers = async function (req, res) {
  try {
    const users = await req.db.User.findAll();
    return DataHandlerService.response(res, 200, "success", users);
  } catch (e) {
    return DataHandlerService.response(res, 500, "failed", {}, e);
  }
};

const loginUser = async function (req, res) {
  const missingParameter = DataHandlerService.missingParameter(req.body, [
    "email",
    "password",
  ]);

  if (missingParameter) {
    return DataHandlerService.response(
      res,
      400,
      missingParameter + " is missing",
      {},
      "",
      "index",
      "render"
    );
  }

  try {
    let email = req.body.email;
    let password = req.body.password;

    /* Check if user exists */
    const user = await req.db.User.findOne({ where: { email: email } });
    if (!user || !user.id) {
      return DataHandlerService.response(
        res,
        401,
        "Invalid E-mail or password or both",
        {},
        "",
        "index",
        "render"
      );
    }

    /* Check for password match */
    const passwordService = new HashService(password);
    const passwordMatched = await passwordService.decode(user.password);
    if (!passwordMatched) {
      return DataHandlerService.response(
        res,
        401,
        "Invalid E-mail or password or both",
        {},
        {},
        "index",
        "render"
      );
    }

    /* Sign Token */
    const token = await TokenService.sign(
      { id: user.uuid, email: user.email, role: user.role },
      52
    );
    res.cookie("access_token", token, {
      httpOnly: true,
    });

    return DataHandlerService.response(
      res,
      200,
      "Login successful",
      {},
      {},
      "dashboard/index",
      "redirect"
    );
  } catch (e) {
    console.log(e);
    return DataHandlerService.response(
      res,
      500,
      "Error occurred. Please try again",
      {},
      e
    );
  }
};

const logout = async function (req, res) {
  res.clearCookie("access_token");
  return DataHandlerService.response(
    res,
    200,
    "logout",
    {},
    {},
    "login",
    "render"
  );
};

const renderLoginPage = async function (req, res) {
  return DataHandlerService.response(res, 200, "", {}, "", "login", "render");
};

const renderDashboardPage = async function (req, res) {
  let param = req.params.id ? req.params.id : 1;

  const limit = 10;
  const offset = (param - 1) * limit;
  const posts = await req.db.posts.findAndCountAll({
    limit: limit,
    offset: offset,
    where: {
      status: "publish",
    },
    include: [{ model: req.db.User }],
  });

  const totalPages = Math.ceil(posts.count / limit);
  const currentPage = param ? +param : 0;

  return DataHandlerService.response(
    res,
    200,
    "",
    {
      post: posts.rows,
      totalPages: totalPages,
      currentPage: currentPage,
    },
    "",
    "dashboard/index",
    "render"
  );
};

const renderDashboardStatus = async function (req, res) {
  const posts = await req.db.posts.findAndCountAll({
    where: {
      status: req.params.id,
    },
    include: [{ model: req.db.User }],
  });

  return DataHandlerService.response(
    res,
    200,
    "",
    {
      post: posts.rows,
    },
    "",
    "dashboard/index",
    "render"
  );
};

const deletePost = async function (req, res) {
  await req.db.posts.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.redirect("/user/dashbaord/index");
};

const featPost = async function (req, res) {
  const post = await req.db.posts.findOne({
    where: {
      id: req.params.id,
    },
  });
  const feat = post.featured == 0 ? 1 : 0;
  post.update({ featured: feat });
  res.redirect("/user/dashboard/index");
};

module.exports = {
  createUser,

  index,
  getUsers,
  loginUser,
  renderLoginPage,
  renderDashboardPage,
  show,
  deletePost,
  comment,
  renderDashboardStatus,
  featPost,
  logout,
};
