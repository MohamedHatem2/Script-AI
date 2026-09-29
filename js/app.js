/* ============================================================
   ScriptAI — Frontend Logic v4.2 (Fixed)
   ============================================================ */

const WEBHOOK_URL =
  "https://mohamed-hatem-22.app.n8n.cloud/webhook/generate-script";

/* ---------- State ---------- */
const state = {
  name: "",
  email: "",
  script: "",
  youtube: null,
  hooks: [],
  contentType: "other",
  emailSent: false,
};

let abortController = null;

/* ---------- Content Types ---------- */
const contentTypes = {
  ar: [
    { v: "scientific", l: "علمي" },
    { v: "islamic", l: "إسلامي / ديني" },
    { v: "educational", l: "تعليمي" },
    { v: "entertainment", l: "ترفيهي" },
    { v: "tech", l: "تقني / تكنولوجيا" },
    { v: "gaming", l: "ألعاب فيديو" },
    { v: "sports", l: "رياضي" },
    { v: "fitness", l: "صحة ولياقة" },
    { v: "cooking", l: "طبخ / وصفات" },
    { v: "travel", l: "سفر / سياحة" },
    { v: "fashion", l: "موضة / أزياء" },
    { v: "business", l: "ريادة أعمال" },
    { v: "motivational", l: "تحفيزي" },
    { v: "history", l: "تاريخي" },
    { v: "documentary", l: "وثائقي" },
    { v: "comedy", l: "كوميدي" },
    { v: "music", l: "موسيقى / فن" },
    { v: "cars", l: "سيارات" },
    { v: "news", l: "أخبار / سياسة" },
    { v: "reviews", l: "مراجعات منتجات" },
    { v: "languages", l: "تعلم لغات" },
    { v: "programming", l: "برمجة" },
    { v: "design", l: "تصميم" },
    { v: "marketing", l: "تسويق" },
    { v: "finance", l: "استثمار / مالية" },
    { v: "selfdev", l: "تطوير ذات" },
    { v: "facts", l: "أسرار / حقائق مذهلة" },
    { v: "stories", l: "قصص / حكايات" },
    { v: "reactions", l: "تفاعلي / رياكشن" },
    { v: "vlog", l: "فلوق / يوميات" },
    { v: "kids", l: "أطفال" },
    { v: "beauty", l: "جمال / عناية" },
    { v: "diy", l: "أعمال يدوية / DIY" },
    { v: "pets", l: "حيوانات أليفة" },
    { v: "other", l: "أخرى" },
  ],
  en: [
    { v: "scientific", l: "Scientific" },
    { v: "islamic", l: "Islamic / Religious" },
    { v: "educational", l: "Educational" },
    { v: "entertainment", l: "Entertainment" },
    { v: "tech", l: "Tech / Technology" },
    { v: "gaming", l: "Gaming" },
    { v: "sports", l: "Sports" },
    { v: "fitness", l: "Health & Fitness" },
    { v: "cooking", l: "Cooking / Recipes" },
    { v: "travel", l: "Travel" },
    { v: "fashion", l: "Fashion" },
    { v: "business", l: "Business / Entrepreneurship" },
    { v: "motivational", l: "Motivational" },
    { v: "history", l: "History" },
    { v: "documentary", l: "Documentary" },
    { v: "comedy", l: "Comedy" },
    { v: "music", l: "Music / Art" },
    { v: "cars", l: "Cars" },
    { v: "news", l: "News / Politics" },
    { v: "reviews", l: "Product Reviews" },
    { v: "languages", l: "Language Learning" },
    { v: "programming", l: "Programming" },
    { v: "design", l: "Design" },
    { v: "marketing", l: "Marketing" },
    { v: "finance", l: "Finance / Investing" },
    { v: "selfdev", l: "Self Development" },
    { v: "facts", l: "Amazing Facts / Secrets" },
    { v: "stories", l: "Stories / Narratives" },
    { v: "reactions", l: "Reactions" },
    { v: "vlog", l: "Vlog / Daily Life" },
    { v: "kids", l: "Kids" },
    { v: "beauty", l: "Beauty & Care" },
    { v: "diy", l: "DIY / Crafts" },
    { v: "pets", l: "Pets" },
    { v: "other", l: "Other" },
  ],
};

