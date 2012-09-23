define(['util/ga','vars','filters','util/html','alert','jquery'], 
  function(ga,vars,filters,html,alert) {

  //custom ajax requests
  var ajax = function(success,error,context,user_opts) {
    var defaults = {};
    defaults.data = {};
    defaults.data['slide_id'] = vars.get('slide_id', 21);
    defaults.data['user_id']  = vars.get('user_id', 42);

    defaults.dataType = 'json';
    if(success) defaults['success'] = function() {
      var data = arguments[0];
      //intercept errors
      if(data.error !== undefined)
        alert.error(data.error);
      success.apply(context, arguments); 
    };
    if(error) defaults['error'] = error;
    if(context) defaults['context'] = context;

    var opts = $.extend(true, defaults, user_opts);
    
    $.ajax(opts);
  };

  var localPath = '/qa/';
  //interface
  return {
    local: {
      question: {
        get: function(context,success) {
          ga.event('local/question','get');
          ajax(success, null, context, {
            url: localPath + 'question/'
          });
        },
        submit: function(title,body,tags,context,success) {
          ga.event('local/question','submit',title);
          ajax(success, null, context, {
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
        submit: function(question,body,context,success) {

          var questionId = question.id;
          if(!questionId) return context.log("cannot submit answer - missing question id");

          ga.event('local/answer','submit');
          ajax(success, null, context, {
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
          ajax(success, null, context, {
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
          ajax(success, null, context, {
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
          ajax(filters.stackOverflow(success), 
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
          context.log('fetching similar...');
          ajax(filters.stackOverflow(success), null, context, {
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
          ajax(filters.stackOverflow(success), null, context, {
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