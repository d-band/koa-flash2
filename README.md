#koa-flash2

Flash messages for [koa](https://github.com/koajs/koa) based on [connect-flash](https://github.com/jaredhanson/connect-flash).

[![Build Status](https://travis-ci.org/d-band/koa-flash2.svg?branch=master)](https://travis-ci.org/d-band/koa-flash2)
[![Coverage Status](https://coveralls.io/repos/d-band/koa-flash2/badge.svg?branch=master)](https://coveralls.io/github/d-band/koa-flash2)
## Installation

```js
$ npm install koa-flash2
```

koa-flash2 also depends on [koa-session](https://github.com/koajs/session). You must add koa-session as a middleware prior to adding koa-flash2 as seen in the example:

## Example

```js
var koa = require('koa')
  , session = require('koa-session')
  , flash = require('koa-flash2');

var app = koa();

app.keys = ['foo'];
app.use(session(app));
app.use(flash());

app.use(function *() {
  if (this.method === 'POST') {
    this.flash('error', 'This is a flash error message.');
  } else if (this.method === 'GET') {
    this.body = this.flash('error');
  }
});

app.listen(3000);
```

## License

MIT
