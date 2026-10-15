const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enterBtn");
const quietBtn = document.getElementById("quietBtn");
const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const volume = document.getElementById("volume");
const tracks = [...document.querySelectorAll(".track")];
const trackFiles = ["music1.mp3", "music2.mp3"];
let currentTrack = 0;

function setTrack(index, autoplay = false) {
  currentTrack = (index + trackFiles.length) % trackFiles.length;
  audio.src = trackFiles[currentTrack];
  tracks.forEach((track, i) => {
    track.classList.toggle("active", i === currentTrack);
    track.querySelector(".track-play").textContent = i === currentTrack && !audio.paused ? "Ⅱ" : "▶";
  });
  if (autoplay) audio.play().catch(() => { playBtn.textContent = "▶"; });
}
function updatePlayer() {
  playBtn.textContent = audio.paused ? "▶" : "Ⅱ";
  tracks.forEach((track, i) => {
    track.querySelector(".track-play").textContent = i === currentTrack && !audio.paused ? "Ⅱ" : "▶";
  });
}
function enterSite(withMusic) {
  intro.classList.add("hidden");
  if (withMusic) {
    setTrack(0);
    audio.volume = Number(volume.value);
    audio.play().then(updatePlayer).catch(updatePlayer);
  }
}
enterBtn.addEventListener("click", () => enterSite(true));
quietBtn.addEventListener("click", () => enterSite(false));
tracks.forEach((track, i) => track.addEventListener("click", () => {
  if (currentTrack === i && !audio.paused) audio.pause();
  else { setTrack(i); audio.play().catch(() => {}); }
  updatePlayer();
}));
playBtn.addEventListener("click", () => {
  if (!audio.src) setTrack(currentTrack);
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
});
document.getElementById("prevBtn").addEventListener("click", () => { setTrack(currentTrack - 1, true); });
document.getElementById("nextBtn").addEventListener("click", () => { setTrack(currentTrack + 1, true); });
volume.addEventListener("input", () => audio.volume = Number(volume.value));
audio.addEventListener("play", updatePlayer);
audio.addEventListener("pause", updatePlayer);
audio.addEventListener("ended", () => setTrack(currentTrack + 1, true));
setTrack(0);
