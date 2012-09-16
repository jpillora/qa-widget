//Question view
define(['text!template/question.html','util/store','view/body',
        'view/answers', 'model/question','backbone'], 
  function(html,store,BodyView,AnswersView, QuestionModel){
  return Backbone.View.extend({

    name: "QuestionView",
    tagName: "div",
    template: _.template(html),
    model: QuestionModel,

    initialize: function() {
      //remove elem on destroy
      var model = this.model;
      model.bind('destroy', this.onDestroy, this);

      if(model.get('source') === 'stackoverflow')
        store.add('stackoverflow-questions', model.get('question_id'));

    },

    events: {
      'click .toggle': 'toggle',
      'click .remove': 'remove'
    },

    render: function(){
      this.log("render")

      this.$el.addClass("question").addClass("well");
      this.executeTemplate();

      this.body = new BodyView({el: this.$('.content>.body') }).render();
      this.answers = new AnswersView({
        el: this.$('.content>.answers>.list'),
        attributes: { parent: this.model }
      }).render();

      return this.$el;
    },

    toggle: function() {
      var view = this;
      view.$('.content').toggle('slow', function() {
        view.$('.toggle').html($(this).is(':hidden') ? 'Show' : 'Hide');
      });
    },

    remove: function() {
      if(this.model.get('source') === 'stackoverflow')
        store.remove('stackoverflow-questions', this.model.get('question_id'));

      this.model.destroy(); //will trigger destroy
    },
    onDestroy: function() {
      this.$el.slideUp('slow', function() {
        $(this).remove();
      });
    }

    
  });
});
