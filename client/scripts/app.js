var events = _.clone(Backbone.Events);

var Message = function(){
};


Message.prototype.send = function(uname, txt, rmname){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify({
      username: uname,
      text: txt,
      roomname: rmname
    }),
    contentType: 'application/json',
    success: function(){
      console.log('chatterbox: Message sent');
      events.trigger('message:send');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var ChatView = function(options){
  this.message = options.message;

  events.on('message:send', this.clearInput, this);
  events.on('message:send', this.getAndDisplay, this);


  var sendMsg = $.proxy(this.addMessage, this);
  var getMsg = $.proxy(this.getAndDisplay, this);
  var mkRm = $.proxy(this.addRoom, this);
  $('.poster').on('click', sendMsg);

   $('.button').on('click', getMsg);

   $('.createRoom').on('click', mkRm);

};

ChatView.prototype.addMessage = function(){

  var chatInput = $('.messageInput').val();
  if (chatInput !== ''){
    this.message.send(username, chatInput, $('select').val());
  }
};

ChatView.prototype.clearInput = function() {
  $('.messageInput').val('');
};

ChatView.prototype.getAndDisplay = function(){
  getMessages(displayMessage);
};

ChatView.prototype.addRoom = function() {
  addRoom($('.roomInput').val());
};


















var getMessages = function(cb){
  $.ajax({
    type: 'GET',
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
    success:function(data){cb(data.results);},
    error:function(){console.log("GET error");}
  });
};

var roomNames = {'all':true};
var displayedMsgID = [];
var friends = {};

var addRoom = function(room) {
 var rn = room;
 if (rn && !roomNames[rn] && rn.length < 30) {
    roomNames[room] = true;
    $room = $('<option></option>');
    $room.text(room);
    $room.val(room);
    $('select').append($room);
  }
};

var displayMessage = function (msgs) {

  // $('ul').html('');

  var makeRoom = function(message) {
    var rn = message.roomname;
    if (rn && !roomNames[rn] && rn.length < 30) {
      roomNames[message.roomname] = true;
      $room = $('<option></option>');
      $room.text(message.roomname);
      $room.val(message.roomname);
      $('select').append($room);
    }
  };

  var toNode = function(message){
    var $usrHTML = $('<span class="handle"></span>');
    if (!message.username){
      message.username = 'anonymous';
    }
    $usrHTML.text(message.username);
    var $msgHTML = $('<span class="msgText"></span>');
    $msgHTML.text(message.text);
    $usrHTML.addClass($usrHTML.text());
    $msgHTML.addClass($usrHTML.text());
    $msgLineNode = $('<li>: </li>');
    $msgLineNode.prepend($usrHTML);
    $msgLineNode.append($msgHTML);
    return $msgLineNode;
  };

  var getRoomClass = function(message) {
    var rn = message.roomname;
    if (rn && rn.length < 30) {
      var $rn = $('<li></li>').text(rn);
    return $rn.text();
    }
    return '';
  };

  var newestSize;
  if (displayedMsgID.length === 0) {
    newestSize = 100;
  } else {
    for (newestSize = 0; newestSize < msgs.length; newestSize++) {
      if (msgs[newestSize].objectId === displayedMsgID[0]){
        break;
      }
    }
  }
  for ( var i = newestSize-1 ; i >= 0 ; i--){
    if (displayedMsgID.length === 100) {
      displayedMsgID.pop();
    }
    displayedMsgID.unshift(msgs[i].objectId);
    makeRoom(msgs[i]);
    var $msg = toNode(msgs[i]);
    var room = getRoomClass(msgs[i]);
    $msg.addClass(room + ' all');
    if ($msg.hasClass($('select')[0].value) && $msg.text().length < 140){
      if (displayedMsgID.length === 100) {
        $('ul').children().last().remove();
      }
      if ($msg.children().first().text() in friends) {
        $msg.css('font-weight', '800');
      }
      $('ul').prepend($msg);
    }
  }
  $('.handle').on('click', function() {
    // console.log($(this).text());
    friends[$(this).text()] = true;
    $('.' + $(this).text()).css('font-weight', '800');
  });
}
;
var username = unescape(window.location.search.slice(10));
if (username === '') {username = 'anonymous';}
// getMessages(displayMessage);
// var msg = new Message(username,'oops','hackreactor');
// sendMessage(msg);






