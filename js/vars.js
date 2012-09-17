define(function() {

  var variables = {};

  //set hash vars
  variables.hash = (function() {
    var str = window.location.hash.substr(1),
        vars = str.split('&'),
        obj = {};

    for(var i = 0; i < vars.length; ++i) {
      var pair = vars[i].split('=');
      if(pair.length != 2) continue;
      obj[pair[0]] = pair[1];
    }
    return obj;
  })();

  return variables;
  // return {
  //   set: function(key,val) { variables[key] = val; },
  //   get: function(key)     { return variables[key]; }
  // };

});