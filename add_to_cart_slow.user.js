// ==UserScript==
// @name         Add Saved Items to Cart Slow
// @namespace    https://gist.github.com/beporter/ce76204bcba35d9edb66b395bb5e9305
// @version      1.0
// @description  Repeatedly refresh a given page, look for specific "Add to Cart" buttons, click them if present, and make a lot of noise on success.
// @match        https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-geforce-rtx-3080-10-gb-eagle-oc-grafikkort/p-1118415/
// @match        https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-geforce-rtx-3080-eagle-10-gb-grafikkort/p-1141928/
// @match        https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-geforce-rtx-3080-vision-oc-10-gb-grafikkort/p-1121308/
// @match        https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-geforce-rtx-3080-10-gb-gaming-oc-grafikkort/p-1118416/
// @match        https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-aorus-geforce-rtx-3080-master-10-gb-grafikkort/p-1121307/
// @match        https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-geforce-rtx-3090-24-gb-eagle-oc-grafikkort/p-1118417/
// @match        https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/msi-geforce-rtx-3090-24-gb-ventus-3x-oc-grafikkort/p-1118422/
// @match        https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/asus-tuf-gaming-geforce-rtx-3090-24-gb-grafikkort/p-1115922/
// @grant        none
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.3/howler.min.js#sha256-/Q4ZPy6sMbk627wHxuaWSIXS1y7D2KnMhsm/+od7ptE=
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = [
        {
            site: 'Power',
            urls: ['https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-geforce-rtx-3080-10-gb-eagle-oc-grafikkort/p-1118415/',
                   'https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-geforce-rtx-3080-eagle-10-gb-grafikkort/p-1141928/',
                   'https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-geforce-rtx-3080-vision-oc-10-gb-grafikkort/p-1121308/',
                   'https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-geforce-rtx-3080-10-gb-gaming-oc-grafikkort/p-1118416/',
                   'https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-aorus-geforce-rtx-3080-master-10-gb-grafikkort/p-1121307/',
                   'https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/gigabyte-geforce-rtx-3090-24-gb-eagle-oc-grafikkort/p-1118417/',
                   'https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/msi-geforce-rtx-3090-24-gb-ventus-3x-oc-grafikkort/p-1118422/',
                   'https://www.power.no/data-og-tilbehoer/datakomponenter/grafikkort/asus-tuf-gaming-geforce-rtx-3090-24-gb-grafikkort/p-1115922/'],
            selector: 'button.btn.btn-mega.btn-block.btn-cyan.ng-star-inserted',
            loadWait: 1, // Time to wait before scanning for the button
            cooldown: 59, // Time to wait before refreshing after failing to find button. Set to 0 to disable the refresh.
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
