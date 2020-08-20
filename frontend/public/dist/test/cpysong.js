const container = document.querySelector(".container");
let count = 0;
const socket = io();
// make io.on  and socket.emit

io.on("connection", (socket) => {
  socket.on("audioblob", (blob) => {});
});

function AudioStream() {
  const mediaSource = new MediaSource();
  let sourceBuffer;
  mediaSource.addEventListener("sourceopen", function () {
    sourceBuffer = mediaSource.addSourceBuffer('audio/webm;codecs="opus"');
    //sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="opus, vp9"');
    console.log("sourceopen", sourceBuffer);
  });

  const mediaSourceUrl = URL.createObjectURL(mediaSource);
  const myVideo = document.querySelector("#myVideo");
  //myVideo.src = mediaSourceUrl;
  const myAudio = new Audio(mediaSourceUrl);

  this.addBuffer = (buffer) => {
    //instead of appending to buffer to socket stuff

    sourceBuffer.appendBuffer(buffer);
  };
  this.play = () => {
    myAudio.play();
  };
}

//window.song = myAudio;

const anotherAudio = new AudioStream();

const recordAudio = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  const mediaRecorder = new MediaRecorder(stream, {
    //mimeType: 'video/webm; codecs="opus, vp9"',
    mimeType: 'audio/webm; codecs="opus"',
  });

  const addBuffer = async (blob) => {
    // Since mediaSource only takes in array buffer and we have audio blob
    //   we need to convert audio blob into array buffer with FileReader
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = () => {
      anotherAudio.addBuffer(reader.result);
    };
  };

  mediaRecorder.addEventListener("dataavailable", (event) => {
    addBuffer(event.data);
    if (!count) {
      anotherAudio.play();
    }
  });

  mediaRecorder.start(50);
};

recordAudio();
