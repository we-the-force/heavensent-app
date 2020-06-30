import Login from '../pages/login/login.f7.html';
import Recovery from '../pages/login/recovery.f7.html';
import RecoveryMailSend from '../pages/login/recovery-mail-send.f7.html';
import RecoveryNewPass from '../pages/login/recovery-new-pass.f7.html';

import UserAgreement from '../pages/signup/user-agreement.f7.html';
import SignupStep1 from '../pages/signup/signup-step1.f7.html';
import CreateContact from '../pages/contacts/create-contact.f7.html';
import CreateGuardian from '../pages/guardian/create-guardian.f7.html';
import SignupConfirm from '../pages/signup/signup-confirm.f7.html';
import ImportContacts from '../pages/contacts/import-contacts.f7.html';
import InviteAdmin from '../pages/contacts/invite-admin.f7.html';
import EditContact from '../pages/contacts/edit-contact.f7.html';

import CreateMemory from '../pages/memory/create-memory.f7.html';
import BirthdayMemory from '../pages/memory/birthday-memory.f7.html';
import HomeMemories from '../pages/memory/home-memories.f7.html';
import LocationMemory from '../pages/memory/add-location.f7.html';
import ContactsMemory from '../pages/memory/add-contacts.f7.html';

import MemoryDashboard from '../pages/recipient/dashboard.f7.html';
import MemoryView from '../pages/recipient/view-memory.f7.html';
import MemoryNotification from '../pages/recipient/memory-notification.f7.html';

import FundationsSingle from '../pages/fundations/fundations-single.f7.html';
import Donations from '../pages/membership/donations.f7.html';

import SelectMembership from '../pages/membership/select-membership.f7.html';
import AddCardInfo from '../pages/membership/add-card-info.f7.html';
import ViewMembership from '../pages/membership/view-membership.f7.html';
import PaymentConfirmMembership from '../pages/membership/payment-confirm-membership.f7.html';

import ViewFamily from '../pages/family/view-family.f7.html';

import FormPage from '../pages/form.f7.html';
import DynamicRoutePage from '../pages/dynamic-route.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';
import ContactsListComponent from 'framework7/components/contacts-list/contacts-list';

async function checkAuth(to, from, resolve, reject) {
    var router = this;
    var app = router.app;
    var valid = await app.methods.userIsValid();

    if (valid) {
        if (await app.methods.userHasAdmin()) {
            // console.log("user had admin [checkAuth()]")
            // await isMembershipValid(to, from, resolve, reject);
            resolve();
        }
        else {
            reject();
            await this.navigate('/');
            return;
        }
    }
    else {
        reject();
        await this.navigate('/');
        return;
        // resolve('/asd/');
    }
}
async function isMembershipValid(to, from, resolve, reject) {
    var router = this;
    var app = router.app;

    if (await app.methods.userHasValidMembership()) {
        // console.log("user has valid membership [isMembershipValid()]");
        resolve();
    }
    else {
        /*
        if you're not coming from select-membership
        from.name != "select-membership"
        */
        let isEmpty = true;
        for (var prop in from) {
            if (from.hasOwnProperty(prop))
                isEmpty = false;
        }

        var user = await app.methods.getLocalValue('loggedUser');
        if (user != null) {
            if (to.name === "select-membership") {
                // console.log("Was going to sleect-membership, letting it go to select-membership [isMembershipValid()]");
                resolve();
            }
            else if (!isEmpty) {
                // console.log("from isn't empty! [isMembershipValid()]")
                if (from.name != "select-membership" && to.name != "select-membership") {
                    // console.log("you're not (coming from select-memberhip and going to select-membership) [isMembershipValid()]");
                    resolve();
                }
                else {
                    // console.log("Youre either coming from or going to selet-membership  [isMembershipValid()]");
                    reject();
                    await router.navigate({
                        name: 'select-membership',
                        params: {
                            userID: user.id,
                            clearOnBack: "1"
                        }
                    })
                }
            }
            else {
                // console.log("from was empty, redirecting to select-membership");
                // console.log(from);
                reject();
                await router.navigate({
                    name: 'select-membership',
                    params: {
                        userID: user.id,
                        clearOnBack: "1"
                    }
                })
            }
        }
        else {
            console.log("user was null, return to login [isMembershipValid()]");
        }
    }
}
async function isLoggedIn(to, from, resolve, reject) {
    var router = this;
    var app = router.app;
    // console.log("-Entering isLoggedIn, updating user");
    await app.methods.updateCurrentUser();
    var user = await app.methods.getLocalValue('loggedUser');
    // console.log(user);
    var valid = (await app.methods.userIsValid());
    if (valid) {
        reject();
        if (!await app.methods.userHasAdmin()) {
            app.dialog.alert(`Your account has no admin associated with it, please fill out your admin information.`);
            await router.navigate({
                name: 'invite-admin',
                params: { userID: user.id }
            })
        }
        else {
            if (!await app.methods.userHasValidMembership()) {
                // console.log("membership wasn't valid, going to select-membership [isLoggedIn()]");
                await router.navigate({
                    name: 'select-membership',
                    params: {
                        userID: user.id,
                        clearOnBack: "1"
                    }
                })
            }
            else {
                // console.log("Going to memories/home [isLoggedIn()]");
                await router.navigate('/memories/home');
            }
        }
    }
    else {
        // console.log("User was not valid [isLoggedIn()]");
        console.log(valid);
        resolve();
    }
}

