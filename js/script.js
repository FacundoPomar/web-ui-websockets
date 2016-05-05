var config = {};
var templates = {};
var latestComics = [];
var popularComics = [];
var mainSection = '.main-section';

$(document).ready(function() {
	compileTemplates(templates);
	loadSiteConfig(config, [showHeader, showFooter]);
});;

function compileTemplates(templates) {
	templates = templates || {};

	templates.header = Handlebars.compile($('#header-template').html());
	templates.comicsBlock = Handlebars.compile($('#comic-postal-template').html());
	templates.footer = Handlebars.compile($('#footer-template').html());
	templates.viewComic = Handlebars.compile($('#view-comic-template').html());
	templates.viewComicNotFound = Handlebars.compile($('#view-comic-not-found-template').html());
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