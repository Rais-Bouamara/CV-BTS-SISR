/* ============================================================
   CV Bouamara Raïs - Interactions dynamiques
   ============================================================ */
(function () {
    "use strict";

    /* ------------------------------------------------------------
       Traductions
       La clé correspond à l'attribut data-i18n des éléments du HTML.
       ------------------------------------------------------------ */
    var I18N = {
        fr: {
            "doc.title": "CV Raïs Bouamara - Développeur front junior",
            "meta.description": "CV de Raïs Bouamara, développeur front junior formé à l'ISTP Em-Lyon (promo LaToile) et à l'AFPA Saint-Etienne.",
            "roles": [
                "DEVELOPPEUR FRONT JR",
                "ÉTUDIANT À L'ISTP SAINT-ÉTIENNE"
            ],

            "contact.phone": "Téléphone :",
            "contact.email": "E-Mail :",
            "contact.address": "Adresse :",

            "side.progLang": "Langages de programmation",
            "side.webDev": "Développement web",
            "side.software": "Logiciels utilisés",
            "side.languages": "Langues",

            "lang.fr": "Français : langue maternelle",
            "lang.en": "Anglais : anglais technique",
            "lang.es": "Espagnol : niveau intermédiaire",

            "section.formations": "Formations",
            "edu.1.title": "Formation sur le thème du numérique",
            "edu.1.date": "Début 2025",
            "edu.2.title": "Formation EM-LYON Promo LaToile",

            "section.pro": "Formations professionnelles",
            "pro.1.title": "Développement de sites internet",
            "pro.1.item1": "Création de structures HTML et CSS avancées",
            "pro.1.item2": "Respect des maquettes pour un rendu professionnel",
            "pro.1.item3": "Détection et correction de code non fonctionnel",
            "pro.2.title": "Développement d'applications",
            "pro.2.item1": "Prise en main de Figma et des outils proposés",
            "pro.2.item2": "Conception d'une maquette mid-fi pour répondre à des problématiques étudiantes",
            "pro.3.title": "Entretiens utilisateurs pour un BETA-TEST",
            "pro.3.item1": "Application des retours utilisateurs pour rendre fonctionnelle la maquette mid-fi en cours de développement",

            "btn.print": "🖨️ Imprimer / PDF",
            "theme.dark": "Mode sombre",
            "theme.light": "Mode clair"
        },

        en: {
            "doc.title": "Raïs Bouamara - Junior Front-End Developer",
            "meta.description": "Resume of Raïs Bouamara, junior front-end developer trained at ISTP Em-Lyon (LaToile cohort) and AFPA Saint-Etienne.",
            "roles": [
                "JUNIOR FRONT-END DEVELOPER",
                "STUDENT AT ISTP SAINT-ETIENNE"
            ],

            "contact.phone": "Phone:",
            "contact.email": "Email:",
            "contact.address": "Address:",

            "side.progLang": "Programming languages",
            "side.webDev": "Web development",
            "side.software": "Software used",
            "side.languages": "Languages",

            "lang.fr": "French: native language",
            "lang.en": "English: technical English",
            "lang.es": "Spanish: intermediate level",

            "section.formations": "Education",
            "edu.1.title": "Digital skills training",
            "edu.1.date": "Early 2025",
            "edu.2.title": "EM-LYON Training, LaToile cohort",

            "section.pro": "Professional training",
            "pro.1.title": "Website development",
            "pro.1.item1": "Building advanced HTML and CSS structures",
            "pro.1.item2": "Following design mockups for professional deliverables",
            "pro.1.item3": "Detecting and fixing non-working code",
            "pro.2.title": "Application development",
            "pro.2.item1": "Getting to grips with Figma and the tools provided",
            "pro.2.item2": "Designing a mid-fidelity mockup to address student pain points",
            "pro.3.title": "User interviews for a BETA-TEST",
            "pro.3.item1": "Applying user feedback to make the in-progress mid-fidelity mockup functional",

            "btn.print": "🖨️ Print / PDF",
            "theme.dark": "Dark mode",
            "theme.light": "Light mode"
        }
    };

    var LANG_KEY = "cv-lang";
    var THEME_KEY = "cv-theme";
    var DEFAULT_LANG = "fr";

    var root = document.documentElement;
    var translatables = document.querySelectorAll("[data-i18n]");
    var metaDescription = document.querySelector('meta[name="description"]');
    var langButton = document.getElementById("langButton");
    var langOptions = document.querySelectorAll(".lang-option");
    var themeButton = document.getElementById("themeButton");
    var themeIcon = themeButton.querySelector(".theme-toggle__icon");
    var themeLabel = themeButton.querySelector(".theme-toggle__label");
    var roleText = document.getElementById("roleText");
    var currentLang = DEFAULT_LANG;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fond animé
    var bgCanvas = document.getElementById("bgCanvas");
    var bgCtx = bgCanvas ? bgCanvas.getContext("2d") : null;
    var bgParticles = [];
    var bgFrame = null;
    var bgColor = "26, 127, 193";
    var LINK_DISTANCE = 130;

    // Retourne la traduction demandée, avec repli sur le français
    function t(key) {
        var dictionary = I18N[currentLang] || I18N[DEFAULT_LANG];
        if (dictionary && dictionary[key]) {
            return dictionary[key];
        }
        return I18N[DEFAULT_LANG][key] || key;
    }

    // Langue sauvegardée, sinon langue du navigateur
    function detectLang() {
        var saved = localStorage.getItem(LANG_KEY);
        if (saved && I18N[saved]) {
            return saved;
        }
        var browser = (navigator.language || DEFAULT_LANG).toLowerCase();
        return browser.indexOf("fr") === 0 ? "fr" : "en";
    }

    /* ---------- Titre qui s'écrit tout seul ---------- */
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var typeTimer = null;

    function typeLoop() {
        var roles = t("roles");
        var current = roles[roleIndex % roles.length];

        if (!deleting) {
            charIndex++;
            roleText.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                deleting = true;
                typeTimer = setTimeout(typeLoop, 2200);
                return;
            }
        } else {
            charIndex--;
            roleText.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }

        typeTimer = setTimeout(typeLoop, deleting ? 35 : 85);
    }

    // Relance l'animation à zéro (appelé au changement de langue)
    function resetTyping() {
        clearTimeout(typeTimer);
        roleIndex = 0;
        charIndex = 0;
        deleting = false;

        if (reduceMotion) {
            roleText.textContent = t("roles")[0];
            return;
        }
        typeLoop();
    }

    /* ---------- Thème clair / sombre ---------- */
    function updateThemeLabel() {
        var dark = root.getAttribute("data-theme") === "dark";
        themeIcon.textContent = dark ? "☀️" : "🌙";
        themeLabel.textContent = t(dark ? "theme.light" : "theme.dark");
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        updateThemeLabel();
        updateBgColor();
    }

    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(localStorage.getItem(THEME_KEY) || (prefersDark ? "dark" : "light"));

    themeButton.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
    });

    /* ---------- Changement de langue ---------- */
    function applyLang(lang) {
        currentLang = I18N[lang] ? lang : DEFAULT_LANG;
        root.setAttribute("lang", currentLang);

        translatables.forEach(function (element) {
            element.textContent = t(element.getAttribute("data-i18n"));
        });

        document.title = t("doc.title");
        if (metaDescription) {
            metaDescription.setAttribute("content", t("meta.description"));
        }

        langOptions.forEach(function (option) {
            option.classList.toggle("is-active", option.getAttribute("data-lang") === currentLang);
        });

        if (langButton) {
            langButton.setAttribute(
                "aria-label",
                currentLang === "fr" ? "Switch to English" : "Passer en français"
            );
        }

        updateThemeLabel();
        resetTyping();
    }

    if (langButton) {
        langButton.addEventListener("click", function () {
            var next = currentLang === "fr" ? "en" : "fr";
            localStorage.setItem(LANG_KEY, next);
            applyLang(next);
        });
    }

    /* ---------- Notation en étoiles ---------- */
    function fillStars(group) {
        var rating = parseInt(group.getAttribute("data-stars"), 10) || 0;
        var stars = group.querySelectorAll("span");

        stars.forEach(function (star, index) {
            setTimeout(function () {
                star.classList.toggle("is-filled", index < rating);
            }, index * 110);
        });
    }

    /* ---------- Apparition progressive des blocs ---------- */
    var sections = document.querySelectorAll(".block, .identity, .footer");
    var starGroups = document.querySelectorAll(".stars[data-stars]");

    // Les blocs deviennent des éléments animés (sans JS, tout reste visible)
    sections.forEach(function (section) {
        section.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }
                entry.target.classList.add("is-visible");

                starGroups.forEach(function (group) {
                    if (entry.target.contains(group)) {
                        fillStars(group);
                    }
                });

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15 });

        document.querySelectorAll(".reveal").forEach(function (element) {
            observer.observe(element);
        });
    } else {
        // Repli si IntersectionObserver n'est pas supporté
        document.querySelectorAll(".reveal").forEach(function (element) {
            element.classList.add("is-visible");
        });
        starGroups.forEach(fillStars);
    }

    /* ---------- Barre de progression de lecture + bouton haut ---------- */
    var progressBar = document.getElementById("progressBar");
    var topButton = document.getElementById("topButton");
    var ticking = false;

    function onScroll() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = height > 0 ? (scrollTop / height) * 100 : 0;

        progressBar.style.width = ratio + "%";
        topButton.classList.toggle("is-visible", scrollTop > 400);
        ticking = false;
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    topButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

    /* ---------- Impression / export PDF ---------- */
    var printButton = document.getElementById("printButton");
    if (printButton) {
        printButton.addEventListener("click", function () {
            window.print();
        });
    }

    /* ---------- Année dynamique ---------- */
    var year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    /* ---------- Fond animé : réseau de particules ---------- */
    function updateBgColor() {
        bgColor = root.getAttribute("data-theme") === "dark" ? "111, 227, 200" : "26, 127, 193";
    }

    function resizeCanvas() {
        var ratio = Math.min(window.devicePixelRatio || 1, 2);
        bgCanvas.width = window.innerWidth * ratio;
        bgCanvas.height = window.innerHeight * ratio;
        bgCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function seedParticles() {
        var count = window.innerWidth < 760 ? 20 : 44;
        bgParticles = [];

        for (var i = 0; i < count; i++) {
            bgParticles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.26,
                vy: (Math.random() - 0.5) * 0.26,
                r: Math.random() * 1.6 + 1
            });
        }
    }

    function drawParticles() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        bgCtx.clearRect(0, 0, width, height);

        // Déplacement, avec sortie/entrée par les bords opposés
        bgParticles.forEach(function (dot) {
            dot.x += dot.vx;
            dot.y += dot.vy;

            if (dot.x < -20) { dot.x = width + 20; }
            if (dot.x > width + 20) { dot.x = -20; }
            if (dot.y < -20) { dot.y = height + 20; }
            if (dot.y > height + 20) { dot.y = -20; }
        });

        // Liaisons entre particules proches
        for (var i = 0; i < bgParticles.length; i++) {
            for (var j = i + 1; j < bgParticles.length; j++) {
                var dx = bgParticles[i].x - bgParticles[j].x;
                var dy = bgParticles[i].y - bgParticles[j].y;
                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < LINK_DISTANCE) {
                    bgCtx.strokeStyle = "rgba(" + bgColor + ", " + (0.18 * (1 - distance / LINK_DISTANCE)).toFixed(3) + ")";
                    bgCtx.lineWidth = 1;
                    bgCtx.beginPath();
                    bgCtx.moveTo(bgParticles[i].x, bgParticles[i].y);
                    bgCtx.lineTo(bgParticles[j].x, bgParticles[j].y);
                    bgCtx.stroke();
                }
            }
        }

        bgCtx.fillStyle = "rgba(" + bgColor + ", 0.45)";
        bgParticles.forEach(function (dot) {
            bgCtx.beginPath();
            bgCtx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
            bgCtx.fill();
        });

        bgFrame = window.requestAnimationFrame(drawParticles);
    }

    function startBackground() {
        if (!bgCtx || reduceMotion) {
            return;
        }
        resizeCanvas();
        seedParticles();
        bgFrame = window.requestAnimationFrame(drawParticles);
    }

    function stopBackground() {
        if (bgFrame) {
            window.cancelAnimationFrame(bgFrame);
            bgFrame = null;
        }
    }

    window.addEventListener("resize", function () {
        if (!bgCtx || reduceMotion) {
            return;
        }
        resizeCanvas();
        seedParticles();
    });

    // Met l'animation en pause quand l'onglet n'est plus visible
    document.addEventListener("visibilitychange", function () {
        if (!bgCtx || reduceMotion) {
            return;
        }
        if (document.hidden) {
            stopBackground();
        } else if (!bgFrame) {
            bgFrame = window.requestAnimationFrame(drawParticles);
        }
    });

    /* ---------- Démarrage ---------- */
    applyLang(detectLang());
    updateBgColor();
    startBackground();
    onScroll();
})();
