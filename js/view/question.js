//Question view
define(['text!template/question.html','store','view/body',
        'view/answers','list/answers','prettify','backbone'], 
  function(html,store,BodyView,AnswersView, AnswersList){
  return Backbone.View.extend({

    name: "QuestionView",
    tagName: "div",
    template: _.template(html),

    initialize: function() {
      //remove elem on destroy
      var model = this.model;
      model.bind('destroy', this.onDestroy, this);

      if(model.get('source') === 'stackoverflow')
        store.add('stackoverflow-questions', model.get('question_id'));

      this.answersList = new AnswersList(model.get('answers'));
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
        el: this.$('.content>.answers'),
        list: this.answersList
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
