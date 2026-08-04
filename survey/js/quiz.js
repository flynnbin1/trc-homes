/* ==========================================================================
   TRC Homes — Renovation Lead Survey Funnel
   Static, dependency-free quiz. Mobile-first, full-screen steps, icon-card
   answers with auto-advance, progress bar, contact captured last.
   Brand: Forest / Gold / Off-white · Marcellus + Jost (WEBSITE-SPEC.md §9/§10).
   ========================================================================== */

/* ----- CONFIG --------------------------------------------------------------
   Dedicated GoHighLevel inbound webhook for the survey funnel.
   (GHL: Automation → Workflows → Inbound Webhook trigger → copy URL.)
--------------------------------------------------------------------------- */
const CONFIG = {
  GHL_WEBHOOK_URL: "https://services.leadconnectorhq.com/hooks/KdkkX8xmRBvInWZ1D6ne/webhook-trigger/a204aa61-4f8c-426c-aa02-0314a3a2d021",
  SOURCE: "trc-survey-funnel",
};

/* ----- Icons (inline stroke SVG, currentColor) ----------------------------- */
const I = {
  check:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  home:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>',
  key:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="5"/><path d="M11.5 11.5L21 2"/><path d="M17 6l3 3M15.5 4.5L18 7"/></svg>',
  renovate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V10l7-6 7 6v11"/><path d="M14 21v-6a2 2 0 0 0-4 0v6"/><path d="M15 3l2 2-2 2"/></svg>',
  extend:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V11l6-5v15"/><path d="M9 21V9l7 4v8"/><path d="M2 21h20"/><path d="M18 4v6M15 7h6"/></svg>',
  energy:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V10l8-6 8 6v11"/><path d="M13 8l-3 5h3l-2 5"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
  grid:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  room:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16"/><path d="M3 9h18"/><path d="M9 20V9"/></svg>',
  expand:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V8l6-4v16"/><path d="M10 9h7a2 2 0 0 1 2 2v9"/><path d="M3 20h18"/><path d="M14 4l2 2-2 2"/></svg>',
  detached:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V10l8-6 8 6v11z"/><path d="M10 21v-6h4v6"/></svg>',
  semi:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V8l-6-4-3 2.2V21"/><path d="M12 21V8l6-4 3 2.2V21"/><path d="M2 21h20"/></svg>',
  terrace: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l3-3 3 3v12"/><path d="M9 21V9l3-3 3 3v12"/><path d="M15 21V9l3-3 3 3v12"/><path d="M2 21h20"/></svg>',
  bungalow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21V13l10-6 10 6v8z"/><path d="M9 21v-5h6v5"/></svg>',
  apartment:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/><path d="M2 21h20"/></svg>',
  euro:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6.5A7 7 0 1 0 18 17.5"/><path d="M3 10h9M3 14h8"/></svg>',
  bolt:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z"/></svg>',
  clock:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
  search:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  badge:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M9 14l-1 7 4-2 4 2-1-7"/><path d="M12 6v3l2 1" stroke-width="1.4"/></svg>',
  minus:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',
  help:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.2 9a2.8 2.8 0 0 1 5.4 1c0 1.9-2.8 2.5-2.8 2.5"/><path d="M12 17h.01"/></svg>',
  shield:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  star:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>',
  phone:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 2 6a2 2 0 0 1 2-2z"/></svg>',
};

