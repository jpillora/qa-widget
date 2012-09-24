define(['text!template/comments.html','list/comments',
  'view/comment', 'model/comment','model/answer',
  'model/question','qa-api','alert','backbone'],
  function(html,CommentsList,CommentView,CommentModel,
           AnswerModel,QuestionModel,api,alert){

  return Backbone.View.extend({
    name: "CommentsView",

    template: _.template(html),

    initialize: function() {
      

      this.list = this.setupCollection('comments', CommentsList);
      this.list.on('add', this.changed, this);
      this.list.on('remove', this.changed, this);
    },

    events: {
      "click .submit-comment-btn": "submitComment",
      "keyup .submit-comment"    : "keyPress"
    },


    keyPress: function(e) {
      if (e.keyCode == 13) this.submitComment();
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

      this.$('.submit-comment').attr('disabled','disabled');
      api.local.comment.submit(type, this.model.id, val, this, this.submittedComment);
    },

    submittedComment: function(data) {

      if(!data.items || data.items.length != 1)
        return;

      this.list.add(data.items[0]);
      this.$('.submit-comment').removeAttr('disabled').val('');
    },

    changed: function() {
      this.$('.list-comments').visible(this.list.length > 0);
    },

    render: function(){
      
      this.$el.html(this.template());
      this.table = this.$('.list-comments > .table');
      
      this.trigger('rendered');
    },

    addAll: function() {
      this.list.each(this.addOne,this);
    },

    addOne: function(model) {

      var commentView = new CommentView({model: model});
      var elem = commentView.render();
      elem.find('.content').hide().delay(100).slideDown('slow');

      this.table.append(elem);
    },

    createOne: function(obj) {
      var model = new CommentModel(obj);
      this.list.add(model);
    }

  });
});