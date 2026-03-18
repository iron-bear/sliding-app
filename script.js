const video = document.getElementById("video");
const countText = document.getElementById("count");

let count = 0;
let state = "center";

let xHistory = []; // 🔥 값 저장해서 평균냄

// 카메라 실행
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

// mediapipe
const pose = new window.Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});

pose.onResults(results => {
  if (!results.poseLandmarks) return;

  const shoulder = results.poseLandmarks[11];
  let x = shoulder.x;

  // 🔥 1. 평균 필터 (핵심)
  xHistory.push(x);
  if (xHistory.length > 5) xHistory.shift();

  let avgX = xHistory.reduce((a,b)=>a+b,0) / xHistory.length;

  // 🔥 2. 구간 설정 (넓게)
  let newState = state;

  if (avgX < 0.45) newState = "left";
  else if (avgX > 0.55) newState = "right";
  else newState = "center";

  // 🔥 3. 확실한 이동만 카운트
  if (state === "left" && newState === "right") {
    count++;
  }

  state = newState;

  countText.innerText = count;
});

// 반복 실행
async function detect() {
  await pose.send({ image: video });
  requestAnimationFrame(detect);
}

video.onloadeddata = () => {
  detect();
};
