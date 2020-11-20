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
import EditProfile from '../pages/contacts/edit-profile.f7.html';

import CreateMemory from '../pages/memory/create-memory.f7.html';
import EditMemory from '../pages/memory/edit-memory.f7.html';
import BirthdayMemory from '../pages/memory/birthday-memory.f7.html';
import HomeMemories from '../pages/memory/home-memories.f7.html';
import LocationMemory from '../pages/memory/add-location.f7.html';
import ContactsMemory from '../pages/memory/add-contacts.f7.html';
import OnBoarding from '../pages/onboarding/onboarding.f7.html';

import MemoryDashboard from '../pages/recipient/dashboard.f7.html';
import MemoryView from '../pages/recipient/view-memory.f7.html';
import MemoryNotification from '../pages/recipient/memory-notification.f7.html';

import FundationsSingle from '../pages/fundations/fundations-single.f7.html';
import Donations from '../pages/membership/donations.f7.html';

import SelectMembership from '../pages/membership/select-membership.f7.html';
import AddCardInfo from '../pages/membership/add-card-info.f7.html';
import ViewMembership from '../pages/membership/view-membership.f7.html';
import PaymentConfirmMembership from '../pages/membership/payment-confirm-membership.f7.html';
import MembershipChangeConfirm from '../pages/membership/membership-change-confirm.f7.html';

import ViewFamily from '../pages/family/view-family.f7.html';

import FormPage from '../pages/form.f7.html';
import DynamicRoutePage from '../pages/dynamic-route.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';

