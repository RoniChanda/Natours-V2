const sanitizeHtml = require("sanitize-html");

const clean = (data) => {
  data = sanitizeHtml(JSON.stringify(data));
  return JSON.parse(data);
};

//* Middlwares *****************************************************
//* sanitize Html **************************************************

module.exports = () => (req, res, next) => {
  if (Object.keys(req.body).length > 0 && req.body.constructor === Object) {
    req.body = clean(req.body);
  }

  if (Object.keys(req.query).length > 0 && req.query.constructor === Object) {
    req.query = clean(req.query);
  }

  if (Object.keys(req.params).length > 0 && req.params.constructor === Object) {
    req.params = clean(req.params);
  }

  next();
};
