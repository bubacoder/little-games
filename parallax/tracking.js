// ─── Webcam, face tracking, mouse fallback, status UI ────────────────────────
import { state } from './state.js';

// ── Status helpers ───────────────────────────────────────────────────────────
const dot      = document.getElementById('status-dot');
const statusTx = document.getElementById('status-text');

export function setStatus(text, dotClass) {
  statusTx.textContent = text;
  dot.className = '';
  if (dotClass) dot.classList.add(dotClass);
}

// ── Mouse fallback ───────────────────────────────────────────────────────────
export function enableMouseMode() {
  state.cameraMode = 'mouse';
  setStatus('Mouse mode', 'active');
  document.addEventListener('mousemove', (e) => {
    if (state.paused) return;
    state.rawX =  (e.clientX / window.innerWidth  - 0.5) * 2;
    state.rawY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });
}

// ── Webcam ───────────────────────────────────────────────────────────────────
const video = document.getElementById('webcam');

export async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    await video.play();
    setStatus('Webcam active — no face yet', 'warning');
    startFaceTracking();
  } catch (err) {
    console.warn('Camera denied:', err);
    setStatus('Camera denied — mouse mode', 'warning');
    enableMouseMode();
  }
}

// ── Face tracking (MediaPipe) ────────────────────────────────────────────────
export async function startFaceTracking() {
  try {
    const { FaceLandmarker, FilesetResolver } =
      await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');

    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
    );

    const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numFaces: 1,
    });

    setStatus('Face tracking ready', 'active');
    let lastVideoTime = -1;

    function trackFace() {
      if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        const results = faceLandmarker.detectForVideo(video, performance.now());

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          const nose = results.faceLandmarks[0][1];
          const rawX =  (nose.x - 0.5) * 2;
          const rawY = -(nose.y - 0.5) * 2;
          state.rawX = state.mirrorX ?  rawX : -rawX;
          state.rawY = state.mirrorY ? -rawY :  rawY;

          if (!state.faceDetected) {
            state.faceDetected = true;
            setStatus('Tracking', 'active');
          }
        } else {
          if (state.faceDetected) {
            state.faceDetected = false;
            setStatus('No face detected', 'warning');
          }
          state.rawX *= 0.95;
          state.rawY *= 0.95;
        }
      }
      requestAnimationFrame(trackFace);
    }
    trackFace();

  } catch (err) {
    console.warn('MediaPipe failed:', err);
    setStatus('Face tracking failed — mouse mode', 'warning');
    enableMouseMode();
  }
}
