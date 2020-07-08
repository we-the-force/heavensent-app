import $$ from 'dom7';
import localforage from "localforage";
import Template7 from 'template7';
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


Template7.registerHelper('localize', function(value,options) {
    return window.localize(value)
});

var app = new Framework7({
    root: '#app', // App root element
    component: App, // App main component
    id: 'io.wetheforce.heavensent', // App bundle ID
    name: 'HeavenSent', // App name
    theme: 'auto', // Automatic theme detection
    
    data: {
        //server: 'http://192.168.5.169:1337',
        server: 'http://167.172.156.126:1337',
        // server: 'http://localhost:1337',
        locales: {
            es: {
                lenguage: "Español (MX)",
                hello: "Hola",
                bye: "Adios",
                mail: "Correo electrónico",
                pass: "Contraseña",
                sign_up: "Regístrate",
                login: "Iniciar sesión",
                accept: "Aceptar",
                cancel: "Cancelar",
                search: "Buscar",
                create_contact: "Crear contacto",
                //forgot pass
                forgot_pass: "¿Olvidó su contraseña?",
                text_forgot_pass: "Ingrese su dirección de correo electrónico y le enviaremos instrucciones para restablecer su contraseña",
                //recover pass
                recover_pass: "Recuperar contraseña",
                text_mail_send: "Le enviamos un correo electrónico con instrucciones para cambiar su contraseña.",
                back_login: "Regresar",
                //change pass
                change_pass: "Cambiar contraseña",
                create_pass: "Crear una nueva contraseña",
                new_pass: "Nueva contraseña",
                repeat_pass: "Repite la contraseña",
                save_pass: "Guardar contraseña",
                //user agreement
                user_agree: "Acuerdo del Usuario",
                //sign up
                name: "Nombre",
                birthday: "Fecha de nacimiento",
                phone: "Número de teléfono",
                create_acount: "Crear una cuenta",
                //invite admin
                invite_admin: "Invita a un administrador",
                text_invite_admin: "El administrador puede enviar o editar recuerdos por usted.",
                admin_name: "Nombre de administrador",
                admin_mail: "Correo electrónico de administrador",
                admin_relation: "Relación con el administrador",
                admin_edit: "¿El admr. puede editar?",
                invite: "Invitar",
                which_relation: "¿Cuál es su relación con su administrador?",
                which_relation_text: "Define tu relación con el administrador. Podría ser una hija, un hijo, una esposa, un primo, etc. Crearemos un contacto en su cuenta con esta información.",
                //account confirmed
                account_confirmed: "Cuenta confirmada!",
                create_family: "Crear familia",
                //import 
                import_contacts: "Importa tus contactos",
                grant_access: "Autorizar el acceso",

            },
            en: {
                lenguage: "English (US)",
                hello: "Hello",
                bye: "Bye",
                mail: "E-mail",
                pass: "Password",
                sign_up: "Sign up",
                login: "Login",
                accept: "Accept",
                cancel: "Cancel",
                search: "Buscar",
                create_contact: "Create contact",     
                //forgot pass
                forgot_pass: "Forgot password?",
                text_forgot_pass: "Enter your email address and we will send you instructions to reset your password",
                //recover pass
                recover_pass: "Recover password",
                text_mail_send: "We send you an email with instructions to change your password.",
                back_login: "Back to login",
                //change pass
                change_pass: "Change password",
                create_pass: "Create a new password",
                new_pass: "New password",
                repeat_pass: "Repeat password",
                save_pass: "Save password",
                //user agree
                user_agree: "User agreement",
                //sign up
                name: "Name",
                birthday: "Birthday",
                phone: "Phone number",
                create_acount: "Create account",
                //invite admin
                invite_admin: "Invita a un administrador",
                text_invite_admin: "Administrator could send or edit memories for you.",
                admin_name: "Admin name",
                admin_mail: "Admin email",
                admin_relation: "Admin relationship",
                admin_edit: "Admin could edit?",
                invite: "Invite",
                which_relation: "Which is your relationship with your administrator?",
                which_relation_text: "Define your relationship with the administrator. Could be a daughter, son, wife, cousin, etc. We will create a contact in your account with this info.",
                //account confirmed
                account_confirmed: "Account confirmed!",
                create_family: "Create family",
                //import 
                import_contacts: "Import your contacts",
                grant_access: "Grant access",


            }
        }
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
            if (value != null && key === "loggedUser")
            {
                console.log("Setting local value [setLocalValueToKey]");
                console.log("---Value---");
                console.log(value);
                // console.log("Key");
                // console.log(key);
            }
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
            console.log("updating current user");
            var currentLocalUser = await app.methods.getLocalValue('loggedUser');
            console.log(currentLocalUser);
            let result = false;
            if (currentLocalUser != null)
            {
                await this.request.promise.get(`${app.data.server}/users/${currentLocalUser.id}`).then(async function(getResult){
                    var user = JSON.parse(getResult.data);
                    console.log("currentLocalUser wasn't null, setting value to loggedUser");
                    result = await app.methods.setLocalValueToKey(user, 'loggedUser');
                    await app.methods.loadContacts();
                    await app.methods.loadAdminedContacts();
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
            await app.methods.setLocalValueToKey([], 'loggedUserContacts')
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
            if (currentUser != null)
            {
                if (currentUser.currentMembership != null)
                {
                    // console.log("current membership wasn't null [userHasValidMembership()]");
                    // console.log(currentUser.currentMembership);
                    if (currentUser.currentMembership.isActive)
                    {
                        // console.log("current user's membership is active! [userHasValidMembership()]");
                        result = true;
                    }
                    else
                    {
                        // console.log("current user's membership was inactive unu [userHasValidMembership()]");
                        result = false;
                    }
                }
                else
                {
                    // console.log("current membership is null!!! [userHasValidMembership()]");
                    result = false;
                }
            }
            else
            {
                // console.log("current user is null!!! [userHasValidMembership()]");
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
        async loadAdminedContacts()
        {
            var app=this;
            var currentUser = await app.methods.getLocalValue('loggedUser');
            var contacts = [];
            var result = false;
            if (currentUser != null)
            {
                //http://localhost:1337/contacts/?contact=12&isAdmin=true
                this.request.promise.json(`${app.data.server}/contacts/?contact=${currentUser.id}&isAdmin=true`).then(async function(res){
                    result = await app.methods.setLocalValueToKey(res.data, 'loggedUserAdminedContacts');
                    // return true;
                })
            }
            return result;
        },
        async clearAdminedContacts()
        {
            await this.methods.setLocalValueToKey([], 'loggedAdminedUserContacts');
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
    console.log(window.locales);
    
    $$('.page-content').off('scroll');
    $$('.page-content').scroll(function () {
        if ($$('.page-current .page-content').scrollTop() > 30) {
            $$('.navbar').addClass('bg-white');
        } else {
            $$('.navbar').removeClass('bg-white');
        }
    });
});

window.language = (localStorage.getItem('language') || (app.language || 'en_US')).replace (/-/g, "_");

window.localize = function (key) {
    var language = window.language
    language = language.replace(/-/g, "_");
    if (!app.data.locales[language])
        language = language.substring(0, 2);
    if (!app.data.locales[language])
        language = 'en'

    return app.data.locales[language][key] ? app.data.locales[language][key] : key
}
