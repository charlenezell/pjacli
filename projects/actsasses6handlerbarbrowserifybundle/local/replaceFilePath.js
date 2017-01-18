// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-zreplace';

// Plugin level function(dealing with files)
function gulpPrefixer(reg,replaceExp) {

  if (!reg||!replaceExp) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }

  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }
    if (file.isBuffer()) {
      file.contents = Buffer(file.contents.toString().replace(reg,replaceExp));
    }
    if (file.isStream()) {
    //   file.contents = file.contents.pipe(zreplace(prefixText));
    throw new PluginError(PLUGIN_NAME, 'not support stream');
    }

    cb(null, file);

  });

}

// Exporting the plugin main function
module.exports = gulpPrefixer;