
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. MOBILE MENU
    // =====================================

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuBtn && mobileMenu) {

        menuBtn.setAttribute("aria-expanded", "false");

        menuBtn.addEventListener("click", function () {
            const isOpen = mobileMenu.classList.toggle("active");

            menuBtn.classList.toggle("active", isOpen);
            menuBtn.setAttribute("aria-expanded", isOpen);
        });

        mobileMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                mobileMenu.classList.remove("active");
                menuBtn.classList.remove("active");
                menuBtn.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", function (event) {
            if (
                !menuBtn.contains(event.target) &&
                !mobileMenu.contains(event.target)
            ) {
                mobileMenu.classList.remove("active");
                menuBtn.classList.remove("active");
                menuBtn.setAttribute("aria-expanded", "false");
            }
        });
    }


    // =====================================
    // 2. HEADER SCROLL EFFECT
    // =====================================

    const header = document.getElementById("mainHeader");

    function updateHeader() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    // =====================================
    // 3. SMOOTH SCROLL
    // =====================================

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

    });


    // =====================================
    // 4. SCROLL REVEAL ANIMATION
    // =====================================

    const revealSelectors = [
        ".cg-about",
        ".cg-products-page section",
        ".science-intro",
        ".science-pillar-card",
        ".science-process",
        ".science-quality",
        ".ct-career-intro",
        ".ct-career-value-card",
        ".ct-career-opening",
        ".ct-contact-card",
        ".ct-contact-form",
        ".ct-location-section",
        ".cgen-science",
        ".cgen-careers",
        ".cgen-contact",
        ".cgen-footer-col"
    ];

    const revealElements = document.querySelectorAll(
        revealSelectors.join(",")
    );

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach(function (element) {
            element.classList.add("js-reveal");
            revealObserver.observe(element);
        });

    } else {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }


    // =====================================
    // 5. ANIMATED COUNTERS
    // Add data-count="100" to a number
    // =====================================

    const counters = document.querySelectorAll("[data-count]");

    function animateCounter(element) {

        if (element.dataset.animated === "true") return;

        element.dataset.animated = "true";

        const target = Number(element.dataset.count);

        if (!Number.isFinite(target)) return;

        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {

            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(target * eased);

            element.textContent = currentValue.toLocaleString("en-IN");

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString("en-IN");
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });

            },
            { threshold: 0.5 }
        );

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });

    } else {
        counters.forEach(animateCounter);
    }


    // =====================================
    // 6. HEADER SEARCH
    // =====================================

    document.querySelectorAll(".search-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            const query = window.prompt(
                "Search CELLARTGEN website:"
            );

            if (!query || !query.trim()) return;

            const term = query.trim().toLowerCase();

            const searchableElements = document.querySelectorAll(
                "main h1, main h2, main h3, section h1, " +
                "section h2, section h3, section p, " +
                ".cg-product-card"
            );

            let match = null;

            searchableElements.forEach(function (element) {
                if (
                    !match &&
                    element.textContent.toLowerCase().includes(term)
                ) {
                    match = element;
                }
            });

            if (match) {
                match.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            } else {
                alert("No matching content found on this page.");
            }

        });

    });


    // =====================================
    // 7. FOOTER CURRENT YEAR
    // =====================================

    document.querySelectorAll(".cgen-current-year").forEach(
        function (element) {
            element.textContent = new Date().getFullYear();
        }
    );


    // =====================================
    // 8. CONTACT FORM VALIDATION
    // Does not send emails by itself
    // =====================================

    document.querySelectorAll("form").forEach(function (form) {

        form.addEventListener("submit", function (event) {

            if (!form.checkValidity()) {
                event.preventDefault();
                form.reportValidity();
                return;
            }

            // A real backend or form service is required
            // to deliver submitted enquiries by email.

        });

    });

});





