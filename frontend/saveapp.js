const express = require("express");
const fs = require("fs");
const app = express();
const session = require("express-session");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const sessionMiddleware = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);

let wrote = false;
let fileBlob = [];

io.on("connection", (socket) => {
  socket.on("audioblob", ({ audioBlob }) => {
    // just emit
    console.log("audioblob writing");
    fileBlob.push(audioBlob);
    fs.appendFile("./public/dist/song.wav", audioBlob, (err) => {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
    });
    wrote = true;
  });
  console.log("a user connected");
});

const visitStats = [];

app.use((req, res, next) => {
  visitStats.push({
    date: new Date(),
    url: req.originalUrl,
    ip: req.headers["x-forwarded-for"] || req.ip,
  });
  next();
});

app.use(express.static("public/dist"));

app.get("/music", (req, res) => {
  res.writeHead(200, {
    Connection: "close",
    "Cache-Control": "private",
    "Content-Type": "audio/wav",
  });
  const readStream = fs.createReadStream("./public/dist/song.wav", {
    autoClose: false,
  });
  readStream.on("end", () => {
    console.log("wtf should not have ended");
  });
  readStream.on("open", () => {
    console.log("yay opened");
  });
  readStream.on("close", () => {
    console.log("wtf should not have closed");
  });
  readStream.pipe(res);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

http.listen(3018, () => {
  console.log("visit student.sernie.com");
  console.log("listening on *:3000");
});

app.get("/stats", (req, res) => res.json(visitStats));
