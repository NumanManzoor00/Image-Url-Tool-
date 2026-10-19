import * as THREE from "./three.module.min.js";

const $ = (s) => document.querySelector(s), $$ = (s) => document.querySelectorAll(s);

/* ---------- Translations ---------- */
const T = {
  en: { nav_upload: "Upload", nav_recent: "Recent images", nav_about: "About", h1: "Upload an image, get a link", sub: "Free, fast image hosting. Drop a file and copy the URL.", drop: "Drop images here, click to browse, or paste", hint: "PNG, JPG, GIF or WEBP, up to 5 MB each", empty: "No uploads yet. Your recent images will appear here.", about: "PixHost is a small image host you run yourself. Files are stored in your own Netlify Blobs storage, so you own your data. The recent list is remembered in this browser only.", copy: "Copy", copied: "Copied", open: "Open", del: "Delete", top: "Back to top", bad: "Unsupported file type", big: "File is larger than 5 MB", fail: "Upload failed, try again", foot: "Free image hosting" },
  ur: { nav_upload: "اپ لوڈ", nav_recent: "حالیہ تصاویر", nav_about: "ہمارے بارے میں", h1: "تصویر اپ لوڈ کریں، لنک حاصل کریں", sub: "مفت اور تیز امیج ہوسٹنگ۔ فائل ڈالیں اور لنک کاپی کریں۔", drop: "تصاویر یہاں چھوڑیں، منتخب کرنے کے لیے کلک کریں، یا پیسٹ کریں", hint: "PNG, JPG, GIF یا WEBP، ہر ایک 5 MB تک", empty: "ابھی کوئی اپ لوڈ نہیں۔ آپ کی حالیہ تصاویر یہاں نظر آئیں گی۔", about: "PixHost ایک چھوٹی امیج ہوسٹ ہے جو آپ خود چلاتے ہیں۔ فائلیں آپ کے اپنے Netlify Blobs اسٹوریج میں محفوظ ہوتی ہیں۔ حالیہ فہرست صرف اسی براؤزر میں محفوظ رہتی ہے۔", copy: "کاپی", copied: "کاپی ہو گیا", open: "کھولیں", del: "حذف کریں", top: "اوپر جائیں", bad: "فائل کی قسم معاون نہیں", big: "فائل 5 MB سے بڑی ہے", fail: "اپ لوڈ ناکام، دوبارہ کوشش کریں", foot: "مفت امیج ہوسٹنگ" },
  hi: { nav_upload: "अपलोड", nav_recent: "हाल की तस्वीरें", nav_about: "के बारे में", h1: "तस्वीर अपलोड करें, लिंक पाएं", sub: "मुफ़्त और तेज़ इमेज होस्टिंग। फ़ाइल डालें और URL कॉपी करें।", drop: "तस्वीरें यहां डालें, चुनने के लिए क्लिक करें, या पेस्ट करें", hint: "PNG, JPG, GIF या WEBP, प्रत्येक 5 MB तक", empty: "अभी कोई अपलोड नहीं। हाल की तस्वीरें यहां दिखेंगी।", about: "PixHost एक छोटा इमेज होस्ट है जिसे आप खुद चलाते हैं। फ़ाइलें आपके अपने Netlify Blobs स्टोरेज में रहती हैं। हाल की सूची सिर्फ़ इसी ब्राउज़र में याद रहती है।", copy: "कॉपी", copied: "कॉपी हुआ", open: "खोलें", del: "हटाएं", top: "ऊपर जाएं", bad: "फ़ाइल प्रकार समर्थित नहीं", big: "फ़ाइल 5 MB से बड़ी है", fail: "अपलोड विफल, फिर कोशिश करें", foot: "मुफ़्त इमेज होस्टिंग" },
  es: { nav_upload: "Subir", nav_recent: "Imágenes recientes", nav_about: "Acerca de", h1: "Sube una imagen, obtén un enlace", sub: "Alojamiento de imágenes gratis y rápido. Suelta un archivo y copia la URL.", drop: "Suelta imágenes aquí, haz clic para elegir o pega", hint: "PNG, JPG, GIF o WEBP, hasta 5 MB cada una", empty: "Aún no hay subidas. Tus imágenes recientes aparecerán aquí.", about: "PixHost es un pequeño alojamiento de imágenes que ejecutas tú. Los archivos se guardan en tu propio almacenamiento Netlify Blobs. La lista reciente solo se recuerda en este navegador.", copy: "Copiar", copied: "Copiado", open: "Abrir", del: "Eliminar", top: "Volver arriba", bad: "Tipo de archivo no admitido", big: "El archivo supera 5 MB", fail: "Error al subir, inténtalo de nuevo", foot: "Alojamiento de imágenes gratis" },
};