/* ---------- i18n ---------- */
const i18n = {
  ar: {
    "step1.badge": "الخطوة ٠١",
    "step1.title": "حوّل فكرتك لسكريبت احترافي",
    "step1.subtitle": "اكتب فكرتك، واختار المدة، وسيب الـ AI يكتبلك سكريبت جاهز للتصوير — ويوصل على إيميلك.",
    "step1.name": "الاسم",
    "step1.email": "البريد الإلكتروني",
    "step1.continue": "يلا نبدأ",
    "step2.badge": "الخطوة ٠٢",
    "step2.title": "تفاصيل الفيديو",
    "step2.subtitle": "كل معلومة تزودها بتخلي السكريبت أدق وأقوى.",
    "step2.idea": "فكرة الفيديو / شرحها",
    "step2.contentType": "نوع المحتوى",
    "step2.duration": "مدة الفيديو",
    "step2.scriptLang": "لغة السكريبت",
    "step2.generate": "ولّد السكريبت",
    "content.other": "أخرى",
    "search.placeholder": "ابحث...",
    "search.empty": "لا توجد نتائج",
    "btn.back": "رجوع",
    "btn.copy": "نسخ",
    "btn.download": "تحميل .txt",
    "btn.restart": "سكريبت جديد",
    "btn.cancel": "إلغاء",
    "step3.badge": "تم",
    "step3.title": "سكريبتك الاحترافي",
    "step3.subtitle": "هنبعتلك نسخة على إيميلك كمان",
    "step3.subtitleNoEmail": "تم توليد السكريبت بنجاح",
    "step3.titles": "عناوين مقترحة",
    "step3.hooks": "هوكات بديلة",
    "step3.description": "الوصف",
    "step3.tags": "الكلمات المفتاحية",
    "loader1.text": "جاري تجهيز مساحة العمل...",
    "loader2.text": "الـ AI بيكتب السكريبت بتاعك...",
    "loader2.stage1": "قراءة موضوع الفيديو",
    "loader2.stage2": "تحليل المحتوى",
    "loader2.stage3": "تجهيز السكريبت",
    "err.required": "هذا الحقل مطلوب",
    "err.email": "من فضلك أدخل إيميل صحيح",
    "toast.copied": "تم النسخ",
    "toast.downloaded": "تم التحميل",
    "toast.error": "حدث خطأ، حاول تاني",
    "toast.cancelled": "تم الإلغاء",
  },
  en: {
    "step1.badge": "STEP 01",
    "step1.title": "Turn your idea into a pro script",
    "step1.subtitle": "Describe your idea, pick a duration, and let AI write a ready-to-shoot script — delivered to your inbox.",
    "step1.name": "Name",
    "step1.email": "Email address",
    "step1.continue": "Let's start",
    "step2.badge": "STEP 02",
    "step2.title": "Video details",
    "step2.subtitle": "The more detail you give, the sharper the script.",
    "step2.idea": "Video idea / description",
    "step2.contentType": "Content type",
    "step2.duration": "Duration",
    "step2.scriptLang": "Script language",
    "step2.generate": "Generate script",
    "content.other": "Other",
    "search.placeholder": "Search...",
    "search.empty": "No results",
    "btn.back": "Back",
    "btn.copy": "Copy",
    "btn.download": "Download .txt",
    "btn.restart": "New script",
    "btn.cancel": "Cancel",
    "step3.badge": "DONE",
    "step3.title": "Your professional script",
    "step3.subtitle": "A copy is on its way to your email",
    "step3.subtitleNoEmail": "Script generated successfully",
    "step3.titles": "Suggested titles",
    "step3.hooks": "Alternative hooks",
    "step3.description": "Description",
    "step3.tags": "Tags",
    "loader1.text": "Preparing your workspace...",
    "loader2.text": "AI is writing your script...",
    "loader2.stage1": "Reading your video topic",
    "loader2.stage2": "Analyzing content",
    "loader2.stage3": "Drafting the script",
    "err.required": "This field is required",
    "err.email": "Please enter a valid email",
    "toast.copied": "Copied",
    "toast.downloaded": "Downloaded",
    "toast.error": "Something went wrong, try again",
    "toast.cancelled": "Cancelled",
  },
};

