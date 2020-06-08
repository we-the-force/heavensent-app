import $$ from 'dom7';
import localforage from "localforage";
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
        // server: 'http://167.172.156.126:1337'
        server: 'http://localhost:1337'
    },

    methods: {
        //Los datos a cambiar van a ser todos los del usuario.
        async getLocalValue(key) {
            let result = -1;
            await localforage.getItem(key).then(function (lsValue) {
                result = lsValue;
            }).catch(function (glvError) {
                result = -1;
            })
            return result;
        },
        async setLocalValueToKey(value, key) {
            console.log(`SetLocalValue\r\n Key: ${key}, Value: ${value}`);
            let result = false;
            await localforage.setItem(key, value).then(function (value) {
                result = true;
            }).catch(function (err) {
                console.log(err);
                result = false;
            })
            return result;
        },
        helloWorld() {
            this.$f7.dialog.alert("Hello World!");
        },
        updateUsername(e) {
            this.username = e.target.value;
            this.$update();
        },
        updatePassword(e) {
            this.password = e.target.value;
            this.$update();
        },
        alertLoginData() {
            this.$f7.dialog.alert("Username: " + this.username + "<br>Password: " + this.password, () => {
                this.$f7.loginScreen.close();
            });
        },
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
//Aqui metes algo pa redirigirte
$$(document).on('page:init', function (e) {
    $$('.page-content').off('scroll');
    $$('.page-content').scroll(function () {
        if ($$('.page-current .page-content').scrollTop() > 30) {
            $$(this).prev().addClass('bg-white');
        } else {
            $$(this).prev().removeClass('bg-white');
        }
    });
});



