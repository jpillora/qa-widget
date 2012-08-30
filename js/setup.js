//Setup require paths

(function(){
  var f = '../../../JavaScript/js-framework/js/', 
      lib = f + 'lib/'

  require.config({
    paths: {

      package: [{
        name: 'framework',
        location: '../../../JavaScript/js-framework/js/',
        main: 'scriptfileToLoad'
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
  require(['views/widget', f+'util/ga','bootstrap','text', 'jquery',
           'jquery.cookie','jquery.color'], function(WidgetView,ga) {
    
    var widget = new WidgetView();
    widget.render();
  });
})();
