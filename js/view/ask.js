define(['text!template/similar.html','util/ga',
  'qa-api','util/store','util/timer','alert','backbone'], 
  function(similarHtml,ga,api,store,timer,alert){

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
      view.submitTagsObj = {};

      //title listeners
      timer.idle(view.submitTitle, 'keyup', 1000, function(){
        var title = view.submitTitle.val();
        if(!title || title.length < 5) return;

        view.similarsIsLoading(true);
        api.stackOverflow.question.similar(title,view,view.gotSimilars);
      });

      //body listeners
      view.submitBody.autogrow();

      //tag listeners
      view.submitTags.typeahead({
        source: function (query, process) {
          var query = query.match(/([^,]*)$/)[0];
          api.stackOverflow.tag.similar(query, view,
            function (data) {
              return process(_.map(data.items, function(i) { return i.name; }));
            }
          );
        },
        updater:function (item) {
          view.addSubmitTag(item);
          return item;
        }
      });

      //load previously chosen questions
      var questions = store.get('stackoverflow-questions');
      if(questions && questions.length > 0)
        api.stackOverflow.question.get(questions.join(';'), view, view.addQuestions);
    },

    addSubmitTag: function(tag) {

      this.submitTags.val('');
      if(this.submitTagsObj[tag] !== undefined)
        return;

      this.submitTagsObj[tag] = true;
      this.$('.tag-list').append('<span class="label label-info">'+tag+'</span>');
    },

    submitQuestion: function() {

      var title = this.submitTitle.val(),
          body  = this.submitBody.val(),
          tags  = _.keys(this.submitTagsObj).join(',');

      if(!$.trim(title)) {
        alert.error("Title is required");
      } else if (!$.trim(body)) {
        alert.error("Body is required");
      } else if (!$.trim(tags)) {
        alert.error("At least one tag is required");
      } else {
        api.local.question.submit(
          title,body,tags,this,this.submittedQuestion
        );
      }
        
    },

    submittedQuestion: function(data) {

      if(data.error !== undefined)
        return;

      this.submitTitle.val('');
      this.submitBody.val('');
      this.submitTags.val('');
      this.submitTagsObj = {};
      this.$('.tag-list').empty();
      this.showQuestion(data);
    },

    showQuestion: function(data) {

      if(data.items !== undefined &&
         data.items.length === 1)
        data.items[0].hidden = false;

      this.addQuestions(data);
    },

    addQuestions: function(data) {
      if(data.items === undefined)
        return this.log("unknown question data");
      this.log("got question - adding...");
      
      for(var i = 0; i < data.items.length; ++i)
        this.trigger('addQuestion', data.items[i] );
      
    },

    gotSimilars: function(data) {

      if(data.items === undefined) return;

      var view = this, numItems = data.items.length;

      view.log("got similar: #" + numItems);

      view.similars.empty();

      if(numItems === 0) {
        view.similarsIsLoading(false, false);
        return;
      }

      _.each(data.items, function(item) {
        var similar = $(view.similarTemplate(item))
        //on click load the chosen question into the questions list
        .click(function() {
          var id = item.question_id;
          api.stackOverflow.question.get(id, view, view.showQuestion);
        });
        view.similars.append(similar);
      });
        
      view.similars.slideDown('slow', function() {
        view.similarsIsLoading(false, numItems !== 0);
      });
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
