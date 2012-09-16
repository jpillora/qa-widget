//Answer view
define(['text!template/answer.html','util/store','model/question','view/body','backbone'],
	function(html,store,QuestionModel,BodyView){

  return Backbone.View.extend({
    name: "QuestionView",
    tagName: "div",
    template: _.template(html),
    model: QuestionModel,

    initialize: function() {
      this.model.bind('destroy', this.onDestroy, this);
    },

    events: {
      //'click .toggle': 'toggle',
      'click .remove': 'remove'
    },

    render: function(){
      this.log("render");

      this.$el.addClass("answer").addClass("well").addClass("well-small");
      this.executeTemplate();

      this.body = new BodyView({el: this.$('.content>.body') }).render();

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