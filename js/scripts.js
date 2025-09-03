/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
//

window.addEventListener('DOMContentLoaded', event => {

    // --- Code navbar du template ---
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }
    };
    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // --- Carousel robuste avec queue et détection transitionend ---
    const teamMembers = [
        { name: "Pac-Man", role: "GAME" },
        { name: "PorteFolio", role: "Website" },
        { name: "Emma Rodriguez", role: "Lead Developer" },
        { name: "Julia Gimmel", role: "UX Designer" },
        { name: "Lisa Anderson", role: "Marketing Manager" },
        { name: "James Wilson", role: "Product Manager" }
    ];

    const teamMembers2 = [
            { name: "GIT", role: "Zertifikat" },
            { name: "Bootstrap 5", role: "Zertifikat" },
            { name: "Angular", role: "Zertifikat" },
            { name: "Node.js", role: "Zertifikat" },
            { name: "Typescript", role: "Zertifikat" }

        ];

    const cards = Array.from(document.querySelectorAll(" .card"));
    const dots = Array.from(document.querySelectorAll(" .dot"));
    const memberName = document.querySelector(" .member-name");
    const memberRole = document.querySelector(" .member-role");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(" .nav-arrow.right");

    let currentIndex = 0;
    let isAnimating = false;
    let pendingIndex = null;

    // normaliser l’index dans le carousel
    function normalizeIndex(i) {
        const n = cards.length;
        return ((i % n) + n) % n;
    }

    function updateCarousel(newIndex) {
        if (isAnimating) {
            pendingIndex = newIndex;
            return;
        }
        isAnimating = true;

        const n = cards.length;
        currentIndex = normalizeIndex(newIndex);

        const half = Math.floor(n / 2);
        cards.forEach((card, i) => {
            let diff = i - currentIndex;
            diff = ((diff + n + half) % n) - half;

            card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

            if (diff === 0) card.classList.add("center");
            else if (diff === 1) card.classList.add("right-1");
            else if (diff === 2) card.classList.add("right-2");
            else if (diff === -1) card.classList.add("left-1");
            else if (diff === -2) card.classList.add("left-2");
            else card.classList.add("hidden");
        });

        // points
        dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));

        // texte avec fondu
        if (memberName && memberRole) {
            memberName.style.opacity = "0";
            memberRole.style.opacity = "0";
            setTimeout(() => {
                memberName.textContent = teamMembers[currentIndex].name;
                memberRole.textContent = teamMembers[currentIndex].role;
                memberName.style.opacity = "1";
                memberRole.style.opacity = "1";
            }, 250);
            setTimeout(() => {
                                    memberName.textContent = teamMembers2[currentIndex].name;
                                    memberRole.textContent = teamMembers2[currentIndex].role;
                                    memberName.style.opacity = "1";
                                    memberRole.style.opacity = "1";
                                }, 250);
        }

//        if (memberName && memberRole) {
//                    memberName.style.opacity = "0";
//                    memberRole.style.opacity = "0";
//                    setTimeout(() => {
//                        memberName.textContent = teamMembers2[currentIndex].name;
//                        memberRole.textContent = teamMembers2[currentIndex].role;
//                        memberName.style.opacity = "1";
//                        memberRole.style.opacity = "1";
//                    }, 250);
//                }

        // transitionend sur carte centrale
        const centerCard = cards[currentIndex];
        if (!centerCard) {
            isAnimating = false;
            if (pendingIndex !== null) { const next = pendingIndex; pendingIndex = null; updateCarousel(next); }
            return;
        }

        const cs = window.getComputedStyle(centerCard);
        let td = cs.transitionDuration.split(',')[0].trim();
        let durationMs = td.endsWith('ms') ? parseFloat(td) :
                         td.endsWith('s')  ? parseFloat(td) * 1000 : 0;

        let handled = false;
        const onTransitionEnd = (e) => {
            if (e.target !== centerCard) return;
            if (e.propertyName && e.propertyName !== 'transform') return;
            if (handled) return;
            handled = true;
            centerCard.removeEventListener('transitionend', onTransitionEnd);
            isAnimating = false;
            if (pendingIndex !== null) {
                const next = pendingIndex;
                pendingIndex = null;
                requestAnimationFrame(() => updateCarousel(next));
            }
        };

        if (durationMs > 0) {
            centerCard.addEventListener('transitionend', onTransitionEnd);
            setTimeout(() => {
                if (!handled) {
                    handled = true;
                    centerCard.removeEventListener('transitionend', onTransitionEnd);
                    isAnimating = false;
                    if (pendingIndex !== null) {
                        const next = pendingIndex;
                        pendingIndex = null;
                        requestAnimationFrame(() => updateCarousel(next));
                    }
                }
            }, durationMs + 80);
        } else {
            isAnimating = false;
            if (pendingIndex !== null) {
                const next = pendingIndex;
                pendingIndex = null;
                requestAnimationFrame(() => updateCarousel(next));
            }
        }
    }

    // --- Listeners ---

    // flèches clic
    if (leftArrow) leftArrow.addEventListener("click", () => updateCarousel(currentIndex - 1));
    if (rightArrow) rightArrow.addEventListener("click", () => updateCarousel(currentIndex + 1));

    // points et cartes clic
    dots.forEach((dot, i) => dot.addEventListener("click", () => updateCarousel(i)));
    cards.forEach((card, i) => card.addEventListener("click", () => updateCarousel(i)));

    // clavier
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") updateCarousel(currentIndex - 1);
        else if (e.key === "ArrowRight") updateCarousel(currentIndex + 1);
    });

    // swipe tactile
    let touchStartX = 0, touchEndX = 0;
    document.addEventListener("touchstart", (e) => touchStartX = e.changedTouches[0].screenX);
    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) updateCarousel(currentIndex + 1);
            else updateCarousel(currentIndex - 1);
        }
    });

