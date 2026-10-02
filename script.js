/* ---- Change your wedding date and time here (IST = +05:30) ---- */
const WEDDING = new Date("2027-02-14T10:30:00+05:30");

/* ---- Envelope opens, then the page scrolls ---- */
const intro = document.getElementById("intro");
const envelope = document.getElementById("envelope");
const song = document.getElementById("song");
let opened = false;

envelope.addEventListener("click", () => {
  if (opened) return;
  opened = true;
  intro.classList.add("open");
  burst();

  // Try to start the music (allowed because the guest just tapped)
  song.play().then(() => setPlaying(true)).catch(() => {});

  setTimeout(() => {
    intro.classList.add("done");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
  }, 2700);
});

/* ---- Countdown ---- */
const el = { d: byId("d"), h: byId("h"), m: byId("m"), s: byId("s") };
function byId(id) { return document.getElementById(id); }
const pad = (n) => String(n).padStart(2, "0");

function tick() {
  let diff = Math.max(0, WEDDING - new Date());
  const days = Math.floor(diff / 86400000); diff %= 86400000;
  const hours = Math.floor(diff / 3600000); diff %= 3600000;
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  setNum(el.d, pad(days));
  setNum(el.h, pad(hours));
  setNum(el.m, pad(mins));
  setNum(el.s, pad(secs));
}
tick();
setInterval(tick, 1000);

/* ---- Vinyl music button ---- */
const vinyl = byId("vinyl");
const vinylText = byId("vinylText");

function setPlaying(on) {
  vinyl.classList.toggle("playing", on);
  vinylText.textContent = T(on ? "Playing our song" : "Tap the record to play our song");
}
vinyl.addEventListener("click", () => {
  if (song.paused) {
    song.play().then(() => setPlaying(true)).catch(() => {
      vinylText.textContent = "Add song.mp3 to the folder to play music";
    });
  } else {
    song.pause();
    setPlaying(false);
  }
});

/* ---- Reveal sections while scrolling ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((n) => io.observe(n));


/* ---- Your WhatsApp number: country code + number, no + sign ---- */
const WHATSAPP = "910000000000";

/* ---- Guest name from the link: yoursite.com/?guest=Ravi ---- */
const guest = (new URLSearchParams(location.search).get("guest") || "").trim().slice(0, 40);
function showGuest() {
  if (!guest) return;
  const d = byId("dear");
  d.hidden = false;
  d.textContent = (ml ? "പ്രിയപ്പെട്ട " : "Dear ") + guest;
}

/* ---- English / Malayalam ---- */
const ML = {
  "Tap to open": "തുറക്കാൻ തൊടുക",
  "A special invitation from": "ഒരു പ്രത്യേക ക്ഷണം",
  "We are getting married": "ഞങ്ങൾ വിവാഹിതരാകുന്നു",
  "Counting down to our day": "ഞങ്ങളുടെ ദിവസത്തിലേക്ക്",
  "Days": "ദിവസം", "Hours": "മണിക്കൂർ", "Minutes": "മിനിറ്റ്", "Seconds": "സെക്കൻഡ്",
  "Tap the record to play our song": "ഞങ്ങളുടെ പാട്ട് കേൾക്കാൻ റെക്കോർഡ് തൊടുക",
  "Playing our song": "പാട്ട് കേൾക്കുന്നു",
  "Our story": "ഞങ്ങളുടെ കഥ",
  "How we met": "ഞങ്ങൾ കണ്ടുമുട്ടിയത്",
  "The proposal": "വിവാഹാഭ്യർഥന",
  "Forever begins": "ഒരുമിച്ചുള്ള ജീവിതം",
  "Schedule": "പരിപാടികൾ",
  "Photos": "ചിത്രങ്ങൾ",
  "Join us": "ഞങ്ങളോടൊപ്പം ചേരൂ",
  "When": "എപ്പോൾ", "Where": "എവിടെ", "Lunch": "സദ്യ",
  "Served after the ceremony": "ചടങ്ങിന് ശേഷം സദ്യ",
  "Get directions": "വഴി കാണുക",
  "Save the date": "തീയതി സേവ് ചെയ്യുക",
  "Will you join us?": "നിങ്ങൾ വരുമോ?",
  "Yes, we will come": "തീർച്ചയായും വരും",
  "Sorry, we can't come": "ക്ഷമിക്കണം, വരാൻ കഴിയില്ല",
  "Your presence will make our day complete.": "നിങ്ങളുടെ സാന്നിധ്യം ഞങ്ങളുടെ ദിനം പൂർണ്ണമാക്കും",
  "Two rings, one promise": "രണ്ട് മോതിരങ്ങൾ, ഒരു വാഗ്ദാനം",
  "Drag to turn the rings": "മോതിരങ്ങൾ തിരിക്കാൻ വലിക്കുക",
  "With the blessings of": "അനുഗ്രഹത്തോടെ",
  "Bride's family": "വധുവിന്റെ കുടുംബം",
  "Groom's family": "വരന്റെ കുടുംബം",
  "Blessings for us": "ഞങ്ങൾക്കായി അനുഗ്രഹങ്ങൾ",
  "Send your blessings": "അനുഗ്രഹം അറിയിക്കൂ",
  "Just Married": "വിവാഹിതരായി"
};
let ml = false;
const T = (s) => (ml && ML[s]) || s;
const langBtn = byId("lang");

