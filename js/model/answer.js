define(['backbone'], function() {

  return Backbone.Model.extend({

    name: "AnswerModel",
    defaults: {
      score    : 0
    },
    initialize: function() {
      this.log("init");
    }
  });

});