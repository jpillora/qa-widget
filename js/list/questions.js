define(['model/question','backbone'], 
  function(QuestionModel){
  return Backbone.Collection.extend({
    name: "QuestionsList",
    model: QuestionModel,
    
    url: '/qa/question/',

    initialize: function() {
      this.log("init");
    },

    parse: function(response) {
      if(response && response.items)
        return response.items;
      return [];
    }
  });
});
