define(['view/questions','view/ask','util/ga', 'util/store',
        'qa-api','vars','alert','util/guid','backbone',
        'less!stylesheets/widget.less'
        ], 
  function(QuestionsView,AskView,ga,store,api,vars,alert,guid) {

  return Backbone.View.extend({
    name: "WidgetView",
    el: $("#widget"),

    initialize: function() {
      
      if($.browser.msie)
        alert.warn("Many features of this widget are"+
          " not supported on your browser. Get Google Chrome.",
          10000);

      this.model = new Backbone.Model();
      this.questions  = [];
      this.interval   = vars.get('interval',5*1000);

      _.bindAll(this);
      window.widget = this;
    },

    render: function() {
      this.log("render");

      this.wikiInit();

      vars.onChange('slide_id', this.setSlide);
      vars.onChange('user_id', this.setUser);
      vars.onChange('wiki_search', this.wikiSearch);

      if(vars.get('user_id'))
        this.setUser(vars.get('user_id'));
      else
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


    wikiInit: function() {

      var wrapper = this.$('.popover-wrapper'),
          title = wrapper.find('.popover-title'),
          word = title.find('.keyword');
          closeBtn = wrapper.find('.close'),
          wikiLink = wrapper.find('.wiki-btn'),
          title = wrapper.find('.popover-title'),
          content = wrapper.find('.popover-container');

      //wiki-search dom elements
      closeBtn.click(function() {
        wrapper.fadeOut();
      });

      var titles = [];
      function search(str, full) {

        str = str.replace(/\n/g,'');
        console.log("load: " + str);

        api.wikipedia.summary(str, full, this, function(data) {
          if(!data.query) return;
          for(p in data.query.pages);
          
          if(data.query.normalized &&
             data.query.normalized[0].from === str)
              str = data.query.normalized[0].to;

          titles.push(str);

          var extract = data.query.pages[p].extract;
          if(extract === null || extract === undefined) 
            return titles = [], alert.info("No Wikipedia page found", 1500);

          var m = null, next = null;

          //may refer to...
          m = extract.match(/may( also)? refer to:<\/p>$/);
          if(!m) m = extract.match(/^\s*$/);
          if(m) return search(titles.pop(), true);

          //find other articles related to comp sci
          m = extract.match(
            new RegExp("("+ str + "\\s*\\((programming|comput[^\\)]+\\)))","i")
          );
          if(m) return search(m[1]);

          m = extract.match(/REDIRECT\s*?([\w\s]+)/i);
          if(m) return search(m[1]);


          extract = extract.replace(/<li>\n?([^,<>]*)/g,"<li><a href='#wiki_search=$1'>$1</a>")

          word.html(titles.join(' ➡ '));
          titles = [];
          wikiLink.attr('href', 'http://en.wikipedia.org/wiki/'+str);
          content.html(extract);
          wrapper.css('top', ($(window).height()-wrapper.height())/2);
          wrapper.fadeIn();
        });
        return;
      }

      //live bind all wiki-words
      this.$el.on('click', '.w-word', function(e) {
        search($(this).html());
      });

      //expose
      this.wikiSearch = search;
      return;
    },

    addQuestions: function(data) {
      this.questions.createAll(data.items);
    },

    setUser: function(id) {

      if(!id.match(/^[A-Za-z]\w{0,15}$/)) {
        alert.error("User ID not allowed");
        return false;
      }

      var last = this.$("span.current-user").html();
      this.$("span.current-user").html(id);
      if(last !== id)
        alert.info("User '" + id + "' has just logged in", 3000);
    },
    setSlide: function(id) {

      this.$("span.slide-id").html(id);

      if(this.pollId) {
        clearInterval(this.pollId);
        alert.info("We're changing to slide " + id, 3000);
      }

      //get initial set of questions
      api.local.question.get_by_slide(id, this,function(data) {

        if(data.items)
          this.questions.list.reset(data.items);

        //load previously chosen stack overflow questions
        var questions = store.get('stackoverflow-questions-slide-' + id);
        if(questions && questions.length > 0)
          api.stackOverflow.question.get(questions.join(';'), this.questions, this.addQuestions);

        this.pollId = setInterval(this.poll, this.interval);
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
