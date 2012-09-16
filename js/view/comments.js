define(['list/comments','view/comment', 'model/comment','backbone'],
  function(CommentsList,CommentView,CommentModel){

  return Backbone.View.extend({
    name: "CommentsView",

    initialize: function() {
      this.log("init");

      this.list = new CommentsList();
      this.list.on('reset', this.addAll, this);
      this.list.on('add', this.addOne, this);

      var parent = this.attributes.parent;
      if(parent)
        this.list.add(parent.get('comments')); 
      
    },

    render: function(){
      this.log("render");
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