async function checkAuth(to, from, resolve, reject) {
    var router = this;
    var app = router.app;
    var valid = await app.methods.userIsValid();

    if (valid) {
        if (await app.methods.userHasAdmin()) {
            // console.log("user had admin [checkAuth()]")
            // await isMembershipValid(to, from, resolve, reject);
            resolve();
        } else {
            reject();
            await this.navigate('/');
            return;
        }
    } else {
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
    } else {
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
            } else if (!isEmpty) {
                // console.log("from isn't empty! [isMembershipValid()]")
                if (from.name != "select-membership" && to.name != "select-membership") {
                    // console.log("you're not (coming from select-memberhip and going to select-membership) [isMembershipValid()]");
                    resolve();
                } else {
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
            } else {
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
        } else {
            console.log("user was null, return to login [isMembershipValid()]");
        }
    }
}
async function isLoggedIn(to, from, resolve, reject) {
    var router = this;
    var app = router.app;
    console.log("-Entering isLoggedIn, updating user");
    await app.methods.updateCurrentUser();
    var user = await app.methods.getLocalValue('loggedUser');
    console.log(user);
    var valid = (await app.methods.userIsValid());
    
    
    if (valid) {
        reject();
        if (!await app.methods.userHasAdmin()) {
            app.dialog.alert(`Your account has no admin associated with it, please fill out your admin information.`);
            await router.navigate({
                name: 'invite-admin',
                params: { userID: user.id }
            })
        } else {
            if (!await app.methods.userHasValidMembership()) {
                // console.log("membership wasn't valid, going to select-membership [isLoggedIn()]");
                await router.navigate({
                    name: 'select-membership',
                    params: {
                        userID: user.id,
                        clearOnBack: "1"
                    }
                })
            } else {
                // console.log("Going to memories/home [isLoggedIn()]");
                await router.navigate('/memories/home/user/' + user.id);
            }
        }
    } else {
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
        name: 'onboarding',
        path: '/onboarding',
        // beforeEnter: isLoggedIn,
        component: OnBoarding,
    },
    {
        name: 'login',
        path: '/',
        beforeEnter: isLoggedIn,
        component: Login,
    },
    {
        name: 'recovery',
        path: '/recovery',
        component: Recovery,
    },
    {
        name: 'recovery_mail_send',
        path: '/recovery/mailSend',
        component: RecoveryMailSend,
    },
    {
        name: 'recovery_new_pass',
        path: '/recovery/newPass/code/:code',
        component: RecoveryNewPass,
    },
    {
        name: 'user-agreement',
        path: '/UserAgreement',
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
        async: async function(routeTo, routeFrom, resolve, reject) {
                var router = this;
                var app = router.app;
                // var currentUser = await app.methods.getLocalValue()
                var loggedUser = await app.methods.getLocalValue('loggedUser');
                var contactId = routeTo.params.contactId;

                var contactInfo = null;
                var relationInfo = null;

                await app.request.promise.json(`${app.data.server}/contacts/${contactId}`).then(function(res) {
                    // Do the resolve depending on if the user exists and such.
                    // Send the whole thingie or something like that.

                    // console.log("inside async [routes.edit-contact.async]");
                    // console.log(res.data);
                    contactInfo = res.data;
                }).catch(function(err) {
                    console.log("Error fetching contact info [edit-contact.async]");
                    console.log(err);
                })

                await app.request.promise.json(`${app.data.server}/contacts/?owner=${loggedUser.id}&contact=${contactId}`).then(function(res) {
                    relationInfo = res.data;
                }).catch(function(err) {
                    console.log("Error fetching relationship info [edit-contact.async]");
                    console.log(err);
                });


                if (contactInfo != null && relationInfo != null) {
                    resolve({
                        component: EditContact,
                    }, {
                        context: {
                            ContactInfo: contactInfo,
                            RelationInfo: relationInfo,
                        }
                    });
                } else {
                    console.log("Rejected because user either couldn't get the contact or relation info");
                    reject();
                }
            }
            // component: EditContact,
    },
    {
        name: 'edit-profile',
        //path: '/user/edit/:contactId',
        path: '/user/edit/:userId',
        beforeEnter: [checkAuth],
        async: async function(routeTo, routeFrom, resolve, reject) {
                var router = this;
                var app = router.app;

                //var loggedUser = await app.methods.getLocalValue('loggedUser');
                var userId = routeTo.params.userId;

                //var userInfo = null;
                //var relationInfo = null;

                var userInfo = await app.request.promise.json(`${app.data.server}/users/${userId}`);
                //.then(function(res) {
                //    contactInfo = res.data;
                //}).catch(function(err) {
                //    console.log("Error fetching user info [edit-contact.async]");
                //    console.log(err);
                //})

                /* await app.request.promise.json(`${app.data.server}/contacts/?owner=${loggedUser.id}&contact=${contactId}`).then(function (res){
        relationInfo = res.data; 
    }).catch(function(err){
        console.log("Error fetching relationship info [edit-contact.async]");
        console.log(err);
    });
*/
                if (userInfo.status === 200) {
                    resolve({
                        component: EditProfile,
                    }, {
                        context: {
                            UserInfo: userInfo,
                        }
                    });
                } else {
                    reject();
                }
                /* if (contactInfo != null && relationInfo != null) {
                    resolve({
                        component: EditProfile,
                    }, {
                        context: {
                            ContactInfo: contactInfo,
                            RelationInfo: relationInfo,
                        }
                    });
                } else {
                    console.log("Rejected because user either couldn't get the contact or relation info");
                    reject();
                } */
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
        path: '/memories/create',
        beforeEnter: [checkAuth, isMembershipValid],
        async: async function(routeTo, routeFrom, resolve, reject) {
                var router = this;
                var app = router.app;
                var currentUser = await app.methods.getLocalValue('loggedUser');


                resolve({
                    component: CreateMemory,
                }, {
                    context: {
                        CurrentPlan: currentUser.currentMembership,
                    }
                })
            }
            // component: CreateMemory,
    },
    {
        name: 'edit-memory',
        path: '/memories/edit/memory/:memID',
        beforeEnter: [checkAuth, isMembershipValid],
        async: async function(routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            var currentUser = await app.methods.getLocalValue('loggedUser');
            var userContacts = await app.methods.getLocalValue('loggedUserAdminedContacts');

            var memID = routeTo.params.memID;
            var memoryData;
            var canEdit = false;
            var ownerID;
            var plan;
            var canAdminMem;

            await app.request.promise.get(`${app.data.server}/memories/${memID}`).then(async function(memResponse) {
                memoryData = JSON.parse(memResponse.data);
            }).catch(async function(err) {
                console.log("Error fetching memory");
                console.log(err);
            })
            ownerID = memoryData.owners[0].id;
            if (ownerID === currentUser.id) {
                //Editing your own memory, can edit everything.
                canEdit = true;
                canAdminMem = true;
                plan = currentUser.currentMembership;
            } else {
                console.log("Not the loggedUser");
                await app.request.promise.get(`${app.data.server}/users/${ownerID}`).then(async function(ownerRes) {
                    plan = JSON.parse(ownerRes.data).currentMembership;
                });
                console.log("Checking contacts:");
                console.log(userContacts);
                userContacts.forEach(contact => {
                    console.log("Checking owner thing for contact:");
                    console.log(contact);
                    console.log(`${contact.owner.id} === ${ownerID}`);
                    if (contact.owner.id === ownerID) {
                        console.log("Yes, is contact the same?");
                        console.log(`${contact.contact.id} === ${currentUser.id}`);
                        if (contact.contact.id === currentUser.id) {
                            console.log("Got the contact relationship of the logged user:");
                            console.log(contact);
                            if (contact.isAdmin) {
                                canAdminMem = true;
                                canEdit = contact.canEdit;
                            } else {
                                canAdminMem = false;
                                canEdit = false;
                            }
                        }
                    }
                })
            }



            if (canAdminMem) {
                resolve({
                    component: EditMemory,
                }, {
                    context: {
                        CurrentPlan: plan,
                        CurrentMemory: memoryData,
                        CanEdit: canEdit,
                        OwnedMemory: ownerID == currentUser.id
                    }
                })
            } else {
                console.log("Not admin for this user; not allowing access");
                reject();
            }

        }
    },
    {
        name: 'home-memories',
        path: '/memories/home/user/:userID',
        beforeEnter: [checkAuth, isMembershipValid],
        options: {
            reloadAll: true,
        },
        async: async function(routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            var server = app.data.server;
            await app.methods.updateCurrentUser();
            var userID = routeTo.params.userID;
            var loggedUser = await app.methods.getLocalValue('loggedUser');
            var contacts = await app.methods.getLocalValue('loggedUserContacts');
            var adminContacts = await app.methods.getLocalValue('loggedUserAdminedContacts');
            // console.log(contacts);
            // console.log(`Async function to home-memories, server: ${server}`);

            var currentUser;
            if (userID == -1) {
                currentUser = loggedUser;
            } else {
                await app.request.promise.get(`${app.data.server}/users/${userID}`).then(function(targetUserRes) {
                    currentUser = JSON.parse(targetUserRes.data);
                    // console.log("---------------------- This dude exists yeah");
                }).catch(async function(err) {
                    currentUser = loggedUser;
                    // console.log("-----------------------Dude doesn't exist unu");
                    app.dialog.alert("We have problems loading this user's account, it looks like it no longer exists. Please contact support.");
                });
            }

            var isEditing = (currentUser.id != loggedUser.id);
            // console.log(`IsEditing? ${isEditing} (${currentUser.id} != ${loggedUser.id})`);

            var ownedMemories;
            await app.request.promise.get(`${app.data.server}/memories/?owners.id=${currentUser.id}`).then(function(memoriesResult) {
                ownedMemories = JSON.parse(memoriesResult.data);
                // console.log("-.- memories -.-");
                // console.log(ownedMemories);
            }).catch(function(err) {
                console.log("Error fetching memories");
                console.log(err);
            });

            var baseFundations;
            await app.request.promise.get(`${app.data.server}/fundations`).then(function(fundationResult) {
                baseFundations = JSON.parse(fundationResult.data);
            }).catch(function(err) {
                console.log("Error fetching fundations");
                console.log(err);
            });

            resolve({
                component: HomeMemories,
            }, {
                context: {
                    Server: server,
                    LoggedUser: loggedUser,
                    CurrentUser: currentUser,
                    IsEditing: isEditing,
                    Contacts: getContacts(contacts, false, true),
                    AdminedContacts: getContacts(adminContacts, true, false),
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
                            } else if (auxMemory.contacts.limitedUrls.length === 3) {
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
                        } else {
                            memoryObject.scheduled.push(auxMemory);
                        }
                    })
                }
                // console.log("Memory context generated [memories-home.getMemories]");
                // console.log(memoryObject);
                return memoryObject;
            }

            function getContacts(baseRelation, admin, getRelation) {
                // console.log("Home.getContacts()");
                // console.log(baseRelation);
                let contactsObject = [];
                if (baseRelation) {
                    baseRelation.forEach(relation => {
                        // console.log("Checking relation:");
                        // console.log(relation);
                        contactsObject.push({
                            id: getRelation ? relation.id : relation.owner.id,
                            name: admin ? ((relation.owner.name != null && relation.owner.name.trim() != "") ? relation.owner.name : relation.owner.username) : (relation.nickname != null && relation.nickname.trim() != "") ? relation.nickname : ((relation.contact.name != null && relation.contact.name.trim() != "") ? relation.contact.name : relation.contact.username),
                            picture: relation.contactPicture ? relation.contactPicture.url : relation.contact.profilePicture ? relation.contact.profilePicture.url : '',
                            admin: relation.isAdmin
                        });
                    });
                }
                // console.log(contactsObject);
                return contactsObject;
            }

            function getFundations(baseFund) {
                // console.log("Get Fundations");
                // console.log(baseFundations);
                let fundations = [];
                if (baseFund) {
                    baseFund.forEach(fund => {
                        fundations.push({
                            id: fund.id,
                            name: fund.name,
                            cover: fund.cover ? fund.cover.url : "",
                            desc: fund.description ? fund.description : "[-no description-]",
                            suggestedAmount: fund.suggestedAmountUSD ? fund.suggestedAmountUSD : '0.00',
                            url: fund.url
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
        async: async function(routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            var currentUser = await app.methods.getLocalValue('loggedUser');

            resolve({
                component: BirthdayMemory,
            }, {
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
        async: async function(routeTo, routeFrom, resolve, reject) {
                var router = this;
                var app = router.app;
                var userID = routeTo.params.userID;

                var baseMemories = null;
                await app.request.promise.get(`${app.data.server}/memories/?recipients.id=${userID}`).then(function(memResult) {
                    baseMemories = JSON.parse(memResult.data);
                }).catch(function(err) {
                    console.log("Error getting memories!");
                    console.log(err);
                })

                // getMemories(baseMemories);

                resolve({
                    component: MemoryDashboard,
                }, {
                    context: {
                        Server: app.data.server,
                        Memories: getMemories(baseMemories),
                        CurrentUser: userID
                    }
                })

                function getMemories(baseMem) {
                    let memObject = [];

                    baseMem.forEach(mem => {
                        memObject.push(getMemory(mem));
                    })

                    // console.log("Resulting memories");
                    // console.log(memObject);
                    return memObject;
                }

                function getMemory(baseMem) {
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
        path: '/memory/:memoryID',
        async: async function(routeTo, routeFrom, resolve, reject) {
                var router = this;
                var app = router.app;
                var memoryID = routeTo.params.memoryID;

                var baseMem = null;
                await app.request.promise.get(`${app.data.server}/memories/${memoryID}`).then(function(memResult) {
                    baseMem = JSON.parse(memResult.data);
                    // console.log("Base memory");
                    // console.log(baseMem);
                }).catch(function(err) {
                    console.log("Error fetching memories!");
                    console.log(err);
                    baseMem = null;
                })

                if (baseMem) {

                    resolve({
                        component: MemoryView,
                    }, {
                        context: {
                            Server: app.data.server,
                            Memory: getMemory(baseMem),
                        }
                    })
                } else {
                    reject();
                }

                function getMemory(baseMem) {
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
        async: async function(routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            // var currentUser = await app.methods.getLocalValue('loggedUser');

            var baseFundations;
            await app.request.promise.get(`${app.data.server}/fundations`).then(function(fundationResult) {
                baseFundations = JSON.parse(fundationResult.data);
            }).catch(function(err) {
                console.log("Error fetching fundations");
                console.log(err);
            });

            resolve({
                component: Donations,
            }, {
                context: {
                    Server: app.data.server,
                    Fundations: getFundations(baseFundations),
                }
            })

            function getFundations(baseFund) {
                // console.log("Get Fundations");
                // console.log(baseFundations);
                let fundations = [];
                if (baseFund) {
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
        async: function(routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            var userID = routeTo.params.userID;
            app.preloader.show();
            // console.log("Move to view [view-membership.async]");
            // console.log(`${app.data.server}/users/${userID} [view-membership.async]`);
            app.request.promise.json(`${app.data.server}/users/${userID}`)
                .then(function(res) {
                    // console.log("Current membership: [view-membership.json]")
                    // console.log(res.data.currentMembership);
                    let plan = GetPlanName(res.data.currentMembership);
                    if (plan === "None") {
                        app.preloader.hide();
                        reject();
                        router.navigate({
                            name: 'select-membership',
                            params: {
                                userID: res.data.id,
                                clearOnBack: "1"
                            }
                        })
                    } else {
                        let plan_name;
                        if (window.language == 'en_US') {
                            plan_name = plan + ' ' + window.localize('membership');
                        } else if (window.language == 'es_MX') {
                            plan_name = window.localize('membership') + ' ' + plan;
                        }
                        console.log(res);
                        app.preloader.hide();
                        resolve({
                            component: ViewMembership,
                        }, {
                            context: {
                                UserName: GetUserName(res.data),
                                PlanName: plan_name,
                                PlanPrice: GetPlanPrice(res.data.currentMembership),
                                BillingDate: GetNextPayDate(res.data.currentMembership),
                                BilledCard: res.data.currentMembership.billedCard
                            }
                        });
                    }
                });

            function GetUserName(user) {
                if (user === null) {
                    return "No user!";
                } else {
                    return user.username;
                }
            }

            function GetPlanName(plan) {
                console.log("GetPlanName");
                console.log(plan);
                let isMembershipNull = plan === null;
                let isPlanNull = plan.plan === null;
                if (isMembershipNull || isPlanNull) {
                    return "None";
                } else {
                    // console.log("Plan: [view-membership.async.getPlanName]");
                    // console.log(plan);
                    return plan.plan.name;
                }
            }

            function GetPlanPrice(plan) {
                if (plan === null) {
                    return "--.--";
                } else {
                    return plan.plan.costPerMonth;
                }
            }

            function GetNextPayDate(plan) {
                if (plan === null) {
                    return "----------";
                } else {
                    return plan.nextBillingDate;
                }
            }
        }
    },
    {
        name: 'payment-confirm-membership',
        path: '/membership/confirmed/session/:sessionId/plan/:planId',
        beforeEnter: [checkAuth],
        // component: PaymentConfirmMembership,
        async: async function(routeTo, routeFrom, resolve, reject) {
            var router = this;
            var app = router.app;
            console.log('enter route successuRL');
            //
            // console.log("Membership/confirmed/session/ thing");

            var stripeUrl = app.data.stripe.stripeUrl;
            var subscriptionUrl = app.data.stripe.subscriptionUrl;
            var stripeApiUrl = app.data.stripe.stripeApiUrl;
            var sessionId = routeTo.params.sessionId;
            var planId = routeTo.params.planId;
            var loggedUser = await app.methods.getLocalValue('loggedUser');
            console.log('session-ID: ' + sessionId);
            console.log('plan-ID: ' + planId);
            console.log('Logged Usr: ', loggedUser);

            var plan;
            await app.request.promise.get(`${app.data.server}/memberships/${planId}`).then(function(planRes) {
                plan = JSON.parse(planRes.data);
            }).catch(function(err) {
                console.log("Error fetching fundations");
                console.log(err);
            });

            // app.request.setup({headers: {'Authorization': 'Bearer ' + app.data.stripe.testKeys.sk}});
            let headers = {
                'Authorization': 'Bearer ' + app.data.stripe.testKeys.sk,
            }

            console.log("before stripe session promise");
            app.request.promise({
                url: stripeUrl + '/' + sessionId,
                method: "GET",
                headers: headers
            }).then(async function(sessionRes) {
                // console.log('get session result');
                // console.log(sessionRes.data);
            
                app.preloader.show('blue');
                var sessionData = JSON.parse(sessionRes.data);
                console.log("sessionData", sessionData);
                // console.log(sessionData);
                // var subId = sessionData.subscription;

                /*
                    Get paymentIntent
                    Get paymentMethod from paymentIntent
                    Check if it's different from the current one
                      if it isn't:
                        Just resolve to wherever the user is supposed to go
                      if it is:
                        Assign plan and stuff.
                */
                app.request.promise({
                    url: `${stripeApiUrl}payment_intents/${sessionData.payment_intent}`,
                    method: "GET",
                    headers: headers
                }).then(async function(payIntResult) {
                    let paymentIntentData = JSON.parse(payIntResult.data);

                    let paymentMethodData = await app.request.promise({
                        // url: `${stripeApiUrl}payment_methods/pm_1HC5gbANVxwYjCOlpqvWnOYe`,
                        url: `${stripeApiUrl}payment_methods/${paymentIntentData.payment_method}`,
                        method: "GET",
                        headers: headers
                    });
                    paymentMethodData = JSON.parse(paymentMethodData.data);
                    

                    let creationDate = new Date(paymentMethodData.created * 1000);
                    console.log("PaymentIntent: ", paymentIntentData);
                    console.log("PaymentMethod: ", paymentMethodData);
                    let membershipObject = createMembershipObject(paymentIntentData.id, creationDate, paymentMethodData.card.last4, paymentMethodData.card.brand, planId);
                    let paymentObject = createPaymentObject(paymentIntentData.id, loggedUser.id, creationDate, plan.name, (sessionData.amount_total / 100), sessionData.customer_email);
                    
                    console.log("Membership:\r\n", membershipObject);
                    console.log("Payment:\r\n", paymentObject);

                    await assignPlan(membershipObject, paymentObject);

                }).catch(function(err){
                    console.log("Error!\r\n",err);
                });

                /*
                    Gets the subscription id through the session data.
                    Looks for the specific subscription and gets its data
                    Gets the current period's start and end date.
                    Gets the payment method data
                    Checks if the subscription's status is active
                      If it is:
                        Creates a membershipObject and a paymentObject.
                        Gets the currently logged user's info from DB
                        Checks if the membership info is the same as the one currently on DB.
                          If it is:
                            No need to update anything, just take the user to PaymentConfirmMembership.
                          if it isn't:
                            assigns the new membership & payment info to the user and then takes the user to PaymentConfirmMembership.
                      If it isn't:
                        The current membership isn't active, this shouldn't even happen tho.
                */

                /*app.request.promise({
                    url: `${subscriptionUrl}/${subId}`,
                    method: "GET",
                    headers: headers
                }).then(async function(subRes) {
                    console.log("Then start");
                    var subData = JSON.parse(subRes.data);
                    // console.log("Get subscription intent");
                    // console.log(subData);
                    let epochStartDate = subData.current_period_start;
                    let epochEndDate = subData.current_period_end;

                    let readableStartDate = new Date(epochStartDate * 1000);
                    let readableEndDate = new Date(epochEndDate * 1000);

                    console.log("Before paymentMethodData");
                    var paymentMethodData = await app.request.promise({
                        // url: `${stripeApiUrl}payment_methods/pm_1HC5gbANVxwYjCOlpqvWnOYe`,
                        url: `${stripeApiUrl}payment_methods/${subData.default_payment_method}`,
                        method: "GET",
                        headers: headers
                    });

                    paymentMethodData = JSON.parse(paymentMethodData.data);

                    // console.log("PaymentMethod info");
                    // console.log(paymentMethodData);

                    // if (subData.status === "active") {
                        let membershipObject = createMembershipObject(subData.id, readableEndDate, paymentMethodData.card.last4, paymentMethodData.card.brand, planId);
                        let paymentObject = createPaymentObject(subData.id, loggedUser.id, readableStartDate, plan.name, (sessionData.amount_total / 100), sessionData.customer_email);
                        // let userInfo = await app.request({url: `${app.data.server}/users/${loggedUser.id}`, method: 'GET'});
                        let userInfo;
                        await app.request.promise.json(`${app.data.server}/users/${loggedUser.id}`).then(function(res) {
                            userInfo = res.data;
                        });

                        // let paymentObject = createPaymentObject();

                        // console.log("");
                        // console.log("User Info");
                        // console.log(userInfo);
                        console.log("Membership object");
                        console.log(membershipObject);
                        // console.log("Payment Object");
                        // console.log(paymentObject);

                        if (!isMembershipTheSame(userInfo.currentMembership, membershipObject.currentMembership)) {
                            await assignPlan(membershipObject, paymentObject);
                        } else {
                            app.preloader.hide();

                            resolve({ component: PaymentConfirmMembership });
                        }

                    // } else {
                    //     console.log("Subscription isn't active, what do? This shouldn't even be possible D:");
                    // }
                })*/
            }).catch(function(err) {
                console.log("Error on sessionID promise");
                console.log(err);
            })

            function isMembershipTheSame(userMembership, newMembership) {
                if (userMembership === null || userMembership.plan === null) {
                    return false;
                }
                let billingDate = (userMembership.nextBillingDate === newMembership.nextBillingDate);
                let plan = (userMembership.plan.id.toString() === newMembership.plan.toString());
                let token = (userMembership.token === newMembership.token);
                let billedCard = (userMembership.billedCard === newMembership.billedCard);

                // console.log(`(${userMembership.nextBillingDate}) vs (${newMembership.nextBillingDate}) = ${billingDate}`);
                // console.log(`(${userMembership.plan.id}) vs (${newMembership.plan}) = ${plan}`);
                // console.log(`(${userMembership.token}) vs (${newMembership.token}) = ${token}`);
                // console.log(`(${userMembership.billedCard}) vs (${newMembership.billedCard}) = ${billedCard}`);

                if (billingDate && plan && token && billedCard) {
                    return true;
                }
                return false;
            }

            async function assignPlan(membershipObject, paymentObject) {
                console.log("---- Assigning plan ----");
                await app.request.promise.get(`${app.data.server}/users/${loggedUser.id}`).then(async function(userRes) {
                    // console.log("Inserting membership");
                    await app.request({
                        url: `${app.data.server}/users/${loggedUser.id}`,
                        method: 'PUT',
                        data: membershipObject
                    });
                    // var loggedUser = await app.methods.getLocalValue('loggedUser');
                    var userEmail = loggedUser.email;
                    await app.request.promise.postJSON(`${app.data.server}/payments`, paymentObject)
                    await app.methods.updateCurrentUser();
                    //If no errors present
                    // app.views.main.router.navigate('/membership/confirmed');

                    // console.log("Going to payment confirm como no");
                    app.preloader.hide();

                    resolve({ component: PaymentConfirmMembership });
                }).catch(function(err) {
                    console.log(`There was an error fetching the current user (id: ${loggedUser.id})`);
                    console.log(err);
                })
            }

            function createMembershipObject(token, nextBillingDate, billedCard, cardBrand, planId) {
                let object = {
                    "currentMembership": {
                        "token": token,
                        "isActive": true,
                        "nextBillingDate": formatDate(nextBillingDate, true, true),
                        "plan": planId,
                        "billedCard": `${cardBrand} **** **** **** ${billedCard}`
                    }
                }
                return object;
            }

            function createPaymentObject(token, userId, date, planName, amountUSD, userEmail) {
                let object = {
                    "token": token,
                    "user": userId,
                    "date": formatDate(date, false, false),
                    "concept": `${capitalize(planName)} membership for HeavenSent`,
                    "amountUSD": `${amountUSD}`,
                    "userEmail": userEmail
                }
                return object;
            }

            function formatDate(date, includeTime, futureDate) {
                let hour = date.getHours();
                let dd = String(date.getDate()).padStart(2, '0');
                let mm = String(date.getMonth() + 1).padStart(2, '0');
                let yyyy = futureDate ? date.getFullYear() + 10 : date.getFullYear();

                let result;

                if (includeTime) {
                    result = `${yyyy}-${mm}-${dd}T${hour}:00:00.000Z`;
                } else {
                    result = `${yyyy}-${mm}-${dd}`;
                }
                return result;
            }

            function capitalize(text) {
                if (typeof text !== 'string') return ''
                return text.charAt(0).toUpperCase() + text.slice(1);
            }
        }
    },
    {
        name: 'membership-change-confirmed',
        path: '/membership/change/confirmed',
        beforeEnter: [checkAuth, isMembershipValid],
        component: MembershipChangeConfirm,
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
        async: function(routeTo, routeFrom, resolve, reject) {
            // Router instance
            var router = this;

            // App instance
            var app = router.app;

            // Show Preloader
            app.preloader.show();

            // User ID from request
            var userId = routeTo.params.userId;

            // Simulate Ajax Request
            setTimeout(function() {
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
        async: function(routeTo, routeFrom, resolve, reject) {
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
            setTimeout(function() {
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