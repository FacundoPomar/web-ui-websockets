var helpers = {
    price_helper: function (input) {
        var aux = input.split('.');
        aux[1] = aux[1].slice(0, 2);
        return '$' + aux.join('.');
    },

    break_maker: function (input) {
        return new Handlebars.SafeString(input.replace(new RegExp('\r', 'g'), "<br/>").replace(new RegExp('\n', 'g'), "<br/>"));
    },

    make_link: function (item) {
        return new Handlebars.SafeString(
                '<li><a href="' + item.url + '" title="' + item.title + '" class="' + item.class + '">'
                    + item.caption
                + '</a></li>'
            );
    },

}

for (var i in helpers) {
  Handlebars.registerHelper(i, helpers[i]);
}