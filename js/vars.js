define(function() {

  var variables = {};

  //update hash vars
  function update() {
    var str = window.location.hash.substr(1),
        vars = str.split('&'),
        obj = {};

    for(var i = 0; i < vars.length; ++i) {
      var pair = vars[i].split('=');
      if(pair.length != 2) continue;
      obj[pair[0]] = pair[1];
    }
    
    variables = $.extend({},obj);
  }

  return {
    get: function(key, def) {
      update();
      var val = variables[key]; 
      if(val === undefined)
        return def;
      return val;
    }
  };

});