const express = require("express");
const app = express();
const mysql = require("mysql");
const PORT = process.env.PORT || 9000;
// const socketport = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const urlencoded = require("body-parser");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const bcr = require("bcrypt");
const { resolve } = require("path");
const { rejects } = require("assert");
//const WebSocket = require("ws");

//socket server port setup
app.set("port", PORT);
const serverSocket = http.createServer(app);
serverSocket.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});

//socket cors
const io = socketIo(serverSocket, {
  cors: {
    origin: "*",
  },
});
//socket io setup
// const io = socketIo(serverSocket);
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

//show test
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

//Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "database_chat",
});

db.connect(function (error) {
  if (error) {
    console.log(error);
  }
  console.log("db connect");
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.method == "OPTIONS") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end();
  } else {
    next();
  }
});

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM register";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.get("/api/gender", (req, res) => {
  const sqlGender = "SELECT * FROM gender";
  db.query(sqlGender, (err, result) => {
    res.send(result);
  });
});

app.get("/api/status", (req, res) => {
  const sqlStatus = "SELECT * FROM status_user";
  db.query(sqlStatus, (err, result) => {
    res.send(result);
  });
});

app.get("/api/titlename", (req, res) => {
  const sqlTitlename = "SELECT * FROM titlename";
  db.query(sqlTitlename, (err, result) => {
    res.send(result);
  });
});

app.get("/api/groupType", (req, res) => {
  const sqlGroupType = "SELECT * FROM group_type";
  db.query(sqlGroupType,(err,result)=>{
    res.send(result)
  });
});

//Login User
app.use("/api/login", require("./routes/login/login"));

//Chat
app.use("/api/chat", require("./routes/Chat/Chat"));

//Make Hash
async function makeHash(Text) {
  const res = await bcr.hash(Text, 10);
  return res;
}

app.post("/api/insert", async (req, res) => {
  // const name = req.body.name;
  let Data_post;
  let PassHash = await makeHash(req.body.Password);
  Data_post = {
    Name: req.body.Name,
    Password: PassHash,
    Email: req.body.Email,
    Phone: req.body.Phone,
    Gender: req.body.Gender,
    Titlename: req.body.Titlename,
    Status: req.body.Status,
  };
  var sqlInsert = "INSERT INTO register SET ?";
  db.query(sqlInsert, Data_post, function (err, result) {
    console.log(err);
    return res.status(200).send();
  });
  // addUser(Datapost)
  // console.log(req.body);

  // const sqlInsert =
  //   "INSERT INTO register (Name, Password, Email, Phone,Gender,TitleName,Status) VALUES ('?','?','?','?',?,?,?)";
  // db.query(
  //   sqlInsert,

  //   (err, result) => {
  //     console.log(result);
  //   }
  // );
});
