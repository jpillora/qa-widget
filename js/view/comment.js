//Comment view
define(['text!template/comment.html','model/comment','current-users','backbone'],
  function(html,CommentModel,users){

  return Backbone.View.extend({
    name: "CommentView",
    tagName: "tr",
    className: "comment",
    template: _.template(html),
    model: CommentModel,

    initialize: function() {
      this.model.bind('destroy', this.onDestroy, this);
      this.model.bind('change', users.update, users);
    },

    events: {
    },

    render: function(){
      this.executeTemplate();
      this.setupNestedViews();
      return this.$el;
    },

    remove: function() {
      this.model.destroy(); //will trigger destroy
    },
    onDestroy: function() {
      this.$el.slideUp('slow', function() {
        $(this).remove();
      });
    }

  });

});