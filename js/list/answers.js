define(['model/answer','backbone'], 
  function(AnswerModel){
  return Backbone.Collection.extend({
    name: "AnswersList",
    model: AnswerModel,

    initialize: function() {
    },

    comparator: function(answer) {
      return (answer.get('is_accepted') === true) ? -1e9 :
             (answer.get('score'))*(-1);
    }
  });
});
