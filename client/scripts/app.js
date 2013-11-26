// new Message creates message class objects
var Message = function(username, text, roomname){
  this.username = username;
  this.text = text;
  this.roomname = roomname;
};

Message.prototype.send = function(){
  console.log(JSON.stringify(this));
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(this),
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
  $('ul').html('');
  for ( var i = 0 ; i < msgs.length ; i++){
    // var rname = msgs[i][0].value;
    var $uname = $('<li></li>');
    var $msg = $('<li></li>');
    $uname.text(msgs[i].username);
    $msg.text(msgs[i].text);
    $msg.text($uname.text() + ': ' + $msg.text());
    $msg.addClass(msgs[i].roomname + ' all');
    if ($msg.hasClass($('select')[0].value)){
      $('ul').append($msg);
    }
  }
};
var username = unescape(window.location.search.slice(10));
// getMessages(displayMessage);
// var msg = new Message(username,'oops','hackreactor');
// sendMessage(msg);






