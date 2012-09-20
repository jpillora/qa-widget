define({

  stackOverflow: function(success) {
    return function(data) {
      if(data.items !== undefined)
      for(var i = 0; i < data.items.length; ++i) {
        if(data.items[i].question_id)
          data.items[i].id = data.items[i].question_id;
        data.items[i].source = 'stackoverflow';
      }
      return success.apply(this,[data]);
    };
  },

  showQuestion: function(success) {
    return function(data) {
      if(data.items !== undefined &&
         data.items.length === 1)
        data.items[0].hidden = false;
      return success.apply(this,[data]);
    };
  }

});