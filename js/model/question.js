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
      'hidden'      : true,
      'link'        : null,
      'owner'       : null,
      'user_id'     : -1
    },
    initialize: function() {
      var creation_date = this.get('creation_date');
      if(creation_date) this.set('created_at', creation_date*1000);
    }
  });

});