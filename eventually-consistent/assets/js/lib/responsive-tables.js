/**
 * Responsive Tables - Wraps tables in scrollable containers on mobile
 */
(function () {
    'use strict';

    function wrapTables() {
        const tables = document.querySelectorAll('.gh-content table');
        if (!tables.length) return;

        tables.forEach((table) => {
            if (table.parentElement.classList.contains('ec-table-wrap')) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'ec-table-wrap';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wrapTables);
    } else {
        wrapTables();
    }
})();
