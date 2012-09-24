define(['backbone'], function() {

  return Backbone.Model.extend({

    name: "QuestionModel",
    defaults: {
      'score'       : 0,
      'source'      : 'local',
      'title'       : "No Title",
      'body'        : "No Body",
      'answers'     : [],
      'comments'    : [],
      'tags'        : [],
      'hidden'      : true
    },
    initialize: function() {
    }
  });

});