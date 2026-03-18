const video = document.getElementById("video");
const countText = document.getElementById("count");

let count = 0;
let state = "center"; // left, right, center

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
  const x = shoulder.x;

  let newState = state;

  // 기준선 설정
  if (x < 0.4) {
    newState = "left";
  } else if (x > 0.6) {
    newState = "right";
  } else {
    newState = "center";
  }

  // 🔥 핵심: left → right 이동 감지
  if (state === "left" && newState === "right") {
    count++;
  }

  state = newState;

  countText.innerText = count;
});

async function detect() {
  await pose.send({ image: video });
  requestAnimationFrame(detect);
}

video.onloadeddata = () => {
  detect();
};