function applyLang() {
  document.body.classList.toggle("ml", ml);
  document.documentElement.lang = ml ? "ml" : "en";
  document.querySelectorAll("body *").forEach((el) => {
    if (el.children.length || el.id === "vinylText") return;
    const en = el.dataset.en || el.textContent.trim();
    if (ML[en]) { el.dataset.en = en; el.textContent = ml ? ML[en] : en; }
  });
  langBtn.textContent = ml ? "English" : "മലയാളം";
  setPlaying(!song.paused);
  showGuest();
}
langBtn.addEventListener("click", () => { ml = !ml; applyLang(); });
showGuest();

/* ---- RSVP buttons open WhatsApp with a ready message ---- */
function rsvpLink(yes) {
  const msg = (guest ? guest + ": " : "") + (yes ? "We will attend the wedding" : "Sorry, we cannot attend");
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
}
byId("rsvpYes").href = rsvpLink(true);
byId("rsvpNo").href = rsvpLink(false);

/* ---- Save the date: downloads a calendar file ---- */
byId("saveDate").addEventListener("click", () => {
  const f = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(WEDDING.getTime() + 4 * 3600000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
    "DTSTART:" + f(WEDDING), "DTEND:" + f(end),
    "SUMMARY:Arjun & Meera Wedding",
    "LOCATION:Rose Garden Convention Hall\\, Main Road\\, Your City",
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "wedding.ics";
  a.click();
});

/* ---- Gold sparkles on the envelope screen ---- */
const sp = byId("sparkles");
for (let i = 0; i < 22; i++) {
  const s = document.createElement("span");
  s.style.cssText = "left:" + Math.random() * 100 + "%;--s:" + (2 + Math.random() * 4) + "px;--t:" + (6 + Math.random() * 6) + "s;--dl:-" + Math.random() * 8 + "s";
  sp.appendChild(s);
}


/* ---- Bride's / Groom's family tabs ---- */
const FAMILY = {
  bride: "The bride's family joyfully invites you to celebrate the wedding of their daughter Meera.",
  groom: "The groom's family joyfully invites you to celebrate the wedding of their son Arjun."
};
document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("on", x === t));
  byId("familyText").textContent = FAMILY[t.dataset.side];
}));

/* ---- Gold / rose gold color button ---- */
byId("theme").addEventListener("click", () => document.body.classList.toggle("rose"));

/* ---- Guest blessings: paste your Google Form link here ---- */
byId("wishes").href = "https://forms.gle/your-form-link";


/* ---- Countdown numbers flip in 3D when they change ---- */
function setNum(node, v) {
  if (node.textContent === v) return;
  node.textContent = v;
  node.classList.remove("flip");
  void node.offsetWidth;
  node.classList.add("flip");
}

/* ---- Art drawn on the envelope: two mirrored flower sprigs and a bottom flourish ---- */
(function () {
  const sprig =
    '<path pathLength="1" d="M10 228 C32 204 52 186 86 178 C104 173 114 164 120 152"/>' +
    '<ellipse cx="38" cy="200" rx="10" ry="4" transform="rotate(-48 38 200)"/>' +
    '<ellipse cx="62" cy="184" rx="10" ry="4" transform="rotate(-25 62 184)"/>' +
    '<ellipse cx="92" cy="174" rx="10" ry="4" transform="rotate(-60 92 174)"/>' +
    '<circle cx="120" cy="150" r="4"/><circle cx="120" cy="150" r="8"/>' +
    '<circle cx="50" cy="214" r="1.6"/><circle cx="24" cy="222" r="1.6"/>';
  byId("envArt").innerHTML =
    '<path pathLength="1" d="M0 12 L180 152 L360 12"/>' +
    sprig +
    '<g transform="translate(360 0) scale(-1 1)">' + sprig + '</g>' +
    '<path pathLength="1" d="M150 226 L180 214 L210 226"/>' +
    '<path pathLength="1" d="M164 231 L180 223 L196 231"/>';
})();

