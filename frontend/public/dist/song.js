const allChunks = [];
const container = document.querySelector(".container");
let count = 0;

function Block(chunk, index) {
  const div = document.createElement("div");
  div.className = "block";
  div.onclick = () => {
    const audioUrl = URL.createObjectURL(chunk);
    const audio = new Audio(audioUrl);
    audio.play();
  };
  div.innerText = index;
  container.append(div);
}

const recordAudio = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.addEventListener("dataavailable", (event) => {
    allChunks.push(event.data);
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
