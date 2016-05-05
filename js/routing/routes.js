Path.map("#/comic/:id").to(function(){
    openComic(this.params['id']);
});

Path.map("#/").to(openHome);

Path.map("#/login").to(openLogin);
Path.map("#/logout").to(logOut);

Path.map("#/sitemap").to(openSitemap);

Path.map("#/posts").to(function(){
    alert("Posts!");
});

Path.rescue(openNotFound);

Path.root("#/");

$(document).ready(function () {
    Path.listen();
});