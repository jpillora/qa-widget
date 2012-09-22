//Answer view
define(['text!template/answer.html','util/store','model/answer','backbone'],
	function(html,store,AnswerModel){

  return Backbone.View.extend({
    name: "AnswerView",
    tagName: "div",
    template: _.template(html),
    model: AnswerModel,

    initialize: function() {
      this.model.bind('destroy', this.onDestroy, this);
    },

    render: function(){
      this.log("render");

      this.$el.addClass("answer")
      .addClass("well")
      .addClass("well-small");

      if(this.model.get('is_accepted') === true)
        this.$el.addClass("accepted");

      this.executeTemplate();
      this.setupNestedViews();

      return this.$el;
    },
    
    remove: function() {
      this.model.destroy(); //will trigger destroy
    },
    onDestroy: function() {
      this.$el.slideUp('slow', function() {
        $(this).remove();
      });
    }

  });

});