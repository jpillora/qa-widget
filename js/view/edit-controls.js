define(['text!template/edit-controls.html',
        'view/body','util/timer','util/textarea'], 
        function(html,BodyView,timer,taUtils) {

  return Backbone.View.extend({

    name: "EditControls",

    render: function() {

      this.$el.addClass('edit-controls').prepend(html);
      this.textarea = this.$el.prev();

      this.$('.edit-btns').append(this.$('.edit-btn'));

      var view = this;
      view.previewer = new BodyView({el: this.$el.find('.previewer')});
      timer.idle(this.textarea, 'keyup', 300, function() {
        if(view.previewer.$el.is(':visible'))
          view.updatePreview();
      });

      view.setupTogglers();
    },

    events: {
      'click .body-btns button'              : 'formatClick',
      'click .preview-body-btn'      : 'updatePreview'
    },

    updatePreview: function() {
      this.previewer.setContent(this.textarea.val());
      this.previewer.render();
    },

    //body methods
    formatClick: function(e) {

      var
        btn = $(e.currentTarget),
        type = btn.data('type'),
        field = this.textarea[0],
        result = taUtils.selection(field),
        start = result.selectionStart,
        end = result.selectionEnd,
        val = field.value,
        pre = val.substring(0,start),
        sel = val.substring(start,end),
        post = val.substr(end),
        isMulti = sel.match(/\n/);

      function multi(str) {
        var preRe = /\n(.*)$/, postRe = /^(.*)\n/,
            preMatch = pre.match(preRe),
            postMatch = post.match(postRe);

        if(preMatch) {
          sel = preMatch[1] + sel;
          pre = pre.replace(preRe,'\n');
        } else if (!isMulti) {
          sel = pre + sel;
          pre = '';
        }
        if(postMatch) {
          sel = sel + postMatch[1];
          post = post.replace(postRe,'\n');
        } else if (!isMulti) {
          sel = sel + post;
          post = '';
        }
        var lines = sel.split('\n');
        for(var i = 0, l = lines.length; i<l; ++i)
          lines[i] = str + lines[i];

        sel = lines.join('\n');
      }

      function single(c1,c2) {
        if(c2 === undefined) c2 = c1;
        sel = c1+sel+c2;
      }

      function done() {
        field.value = (pre + sel + post);
        $(field).trigger('keyup');
      }


      switch(type) {
        case 'code':
          if(isMulti) {
            multi('    ');
            sel += '\n';
          } else
            single('`');
          done();
          break;
        case 'bullet':
          if(!isMulti)  break;
          multi('* ');
          sel = '\n' + sel + '\n';
          done();
          break;
        case 'heading':
          if(isMulti)  break;
          multi('### ');
          sel = '\n' + sel;
          done();
          break;
        case 'bold':
          if(isMulti) break;
          single('**');
          done();
          break;
        case 'italics':
          if(isMulti) break;
          single('*');
          done();
          break;
        case 'url':
        case 'img':

          if(isMulti) break;
          var bang = '', desc, desc2 = '';
          if(type === 'url') {
            desc = 'Display Link Text';
            if(!sel) desc2 = 'Link URL';
          } else {
            bang = '!';
            desc = 'Image Description';
            if(!sel) desc2 = 'Image URL';
          }

          single(bang+'['+desc+']('+desc2,')');
          done();

          var newStart = bang.length + start + 1 + (desc2 ?  desc.length+2 : 0);
          var newEndStart = newStart + (!desc2 ?  desc.length : desc2.length);

          field.selectionStart = newStart;
          field.selectionEnd = newEndStart;
          break;
      }
    }
    


  });



});