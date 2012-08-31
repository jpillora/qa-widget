define(['backbone'], function() {

  return Backbone.Model.extend({

    name: "AnswerModel",
    defaults: {
    },
    initialize: function() {
      this.log("init")
    }
  });

});