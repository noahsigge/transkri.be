$(document).ready(function() {
  var socket = io();
  var msgList = $('#messages');

  // // Check if nickname stored in localStorage
  // if('localStorage' in window && localStorage.getItem('nickname')) {
  //   nickname = localStorage.getItem('nickname');
  // } else {
  //   // If not in localStorage, prompt user for nickname
  //   nickname = prompt('Please enter your nickname');
  //   if('localStorage' in window) {
  //     localStorage.setItem('nickname', nickname);
  //   }
  // }


  // Function to add a message to the page
  var newMessage = function(data) {
    var //who = $('<div class="who">').text(data.nickname),
        when = $('<div class="when">').text(new Date().toString().substr(0, 24)),
        name = $('<b>').text(data.msg.substring(0, 1)),
        msg = $('<span class="msg">').text(data.msg.substring(1))
        //header = $('<div class="header clearfix">').append(who).append(when),
        //header = $('<div class="header clearfix">').append(when)
        //div = $('<div>').append(header).append(msg);


    var span = $('<span class="glow">').append(msg);
    var div = $('<div class="new">').append(name).append(span);

    msgList.prepend(div);

    $('b:contains("1")').replaceWith('<img src="../images/abtDark.png" class="icon">');
    $('b:contains("2")').replaceWith('<img src="../images/reisenderDark.png" class="icon">');
    $('b:contains("3")').replaceWith('<img src="../images/madwomanDark.png" class="icon">');
    $('b:contains("4")').replaceWith('<img src="../images/geistDark.png" class="icon">');
    $('b:contains("5")').replaceWith('<img src="../images/faehrmannDark.png" class="icon">');
  };

  // $(function() {
  // //  $('body').html($('body').html().replace(/1/g, 'neu'));
  //   $('b:contains("1")').replaceWith('<img src="../images/abtDark.png" class="icon">');
  //   $('b:contains("2")').replaceWith('<img src="../images/reisenderDark.png" class="icon">');
  //   $('b:contains("3")').replaceWith('<img src="../images/madwomanDark.png" class="icon">');
  //   $('b:contains("4")').replaceWith('<img src="../images/geistDark.png" class="icon">');
  //   $('b:contains("5")').replaceWith('<img src="../images/fährmannDark.png" class="icon">');
  // }



  // Handle the form to submit a new message
  $('form').submit(function(e) {
    var msgField = $('#msg'),
        //data = { msg: msgField.val(), nickname: nickname, when: new Date() };
        data = { msg: msgField.val(), when: new Date() };
        //data = newMessage(data);

    e.preventDefault();
    // Send message to Socket.io server
    socket.emit('msg', data);
    // Add message to the page
    newMessage(data);
    // Clear the message field
    msgField.val('');
  });

  // When a message is received from the server
  // add it to the page using newMessage()
  socket.on('msg', function(data) { newMessage(data); });

  //Alte Nachrichten ersetzen//
  $('b:contains("1")').replaceWith('<img src="../images/abtDark.png" class="icon">');
  $('b:contains("2")').replaceWith('<img src="../images/reisenderDark.png" class="icon">');
  $('b:contains("3")').replaceWith('<img src="../images/madwomanDark.png" class="icon">');
  $('b:contains("4")').replaceWith('<img src="../images/geistDark.png" class="icon">');
  $('b:contains("5")').replaceWith('<img src="../images/faehrmannDark.png" class="icon">');

  //InfoSlider//
  $('#open').click(function () {
  $('#dropUp #dashboard').slideToggle({
    direction: "up"
  }, 300);
  //$('#up').replaceWith('<img src"../images/down.png" id="down">');
  $(this).toggleClass('close');
  $('img', this).toggleClass("on off");
});
});
