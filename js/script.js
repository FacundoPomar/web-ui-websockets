var config = {},
	templates = {},
	latestComics = [],
	popularComics = [],
	mainSection = '.main-section',
	loginErrorSection = '.login .loginError',
	dinamicNavbarSection = '.navbar .dinamicNavbar',
	navbarButtonsSection = '.navbarButtons',
	userInfo = null,
	errors = {
		credentials: 'It was an error with your credentials'
	};

try {
	userInfo = JSON.parse(localStorage.getItem('user'));
	console.log(userInfo);
} catch (err) {
	console.error('On parse localStorage user Info');
}


$(document).ready(function() {
	compileTemplates(templates);
	loadSiteConfig(config, [showHeader, showFooter]);
	setLoggedUser(
		[],
		[],
		[updateDinamicNavbar, updateNavbarButtons]
	);
});;

function compileTemplates(templates) {
	templates = templates || {};

	templates.header = Handlebars.compile($('#header-template').html());
	templates.comicsBlock = Handlebars.compile($('#comic-postal-template').html());
	templates.footer = Handlebars.compile($('#footer-template').html());
	templates.viewComic = Handlebars.compile($('#view-comic-template').html());
	templates.viewComicNotFound = Handlebars.compile($('#view-comic-not-found-template').html());
	templates.viewSitemap = Handlebars.compile($('#view-sitemap-template').html());
	templates.viewNotFound = Handlebars.compile($('#view-not-found-template').html());
	templates.viewLogin = Handlebars.compile($('#view-login-template').html());
	templates.viewDinamicNavbar = Handlebars.compile($('#view-dinamicNavbar-template').html());
	templates.viewNavbarButtons = Handlebars.compile($('#view-navbar-buttons-template').html());
	templates.viewPage = Handlebars.compile($('#view-page-template').html());
	templates.viewProfile = Handlebars.compile($('#view-profile-template').html());
}

function openProfile() {

	if (userInfo && userInfo.checked) {
		var conn = new WebSocket('ws://localhost:9090/profile');

		conn.onopen = function() {
			var data = JSON.stringify({
				username: userInfo.username,
				hash: userInfo.hash
			});
			conn.send(data);
		}

		conn.onmessage = function(e) {
			try {
				var data = JSON.parse(e.data);
				if (data.response === 'ok') {
					viewProfile(data.profile);
				} else {
					openErrorPage(data.error);
				}
			} catch (err) {
				openErrorPage(data.error);
			}
		};
	} else {
		openErrorPage(errors.credentials);
	}
}

function openErrorPage(msg) {
	console.error(msg);
}

function viewProfile(profile) {
	if (templates && templates.viewProfile) {
		$(mainSection).slideUp(function () {
			$(this)
				.html(templates.viewProfile(profile))
				.slideDown();
		});
	}
}

function openPage(slug) {

	if (userInfo && userInfo.checked) {
		var conn = new WebSocket('ws://localhost:9090/page/' + slug);

		conn.onmessage = function(e) {
			try {
				var data = JSON.parse(e.data);
				viewPage(data.page);
			} catch (err) {
				console.log('Error on site config loading: ' + err);
			}
		};
	} else {
		openNotFound();
	}
}

function viewPage(page) {
	if (templates && templates.viewPage) {
		$(mainSection).slideUp(function () {
			$(this)
				.html(templates.viewPage(page))
				.slideDown();
		});
	}
}

function updateNavbarButtons() {

	if (templates && templates.viewNavbarButtons) {
		var html = templates.viewNavbarButtons({
			logged: !!userInfo
		});
		$(navbarButtonsSection).html(html);
	}
}


function loadSiteConfig(config, observers) {
	var conn = new WebSocket('ws://localhost:9090/siteconfig');

	conn.onmessage = function(e) {
		try {
			var data = JSON.parse(e.data);
			config = $.extend(config, data);
			for (var i = observers.length - 1; i >= 0; i--) {
				observers[i]();
			};
		} catch (err) {
			console.log('Error on site config loading: ' + err);
		}
	};

}

function showHeader() {
	config = config || {};
	if (templates && templates.header) {
		var html = templates.header(config);
		$('.header-container').html(html);
	}
}

function showFooter() {
	config = config || {};
	if (templates && templates.footer) {
		var html = templates.footer(config.footer);
		$('.footer-section').html(html);
		// HERE call to bind click event on some links. Due the lack of frontend routing framework
	}
}

function getComics(comics, type, observers) {
	var conn = new WebSocket('ws://localhost:9090/comics/' + type);

	conn.onmessage = function(e) {
		try {
			var data = JSON.parse(e.data);
			if (data.comics) {
				for (var i = 0;  i < data.comics.length; i++) {
					comics.push(
						new Comic(data.comics[i])
					);
				}
			}
			for (var i = observers.length - 1; i >= 0; i--) {
				observers[i]();
			};
		} catch (err) {
			console.log('Error on comics loading: ' + err);
		}
	};
}

function showPopularComicsBlock() {
	showComicBlock('Popular Comics', mainSection, popularComics);
}

function showLatestComicsBlock() {
	showComicBlock('Latest Comics', mainSection, latestComics);
}

