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


Template7.registerHelper('localize', function (value, options) {
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
        server: 'http://api.heavensent.com',
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
                //create/edit contact/guardian
                create_contact: "Crear contacto",
                relation: "Relación",
                create_guardian: "Crear guardián",
                create_tutor: "Crear tutor",
                edit_contact: "Editar contacto",
                save_changes: "Guardar cambios",
                nickname: "Apodo",
                //membership
                membership: "Membresía",
                text_thanks_membership: "Gracias por ser miembro de HeavenSent",
                next_billing_date: "Siguiente Fecha de facturación:",
                billed_with: "Facturado con:",
                change_plan: "Cambiar plan",
                cancel_subs: "Cancelar suscripción",
                select_package: "Seleccionar paquete",
                choose_plan: "Elija un plan adecuado para usted.",
                down_and_up: "Degradar o actualizar a cualquier tipo",
                basic: "Básico",
                standard: "Estándar",
                premium: "Premium",
                per_month: "POR MES",
                text_notes: "Notas de texto",
                pictures: "Imágenes",
                on_demand: "Bajo Demanda",
                desc_select_membership: "Recuerdos / Personas / Años",
                select_plan: "Seleccionar plan",
                add_card_info: "Agregar información",
                name_card: "Nombre en la tarjeta",
                number_card: "Numero de tarjeta",
                credit_card: "Tarjeta de crédito",
                confirm: "Confirmar",
                payment_confirmed: "Pago confirmado",
                go_profile: "Ir al perfil",
                donate: "Donar",
                give_now: "Donar ahora",
                //home
                contacts: "Contactos",
                create: "Crear",
                new_memory: "Nueva Memoria",
                birthday_memory: "Memoria de cumpleaños",
                collage: "Collage",
                especial_memory: "Memoria especial",
                scheduled: "Programado",
                send_later: "Enviar Luego",
                my_memories: "Mis memorias",
                shared_with_me: "Compartido conmigo",
                //left panel
                profile: "Perfil",
                plan: "Plan",
                terms_and_conds: "Términos y condiciones",
                sign_out: "Cerrar sesion",
                edit: "Editar",
                delete: "Eliminar",
                edit_profile: "Editar Perfil",
                create_memory: "Crear Memoria",
                //dashboard memories
                memories: "Memorias",
                sent_by: "Enviado por:",
                see: "Ver",
                no_content: "Sin Contenido",
                content: "Contenido",
                text: "Texto",
                message: "Mensaje",
                create_memories: "Crear memorias",
                //Create Memory
                create_mem_header: "Crear Memoria",
                create_mem_title: "Título",
                create_mem_message: "Mensaje",
                create_mem_upload: "Subir archivos",
                create_mem_space: "Espacio disponible",
                create_mem_out_of: "de",
                create_mem_upload_cover: "Toca aquí para seleccionar el cover para tu memoria",
                create_mem_add_contacts: "Contactos",
                create_mem_location: "Ubicación",
                create_mem_add_location: "Agregar ubicación",
                create_mem_deliver_date: "Fecha de entrega",
                create_mem_set_deliver_date: "Selecciona una fecha de entrega",
                create_mem_on_demand: "Bajo demanda",
                create_mem_on_demand_desc: "El usuario puede accessar el contenido cuantas veces quiera",
                create_mem_create: "Crear memoria",
                create_mem_immediately: "Enviar inmediatamente",
                create_mem_date: "Fecha",
                create_mem_time: "Hora",
                create_mem_repeat: "Repetir",
                create_mem_never: "Nunca",
                create_mem_weekly: "Semanalmente",
                create_mem_monthly: "Mensualmente",
                create_mem_yearly: "Anualmente",
                create_mem_repeat_end: "Termino de repetición",
                create_mem_repeat_footer_immediately: "La memoria se enviará inmediatamente",
                create_mem_repeat_footer_never: "La memoria nunca se repetirá",
                create_mem_repeat_footer_date: "La memoria se repetirá",
                create_mem_repeat_footer_until: "hasta",
                create_mem_accept_date: "Aceptar",
                mem_file_edit: "Editar",
                mem_file_delete: "Borrar",
                //Add contacts
                add_cont_contacts: "Contactos de",
                add_cont_search: "Buscar",
                add_cont_to_mem: "Agregar a la memoria",
                //Add location
                add_loc_header: "Agregar ubicación",
                add_loc_address: "Dirección",
                add_loc_save: "Guardar ubicación",
                //Edit Memory
                edit_mem_header: "Editar Memoria",
                edit_mem_title: "Título",
                edit_mem_message: "Mensaje",
                edit_mem_upload: "Archivos subidos",
                edit_mem_space: "Espacio disponible",
                edit_mem_out_of: "de",
                edit_mem_upload_cover: "Toca aquí para seleccionar el cover para tu memoria",
                edit_mem_add_contacts: "Contactos",
                edit_mem_location: "Ubicación",
                edit_mem_add_location: "Agregar ubicación",
                edit_mem_deliver_date: "Fecha de entrega",
                edit_mem_set_deliver_date: "Selecciona una fecha de entrega",
                edit_mem_on_demand: "Bajo demanda",
                edit_mem_on_demand_desc: "El usuario puede accessar el contenido cuantas veces quiera",
                edit_mem_save: "Guardar memoria",
                edit_mem_immediately: "Enviar inmediatamente",
                edit_mem_date: "Fecha",
                edit_mem_time: "Hora",
                edit_mem_repeat: "Repetir",
                edit_mem_never: "Nunca",
                edit_mem_weekly: "Semanalmente",
                edit_mem_monthly: "Mensualmente",
                edit_mem_yearly: "Anualmente",
                edit_mem_repeat_end: "Termino de repetición",
                edit_mem_repeat_footer_immediately: "La memoria se enviará inmediatamente",
                edit_mem_repeat_footer_never: "La memoria nunca se repetirá",
                edit_mem_repeat_footer_date: "La memoria se repetirá",
                edit_mem_repeat_footer_until: "hasta",
                edit_mem_accept_date: "Aceptar",
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
                //create/edit contact/guardian
                create_contact: "Create contact",
                relation: "Relation",
                create_guardian: "Create guardian",
                create_tutor: "Create tutor",
                edit_contact: "Edit contact",
                save_changes: "Save changes",
                nickname: "Nickname",
                //membership
                membership: "Membership",
                text_thanks_membership: "Thanks for being a HeavenSent member",
                next_billing_date: "Next billing date:",
                billed_with: "Billed with:",
                change_plan: "Change plan",
                cancel_subs: "Cancel Subscription",
                select_package: "Select Package",
                choose_plan: "Choose a plan that's right for you.",
                down_and_up: "Downgrade or upgrade at any type",
                basic: "Basic",
                standard: "Standard",
                premium: "Premium",
                per_month: "PER MONTH",
                text_notes: "Text Notes",
                pictures: "Pictures",
                on_demand: "On Demand",
                desc_select_membership: "Memories / Person / Years",
                select_plan: "Select plan",
                add_card_info: "Add card info",
                name_card: "Name on card",
                number_card: "Card Number",
                credit_card: "Credit card",
                confirm: "Confirm",
                payment_confirmed: "Payment confirmed",
                go_profile: "Go to profile",
                donate: "Donate",
                give_now: "Give now",
                //home
                contacts: "Contacts",
                create: "Create",
                new_memory: "New Memory",
                birthday_memory: "Birthday Memory",
                collage: "Collage",
                especial_memory: "Especial Memory",
                scheduled: "Scheduled",
                send_later: "Send Later",
                my_memories: "My memories",
                shared_with_me: "Shared with me",
                //left panel
                profile: "Profile",
                plan: "Plan",
                terms_and_conds: "Terms & Conditions",
                sign_out: "Sign Out",
                edit: "Edit",
                delete: "Delete",
                edit_profile: "Edit profile",
                create_memory: "Create Memory",
                //dashboard memories
                memories: "Memories",
                sent_by: "Sent by:",
                see: "See",
                no_content: "No Content",
                content: "Content",
                text: "Text",
                message: "Message",
                create_memories: "Create memories",
                //Create Memory
                create_mem_header: "Create Memory",
                create_mem_title: "Title",
                create_mem_message: "Message",
                create_mem_upload: "Upload files",
                create_mem_space: "Available space",
                create_mem_out_of: "out of",
                create_mem_upload_cover: "Tap here to select a cover for your memory",
                create_mem_add_contacts: "Contacts",
                create_mem_location: "Location",
                create_mem_add_location: "Add location",
                create_mem_deliver_date: "Deliver date",
                create_mem_set_deliver_date: "Set date to deliver",
                create_mem_on_demand: "On Demand",
                create_mem_on_demand_desc: "The user can access the content as many times as they can",
                create_mem_create: "Create memory",
                create_mem_immediately: "Send immediately",
                create_mem_date: "Date",
                create_mem_time: "Time",
                create_mem_repeat: "Repeat",
                create_mem_never: "Never",
                create_mem_weekly: "Weekly",
                create_mem_monthly: "monthly",
                create_mem_yearly: "Yearly",
                create_mem_repeat_end: "End repetition",
                create_mem_repeat_footer_immediately: "The memory will be sent immediately",
                create_mem_repeat_footer_never: "The memory will never repeat",
                create_mem_repeat_footer_date: "The memory will repeat itself",
                create_mem_repeat_footer_until: "until",
                create_mem_accept_date: "Accept",
                mem_file_edit: "Editar",
                mem_file_delete: "Borrar",
                //Add contacts
                add_cont_contacts: "contacts",
                add_cont_search: "Search",
                add_cont_to_mem: "Add to memory",
                //Add location
                add_loc_header: "Add location",
                add_loc_address: "Address",
                add_loc_save: "Save location",
                //Edit Memory
                edit_mem_header: "Edit Memory",
                edit_mem_title: "Title",
                edit_mem_message: "Message",
                edit_mem_upload: "Uploaded files",
                edit_mem_space: "Available space",
                edit_mem_out_of: "out of",
                edit_mem_upload_cover: "Tap here to select a cover for your memory",
                edit_mem_contacts: "Contacts",
                edit_mem_location: "Location",
                edit_mem_add_location: "Add location",
                edit_mem_deliver_date: "Deliver date",
                edit_mem_set_deliver_date: "Set date to deliver",
                edit_mem_on_demand: "On Demand",
                edit_mem_on_demand_desc: "The user can access the content as many times as they can",
                edit_mem_create: "Create memory",
                edit_mem_immediately: "Send immediately",
                edit_mem_date: "Date",
                edit_mem_time: "Time",
                edit_mem_repeat: "Repeat",
                edit_mem_never: "Never",
                edit_mem_weekly: "Weekly",
                edit_mem_monthly: "monthly",
                edit_mem_yearly: "Yearly",
                edit_mem_repeat_end: "End repetition",
                edit_mem_repeat_footer_immediately: "The memory will be sent immediately",
                edit_mem_repeat_footer_never: "The memory will never repeat",
                edit_mem_repeat_footer_date: "The memory will repeat itself",
                edit_mem_repeat_footer_until: "until",
                edit_mem_accept_date: "Accept",
            }
        }
    },

    methods: {
        clearingUser: false,
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
            if (key === "loggedUser") {
                console.log("Setting local value [setLocalValueToKey]");
                // console.log("---Value---");
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
        async updateCurrentUser() {
            var app = this;
            console.log("updating current user, getting user");
            var currentLocalUser = await app.methods.getLocalValue('loggedUser');
            console.log(currentLocalUser);
            let result = false;
            if (currentLocalUser != null && !app.methods.clearingUser) {
                await this.request.promise.get(`${app.data.server}/users/${currentLocalUser.id}`).then(async function (getResult) {
                    var user = JSON.parse(getResult.data);
                    console.log("currentLocalUser wasn't null, setting value to loggedUser");
                    result = await app.methods.setLocalValueToKey(user, 'loggedUser');
                    await app.methods.loadContacts();
                    await app.methods.loadAdminedContacts();
                    // console.log("Update User Result:" + result + " [updateCurrentUser()]");
                }).catch(async function (error) {
                    console.log("Error updating current user!!! [updateCurrentUser()]");
                    console.log(error);
                    await app.methods.clearCurrentUser();
                    result = false;
                });
            }
            else {
                console.log("Couldn't update current user; user was null [updateCurrentUser()]")
            }
            return result;
        },
        async clearCurrentUser() {
            var app = this;
            app.methods.clearingUser = true;
            console.log("! ! ! ! ! ! ! ! ! Clearing User Data ! ! ! ! ! ! ! ! ! !")
            let result = await app.methods.setLocalValueToKey(null, 'loggedUser');
            await app.methods.setLocalValueToKey([], 'loggedUserContacts')
            await app.methods.setLocalValueToKey([], 'loggedUserAdminedContacts')
            app.methods.clearingUser = false;
            return result;
        },
        async userIsEmpty() {
            var currentUser = await this.methods.getLocalValue('loggedUser');
            if (currentUser === null) {
                return true;
            }
            return false;
        },
        async userIsValid() {
            var currentUser = await this.methods.getLocalValue('loggedUser');
            if (currentUser != null) {
                if (currentUser.confirmed) {
                    console.log("User Is Valid [userIsValid()]");
                    return true;
                }
            }
            console.log("User Is Not Valid [userIsValid()]");
            return false;
        },
        async userHasAdmin() {
            //Call userIsValid before this always.
            var currentUser = await this.methods.getLocalValue('loggedUser');
            var result = false;
            if (currentUser != null) {
                // console.log("Requesting JSON");
                // console.log(`${app.data.server}/contacts/?owner=${currentUser.id}&isAdmin=true`);
                await this.request.promise.json(`${app.data.server}/contacts/?owner=${currentUser.id}&isAdmin=true`).then(async function (res) {
                    // console.log("user has something? [userHasAdmin()]");
                    // console.log(res.data);
                    let hasAdmins = (res.data.length > 0);
                    // console.log(hasAdmins);
                    if (hasAdmins) {
                        // console.log(`user has at least 1 admin (${res.data.length}) [userHasAdmin()]`);
                        result = true;
                    }
                    else {
                        // console.log("Had no admins [userHasAdmin()]")
                        result = false;
                    }
                }).catch(function(error){
                    console.log("Error checking if it's admin or not");
                    console.log(error);
                })
            }
            else {
                console.log("Had no loggedUser [userHasAdmin()]");
                result = false;
            }
            return result;
        },
        async userHasValidMembership() {
            var currentUser = await this.methods.getLocalValue('loggedUser');
            // console.log("user has valid membership? [userHasValidMembership()]");
            var result = false;
            if (currentUser != null) {
                if (currentUser.currentMembership != null) {
                    // console.log("current membership wasn't null [userHasValidMembership()]");
                    // console.log(currentUser.currentMembership);
                    if (currentUser.currentMembership.isActive) {
                        // console.log("current user's membership is active! [userHasValidMembership()]");
                        result = true;
                    }
                    else {
                        // console.log("current user's membership was inactive unu [userHasValidMembership()]");
                        result = false;
                    }
                }
                else {
                    // console.log("current membership is null!!! [userHasValidMembership()]");
                    result = false;
                }
            }
            else {
                // console.log("current user is null!!! [userHasValidMembership()]");
                result = false;
            }

            return result;
        },
        async loadContacts() {
            var app = this;
            var currentUser = await app.methods.getLocalValue('loggedUser');
            var contacts = [];
            var result = false;
            if (currentUser != null) {
                this.request.promise.json(`${app.data.server}/contacts/?owner=${currentUser.id}`).then(async function (res) {
                    result = await app.methods.setLocalValueToKey(res.data, 'loggedUserContacts');
                    // return true;
                })
            }
            return result;
        },
        async clearContacts() {
            await this.methods.setLocalValueToKey([], 'loggedUserContacts');
        },
        async loadAdminedContacts() {
            var app = this;
            var currentUser = await app.methods.getLocalValue('loggedUser');
            var contacts = [];
            var result = false;
            if (currentUser != null) {
                //http://localhost:1337/contacts/?contact=12&isAdmin=true
                this.request.promise.json(`${app.data.server}/contacts/?contact=${currentUser.id}&isAdmin=true`).then(async function (res) {
                    result = await app.methods.setLocalValueToKey(res.data, 'loggedUserAdminedContacts');
                    // return true;
                })
            }
            return result;
        },
        async clearAdminedContacts() {
            await this.methods.setLocalValueToKey([], 'loggedAdminedUserContacts');
        },
        setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = 'expires=' + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },
        getCookie(name) {
            var app = this;
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        checkCookie() {
            var app = this;
            var user = getCookie("username");
            if (user != "") {
                alert("Welcome again " + user);
            } else {
                user = prompt("Please enter your name:", "");
                if (user != "" && user != null) {
                    setCookie("username", user, 365);
                }
            }
        },
        deleteCookie(name) {
            var app = this;
            if (this.methods.getCookie(name)) {
                this.methods.setCookie(name, "", -1000);
            }
        },
        displayCookies() {
            var app = this;
            // var fname = getCookie("firstname");
            // if (fname==null) {
            //     fname="";
            // }
            // if (fname!="") {
            //     fname="firstname="+fname;
            // }
            // var lname=getCookie("lastname");
            // if (lname==null) {
            //     lname="";
            // }
            // if (lname!="") {
            //     lname="lastname="+lname;
            // }
            console.log("- - - - Cookies - - - -");
            console.log(document.cookie);
            // alert (document.cookie);
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

window.language = (localStorage.getItem('language') || (app.language || 'en_US')).replace(/-/g, "_");

window.localize = function (key) {
    var language = window.language
    language = language.replace(/-/g, "_");
    if (!app.data.locales[language])
        language = language.substring(0, 2);
    if (!app.data.locales[language])
        language = 'en'

    return app.data.locales[language][key] ? app.data.locales[language][key] : key
}
