/* ===================== SAQR WEBSITE SETTINGS =====================
   1) Paste your Discord Applications webhook URL below.
   2) Add staff members to STAFF_MEMBERS using the examples.
   Keep in mind: a webhook URL placed in browser JavaScript is visible
   to visitors. Use it only for a private/test server or move it behind
   a small server endpoint before publishing publicly.
================================================================== */
const APPLICATION_WEBHOOK_URL = "https://discord.com/api/webhooks/1560466503814348836/i-a1m3hlScq5bxLO3QQDwktbqtHGZdRMWBoV7ADC8C8niTvF1hxXZutxpFAkj6NIsIcY";

// Add your team members manually. Image paths can be logo.png or any image in this folder.
const STAFF_MEMBERS = [
{ role: "OWNERS", name: "Saqr", saqrx11: "@saqrx11", image: "logo.png" },
 { role: "SERVER MANAGER", name: "its3ABDO", its3abdo_1: "@its3abdo_1", image: "staff1.png" },
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
  applicationTitle.innerHTML = `${role.toUpperCase()} <em>APPLICATION</em>`;
  formStatus.textContent = "";
  applicationForm.reset();
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

// Application submit -> Discord webhook. Configure APPLICATION_WEBHOOK_URL above.
applicationForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!APPLICATION_WEBHOOK_URL.startsWith("https://discord.com/api/webhooks/")) {
    formStatus.textContent = "الإرسال مش متفعل لسه: حط رابط الـWebhook في script.js الأول.";
    return;
  }
  const formData = new FormData(applicationForm);
  const answers = Object.fromEntries(formData.entries());
  const fields = [
    { name: "Full name / الاسم الثلاثي", value: answers.fullName, inline: false },
    { name: "Age / السن", value: answers.age, inline: true },
    { name: "Experience / الخبرة", value: answers.experience, inline: true },
    { name: "Previous work / أمثلة", value: answers.examples, inline: false },
    { name: "Knows staff rules / التعليمات", value: answers.rules, inline: true },
    { name: "Visited website / زار الويب", value: answers.visited, inline: true },
    { name: "Website rating / تقييم الويب", value: `${answers.rating}/10`, inline: true },
    { name: "Discord", value: answers.discord, inline: true },
    { name: "TikTok", value: answers.tiktok, inline: true }
  ].map(field => ({ ...field, value: String(field.value || "—").slice(0, 1024) }));
  const submitButton = applicationForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "جاري إرسال التقديم...";
  formStatus.textContent = "";
  try {
    const response = await fetch(APPLICATION_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "SAQR Applications",
        embeds: [{
          title: `NEW ${selectedApplication.toUpperCase()} APPLICATION`,
          color: 16765952,
          fields,
          footer: { text: "SAQR • APPLICATIONS — Review manually" },
          timestamp: new Date().toISOString()
        }],
        allowed_mentions: { parse: [] }
      })
    });
    if (!response.ok) throw new Error(`Webhook response ${response.status}`);
    applicationForm.reset();
    formStatus.textContent = "تم إرسال التقديم بنجاح! بالتوفيق.";
  } catch (error) {
    console.error(error);
    formStatus.textContent = "حصلت مشكلة في الإرسال. راجع رابط الـWebhook وجرب تاني.";
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
