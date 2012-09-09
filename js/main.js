//App entry point
define(['view/widget','bootstrap','text', 'css',
         'ext/jquery', 'lib/jquery.cookie','lib/jquery.color',
         'ext/backbone'], function(WidgetView) {

  var widget = new WidgetView();
  widget.render();
  return widget;
});