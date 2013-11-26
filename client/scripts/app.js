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
      // console.log(data);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // console.log(data);
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

// Message.prototype.toNode = function(){
//   var $usrHTML = $('<span class="handle"></span>');
//   $usrHTML.text(this.username);
//   var $msgHTML = $('<span class="msgText"></span>');
//   $msgHTML.text(this.text);
//   $msgLineNode = $('<li>: </li>');
//   $msgLineNode.prepend($usrHTML);
//   $msgLineNode.append($msgHTML);
//   return $msgLineNode;
// };

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
};
var username = unescape(window.location.search.slice(10));
if (username === '') {username = 'anonymous';}
// getMessages(displayMessage);
// var msg = new Message(username,'oops','hackreactor');
// sendMessage(msg);






