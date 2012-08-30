//Question view
define(['text!template/question.html','backbone'], function(html){
  return Backbone.View.extend({

  	name: "QuestionView",
    tagName: "div",
    template: _.template(html),

    render: function(){
      this.log("render")

      this.$el.addClass("question");//.addClass("span4");
      this.$el.html(this.template(this.model.toJSON()));

      return this.$el;
    }
    
  });
});
