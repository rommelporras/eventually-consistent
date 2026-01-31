/**
 * Code Copy Button - Adds terminal-style header with copy functionality to code blocks
 */
(function () {
    'use strict';

    var COPY_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
    var COPIED_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';

    function initCodeCopy() {
        var codeBlocks = document.querySelectorAll('.gh-content pre');
        if (!codeBlocks.length) return;

        codeBlocks.forEach(function (pre) {
            var wrapper = document.createElement('div');
            wrapper.className = 'ec-code-block';
            pre.parentNode.insertBefore(wrapper, pre);

            // Build terminal header bar
            var header = document.createElement('div');
            header.className = 'ec-code-header';

            // Three colored dots
            var dots = document.createElement('span');
            dots.className = 'ec-code-dots';
            dots.innerHTML = '<span></span><span></span><span></span>';
            header.appendChild(dots);

            // Detect language from class and add label
            var code = pre.querySelector('code');
            var langLabel = document.createElement('span');
            langLabel.className = 'ec-code-lang';
            if (code && code.className) {
                var match = code.className.match(/language-(\w+)/);
                if (match) {
                    langLabel.textContent = match[1];
                }
            }
            header.appendChild(langLabel);

            // Copy button
            var btn = document.createElement('button');
            btn.className = 'ec-code-copy';
            btn.innerHTML = COPY_SVG;
            btn.setAttribute('aria-label', 'Copy code');
            header.appendChild(btn);

            // Assemble: header first, then pre
            wrapper.appendChild(header);
            wrapper.appendChild(pre);

            btn.addEventListener('click', function () {
                var text = pre.textContent || pre.innerText;
                navigator.clipboard.writeText(text).then(function () {
                    btn.innerHTML = COPIED_SVG;
                    btn.classList.add('copied');
                    setTimeout(function () {
                        btn.innerHTML = COPY_SVG;
                        btn.classList.remove('copied');
                    }, 2000);
                }).catch(function () {
                    btn.textContent = 'Failed';
                    setTimeout(function () {
                        btn.innerHTML = COPY_SVG;
                    }, 2000);
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCodeCopy);
    } else {
        initCodeCopy();
    }
})();
