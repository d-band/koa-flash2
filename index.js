var flash = require('connect-flash');

module.exports = function(opts) {
  var fn = flash(opts);
  return function*(next) {
    if (this.session === undefined) throw new Error('koa-flash requires the koa-session middleware.');

    yield fn.bind(null, this.req, this.res);

    this.flash = this.req.flash;

    yield next;
  };
};