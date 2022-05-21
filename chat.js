const socket = io("http://localhost:3000")
const chatContainer = document.querySelector(".chat-container")
const sendButton = document.querySelector(".send-button")
const chatInput = document.querySelector(".chat-input")

// functions
function scrollChats() {
  if (
    chatContainer.scrollHeight -
      chatContainer.offsetHeight -
      chatContainer.scrollTop <=
    250
  ) {
    chatContainer.scrollTop =
      chatContainer.scrollHeight - chatContainer.offsetHeight
  }
}

function goLatestChats() {
  chatContainer.scrollTop =
    chatContainer.scrollHeight - chatContainer.offsetHeight
}

function createMessage(position, text) {
  const messageBox = document.createElement("div")
  messageBox.classList.add("message-box")
  messageBox.dataset.position = position

  const message = document.createElement("div")
  message.classList.add("message")
  message.textContent = text
  messageBox.append(message)

  chatContainer.append(messageBox)
  scrollChats()
}

function sendMessage() {
  if (chatInput.textContent) {
    createMessage("right", `You - ${chatInput.textContent}`)
    scrollChats()
  }
  chatInput.focus()
  socket.emit("send-chat-message", chatInput.textContent)
  chatInput.textContent = ""
  goLatestChats()
}

// main
const name = prompt("What is your name?")
createMessage("center", "You Joined")
socket.emit("new-user", name)

socket.on("chat-message", (data) => {
  if (data.name.trim() == "" || data.name == null) {
    name = "Someone"
  }
  createMessage("left", `${data.name} - ${data.message}`)
})

socket.on("user-connected", (name) => {
  if (name.trim() == "" || name == null) {
    name = "Someone"
  }
  createMessage("center", `${name} connected`)
})

socket.on("user-disconnected", (name) => {
  if (name == "" || name == null) {
    name = "Someone"
  }
  createMessage("center", `${name} disconnected`)
})

sendButton.addEventListener("click", sendMessage)
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (!e.ctrlKey) {
      e.preventDefault()
      sendMessage()
    }
  }
})

window.addEventListener("load", () => {
  goLatestChats()
  chatInput.focus()
})
