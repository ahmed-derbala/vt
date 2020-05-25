$(function() {
    var incoming = 0; //incoming of incoming
    //$("#incoming").val(incoming)
    /**
     * socket init
     */
    //server = 'https://vt.herokuapp.com';
    server = '127.0.0.1:3003';
    //server = '192.168.43.17:3000';
   

    var socket = io(server,{ query: { "token":  getCookie('token')} });

    socket.on('connect', () => {
        console.log(`connected to socket with socketid=${socket.id}`)
        $("#logs").prepend("<p class='logsGreen'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' connect  ' + "</p>")
        $("#socketStatus").html("<p class='green'> connected  </p>")
        $("#socketId").html(socket.id);
    });

    socket.on('info', (msg) => {
        //$("#socketClients").html(JSON.stringify(msg));
        $("#socketClients").html(msg.clientsCount);
        $("#usersThisMonth").html(msg.usersThisMonth);

    })

    //buttons and inputs
    var message = $("#message")
    var username = $("#username")
    var send_username = $("#send_username")
    var chatroom = $("#chatroom")
    var feedback = $("#feedback")

    //Emit message
    $("#sendBtn").click(function() {
        //socket.emit('new_message', {message : message.val()});
        socket.emit('private_message', { from: socket.id, to: $("#to").val(), message: message.val() })

    })

    //Listen on new_message
    socket.on("message", (data) => {
        playAlert('tink');
        feedback.html('');
        message.val('');
        chatroom.prepend("<p class='message'>" + nowTimestamp() + data.from + " : " + data.message + "</p>")
    })

    //Emit a username
    send_username.click(function() {
        socket.emit('change_username', { username: username.val() })
    })

    $("#sendAllBtn").click(function() {
        socket.emit('broadcast_message', { from: socket.id, to: 'all', message: message.val() })
    })

    //Emit typing
    message.bind("keypress", () => {
        socket.emit('typing')
    })

    //Listen on typing
    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data + " is typing a message..." + "</i></p>")
    })


    //end new




    /* $("#socketStatus").html("<p class='red'> configure the server and press listen!</p>")

     //var socket = io($("#http").val() + $("#server").val() + ':' + $("#port").val() + $("#namespace").val());

     //listenToSocket($("#server").val());
     function listenToSocket(s) {
         */

    //socket = io($("#http").val() + s + ':' + $("#port").val());
    //socket.connect();

    socket.on('connect_timeout', (timeout) => {
        $("#logs").prepend("<p class='message'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' connect_timeout | ' + timeout + "</p>")
        $("#socketStatus").html("<p class='red'> connection timeout  </p>")
        $("#socketId").val('');

    });
    socket.on('disconnect', (reason) => {
        $("#logs").prepend("<p class='logsRed'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' disconnect | ' + reason + "</p>")
        $("#socketId").html('');
        $("#socketStatus").html("<p class='red'> disconnected!  </p>")
    })
    socket.on('reconnect_attempt', (attemptNumber) => {
        $("#logs").prepend("<p class='logsOrange'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' reconnect_attempt | ' + attemptNumber + "</p>")
        $("#socketId").val("")
        $("#socketStatus").html("<p class='orange'> reconnecting...  </p>")
    });
    socket.on('reconnect_error', (error) => {
        $("#logs").prepend("<p class='logsRed'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' reconnect_error | ' + error + "</p>")
            //$("#socketStatus").html("<p class='red'> reconnection error  </p>")
        $("#socketId").val('');
    });
    socket.on('reconnect', (attemptNumber) => {
        $("#logs").prepend("<p class='logsGreen'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' reconnect | ' + attemptNumber + "</p>")
        $("#socketStatus").html("<p class='green'> reconnected  </p>")
        $("#socketId").val(socket.id)
    });
    socket.on('reconnecting', (attemptNumber) => {
        $("#logs").prepend("<p class='logsOrange'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' reconnecting | ' + attemptNumber + "</p>")
        $("#socketId").val("")
        $("#socketStatus").html("<p class='orange'> reconnecting...  </p>")
    });
    socket.on('reconnect_failed', () => {
        $("#logs").prepend("<p class='red'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' reconnect_failed | ' + "</p>")
        $("#socketId").val("")
        $("#socketStatus").html("<p class='red'> reconnection failed  </p>")
    });
    socket.on('ping', () => {
        $("#logs").prepend("<p class='logsBlack'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' ping | ' + "</p>")
    });
    socket.on('pong', (latency) => {
        $("#logs").prepend("<p class='logsBlack'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' pong | ' + latency + "</p>")
    });
    socket.on('connect_error', (error) => {
        $("#logs").prepend("<p class='logsRed'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' connect_error | ' + error + "</p>")
            //$("#socketStatus").html("<p class='red'> connection error  </p>")
        $("#socketId").val("")
    });
    socket.on('error', (error) => {
        $("#logs").prepend("<p class='message'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' error | ' + error + "</p>")
        $("#socketStatus").html("<p class='red'> error  </p>")
        $("#socketId").val("")
    });

    socket.on($("#on_event").val(), (on_data) => {
            $("#on_data").prepend("<p class='message'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' ' + $("#on_event").val() + ' | ' + JSON.stringify(on_data) + "</p>")

            console.log(on_data + ' received on event : ' + $("#on_event").val())
            if (on_data.length) {
                $("#on_dataLength").val(on_data.length)
            }
            //$("#on_data").prepend("<p class='on_data'>" + JSON.stringify(on_data) + "</p>")
            incoming++;
            $("#incoming").val(incoming)


        })
        //}
        /*
            //Emit message
            $("#sendBtn").click(function () {
                console.log('EMIT | ' + $("#emit_event").val() + ' data : ' + $("#emit_data").val())
                socket.emit($("#emit_event").val(), { from: $("#socketId").val(), to: $("#emit_to").val(), data: $("#emit_data").val() })

            })



            //on listen button click
            $("#listen").click(function () {
                console.log("listened")
                listenToSocket($("#server").val());
            })

            //on disconnect button click
            $("#close").click(function () {
                $("#socketStatus").html("<p class='red'> disconnected!  </p>")

                socket.disconnect();
            })*/
    function nowTimestamp() {
        return (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' | ';
    }

});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }