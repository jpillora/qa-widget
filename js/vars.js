define(['util/log','underscore','jquery'],function(log) {

  var variables = {};
  var watchFor = {};

  //update hash vars
  function grab() {
    var str = window.location.hash.substr(1),
        vars = str.split('&'),
        obj = {};

    if(!str) return false;

    for(var i = 0; i < vars.length; ++i) {
      var pair = vars[i].split('=');
      if(pair.length != 2) continue;
      obj[pair[0]] = pair[1];
    }
    
    $.extend(variables,obj);
    //window.location.hash = '';
    return true;
  }

  function changes() {
    if(!grab()) return;
    _.each(watchFor, function(data, key) {
      var val = variables[key];
      if(val === data.last)
        return;

      var isValid = data.callback(val);

      if(isValid === false)
        variables[key] = data.last;
      else
        data.last = val;

    });
  }

  if($.browser.msie && $.browser.version <= 7)
    setInterval(changes, 2000);
  else
    $(window).bind('hashchange', changes);

  grab();

  return {
    set: function(key, val, trigger) {
      variables[key] = val;
      if(trigger && watchFor[key]) watchFor[key].callback(val);
    },
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