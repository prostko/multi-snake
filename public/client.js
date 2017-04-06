var socket = io.connect();

function addMessage(msg, pseudo) {
  $("#chatEntries").append('<div class="message" style="align: center;"><p>' + pseudo +' : ' + msg + '</p></div>');
}

function sentMessage() {
  if ($('#messageInput').val() != ""){
    socket.emit('message', $('#messageInput').val());
    addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
    $('#messageInput').val();
  }
};

function setPseudo() {
  if($('#psuedoInput').val() != "") {
    socket.emit('setPseudo', $('#pseudoInput').val());
    $('#chatControls').show();
    $('#pseudoInput').hide();
    $('#pseudoSet').hide();
  }
};

socket.on('message', function(data) {
  addMessage(data['message'], data['pseudo']);
});

window.addEventListener('keydown', function(e) {
      if (e.keyCode === 38) {
        var data = 'up';
        socket.emit('directionChange', data);
        
      }
  });

$(function() {
  $('#chatControls').hide();
  $('#pseudoSet').click(function() {setPseudo()});
  $('#submit').click(function() {sentMessage();});
});
