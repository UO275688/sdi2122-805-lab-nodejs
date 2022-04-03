const {ObjectId} = require("mongodb");

module.exports = function (app, songsRepository) {
    /*app.get("/songs", function (req, res) {
        let response = "";
        if (req.query.title != null && typeof (req.query.title) != "undefined")
            response = 'Titulo: ' + req.query.title + '<br>'
        if (req.query.author != null && typeof (req.query.author) != "undefined")
            response += 'Autor: ' + req.query.author;

        res.send(response);
    });*/

    app.get("/songs", function (req, res) {
        let songs = [{
            "tile": "Blank space",
            "price": "1.2"
        }, {
            "tile": "See you again",
            "price": "1.3"
        }, {
            "tile": "Uptown Funk",
            "price": "1.1"
        }]

        let response = {
            seller: 'Tienda de canciones',
            songs: songs
        };

        res.render("shop.twig", response);
    });

    app.get('/add', function (req, res) {
        let response = parseInt(req.query.num1) + parseInt(req.query.num2);

        res.send(String(response));
    });

    app.get('/songs/add', function (req, res) {
        if (req.session.user == null) {
            res.redirect("/shop");
            return;
        }
        res.render("songs/add.twig");
    });

    app.get('/songs/:id', function (req, res) {
        let response = 'id: ' + req.params.id;
        res.send(response);
    });

    app.get('/songs/:kind/:id', function (req, res) {
        let response = 'id: ' + req.params.id + '<br>'
            + 'Tipo de música: ' + req.params.kind;
        res.send(response);
    });

    app.get('/promo*', function (req, res) {
        res.send('Respuesta al patrón promo*');
    });

    app.get('/pro*ar', function (req, res) {
        res.send('Respuesta al patrón pro*ar');
    });

    app.get('/shop', function (req, res) {
        let filter = {};
        let options = {sort: {title: 1}};

        if (req.query.search != null && typeof (req.query.search) != "undefined" && req.query.search != "") {
            filter = {"title": {$regex: ".*" + req.query.search + ".*"}};
        }

        songsRepository.getSongs(filter, options).then(songs => {
            res.render("shop.twig", {songs: songs});
        }).catch(error => {
            res.send("Se ha producido un error al listar las canciones " + error)
        });
    })

    app.get('/songs/:id', function (req, res) {
        //let filter = {_id: req.params.id};
        let filter = {_id: ObjectId(req.params.id)};
        let options = {};
        songsRepository.findSong(filter, options).then(song => {
            res.render("songs/song.twig", {song: song});
        }).catch(error => {
            res.send("Se ha producido un error al buscar la canción " + error)
        });
    })

    app.post('/songs/add', function (req, res) {
        if (req.session.user == null) {
            res.redirect("/shop");
            return;
        }

        let song = {
            title: req.body.title,
            kind: req.body.kind,
            price: req.body.price,
            author: req.session.user
        }
        songsRepository.insertSong(song, function (songId) {
            if (songId == null) {
                res.send("Error al insertar canción");
            } else {
                if (req.files != null) {
                    let imagen = req.files.cover;
                    imagen.mv(app.get("uploadPath") + '/public/covers/' + songId + '.png', function (err) {
                        if (err) {
                            res.send("Error al subir la portada de la canción")
                        } else {
                            if (req.files.audio != null) {
                                let audio = req.files.audio;
                                audio.mv(app.get("uploadPath") + '/public/audios/' + songId + '.mp3', function (err) {
                                    if (err) {
                                        res.send("Error al subir el audio");
                                    } else {
                                        res.send("Agregada la canción ID: " + songId);
                                    }
                                });
                            }
                        }
                    })
                } else {
                    res.send("Agregada la canción ID: " + songId)
                }
            }
        });

        /*
        MongoClient.connect(app.get('connectionStrings'), function (err, dbClient) {
            if (err) {
                res.send("Error de conexión: " + err);
            } else {
                const database = dbClient.db("musicStore");
                const collectionName = 'songs';
                const songsCollection = database.collection(collectionName);
                songsCollection.insertOne(song)
                    .then(result => res.send("canción añadida id: " + result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => res.send("Error al insertar " + err));
            }
        });
        */
    });
};