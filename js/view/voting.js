define(['qa-api', 'model/question', 'model/answer', 'model/comment', 'backbone'], 
    function(api, QuestionModel, AnswerModel, CommentModel) {

  return Backbone.View.extend({

    name: "VotingView",

    initialize: function() {
      this.model = this.attributes.parent.model;
    },

    events: {
      'click .up'  : 'upVote',
      'click .down'  : 'downVote'
    },

    render: function() {
      this.log("render");
    },

    upVote: function() {
      this.submitVote(1);
    },
    
    downVote: function() {
      this.submitVote(-1);
    },

    submitVote: function(value) {

      if(!this.model)
        throw "VotingView: No parent model";

      var type;
      if(this.model instanceof AnswerModel)
        type = "answer";
      else if(this.model instanceof QuestionModel)
        type = "question";
      else if(this.model instanceof CommentModel)
        type = "comment";
      else 
        throw "VotingView: Invalid model type";

      api.local.vote.submit(type, this.model.id, value, this, this.submittedVote);
    },

    submittedVote: function(data) {
      if(data.score !== undefined) {
        this.model.set('score', data.score);
        this.$('.vote_count').html(this.model.get('score'));
      }
    }

  });

});