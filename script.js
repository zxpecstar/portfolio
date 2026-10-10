/* Renders the page from config.js. You shouldn't need to edit this file. */

(function () {
  "use strict";

  var S = window.SITE;
  if (!S) {
    document.body.textContent = "config.js is missing or has a syntax error. Check the browser console.";
    return;
  }

  var $ = function (sel) { return document.querySelector(sel); };
  var isNotFound = document.body.classList.contains("page-404");

  /* ---------- helpers ---------- */

  function el(tag, opts, children) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.class) node.className = opts.class;
    if (opts.id) node.id = opts.id;
    if (opts.text != null) node.textContent = opts.text;
    if (opts.href) node.setAttribute("href", opts.href);
    if (opts.external) { node.target = "_blank"; node.rel = "noopener noreferrer"; }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function has(arr) { return Array.isArray(arr) && arr.length > 0; }

  // Only allow http(s), mailto and relative links. Blocks javascript: URLs.
  function safeUrl(u) {
    u = String(u || "").trim();
    return /^(https?:|mailto:|\/|\.|#|[\w-]+(\.html)?(#.*)?$)/i.test(u) ? u : "";
  }

  /* ---------- head: title, description, theme, font ---------- */

  document.documentElement.lang = S.lang || "en";
  document.title = isNotFound
    ? "404 — " + (S.siteTitle || S.name)
    : (S.siteTitle || S.name);

  if (S.description) {
    var meta = $('meta[name="description"]') || document.head.appendChild(el("meta"));
    meta.setAttribute("name", "description");
    meta.setAttribute("content", S.description);
  }

  if (S.theme) {
    var root = document.documentElement.style;
    ["paper", "ink", "gray", "line", "accent"].forEach(function (k) {
      if (S.theme[k]) root.setProperty("--" + k, S.theme[k]);
    });
  }

  if (S.googleFont) {
    var fam = encodeURIComponent(S.googleFont).replace(/%20/g, "+");
    var link = el("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=" + fam + ":wght@400..700&display=swap";
    document.head.appendChild(link);
    document.body.style.fontFamily = '"' + S.googleFont + '","Helvetica Neue",Arial,sans-serif';
  }

  /* ---------- shared: header + footer ---------- */

  function buildHeader(prefix) {
    var navLinks = el("div", { class: "nav-links" });
    var n = S.nav || {};
    if (has(S.work && S.work.items)) navLinks.appendChild(el("a", { href: prefix + "#work", text: n.work || "Work" }));
    if (has(S.about && S.about.paragraphs)) navLinks.appendChild(el("a", { href: prefix + "#about", text: n.about || "About" }));
    if (S.contact && (S.contact.email || has(S.contact.links))) navLinks.appendChild(el("a", { href: prefix + "#contact", text: n.contact || "Contact" }));

    return el("header", {}, [
      el("div", { class: "nav" }, [
        el("span", { class: "nav-mark", text: S.name }),
        navLinks
      ])
    ]);
  }

  function buildFooter() {
    var f = S.footer || {};
    return el("footer", {}, [
      el("span", { text: f.left || "" }),
      el("span", { text: f.right || "" })
    ]);
  }

  /* ---------- 404 page ---------- */

  function render404() {
    var nf = S.notFound || {};
    var wrap = $(".wrap");
    var base = window.__BASE__ || "";   // set by 404.html: the folder the site lives in
    wrap.appendChild(buildHeader(base + "index.html"));
    wrap.appendChild(el("main", {}, [
      el("section", { class: "error" }, [
        el("div", { class: "error-code", text: nf.code }),
        el("h1", { text: nf.headline }),
        el("p", { text: nf.text }),
        el("a", { class: "home-link", href: safeUrl(S.homeUrl) || base || "/", text: nf.button })
      ])
    ]));
    wrap.appendChild(buildFooter());
  }

  /* ---------- home page ---------- */

  function renderHero() {
    var h = S.hero || {};
    var hero = el("section", { class: "hero" });
    if (h.headline) hero.appendChild(el("h1", { text: h.headline }));
    if (h.intro) hero.appendChild(el("p", { text: h.intro }));
    if (has(h.meta)) {
      hero.appendChild(el("div", { class: "hero-meta" }, h.meta.map(function (m) {
        var d = el("div", {}, [el("strong", { text: m.label })]);
        d.appendChild(document.createTextNode(m.value));
        return d;
      })));
    }
    return hero;
  }

  function renderWork() {
    var w = S.work || {};
    if (!has(w.items)) return null;

    var sec = el("section", { class: "section reveal", id: "work" }, [
      el("div", { class: "section-head" }, [
        el("h2", { text: w.title }),
        w.columnLabel ? el("span", { text: w.columnLabel }) : null
      ])
    ]);

    w.items.forEach(function (it) {
      var url = safeUrl(it.url);
      var title = el("h3", {}, [
        url
          ? el("a", { class: "title-link", href: url, text: it.title, external: /^https?:/i.test(url) })
          : el("span", { text: it.title })
      ]);
      sec.appendChild(el("div", { class: "work-item" }, [
        el("div", { class: "work-year", text: it.year || "" }),
        el("div", { class: "work-body" }, [title, it.description ? el("p", { text: it.description }) : null]),
        el("div", { class: "work-tags", text: it.tag || "" })
      ]));
    });
    return sec;
  }

  function renderAbout() {
    var a = S.about || {};
    if (!has(a.paragraphs)) return null;

    var sec = el("section", { class: "section about reveal", id: "about" }, [
      el("div", { class: "section-head" }, [el("h2", { text: a.title })])
    ]);

    a.paragraphs.forEach(function (text, i) {
      var faded = a.fadeLastParagraph !== false && i === a.paragraphs.length - 1 && a.paragraphs.length > 1;
      sec.appendChild(el("p", { class: faded ? "gray" : "", text: text }));
    });

    if (has(a.skills)) {
      var line = el("div", { class: "stack-line" }, [el("b", { text: a.skillsLabel || "" })]);
      line.appendChild(document.createTextNode(" " + a.skills.join(" · ")));
      sec.appendChild(line);
    }
    return sec;
  }

  function renderContact() {
    var c = S.contact || {};
    if (!c.email && !has(c.links)) return null;

    var sec = el("section", { class: "section contact reveal", id: "contact" });
    if (c.heading) sec.appendChild(el("h2", { text: c.heading }));
    if (c.email) sec.appendChild(el("a", { class: "contact-link", href: "mailto:" + c.email, text: c.email }));
    if (has(c.links)) {
      sec.appendChild(el("div", { class: "contact-row" }, c.links.map(function (l) {
        var u = safeUrl(l.url);
        return u ? el("a", { href: u, text: l.label, external: /^https?:/i.test(u) }) : null;
      })));
    }
    return sec;
  }

  function renderHome() {
    var wrap = $(".wrap");
    wrap.appendChild(buildHeader(""));
    [renderHero(), renderWork(), renderAbout(), renderContact()].forEach(function (s) {
      if (s) wrap.appendChild(s);
    });
    wrap.appendChild(buildFooter());

    // scroll reveal
    var els = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("active"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      els.forEach(function (n) { io.observe(n); });
    } else {
      els.forEach(function (n) { n.classList.add("active"); });
    }
  }

  if (isNotFound) render404(); else renderHome();
})();
