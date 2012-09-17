define(['list/comments','view/comment', 'model/comment','backbone'],
  function(CommentsList,CommentView,CommentModel){

  return Backbone.View.extend({
    name: "CommentsView",

    initialize: function() {
      this.log("init");

      this.list = new CommentsList();
      this.list.on('reset', this.addAll, this);
      this.list.on('add', this.addOne, this);

      var comments = this.attributes.parent && this.attributes.parent.get('comments');
      if(comments) this.list.add(comments);

    },

    render: function(){
      this.log("render");
      
      if(this.list.length === 0)
        this.$el.append('<tr><td class="no-comment">No comments yet</td></tr>');
      
      //this.$el.find(".no-comment").remove();
    },

    addAll: function() {
      this.list.each(this.addOne,this);
    },

    addOne: function(model) {
      var commentView = new CommentView({model: model});
      this.$el.append(commentView.render().hide().delay(100).slideDown('slow'));
    },

    createOne: function(obj) {
      var model = new CommentModel(obj);
      this.list.add(model);
    }

  });
});