const durationLabels = {
  ar: {
    3: "3 دقايق", 5: "5 دقايق", 8: "8 دقايق", 10: "10 دقايق",
    15: "15 دقيقة", 20: "20 دقيقة", 30: "30 دقيقة",
  },
  en: {
    3: "3 minutes", 5: "5 minutes", 8: "8 minutes", 10: "10 minutes",
    15: "15 minutes", 20: "20 minutes", 30: "30 minutes",
  },
};

let currentLang = localStorage.getItem("scriptai-lang") || "ar";

/* ---------- Helpers ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const t = (key) => (i18n[currentLang] && i18n[currentLang][key]) || key;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

/* ============================================================
   SIMPLE CUSTOM SELECT
   ============================================================ */
function setupSimpleSelect(rootEl, onChange) {
  if (!rootEl) return null;
  const trigger = rootEl.querySelector(".cs-trigger");
  const valueEl = rootEl.querySelector(".cs-value");
  const options = rootEl.querySelectorAll(".cs-menu-simple li");

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllSelects(rootEl);
    rootEl.classList.toggle("open");
    trigger.setAttribute("aria-expanded", rootEl.classList.contains("open"));
  });

  options.forEach((li) => {
    li.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("selected"));
      li.classList.add("selected");
      const val = li.dataset.value;
      valueEl.dataset.value = val;
      valueEl.textContent = li.textContent;
      rootEl.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
      if (onChange) onChange(val);
    });
  });

  return {
    el: rootEl,
    valueEl,
    options,
    trigger,
    setSelected(val, label) {
      options.forEach((o) =>
        o.classList.toggle("selected", o.dataset.value === val)
      );
      valueEl.dataset.value = val;
      if (label) valueEl.textContent = label;
    },
    updateLabels(labels) {
      options.forEach((li) => {
        const v = li.dataset.value;
        if (labels[v]) li.textContent = labels[v];
      });
    },
  };
}

function closeAllSelects(except) {
  $$(".custom-select.open").forEach((el) => {
    if (el !== except) {
      el.classList.remove("open");
      const tr = el.querySelector(".cs-trigger");
      if (tr) tr.setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("click", () => closeAllSelects());

/* ============================================================
   SEARCHABLE CONTENT TYPE SELECT
   ============================================================ */
function setupContentTypeSelect() {
  const rootEl = document.getElementById("contentTypeSelect");
  if (!rootEl) return null;

  const trigger = rootEl.querySelector(".cs-trigger");
  const valueEl = rootEl.querySelector(".cs-value");
  const searchInput = rootEl.querySelector(".cs-search");
  const optionsUl = rootEl.querySelector(".cs-options");
  const emptyEl = rootEl.querySelector(".cs-empty");

  let currentValue = "other";

  function renderList(filter) {
    const list = contentTypes[currentLang];
    const q = (filter || "").trim().toLowerCase();
    const filtered = q ? list.filter((it) => it.l.toLowerCase().includes(q)) : list;

    optionsUl.innerHTML = "";
    filtered.forEach((it) => {
      const li = document.createElement("li");
      li.dataset.value = it.v;
      li.textContent = it.l;
      if (it.v === currentValue) li.classList.add("selected");
      li.addEventListener("click", () => {
        currentValue = it.v;
        valueEl.dataset.value = it.v;
        valueEl.textContent = it.l;
        rootEl.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        state.contentType = it.v;
      });
      optionsUl.appendChild(li);
    });
    emptyEl.classList.toggle("show", filtered.length === 0);
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllSelects(rootEl);
    const willOpen = !rootEl.classList.contains("open");
    rootEl.classList.toggle("open");
    trigger.setAttribute("aria-expanded", willOpen);
    if (willOpen) {
      renderList("");
      searchInput.value = "";
      setTimeout(() => searchInput.focus(), 60);
    }
  });

  searchInput.addEventListener("input", (e) => renderList(e.target.value));
  searchInput.addEventListener("click", (e) => e.stopPropagation());

  return {
    setLang(lang) {
      renderList("");
      const item = contentTypes[lang].find((x) => x.v === currentValue);
      if (item) {
        valueEl.dataset.value = item.v;
        valueEl.textContent = item.l;
      }
    },
    reset() {
      currentValue = "other";
      state.contentType = "other";
      valueEl.dataset.value = "other";
      renderList("");
      const item = contentTypes[currentLang].find((x) => x.v === "other");
      if (item) valueEl.textContent = item.l;
    },
    getValue() { return currentValue; },
  };
}

/* ============================================================
   INIT SELECTS
   ============================================================ */
const durationSelect = setupSimpleSelect(document.getElementById("durationSelect"));
const contentTypeSelect = setupContentTypeSelect();

/* ============================================================
   applyLang
   ============================================================ */
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

  $$("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = t(key);
    if (val) el.placeholder = val;
  });

  if (durationSelect) {
    const val = durationSelect.valueEl.dataset.value || "5";
    const labels = {};
    Object.keys(durationLabels[lang]).forEach((k) => {
      labels[k] = durationLabels[lang][k];
    });
    durationSelect.updateLabels(labels);
    durationSelect.valueEl.textContent = durationLabels[lang][val];
  }

  if (contentTypeSelect) contentTypeSelect.setLang(lang);

  const nameInput = $("#name");
  const ideaInput = $("#idea");
  if (nameInput) nameInput.placeholder = lang === "ar" ? "محمد أحمد" : "Mohamed Ahmed";
  if (ideaInput)
    ideaInput.placeholder =
      lang === "ar"
        ? "اكتب فكرتك بالتفصيل... مثال: فيديو عن أفضل 5 أدوات AI لزيادة الإنتاجية في 2025"
        : "Describe your idea in detail... e.g. A video about the top 5 AI tools to boost productivity in 2025";
}

/* ============================================================
   applyTheme
   ============================================================ */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("scriptai-theme", theme);
  $("#themeIcon").textContent = theme === "dark" ? "🌙" : "☀️";
}

