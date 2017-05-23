/*global QiSession:false, $:false, _:false */

$(function() {
  var pepper = {};

  // Create Pepper API Handler
  try{
    QiSession(function (session) {
      $.when(
          session.service('ALAnimatedSpeech').then(function(ats){
            pepper.ats = ats;
          }),
          session.service('ALTextToSpeech').then(function(tts){
            pepper.tts = tts;
          }),
          session.service('ALMemory').then(function(memory){
            pepper.memory = memory;
          })
      ).then(function(){
          // console.log(pepper)
        alert('Pepper is Ready!!');
      }, function(){
        alert('Raise Error!!');
      });
    }, function () {
      alert('disconnected!!');
    });
  }catch(e){
    console.log(e);
  }

  // Create question and reply buttons
  var createBtns = function(dataList, $targetListElm){
    if(dataList[0].type){
      dataList = _.shuffle(dataList);
    }
    $.each(dataList, function(){
      var className = (this.type) ? 'q-btn' : 'rep-btn';
      var $li = $('<li/>');
      $li.append(
          $('<button/>',
            {
              class: className,
              text: this.text,
              value: this.saytext
            })
          )
        .appendTo($targetListElm);
    });
  };

  $.getJSON('./data/settings.json' , function(data) {
    var A = data.questions.A;
    var B = data.questions.B;
    var rep = data.replies;

    var $A = $('#q-A');
    var $B = $('#q-B');
    var $rep = $('#rep-list');

    createBtns(A, $A);
    createBtns(B, $B);
    createBtns(rep, $rep);

  });

  // Register event functions
  $(document)

      // Question buttons
      .on('click', '.q-btn, .rep-btn', function(){
        var saytext = $(this).val();
        var className = $(this).attr('class');
        saytext = '\\RSPD=105\\ \\VCT=135\\ ' + saytext;
        if(className == 'q-btn'){
          $(this).attr('style', 'color:red');
        }
        pepper.ats.say(saytext);
      })

      // Etc buttons
      .on('click', '#btn-exit', function(){
        if(confirm('アンケートを終了します。よろしいですか？')){
          pepper.memory.raiseEvent('T_U_APP/Enquete/exit', 1);
        }else{
              // Do noting.
        }
      })

      .on('click', '#btn-nod', function(){
        pepper.memory.raiseEvent('T_U_APP/Enquete/nod', 1);
      });
});
