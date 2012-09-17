define(['util/ga','vars','jquery'], function(ga,vars) {

  var ajax = function(success,error,context,opts) {
    var defaults = {};

    if(opts.type && opts.type.toLowerCase() === 'post') {
      defaults.data = {};
      defaults.data['slide_id'] = vars.hash.slide_id || 21;
      defaults.data['user_id']  = vars.hash.user_id || 42;
    }
    if(success) defaults['success'] = success;
    if(error) defaults['error'] = error;
    if(context) defaults['context'] = context;

    $.ajax( $.extend(true, defaults, opts) );
  };

  return {
    local: {
      question: {
        get: function(context,success) {
          ga.event('local/question','get');
          ajax(success, null, context, {
            url:'/qa/question/'
          });
        },
        submit: function(title,body,tags,context,success) {
          ga.event('local/question','submit',title);
          ajax(success, null, context, {
            type: 'post',
            dataType: 'json',
            url:'/qa/question/submit/',
            data: {
              title: title,
              body: body,
              tags: tags
            }
          });
        }
      }
    },
    stackOverflow: {
      question: {
        get: function(questionIds,context,success) {
          ga.event('stackoverflow/question','get',questionIds);
          context.log('fetch so question: ' + questionIds);
          ajax(success, null, context, {
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
          ajax(success, null, context, {
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
          ajax(success, null, context, {
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