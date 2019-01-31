var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, favicon = require('serve-favicon')
	, logger = require('morgan')
	, methodOverride = require('method-override')
	, bodyParser = require('body-parser')
	, errorHandler = require('errorhandler')
	, cookieParser = require('cookie-parser')
	, path = require('path')
	, config = require('./config.js')
	, i18n = require('i18n')
	, querystring = require('querystring')
	, fs = require('fs')
	, util = require('./objects/util')
	, request = require('request')

i18n.configure({
	locales: ['th', 'en'],
	defaultLocale: 'th',
	directory: __dirname + '/locales'
});

var app = express();

app.set('port', config.port || 9999);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(i18n.init);
app.use(cookieParser(config.cookie.password));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
	app.use(errorHandler());
}

app.get('*', function(req, res, next) {

	if (typeof req.cookies.language == 'undefined') {
		res.cookie('language', 'th', {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
		req.setLocale('th');
	} else {
		req.setLocale(req.cookies.language);
	}
	//req.setLocale('th');
	res.cookie('url', req.url, {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});

	if ( req.url.indexOf('/language') == -1 &&
		req.url.indexOf('/auth') == -1 &&
		req.url.indexOf('/initial') == -1 &&
		req.url.indexOf('/logout') == -1
	) {
		if (typeof req.signedCookies.authKey != 'undefined') {
			/*var postString = querystring.stringify({
				authKey : req.signedCookies.authKey,
				system : 'backend',
				screen : req.url
			});*/
			request.post({headers: { 'referer': config.refererUrl }, url: config.apiPostUrl + '/member/screen/permission', form: {
					authKey: req.signedCookies.authKey,
					system: 'backend',
					screen: req.url
				} }, function (error, response, body) {
				routes.process(req, res, next, 'checkAuth', body);
			});
		}
		else {
			res.redirect(config.loginUrl);
		}
	}
	else {
		next();
	}

});


app.get('/language/:lang', function(req, res) {
	res.cookie('language', req.params.lang, {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	res.cookie('url', '/', {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	req.setLocale(req.params.lang);
	res.redirect(req.cookies.url);
});

app.get('/auth/:authKey/:lang/:remember', function(req, res, next) {
	if (req.params.remember == '1')
		res.cookie('authKey', req.params.authKey, {signed: true, secure: true, expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	else
		res.cookie('authKey', req.params.authKey, {signed: true, secure: true});

	res.cookie('language', req.params.lang, {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	res.cookie('url', '/', {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});

	/*var postString = querystring.stringify({
		authKey : req.params.authKey
	});*/
	//util.postData(req, res, next, routes, 'getMemberInfo', '/member/info/auth', postString);
	request.post({headers: { 'referer': config.refererUrl }, url: config.apiPostUrl + '/member/info/auth', form: {
			authKey: req.params.authKey
		} }, function (error, response, body) {
		routes.process(req, res, next, 'getMemberInfo', body);
	});
});

app.get('/initial', function(req, res, next) {
	/*var postString = querystring.stringify({
		authKey : req.signedCookies.authKey
	});*/
	//util.postData(req, res, next, routes, 'getMemberInfo', '/member/info/auth', postString);
	request.post({headers: { 'referer': config.refererUrl }, url: config.apiPostUrl + '/member/info/auth', form: {
			authKey: req.signedCookies.authKey
		} }, function (error, response, body) {
		routes.process(req, res, next, 'getMemberInfo', body);
	});
});

app.get('/logout', function(req, res, next) {
	var querystring = require('querystring');
	var util = require('./objects/util');
	/*var postString = querystring.stringify({
		authKey : req.signedCookies.authKey
	});
	util.postData(req, res, next, routes, 'logout', '/member/logout', postString);*/
	request.post({headers: { 'referer': config.refererUrl }, url: config.apiPostUrl + '/member/logout', form: {
			authKey : req.signedCookies.authKey
		} }, function (error, response, body) {
		routes.process(req, res, next, 'logout', body);
	});

});


app.get('/', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/dashboard.js', function (exists) {
		routes.index(req, res, 'dashboard', exists ? '/javascripts/dashboard.js' : null);
	});
});

app.get('/teamwork', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/teamwork.js', function (exists) {
		routes.index(req, res, 'teamwork', exists ? '/javascripts/teamwork.js' : null);
	});
});

app.get('/product/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/product-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'product-'+req.params.action, exists ? '/javascripts/product-'+req.params.action+'.js' : null);
	});
});

app.get('/product', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/product.js', function (exists) {
		routes.index(req, res, 'product', exists ? '/javascripts/product.js' : null);
	});
});

app.get('/cart', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/cart.js', function (exists) {
		routes.index(req, res, 'cart', exists ? '/javascripts/cart.js' : null);
	});
});

app.get('/commission', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/commission.js', function (exists) {
		routes.index(req, res, 'commission', exists ? '/javascripts/commission.js' : null);
	});
});

app.get('/member/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/member-'+req.params.action+'.js', function (exists) {
		//console.log('cccc'+exists+'ddd');
		routes.index(req, res, 'member-'+req.params.action, exists ? '/javascripts/member-'+req.params.action+'.js' : null);
	});
});

app.get('/receivable/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/receivable-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'receivable-'+req.params.action, exists ? '/javascripts/receivable-'+req.params.action+'.js' : null);
	});
});

app.get('/admin/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/admin-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'admin-'+req.params.action, exists ? '/javascripts/admin-'+req.params.action+'.js' : null);
	});
});

app.get('/report/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/report-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'report-'+req.params.action, exists ? '/javascripts/report-'+req.params.action+'.js' : null);
	});
});

app.get('/customer/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/customer-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'customer-'+req.params.action, exists ? '/javascripts/customer-'+req.params.action+'.js' : null);
	});
});

app.get('/customer/info/:id/:member', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/customer-info.js', function (exists) {
		routes.index(req, res, 'customer-info', exists ? '/javascripts/customer-info.js' : null, req.params.id, req.params.member);
	});
});

app.get('/sales/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/sales-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'sales-'+req.params.action, exists ? '/javascripts/sales-'+req.params.action+'.js' : null);
	});
});

app.get('/shop/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/shop-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'shop-'+req.params.action, exists ? '/javascripts/shop-'+req.params.action+'.js' : null);
	});
});

app.get('/transport/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/transport-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'transport-'+req.params.action, exists ? '/javascripts/transport-'+req.params.action+'.js' : null);
	});
});

app.get('/transport', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/transport.js', function (exists) {
		routes.index(req, res, 'transport', exists ? '/javascripts/transport.js' : null);
	});
});

app.get('/news', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/news.js', function (exists) {
		routes.index(req, res, 'news', exists ? '/javascripts/news.js' : null);
	});
});

app.get('/news/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/news-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'news-'+req.params.action, exists ? '/javascripts/news-'+req.params.action+'.js' : null);
	});
});

app.get('/data/:action', function(req, res) {
	fs.exists('/data/www/production/remaxthailand/24fin-backend/public/javascripts/data-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'data-'+req.params.action, exists ? '/javascripts/data-'+req.params.action+'.js' : null);
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function requireHTTPS(req, res, next) {
    if (!req.get('x-arr-ssl')) {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}
