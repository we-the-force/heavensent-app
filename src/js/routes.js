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

import MemoryDashboard from '../pages/recipient/dashboard.f7.html';
import MemoryView from '../pages/memory/view-memory.f7.html';

import FundationsSingle from '../pages/fundations/fundations-single.f7.html';

import SelectMembership from '../pages/membership/select-membership.f7.html';
import ViewMembership from '../pages/membership/view-membership.f7.html';
import PaymentConfirmMembership from '../pages/membership/payment-confirm-membership.f7.html';

import ViewFamily from '../pages/family/view-family.f7.html';

import HomePage from '../pages/home.f7.html';
import AboutPage from '../pages/about.f7.html';
import FormPage from '../pages/form.f7.html';
import LeftPage1 from '../pages/left-page-1.f7.html';
import LeftPage2 from '../pages/left-page-2.f7.html';
import DynamicRoutePage from '../pages/dynamic-route.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [{
    name: 'login',
    path: '/',
    name: 'login',
    component: Login,
},
{
    path: '/recovery/',
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
    component: ImportContacts,
},
{
    name: 'create-contact',
    path: '/contact/create',
    component: CreateContact,
},
{
    name: 'create-guardian',
    path: '/create-guardian/',
    component: CreateGuardian,
},
{
    name: 'invite-admin',
    path: '/admin/invite',
    component: InviteAdmin,
},
{
    name: 'view-family',
    path: '/family/view',
    component: ViewFamily,
},
{
    name: 'create-memory',
    path: '/create-memory/',
    component: CreateMemory,
},
{
    name: 'memory-dashboard',
    path: '/memory-dashboard/',
    component: MemoryDashboard,
},
{
    name: 'view-memory',
    path: '/view-memory/',
    component: MemoryView,
},
{
    name: 'select-membership',
    path: '/select-membership/',
    component: SelectMembership,
},
{
    name: 'view-membership',
    path: '/view-membership/',
    component: ViewMembership,
},
{
    name: 'payment-confirm-membership',
    path: '/payment-confirm-membership/',
    component: PaymentConfirmMembership,
},
{
    name: 'fundations-single',
    path: '/fundations-single/',
    component: FundationsSingle,
},
{
    name: 'about',
    path: '/about/',
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
    path: '/form/',
    component: FormPage,
},

{
    path: '/left-page-1/',
    component: LeftPage1,
},
{
    path: '/left-page-2/',
    component: LeftPage2,
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