document.addEventListener("DOMContentLoaded", function () {
    // PRODUCT FILTER
    const filterButtons = document.querySelectorAll(".cg-filter-btn");
    const productCards = document.querySelectorAll(".cg-product-card");

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const filter = button.dataset.filter;

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            productCards.forEach(function (card) {
                const category = card.dataset.category;
                const show = filter === "all" || category === filter;

                card.hidden = !show;
            });
        });
    });

    // PRODUCT DETAILS MODAL
    window.openProduct = function (name, category, image, description) {
        let modal = document.getElementById("cgDetailsModal");

        if (!modal) {
            modal = document.createElement("div");
            modal.id = "cgDetailsModal";
            modal.className = "cg-details-modal";

            modal.innerHTML = `
                <div class="cg-details-box" role="dialog"
                     aria-modal="true" aria-labelledby="cgDetailsTitle">
                    <button type="button" class="cg-details-close"
                            aria-label="Close">&times;</button>
                    <img class="cg-details-image" alt="">
                    <span class="cg-details-category"></span>
                    <h2 id="cgDetailsTitle"></h2>
                    <p class="cg-details-description"></p>
                </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector(".cg-details-close")
                .addEventListener("click", closeModal);

            modal.addEventListener("click", function (event) {
                if (event.target === modal) closeModal();
            });

            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") closeModal();
            });
        }

        modal.querySelector(".cg-details-category").textContent =
            category || "Healthcare";

        modal.querySelector("#cgDetailsTitle").textContent = name || "";

        modal.querySelector(".cg-details-description").textContent =
            description || "";

        const img = modal.querySelector(".cg-details-image");

        if (image && /^https?:\/\//i.test(image)) {
            img.src = image;
            img.hidden = false;
        } else {
            img.removeAttribute("src");
            img.hidden = true;
        }

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        modal.querySelector(".cg-details-close").focus();
    };

    function closeModal() {
        const modal = document.getElementById("cgDetailsModal");

        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    }

    // HEADER SEARCH
    document.querySelectorAll(".search-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            const query = prompt("Search CELLARTGEN website:");

            if (!query || !query.trim()) return;

            const term = query.trim().toLowerCase();

            const targets = document.querySelectorAll(
                "main h1, main h2, main h3, section h1, section h2, section h3, section p, .cg-product-card"
            );

            const match = Array.from(targets).find(function (element) {
                return element.textContent.toLowerCase().includes(term);
            });

            if (match) {
                match.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                match.setAttribute("tabindex", "-1");
                match.focus({ preventScroll: true });
            } else {
                alert("No matching content found on this page.");
            }
        });
    });

    // SCROLL REVEAL ANIMATION
    const revealItems = document.querySelectorAll(
        ".cg-about, .cgen-product-card, .science-pillar-card, " +
        ".ct-career-value-card, .ct-contact-card"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach(function (element) {
            element.classList.add("js-reveal");
            observer.observe(element);
        });
    } else {
        revealItems.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }

});


(function () {
  const faqItems = document.querySelectorAll('.cgp-faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('button');
    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('active');
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('button');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const revealTargets = document.querySelectorAll('.cgp-highlight-card, .cgp-why-content, .cgp-why-visual, .cgp-cap-card, .cgp-quality-content, .cgp-quality-board, .cgp-process-step, .cgp-gallery-item, .cgp-faq-intro, .cgp-faq-list, .cgp-cta-wrap');
  revealTargets.forEach(el => el.classList.add('cgp-reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('cgp-reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('cgp-reveal-visible'));
  }
})();



/* CELLARTGEN Patented Ingredients section animations */
(() => {
  const initCgpSection = () => {
    const sections = document.querySelectorAll(".ctpi-section");
    sections.forEach((section) => {
      const items = section.querySelectorAll(".ctpi-reveal");
      if (!("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("ctpi-visible"));
        return;
      }
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ctpi-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });
      items.forEach((item) => observer.observe(item));
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCgpSection, { once: true });
  } else {
    initCgpSection();
  }
})();
