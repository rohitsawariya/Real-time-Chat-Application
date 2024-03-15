document.addEventListener("DOMContentLoaded", function () {
    const app = document.querySelector(".app");
    const socket = io();
  
    let uname;
  
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;
      if (username.length === 0) {
        return;
      }
      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    });

      // Listen for Enter key press in username input
      app.querySelector(".join-screen #username").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            app.querySelector(".join-screen #join-user").click();
        }
    });

    

    //Send Message
    function sendMessage() {
        let message = app.querySelector(".chat-screen #message-input").value.trim();
        if (message.length === 0) {
            return; // Avoid sending empty messages
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = ""; // Clear input field
    }



    app.querySelector(".chat-screen #send-message").addEventListener("click", sendMessage);

    // Attach keydown event listener to the message input field for handling Enter key press
    app.querySelector(".chat-screen #message-input").addEventListener("keydown", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevent default action to avoid form submission or newline
            sendMessage(); // Call sendMessage function
        }
    });


    app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
        socket.emit("exituser",uname);
        window.location.href = window.location.href;
    })

    socket.on("update",function(update){
        renderMessage("update",update);
    });
    socket.on("chat",function(message){
        renderMessage("other",message);
    });

    function renderMessage(type,message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my"){
            let el = document.createElement("div");
            el.setAttribute("class","message my-message");
            el.innerHTML = `
            <div>
                <div class = "name">You</div>
                <div class = "text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        }
        else if(type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class","message other-message");
            el.innerHTML = `
            <div>
                <div class = "name">${message.username}</div>
                <div class = "text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        }
        else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class","update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
  })();
  