require.config({
  paths: { }
});

//App entry point
define(['view/widget','bootstrap','text', 
         'jquery-ext', 'jquery.cookie','jquery.color',
         'backbone-ext'], function(WidgetView) {

  var widget = new WidgetView();
  widget.render();
  return widget;
});