define(['util/ga', 'text!template/submit-tag.html', 'view/body',
  'qa-api','util/store','alert','util/timer','view/autocomplete','backbone'], 
  function(ga, tagHtml, BodyView, api,store,alert,timer, AutoCompleteView){

  return Backbone.View.extend({

    name: "Ask",
    el: $(".ask"),
    tagTemplate: _.template(tagHtml),

    initialize: function() {
      _.bindAll(this);
    },

    events: {
      'click .submit-question-btn'   : 'submitQuestion'
    },

    render: function(){
      var view = this;
      view.log("render");

      //init elems
      view.similars = view.$(".similars");
      view.submitTitle = view.$('.submitTitle');
      view.submitBody = view.$('.submitBody');
      view.bodyBtns = view.$('.body-btns');
      view.submitTags = view.$('.submitTags');
      view.submitTagsObj = {};

      //title listeners
      view.similarTitleView = new AutoCompleteView({
        el: view.submitTitle,
        attributes: {
          name: 'title',
          idle: 1000,
          minLength: 5,
          showQuery: false,
          parent: view
        }
      });

      view.similarTitleView.render();

      //body listeners
      view.bodyBtns.on('click', 'button', this.formatClick);
      //view.submitBody.autogrow();

      this.previewer = new BodyView({el: this.$('.previewer')});
      timer.idle(this.submitBody, 'keyup', 300, this.updatePreview);
      this.$('.preview-body-btn').click(this.updatePreview);

      //tag listeners
      view.similarTagsView = new AutoCompleteView({
        el: view.submitTags,
        attributes: {
          name: 'tag',
          idle: 50,
          minLength: 1,
          showQuery: true,
          parent: view
        }
      });
      view.similarTagsView.render();

      view.setupTogglers();
    },

    titleRequest: function(query, process) {
      api.stackOverflow.question.similar(query, this, function(data) {

        if(data.items === undefined)
          return;

        var numItems = data.items.length;
        this.log("got similar: #" + numItems);

        if(numItems === 0) {
          process([]);
          return;
        }

        process(
          _.map(data.items, function(item) {
            item.name = item.title;
            return item;
          }) 
        );

      });
    },

    //question methods

    titleClick: function(item) {
      var id = item.question_id;
      api.stackOverflow.question.get(id, this, this.showQuestion);
    },

    showQuestion: function(data) {
      if(data.items !== undefined &&
         data.items.length === 1)
        data.items[0].hidden = false;
      this.addQuestions(data);
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

      alert.success("Your question has been submitted", 2000);

      this.submitTitle.val('').trigger('keyup');
      this.submitBody.val('');
      this.submitTags.val('');
      this.submitTagsObj = {};
      $(".similars-btn")
        .filter(function() { return $(this).html() === 'Hide'; })
        .trigger('click').slideUp();
      this.$('.tag-list').empty();
      this.showQuestion(data);
    },

    addQuestions: function(data) {
      if(data.items === undefined)
        return this.log("unknown question data");
      this.log("got question - adding...");
      
      for(var i = 0; i < data.items.length; ++i)
        this.trigger('addQuestion', data.items[i] );
      
    },

    updatePreview: function() {
      if(this.previewer.$el.is(':hidden')) return;
      this.previewer.setContent(this.submitBody.val());
      this.previewer.render();
    },

    //body methods
    formatClick: function(e) {

      var
        btn = $(e.currentTarget),
        type = btn.data('type'),
        field = this.submitBody[0],
        start = field.selectionStart,
        end = field.selectionEnd,
        val = field.value,
        pre = val.substring(0,start),
        sel = val.substring(start,end),
        post = val.substr(end);

      function wrap(c1,c2) {
        if(c2 === undefined) c2 = c1;
        sel = c1+sel+c2;
        field.value = pre + sel + post;
        $(field).trigger('keyup')
      }

      switch(type) {
        case 'code':
          if(sel.match(/\n/))
            sel = "BLOCK";
          else
            wrap('`');
          break;
        case 'bold': wrap('**'); break;
        case 'italics': wrap('*'); break;
        case 'url':
        case 'img':

          var desc, desc2 = '';
          if(type === 'url') {
            desc = 'Display Link Text';
            if(!sel) desc2 = 'Link URL';
          } else {
            desc = 'Image Description';
            if(!sel) desc2 = 'Image URL';
          }

          wrap('!['+desc+']('+desc2,')');

          var newStart = start + 2 + (desc2 ?  desc.length+2 : 0);
          var newEndStart = newStart + (!desc2 ?  desc.length : desc2.length);

          field.selectionStart = newStart;
          field.selectionEnd = newEndStart;
          break;
      }
    },
    

    //tag methods
    tagRequest: function(query, process) {
      api.stackOverflow.tag.similar(query, this,
        function (data) {
          process(data.items);
        }
      );
    },

    tagClick: function(item) {
      this.log("tag click")
      this.addSubmitTag(item.name);
    },

    addSubmitTag: function(tag) {

      this.submitTags.val('');
      if(this.submitTagsObj[tag] !== undefined)
        return;

      this.submitTagsObj[tag] = true;

      var view = this;
      var elem = $(this.tagTemplate({name:tag}));
      //removeTag
      elem.find('.close').click(function() {
        delete view.submitTagsObj[tag];
        $(this).parent().fadeOut(function() { $(this).remove(); });
      })
      elem.css({opacity:0});
      this.$('.tag-list').append(elem);
      elem.animate({opacity:1});
    }
  });
});
