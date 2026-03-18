const video = document.getElementById("video");
const countText = document.getElementById("count");

let count = 0;
let wentLeft = false;

// 카메라 실행
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("카메라 안됨: " + err);
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

  if (x < 0.45) {
    wentLeft = true;
  }

  if (x > 0.55 && wentLeft) {
    count++;
    wentLeft = false;
  }

  countText.innerText = count;
});

async function detect() {
  await pose.send({ image: video });
  requestAnimationFrame(detect);
}

video.onloadeddata = () => {
  detect();
};
