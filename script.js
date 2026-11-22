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


  const methodContent = [
    ["Comprendre","Échanger, écouter et analyser le besoin pour définir clairement les objectifs et les attentes du projet."],
    ["Concevoir","Imaginer une réponse adaptée, structurer les fonctionnalités et réfléchir à une interface claire et intuitive."],
    ["Développer","Donner vie au projet en construisant ses fonctionnalités avec les technologies les plus adaptées."],
    ["Améliorer","Tester, ajuster et optimiser l’expérience pour obtenir un résultat fiable, fluide et agréable à utiliser."]
  ];
  const methodButtons = $$("[data-method]");
  const methodDetail = $("#methodDetail");
  methodButtons.forEach(button => button.addEventListener("click", () => {
    const index = Number(button.dataset.method);
    const item = methodContent[index];
    if (!item || !methodDetail) return;
    methodButtons.forEach(point => {
      const active = point === button;
      point.classList.toggle("is-active", active);
      point.setAttribute("aria-pressed", String(active));
    });
    methodDetail.innerHTML = `<p class="method-detail-index">ÉTAPE ${String(index + 1).padStart(2, "0")}</p><h3>${item[0]}</h3><p>${item[1]}</p>`;
  }));

  const slides = $("[data-project-slide]");
  const filters = $$("[data-project-filter]");
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
      slide.style.display = isVisible ? "" : "none";
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

  // Navigation des projets par balayage horizontal sur écran tactile
  const projectSwipeArea = $(".project-slides");
  if (projectSwipeArea) {
    let touchStartX = 0;
    let touchStartY = 0;
    let trackingTouch = false;

    projectSwipeArea.addEventListener("pointerdown", event => {
      if (event.pointerType === "mouse" || event.target.closest("a, button")) return;
      touchStartX = event.clientX;
      touchStartY = event.clientY;
      trackingTouch = true;
    }, { passive: true });

    projectSwipeArea.addEventListener("pointerup", event => {
      if (!trackingTouch) return;
      trackingTouch = false;
      const deltaX = event.clientX - touchStartX;
      const deltaY = event.clientY - touchStartY;
      if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.25) return;
      showSlide(current + (deltaX < 0 ? 1 : -1));
    }, { passive: true });

    projectSwipeArea.addEventListener("pointercancel", () => {
      trackingTouch = false;
    }, { passive: true });
  }
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