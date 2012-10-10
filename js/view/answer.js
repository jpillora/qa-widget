//Answer view
define(['text!template/answer.html','util/store',
        'model/answer','qa-api',
        'current-users','backbone'],
	function(html,store,AnswerModel,api,users){

  return Backbone.View.extend({
    name: "AnswerView",
    tagName: "div",
    template: _.template(html),
    model: AnswerModel,

    initialize: function() {
      this.model.bind('destroy', this.onDestroy, this);
      this.model.bind('change:is_accepted', this.acceptedCheck, this);
      this.model.bind('change:score', users.update, users);
    },

    events: {
      "click .voting .accept" : "acceptAnswer"
    },

    render: function(){
      this.log("render");

      this.$el.addClass("answer")
      .addClass("well")
      .addClass("well-small");

      this.acceptedCheck();

      this.executeTemplate();
      this.setupNestedViews();

      return this.$el;
    },
    
    acceptAnswer: function() {
      api.local.answer.accept(this.model.id, this, this.acceptedAnswer);
    },

    acceptedAnswer: function(data) {
      if(!data.items || data.items.length != 1)
        return;

      this.model.set('is_accepted',true);
    },

    remove: function() {
      this.model.destroy(); //will trigger destroy
    },

    acceptedCheck: function() {
      if(this.model.get('is_accepted') === true)
        this.$el.addClass("accepted");
    },

    onDestroy: function() {
      this.$el.slideUp('slow', function() {
        $(this).remove();
      });
    }

  });

});