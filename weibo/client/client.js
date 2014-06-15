Session.setDefault('currentUrl', {index: 'active', login: '', reg: ''});
Session.setDefault('info', {success: '', error: ''});
Template.info.info = function () {
    return Session.get('info');
};

Template.container.currentUrl = function () {
    return Session.get('currentUrl');
};

Template.nav.active = function () {
    return Session.get('currentUrl');
};

Template.reg.events({
    'click #submit': function (evt) {
        evt.preventDefault();
        var $username = $('#username').val();
        var $password = $('#password').val();
        var $password_repeat = $('#password-repeat').val();
        if($password === 0 || $username.length === 0) {
            Session.set('info', {success: '', error: "username or password can't be blank!"});
            return;
        }
        if($password !== $password_repeat) {
            Session.set('info', {success: '', error: 'password not equal password_repeat!'});
            return;
        }
                
        Accounts.createUser({
            username: $username, 
            password: $password
        },
            function (err) {
                if(err) {
                    Session.set('info', {success: '', error: err.reason});
                } else {
                    Router.redirect('/');
                    Session.set('info', {success: 'registion successfully', error: ''});
                }
            } 
        );
    }
});

var urlRouter = Backbone.Router.extend({
    routes: {
        '' : 'index',
        'login' : 'login',
        'reg' : 'reg',
        'logout' : 'logout'
    },
    index: function () {
        // do something
        Session.set('currentUrl', {index: 'active', login: '', reg: ''});
    },
    login: function () {
        // do something
        if (Meteor.userId()) {
            this.navagate('/', true);
            Session.set('info', {success: '', error: 'user already logined!'});
            return;
        }
        Session.set('currentUrl', {index: '', login: 'active', reg: ''});
    },
    reg: function () {
        // do something
        if(Meteor.userId()) {
            this.navigate('/', true);
            Session.set('info', {success: '', error: 'user already logined!'});
            return;
        }
        Session.set('currentUrl', {index: '', login: '', reg: 'active'});
    },
    logout: function () {
        if(Meteor.userId()) {
            Meteor.logout();
            this.navigate('/', true);
            Session.set('info', {success: 'logout successfully!', error: ''});
        } else {
            this.navigate('/', true);
            Session.set('info', {success: '', error: 'user is offline!'});
        }
    },
    redirect: function (url) {
        console.log(typeof this.navigator);
        this.navigate(url, true);
    }
});

Router = new urlRouter;

Meteor.startup(function () {
    Backbone.history.start({pushState: true});
});
