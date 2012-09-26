define(['view/questions','view/ask','util/ga',
        'qa-api','vars','alert','backbone'], 
  function(QuestionsView,AskView,ga,api,vars,alert) {

  return Backbone.View.extend({
    name: "WidgetView",
    el: $("#widget"),

    initialize: function() {
      
      if($.browser.msie && $.browser.version <= 8)
        alert.warn("Many features of this widget are not supported on your browser. Get Google Chrome.")

      this.model = new Backbone.Model({
        questions: []
      });

      this.pollInterval = vars.get('pollInterval',5*1000);
      this.pollId = 0;
      this.lastPoll = null;

      window.widget = this;
    },

    render: function() {
      this.log("render");

      this.setSlideId(vars.get('slide_id'));

      vars.onChange('slide_id', $.proxy(function(id) {
        this.setSlideId(id, true);
        this.pollInitialize();
      },this));

      vars.onChange('user_id', function(id) {
        alert.info("User " + id + " has just logged in", 3000);
      });

      if(!window.location.host.match(/(localhost|127\.0\.0\.1)/))
      window.onerror = function(msg, url, line) {
        ga.event('error',msg,url+":"+line);
        alert.error(msg + "\n" + url + ":" + line);
      };

      this.setupHidables();

      this.setupNestedViews(function() {

        //nested views loaded
        this.ask.on('addQuestion', this.questions.createOne, this.questions);
  
        //begin polling
        this.pollInitialize();

        //hide loading cover
        this.$('.loading-cover').animate({opacity:0,height:0},2000,function() {
          $(this).hide();
        });
      });

    },

    setSlideId: function(id, showAlert) {
      this.$(".slide_id").html(id);
      if(showAlert)
        alert.info("We're changing to slide " + id, 3000);
    },

    pollInitialize: function() {

      clearInterval(this.pollId);

      //get initial set of questions
      api.local.question.get_by_slide(this,function(data) {

        if(data.items)
          this.questions.list.reset(data.items);

        this.lastPoll = new Date().getTime();

        this.pollId = setInterval($.proxy(this.poll,this), this.pollInterval);
      });

    },

    poll: function() {
      
      api.local.question.get_after_date(this.lastPoll,this,function(data) {
        if(data.items && data.items.length > 0) {
          this.questions.list.add(data.items, {merge:true});
          this.log("add polled items #" + data.items.length);
        }
        this.lastPoll = new Date().getTime();
      });
    }
    
  });
});
