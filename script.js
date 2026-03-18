const video = document.getElementById("video");
const countText = document.getElementById("count");
const remainingText = document.getElementById("remaining");

let count = 0;
let wentLeft = false;
let target = 50;

// 카메라 실행
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

const pose = new window.Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});

pose.onResults(results => {
  if (!results.poseLandmarks) return;

  const shoulder = results.poseLandmarks[11];
  const x = shoulder.x;

  if (x < 0.45) {
    wentLeft = true;
  }

  if (x > 0.55 && wentLeft) {
    count++;
    wentLeft = false;
  }

  countText.innerText = count;
  remainingText.innerText = Math.max(target - count, 0);
});

async function detect() {
  await pose.send({ image: video });
  requestAnimationFrame(detect);
}

video.onloadeddata = () => {
  detect();
};

function setTarget() {
  target = parseInt(document.getElementById("targetInput").value);
}
