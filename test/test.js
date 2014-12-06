/* global -Promise */

var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var test = require('tape');
var uglify = require('uglify-js');

test('bundle-minify', function(t) {
  t.plan(1);

  var bundleMinify = require('../');

  var pWithPlugin = new Promise(function(resolve, reject) {
    browserify('./test/fixtures/backbone')
      .plugin(bundleMinify)
      .bundle(function(err, buf) {
        resolve(buf.toString());
      });
  });

  var pWithoutPlugin = new Promise(function(resolve, reject) {
    browserify('./test/fixtures/backbone')
      .bundle(function(err, buf) {
        resolve(
          uglify.minify(buf.toString(), {fromString: true}).code
        );
      });
  });

  Promise.all([pWithPlugin, pWithoutPlugin]).then(function(values) {
    var withPlugin = values[0];
    var withoutPlugin = values[1];
    t.equal(withPlugin, withoutPlugin, 'plugin and uglify output match');
    t.end();
  });
});