/* ----- Step definitions ---------------------------------------------------- */
const STEPS = [
  {
    type: "welcome",
    key: "owns_property",
    kicker: "Free renovation consultation · 30 seconds",
    headline: "Planning to transform an <span class='hl'>older Cork home</span>?",
    help: "Answer a few quick questions and we'll prepare your free, no-obligation consultation — tailored to your home, your budget and any grants you may qualify for.",
    question: "Do you own the property?",
    layout: "2",
    options: [
      { value: "Yes", label: "Yes, I own it", icon: I.home },
      { value: "No", label: "Not yet / renting", icon: I.key },
    ],
  },
  {
    type: "choice",
    key: "project_type",
    question: "What kind of project are you planning?",
    options: [
      { value: "Full home renovation", label: "Full home renovation", icon: I.renovate },
      { value: "Extension", label: "Extension", icon: I.extend },
      { value: "Energy upgrade / retrofit", label: "Energy upgrade / retrofit", icon: I.energy },
      { value: "Not sure yet", label: "Not sure yet", icon: I.compass },
    ],
  },
  {
    type: "choice",
    key: "scope",
    question: "How much of the home is involved?",
    help: "A rough idea is fine — it helps us gauge the scale of the works.",
    options: [
      { value: "Whole house", label: "The whole house", icon: I.home },
      { value: "Several rooms", label: "Several rooms", icon: I.grid },
      { value: "One room / area", label: "One room or area", icon: I.room },
      { value: "Adding space", label: "Adding space (extension / attic)", icon: I.expand },
    ],
  },
  {
    type: "choice",
    key: "property_type",
    question: "What type of property is it?",
    options: [
      { value: "Detached", label: "Detached", icon: I.detached },
      { value: "Semi-detached", label: "Semi-detached", icon: I.semi },
      { value: "Terraced", label: "Terraced", icon: I.terrace },
      { value: "Bungalow", label: "Bungalow", icon: I.bungalow },
      { value: "Apartment", label: "Apartment", icon: I.apartment },
    ],
  },
  {
    type: "choice",
    key: "budget",
    question: "What budget range are you working with?",
    help: "This helps us tailor the right scope and materials — there's no obligation.",
    options: [
      { value: "Under €50k", label: "Under €50,000", icon: I.euro },
      { value: "€50k–€100k", label: "€50,000 – €100,000", icon: I.euro },
      { value: "€100k–€200k", label: "€100,000 – €200,000", icon: I.euro },
      { value: "€200k+", label: "€200,000+", icon: I.euro },
      { value: "Not sure yet", label: "Not sure yet", icon: I.help },
    ],
  },
  {
    type: "choice",
    key: "timeframe",
    question: "When are you hoping to start?",
    options: [
      { value: "ASAP / within 3 months", label: "As soon as possible", icon: I.bolt },
      { value: "3–6 months", label: "In 3–6 months", icon: I.clock },
      { value: "6–12 months", label: "In 6–12 months", icon: I.calendar },
      { value: "Just researching", label: "Just researching for now", icon: I.search },
    ],
  },
  {
    type: "choice",
    key: "grants",
    question: "Interested in SEAI retrofit grants?",
    help: "We handle the full grant process for you — no paperwork on your side.",
    options: [
      { value: "Yes, what do I qualify for?", label: "Yes — what do I qualify for?", icon: I.badge },
      { value: "Already looking into it", label: "Already looking into it", icon: I.search },
      { value: "Not relevant to my project", label: "Not relevant to my project", icon: I.minus },
      { value: "Not sure", label: "Not sure", icon: I.help },
    ],
  },
  {
    type: "contact",
    key: "contact",
    question: "Where should we send your consultation?",
    help: "We'll review your answers and call you back — usually within the hour.",
    fields: [
      { key: "full_name", label: "Full name", type: "text", placeholder: "Your name", autocomplete: "name" },
      { key: "phone", label: "Mobile number", type: "tel", placeholder: "08X XXX XXXX", autocomplete: "tel" },
      { key: "email", label: "Email", type: "email", placeholder: "you@email.com", autocomplete: "email" },
      { key: "eircode", label: "Eircode", type: "text", placeholder: "e.g. T12 GH6E", autocomplete: "postal-code" },
    ],
    submitLabel: "Get my free consultation",
  },
  { type: "thankyou" },
];

const ANSWERABLE = STEPS.filter((s) => s.type !== "thankyou").length;

/* ----- State --------------------------------------------------------------- */
const STORE_KEY = "trc_survey_state";
let index = 0;
const answers = {};

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && saved.answers) Object.assign(answers, saved.answers);
    if (typeof saved.index === "number" && saved.index > 0 && saved.index < STEPS.length - 1) {
      index = saved.index; // resume where they left off (not the thank-you screen)
    }
  } catch (e) { /* ignore corrupt state */ }
}
function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ answers, index })); } catch (e) {}
}
function clearState() {
  try { localStorage.removeItem(STORE_KEY); } catch (e) {}
}

/* ----- DOM refs ------------------------------------------------------------ */
const stage = document.getElementById("stage");
const backBtn = document.getElementById("backBtn");
const progressFill = document.getElementById("progressFill");
const progressBar = document.querySelector(".progress");
const progressLabel = document.getElementById("progressLabel");

/* ----- Rendering ----------------------------------------------------------- */
function optionCard(step, opt) {
  const icon = opt.icon ? `<span class="option__icon" aria-hidden="true">${opt.icon}</span>` : "";
  return `
    <button class="option${answers[step.key] === opt.value ? " is-selected" : ""}" type="button" data-value="${opt.value}">
      ${icon}
      <span class="option__label">${opt.label}</span>
      <span class="option__key" aria-hidden="true"></span>
    </button>`;
}

