var browserify = require('browserify');
var test = require('tap').test;
var uglify = require('uglify-js');

var bundleMinify = require('../');

test('bundle-minify', function(t) {
  t.plan(5);

  var pending = 2;
  var results = [];
  function done() {
    if (--pending !== 0) return;
    t.equal(results[0], results[1], 'plugin and uglify output match');
  }

  browserify(__dirname + '/bundle/main')
    .plugin(bundleMinify)
    .bundle(function(err, buf) {
      t.error(err, 'build failed');
      t.ok(buf);
      results.push(buf.toString());
      done();
    });

  browserify(__dirname + '/bundle/main')
    .bundle(function(err, buf) {
      t.error(err, 'build failed');
      t.ok(buf);
      var minified = uglify.minify(buf.toString(), {fromString: true});
      results.push(minified.code);
      done();
    });

});
