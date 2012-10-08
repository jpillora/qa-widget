define(['model/answer','backbone'], 
  function(AnswerModel){
  return Backbone.Collection.extend({
    name: "AnswersList",
    model: AnswerModel,

    initialize: function() {
    },

    comparator: function(answer1, answer2) {
      if(answer2.get('is_accepted') === true)
        return 1;
      if(answer2.get('score') > answer1.get('score'))
        return 1
      if(answer1.get('score') > answer2.get('score'))
        return -1
      return 0;
    }
  });
});
