define(['view/questions','view/ask','backbone'], 
  function(QuestionsView,AskView) {

  return Backbone.View.extend({
    name: "Widget",
    el: $("#widget"),

    render: function(){
      this.log("render");

      var askView = new AskView();
      askView.render();

      var questionsView = new QuestionsView();
      questionsView.render();

      askView.on('addQuestion', questionsView.createOne, questionsView);
    }
    
  });
});
