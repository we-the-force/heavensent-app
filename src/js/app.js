import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.styl';
// Import Cordova APIs
import cordovaApp from './cordova-app.js';
// Import Routes
import routes from './routes.js';

// Import main app component
import App from '../app.f7.html';

var app = new Framework7({
    root: '#app', // App root element
    component: App, // App main component
    id: 'io.wetheforce.heavensent', // App bundle ID
    name: 'Heaven Sent', // App name
    theme: 'auto', // Automatic theme detection

    data: {
        server: 'http://167.172.156.126:1337'
        // server: 'http://localhost:1337'
    },

    // App routes
    routes: routes,

    // Register service worker
    serviceWorker: Framework7.device.cordova ? {} : {
        path: '/service-worker.js',
    },
    // Input settings
    input: {
        scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
        scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
    },
    view: {
        pushState: true
    },
    // Cordova Statusbar settings
    statusbar: {
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
    },
    on: {
        init: function () {
            var f7 = this;
            if (f7.device.cordova) {
                // Init cordova APIs (see cordova-app.js)
                cordovaApp.init(f7);
            }

        },
    },
});

$$(document).on('page:init', function (e) {
    $$('.page-content').off('scroll');
    $$('.page-content').scroll(function () {
        console.log($$('.page-current .page-content').scrollTop());
        if ($$('.page-current .page-content').scrollTop() > 30) {
            $$(this).prev().addClass('bg-white');
        } else {
            $$(this).prev().removeClass('bg-white');
        }
    });
});