/* ---------- State ---------- */
let lang = localStorage.lang || "en";
let theme = localStorage.theme || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
let recent = [];
try { recent = JSON.parse(localStorage.recent || "[]"); } catch {}
const save = () => localStorage.recent = JSON.stringify(recent.slice(0, 24));
const mk = (tag, cls, text, fn) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; if (fn) e.onclick = fn; return e; };

function setTheme() {
  document.documentElement.dataset.theme = theme;
  $("#theme").textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.theme = theme;
}
function apply() {
  const t = T[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  $$("[data-i]").forEach((e) => (e.textContent = t[e.dataset.i]));
  $("#copy").textContent = `© ${new Date().getFullYear()} PixHost · ${t.foot}`;
  $("#lang").value = lang;
  localStorage.lang = lang;
  render();
}

/* ---------- Copy / render ---------- */
function copy(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const old = btn.textContent; btn.textContent = T[lang].copied;
    setTimeout(() => (btn.textContent = old), 1200);
  });
}
async function del(r) {
  try { await fetch(`/api/delete?id=${r.id}&token=${r.token}`, { method: "DELETE" }); } catch {}
  recent = recent.filter((x) => x.id !== r.id); save(); render();
}
function render() {
  const t = T[lang], g = $("#grid");
  g.innerHTML = ""; $("#empty").hidden = recent.length > 0;
  recent.forEach((r) => {
    const u = `${location.origin}/f/${r.id}`;
    const c = mk("div", "glass item fx"), img = new Image();
    img.src = u; img.loading = "lazy"; img.alt = r.name;
    const acts = mk("div", "acts"), cb = mk("button", "btn fx", t.copy);
    cb.onclick = () => copy(u, cb);
    acts.append(cb, mk("button", "btn fx", t.open, () => window.open(u, "_blank")), mk("button", "btn fx", t.del, () => del(r)));
    c.append(img, acts); g.append(c);
  });
}

/* ---------- Upload ---------- */
function send(file, row) {
  return new Promise((ok, no) => {
    const x = new XMLHttpRequest();
    x.open("POST", "/api/upload");
    x.setRequestHeader("content-type", file.type);
    x.setRequestHeader("x-filename", encodeURIComponent(file.name));
    x.upload.onprogress = (e) => (row.bar.style.width = (e.loaded / e.total) * 100 + "%");
    x.onload = () => (x.status === 200 ? ok(JSON.parse(x.responseText)) : no());
    x.onerror = no;
    x.send(file);
  });
}
async function handle(files) {
  for (const f of files) {
    const t = T[lang], row = mk("div", "glass row");
    row.bar = mk("div", "bar"); row.append(row.bar);
    $("#results").prepend(row);
    if (!/^image\/(png|jpeg|gif|webp)$/.test(f.type)) { row.append(`${f.name}: ${t.bad}`); continue; }
    if (f.size > 5 * 1024 * 1024) { row.append(`${f.name}: ${t.big}`); continue; }
    const th = new Image(); th.src = URL.createObjectURL(f); row.prepend(th);
    try {
      const r = await send(f, row);
      const inp = mk("input"); inp.readOnly = true; inp.value = r.url; inp.onfocus = () => inp.select();
      const cb = mk("button", "btn fx", t.copy); cb.onclick = () => copy(r.url, cb);
      row.append(inp, cb); row.bar.remove();
      recent.unshift({ id: r.id, token: r.token, name: f.name }); save(); render();
    } catch { row.append(`${f.name}: ${t.fail}`); }
  }
}