applyTheme(localStorage.getItem("scriptai-theme") || "dark");
applyLang(currentLang);

$("#themeToggle").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  applyTheme(cur === "dark" ? "light" : "dark");
});
$("#langToggle").addEventListener("click", () => {
  applyLang(currentLang === "ar" ? "en" : "ar");
});

/* ============================================================
   Navigation
   ============================================================ */
function goTo(id) {
  $$(".step").forEach((s) => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function withMinDelay(promise, ms) {
  const delay = new Promise((res) => setTimeout(res, ms));
  return Promise.all([promise, delay]).then(([val]) => val);
}

/* ============================================================
   Toast
   ============================================================ */
let toastTimer;
function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ============================================================
   Progress + Stages
   ============================================================ */
function resetProgress() {
  const bar = $("#progressBar");
  if (bar) bar.style.width = "0%";
  $$("#loader-2 .stage-item").forEach((s) => s.classList.remove("active", "done"));
}

function setProgress(pct) {
  const bar = $("#progressBar");
  if (bar) bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
}

function markStage(idx, status) {
  const stages = document.querySelectorAll("#loader-2 .stage-item");
  if (!stages[idx]) return;
  stages[idx].classList.remove("active", "done");
  if (status) stages[idx].classList.add(status);
}

function runProgressSimulation() {
  let pct = 0;
  const ceiling = 92;
  const start = performance.now();
  // Longer assumed duration for free models / longer scripts
  const assumedDuration = 45000;

  const iv = setInterval(() => {
    const elapsed = performance.now() - start;
    const ratio = Math.min(1, elapsed / assumedDuration);
    const eased = 1 - Math.pow(1 - ratio, 2.2);
    pct = eased * ceiling;
    setProgress(pct);

    if (pct > 8) markStage(0, "done");
    if (pct > 22) markStage(1, "active");
    if (pct > 45) { markStage(1, "done"); markStage(2, "active"); }
  }, 220);

  return function complete() {
    clearInterval(iv);
    markStage(0, "done");
    markStage(1, "done");
    markStage(2, "done");
    setProgress(100);
  };
}

/* ============================================================
   STEP 1
   ============================================================ */
$("#formStep1").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameField = $("#name").closest(".field");
  const emailField = $("#email").closest(".field");
  nameField.classList.remove("invalid");
  emailField.classList.remove("invalid");

  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  let ok = true;
  if (!name) { nameField.classList.add("invalid"); ok = false; }
  if (!isValidEmail(email)) { emailField.classList.add("invalid"); ok = false; }
  if (!ok) return;

  state.name = name;
  state.email = email;
  localStorage.setItem("scriptai-name", name);
  localStorage.setItem("scriptai-email", email);

  goTo("loader-1");
  await withMinDelay(Promise.resolve(), 1400);
  goTo("step-2");
});

