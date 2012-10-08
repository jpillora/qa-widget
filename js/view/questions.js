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
      this.trigger('rendered');
    },

    reset: function() {

    },

    addAll: function() {
      var view = this;
      view.$el.slideUp('fast',function() { 
        $(this).empty().slideDown(); 
        view.list.each(view.addOne,view);
      });
    },

    addOne: function(model) {
      this.log("add: " + model.id)
      var questionView = new QuestionView({model: model});
      this.$el.append(questionView.render().hide().delay(100).slideDown('slow'));
    },

    createOne: function(obj) {
      this.list.add(new QuestionModel(obj));
    },

    createAll: function(objs) {
      this.list.add(_.map(objs, function(obj) { return new QuestionModel(obj) }));
    }

  });
});
