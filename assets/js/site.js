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

  // Highlight the current research section; the correction section belongs to Results.
  const navigation = [...document.querySelectorAll(".site-header nav a")];
  const targets = navigation.map((link) => ({ link, section: document.querySelector(link.hash) }));
  let pending = false;
  const updateNavigation = () => {
    pending = false;
    const offset = document.querySelector(".site-header").getBoundingClientRect().height + 40;
    let current = null;
    targets.forEach((target) => {
      if (target.section.getBoundingClientRect().top <= offset) current = target;
    });
    targets.forEach(({ link }) => {
      if (link === current?.link) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  const scheduleUpdate = () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(updateNavigation);
    }
  };
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  updateNavigation();
})();
