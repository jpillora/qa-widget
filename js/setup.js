//Setup require paths

(function(){
  var lib = '../framework/js/lib/'

  require.config({
    paths: {
      package: [{
        name: 'framework',
        location : '../framework/js/'
      }],
      jquery:     lib+'jquery/jquery',
      'jquery.cookie' : lib+'jquery/plugin/jquery.cookie',
      'jquery.color'  : lib+'jquery/plugin/jquery.color',
      underscore: lib+'backbone/underscore',
      backbone:   lib+'backbone/backbone',
      bootstrap:  lib+'bootstrap/bootstrap',
      text:       lib+'require/require.text',
      templates:  'templates'
    },
    shim: {
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      'bootstrap': ['jquery'],
      'jquery.cookie': ['jquery'],
      'jquery.color': ['jquery']
    }
  });

  //Setup library customisations and Initialise the Widget
  require(['framework', 'views/widget','bootstrap','text', 'jquery',
           'jquery.cookie','jquery.color'], function(WidgetView) {
    
    var widget = new WidgetView();
    widget.render();
  });
})();
