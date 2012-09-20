define(['text!template/answers.html','list/answers','view/answer', 'model/answer','lib/jquery.autogrow','backbone'],
  function(html,AnswersList,AnswerView,AnswerModel){

  return Backbone.View.extend({
    name: "AnswersView",
    template: _.template(html),

    initialize: function() {
      this.log("init");

      this.list = new AnswersList();
      this.list.on('reset', this.addAll, this);
      this.list.on('add', this.addOne, this);

      this.content = $(this.template());
      this.listElem = this.content.siblings('.list-answers');

      var answers = this.parentGet('answers');
      if(answers) this.list.add(answers); 
      
    },

    events: {
      "click .submitBtn": "submitAnswer"
    },

    submitAnswer: function() {
      this.log("submit!")
    },

    render: function(){
      this.log("render");
      this.$el.html(this.content);

      this.$('textarea').autogrow();

      this.setupTogglers();
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