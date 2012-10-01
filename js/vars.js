define(['util/log','underscore','jquery'],function(log) {

  var variables = {};
  var watchFor = {};

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

  function changes() {
    update();
    _.each(watchFor, function(data, key) {

      var val = variables[key];
      if(val === data.last)
        return;
      data.last = val;
      data.callback(val);
    });
  }

  $(window).bind('hashchange', changes);
  update();

  return {
    get: function(key, def) {
      var val = variables[key]; 
      if(val === undefined)
        return def;
      return val;
    },
    onChange: function(key, callback) {
      watchFor[key] = {callback: callback, last: variables[key] };
    }
  };

});