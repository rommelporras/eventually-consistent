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

    function pagination(isInfiniteScroll) {
        if (!isInfiniteScroll) return;
        // Placeholder for future infinite scroll support
    }

    function init() {
        initCarousel();
        pagination(false);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
