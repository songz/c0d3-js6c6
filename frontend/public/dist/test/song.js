const container = document.querySelector(".container");
const myTitle = document.querySelector("#myTitle");
const socket = io();

function AudioStream(initialBuffer) {
  let sourceBuffer;
  let isReady = false;
  const mediaSource = new MediaSource();
  mediaSource.addEventListener("sourceopen", function () {
    sourceBuffer = mediaSource.addSourceBuffer('audio/webm;codecs="opus"');
    //sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="opus, vp9"');
    console.log("sourceopen", initialBuffer);
    initialBuffer.forEach((buf) => {
      sourceBuffer.appendBuffer(buf);
    });
    console.log("ready");
    myAudio.play();
    isReady = true;
  });

  const mediaSourceUrl = URL.createObjectURL(mediaSource);
  const myVideo = document.querySelector("#myVideo");
  //myVideo.src = mediaSourceUrl;
  const myAudio = new Audio(mediaSourceUrl);
  this.audio = myAudio;
  this.addBuffer = (buffer) => {
    console.log("addBuffer", mediaSource.readyState);
    if (!isReady) return;
    if (mediaSource.readyState != "open") {
      console.log("not open");
      return;
    }
    sourceBuffer.appendBuffer(buffer);
  };
  // move below to outsiide
}

//window.song = myAudio;

const firstBuffers = [];
const allUsers = {};

socket.on("initial", ({ userData }) => {
  console.log("initiol", userData, socket.id);
  Object.keys(userData)
    .filter((socketId) => socketId !== socket.id)
    .forEach((e) => {
      console.log("audioStream", e);
      allUsers[e] = new AudioStream(userData[e].audioBuffer);
    });
});

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
      if (!firstBuffers.length) {
        firstBuffers.push(reader.result);

        socket.on("audioblob", ({ socketId, audioBlob, firstBuffer }) => {
          console.log("received", socketId, firstBuffer, audioBlob);
          if (!firstBuffer || !audioBlob || !socketId) {
            console.log("invalid");
            return;
          }
          if (!allUsers[socketId]) {
            return;
          }
          allUsers[socketId].addBuffer(audioBlob);
        });
      }
      myTitle.innerText = socket.id;
      socket.emit("audioblob", {
        audioBlob: reader.result,
        firstBuffer: firstBuffers[0],
      });
      //      anotherAudio.addBuffer(reader.result);
    };
  };

  mediaRecorder.addEventListener("dataavailable", (event) => {
    addBuffer(event.data);

    //anotherAudio.play();
  });

  mediaRecorder.start(3000);
};

recordAudio();
