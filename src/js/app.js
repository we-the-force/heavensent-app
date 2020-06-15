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
    name: 'HeavenSent', // App name
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
                console.log("Error getting value [getLocalValue()]");
                console.log(glvError);
                result = null;
            })
            return result;
        },
        async setLocalValueToKey(value, key) {
            // console.log("Setting local value [setLocalValueToKey]");
            // console.log("Value");
            // console.log(value);
            // console.log("Key");
            // console.log(key);
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
                    await app.methods.loadContacts();
                    await app.methods.loadCurrentMembership();
                    // console.log("Update User Result:" + result + " [updateCurrentUser()]");
                }).catch(async function (error){
                    console.log("Error updating current user!!! [updateCurrentUser()]");
                    console.log(error);
                    await app.methods.clearCurrentUser();
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
            console.log("! ! ! ! ! ! ! ! ! Clearing User Data ! ! ! ! ! ! ! ! ! !")
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
            var currentUser = await this.methods.getLocalValue('loggedUser');
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
                // console.log("Requesting JSON");
                // console.log(`${app.data.server}/contacts/?owner=${currentUser.id}&isAdmin=true`);
                await this.request.promise.json(`${app.data.server}/contacts/?owner=${currentUser.id}&isAdmin=true`).then(async function(res){
                    // console.log("user has something? [userHasAdmin()]");
                    // console.log(res.data);
                    let hasAdmins = (res.data.length > 0);
                    // console.log(hasAdmins);
                    if (hasAdmins)
                    {
                        // console.log(`user has at least 1 admin (${res.data.length}) [userHasAdmin()]`);
                        result = true;
                    }
                    else
                    {
                        // console.log("Had no admins [userHasAdmin()]")
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
        async userHasValidMembership()
        {
            var currentUser = await this.methods.getLocalValue('loggedUser');
            // console.log("user has valid membership? [userHasValidMembership()]");
            var result = false;
            
            if (currentUser.currentMembership != null)
            {
                // console.log("current membership wasn't null [userHasValidMembership()]");
                // console.log(currentUser.currentMembership);
                if (currentUser.currentMembership.isActive)
                {
                    console.log("current user's membership is active! [userHasValidMembership()]");
                    result = true;
                }
                else
                {
                    console.log("current user's membership was inactive unu [userHasValidMembership()]");
                    result = false;
                }
            }
            else
            {
                console.log("current membership is null!!! [userHasValidMembership()]");
                result = false;
            }
            
            return result;
        },
        async loadContacts()
        {
            var app=this;
            var currentUser = await app.methods.getLocalValue('loggedUser');
            var contacts = [];
            var result = false;
            if (currentUser != null)
            {
                this.request.promise.json(`${app.data.server}/contacts/?owner=${currentUser.id}`).then(async function(res){
                    // console.log("user has something? [loadContacts()]");result = await app.methods.setLocalValueToKey(res.data, 'loggedUserContacts');
                    // console.log(res.data);
                    result = await app.methods.setLocalValueToKey(res.data, 'loggedUserContacts');
                    // return true;
                })
            }
            return result;
        },
        async clearContacts()
        {
            await this.methods.setLocalValueToKey([], 'loggedUserContacts');
        },
        async loadCurrentMembership()
        {
            var app=this;
            var currentUser = await app.methods.getLocalValue('loggedUser');
            var membership = null;
            var result = false;

            if (currentUser != null)
            {
                if (await app.methods.userHasValidMembership())
                {
                    // result = await app.methods.setLocalValueToKey(res.data, 'loggedUserMembership');
                }
                else
                {
                    console.log("User had no valid membership [loadCurrentMembership()]");
                }
            }

            return result;
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



