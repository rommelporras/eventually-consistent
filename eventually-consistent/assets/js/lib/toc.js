/**
 * Table of Contents - Auto-generated from H2/H3 headings
 * Desktop: sticky sidebar | Mobile: collapsible top
 */
(function () {
    'use strict';

    if (!('IntersectionObserver' in window)) return;

    function buildTOC() {
        const content = document.querySelector('.single-content.gh-content');
        if (!content) return;

        const headings = content.querySelectorAll('h2, h3');
        if (headings.length < 2) {
            const tocSidebar = document.querySelector('.ec-toc-sidebar');
            const tocMobile = document.querySelector('.ec-toc-mobile');
            if (tocSidebar) tocSidebar.style.display = 'none';
            if (tocMobile) tocMobile.style.display = 'none';
            return;
        }

        let tocHTML = '<ul class="ec-toc-list">';

        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }

            const level = heading.tagName === 'H3' ? ' ec-toc-item-h3' : '';
            tocHTML += `<li class="ec-toc-item${level}">`;
            tocHTML += `<a href="#${heading.id}" class="ec-toc-link" data-target="${heading.id}">`;
            tocHTML += heading.textContent;
            tocHTML += '</a></li>';
        });

        tocHTML += '</ul>';

        // Inject into both mobile and desktop TOC navs
        document.querySelectorAll('.ec-toc-nav').forEach((nav) => {
            nav.innerHTML = tocHTML;
        });

        // Scroll spy: highlight active heading
        const tocLinks = document.querySelectorAll('.ec-toc-sidebar .ec-toc-link');
        if (tocLinks.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    tocLinks.forEach((link) => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.ec-toc-sidebar .ec-toc-link[data-target="${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            rootMargin: '-80px 0px -60% 0px',
            threshold: 0
        });

        headings.forEach((heading) => observer.observe(heading));

        // Mobile toggle
        const toggleBtn = document.querySelector('.ec-toc-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                const nav = this.nextElementSibling;
                nav.classList.toggle('open');
                const icon = this.querySelector('.ec-toc-toggle-icon');
                icon.textContent = expanded ? '\u25B6' : '\u25BC';
            });
        }

        // Smooth scroll for TOC links
        document.querySelectorAll('.ec-toc-link').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(link.getAttribute('data-target'));
                if (target) {
                    const offset = 90;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
                // Close mobile TOC after click
                const mobileNav = document.querySelector('.ec-toc-mobile .ec-toc-nav');
                if (mobileNav && mobileNav.classList.contains('open')) {
                    mobileNav.classList.remove('open');
                    const btn = document.querySelector('.ec-toc-toggle');
                    if (btn) {
                        btn.setAttribute('aria-expanded', 'false');
                        btn.querySelector('.ec-toc-toggle-icon').textContent = '\u25B6';
                    }
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildTOC);
    } else {
        buildTOC();
    }
})();
