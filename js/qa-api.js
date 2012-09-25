define(['util/ga','vars','util/html','alert','util/store','jquery'], 
  function(ga,vars,html,alert,store) {

  function stackOverflowAjax(success,error,context,user_opts) {

    var defaults = {};
    defaults.data = {};
    defaults.data.key = 'Duypgvkqc1AxJ9aoLuEV6w((';
    
    ajax(success,error,context,$.extend(true, defaults, user_opts));
  }

  //default error handler
  function ajaxError(xhr, textStatus, errorThrown) {
    alert.error(xhr.status + " " + xhr.responseText);     
  }

  //custom ajax requests
  function ajax(success,error,context,user_opts) {
    var defaults = {};

    if(user_opts.type && 
       user_opts.type.toLowerCase() === 'post') {
      defaults.data = {};
      defaults.data['slide_id'] = vars.get('slide_id', 1);
      defaults.data['user_id']  = vars.get('user_id', 54321);
    }
    
    if(!defaults.dataType)
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
    if(context !== undefined)
      defaults['context'] = context;

    if(error)
      defaults['error'] = error;
    else
      defaults['error'] = ajaxError;
    
    return $.ajax($.extend(true, defaults, user_opts));
  };


  function stackOverflowTransform(success) {
    return function(data) {
      if(data.items !== undefined)
      data.items = _.map(data.items, function(item) {
        if(item.question_id)   item.id = item.question_id;
        item.source = 'stackoverflow';
        return item;
      });
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
          var slide_id = vars.get('slide_id', 1);
          ga.event('local/question','get_by_slide', slide_id);
          return ajax(success, null, context, {
            url: localPath + 'slide/' + slide_id + '/question/'
          });
        },

        get_after_date: function(date,context,success) {
          var slide_id = vars.get('slide_id', 1);
          ga.event('local/poll','get_by_slide', slide_id);
          return ajax(success, null, context, {
            url: localPath + 'slide/' + slide_id + '/question/',
            data: {
              from_date: date,
              sort: "updated_at"
            }
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
        },
        accept: function(answerId,context,success) {
          ga.event('local/answer','accept');
          return ajax(success, null, context, {
            type: 'post',
            url: localPath + 'answer/'+answerId+'/accept/'
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
          return stackOverflowAjax(stackOverflowTransform(success), 
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
          return stackOverflowAjax(stackOverflowTransform(success), null, context, {
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
          return stackOverflowAjax(success, null, context, {
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