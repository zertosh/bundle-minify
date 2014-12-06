var _ = require('underscore');
var through = require('through2');
var uglify = require('uglify-js');

module.exports = function apply(b, opts_) {
  var opts = _.extend({}, opts_, {fromString: true});
  var buffers = [];

  b.pipeline.get('wrap').push(through(function(chunk, enc, next) {
    buffers.push(chunk);
    next();
  }, function(next) {
    var source = Buffer.concat(buffers).toString();
    var minified = uglify.minify(source, opts);
    this.push(minified.code);
    next();
  }));

  b.once('reset', function() {
    apply(b, opts_);
  });
};
