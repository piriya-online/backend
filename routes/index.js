var routes = require('../routes')
  , config = require('../config.js')
  , util = require('../objects/util')
  , fs = require('fs');

exports.index = function(req, res, screen, script, param1, param2){

	try {
		var json = JSON.parse(util.decrypt( req.cookies.screenInfo.toString(), req.signedCookies.authKey.toString() ));
		var canAccess = false;

		var sp = req.url.split('/');
		var url = '';
		for(i=1; i<sp.length; i++) {
			url += '/'+sp[i];
			if ( i == 2 ) break; 
		}

		for(var page in json) {
			if ( json[page].link == url ) {
				canAccess = true;
				break;
			}
			if ( json[page].hasChild ) {
				for(var subScreen in json[page].child) {
					if ( json[page].child[subScreen] == url ) {
						canAccess = true;
						break;
					}
				}
			}
		}

		screen = (canAccess) ? screen : 'permission';

		var screenConfig = {};
		screenConfig.screen = screen;
		screenConfig.title = res.__('screen-'+screen+'-header');
		screenConfig.titleDesc = res.__('screen-'+screen+'-detail');
		screenConfig.language = req.cookies.language;
		screenConfig.apiUrl = config.apiUrl;
		screenConfig.refererUrl = config.refererUrl;
		screenConfig.authKey = req.signedCookies.authKey.toString();
		screenConfig.menu = json;
		var info = JSON.parse(util.decrypt( req.cookies.memberInfo.toString(), req.signedCookies.authKey.toString() ));
		res.render(screen, { config: screenConfig, info: info[0], script: script}, function(err, html) {
			if(err) {
				res.render('error', { method: 'exports.index', err: err, message: '' });
			} else {
				res.end(html);
			}
		});
	}
	catch(err) {
		res.end('error : '+err );
		//res.render('error', { method: 'exports.index', err: err, message: JSON.stringify(JSON.parse(data),null,2) });
	}
};

exports.process = function(req, res, next, action, data){
	if (action == 'checkAuth') {
		//console.log(data);
		try {
			var obj = JSON.parse(data);
			if ( typeof obj.result[0][0] != 'undefined' ) {
				if ( obj.result[0][0].cnt == '1' ) {
					global.permission = {};
					if ( typeof obj.result[1][0] == 'undefined' ) {
						permission.insert = '';
						permission.update = '';
						permission.delete = '';
					}
					else {
						permission.insert = (obj.result[1][0].canInsert) ? obj.result[1][0].keyInsert : '';
						permission.update = (obj.result[1][0].canUpdate) ? obj.result[1][0].keyUpdate : '';
						permission.delete = (obj.result[1][0].canDelete) ? obj.result[1][0].keyDelete : '';
					}

					if ( req.cookies.url == '/member/profile' && req.url != '/initial') {
						res.redirect('/initial');
					}
					else {
						next();
					}
				}
				else {
					res.redirect('/logout');
				}
			}
			else {
				res.redirect('/logout');
			}
		}
		catch(err) {
			res.send('data : '+data+'<br>checkAuth : ' + err);
		}
	}
	else if (action == 'getMemberInfo') {
		try {
			var obj = JSON.parse(data);

			var screen = {};
			if ( typeof obj.result != 'undefined' ) {
				for(i=0; i<obj.result[1].length; i++) {
					if ( obj.result[1][i].parent == null || obj.result[1][i].parent == '' ) {
						screen[obj.result[1][i].screen] = {};
						screen[obj.result[1][i].screen].link = obj.result[1][i].link;
						screen[obj.result[1][i].screen].icon = obj.result[1][i].icon;
						screen[obj.result[1][i].screen].hasChild = false;
						screen[obj.result[1][i].screen].child = {};
					}
					else {
						screen[obj.result[1][i].parent].hasChild = true;
						screen[obj.result[1][i].parent].child[ obj.result[1][i].screen ] = {};
						screen[obj.result[1][i].parent].child[ obj.result[1][i].screen ] = obj.result[1][i].link.toString();
					}
				}

				if (obj.correct) {
					var ref = (typeof req.headers.referer != 'undefined') ? req.headers.referer : '';
					res.cookie('memberInfo', util.encrypt(JSON.stringify(obj.result[0]).toString(), obj.authKey.toString()), {secure: true, expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
					res.cookie('screenInfo', util.encrypt(JSON.stringify(screen).toString(), obj.authKey.toString()), {secure: true, expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
					res.redirect( (req.cookies.url == '/logout' || req.cookies.url == '/initial') ? '/' : ((ref.indexOf('/teamwork') != -1) ? '/member/profile' : req.cookies.url) ); //res.redirect(req.cookies.url);
					//res.send('req.cookies.url : '+req.cookies.url );
				}
				else {
					res.redirect('/logout');
				}
			}
			else {
				res.redirect('/logout');
			}
		}
		catch(err) {
			res.render('error', { method: 'getMemberInfo', err: err, message: JSON.stringify(JSON.parse(data),null,2) });
		}
	}
	else if (action == 'logout') {
		res.clearCookie('memberInfo');
		res.clearCookie('screenInfo');
		res.clearCookie('authKey');
		res.redirect(config.loginUrl);
	}
};