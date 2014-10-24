/*jslint
  node: true*/

'use strict';

/**********************************
 * MODULE DEPENDENCIES
 **********************************/

var express          = require('express')
  , fs               = require('fs')
  , index            = require('./routes/index')
  , landing          = require('./routes/landing')
  , register         = require('./routes/register')
  , http             = require('http')
  , path             = require('path')
  , c                = require('nconf')
  , db               = require('./modules/db.js')
  , db2              = require('./modules/db2.js')
  , admin            = require('./routes/admin')
  , account          = require('./routes/account')
  , contact          = require('./routes/contact')
  , redirects        = require('./routes/redirects')
  , post             = require('./routes/post')
  , api              = require('./routes/api')
  , jwt              = require('jwt-simple')
  , moment           = require('moment')
  , qs               = require('querystring')
  , app = module.exports = express()
  , port             = 3000;

// Load the configuration file with our keys in it, first from the env variables
// then from the config.json file
c.env().file({ file: 'config.json'});

/**********************************
 * AUTHENTICATION
 **********************************/
var TWITTER_CONSUMER_KEY       = c.get('TWITTER_CONSUMER_KEY')
  , TWITTER_CONSUMER_SECRET    = c.get('TWITTER_CONSUMER_SECRET')
  , TWITTER_CALLBACK_URL       = c.get('TWITTER_CALLBACK_URL')
  , WINDOWS_LIVE_CLIENT_ID     = c.get('WINDOWS_LIVE_CLIENT_ID')
  , WINDOWS_LIVE_CLIENT_SECRET = c.get('WINDOWS_LIVE_CLIENT_SECRET')
  , WINDOWS_LIVE_CALLBACK_URL  = c.get('WINDOWS_LIVE_CALLBACK_URL')
  , TOKEN_SECRET             = c.get('SESSION_SECRET');

/**********************************
 * SETTINGS / MIDDLEWARE
 **********************************/
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger());
app.use(express.compress());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: TOKEN_SECRET }));

/**************
 * Robots.txt redirect
 **************/
app.use(function(req, res, next){
  var onAzure = req.host.indexOf("azurewebsites") > -1;
  if(req.url === '/robots.txt' && onAzure){
    req.url = '/robots-azure.txt';
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.use(function(err, req, res, next) {
  res.render('error', { message : err });
});

/**************
 * Login Required Middleware
 **************/
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }

    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, TOKEN_SECRET);

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }

    req.user = payload.sub;
    next();
}

/****************
* JWT TIME
***************/
function createToken(user) {
    var payload = {
        sub: user.id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, TOKEN_SECRET);
}


/**********************************
 * ROUTES
 **********************************/
app.get('/', index.homepage);
app.get('/sharepoint', landing.sharepoint);
app.get('/sharepoint/register', register.sharepoint);
app.get('/powerplay/register', register.powerplay);
app.get('/power-bi/register', register.powerbi);
app.get('/pdx-power-bi/register', register.pdxpowerbi);

app.get('/post', post.index);
app.get('/post/category/:category', post.category);
app.get('/post/topic/:topic', post.topic);
app.get('/post/:id', post.get);

app.post('/contact', contact.index);
app.post('/csv', register.csv);

app.get('/admin', admin.index);

/*****************
 * API
 ****************/

/* POSTS */
app.get('/api/posts', api.posts.getPosts);
app.get('/api/posts/category/:category', api.posts.getPosts);
app.get('/api/posts/topic/:topic', api.posts.getPosts);
app.get('/api/posts/:id', api.posts.getPostByID);
app.post('/api/posts', api.posts.createPost);
app.patch('/api/posts/:id', api.posts.updatePost);
app.delete('/api/posts/:id', api.posts.deletePost);

/*****************
 * TWITTER
 ****************/


/*****************
 * WINDOWS LIVE
 ****************/


/*****************
 * Old Site Redirects
 ****************/

app.get('/blogs/post/*', redirects);
app.get('/analytics', function(req, res) { res.redirect('/post/120085') });

/*****************
 * 404 Redirect
 ****************/
// TODO: this the wrong way to send a 404, it should be
// `res.status(404).render('404');` but that doesn't render correctly on Azure.
app.get('/*', function(req, res) { res.render('404'); });


/**********************************
 * START THE SERVER, SCOTTY!
 **********************************/
app.listen(process.env.PORT || port);
console.log('Express server listening on port ' + port);

/**********************************
 * MIDDLEWARE
 **********************************/
function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/admin/login');
}

function authAdmin(req, res, next) { // They are authenticated and authorized
  if (req.isAuthenticated() && req.user.IsAdmin === true) { return next(); }
  res.redirect('/admin/notadmin');
}
