define(['model/question','backbone'], 
  function(QuestionModel){
  return Backbone.Collection.extend({
    name: "QuestionsList",
    model: QuestionModel,

    url: 'json/questions.json',
    // url: '/QAServer/question/',

    initialize: function() {
      this.log("init");
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
