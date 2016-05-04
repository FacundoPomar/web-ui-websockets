var config = {};
var templates = {};
var comics = [];

$(document).ready(function() {
	compileTemplates(templates);
	loadSiteConfig(config, [showHeader]);
	getComics(comics, [showComicsBlock]);
});;

function compileTemplates(templates) {
	templates = templates || {};

	//Header
	templates.header = Handlebars.compile($('#header-template').html());
	templates.comicsBlock = Handlebars.compile($('#comic-postal-template').html());
}


function loadSiteConfig(config, observers) {
	var conn = new WebSocket('ws://localhost:9090/siteconfig');

	conn.onopen = function(e) {
    	conn.send('');
	};

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

function getComics(comics, observers) {
	var conn = new WebSocket('ws://localhost:9090/comics');

	conn.onopen = function(e) {
    	conn.send(JSON.stringify({type: 'get'}));
	};

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

function showComicsBlock() {
	comics = comics || [];
	if (comics.length) {
		var html = templates.comicsBlock({
			title: 'Popular Comics',
			comics: comics
		});
		$('.main-section').append(html);
	}
}