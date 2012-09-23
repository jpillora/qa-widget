define(['view/questions','view/ask','backbone'], 
  function(QuestionsView,AskView) {

  return Backbone.View.extend({
    name: "Widget",
    el: $("#widget"),

    render: function(){
      this.log("render");

      this.setupNestedViews(function() {
        //nested views loaded
        this.ask.on('addQuestion', this.questions.createOne, this.questions);
      
        window.questionView = this.questions;

        this.$('.loading-cover').animate({opacity:0,height:0},2000,function() {
          $(this).hide();
        });
      });

    }
    
  });
});
