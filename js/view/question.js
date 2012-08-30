//Question view
define(['text!template/question.html','store','prettify','backbone'], function(html,store){
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

    },

    events: {
      'click .toggle': 'toggle',
      'click .remove': 'remove'
    },

    render: function(){
      this.log("render")


      this.$el.addClass("question").addClass("well");
      this.$el.html(this.template(this.model.toJSON()));

      this.$('pre>code').each(function(i,e) {
        $(e).parent().addClass('prettyprint');
      })

      prettyPrint();


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
