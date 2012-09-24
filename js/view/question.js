//Question view
define(['text!template/question.html','util/store',
  'model/question','vars','backbone'], 
  function(html,store,QuestionModel,vars){

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
      'click .remove': 'remove'
    },

    render: function(){
      this.log("render")

      this.$el
        .addClass("question")
        .addClass("well")
        .addClass("source-" + this.model.get('source'));

      var user_id = vars.get('user_id');
      if(user_id && user_id == this.model.get('user_id'))
        this.$el.addClass("owned");

      this.executeTemplate();
      this.setupTogglers();
      this.setupNestedViews();

      var view = this;
      if(this.model.get('hidden') === false)
      setTimeout(function() {
        view.$el.scrollTo();
      },1000)

      return this.$el;
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
