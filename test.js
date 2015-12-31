var koa = require('koa')
  , session = require('koa-session')
  , flash = require('./')
  , request = require('supertest');

function App(opts) {
  var app = koa();

  app.keys = ['foo'];
  app.use(session(app));
  app.use(flash(opts));

  return app;
}

describe('koa flash', function () {
  it('should add a flash property', function (done) {
    var app = App();

    app.use(function *() {
      this.body = this.flash();
    });

    request(app.listen())
    .get('/')
    .expect({})
    .expect(200, done);
  });

  it('should require koa-session', function (done) {
    var app = koa();
    app.use(flash());

    request(app.listen())
    .get('/')
    .expect(500, done);
  });

  it('should set flash into session', function (done) {
    var app = App();

    app.use(function *() {
      this.flash('info', 'foo');

      this.body = this.session['flash'].info;
    });

    request(app.listen())
    .get('/')
    .expect(['foo'])
    .expect(200, done);
  });

  describe('when flash is set', function () {
    var agent;

    beforeEach(function (done) {
      var app = App();

      app.use(function *() {
        if (this.path == '/redirect') {
          return this.redirect('back');
        }

        this.body = this.flash('info');

        if (this.method === 'POST') {
          this.flash('info', { foo: 'bar' });
        }
      });

      agent = request.agent(app.listen());

      agent.post('/')
      .end(function (err) {
        if (err) return done(err);

        setImmediate(function () {
          done();
        });
      });
    });

    function expectFlash(done) {
      agent.get('/')
      .expect([{ foo: 'bar' }])
      .expect(200, done);
    }

    function expectFlashDeleted(done) {
      agent.get('/')
      .expect([{ foo: 'bar' }])
      .expect(200)
      .end(function(err) {
        setImmediate(function() {
          agent.get('/')
          .expect({})
          .expect(200, done);
        });
      });
    }

    it('should remember flash messages for one request', expectFlash);

    it('should delete flash messages after one request', expectFlashDeleted);

    describe('and app redirects a request', function () {

      beforeEach(function (done) {
        agent.get('/redirect').expect(302, function(err) {
          setImmediate(function() {
            agent.get('/redirect').expect(302, done)
          })
        })
      })

      it('should remember flash messages across redirects', expectFlash);

      it('should delete flash messages after redirect is resolved', expectFlashDeleted);

    })
  });
});
