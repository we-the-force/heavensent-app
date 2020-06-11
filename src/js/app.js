import $$ from 'dom7';
import localforage from "localforage";
import Framework7 from 'framework7/framework7.esm.bundle.js';

/*
    Hacer que si un usuario no tiene admin, que lo redirija a la ventana del admin despues de avisarle que no tiene admin y asi
*/


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
            let result = null;
            await localforage.getItem(key).then(function (lsValue) {
                result = lsValue;
            }).catch(function (glvError) {
                result = null;
            })
            return result;
        },
        async setLocalValueToKey(value, key) {
            let result = false;
            await localforage.setItem(key, value).then(function (value) {
                result = true;
            }).catch(function (err) {
                console.log("Error [setLocalValueToKey()]")
                console.log(err);
                result = false;
            })
            return result;
        },
        async updateCurrentUser()
        {
            var app = this;
            var currentLocalUser = await app.methods.getLocalValue('loggedUser');
            let result = false;
            if (currentLocalUser != null)
            {
                await this.request.promise.get(`${app.data.server}/users/${currentLocalUser.id}`).then(async function(getResult){
                    var user = JSON.parse(getResult.data);
                    result = await app.methods.setLocalValueToKey(user, 'loggedUser');
                    console.log("Update User Result:" + result + " [updateCurrentUser()]");
                }).catch(function (error){
                    console.log("Error updating current user!!! [updateCurrentUser()]");
                    console.log(error);
                    result = false;
                });
            }
            else
            {
                console.log("Couldn't update current user; user was null [updateCurrentUser()]")
            }
            return result;
        },
        async clearCurrentUser()
        {
            var app=this;
            let result = await app.methods.setLocalValueToKey(null, 'loggedUser');
            return result;
        },
        async userIsEmpty()
        {
            var currentUser = await this.methods.getLocalValue('loggedUser');
            if (currentUser === null)
            {
                return true;
            }
            return false;
        },
        async userIsValid()
        {
            // console.log("!! Entering UserIsValid() !!")
            var currentUser = await this.methods.getLocalValue('loggedUser');
            // console.log(currentUser);
            if (currentUser != null)
            {
                if (currentUser.confirmed)
                {
                    console.log("User Is Valid [userIsValid()]");
                    return true;
                }
            }
            console.log("User Is Not Valid [userIsValid()]");
            return false;
        },
        async userHasAdmin()
        {
            //Call userIsValid before this always.
            var currentUser = await this.methods.getLocalValue('loggedUser');
            var result = false;
            if (currentUser != null)
            {
                console.log("Requesting JSON");
                console.log(`${app.data.server}/contacts/?owner=${currentUser.id}&isAdmin=true`);
                console.log(currentUser);
                await this.request.promise.json(`${app.data.server}/contacts/?owner=${currentUser.id}&isAdmin=true`).then(async function(res){
                    console.log("user has something? [userHasAdmin()]");
                    console.log(res.data);
                    let hasAdmins = (res.data.length > 0);
                    console.log(hasAdmins);
                    if (hasAdmins)
                    {
                        console.log(`user has at least 1 admin (${res.data.length}) [userHasAdmin()]`);
                        result = true;
                    }
                    else
                    {
                        console.log("Had no admins [userHasAdmin()]")
                        result = false;
                    }
                })
            }
            else
            {
                console.log("Had no loggedUser [userHasAdmin()]");
                result = false;
            }
            return result;
        },
        async loadContacts()
        {
            var currentUser = await this.methods.getLocalValue('loggedUser');
            var contacts = [];
            if (currentUser != null)
            {
                this.request.promise.json(`${app.data.server}/contacts/?owner=${currentUser.id}`).then(async function(res){
                    console.log("user has something? [userHasAdmin()]");
                    console.log(res);
                    return await this.methods.setLocalValueToKey(res, 'loggedUserContacts');
                    // return true;
                })
            }
            return false;
        },
        async clearContacts()
        {
            await this.methods.setLocalValueToKey([], 'loggedUserContacts');
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



