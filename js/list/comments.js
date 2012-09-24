define(['model/comment','backbone'], 
  function(CommentModel){
  return Backbone.Collection.extend({
    name: "CommentsList",
    model: CommentModel,

    initialize: function() {
      
    }
  });
});
