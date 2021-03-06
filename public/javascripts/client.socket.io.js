var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);
console.log('Client: Connecting to server ' + server_name);

server.on('ss-confirmation', function(data) {
  console.log('Client: Recieved message from server: ' + data.text);
  server.on('chat', function(message) {
    if(message.text == 'PING')
    {
      display(message.text, 'server');
      server.emit('chat', {text: 'PONG'});
      display('PONG', 'client');
    }
    if(message.text == 'PONG')
    {
      display(message.text, 'server');
    }
  });
});

function display(message, from)
{
  var newmessage = document.createElement('div');
  var messagecontent = document.createTextNode(message);
  var messageconsole = document.getElementById('message-console');
  newmessage.appendChild(messagecontent);
  if(from == "client")
  {
    newmessage.className += "message to";
  }
  else
  {
    newmessage.className += "message from";
  }
  messageconsole.appendChild(newmessage);
  $('#message-console').scrollTop($('#message-console')[0].scrollHeight);
}

$(document).ready(function() {
  $( "#ping-server" ).click(function() {
    server.emit('chat', {text: 'PING'});
    display('PING', 'client');
  });
});
