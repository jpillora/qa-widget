define(['text!template/autocomplete.html','util/timer','backbone'], 
  function(itemHtml,timer) {

  return Backbone.View.extend({

    itemTemplate: _.template(itemHtml),

    initialize: function() {
      this.context = this.attributes.parent;
      this.minLength = this.attributes.minLength || 3;
      this.idle = this.attributes.idle || 1000;
      this.name = this.attributes.name;
      this.parent = this.attributes.parent;

      this.click = this.parent[this.name+'Click'];
      this.request = this.parent[this.name+'Request'];

    },

    render: function() {
      var view = this;

      view.log("render");

      var className = 'similar-'+view.name;
      view.list = $("<div/>").addClass('popdown').addClass(className).hide();
      view.btn = $("<div/>").addClass('similars-btn').attr('data-toggle', "."+className).hide();

      view.$el.after(view.btn).after(view.list);

      //listeners
      timer.idle(view.$el, 'keyup', view.idle, function(){
        var query = view.$el.val();
        if(!query || query.length < view.minLength) return;
        view.loading(true);
        view.request.apply(view.parent, [query, function(items){
          view.process.apply(view, [items, query]);
        }]);
      });

    },

    process: function(items, query) {

      this.loading(false);

      var view = this;

      if(!items) items = [];

      this.list.empty();

      if(view.attributes.showQuery === true &&
         !_.contains(items, query))
        items.push({ name: query });

      //fill list
      _.each(items, function(item){

        var itemElement = $(view.itemTemplate(item));
        itemElement.click(function() {
          view.click.apply(view.parent, [item]);
        });

        view.list.append(itemElement);

      });

      this.list.slideDown('fast', function() {
        view.loading(false, items.length !== 0);
      });

      this.log("processed");

    }, 

    loading: function(loading, show) {

      if(show === undefined)
        show = true;

      if(show)
        this.btn.slideDown('fast');
      else
        this.btn.slideUp('fast');

      if(loading)
        this.btn.addClass('loading').html("Loading");
      else
        this.btn
        .removeClass('loading')
        .html(this.list.is(":hidden") ? "Show" : "Hide");
    }


  });

});
