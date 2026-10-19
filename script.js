/* SAQR WEBSITE CONFIG
   Set this to the HTTPS base URL of the Python backend after it is deployed.
   Do NOT put Discord bot tokens, OAuth client secrets, or webhook URLs in this file.
*/
const API_BASE_URL = "https://YOUR-SAQ R-BACKEND-URL.example".replace("YOUR-SAQ R-BACKEND-URL", "YOUR-SAQR-BACKEND-URL");

const STAFF_MEMBERS = [
  // { role: "OWNERS", name: "Saqr", username: "@saqrx11", image: "logo.png" },
  // { role: "SERVER MANAGER", name: "Member Name", username: "@discordusername", image: "staff1.png" },
  // Available roles: OWNERS, SERVER MANAGER, HIGH MANAGEMENT, ADMIN, EDITOR, MOD
];

const portal = document.getElementById("portal");
const mainWebsite = document.getElementById("mainWebsite");
const applicationScreen = document.getElementById("applicationScreen");
const staffScreen = document.getElementById("staffScreen");
const enterSaqr = document.getElementById("enterSaqr");
const openStaff = document.getElementById("openStaff");
const applicationForm = document.getElementById("applicationForm");
const applicationTitle = document.getElementById("applicationTitle");
const formStatus = document.getElementById("formStatus");
let selectedApplication = "Management";

// Local-only counter: counts visits in this browser/device, not global website traffic.
try {
  const counterKey = "saqr_local_visit_count_v1";
  const nextCount = Number(localStorage.getItem(counterKey) || 0) + 1;
  localStorage.setItem(counterKey, String(nextCount));
  document.getElementById("viewCount").textContent = nextCount.toLocaleString("en-US");
} catch (_) {
  document.getElementById("viewCount").textContent = "—";
}

function showPortal() {
  portal.style.display = "grid";
  applicationScreen.classList.remove("active");
  staffScreen.classList.remove("active");
  mainWebsite.classList.add("site-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function showApplication(role) {
  selectedApplication = role;
  applicationTitle.innerHTML = `${role === "ModAdmin" ? "MOD / ADMIN" : role.toUpperCase()} <em>APPLICATION</em>`;
  formStatus.textContent = "";
  authStatus.textContent = "بعد الضغط على عرض التقديمات، سجّل دخولك بحساب Discord وسيتم التحقق من عضويتك.";
  applicationForm.reset();
  applicationForm.hidden = !isDiscordVerified;
  portal.style.display = "none";
  staffScreen.classList.remove("active");
  applicationScreen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function showStaff() {
  portal.style.display = "none";
  applicationScreen.classList.remove("active");
  staffScreen.classList.add("active");
  renderStaff("OWNERS");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
enterSaqr.addEventListener("click", () => {
  portal.style.display = "none";
  applicationScreen.classList.remove("active");
  staffScreen.classList.remove("active");
  mainWebsite.classList.remove("site-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.querySelectorAll("[data-application]").forEach(button => {
  button.addEventListener("click", () => showApplication(button.dataset.application));
});
openStaff.addEventListener("click", showStaff);
document.getElementById("backFromApplication").addEventListener("click", showPortal);
document.getElementById("backFromStaff").addEventListener("click", showPortal);

// Staff directory (manual data from STAFF_MEMBERS above)
function renderStaff(role) {
  document.getElementById("selectedRole").textContent = role;
  document.querySelectorAll(".staff-role").forEach(button => button.classList.toggle("active", button.dataset.role === role));
  const members = STAFF_MEMBERS.filter(member => member.role.toUpperCase() === role);
  const grid = document.getElementById("staffGrid");
  if (!members.length) {
    grid.innerHTML = '<div class="staff-empty">لسه مفيش أعضاء مضافين للرتبة دي.<br>ضيف بياناتهم في STAFF_MEMBERS داخل script.js</div>';
    return;
  }
  grid.innerHTML = members.map(member => `
    <article class="staff-member">
      <img class="staff-avatar" src="${escapeAttribute(member.image || "")}" alt="${escapeAttribute(member.name)}" onerror="this.src='';this.style.background='linear-gradient(135deg,#302500,#111)'">
      <h4>${escapeHTML(member.name)}</h4>
      <p>${escapeHTML(member.username || "")}</p>
    </article>`).join("");
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function escapeAttribute(value) { return escapeHTML(value); }
document.querySelectorAll(".staff-role").forEach(button => button.addEventListener("click", () => renderStaff(button.dataset.role)));

// Application flow: OAuth2 and submission are handled by the secure Python backend.
const viewApplicationsButton = document.getElementById("viewApplications");
const authStatus = document.getElementById("authStatus");
let isDiscordVerified = false;

viewApplicationsButton?.addEventListener("click", () => {
  if (!API_BASE_URL.startsWith("https://") || API_BASE_URL.includes("YOUR-SAQR-BACKEND-URL")) {
    authStatus.textContent = "تسجيل الدخول هيتفعل بعد نشر Backend على استضافة Python وإضافة رابطه هنا.";
    return;
  }
  window.location.href = `${API_BASE_URL}/auth/discord?return_to=${encodeURIComponent(window.location.origin)}`;
});

// The backend must validate the Discord OAuth callback and membership, then return the user to the site.
// No webhook or secret is exposed in this public JavaScript file.
applicationForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!isDiscordVerified) {
    formStatus.textContent = "سجّل دخولك بديسكورد وتأكد من عضويتك في سيرفر صقر أولًا.";
    return;
  }
  if (!API_BASE_URL.startsWith("https://") || API_BASE_URL.includes("YOUR-SAQR-BACKEND-URL")) {
    formStatus.textContent = "التقديم مش متفعل لسه؛ لازم نربط الموقع بالـ Backend الأول.";
    return;
  }
  const submitButton = applicationForm.querySelector("button[type='submit']");
  const answers = Object.fromEntries(new FormData(applicationForm).entries());
  submitButton.disabled = true;
  submitButton.textContent = "جاري إرسال التقديم...";
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationType: selectedApplication, answers })
    });
    const result = await response.json().catch(() => ({}));
    if (response.status === 409) throw new Error("لقد أرسلت تقديمًا من قبل.");
    if (!response.ok) throw new Error(result.error || "تعذر إرسال التقديم.");
    applicationForm.reset();
    formStatus.textContent = "تم إرسال التقديم بنجاح! بالتوفيق.";
  } catch (error) {
    formStatus.textContent = error.message || "حصلت مشكلة في الإرسال. حاول مرة أخرى.";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = "إرسال التقديم <span>↗</span>";
  }
});

// Existing music player
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
  tracks.forEach((track, i) => track.querySelector(".track-play").textContent = i === currentTrack && !audio.paused ? "Ⅱ" : "▶");
}
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
document.getElementById("prevBtn").addEventListener("click", () => setTrack(currentTrack - 1, true));
document.getElementById("nextBtn").addEventListener("click", () => setTrack(currentTrack + 1, true));
volume.addEventListener("input", () => audio.volume = Number(volume.value));
audio.addEventListener("play", updatePlayer);
audio.addEventListener("pause", updatePlayer);
audio.addEventListener("ended", () => setTrack(currentTrack + 1, true));
setTrack(0);
