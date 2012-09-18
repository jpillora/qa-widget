define(['text!template/comments.html','list/comments','view/comment', 'model/comment','backbone'],
  function(html,CommentsList,CommentView,CommentModel){

  return Backbone.View.extend({
    name: "CommentsView",

    template: _.template(html),

    initialize: function() {
      this.log("init");

      this.list = new CommentsList();
      this.list.on('reset', this.addAll, this);
      this.list.on('add', this.addOne, this);

      this.content = $(this.template());
      this.table = this.content.siblings('.list-comments').children('.table')

      var comments = this.parentGet('comments');
      if(comments) this.list.add(comments);

    },

    render: function(){
      this.log("render");
      
      this.$el.html(this.content);

      if(this.list.length === 0)
        this.table.append('<tr><td class="no-comment">No comments yet</td></tr>');

    },

    addAll: function() {
      this.list.each(this.addOne,this);
    },

    addOne: function(model) {
      var commentView = new CommentView({model: model});
      this.table.append(commentView.render().hide().delay(100).slideDown('slow'));
    },

    createOne: function(obj) {
      var model = new CommentModel(obj);
      this.list.add(model);
    }

  });
});