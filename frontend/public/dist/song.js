const socket = io();
let newElements = 0;

const audioChunks = [];

const recordAudio = () =>
  new Promise(async (resolve) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.addEventListener("dataavailable", (event) => {
      socket.emit("audioblob", {
        audioBlob: event.data,
      });
      setTimeout(getData, 2000);
    });

    const start = () => mediaRecorder.start();

    const getData = () => {
      mediaRecorder.requestData();
    };
    setTimeout(getData, 3000);

    resolve({ start, stop });
  });

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

(async () => {
  const recorder = await recordAudio();
  recorder.start();
})();
