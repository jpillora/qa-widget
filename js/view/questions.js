define(['list/questions','view/question', 'model/question','backbone'],
  function(QuestionsList,QuestionView,QuestionModel){

  return Backbone.View.extend({
  	name: "QuestionsView",
    el: $("#questions"),

    model: QuestionModel,

    initialize: function() {
      this.log("init");

      this.list = new QuestionsList();
      this.list.on('reset', this.addAll, this)
      this.list.on('add', this.addOne, this)
      this.list.fetch();
    },

    render: function(){
      this.log("render");
    },

    addAll: function() {
      //this.$el.html('');
      this.list.each(this.addOne,this);
    },

    addOne: function(model) {
      var questionView = new QuestionView({model: model});
      this.$el.append(questionView.render().hide().delay(100).slideDown('slow'));
    },

    createOne: function(obj) {

      var model = new QuestionModel(obj);
      this.list.add(model);
    }

  });
});
