// ==UserScript==
// @name         Add Saved Items to Cart
// @namespace    https://gist.github.com/beporter/ce76204bcba35d9edb66b395bb5e9305
// @version      0.5
// @description  Repeatedly refresh a given "saved items" page (Amazon, Walmart, BestBuy), look for specific "Add to Cart" buttons, click them if present, and make a lot of noise on success.
// @author       https://github.com/beporter
// @match        https://www.proshop.no/Grafikkort/ASUS-GeForce-RTX-3090-TUF-24GB-GDDR6X-RAM-Grafikkort/2876764
// @match        https://www.proshop.no/Grafikkort/ASUS-GeForce-RTX-3080-Ti-TUF-12GB-GDDR6X-RAM-Grafikkort/2955706
// @match        https://www.proshop.no/Grafikkort/ASUS-GeForce-RTX-3080-TUF-V2-LHR-10GB-GDDR6X-RAM-Grafikkort/2958611
// @match        https://www.proshop.no/Grafikkort/ASUS-GeForce-RTX-3060-TUF-OC-V2-LHR-12GB-GDDR6-RAM-Grafikkort/2958572
// @grant        none
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.3/howler.min.js#sha256-/Q4ZPy6sMbk627wHxuaWSIXS1y7D2KnMhsm/+od7ptE=
// @downloadURL  https://gist.githubusercontent.com/beporter/ce76204bcba35d9edb66b395bb5e9305/raw/add_to_cart.user.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = [
        {
            site: 'Proshop',
            urls: ['https://www.proshop.no/Grafikkort/ASUS-GeForce-RTX-3080-TUF-V2-LHR-10GB-GDDR6X-RAM-Grafikkort/2958611',
                   'https://www.proshop.no/Grafikkort/ASUS-GeForce-RTX-3080-Ti-TUF-12GB-GDDR6X-RAM-Grafikkort/2955706',
                   'https://www.proshop.no/Grafikkort/ASUS-GeForce-RTX-3090-TUF-24GB-GDDR6X-RAM-Grafikkort/2876764',
                   'https://www.proshop.no/Grafikkort/ASUS-GeForce-RTX-3060-TUF-OC-V2-LHR-12GB-GDDR6-RAM-Grafikkort/2958572'],
            selector: 'button.site-btn-addToBasket-lg',
            loadWait: 0.001, // Time to wait before scanning for the button
            cooldown: 0.001, // Time to wait before refreshing after failing to find button. Set to 0 to disable the refresh.
            active: true,
        }
    ];

    var readySound = new window.Howl({
      src: ['//freesound.org/data/previews/187/187404_635158-lq.mp3'],
      autoplay: false,
      loop: true,
      volume: 1.0,
    });

    // Scan the page for the provided selector and "click" them if present.
    function triggerClicks(sel) {
        var anyClicked = false;
        const buttons = document.querySelectorAll(sel.selector);

        // No available "Add to Cart" buttons. Cool down and refresh.
        if (!buttons.length) {
            console.log(`${sel.site}: No active "Add to Cart" buttons.`);
            return anyClicked;
        }

        buttons.forEach((b) => {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('click', true, true);
            b.dispatchEvent(clickEvent);
            console.log(`${sel.site}: Clicked "Add to Cart" button.`);
            anyClicked = true;
        });

        return anyClicked;
    }

    function refreshInSecs(secs) {
        console.log(`Scheduling page refresh in ${secs} secs.`);
        window.setTimeout(() => {
            window.location.reload(true);
        }, secs * 1000);
    }

    function waitToClick(sel, callback) {
        console.log(`Scheduling clicks for ${sel.site}.`);
        window.setTimeout(() => {
            callback(sel);
        }, sel.loadWait * 1000);
    }

    function locationStartsWithAnyOfUrls(urls) {
        return urls.reduce((acc, url) => {
            return acc || window.location.href.startsWith(url);
        }, false);
    }

    // function main()
    SELECTORS.forEach((sel) => {
        if (sel.active && locationStartsWithAnyOfUrls(sel.urls)) {
            waitToClick(sel, (sel) => {
                if (triggerClicks(sel)) {
                    readySound.play();
                } else if (sel.cooldown) {
                    refreshInSecs(sel.cooldown);
                }
            });
        }
    });

})();