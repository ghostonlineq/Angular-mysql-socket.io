const express = require("express");
const app = express();
const mysql = require("mysql");
const PORT = process.env.PORT || 9000;
// const socketport = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const cors = require("cors");
// const socketIo = require("socket.io");
const http = require("http");

//show test
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

//Database
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_register",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM register";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.post("/api/insert", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;

  const sqlInsert =
    "INSERT INTO register (Name, Password, Email, Phone) VALUES (?,?,?,?)";
  db.query(sqlInsert, [name, password, email, phone], (err, result) => {
    console.log(err);
  });
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port : ${PORT}`);
// });
//const WebSocket = require("ws");
//socket server port setup
app.set("port", PORT);
const serverSocket = http.createServer(app);
serverSocket.listen(PORT);
//socket io setup
const io = require("socket.io")(serverSocket, {
  cors: {
    origin: '*',
  }
});
//Connect
io.on("connection", (socket) => {
  console.log("Socket connection");

  socket.on("disconnect", () => {
    console.log("Socket disconnect");
  });
  socket.on("sent-message", function (message) {
    io.sockets.emit("new-message", message);
  });
});
io.on('error',(d)=>{
  console.log(d);
})

serverSocket.on("listening", () => {
  console.log(`Server is running on port : ${PORT}`);
});
