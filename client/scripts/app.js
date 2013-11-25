// new Message creates message class objects
var Message = function(username, text, roomname){
  this.username = username;
  this.text = text;
  this.roomname = roomname;
  this.createdAt = new Date();
  this.updatedAt = this.createdAt;
};

var printToLog = function (arg) {
	console.log(arg);
};

var getMessages = function(cb){
	cb = cb || printToLog;
	$.ajax({
			type: 'GET',
			url: 'https://api.parse.com/1/classes/chatterbox',
			success:function(data){
				cb(data.results);
			},
			error:function(){console.log("GET error")}
		});
};

var displayMessage = function (msg) {

};

// $.ajax({
//   // always use this url
//   url: 'https://api.parse.com/1/classes/chatterbox',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message');
//   }
// });