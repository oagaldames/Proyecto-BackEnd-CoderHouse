const socket = io();
let user;
let chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Indentificate",
  input: "text",
  text: "Ingresa el email para identificarte en el chat",
  inputValidator: (value) => {
    return !value && "Necesitas escribir el email de usuario para continuar";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;

  socket.emit("authenticate");

  socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.forEach((message) => {
      messages = messages + `${message.user} dice: ${message.message}</br>`;
    });
    log.innerHTML = messages;
  });

  socket.on("userConnected", (data) => {
    Swal.fire({
      text: "Nuevo usuario conectado",
      toast: true,
      position: "top-right",
    });
  });
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages = messages + `${message.user} dice: ${message.message}</br>`;
  });
  log.innerHTML = messages;
});
