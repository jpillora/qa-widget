define(['util/ga','vars','filters','jquery'], function(ga,vars,filters) {

  //custom ajax requests
  var ajax = function(success,error,context,opts) {
    var defaults = {};

    if(opts.type && opts.type.toLowerCase() === 'post') {
      defaults.data = {};
      defaults.data['slide_id'] = vars.get('slide_id', 21);
      defaults.data['user_id']  = vars.get('user_id', 42);
    }
    if(success) defaults['success'] = success;
    if(error) defaults['error'] = error;
    if(context) defaults['context'] = context;

    $.ajax( $.extend(true, defaults, opts) );
  };

  var localPath = '/QAServer/';
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
            dataType: 'json',
            url:localPath + 'question/submit/',
            data: {
              title: title,
              body: body,
              tags: tags
            }
          });
        }
      },
      answer: {
        submit: function(question,body,context,success) {

          var questionId = question.id;
          if(!questionId) return context.log("cannot submit answer - missing question id");

          ga.event('local/answer','submit');
          ajax(success, null, context, {
            type: 'post',
            dataType: 'json',
            url: localPath + 'question/'+questionId+'/answer/submit/',
            data: {
              body: body
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