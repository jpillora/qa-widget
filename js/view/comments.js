define(['text!template/comments.html','list/comments',
  'view/comment', 'model/comment','model/answer',
  'model/question','qa-api','alert','backbone'],
  function(html,CommentsList,CommentView,CommentModel,
           AnswerModel,QuestionModel,api,alert){

  return Backbone.View.extend({
    name: "CommentsView",

    template: _.template(html),

    initialize: function() {
      this.log("init");

      if(!this.attributes.parent)
        throw "No parent"

      this.model = this.attributes.parent.model;

      this.list = new CommentsList();
      this.list.on('reset', this.addAll, this);
      this.list.on('add', this.addOne, this);
      this.list.on('add', this.changed, this);
      this.list.on('remove', this.changed, this);
    },

    events: {
      "click .submit-comment-btn": "submitComment"
    },

    submitComment: function() {

      var val = this.$('.submit-comment').val();

      if(!val) {
        alert.error("You forgot to type your comment.");
        return;
      }

      var type;
      if(this.model instanceof AnswerModel)
        type = "answer";
      else if(this.model instanceof QuestionModel)
        type = "question";
      else 
        throw "Invalid model type";

      api.local.comment.submit(
        type, this.model.id, val, this, 
        function(data) {
          if(data.items && data.items.length === 1)
            this.list.add(data.items[0]);
        }
      );
    },

    changed: function() {
      this.$('.list-comments').visible(this.list.length > 0);
    },

    render: function(){
      this.log("render");

      this.$el.html(this.template());
      this.table = this.$('.list-comments > .table')

      var comments = this.parentGet('comments');
      if(comments && comments.length > 0) 
        this.list.add(comments);
      else 
        this.changed();
    },

    addAll: function() {
      this.list.each(this.addOne,this);
    },

    addOne: function(model) {
      var commentView = new CommentView({model: model});
      var elem = commentView.render();
      elem.find('.content').hide().delay(100).slideDown('slow')
      this.table.append(elem);
    },

    createOne: function(obj) {
      var model = new CommentModel(obj);
      this.list.add(model);
    }

  });
});