/* ============================================================
   Char counter
   ============================================================ */
$("#idea").addEventListener("input", (e) => {
  const v = e.target.value;
  if (v.length > 1500) e.target.value = v.slice(0, 1500);
  const len = e.target.value.length;
  $("#charCount").textContent = len;
  const cc = $(".char-count");
  cc.classList.toggle("warn", len > 1200 && len <= 1400);
  cc.classList.toggle("danger", len > 1400);
});

$("#backBtn").addEventListener("click", () => goTo("step-1"));

/* ============================================================
   Cancel Button
   ============================================================ */
$("#cancelBtn").addEventListener("click", () => {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  showToast(t("toast.cancelled"));
  goTo("step-2");
});

/* ============================================================
   STEP 2 → Generate
   ============================================================ */
$("#formStep2").addEventListener("submit", async (e) => {
  e.preventDefault();

  const ideaField = $("#idea").closest(".field");
  ideaField.classList.remove("invalid");
  const idea = $("#idea").value.trim();
  if (!idea) {
    ideaField.classList.add("invalid");
    return;
  }

  const duration = durationSelect.valueEl.dataset.value;
  const language = document.querySelector('input[name="scriptLang"]:checked').value;

  goTo("loader-2");
  resetProgress();
  const completeProgress = runProgressSimulation();

  const payload = {
    name: state.name,
    email: state.email,
    idea,
    duration,
    language,
    contentType: state.contentType,
    timestamp: new Date().toISOString(),
  };

  abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 180000);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}${errText ? ": " + errText.slice(0, 120) : ""}`);
    }

    const data = await res.json();

    if (!data || !data.script) {
      throw new Error("No script returned from server");
    }

    state.script = data.script;
    state.youtube = data.youtube || null;
    state.hooks = data.hooks || [];
    state.emailSent = !!data.emailSent;

    completeProgress();
    await new Promise((r) => setTimeout(r, 450));

    renderScript(data.script);
    renderMetadata(data.youtube, data.hooks);

    const sub = document.getElementById("step3Subtitle");
    sub.textContent = data.emailSent ? t("step3.subtitle") : t("step3.subtitleNoEmail");

    goTo("step-3");
  } catch (err) {
    clearTimeout(timeoutId);
    console.error("Generation error:", err);

    completeProgress();

    let msg = t("toast.error");
    if (err.name === "AbortError") {
      msg = currentLang === "ar"
        ? "الطلب اتلغى أو أخذ وقت طويل جدًا."
        : "Request cancelled or took too long.";
    } else if (err.message) {
      msg = (currentLang === "ar" ? "خطأ: " : "Error: ") + err.message.slice(0, 90);
    }

    showToast(msg);
    goTo("step-2");
  } finally {
    abortController = null;
  }
});

/* ============================================================
   Markdown-ish renderer
   ============================================================ */
function renderScript(md) {
  // Convert literal \n sequences that sometimes leak from the API
  md = String(md || '').replace(/\\n/g, '\n');
  const lines = md.split(/\r?\n/);
  const out = [];
  let listBuffer = [];
  let listType = null;
  let paraBuffer = [];

  const flushList = () => {
    if (listBuffer.length) {
      out.push(`<${listType}>${listBuffer.join("")}</${listType}>`);
      listBuffer = [];
      listType = null;
    }
  };
  const flushPara = () => {
    if (paraBuffer.length) {
      out.push(`<p>${paraBuffer.join("<br/>")}</p>`);
      paraBuffer = [];
    }
  };

  const inline = (text) => {
    let s = escapeHtml(text);
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*]+?)\*(?!\*)/g, "$1<em>$2</em>");
    s = s.replace(/\[([^\]]+)\]/g, '<span class="cue">[$1]</span>');
    return s;
  };

  lines.forEach((raw) => {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      flushPara();
      return;
    }
    if (/^###\s+/.test(line)) {
      flushList(); flushPara();
      out.push(`<h3>${inline(line.replace(/^###\s+/, ""))}</h3>`);
      return;
    }
    if (/^##\s+/.test(line)) {
      flushList(); flushPara();
      out.push(`<h2>${inline(line.replace(/^##\s+/, ""))}</h2>`);
      return;
    }
    if (/^#\s+/.test(line)) {
      flushList(); flushPara();
      out.push(`<h1>${inline(line.replace(/^#\s+/, ""))}</h1>`);
      return;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      if (listType !== "ul") { flushList(); listType = "ul"; }
      listBuffer.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
      return;
    }
    if (/^\d+\.\s+/.test(line)) {
      flushPara();
      if (listType !== "ol") { flushList(); listType = "ol"; }
      listBuffer.push(`<li>${inline(line.replace(/^\d+\.\s+/, ""))}</li>`);
      return;
    }
    flushList();
    paraBuffer.push(inline(line));
  });

  flushList();
  flushPara();

  $("#scriptOutput").innerHTML = out.join("");
}