const drop = $("#drop"), input = $("#file");
input.onchange = () => { handle([...input.files]); input.value = ""; };
drop.onkeydown = (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), input.click());
["dragenter", "dragover"].forEach((n) => drop.addEventListener(n, (e) => { e.preventDefault(); drop.classList.add("over"); }));
["dragleave", "drop"].forEach((n) => drop.addEventListener(n, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
drop.addEventListener("drop", (e) => handle([...e.dataTransfer.files]));
addEventListener("paste", (e) => { const f = [...(e.clipboardData?.files || [])]; if (f.length) handle(f); });

/* ---------- Navbar / controls ---------- */
$$("[data-go]").forEach((b) => (b.onclick = () => document.getElementById(b.dataset.go).scrollIntoView({ behavior: "smooth" })));
$("#top").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
$("#theme").onclick = () => { theme = theme === "dark" ? "light" : "dark"; setTheme(); };
$("#lang").onchange = (e) => { lang = e.target.value; apply(); };
setTheme(); apply();

/* ---------- three.js: floating background shapes + hover particle bursts ---------- */
try {
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const layer = (id) => {
    const canvas = $(id), r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    const s = new THREE.Scene(), c = new THREE.OrthographicCamera(0, 1, 1, 0, -1000, 1000);
    const fit = () => { r.setSize(innerWidth, innerHeight, false); c.right = innerWidth; c.top = innerHeight; c.updateProjectionMatrix(); };
    fit(); addEventListener("resize", fit);
    return { r, s, c };
  };

  // Background: translucent 3D shapes drifting behind the glass panels
  const B = layer("#bg");
  const geos = [new THREE.IcosahedronGeometry(1, 0), new THREE.TorusKnotGeometry(.7, .25, 80, 12), new THREE.OctahedronGeometry(1), new THREE.TorusGeometry(.8, .3, 12, 40)];
  const shapes = Array.from({ length: 8 }, (_, i) => {
    const m = new THREE.Mesh(geos[i % 4], new THREE.MeshNormalMaterial({ transparent: true, opacity: .4 }));
    m.scale.setScalar(40 + Math.random() * 60);
    m.userData = { x: Math.random(), y: Math.random(), p: Math.random() * 6, d: .2 + Math.random() * .6 };
    B.s.add(m); return m;
  });

  // Hover FX: particle bursts (custom shader so they fade nicely on light and dark)
  const F = layer("#fx"), N = 700;
  const pos = new Float32Array(N * 3).fill(-9999), col = new Float32Array(N * 3), vel = new Float32Array(N * 3), life = new Float32Array(N), alp = new Float32Array(N);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.setAttribute("a", new THREE.BufferAttribute(alp, 1));
  F.s.add(new THREE.Points(g, new THREE.ShaderMaterial({
    vertexColors: true, transparent: true, depthWrite: false,
    vertexShader: "attribute float a;varying float va;varying vec3 vc;void main(){va=a;vc=color;gl_PointSize=3.0+11.0*a;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader: "varying float va;varying vec3 vc;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vc,va*smoothstep(.5,.15,d));}",
  })));
  const pal = [[.39, .4, .95], [.93, .28, .6], [.13, .75, .9], [.98, .75, .15]];
  let k = 0;
  const burst = (x, y, n) => {
    for (let j = 0; j < n; j++) {
      const i = k++ % N, a = Math.random() * 6.283, s = 40 + Math.random() * 140;
      pos.set([x, innerHeight - y, 0], i * 3); vel.set([Math.cos(a) * s, Math.sin(a) * s, 0], i * 3);
      col.set(pal[j % 4], i * 3); life[i] = 1;
    }
    g.attributes.color.needsUpdate = true;
  };

  let mx = 0, my = 0, last = 0;
  if (!reduce) {
    document.addEventListener("pointerover", (e) => { const el = e.target.closest(".fx"); if (el && !el.contains(e.relatedTarget)) burst(e.clientX, e.clientY, 36); });
    document.addEventListener("pointermove", (e) => {
      mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5;
      if (e.target.closest(".fx") && performance.now() - last > 40) { last = performance.now(); burst(e.clientX, e.clientY, 2); }
    });
    document.addEventListener("click", (e) => { if (e.target.closest(".btn")) burst(e.clientX, e.clientY, 60); });
  }

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
    if (!reduce) shapes.forEach((m) => {
      const u = m.userData;
      m.position.set(u.x * innerWidth - mx * 60 * u.d, (1 - u.y) * innerHeight + Math.sin(t * u.d + u.p) * 25 + my * 40 * u.d, 0);
      m.rotation.x += dt * u.d * .6; m.rotation.y += dt * u.d * .8;
    });
    B.r.render(B.s, B.c);
    for (let i = 0; i < N; i++) if (life[i] > 0) {
      life[i] -= dt * 1.4;
      pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; vel[i * 3 + 1] -= 70 * dt;
      alp[i] = Math.max(life[i], 0);
      if (life[i] <= 0) pos[i * 3] = -9999;
    }
    g.attributes.position.needsUpdate = true; g.attributes.a.needsUpdate = true;
    F.r.render(F.s, F.c);
  })();
} catch (err) { console.warn("three.js effects disabled:", err); }
