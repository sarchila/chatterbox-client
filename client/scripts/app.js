// new Message creates message class objects
var Message = function(username, text, roomname){
  this.username = username;
  this.text = text;
  this.roomname = roomname;
};

var printToLog = function (arg) {
  console.log(arg);
};

var getMessages = function(cb){
  cb = cb || printToLog;
  $.ajax({
    type: 'GET',
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
    success:function(data){
      console.log(data);
      cb(data.results);
    },
    error:function(){console.log("GET error");}
  });
};

var displayMessage = function (msgs) {
  for ( var i = 0 ; i < msgs.length ; i++){
    // $uname = $('<li></li>');
    // $uname.html(msgs[i].username);
    // $msg = $('<li></li>');
    // $msg.html(msgs[i].text);
    // $msg.html($uname.text() + ': ' + $msg.text());
    var unameText = escape(msgs[i].username);
    if (unameText === undefined){
      unameText = 'anonymous';
    }
    var msgText = escape(msgs[i].text);
    // console.log(i + msgText.slice(0,2));
    console.log(msgs[i].text);
    var safe = true;
    if (msgText.indexOf("%3Cimg") !== -1 ||
      unameText.indexOf("%3Cimg") !== -1 ||
      msgText.indexOf("%3Cscript%3E") !== -1 ||
      unameText.indexOf("%3Cscript%3E") !==-1) {
      safe = false;
    }
    // if (msgText.indexOf("%3Cscript%3E") !== -1 || unameText.indexOf("%3Cscript%3E") !==-1 ){
    //   safe = false;
    // }
    if (safe === true) {
      $msg = $('<li>' + i   + unescape(unameText) + ': '+ unescape(msgText) +'</li>');
      $('ul').prepend($msg);
    }
  }
};

// getMessages(displayMessage);
var sendMessage = function(message){
  console.log(JSON.stringify(message));
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.log(data);
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var msg = new Message('sa','oops','hackreactor');
sendMessage(msg);