function render() {
  const step = STEPS[index];
  updateChrome();
  let html = "";

  if (step.type === "welcome") {
    html = `
      <section class="step step--animate step--welcome">
        <div class="welcome__hero">
          <picture>
            <source type="image/webp" srcset="/assets/full-renovation-cork.webp">
            <img src="/assets/full-renovation-cork.webp" alt="A fully renovated period home in Cork by TRC Homes" decoding="async">
          </picture>
          <span class="welcome__hero-badge">${I.shield}<span>Cork's premium renovation team</span></span>
        </div>
        <span class="kicker">${I.bolt}${step.kicker}</span>
        <h1 class="step__q step__q--hero">${step.headline}</h1>
        <p class="step__help">${step.help}</p>
        <h2 class="step__sub">${step.question}</h2>
        <div class="options options--2">
          ${step.options.map((o) => optionCard(step, o)).join("")}
        </div>
        <ul class="trust">
          <li><span class="trust__star">${I.star}</span> 5.0 · Google reviews</li>
          <li>${I.check} 15+ years in Cork</li>
          <li>${I.check} Fixed-price contracts</li>
        </ul>
      </section>`;
  }

  else if (step.type === "choice") {
    html = `
      <section class="step step--animate">
        <h1 class="step__q">${step.question}</h1>
        ${step.help ? `<p class="step__help">${step.help}</p>` : ""}
        <div class="options options--${step.layout || "1"}">
          ${step.options.map((o) => optionCard(step, o)).join("")}
        </div>
      </section>`;
  }

  else if (step.type === "contact") {
    html = `
      <section class="step step--animate">
        <h1 class="step__q">${step.question}</h1>
        ${step.help ? `<p class="step__help">${step.help}</p>` : ""}
        <form id="contactForm" novalidate>
          ${step.fields.map((f) => `
            <div class="field">
              <label class="field__label" for="f_${f.key}">${f.label}</label>
              <input class="field__input" id="f_${f.key}" name="${f.key}" type="${f.type}"
                placeholder="${f.placeholder}" value="${answers[f.key] || ""}"
                autocomplete="${f.autocomplete}" inputmode="${f.type === "tel" ? "tel" : f.type === "email" ? "email" : "text"}">
              <p class="field__error" id="e_${f.key}"></p>
            </div>`).join("")}
          <div class="hp" aria-hidden="true">
            <label>Leave this field empty<input type="text" id="f_website" tabindex="-1" autocomplete="off"></label>
          </div>
          <div class="step__actions">
            <button class="btn btn--primary" id="submitBtn" type="submit">${step.submitLabel}</button>
          </div>
          <p class="field__error field__error--submit" id="submitError" role="alert">Sorry — we couldn't send your details just now. Please check your connection and try again.</p>
          <p class="reassure">${I.phone}<span>We'll call you back, usually within the hour. Your details are only used to prepare your consultation.</span></p>
          <p class="legal">By submitting, you agree to be contacted by TRC Homes about your enquiry. See our <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>.</p>
        </form>
      </section>`;
  }

  else if (step.type === "thankyou") {
    const name = (answers.full_name || "").split(" ")[0];
    html = `
      <section class="step step--animate thanks">
        <div class="thanks__check">${I.check}</div>
        <h1 class="step__q">Thank you${name ? ", " + name : ""} — you're all set.</h1>
        <p class="step__help">Your free consultation request is on its way. A member of the TRC Homes team will call you back, usually within the hour.</p>
        <ol class="thanks__next">
          <li><span class="num">1</span><span>We review your answers and prepare a tailored plan for your home.</span></li>
          <li><span class="num">2</span><span>We call you to confirm the details and answer any questions.</span></li>
          <li><span class="num">3</span><span>You get honest, fixed-price advice — including any grants you qualify for.</span></li>
        </ol>
      </section>`;
  }

  stage.innerHTML = html;
  bindStep();
  const h = stage.querySelector("h1");
  if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  stage.scrollTop = 0;
  window.scrollTo({ top: 0 });
}

function updateChrome() {
  const step = STEPS[index];
  backBtn.hidden = index === 0 || step.type === "thankyou";
  const pct = step.type === "thankyou" ? 100 : Math.round((index / ANSWERABLE) * 100);
  progressFill.style.transform = "scaleX(" + (pct / 100) + ")";
  progressBar.setAttribute("aria-valuenow", String(pct));
  progressLabel.textContent = step.type === "thankyou" ? "Complete" : `Step ${index + 1} of ${ANSWERABLE}`;
}

