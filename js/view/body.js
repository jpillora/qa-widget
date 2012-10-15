//Body view - Handles formatting and highlighting within text bodies
define(['util/regex','util/html','qa-api','lib/prettify','lib/markdown','backbone'], 
  function(regex,htmlUtil,api, prettify){
  return Backbone.View.extend({
  	 
    name: "BodyView",

    setContent: function(content) {
      this.content = content;
    },
    getContent: function() {
      var c = this.content;
      this.content = undefined;
      return c;
    },

    render: function() {

      //traverse up the parent tree to find the question
      var parent = this;
      while(parent) {
        if(parent.name === "QuestionView" ||
          !parent.attributes ||
          !parent.attributes.parent) 
          break;
        parent = parent.attributes.parent;
      }

      var content = this.getContent();
      if(content === undefined) content = this.$el.html();

      if(!parent.model || parent.model.get('source') !== 'stackoverflow')
        content = markdown.toHTML(content);

      //emojis!
      content = content.replace(/:(\w+):/g, 
        '<img class="emoji" src="http://www.emoji-cheat-sheet.com/graphics/emojis/$1.png"/>');

      this.$el.html(content);
      this.spannify(this.el);
      this.prettyPrint();
      return this;
    },

    spannify: function(node) {
      if(!node) return;
      if(node.jquery && node.length == 1) node = node[0];

      var blackList = ["PRE","A","CODE"];

      search(node);
      function search(node) {
        if(node.nodeType === node.TEXT_NODE){

          var text = node.textContent;
          if(text.match(/^\s*$/)) return;

          var html = text.replace(/([\w']+)/g,'<span class="w-word">$1</span>');
          var parent = node.parentNode;

          if(parent.childNodes.length > 1) {
            var p = document.createElement("SPAN");
            p.innerHTML = html;
            parent.replaceChild(p, node);

          } else
            parent.innerHTML = html;

        }else if(!_.contains(blackList,node.tagName))
          _.each(node.childNodes, search);
      }
    },

    prettyPrint: function() {
      var _this = this;
      this.$('code').each(function() {
        var codeElem = $(this), parent = codeElem.parent(), 
            code = codeElem.html();

        var codeLines = code.split('\n'), indentation,
            lines = codeLines.length;

        //calculate superfluous  indentation
        for(i = 0; i<lines; ++i) {
          var spaces = codeLines[i].match(/^\s*/)[0].length;
          indentation = i === 0 ? spaces : Math.min(indentation, spaces);
        }
        //remove it if it exists
        if(indentation) {
          for(i = 0; i<lines; ++i) 
            codeLines[i] = codeLines[i].substr(indentation);
          code = codeLines.join('\n');
        }
        code = $(prettify.prettyPrintOne(code));

        //loop through spans and swap out space chars for html
        code.each(function() {
          $(this).html( 
            $(this).html().replace(/\n/g,'<br/>').replace(/\ /g,'&nbsp;')
          );
        });
          
        if(parent.is("pre")) {
          parent.addClass('prettyprint').html(code);
        } else {
          var pre = $("<pre/>").addClass('prettyprint').addClass('inline').html(code);
          codeElem.after(pre).remove();
        }

        
      });
    }

  });

});