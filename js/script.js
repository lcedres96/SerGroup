(function () {
  "use strict";

  // ---- header scroll state ----
  var header = document.getElementById("site-header");
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- mobile nav toggle ----
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("mobile-nav");
  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("mobile-open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // ---- nav dropdown: "Capacitaciones" (desktop click + mobile expandible) ----
  document.querySelectorAll(".nav-caret-btn").forEach(function (btn) {
    var wrapper = btn.closest(".nav-item-dropdown, .mobile-nav-item");
    if (!wrapper) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = wrapper.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".nav-item-dropdown.open").forEach(function (w) {
      if (!w.contains(e.target)) {
        w.classList.remove("open");
        var b = w.querySelector(".nav-caret-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ---- generic single-open accordion ----
  function initAccordion(containerSelector, itemSelector, headerSelector, panelSelector, onOpen) {
    document.querySelectorAll(containerSelector).forEach(function (container) {
      var items = Array.prototype.slice.call(container.querySelectorAll(itemSelector));

      function openItem(item) {
        items.forEach(function (other) {
          var h = other.querySelector(headerSelector);
          var p = other.querySelector(panelSelector);
          h.setAttribute("aria-expanded", other === item ? "true" : "false");
          p.classList.toggle("open", other === item);
        });
        if (onOpen) onOpen(item);
      }

      items.forEach(function (item) {
        var header = item.querySelector(headerSelector);
        var panel = item.querySelector(panelSelector);
        header.addEventListener("click", function () {
          if (panel.classList.contains("open")) {
            header.setAttribute("aria-expanded", "false");
            panel.classList.remove("open");
          } else {
            openItem(item);
          }
        });
      });
    });
  }

  // ---- servicios.html: acordeón + panel visual lateral que cambia ----
  var servicesVisual = document.getElementById("servicios-visual");
  initAccordion("#servicios-accordion", ".svc-row", ".svc-head", ".svc-panel", function (item) {
    if (!servicesVisual) return;
    servicesVisual.querySelector(".sv-num").textContent = item.getAttribute("data-num");
    servicesVisual.querySelector(".sv-title").textContent = item.getAttribute("data-title");
  });

  // ---- capacitaciones.html: acordeón simple ----
  initAccordion(".training-list", ".training-item", ".training-header", ".training-panel");

  // ---- nosotros.html: misión / visión plegables, independientes entre sí ----
  document.querySelectorAll(".mv-card").forEach(function (card) {
    var head = card.querySelector(".mv-head");
    var panel = card.querySelector(".mv-panel");
    head.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("open");
      head.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  // ---- scroll reveal ----
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  // ---- contact form: build mailto ----
  var form = document.getElementById("contact-form");
  var mensajeField = document.getElementById("mensaje");

  var params = new URLSearchParams(window.location.search);
  var asunto = params.get("asunto");
  if (asunto && mensajeField && !mensajeField.value) {
    mensajeField.value = "Quiero consultar sobre: " + asunto + "\n\n";
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = document.getElementById("nombre").value.trim();
      var empresa = document.getElementById("empresa").value.trim();
      var email = document.getElementById("email").value.trim();
      var mensaje = mensajeField.value.trim();

      var subject = "Contacto desde sergroup.com.ar" + (asunto ? " — " + asunto : empresa ? " — " + empresa : "");
      var body =
        "Nombre: " + nombre + "\n" +
        "Empresa: " + (empresa || "-") + "\n" +
        "Email: " + email + "\n\n" +
        mensaje;

      var mailto = "mailto:contacto@sergroup.com.ar" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      var status = document.getElementById("form-status");
      if (status) {
        status.style.display = "block";
        status.textContent = "Abriendo tu cliente de email para enviar el mensaje...";
      }
    });
  }

  // ---- footer year ----
  document.querySelectorAll("#year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
