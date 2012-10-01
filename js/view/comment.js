//Comment view
define(['text!template/comment.html','model/comment','backbone'],
  function(html,CommentModel){

  return Backbone.View.extend({
    name: "CommentView",
    tagName: "tr",
    template: _.template(html),
    model: CommentModel,

    initialize: function() {
      this.model.bind('destroy', this.onDestroy, this);
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