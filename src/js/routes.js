import Login from '../pages/login/login.f7.html';
import Recovery from '../pages/login/recovery.f7.html';

import HomePage from '../pages/home.f7.html';
import AboutPage from '../pages/about.f7.html';
import FormPage from '../pages/form.f7.html';
import LeftPage1 from '../pages/left-page-1.f7.html';
import LeftPage2 from '../pages/left-page-2.f7.html';
import DynamicRoutePage from '../pages/dynamic-route.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [{
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
    path: '/about/',
    component: AboutPage,
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