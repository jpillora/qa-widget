define(['list/questions','view/question', 'model/question','backbone'],
  function(QuestionsList,QuestionView,QuestionModel){

  return Backbone.View.extend({
  	name: "QuestionsView",
    el: $("#questions"),

    initialize: function() {
      
      this.list = this.setupCollection('questions', QuestionsList);
    },

    render: function(){
      this.log("render");
    },

    addAll: function() {
      this.$el.html('');
      this.list.each(this.addOne,this);
    },

    addOne: function(model) {
      this.log("add: " + model.id)
      var questionView = new QuestionView({model: model});
      this.$el.append(questionView.render().hide().delay(100).slideDown('slow'));
    },

    createOne: function(obj) {

      var model = new QuestionModel(obj);
      this.list.add(model);
    }

  });
});
