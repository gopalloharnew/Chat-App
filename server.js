const io = require("socket.io")(3000)
const express = require("express")
const { dirname } = require("path")
const app = express()
const path = require("path")

// server functionality

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/chat.js", (req, res) => {
  res.sendFile(path.join(__dirname, "chat.js"))
})

app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style.css"))
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// app.get("*", (req, res) => {
//   res.redirect("/")
// })

app.listen(80)

// chat functionality
const users = {}
io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name
    socket.broadcast.emit("user-connected", name)
  })
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    })
  })
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id])
    delete users[socket.id]
  })
})
