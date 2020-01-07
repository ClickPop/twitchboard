module.exports = (req, res, next) => {
  if (req.originalUrl.split('/').pop().includes('favicon')) {
    return res.sendStatus(204).end();
  }
  next();
};
