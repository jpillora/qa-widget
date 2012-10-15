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
      //property aliases
      var creation_date = this.get('creation_date');
      if(creation_date) this.set('created_at', creation_date*1000);

      var last_activity_date = this.get('last_activity_date');
      if(last_activity_date)
        this.set('updated_at', last_activity_date);
    }
  });

});