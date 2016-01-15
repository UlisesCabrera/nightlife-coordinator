exports.serveIndex = function(req, res, next) {
  res.render('index', { title: 'D\' NightLife' });
};