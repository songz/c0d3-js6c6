const allChunks = [];
const container = document.querySelector(".container");
let count = 0;

const mediaSource = new MediaSource();
let sourceBuffer;
mediaSource.addEventListener("sourceopen", function () {
  sourceBuffer = mediaSource.addSourceBuffer('audio/webm;codecs="opus"');
  //sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="opus, vp9"');
  console.log("sourceopen", sourceBuffer);
});

const addBuffer = async (buffer) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(buffer);
  reader.onload = () => {
    console.log(reader.result, sourceBuffer);
    console.log("before append", sourceBuffer.updating);
    //sourceBuffer.appendBuffer(new Uint8Array(buffer));
    sourceBuffer.appendBuffer(reader.result);
    console.log("after append", sourceBuffer.updating);
  };
};

const mediaSourceUrl = URL.createObjectURL(mediaSource);
const myVideo = document.querySelector("#myVideo");
//myVideo.src = mediaSourceUrl;
const myAudio = new Audio(mediaSourceUrl);

//window.song = myAudio;

function Block(chunk, index) {
  const div = document.createElement("div");
  div.className = "block";
  div.onclick = () => {
    const audioUrl = URL.createObjectURL(chunk);
    const audio = new Audio(audioUrl);
    audio.play();

    const reader = new FileReader();
    reader.readAsDataURL(chunk);
    reader.onload = () => {
      console.log(reader.result);
    };
  };
  div.innerText = index;
  container.append(div);
}

const recordAudio = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  const mediaRecorder = new MediaRecorder(stream, {
    //mimeType: 'video/webm; codecs="opus, vp9"',
    mimeType: 'audio/webm; codecs="opus"',
  });

  mediaRecorder.addEventListener("dataavailable", (event) => {
    allChunks.push(event.data);
    addBuffer(event.data);
    new Block(event.data, count);
    count += 1;
  });

  mediaRecorder.start(2000);
};

const play = (idx) => {
  const audioBlob = new Blob([allChunks[0], allChunks[idx]]);
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};

recordAudio();

setTimeout(() => {}, 5000);
