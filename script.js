(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const themeButton = $("#themeToggle");
  const savedTheme = localStorage.getItem("chirel-theme");
  if (savedTheme === "dark") document.body.classList.add("theme-dark");
  themeButton?.addEventListener("click", () => {
    document.body.classList.toggle("theme-dark");
    localStorage.setItem("chirel-theme", document.body.classList.contains("theme-dark") ? "dark" : "light");
    themeButton.setAttribute("aria-label", document.body.classList.contains("theme-dark") ? "Activer le mode clair" : "Activer le mode sombre");
  });

  const menuButton = $("#menuToggle");
  const mobileNav = $("#mobileNav");
  menuButton?.addEventListener("click", () => {
    const open = mobileNav?.classList.toggle("is-open") ?? false;
    menuButton.setAttribute("aria-expanded", String(open));
  });
  $$("#mobileNav a").forEach(link => link.addEventListener("click", () => {
    mobileNav?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  const slides = $$("[data-project-slide]");
  let current = 0;
  const showSlide = index => {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
    const counter = $("#projectCounter");
    if (counter) counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  };
  $("#projectPrev")?.addEventListener("click", () => showSlide(current - 1));
  $("#projectNext")?.addEventListener("click", () => showSlide(current + 1));

  $$("[data-card-flip]").forEach(button => button.addEventListener("click", () => $("#businessCard")?.classList.toggle("is-flipped")));

  const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 }) : null;
  $$(".reveal").forEach(element => revealObserver ? revealObserver.observe(element) : element.classList.add("is-visible"));
})();