var config = {};
var templates = {};


// var conn = new WebSocket('ws://localhost:9090/siteconfig');
// conn.onopen = function(e) {
//     console.log("Connection established!");
// };

// conn.onmessage = function(e) {

// };

$(document).ready(function() {
	compileTemplates(templates);
	loadSiteConfig(config, [showHeader]);
});;

function compileTemplates(templates) {
	templates = templates || {};

	//Header
	templates.header = Handlebars.compile($('#header-template').html());
}


function loadSiteConfig(config, observers) {
	var conn = new WebSocket('ws://localhost:9090/siteconfig');

	conn.onopen = function(e) {
    	console.log("Connection established!");
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