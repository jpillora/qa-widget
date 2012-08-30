define(['backbone'], function() {

  return Backbone.Model.extend({

    defaults: {
      'score'       : 0,
      'source'      : 'local',
      'tags'        : []
    },
    initialize: function() {
      this.log("init")
    }
  });

});