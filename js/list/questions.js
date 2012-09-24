define(['model/question','vars','backbone'], 
  function(QuestionModel,vars){
  return Backbone.Collection.extend({
    name: "QuestionsList",
    model: QuestionModel,
    
    initialize: function() {
      
    },

    parse: function(response) {
      if(response && response.items)
        return response.items;
      if(response)
        return response;
      return [];
    }

  });
});
