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

  const slides = $("[data-project-slide]");
  const filters = $("[data-project-filter]");
  let current = 0;
  let activeFilter = "all";
  const visibleSlides = () => slides.filter(slide => activeFilter === "all" || slide.dataset.category === activeFilter);
  const showSlide = index => {
    const visible = visibleSlides();
    if (!visible.length) return;
    current = (index + visible.length) % visible.length;
    slides.forEach(slide => {
      const isVisible = visible.includes(slide);
      slide.hidden = !isVisible;
      slide.classList.toggle("is-active", isVisible && visible.indexOf(slide) === current);
    });
    const counter = $("#projectCounter");
    if (counter) counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
  };
  filters.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.projectFilter || "all";
    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle("is-active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    showSlide(0);
  }));
  $("#projectPrev")?.addEventListener("click", () => showSlide(current - 1));
  $("#projectNext")?.addEventListener("click", () => showSlide(current + 1));
  showSlide(0);

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