const experience = [
  {
    role: "Analista de Operações",
    company: "Empresa Exemplo LTDA",
    period: "2022 — Atual",
    description:
      "Coordenação de rotinas operacionais, acompanhamento de indicadores e melhoria contínua de processos entre áreas.",
  },
  {
    role: "Assistente de Projetos",
    company: "Grupo Horizonte",
    period: "2019 — 2022",
    description:
      "Apoio ao planejamento e execução de projetos, organização de cronogramas, documentação e comunicação com stakeholders.",
  },
  {
    role: "Estagiária Administrativa",
    company: "Serviços Alpha",
    period: "2017 — 2019",
    description:
      "Suporte administrativo, controle de documentos e atendimento interno, com foco em organização e prazos.",
  },
];

const languages = [
  { name: "Português", level: "Nativo", percent: 100 },
  { name: "Inglês", level: "Intermediário", percent: 65 },
  { name: "Espanhol", level: "Básico", percent: 40 },
];

const projects = [
  {
    title: "Automação de relatórios",
    description:
      "Padronização e automação de relatórios semanais de operação, reduzindo tempo manual de consolidação.",
    tags: ["Excel", "Power BI", "Processos"],
  },
  {
    title: "Portal de onboarding",
    description:
      "Organização de conteúdo e checklist para integração de novos colaboradores da área de operações.",
    tags: ["Documentação", "Treinamento"],
  },
  {
    title: "Mapeamento de fluxos",
    description:
      "Levantamento de processos críticos e proposta de melhorias com indicadores de acompanhamento.",
    tags: ["BPM", "Indicadores"],
  },
  {
    title: "Dashboard de SLA",
    description:
      "Painel visual para acompanhar prazos e volume de demandas entre times internos.",
    tags: ["Dados", "Operações"],
  },
];

function renderExperience() {
  const list = document.getElementById("experienceList");
  list.innerHTML = experience
    .map(
      (job) => `
      <article class="job">
        <div class="job-meta">
          <h3 class="job-role">${job.role}</h3>
          <span class="job-company">${job.company}</span>
          <span class="job-period">${job.period}</span>
        </div>
        <p class="job-desc">${job.description}</p>
      </article>
    `
    )
    .join("");
}

function renderLanguages() {
  const list = document.getElementById("languagesList");
  list.innerHTML = languages
    .map(
      (lang) => `
      <li class="language" data-percent="${lang.percent}">
        <div class="language-row">
          <span>${lang.name}</span>
          <span class="language-level">${lang.level}</span>
        </div>
        <div class="language-bar" aria-hidden="true">
          <span class="language-fill"></span>
        </div>
      </li>
    `
    )
    .join("");
}

function renderProjects() {
  const list = document.getElementById("projectsList");
  list.innerHTML = projects
    .map(
      (project) => `
      <article class="project">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <ul class="project-tags">
          ${project.tags.map((tag) => `<li>${tag}</li>`).join("")}
        </ul>
      </article>
    `
    )
    .join("");
}

function setupReveal() {
  const sections = document.querySelectorAll(".section");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    animateLanguageBars();
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.id === "idiomas") animateLanguageBars();
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  sections.forEach((section) => observer.observe(section));
}

function animateLanguageBars() {
  document.querySelectorAll(".language").forEach((item) => {
    const fill = item.querySelector(".language-fill");
    const percent = item.dataset.percent || "0";
    requestAnimationFrame(() => {
      fill.style.width = `${percent}%`;
    });
  });
}

function setupThemeToggle() {
  const button = document.getElementById("themeToggle");
  const stored = localStorage.getItem("cv-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");

  applyTheme(initial);

  button.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("cv-theme", next);
  });
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function setupUpdatedDate() {
  const time = document.getElementById("updatedAt");
  const now = new Date();
  time.dateTime = now.toISOString().slice(0, 10);
  time.textContent = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function setupNavHighlight() {
  const links = document.querySelectorAll(".nav a");
  const sections = [...links]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: [0.15, 0.4] }
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
  renderExperience();
  renderLanguages();
  renderProjects();
  setupReveal();
  setupThemeToggle();
  setupUpdatedDate();
  setupNavHighlight();
});
