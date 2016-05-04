var config = {};
var templates = {};
var latestComics = [];
var popularComics = [];

$(document).ready(function() {
	compileTemplates(templates);
	loadSiteConfig(config, [showHeader]);
	getComics(popularComics, 'popular', [showPopularComicsBlock]);
	getComics(latestComics, 'latest', [showLatestComicsBlock]);
});;

function compileTemplates(templates) {
	templates = templates || {};

	//Header
	templates.header = Handlebars.compile($('#header-template').html());
	templates.comicsBlock = Handlebars.compile($('#comic-postal-template').html());
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
	showComicBlock('Popular Comics', '.main-section', popularComics);
}

function showLatestComicsBlock() {
	showComicBlock('Latest Comics', '.main-section', latestComics);
}

function showComicBlock(blockTitle, selector, comics) {
	comics = comics || [];
	if (comics.length) {
		var html = templates.comicsBlock({
			blockTitle: blockTitle,
			comics: comics
		});
		$(selector).append(html);
	}
}