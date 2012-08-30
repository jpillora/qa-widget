define(['model/question','backbone'], 
  function(QuestionModel){
  return Backbone.Collection.extend({
    name: "QuestionsList",
    model: QuestionModel,
    
    url: 'json/questions.json',

    initialize: function() {
      this.log("init");
    }
  });
});
