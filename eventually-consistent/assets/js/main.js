/**
 * Ghost Theme - Main JavaScript (Eventually Consistent)
 */
(function () {
    'use strict';

    function initCarousel() {
        const track = document.querySelector('.featured-feed');
        if (!track) return;

        const prevBtn = track.parentElement.querySelector('.carousel-prev');
        const nextBtn = track.parentElement.querySelector('.carousel-next');
        if (!prevBtn || !nextBtn) return;

        const scrollAmount = () => {
            const item = track.querySelector('article');
            if (!item) return 300;
            return item.offsetWidth + 30; // width + gap
        };

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        });

        const updateButtons = () => {
            const { scrollLeft, scrollWidth, clientWidth } = track;
            prevBtn.disabled = scrollLeft <= 0;
            nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
        };

        track.addEventListener('scroll', updateButtons, { passive: true });
        updateButtons();
    }

    function initLoadMore() {
        const nav = document.querySelector('.load-more[data-next]');
        if (!nav) return;

        const btn = nav.querySelector('.gh-loadmore');
        if (!btn) return;

        const feed = document.querySelector('.post-feed');
        if (!feed) return;

        btn.addEventListener('click', async function () {
            const nextUrl = nav.getAttribute('data-next');
            if (!nextUrl) return;

            btn.classList.add('loading');

            try {
                const res = await fetch(nextUrl);
                const html = await res.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');

                // Append new posts to the feed
                const newPosts = doc.querySelectorAll('.post-feed > article');
                newPosts.forEach(function (post) {
                    feed.appendChild(document.importNode(post, true));
                });

                // Check if there's another page
                const nextNav = doc.querySelector('.load-more[data-next]');
                if (nextNav) {
                    nav.setAttribute('data-next', nextNav.getAttribute('data-next'));
                } else {
                    nav.remove();
                }
            } catch (e) {
                // On error, fall back to navigating directly
                window.location.href = nextUrl;
            } finally {
                btn.classList.remove('loading');
            }
        });
    }

    function init() {
        initCarousel();
        initLoadMore();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
