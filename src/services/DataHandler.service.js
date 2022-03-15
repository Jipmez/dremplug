const appConfig = require("../../config/app.configuration").fomart;

async function response(
  ctx,
  statusCode,
  statusText,
  data,
  debug,
  page,
  display
) {
  if (appConfig == "api") {
    if (ctx && ctx.url) {
      ctx.statusCode = statusCode;
    }
    return ctx.status(statusCode).json({ statusCode, statusText, data, debug });
  } else {
    display == "render" ? ctx.render(page, data) : ctx.redirect(page);
  }
}

function canContain(requestBody, canContain) {
  let updateObject = {};
  for (let i in canContain) {
    if (
      (requestBody[canContain[i]] ||
        requestBody[canContain[i]] === 0 ||
        requestBody[canContain[i]] === false) &&
      requestBody[canContain] !== null
    ) {
      updateObject[canContain[i]] = requestBody[canContain[i]];
    }
  }
  return updateObject;
}

function missingParameter(requestBody, requiredParam) {
  if (!requestBody) {
    return requiredParam[0];
  }
  for (let i in requiredParam) {
    if (
      !requestBody[requiredParam[i]] &&
      requestBody[requiredParam[i]] !== 0 &&
      requestBody[requiredParam[i]] !== false
    ) {
      return requiredParam[i];
    }
  }
}

module.exports = { missingParameter, response, canContain };
