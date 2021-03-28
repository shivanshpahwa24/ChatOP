const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// Get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true, // To remove & and ? from the queries
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `	<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;

  chatMessages.appendChild(div);
};

// Add room name to DOM
const outputRoomName = (room) => {
  document.getElementById("room-name").innerText = room;
};

//Add users to DOM
const outputUsers = (users) => {
  document.getElementById("users").innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
};
