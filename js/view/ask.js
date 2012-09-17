define(['text!template/similar.html','util/ga','qa-api','util/store','util/timer','backbone'], 
  function(similarHtml,ga,api,store,timer){

  return Backbone.View.extend({

    name: "Ask",
    el: $(".ask"),
    similarTemplate: _.template(similarHtml),

    initialize: function() {
      this.log("init");

    },

    events: {
      'click .submitBtn': 'submitQuestion',
      'click .similarsBtn': 'hideShowSimilars'
    },

    render: function(){
      var view = this;
      view.log("render");

      view.similars = view.$(".similars");
      view.submitTitle = this.$('.submitTitle');
      view.submitBody = this.$('.submitBody');
      view.submitTags = this.$('.submitTags');

      timer.idle(view.submitTitle, 'keyup', 1000, function(){
        view.similarsBtnMode("loading");
        api.stackOverflow.question.similar(view.submitTitle.val(),view,view.gotSimilars);
      });

      //load previously chosen questions
      var questions = store.get('stackoverflow-questions');
      if(questions && questions.length > 0)
        api.stackOverflow.question.get(questions.join(';'), view, view.gotQuestion);
    },

    submitQuestion: function() {

      var title = this.submitTitle.val(),
          body  = this.submitBody.val(),
          tags  = this.submitTags.val();

      api.local.question.submit(title,body,tags,this,this.gotQuestion)
    },

    hideShowSimilars: function() {
      this.similarsBtnMode("hide");
      this.similars.slideUp('slow');
    },

    gotSimilars: function(data) {
      var view = this;
      view.log("got similar: #" + (data.items ? data.items.length : data.items));
      if(data.items === undefined || data.items.length == 0) {
        view.similarsBtnMode("hide");
        return;
      }
      view.similars.empty();
      _.each(data.items, function(item) {
        var similar = $(view.similarTemplate(item))
        //on click load the chosen question into the questions list
        .click(function() {
          var id = item.question_id;
          api.stackOverflow.question.get(id, view, view.gotQuestion);
        });
        view.similars.append(similar);
      });
        
      view.similars.slideDown('slow');
      view.similarsBtnMode("shown");
      
    },


    gotQuestion: function(data) {
      if(data.items === undefined) {
        this.log("unknown question data");
        return;
      }
      this.log("got so question - adding...");
      for(var i = 0; i < data.items.length; ++i) {
        var item = data.items[i];
        item.source = 'stackoverflow';
        item.id = "SO"+item.question_id;
        this.trigger('addQuestion', item );
      }
    },

    similarsBtnMode: function(mode) {
      var btn = this.$(".similarsBtn");
      switch(mode) {
        case "loading": btn.html("Loading").addClass('loading').slideDown('slow'); break;
        case "shown": btn.html("Hide").removeClass('loading').slideDown('slow'); break;
        default: btn.slideUp('slow');
      } 
    }
    
  });
});