var routes = [
    /* ----------------------------------- components -------------------------------------------- */
    {
        name: 'contacts-memories',
        path: '/memories/contacts',
        popup: {
            component: ContactsMemory,
        }
    },
    {
        name: 'location-memories',
        path: '/memories/location',
        popup: {
            component: LocationMemory,
        }
    },

    /* ----------------------------------- pages -------------------------------------------- */
    {
        name: 'login',
        path: '/',
        name: 'login',
        beforeEnter: isLoggedIn,
        component: Login,
    },
    {
        path: '/recovery',
        name: 'recovery',
        component: Recovery,
    },
    {
        path: '/recovery/mailSend',
        name: 'recovery_mail_send',
        component: RecoveryMailSend,
    },
    {
        path: '/recovery/newPass',
        name: 'recovery_new_pass',
        component: RecoveryNewPass,
    },
    {
        path: '/UserAgreement',
        name: 'user-agreement',
        component: UserAgreement,
    },
    {
        name: 'signup-step1',
        path: '/signup/step1',
        component: SignupStep1,
    },
    {
        name: 'signup-confirm',
        path: '/signup/confirm',
        component: SignupConfirm,
    },
    {
        name: 'import-contacts',
        path: '/contact/import',
        beforeEnter: [checkAuth],
        component: ImportContacts,
    },
    {
        name: 'create-contact',
        path: '/contact/create',
        beforeEnter: [checkAuth],
        component: CreateContact,
    },
    {
        name: 'edit-contact',
        path: '/contact/edit/contact/:contactId',
        beforeEnter: [checkAuth],
        async: async function (routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            // var currentUser = await app.methods.getLocalValue()
            var contactId = routeTo.params.contactId;

            await app.request.promise.json(`${app.data.server}/contacts/${contactId}`).then(function (res) {
                // Do the resolve depending on if the user exists and such.
                // Send the whole thingie or something like that.

                // console.log("inside async [routes.edit-contact.async]");
                // console.log(res.data);

                resolve({
                    component: EditContact,
                },
                    {
                        context: {
                            ContactInfo: res.data,
                        }
                    });
            })
        }
        // component: EditContact,
    },
    {
        name: 'create-guardian',
        path: '/guardian/create',
        beforeEnter: [checkAuth],
        component: CreateGuardian,
    },
    {
        name: 'invite-admin',
        path: '/admin/invite/user/:userID',
        component: InviteAdmin,
    },
    {
        name: 'view-family',
        path: '/family/view',
        beforeEnter: [checkAuth, isMembershipValid],
        component: ViewFamily,
    },
    {
        name: 'create-memory',
        path: '/memories/create/:memID',
        beforeEnter: [checkAuth, isMembershipValid],
        async: async function (routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            var currentUser = await app.methods.getLocalValue('loggedUser');
            var userContacts = await app.methods.getLocalValue('loggedUserAdminedContacts');

            var memID = routeTo.params.memID;
            var memoryData;
            var canEdit = false;

            if (memID != -1)
            {
                //Estas editando una memoria y asi
                await app.request.promise.get(`${app.data.server}/memories/${memID}`).then(async function(memResponse){
                    memoryData = JSON.parse(memResponse.data)
                }).catch(async function (err){
                    console.log("Error fetching memories [create-memory]");
                    console.log(err);
                });
                let ownerID;
                await app.request.promise.get(`${app.data.server}/users/${memoryData.owners[0].id}`).then(async function(ownerRes){
                    ownerID = JSON.parse(ownerRes.data).id;
                    console.log("Owner: " + ownerID);
                }).catch(async function(err){
                    console.log("Error fetching memory owner [create-memory]");
                    console.log(err);
                });

                userContacts.forEach(contact => {
                    // console.log(`Current user: ${contact.owner.name}, (${contact.owner.id} === ${ownerID})`);
                    if (contact.owner.id === ownerID)
                    {
                        // console.log("Encontre el cosito este como no");
                        if (contact.contact.id === currentUser.id)
                        {
                            // console.log('Si es el mismo');
                            if (contact.isAdmin)
                            {
                                // console.log("Este es admin como no");
                                if (contact.editMemories)
                                {
                                    console.log("Sobres, el admin si puede editar memorias");
                                    canEdit = true;
                                }
                                else
                                {
                                    // console.log("Pos no puede editar chavo");
                                }
                            }
                            else
                            {
                                // console.log("Si eran amiguitos pero no era admin");
                            }
                        }
                        else
                        {
                            // console.log("El user no era el mismo que pex");
                        }
                    }
                });
            }

            console.log("Editing? " + (memID != -1));
            console.log(`Can edit: ${canEdit}`);
            console.log("Memory fetched");
            console.log(memoryData);
            resolve({
                component: CreateMemory,
            },
                {
                    context: {
                        CurrentPlan: currentUser.currentMembership,
                        CurrentMemory: memoryData,
                        Editing: memID != -1,
                        AdminCanEdit: canEdit,
                    }
                })
        }
        // component: CreateMemory,
    },
    {
        name: 'home-memories',
        path: '/memories/home',
        beforeEnter: [checkAuth, isMembershipValid],
        async: async function (routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            var server = app.data.server;
            await app.methods.updateCurrentUser();
            var currentUser = await app.methods.getLocalValue('loggedUser');
            var contacts = await app.methods.getLocalValue('loggedUserContacts');
            var adminContacts = await app.methods.getLocalValue('loggedUserAdminedContacts');
            // console.log(contacts);
            // console.log(`Async function to home-memories, server: ${server}`);

            var ownedMemories;
            await app.request.promise.get(`${app.data.server}/memories/?owners.id=${currentUser.id}`).then(async function (memoriesResult) {
                ownedMemories = JSON.parse(memoriesResult.data);
                // console.log("-.- memories -.-");
                // console.log(ownedMemories);
            }).catch(async function (err) {
                console.log("Error fetching memories [home-memory]");
                console.log(err);
            });

            var baseFundations;
            await app.request.promise.get(`${app.data.server}/fundations`).then(async function (fundationResult){
                baseFundations = JSON.parse(fundationResult.data);
            }).catch(async function(err){
                console.log("Error fetching fundations [home-memory]");
                console.log(err);
            });

            resolve({
                component: HomeMemories,
            },
            {
                context: {
                    Server: server,
                    Contacts: getContacts(contacts),
                    AdminedContacts: getContacts(adminContacts),
                    Memories: getMemories(ownedMemories),
                    Fundations: getFundations(baseFundations),
                }
            });

            function getMemories(baseMemories) {
                let memoryObject = {
                    scheduled: [],
                    pending: []
                };
                if (baseMemories) {
                    baseMemories.forEach(memory => {
                        let auxMemory = {
                            id: null,
                            name: null,
                            deliveryDate: null,
                            cover: null,
                            contacts: {
                                count: 0,
                                extraContacts: 0,
                                limitedUrls: [],
                                urls: []
                            },
                        }

                        auxMemory.id = memory.id;
                        auxMemory.name = memory.title;
                        auxMemory.deliveryDate = memory.reminder.date;
                        auxMemory.cover = memory.cover != null ? memory.cover.url : "";
                        auxMemory.contacts.count = memory.recipients.length;
                        memory.recipients.forEach(contact => {
                            if (auxMemory.contacts.limitedUrls.length < 3) {
                                if (contact.profilePicture) {
                                    auxMemory.contacts.limitedUrls.push(contact.profilePicture.url);
                                } else {
                                    auxMemory.contacts.limitedUrls.push('');
                                }
                            }
                            else if (auxMemory.contacts.limitedUrls.length === 3) {
                                if (auxMemory.contacts.count === 4) {
                                    if (contact.profilePicture) {
                                        auxMemory.contacts.limitedUrls.push(contact.profilePicture.url);
                                    } else {
                                        auxMemory.contacts.limitedUrls.push('');
                                    }
                                }
                            }
                            if (contact.profilePicture) {
                                auxMemory.contacts.urls.push(contact.profilePicture.url);
                            } else {
                                auxMemory.contacts.urls.push('');
                            }
                            //auxMemory.contacts.urls.push(contact.profilePicture.url);
                        })
                        auxMemory.contacts.extraContacts = auxMemory.contacts.urls.length - auxMemory.contacts.limitedUrls.length;

                        if (auxMemory.deliveryDate == null) {
                            memoryObject.pending.push(auxMemory);
                        }
                        else {
                            memoryObject.scheduled.push(auxMemory);
                        }
                    })
                }
                // console.log("Memory context generated [memories-home.getMemories]");
                // console.log(memoryObject);
                return memoryObject;
            }
            function getContacts(baseRelation) {
                console.log("Home.getContacts()");
                console.log(baseRelation);
                let contactsObject = [];
                if (baseRelation) {
                    baseRelation.forEach(relation => {
                        // console.log("Checking relation:");
                        // console.log(relation);
                        contactsObject.push({
                            id: relation.id,
                            name: (relation.nickname != null && relation.nickname.trim() != "") ? relation.nickname : ((relation.contact.name != null && relation.contact.name.trim() != "") ? relation.contact.name : relation.contact.username),
                            picture: relation.contact.profilePicture != null ? relation.contact.profilePicture.url : ''
                        });
                    });
                }
                console.log(contactsObject);
                return contactsObject;
            }
            function getFundations(baseFund)
            {
                // console.log("Get Fundations");
                // console.log(baseFundations);
                let fundations = [];
                if (baseFund){
                    baseFund.forEach(fund => {
                        fundations.push({
                            id: fund.id,
                            name: fund.name,
                            cover: fund.cover ? fund.cover.url : "",
                            desc: fund.description ? fund.description : "[-no description-]",
                        });
                    })
                }
                // console.log(fundations);
                return fundations;
            }
        }
    },
    {
        name: 'birthday-memories',
        path: '/memories/birthday',
        beforeEnter: [checkAuth, isMembershipValid],
        async: async function (routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            var currentUser = await app.methods.getLocalValue('loggedUser');

            resolve({
                component: BirthdayMemory,
            },
                {
                    context: {
                        CurrentPlan: currentUser.currentMembership,
                    }
                })
        }
    },
    /* {
        name: 'location-memories',
        path: '/memories/location',
        component: LocationMemory,
    }, */
    /* {
        name: 'contacts-memories',
        path: '/memories/contacts',
        component: ContactsMemory,
    }, */
    {
        name: 'memory-dashboard',
        path: '/memories/dashboard/user/:userID',
        async: async function(routeTo, routeFrom, resolve, reject){
            var router = this;
            var app = router.app;
            var userID = routeTo.params.userID;

            var baseMemories = null;
            await app.request.promise.get(`${app.data.server}/memories/?recipients.id=${userID}`).then(function (memResult){
                baseMemories = JSON.parse(memResult.data);
            }).catch(function(err){
                console.log("Error getting memories!");
                console.log(err);
            })

            // getMemories(baseMemories);

            resolve({
                component: MemoryDashboard,
            },
            {
                context: {
                    Server: app.data.server,
                    Memories: getMemories(baseMemories),
                }
            })

            function getMemories(baseMem)
            {
                let memObject = [];

                baseMem.forEach(mem => {
                    memObject.push(getMemory(mem));
                })

                // console.log("Resulting memories");
                // console.log(memObject);
                return memObject;
            }
            function getMemory(baseMem)
            {
                let memory = {
                    id: baseMem.id,
                    title: baseMem.title ? baseMem.title : "[No title]",
                    desc: baseMem.description ? baseMem.description : "[No description]",
                    owner: baseMem.owners[0].name,
                    cover: baseMem.cover ? baseMem.cover.url : "",
                    media: [],
                    mediaThumb: [],
                }
                baseMem.media.forEach(media => {
                    memory.media.push(media.url ? media.url : "");
                });
                return memory;
            }
        }
        // component: MemoryDashboard,
    },
    {
        name: 'memory-notification',
        path: '/memories/notification/:pageID',
        component: MemoryNotification,
    },
    {
        name: 'view-memory',
        path: '/memories/view/memory/:memoryID',
        async: async function(routeTo, routeFrom, resolve, reject){
            var router = this;
            var app = router.app;
            var memoryID = routeTo.params.memoryID;

            var baseMem = null;
            await app.request.promise.get(`${app.data.server}/memories/${memoryID}`).then(function (memResult){
                baseMem = JSON.parse(memResult.data);
                // console.log("Base memory");
                // console.log(baseMem);
            }).catch(function(err){
                console.log("Error fetching memories!");
                console.log(err);
                baseMem = null;
            })

            if (baseMem)
            {

                resolve({
                    component: MemoryView,
                },
                {
                    context: {
                        Server: app.data.server,
                        Memory: getMemory(baseMem),
                    }
                })
            }
            else
            {
                reject();
            }

            function getMemory(baseMem)
            {
                let memory = {
                    id: baseMem.id,
                    title: baseMem.title ? baseMem.title : "[No title]",
                    desc: baseMem.description ? baseMem.description : "[No description]",
                    owner: baseMem.owners[0].name,
                    cover: baseMem.cover ? baseMem.cover.url : "",
                    media: [],
                    mediaThumb: [],
                }
                baseMem.media.forEach(media => {
                    memory.media.push(media.url ? media.url : "");
                });
                // console.log(memory);
                return memory;
            }
        }
        // component: MemoryView,
    },
    {
        name: 'donations',
        path: '/donations',
        beforeEnter: [checkAuth],
        async: async function(routeTo, routeFrom, resolve, reject){
            var router = this;
            var app = router.app;
            // var currentUser = await app.methods.getLocalValue('loggedUser');

            var baseFundations;
            await app.request.promise.get(`${app.data.server}/fundations`).then(function (fundationResult){
                baseFundations = JSON.parse(fundationResult.data);
            }).catch(function(err){
                console.log("Error fetching fundations");
                console.log(err);
            });

            resolve({
                component: Donations,
            },
            {
                context: {
                    Server: app.data.server,
                    Fundations: getFundations(baseFundations),
                }
            })

            function getFundations(baseFund)
            {
                // console.log("Get Fundations");
                // console.log(baseFundations);
                let fundations = [];
                if (baseFund){
                    baseFund.forEach(fund => {
                        fundations.push({
                            id: fund.id,
                            name: fund.name,
                            cover: fund.cover ? fund.cover.url : "",
                            desc: fund.description ? fund.description : "[-no description-]",
                        });
                    })
                }
                // console.log(fundations);
                return fundations;
            }
        }
    },
    {
        name: 'select-membership',
        path: '/membership/select/user/:userID/clear/:clearOnBack',
        beforeEnter: [checkAuth],
        component: SelectMembership,
    },
    {
        name: 'card-info',
        path: '/membership/card/user/:userID/plan/:planName',
        beforeEnter: [checkAuth],
        component: AddCardInfo,
    },
    {
        name: 'view-membership',
        path: '/membership/view/user/:userID',
        beforeEnter: [checkAuth],
        async: function (routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            var userID = routeTo.params.userID;

            app.preloader.show();

            // console.log("Move to view [view-membership.async]");
            // console.log(`${app.data.server}/users/${userID} [view-membership.async]`);
            app.request.promise.json(`${app.data.server}/users/${userID}`)
                .then(function (res) {
                    // console.log("Current membership: [view-membership.json]")
                    // console.log(res.data.currentMembership);
                    app.preloader.hide();
                    resolve(
                        {
                            component: ViewMembership,
                        },
                        {
                            context: {
                                UserName: GetUserName(res.data),
                                PlanName: GetPlanName(res.data.currentMembership),
                                PlanPrice: GetPlanPrice(res.data.currentMembership),
                                BillingDate: GetNextPayDate(res.data.currentMembership),
                            }
                        }
                    );
                });

            function GetUserName(user) {
                if (user === null) {
                    return "No user!";
                }
                else {
                    return user.username;
                }
            }
            function GetPlanName(plan) {
                if (plan === null) {
                    return "None";
                }
                else {
                    // console.log("Plan: [view-membership.async.getPlanName]");
                    // console.log(plan);
                    return plan.plan.name;
                }
            }
            function GetPlanPrice(plan) {
                if (plan === null) {
                    return "--.--";
                }
                else {
                    return plan.plan.costPerMonth;
                }
            }
            function GetNextPayDate(plan) {
                if (plan === null) {
                    return "----------";
                }
                else {
                    return plan.nextBillingDate;
                }
            }
        }
    },
    {
        name: 'payment-confirm-membership',
        path: '/membership/confirmed',
        beforeEnter: [checkAuth],
        component: PaymentConfirmMembership,
    },
    {
        name: 'fundations-single',
        path: '/fundations',
        beforeEnter: [checkAuth],
        component: FundationsSingle,
    },
    {
        name: 'about',
        path: '/about/',
        beforeEnter: [checkAuth],
        async: function (routeTo, routeFrom, resolve, reject) {
            // Router instance
            var router = this;

            // App instance
            var app = router.app;

            // Show Preloader
            app.preloader.show();

            // User ID from request
            var userId = routeTo.params.userId;

            // Simulate Ajax Request
            setTimeout(function () {
                // We got user data from request
                var user = {
                    firstName: 'Vladimir',
                    lastName: 'Kharlampidi',
                    about: 'Hello, i am creator of Framework7! Hope you like it!',
                    links: [{
                        title: 'Framework7 Website',
                        url: 'http://framework7.io',
                    },
                    {
                        title: 'Framework7 Forum',
                        url: 'http://forum.framework7.io',
                    },
                    ]
                };
                // Hide Preloader
                app.preloader.hide();

                // Resolve route to load page
                resolve({
                    component: RequestAndLoad,
                }, {
                    context: {
                        user: user,
                    }
                });
            }, 1000);
        },
    },
    {
        path: '/form/',
        component: FormPage,
    },
    {
        path: '/dynamic-route/blog/:blogId/post/:postId/',
        component: DynamicRoutePage,
    },
    {
        path: '/request-and-load/user/:userId/',
        async: function (routeTo, routeFrom, resolve, reject) {
            // Router instance
            var router = this;
            // console.log(router);

            // App instance
            var app = router.app;

            // Show Preloader
            app.preloader.show();

            // User ID from request
            var userId = routeTo.params.userId;

            // Simulate Ajax Request
            setTimeout(function () {
                // We got user data from request
                var user = {
                    firstName: 'Vladimir',
                    lastName: 'Kharlampidi',
                    about: 'Hello, i am creator of Framework7! Hope you like it!',
                    links: [{
                        title: 'Framework7 Website',
                        url: 'http://framework7.io',
                    },
                    {
                        title: 'Framework7 Forum',
                        url: 'http://forum.framework7.io',
                    },
                    ]
                };
                // Hide Preloader
                app.preloader.hide();

                // Resolve route to load page
                resolve({
                    component: RequestAndLoad,
                }, {
                    context: {
                        user: user,
                    }
                });
            }, 1000);
        },
    },
    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;