//    // molette souris
//    document.addEventListener("wheel", (e) => {
//        if (isAnimating) return;
//        // empêcher le scroll de la page
//        e.preventDefault();
//        if (e.deltaY < 0) updateCarousel(currentIndex - 1);
//        else if (e.deltaY > 0) updateCarousel(currentIndex + 1);
//    },{passive:false});

    // initialisation
    updateCarousel(0);

    // --- Effet d'écriture en boucle ---
        const element = document.getElementById("typewriter");

        if (element) {
            const texts = [
                "Kingsley Nguena",
                "Student in Informatik an der THM",
                "Softwareentwickler",
                "Technik-Enthusiast"
            ];

            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let speed = 100;

            function typeEffect() {
                const currentText = texts[textIndex];
                if (isDeleting) {
                    element.textContent = currentText.substring(0, charIndex--);
                    speed = 60;
                    if (charIndex < 0) {
                        isDeleting = false;
                        textIndex = (textIndex + 1) % texts.length;
                        speed = 500;
                    }
                } else {
                    element.textContent = currentText.substring(0, charIndex++);
                    speed = 100;
                    if (charIndex > currentText.length) {
                        isDeleting = true;
                        speed = 1500;
                    }
                }
                setTimeout(typeEffect, speed);
            }

            typeEffect();
        }


    const btn = document.getElementById('toggleFrame');
    const iframe = document.getElementById('background-probe');
        if (btn && iframe) { // on vérifie que les éléments existent
             btn.addEventListener('click', () => {
                 if (iframe.classList.contains('active')) {
                     iframe.classList.remove('active');
                     btn.textContent = 'Interagir arrière-plan';
                 } else {
                      iframe.classList.add('active');
                      btn.textContent = 'Retour accueil';
                 }
             });
        }

    // --- Animation des skills au scroll ---
   // --- Animation des skills avec IntersectionObserver (version Bootstrap .progress-bar) ---
   const skillsSection = document.getElementById('skills');
   if (skillsSection) {
       const skills = document.querySelectorAll('.progress-bar');

       if (skills.length > 0) {
           const observer = new IntersectionObserver((entries, obs) => {
               entries.forEach(entry => {
                   if (entry.isIntersecting) {
                       skills.forEach(skill => {
                           const percent = skill.dataset.percent || 0;
                           skill.style.width = percent + "%"; // animation CSS
                           skill.setAttribute("aria-valuenow", percent);
                       });

                       obs.unobserve(entry.target); // ne s’anime qu’une fois
                   }
               });
           }, { threshold: 0.3 });

           observer.observe(skillsSection);
       }
   }

  // --- Overlay Menu ---
      const menuToggle = document.getElementById("menuToggle");
      const overlayMenu = document.getElementById("overlayMenu");
      const closeMenu = document.getElementById("closeMenu");

      if (menuToggle && overlayMenu && closeMenu) {
          menuToggle.addEventListener("click", function() {
              overlayMenu.style.display = "flex";
          });

          closeMenu.addEventListener("click", function() {
              overlayMenu.style.display = "none";
          });
      }


});
