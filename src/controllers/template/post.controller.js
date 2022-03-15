const DataHandlerService = require("../../services/DataHandler.service");
const { TokenService } = require("../../services/token.service");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);
const uuid = require("uuid").v4;

const renderPostPage = async function (req, res) {
  const tags = await req.db.tags.findAll();

  return DataHandlerService.response(
    res,
    200,
    "",
    { tags: tags },
    {},
    "dashboard/post",
    "render"
  );
};

const renderEditPage = async function (req, res) {
  const tags = await req.db.tags.findAll();

  const data = await req.db.posts.findOne({
    where: {
      id: req.params.id,
    },
  });

  return DataHandlerService.response(
    res,
    200,
    "",
    { tags: tags, post: data },
    {},
    "dashboard/postedit",
    "render"
  );
};

const Editpost = async function (req, res) {
  const data = await req.db.posts.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (req.files) {
    let image = req.files.image;
    const im = `${uuid()}-${image.name}`;
    image.mv("./public/uploads/" + im);

    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const status = req.body.status;
    const pic = im;

    data.update({
      userId: req.state.id,
      title: slugify(title),
      description: title,
      content: dompurify.sanitize(content),
      tags: tags,
      image: im,
      status: status,
    });
  } else {
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const status = req.body.status;

    data.update({
      userId: req.state.id,
      title: slugify(title),
      description: title,
      content: dompurify.sanitize(content),
      tags: tags,
      status: status,
    });
  }

  const tagss = await req.db.tags.findAll();

  return DataHandlerService.response(
    res,
    200,
    "success",
    { tags: tagss, post: data },
    "",
    "dashboard/postedit",
    "render"
  );
};

const createPost = async function (req, res) {
  const missingParameter = DataHandlerService.missingParameter(req.body, [
    "title",
    "content",
    "tags",
    /* "image", */
    "status",
  ]);

  if (missingParameter) {
    return DataHandlerService.response(
      res,
      400,
      missingParameter + " is missing",
      { failed: "All Fields Are Required" },
      "",
      "dashboard/post",
      "render"
    );
  }

  try {
    if (req.files) {
      let image = req.files.image;
      image.mv("./public/uploads/" + image.name);

      const title = req.body.title;
      const content = req.body.content;
      const tags = req.body.tags;
      const status = req.body.status;
      const pic = image.name;

      await req.db.posts.create({
        userId: req.state.id,
        title: slugify(title),
        description: title,
        content: dompurify.sanitize(content),
        tags: tags,
        image: pic,
        status: status,
      });

      const tagss = await req.db.tags.findAll();

      return DataHandlerService.response(
        res,
        200,
        "success",
        { tags: tagss },
        "",
        "dashboard/post",
        "render"
      );
    }
  } catch (e) {
    console.log(e);
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
  /*  if (req.files) {
    console.log(req.files.image);
  } */
};

module.exports = { renderPostPage, createPost, renderEditPage, Editpost };
