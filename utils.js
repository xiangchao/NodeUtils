/*! Copyright (c) 2012, Jack Xiang Chao, BSD License */

(function(exports){

  var fs = require('fs');
  var path = require('path');
  
  function fileCopy(filename1, filename2, done) {
      var input = fs.createReadStream(filename1);
      mkdirp(path.dirname(filename2));
      var output = fs.createWriteStream(filename2);
      input.on("data", function(d) { output.write(d); });
      input.on("error", function(err) { throw err; });
      input.on("end", function() {
          output.end();
          if (done) done();
      });
  }

  function mkdirp(p){
    p = path.resolve(p);
    try{
      fs.mkdirSync(p);
    }catch(err0){
      switch(err0.code){
        case 'ENOENT':
          var err1 = mkdirp(path.dirname(p));
          if(err1) throw err1;
          else return mkdirp(p);
          break;
        case 'EEXIST':
          var stat;
          try{
            stat = fs.statSync(p);
          }catch(err1){
            throw err0;
          }
          if(!stat.isDirectory()) throw err0;
          else return null;
          break;
        default:
          throw err0;
          break;
      }
    }
    return null;
  }

  function unique(results){
    results.sort();
    for ( var i = 1; i < results.length; i++ ) {
      if ( results[i] === results[ i - 1 ] ) {
        results.splice( i--, 1 );
      }
    }
    return results;
  }


  exports.fileCopy = fileCopy;
  exports.unique = unique;
  exports.mkdirp = mkdirp;

})(typeof exports === 'undefined' ? (window.Utils = {}) : exports);