/* ============================================================
   Render Metadata (titles / hooks / desc / tags)
   ============================================================ */
function renderMetadata(youtube, hooks) {
  const block = document.getElementById("metaBlock");
  const hasYoutube = youtube && (youtube.titles?.length || youtube.description || youtube.tags?.length);
  const hasHooks = Array.isArray(hooks) && hooks.length > 0;

  if (!hasYoutube && !hasHooks) {
    block.classList.add("hidden");
    return;
  }
  block.classList.remove("hidden");

  // Titles
  const titlesUl = document.getElementById("titlesList");
  titlesUl.innerHTML = "";
  (youtube?.titles || []).forEach((title) => {
    const li = document.createElement("li");
    li.textContent = title;
    titlesUl.appendChild(li);
  });

  // Hooks (NEW)
  const hooksUl = document.getElementById("hooksList");
  hooksUl.innerHTML = "";
  (hooks || []).forEach((hook) => {
    const li = document.createElement("li");
    li.textContent = hook;
    hooksUl.appendChild(li);
  });
  // Hide hooks section if empty
  const hooksSection = hooksUl.closest(".meta-section");
  if (hooksSection) {
    hooksSection.style.display = hasHooks ? "" : "none";
  }

  // Description
  const descEl = document.getElementById("descriptionText");
  descEl.textContent = youtube?.description || "";
  const descSection = descEl.closest(".meta-section");
  if (descSection) {
    descSection.style.display = youtube?.description ? "" : "none";
  }

  // Tags
  const tagsEl = document.getElementById("tagsList");
  tagsEl.innerHTML = "";
  (youtube?.tags || []).forEach((tag) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = tag;
    tagsEl.appendChild(chip);
  });
  const tagsSection = tagsEl.closest(".meta-section");
  if (tagsSection) {
    tagsSection.style.display = (youtube?.tags || []).length ? "" : "none";
  }

  // Titles section visibility
  const titlesSection = titlesUl.closest(".meta-section");
  if (titlesSection) {
    titlesSection.style.display = (youtube?.titles || []).length ? "" : "none";
  }
}

/* ============================================================
   Actions
   ============================================================ */
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
  showToast(t("toast.downloaded"));
});

$("#restartBtn").addEventListener("click", () => {
  state.script = "";
  state.youtube = null;
  state.hooks = [];
  state.emailSent = false;

  $("#formStep2").reset();

  if (durationSelect) {
    const lbl = durationLabels[currentLang][5];
    durationSelect.setSelected("5", lbl);
  }
  if (contentTypeSelect) contentTypeSelect.reset();

  $("#charCount").textContent = "0";
  $(".char-count").classList.remove("warn", "danger");
  document.getElementById("metaBlock").classList.add("hidden");
  document.getElementById("scriptOutput").innerHTML = "";

  goTo("step-2");
});

/* ============================================================
   Restore cached user identity (name/email)
   ============================================================ */
(function restoreIdentity() {
  const n = localStorage.getItem("scriptai-name");
  const e = localStorage.getItem("scriptai-email");
  if (n) $("#name").value = n;
  if (e) $("#email").value = e;
  state.name = n || "";
  state.email = e || "";
})();

/* ============================================================
   Init
   ============================================================ */
goTo("step-1");
