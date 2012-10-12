//App entry point
define(['view/widget','bootstrap','text', 'css',
         'ext/jquery', 'lib/jquery.cookie','lib/jquery.color',
         'ext/backbone',
         //for building
          'view/comment',
          'view/comments',
          'view/answer',
          'view/answers',
          'view/body',
          'view/date',
          'view/voting',
          'view/user',
          'lib/require/normalize'
         ], function(WidgetView) {

  var widget = new WidgetView();
  widget.render();
  return widget;


});