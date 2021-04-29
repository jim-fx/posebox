export default (req, res, next) => {
  req.secure ? next() : res.redirect("https://" + req.headers.host + req.url);
};
