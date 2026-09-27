/* ============================================================
   ScriptAI — Frontend Logic
   ============================================================ */

// ⚠️ ضع الـ n8n Webhook URL هنا (Production URL)
const WEBHOOK_URL =
  "https://mohamed-hatem-22.app.n8n.cloud/webhook/generate-script";

/* ---------- State ---------- */
const state = {
  name: "",
  email: "",
  script: "",
};

/* ---------- i18n Dictionary ---------- */
const i18n = {
  ar: {
    "step1.badge": "✦ مدعوم بالذكاء الاصطناعي",
    "step1.title": "حوّل فكرتك لسكريبت احترافي",
    "step1.subtitle":
      "اكتب فكرتك، واختار المدة، وسيب الـ AI يكتبلك سكريبت جاهز للتصوير — ويوصل على إيميلك.",
    "step1.name": "الاسم",
    "step1.email": "البريد الإلكتروني",
    "step1.continue": "يلا نبدأ",
    "step2.badge": "✦ الخطوة 02",
    "step2.title": "تفاصيل الفيديو",
    "step2.subtitle": "كل معلومة تزودها بتخلي السكريبت أدق وأقوى.",
    "step2.idea": "فكرة الفيديو / شرحها",
    "step2.duration": "مدة الفيديو",
    "step2.scriptLang": "لغة السكريبت",
    "step2.generate": "ولّد السكريبت",
    "btn.back": "رجوع",
    "btn.copy": "نسخ",
    "btn.download": "تحميل .txt",
    "btn.restart": "سكريبت جديد",
    "step3.badge": "✓ السكريبت جاهز",
    "step3.title": "سكريبتك الاحترافي",
    "step3.subtitle": "تم إرسال نسخة على إيميلك كمان 🎉",
    "loader1.text": "جاري تجهيز مساحة العمل...",
    "loader2.text": "الـ AI بيكتب السكريبت بتاعك...",
    "loader2.sub": "قد يستغرق الأمر حتى 30 ثانية",
    "err.required": "هذا الحقل مطلوب",
    "err.email": "من فضلك أدخل إيميل صحيح",
    "toast.copied": "تم النسخ ✓",
    "toast.error": "حدث خطأ، حاول تاني",
    "toast.idea": "اكتب فكرتك الأول",
  },
  en: {
    "step1.badge": "✦ AI-Powered",
    "step1.title": "Turn your idea into a pro script",
    "step1.subtitle":
      "Describe your idea, pick a duration, and let AI write a ready-to-shoot script — delivered to your inbox.",
    "step1.name": "Name",
    "step1.email": "Email address",
    "step1.continue": "Let's start",
    "step2.badge": "✦ Step 02",
    "step2.title": "Video details",
    "step2.subtitle": "The more detail you give, the sharper the script.",
    "step2.idea": "Video idea / description",
    "step2.duration": "Duration",
    "step2.scriptLang": "Script language",
    "step2.generate": "Generate script",
    "btn.back": "Back",
    "btn.copy": "Copy",
    "btn.download": "Download .txt",
    "btn.restart": "New script",
    "step3.badge": "✓ Script is ready",
    "step3.title": "Your professional script",
    "step3.subtitle": "A copy was sent to your email too 🎉",
    "loader1.text": "Preparing your workspace...",
    "loader2.text": "AI is writing your script...",
    "loader2.sub": "This can take up to 30 seconds",
    "err.required": "This field is required",
    "err.email": "Please enter a valid email",
    "toast.copied": "Copied ✓",
    "toast.error": "Something went wrong, try again",
    "toast.idea": "Please write your idea first",
  },
};

let currentLang = localStorage.getItem("scriptai-lang") || "ar";

