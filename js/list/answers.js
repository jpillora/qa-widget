define(['model/answer','backbone'], 
  function(AnswerModel){
  return Backbone.Collection.extend({
    name: "AnswersList",
    model: AnswerModel,

    initialize: function() {
      
    }
  });
});
