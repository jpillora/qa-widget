define(['model/question','vars','util/store','backbone'], 
  function(QuestionModel,vars,store){
  return Backbone.Collection.extend({
    name: "QuestionsList",
    model: QuestionModel,

    initialize: function() {
      _.bind(this.comparator);
      this.compareField = store.get('questions-sort-field') || 'created_at';
    },

    comparator: function(question) {
      return -question.get(this.compareField);
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