/* ---- Gold burst when the envelope opens ---- */
function burst() {
  const r = envelope.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height * 0.55;
  for (let i = 0; i < 36; i++) {
    const p = document.createElement("span");
    p.className = "burst";
    p.style.left = cx + "px";
    p.style.top = cy + "px";
    intro.appendChild(p);
    const a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 170;
    p.animate(
      [{ transform: "translate(0,0) scale(1)", opacity: 1 },
       { transform: "translate(" + Math.cos(a) * d + "px," + (Math.sin(a) * d - 40) + "px) scale(0)", opacity: 0 }],
      { duration: 1400 + Math.random() * 800, easing: "cubic-bezier(.2,.8,.3,1)", delay: 600 }
    ).onfinish = () => p.remove();
  }
}

/* ---- Envelope tilts in 3D with your finger, mouse or phone movement ---- */
function tilt(x, y) { // x and y from -0.5 to 0.5
  envelope.style.setProperty("--ry", x * 24 + "deg");
  envelope.style.setProperty("--rx", -y * 18 + "deg");
}
intro.addEventListener("pointermove", (e) => tilt(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5));
intro.addEventListener("pointerleave", () => tilt(0, 0));
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma == null) return;
  const c = (v, m) => Math.max(-m, Math.min(m, v)) / (2 * m);
  tilt(c(e.gamma, 25), c((e.beta || 45) - 45, 25));
});

/* ---- Cards tilt toward the mouse on computers ---- */
document.querySelectorAll(".photo, .schedule li, .count div").forEach((n) => {
  n.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = n.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    n.style.transform = "perspective(700px) rotateY(" + x * 14 + "deg) rotateX(" + -y * 14 + "deg)";
  });
  n.addEventListener("pointerleave", () => { n.style.transform = ""; });
});


/* ---- Boy and girl walk together as you scroll; at the end of the page they get married ---- */
(function () {
  const wk = byId("walkers");
  const groomW = wk.querySelector(".w-groom");
  const brideW = wk.querySelector(".w-bride");
  let married = false, lastT = 0, walkTimer;

  function update() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    const t = Math.min(1, Math.max(0, (p - 0.03) / 0.9)); // they meet at about 93% of the page
    const fw = groomW.offsetWidth;
    const dist = innerWidth / 2 - fw - 6 + fw * 0.08;      // slight overlap so their hands meet
    groomW.style.transform = "translateX(" + dist * t + "px)";
    brideW.style.transform = "translateX(" + -dist * t + "px)";

    const nowMarried = t >= 0.995;
    if (nowMarried !== married) {
      married = nowMarried;
      wk.classList.toggle("married", married);
      if (married) heartBurst(innerWidth / 2, innerHeight - fw * 1.5);
    }
    if (t !== lastT && !married) {
      wk.classList.add("walking");
      clearTimeout(walkTimer);
      walkTimer = setTimeout(() => wk.classList.remove("walking"), 180);
    } else if (married) {
      wk.classList.remove("walking");
    }
    lastT = t;
  }

  function heartBurst(cx, cy) {
    const glyphs = ["♥", "♥", "✦", "♥"];
    const colors = ["#e05a74", "#f0d78c", "#ff8fa3", "#c9a24b"];
    for (let i = 0; i < 28; i++) {
      const s = document.createElement("span");
      s.className = "heartfly";
      s.textContent = glyphs[i % glyphs.length];
      s.style.color = colors[i % colors.length];
      s.style.left = cx + "px";
      s.style.top = cy + "px";
      document.body.appendChild(s);
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, d = 90 + Math.random() * 200;
      s.animate(
        [{ transform: "translate(0,0) scale(.6)", opacity: 1 },
         { transform: "translate(" + Math.cos(a) * d + "px," + Math.sin(a) * d + "px) scale(1.3)", opacity: 0 }],
        { duration: 1600 + Math.random() * 1200, easing: "cubic-bezier(.2,.8,.3,1)", delay: Math.random() * 300 }
      ).onfinish = () => s.remove();
    }
  }

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
})();

/* ---- Use your own pictures for the boy and girl ----
   Save transparent PNG images in this folder as groom.png and bride.png.
   If a file is there, it replaces the drawn figure automatically.
   Groom should face right, bride should face left (toward each other). */
["groom", "bride"].forEach((k) => {
  const im = new Image();
  im.onload = () => {
    const svg = document.querySelector("svg.fig." + k);
    if (!svg) return;
    im.className = "fig " + k;
    im.alt = "";
    im.setAttribute("aria-hidden", "true");
    svg.replaceWith(im);
  };
  im.src = k + ".png";
});