function showComicBlock(blockTitle, selector, comics) {

	comics = comics || [];

	if (comics.length && templates && templates.comicsBlock) {
		var blockClass = blockTitle.split(' ').join('').toLowerCase(),
			html = templates.comicsBlock({
				blockTitle: blockTitle,
				blockClass: blockClass,
				comics: comics
			});
		$(selector).append(html);
	}
}

function openComic(id) {
	var conn = new WebSocket('ws://localhost:9090/comic/' + id);

	conn.onmessage = function (e) {
		try {
			var data = JSON.parse(e.data);
			if (data.comic) {
				var comic = new Comic(data.comic);
				viewComic(comic);
			} else {
				viewComicNotFound(id);
			}
		} catch (err) {

		}
	}
}
//Refactor ME
function viewComic(comic) {

	if (templates && templates.viewComic) {
		$(mainSection).slideUp(function () {
			$(this)
				.html(templates.viewComic(comic))
				.slideDown();
		});
	}

}

function viewComicNotFound(id) {

	if (templates && templates.viewComicNotFound) {
		$(mainSection).slideUp(function () {
			$(this)
				.html(templates.viewComicNotFound({id: id}))
				.slideDown();
		});
	}
}

function openHome() {
	$(mainSection).slideUp(function () {
			$(this).html('');
			popularComics = [];
			latestComics = [];
			getComics(popularComics, 'popular', [showPopularComicsBlock]);
    		getComics(latestComics, 'latest', [showLatestComicsBlock]);
			$(this).slideDown('slow');
	});
}

function openSitemap() {
	$(mainSection).slideUp(function () {
			$(this)
				.html(templates.viewSitemap())
				.slideDown();
	});
}

function openNotFound() {
	$(mainSection).slideUp(function () {
			$(this)
				.html(templates.viewNotFound())
				.slideDown();
	});
}

function setLoggedUser(observers, negativeObservers, alwaysObservers) {

	if (userInfo) {
		var conn = new WebSocket('ws://localhost:9090/login');

		conn.onopen = function () {
			var data = {
				action: 'autologin',
				hash: userInfo.hash,
				username: userInfo.username
			};
			conn.send(JSON.stringify(data));
		}

		conn.onmessage = function (e) {
			try {
				var result = JSON.parse(e.data);
				console.info('Auto Login', result);
				if (result.response === 'ok') {
					userInfo.checked = true;
					for (var i = observers.length - 1; i >= 0; i--) {
						observers[i]();
					};
				} else {
					clearLoginInfo([updateDinamicNavbar]);
				}
				for (var i = alwaysObservers.length - 1; i >= 0; i--) {
					alwaysObservers[i]();
				};
			} catch (err) {
				//catch me
			}
		}

	} else {
		for (var i = negativeObservers.length - 1; i >= 0; i--) {
			negativeObservers[i]();
		};
	}
	for (var i = alwaysObservers.length - 1; i >= 0; i--) {
		alwaysObservers[i]();
	};
}

function updateDinamicNavbar() {

	if (templates && templates.viewDinamicNavbar) {
		var user = (userInfo && userInfo.username),
			data = {
				items: []
			};
		if (user) {
			data.items.push({url: '#/profile', class: 'dinamicNavbar_profile', title: 'get into my profile', caption: user})
			data.items.push({url: '#/logout', class: '', title: 'Logout from the system', caption: 'Logout'})
		} else {
			data.items.push({url: '#/login', class: '', title: 'Login the system', caption: 'Login'})
		}
		$(dinamicNavbarSection).html(templates.viewDinamicNavbar(data));
	}
}

function saveLoginInfo(username, hash) {
	var data = {
		username: username,
		hash: hash
	}
	localStorage.setItem('user', JSON.stringify(data));
	data.checked = true;
	userInfo = data;
}

function clearLoginInfo(observers) {
	localStorage.removeItem('user');
	userInfo = null;
	for (var i = observers.length - 1; i >= 0; i--) {
		observers[i]();
	};
}

function openLogin() {

	function showLoginError(error) {
		$(loginErrorSection).slideUp(function () {
			$(this)
				.html(error)
				.slideDown();
		});
	}

	function checkLogin(data) {
		var conn = new WebSocket('ws://localhost:9090/login'),
			user = data.loginUser || '';

		conn.onopen = function () {
			data.action = 'login';
			conn.send(JSON.stringify(data));
		}

		conn.onmessage = function (e) {
			try {
				var resp = JSON.parse(e.data);
				if (resp.response === 'ok') {
					saveLoginInfo(user, resp.hash);
					updateDinamicNavbar();
					updateNavbarButtons();
					window.location.href = '#/';
				} else {
					showLoginError(resp.error);
				}
			} catch (err) {
				showLoginError(err);
			}
		}

	}

	function bindLoginEvent() {
		$(".loginForm").on('submit', function(e) {
			e.preventDefault();
			checkLogin($( this ).serializeObject());
		});
	}

	$(mainSection).slideUp(function () {
			$(this)
				.html(templates.viewLogin())
				.slideDown();
				bindLoginEvent();
	});
}

function logOut() {
	clearLoginInfo([updateDinamicNavbar, updateNavbarButtons]);
	window.location.href = '#/';
}