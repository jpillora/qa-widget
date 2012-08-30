define(['backbone'], function(){
  return Backbone.Collection.extend({
    name: "QuestionsList",
    initialize: function() {
      this.log("init");
    },
    url: 'json/questions.json'
  });
});
