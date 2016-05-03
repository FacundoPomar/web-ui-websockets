var conn = new WebSocket('ws://localhost:9090/chat');
conn.onopen = function(e) {
    console.log("Connection established!");
};

conn.onmessage = function(e) {
    var data;
	try {
		data = JSON.parse(e.data);
		console.log(data);
	} catch (err) {
		data.data = err;
	}
    $(".lala").html(data.data);
};

$("#send").on("click", function () {
	conn.send($('#mensajero').val());
});

// $(document).ready(function() {
	// var source   = $("#entry-template").html();
	// var template = Handlebars.compile(source);
	// var context = {title: "My New Post", body: "This is my first post!"};
	// var html    = template(context);
	// $(".lala").html(html);
// });;