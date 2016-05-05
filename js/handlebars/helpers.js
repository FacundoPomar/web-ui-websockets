var helpers = {
    price_helper: function (input) {
        var aux = input.split('.');
        aux[1] = aux[1].slice(0, 2);
        return '$' + aux.join('.');
    }
}

for (var i in helpers) {
  Handlebars.registerHelper(i, helpers[i]);
}