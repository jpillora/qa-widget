define(['text!template/answers.html','list/answers','view/answer', 
  'model/answer','qa-api','alert','lib/jquery.autogrow','backbone'],
  function(html,AnswersList,AnswerView,AnswerModel,api,alert){

  return Backbone.View.extend({
    name: "AnswersView",
    template: _.template(html),

    initialize: function() {
      this.list = this.setupCollection('answers', AnswersList);
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
      

      this.$('.submit-answer-btn').attr('disabled','disabled');
      api.local.answer.submit(questionId, val, this, this.submittedAnswer);
    },

    submittedAnswer: function(data) {

      this.$('.submit-answer-btn').attr('disabled',null);
      if(!data.items || data.items.length != 1)
        return;

      alert.success("Your answer has been submitted", 2000);

      this.list.add(data.items[0]);
      this.$('.submit-answer').val('').trigger('keyup');;
    },

    change: function() {
      this.log("change!");
      this.$('.answers-container').visible(this.list.length > 0);
    },

    render: function(){
      this.log("render");

      this.$el.html(this.template());
      this.listElem = this.$('.list');

      this.$('textarea').autogrow();

      this.setupTogglers();
      this.setupHidables();
      this.setupNestedViews();
      
      this.trigger('rendered');
    },

    addAll: function() {
      this.list.each(this.addOne,this);
    },

    addOne: function(model) {
      var answerView = new AnswerView({model: model, attributes: {parent: this}});
      this.listElem.append(answerView.render().hide().delay(100).slideDown('slow'));
    },

    createOne: function(obj) {
      var model = new AnswerModel(obj);
      this.list.add(model);
    }

  });
});