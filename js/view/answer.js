//Answer view
define(['text!template/answer.html','util/store','model/answer','view/body','view/comments','backbone'],
	function(html,store,AnswerModel,BodyView,CommentsView){

  return Backbone.View.extend({
    name: "AnswerView",
    tagName: "div",
    template: _.template(html),
    model: AnswerModel,

    initialize: function() {
      this.model.bind('destroy', this.onDestroy, this);
    },

    events: {
      'click .toggle': 'toggle',
      'click .remove': 'remove'
    },

    render: function(){
      this.log("render");

      this.$el.addClass("answer").addClass("well").addClass("well-small");
      this.executeTemplate();

      this.body = new BodyView({el: this.$('.content>.body') }).render();
      
      this.comments = new CommentsView({
        el: this.$('.content>.comments>.table').first(),
        attributes: { parent: this.model }
      }).render();

      return this.$el;
    },


    toggle: function() {
      var view = this, btn = $(this);
      btn.closest('.content').first().toggle('slow', function() {
        btn.html($(this).is(':hidden') ? 'Show' : 'Hide');
      });
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