/* ----- Step behaviour ------------------------------------------------------ */
function bindStep() {
  const step = STEPS[index];

  if (step.type === "welcome" || step.type === "choice") {
    stage.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        stage.querySelectorAll(".option").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        answers[step.key] = btn.dataset.value;
        saveState();
        setTimeout(next, 240); // brief highlight, then auto-advance
      });
    });
  }

  if (step.type === "contact") {
    const form = document.getElementById("contactForm");
    form.addEventListener("submit", (e) => { e.preventDefault(); submitContact(step); });
  }
}

const VALIDATORS = {
  full_name: (v) => v.trim().length >= 2 && /[a-zA-Z]/.test(v),
  phone: (v) => (v.replace(/[^\d]/g, "").length >= 7),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  // Lenient Irish Eircode: routing key + 4 chars (space optional), with a
  // ≥5-char fallback so a genuine code is never wrongly rejected.
  eircode: (v) => {
    const s = v.trim().toUpperCase().replace(/\s+/g, "");
    return /^[AC-FHKNPRTV-Y][0-9][0-9AC-FHKNPRTV-Y][0-9AC-FHKNPRTV-Y]{3}$/.test(s) || s.length >= 5;
  },
};
const ERRORS = {
  full_name: "Please enter your name.",
  phone: "Please enter a valid mobile number.",
  email: "Please enter a valid email address.",
  eircode: "Please enter your Eircode (e.g. T12 GH6E).",
};

function submitContact(step) {
  const hp = document.getElementById("f_website");
  if (hp && hp.value) { goThankYou(); return; } // honeypot — silently succeed for bots

  let valid = true;
  step.fields.forEach((f) => {
    const input = document.getElementById("f_" + f.key);
    const err = document.getElementById("e_" + f.key);
    const v = input.value || "";
    const ok = VALIDATORS[f.key] ? VALIDATORS[f.key](v) : v.trim().length > 0;
    if (!ok) {
      valid = false;
      input.classList.add("has-error");
      err.textContent = ERRORS[f.key] || "This field is required.";
      err.classList.add("show");
    } else {
      answers[f.key] = v.trim();
      input.classList.remove("has-error");
      err.classList.remove("show");
    }
    input.addEventListener("input", () => { input.classList.remove("has-error"); err.classList.remove("show"); }, { once: true });
  });
  if (!valid) {
    const firstErr = stage.querySelector(".field__input.has-error");
    if (firstErr) firstErr.focus();
    return;
  }
  saveState();
  sendLead();
}

function buildPayload() {
  return {
    name: answers.full_name || "",
    phone: answers.phone || "",
    email: answers.email || "",
    eircode: answers.eircode || "",
    do_you_own_the_property: answers.owns_property || "",
    project_type: answers.project_type || "",
    project_scope: answers.scope || "",
    property_type: answers.property_type || "",
    budget_range: answers.budget || "",
    timeframe: answers.timeframe || "",
    seai_grant_interest: answers.grants || "",
    source: CONFIG.SOURCE,
  };
}

async function sendLead() {
  const btn = document.getElementById("submitBtn");
  const label = btn.textContent;
  const errEl = document.getElementById("submitError");
  if (errEl) errEl.classList.remove("show");
  btn.disabled = true;
  btn.innerHTML = '<span class="btn__spinner"></span> Sending…';
  const payload = buildPayload();

  if (!CONFIG.GHL_WEBHOOK_URL) {
    console.info("[TRC survey] No GHL_WEBHOOK_URL set — lead NOT sent. Payload:", payload);
    setTimeout(goThankYou, 700);
    return;
  }

  // GHL's webhook returns CORS headers, so POST in cors mode with a proper
  // application/json content-type: GHL parses the JSON into fields, and we can
  // read the real HTTP status so a genuine failure shows an error, not a false
  // thank-you.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(CONFIG.GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error("GHL responded HTTP " + res.status);
    goThankYou();
  } catch (err) {
    clearTimeout(timer);
    console.error("[TRC survey] Lead submission failed:", err);
    btn.disabled = false;
    btn.innerHTML = label;
    if (errEl) errEl.classList.add("show");
  }
}

function goThankYou() {
  clearState(); // lead captured — don't resume this session
  // Push the completion event for GTM, then hand off to the site's /thank-you
  // page, which fires the consent-gated Meta Lead conversion on load (cookie
  // consent carries over on the same domain).
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "survey_complete",
    project_type: answers.project_type || "",
    budget: answers.budget || "",
  });
  window.location.href = "/thank-you";
}

/* ----- Navigation ---------------------------------------------------------- */
function next() {
  if (index < STEPS.length - 1) { index++; saveState(); render(); }
}
function back() {
  if (index > 0) { index--; saveState(); render(); }
}
backBtn.addEventListener("click", back);

/* ----- Init ---------------------------------------------------------------- */
loadState();
render();
