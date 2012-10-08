define(['view/questions','view/ask','util/ga', 'util/store',
        'qa-api','vars','alert','util/guid','backbone',
        'css!../../css/widget'], 
  function(QuestionsView,AskView,ga,store,api,vars,alert,guid) {

  return Backbone.View.extend({
    name: "WidgetView",
    el: $("#widget"),

    initialize: function() {
      
      if($.browser.msie && $.browser.version <= 8)
        alert.warn("Many features of this widget are not supported on your browser. Get Google Chrome.")

      this.model = new Backbone.Model();
      this.questions  = [];
      this.interval   = vars.get('interval',5*1000);

      _.bindAll(this);
      window.widget = this;
    },

    render: function() {
      this.log("render");

      this.$el.on('click', '.w-word', this.wikiClick);

      vars.onChange('slide_id', this.setSlide);
      vars.onChange('user_id', this.setUser);

      if(!vars.get('user_id'))
        vars.set('user_id',"user_" + guid(), true);


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
        //this.setSlide();
        var slide_id = vars.get('slide_id', 1);
        vars.set('slide_id', slide_id, true);

        //hide loading cover
        this.$('.loading-cover').animate({opacity:0,height:0},2000,function() {
          $(this).hide();
        });
      });

    },

    wikiClick: function(e) {
      var text = e.currentTarget.innerHTML;
      var span = $(e.currentTarget);
      //span.popover({ title: "Wiki", content: text });
      this.log(text);
    },

    addQuestions: function(data) {
      this.questions.createAll(data.items);
    },

    setUser: function(id) {
      this.$("span.current-user").html(id);
      alert.info("User " + id + " has just logged in", 3000);
    },
    setSlide: function(id) {

      this.$("span.slide-id").html(id);

      if(this.pollId) {
        clearInterval(this.pollId);
        alert.info("We're changing to slide " + slide_id, 3000);
      }

      //get initial set of questions
      api.local.question.get_by_slide(id, this,function(data) {

        if(data.items)
          this.questions.list.reset(data.items);

        //load previously chosen stack overflow questions
        var questions = store.get('stackoverflow-questions-slide-' + id);
        if(questions && questions.length > 0)
          api.stackOverflow.question.get(questions.join(';'), this.questions, this.addQuestions);

        //this.pollId = setInterval($.proxy(this.poll,this), this.interval);
      });

    },

    poll: function() {
      
      api.local.question.get_after_date(
        vars.get('slide_id'), 
        "-" + this.interval, 
        this,
        function(data) {
          if(!data.items || !data.items.length) return;
          this.questions.list.add(data.items, {merge:true});
          this.log("add polled items #" + data.items.length);
        }
      );
    }
    
  });
});
