//App entry point
define(['view/widget','bootstrap','text', 'css',
         'ext/jquery', 'lib/jquery.cookie','lib/jquery.color',
         'ext/backbone',
         //workaround just for building
         'view/comment',
         'view/comments',
         'view/answer',
         'view/answers',
         'view/body',
         'view/date',
         'view/voting'
         ], function(WidgetView) {

  var widget = new WidgetView();
  widget.render();
  return widget;
});