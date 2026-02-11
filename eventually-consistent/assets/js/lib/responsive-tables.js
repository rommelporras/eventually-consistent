/**
 * Responsive Tables - Wraps tables in scrollable containers on mobile
 */
(function () {
    'use strict';

    function wrapTables() {
        const tables = document.querySelectorAll('.gh-content table');
        if (!tables.length) return;

        tables.forEach((table) => {
            if (table.closest('.ec-table-outer')) return;

            const outer = document.createElement('div');
            outer.className = 'ec-table-outer';
            const wrapper = document.createElement('div');
            wrapper.className = 'ec-table-wrap';
            table.parentNode.insertBefore(outer, table);
            outer.appendChild(wrapper);
            wrapper.appendChild(table);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wrapTables);
    } else {
        wrapTables();
    }
})();
