define(['list/questions','view/question', 'model/question',
        'util/store','backbone'],
  function(QuestionsList,QuestionView,QuestionModel,store){

  return Backbone.View.extend({
  	name: "QuestionsView",
    el: $("#questions"),

    initialize: function() {
      
      this.list = this.setupCollection('questions', QuestionsList);
      this.views = [];
    },

    events: {
      'click button.sort-btn': 'sortAll'
    },

    render: function(){
      this.log("render");
      this.container = this.$('.questions-container');

      this.$('.sort-btns button[data-field='+this.list.compareField+']').addClass('active');

      this.trigger('rendered');
    },

    sortAll: function(e) {

      this.log('sorting');

      var btn = $(e.currentTarget).addClass('active');
      var others = btn.siblings('button').removeClass('active');

      var field = btn.data('field');

      store.set('questions-sort-field', field)

      this.list.compareField = field;
      this.list.sort();
    },

    change: function() {
      this.log("change!");
      this.$('.no-questions').visible(!this.list.length);
    },

    reset: function() {
    },

    addAll: function() {

      var toRemove = []
      var toKeep = [];
      _.each(this.views, $.proxy(function(view) {
        if(this.list.contains(view.model))
          toKeep.push(view);
        else
          toRemove.push(view);
      }, this));

      //remove
      _.each(toRemove, function(view) {
        view.remove();
      });

      this.views = toKeep;

      this.log('add all: #%s (current views #%s)', this.list.length, this.views.length);

      this.list.each(this.addOne,this);
    },

    addOne: function(model) {
      //retrieve view using model
      var questionView = this.getViewByModel(model);

      //build view if not built
      var isNew = !questionView
      if(isNew) {
        this.log("add: %s - %s", model.id, model.get('title'));
        questionView = new QuestionView({model: model});
        this.views.push(questionView);
      }

      //build element
      var elem = questionView.render();

      //slide down new views
      if(isNew)
        elem.hide().delay(100).slideDown('slow');

      //insert in correct sorted position
      var position = this.list.indexOf(model);
      var prevModel = this.list.at(position-1);
      var prevView = this.getViewByModel(prevModel);

      if(position === 0) {
        this.container.prepend(elem);
      } else if(prevView) {
        prevView.$el.after(elem)
      } else {
        this.container.append(elem);
        console.log(elem)
      }

      return true;
    },

    getViewByModel: function(model) {
      return _.find(this.views, function(view) {
        return view.model === model;
      });
    },

    createOne: function(obj) {
      this.list.add(new QuestionModel(obj));
    },

    createAll: function(objs) {
      this.list.add(_.map(objs, function(obj) { return new QuestionModel(obj) }));
    }

  });
});
