window.onload = function() {
  const chatForm = document.querySelector("#chat-form");
  const chatMessages = document.querySelector(".chat-messages");
  const roomName = document.querySelector("#room-name");
  const userList = document.querySelector("#users");

  //getting username and room from the URL
  const {username,room} = Qs.parse(location.search,{
      ignoreQueryPrefix : true
  })

//   console.log(username,room)
const socket = io();
//Join ChatRoom
socket.emit("joinRoom",{username,room})

//Get room and users info
socket.on("roomUsers",({room, users})=>{
    outputRoomName(room);
    //outputUsers(users);
});

  //Message from server
  socket.on("message", message => {
    console.log(message); //m1 c1 msg is caught here
    outputMessage(message);

    //scrolling
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  //Msg Submit
  chatForm.addEventListener("submit", e=> {
    e.preventDefault();
    const mssg = e.target.elements.mssg.value;
    // console.log(mssg); id is in form id="mssg"

    //m2 Emitting to Server
    socket.emit("chatMessage", mssg);

    //clearing input
    e.target.elements.mssg.value = "";
    e.target.elements.mssg.focus();
  });
  function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
          ${message.text}
        </p>`;
    document.querySelector(".chat-messages").appendChild(div);
  }

  //adding room name to DOM
  function outputRoomName(room){
      roomName.innerText = room;
      //console.log(roomName);
  }

  //adding users to DOM
//   function outputUsers(users){
//       userList.innerHTML = `
//       ${users.map(user=>`<li>${user.username}</li>`).join("")}
//       `;//join method because it is an array
// //       console.log(users);
// }
};