/* ---------- Helpers ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function t(key) {
  return (i18n[currentLang] && i18n[currentLang][key]) || key;
}

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem("scriptai-lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  $("#langLabel").textContent = lang === "ar" ? "EN" : "AR";

  $$("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val) el.textContent = val;
  });

  const nameInput = $("#name");
  const emailInput = $("#email");
  const ideaInput = $("#idea");
  if (nameInput)
    nameInput.placeholder = lang === "ar" ? "محمد أحمد" : "Mohamed Ahmed";
  if (emailInput) emailInput.placeholder = "you@example.com";
  if (ideaInput)
    ideaInput.placeholder =
      lang === "ar"
        ? "اكتب فكرتك بالتفصيل... مثال: فيديو عن أفضل 5 أدوات AI لزيادة الإنتاجية في 2025"
        : "Describe your idea in detail... e.g. A video about the top 5 AI tools to boost productivity in 2025";
}

/* ---------- Theme ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("scriptai-theme", theme);
  $("#themeIcon").textContent = theme === "dark" ? "🌙" : "☀️";
}
const savedTheme = localStorage.getItem("scriptai-theme") || "dark";
applyTheme(savedTheme);
applyLang(currentLang);

$("#themeToggle").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  applyTheme(cur === "dark" ? "light" : "dark");
});
$("#langToggle").addEventListener("click", () => {
  applyLang(currentLang === "ar" ? "en" : "ar");
});

/* ---------- Step navigation ---------- */
function goTo(id) {
  $$(".step").forEach((s) => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Loader duration helper ---------- */
function withMinDelay(promise, ms) {
  const delay = new Promise((res) => setTimeout(res, ms));
  return Promise.all([promise, delay]).then(([val]) => val);
}

/* ---------- Validation ---------- */
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ---------- Custom Select ---------- */
const cs = document.getElementById("durationSelect");
if (cs) {
  const trigger = cs.querySelector(".cs-trigger");
  const valueEl = cs.querySelector(".cs-value");
  const options = cs.querySelectorAll(".cs-menu li");

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    cs.classList.toggle("open");
    trigger.setAttribute("aria-expanded", cs.classList.contains("open"));
  });

  options.forEach((li) => {
    li.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("selected"));
      li.classList.add("selected");
      valueEl.textContent = li.textContent;
      valueEl.dataset.value = li.dataset.value;
      cs.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", () => {
    cs.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  });
}

/* ---------- STEP 1 submit ---------- */
$("#formStep1").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameField = $("#name").closest(".field");
  const emailField = $("#email").closest(".field");
  nameField.classList.remove("invalid");
  emailField.classList.remove("invalid");

  const name = $("#name").value.trim();
  const email = $("#email").value.trim();

  let ok = true;
  if (!name) {
    nameField.classList.add("invalid");
    ok = false;
  }
  if (!isValidEmail(email)) {
    emailField.classList.add("invalid");
    ok = false;
  }
  if (!ok) return;

  state.name = name;
  state.email = email;

  goTo("loader-1");
  await withMinDelay(Promise.resolve(), 1800);
  goTo("step-2");
});

/* ---------- Char counter ---------- */
$("#idea").addEventListener("input", (e) => {
  const v = e.target.value;
  if (v.length > 1500) e.target.value = v.slice(0, 1500);
  $("#charCount").textContent = e.target.value.length;
});

/* ---------- Back button ---------- */
$("#backBtn").addEventListener("click", () => goTo("step-1"));

/* ---------- STEP 2 submit → call n8n ---------- */
$("#formStep2").addEventListener("submit", async (e) => {
  e.preventDefault();

  const ideaField = $("#idea").closest(".field");
  ideaField.classList.remove("invalid");
  const idea = $("#idea").value.trim();
  if (!idea) {
    ideaField.classList.add("invalid");
    return;
  }

  const duration = document.querySelector(".cs-value").dataset.value;
  const language = document.querySelector(
    'input[name="scriptLang"]:checked'
  ).value;

  goTo("loader-2");

  const payload = {
    name: state.name,
    email: state.email,
    idea: idea,
    duration: duration,
    language: language,
    timestamp: new Date().toISOString(),
  };

  try {
    const req = fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });

    const data = await withMinDelay(req, 3500);

    if (!data || !data.script) throw new Error("No script returned");
    state.script = data.script;

    renderScript(data.script);
    goTo("step-3");
  } catch (err) {
    console.error(err);
    showToast(t("toast.error"));
    goTo("step-2");
  }
});

/* ---------- Render Script (Markdown-lite) ---------- */
function renderScript(md) {
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const html = escaped
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  $("#scriptOutput").innerHTML = "<p>" + html + "</p>";
}

/* ---------- Actions ---------- */
$("#copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(state.script);
    showToast(t("toast.copied"));
  } catch {
    showToast(t("toast.error"));
  }
});

$("#downloadBtn").addEventListener("click", () => {
  const blob = new Blob([state.script], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `script-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

$("#restartBtn").addEventListener("click", () => {
  state.script = "";
  $("#formStep2").reset();
  $("#charCount").textContent = "0";
  goTo("step-2");
});

/* ---------- Init ---------- */
goTo("step-1");