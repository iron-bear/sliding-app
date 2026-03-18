const video = document.getElementById("video");
const countText = document.getElementById("count");

let count = 0;
let state = "center"; // left / right

// 카메라 실행
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("카메라 오류: " + err);
  });

// mediapipe 설정
const pose = new window.Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});

// 🔥 핵심 로직
pose.onResults(results => {
  if (!results.poseLandmarks) return;

  const shoulder = results.poseLandmarks[11]; // 왼쪽 어깨
  const x = shoulder.x;

  // 👉 현재 위치 판단
  if (x < 0.5) {
    if (state === "right") {
      state = "left";
    }
  } else {
    if (state === "left") {
      count++; // 🔥 여기서 카운트 증가
      state = "right";
    }
  }

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
