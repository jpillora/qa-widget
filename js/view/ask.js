define(['text!template/similar.html','ga','util/qa-api','store','backbone'], 
  function(similarHtml,ga,api,store){

  return Backbone.View.extend({

    name: "Ask",
    el: $("#ask"),
    similarTemplate: _.template(similarHtml),

    initialize: function() {
      this.log("init");

    },

    render: function(){
      var view = this;
      view.log("render");

      view.similars = view.$(".similars");
      view.similarsBtn = view.$(".similarsBtn");
      view.submitBtn = view.$("input[type=submit]");

      view.similarsBtn.click(function() {
        view.btnMode("hide");
        view.similars.slideUp('slow');
      });

      view.$("textarea").keyup(function(e) {

        var str = $(this).val();
        
        if(view.keyTimer) clearTimeout(view.keyTimer);
        if(str.length <= 10) return;

        view.keyTimer = setTimeout(function(){
          view.btnMode("loading");
          api.stackOverflow.similar(str,view,view.gotSimilars);
        }, 1000);

      });

      var userSimilars = store.get('similars');
      if(userSimilars && userSimilars.length > 0)
        api.stackOverflow.question(userSimilars.join(';'), view, view.gotQuestion);
      
    },


    gotSimilars: function(data) {
      var view = this;
      view.log("got similar: #" + (data.items ? data.items.length : data.items));
      if(data.items === undefined || data.items.length == 0) {
        view.btnMode("hide");
        return;
      }
      view.similars.empty();
      _.each(data.items, function(item) {
        var similar = $(view.similarTemplate(item))
        //on click load the chosen question into the questions list
        .click(function() {
          var id = item.question_id;
          store.add('similars',id);
          api.stackOverflow.question(id, view, view.gotQuestion);
        });
        view.similars.append(similar);
      });
        
      view.similars.slideDown('slow');
      view.btnMode("shown");
      
    },


    gotQuestion: function(data) {
      if(data.total === undefined) {
        this.log("unknown question data")
        return;
      }
      this.log("got so question - adding...");
      for(var i = 0; i < data.total; ++i) {
        var item = data.items[i];
        item.id = "SO"+item.question_id;
        this.trigger('addQuestion', new Backbone.Model(item) );
      }
    },

    btnMode: function(mode) {
      switch(mode) {
        case "loading": this.similarsBtn.html("Loading").addClass('loading').fadeIn('slow'); break;
        case "shown": this.similarsBtn.html("Hide").removeClass('loading').fadeIn('slow'); break;
        default: this.similarsBtn.fadeOut('slow');
      } 
    }
    
  });
});
