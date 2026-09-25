/* A330-300 for Aerofly FS — behaviour
   header state on scroll, reveal-on-scroll, mobile menu, language switch,
   trailer modal (YouTube loads only on click), gallery lightbox, hero video. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header turns solid once the hero scrolls away */
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("solid", window.scrollY > 40); }
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* Reveal on scroll */
  var targets = document.querySelectorAll(".reveal, .feature");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* Hero video: fade in once it can play; stays an image on reduced motion */
  var video = document.querySelector(".hero-media video");
  if (video && !reduce) {
    video.addEventListener("canplay", function () { video.classList.add("ready"); }, { once: true });
    var p = video.play(); if (p && p.catch) p.catch(function () {});
  } else if (video) { video.remove(); }

  /* Mobile menu */
  var toggle = document.querySelector(".menu-toggle"), nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); } });
  }

  /* Language switch: each language lives at its own path */
  var lang = document.querySelector("#lang-select");
  if (lang) lang.addEventListener("change", function () {
    var href = lang.options[lang.selectedIndex].getAttribute("data-href");
    if (href !== null) window.location.href = href + window.location.hash;
  });

  /* Trailer modal */
  var modal = document.querySelector("#trailer-modal");
  if (modal) {
    var frame = modal.querySelector(".modal-frame");
    function openTrailer(id) {
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="Trailer" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      modal.hidden = false; document.body.style.overflow = "hidden";
    }
    function closeTrailer() { modal.hidden = true; frame.innerHTML = ""; document.body.style.overflow = ""; }
    document.querySelectorAll(".js-trailer").forEach(function (b) { b.addEventListener("click", function () { openTrailer(b.getAttribute("data-video-id")); }); });
    modal.querySelector(".modal-close").addEventListener("click", closeTrailer);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeTrailer(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeTrailer(); });
  }

  /* Gallery lightbox */
  var box = document.querySelector(".lightbox");
  if (box) {
    var img = box.querySelector("img"), cap = box.querySelector("figcaption");
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery a")), current = -1;
    function show(i) {
      current = (i + items.length) % items.length;
      img.src = items[current].getAttribute("href"); img.alt = items[current].getAttribute("data-caption") || "";
      cap.textContent = img.alt; box.hidden = false; document.body.style.overflow = "hidden";
    }
    function hide() { box.hidden = true; document.body.style.overflow = ""; }
    items.forEach(function (a, i) { a.addEventListener("click", function (e) { e.preventDefault(); show(i); }); });
    box.querySelector(".lb-close").addEventListener("click", hide);
    box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) hide(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") hide(); if (e.key === "ArrowLeft") show(current - 1); if (e.key === "ArrowRight") show(current + 1);
    });
  }
})();
