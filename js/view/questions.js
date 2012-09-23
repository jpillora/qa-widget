define(['list/questions','view/question', 'model/question',
        'qa-api','backbone'],
  function(QuestionsList,QuestionView,QuestionModel,api){

  return Backbone.View.extend({
  	name: "QuestionsView",
    el: $("#questions"),

    initialize: function() {
      this.log("init");

      this.list = new QuestionsList();
      this.list.on('reset', this.addAll, this)
      this.list.on('add', this.addOne, this)
      
      api.local.question.get(this,function(data) {
        if(data.items && data.items.length > 0)
          this.list.reset(data.items);
      });

    },

    render: function(){
      this.log("render");
    },

    addAll: function() {
      //this.$el.html('');
      this.list.each(this.addOne,this);
    },

    addOne: function(model) {
      var questionView = new QuestionView({model: model});
      this.$el.append(questionView.render().hide().delay(100).slideDown('slow'));
    },

    createOne: function(obj) {

      var model = new QuestionModel(obj);
      this.list.add(model);
    }

  });
});
