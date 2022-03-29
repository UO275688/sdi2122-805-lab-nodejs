module.exports = function (app) {
    app.get("/authors", function (req, res) {
        let response = "";
        if (req.query.name != null && typeof (req.query.name) != "undefined")
            response = 'Name: ' + req.query.name + '<br>'
        else
            response += 'Name: no enviado en la petición' + '<br>'

        if (req.query.group != null && typeof (req.query.group) != "undefined")
            response += 'Group: ' + req.query.group + '<br>'
        else
            response += 'Grupo: no enviado en la petición' + '<br>'

        if (req.query.rol != null && typeof (req.query.rol) != "undefined")
            response += 'rol: ' + req.query.rol;
        else
            response += 'Rol: no enviado en la petición';

        res.send(response);
    });

    app.get("/authors", function (req, res) {
        let authors = [{
            "name": "John",
            "group": "Bon Jovi",
            "rol": "bajista"
        }, {
            "name": "Kurt",
            "group": "Nirvana",
            "rol": "guitarrista"
        }, {
            "name": "Beyoncé",
            "group": "Destiny´s Child",
            "rol": "cantante"
        }]

        let response = {
            seller: 'Lista de autores',
            authors: authors
        };

        res.render("authors/authors.twig", response);
    });

    app.get('/authors/add', function (req, res) {
        res.render("authors/add.twig");
    });

    app.get("/authors*", function(req, res) {
        res.redirect("/authors/");
    });

    app.post('/authors/add', function (req, res) {
        let response = 'Autor agregado: ' + req.params.name + '<br>'
            + ' grupo: ' + req.params.group + '<br>'
            + ' rol: ' + req.params.rol;

        res.send(response);
    });
};