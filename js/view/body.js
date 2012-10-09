//Body view - Handles formatting and highlighting within text bodies
define(['util/regex','util/html','qa-api','lib/prettify','backbone'], 
  function(regex,htmlUtil,api){
  return Backbone.View.extend({
  	 
    name: "BodyView",

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

      var content = this.$el.html();

      if(!parent.model || parent.model.get('source') !== 'stackoverflow')
        content = this.parseMarkup(htmlUtil.encode(content));

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
        if(node.nodeType === Node.TEXT_NODE){

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

    parseMarkup: function(text) {
      return text
        //code block
        .replace(/```\n((.*\s?)*)\n```/mg,"<pre><code>$1</code></pre>")
        //inline code
        .replace(/`(.*?)`/g,"<code>$1</code>")
        //headings
        .replace(/^(#{1,6})([\s\w]*[^\s])$/gm,
          function(n,hashes,text) { 
            var n = 7-hashes.length; 
            return "<h"+n+">" + text + "</h"+n+">" 
          })
        //bold
        .replace(/\*\*(.*?)\*\*/g,"<b>$1</b>")
        //italics
        .replace(/\*(.*?)\*/g,"<i>$1</i>")
        //plain url
        .replace(/(https?:\/\/[^\s<>;"')]+)/g,'<a href="$1">$1</a>')
        //img
        .replace(/!\[([\w\s]+)\]\(([^\s<>;"')]+)\)/g,'<img src="$2" alt="$1"/>')
        //named url
        .replace(/\[([\w\s]+)\]\(([^\s<>;"')]+)\)/g,'<a href="$2">$1</a>')
    },

    prettyPrint: function() {
      var _this = this;
      this.$('code').each(function() {
        var codeElem = $(this), parent = codeElem.parent(), 
            code = codeElem.html();

        var codeLines = code.split('\n'), indentation = 0,
            lines = codeLines.length;

        //calculate superfluous  indentation
        for(i = 0; i<lines; ++i) {
          var spaces = codeLines[i].match(/^\s+/);
          indentation = Math.max(indentation, spaces ? spaces[0].length : 0);
        }
        //remove it if it exists
        if(indentation) {
          code = '';
          for(i = 0; i<lines; ++i)
            code += codeLines[i].replace(new RegExp("^\\s{0,"+indentation+"}"), '') + "\n";
        }
        
        code = $(prettyPrintOne(code));

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