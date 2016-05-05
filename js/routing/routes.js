Path.map("#/comic/:id").to(function(){
    openComic(this.params['id']);
});

Path.map("#/").to(openHome);

Path.map("#/posts").to(function(){
    alert("Posts!");
});

Path.map("*").to(function() {
    console.log("not found");
});

Path.root("#/");

$(document).ready(function () {
    Path.listen();
});