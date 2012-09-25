define(['view/questions','view/ask','util/ga',
        'qa-api','vars','backbone'], 
  function(QuestionsView,AskView,ga,api,vars) {

  return Backbone.View.extend({
    name: "WidgetView",
    el: $("#widget"),

    initialize: function() {

      this.model = new Backbone.Model({
        questions: []
      });

      this.pollInterval = vars.get('pollInterval',30*1000);
      this.lastPoll = null;

    },

    render: function() {
      this.log("render");

      // window.onerror = function(msg, url, line) {
      //   ga.event('error',msg,url+":"+line);
      //   console.error(msg + "\n" + url + ":" + line);
      // };

      this.setupNestedViews(function() {
        //nested views loaded
        this.ask.on('addQuestion', this.questions.createOne, this.questions);
  
        //begin polling
        this.pollInitialize();
      });

    },

    pollInitialize: function() {
      //get initial set of questions
      api.local.question.get_by_slide(this,function(data) {

        //hide loading cover
        this.$('.loading-cover').animate({opacity:0,height:0},2000,function() {
          $(this).hide();
        });

        if(data.items && data.items.length > 0)
          this.questions.list.reset(data.items);

        this.lastPoll = new Date().getTime();

        this.poll();
      });

    },

    poll: function() {

      var view = this;
      setTimeout(function() {
        api.local.question.get_after_date(view.lastPoll,view,function(data) {

          if(data.items && data.items.length > 0) {
            view.questions.list.add(data.items, {merge:true});
            view.log("add polled items #" + data.items.length);
          }
          view.lastPoll = new Date().getTime();
          view.poll();
        });

      }, view.pollInterval);

    }
    
  });
});
