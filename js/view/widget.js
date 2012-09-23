define(['view/questions','view/ask','util/ga','backbone'], 
  function(QuestionsView,AskView,ga) {

  return Backbone.View.extend({
    name: "Widget",
    el: $("#widget"),

    render: function(){
      this.log("render");

      window.onerror = function(msg, url, line) {
        ga.event('error',msg,url+":"+line);
      };

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
