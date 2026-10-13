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
    if (opts.external) {
      node.target = "_blank";
      node.rel = "noopener noreferrer";
      // Screen-reader-only hint, so people know the link leaves the page.
      node.appendChild(el("span", { class: "sr-only", text: " (opens in a new tab)" }));
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function has(arr) { return Array.isArray(arr) && arr.length > 0; }

  // Turns undefined/null into "" so a missing field never prints the word "undefined".
  function str(v) { return v == null ? "" : String(v); }

  // Replaces {year} with the current year, so the footer never goes stale.
  function fill(v) { return str(v).replace(/\{year\}/g, new Date().getFullYear()); }

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

  // The static <meta> tags in index.html are what link scrapers (X, Slack, Discord) read, since they
  // don't run JavaScript. Browsers get them kept in sync with config.js here.
  function setMeta(selector, value) {
    var m = $(selector);
    if (m && value) m.setAttribute("content", value);
  }
  var pageTitle = document.title;
  setMeta('meta[property="og:title"]', pageTitle);
  setMeta('meta[name="twitter:title"]', pageTitle);
  setMeta('meta[property="og:description"]', S.description);
  setMeta('meta[name="twitter:description"]', S.description);
  setMeta('meta[name="theme-color"]', S.theme && S.theme.paper);

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
    var navLinks = el("nav", { class: "nav-links" });
    navLinks.setAttribute("aria-label", "Main");
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

  // "Skip to content" link: invisible until a keyboard user tabs to it.
  function buildSkipLink() {
    return el("a", { class: "skip-link", href: "#main", text: "Skip to content" });
  }

  // The page's <main> landmark. tabindex=-1 lets the skip link move keyboard focus into it.
  function buildMain(children) {
    var m = el("main", { id: "main" }, children);
    m.setAttribute("tabindex", "-1");
    return m;
  }

  function buildFooter() {
    var f = S.footer || {};
    return el("footer", {}, [
      el("span", { text: fill(f.left) }),
      el("span", { text: fill(f.right) })
    ]);
  }

  /* ---------- 404 page ---------- */

  function render404() {
    var nf = S.notFound || {};
    var wrap = $(".wrap");
    var base = window.__BASE__ || "";   // set by 404.html: the folder the site lives in
    wrap.appendChild(buildSkipLink());
    wrap.appendChild(buildHeader(base + "index.html"));
    wrap.appendChild(buildMain([
      el("section", { class: "error" }, [
        el("div", { class: "error-code", text: nf.code }),
        el("h1", { text: nf.headline }),
        el("p", { text: nf.text }),
        el("a", { class: "home-link", href: safeUrl(S.homeUrl) || base || "/", text: nf.button })
      ])
    ]));
    wrap.appendChild(buildFooter());
  }

  /* ---------- placeholder check ---------- */

  // If sample text from the template is still in config.js, say so in the browser console
  // (press F12 → Console) so it doesn't get published by accident. Nothing shows on the page itself.
  var PLACEHOLDERS = [
    /example\.(com|org|net)/i,
    /\byour[ -](name|username|handle)\b/i,
    /^20XX$/,
    /^City, Country$/
  ];

  function warnAboutPlaceholders() {
    var found = [];

    (function walk(value, path) {
      if (typeof value === "string") {
        if (PLACEHOLDERS.some(function (re) { return re.test(value); })) found.push(path);
      } else if (Array.isArray(value)) {
        value.forEach(function (v, i) { walk(v, path + "[" + i + "]"); });
      } else if (value && typeof value === "object") {
        Object.keys(value).forEach(function (k) { walk(value[k], path ? path + "." + k : k); });
      }
    })(S, "");

    if (found.length && window.console && console.warn) {
      console.warn(
        "[portfolio-template] config.js still contains placeholder text in " + found.length +
        " field" + (found.length === 1 ? "" : "s") + ":\n  • " + found.join("\n  • ") +
        "\nReplace these with your own details before publishing."
      );
    }
  }


  /* ---------- home page ---------- */

  function renderHero() {
    var h = S.hero || {};
    var hero = el("section", { class: "hero" });
    if (h.headline) hero.appendChild(el("h1", { text: h.headline }));
    if (h.intro) hero.appendChild(el("p", { text: h.intro }));
    var facts = (has(h.meta) ? h.meta : []).filter(function (m) { return m && (m.label || m.value); });
    if (facts.length) {
      hero.appendChild(el("div", { class: "hero-meta" }, facts.map(function (m) {
        var d = el("div", {}, [el("strong", { text: str(m.label) })]);
        d.appendChild(document.createTextNode(str(m.value)));
        return d;
      })));
    }
    return hero;
  }

  function renderWork() {
    var w = S.work || {};
    var items = (has(w.items) ? w.items : []).filter(function (it) { return it && it.title; });
    if (!items.length) return null;

    // Small label opposite the heading. Defaults to a count ("3 projects").
    // Set work.label to "" to hide it. (work.columnLabel from v1.0.0 still works.)
    var label;
    if (w.columnLabel != null) label = w.columnLabel;
    else if (w.label != null) {
      var tpl = (items.length === 1 && w.labelOne != null) ? w.labelOne : w.label;
      label = str(tpl).replace(/\{count\}/g, items.length);
    } else label = items.length + (items.length === 1 ? " project" : " projects");

    var sec = el("section", { class: "section reveal", id: "work" }, [
      el("div", { class: "section-head" }, [
        el("h2", { text: str(w.title) }),
        label ? el("span", { text: label }) : null
      ])
    ]);

    items.forEach(function (it) {
      var url = safeUrl(it.url);
      var title = el("h3", {}, [
        url
          ? el("a", { class: "title-link", href: url, text: it.title, external: /^https?:/i.test(url) })
          : el("span", { text: it.title })
      ]);
      sec.appendChild(el("div", { class: "work-item" }, [
        el("div", { class: "work-year", text: str(it.year) }),
        el("div", { class: "work-body" }, [title, it.description ? el("p", { text: it.description }) : null]),
        el("div", { class: "work-tags", text: str(it.tag) })
      ]));
    });
    return sec;
  }

  function renderAbout() {
    var a = S.about || {};
    if (!has(a.paragraphs)) return null;

    var sec = el("section", { class: "section about reveal", id: "about" }, [
      el("div", { class: "section-head" }, [el("h2", { text: str(a.title) })])
    ]);

    a.paragraphs.forEach(function (text, i) {
      var faded = a.fadeLastParagraph !== false && i === a.paragraphs.length - 1 && a.paragraphs.length > 1;
      sec.appendChild(el("p", { class: faded ? "gray" : "", text: str(text) }));
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
        return u ? el("a", { href: u, text: str(l.label) || u, external: /^https?:/i.test(u) }) : null;
      })));
    }
    return sec;
  }

  function renderHome() {
    var wrap = $(".wrap");
    wrap.appendChild(buildSkipLink());
    wrap.appendChild(buildHeader(""));
    wrap.appendChild(buildMain([renderHero(), renderWork(), renderAbout(), renderContact()]));
    wrap.appendChild(buildFooter());
    warnAboutPlaceholders();

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
