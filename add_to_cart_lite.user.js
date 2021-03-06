// ==UserScript==
// @name         Add Saved Items to Cart Lite
// @namespace    https://gist.github.com/beporter/ce76204bcba35d9edb66b395bb5e9305
// @version      0.5
// @author       https://github.com/jeriks31
// @match        https://www.proshop.no/Grafikkort/ASUS-GeForce-RTX-3090-TUF-24GB-GDDR6X-RAM-Grafikkort/2876764
// @grant        none
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.3/howler.min.js#sha256-/Q4ZPy6sMbk627wHxuaWSIXS1y7D2KnMhsm/+od7ptE=
// ==/UserScript==


(function() {
    'use strict';

    const btnSelector = 'button.site-btn-addToBasket-lg';

    // Scan the page for the provided selector and "click" them if present.
    function triggerClicks(sel) {
        const button = document.querySelector(sel);
        if (!button) {
            return false;
        }
        button.click();
        return true;
    }

    // function main()
    if (triggerClicks(btnSelector)) {
        console.log('Found and clicked button');
    } else {
        window.location.reload(true);
    }

})();