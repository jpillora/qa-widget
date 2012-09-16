define(['list/answers','view/answer', 'model/answer','backbone'],
  function(AnswersList,AnswerView,AnswerModel){

  return Backbone.View.extend({
    name: "AnswersView",

    initialize: function() {
      this.log("init");

      this.list = new AnswersList();
      this.list.on('reset', this.addAll, this);
      this.list.on('add', this.addOne, this);

      var parent = this.attributes.parent;
      if(parent)
        this.list.add(parent.get('answers')); 
      
    },

    render: function(){
      this.log("render");
    },

    addAll: function() {
      this.list.each(this.addOne,this);
    },

    addOne: function(model) {
      var answerView = new AnswerView({model: model});
      this.$el.append(answerView.render().hide().delay(100).slideDown('slow'));
    },

    createOne: function(obj) {
      var model = new AnswerModel(obj);
      this.list.add(model);
    }

  });
});