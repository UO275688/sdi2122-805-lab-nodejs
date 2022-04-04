const {ObjectId} = require("mongodb");

module.exports = function (app, commentsRepository) {
    app.post("/comments/:song_id", function (req,res){

        let comments = {
            author : req.session.user,
            text : req.body.text,
            song_id : ObjectId(req.params.song_id)
        }

        if (id == null) {
            res.send("Se ha producido un error al insertar comentario");
        } else {
            res.send('Comentario Insertado ' + id);
        }
    });
}