/* Progressive enhancement: every image and resource remains a normal link. */
(() => {
  "use strict";

  const dialog = document.querySelector("#image-dialog");
  const image = document.querySelector("#lightbox-image");
  const caption = document.querySelector("#lightbox-caption");
  const original = document.querySelector("#lightbox-original");
  const close = document.querySelector("#close-lightbox");
  const imageWrap = document.querySelector(".lightbox-image-wrap");
  let opener = null;

  if (dialog && typeof dialog.showModal === "function") {
    const zoom = document.createElement("button");
    zoom.type = "button";
    zoom.id = "toggle-zoom";
    zoom.textContent = "Actual size";
    zoom.setAttribute("aria-pressed", "false");
    zoom.setAttribute("aria-label", "Show image at actual size");
    close.before(zoom);

    const resetZoom = () => {
      imageWrap.classList.remove("is-zoomed");
      zoom.textContent = "Actual size";
      zoom.setAttribute("aria-pressed", "false");
      zoom.setAttribute("aria-label", "Show image at actual size");
      imageWrap.scrollTo(0, 0);
    };

    document.querySelectorAll("a[data-lightbox]").forEach((link) => {
      link.addEventListener("click", (event) => {
        // Keep standard new-tab and modified-link behaviors intact.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = link;
        resetZoom();
        const description = link.dataset.caption || "ControlScene research figure.";
        caption.textContent = description;
        image.alt = link.querySelector("img")?.alt || description;
        image.src = link.href;
        original.href = link.href;
        dialog.showModal();
        document.body.classList.add("dialog-open");
        close.focus({ preventScroll: true });
      });
    });

    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      // A click on the backdrop, not on whitespace inside the dialog.
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      resetZoom();
      image.removeAttribute("src");
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
    zoom.addEventListener("click", () => {
      const expanded = imageWrap.classList.toggle("is-zoomed");
      zoom.textContent = expanded ? "Fit to screen" : "Actual size";
      zoom.setAttribute("aria-pressed", String(expanded));
      zoom.setAttribute("aria-label", expanded ? "Fit image to screen" : "Show image at actual size");
    });
    image.addEventListener("error", () => {
      caption.textContent = "This figure could not be loaded. Use ‘Open full image’ to retry.";
    });
  }

  const copy = document.querySelector("#copy-citation");
  const bibtex = document.querySelector("#bibtex");
  const status = document.querySelector("#copy-status");
  if (copy && bibtex && status) {
    copy.hidden = false;
    copy.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(bibtex.textContent.trim());
        status.textContent = "Citation copied to clipboard.";
        copy.querySelector("span").textContent = "Copied!";
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(bibtex);
        const pre = bibtex.closest("pre");
        pre.focus({ preventScroll: true });
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = "Citation selected. Press Ctrl+C or ⌘C to copy, or use your device’s text selection menu.";
        copy.querySelector("span").textContent = "Select citation";
      }
    });
  }


  // A manual carousel enhances, rather than replaces, the static scene articles.
  const carousel = document.querySelector("#scene-carousel");
  if (carousel) {
    const slides = [...carousel.querySelectorAll(".scene-card")];
    const dots = [...carousel.querySelectorAll("[data-scene]")];
    const controls = carousel.querySelector(".carousel-controls");
    const announcement = carousel.querySelector("#carousel-status");
    let active = 0;
    let gesture = null;
    let suppressClickUntil = 0;

    const showScene = (index) => {
      const focusedInSlide = slides[active].contains(document.activeElement);
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, position) => {
        slide.hidden = position !== active;
        slide.inert = position !== active;
        if (position === active) {
          slide.querySelectorAll("img").forEach((img) => { img.loading = "eager"; });
        }
      });
      dots.forEach((dot, position) => dot.setAttribute("aria-pressed", String(position === active)));
      announcement.textContent = slides[active].querySelector("h3").textContent + " · " + (active + 1) + " of " + slides.length;
      carousel.dataset.activeScene = String(active);
      if (focusedInSlide) carousel.focus({ preventScroll: true });
    };

    carousel.dataset.enhanced = "true";
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-roledescription", "carousel");
    carousel.setAttribute("aria-label", "Generated scene examples");
    carousel.setAttribute("aria-describedby", "carousel-instructions");
    carousel.tabIndex = 0;
    slides.forEach((slide, index) => {
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide " + (index + 1) + " of " + slides.length);
    });
    controls.hidden = false;
    announcement.hidden = false;
    showScene(0);

    carousel.querySelectorAll("[data-direction]").forEach((button) => {
      button.addEventListener("click", () => showScene(active + Number(button.dataset.direction)));
    });
    dots.forEach((dot) => {
      dot.addEventListener("click", () => showScene(Number(dot.dataset.scene)));
    });
    carousel.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        showScene(active + (event.key === "ArrowRight" ? 1 : -1));
      }
    });

    const gallery = carousel.querySelector(".scene-gallery");
    gallery.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary) {
        gesture = null;
        return;
      }
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }, { passive: true });
    window.addEventListener("pointerup", (event) => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      gesture = null;
      if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        // Suppress only the pointer-generated click following a swipe.
        // Keyboard activation (detail = 0) remains available.
        suppressClickUntil = performance.now() + 600;
        showScene(active + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });
    window.addEventListener("pointercancel", () => { gesture = null; }, { passive: true });
    gallery.addEventListener("click", (event) => {
      if (event.detail > 0 && performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  const menu = document.querySelector("#contents-menu");
  if (menu) {
    const summary = menu.querySelector("summary");
    menu.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        menu.open = false;
        const target = document.querySelector(link.hash);
        if (target) {
          target.tabIndex = -1;
          target.focus({ preventScroll: true });
        }
      });
    });
    document.addEventListener("pointerdown", (event) => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    }, { passive: true });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.open) {
        event.preventDefault();
        menu.open = false;
        summary.focus({ preventScroll: true });
      }
    });
    document.addEventListener("focusin", (event) => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
  }
})();
