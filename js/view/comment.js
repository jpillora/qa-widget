//Comment view
define(['text!template/comment.html','util/store','model/comment','view/body','backbone'],
  function(html,store,CommentModel,BodyView){

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
      this.log("render");
      this.executeTemplate();

      this.body = new BodyView({el: this.$('.content>.body') }).render();

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