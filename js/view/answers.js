define(['text!template/answers.html','list/answers','view/answer', 
  'model/answer','qa-api','alert','lib/jquery.autogrow','backbone'],
  function(html,AnswersList,AnswerView,AnswerModel,api,alert){

  return Backbone.View.extend({
    name: "AnswersView",
    template: _.template(html),

    initialize: function() {
      

      this.list = this.setupCollection('answers', AnswersList);
      this.list.on('add', this.changed, this);
      this.list.on('remove', this.changed, this);
    },

    events: {
      "click .submit-answer-btn": "submitAnswer"
    },

    submitAnswer: function() {

      var val = this.$('.submit-answer').val();

      if(!val) {
        alert.error("That's not much of an answer is it ?");
        return;
      }

      var questionId = this.model.id;
      if(!questionId)
        throw "Missing question id"

      api.local.answer.submit(questionId, val, this, 
        function(data) {
          if(data.items)
            this.list.add(data.items[0]);
        }
      );
    },

    changed: function() {
      this.$('.answers-container').visible(this.list.length > 0);
    },

    render: function(){
      this.log("render");

      this.$el.html(this.template());
      this.listElem = this.$('.list');

      this.$('textarea').autogrow();

      this.setupTogglers();
      
      this.trigger('rendered');
    },

    addAll: function() {
      this.list.each(this.addOne,this);
    },

    addOne: function(model) {
      var answerView = new AnswerView({model: model});
      this.listElem.append(answerView.render().hide().delay(100).slideDown('slow'));
    },

    createOne: function(obj) {
      var model = new AnswerModel(obj);
      this.list.add(model);
    }

  });
});