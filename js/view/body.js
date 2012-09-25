//Body view - Handles formatting and highlighting within text bodies
define(['util/regex','lib/prettify','backbone'], 
  function(regex){
  return Backbone.View.extend({
  	 
    name: "BodyView",

    render: function() {

      var parent = this;
      while(parent) {

        if(parent.name === "QuestionView" ||
          !parent.attributes ||
          !parent.attributes.parent) 
          break;
        parent = parent.attributes.parent;
      }

      if(parent.model.get('source') !== 'stackoverflow') {
        var body = this.parseMarkup(this.$el.html());
        this.$el.html(body);
      }

      this.prettyPrint();
      return this;
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
            var n = hashes.length; 
            return "<h"+n+">" + text + "</h"+n+">" 
          })
        //bold
        .replace(/\*\*(.*?)\*\*/g,"<b>$1</b>")
        //italics
        .replace(/\*(.*?)\*/g,"<i>$1</i>")
        //plain url
        .replace(/(https?:\/\/[^\s]+)/g,'<a href="$1">$1</a>')
        //img
        .replace(/!\[([\w\s]+)\]\(([^\<>;"')]+)\)/g,'<img src="$2" alt="$1"/>')
        //named url
        .replace(/\[([\w\s]+)\]\(([^\<>;"')]+)\)/g,'<a href="$2">$1</a>')
    },

    prettyPrint: function() {
      this.$('pre>code').parent().each(function() {
        var code = $(this).html();
        var newCode = $(prettyPrintOne(code));

        newCode.find('span').each(function() {
          $(this).html( 
            $(this).html().replace(/\n/g,'<br/>').replace(/\ /g,'&nbsp;')
          );
        });
          
        $(this).addClass('prettyprint').html(newCode);
      });
    }

  });

});