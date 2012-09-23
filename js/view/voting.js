define(['qa-api', 'model/question', 'model/answer', 'model/comment', 'backbone'], 
    function(api, QuestionModel, AnswerModel, CommentModel) {

  return Backbone.View.extend({

    name: "VotingView",

    initialize: function() {

    },

    events: {
      'click .up'  : 'upVote',
      'click .down'  : 'downVote'
    },

    render: function() {
      this.log("render");
    },

    upVote: function() {
      this.log("up!");
      this.submitVote(1);
    },
    
    downVote: function() {
      this.log("down!");
      this.submitVote(-1);
    },

    submitVote: function(value) {

      var model = this.attributes.parent.model;
      var type;
      if(model instanceof AnswerModel)
        type = "answer";
      else if(model instanceof QuestionModel)
        type = "question";
      else if(model instanceof CommentModel)
        type = "comment";
      else 
        throw "Invalid model type";

      api.local.vote.submit(type, model.id, value, this, this.submittedVote);
    },

    submittedVote: function(data) {
      this.log("data: " + JSON.stringify(data));
    }

  });

});