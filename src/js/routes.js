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

import CreateMemory from '../pages/memory/create-memory.f7.html';
import BirthdayMemory from '../pages/memory/birthday-memory.f7.html';
import HomeMemories from '../pages/memory/home-memories.f7.html';
import LocationMemory from '../pages/memory/add-location.f7.html';
import ContactsMemory from '../pages/memory/add-contacts.f7.html';

import MemoryDashboard from '../pages/recipient/dashboard.f7.html';
import MemoryView from '../pages/recipient/view-memory.f7.html';
import MemoryNotification from '../pages/recipient/memory-notification.f7.html';

import FundationsSingle from '../pages/fundations/fundations-single.f7.html';

import SelectMembership from '../pages/membership/select-membership.f7.html';
import AddCardInfo from '../pages/membership/add-card-info.f7.html';
import ViewMembership from '../pages/membership/view-membership.f7.html';
import PaymentConfirmMembership from '../pages/membership/payment-confirm-membership.f7.html';

import ViewFamily from '../pages/family/view-family.f7.html';

import FormPage from '../pages/form.f7.html';
import DynamicRoutePage from '../pages/dynamic-route.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';

async function checkAuth(to, from, resolve, reject)
{
    var router = this;
    var app = router.app;
    var valid = await app.methods.userIsValid();
    
    if (valid)
    {
        if (await app.methods.userHasAdmin())
        {
            console.log("user had admin [checkAuth()]")
            // await isMembershipValid(to, from, resolve, reject);
            resolve();
        }
        else
        {
            reject();
            this.navigate('/');
            return;
        }
    }
    else
    {
        reject();
        this.navigate('/');
        return;
        // resolve('/asd/');
    }
}
async function isMembershipValid(to, from, resolve, reject)
{
    var router = this;
    var app = router.app;
    // console.log("");
    // console.log("");
    // console.log("checkAuth start");
    // console.log("To");
    // console.log(to);
    // console.log("From");
    // console.log(from);
    
    if (await app.methods.userHasValidMembership())
    {
        console.log("user has valid membership [checkAuth()]");
        resolve();
    }
    else
    {
        /*
        if you're not coming from select-membership
        from.name != "select-membership"
        */
        let isEmpty = true;
        for(var prop in from) {
            if(from.hasOwnProperty(prop))
            isEmpty = false;
        }
        
        var user = await app.methods.getLocalValue('loggedUser');
        if (to.name === "select-membership")
        {
            console.log("Was going to sleect-membership, letting it go to select-membership");
            resolve();
        }
        else if (!isEmpty)
        {
            console.log("from isn't empty! [checkAuth]")
            if (from.name != "select-membership" && to.name != "select-membership")
            {
                console.log("you're not (coming from select-memberhip and going to select-membership) [checkAuth()]");
                resolve();
            }
            else
            {
                console.log("Youre either coming from or going to selet-membership [checkAuth()]");
                reject();
                await router.navigate({
                    name: 'select-membership',
                    params: { userID: user.id }
                })
            }
        }
        else
        {
            console.log("from was empty, redirecting to select-membership");
            from = to;
            console.log(from);
            reject();
            router.navigate({
                name: 'select-membership',
                params: { userID: user.id }
            })
        }
    }
}
async function isLoggedIn(to, from, resolve, reject)
{
    var router = this;
    var app = router.app;
    await app.methods.updateCurrentUser();
    var user = await app.methods.getLocalValue('loggedUser');
    var valid = (await app.methods.userIsValid());
    if (valid)
    {
        reject();
        if (!await app.methods.userHasAdmin())
        {
            app.dialog.alert(`Your account has no admin associated with it, please fill out your admin information.`);
            router.navigate({
                name: 'invite-admin',
                params: { userID: user.id }
            })
        }
        else
        {
            router.navigate('/memories/home');
        }
    }
    else
    {
        console.log("User was not valid [isLoggedIn()]");
        console.log(valid);
        resolve();
    }
}

var routes = [{
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
    path: '/memories/create',
    beforeEnter: [checkAuth, isMembershipValid],
    async: async function(routeTo, routeFrom, resolve, reject){
        var router = this;
        var app = router.app;
        var currentUser = await app.methods.getLocalValue('loggedUser');
        console.log("create-memories async function");
        console.log(currentUser.currentMembership);
        
        resolve({
            component: CreateMemory,
        },
        {
            context: {
                CurrentPlan: currentUser.currentMembership,
            }
        })
    }
    // component: CreateMemory,
},
{
    name: 'home-memories',
    path: '/memories/home',
    beforeEnter: [checkAuth, isMembershipValid],
    async: async function(routeTo, routeFrom, resolve, reject){
        var router = this;
        var app = router.app;
        var server = app.data.server;
        var contacts = await app.methods.getLocalValue('loggedUserContacts');
        // console.log(`Async function to home-memories, server: ${server}`);
        resolve({
            component: HomeMemories,
        },
        {
            context: {
                Server: server,
                Contacts: contacts,
            }
        });
    }
    // component: HomeMemories,
},
{
    name: 'birthday-memories',
    path: '/memories/birthday',
    beforeEnter: [checkAuth, isMembershipValid], 
    component: BirthdayMemory,
},
{
    name: 'location-memories',
    path: '/memories/location',
    component: LocationMemory,
},
{
    name: 'contacts-memories',
    path: '/memories/contacts',
    component: ContactsMemory,
},
{
    name: 'memory-dashboard',
    path: '/memory-dashboard/',
    beforeEnter: [checkAuth, isMembershipValid],
    component: MemoryDashboard,
},/*  */
{
    name: 'memory-notification',
    path: '/memory-notification/',
    beforeEnter: [checkAuth, isMembershipValid],
    component: MemoryNotification,
},/*  */
{
    name: 'view-memory',
    path: '/view-memory/',
    beforeEnter: [checkAuth, isMembershipValid],
    component: MemoryView,
},/*  */
{
    name: 'select-membership',
    path: '/membership/select/user/:userID',
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
    async: function(routeTo, routeFrom, resolve, reject){
        var router = this;
        var app = router.app;
        var userID = routeTo.params.userID;
        
        app.preloader.show();
        
        console.log("Move to view [view-membership.async]");
        console.log(`${app.data.server}/users/${userID} [view-membership.async]`);
        app.request.promise.json(`${app.data.server}/users/${userID}`)
        .then(function(res){
            console.log("Current membership: [view-membership.json]")
            console.log(res.data.currentMembership);
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
            
            function GetUserName(user)
            {
                if (user === null)
                {
                    return "No user!";
                }
                else
                {
                    return user.username;
                }
            }
            function GetPlanName(plan)
            {
                if (plan === null)
                {
                    return "None";
                }
                else
                {
                    console.log("Plan: [view-membership.async.getPlanName]");
                    console.log(plan);
                    return plan.plan.name;
                }
            }
            function GetPlanPrice(plan)
            {
                if (plan === null)
                {
                    return "--.--";
                }
                else
                {
                    return plan.plan.costPerMonth;
                }
            }
            function GetNextPayDate(plan)
            {
                if (plan === null)
                {
                    return "----------";
                }
                else
                {
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
        path: '/fundations-single/',
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
        console.log(router);
        
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