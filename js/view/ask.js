define(['text!template/similar.html','util/ga',
  'qa-api','util/store','util/timer','filters','backbone'], 
  function(similarHtml,ga,api,store,timer,filters){

  return Backbone.View.extend({

    name: "Ask",
    el: $(".ask"),
    similarTemplate: _.template(similarHtml),

    initialize: function() {
      this.log("init");

    },

    events: {
      'click .submitBtn'   : 'submitQuestion'
    },

    render: function(){
      var view = this;
      view.log("render");

      this.setupTogglers();
      
      view.similars = view.$(".similars");
      view.similarsBtn = view.$(".similarsBtn");
      view.submitTitle = view.$('.submitTitle');
      view.submitBody = view.$('.submitBody');
      view.submitTags = view.$('.submitTags');

      //title listeners
      timer.idle(view.submitTitle, 'keyup', 1000, function(){
        view.similarsIsLoading(true);
        api.stackOverflow.question.similar(view.submitTitle.val(),view,view.gotSimilars);
      });

      //body listeners
      view.submitBody.autogrow();

      //tag listeners
      view.submitTags.typeahead({
          source: function (query, typeahead) {
            var query = query.match(/ /);
            api.stackOverflow.tag.similar(query, view,
              function (data) {

                var names = _.map(data.items, function(i) {
                  return i.name;
                });

                if(names.length > 0)
                  return typeahead(names);
              }
            );
          }
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

      api.local.question.submit(title,body,tags,this, filters.showQuestion(this.gotQuestion))
    },

    gotSimilars: function(data) {

      if(data.items === undefined) return;

      var view = this, numItems = data.items.length;


      view.log("got similar: #" + numItems);
      
      view.similars.empty();
      _.each(data.items, function(item) {
        var similar = $(view.similarTemplate(item))
        //on click load the chosen question into the questions list
        .click(function() {
          var id = item.question_id;
          api.stackOverflow.question.get(id, view, 
            filters.showQuestion(view.gotQuestion));
        });
        view.similars.append(similar);
      });
        
      view.similars.slideDown('slow', function() {
        view.similarsIsLoading(false, numItems !== 0);
      });
    },

    gotQuestion: function(data) {
      if(data.items === undefined)
        return this.log("unknown question data");
      this.log("got question - adding...");
      
      for(var i = 0; i < data.items.length; ++i)
        this.trigger('addQuestion', data.items[i] );
      
    },

    similarsIsLoading: function(loading,show) {

      if(show === undefined)
        show = true;

      if(show)
        this.similarsBtn.slideDown('slow');
      else
        this.similarsBtn.slideUp('slow');

      if(loading)
        this.similarsBtn.addClass('loading').html("Loading");
      else
        this.similarsBtn
        .removeClass('loading')
        .html(this.similars.is(":hidden") ? "Show" : "Hide");
    }
    
  });
});
