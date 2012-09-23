define(['util/ga','vars','util/html','alert','jquery'], 
  function(ga,vars,html,alert) {

  //custom ajax requests
  function ajax(success,error,context,user_opts) {
    var defaults = {};

    if(user_opts.type && 
       user_opts.type.toLowerCase() === 'post') {
      defaults.data = {};
      defaults.data['slide_id'] = vars.get('slide_id', 1);
      defaults.data['user_id']  = vars.get('user_id', 54321);
    }
    
    defaults.dataType = 'json';

    //intercept errors
    defaults['success'] = function() {
      var data = arguments[0];
      if(data.error !== undefined)
        alert.error(data.error);
      if(data.error_message !== undefined)
        alert.error(data.error_message);
      
      if(success !== undefined) 
        success.apply(context, arguments); 
    };
    if(error !== undefined)
      defaults['error'] = error;
    if(context !== undefined)
      defaults['context'] = context;

    var opts = $.extend(true, defaults, user_opts);
    
    return $.ajax(opts);
  };


  function stackOverflowTransform(success) {
    return function(data) {
      if(data.items !== undefined)
      for(var i = 0; i < data.items.length; ++i) {
        if(data.items[i].question_id)
          data.items[i].id = data.items[i].question_id;
        data.items[i].source = 'stackoverflow';
      }
      return success.apply(this,[data]);
    };
  }

  var localPath = '/qa/';
  //interface
  return {
    local: {
      question: {
        get: function(context,success) {
          ga.event('local/question','get');
          return ajax(success, null, context, {
            url: localPath + 'question/'
          });
        },
        get_by_slide: function(context,success) {
          var slide_id = vars.get('slide_id', 21);
          ga.event('local/question','get_by_slide', slide_id);
          return ajax(success, null, context, {
            url: localPath + 'slide/' + slide_id + '/question/'
          });
        },
        submit: function(title,body,tags,context,success) {
          ga.event('local/question','submit',title);
          return ajax(success, null, context, {
            type: 'post',
            url:localPath + 'question/submit/',
            data: {
              title: html.encode(title),
              body: html.encode(body),
              tags: html.encode(tags)
            }
          });
        }
      },//end question
      answer: {
        submit: function(questionId,body,context,success) {

          ga.event('local/answer','submit');
          return ajax(success, null, context, {
            type: 'post',
            url: localPath + 'question/'+questionId+'/answer/submit/',
            data: {
              body: html.encode(body)
            }
          });
        }
      },//end answer
      comment: {
        submit: function(type,id,body,context,success) {

          ga.event('local/comment','submit');
          return ajax(success, null, context, {
            type: 'post',
            url: localPath + type + '/'+ id +'/comment/submit/',
            data: {
              body: html.encode(body)
            }
          });

        }
      },//vote
      vote: {
        submit: function(type,id,value,context,success) {

          ga.event('local/vote','submit', value);
          return ajax(success, null, context, {
            type: 'post',
            url: localPath + type + '/'+ id +'/vote/',
            data: {
              value: value
            }
          });
        }
      }
    }, //end local

    stackOverflow: {
      question: {
        get: function(questionIds,context,success) {
          ga.event('stackoverflow/question','get',questionIds);
          context.log('fetch so question: ' + questionIds);
          return ajax(stackOverflowTransform(success), 
            null, context, {
            //url: 'json/question.json',
            dataType: 'jsonp',
            url:'//api.stackexchange.com/2.0/questions/'+questionIds,
            data: {
              filter: '!.Kza89Q*3UOKzWNXb)jYMiQwk.-fs',
              order:'desc',
              sort:'activity',
              site:'stackoverflow'
            }
          });
        },
        similar: function(title,context,success) {
          ga.event('stackoverflow/question','similar',title);
          context.log('fetching similar tags...');
          return ajax(stackOverflowTransform(success), null, context, {
            dataType: 'jsonp',
            url:'//api.stackexchange.com/2.0/similar',
            data: {
              title: title,
              order:'desc',
              sort:'activity',
              site:'stackoverflow'
            }
          });
        },
      },
      tag: {
        similar: function(tagName,context,success) {
          ga.event('stackoverflow/tag','similar',tagName);
          context.log('fetching similar...');
          return ajax(success, null, context, {
            dataType: 'jsonp',
            url:'//api.stackexchange.com/2.1/tags/',
            data: {
              filter: '!.Kza89Q*3UOKzWNXb)jYMiQwk.-fs',
              inname: tagName,
              order:'desc',
              sort:'popular',
              site:'stackoverflow'
            }
          });
        }
      }
    }//end stackoverflow 
  };


});